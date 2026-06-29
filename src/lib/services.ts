export type Service = {
  id: string
  index: string
  title: string
  description: string
  tags: string[]
  image: string
}

export const services: Service[] = [
  {
    id: 'corporate-law',
    index: '01',
    title: 'Corporate Law',
    description: 'From incorporation and shareholder agreements to corporate governance and restructuring, we advise businesses at every stage of their lifecycle in Georgia. Our team brings deep expertise in Georgian company law combined with international structuring experience.',
    tags: ['Incorporation', 'Shareholders\' Agreements', 'Corporate Governance', 'Restructuring', 'Joint Ventures'],
    image: 'https://picsum.photos/seed/svc1/800/600',
  },
  {
    id: 'ma-transactions',
    index: '02',
    title: 'M&A & Transactions',
    description: 'We advise acquirers, targets, and financial sponsors on the full spectrum of M&A activity in Georgia — from sell-side preparation and buy-side due diligence through to documentation, regulatory approvals, and post-completion integration support.',
    tags: ['Buy-side M&A', 'Sell-side M&A', 'Due Diligence', 'SPA Drafting', 'Regulatory Clearance'],
    image: 'https://picsum.photos/seed/svc2/800/600',
  },
  {
    id: 'commercial-contracts',
    index: '03',
    title: 'Commercial Contracts',
    description: 'Robust commercial agreements are the foundation of stable business relationships. We draft, review, and negotiate a full range of commercial contracts — from supply and distribution agreements to licensing, agency, and long-form infrastructure contracts.',
    tags: ['Supply Agreements', 'Distribution', 'Licensing', 'Agency', 'Service Agreements'],
    image: 'https://picsum.photos/seed/svc3/800/600',
  },
  {
    id: 'dispute-resolution',
    index: '04',
    title: 'Dispute Resolution',
    description: 'When disputes arise, we provide strategic advice and representation across Georgia\'s state courts, the Arbitration Court of Georgia, and international arbitration proceedings. We also advise on alternative dispute resolution and settlement strategy.',
    tags: ['Litigation', 'Arbitration', 'Mediation', 'Debt Recovery', 'Enforcement'],
    image: 'https://picsum.photos/seed/svc4/800/600',
  },
  {
    id: 'employment-law',
    index: '05',
    title: 'Employment Law',
    description: 'We support employers at every stage of the employment relationship — from drafting compliant contracts and workplace policies to managing terminations and defending employment claims. Our team regularly advises on workforce restructuring in the context of M&A transactions.',
    tags: ['Employment Contracts', 'HR Policies', 'Termination', 'Redundancy', 'Immigration'],
    image: 'https://picsum.photos/seed/svc5/800/600',
  },
  {
    id: 'real-estate',
    index: '06',
    title: 'Real Estate & Development',
    description: 'Georgia\'s real estate market offers significant opportunities for domestic and foreign investors. We provide end-to-end legal support for property acquisition, development projects, financing structures, and commercial leasing across residential, commercial, and hospitality asset classes.',
    tags: ['Acquisition', 'Development', 'Project Finance', 'Commercial Leasing', 'Construction Contracts'],
    image: 'https://picsum.photos/seed/svc6/800/600',
  },
]

export const industries = [
  'Banking & Financial Services',
  'Real Estate & Construction',
  'Technology & Fintech',
  'Energy & Infrastructure',
  'Hospitality & Tourism',
  'Manufacturing & Trade',
  'Healthcare & Life Sciences',
  'Retail & Consumer',
]
