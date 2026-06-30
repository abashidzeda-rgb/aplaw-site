'use server'

import { put } from '@vercel/blob'
import { isAdmin } from './auth'

export async function uploadImageAction(formData: FormData): Promise<string> {
  if (!(await isAdmin())) throw new Error('Unauthorized')
  const file = formData.get('file') as File
  if (!file || !file.size) throw new Error('No file')
  const ext = file.name.split('.').pop() ?? 'jpg'
  const pathname = `author-photos/${Date.now()}.${ext}`
  const { url } = await put(pathname, file, { access: 'public' })
  return url
}
