import Link from 'next/link'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import Eyebrow from '@/components/Eyebrow'
import Reveal from '@/components/Reveal'
import StatCounter from '@/components/StatCounter'
import { getContent } from '@/lib/content'

export const metadata = {
  title: 'About the Firm — Abashidze & Partners',
  description: 'Founded in 2013, Abashidze & Partners is one of Tbilisi\'s leading business law practices. Learn about our team, values, and history.',
}

export default async function AboutPage() {
  const c = await getContent()

  const stats = [
    { value: Number(c.about_stats.s1_value), unit: c.about_stats.s1_unit, label: c.about_stats.s1_label },
    { value: Number(c.about_stats.s2_value), unit: c.about_stats.s2_unit, label: c.about_stats.s2_label },
    { value: Number(c.about_stats.s3_value), unit: c.about_stats.s3_unit, label: c.about_stats.s3_label },
    { value: Number(c.about_stats.s4_value), unit: c.about_stats.s4_unit, label: c.about_stats.s4_label },
  ]

  const values = [
    { title: c.about_values.v1_title, body: c.about_values.v1_body },
    { title: c.about_values.v2_title, body: c.about_values.v2_body },
    { title: c.about_values.v3_title, body: c.about_values.v3_body },
  ]

  const team = [
    { name: c.about_team.m1_name, role: c.about_team.m1_role, bio: c.about_team.m1_bio, image: 'https://picsum.photos/seed/team1/400/530' },
    { name: c.about_team.m2_name, role: c.about_team.m2_role, bio: c.about_team.m2_bio, image: 'https://picsum.photos/seed/team2/400/530' },
    { name: c.about_team.m3_name, role: c.about_team.m3_role, bio: c.about_team.m3_bio, image: 'https://picsum.photos/seed/team3/400/530' },
  ]

  const timeline = [
    { year: c.about_timeline.t1_year, title: c.about_timeline.t1_title, body: c.about_timeline.t1_body },
    { year: c.about_timeline.t2_year, title: c.about_timeline.t2_title, body: c.about_timeline.t2_body },
    { year: c.about_timeline.t3_year, title: c.about_timeline.t3_title, body: c.about_timeline.t3_body },
    { year: c.about_timeline.t4_year, title: c.about_timeline.t4_title, body: c.about_timeline.t4_body },
    { year: c.about_timeline.t5_year, title: c.about_timeline.t5_title, body: c.about_timeline.t5_body },
  ]

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
              <Eyebrow>{c.about_story.eyebrow}</Eyebrow>
              <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginBlock: '16px 20px' }}>
                {c.about_story.heading}
              </h2>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: 18 }}>{c.about_story.body_1}</p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: 18 }}>{c.about_story.body_2}</p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75 }}>{c.about_story.body_3}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="img-wrap img-4-5">
                <Image src={c.about_story.image || 'https://picsum.photos/seed/story1/600/750'} alt="Abashidze & Partners office" width={600} height={750} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-sm" style={{ background: 'var(--cream-2)' }}>
        <div className="wrap">
          <Reveal style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow>{c.about_values.eyebrow}</Eyebrow>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 300, marginTop: 12 }}>{c.about_values.heading}</h2>
          </Reveal>
          <div className="values-grid">
            {values.map((v, i) => (
              <Reveal key={i} delay={i * 0.08}>
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
            <Eyebrow>{c.about_team.eyebrow}</Eyebrow>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginTop: 12 }}>{c.about_team.heading}</h2>
          </Reveal>
          <div className="team-grid">
            {team.map((m, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Image src={m.image} alt={m.name} width={400} height={530} className="member-photo" />
                <div className="member-name">{m.name}</div>
                <div className="member-role">{m.role}</div>
                <p className="member-bio">{m.bio}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section-dark">
        <div className="wrap">
          <Reveal style={{ marginBottom: 48 }}>
            <Eyebrow>{c.about_timeline.eyebrow}</Eyebrow>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 300, marginTop: 12, color: 'var(--cream)' }}>
              {c.about_timeline.heading}
            </h2>
          </Reveal>
          <div className="timeline">
            {timeline.map((row, i) => (
              <Reveal key={i} delay={i * 0.06}>
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
            <h2>{c.about_cta.heading}</h2>
            <p>{c.about_cta.body}</p>
            <Link href="/contact" className="btn btn-dark-gold">
              {c.about_cta.cta} <span className="arr" aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
