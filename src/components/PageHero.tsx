import Eyebrow from './Eyebrow'

type Props = {
  eyebrow: string
  title: string
  lede?: string
  breadcrumb?: { label: string; href: string }
}

export default function PageHero({ eyebrow, title, lede, breadcrumb }: Props) {
  return (
    <section className="page-hero">
      <div className="wrap">
        {breadcrumb && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href={breadcrumb.href}>{breadcrumb.label}</a>
            <span aria-hidden>›</span>
            <span>{title}</span>
          </nav>
        )}
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
    </section>
  )
}
