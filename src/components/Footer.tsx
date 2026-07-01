import Link from 'next/link'
import Image from 'next/image'
import { getContent } from '@/lib/content'

const year = new Date().getFullYear()

export default async function Footer() {
  const content = await getContent()
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">

          {/* Brand + blurb */}
          <div className="foot-col">
            <Image
              src="/logo-cream.svg"
              alt="Abashidze & Partners"
              width={142}
              height={50}
              style={{ height: 52, width: 'auto', marginBottom: 20 }}
            />
            <p>{content.footer.tagline}</p>
          </div>

          {/* Address */}
          <div className="foot-col">
            <h4>Office</h4>
            <address>
              {content.contact.address_1}<br />
              {content.contact.address_2}
            </address>
            <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`} style={{ marginTop: 12 }}>
              {content.contact.phone}
            </a>
            <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
          </div>

          {/* Navigate */}
          <div className="foot-col">
            <h4>Navigate</h4>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/insights">Insights</Link>
            <Link href="/contact">Contact</Link>
          </div>

          {/* Connect */}
          <div className="foot-col">
            <h4>Connect</h4>
            {(content.socials ?? []).filter(s => s.enabled).map(s => (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer">{s.platform}</a>
            ))}
            <Link href="/contact">Book a Consultation</Link>
          </div>

        </div>

        <div className="foot-bar">
          <span>© {year} Abashidze &amp; Partners. All rights reserved.</span>
          <div className="foot-bar-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
