'use client'

import { useState } from 'react'

type FaqItem = { question: string; answer: string }

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <dl className="faq-accordion">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const answerId = `faq-answer-${i}-${item.question.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`
        return (
          <div key={i} className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
            <dt>
              <button
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span>{item.question}</span>
                <span className="faq-icon" aria-hidden>{isOpen ? '−' : '+'}</span>
              </button>
            </dt>
            <dd id={answerId} hidden={!isOpen}>
              {item.answer}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
