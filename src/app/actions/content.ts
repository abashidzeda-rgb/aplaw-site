'use server'

import { revalidatePath } from 'next/cache'
import { isAdmin } from './auth'
import { setContent } from '@/lib/content'
import type { SiteContent } from '@/content/defaults'

export async function saveContentAction(content: SiteContent) {
  if (!(await isAdmin())) throw new Error('Unauthorized')
  await setContent(content)
  revalidatePath('/', 'layout')
}
