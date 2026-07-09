// Site chrome: TopNav (with mobile drawer), SubBar, Footer, WhatsAppFab, ScrollReveal
const { useState, useEffect, useRef } = React;
const { pathForPage } = window.AARoutes;

// Flat list — used by the mobile drawer (it has vertical room for all ten).
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'service-corporate-tax', label: 'Corporate Tax' },
  { id: 'service-vat', label: 'VAT' },
  { id: 'e-invoicing', label: 'E-Invoicing' },
  { id: 'industries', label: 'Industries' },
  { id: 'about', label: 'About' },
  { id: 'insights', label: 'Insights' },
  { id: 'careers', label: 'Careers' },
  { id: 'contact', label: 'Contact' },
];

// Desktop bar — Corporate Tax + VAT group under "Tax"; E-Invoicing stays
// top-level (owner's call: it is the flagship campaign). On narrow/zoomed
// viewports the bar WRAPS to a second line rather than hiding (see site.css);
// the burger only appears at true phone widths.
// Football (World Cup) edition of the logo runs until 20 Jul 2026 UAE time,
// then the site chrome reverts to the classic logo automatically — no deploy
// needed (static assets like the favicon are reverted by a scheduled job).
const FOOTBALL_LOGO_UNTIL = Date.parse('2026-07-20T00:00:00+04:00');
const FOOTBALL_LOGO_ACTIVE = Date.now() < FOOTBALL_LOGO_UNTIL;

const TAX_CHILDREN = [
  { id: 'service-corporate-tax', label: 'Corporate Tax' },
  { id: 'service-vat', label: 'VAT Compliance' },
];
const DESKTOP_NAV = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'tax', label: 'Tax', children: TAX_CHILDREN },
  { id: 'e-invoicing', label: 'E-Invoicing' },
  { id: 'industries', label: 'Industries' },
  { id: 'about', label: 'About' },
  { id: 'insights', label: 'Insights' },
  { id: 'careers', label: 'Careers' },
  { id: 'contact', label: 'Contact' },
];

// Nav dropdown ("Tax"). Hover-open stays a CSS enhancement for mouse users;
// click/tap and keyboard TOGGLE the menu (state + aria-expanded) so touch
// devices above the burger breakpoint can actually reach every child —
// previously a tap navigated straight to the first child and the menu itself
// was unreachable without hover. Escape and outside-click close it.
function NavDropdown({ item, active, go }) {
  const [open, setDdOpen] = useState(false);
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const menuId = 'aa-navmenu-' + item.id;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { setDdOpen(false); if (btnRef.current) btnRef.current.focus(); }
    };
    const onPointer = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer); };
  }, [open]);

  return (
    <div ref={rootRef} className={`topnav__item${open ? ' is-open' : ''}`}>
      <button
        ref={btnRef}
        className={`topnav__link topnav__link--menu${item.children.some((c) => c.id === active) ? ' is-active' : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setDdOpen((v) => !v)}>
        {item.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div className="topnav__dropdown" id={menuId}>
        {item.children.map((c) => (
          <a
            key={c.id}
            href={pathForPage(c.id)}
            className={`topnav__dropdown-link${active === c.id ? ' is-active' : ''}`}
            onClick={(e) => { e.preventDefault(); setDdOpen(false); go(c.id); }}>
            {c.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function TopNav({ active, onNav, sticky = true }) {
  const [open, setOpen] = useState(false);
  // Bumping the key remounts the logo stack, which replays the CSS load
  // animation — used to replay the morph on hover. Native mouseenter (not the
  // React synthetic one): remounting the stack under a stationary pointer makes
  // Chrome re-dispatch mouseover, which React would turn into another enter and
  // restart the animation forever. The cooldown lets a run finish first.
  const [logoPlay, setLogoPlay] = useState(0);
  const logoRef = useRef(null);
  const logoLastPlay = useRef(Date.now());
  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const onEnter = () => {
      const now = Date.now();
      if (now - logoLastPlay.current > 3200) {
        logoLastPlay.current = now;
        setLogoPlay((p) => p + 1);
      }
    };
    el.addEventListener('mouseenter', onEnter);
    return () => el.removeEventListener('mouseenter', onEnter);
  }, []);

  // Lock body scroll & close on Escape when drawer is open
  useEffect(() => {
    if (open) {
      document.body.classList.add('no-scroll');
      const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.classList.remove('no-scroll');
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [open]);

  const go = (id) => { onNav(id); setOpen(false); };

  return (
    <>
      <header className="topnav" style={{ position: sticky ? 'sticky' : 'static' }}>
        <div className="container topnav__inner">
          <a className="topnav__logo" ref={logoRef} href={pathForPage('home')} onClick={(e) => { e.preventDefault(); go('home'); }} aria-label="Authentic Accounting — Home">
            {/* Load animation: the classic A mark morphs into the A-inside-football.
                Layer order: football logo (fades in) / classic wordmark (static, identical
                in both logos) / classic A mark (shrinks into the ball and fades out).
                Hovering remounts the stack (key bump) so the morph replays. */}
            {FOOTBALL_LOGO_ACTIVE ? (
              <span className="logo-anim" key={logoPlay}>
                <img className="logo-anim__ball" src="assets/logos/aab-short-eng.png?v=3" alt="Authentic Accounting" />
                <img className="logo-anim__wordmark" src="assets/logos/aab-short-eng-classic.png" alt="" aria-hidden="true" />
                <img className="logo-anim__classic" src="assets/logos/aab-short-eng-classic.png" alt="" aria-hidden="true" />
              </span>
            ) : (
              <img src="assets/logos/aab-short-eng-classic.png" alt="Authentic Accounting" />
            )}
          </a>
          <nav className="topnav__list" aria-label="Primary">
            {DESKTOP_NAV.map((it) => it.children ? (
              <NavDropdown key={it.id} item={it} active={active} go={go} />
            ) : (
              <a
                key={it.id}
                href={pathForPage(it.id)}
                className={`topnav__link${active === it.id ? ' is-active' : ''}`}
                onClick={(e) => { e.preventDefault(); go(it.id); }}>
                {it.label}
              </a>
            ))}
          </nav>
          <div className="topnav__right">
            <button className="topnav__search" aria-label="Search the site" onClick={() => window.dispatchEvent(new Event('aa:open-search'))}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button className="btn btn--primary btn--sm" onClick={() => go('contact')}>
              Book a consultation
            </button>
          </div>
          <button
            className="topnav__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="aa-mobile-nav"
            onClick={() => setOpen(true)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="7"  x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
        </div>
      </header>

      <div
        id="aa-mobile-nav"
        className={`topnav__drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
        <div className="topnav__drawer-panel">
          <button
            className="topnav__drawer-close"
            aria-label="Close menu"
            onClick={() => setOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>

          <button
            className="topnav__drawer-search"
            onClick={() => { setOpen(false); window.dispatchEvent(new Event('aa:open-search')); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Search the site…</span>
          </button>

          {NAV_ITEMS.map((it, i) => (
            <a
              key={it.id}
              href={pathForPage(it.id)}
              className={`topnav__drawer-link${active === it.id ? ' is-active' : ''}`}
              onClick={(e) => { e.preventDefault(); go(it.id); }}>
              <span>{it.label}</span>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            </a>
          ))}

          <div className="topnav__drawer-cta">
            <button className="btn btn--primary" onClick={() => go('contact')}>
              Book a consultation
              <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
            </button>
            <a className="btn btn--ghost" href="https://wa.me/971565484635" target="_blank" rel="noopener" style={{ justifyContent: 'center' }}>
              <i data-lucide="message-circle" style={{ width: 14, height: 14 }}></i>
              WhatsApp us
            </a>
          </div>

          <div className="topnav__drawer-meta">
            <span>Office 406, Mai Tower · Al Nahda 1, Dubai</span>
            <span><a href="tel:+97143960399" style={{ color: 'inherit', textDecoration: 'none' }}>+971 4 396 0399</a></span>
            <span><a href="mailto:info@aaccounting.me" style={{ color: 'inherit', textDecoration: 'none' }}>info@aaccounting.me</a></span>
          </div>
        </div>
      </div>
    </>
  );
}

function SubBar() {
  return (
    <div className="subbar">
      <div className="container subbar__inner">
        <div className="subbar__left">
          <span><span className="dot"></span>UAE · COMPLIANCE & ADVISORY · SINCE 2017</span>
        </div>
        <div className="subbar__right">
          <span>SERVING ALL 7 EMIRATES OF THE UAE</span>
        </div>
      </div>
    </div>
  );
}

// Floating WhatsApp action button — visible on every page, mobile + desktop.
function WhatsAppFab() {
  return (
    <a
      className="aa-wa-fab"
      href="https://wa.me/971565484635"
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp">
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16.003 3.2C9.07 3.2 3.467 8.806 3.467 15.74c0 2.218.583 4.382 1.69 6.286L3.2 28.8l6.96-1.92a12.46 12.46 0 0 0 5.843 1.46h.005c6.93 0 12.535-5.606 12.535-12.54 0-3.349-1.304-6.498-3.673-8.867A12.45 12.45 0 0 0 16.003 3.2zm0 22.83h-.004a10.4 10.4 0 0 1-5.301-1.45l-.38-.225-4.13 1.14 1.103-4.025-.247-.4a10.39 10.39 0 0 1-1.59-5.531c.002-5.752 4.685-10.43 10.553-10.43a10.43 10.43 0 0 1 7.42 3.07 10.43 10.43 0 0 1 3.071 7.42c-.002 5.753-4.685 10.43-10.495 10.43zm5.72-7.812c-.314-.157-1.856-.916-2.143-1.02-.288-.105-.498-.157-.707.157-.21.314-.812 1.02-.995 1.23-.184.21-.367.236-.681.079-.314-.157-1.325-.488-2.525-1.557-.933-.832-1.563-1.86-1.747-2.174-.183-.314-.02-.484.138-.64.141-.141.314-.367.471-.55.157-.184.21-.314.314-.524.105-.21.052-.393-.026-.55-.079-.157-.707-1.704-.969-2.334-.255-.612-.514-.53-.707-.54-.183-.008-.393-.01-.602-.01-.21 0-.55.079-.838.393-.288.314-1.1 1.074-1.1 2.62 0 1.547 1.126 3.041 1.283 3.251.157.21 2.214 3.382 5.366 4.744.75.324 1.336.517 1.793.662.753.24 1.438.207 1.98.126.604-.091 1.856-.759 2.118-1.49.262-.733.262-1.36.184-1.49-.079-.131-.288-.21-.602-.367z"/>
      </svg>
      <span className="aa-wa-fab__label">Chat on WhatsApp</span>
    </a>
  );
}

// Reveal every <section> as it scrolls into view. Keyed to navigation only, so
// unrelated re-renders don't tear the observer down mid-scroll (that bug left
// below-the-fold sections stuck at opacity:0). Also reveals whatever is already
// on screen immediately, and has a fallback so content is never left hidden.
function useScrollReveal(navKey) {
  useEffect(() => {
    const els = Array.prototype.slice.call(document.querySelectorAll('main section, main .statline'));
    const show = (el) => el.classList.add('is-visible');
    els.forEach((el) => el.classList.add('reveal'));

    // Anything already in the viewport shows right away (don't wait for a scroll tick).
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    els.forEach((el) => { if (el.getBoundingClientRect().top < vh * 0.92) show(el); });

    let io = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      els.forEach((el) => { if (!el.classList.contains('is-visible')) io.observe(el); });
    } else {
      els.forEach(show);
    }

    // Safety net: never leave a section invisible if the observer misfires.
    const fallback = setTimeout(() => els.forEach(show), 1800);

    return () => { if (io) io.disconnect(); clearTimeout(fallback); };
  }, [navKey]);
}

function Footer({ onNav }) {
  const cols = [
    { title: 'Compliance', items: [
      ['Outsourced accounting', 'service-bookkeeping'],
      ['VAT compliance', 'service-vat'],
      ['UAE Corporate Tax', 'service-corporate-tax'],
      ['Financial statements', 'service-financial-statements'],
      ['Audit support', 'service-audit-support'],
      ['E-Invoicing', 'e-invoicing'],
      ['Fixed asset tagging', 'service-fixed-asset-tagging'],
    ]},
    { title: 'Advisory', items: [
      ['Business valuations', 'service-valuations'],
      ['M&A support', 'service-transaction-advisory'],
      ['Financial due diligence', 'service-transaction-advisory'],
      ['Forensic accounting', 'service-forensic-accounting'],
      ['CFO services', 'service-cfo'],
      ['Tax planning', 'service-tax-planning'],
      ['Financial modeling', 'service-financial-modelling'],
      ['Feasibility studies', 'service-feasibility-studies'],
    ]},
    { title: 'Firm', items: [
      ['About', 'about'],
      ['Industries', 'industries'],
      ['Insights', 'insights'],
      ['Careers', 'careers'],
      ['Contact', 'contact'],
    ]},
  ];

  return (
    <footer style={{ background: '#fff', borderTop: '1px solid var(--aa-rule)', paddingTop: 64 }}>
      <div className="container">
        <div
          className="aa-stack-sm"
          style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48 }}>
          <div>
            <img
              src={FOOTBALL_LOGO_ACTIVE ? 'assets/logos/authentic-accounting-full.png' : 'assets/logos/authentic-accounting-full-classic.png'}
              alt="Authentic Accounting and Bookkeeping L.L.C"
              loading="lazy"
              style={{ height: 56 }} />

            <div style={{ marginTop: 18, fontFamily: 'var(--aa-font-display)', fontSize: 18, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--aa-cyan-700)' }}>
              Responsibly Your Accountant.
            </div>
            <div style={{ marginTop: 18, fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.7 }}>
              Authentic Accounting and Bookkeeping L.L.C<br />
              Office 406, Mai Tower<br />
              Al Nahda 1, Dubai, UAE<br />
              <a href="tel:+97143960399" style={{ color: 'var(--aa-charcoal)', textDecoration: 'none' }}>+971 4 396 0399</a> · <a href="mailto:info@aaccounting.me" style={{ color: 'inherit', textDecoration: 'none' }}>info@aaccounting.me</a>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 14, fontSize: 13, flexWrap: 'wrap' }}>
              <a href="https://www.linkedin.com/company/14621146/" target="_blank" rel="noopener" aria-label="LinkedIn" style={{ color: 'var(--aa-steel-700)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i data-lucide="briefcase" style={{ width: 14, height: 14 }}></i>LinkedIn
              </a>
              <a href="https://www.facebook.com/aaccounting.me/" target="_blank" rel="noopener" aria-label="Facebook" style={{ color: 'var(--aa-steel-700)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i data-lucide="users" style={{ width: 14, height: 14 }}></i>Facebook
              </a>
              <a href="https://www.youtube.com/@authenticaccounting" target="_blank" rel="noopener" aria-label="YouTube" style={{ color: 'var(--aa-steel-700)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i data-lucide="play-circle" style={{ width: 14, height: 14 }}></i>YouTube
              </a>
              <a href="https://wa.me/971565484635" target="_blank" rel="noopener" aria-label="WhatsApp" style={{ color: 'var(--aa-steel-700)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i data-lucide="message-circle" style={{ width: 14, height: 14 }}></i>WhatsApp
              </a>
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid var(--aa-charcoal)' }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map(([label, route]) => (
                  <a
                    key={label}
                    href={pathForPage(route)}
                    onClick={(e) => { e.preventDefault(); onNav(route); }}
                    style={{ fontSize: 14, color: 'var(--aa-steel-700)', textDecoration: 'none' }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid var(--aa-rule)',
          padding: '24px 0',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          fontSize: 11, color: 'var(--aa-steel)',
          letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600,
        }}>
          <span>© 2026 Authentic Accounting and Bookkeeping L.L.C</span>
          <span style={{ display: 'inline-flex', gap: 14, alignItems: 'center' }}>
            <a
              href="#privacy"
              onClick={(e) => { e.preventDefault(); onNav('privacy'); }}
              style={{ color: 'inherit', textDecoration: 'none', letterSpacing: 'inherit' }}>
              Privacy
            </a>
            <span aria-hidden="true" style={{ opacity: 0.5 }}>·</span>
            <a
              href="#terms"
              onClick={(e) => { e.preventDefault(); onNav('terms'); }}
              style={{ color: 'inherit', textDecoration: 'none', letterSpacing: 'inherit' }}>
              Terms
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

// Lucide's createIcons() replaces <i> nodes in place; React can't unmount those safely.
// Mount icons inside a host span React owns so teardown removes the whole subtree.
function LucideHost({ name, style = {} }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !window.lucide) return;
    host.replaceChildren();
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', name);
    host.appendChild(icon);
    window.lucide.createIcons({ root: host, nameAttr: 'data-lucide' });
  }, [name]);

  return (
    <span
      ref={hostRef}
      aria-hidden="true"
      style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 0, ...style }}
    />
  );
}

// Cookie consent banner — only shown when GA4 is configured (window.AA_GA_ID set),
// since Vercel Web Analytics is cookieless and needs no consent. Default state is
// "denied" (Consent Mode v2 in index.html); accepting upgrades analytics_storage.
function CookieConsent({ onNav }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.AA_GA_ID) return; // no analytics cookies in play → no banner
    let stored = null;
    try { stored = localStorage.getItem('aa-analytics-consent'); } catch (e) {}
    if (!stored) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (granted) => {
    try { localStorage.setItem('aa-analytics-consent', granted ? 'granted' : 'denied'); } catch (e) {}
    if (window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
      if (granted && window.AA_GA_ID) {
        window.gtag('event', 'page_view', {
          page_path: window.location.pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    }
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      style={{
        position: 'fixed', left: 16, bottom: 16, zIndex: 80, /* above the WhatsApp FAB (70) so its text is never occluded on narrow phones */
        maxWidth: 460, width: 'calc(100% - 32px)',
        background: 'var(--aa-charcoal)', color: '#fff',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
        padding: 22,
      }}
    >
      <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 10 }}>Cookies</div>
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.82)' }}>
        We use cookieless analytics to measure traffic. With your consent we also use
        Google Analytics, which sets analytics cookies. You can change your choice any time.{' '}
        <a
          href={pathForPage('privacy')}
          onClick={(e) => { e.preventDefault(); onNav('privacy'); }}
          style={{ color: 'var(--aa-cyan-200)', textDecoration: 'underline' }}
        >Privacy Policy</a>.
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button className="btn btn--primary btn--sm" onClick={() => decide(true)}>Accept analytics</button>
        <button
          onClick={() => decide(false)}
          style={{
            padding: '8px 16px', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase',
            fontWeight: 600, fontFamily: 'var(--aa-font-sans)', cursor: 'pointer',
            background: 'transparent', color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >Decline</button>
      </div>
    </div>
  );
}

// E-invoicing deadline ticker — sticky bottom marquee on every page. Live
// day-count to the next milestone; whole bar links to the briefing; dismissible
// for the session; pauses on hover; respects prefers-reduced-motion (via CSS).
function EInvoiceMarquee({ onNav }) {
  // Phased deadlines — UAE MoF Ministerial Decisions 243 & 244 of 2025.
  const TIERS = [
    { who: 'AED 50M+', asp: '30 Oct 2026', aspISO: '2026-10-30T00:00:00', live: '1 Jan 2027', goISO: '2027-01-01T00:00:00' },
    { who: 'Under AED 50M', asp: '31 Mar 2027', aspISO: '2027-03-31T00:00:00', live: '1 Jul 2027', goISO: '2027-07-01T00:00:00' },
    { who: 'Government', asp: '31 Mar 2027', aspISO: '2027-03-31T00:00:00', live: '1 Oct 2027', goISO: '2027-10-01T00:00:00' },
  ];
  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState([]);
  const [dl, setDl] = useState(null); // nearest upcoming go-live: { n, who, date }

  useEffect(() => {
    try {
      if (sessionStorage.getItem('aa-einv-marquee') === 'closed') {
        document.documentElement.classList.remove('aa-has-marquee'); // pre-paint reservation no longer needed
        return;
      }
    } catch (e) {}
    const now = new Date();
    const dleft = (iso) => Math.ceil((new Date(iso) - now) / 86400000);
    const r = TIERS.map((t) => ({ who: t.who, asp: t.asp, aspDays: dleft(t.aspISO), live: t.live, liveDays: dleft(t.goISO) }));
    setRows(r);
    const next = r.find((x) => x.liveDays > 0);
    setDl(next ? { n: next.liveDays, who: next.who, date: next.live } : null);
    setVisible(true);
    document.body.classList.add('has-marquee');
    return () => document.body.classList.remove('has-marquee');
  }, []);

  if (!visible) return null;

  const go = () => {
    // Open the readiness form as a pop-up over the current page — no scrolling,
    // works from anywhere. Falls back to the e-invoicing page if the modal
    // listener isn't mounted for any reason.
    try { window.dispatchEvent(new Event('aa:open-einvoice')); }
    catch (e) { onNav('e-invoicing'); }
  };
  const close = (e) => {
    e.stopPropagation();
    try { sessionStorage.setItem('aa-einv-marquee', 'closed'); } catch (e2) {}
    document.body.classList.remove('has-marquee');
    document.documentElement.classList.remove('aa-has-marquee');
    setVisible(false);
  };
  const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
  const dcount = (n) => <b className="aa-marquee__num">{n > 0 ? '(' + n.toLocaleString() + ' days)' : '(now due)'}</b>;

  const group = (key) => (
    <div className="aa-marquee__group" key={key} aria-hidden={key === 'b' ? 'true' : undefined}>
      <span className="aa-marquee__seg"><span className="aa-marquee__pill">⏳ Deadline</span></span>
      <span className="aa-marquee__seg">UAE e-invoicing · phased by revenue</span>
      <span className="aa-marquee__dot">·</span>
      {dl
        ? <span className="aa-marquee__seg"><span>Next go-live: {dl.who} in <b className="aa-marquee__num">{dl.n.toLocaleString()}</b> days ({dl.date})</span></span>
        : <span className="aa-marquee__seg">Phase 1 is now live</span>}
      {rows.map((r, i) => (
        <React.Fragment key={r.who}>
          <span className="aa-marquee__dot">·</span>
          <span className="aa-marquee__seg"><span>{r.who} — appoint ASP by <b style={{ color: '#fff', fontWeight: 700 }}>{r.asp}</b> {dcount(r.aspDays)}, go-live {r.live} {dcount(r.liveDays)}</span></span>
          {i === 1 && (
            <React.Fragment>
              <span className="aa-marquee__dot">·</span>
              <span className="aa-marquee__seg aa-marquee__cta">👉 Check your free e-invoicing readiness status & deadlines →</span>
            </React.Fragment>
          )}
        </React.Fragment>
      ))}
      <span className="aa-marquee__dot">·</span>
      <span className="aa-marquee__seg aa-marquee__cta">👉 Check your free e-invoicing readiness status — fill the 2-minute form →</span>
    </div>
  );

  return (
    <div className="aa-marquee" role="link" tabIndex={0}
      aria-label={'UAE e-invoicing deadlines, phased by revenue' + (dl ? '. ' + dl.who + ' go live in ' + dl.n + ' days, ' + dl.date : '') + '. Check your free e-invoicing readiness status and deadlines, and fill the form.'}
      onClick={go} onKeyDown={onKey}>
      <div className="aa-marquee__track">{group('a')}{group('b')}</div>
      <button className="aa-marquee__close" aria-label="Dismiss e-invoicing notice" onClick={close}>×</button>
    </div>
  );
}

// ---- Site search -----------------------------------------------------------
// Curated destination index + all published Insights. Client-side, no backend.
const SEARCH_PAGES = [
  ['home', 'Home', 'uae accounting advisory compliance dubai'],
  ['services', 'Services', 'all services overview'],
  ['service-corporate-tax', 'Corporate Tax', '9% corporate tax registration filing estimator emaratax small business relief qfzp free zone'],
  ['service-vat', 'VAT Compliance', 'vat registration return filing fta threshold checker 375000 187500 deadline'],
  ['e-invoicing', 'E-Invoicing', 'einvoicing e invoicing e-invoice einvoice invoice invoices electronic peppol pint ae asp accredited service provider readiness mandate phase 1 2027'],
  ['service-bookkeeping', 'Bookkeeping', 'outsourced accounting monthly close reconciliation'],
  ['service-financial-statements', 'Financial Statements', 'ifrs annual accounts'],
  ['service-audit-support', 'Audit Support', 'external audit ready workpapers'],
  ['service-valuations', 'Valuations', 'business valuation dcf equity purchase price'],
  ['service-transaction-advisory', 'Transaction Advisory', 'm&a mergers acquisitions due diligence deals'],
  ['service-cfo', 'CFO Services', 'virtual outsourced cfo'],
  ['service-tax-planning', 'Tax Planning', 'structuring advisory'],
  ['service-forensic-accounting', 'Forensic Accounting', 'fraud investigation disputes quantification'],
  ['service-internal-controls', 'Internal Controls', 'sops control framework segregation of duties'],
  ['service-financial-modelling', 'Financial Modelling', 'forecasts budgets three-statement model'],
  ['service-feasibility-studies', 'Feasibility Studies', 'project viability market study business case'],
  ['service-fixed-asset-tagging', 'Fixed Asset Tagging', 'far register verification barcode'],
  ['service-strategic-advisory', 'Strategic Advisory', 'growth strategy board advisory'],
  ['industries', 'Industries', 'sectors we serve'],
  ['industry-real-estate', 'Real Estate', 'property developers rera jointly owned'],
  ['industry-construction', 'Construction', 'contracting'],
  ['industry-trading', 'Trading & Distribution', 'inventory import export designated zone'],
  ['industry-hospitality', 'Hospitality & F&B', 'restaurants hotels pos'],
  ['industry-ecommerce', 'E-commerce & Retail', 'online marketplace'],
  ['industry-manufacturing', 'Manufacturing', 'cost accounting'],
  ['about', 'About', 'our firm since 2017 team'],
  ['insights', 'Insights', 'articles guides blog'],
  ['careers', 'Careers', 'jobs vacancies apply cv'],
  ['contact', 'Contact', 'book consultation reach us office'],
];

function SiteSearchModal({ onNav }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const openH = () => { setQ(''); setOpen(true); };
    window.addEventListener('aa:open-search', openH);
    return () => window.removeEventListener('aa:open-search', openH);
  }, []);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement; // restore focus here on close (a11y)
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const t = setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 30);
    if (window.lucide) window.lucide.createIcons();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
      if (opener && opener.focus) { try { opener.focus(); } catch (e) {} }
    };
  }, [open]);

  const results = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const R = window.AARoutes || {};
    const items = [];
    SEARCH_PAGES.forEach(([page, label, kw]) => items.push({ type: 'Page', label, sub: '', page, hay: (label + ' ' + kw).toLowerCase() }));
    (R.INSIGHTS || []).forEach((a) => {
      if (a.published === false) return;
      items.push({ type: 'Guide', label: a.title, sub: (a.tag ? a.tag + ' · ' : '') + (a.date || ''), slug: a.slug, hay: ((a.title || '') + ' ' + (a.excerpt || '') + ' ' + (a.tag || '')).toLowerCase() });
    });
    const toks = term.split(/\s+/).filter(Boolean);
    return items.map((it) => {
      const all = toks.every((t) => it.hay.indexOf(t) !== -1);
      if (!all) return { it, s: 0 };
      let s = 0;
      if (it.label.toLowerCase().indexOf(term) !== -1) s += 10;
      toks.forEach((t) => { if (it.hay.indexOf(t) !== -1) s += 1; });
      return { it, s };
    }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 10).map((x) => x.it);
  }, [q]);

  if (!open) return null;

  const goTo = (it) => { setOpen(false); if (it.type === 'Guide') onNav('insight', it.slug); else onNav(it.page); };
  const onKeyDown = (e) => { if (e.key === 'Enter' && results[0]) goTo(results[0]); };

  return (
    <div role="dialog" aria-modal="true" aria-label="Search the site" onClick={() => setOpen(false)}
      style={{ position: 'fixed', inset: 0, zIndex: 210, background: 'rgba(10,12,20,0.6)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '72px 16px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', width: '100%', maxWidth: 620, boxShadow: '0 24px 70px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 18px', borderBottom: '1px solid var(--aa-rule)' }}>
          <i data-lucide="search" style={{ width: 20, height: 20, color: 'var(--aa-steel)', flexShrink: 0 }}></i>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown}
            placeholder="Search services, taxes, guides…" aria-label="Search the site"
            style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', fontSize: 17, fontFamily: 'var(--aa-font-sans)', color: 'var(--aa-charcoal)', background: 'transparent' }} />
          <button onClick={() => setOpen(false)} aria-label="Close search" style={{ border: 0, background: 'transparent', fontSize: 24, lineHeight: 1, color: 'var(--aa-steel)', cursor: 'pointer', flexShrink: 0 }}>×</button>
        </div>
        <div style={{ maxHeight: '56vh', overflowY: 'auto' }}>
          {q.trim() === '' ? (
            <div style={{ padding: '20px 18px', fontSize: 14, color: 'var(--aa-steel)', lineHeight: 1.6 }}>Try “corporate tax”, “VAT registration”, “e-invoicing”, “valuation”, “bookkeeping”…</div>
          ) : results.length === 0 ? (
            <div style={{ padding: '20px 18px', fontSize: 14, color: 'var(--aa-steel)' }}>No matches for “{q}”. Try a different term.</div>
          ) : results.map((it, i) => (
            <button key={i} onClick={() => goTo(it)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', textAlign: 'left', border: 0, borderBottom: '1px solid var(--aa-rule)', background: '#fff', padding: '13px 18px', cursor: 'pointer' }}>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{it.label}</span>
                {it.sub ? <span style={{ display: 'block', fontSize: 12, color: 'var(--aa-steel)', marginTop: 2 }}>{it.sub}</span> : null}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--aa-cyan-700)', flexShrink: 0 }}>{it.type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TopNav, SubBar, Footer, WhatsAppFab, CookieConsent, EInvoiceMarquee, useScrollReveal, LucideHost, SiteSearchModal });
