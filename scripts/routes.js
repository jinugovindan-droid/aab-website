(function () {
  const SITE_ORIGIN = 'https://aaccounting.me';
  const INSIGHTS_BASE = '/insights';

  const PAGE_TO_PATH = {
    home: '/',
    services: '/services',
    'service-vat': '/services/vat',
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
      slug: 'free-zone-qualifying-income',
      tag: 'Corporate Tax', date: '12 Apr 2026', read: '6 min',
      title: 'Free zone qualifying income — three traps in the UAE free-zone tax rules.',
      author: 'CA Kiran Prasad S', reviewer: 'Jinu Govindan', reference: 'CT-2026-MEMO-018',
      excerpt: 'The UAE’s free-zone tax rules — Cabinet Decision 100 of 2023 and Ministerial Decision 265 of 2023, since updated by Ministerial Decision 229 of 2025 — are being read three different ways by tax teams in the UAE. We unpack the three traps we keep seeing in client positions, and what the consequence is at filing.',
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
      description: 'UAE-based chartered accounting firm serving SMEs, enterprises and Government across all 7 emirates. Bookkeeping, VAT, Corporate Tax filing, financial statements (IFRS), valuations, M&A support and due diligence — delivered with reconciliation discipline since 2017.',
    },
    services: {
      title: 'Services — Bookkeeping, VAT, Corporate Tax & Advisory | Authentic Accounting',
      description: 'Compliance and advisory services for UAE businesses: bookkeeping, VAT, Corporate Tax, IFRS financial statements, valuations, M&A support and due diligence.',
    },
    'service-vat': {
      title: 'VAT Compliance UAE — Registration, Filing & FTA Support | Authentic Accounting',
      description: 'End-to-end UAE VAT compliance: registration, return filing, FTA correspondence, voluntary disclosures and audit support for SMEs and enterprises.',
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
      title: 'About Us — Authentic Accounting | UAE Chartered Accountants Since 2017',
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
    PAGE_TO_PATH,
    VALID_PAGES,
    PAGE_SEO,
    INSIGHTS,
    DEFAULT_INSIGHT,
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
