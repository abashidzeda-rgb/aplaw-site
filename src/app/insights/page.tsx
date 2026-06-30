import Link from 'next/link'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import BlogFilter from '@/components/BlogFilter'
import NewsletterForm from '@/components/NewsletterForm'
import { articles } from '@/lib/articles'
import { getContent } from '@/lib/content'

export const metadata = {
  title: 'Insights — Abashidze & Partners',
  description: 'Practical legal insights on Georgian business law — corporate, M&A, employment, real estate, tax, and regulatory matters.',
}

export default async function InsightsPage() {
  const c = await getContent()
  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <>
      <PageHero
        eyebrow={c.insights_hero.eyebrow}
        title={c.insights_hero.title}
        lede={c.insights_hero.lede}
        breadcrumb={{ label: 'Home', href: '/' }}
      />

      <section className="section">
        <div className="wrap">

          {/* Featured */}
          <Reveal>
            <Link href={`/insights/${featured.id}`} className="featured-card">
              <Image src={featured.image} alt={featured.title} width={600} height={600} className="fi" />
              <div className="fc-body">
                <div className="card-meta">
                  <span className="card-tag">{featured.category}</span>
                  <span>{featured.readTime}</span>
                  <span>{featured.date}</span>
                </div>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <span className="read-link">Read article →</span>
              </div>
            </Link>
          </Reveal>

          {/* Filter + grid */}
          <Reveal>
            <BlogFilter posts={rest} />
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-band">
        <div className="wrap">
          <Reveal>
            <h2>Stay informed</h2>
            <p>Legal updates on Georgian business law, delivered to your inbox — no more than twice a month.</p>
            <NewsletterForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
