import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import ContactForm from '@/components/ContactForm'
import { getContent } from '@/lib/content'

export const metadata = {
  title: 'Contact — Abashidze & Partners',
  description: 'Get in touch with Abashidze & Partners. Book a consultation or send us a message about your legal matter.',
}

export default async function ContactPage() {
  const c = await getContent()
  return (
    <>
      <PageHero
        eyebrow={c.contact_hero.eyebrow}
        title={c.contact_hero.title}
        lede={c.contact_hero.lede}
        breadcrumb={{ label: 'Home', href: '/' }}
      />

      <section className="section">
        <div className="wrap">
          <div className="contact-grid">

            {/* Form */}
            <Reveal>
              <div className="cta-form-card">
                <Eyebrow>{c.contact_page.form_heading}</Eyebrow>
                <h2 style={{ fontSize: 'clamp(22px,2.8vw,34px)', fontWeight: 300, marginBlock: '16px 28px' }}>
                  {c.contact_page.form_subheading}
                </h2>
                <ContactForm />
              </div>
            </Reveal>

            {/* Info */}
            <Reveal delay={0.1}>
              <div>
                {/* Map */}
                <iframe
                  className="map-embed"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2977.5!2d44.7833!3d41.7151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDQyJzU0LjMiTiA0NMKwNDYnNTkuOSJF!5e0!3m2!1sen!2sge!4v1000000000000!5m2!1sen!2sge"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Abashidze & Partners office location"
                />

                <div className="contact-info-row">
                  <span className="cir-label">Address</span>
                  <div className="cir-value">
                    {c.contact.address_1}<br />{c.contact.address_2}
                  </div>
                </div>
                <div className="contact-info-row">
                  <span className="cir-label">Phone</span>
                  <div className="cir-value">
                    <a href={`tel:${c.contact.phone.replace(/\s/g, '')}`}>{c.contact.phone}</a>
                  </div>
                </div>
                <div className="contact-info-row">
                  <span className="cir-label">Email</span>
                  <div className="cir-value">
                    <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
                  </div>
                </div>
                <div className="contact-info-row">
                  <span className="cir-label">Hours</span>
                  <div className="cir-value">
                    {c.contact.hours_days}<br />{c.contact.hours_time}
                  </div>
                </div>
                {(c.socials ?? []).filter(s => s.enabled).length > 0 && (
                <div className="contact-info-row">
                  <span className="cir-label">Follow</span>
                  <div className="cir-value">
                    {(c.socials ?? []).filter(s => s.enabled).map((s, i, arr) => (
                      <span key={s.platform}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">{s.platform}</a>
                        {i < arr.length - 1 && ' · '}
                      </span>
                    ))}
                  </div>
                </div>
                )}
              </div>
            </Reveal>

          </div>
        </div>
      </section>
    </>
  )
}
