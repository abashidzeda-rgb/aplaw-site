import { unstable_noStore as noStore } from 'next/cache'
import { defaultContent, type SiteContent } from '@/content/defaults'

const BLOB_PATHNAME = 'aplaw_content_v2.json'
let memCache: SiteContent | null = null
// URL of the last successfully written blob — skips the list() call on next read
let knownBlobUrl: string | null = null

function blobAvailable() {
  return !!process.env.CONTENT_BLOB_RW_TOKEN
}

function contentToken() {
  return process.env.CONTENT_BLOB_RW_TOKEN
}

function mergeWithDefaults(stored: SiteContent): SiteContent {
  const merged: SiteContent = { ...defaultContent }
  for (const key of Object.keys(stored) as (keyof SiteContent)[]) {
    const def = defaultContent[key]
    const val = stored[key]
    if (val && typeof val === 'object' && !Array.isArray(val) && def && typeof def === 'object') {
      (merged as Record<string, unknown>)[key] = { ...def as object, ...val as object }
    } else {
      (merged as Record<string, unknown>)[key] = val
    }
  }
  return merged
}

export async function getContent(): Promise<SiteContent> {
  noStore()
  // Fast path: same serverless instance already has the latest content
  if (memCache) return memCache

  if (blobAvailable()) {
    try {
      const { list, get } = await import('@vercel/blob')

      // Use URL from last write when available; otherwise discover via list
      let url = knownBlobUrl
      if (!url) {
        const { blobs } = await list({ prefix: BLOB_PATHNAME, token: contentToken() })
        if (blobs.length > 0) {
          // Sort newest-first in case multiple blobs accumulated for this prefix
          const sorted = [...blobs].sort(
            (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          )
          url = sorted[0].url
          knownBlobUrl = url
        }
      }

      if (url) {
        const result = await get(url, { access: 'private', token: contentToken() })
        if (result && result.statusCode === 200) {
          const text = await new Response(result.stream).text()
          const stored = JSON.parse(text) as SiteContent
          memCache = mergeWithDefaults(stored)
          return memCache
        }
      }
    } catch (e) {
      console.error('[content] Blob read failed:', e)
    }
  }
  return defaultContent
}

export async function setContent(content: SiteContent): Promise<void> {
  // Update in-process cache immediately so the next read on this instance is instant
  memCache = content
  if (blobAvailable()) {
    const { put } = await import('@vercel/blob')
    const { url } = await put(BLOB_PATHNAME, JSON.stringify(content), {
      access: 'private',
      contentType: 'application/json',
      allowOverwrite: true,
      token: contentToken(),
    })
    knownBlobUrl = url
  }
}

export function kvAvailable() {
  return blobAvailable()
}
