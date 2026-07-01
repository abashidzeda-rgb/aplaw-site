'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact',  label: 'Contact' },
]

export default function Header({ darkModeEnabled = true }: { darkModeEnabled?: boolean }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`site-head${scrolled ? ' scrolled' : ''}`}>
        {/* Logo — ink shown in light mode, cream shown in dark mode */}
        <Link href="/" onClick={closeMenu} aria-label="Abashidze & Partners — Home">
          <Image className="logo-ink" src="/logo-ink.svg" alt="Abashidze & Partners" width={142} height={50} priority style={{ height: 56, width: 'auto' }} />
          <Image className="logo-cream" src="/logo-cream.svg" alt="Abashidze & Partners" width={142} height={50} priority style={{ height: 56, width: 'auto', display: 'none' }} />
        </Link>

        {/* Desktop nav — absolutely centered */}
        <nav className="site-nav" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + theme toggle */}
        <div className="head-cta-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {darkModeEnabled && <ThemeToggle />}
          <Link href="/contact" className="btn btn-gold">
            Book Consultation <span className="arr" aria-hidden>→</span>
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={`menu-btn${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile drawer */}
      <nav
        className={`mobile-nav${menuOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={closeMenu}
            aria-current={pathname === href ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
        <Link href="/contact" className="book-link" onClick={closeMenu}>
          Book Consultation →
        </Link>
      </nav>
    </>
  )
}
