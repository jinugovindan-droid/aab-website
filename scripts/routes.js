(function () {
  const SITE_ORIGIN = 'https://aaccounting.me';

  const PAGE_TO_PATH = {
    home: '/',
    services: '/services',
    'service-vat': '/services/vat',
    'e-invoicing': '/e-invoicing',
    industries: '/industries',
    about: '/about',
    insights: '/insights',
    insight: '/insight',
    careers: '/careers',
    contact: '/contact',
    privacy: '/privacy',
    terms: '/terms',
  };

  const PATH_ALIASES = {
    '/service-vat': 'service-vat',
  };

  const VALID_PAGES = new Set(Object.keys(PAGE_TO_PATH));

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
    insight: {
      title: 'UAE Corporate Tax — What SMEs Need to Know | Authentic Accounting Insights',
      description: 'A practical guide for UAE SMEs on Corporate Tax registration, small business relief, filing deadlines and common compliance pitfalls.',
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

  function pageFromPath(pathname) {
    const path = normalizePath(pathname);
    if (PATH_ALIASES[path]) return PATH_ALIASES[path];
    for (const [page, pagePath] of Object.entries(PAGE_TO_PATH)) {
      if (pagePath === path) return page;
    }
    return 'home';
  }

  function pathForPage(page) {
    const id = VALID_PAGES.has(page) ? page : 'home';
    return PAGE_TO_PATH[id];
  }

  function fullUrlForPage(page) {
    const path = pathForPage(page);
    return SITE_ORIGIN + (path === '/' ? '/' : path);
  }

  function setMetaContent(selector, content) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('content', content);
  }

  function applyPageMeta(page) {
    const id = VALID_PAGES.has(page) ? page : 'home';
    const meta = PAGE_SEO[id] || PAGE_SEO.home;
    const canonical = fullUrlForPage(id);

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
    pageFromPath,
    pathForPage,
    fullUrlForPage,
    applyPageMeta,
    redirectLegacyHash,
  };
})();
