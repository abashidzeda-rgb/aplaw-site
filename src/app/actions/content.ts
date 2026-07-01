'use server'

import { revalidatePath } from 'next/cache'
import { isAdmin } from './auth'
import { setContent } from '@/lib/content'
import type { SiteContent } from '@/content/defaults'

export async function saveContentAction(content: SiteContent) {
  if (!(await isAdmin())) throw new Error('Unauthorized')
  console.log('[save] dark_mode_enabled =', content.global?.dark_mode_enabled)
  await setContent(content)
  revalidatePath('/', 'layout')
}
