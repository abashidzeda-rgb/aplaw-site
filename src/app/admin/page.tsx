import { isAdmin } from '@/app/actions/auth'
import { getContent, kvAvailable } from '@/lib/content'
import LoginForm from './LoginForm'
import AdminEditor from './AdminEditor'

export const metadata = { title: 'Admin — Abashidze & Partners' }
// Always render fresh — never cache this page
export const dynamic = 'force-dynamic'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  if (!(await isAdmin())) {
    return <LoginForm error={params.error === '1'} />
  }
  const content = await getContent()
  return <AdminEditor initialContent={content} kvReady={kvAvailable()} />
}
