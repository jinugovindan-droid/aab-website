// Site chrome: TopNav (with mobile drawer), SubBar, Footer, WhatsAppFab, ScrollReveal
const { useState, useEffect, useRef } = React;
const { pathForPage } = window.AARoutes;

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'e-invoicing', label: 'E-Invoicing' },
  { id: 'industries', label: 'Industries' },
  { id: 'about', label: 'About' },
  { id: 'insights', label: 'Insights' },
  { id: 'careers', label: 'Careers' },
  { id: 'contact', label: 'Contact' },
];

function TopNav({ active, onNav, sticky = true }) {
  const [open, setOpen] = useState(false);

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
          <a className="topnav__logo" href={pathForPage('home')} onClick={(e) => { e.preventDefault(); go('home'); }} aria-label="Authentic Accounting — Home">
            <img src="assets/logos/authentic-accounting-full.png" alt="Authentic Accounting" />
          </a>
          <nav className="topnav__list" aria-label="Primary">
            {NAV_ITEMS.map((it) => (
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

// Apply intersection-observer reveals to every <section> after each render
function useScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const els = document.querySelectorAll('main section, main .statline');
    els.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

function Footer({ onNav }) {
  const cols = [
    { title: 'Compliance', items: [
      ['Bookkeeping', 'services'],
      ['VAT compliance', 'service-vat'],
      ['UAE Corporate Tax', 'services'],
      ['Financial statements', 'services'],
      ['Audit support', 'services'],
      ['E-Invoicing support', 'services'],
      ['Fixed asset tagging', 'services'],
    ]},
    { title: 'Advisory', items: [
      ['Business valuations', 'services'],
      ['M&A support', 'services'],
      ['Financial due diligence', 'services'],
      ['Forensic accounting', 'services'],
      ['CFO services', 'services'],
      ['Tax planning', 'services'],
      ['Financial modeling', 'services'],
      ['Feasibility studies', 'services'],
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
              src="assets/logos/authentic-accounting-full.png"
              alt="Authentic Accounting"
              style={{ height: 56 }} />

            <div style={{ marginTop: 18, fontFamily: 'var(--aa-font-display)', fontSize: 18, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--aa-cyan)' }}>
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

Object.assign(window, { TopNav, SubBar, Footer, WhatsAppFab, useScrollReveal, LucideHost });
