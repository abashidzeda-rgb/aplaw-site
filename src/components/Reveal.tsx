'use client'

import { useEffect, useRef } from 'react'

type Props = {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export default function Reveal({ children, delay = 0, className = '', style }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If already visible in the viewport, show immediately with no transition
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 1.05) {
      el.style.transition = 'none'
      el.classList.add('visible')
      // Re-enable transition after first paint so future scroll-reveals animate
      requestAnimationFrame(() => { el.style.transition = '' })
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const combined: React.CSSProperties = delay
    ? { transitionDelay: `${delay}s`, ...style }
    : { ...style }

  return (
    <div ref={ref} data-reveal className={className} style={Object.keys(combined).length ? combined : undefined}>
      {children}
    </div>
  )
}
