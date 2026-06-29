import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact — Abashidze & Partners',
  description: 'Get in touch with Abashidze & Partners. Book a consultation or send us a message about your legal matter.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your matter"
        lede="We offer a free initial consultation to understand your situation. Use the form or reach us directly."
        breadcrumb={{ label: 'Home', href: '/' }}
      />

      <section className="section">
        <div className="wrap">
          <div className="contact-grid">

            {/* Form */}
            <Reveal>
              <div className="cta-form-card">
                <Eyebrow>Send a message</Eyebrow>
                <h2 style={{ fontSize: 'clamp(22px,2.8vw,34px)', fontWeight: 300, marginBlock: '16px 28px' }}>
                  Tell us about your matter
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
                    4 Chavchavadze Ave, Floor 3<br />
                    Tbilisi 0179, Georgia
                  </div>
                </div>
                <div className="contact-info-row">
                  <span className="cir-label">Phone</span>
                  <div className="cir-value">
                    <a href="tel:+995322000000">+995 32 200 00 00</a>
                  </div>
                </div>
                <div className="contact-info-row">
                  <span className="cir-label">Email</span>
                  <div className="cir-value">
                    <a href="mailto:info@aplaw.ge">info@aplaw.ge</a>
                  </div>
                </div>
                <div className="contact-info-row">
                  <span className="cir-label">Hours</span>
                  <div className="cir-value">
                    Monday – Friday<br />
                    9:00 – 18:00 (GET)
                  </div>
                </div>
                <div className="contact-info-row">
                  <span className="cir-label">Follow</span>
                  <div className="cir-value">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>{' · '}
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>
    </>
  )
}
