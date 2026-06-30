'use server'

import { createHmac } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE = 'admin_session'
const PW = process.env.ADMIN_PASSWORD ?? 'admin'

function token(pw: string) {
  return createHmac('sha256', PW).update(pw).digest('hex')
}

export async function loginAction(formData: FormData) {
  const pw = formData.get('password') as string
  if (pw !== PW) {
    redirect('/admin?error=1')
  }
  const jar = await cookies()
  jar.set(COOKIE, token(pw), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  redirect('/admin')
}

export async function logoutAction() {
  const jar = await cookies()
  jar.delete(COOKIE)
  redirect('/admin')
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies()
  const val = jar.get(COOKIE)?.value
  return val === token(PW)
}
