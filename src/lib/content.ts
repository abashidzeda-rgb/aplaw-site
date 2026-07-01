import { unstable_noStore as noStore } from 'next/cache'
import { defaultContent, type SiteContent } from '@/content/defaults'

const BLOB_PATHNAME = 'aplaw_content_v2.json'
let memCache: SiteContent | null = null

// BLOB_READ_WRITE_TOKEN points to the public images store.
// CONTENT_BLOB_RW_TOKEN points to the private content store.
function blobAvailable() {
  return !!process.env.CONTENT_BLOB_RW_TOKEN
}

function contentToken() {
  return process.env.CONTENT_BLOB_RW_TOKEN
}

export async function getContent(): Promise<SiteContent> {
  noStore()
  if (blobAvailable()) {
    try {
      const { list, get } = await import('@vercel/blob')
      const { blobs } = await list({ prefix: BLOB_PATHNAME, token: contentToken() })
      if (blobs.length > 0) {
        const result = await get(blobs[0].url, { access: 'private', token: contentToken() })
        if (result && result.statusCode === 200) {
          const text = await new Response(result.stream).text()
          const stored = JSON.parse(text) as SiteContent
          // Deep-merge each top-level section so new fields added to defaults
          // are not silently dropped when an older stored snapshot exists.
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
      }
    } catch (e) {
      console.error('[content] Blob read failed:', e)
    }
  }
  return memCache ?? defaultContent
}

export async function setContent(content: SiteContent): Promise<void> {
  memCache = content
  if (blobAvailable()) {
    const { put } = await import('@vercel/blob')
    await put(BLOB_PATHNAME, JSON.stringify(content), {
      access: 'private',
      contentType: 'application/json',
      allowOverwrite: true,
      token: contentToken(),
    })
  }
}

export function kvAvailable() {
  return blobAvailable()
}
