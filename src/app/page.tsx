import Link from 'next/link'
import Image from 'next/image'
import Eyebrow from '@/components/Eyebrow'
import Reveal from '@/components/Reveal'
import StatCounter from '@/components/StatCounter'
import ContactForm from '@/components/ContactForm'
import { articles } from '@/lib/articles'
import { services } from '@/lib/services'
import { getContent } from '@/lib/content'

const stats = [
  { value: 16, unit: '+', label: 'Years of practice' },
  { value: 600, unit: '+', label: 'Matters completed' },
  { value: 6, unit: '', label: 'Practice areas' },
  { value: 3, unit: '', label: 'Languages' },
]

const approachSteps = [
  { n: '01', title: 'Listen first', body: 'We take time to understand your business, your goals, and the specific constraints you face before advising on any course of action.' },
  { n: '02', title: 'Advise clearly', body: 'No unnecessary legalese. We provide direct, practical advice in plain language — with the legal reasoning available if you want it.' },
  { n: '03', title: 'Move decisively', body: 'Business moves fast. We respond to clients the same day and structure our work to meet commercial timelines, not legal ones.' },
  { n: '04', title: 'Stay accountable', body: 'We maintain close partner involvement on every matter. You always know who is responsible and how your matter is progressing.' },
]

export default async function Home() {
  const content = await getContent()
  const previewArticles = articles.slice(0, 4)

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{ background: 'var(--cream)' }}
          aria-hidden
        />
        <div className="wrap hero-content">
          <Eyebrow>{content.hero.eyebrow}</Eyebrow>
          <h1>
            {content.hero.headline_1}<br />
            for <em>{content.hero.headline_em}</em><br />
            {content.hero.headline_3}
          </h1>
          <p className="lede" style={{ color: 'var(--ink-soft)', maxWidth: 520 }}>
            {content.hero.lede}
          </p>
          <div className="hero-btns">
            <Link href="/services" className="btn btn-gold">
              {content.hero.cta_primary} <span className="arr" aria-hidden>→</span>
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              {content.hero.cta_secondary}
            </Link>
          </div>
        </div>
        <div className="scroll-hint" aria-hidden>Scroll</div>
      </section>

      {/* ── Stats ── */}
      <StatCounter stats={stats} />

      {/* ── About split ── */}
      <section className="section">
        <div className="wrap">
          <div className="split">
            <Reveal>
              <Eyebrow>{content.about_preview.eyebrow}</Eyebrow>
              <h2 className="section-title" style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 300, marginBlock: '16px 20px' }}>
                {content.about_preview.headline.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </h2>
              <p style={{ color: 'var(--ink-soft)', fontSize: 17, lineHeight: 1.7, marginBottom: 8 }}>
                {content.about_preview.body}
              </p>
              <div className="about-points">
                {[
                  { title: 'Independent & conflict-free', body: 'No bank or corporate parent. We work exclusively for our clients\' interests.' },
                  { title: 'Deep local knowledge', body: 'Our team has navigated Georgian law through multiple legislative cycles and regulatory shifts.' },
                  { title: 'International perspective', body: 'Educated and trained across Europe and the US; fluent in how international business expects to be served.' },
                ].map((pt, i) => (
                  <div key={i} className="about-point">
                    <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{pt.title}</strong>
                      <p>{pt.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn btn-ghost" style={{ marginTop: 36 }}>
                About the firm <span className="arr" aria-hidden>→</span>
              </Link>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="img-wrap img-4-5">
                <Image
                  src="https://picsum.photos/seed/office1/600/750"
                  alt="Abashidze & Partners office"
                  width={600}
                  height={750}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="section-sm" style={{ background: 'var(--cream-2)' }}>
        <div className="wrap">
          <Reveal style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow>Practice areas</Eyebrow>
            <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, marginTop: 12 }}>
              How we help
            </h2>
          </Reveal>
          <div className="svc-grid">
            {services.map((svc, i) => (
              <Link key={svc.id} href={`/services#${svc.id}`} className="svc">
                <span className="svc-idx">{svc.index}</span>
                <h3>{svc.title}</h3>
                <p>{svc.description.slice(0, 120)}…</p>
                <span className="learn">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approach (dark) ── */}
      <section className="section section-dark">
        <div className="wrap">
          <div className="split">
            <Reveal>
              <div className="img-wrap img-4-5">
                <Image
                  src="https://picsum.photos/seed/approach1/600/750"
                  alt="Our approach"
                  width={600}
                  height={750}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Eyebrow>Our approach</Eyebrow>
              <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginBlock: '16px 32px', color: 'var(--cream)' }}>
                How we work with clients
              </h2>
              <div className="approach-steps">
                {approachSteps.map(step => (
                  <div key={step.n} className="approach-step">
                    <span className="step-num">{step.n}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Mission band ── */}
      <section className="section-dark mission-band">
        <div
          className="mission-bg"
          style={{ background: 'linear-gradient(135deg, #4a3428 0%, #2a1a14 100%)' }}
          aria-hidden
        />
        <div className="wrap">
          <Reveal>
            <blockquote className="mission-quote">
              "The law should give you <em>clarity</em>, not confusion.
              We exist to make that true for every client we work with."
            </blockquote>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 24, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              — Giorgi Abashidze, Managing Partner
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Insights preview ── */}
      <section className="section">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Eyebrow>Insights</Eyebrow>
              <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginTop: 12 }}>Latest from the firm</h2>
            </div>
            <Link href="/insights" className="btn btn-ghost">All articles →</Link>
          </div>
          <div className="insights-grid">
            <Reveal>
              <Link href={`/insights/${previewArticles[0].id}`} className="insight-card feature">
                <Image
                  src={previewArticles[0].image}
                  alt={previewArticles[0].title}
                  width={700}
                  height={394}
                  className="ci-img"
                />
                <div className="ci-body">
                  <div className="card-meta">
                    <span className="card-tag">{previewArticles[0].category}</span>
                    <span>{previewArticles[0].readTime}</span>
                  </div>
                  <h3>{previewArticles[0].title}</h3>
                  <p>{previewArticles[0].excerpt}</p>
                  <span className="read-link">Read article →</span>
                </div>
              </Link>
            </Reveal>
            <div className="insights-side">
              {previewArticles.slice(1, 4).map((art, i) => (
                <Reveal key={art.id} delay={i * 0.08}>
                  <Link href={`/insights/${art.id}`} className="insight-card side">
                    <Image src={art.image} alt={art.title} width={400} height={250} className="ci-img" />
                    <div className="ci-body">
                      <div className="card-meta">
                        <span className="card-tag">{art.category}</span>
                        <span>{art.readTime}</span>
                      </div>
                      <h3>{art.title}</h3>
                      <span className="read-link">Read →</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="wrap">
          <div className="cta-grid">
            <Reveal>
              <Eyebrow>Get in touch</Eyebrow>
              <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginBlock: '16px 16px' }}>
                Ready to discuss your matter?
              </h2>
              <p style={{ color: 'var(--ink-soft)', fontSize: 17, lineHeight: 1.7, maxWidth: 440 }}>
                We offer an initial consultation to understand your situation and explain how
                we can help. No commitment required.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn btn-gold">
                  Book Consultation <span className="arr" aria-hidden>→</span>
                </Link>
                <a href="tel:+995322000000" className="btn btn-ghost">Call us</a>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="cta-form-card">
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 400, marginBottom: 24 }}>
                  Send a message
                </h3>
                <ContactForm compact />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
