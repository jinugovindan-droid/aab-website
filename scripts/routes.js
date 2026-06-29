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
      slug: 'uae-vat-guide-dubai',
      tag: 'VAT', date: '30 Jun 2026', read: '7 min',
      title: 'VAT in the UAE: registration, filing and recovery — a Dubai business guide.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'Federal Decree-Law No. 8 of 2017 on VAT (as amended)',
      excerpt: 'The 5% standard rate, the AED 375,000 mandatory and AED 187,500 voluntary registration thresholds, EmaraTax filing and the 28-day deadline, input-VAT recovery, and the zero-rated vs exempt distinction — what every UAE business needs to get right.',
      published: true,
    },
    {
      slug: 'outsourced-bookkeeping-dubai',
      tag: 'Bookkeeping', date: '30 Jun 2026', read: '6 min',
      title: 'Outsourced bookkeeping in Dubai: what good looks like in a VAT and Corporate Tax world.',
      author: 'Jinu Govindan', reviewer: 'Sabith Abdul Rahman', reference: 'UAE VAT (FDL 8 of 2017) & Corporate Tax (FDL 47 of 2022) record-keeping requirements',
      excerpt: 'Since VAT and Corporate Tax arrived, clean books are a legal requirement, not a nicety. What proper outsourced bookkeeping covers, the record-retention rules (five years for VAT, seven for Corporate Tax), and when to outsource versus hire in-house.',
      published: true,
    },
    {
      slug: 'uae-corporate-tax-guide-sme',
      tag: 'Corporate Tax', date: '29 Jun 2026', read: '8 min',
      title: 'UAE Corporate Tax: a complete guide for SMEs and free-zone businesses.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'Federal Decree-Law No. 47 of 2022 (UAE Corporate Tax)',
      excerpt: 'Who pays UAE Corporate Tax, the 0% and 9% bands, registration and the AED 10,000 late-registration penalty, the nine-month filing deadline, Small Business Relief and its 31 December 2026 sunset, free-zone QFZP status, and the 15% domestic minimum top-up tax — in plain English for UAE businesses.',
      published: true,
    },
    {
      slug: 'uae-e-invoicing-explained',
      tag: 'E-Invoicing', date: '20 Jun 2026', read: '7 min',
      title: 'UAE e-invoicing explained: a plain-English guide for businesses.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)',
      excerpt: 'The UAE is moving to mandatory structured e-invoicing for B2B and B2G transactions. What that actually means, why it is happening, and how the OpenPeppol 5-corner model changes the way you issue an invoice.',
      published: true,
    },
    {
      slug: 'uae-e-invoicing-deadlines-phases',
      tag: 'E-Invoicing', date: '18 Jun 2026', read: '5 min',
      title: 'UAE e-invoicing deadlines and phases: who must comply, and by when.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)',
      excerpt: 'The rollout is phased by annual revenue, with two dates that matter for each business — the deadline to appoint an Accredited Service Provider, and the mandatory go-live. Here is the full timeline, tier by tier.',
      published: true,
    },
    {
      slug: 'choosing-accredited-service-provider-asp',
      tag: 'E-Invoicing', date: '16 Jun 2026', read: '6 min',
      title: 'Choosing an Accredited Service Provider (ASP) for UAE e-invoicing.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)',
      excerpt: 'Every in-scope business must appoint an Accredited Service Provider to transmit its e-invoices. What an ASP does in the 5-corner model, and the questions to ask before you sign.',
      published: true,
    },
    {
      slug: 'prepare-erp-for-uae-e-invoicing',
      tag: 'E-Invoicing', date: '12 Jun 2026', read: '6 min',
      title: 'Getting your ERP ready for UAE e-invoicing: a practical checklist.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)',
      excerpt: 'E-invoicing is not just a tax change — it is a data change. The master-data hygiene, field mapping and testing that decide whether your go-live is smooth or painful.',
      published: true,
    },
    {
      slug: 'free-zone-qualifying-income',
      tag: 'Corporate Tax', date: '12 Apr 2026', read: '6 min',
      title: 'Free zone qualifying income — three traps in the UAE free-zone tax rules.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'Cabinet Decision 100 of 2023 · Ministerial Decision 229 of 2025 (replacing MD 265 of 2023)',
      excerpt: 'The UAE’s free-zone tax rules — Cabinet Decision 100 of 2023 and Ministerial Decision 229 of 2025 (which replaced MD 265 of 2023) — are being read three different ways by tax teams in the UAE. We unpack the three traps we keep seeing in client positions, and what the consequence is at filing.',
      published: true,
    },
    {
      slug: 'dcf-terminal-values-family-office',
      tag: 'Valuations', date: '02 Apr 2026', read: '9 min',
      title: 'Why DCF terminal values are mispriced for UAE family-office holdings.',
      author: 'Jinu Govindan',
      excerpt: 'Terminal value carries most of the weight in a DCF, yet it is where UAE family-office valuations most often drift. A note on the assumptions we test first.',
      published: false,
    },
    {
      slug: 'control-framework-erp-migrations',
      tag: 'Controls', date: '21 Mar 2026', read: '11 min',
      title: 'A control framework that survives ERP migrations: a practitioner’s note.',
      author: 'Jinu Kurikesu',
      excerpt: 'Most control breaks we are called in to fix trace back to an ERP migration. A practitioner’s note on the controls that have to survive the cutover.',
      published: false,
    },
    {
      slug: 'designated-zone-reclassification',
      tag: 'VAT', date: '14 Mar 2026', read: '5 min',
      title: 'Designated zone reclassification — the trail you must keep.',
      author: 'CA Kiran Prasad S',
      excerpt: 'Goods in a VAT designated zone can be reclassified as taxable supplies when the movement trail is thin. What records keep the position defensible.',
      published: false,
    },
    {
      slug: 'working-capital-pegs-uae-deals',
      tag: 'M&A', date: '02 Mar 2026', read: '8 min',
      title: 'Working capital pegs in UAE deals: closing-mechanic patterns we keep seeing.',
      author: 'Jinu Govindan',
      excerpt: 'The working-capital peg is where UAE deals quietly gain or lose value at close. Patterns we keep seeing in closing mechanics, and how to set the target.',
      published: false,
    },
    {
      slug: 'transfer-pricing-thresholds-board',
      tag: 'Corporate Tax', date: '18 Feb 2026', read: '7 min',
      title: 'Transfer pricing thresholds and the documentation a Board should expect.',
      author: 'CA Kiran Prasad S',
      excerpt: 'What documentation a UAE Board should expect to see on transfer pricing, and the thresholds that decide how much of it is mandatory.',
      published: false,
    },
    {
      slug: 'reconciliation-resolve-to-zero',
      tag: 'Controls', date: '05 Feb 2026', read: '6 min',
      title: 'Why every reconciliation should resolve to zero — and what to do when it does not.',
      author: 'Jinu Kurikesu',
      excerpt: 'A reconciliation that closes to a tolerance is not reconciled. Why we hold the line at zero, and the disciplined way to clear a residual.',
      published: false,
    },
    {
      slug: 'cost-of-equity-gcc-buildup',
      tag: 'Valuations', date: '21 Jan 2026', read: '10 min',
      title: 'Cost-of-equity in the GCC: a practitioner’s build-up.',
      author: 'Jinu Govindan',
      excerpt: 'Off-the-shelf cost-of-equity inputs travel badly to the GCC. A practitioner’s build-up, component by component, with the local adjustments that matter.',
      published: false,
    },
  ];

  const INSIGHTS_BY_SLUG = INSIGHTS.reduce((m, a) => { m[a.slug] = a; return m; }, {});
  const DEFAULT_INSIGHT = INSIGHTS[0];

  function insightBySlug(slug) {
    return INSIGHTS_BY_SLUG[slug] || null;
  }

  const PAGE_SEO = {
    home: {
      title: 'Authentic Accounting — UAE Compliance & Advisory · Bookkeeping, VAT, Corporate Tax, Valuations',
      description: 'UAE-based accounting and advisory firm serving SMEs, enterprises and Government across all 7 emirates. Bookkeeping, VAT, Corporate Tax filing, financial statements (IFRS), valuations, M&A support and due diligence — delivered with reconciliation discipline since 2017.',
    },
    services: {
      title: 'Services — Bookkeeping, VAT, Corporate Tax & Advisory | Authentic Accounting',
      description: 'Compliance and advisory services for UAE businesses: bookkeeping, VAT, Corporate Tax, IFRS financial statements, valuations, M&A support and due diligence.',
    },
    'service-vat': {
      title: 'VAT Compliance UAE — Registration, Filing & FTA Support | Authentic Accounting',
      description: 'End-to-end UAE VAT compliance: registration, return filing, FTA correspondence, voluntary disclosures and audit support for SMEs and enterprises.',
    },
    'service-corporate-tax': {
      title: 'UAE Corporate Tax — Registration, Filing & 9% Compliance | Authentic Accounting',
      description: 'End-to-end UAE Corporate Tax compliance under Federal Decree-Law 47 of 2022: registration, taxable-income computation, free-zone (QFZP) analysis, Small Business Relief and FTA return filing for SMEs, free zones and groups.',
    },
    'service-bookkeeping': {
      title: 'Outsourced Bookkeeping & Accounting Services Dubai, UAE | Authentic Accounting',
      description: 'Outsourced bookkeeping and accounting in Dubai: day-to-day recording, bank and ledger reconciliations, monthly close and management accounts — VAT and Corporate Tax-ready, delivered against a documented controls framework.',
    },
    'service-audit-support': {
      title: 'Audit Support & Preparation Services Dubai, UAE | Authentic Accounting',
      description: 'Audit preparation and support in the UAE: audit-ready trial balance and lead schedules, reconciliations, auditor liaison and findings closeout for statutory and group audits under IFRS — so your external audit runs fast and clean.',
    },
    'service-valuations': {
      title: 'Business Valuation Services Dubai, UAE — DCF & Fair Value | Authentic Accounting',
      description: 'Independent business valuations in the UAE — DCF, market-multiple and asset-based — for M&A, shareholder disputes, financial reporting (IFRS 13 fair value), fundraising and statutory purposes, to International Valuation Standards.',
    },
    'service-transaction-advisory': {
      title: 'M&A Support & Financial Due Diligence Dubai, UAE | Authentic Accounting',
      description: 'Buy-side and sell-side M&A support and financial due diligence in the UAE — quality of earnings, working capital and net debt analysis, deal structuring and closing mechanics. Independent, evidence-led transaction advisory.',
    },
    'service-cfo': {
      title: 'Outsourced & Fractional CFO Services Dubai, UAE | Authentic Accounting',
      description: 'Interim, fractional and outsourced CFO services in the UAE — board reporting, budgeting and forecasting, cash and treasury, fundraising support and finance function build-out. Senior finance leadership without a full-time hire.',
    },
    'service-financial-statements': {
      title: 'IFRS Financial Statements Preparation Dubai, UAE | Authentic Accounting',
      description: 'Preparation of IFRS and IFRS for SMEs financial statements in the UAE — balance sheet, income statement, cash flow and notes, group consolidation and disclosures — audit- and Corporate Tax-ready.',
    },
    'service-tax-planning': {
      title: 'Corporate Tax Planning & Structuring Dubai, UAE | Authentic Accounting',
      description: 'UAE Corporate Tax planning and structuring — group and transaction structuring, free-zone (QFZP) optimisation, transfer pricing alignment and Corporate Tax position memos. Compliant, FTA-defensible tax advisory.',
    },
    'service-fixed-asset-tagging': {
      title: 'Fixed Asset Tagging & Register Services Dubai, UAE | Authentic Accounting',
      description: 'Physical fixed-asset verification and tagging, register reconstruction, depreciation policy review and impairment indicators across the UAE — a clean, auditable fixed-asset register.',
    },
    'service-forensic-accounting': {
      title: 'Forensic Accounting & Fraud Investigation Dubai, UAE | Authentic Accounting',
      description: 'Forensic accounting in the UAE — fraud investigation, dispute and litigation support, expert testimony and evidence reconstruction for contested financial matters.',
    },
    'service-internal-controls': {
      title: 'Internal Controls Design & Review Dubai, UAE | Authentic Accounting',
      description: 'Internal controls design, walkthroughs and remediation for UAE businesses, regulated entities and pre-IPO issuers — risk-and-control matrices, testing and management attestation.',
    },
    'service-financial-modelling': {
      title: 'Financial Modelling Services Dubai, UAE | Authentic Accounting',
      description: 'Auditable financial models for UAE businesses — operating, transaction, LBO and board-pack models, FAST-standard, with scenarios and sensitivity analysis.',
    },
    'service-feasibility-studies': {
      title: 'Feasibility Study Services Dubai, UAE | Authentic Accounting',
      description: 'Project feasibility studies in the UAE — financial modelling, sensitivity and scenario analysis and a clear pre-investment recommendation for new projects and ventures.',
    },
    'service-strategic-advisory': {
      title: 'Strategic Financial Advisory Dubai, UAE | Authentic Accounting',
      description: 'Board-level strategic financial advisory in the UAE — accounting policy selection, complex transactions, restructuring and Board-grade positions.',
    },
    'e-invoicing': {
      title: 'UAE E-Invoicing Readiness — Peppol & FTA Compliance | Authentic Accounting',
      description: 'Prepare your UAE business for e-invoicing mandates. System readiness, Peppol integration guidance, process design and compliance advisory.',
    },
    industries: {
      title: 'Industries We Serve — UAE Accounting & Advisory | Authentic Accounting',
      description: 'Sector-specific accounting and advisory for trading, manufacturing, hospitality, healthcare, real estate, technology and Government entities across the UAE.',
    },
    about: {
      title: 'About Us — Authentic Accounting | UAE Accounting & Advisory Firm Since 2017',
      description: 'Learn about Authentic Accounting and Bookkeeping L.L.C — a Dubai-based firm delivering reconciliation discipline, regulatory compliance and Board-grade advisory since 2017.',
    },
    insights: {
      title: 'Insights — UAE Tax, Compliance & Advisory Articles | Authentic Accounting',
      description: 'Regulatory updates, FTA guidance, Corporate Tax notes and advisory articles from Authentic Accounting\'s UAE compliance team.',
    },
    careers: {
      title: 'Careers — Join Authentic Accounting | Dubai, UAE',
      description: 'Explore career opportunities at Authentic Accounting. Join a UAE compliance and advisory team built on reconciliation discipline and professional standards.',
    },
    contact: {
      title: 'Contact Us — Book a Consultation | Authentic Accounting Dubai',
      description: 'Contact Authentic Accounting in Dubai. Book a consultation for bookkeeping, VAT, Corporate Tax, valuations or advisory support across the UAE.',
    },
    privacy: {
      title: 'Privacy Policy | Authentic Accounting Dubai',
      description: 'How Authentic Accounting and Bookkeeping L.L.C collects, uses, retains and protects personal information submitted through aaccounting.me, in line with UAE Federal Decree-Law No. 45 of 2021 (PDPL).',
    },
    terms: {
      title: 'Terms of Use | Authentic Accounting Dubai',
      description: 'Terms governing use of the aaccounting.me website. Marketing site only — does not constitute a professional engagement. UAE law and Dubai courts apply.',
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
      a: 'An ASP is a provider accredited by the UAE Ministry of Finance to transmit your e-invoices through the official network. Every in-scope business must appoint one — invoices are issued and exchanged through your ASP.' },
    { q: 'What is the 5-corner (OpenPeppol) model?',
      a: 'The UAE uses the OpenPeppol "5-corner" model: each invoice is exchanged as structured data between your ASP and your counterparty’s ASP, with the Federal Tax Authority as a reporting corner — replacing PDFs and paper.' },
    { q: 'Will PDF or paper invoices still be valid?',
      a: 'No. From your phase’s go-live date, only structured invoices transmitted through an accredited ASP will be valid for the covered transactions. PDF and paper invoices will not.' },
    { q: 'Does a free zone company have to comply?',
      a: 'Yes. The mandate applies to B2B and B2G transactions across the UAE, including free zone companies, based on the same revenue thresholds.' },
    { q: 'What is the legal basis for UAE e-invoicing?',
      a: 'Ministerial Decisions 243 and 244 of 2025, issued by the UAE Ministry of Finance, set the scope, obligations, ASP accreditation and the phased timeline.' },
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
      a: 'Businesses with total revenue of AED 3 million or less in a tax period can elect Small Business Relief and be treated as having no taxable income. It is a transitional measure available for tax periods ending on or before 31 December 2026, and it must be actively elected with the FTA.' },
    { q: 'Do free zone companies pay Corporate Tax?',
      a: 'A Qualifying Free Zone Person (QFZP) can benefit from a 0% rate on its qualifying income if it meets all conditions (adequate substance, qualifying activities and the de minimis limits) under Cabinet Decision 100 of 2023 and Ministerial Decision 229 of 2025. Non-qualifying income is taxed at 9%, and free zone businesses must still register and file.' },
    { q: 'When is my Corporate Tax return due?',
      a: 'The return must be filed, and any tax paid, within nine months of the end of your tax period. For a 31 December year-end, the return is due by 30 September of the following year.' },
    { q: 'What is the penalty for registering late?',
      a: 'Late Corporate Tax registration carries an administrative penalty of AED 10,000. The FTA has waived this penalty where a business files its first Corporate Tax return within seven months of the end of its first tax period.' },
    { q: 'What about large multinational groups?',
      a: 'Multinational groups with consolidated global revenue of EUR 750 million or more are subject to a 15% Domestic Minimum Top-up Tax (DMTT) for financial years starting on or after 1 January 2025, in line with the OECD Pillar Two rules.' },
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
      a: 'You must register if your taxable turnover crossed AED 375,000 in the past 12 months, or you reasonably expect it to in the next 30 days. Voluntary registration is available once you reach AED 187,500.' },
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
    if (page === 'services' || page === 'e-invoicing' || page.indexOf('service-') === 0) {
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
    const FAQ_BY_PAGE = { 'e-invoicing': EINVOICE_FAQ, 'service-corporate-tax': CORPTAX_FAQ, 'service-bookkeeping': BOOKKEEPING_FAQ, 'service-audit-support': AUDIT_FAQ, 'service-valuations': VALUATIONS_FAQ, 'service-transaction-advisory': TRANSACTION_FAQ, 'service-cfo': CFO_FAQ, 'service-financial-statements': FS_FAQ, 'service-tax-planning': TAXPLAN_FAQ, 'service-vat': VAT_FAQ, 'service-fixed-asset-tagging': FIXED_ASSET_FAQ, 'service-forensic-accounting': FORENSIC_FAQ, 'service-internal-controls': CONTROLS_FAQ, 'service-financial-modelling': MODELLING_FAQ, 'service-feasibility-studies': FEASIBILITY_FAQ, 'service-strategic-advisory': STRATEGIC_FAQ };
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
        title: a.title.replace(/\.\s*$/, '') + ' | Authentic Accounting Insights',
        description: a.excerpt,
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

  window.AARoutes = {
    SITE_ORIGIN,
    TAX_RULES_ASOF: 'June 2026',
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
