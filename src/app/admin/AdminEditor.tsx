'use client'

import { useState, useTransition } from 'react'
import { saveContentAction } from '@/app/actions/content'
import { logoutAction } from '@/app/actions/auth'
import type { SiteContent } from '@/content/defaults'

type Tab = 'hero' | 'about' | 'contact' | 'footer'

export default function AdminEditor({
  initialContent,
  kvReady,
}: {
  initialContent: SiteContent
  kvReady: boolean
}) {
  const [tab, setTab] = useState<Tab>('hero')
  const [content, setContent] = useState(initialContent)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function set(section: keyof SiteContent, field: string, value: string) {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
    setSaved(false)
  }

  function save() {
    startTransition(async () => {
      await saveContentAction(content)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'footer', label: 'Footer' },
  ]

  return (
    <div className="adm">
      {/* Sidebar */}
      <aside className="adm-side">
        <div className="adm-brand">
          <span className="adm-logo">A&P</span>
          <span className="adm-title">Site Editor</span>
        </div>
        <nav className="adm-nav">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`adm-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="adm-side-footer">
          <a href="/" target="_blank" className="adm-view-site">View site ↗</a>
          <form action={logoutAction}>
            <button type="submit" className="adm-logout">Log out</button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="adm-main">
        <div className="adm-topbar">
          <div>
            <h2 className="adm-section-title">
              {tabs.find(t => t.id === tab)?.label}
            </h2>
            {!kvReady && (
              <p className="adm-notice">
                ⚠ Vercel KV not connected — changes save to memory only (lost on redeploy).{' '}
                <a href="https://vercel.com/docs/storage/vercel-kv" target="_blank" rel="noopener">
                  Connect KV
                </a>{' '}
                to persist.
              </p>
            )}
          </div>
          <button
            className="adm-save"
            onClick={save}
            disabled={isPending}
          >
            {isPending ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
          </button>
        </div>

        <div className="adm-fields">
          {tab === 'hero' && (
            <>
              <Field label="Eyebrow text" value={content.hero.eyebrow}
                onChange={v => set('hero', 'eyebrow', v)} />
              <div className="adm-row">
                <Field label="Headline — line 1" value={content.hero.headline_1}
                  onChange={v => set('hero', 'headline_1', v)} />
                <Field label="Headline — italic word" value={content.hero.headline_em}
                  onChange={v => set('hero', 'headline_em', v)} hint="Renders in gold italic" />
                <Field label="Headline — line 3" value={content.hero.headline_3}
                  onChange={v => set('hero', 'headline_3', v)} />
              </div>
              <Field label="Lede paragraph" value={content.hero.lede}
                onChange={v => set('hero', 'lede', v)} multiline />
              <div className="adm-row">
                <Field label="Primary button text" value={content.hero.cta_primary}
                  onChange={v => set('hero', 'cta_primary', v)} />
                <Field label="Secondary button text" value={content.hero.cta_secondary}
                  onChange={v => set('hero', 'cta_secondary', v)} />
              </div>
            </>
          )}

          {tab === 'about' && (
            <>
              <Field label="Eyebrow" value={content.about_preview.eyebrow}
                onChange={v => set('about_preview', 'eyebrow', v)} />
              <Field label="Headline" value={content.about_preview.headline}
                onChange={v => set('about_preview', 'headline', v)}
                multiline hint="Use a newline to break the headline into two lines" />
              <Field label="Body paragraph" value={content.about_preview.body}
                onChange={v => set('about_preview', 'body', v)} multiline />
            </>
          )}

          {tab === 'contact' && (
            <>
              <Field label="Address — line 1" value={content.contact.address_1}
                onChange={v => set('contact', 'address_1', v)} />
              <Field label="Address — line 2" value={content.contact.address_2}
                onChange={v => set('contact', 'address_2', v)} />
              <Field label="Phone number" value={content.contact.phone}
                onChange={v => set('contact', 'phone', v)} />
              <Field label="Email address" value={content.contact.email}
                onChange={v => set('contact', 'email', v)} />
            </>
          )}

          {tab === 'footer' && (
            <>
              <Field label="Footer tagline" value={content.footer.tagline}
                onChange={v => set('footer', 'tagline', v)} multiline />
            </>
          )}
        </div>
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .adm {
          display: flex;
          min-height: 100svh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        /* Sidebar */
        .adm-side {
          width: 220px;
          flex-shrink: 0;
          background: #271918;
          display: flex;
          flex-direction: column;
          padding: 28px 20px;
          position: sticky;
          top: 0;
          height: 100svh;
        }
        .adm-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
        }
        .adm-logo {
          background: #9b7a5e;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .06em;
          padding: 4px 7px;
          border-radius: 4px;
        }
        .adm-title {
          color: #d8cac1;
          font-size: 13px;
          font-weight: 600;
        }
        .adm-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .adm-tab {
          text-align: left;
          background: none;
          border: none;
          color: #9b8880;
          font-size: 14px;
          font-weight: 500;
          padding: 9px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: background .15s, color .15s;
        }
        .adm-tab:hover { background: rgba(255,255,255,.06); color: #d8cac1; }
        .adm-tab.active { background: rgba(255,255,255,.1); color: #fff; font-weight: 600; }
        .adm-side-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .adm-view-site {
          color: #9b7a5e;
          font-size: 13px;
          text-decoration: none;
          padding: 8px 12px;
          display: block;
        }
        .adm-view-site:hover { color: #d8cac1; }
        .adm-logout {
          width: 100%;
          background: none;
          border: 1px solid rgba(255,255,255,.12);
          color: #9b8880;
          font-size: 13px;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          transition: border-color .15s, color .15s;
        }
        .adm-logout:hover { border-color: rgba(255,255,255,.3); color: #d8cac1; }
        /* Main */
        .adm-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100svh;
        }
        .adm-topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 28px 40px 20px;
          border-bottom: 1px solid #e5e5e5;
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .adm-section-title {
          font-size: 20px;
          font-weight: 600;
          color: #271918;
          margin: 0 0 4px;
        }
        .adm-notice {
          font-size: 12px;
          color: #b7862a;
          margin: 0;
        }
        .adm-notice a { color: #b7862a; }
        .adm-save {
          flex-shrink: 0;
          padding: 10px 22px;
          background: #271918;
          color: #f4efeb;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background .2s, opacity .2s;
          min-width: 130px;
        }
        .adm-save:hover:not(:disabled) { background: #3a2b28; }
        .adm-save:disabled { opacity: .6; cursor: default; }
        .adm-fields {
          padding: 36px 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 780px;
        }
        .adm-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        /* Field */
        .adm-field { display: flex; flex-direction: column; gap: 6px; }
        .adm-field label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .04em;
          color: #271918;
          text-transform: uppercase;
        }
        .adm-field .hint {
          font-size: 11px;
          color: #9b8880;
          margin: -2px 0 0;
        }
        .adm-field input,
        .adm-field textarea {
          padding: 10px 14px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          color: #271918;
          background: #fff;
          outline: none;
          transition: border-color .2s;
          resize: vertical;
        }
        .adm-field input:focus,
        .adm-field textarea:focus { border-color: #9b7a5e; box-shadow: 0 0 0 3px rgba(155,122,94,.1); }
        .adm-field textarea { min-height: 90px; line-height: 1.6; }
      `}</style>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  multiline,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  hint?: string
}) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      {hint && <span className="hint">{hint}</span>}
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={4} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  )
}
