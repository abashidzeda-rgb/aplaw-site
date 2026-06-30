import type { Metadata } from 'next'
import { Newsreader, Hanken_Grotesk } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SiteWrapper from '@/components/SiteWrapper'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Abashidze & Partners — Business Law Firm in Tbilisi',
  description:
    "Clear counsel for business in Georgia. Corporate law, M&A, dispute resolution, and more from Tbilisi's trusted business law firm.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${hankenGrotesk.variable}`}>
      <body>
        <SiteWrapper header={<Header />} footer={<Footer />}>
          {children}
        </SiteWrapper>
      </body>
    </html>
  )
}
