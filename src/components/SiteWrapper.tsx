'use client'

import { usePathname } from 'next/navigation'

export default function SiteWrapper({
  children,
  header,
  footer,
}: {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
}) {
  const path = usePathname()
  if (path.startsWith('/admin')) return <>{children}</>
  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  )
}
