// AppRoot — application shell + client-side router.
// Precompiled into dist/app.min.js (was the inline <script type="text/babel"> in index.html).
const { useState, useEffect, useLayoutEffect } = React;

// Tweak defaults live in index.html (inside the EDITMODE markers the design host
// rewrites on disk); we read them from the global so that tooling still works.
const TWEAK_DEFAULTS = window.AA_TWEAK_DEFAULTS || {
  displayFont: 'Oswald', accentIntensity: 'default', density: 'comfortable', showSubBar: true,
};

const PAGE_LABELS = {
  home: '01 Home',
  services: '02 Services',
  'service-vat': '03 Service · VAT',
  'service-corporate-tax': '03 Service · Corporate Tax',
  'service-bookkeeping': '03 Service · Bookkeeping',
  'service-audit-support': '03 Service · Audit Support',
  'service-valuations': '03 Service · Valuations',
  'service-transaction-advisory': '03 Service · Transaction Advisory',
  'service-cfo': '03 Service · CFO',
  'service-financial-statements': '03 Service · Financial Statements',
  'service-tax-planning': '03 Service · Tax Planning',
  'service-ct-filing': '03 Service · CT Filing',
  'service-vat-filing': '03 Service · VAT Filing',
  'service-vat-refund': '03 Service · VAT Refunds',
  'service-tax-advisory': '03 Service · Tax Advisory',
  'service-fixed-asset-tagging': '03 Service · Fixed Assets',
  'service-forensic-accounting': '03 Service · Forensic',
  'service-internal-controls': '03 Service · Internal Controls',
  'service-financial-modelling': '03 Service · Modelling',
  'service-feasibility-studies': '03 Service · Feasibility',
  'service-strategic-advisory': '03 Service · Strategic',
  'e-invoicing': '04 E-Invoicing',
  'einv-deadline': '04 E-Invoicing · 30 Oct Deadline',
  industries: '05 Industries',
  'industry-real-estate': '05 Industry · Real Estate',
  'industry-construction': '05 Industry · Construction',
  'industry-trading': '05 Industry · Trading',
  'industry-hospitality': '05 Industry · Hospitality',
  'industry-ecommerce': '05 Industry · E-commerce',
  'industry-manufacturing': '05 Industry · Manufacturing',
  'location-abu-dhabi': '05 Location · Abu Dhabi',
  'location-sharjah': '05 Location · Sharjah',
  'location-ajman': '05 Location · Ajman',
  'location-ras-al-khaimah': '05 Location · RAK',
  'location-fujairah': '05 Location · Fujairah',
  'location-umm-al-quwain': '05 Location · UAQ',
  about: '06 About',
  insights: '07 Insights',
  insight: '08 Insight Article',
  careers: '09 Careers',
  contact: '10 Contact',
  privacy: '11 Privacy',
  terms: '12 Terms',
};

const { pageFromPath, pathForPage, pathForInsight, insightSlugFromPath, applyPageMeta, redirectLegacyHash, VALID_PAGES } = window.AARoutes;

redirectLegacyHash();

function pageFromLocation() {
  return pageFromPath(window.location.pathname);
}

function slugFromLocation() {
  return insightSlugFromPath(window.location.pathname);
}

function AppRoot() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPageState] = useState(pageFromLocation);
  const [insightSlug, setInsightSlug] = useState(slugFromLocation);
  useScrollReveal(page === 'insight' ? 'insight:' + (insightSlug || '') : page);

  const navigateTo = (next, nextSlug) => {
    const id = VALID_PAGES.has(next) ? next : 'home';
    const slug = id === 'insight' ? (nextSlug || null) : null;
    setPageState(id);
    setInsightSlug(slug);
    const nextPath = id === 'insight' ? pathForInsight(slug) : pathForPage(id);
    const nextUrl = nextPath + window.location.search;
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== nextUrl) {
      history.pushState(null, '', nextUrl);
    }
  };

  useEffect(() => {
    const syncFromUrl = () => {
      setPageState(pageFromLocation());
      setInsightSlug(slugFromLocation());
    };
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  useEffect(() => {
    applyPageMeta(page, insightSlug);
    // GA4 single-page-app page_view (GA config has send_page_view:false).
    if (window.AA_GA_ID && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: window.location.pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [page, insightSlug]);

  useEffect(() => {
    document.documentElement.style.setProperty('--aa-font-display',
      tweaks.displayFont === 'Archivo Black'
        ? "'Archivo Black','Archivo','Antique Olive',sans-serif"
        : "'Oswald','Archivo','Antique Olive',sans-serif");

    // Presets are shades OF the logo blue (#00B0F0) — never other blues.
    const accent = tweaks.accentIntensity === 'bold' ? '#0092C8'
                 : tweaks.accentIntensity === 'soft' ? '#4FC6F5'
                 : '#00B0F0';
    document.documentElement.style.setProperty('--aa-cyan', accent);

    document.body.setAttribute('data-density', tweaks.density);
  }, [tweaks]);

  // Mount signal for scripts/snapshot.mjs. An effect, not rAF: in headless
  // Chrome only the foreground tab produces frames, so rAF-based signals
  // starve in the snapshot's background tabs — effects always run.
  useEffect(() => { window.__AA_MOUNTED = true; }, []);

  // Lucide must run after any render that adds [data-lucide] nodes
  // (page change, FAQ open, wizard step, filter change). rAF debounces to one
  // pass per paint so we don't pay 50× during a single state update.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (window.lucide) window.lucide.createIcons();
    });
    return () => cancelAnimationFrame(id);
  });

  // On every page change: either scroll to a requested anchor (set by
  // deep-link patterns like Services-card -> Contact wizard) or scroll
  // to top. useLayoutEffect runs synchronously after DOM commit but
  // BEFORE the browser paints, so the user never sees the new page
  // briefly at the old scroll position. behavior:'instant' overrides
  // the page-wide `html { scroll-behavior: smooth }` rule so this is
  // a single hard jump, not an animation.
  const firstScrollRun = React.useRef(true);
  useLayoutEffect(() => {
    let target = null;
    try {
      target = sessionStorage.getItem('aa_scroll_target');
      if (target) sessionStorage.removeItem('aa_scroll_target');
    } catch (err) {}
    if (target) {
      const el = document.getElementById(target);
      if (el) { el.scrollIntoView({ block: 'start', behavior: 'instant' }); return; }
    }
    // Initial mount replaces the prerendered static body the visitor may already
    // be reading (slow-network case: the loader's 8s cap lifts before JS lands) —
    // never yank them back to the top; only reset scroll on real page CHANGES.
    if (firstScrollRun.current) { firstScrollRun.current = false; return; }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page, insightSlug]);

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage onNav={navigateTo}/>;
      case 'services': return <ServicesPage onNav={navigateTo}/>;
      case 'service-vat': return <ServiceVATPage onNav={navigateTo}/>;
      case 'service-corporate-tax': return <ServiceCorporateTaxPage onNav={navigateTo}/>;
      case 'service-bookkeeping': return <ServiceBookkeepingPage onNav={navigateTo}/>;
      case 'service-audit-support': return <ServiceAuditSupportPage onNav={navigateTo}/>;
      case 'service-valuations': return <ServiceValuationsPage onNav={navigateTo}/>;
      case 'service-transaction-advisory': return <ServiceTransactionAdvisoryPage onNav={navigateTo}/>;
      case 'service-cfo': return <ServiceCFOPage onNav={navigateTo}/>;
      case 'service-financial-statements': return <ServiceFinancialStatementsPage onNav={navigateTo}/>;
      case 'service-tax-planning': return <ServiceTaxPlanningPage onNav={navigateTo}/>;
      case 'service-ct-filing':
      case 'service-vat-filing':
      case 'service-vat-refund':
      case 'service-tax-advisory':
      case 'service-fixed-asset-tagging':
      case 'service-forensic-accounting':
      case 'service-internal-controls':
      case 'service-financial-modelling':
      case 'service-feasibility-studies':
      case 'service-strategic-advisory': return <ServiceSimplePage page={page} onNav={navigateTo}/>;
      case 'e-invoicing': return <EInvoicingPage onNav={navigateTo}/>;
      case 'einv-deadline': return <EInvDeadlinePage onNav={navigateTo}/>;
      case 'industries': return <IndustriesPage onNav={navigateTo}/>;
      case 'industry-real-estate':
      case 'industry-construction':
      case 'industry-trading':
      case 'industry-hospitality':
      case 'industry-ecommerce':
      case 'industry-manufacturing': return <IndustrySimplePage page={page} onNav={navigateTo}/>;
      case 'location-abu-dhabi':
      case 'location-sharjah':
      case 'location-ajman':
      case 'location-ras-al-khaimah':
      case 'location-fujairah':
      case 'location-umm-al-quwain': return <LocationPage page={page} onNav={navigateTo}/>;
      case 'about': return <AboutPage onNav={navigateTo}/>;
      case 'insights': return <InsightsPage onNav={navigateTo}/>;
      case 'insight': return <InsightArticlePage onNav={navigateTo} slug={insightSlug}/>;
      case 'careers': return <CareersPage onNav={navigateTo}/>;
      case 'contact': return <ContactPage onNav={navigateTo}/>;
      case 'privacy': return <PrivacyPolicyPage onNav={navigateTo}/>;
      case 'terms': return <TermsPage onNav={navigateTo}/>;
      default: return <HomePage onNav={navigateTo}/>;
    }
  };

  const navActive = page === 'service-corporate-tax' ? 'service-corporate-tax'
                  : page === 'service-vat' ? 'service-vat'
                  : (typeof page === 'string' && page.indexOf('service-') === 0) ? 'services'
                  : (typeof page === 'string' && page.indexOf('industry-') === 0) ? 'industries'
                  : page === 'insight' ? 'insights' : page;

  return (
    <div data-screen-label={PAGE_LABELS[page] || page}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {tweaks.showSubBar && <SubBar/>}
      <TopNav active={navActive} onNav={navigateTo}/>
      <main id="main-content" tabIndex={-1}>{renderPage()}</main>
      <Footer onNav={navigateTo}/>
      <WhatsAppFab/>
      <EInvoiceMarquee onNav={navigateTo}/>
      <EInvoiceReadinessModal onNav={navigateTo}/>
      <SiteSearchModal onNav={navigateTo}/>
      <CookieConsent onNav={navigateTo}/>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Typography">
          <TweakRadio
            label="Display font"
            value={tweaks.displayFont}
            options={[{value:'Oswald',label:'Oswald'},{value:'Archivo Black',label:'Archivo Black'}]}
            onChange={v => setTweak('displayFont', v)}
          />
        </TweakSection>
        <TweakSection title="Accent">
          <TweakRadio
            label="Cyan intensity"
            value={tweaks.accentIntensity}
            options={[{value:'soft',label:'Soft'},{value:'default',label:'Default'},{value:'bold',label:'Bold'}]}
            onChange={v => setTweak('accentIntensity', v)}
          />
        </TweakSection>
        <TweakSection title="Layout">
          <TweakRadio
            label="Density"
            value={tweaks.density}
            options={[{value:'comfortable',label:'Comfortable'},{value:'compact',label:'Compact'}]}
            onChange={v => setTweak('density', v)}
          />
          <TweakToggle
            label="Show regulator sub-bar"
            value={tweaks.showSubBar}
            onChange={v => setTweak('showSubBar', v)}
          />
        </TweakSection>
        <TweakSection title="Quick navigation">
          <TweakSelect
            label="Jump to page"
            value={page}
            options={Object.entries(PAGE_LABELS).map(([v,l])=>({value:v,label:l}))}
            onChange={v => navigateTo(v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AppRoot/>);

// Dismiss the first-paint loader once the app has actually rendered a frame
// (double rAF = after React commits and the browser paints). The inline script
// in index.html owns the fade-out + removal and has its own safety timeouts.
requestAnimationFrame(function () {
  requestAnimationFrame(function () { if (window.__aaHideLoader) window.__aaHideLoader(); });
});
