import Link from 'next/link'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import FaqAccordion from '@/components/FaqAccordion'
import FaqSchema from '@/components/FaqSchema'
import { services, industries } from '@/lib/services'
import { getContent } from '@/lib/content'

export const metadata = {
  title: 'Practice Areas — Abashidze & Partners',
  description: 'Six practice areas covering the full range of business legal needs in Georgia: corporate law, M&A, commercial contracts, disputes, employment, and real estate.',
}

type FaqItem = { question: string; answer: string }

const serviceFaqs: Record<string, FaqItem[]> = {
  'corporate-law': [
    {
      question: 'What types of companies can foreign investors register in Georgia?',
      answer: 'Foreign investors can register a Limited Liability Company (LLC), Joint Stock Company (JSC), or open a branch or representative office of a foreign entity. An LLC is the most common structure for foreign-owned businesses due to its flexibility and simple governance. Incorporation typically takes 1–3 business days through Georgia\'s National Agency of Public Registry (NAPR).',
    },
    {
      question: 'Can a company in Georgia be 100% foreign-owned?',
      answer: 'Yes. Georgia imposes no restrictions on 100% foreign ownership of companies in most sectors. A foreign individual or entity can be the sole shareholder and director of a Georgian LLC or JSC. There are limited sector-specific exceptions — agricultural land ownership by foreign nationals is restricted — but for the vast majority of business activities, full foreign ownership is permitted without any local partner requirement.',
    },
    {
      question: 'What ongoing corporate compliance obligations apply to Georgian companies?',
      answer: 'Georgian companies must file annual financial statements with the NAPR and maintain accurate accounting records. Companies with turnover above certain thresholds are required to have their accounts audited. VAT registration is mandatory once annual turnover exceeds GEL 100,000. Directors must notify the registry of changes to shareholders, registered address, or charter capital. Failure to comply can result in administrative penalties.',
    },
  ],
  'ma-transactions': [
    {
      question: 'What legal due diligence should be conducted when acquiring a Georgian company?',
      answer: 'A thorough acquisition due diligence in Georgia covers corporate records (charter, shareholder register, board resolutions), title to assets, material contracts, employment obligations, intellectual property, tax position (including any outstanding assessments), litigation history, and regulatory or licensing requirements specific to the target\'s sector. We access official registries — NAPR, Revenue Service, and courts — to verify disclosures and identify undisclosed liabilities.',
    },
    {
      question: 'Are there sector-specific approvals or restrictions for foreign acquisitions in Georgia?',
      answer: 'Most M&A transactions in Georgia do not require pre-approval. However, acquisitions in regulated sectors — banking, insurance, broadcasting, and certain infrastructure — require approval from the relevant regulator (National Bank of Georgia, Communications Commission, etc.). Competition law merger filings are required if the combined turnover of the parties exceeds thresholds set by the Competition Agency of Georgia. Agricultural land acquisitions by foreign nationals are restricted under the Constitution.',
    },
    {
      question: 'How are M&A transactions typically structured and documented in Georgia?',
      answer: 'Georgian M&A transactions typically use a share purchase agreement (SPA) governed by Georgian law, though parties may choose a foreign governing law for cross-border deals. The SPA includes representations, warranties, indemnities, and post-completion adjustments. Share transfers in an LLC are notarised before a Public Registry employee; JSC share transfers are recorded in the shareholder register. We coordinate all notarial steps and registry filings as part of our transaction management.',
    },
  ],
  'commercial-contracts': [
    {
      question: 'Is English valid for commercial contracts in Georgia?',
      answer: 'Yes. Parties to a commercial contract in Georgia are free to use any language, including English. However, contracts that must be filed with a Georgian authority — such as real estate transfer deeds, pledge agreements, and charter amendments — are required to be in Georgian or accompanied by a certified translation. For private B2B contracts, an English-language agreement is fully enforceable in Georgian courts or arbitration.',
    },
    {
      question: 'Which law governs commercial contracts between Georgian and foreign companies?',
      answer: 'Georgian law permits parties to freely choose the governing law of their contract. Many international parties choose English law or another common-law jurisdiction for cross-border contracts. If no governing law is specified, Georgian courts will apply conflict-of-law rules — typically pointing to the law of the country most closely connected to the contract. We advise on governing law selection and ensure the chosen law is properly incorporated into the agreement.',
    },
    {
      question: 'What makes a commercial contract enforceable under Georgian law?',
      answer: 'Under the Georgian Civil Code, a valid contract requires offer and acceptance, a lawful object, and mutual consent free from fraud or duress. Certain contracts — including real estate transfers, pledge agreements, and charter amendments — require notarial form to be valid. Written form is generally sufficient for most commercial agreements. Penalty clauses and limitation-of-liability provisions are broadly enforceable, subject to the court\'s discretion to reduce excessive penalties.',
    },
  ],
  'dispute-resolution': [
    {
      question: 'Can foreign companies bring commercial claims in Georgian courts?',
      answer: 'Yes. Foreign companies have full standing to bring claims in Georgian courts and are treated on the same procedural footing as Georgian entities. The Commercial Chamber of Tbilisi City Court handles most business disputes. Court proceedings are conducted in Georgian; foreign parties must submit translated and, where required, apostilled documents. We provide full representation and translation coordination.',
    },
    {
      question: 'Is Georgia a signatory to international arbitration conventions?',
      answer: 'Yes. Georgia is a signatory to the 1958 New York Convention on the Recognition and Enforcement of Foreign Arbitral Awards, which means arbitral awards issued in other signatory states are enforceable in Georgia through a straightforward court registration process. International parties frequently choose ICC, LCIA, or Vienna arbitration for cross-border disputes with a Georgian nexus.',
    },
    {
      question: 'How long do commercial disputes typically take to resolve in Georgia?',
      answer: 'First-instance commercial proceedings in Georgia typically take 6–18 months depending on complexity. Appeals add a further 6–12 months. Arbitration at the Arbitration Court of Georgia is generally faster — most cases conclude within 3–9 months. For straightforward debt recovery, summary proceedings can result in an enforceable payment order within a few weeks. Enforcement against solvent defendants is usually efficient once an enforcement order is obtained.',
    },
  ],
  'employment-law': [
    {
      question: 'What must an employment contract include under Georgian labour law?',
      answer: 'Under the Georgian Labour Code, an employment contract must specify: employer and employee details, position and duties, place of work, start date and duration (if fixed-term), working hours, remuneration, and rest periods. Fixed-term contracts may be used for up to 3 years; beyond that, the relationship converts to an open-ended contract by operation of law. Probationary periods cannot exceed 6 months and must be agreed in writing.',
    },
    {
      question: 'What are the rules for terminating employees in Georgia?',
      answer: 'Georgian law permits termination for reasons including economic restructuring, employee performance, and breach of duties. The employer must give written notice — at least 30 days for redundancy, or pay in lieu. Severance equal to one month\'s salary is payable in redundancy cases. Certain categories of employee — including pregnant women and those on maternity leave — are protected from dismissal. We advise on termination strategy to minimise litigation risk.',
    },
    {
      question: 'What work permits and visas are required for foreign nationals working in Georgia?',
      answer: 'Citizens of most countries can enter Georgia visa-free and work for up to 1 year without a work permit under Georgia\'s open immigration policy. For longer assignments, a residence permit with the right to work must be obtained. Employers must register foreign employees with the Revenue Service for tax purposes. We advise on immigration structuring, tax residency implications, and ensure all required registrations are completed for international staff.',
    },
  ],
  'real-estate': [
    {
      question: 'Can foreign nationals and companies own real estate in Georgia?',
      answer: 'Foreign individuals and foreign-owned companies may freely purchase and own commercial real estate and residential property in Georgia. Agricultural land is the main exception — foreign nationals and foreign-owned companies cannot own agricultural land under Georgia\'s constitution, though long-term leases of up to 49 years are available as an alternative. All property ownership is recorded in the Public Registry (NAPR), which provides reliable, searchable title records.',
    },
    {
      question: 'What due diligence is essential before purchasing property in Georgia?',
      answer: 'Property due diligence in Georgia involves: verifying title at the NAPR to confirm the seller owns the property free of mortgages, pledges, and encumbrances; checking for pending litigation or enforcement proceedings; reviewing planning and land-use designations; confirming any co-ownership or third-party rights; and, for development land, verifying construction permits and utility connections. For commercial acquisitions we also review existing leases and tenant rights.',
    },
    {
      question: 'How is property transfer taxed in Georgia?',
      answer: 'The transfer of real estate by an individual is subject to 5% income tax on the profit if the property was held for less than 2 years; gains on property held longer are tax-exempt for individuals. Companies pay 15% corporate income tax on property sale profits. There is no stamp duty or property transfer tax on purchases in Georgia. The buyer pays a small NAPR registration fee (typically GEL 150–300). We advise on structuring acquisitions tax-efficiently.',
    },
  ],
}

const allFaqs = Object.values(serviceFaqs).flat()

export default async function ServicesPage() {
  const c = await getContent()
  return (
    <>
      <FaqSchema items={allFaqs} />

      <PageHero
        eyebrow={c.services_hero.eyebrow}
        title={c.services_hero.title}
        lede={c.services_hero.lede}
        breadcrumb={{ label: 'Home', href: '/' }}
      />

      {/* Service rows */}
      <section className="section-sm">
        <div className="wrap">
          {services.map((svc, i) => (
            <Reveal key={svc.id}>
              <div id={svc.id}>
                <div className={`svc-row${i % 2 !== 0 ? ' alt' : ''}`}>
                  <div className="svc-row-text">
                    <div className="svc-row-idx">{svc.index}</div>
                    <h2>{svc.title}</h2>
                    <p>{svc.description}</p>
                    <div className="sub-tags">
                      {svc.tags.map(tag => (
                        <span key={tag} className="sub-tag">{tag}</span>
                      ))}
                    </div>
                    <Link href="/contact" className="btn btn-ghost">
                      Discuss your matter <span className="arr" aria-hidden>→</span>
                    </Link>
                  </div>
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    width={600}
                    height={450}
                    className="svc-row-img"
                  />
                </div>
                {serviceFaqs[svc.id] && (
                  <div className="svc-faq">
                    <p className="svc-faq-label">Common<br />questions</p>
                    <FaqAccordion items={serviceFaqs[svc.id]} />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="section-sm" style={{ background: 'var(--cream-2)' }}>
        <div className="wrap">
          <Reveal style={{ marginBottom: 48, textAlign: 'center' }}>
            <Eyebrow>Sectors</Eyebrow>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, marginTop: 12 }}>
              Industries we serve
            </h2>
          </Reveal>
          <div className="industries-grid">
            {industries.map((name, i) => (
              <Reveal key={name} delay={(i % 4) * 0.07}>
                <div className="industry-cell">
                  <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                  <span className="name">{name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="wrap">
          <Reveal>
            <h2>{c.services_cta.heading}</h2>
            <p>{c.services_cta.body}</p>
            <Link href="/contact" className="btn btn-dark-gold">
              {c.services_cta.cta} <span className="arr" aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
