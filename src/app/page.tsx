import Link from 'next/link'
import Image from 'next/image'
import Eyebrow from '@/components/Eyebrow'
import Reveal from '@/components/Reveal'
import StatCounter from '@/components/StatCounter'
import ContactForm from '@/components/ContactForm'
import { services } from '@/lib/services'
import { getContent } from '@/lib/content'

export default async function Home() {
  const c = await getContent()
  const previewArticles = (c.articles ?? []).slice(0, 4)

  const stats = [
    { value: Number(c.home_stats.s1_value), unit: c.home_stats.s1_unit, label: c.home_stats.s1_label },
    { value: Number(c.home_stats.s2_value), unit: c.home_stats.s2_unit, label: c.home_stats.s2_label },
    { value: Number(c.home_stats.s3_value), unit: c.home_stats.s3_unit, label: c.home_stats.s3_label },
    { value: Number(c.home_stats.s4_value), unit: c.home_stats.s4_unit, label: c.home_stats.s4_label },
  ]

  const approachSteps = [
    { n: c.home_approach.s1_n, title: c.home_approach.s1_title, body: c.home_approach.s1_body },
    { n: c.home_approach.s2_n, title: c.home_approach.s2_title, body: c.home_approach.s2_body },
    { n: c.home_approach.s3_n, title: c.home_approach.s3_title, body: c.home_approach.s3_body },
    { n: c.home_approach.s4_n, title: c.home_approach.s4_title, body: c.home_approach.s4_body },
  ]

  const aboutPoints = [
    { title: c.home_about.p1_title, body: c.home_about.p1_body },
    { title: c.home_about.p2_title, body: c.home_about.p2_body },
    { title: c.home_about.p3_title, body: c.home_about.p3_body },
  ]

  // Render quote with italicised em word
  const quoteParts = c.home_quote.text.split(`{${c.home_quote.em}}`)

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" style={{ background: 'var(--cream)' }} aria-hidden />
        <div className="wrap hero-content">
          <Eyebrow>{c.home_hero.eyebrow}</Eyebrow>
          <h1>
            {c.home_hero.headline_1}<br />
            for <em>{c.home_hero.headline_em}</em><br />
            {c.home_hero.headline_3}
          </h1>
          <p className="lede" style={{ color: 'var(--ink-soft)', maxWidth: 520 }}>
            {c.home_hero.lede}
          </p>
          <div className="hero-btns">
            <Link href="/services" className="btn btn-gold">
              {c.home_hero.cta_primary} <span className="arr" aria-hidden>→</span>
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              {c.home_hero.cta_secondary}
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
              <Eyebrow>{c.home_about.eyebrow}</Eyebrow>
              <h2 className="section-title" style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 300, marginBlock: '16px 20px' }}>
                {c.home_about.headline.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </h2>
              <p style={{ color: 'var(--ink-soft)', fontSize: 17, lineHeight: 1.7, marginBottom: 8 }}>
                {c.home_about.body}
              </p>
              <div className="about-points">
                {aboutPoints.map((pt, i) => (
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
                {c.home_about.cta} <span className="arr" aria-hidden>→</span>
              </Link>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="img-wrap img-4-5">
                <Image
                  src="https://picsum.photos/seed/office1/600/750"
                  alt="Abashidze & Partners office"
                  width={600} height={750}
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
            <Eyebrow>{c.home_services.eyebrow}</Eyebrow>
            <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, marginTop: 12 }}>
              {c.home_services.heading}
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
                  width={600} height={750}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Eyebrow>{c.home_approach.eyebrow}</Eyebrow>
              <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginBlock: '16px 32px', color: 'var(--cream)' }}>
                {c.home_approach.heading}
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

      {/* ── Quote band ── */}
      <section className="section-dark mission-band">
        <div className="mission-bg" style={{ background: 'linear-gradient(135deg, #4a3428 0%, #2a1a14 100%)' }} aria-hidden />
        <div className="wrap">
          <Reveal>
            <blockquote className="mission-quote">
              "{quoteParts[0]}<em>{c.home_quote.em}</em>{quoteParts[1]}"
            </blockquote>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 24, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              — {c.home_quote.attribution}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Insights preview ── */}
      <section className="section">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Eyebrow>{c.home_insights.eyebrow}</Eyebrow>
              <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginTop: 12 }}>{c.home_insights.heading}</h2>
            </div>
            <Link href="/insights" className="btn btn-ghost">{c.home_insights.cta} →</Link>
          </div>
          {previewArticles.length > 0 && (
          <div className="insights-grid">
            <Reveal>
              <Link href={`/insights/${previewArticles[0].id}`} className="insight-card feature">
                <Image src={previewArticles[0].image} alt={previewArticles[0].title} width={700} height={394} className="ci-img" />
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
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="wrap">
          <div className="cta-grid">
            <Reveal>
              <Eyebrow>{c.home_cta.eyebrow}</Eyebrow>
              <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginBlock: '16px 16px' }}>
                {c.home_cta.heading}
              </h2>
              <p style={{ color: 'var(--ink-soft)', fontSize: 17, lineHeight: 1.7, maxWidth: 440 }}>
                {c.home_cta.body}
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn btn-gold">
                  {c.home_cta.cta_primary} <span className="arr" aria-hidden>→</span>
                </Link>
                <a href={`tel:${c.contact.phone.replace(/\s/g, '')}`} className="btn btn-ghost">
                  {c.home_cta.cta_secondary}
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="cta-form-card">
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 400, marginBottom: 24 }}>
                  {c.home_cta.form_heading}
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
