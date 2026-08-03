(function () {
  const SITE_ORIGIN = 'https://www.aaccounting.me';
  const INSIGHTS_BASE = '/insights';

  const PAGE_TO_PATH = {
    home: '/',
    services: '/services',
    'service-vat': '/services/vat',
    'service-corporate-tax': '/services/corporate-tax',
    'service-bookkeeping': '/services/bookkeeping',
    'service-audit-support': '/services/audit-support',
    'service-valuations': '/services/valuations',
    'service-transaction-advisory': '/services/transaction-advisory',
    'service-cfo': '/services/cfo-services',
    'service-financial-statements': '/services/financial-statements',
    'service-tax-planning': '/services/tax-planning',
    'service-fixed-asset-tagging': '/services/fixed-asset-tagging',
    'service-forensic-accounting': '/services/forensic-accounting',
    'service-internal-controls': '/services/internal-controls',
    'service-financial-modelling': '/services/financial-modelling',
    'service-feasibility-studies': '/services/feasibility-studies',
    'service-strategic-advisory': '/services/strategic-advisory',
    'e-invoicing': '/e-invoicing',
    industries: '/industries',
    'industry-real-estate': '/industries/real-estate',
    'industry-construction': '/industries/construction',
    'industry-trading': '/industries/trading',
    'industry-hospitality': '/industries/hospitality',
    'industry-ecommerce': '/industries/ecommerce',
    'industry-manufacturing': '/industries/manufacturing',
    about: '/about',
    insights: '/insights',
    careers: '/careers',
    contact: '/contact',
    privacy: '/privacy',
    terms: '/terms',
  };

  const PATH_ALIASES = {
    '/service-vat': 'service-vat',
  };

  // 'insight' is a valid page id (single-article view) but has no fixed entry in
  // PAGE_TO_PATH — its URL is /insights/<slug>, resolved via pathForInsight().
  const VALID_PAGES = new Set([...Object.keys(PAGE_TO_PATH), 'insight']);

  // ---- Insights registry: single source of truth for every article card ----
  // `published: true` articles have a written body in page-other.jsx; the rest
  // render an honest "in preparation" state so a card never shows the wrong note.
  const INSIGHTS = [
    {
      slug: 'ifrs-financial-statements-uae',
      seoTitle: 'IFRS Financial Statements in the UAE: Who Needs Them', seoDesc: 'Who must prepare IFRS statements in the UAE, the standards Corporate Tax accepts (IFRS, IFRS for SMEs, cash basis), and what a complete set contains.',
      tag: 'Financial Reporting', date: '15 Apr 2026', read: '7 min',
      title: 'IFRS financial statements in the UAE: who needs them, and what a full set contains.',
      author: 'Sabith Abdul Rahman', reviewer: 'Jinu Govindan', reference: 'Ministerial Decision No. 114 of 2023 (accounting standards for UAE Corporate Tax)',
      excerpt: 'Who must prepare IFRS financial statements in the UAE, the accounting standards Corporate Tax requires (IFRS, IFRS for SMEs up to AED 50M, cash basis up to AED 3M), what a complete set contains, and why audit-ready statements matter for free zones, banks and the FTA.',
      published: true,
    },
    {
      slug: 'prepare-erp-for-uae-e-invoicing',
      seoTitle: 'UAE E-Invoicing ERP Readiness Checklist', seoDesc: 'Master-data hygiene, field mapping, tax-code cleanup and testing — the ERP groundwork that decides whether your UAE e-invoicing go-live is smooth.',
      tag: 'E-Invoicing', date: '10 Mar 2026', read: '6 min',
      title: 'Getting your ERP ready for UAE e-invoicing: a practical checklist.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'Ministerial Decisions 243 and 244 of 2025 (as amended by MD 66 of 2026), UAE Ministry of Finance', updated: '20 Jul 2026',
      excerpt: 'E-invoicing is not just a tax change — it is a data change. The master-data hygiene, field mapping and testing that decide whether your go-live is smooth or painful.',
      published: true,
    },
    {
      slug: 'choosing-accredited-service-provider-asp',
      seoTitle: 'UAE E-Invoicing ASP List: 42 Pre-Approved Providers', seoDesc: 'How to choose an Accredited Service Provider for UAE e-invoicing — with the full MoF pre-approved list of 42 providers and the questions to ask first.',
      tag: 'E-Invoicing', date: '22 Jan 2026', read: '6 min',
      title: 'Choosing an Accredited Service Provider (ASP) for UAE e-invoicing.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'Ministerial Decisions 243 and 244 of 2025 (as amended by MD 66 of 2026) and MD 64 of 2025 (as amended by MD 56 of 2026), UAE Ministry of Finance', updated: '20 Jul 2026',
      excerpt: 'Every in-scope business must appoint an Accredited Service Provider to transmit its e-invoices. What an ASP does, pre-approved vs accredited status, the full MoF pre-approved list (42 providers, July 2026), and the questions to ask before you sign.',
      published: true,
    },
    {
      slug: 'uae-e-invoicing-deadlines-phases',
      seoTitle: 'UAE E-Invoicing Deadlines & Phases: Full Timeline', seoDesc: 'The UAE e-invoicing rollout tier by tier: ASP appointment deadlines and mandatory go-live dates by annual revenue, laid out in one clear timeline.',
      tag: 'E-Invoicing', date: '08 Dec 2025', read: '5 min',
      title: 'UAE e-invoicing deadlines and phases: who must comply, and by when.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'Ministerial Decisions 243 and 244 of 2025 (as amended by MD 66 of 2026), UAE Ministry of Finance', updated: '20 Jul 2026',
      excerpt: 'The rollout is phased by annual revenue, with two dates that matter for each business — the deadline to appoint an Accredited Service Provider, and the mandatory go-live. Here is the full timeline, tier by tier.',
      published: true,
    },
    {
      slug: 'uae-e-invoicing-explained',
      seoTitle: 'UAE E-Invoicing Explained: Peppol 5-Corner Guide', seoDesc: 'Plain-English guide to the UAE’s mandatory B2B and B2G e-invoicing: what actually changes, why, and how the Peppol 5-corner model reshapes invoicing.',
      tag: 'E-Invoicing', date: '17 Nov 2025', read: '7 min',
      title: 'UAE e-invoicing explained: a plain-English guide for businesses.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'Ministerial Decisions 243 and 244 of 2025 (as amended by MD 66 of 2026), UAE Ministry of Finance', updated: '20 Jul 2026',
      excerpt: 'The UAE is moving to mandatory structured e-invoicing for B2B and B2G transactions. What that actually means, why it is happening, and how the OpenPeppol 5-corner model changes the way you issue an invoice.',
      published: true,
    },
    {
      slug: 'free-zone-qualifying-income',
      seoTitle: 'Free Zone Qualifying Income: 3 UAE Corporate Tax Traps', seoDesc: 'Three ways tax teams misread the UAE free-zone rules under Cabinet Decision 100 and Ministerial Decision 229 of 2025 — and what each trap costs at filing.',
      tag: 'Corporate Tax', date: '06 May 2025', read: '6 min',
      title: 'Free zone qualifying income — three traps in the UAE free-zone tax rules.',
      author: 'Sabith Abdul Rahman', reviewer: 'Jinu Govindan', reference: 'Cabinet Decision 100 of 2023 · Ministerial Decision 229 of 2025 (replacing MD 265 of 2023)',
      excerpt: 'The UAE’s free-zone tax rules — Cabinet Decision 100 of 2023 and Ministerial Decision 229 of 2025 (which replaced MD 265 of 2023) — are being read three different ways by tax teams in the UAE. We unpack the three traps we keep seeing in client positions, and what the consequence is at filing.',
      published: true,
    },
    {
      slug: 'uae-corporate-tax-guide-sme',
      seoTitle: 'UAE Corporate Tax Guide for SMEs & Free Zones 2026', seoDesc: 'Who pays 0% and 9%, registration and the AED 10,000 late penalty, Small Business Relief and its 2026 sunset, QFZP status and the 15% top-up tax.',
      tag: 'Corporate Tax', date: '18 Feb 2025', read: '8 min',
      title: 'UAE Corporate Tax: a complete guide for SMEs and free-zone businesses.',
      author: 'Jinu Govindan', reviewer: 'Sabith Abdul Rahman', reference: 'Federal Decree-Law No. 47 of 2022 (UAE Corporate Tax)',
      excerpt: 'Who pays UAE Corporate Tax, the 0% and 9% bands, registration and the AED 10,000 late-registration penalty, the nine-month filing deadline, Small Business Relief and its 31 December 2026 sunset, free-zone QFZP status, and the 15% domestic minimum top-up tax — in plain English for UAE businesses.',
      published: true,
    },
    {
      slug: 'outsourced-bookkeeping-dubai',
      seoTitle: 'Outsourced Bookkeeping in Dubai: What Good Looks Like', seoDesc: 'What proper outsourced bookkeeping covers in a VAT and Corporate Tax world, the record-retention rules, and when to outsource versus hire in-house.',
      tag: 'Bookkeeping', date: '12 Sep 2023', read: '6 min',
      title: 'Outsourced bookkeeping in Dubai: what good looks like in a VAT and Corporate Tax world.',
      author: 'Johncy', reviewer: 'Jinu Govindan', reference: 'UAE VAT (FDL 8 of 2017) & Corporate Tax (FDL 47 of 2022) record-keeping requirements',
      excerpt: 'Since VAT and Corporate Tax arrived, clean books are a legal requirement, not a nicety. What proper outsourced bookkeeping covers, the record-retention rules (five years for VAT, seven for Corporate Tax), and when to outsource versus hire in-house.',
      published: true,
    },
    {
      slug: 'uae-vat-guide-dubai',
      seoTitle: 'UAE VAT Registration, Filing & Recovery: Dubai Guide', seoDesc: 'The 5% rate, AED 375,000 and AED 187,500 registration thresholds, EmaraTax filing deadlines, input-VAT recovery and the zero-rated vs exempt line.',
      tag: 'VAT', date: '20 Mar 2023', read: '7 min',
      title: 'VAT in the UAE: registration, filing and recovery — a Dubai business guide.',
      author: 'Jinu Govindan', reviewer: 'Sabith Abdul Rahman', reference: 'Federal Decree-Law No. 8 of 2017 on VAT (as amended)',
      excerpt: 'The 5% standard rate, the AED 375,000 mandatory and AED 187,500 voluntary registration thresholds, EmaraTax filing and the 28-day deadline, input-VAT recovery, and the zero-rated vs exempt distinction — what every UAE business needs to get right.',
      published: true,
    },
    {
      slug: 'uae-corporate-tax-is-coming',
      seoTitle: 'UAE Corporate Tax at 9%: Preparing Your Business', seoDesc: 'Written as the 9% federal Corporate Tax was announced: the AED 375,000 threshold, effective dates and the groundwork to lay before day one.',
      tag: 'Corporate Tax', date: '28 Sep 2022', read: '5 min',
      title: 'UAE Corporate Tax is coming: what businesses should start doing now.',
      author: 'Jinu Govindan', reviewer: 'Sabith Abdul Rahman', reference: 'UAE Ministry of Finance Corporate Tax announcement (2022)',
      excerpt: 'The UAE has confirmed a federal Corporate Tax from financial years starting on or after 1 June 2023. Written as the regime was announced — the headline 9% rate, the AED 375,000 threshold, and the groundwork to lay before it arrives.',
      published: true,
    },
    {
      slug: 'management-accounts-that-drive-decisions',
      seoTitle: 'Management Accounts That Drive Decisions: UAE Guide', seoDesc: 'What belongs in a monthly management pack a UAE owner-manager can actually steer by — the KPIs, cash view and variances that lead to decisions.',
      tag: 'Advisory', date: '14 Oct 2021', read: '5 min',
      title: 'Management accounts that actually drive decisions.',
      author: 'Sabith Abdul Rahman', reviewer: 'Jinu Govindan',
      excerpt: 'Statutory accounts look backward; management accounts should help you steer. What belongs in a monthly pack a UAE owner-manager can actually run the business on.',
      published: true,
    },
    {
      slug: 'protecting-cash-flow-downturn',
      seoTitle: 'Protecting Cash Flow in a Downturn: 13-Week Method', seoDesc: 'Profit is an opinion, cash is a fact. A practical 13-week cash-flow discipline for UAE SMEs when revenue suddenly slows, written in the 2020 slowdown.',
      tag: 'Advisory', date: '20 May 2020', read: '5 min',
      title: 'Protecting cash flow when revenue stalls.',
      author: 'Jinu Kurikesu', reviewer: 'Jinu Govindan',
      excerpt: 'Written in the 2020 slowdown: profit is an opinion, cash is a fact. A practical 13-week cash discipline for UAE SMEs when revenue suddenly slows.',
      published: true,
    },
    {
      slug: 'economic-substance-regulations-uae',
      seoTitle: 'Economic Substance Regulations UAE: Are You in Scope?', seoDesc: 'Which relevant activities bring a UAE company into ESR scope, the notification and reporting duties that follow, and what filing actually requires.',
      tag: 'Compliance', date: '16 Sep 2019', read: '5 min',
      title: 'Economic Substance Regulations: do they apply to your UAE company?',
      author: 'Rijo Mathew', reviewer: 'Jinu Govindan', reference: 'UAE Economic Substance Regulations (Cabinet Resolution, 2019)',
      excerpt: 'The UAE’s Economic Substance Regulations introduced notification and reporting duties for companies carrying on “relevant activities”. How to tell whether you are in scope — and what filing actually requires.',
      published: true,
    },
    {
      slug: 'uae-vat-5-percent-primer',
      seoTitle: 'UAE VAT at 5%: A First-Principles Primer (2018)', seoDesc: 'From 1 January 2018 the UAE introduced 5% VAT. A first-principles primer from the year it landed — who registers, what to charge, which records to keep.',
      tag: 'VAT', date: '26 Feb 2018', read: '4 min',
      title: 'VAT has arrived: a 5% primer for UAE businesses.',
      author: 'Rijo Mathew', reviewer: 'Jinu Govindan', reference: 'Federal Decree-Law No. 8 of 2017 on VAT',
      excerpt: 'From 1 January 2018 the UAE introduced a 5% Value Added Tax. A first-principles primer from the year it landed — who registers, what to charge, and the records to keep from day one.',
      published: true,
    },
    {
      slug: 'bookkeeping-foundation',
      seoTitle: 'Bookkeeping Discipline: The Foundation of a Business', seoDesc: 'Clean, reconciled books are not overhead — they are what every financing, audit and tax position is built on. The firm’s founding note from 2017.',
      tag: 'Bookkeeping', date: '11 Dec 2017', read: '4 min',
      title: 'Why disciplined bookkeeping is the foundation of every business.',
      author: 'Jinu Govindan', reviewer: 'Johncy',
      excerpt: 'Our first note, from the firm’s founding: clean, reconciled books are not overhead — they are the foundation every financing, audit and tax position is built on. The discipline we have run on ever since.',
      published: true,
    },
    {
      slug: 'dcf-terminal-values-family-office',
      seoTitle: 'DCF Terminal Values: Where UAE Family Offices Drift', seoDesc: 'Terminal value carries most of a DCF’s weight — and it is where UAE family-office valuations most often go wrong. The assumptions we test first.',
      tag: 'Valuations', date: '24 Mar 2021', read: '9 min',
      title: 'Why DCF terminal values are mispriced for UAE family-office holdings.',
      author: 'Jinu Govindan',
      excerpt: 'Terminal value carries most of the weight in a DCF, yet it is where UAE family-office valuations most often drift. A note on the assumptions we test first.',
      published: true,
    },
    {
      slug: 'control-framework-erp-migrations',
      seoTitle: 'Internal Controls That Survive ERP Migrations', seoDesc: 'Most control breaks trace back to an ERP migration. The controls that must survive the cutover, and how to test them before go-live rather than after.',
      tag: 'Controls', date: '09 May 2023', read: '11 min',
      title: 'A control framework that survives ERP migrations: a practitioner’s note.',
      author: 'Jinu Kurikesu',
      excerpt: 'Most control breaks we are called in to fix trace back to an ERP migration. A practitioner’s note on the controls that have to survive the cutover.',
      published: true,
    },
    {
      slug: 'designated-zone-reclassification',
      seoTitle: 'Designated Zone VAT: The Movement Trail to Keep', seoDesc: 'Goods in a UAE designated zone can be reclassified as taxable supplies when the movement trail is thin. The records that keep your position defensible.',
      tag: 'VAT', date: '22 Feb 2024', read: '5 min',
      title: 'Designated zone reclassification — the trail you must keep.',
      author: 'Sabith Abdul Rahman', reviewer: 'Jinu Govindan',
      excerpt: 'Goods in a VAT designated zone can be reclassified as taxable supplies when the movement trail is thin. What records keep the position defensible.',
      published: true,
    },
    {
      slug: 'working-capital-pegs-uae-deals',
      seoTitle: 'Working Capital Pegs in UAE Deals: Setting the Target', seoDesc: 'The working-capital peg is where UAE deals quietly gain or lose value at close. Closing-mechanic patterns we keep seeing, and how to set the peg well.',
      tag: 'M&A', date: '14 Apr 2022', read: '8 min',
      title: 'Working capital pegs in UAE deals: closing-mechanic patterns we keep seeing.',
      author: 'Jinu Govindan',
      excerpt: 'The working-capital peg is where UAE deals quietly gain or lose value at close. Patterns we keep seeing in closing mechanics, and how to set the target.',
      published: true,
    },
    {
      slug: 'transfer-pricing-thresholds-board',
      seoTitle: 'UAE Transfer Pricing Thresholds & Documentation Guide', seoDesc: 'The thresholds that make UAE transfer pricing documentation mandatory — disclosure form, master file, local file — and what a Board should expect to see.',
      tag: 'Corporate Tax', date: '16 Sep 2024', read: '7 min',
      title: 'Transfer pricing thresholds and the documentation a Board should expect.',
      author: 'Sabith Abdul Rahman', reviewer: 'Jinu Govindan',
      excerpt: 'What documentation a UAE Board should expect to see on transfer pricing, and the thresholds that decide how much of it is mandatory.',
      published: true,
    },
    {
      slug: 'reconciliation-resolve-to-zero',
      seoTitle: 'Why Every Reconciliation Should Resolve to Zero', seoDesc: 'A reconciliation that closes to a tolerance is not reconciled. Why we hold the line at zero, and the disciplined way to clear any residual balance.',
      tag: 'Controls', date: '18 Nov 2020', read: '6 min',
      title: 'Why every reconciliation should resolve to zero — and what to do when it does not.',
      author: 'Jinu Kurikesu',
      excerpt: 'A reconciliation that closes to a tolerance is not reconciled. Why we hold the line at zero, and the disciplined way to clear a residual.',
      published: true,
    },
    {
      slug: 'cost-of-equity-gcc-buildup',
      seoTitle: 'Cost of Equity in the GCC: A Practitioner’s Build-Up', seoDesc: 'Off-the-shelf cost-of-equity inputs travel badly to the GCC. A component-by-component build-up with the local adjustments that actually matter.',
      tag: 'Valuations', date: '12 Jun 2019', read: '10 min',
      title: 'Cost-of-equity in the GCC: a practitioner’s build-up.',
      author: 'Jinu Govindan',
      excerpt: 'Off-the-shelf cost-of-equity inputs travel badly to the GCC. A practitioner’s build-up, component by component, with the local adjustments that matter.',
      published: true,
    },
  ];

  const INSIGHTS_BY_SLUG = INSIGHTS.reduce((m, a) => { m[a.slug] = a; return m; }, {});
  const DEFAULT_INSIGHT = INSIGHTS[0];

  function insightBySlug(slug) {
    return INSIGHTS_BY_SLUG[slug] || null;
  }

  const PAGE_SEO = {
    home: {
      title: 'Accounting, VAT, Corporate Tax & E-Invoicing — Dubai, UAE',
      description: 'Accounting, VAT, Corporate Tax and E-Invoicing for UAE businesses across all 7 emirates since 2017. Free CT estimator, VAT checker and readiness tools.',
    },
    services: {
      title: 'Accounting, VAT & Corporate Tax Consultancy Dubai, UAE',
      description: 'Full-scope services for UAE businesses: accounting, VAT consultancy, Corporate Tax, IFRS financial statements, valuations and e-invoicing readiness.',
    },
    'service-vat': {
      title: 'VAT Registration & Return Filing UAE — Free Checker',
      description: 'UAE VAT registration, return filing, voluntary disclosures and FTA correspondence support — plus a free VAT registration checker and deadline countdown.',
    },
    'service-corporate-tax': {
      title: 'Corporate Tax Registration & Filing UAE — 9% Compliance',
      description: 'UAE Corporate Tax registration, computation and FTA filing — 0% and 9% bands, Small Business Relief, QFZP analysis and a free Corporate Tax estimator.',
    },
    'service-bookkeeping': {
      title: 'Outsourced Bookkeeping & Accounting Services Dubai',
      description: 'Outsourced bookkeeping in Dubai: daily recording, bank reconciliations, monthly close and management accounts — VAT and Corporate Tax-ready books.',
    },
    'service-audit-support': {
      title: 'Audit Support & Preparation Services Dubai, UAE',
      description: 'Audit-ready trial balance, lead schedules, reconciliations and auditor liaison for statutory and group audits under IFRS — a faster, cleaner external audit.',
    },
    'service-valuations': {
      title: 'Business Valuation Services Dubai, UAE — DCF & Fair Value',
      description: 'Independent business valuations in the UAE — DCF, market multiples and asset-based — for M&A, disputes, IFRS 13 fair value and fundraising.',
    },
    'service-transaction-advisory': {
      title: 'Financial Due Diligence & M&A Support Dubai, UAE',
      description: 'Buy-side and sell-side financial due diligence in the UAE — quality of earnings, working capital and net debt analysis, deal structuring and closing support.',
    },
    'service-cfo': {
      title: 'Outsourced & Fractional CFO Services Dubai, UAE',
      description: 'Fractional and outsourced CFO services in the UAE — board reporting, budgeting, cash and treasury, fundraising support and finance team build-out.',
    },
    'service-financial-statements': {
      title: 'IFRS Financial Statements Preparation Dubai, UAE',
      description: 'IFRS and IFRS for SMEs financial statements in the UAE — full sets with notes and disclosures, group consolidation, audit- and Corporate Tax-ready.',
    },
    'service-tax-planning': {
      title: 'Corporate Tax Advisory & Planning UAE — QFZP & Structuring',
      description: 'UAE Corporate Tax advisory — group and transaction structuring, free-zone QFZP optimisation, transfer pricing alignment and defensible position memos.',
    },
    'service-fixed-asset-tagging': {
      title: 'Fixed Asset Tagging & Verification UAE — All 7 Emirates',
      description: 'Physical fixed-asset verification and tagging, register reconstruction and depreciation review — on site across Dubai, RAK, UAQ and all seven emirates.',
    },
    'service-forensic-accounting': {
      title: 'Forensic Accounting & Fraud Investigation Dubai, UAE',
      description: 'Forensic accounting in the UAE — fraud investigation, dispute and litigation support, expert testimony and evidence reconstruction for contested matters.',
    },
    'service-internal-controls': {
      title: 'Internal Controls & Internal Audit Support Dubai, UAE',
      description: 'Internal controls design, walkthroughs and remediation for UAE businesses, regulated entities and pre-IPO issuers — risk-and-control matrices and testing.',
    },
    'service-financial-modelling': {
      title: 'Financial Modelling Services Dubai — FAST-Standard Models',
      description: 'Auditable financial models for UAE businesses — operating, transaction, LBO and board-pack models with scenario and sensitivity analysis built in.',
    },
    'service-feasibility-studies': {
      title: 'Project Feasibility Study Services Dubai, UAE',
      description: 'Project feasibility studies in the UAE — financial modelling, sensitivity and scenario analysis, and a clear pre-investment recommendation for new ventures.',
    },
    'service-strategic-advisory': {
      title: 'Strategic Financial Advisory Dubai — Board-Level Support',
      description: 'Board-level financial advisory in the UAE — accounting policy selection, complex transactions, restructuring and defensible Board-grade positions.',
    },
    'e-invoicing': {
      title: 'UAE E-Invoicing Readiness — ASP, Peppol & 2026 Deadlines',
      description: 'Get ready for the 30 October 2026 UAE e-invoicing deadline — ASP selection, Peppol readiness, process design and a free readiness PDF.',
    },
    industries: {
      title: 'Industries — Accounting & Advisory by Sector, UAE',
      description: 'Sector-focused accounting and advisory for real estate, construction, trading, hospitality, e-commerce and manufacturing businesses across Dubai and the UAE.',
    },
    'industry-real-estate': {
      title: 'Real Estate Accounting Dubai — Developers & Property',
      description: 'Accounting, VAT and Corporate Tax for UAE developers and property managers — IFRS 15 revenue, escrow and service-charge accounting, audit-ready books.',
    },
    'industry-construction': {
      title: 'Construction & Contracting Accounting Dubai, UAE',
      description: 'Accounting for UAE construction and contracting firms — IFRS 15 over-time revenue, WIP and cost-to-complete, retentions and audit-ready project reporting.',
    },
    'industry-trading': {
      title: 'Trading & Distribution Accounting Dubai, UAE',
      description: 'Accounting, VAT and Corporate Tax for UAE trading and distribution companies — inventory and COGS, import VAT and reverse charge, designated-zone treatment.',
    },
    'industry-hospitality': {
      title: 'Hospitality, F&B & Restaurant Accounting Dubai, UAE',
      description: 'Accounting for UAE hotels, restaurants and F&B groups — multi-outlet consolidation, daily POS reconciliation, cost control and VAT compliance.',
    },
    'industry-ecommerce': {
      title: 'E-commerce & Retail Accounting Dubai, UAE',
      description: 'Accounting and VAT for UAE e-commerce and retail — marketplace and payment-gateway reconciliation, multi-channel revenue, import VAT, inventory and returns.',
    },
    'industry-manufacturing': {
      title: 'Manufacturing Accounting Dubai — Cost & Inventory',
      description: 'Accounting for UAE manufacturers — cost and overhead allocation, WIP and finished-goods inventory valuation, fixed assets, VAT and Corporate Tax compliance.',
    },
    about: {
      title: 'About Us — Dubai Accounting & Advisory Firm Since 2017',
      description: 'Authentic Accounting and Bookkeeping L.L.C — Dubai firm serving all 7 emirates since 2017. Reconciliation-led accounting, tax and Board-grade advisory.',
    },
    insights: {
      title: 'UAE VAT, Corporate Tax & E-Invoicing Insights',
      description: 'Practical articles on UAE VAT, Corporate Tax, e-invoicing and IFRS from a Dubai accounting team — plain-English guides plus free calculators and tools.',
    },
    careers: {
      title: 'Careers — Accounting Jobs in Dubai, UAE',
      description: 'Explore open roles at a Dubai accounting and advisory firm serving all 7 emirates since 2017. Send your CV and grow with a compliance-first team.',
    },
    contact: {
      title: 'Contact — Book an Accounting Consultation in Dubai',
      description: 'Speak to our Dubai team about accounting, VAT, Corporate Tax or E-Invoicing. Call, email or book a consultation — we serve businesses across the UAE.',
    },
    privacy: {
      title: 'Privacy Policy — How We Handle Your Data',
      description: 'How Authentic Accounting collects, uses, retains and protects personal data submitted via aaccounting.me, in line with the UAE Personal Data Protection Law.',
    },
    terms: {
      title: 'Terms of Use — aaccounting.me',
      description: 'Terms governing use of the aaccounting.me website — general information, not professional advice or an engagement; governed by UAE law as applied in Dubai.',
    },
  };

  function normalizePath(pathname) {
    let path = decodeURIComponent(pathname || '/').trim();
    if (!path.startsWith('/')) path = '/' + path;
    path = path.replace(/\/+$/, '') || '/';
    return path.toLowerCase();
  }

  // Returns the article slug for an article URL (/insights/<slug>), the default
  // slug for the legacy /insight URL, or null for any non-article path.
  function insightSlugFromPath(pathname) {
    const path = normalizePath(pathname);
    if (path === '/insight') return DEFAULT_INSIGHT.slug;
    if (path.startsWith(INSIGHTS_BASE + '/')) {
      const slug = path.slice((INSIGHTS_BASE + '/').length).split('/')[0];
      return slug || null;
    }
    return null;
  }

  function pageFromPath(pathname) {
    const path = normalizePath(pathname);
    if (PATH_ALIASES[path]) return PATH_ALIASES[path];
    if (path === '/insight') return 'insight';            // legacy single-article URL
    if (path === INSIGHTS_BASE) return 'insights';
    if (path.startsWith(INSIGHTS_BASE + '/')) return 'insight';
    for (const [page, pagePath] of Object.entries(PAGE_TO_PATH)) {
      if (pagePath === path) return page;
    }
    return 'home';
  }

  function pathForInsight(slug) {
    const s = slug && INSIGHTS_BY_SLUG[slug] ? slug : DEFAULT_INSIGHT.slug;
    return INSIGHTS_BASE + '/' + s;
  }

  function pathForPage(page, slug) {
    const id = VALID_PAGES.has(page) ? page : 'home';
    if (id === 'insight') return pathForInsight(slug);
    return PAGE_TO_PATH[id];
  }

  function fullUrlForPage(page, slug) {
    const path = pathForPage(page, slug);
    return SITE_ORIGIN + (path === '/' ? '/' : path);
  }

  function setMetaContent(selector, content) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('content', content);
  }

  // ---- Per-page structured data (JSON-LD) ----
  const BREADCRUMB_LABELS = {
    home: 'Home', services: 'Services', 'service-vat': 'VAT Compliance',
    'service-corporate-tax': 'Corporate Tax', 'service-bookkeeping': 'Bookkeeping',
    'service-audit-support': 'Audit Support', 'service-valuations': 'Valuations',
    'service-transaction-advisory': 'Transaction Advisory', 'service-cfo': 'CFO Services',
    'service-financial-statements': 'Financial Statements', 'service-tax-planning': 'Tax Planning',
    'service-fixed-asset-tagging': 'Fixed Asset Tagging', 'service-forensic-accounting': 'Forensic Accounting',
    'service-internal-controls': 'Internal Controls', 'service-financial-modelling': 'Financial Modelling',
    'service-feasibility-studies': 'Feasibility Studies', 'service-strategic-advisory': 'Strategic Advisory',
    'e-invoicing': 'E-Invoicing', industries: 'Industries', about: 'About',
    'industry-real-estate': 'Real Estate', 'industry-construction': 'Construction & Contracting',
    'industry-trading': 'Trading & Distribution', 'industry-hospitality': 'Hospitality & F&B',
    'industry-ecommerce': 'E-commerce & Retail', 'industry-manufacturing': 'Manufacturing',
    insights: 'Insights', careers: 'Careers', contact: 'Contact',
    privacy: 'Privacy Policy', terms: 'Terms of Use',
  };

  const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
  function isoDate(d) {
    const m = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/.exec(d || '');
    if (!m) return undefined;
    return m[3] + '-' + (MONTHS[m[2]] || '01') + '-' + m[1].padStart(2, '0');
  }

  const ORG = {
    '@type': 'Organization',
    name: 'Authentic Accounting and Bookkeeping L.L.C',
    url: SITE_ORIGIN + '/',
    logo: { '@type': 'ImageObject', url: SITE_ORIGIN + '/assets/logos/authentic-accounting-full.png' },
  };

  // E-invoicing FAQ — single source for (a) the FAQPage JSON-LD below and
  // (b) the visible Q&A rendered on the page (page-einvoicing.jsx).
  // Keep in sync with the EINVOICE_FAQ mirror in scripts/prerender.py.
  const EINVOICE_FAQ = [
    { q: 'Is e-invoicing mandatory in the UAE?',
      a: 'Yes. The UAE is introducing mandatory structured e-invoicing for business-to-business (B2B) and business-to-government (B2G) transactions, under Ministerial Decisions 243 and 244 of 2025. Business-to-consumer (B2C) invoicing is currently optional. The rollout is phased by annual revenue.' },
    { q: 'When is the UAE e-invoicing deadline for my business?',
      a: 'It depends on your annual revenue. Businesses with revenue of AED 50 million or more must appoint an Accredited Service Provider (ASP) by 30 October 2026 and go live on 1 January 2027. Businesses under AED 50 million appoint by 31 March 2027 and go live on 1 July 2027. Government entities appoint by 31 March 2027 and go live on 1 October 2027.' },
    { q: 'What is an Accredited Service Provider (ASP)?',
      a: 'An ASP is a provider accredited under the UAE Ministry of Finance’s framework (Article 16 of Ministerial Decision 64 of 2025) to transmit e-invoices through the official network. Every in-scope business must appoint one. Providers currently appear on the Ministry’s pre-approved (Article 15) list while they complete full accreditation, so verify a provider’s current status before you sign.' },
    { q: 'What is the 5-corner (OpenPeppol) model?',
      a: 'The UAE uses the OpenPeppol "5-corner" model: each invoice is exchanged as structured data between your ASP and your counterparty’s ASP, with the Federal Tax Authority as a reporting corner — replacing PDFs and paper.' },
    { q: 'Will PDF or paper invoices still be valid?',
      a: 'No. From your phase’s go-live date, only structured invoices transmitted through an accredited ASP will be valid for the covered transactions. PDF and paper invoices will not.' },
    { q: 'Does a free zone company have to comply?',
      a: 'Yes. The mandate applies to B2B and B2G transactions across the UAE, including free zone companies, based on the same revenue thresholds.' },
    { q: 'What is the legal basis for UAE e-invoicing?',
      a: 'Ministerial Decision 243 of 2025 establishes the system and MD 244 of 2025 sets the phased timeline (as amended by MD 66 of 2026); ASP accreditation is governed by MD 64 of 2025, as amended by MD 56 of 2026 — all issued by the UAE Ministry of Finance under the framework created by Federal Decree-Laws 16 and 17 of 2024.' },
    { q: 'How do I get my business ready?',
      a: 'Assess your transaction scope, appoint an Accredited Service Provider, map your ERP / accounting-system fields to the required e-invoice format, and run end-to-end testing before your go-live date.' },
  ];

  // UAE Corporate Tax FAQ — single source for (a) the FAQPage JSON-LD and
  // (b) the visible Q&A on the Corporate Tax service page (page-services.jsx).
  // Keep in sync with the CORPTAX_FAQ mirror in scripts/prerender.py.
  const CORPTAX_FAQ = [
    { q: 'Who has to pay UAE Corporate Tax?',
      a: 'UAE Corporate Tax applies to businesses and commercial activities for financial years starting on or after 1 June 2023, under Federal Decree-Law No. 47 of 2022. The rate is 0% on taxable income up to AED 375,000 and 9% on taxable income above AED 375,000.' },
    { q: 'Do I still need to register if my income is below AED 375,000?',
      a: 'Yes. The AED 375,000 threshold is a 0% rate band, not an exemption. Every taxable person must register for Corporate Tax, obtain a Tax Registration Number and file an annual return — even when the tax due is zero.' },
    { q: 'What is Small Business Relief?',
      a: 'Businesses with revenue of AED 3 million or less in the relevant tax period AND all previous tax periods can elect Small Business Relief and be treated as having no taxable income. It is a transitional measure for tax periods ending on or before 31 December 2026, is not available to Qualifying Free Zone Persons or members of large multinational groups, and must be actively elected with the FTA.' },
    { q: 'Do free zone companies pay Corporate Tax?',
      a: 'A Qualifying Free Zone Person (QFZP) can benefit from a 0% rate on its qualifying income if it meets all conditions (adequate substance, qualifying activities and the de minimis limits) under Cabinet Decision 100 of 2023 and Ministerial Decision 229 of 2025. Non-qualifying income is taxed at 9%, and free zone businesses must still register and file.' },
    { q: 'When is my Corporate Tax return due?',
      a: 'The return must be filed, and any tax paid, within nine months of the end of your tax period. For a 31 December year-end, the return is due by 30 September of the following year.' },
    { q: 'What is the penalty for registering late?',
      a: 'Late Corporate Tax registration carries an administrative penalty of AED 10,000. The FTA has waived this penalty where a business files its first Corporate Tax return within seven months of the end of its first tax period.' },
    { q: 'What about large multinational groups?',
      a: 'Multinational groups with consolidated global revenue of EUR 750 million or more in at least two of the four preceding financial years are subject to a 15% Domestic Minimum Top-up Tax (DMTT) for financial years starting on or after 1 January 2025, in line with the OECD Pillar Two rules.' },
  ];

  // Bookkeeping FAQ — single source for the FAQPage JSON-LD and the visible
  // Q&A on the bookkeeping service page. Keep in sync with prerender.py.
  const BOOKKEEPING_FAQ = [
    { q: 'What does outsourced bookkeeping include?',
      a: 'A complete day-to-day finance function: recording sales, purchases and expenses, bank and ledger reconciliations, a disciplined monthly close, and a management accounts pack (profit & loss, balance sheet and cash flow). Your books stay current, accurate and audit-ready.' },
    { q: 'Which accounting software do you work with?',
      a: 'We work in your existing system — Tally, Zoho Books, QuickBooks, Xero, SAP, Microsoft Dynamics and others — or recommend and set up the right one if you are starting fresh.' },
    { q: 'How does bookkeeping keep me VAT and Corporate Tax compliant?',
      a: 'Accurate, reconciled books are the foundation of every correct VAT return and Corporate Tax computation. We tag transactions at source so your filings are straightforward and defensible, and your records meet the FTA’s retention requirements.' },
    { q: 'Can you clear a backlog of unrecorded months?',
      a: 'Yes. We run a catch-up scope to reconstruct and reconcile prior periods, bring your books fully up to date, and then move you onto a steady monthly cycle.' },
    { q: 'How often will I receive reports?',
      a: 'Reporting follows your engagement — from weekly through monthly, quarterly or yearly. We agree the cadence and the pack contents up front, and can move to a tighter cycle whenever you need a closer view of cash and performance.' },
    { q: 'Who owns the data and the books?',
      a: 'You do. The records are maintained in your accounting system, and everything is exportable on request.' },
  ];

  // Audit support FAQ — single source for the FAQPage JSON-LD and the visible
  // Q&A on the audit support service page. Keep in sync with prerender.py.
  const AUDIT_FAQ = [
    { q: 'Do you perform the audit?',
      a: 'No. We are not your statutory auditor. We prepare your books, schedules and supporting evidence, act as the single point of contact with your appointed audit firm, and close out findings — so the external audit runs quickly and cleanly. You appoint the licensed auditor, and we can recommend suitable firms.' },
    { q: 'Does my UAE company need an audit?',
      a: 'Most UAE mainland companies are required to prepare audited financial statements, and many free zones require audited accounts for licence renewal. Even where it is not mandatory, lenders, investors and group reporting usually require an audit.' },
    { q: 'What do you prepare for the audit?',
      a: 'An audit-ready file: a tied-out trial balance, lead schedules for each material balance, reconciliations, and the supporting documents and explanations that answer the auditor’s prepared-by-client (PBC) list.' },
    { q: 'Which reporting standards do you work to?',
      a: 'IFRS and IFRS for SMEs — the financial reporting frameworks used across the UAE — including the disclosures and notes your auditor will expect.' },
    { q: 'Can you help if our books are behind?',
      a: 'Yes. We run a catch-up and clean-up before the audit — reconstructing and reconciling prior periods — so you go into fieldwork with complete, defensible records.' },
    { q: 'Do you handle group and consolidated audits?',
      a: 'Yes. We prepare consolidation schedules, intercompany eliminations and group reporting packs, and coordinate across entities and auditors for a group audit.' },
  ];

  // Business valuations FAQ — single source for the FAQPage JSON-LD and the
  // visible Q&A on the valuations service page. Keep in sync with prerender.py.
  const VALUATIONS_FAQ = [
    { q: 'How do you value a business?',
      a: 'We use the three recognised approaches — income (discounted cash flow), market (comparable companies and precedent transactions) and asset-based (net asset value) — and select and weight them based on the company, the industry and the purpose of the valuation.' },
    { q: 'What can the valuation be used for?',
      a: 'Mergers and acquisitions, share transfers and buy-outs, shareholder or partner disputes, financial reporting (purchase price allocation and impairment under IFRS), fundraising, employee share schemes, and statutory or regulatory requirements.' },
    { q: 'Which valuation standards do you follow?',
      a: 'We work to the International Valuation Standards (IVS), and to IFRS 13 fair value where the valuation is for financial reporting — so the result is independent and defensible to auditors, investors and courts.' },
    { q: 'What information do you need from us?',
      a: 'Typically three to five years of financial statements, current management accounts, forecasts or a business plan, the cap table, and key contracts. We confirm a tailored information request once we understand the purpose and valuation date.' },
    { q: 'How long does a valuation take?',
      a: 'Most engagements take around two to four weeks from receiving complete information, depending on the complexity of the business and the level of assurance required.' },
    { q: 'Is the valuation independent and defensible?',
      a: 'Yes. Every valuation is methodology-led, with documented assumptions, cross-checked approaches and sensitivity analysis, set out in a report suitable for third parties such as auditors, investors and courts.' },
  ];

  // Transaction advisory (M&A + due diligence) FAQ — single source for the
  // FAQPage JSON-LD and the visible Q&A. Keep in sync with prerender.py.
  const TRANSACTION_FAQ = [
    { q: 'Do you act buy-side or sell-side?',
      a: 'Both. We run buy-side financial due diligence for acquirers and investors, and sell-side (vendor) due diligence and readiness for owners preparing to sell — so each side goes into the deal with the numbers proven.' },
    { q: 'What does financial due diligence cover?',
      a: 'Quality of earnings, revenue and margin sustainability, working capital, net debt and debt-like items, the forecast and the key commercial risks — summarised in a red-flag report focused on what moves price or risk.' },
    { q: 'What is quality of earnings?',
      a: 'Quality of earnings adjusts reported EBITDA to a normalised, sustainable run-rate by stripping out one-offs and accounting distortions. It is the number a buyer actually applies a multiple to, so it usually drives the headline price.' },
    { q: 'How do working capital and net debt affect the price?',
      a: 'A deal price typically bridges from enterprise value to equity value through a working-capital peg and net debt. We set and defend the peg and identify debt-like items, so value is not quietly lost at completion.' },
    { q: 'Do you help with the SPA and closing?',
      a: 'Yes. We provide the financial inputs to the sale and purchase agreement (SPA), prepare completion accounts and handle the post-close adjustment mechanics through to a clean close.' },
    { q: 'How long does due diligence take?',
      a: 'Most engagements run around two to four weeks depending on deal size and data availability, with expedited timelines possible for competitive processes.' },
  ];

  // CFO services FAQ — single source for the FAQPage JSON-LD and the visible
  // Q&A on the CFO services page. Keep in sync with prerender.py.
  const CFO_FAQ = [
    { q: 'What is a fractional or outsourced CFO?',
      a: 'Senior finance leadership on a part-time, interim or project basis. You get CFO-level strategy, reporting, cash management and controls — without the cost of a full-time hire — scaled to what your business needs right now.' },
    { q: 'When do I need a CFO rather than an accountant?',
      a: 'A bookkeeper or accountant keeps the records accurate; a CFO turns those numbers into decisions — forecasting, cash, fundraising, board reporting and controls. It is the right step when you are scaling, raising capital, or preparing for a transaction.' },
    { q: 'What does the engagement include?',
      a: 'Board and management reporting, budgeting and rolling forecasts, cash flow and treasury, KPI dashboards, fundraising and investor support, and building out your finance team, systems and controls.' },
    { q: 'Interim, fractional or project — which model?',
      a: 'Interim covers a full-time gap for a defined period; fractional is ongoing part-time leadership; project is a specific deliverable such as a fundraise, a budget cycle or a systems implementation. We scope the model to your stage.' },
    { q: 'Can you support fundraising and investors?',
      a: 'Yes. We prepare investor reporting, the financial model and the data room, and get you diligence-ready — then support the process through to close.' },
    { q: 'How quickly can you start?',
      a: 'Typically within a week or two of an initial scoping conversation, with a faster start where there is an urgent gap to cover.' },
  ];

  // Financial statements FAQ — single source for the FAQPage JSON-LD and the
  // visible Q&A on the financial statements page. Keep in sync with prerender.py.
  const FS_FAQ = [
    { q: 'What financial statements do you prepare?',
      a: 'A complete set under IFRS or IFRS for SMEs: the statement of financial position (balance sheet), the income statement (profit & loss), the statement of cash flows, the statement of changes in equity, and the accompanying notes and disclosures.' },
    { q: 'IFRS or IFRS for SMEs — which applies to me?',
      a: 'It depends on your size, ownership and reporting needs. Most UAE SMEs report under IFRS for SMEs, while larger or public-interest entities use full IFRS. We confirm the right framework and apply it consistently.' },
    { q: 'Are the financial statements audit-ready?',
      a: 'Yes. They are prepared with lead schedules, reconciliations and the disclosures auditors expect, so they go straight into the audit with minimal rework.' },
    { q: 'Do you handle group consolidation?',
      a: 'Yes. We prepare consolidated financial statements with intercompany eliminations, minority interests and group accounting policies applied across entities.' },
    { q: 'Do the financial statements support Corporate Tax?',
      a: 'Yes. Your financial statements are the starting point for the Corporate Tax computation, so we prepare them on a basis consistent with your Corporate Tax position.' },
    { q: 'How long does preparation take?',
      a: 'Typically one to three weeks once the trial balance is finalised, depending on the complexity of the business and whether a consolidation is involved.' },
  ];

  // Tax planning FAQ — single source for the FAQPage JSON-LD and the visible
  // Q&A on the tax planning page. Keep in sync with prerender.py.
  const TAXPLAN_FAQ = [
    { q: 'What is tax planning, and how is it different from avoidance?',
      a: 'Tax planning is arranging your affairs to manage tax efficiently within the law. We focus on compliant, FTA-defensible positions backed by the legislation — not aggressive schemes that create risk. The aim is certainty, not exposure.' },
    { q: 'What does UAE Corporate Tax planning cover?',
      a: 'Group and holding structure, mainland versus free-zone positioning, free-zone (QFZP) qualifying income, transfer pricing alignment, transaction and deal structuring, and documented Corporate Tax positions.' },
    { q: 'Can a free zone company keep the 0% Corporate Tax rate?',
      a: 'With the right structure and genuine substance, a Qualifying Free Zone Person can retain 0% on its qualifying income. We test the conditions and the de minimis limits and document the position so it holds up on review.' },
    { q: 'What is transfer pricing, and do I need documentation?',
      a: 'Transactions between related parties must be priced at arm’s length. Depending on the thresholds, you may need a transfer pricing disclosure and a master and local file. We align your pricing policy and prepare the documentation.' },
    { q: 'When should I plan?',
      a: 'Before transactions and before year-end. Structuring is far more effective — and defensible — when it is set up in advance rather than reconstructed after the fact.' },
    { q: 'Do you provide documented positions?',
      a: 'Yes. We set out each position in a memo with its legal basis, so your decisions are defensible if the FTA reviews them.' },
  ];

  // VAT FAQ — single source for the FAQPage JSON-LD and the visible Q&A on the
  // VAT service page. Keep in sync with prerender.py.
  const VAT_FAQ = [
    { q: 'When does my business need to register for VAT?',
      a: 'You must register if your taxable turnover crossed AED 375,000 in the past 12 months, or you reasonably expect it to in the next 30 days. Voluntary registration is available once taxable turnover or expenses exceed AED 187,500.' },
    { q: 'How often do I file VAT returns?',
      a: 'Most businesses file quarterly; some are assigned monthly periods by the FTA. Returns are filed and any VAT paid through the FTA’s EmaraTax portal within 28 days of the end of each period.' },
    { q: 'Can you handle a backlog of unfiled returns?',
      a: 'Yes. We run a recovery scope: reconstruct the source data, file the outstanding returns, and propose a voluntary disclosure pathway where penalties may be mitigated.' },
    { q: 'How do you handle designated-zone vs. mainland classification?',
      a: 'Every transaction is tagged at source against the relevant designated-zone schedule, and any reclassification is documented in a position memo and revisited each period.' },
    { q: 'What about zero-rated and exempt supplies?',
      a: 'Exports and certain services are zero-rated, while some supplies are exempt — and the distinction affects what input VAT you can recover. We classify each correctly so your recovery position is protected and defensible.' },
    { q: 'How do you price a VAT engagement?',
      a: 'There is no one-size-fits-all rate. We price every engagement around what you actually need — transaction volume, number of entities and the level of support — and give you a clear, tailored quote for that scope. Ask us for a quote.' },
  ];

  // --- Specialist service FAQs (single source for FAQPage JSON-LD + page Q&A) ---
  const FIXED_ASSET_FAQ = [
    { q: 'What does fixed asset tagging involve?',
      a: 'A physical verification of your assets, durable tagging (barcodes or asset labels), and reconciliation of what exists on the floor to your fixed-asset register — so the register reflects reality.' },
    { q: 'Why does my register need reconstruction?',
      a: 'Over time, registers drift: disposals are not removed, transfers are not recorded and additions are mislabelled. We rebuild a complete, accurate register that ties to the general ledger.' },
    { q: 'Do you review depreciation and impairment?',
      a: 'Yes. We review useful lives and depreciation policy for reasonableness and flag impairment indicators, so your carrying values are defensible at audit.' },
    { q: 'Is the output audit-ready?',
      a: 'Yes. You receive a reconciled register and supporting schedules that your auditor can rely on directly.' },
  ];
  const FORENSIC_FAQ = [
    { q: 'What is forensic accounting?',
      a: 'The use of accounting and investigative techniques to examine financial records for fraud, misappropriation or disputes — producing findings and evidence that can be relied on in negotiations or proceedings.' },
    { q: 'When should I engage a forensic accountant?',
      a: 'When you suspect fraud or misstatement, face a shareholder, contractual or matrimonial dispute, or need an independent expert to quantify a financial loss.' },
    { q: 'Can you act as an expert witness?',
      a: 'Yes. We provide expert reports and testimony, and reconstruct the evidence trail to a standard suitable for dispute resolution and the courts.' },
    { q: 'Is the engagement confidential?',
      a: 'Yes. Forensic work is handled discreetly and under strict confidentiality, with findings shared only with those you authorise.' },
  ];
  const CONTROLS_FAQ = [
    { q: 'What are internal controls?',
      a: 'The policies and procedures that keep your finances accurate and your assets safe — covering authorisation, segregation of duties, reconciliations and review. They reduce the risk of error and fraud.' },
    { q: 'What does an internal controls engagement deliver?',
      a: 'A risk-and-control matrix, walkthroughs and testing of key controls, a remediation plan for the gaps, and management attestation support.' },
    { q: 'Do you support pre-IPO and regulated entities?',
      a: 'Yes. We design and document control frameworks to the standard expected by regulators, auditors and investors ahead of a listing or licensing review.' },
    { q: 'How is this different from an audit?',
      a: 'An audit gives an opinion on your financial statements; an internal-controls engagement designs, tests and improves the controls that produce reliable numbers in the first place.' },
  ];
  const MODELLING_FAQ = [
    { q: 'What kinds of models do you build?',
      a: 'Operating and three-statement models, transaction and LBO models, refinancing models and board-pack scenario models — built to be transparent and auditable.' },
    { q: 'Are the models auditable?',
      a: 'Yes. We build to a consistent, FAST-style standard — clear inputs, no hard-coding in formulas, and a logical flow anyone can follow and stress-test.' },
    { q: 'Can the model handle scenarios and sensitivities?',
      a: 'Yes. Models include switchable scenarios and sensitivity tables on the drivers that matter, so you can see the range of outcomes, not just a single case.' },
    { q: 'Can you refresh or fix an existing model?',
      a: 'Yes. We review, repair and rebuild inherited models — fixing errors, adding structure and making them maintainable.' },
  ];
  const FEASIBILITY_FAQ = [
    { q: 'What does a feasibility study include?',
      a: 'A financial model of the project, market and cost assumptions, sensitivity and scenario analysis, key return metrics (NPV, IRR, payback) and a clear pre-investment recommendation.' },
    { q: 'When do I need a feasibility study?',
      a: 'Before committing capital to a new project, venture or expansion — and when a lender, investor or board requires an independent view of whether the numbers work.' },
    { q: 'Will it tell me whether to proceed?',
      a: 'Yes. We set out the returns, the risks and the break-evens, and give a clear, reasoned recommendation — go, no-go or proceed-with-conditions.' },
    { q: 'Can it support a funding application?',
      a: 'Yes. The study and model are prepared to a standard you can put in front of banks and investors.' },
  ];
  const STRATEGIC_FAQ = [
    { q: 'What does strategic financial advisory cover?',
      a: 'Board-level support on the questions that do not fit a standard engagement — accounting policy selection, complex or one-off transactions, restructuring, and documented positions for the Board.' },
    { q: 'How is it delivered?',
      a: 'As a focused advisory engagement, usually with periodic check-ins and a written position or recommendation you can take to the Board.' },
    { q: 'Can you help with complex or unusual transactions?',
      a: 'Yes. We work through the accounting, tax and reporting implications of complex transactions and set out a defensible treatment.' },
    { q: 'Do you provide written Board positions?',
      a: 'Yes. We document the recommendation and its basis so the Board has a clear, defensible record for its decision.' },
  ];

  function breadcrumbChain(page, slug) {
    const items = [{ name: 'Home', url: SITE_ORIGIN + '/' }];
    if (page === 'home') return items;
    if (page.indexOf('service-') === 0 && BREADCRUMB_LABELS[page]) {
      items.push({ name: 'Services', url: SITE_ORIGIN + PAGE_TO_PATH.services });
      items.push({ name: BREADCRUMB_LABELS[page], url: fullUrlForPage(page) });
      return items;
    }
    if (page.indexOf('industry-') === 0 && BREADCRUMB_LABELS[page]) {
      items.push({ name: 'Industries', url: SITE_ORIGIN + PAGE_TO_PATH.industries });
      items.push({ name: BREADCRUMB_LABELS[page], url: fullUrlForPage(page) });
      return items;
    }
    if (page === 'service-vat') {
      items.push({ name: 'Services', url: SITE_ORIGIN + PAGE_TO_PATH.services });
      items.push({ name: BREADCRUMB_LABELS['service-vat'], url: fullUrlForPage('service-vat') });
      return items;
    }
    if (page === 'service-corporate-tax') {
      items.push({ name: 'Services', url: SITE_ORIGIN + PAGE_TO_PATH.services });
      items.push({ name: BREADCRUMB_LABELS['service-corporate-tax'], url: fullUrlForPage('service-corporate-tax') });
      return items;
    }
    if (page === 'service-bookkeeping') {
      items.push({ name: 'Services', url: SITE_ORIGIN + PAGE_TO_PATH.services });
      items.push({ name: BREADCRUMB_LABELS['service-bookkeeping'], url: fullUrlForPage('service-bookkeeping') });
      return items;
    }
    if (page === 'service-audit-support') {
      items.push({ name: 'Services', url: SITE_ORIGIN + PAGE_TO_PATH.services });
      items.push({ name: BREADCRUMB_LABELS['service-audit-support'], url: fullUrlForPage('service-audit-support') });
      return items;
    }
    if (page === 'service-valuations') {
      items.push({ name: 'Services', url: SITE_ORIGIN + PAGE_TO_PATH.services });
      items.push({ name: BREADCRUMB_LABELS['service-valuations'], url: fullUrlForPage('service-valuations') });
      return items;
    }
    if (page === 'service-transaction-advisory') {
      items.push({ name: 'Services', url: SITE_ORIGIN + PAGE_TO_PATH.services });
      items.push({ name: BREADCRUMB_LABELS['service-transaction-advisory'], url: fullUrlForPage('service-transaction-advisory') });
      return items;
    }
    if (page === 'service-cfo') {
      items.push({ name: 'Services', url: SITE_ORIGIN + PAGE_TO_PATH.services });
      items.push({ name: BREADCRUMB_LABELS['service-cfo'], url: fullUrlForPage('service-cfo') });
      return items;
    }
    if (page === 'service-financial-statements') {
      items.push({ name: 'Services', url: SITE_ORIGIN + PAGE_TO_PATH.services });
      items.push({ name: BREADCRUMB_LABELS['service-financial-statements'], url: fullUrlForPage('service-financial-statements') });
      return items;
    }
    if (page === 'service-tax-planning') {
      items.push({ name: 'Services', url: SITE_ORIGIN + PAGE_TO_PATH.services });
      items.push({ name: BREADCRUMB_LABELS['service-tax-planning'], url: fullUrlForPage('service-tax-planning') });
      return items;
    }
    if (page === 'insight') {
      const a = insightBySlug(slug) || DEFAULT_INSIGHT;
      items.push({ name: 'Insights', url: SITE_ORIGIN + PAGE_TO_PATH.insights });
      items.push({ name: a.title.replace(/\.\s*$/, ''), url: SITE_ORIGIN + pathForInsight(a.slug) });
      return items;
    }
    if (BREADCRUMB_LABELS[page]) items.push({ name: BREADCRUMB_LABELS[page], url: fullUrlForPage(page) });
    return items;
  }

  // /services FAQ — single source for FAQPage JSON-LD + visible Q&A. Sync with prerender.py.
  const SERVICES_HUB_FAQ = [
    { q: 'What services does an accounting firm in Dubai typically provide?',
      a: 'A full-service Dubai accounting firm covers bookkeeping, VAT and Corporate Tax compliance, financial statements, audit support and advisory work such as valuations, due diligence and CFO services. Authentic Accounting delivers these under one engagement, spanning compliance — monthly close, FTA filings, IFRS statements — and advisory, including financial modelling, tax planning and transaction support.' },
    { q: 'When must a UAE business register for VAT?',
      a: 'A UAE business must register for VAT once its taxable supplies and imports exceed AED 375,000 over the previous 12 months, or are expected to within the next 30 days. Voluntary registration is available from AED 187,500. Registration, return preparation and FTA filing are part of our VAT compliance service, so thresholds are monitored before they become a problem.' },
    { q: 'What is the Corporate Tax rate in the UAE?',
      a: 'UAE Corporate Tax applies at 9% on taxable income above AED 375,000, with a 0% rate on taxable income up to that level. Qualifying free zone persons can access a 0% rate on qualifying income, subject to conditions. Our UAE Corporate Tax service handles registration, the period computation and return filing, including free-zone (QFZP) analysis where relevant.' },
    { q: 'When does e-invoicing become mandatory in the UAE?',
      a: 'UAE e-invoicing goes live in phases by revenue: businesses with annual revenue of AED 50 million or more go live on 1 January 2027, after appointing an Accredited Service Provider by 30 October 2026; other businesses follow on 1 July 2027 and government entities on 1 October 2027. Our E-Invoicing support service covers readiness assessment, ASP selection and ERP data preparation ahead of your dates.' },
  ];

  // /industries FAQ — single source for FAQPage JSON-LD + visible Q&A. Sync with prerender.py.
  const INDUSTRIES_HUB_FAQ = [
    { q: 'Does industry matter when choosing an accounting firm in Dubai?',
      a: 'Yes — the accounting judgements that matter most are sector-specific: IFRS 15 revenue for developers and contractors, designated-zone VAT for traders, daily POS reconciliation for F&B, cost absorption for manufacturers. A firm that knows your sector asks the right questions from day one. Authentic Accounting organises its work around these industry differences.' },
    { q: 'Which industries does Authentic Accounting work with in the UAE?',
      a: 'We work across government and public sector, large enterprises, SMEs and family offices, financial services, real estate and construction, and healthcare and education — with dedicated capability in trading, hospitality, e-commerce and manufacturing. The engagement model flexes from a full outsourced finance function to project-based advisory, sector by sector.' },
    { q: 'Do regulated financial firms in the UAE need specialised accounting support?',
      a: 'Yes — SCA and CBUAE-regulated entities carry obligations beyond standard bookkeeping, including controls attestation, risk-and-control matrix design and regulator-ready reporting. Asset managers, brokers and insurers each have their own reporting nuances. We support regulated entities with controls work alongside the core accounting engagement.' },
    { q: 'What accounting support do UAE healthcare and education providers need?',
      a: 'Healthcare and education providers face regulatory cost reporting and funder reconciliation on top of normal accounting — DOH cost submissions for healthcare and KHDA requirements for Dubai schools being common examples. Funder and insurer settlements need disciplined reconciliation. We support hospital groups and school operators with both.' },
  ];

  // /industries/real-estate FAQ — single source for FAQPage JSON-LD + visible Q&A. Sync with prerender.py.
  const IND_REALESTATE_FAQ = [
    { q: 'How is VAT applied to real estate in the UAE?',
      a: 'The first supply of a new residential building is zero-rated, subsequent residential sales and leases are exempt, and commercial property is taxed at the standard 5% rate. Mixed-use buildings need the treatment applied line by line, which also affects how much input VAT a property business can recover. Our VAT compliance work for property companies covers exactly this analysis.' },
    { q: 'How do UAE developers recognise revenue on off-plan sales?',
      a: 'Under IFRS 15, off-plan revenue is recognised either over time as the project progresses or at a point in time on handover, depending on the contract terms and the developer’s enforceable right to payment. It is usually the biggest accounting judgement on a developer’s books, and one we document with audit-ready workings as part of our financial statements service.' },
    { q: 'What is service-charge accounting for jointly owned property in Dubai?',
      a: 'Service-charge accounting keeps owners’ contributions, budgets and spending for a jointly owned property in separate, auditable ledgers, distinct from the management company’s own books. RERA escrow discipline and Owners’-Committee reporting sit alongside it. We run service-charge ledgers and reporting as part of our bookkeeping work for property managers.' },
    { q: 'Do UAE companies pay Corporate Tax on rental income?',
      a: 'Yes — rental income earned by a UAE company forms part of its taxable income and is taxed at 9% above AED 375,000, with 0% below that level. The position can differ for individuals holding property personally, so ownership structure matters. Our Corporate Tax service computes taxable income for property holdings, including any free-zone analysis.' },
  ];

  // /industries/construction FAQ — single source for FAQPage JSON-LD + visible Q&A. Sync with prerender.py.
  const IND_CONSTRUCTION_FAQ = [
    { q: 'How do construction companies recognise revenue in the UAE?',
      a: 'Most UAE contractors recognise revenue over time under IFRS 15, typically on a cost-to-cost (input) basis that is re-estimated each reporting period. That makes reliable cost-to-complete estimates and work-in-progress schedules essential, because they drive both revenue and margin. We compute and evidence over-time revenue and WIP so the numbers hold up at audit.' },
    { q: 'What accounting records must a UAE construction contractor keep?',
      a: 'A UAE contractor should keep per-project cost ledgers, work-in-progress and cost-to-complete schedules, retention ageing, variation and claim files, and VAT records for each milestone billing — on top of the general books UAE tax law requires every business to maintain. Our project bookkeeping service builds these records so contract margins stay visible and auditable.' },
    { q: 'How is retention money accounted for in construction contracts?',
      a: 'Retention should be tracked as a separate receivable (amounts clients withhold from you) and payable (amounts you withhold from sub-contractors), aged apart from normal trade balances. Because retention can stay outstanding for years, mixing it with trade debtors hides real collection risk. We keep retention ledgers separate and aged as standard for contracting clients.' },
    { q: 'How does VAT apply to construction contracts in the UAE?',
      a: 'Construction services in the UAE are generally subject to VAT at 5%, with tax points typically triggered by milestone billings, certified payments or receipts under the date-of-supply rules. Sub-contractor chains add input-recovery and timing questions of their own. Our VAT compliance service handles contract, milestone and sub-contractor treatment correctly.' },
  ];

  // /industries/trading FAQ — single source for FAQPage JSON-LD + visible Q&A. Sync with prerender.py.
  const IND_TRADING_FAQ = [
    { q: 'How should a trading company in Dubai value its inventory?',
      a: 'Inventory should be valued under IAS 2 at the lower of cost and net realisable value, using FIFO or weighted average cost. Landed cost — duty, freight and handling — belongs in cost, otherwise reported margin is overstated. We set up perpetual inventory, COGS and landed-cost capture for trading clients so margin by SKU is real, not an estimate.' },
    { q: 'How does import VAT work for UAE trading companies?',
      a: 'A VAT-registered UAE importer generally self-accounts for import VAT through its VAT return under the reverse-charge mechanism, rather than paying at the border, and recovers it as input tax where the goods are used for taxable supplies. Getting the customs-to-return linkage right matters at FTA review. Our VAT compliance service manages import VAT and reverse charge end to end.' },
    { q: 'Are goods in a UAE designated zone subject to VAT?',
      a: 'Goods inside a designated zone can be treated as outside the scope of UAE VAT while certain conditions are met, but supplies become taxable when goods move to the mainland or the conditions fail. The rules are transaction-specific, so blanket assumptions are risky. We map designated-zone flows for trading clients as part of VAT compliance.' },
    { q: 'Do free zone trading companies pay Corporate Tax in the UAE?',
      a: 'Free zone companies are within the UAE Corporate Tax regime, but a Qualifying Free Zone Person can access a 0% rate on qualifying income if it meets the conditions; other income is taxed at 9% above AED 375,000. Whether trading activity qualifies depends on the facts, including who the customers are. Our Corporate Tax service includes this free-zone analysis.' },
  ];

  // /industries/hospitality FAQ — single source for FAQPage JSON-LD + visible Q&A. Sync with prerender.py.
  const IND_HOSPITALITY_FAQ = [
    { q: 'Do restaurants in Dubai need to register for VAT?',
      a: 'Yes — a restaurant must register for VAT once taxable supplies exceed AED 375,000 over the previous 12 months, and may register voluntarily from AED 187,500. Dine-in, delivery and aggregator sales all count towards the threshold, so multi-channel outlets often cross it earlier than expected. We handle VAT registration and returns for F&B businesses.' },
    { q: 'What is daily sales reconciliation for a restaurant?',
      a: 'Daily sales reconciliation matches what the POS says you sold to what actually arrived — cash counts, card settlements and aggregator payouts — every single day. It is the fastest way to catch leakage, missed settlements and aggregator fee errors in F&B. We run daily POS-to-bank reconciliation as part of multi-outlet bookkeeping for hospitality clients.' },
    { q: 'How are municipality and tourism fees accounted for by UAE restaurants?',
      a: 'Service charge, municipality and tourism fees should be identified and accounted for separately from food and beverage revenue, since they follow their own rules and remittance obligations by emirate. Bundling them into sales overstates revenue and muddies the VAT workings. We separate these fees in the ledgers as standard for hospitality clients.' },
    { q: 'How do multi-outlet F&B groups consolidate their accounts?',
      a: 'Consolidation works when every outlet uses a consistent chart of accounts, per-outlet ledgers roll into one group view, and inter-outlet transactions are eliminated. Done properly, you can compare outlets like-for-like on prime cost and margin. Our hospitality bookkeeping consolidates multi-outlet groups and produces outlet-level management accounts.' },
  ];

  // /industries/ecommerce FAQ — single source for FAQPage JSON-LD + visible Q&A. Sync with prerender.py.
  const IND_ECOMMERCE_FAQ = [
    { q: 'How does VAT apply to e-commerce sales in the UAE?',
      a: 'VAT on e-commerce follows place-of-supply rules: sales delivered within the UAE are generally standard-rated at 5%, while cross-border sales and imported goods each have their own treatment. Selling through marketplaces adds questions about who accounts for the VAT. Our VAT compliance service maps the right treatment across website, marketplace and retail channels.' },
    { q: 'How do online sellers reconcile payment gateway and marketplace payouts?',
      a: 'Reconcile each payout back to the individual orders it settles, then tie the net amount to the bank — capturing the gateway’s fees, refunds and holdbacks in between. Skipping this step leaves revenue, fees and VAT all approximate. We reconcile Stripe, PayTabs, Amazon, Noon and similar settlements to orders and bank as core e-commerce bookkeeping.' },
    { q: 'Do e-commerce businesses in the UAE pay Corporate Tax?',
      a: 'Yes — UAE e-commerce businesses are subject to Corporate Tax like any other company: 9% on taxable income above AED 375,000 and 0% below. Online and omni-channel models raise their own computation questions, from channel-level revenue recognition to marketplace fees. Our Corporate Tax service handles registration, computation and filing for online sellers.' },
    { q: 'How should an online store account for returns and chargebacks?',
      a: 'Returns, refunds and chargebacks should reduce recognised revenue and flow back into stock and VAT adjustments in the period they happen, not sit unrecorded in a gateway balance. High-return categories can materially change true margin. We build returns and chargebacks into the monthly close so revenue and inventory stay accurate.' },
  ];

  // /industries/manufacturing FAQ — single source for FAQPage JSON-LD + visible Q&A. Sync with prerender.py.
  const IND_MANUFACTURING_FAQ = [
    { q: 'What costing method should a UAE manufacturer use?',
      a: 'Most manufacturers use standard or absorption costing, allocating production overheads to units through defined cost centres — which is also what IAS 2 expects for inventory valuation. The real test is whether the overhead allocation is defensible at audit. We set up job and process costing with overhead absorption that stands up to that scrutiny.' },
    { q: 'How are raw materials, WIP and finished goods valued?',
      a: 'All three inventory categories are valued under IAS 2 at the lower of cost and net realisable value, with cost building up through the production process: materials, direct labour and absorbed production overheads. Each stage needs its own valuation workings. We maintain raw-material, WIP and finished-goods valuations as part of manufacturing bookkeeping.' },
    { q: 'Can UAE manufacturers recover VAT on machinery and raw materials?',
      a: 'Generally yes — input VAT on machinery, raw materials and production costs is recoverable where the purchases are used to make taxable supplies, subject to the normal documentation rules. Recovery gets harder if some output is exempt or out of scope. Our VAT compliance service manages input recovery and return filing for manufacturers.' },
    { q: 'Why do manufacturers need a fixed asset register?',
      a: 'A fixed asset register ties plant and machinery on the floor to the ledger — recording cost, location, depreciation and impairment indicators for every asset. It underpins the depreciation in your Corporate Tax computation and is one of the first things auditors test. Our fixed asset tagging service physically verifies assets and reconstructs the register.' },
  ];

  // Answer-first capsules for the money pages — the direct 2–3 sentence answer a
  // searcher wants, shown under the hero AND injected into the prerendered
  // crawlable body. Facts mirror the QC'd page content (thresholds, deadlines).
  // Keep in sync with prerender.py's mirror.
  const ANSWER_FIRST = {
    'service-vat': {
      h: 'VAT registration and return filing in the UAE — the short answer',
      text:
      'UAE VAT is a 5% tax on most goods and services. Registration with the Federal Tax Authority is mandatory once taxable supplies and imports exceed AED 375,000 over the previous 12 months — or are expected to within the next 30 days — and voluntary from AED 187,500. Registered businesses file VAT returns on EmaraTax, quarterly for most, with the return and payment due within 28 days of the period end.',
    },
    'service-corporate-tax': {
      h: 'UAE Corporate Tax registration and filing — the short answer',
      text:
      'UAE Corporate Tax is charged at 9% on annual taxable income above AED 375,000 — the first AED 375,000 is taxed at 0%. Every taxable person must register with the Federal Tax Authority, then file a return and pay any tax due within 9 months of financial year-end. Qualifying Free Zone Persons can keep a 0% rate on qualifying income, and Small Business Relief may apply where revenue is AED 3 million or less, for tax periods ending on or before 31 December 2026.',
    },
    'e-invoicing': {
      h: 'UAE e-invoicing deadlines and readiness — the short answer',
      text:
      'UAE e-invoicing replaces PDF and paper invoices for in-scope B2B and B2G transactions with structured e-invoices exchanged through Accredited Service Providers and reported to the FTA in near-real time. Go-live is phased: 1 January 2027 for businesses with revenue of AED 50 million or more, 1 July 2027 for other businesses, and 1 October 2027 for government entities. The first deadline lands earlier — Phase 1 businesses must appoint an Accredited Service Provider by 30 October 2026.',
    },
  };

  // Contextual related guides & tools per page (service/industry pages → insight
  // articles + lead tools). Each entry: [kind, target, label] where kind 'insight'
  // links to /insights/<target> and kind 'page' links to pathForPage(target).
  // Keep in sync with prerender.py's mirror.
  const RELATED_READING = {
    'service-vat': [
      ['insight', 'uae-vat-guide-dubai', 'UAE VAT guide'],
      ['insight', 'uae-vat-5-percent-primer', 'The 5% VAT primer'],
      ['insight', 'designated-zone-reclassification', 'Designated zones & VAT'],
    ],
    'service-corporate-tax': [
      ['insight', 'uae-corporate-tax-guide-sme', 'Corporate Tax guide for SMEs'],
      ['insight', 'free-zone-qualifying-income', 'Free-zone qualifying income'],
      ['insight', 'transfer-pricing-thresholds-board', 'Transfer pricing for the Board'],
    ],
    'service-bookkeeping': [
      ['insight', 'bookkeeping-foundation', 'Bookkeeping as the foundation'],
      ['insight', 'outsourced-bookkeeping-dubai', 'Outsourced bookkeeping in Dubai'],
      ['page', 'service-vat', 'VAT registration checker'],
    ],
    'service-audit-support': [
      ['insight', 'ifrs-financial-statements-uae', 'IFRS financial statements in the UAE'],
      ['insight', 'reconciliation-resolve-to-zero', 'Reconciliation: resolve to zero'],
      ['insight', 'control-framework-erp-migrations', 'Controls through ERP migrations'],
    ],
    'service-valuations': [
      ['insight', 'cost-of-equity-gcc-buildup', 'Cost of equity in the GCC'],
      ['insight', 'working-capital-pegs-uae-deals', 'Working-capital pegs in UAE deals'],
    ],
    'service-transaction-advisory': [
      ['insight', 'dcf-terminal-values-family-office', 'DCF terminal values'],
      ['insight', 'cost-of-equity-gcc-buildup', 'Cost of equity in the GCC'],
    ],
    'service-cfo': [
      ['insight', 'management-accounts-that-drive-decisions', 'Management accounts that drive decisions'],
      ['insight', 'protecting-cash-flow-downturn', 'Protecting cash flow in a downturn'],
      ['page', 'service-corporate-tax', 'Corporate Tax estimator'],
    ],
    'service-financial-statements': [
      ['insight', 'ifrs-financial-statements-uae', 'IFRS financial statements in the UAE'],
      ['insight', 'bookkeeping-foundation', 'Bookkeeping as the foundation'],
      ['insight', 'management-accounts-that-drive-decisions', 'Management accounts that drive decisions'],
    ],
    'service-tax-planning': [
      ['insight', 'economic-substance-regulations-uae', 'Economic substance regulations'],
      ['insight', 'designated-zone-reclassification', 'Designated zones & VAT'],
      ['page', 'service-corporate-tax', 'Corporate Tax estimator'],
    ],
    'service-fixed-asset-tagging': [
      ['insight', 'ifrs-financial-statements-uae', 'IFRS financial statements in the UAE'],
      ['insight', 'reconciliation-resolve-to-zero', 'Reconciliation: resolve to zero'],
    ],
    'service-forensic-accounting': [
      ['insight', 'reconciliation-resolve-to-zero', 'Reconciliation: resolve to zero'],
      ['insight', 'control-framework-erp-migrations', 'Controls through ERP migrations'],
    ],
    'service-internal-controls': [
      ['insight', 'control-framework-erp-migrations', 'Controls through ERP migrations'],
      ['insight', 'reconciliation-resolve-to-zero', 'Reconciliation: resolve to zero'],
    ],
    'service-financial-modelling': [
      ['insight', 'dcf-terminal-values-family-office', 'DCF terminal values'],
      ['insight', 'cost-of-equity-gcc-buildup', 'Cost of equity in the GCC'],
      ['insight', 'working-capital-pegs-uae-deals', 'Working-capital pegs in UAE deals'],
    ],
    'service-feasibility-studies': [
      ['insight', 'dcf-terminal-values-family-office', 'DCF terminal values'],
      ['insight', 'cost-of-equity-gcc-buildup', 'Cost of equity in the GCC'],
    ],
    'service-strategic-advisory': [
      ['insight', 'transfer-pricing-thresholds-board', 'Transfer pricing for the Board'],
      ['insight', 'economic-substance-regulations-uae', 'Economic substance regulations'],
      ['insight', 'uae-corporate-tax-guide-sme', 'Corporate Tax guide for SMEs'],
    ],
    'industry-real-estate': [
      ['insight', 'uae-vat-guide-dubai', 'UAE VAT guide'],
      ['insight', 'ifrs-financial-statements-uae', 'IFRS financial statements in the UAE'],
      ['page', 'e-invoicing', 'E-invoicing readiness check'],
    ],
    'industry-construction': [
      ['insight', 'protecting-cash-flow-downturn', 'Protecting cash flow in a downturn'],
      ['insight', 'ifrs-financial-statements-uae', 'IFRS financial statements in the UAE'],
      ['insight', 'uae-vat-guide-dubai', 'UAE VAT guide'],
    ],
    'industry-trading': [
      ['insight', 'designated-zone-reclassification', 'Designated zones & VAT'],
      ['insight', 'uae-vat-guide-dubai', 'UAE VAT guide'],
      ['insight', 'reconciliation-resolve-to-zero', 'Reconciliation: resolve to zero'],
    ],
    'industry-hospitality': [
      ['insight', 'management-accounts-that-drive-decisions', 'Management accounts that drive decisions'],
      ['insight', 'uae-vat-5-percent-primer', 'The 5% VAT primer'],
      ['insight', 'protecting-cash-flow-downturn', 'Protecting cash flow in a downturn'],
    ],
    'industry-ecommerce': [
      ['insight', 'uae-vat-guide-dubai', 'UAE VAT guide'],
      ['insight', 'prepare-erp-for-uae-e-invoicing', 'Getting your ERP e-invoicing ready'],
      ['insight', 'reconciliation-resolve-to-zero', 'Reconciliation: resolve to zero'],
    ],
    'industry-manufacturing': [
      ['insight', 'control-framework-erp-migrations', 'Controls through ERP migrations'],
      ['insight', 'ifrs-financial-statements-uae', 'IFRS financial statements in the UAE'],
      ['insight', 'prepare-erp-for-uae-e-invoicing', 'Getting your ERP e-invoicing ready'],
    ],
  };

  // Single source for FAQPage JSON-LD + visible page Q&A (templates read it via
  // window.AARoutes.FAQ_BY_PAGE). Keep in sync with prerender.py's mirror.
  const FAQ_BY_PAGE = { 'e-invoicing': EINVOICE_FAQ, 'service-corporate-tax': CORPTAX_FAQ, 'service-bookkeeping': BOOKKEEPING_FAQ, 'service-audit-support': AUDIT_FAQ, 'service-valuations': VALUATIONS_FAQ, 'service-transaction-advisory': TRANSACTION_FAQ, 'service-cfo': CFO_FAQ, 'service-financial-statements': FS_FAQ, 'service-tax-planning': TAXPLAN_FAQ, 'service-vat': VAT_FAQ, 'service-fixed-asset-tagging': FIXED_ASSET_FAQ, 'service-forensic-accounting': FORENSIC_FAQ, 'service-internal-controls': CONTROLS_FAQ, 'service-financial-modelling': MODELLING_FAQ, 'service-feasibility-studies': FEASIBILITY_FAQ, 'service-strategic-advisory': STRATEGIC_FAQ, 'services': SERVICES_HUB_FAQ, 'industries': INDUSTRIES_HUB_FAQ, 'industry-real-estate': IND_REALESTATE_FAQ, 'industry-construction': IND_CONSTRUCTION_FAQ, 'industry-trading': IND_TRADING_FAQ, 'industry-hospitality': IND_HOSPITALITY_FAQ, 'industry-ecommerce': IND_ECOMMERCE_FAQ, 'industry-manufacturing': IND_MANUFACTURING_FAQ };

  function buildJsonLd(page, slug) {
    const blocks = [];
    const chain = breadcrumbChain(page, slug);
    if (chain.length > 1) {
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: chain.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
      });
    }
    if (page === 'insight') {
      const a = insightBySlug(slug) || DEFAULT_INSIGHT;
      const block = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.title.replace(/\.\s*$/, ''),
        description: a.excerpt,
        author: { '@type': 'Person', name: a.author },
        publisher: ORG,
        mainEntityOfPage: SITE_ORIGIN + pathForInsight(a.slug),
      };
      const iso = isoDate(a.date);
      if (iso) { block.datePublished = iso; block.dateModified = iso; }
      blocks.push(block);
    }
    if (page === 'services' || page === 'e-invoicing' || page.indexOf('service-') === 0 || page.indexOf('industry-') === 0) {
      const meta = PAGE_SEO[page] || {};
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: (meta.title || '').split('|')[0].split('—')[0].trim(),
        description: meta.description,
        serviceType: BREADCRUMB_LABELS[page] || 'Accounting services',
        areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
        provider: ORG,
      });
    }
    if (FAQ_BY_PAGE[page]) {
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_BY_PAGE[page].map((f) => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      });
    }
    return blocks;
  }

  function applyStructuredData(page, slug) {
    document.querySelectorAll('script[data-aa-jsonld]').forEach((el) => el.remove());
    buildJsonLd(page, slug).forEach((obj) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-aa-jsonld', '');
      s.textContent = JSON.stringify(obj);
      document.head.appendChild(s);
    });
  }

  function applyPageMeta(page, slug) {
    const id = VALID_PAGES.has(page) ? page : 'home';
    let meta, canonical;

    if (id === 'insight') {
      const a = insightBySlug(slug) || DEFAULT_INSIGHT;
      meta = {
        // seoTitle/seoDesc are search-tuned (<=60 / <=158 chars, no brand suffix —
        // Google shows the site name separately); the on-page headline stays a.title.
        title: a.seoTitle || a.title.replace(/\.\s*$/, '') + ' | Authentic Accounting Insights',
        description: a.seoDesc || a.excerpt,
      };
      canonical = SITE_ORIGIN + pathForInsight(a.slug);
    } else {
      meta = PAGE_SEO[id] || PAGE_SEO.home;
      canonical = fullUrlForPage(id);
    }

    document.title = meta.title;

    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', meta.description);

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) canonicalEl.setAttribute('href', canonical);

    setMetaContent('meta[property="og:url"]', canonical);
    setMetaContent('meta[property="og:title"]', meta.title);
    setMetaContent('meta[property="og:description"]', meta.description);
    setMetaContent('meta[name="twitter:title"]', meta.title);
    setMetaContent('meta[name="twitter:description"]', meta.description);

    applyStructuredData(id, slug);
  }

  function redirectLegacyHash() {
    const raw = decodeURIComponent(window.location.hash.slice(1)).trim().toLowerCase();
    if (!raw) return false;
    const page = raw === 'home' ? 'home' : (VALID_PAGES.has(raw) ? raw : 'home');
    history.replaceState(null, '', pathForPage(page) + window.location.search);
    return true;
  }

  // VAT return/payment deadlines — the 28th of the month after each tax period,
  // shifted to the next working day when it falls on the UAE weekend (Sat/Sun).
  // Owner-verified 12-month table (Jul 2026 → Jul 2027); weekend shifts applied,
  // no known public-holiday collisions (Eid dates estimated — reconfirm nearer
  // the time). Regenerate/re-verify annually (see the June reminder). `due` drives
  // the live countdown; `dueLabel`/`period` are the verified display strings.
  const VAT_DEADLINES = [
    { due: '2026-07-28', dueLabel: 'Tuesday, 28 July 2026',      period: 'Quarter ended 30 Jun 2026 (Apr–Jun)' },
    { due: '2026-08-28', dueLabel: 'Friday, 28 August 2026',     period: 'Quarter ended 31 Jul 2026 (May–Jul)' },
    { due: '2026-09-28', dueLabel: 'Monday, 28 September 2026',   period: 'Quarter ended 31 Aug 2026 (Jun–Aug)' },
    { due: '2026-10-28', dueLabel: 'Wednesday, 28 October 2026', period: 'Quarter ended 30 Sep 2026 (Jul–Sep)' },
    { due: '2026-11-30', dueLabel: 'Monday, 30 November 2026',   period: 'Quarter ended 31 Oct 2026 (Aug–Oct)', shifted: true },
    { due: '2026-12-28', dueLabel: 'Monday, 28 December 2026',   period: 'Quarter ended 30 Nov 2026 (Sep–Nov)' },
    { due: '2027-01-28', dueLabel: 'Thursday, 28 January 2027',  period: 'Quarter ended 31 Dec 2026 (Oct–Dec)' },
    { due: '2027-03-01', dueLabel: 'Monday, 1 March 2027',       period: 'Quarter ended 31 Jan 2027 (Nov–Jan)', shifted: true },
    { due: '2027-03-29', dueLabel: 'Monday, 29 March 2027',      period: 'Quarter ended 28 Feb 2027 (Dec–Feb)', shifted: true },
    { due: '2027-04-28', dueLabel: 'Wednesday, 28 April 2027',   period: 'Quarter ended 31 Mar 2027 (Jan–Mar)' },
    { due: '2027-05-28', dueLabel: 'Friday, 28 May 2027',        period: 'Quarter ended 30 Apr 2027 (Feb–Apr)' },
    { due: '2027-06-28', dueLabel: 'Monday, 28 June 2027',       period: 'Quarter ended 31 May 2027 (Mar–May)' },
    { due: '2027-07-28', dueLabel: 'Wednesday, 28 July 2027',    period: 'Quarter ended 30 Jun 2027 (Apr–Jun)' },
  ];

  window.AARoutes = {
    SITE_ORIGIN,
    TAX_RULES_ASOF: 'July 2026',
    VAT_DEADLINES,
    PAGE_TO_PATH,
    VALID_PAGES,
    PAGE_SEO,
    INSIGHTS,
    DEFAULT_INSIGHT,
    EINVOICE_FAQ,
    CORPTAX_FAQ,
    BOOKKEEPING_FAQ,
    AUDIT_FAQ,
    VALUATIONS_FAQ,
    TRANSACTION_FAQ,
    CFO_FAQ,
    FS_FAQ,
    TAXPLAN_FAQ,
    VAT_FAQ,
    FIXED_ASSET_FAQ,
    FORENSIC_FAQ,
    CONTROLS_FAQ,
    MODELLING_FAQ,
    FEASIBILITY_FAQ,
    STRATEGIC_FAQ,
    FAQ_BY_PAGE,
    ANSWER_FIRST,
    RELATED_READING,
    insightBySlug,
    insightSlugFromPath,
    pageFromPath,
    pathForPage,
    pathForInsight,
    fullUrlForPage,
    applyPageMeta,
    redirectLegacyHash,
  };
})();
