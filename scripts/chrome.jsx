// Site chrome: TopNav, SubBar, Footer
const { useState, useEffect, useRef } = React;

function TopNav({ active, onNav, sticky = true }) {
  const items = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'industries', label: 'Industries' },
  { id: 'about', label: 'About' },
  { id: 'insights', label: 'Insights' },
  { id: 'careers', label: 'Careers' },
  { id: 'contact', label: 'Contact' }];

  return (
    <header className="topnav" style={{ position: sticky ? 'sticky' : 'static' }}>
      <div className="container topnav__inner">
        <a className="topnav__logo" href="#home" onClick={(e) => {e.preventDefault();onNav('home');}}>
          <img src="assets/logos/authentic-accounting-full.png" alt="Authentic Accounting" />
        </a>
        <nav className="topnav__list" aria-label="Primary">
          {items.map((it) =>
          <button
            key={it.id}
            className={`topnav__link${active === it.id ? ' is-active' : ''}`}
            onClick={() => onNav(it.id)}>
            
              {it.label}
            </button>
          )}
        </nav>
        <div className="topnav__right">
          <a
            className="topnav__client"
            href="#login"
            onClick={(e) => {e.preventDefault();onNav('login');}}>
            
            <i data-lucide="lock" style={{ width: 14, height: 14 }}></i>
            Client portal
          </a>
          <button className="btn btn--primary btn--sm" onClick={() => onNav('contact')}>
            Book a consultation
          </button>
        </div>
      </div>
    </header>);

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
    </div>);

}

function Footer({ onNav }) {
  const cols = [
  { title: 'Compliance', items: [
    ['Bookkeeping', 'services'],
    ['VAT compliance', 'service-vat'],
    ['UAE Corporate Tax', 'services'],
    ['Financial statements', 'services']]
  },
  { title: 'Advisory', items: [
    ['Business valuations', 'services'],
    ['M&A support', 'services'],
    ['Financial due diligence', 'services'],
    ['Financial modeling', 'services']]
  },
  { title: 'Firm', items: [
    ['About', 'about'],
    ['Industries', 'industries'],
    ['Insights', 'insights'],
    ['Careers', 'careers'],
    ['Contact', 'contact']]
  }];

  return (
    <footer style={{ background: '#fff', borderTop: '1px solid var(--aa-rule)', paddingTop: 64 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48 }}>
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
              <span style={{ color: 'var(--aa-charcoal)' }}>+971 4 396 0399</span> · info@aaccounting.me
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 14, fontSize: 13 }}>
              <a href="https://www.linkedin.com/company/14621146/" target="_blank" rel="noopener" style={{ color: 'var(--aa-steel-700)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i data-lucide="linkedin" style={{ width: 14, height: 14 }}></i>LinkedIn
              </a>
              <a href="https://www.facebook.com/aaccounting.me/" target="_blank" rel="noopener" style={{ color: 'var(--aa-steel-700)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i data-lucide="facebook" style={{ width: 14, height: 14 }}></i>Facebook
              </a>
              <a href="https://www.youtube.com/@authenticaccounting" target="_blank" rel="noopener" style={{ color: 'var(--aa-steel-700)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i data-lucide="youtube" style={{ width: 14, height: 14 }}></i>YouTube
              </a>
              <a href="https://wa.me/971565484635" target="_blank" rel="noopener" style={{ color: 'var(--aa-steel-700)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i data-lucide="message-circle" style={{ width: 14, height: 14 }}></i>WhatsApp
              </a>
            </div>
          </div>
          {cols.map((col) =>
          <div key={col.title}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid var(--aa-charcoal)' }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map(([label, route]) =>
              <a
                key={label}
                href={`#${route}`}
                onClick={(e) => {e.preventDefault();onNav(route);}}
                style={{ fontSize: 14, color: 'var(--aa-steel-700)', textDecoration: 'none' }}>
                
                    {label}
                  </a>
              )}
              </div>
            </div>
          )}
        </div>

        {/* Newsletter */}
        <div style={{
          borderTop: '1px solid var(--aa-rule)',
          borderBottom: '1px solid var(--aa-rule)',
          padding: '32px 0',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 32,
          alignItems: 'center'
        }}>
          <div>
            <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 6 }}>Quarterly bulletin</div>
            <div style={{ fontSize: 15, color: 'var(--aa-steel-700)' }}>
              Regulatory changes, FTA decisions, and advisory notes — four times a year.
            </div>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ display: 'flex', gap: 0, alignItems: 'stretch', minWidth: 360 }}>
            
            <input
              className="field__input"
              placeholder="name@entity.ae"
              style={{ borderRadius: 0, borderRight: 0 }} />
            
            <button className="btn btn--primary" style={{ padding: '0 22px' }}>Subscribe</button>
          </form>
        </div>

        <div style={{
          padding: '24px 0',
          display: 'flex', justifyContent: 'space-between',
          fontSize: 11, color: 'var(--aa-steel)',
          letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600
        }}>
          <span>© 2026 Authentic Accounting and Bookkeeping L.L.C</span>
          <span>Privacy · Terms · Engagement standards · Whistleblower</span>
        </div>
      </div>
    </footer>);

}

Object.assign(window, { TopNav, SubBar, Footer });