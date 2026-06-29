import PageHero from '@/components/PageHero'

export const metadata = { title: 'Privacy Policy — Abashidze & Partners' }

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="section">
        <div className="wrap">
          <div className="prose" style={{ marginInline: 0 }}>
            <p>This privacy policy explains how Abashidze &amp; Partners collects and uses personal data. Full policy coming soon.</p>
          </div>
        </div>
      </section>
    </>
  )
}
