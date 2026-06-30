'use client'

import { useEffect, useRef, useState } from 'react'

type Stat = { value: number; unit: string; label: string }

function Counter({ value, unit }: { value: number; unit: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function startCounting() {
      if (started.current) return
      started.current = true
      const duration = 1400
      const start = performance.now()
      const animate = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(eased * value))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }

    // Already in viewport on mount — start immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      startCounting()
      return
    }

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        startCounting()
        obs.disconnect()
      }
    }, { threshold: 0.3 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <span ref={ref} className="stat-num">
      {count}<span className="unit">{unit}</span>
    </span>
  )
}

export default function StatCounter({ stats }: { stats: Stat[] }) {
  return (
    <div className="stats-strip">
      {stats.map((s) => (
        <div key={s.label} className="stat-cell">
          <Counter value={s.value} unit={s.unit} />
          <p className="stat-label">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
