import PageHero from '@/components/PageHero'

export const metadata = { title: 'Terms of Use — Abashidze & Partners' }

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" />
      <section className="section">
        <div className="wrap">
          <div className="prose" style={{ marginInline: 0 }}>
            <p>These terms govern use of the Abashidze &amp; Partners website. Full terms coming soon.</p>
          </div>
        </div>
      </section>
    </>
  )
}
