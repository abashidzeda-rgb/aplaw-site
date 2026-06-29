'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/articles'

const categories = ['All', 'Corporate', 'M&A', 'Commercial', 'Disputes', 'Employment', 'Real Estate', 'Tax', 'Regulatory']

export default function BlogFilter({ posts }: { posts: Article[] }) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? posts : posts.filter(p => p.category === active || p.tags.includes(active))

  return (
    <>
      <div className="chips" role="group" aria-label="Filter by category">
        {categories.map(cat => (
          <button
            key={cat}
            className={`chip${active === cat ? ' active' : ''}`}
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="posts-grid">
        {filtered.map((post) => (
          <Link key={post.id} href={`/insights/${post.id}`} className="post-card">
            <Image src={post.image} alt={post.title} width={400} height={250} className="pi" />
            <div className="pc-body">
              <div className="card-meta">
                <span className="card-tag">{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span className="read-link">Read article →</span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="no-posts visible">No articles in this category yet.</p>
      )}
    </>
  )
}
