export const defaultContent = {

  // ── Global / Shared ─────────────────────────────────────────────────
  contact: {
    address_1: '4 Chavchavadze Ave, Floor 3',
    address_2: 'Tbilisi 0179, Georgia',
    phone: '+995 32 200 00 00',
    email: 'info@aplaw.ge',
  },
  footer: {
    tagline: 'Business law counsel for companies operating in and through Georgia. Straightforward advice. Lasting relationships.',
  },

  // ── Homepage: Hero ──────────────────────────────────────────────────
  home_hero: {
    eyebrow: 'Business Law Firm · Est. 2013',
    headline_1: 'Clear counsel',
    headline_em: 'business',
    headline_3: 'in Georgia.',
    lede: 'Abashidze & Partners provides straightforward legal advice to companies operating in and through Georgia — from first registration to complex M&A.',
    cta_primary: 'Explore Services',
    cta_secondary: 'Talk to a Lawyer',
  },

  // ── Homepage: Stats ─────────────────────────────────────────────────
  home_stats: {
    s1_value: '16', s1_unit: '+', s1_label: 'Years of practice',
    s2_value: '600', s2_unit: '+', s2_label: 'Matters completed',
    s3_value: '6', s3_unit: '', s3_label: 'Practice areas',
    s4_value: '3', s4_unit: '', s4_label: 'Languages',
  },

  // ── Homepage: About preview ─────────────────────────────────────────
  home_about: {
    eyebrow: 'About the Firm',
    headline: 'Rooted in Tbilisi.\nFluent in business.',
    body: 'Founded in 2013, Abashidze & Partners has grown into one of Tbilisi\'s leading business law practices. We serve local companies, foreign investors, and international firms with Georgian operations.',
    p1_title: 'Independent & conflict-free',
    p1_body: 'No bank or corporate parent. We work exclusively for our clients\' interests.',
    p2_title: 'Deep local knowledge',
    p2_body: 'Our team has navigated Georgian law through multiple legislative cycles and regulatory shifts.',
    p3_title: 'International perspective',
    p3_body: 'Educated and trained across Europe and the US; fluent in how international business expects to be served.',
    cta: 'About the firm',
  },

  // ── Homepage: Approach ──────────────────────────────────────────────
  home_approach: {
    eyebrow: 'Our Approach',
    heading: 'How we work with clients',
    s1_n: '01', s1_title: 'Listen first',
    s1_body: 'We take time to understand your business, your goals, and the specific constraints you face before advising on any course of action.',
    s2_n: '02', s2_title: 'Advise clearly',
    s2_body: 'No unnecessary legalese. We provide direct, practical advice in plain language — with the legal reasoning available if you want it.',
    s3_n: '03', s3_title: 'Move decisively',
    s3_body: 'Business moves fast. We respond to clients the same day and structure our work to meet commercial timelines, not legal ones.',
    s4_n: '04', s4_title: 'Stay accountable',
    s4_body: 'We maintain close partner involvement on every matter. You always know who is responsible and how your matter is progressing.',
  },

  // ── Homepage: Quote band ────────────────────────────────────────────
  home_quote: {
    text: 'The law should give you {clarity}, not confusion. We exist to make that true for every client we work with.',
    em: 'clarity',
    attribution: 'Giorgi Abashidze, Managing Partner',
  },

  // ── Homepage: CTA section ───────────────────────────────────────────
  home_cta: {
    eyebrow: 'Get in touch',
    heading: 'Ready to discuss your matter?',
    body: 'We offer an initial consultation to understand your situation and explain how we can help. No commitment required.',
    cta_primary: 'Book Consultation',
    cta_secondary: 'Call us',
    form_heading: 'Send a message',
  },

  // ── About page ──────────────────────────────────────────────────────
  about_hero: {
    eyebrow: 'About the Firm',
    title: 'Independent counsel since 2013',
    lede: 'We are a Tbilisi-based business law firm advising companies on Georgian law matters — with the international perspective that cross-border clients require.',
  },

  // ── Services page ───────────────────────────────────────────────────
  services_hero: {
    eyebrow: 'Practice Areas',
    title: 'Legal services built around your business',
    lede: 'Six practice areas covering every stage of your business in Georgia — from founding through growth, transactions, and beyond.',
  },
  services_cta: {
    heading: 'Have a matter to discuss?',
    body: 'Tell us about your situation and we\'ll explain how we can help — in a free initial consultation.',
    cta: 'Book a Consultation',
  },
  services_items: {
    s1_title: 'Corporate Law',
    s1_desc: 'From incorporation and shareholder agreements to corporate governance and restructuring, we advise businesses at every stage of their lifecycle in Georgia.',
    s2_title: 'M&A & Transactions',
    s2_desc: 'We advise acquirers, targets, and financial sponsors on the full spectrum of M&A activity in Georgia — from sell-side preparation and buy-side due diligence through to documentation, regulatory approvals, and post-completion integration support.',
    s3_title: 'Commercial Contracts',
    s3_desc: 'Robust commercial agreements are the foundation of stable business relationships. We draft, review, and negotiate a full range of commercial contracts.',
    s4_title: 'Dispute Resolution',
    s4_desc: 'When disputes arise, we provide strategic advice and representation across Georgia\'s state courts, the Arbitration Court of Georgia, and international arbitration proceedings.',
    s5_title: 'Employment Law',
    s5_desc: 'We support employers at every stage of the employment relationship — from drafting compliant contracts and workplace policies to managing terminations and defending employment claims.',
    s6_title: 'Real Estate & Development',
    s6_desc: 'Georgia\'s real estate market offers significant opportunities for domestic and foreign investors. We provide end-to-end legal support for property acquisition, development projects, and commercial leasing.',
  },

  // ── Contact page ────────────────────────────────────────────────────
  contact_hero: {
    eyebrow: 'Contact',
    title: 'Let\'s talk about your matter',
    lede: 'We offer a free initial consultation to understand your situation. Use the form or reach us directly.',
  },

  // ── Insights page ───────────────────────────────────────────────────
  insights_hero: {
    eyebrow: 'Insights',
    title: 'Legal perspectives on Georgian business',
    lede: 'Practical commentary on the laws, regulations, and developments that matter to companies operating in Georgia.',
  },
}

export type SiteContent = typeof defaultContent
