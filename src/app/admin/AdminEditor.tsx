'use client'

import { useState, useTransition, useCallback, useRef, useEffect } from 'react'
import { saveContentAction } from '@/app/actions/content'
import { logoutAction } from '@/app/actions/auth'
import { uploadImageAction } from '@/app/actions/upload'
import type { SiteContent } from '@/content/defaults'
import type { Article } from '@/lib/articles'

type Page = 'home' | 'about' | 'services' | 'contact' | 'global' | 'insights'
const PAGE_URLS: Record<Page, string> = {
  home: '/', about: '/about', services: '/services', contact: '/contact', global: '/', insights: '/insights',
}

const PAGES: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'insights', label: 'Insights' },
  { id: 'contact', label: 'Contact' },
  { id: 'global', label: 'Global' },
]

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `article-${Date.now()}`
}

export default function AdminEditor({
  initialContent, kvReady,
}: { initialContent: SiteContent; kvReady: boolean }) {
  const [content, setContent] = useState(initialContent)
  const [activePage, setActivePage] = useState<Page>('home')
  const [openSection, setOpenSection] = useState<string | null>('hero')
  const [openArticle, setOpenArticle] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [iframeKey, setIframeKey] = useState(0)
  const [iframeLoading, setIframeLoading] = useState(true)
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [canvasVisible, setCanvasVisible] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(380)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  // Always tracks the latest content so debounced saves never use stale closures
  const latestContent = useRef(content)
  useEffect(() => { latestContent.current = content }, [content])

  // Fullscreen
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      wrapRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // Sidebar resize drag — disable iframe pointer events while dragging so the
  // iframe doesn't swallow mousemove/mouseup events when the cursor moves over it
  function onResizeStart(e: React.MouseEvent) {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = sidebarWidth
    setIsDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    const onMove = (ev: MouseEvent) => {
      setSidebarWidth(Math.max(240, Math.min(720, startWidth + (ev.clientX - startX))))
    }
    const onUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  // Deep set a nested field
  function set<S extends keyof SiteContent>(section: S, field: keyof SiteContent[S], value: string) {
    const newContent: SiteContent = {
      ...latestContent.current,
      [section]: { ...latestContent.current[section], [field]: value },
    }
    latestContent.current = newContent
    setContent(newContent)
    setStatus('idle')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => triggerSave(latestContent.current), 700)
  }

  const triggerSave = useCallback((c: SiteContent) => {
    setStatus('saving')
    startTransition(async () => {
      try {
        await saveContentAction(c)
        setStatus('saved')
        setIframeKey(k => k + 1)
        setTimeout(() => setStatus('idle'), 2500)
      } catch {
        setStatus('error')
      }
    })
  }, [])

  // Cleanup debounce on unmount
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  function switchPage(p: Page) {
    setActivePage(p)
    setIframeLoading(true)
    setIframeKey(k => k + 1)
    const firstSection: Record<Page, string> = {
      home: 'hero', about: 'about_hero', services: 'services_hero', contact: 'contact_hero', global: 'contact', insights: 'insights_hero',
    }
    setOpenSection(firstSection[p])
    setOpenArticle(null)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setArticleField(index: number, field: keyof Article, value: any) {
    const updated = [...(latestContent.current.articles ?? [])]
    updated[index] = { ...updated[index], [field]: value }
    const newContent = { ...latestContent.current, articles: updated }
    // Update ref synchronously so a second call in the same event handler sees the fresh state
    latestContent.current = newContent
    setContent(newContent)
    setStatus('idle')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => triggerSave(latestContent.current), 700)
  }

  function addArticle() {
    const now = new Date()
    const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const blank: Article = {
      id: `article-${Date.now()}`,
      title: 'New Article',
      category: 'Corporate',
      readTime: '5 min read',
      author: '',
      authorRole: '',
      date,
      excerpt: '',
      image: '',
      authorImage: '',
      tags: ['Corporate'],
      body: '<p>Write your article here...</p>',
    }
    const updated = [blank, ...(latestContent.current.articles ?? [])]
    const newContent = { ...latestContent.current, articles: updated }
    latestContent.current = newContent
    setContent(newContent)
    setOpenArticle(0)
    triggerSave(newContent)
  }

  function deleteArticle(index: number) {
    if (!confirm('Delete this article? This cannot be undone.')) return
    const updated = [...(latestContent.current.articles ?? [])]
    updated.splice(index, 1)
    const newContent = { ...latestContent.current, articles: updated }
    latestContent.current = newContent
    setContent(newContent)
    if (openArticle === index) setOpenArticle(null)
    triggerSave(newContent)
  }

  // ── Socials ──────────────────────────────────────────────────────────
  function setSocialField(index: number, field: 'platform' | 'url', value: string) {
    const updated = [...(latestContent.current.socials ?? [])]
    updated[index] = { ...updated[index], [field]: value }
    const newContent = { ...latestContent.current, socials: updated }
    latestContent.current = newContent
    setContent(newContent)
    setStatus('idle')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => triggerSave(latestContent.current), 700)
  }

  function toggleSocial(index: number) {
    const updated = [...(latestContent.current.socials ?? [])]
    updated[index] = { ...updated[index], enabled: !updated[index].enabled }
    const newContent = { ...latestContent.current, socials: updated }
    latestContent.current = newContent
    setContent(newContent)
    triggerSave(newContent)
  }

  function addSocial() {
    const updated = [...(latestContent.current.socials ?? []), { platform: 'New Platform', url: 'https://', enabled: true }]
    const newContent = { ...latestContent.current, socials: updated }
    latestContent.current = newContent
    setContent(newContent)
    triggerSave(newContent)
  }

  function deleteSocial(index: number) {
    if (!confirm('Remove this social link?')) return
    const updated = [...(latestContent.current.socials ?? [])]
    updated.splice(index, 1)
    const newContent = { ...latestContent.current, socials: updated }
    latestContent.current = newContent
    setContent(newContent)
    triggerSave(newContent)
  }

  function moveArticle(index: number, dir: -1 | 1) {
    const updated = [...(latestContent.current.articles ?? [])]
    const swap = index + dir
    if (swap < 0 || swap >= updated.length) return
    ;[updated[index], updated[swap]] = [updated[swap], updated[index]]
    const newContent = { ...latestContent.current, articles: updated }
    latestContent.current = newContent
    setContent(newContent)
    setOpenArticle(swap)
    triggerSave(newContent)
  }

  const toggle = (s: string) => setOpenSection(prev => prev === s ? null : s)

  const statusLabel = {
    idle: kvReady ? '● Live' : '● Memory only',
    saving: '↻ Saving…',
    saved: '✓ Saved',
    error: '✗ Error',
  }[status]

  const statusColor = { idle: kvReady ? '#4caf7d' : '#f0a500', saving: '#9b8880', saved: '#4caf7d', error: '#e05a5a' }[status]

  return (
    <div className="a-wrap" ref={wrapRef}>
      {/* ── Header ── */}
      <header className="a-header">
        <img src="/logo-cream.svg" alt="Abashidze & Partners" className="a-hlogo" />
        <div className="a-header-mid">
          <span className="a-status" style={{ color: statusColor }}>{statusLabel}</span>
          {!kvReady && <span className="a-kv-warn">Vercel KV not connected — <a href="https://vercel.com/docs/storage/vercel-kv" target="_blank" rel="noopener">set up KV</a> to persist across deploys</span>}
        </div>
        <div className="a-header-actions">
          <button className="a-btn-ghost a-btn-icon" onClick={() => setCanvasVisible(v => !v)} title={canvasVisible ? 'Hide canvas' : 'Show canvas'}>
            {canvasVisible
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 9l3 3-3 3"/></svg>
            }
          </button>
          <button className="a-btn-ghost a-btn-icon" onClick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {isFullscreen
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3"/></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3"/></svg>
            }
          </button>
          <form action={logoutAction} style={{ margin: 0 }}>
            <button type="submit" className="a-btn-ghost">Log out</button>
          </form>
          <a href="/" target="_blank" className="a-btn-ghost">View site ↗</a>
          <button
            className="a-btn-save"
            onClick={() => {
              if (debounceRef.current) clearTimeout(debounceRef.current)
              triggerSave(content)
            }}
            disabled={isPending || status === 'saved'}
          >
            {status === 'saving' ? '↻ Saving…' : status === 'saved' ? '✓ Saved' : 'Save changes'}
          </button>
        </div>
      </header>

      <div className="a-body">
        {/* ── Left Panel ── */}
        <aside className="a-left" style={canvasVisible ? { width: sidebarWidth, flexShrink: 0 } : { flex: 1, width: 'auto' }}>
          {/* Sections */}
          <div className="a-sections">
            {activePage === 'home' && <>
              <Section id="hero" label="Hero" open={openSection} toggle={toggle}>
                <F label="Eyebrow" v={content.home_hero.eyebrow} onChange={v => set('home_hero', 'eyebrow', v)} />
                <Row>
                  <F label="Headline line 1" v={content.home_hero.headline_1} onChange={v => set('home_hero', 'headline_1', v)} />
                  <F label="Italic word" v={content.home_hero.headline_em} onChange={v => set('home_hero', 'headline_em', v)} hint="renders in gold italic" />
                  <F label="Headline line 3" v={content.home_hero.headline_3} onChange={v => set('home_hero', 'headline_3', v)} />
                </Row>
                <F label="Lede paragraph" v={content.home_hero.lede} onChange={v => set('home_hero', 'lede', v)} multi />
                <Row>
                  <F label="Primary button" v={content.home_hero.cta_primary} onChange={v => set('home_hero', 'cta_primary', v)} />
                  <F label="Secondary button" v={content.home_hero.cta_secondary} onChange={v => set('home_hero', 'cta_secondary', v)} />
                </Row>
              </Section>
              <Section id="stats" label="Stats" open={openSection} toggle={toggle}>
                {(['s1','s2','s3','s4'] as const).map((k, i) => (
                  <Row key={k}>
                    <F label={`Stat ${i+1} — Number`} v={(content.home_stats as any)[`${k}_value`]} onChange={v => set('home_stats', `${k}_value` as any, v)} />
                    <F label="Unit" v={(content.home_stats as any)[`${k}_unit`]} onChange={v => set('home_stats', `${k}_unit` as any, v)} />
                    <F label="Label" v={(content.home_stats as any)[`${k}_label`]} onChange={v => set('home_stats', `${k}_label` as any, v)} />
                  </Row>
                ))}
              </Section>
              <Section id="about" label="About Section" open={openSection} toggle={toggle}>
                <F label="Eyebrow" v={content.home_about.eyebrow} onChange={v => set('home_about', 'eyebrow', v)} />
                <F label="Headline" v={content.home_about.headline} onChange={v => set('home_about', 'headline', v)} multi hint="newline = line break" />
                <F label="Body paragraph" v={content.home_about.body} onChange={v => set('home_about', 'body', v)} multi />
                <Row><F label="Point 1 title" v={content.home_about.p1_title} onChange={v => set('home_about', 'p1_title', v)} /><F label="Point 1 body" v={content.home_about.p1_body} onChange={v => set('home_about', 'p1_body', v)} /></Row>
                <Row><F label="Point 2 title" v={content.home_about.p2_title} onChange={v => set('home_about', 'p2_title', v)} /><F label="Point 2 body" v={content.home_about.p2_body} onChange={v => set('home_about', 'p2_body', v)} /></Row>
                <Row><F label="Point 3 title" v={content.home_about.p3_title} onChange={v => set('home_about', 'p3_title', v)} /><F label="Point 3 body" v={content.home_about.p3_body} onChange={v => set('home_about', 'p3_body', v)} /></Row>
                <F label="CTA link text" v={content.home_about.cta} onChange={v => set('home_about', 'cta', v)} />
              </Section>
              <Section id="approach" label="Approach Steps" open={openSection} toggle={toggle}>
                <Row>
                  <F label="Eyebrow" v={content.home_approach.eyebrow} onChange={v => set('home_approach', 'eyebrow', v)} />
                  <F label="Heading" v={content.home_approach.heading} onChange={v => set('home_approach', 'heading', v)} />
                </Row>
                {(['s1','s2','s3','s4'] as const).map((k, i) => (
                  <div key={k}>
                    <Row>
                      <F label={`Step ${i+1} number`} v={(content.home_approach as any)[`${k}_n`]} onChange={v => set('home_approach', `${k}_n` as any, v)} />
                      <F label={`Step ${i+1} title`} v={(content.home_approach as any)[`${k}_title`]} onChange={v => set('home_approach', `${k}_title` as any, v)} />
                    </Row>
                    <F label={`Step ${i+1} body`} v={(content.home_approach as any)[`${k}_body`]} onChange={v => set('home_approach', `${k}_body` as any, v)} multi />
                  </div>
                ))}
              </Section>
              <Section id="quote" label="Quote Band" open={openSection} toggle={toggle}>
                <F label="Quote text — use {word} for italic" v={content.home_quote.text} onChange={v => set('home_quote', 'text', v)} multi />
                <Row>
                  <F label="Italic word" v={content.home_quote.em} onChange={v => set('home_quote', 'em', v)} hint="must match {word} above" />
                  <F label="Attribution" v={content.home_quote.attribution} onChange={v => set('home_quote', 'attribution', v)} />
                </Row>
              </Section>
              <Section id="home_services" label="Services Section" open={openSection} toggle={toggle}>
                <Row>
                  <F label="Eyebrow" v={content.home_services.eyebrow} onChange={v => set('home_services', 'eyebrow', v)} />
                  <F label="Heading" v={content.home_services.heading} onChange={v => set('home_services', 'heading', v)} />
                </Row>
              </Section>
              <Section id="home_insights" label="Insights Section" open={openSection} toggle={toggle}>
                <Row>
                  <F label="Eyebrow" v={content.home_insights.eyebrow} onChange={v => set('home_insights', 'eyebrow', v)} />
                  <F label="Heading" v={content.home_insights.heading} onChange={v => set('home_insights', 'heading', v)} />
                  <F label="Button text" v={content.home_insights.cta} onChange={v => set('home_insights', 'cta', v)} />
                </Row>
              </Section>
              <Section id="cta" label="CTA Section" open={openSection} toggle={toggle}>
                <Row>
                  <F label="Eyebrow" v={content.home_cta.eyebrow} onChange={v => set('home_cta', 'eyebrow', v)} />
                  <F label="Form card heading" v={content.home_cta.form_heading} onChange={v => set('home_cta', 'form_heading', v)} />
                </Row>
                <F label="Heading" v={content.home_cta.heading} onChange={v => set('home_cta', 'heading', v)} />
                <F label="Body" v={content.home_cta.body} onChange={v => set('home_cta', 'body', v)} multi />
                <Row>
                  <F label="Primary button" v={content.home_cta.cta_primary} onChange={v => set('home_cta', 'cta_primary', v)} />
                  <F label="Secondary button" v={content.home_cta.cta_secondary} onChange={v => set('home_cta', 'cta_secondary', v)} />
                </Row>
              </Section>
            </>}

            {activePage === 'about' && <>
              <Section id="about_hero" label="Page Hero" open={openSection} toggle={toggle}>
                <F label="Eyebrow" v={content.about_hero.eyebrow} onChange={v => set('about_hero', 'eyebrow', v)} />
                <F label="Title" v={content.about_hero.title} onChange={v => set('about_hero', 'title', v)} />
                <F label="Lede" v={content.about_hero.lede} onChange={v => set('about_hero', 'lede', v)} multi />
              </Section>
              <Section id="about_story" label="Our Story" open={openSection} toggle={toggle}>
                <Row>
                  <F label="Eyebrow" v={content.about_story.eyebrow} onChange={v => set('about_story', 'eyebrow', v)} />
                  <F label="Heading" v={content.about_story.heading} onChange={v => set('about_story', 'heading', v)} />
                </Row>
                <ImageUpload
                  label="Section image"
                  value={content.about_story.image ?? ''}
                  onChange={v => set('about_story', 'image', v)}
                />
                <F label="Paragraph 1" v={content.about_story.body_1} onChange={v => set('about_story', 'body_1', v)} multi />
                <F label="Paragraph 2" v={content.about_story.body_2} onChange={v => set('about_story', 'body_2', v)} multi />
                <F label="Paragraph 3" v={content.about_story.body_3} onChange={v => set('about_story', 'body_3', v)} multi />
              </Section>
              <Section id="about_values" label="Our Values" open={openSection} toggle={toggle}>
                <Row>
                  <F label="Eyebrow" v={content.about_values.eyebrow} onChange={v => set('about_values', 'eyebrow', v)} />
                  <F label="Heading" v={content.about_values.heading} onChange={v => set('about_values', 'heading', v)} />
                </Row>
                {(['v1','v2','v3'] as const).map((k, i) => (
                  <Row key={k}>
                    <F label={`Value ${i+1} title`} v={(content.about_values as any)[`${k}_title`]} onChange={v => set('about_values', `${k}_title` as any, v)} />
                    <F label="Body" v={(content.about_values as any)[`${k}_body`]} onChange={v => set('about_values', `${k}_body` as any, v)} multi />
                  </Row>
                ))}
              </Section>
              <Section id="about_stats" label="Stats Bar" open={openSection} toggle={toggle}>
                {(['s1','s2','s3','s4'] as const).map((k, i) => (
                  <Row key={k}>
                    <F label={`Stat ${i+1} number`} v={(content.about_stats as any)[`${k}_value`]} onChange={v => set('about_stats', `${k}_value` as any, v)} />
                    <F label="Unit" v={(content.about_stats as any)[`${k}_unit`]} onChange={v => set('about_stats', `${k}_unit` as any, v)} />
                    <F label="Label" v={(content.about_stats as any)[`${k}_label`]} onChange={v => set('about_stats', `${k}_label` as any, v)} />
                  </Row>
                ))}
              </Section>
              <Section id="about_team" label="Team Members" open={openSection} toggle={toggle}>
                <Row>
                  <F label="Eyebrow" v={content.about_team.eyebrow} onChange={v => set('about_team', 'eyebrow', v)} />
                  <F label="Heading" v={content.about_team.heading} onChange={v => set('about_team', 'heading', v)} />
                </Row>
                {(['m1','m2','m3'] as const).map((k, i) => (
                  <div key={k} className="svc-block">
                    <Row>
                      <F label={`Member ${i+1} name`} v={(content.about_team as any)[`${k}_name`]} onChange={v => set('about_team', `${k}_name` as any, v)} />
                      <F label="Role / Title" v={(content.about_team as any)[`${k}_role`]} onChange={v => set('about_team', `${k}_role` as any, v)} />
                    </Row>
                    <F label="Bio" v={(content.about_team as any)[`${k}_bio`]} onChange={v => set('about_team', `${k}_bio` as any, v)} multi />
                  </div>
                ))}
              </Section>
              <Section id="about_timeline" label="Milestones" open={openSection} toggle={toggle}>
                <Row>
                  <F label="Eyebrow" v={content.about_timeline.eyebrow} onChange={v => set('about_timeline', 'eyebrow', v)} />
                  <F label="Heading" v={content.about_timeline.heading} onChange={v => set('about_timeline', 'heading', v)} />
                </Row>
                {(['t1','t2','t3','t4','t5'] as const).map((k, i) => (
                  <div key={k} className="svc-block">
                    <Row>
                      <F label={`Entry ${i+1} year`} v={(content.about_timeline as any)[`${k}_year`]} onChange={v => set('about_timeline', `${k}_year` as any, v)} />
                      <F label="Title" v={(content.about_timeline as any)[`${k}_title`]} onChange={v => set('about_timeline', `${k}_title` as any, v)} />
                    </Row>
                    <F label="Body" v={(content.about_timeline as any)[`${k}_body`]} onChange={v => set('about_timeline', `${k}_body` as any, v)} multi />
                  </div>
                ))}
              </Section>
              <Section id="about_cta" label="CTA Band" open={openSection} toggle={toggle}>
                <F label="Heading" v={content.about_cta.heading} onChange={v => set('about_cta', 'heading', v)} />
                <F label="Body" v={content.about_cta.body} onChange={v => set('about_cta', 'body', v)} multi />
                <F label="Button text" v={content.about_cta.cta} onChange={v => set('about_cta', 'cta', v)} />
              </Section>
            </>}

            {activePage === 'services' && <>
              <Section id="services_hero" label="Page Hero" open={openSection} toggle={toggle}>
                <F label="Eyebrow" v={content.services_hero.eyebrow} onChange={v => set('services_hero', 'eyebrow', v)} />
                <F label="Title" v={content.services_hero.title} onChange={v => set('services_hero', 'title', v)} />
                <F label="Lede" v={content.services_hero.lede} onChange={v => set('services_hero', 'lede', v)} multi />
              </Section>
              <Section id="services_items" label="Service Descriptions" open={openSection} toggle={toggle}>
                {(['s1','s2','s3','s4','s5','s6'] as const).map((k, i) => (
                  <div key={k} className="svc-block">
                    <F label={`${String(i+1).padStart(2,'0')} Title`} v={(content.services_items as any)[`${k}_title`]} onChange={v => set('services_items', `${k}_title` as any, v)} />
                    <F label="Description" v={(content.services_items as any)[`${k}_desc`]} onChange={v => set('services_items', `${k}_desc` as any, v)} multi />
                    <ImageUpload
                      label="Image"
                      aspect="wide"
                      value={(content.services_items as any)[`${k}_image`] ?? ''}
                      onChange={v => set('services_items', `${k}_image` as any, v)}
                    />
                  </div>
                ))}
              </Section>
              <Section id="services_cta" label="CTA Band" open={openSection} toggle={toggle}>
                <F label="Heading" v={content.services_cta.heading} onChange={v => set('services_cta', 'heading', v)} />
                <F label="Body" v={content.services_cta.body} onChange={v => set('services_cta', 'body', v)} multi />
                <F label="Button text" v={content.services_cta.cta} onChange={v => set('services_cta', 'cta', v)} />
              </Section>
            </>}

            {activePage === 'contact' && <>
              <Section id="contact_hero" label="Page Hero" open={openSection} toggle={toggle}>
                <F label="Eyebrow" v={content.contact_hero.eyebrow} onChange={v => set('contact_hero', 'eyebrow', v)} />
                <F label="Title" v={content.contact_hero.title} onChange={v => set('contact_hero', 'title', v)} />
                <F label="Lede" v={content.contact_hero.lede} onChange={v => set('contact_hero', 'lede', v)} multi />
              </Section>
              <Section id="contact_form" label="Form" open={openSection} toggle={toggle}>
                <Row>
                  <F label="Form heading" v={content.contact_page.form_heading} onChange={v => set('contact_page', 'form_heading', v)} />
                  <F label="Form subheading" v={content.contact_page.form_subheading} onChange={v => set('contact_page', 'form_subheading', v)} />
                </Row>
              </Section>
            </>}

            {activePage === 'insights' && <>
              <Section id="insights_hero" label="Page Hero" open={openSection} toggle={toggle}>
                <F label="Eyebrow" v={content.insights_hero.eyebrow} onChange={v => set('insights_hero', 'eyebrow', v)} />
                <F label="Title" v={content.insights_hero.title} onChange={v => set('insights_hero', 'title', v)} />
                <F label="Lede" v={content.insights_hero.lede} onChange={v => set('insights_hero', 'lede', v)} multi />
              </Section>
              <div className="a-sec">
                <div className="a-articles-header">
                  <span className="a-articles-label">Articles ({(content.articles ?? []).length})</span>
                  <button className="a-btn-add" onClick={addArticle}>+ New article</button>
                </div>
                {(content.articles ?? []).map((art, i) => (
                  <div key={art.id} className="a-article-row">
                    <button
                      className={`a-article-toggle${openArticle === i ? ' open' : ''}`}
                      onClick={() => setOpenArticle(prev => prev === i ? null : i)}
                    >
                      <span className="a-article-title">{art.title || 'Untitled'}</span>
                      <span className="a-article-meta">{art.category} · {art.date}</span>
                      <span className="a-sec-chevron">›</span>
                    </button>
                    {openArticle === i && (
                      <div className="a-sec-body">
                        <div className="a-article-actions">
                          <button className="a-act-btn" onClick={() => moveArticle(i, -1)} disabled={i === 0} title="Move up">↑</button>
                          <button className="a-act-btn" onClick={() => moveArticle(i, 1)} disabled={i === (content.articles ?? []).length - 1} title="Move down">↓</button>
                          <button className="a-act-btn danger" onClick={() => deleteArticle(i)}>Delete</button>
                          <a className="a-act-link" href={`/insights/${art.id}`} target="_blank" rel="noopener">View ↗</a>
                        </div>
                        <F label="Title" v={art.title} onChange={v => { setArticleField(i, 'title', v); setArticleField(i, 'id', slugify(v)) }} />
                        <Row>
                          <F label="Category" v={art.category} onChange={v => setArticleField(i, 'category', v)} hint="Corporate, M&A, Disputes…" />
                          <F label="Date" v={art.date} onChange={v => setArticleField(i, 'date', v)} hint="e.g. March 12, 2025" />
                        </Row>
                        <Row>
                          <F label="Read time" v={art.readTime} onChange={v => setArticleField(i, 'readTime', v)} hint="e.g. 7 min read" />
                          <F label="Tags (comma-separated)" v={art.tags.join(', ')} onChange={v => setArticleField(i, 'tags', v.split(',').map(t => t.trim()).filter(Boolean) as any)} />
                        </Row>
                        <F label="Excerpt (shown in cards)" v={art.excerpt} onChange={v => setArticleField(i, 'excerpt', v)} multi />
                        <F label="Cover image URL" v={art.image} onChange={v => setArticleField(i, 'image', v)} hint="Paste any image URL (jpg, png, webp)" />
                        <Row>
                          <F label="Author name" v={art.author} onChange={v => setArticleField(i, 'author', v)} />
                          <F label="Author role" v={art.authorRole} onChange={v => setArticleField(i, 'authorRole', v)} />
                        </Row>
                        <AuthorPhotoUpload value={art.authorImage} onChange={v => setArticleField(i, 'authorImage', v)} />
                        <F label="Body (HTML)" v={art.body} onChange={v => setArticleField(i, 'body', v)} multi tall hint="Use <h2>, <p>, <ul>, <blockquote> tags" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>}

            {activePage === 'global' && <>
              <Section id="contact" label="Contact Info" open={openSection} toggle={toggle}>
                <Row>
                  <F label="Address line 1" v={content.contact.address_1} onChange={v => set('contact', 'address_1', v)} />
                  <F label="Address line 2" v={content.contact.address_2} onChange={v => set('contact', 'address_2', v)} />
                </Row>
                <Row>
                  <F label="Phone" v={content.contact.phone} onChange={v => set('contact', 'phone', v)} />
                  <F label="Email" v={content.contact.email} onChange={v => set('contact', 'email', v)} />
                </Row>
                <Row>
                  <F label="Hours — days" v={content.contact.hours_days} onChange={v => set('contact', 'hours_days', v)} />
                  <F label="Hours — time" v={content.contact.hours_time} onChange={v => set('contact', 'hours_time', v)} />
                </Row>
              </Section>
              <Section id="social" label="Social Links" open={openSection} toggle={toggle}>
                {(content.socials ?? []).map((s, i) => (
                  <div key={i} className="a-social-row">
                    <button
                      type="button"
                      className={`a-social-toggle${s.enabled ? ' on' : ''}`}
                      onClick={() => toggleSocial(i)}
                      title={s.enabled ? 'Visible — click to hide' : 'Hidden — click to show'}
                    >
                      {s.enabled ? '●' : '○'}
                    </button>
                    <input
                      className="a-social-name"
                      type="text"
                      value={s.platform}
                      onChange={e => setSocialField(i, 'platform', e.target.value)}
                      placeholder="Platform name"
                    />
                    <input
                      className="a-social-url"
                      type="text"
                      value={s.url}
                      onChange={e => setSocialField(i, 'url', e.target.value)}
                      placeholder="https://..."
                    />
                    <button type="button" className="a-act-btn danger" onClick={() => deleteSocial(i)} title="Remove">×</button>
                  </div>
                ))}
                <button type="button" className="a-btn-add" style={{ marginTop: 6 }} onClick={addSocial}>+ Add social</button>
              </Section>
              <Section id="footer" label="Footer" open={openSection} toggle={toggle}>
                <F label="Tagline" v={content.footer.tagline} onChange={v => set('footer', 'tagline', v)} multi />
              </Section>
              <Section id="site" label="Site Settings" open={openSection} toggle={toggle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#d8cac1', fontSize: 13 }}>Dark mode button</span>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = latestContent.current.global?.dark_mode_enabled ?? true
                      const updated = { ...latestContent.current, global: { ...(latestContent.current.global ?? {}), dark_mode_enabled: !cur } }
                      latestContent.current = updated
                      setContent(updated)
                      setStatus('idle')
                      if (debounceRef.current) clearTimeout(debounceRef.current)
                      debounceRef.current = setTimeout(() => triggerSave(latestContent.current), 700)
                    }}
                    style={{
                      padding: '4px 14px',
                      borderRadius: 4,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      background: (content.global?.dark_mode_enabled ?? true) ? '#4ade80' : '#6b7280',
                      color: (content.global?.dark_mode_enabled ?? true) ? '#14532d' : '#f3f4f6',
                    }}
                  >
                    {(content.global?.dark_mode_enabled ?? true) ? 'ON' : 'OFF'}
                  </button>
                </div>
              </Section>
            </>}
          </div>
        </aside>

        {/* ── Resize handle (canvas mode only) ── */}
        {canvasVisible && <div className="a-resize-handle" onMouseDown={onResizeStart} />}

        {/* ── Canvas ── */}
        {canvasVisible && <div className="a-canvas">
          <div className="a-canvas-bar">
            <div className="a-page-tabs">
              {PAGES.map(p => (
                <button key={p.id} className={`a-page-tab${activePage === p.id ? ' active' : ''}`} onClick={() => switchPage(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="a-vp-btns">
              {([
                { id: 'desktop' as const, label: 'Desktop', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
                { id: 'tablet' as const,  label: 'Tablet',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.5" strokeWidth="2" strokeLinecap="round"/></svg> },
                { id: 'mobile' as const,  label: 'Mobile',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.5" strokeWidth="2" strokeLinecap="round"/></svg> },
              ]).map(({ id, label, icon }) => (
                <button
                  key={id}
                  className={`a-vp-btn${viewport === id ? ' active' : ''}`}
                  onClick={() => setViewport(id)}
                  title={label}
                >{icon}</button>
              ))}
            </div>
            <div className="a-canvas-bar-right">
              <span className="a-canvas-url">{PAGE_URLS[activePage]}</span>
              <a href={PAGE_URLS[activePage]} target="_blank" rel="noopener" className="a-canvas-open">↗ Open</a>
            </div>
          </div>
          <div className={`a-iframe-wrap vp-${viewport}`}>
            {iframeLoading && (
              <div className="a-iframe-loading">
                <div className="a-spinner" />
              </div>
            )}
            <iframe
              key={`${iframeKey}-${viewport}`}
              src={PAGE_URLS[activePage]}
              className="a-iframe"
              onLoad={() => setIframeLoading(false)}
              title="Site preview"
              style={isDragging ? { pointerEvents: 'none' } : undefined}
            />
          </div>
        </div>}
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .a-wrap { display: flex; flex-direction: column; height: 100svh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #1a1210; }

        /* Header */
        .a-header {
          height: 52px; flex-shrink: 0;
          background: #1e1412; border-bottom: 1px solid rgba(255,255,255,.08);
          display: flex; align-items: center; gap: 16px; padding: 0 20px;
        }
        .a-hlogo { height: 28px; width: auto; }
        .a-header-mid { flex: 1; display: flex; align-items: center; gap: 16px; }
        .a-status { font-size: 11px; font-weight: 700; letter-spacing: .04em; }
        .a-kv-warn { font-size: 11px; color: #f0a500; }
        .a-kv-warn a { color: inherit; }
        .a-header-actions { display: flex; gap: 8px; }
        .a-btn-ghost {
          padding: 5px 12px; background: none; border: 1px solid rgba(255,255,255,.15);
          color: #d8cac1; border-radius: 5px; font-size: 12px; cursor: pointer;
          text-decoration: none; transition: border-color .15s, color .15s;
        }
        .a-btn-ghost:hover { border-color: rgba(255,255,255,.35); color: #fff; }
        .a-btn-save {
          padding: 6px 18px; background: #9b7a5e; border: none;
          color: #fff; border-radius: 5px; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: background .15s, opacity .15s; letter-spacing: .03em;
        }
        .a-btn-save:hover:not(:disabled) { background: #b8936e; }
        .a-btn-save:disabled { opacity: .65; cursor: default; }

        /* Body */
        .a-body { flex: 1; display: flex; overflow: hidden; }

        /* Left panel — width controlled via inline style */
        .a-left {
          background: #221614; border-right: 1px solid rgba(255,255,255,.07);
          display: flex; flex-direction: column; overflow: hidden; min-width: 0;
        }
        .a-sections { flex: 1; overflow-y: auto; padding: 12px 0; }

        /* Accordion section */
        .a-sec { border-bottom: 1px solid rgba(255,255,255,.06); }
        .a-sec-header {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 11px 16px; background: none; border: none; cursor: pointer;
          color: #a89080; font-size: 11px; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; text-align: left; transition: color .15s;
        }
        .a-sec-header:hover, .a-sec-header.open { color: #d8cac1; }
        .a-sec-chevron { font-size: 10px; transition: transform .2s; }
        .a-sec-header.open .a-sec-chevron { transform: rotate(90deg); }
        .a-sec-body { padding: 4px 16px 16px; display: flex; flex-direction: column; gap: 10px; }
        .svc-block { border-top: 1px solid rgba(255,255,255,.05); padding-top: 10px; display: flex; flex-direction: column; gap: 8px; }

        /* Fields */
        .a-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .a-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
        .a-field { display: flex; flex-direction: column; gap: 4px; }
        .a-field label { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #6b5a54; }
        .a-field .hint { font-size: 10px; color: #4a3428; margin-top: -2px; }
        .a-field input, .a-field textarea {
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
          border-radius: 4px; color: #d8cac1; font-size: 12px; font-family: inherit;
          padding: 7px 9px; outline: none; transition: border-color .15s, background .15s;
          resize: vertical;
        }
        .a-field input:focus, .a-field textarea:focus {
          border-color: #9b7a5e; background: rgba(255,255,255,.1);
        }
        .a-field textarea { min-height: 70px; line-height: 1.5; }
        .a-field textarea.tall { min-height: 260px; font-size: 11px; }

        /* Image uploads (service thumbnails + author photo) */
        .a-img-upload-row { display: flex; align-items: center; gap: 12px; }
        .a-img-thumb {
          width: 96px; height: 64px; border-radius: 4px; flex-shrink: 0;
          background: rgba(255,255,255,.08) center/cover no-repeat;
          border: 1px solid rgba(255,255,255,.12); cursor: pointer; position: relative;
          display: flex; align-items: center; justify-content: center;
          transition: border-color .15s;
        }
        .a-img-thumb.wide { width: 128px; height: 72px; }
        .a-img-thumb:hover { border-color: #9b7a5e; }
        .a-img-thumb-placeholder { font-size: 18px; color: #4a3428; }

        /* Author photo upload */
        .a-photo-row { display: flex; align-items: center; gap: 12px; }
        .a-avatar {
          width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0;
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
          cursor: pointer; overflow: hidden; position: relative;
          display: flex; align-items: center; justify-content: center;
          transition: border-color .15s;
        }
        .a-avatar:hover { border-color: #9b7a5e; }
        .a-avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .a-avatar-placeholder { font-size: 20px; color: #4a3428; line-height: 1; }
        .a-avatar-uploading {
          position: absolute; inset: 0; background: rgba(0,0,0,.55);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: #d8cac1; animation: spin .8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .a-upload-btn {
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
          border-radius: 4px; color: #d8cac1; font-size: 11px; font-family: inherit;
          padding: 6px 12px; cursor: pointer; transition: background .15s, border-color .15s;
        }
        .a-upload-btn:hover:not(:disabled) { background: rgba(255,255,255,.12); border-color: #9b7a5e; }
        .a-upload-btn:disabled { opacity: .5; cursor: default; }

        /* Canvas */
        .a-canvas { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .a-canvas-bar {
          height: 44px; flex-shrink: 0;
          background: #181210; border-bottom: 1px solid rgba(255,255,255,.06);
          display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
        }
        .a-page-tabs { display: flex; align-items: stretch; height: 100%; }
        .a-page-tab {
          padding: 0 18px; background: none; border: none; border-right: 1px solid rgba(255,255,255,.06);
          color: #6b5a54; font-size: 12px; font-weight: 600; cursor: pointer;
          letter-spacing: .05em; text-transform: uppercase;
          transition: color .15s, background .15s;
          border-bottom: 2px solid transparent;
        }
        .a-page-tab:hover { color: #d8cac1; background: rgba(255,255,255,.04); }
        .a-page-tab.active { color: #d8cac1; border-bottom-color: #9b7a5e; background: rgba(255,255,255,.05); }
        .a-vp-btns { display: flex; align-items: center; gap: 2px; justify-content: center; }
        .a-vp-btn {
          background: none; border: none; cursor: pointer; padding: 6px 8px;
          color: #4a3428; display: flex; align-items: center; justify-content: center;
          border-radius: 4px; transition: color .15s, background .15s;
        }
        .a-vp-btn svg { width: 16px; height: 16px; }
        .a-vp-btn:hover { color: #d8cac1; background: rgba(255,255,255,.06); }
        .a-vp-btn.active { color: #d8cac1; background: rgba(155,122,94,.2); }
        .a-canvas-bar-right { display: flex; align-items: center; gap: 12px; padding: 0 12px; justify-content: flex-end; }
        .a-canvas-url { font-size: 11px; color: #4a3428; letter-spacing: .02em; font-family: monospace; }
        .a-canvas-open { font-size: 11px; color: #6b5a54; text-decoration: none; transition: color .15s; }
        .a-canvas-open:hover { color: #d8cac1; }
        /* Articles list */
        .a-articles-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .a-articles-label { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #a89080; }
        .a-btn-add {
          padding: 4px 10px; background: rgba(155,122,94,.2); border: 1px solid rgba(155,122,94,.4);
          color: #d8cac1; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;
          letter-spacing: .04em; transition: background .15s;
        }
        .a-btn-add:hover { background: rgba(155,122,94,.4); }

        /* Social links manager */
        .a-social-row { display: flex; align-items: center; gap: 6px; }
        .a-social-toggle {
          flex-shrink: 0; width: 22px; background: none; border: none; cursor: pointer;
          font-size: 14px; padding: 0; line-height: 1; color: #4a3428; transition: color .15s;
        }
        .a-social-toggle.on { color: #4caf7d; }
        .a-social-name {
          width: 100px; flex-shrink: 0;
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
          border-radius: 4px; color: #d8cac1; font-size: 12px; font-family: inherit;
          padding: 6px 8px; outline: none; transition: border-color .15s;
        }
        .a-social-url {
          flex: 1;
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
          border-radius: 4px; color: #d8cac1; font-size: 12px; font-family: inherit;
          padding: 6px 8px; outline: none; transition: border-color .15s;
        }
        .a-social-name:focus, .a-social-url:focus { border-color: #9b7a5e; }

        .a-article-row { border-bottom: 1px solid rgba(255,255,255,.05); }
        .a-article-toggle {
          width: 100%; display: flex; align-items: center; gap: 8px; padding: 10px 16px;
          background: none; border: none; cursor: pointer; text-align: left;
          transition: background .15s;
        }
        .a-article-toggle:hover { background: rgba(255,255,255,.03); }
        .a-article-toggle.open { background: rgba(255,255,255,.04); }
        .a-article-title { flex: 1; font-size: 12px; color: #c8b8b0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .a-article-meta { font-size: 10px; color: #4a3428; flex-shrink: 0; }
        .a-article-actions { display: flex; gap: 6px; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,.06); }
        .a-act-btn {
          padding: 3px 10px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1);
          color: #a89080; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all .15s;
        }
        .a-act-btn:hover:not(:disabled) { background: rgba(255,255,255,.14); color: #d8cac1; }
        .a-act-btn:disabled { opacity: .3; cursor: default; }
        .a-act-btn.danger { color: #e07070; border-color: rgba(224,112,112,.3); }
        .a-act-btn.danger:hover { background: rgba(224,112,112,.15); }
        .a-act-link { font-size: 11px; color: #6b5a54; text-decoration: none; margin-left: auto; }
        .a-act-link:hover { color: #d8cac1; }

        .a-iframe-wrap { flex: 1; position: relative; background: #fff; overflow: auto; }
        .a-iframe-wrap.vp-tablet, .a-iframe-wrap.vp-mobile { background: #0f0c0b; display: flex; align-items: flex-start; justify-content: center; padding: 16px; }
        .a-iframe { width: 100%; height: 100%; border: none; display: block; }
        .a-iframe-wrap.vp-tablet .a-iframe { width: 768px; height: 1024px; flex-shrink: 0; box-shadow: 0 8px 40px rgba(0,0,0,.6); }
        .a-iframe-wrap.vp-mobile .a-iframe { width: 390px; height: 844px; flex-shrink: 0; box-shadow: 0 8px 40px rgba(0,0,0,.6); }
        .a-iframe-loading {
          position: absolute; inset: 0; background: rgba(255,255,255,.85);
          display: flex; align-items: center; justify-content: center; z-index: 10;
          backdrop-filter: blur(2px);
        }
        .a-spinner {
          width: 28px; height: 28px;
          border: 2px solid #e0d8d0;
          border-top-color: #9b7a5e;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Resize handle */
        .a-resize-handle {
          width: 5px; flex-shrink: 0; cursor: col-resize; background: transparent;
          position: relative; transition: background .15s;
        }
        .a-resize-handle::after {
          content: ''; position: absolute; inset: 0 -4px;
        }
        .a-resize-handle:hover { background: rgba(155,122,94,.45); }

        /* Icon-only header buttons */
        .a-btn-icon {
          padding: 5px 7px; display: flex; align-items: center; justify-content: center;
        }
        .a-btn-icon svg { width: 15px; height: 15px; }

        /* Fullscreen — hide browser chrome padding */
        :fullscreen .a-wrap { height: 100svh; }
      `}</style>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ id, label, open, toggle, children }: {
  id: string; label: string; open: string | null; toggle: (id: string) => void; children: React.ReactNode
}) {
  const isOpen = open === id
  return (
    <div className="a-sec">
      <button className={`a-sec-header${isOpen ? ' open' : ''}`} onClick={() => toggle(id)}>
        {label} <span className="a-sec-chevron">›</span>
      </button>
      {isOpen && <div className="a-sec-body">{children}</div>}
    </div>
  )
}

function Row({ children, cols3 }: { children: React.ReactNode; cols3?: boolean }) {
  return <div className={`a-row${cols3 ? ' cols-3' : ''}`}>{children}</div>
}

function F({ label, v, onChange, multi, hint, tall }: {
  label: string; v: string; onChange: (v: string) => void; multi?: boolean; hint?: string; tall?: boolean
}) {
  return (
    <div className="a-field">
      <label>{label}</label>
      {hint && <span className="hint">{hint}</span>}
      {multi
        ? <textarea value={v} onChange={e => onChange(e.target.value)} rows={tall ? 12 : 3} className={tall ? 'tall' : undefined} />
        : <input type="text" value={v} onChange={e => onChange(e.target.value)} />
      }
    </div>
  )
}

function ImageUpload({ label, value, onChange, aspect }: {
  label: string; value: string; onChange: (url: string) => void; aspect?: 'square' | 'wide'
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(value)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { setPreview(value) }, [value])

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const local = URL.createObjectURL(file)
    setPreview(local)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const url = await uploadImageAction(fd)
      setPreview(url)
      onChange(url)
    } catch {
      setPreview(value)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="a-field">
      <label>{label}</label>
      <div className="a-img-upload-row">
        <div
          className={`a-img-thumb${aspect === 'wide' ? ' wide' : ''}`}
          onClick={() => inputRef.current?.click()}
          style={preview ? { backgroundImage: `url(${preview})` } : undefined}
        >
          {!preview && <span className="a-img-thumb-placeholder">+</span>}
          {uploading && <div className="a-avatar-uploading">↑</div>}
        </div>
        <button type="button" className="a-upload-btn" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading…' : 'Choose image'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
    </div>
  )
}

function AuthorPhotoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(value)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { setPreview(value) }, [value])

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Show local preview immediately
    const local = URL.createObjectURL(file)
    setPreview(local)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const url = await uploadImageAction(fd)
      setPreview(url)
      onChange(url)
    } catch {
      setPreview(value)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="a-field">
      <label>Author photo</label>
      <div className="a-photo-row">
        <div className="a-avatar" onClick={() => inputRef.current?.click()}>
          {preview
            ? <img src={preview} alt="Author" className="a-avatar-img" />
            : <span className="a-avatar-placeholder">+</span>
          }
          {uploading && <div className="a-avatar-uploading">↑</div>}
        </div>
        <button type="button" className="a-upload-btn" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading…' : 'Choose photo'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
    </div>
  )
}
