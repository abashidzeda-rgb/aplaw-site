import Link from 'next/link'
import { getContent } from '@/lib/content'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import Eyebrow from '@/components/Eyebrow'
import Reveal from '@/components/Reveal'
import StatCounter from '@/components/StatCounter'

export const metadata = {
  title: 'About the Firm — Abashidze & Partners',
  description: 'Founded in 2013, Abashidze & Partners is one of Tbilisi\'s leading business law practices. Learn about our team, values, and history.',
}

const stats = [
  { value: 16, unit: '+', label: 'Years in practice' },
  { value: 600, unit: '+', label: 'Matters completed' },
  { value: 50, unit: '+', label: 'Corporate clients' },
  { value: 3, unit: '', label: 'Working languages' },
]

const values = [
  { title: 'Clarity', body: 'We believe legal advice should be clear and actionable. We translate complex law into practical guidance your business can act on.' },
  { title: 'Accountability', body: 'Partner-level involvement on every matter, from the first call to the final signature. You know who is responsible and how things are going.' },
  { title: 'Relationships', body: 'We build long-term relationships with our clients. Most of our work comes from clients who have worked with us before, and from their referrals.' },
]

const team = [
  { name: 'Giorgi Abashidze', role: 'Managing Partner', bio: 'Giorgi founded the firm in 2013 after a decade advising on corporate and M&A transactions at leading Georgian and international firms. He holds degrees from Tbilisi State University and the University of Vienna.', image: 'https://picsum.photos/seed/team1/400/530' },
  { name: 'Nino Kvaratskhelia', role: 'Senior Associate', bio: 'Nino leads our M&A and corporate practice, advising on cross-border transactions, joint ventures, and corporate governance matters. She trained in Tbilisi and Berlin and is admitted to practice in Georgia.', image: 'https://picsum.photos/seed/team2/400/530' },
  { name: 'Luka Beridze', role: 'Associate', bio: 'Luka advises on dispute resolution, employment, and regulatory matters. He represents clients in Georgian state courts and arbitration proceedings and regularly publishes on Georgian commercial law.', image: 'https://picsum.photos/seed/team3/400/530' },
]

const timeline = [
  { year: '2013', title: 'Founded', body: 'Giorgi Abashidze establishes the firm with a focus on corporate advisory and M&A.' },
  { year: '2016', title: 'Team expansion', body: 'The firm grows to five lawyers and opens its dedicated dispute resolution practice.' },
  { year: '2019', title: 'International recognition', body: 'First recognition in Chambers & Partners for Corporate/Commercial work in Georgia.' },
  { year: '2022', title: 'Real estate practice', body: 'Launch of dedicated real estate and infrastructure practice, reflecting growing client demand.' },
  { year: '2025', title: 'Today', body: 'A team of eight lawyers serving over 50 corporate clients across six practice areas.' },
]

export default async function AboutPage() {
  const c = await getContent()
  return (
    <>
      <PageHero
        eyebrow={c.about_hero.eyebrow}
        title={c.about_hero.title}
        lede={c.about_hero.lede}
        breadcrumb={{ label: 'Home', href: '/' }}
      />

      {/* Story */}
      <section className="section">
        <div className="wrap">
          <div className="split gap-wide" style={{ '--gap-wide': 'clamp(40px,8vw,130px)' } as React.CSSProperties}>
            <Reveal>
              <Eyebrow>Our story</Eyebrow>
              <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginBlock: '16px 20px' }}>
                Built on a simple idea
              </h2>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: 18 }}>
                Abashidze &amp; Partners was founded on the belief that business clients deserve
                legal advice that is direct, commercially aware, and delivered by people they
                can actually reach.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: 18 }}>
                When Giorgi Abashidze opened the firm in 2013, Tbilisi's legal market was
                dominated by large firms that often prioritised process over outcomes, and
                smaller outfits that lacked the depth for complex transactions. There was
                space for something different: a mid-sized firm with genuine expertise and
                an obsession with client service.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75 }}>
                Twelve years on, that is still who we are. Our clients range from early-stage
                companies registering their first Georgian entity to multinationals managing
                complex compliance programmes. What they have in common is that they value
                clear advice and a firm that treats their business like its own.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="img-wrap img-4-5">
                <Image
                  src="https://picsum.photos/seed/story1/600/750"
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

      {/* Values */}
      <section className="section-sm" style={{ background: 'var(--cream-2)' }}>
        <div className="wrap">
          <Reveal style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow>What we stand for</Eyebrow>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 300, marginTop: 12 }}>Our values</h2>
          </Reveal>
          <div className="values-grid">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="value-cell">
                  <h3>{v.title}</h3>
                  <p>{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatCounter stats={stats} />

      {/* Team */}
      <section className="section">
        <div className="wrap">
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <Eyebrow>Our people</Eyebrow>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginTop: 12 }}>Meet the team</h2>
          </Reveal>
          <div className="team-grid">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.1}>
                <Image src={m.image} alt={m.name} width={400} height={530} className="member-photo" />
                <div className="member-name">{m.name}</div>
                <div className="member-role">{m.role}</div>
                <p className="member-bio">{m.bio}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline (dark) */}
      <section className="section section-dark">
        <div className="wrap">
          <Reveal style={{ marginBottom: 48 }}>
            <Eyebrow>History</Eyebrow>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 300, marginTop: 12, color: 'var(--cream)' }}>
              Milestones
            </h2>
          </Reveal>
          <div className="timeline">
            {timeline.map((row, i) => (
              <Reveal key={row.year} delay={i * 0.06}>
                <div className="timeline-row">
                  <span className="timeline-year">{row.year}</span>
                  <div className="timeline-event">
                    <h3>{row.title}</h3>
                    <p>{row.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="wrap">
          <Reveal>
            <h2>Work with us</h2>
            <p>Whether you're a first-time entrant to the Georgian market or an established business facing a new challenge, we'd like to hear from you.</p>
            <Link href="/contact" className="btn btn-dark-gold">
              Get in touch <span className="arr" aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
