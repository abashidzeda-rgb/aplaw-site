'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [done, setDone] = useState(false)

  if (done) {
    return <p style={{ color: 'var(--gold-bright)', fontWeight: 600 }}>You're subscribed. Thank you!</p>
  }

  return (
    <form className="newsletter-form" onSubmit={e => { e.preventDefault(); setDone(true) }}>
      <input type="email" placeholder="your@email.com" aria-label="Email address" required />
      <button type="submit" className="btn btn-dark-gold" style={{ whiteSpace: 'nowrap' }}>
        Subscribe
      </button>
    </form>
  )
}
