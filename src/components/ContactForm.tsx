'use client'

import { useState } from 'react'

type Props = { compact?: boolean }

export default function ContactForm({ compact }: Props) {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="form-success">
        <div className="check">✓</div>
        <h3>Message received</h3>
        <p>We'll be in touch within one business day.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="cf-name">Full Name</label>
          <input id="cf-name" type="text" placeholder="Your name" required />
        </div>
        <div className="form-field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" type="email" placeholder="your@email.com" required />
        </div>
      </div>
      {!compact && (
        <div className="form-field">
          <label htmlFor="cf-phone">Phone</label>
          <input id="cf-phone" type="tel" placeholder="+995 ..." />
        </div>
      )}
      <div className="form-field">
        <label htmlFor="cf-topic">Topic</label>
        <select id="cf-topic">
          <option value="">Select a practice area</option>
          <option>Corporate Law</option>
          <option>M&amp;A / Transactions</option>
          <option>Commercial Contracts</option>
          <option>Dispute Resolution</option>
          <option>Employment Law</option>
          <option>Real Estate</option>
          <option>Other</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" rows={compact ? 4 : 6} placeholder="Briefly describe your matter…" required />
      </div>
      <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
        Send Message <span className="arr" aria-hidden>→</span>
      </button>
    </form>
  )
}
