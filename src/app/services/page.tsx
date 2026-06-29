import Link from 'next/link'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import { services, industries } from '@/lib/services'

export const metadata = {
  title: 'Practice Areas — Abashidze & Partners',
  description: 'Six practice areas covering the full range of business legal needs in Georgia: corporate law, M&A, commercial contracts, disputes, employment, and real estate.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Practice Areas"
        title="Legal services built around your business"
        lede="Six practice areas covering every stage of your business in Georgia — from founding through growth, transactions, and beyond."
        breadcrumb={{ label: 'Home', href: '/' }}
      />

      {/* Service rows */}
      <section className="section-sm">
        <div className="wrap">
          {services.map((svc, i) => (
            <Reveal key={svc.id}>
              <div id={svc.id} className={`svc-row${i % 2 !== 0 ? ' alt' : ''}`}>
                <div className="svc-row-text">
                  <div className="svc-row-idx">{svc.index}</div>
                  <h2>{svc.title}</h2>
                  <p>{svc.description}</p>
                  <div className="sub-tags">
                    {svc.tags.map(tag => (
                      <span key={tag} className="sub-tag">{tag}</span>
                    ))}
                  </div>
                  <Link href="/contact" className="btn btn-ghost">
                    Discuss your matter <span className="arr" aria-hidden>→</span>
                  </Link>
                </div>
                <Image
                  src={svc.image}
                  alt={svc.title}
                  width={600}
                  height={450}
                  className="svc-row-img"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="section-sm" style={{ background: 'var(--cream-2)' }}>
        <div className="wrap">
          <Reveal style={{ marginBottom: 48, textAlign: 'center' }}>
            <Eyebrow>Sectors</Eyebrow>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginTop: 12 }}>
              Industries we serve
            </h2>
          </Reveal>
          <div className="industries-grid">
            {industries.map((name, i) => (
              <Reveal key={name} delay={(i % 4) * 0.07}>
                <div className="industry-cell">
                  <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                  <span className="name">{name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="wrap">
          <Reveal>
            <h2>Have a matter to discuss?</h2>
            <p>Tell us about your situation and we'll explain how we can help — in a free initial consultation.</p>
            <Link href="/contact" className="btn btn-dark-gold">
              Book a Consultation <span className="arr" aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
