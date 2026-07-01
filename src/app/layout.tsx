import type { Metadata } from 'next'
import { Newsreader, Hanken_Grotesk } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SiteWrapper from '@/components/SiteWrapper'
import ThemeToggle from '@/components/ThemeToggle'
import { getContent } from '@/lib/content'

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent()
  const darkModeEnabled = content.global?.dark_mode_enabled ?? true
  return (
    <html lang="en" className={`${newsreader.variable} ${hankenGrotesk.variable}`}>
      <head>
        {darkModeEnabled && (
          <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()` }} />
        )}
      </head>
      <body>
        <SiteWrapper header={<Header />} footer={<Footer />}>
          {children}
        </SiteWrapper>
        {darkModeEnabled && (
          <div className="theme-toggle-fixed">
            <ThemeToggle />
          </div>
        )}
      </body>
    </html>
  )
}
