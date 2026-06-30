import { defaultContent, type SiteContent } from '@/content/defaults'

const KV_KEY = 'aplaw_content'

// Module-level fallback (works within a single serverless instance / dev)
let memCache: SiteContent | null = null

function kvAvailable() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

export async function getContent(): Promise<SiteContent> {
  if (kvAvailable()) {
    try {
      const { kv } = await import('@vercel/kv')
      const stored = await kv.get<SiteContent>(KV_KEY)
      if (stored) return stored
    } catch (e) {
      console.error('[content] KV read failed:', e)
    }
  }
  return memCache ?? defaultContent
}

export async function setContent(content: SiteContent): Promise<void> {
  if (kvAvailable()) {
    const { kv } = await import('@vercel/kv')
    await kv.set(KV_KEY, content)
  }
  memCache = content
}

export { kvAvailable }
