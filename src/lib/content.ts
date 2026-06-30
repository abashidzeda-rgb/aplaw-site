import { unstable_noStore as noStore } from 'next/cache'
import { defaultContent, type SiteContent } from '@/content/defaults'

const BLOB_PATHNAME = 'aplaw_content_v2.json'
let memCache: SiteContent | null = null

function blobAvailable() {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

export async function getContent(): Promise<SiteContent> {
  noStore()
  if (blobAvailable()) {
    try {
      const { list, get } = await import('@vercel/blob')
      const { blobs } = await list({ prefix: BLOB_PATHNAME })
      if (blobs.length > 0) {
        const result = await get(blobs[0].url, { access: 'private' })
        if (result && result.statusCode === 200) {
          const text = await new Response(result.stream).text()
          const stored = JSON.parse(text) as SiteContent
          return { ...defaultContent, ...stored }
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
    })
  }
}

export function kvAvailable() {
  return blobAvailable()
}
