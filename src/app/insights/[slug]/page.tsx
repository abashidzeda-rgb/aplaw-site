import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Eyebrow from '@/components/Eyebrow'
import ReadingProgress from '@/components/ReadingProgress'
import { getArticleById, getRelatedArticles } from '@/lib/articles'
import { getContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = await getContent()
  const article = getArticleById(c.articles ?? [], slug)
  if (!article) return {}
  return {
    title: `${article.title} — Abashidze & Partners`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = await getContent()
  const article = getArticleById(c.articles ?? [], slug)
  if (!article) notFound()

  const related = getRelatedArticles(c.articles ?? [], article.id, 3)

  return (
    <>
      <ReadingProgress />

      {/* Article header */}
      <header className="article-header">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden>›</span>
            <Link href="/insights">Insights</Link>
            <span aria-hidden>›</span>
            <span>{article.category}</span>
          </nav>
          <Eyebrow>{article.category}</Eyebrow>
          <h1 style={{ fontSize: 'clamp(34px,5.2vw,66px)', fontWeight: 300, letterSpacing: '-0.025em', marginBlock: '16px 24px', maxWidth: 760 }}>
            {article.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <Image
              src={article.authorImage}
              alt={article.author}
              width={44}
              height={44}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{article.author}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{article.authorRole} · {article.date} · {article.readTime}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Cover image */}
      <div className="article-cover-wrap">
        <Image
          src={article.image}
          alt={article.title}
          width={1100}
          height={471}
          className="article-cover"
          priority
        />
      </div>

      {/* Body */}
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      {/* Share row */}
      <div className="prose">
        <div className="article-share">
          <span>Share</span>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Twitter</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://aplaw.ge/insights/${article.id}`)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>LinkedIn</a>
        </div>
      </div>

      {/* Author card */}
      <div className="author-card">
        <Image src={article.authorImage} alt={article.author} width={60} height={60} className="author-avatar" />
        <div>
          <div className="author-name">{article.author}</div>
          <div className="author-role">{article.authorRole}</div>
          <p className="author-bio">
            A member of the Abashidze &amp; Partners team, advising clients on {article.category.toLowerCase()} matters in Georgia.
          </p>
        </div>
      </div>

      {/* Related articles */}
      <section className="section-sm">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 300 }}>Related insights</h2>
            <Link href="/insights" className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: 13 }}>All articles →</Link>
          </div>
          <div className="related-grid">
            {related.map(rel => (
              <Link key={rel.id} href={`/insights/${rel.id}`} className="post-card">
                <Image src={rel.image} alt={rel.title} width={400} height={250} className="pi" />
                <div className="pc-body">
                  <div className="card-meta">
                    <span className="card-tag">{rel.category}</span>
                    <span>{rel.readTime}</span>
                  </div>
                  <h3>{rel.title}</h3>
                  <span className="read-link">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="wrap">
          <h2>Have a question about this topic?</h2>
          <p>Our team is happy to discuss how this area of law applies to your specific situation.</p>
          <Link href="/contact" className="btn btn-dark-gold">
            Contact us <span className="arr" aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
