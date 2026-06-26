// Services overview page + VAT service detail page
const { useState: useStateSvc } = React;
const { pathForPage, pathForInsight } = window.AARoutes;

function ServicesPage({ onNav }) {
  const allServices = [
    { reg: 'Compliance', t: 'Outsourced accounting', icon: 'book-open', page: 'service-bookkeeping',
      d: 'Day-to-day bookkeeping, monthly ledger close, reconciliations and management pack — a complete finance function delivered against a documented controls framework.',
      bullets: ['Day-to-day bookkeeping', 'Monthly close & management pack', 'Reconciliations & validation', 'Custom controls engine'] },
    { reg: 'Compliance', t: 'VAT compliance', icon: 'file-check', page: 'service-vat',
      d: 'Registration, return preparation, review and filing with the FTA — with a defensible position memo per line item.',
      bullets: ['VAT registration', 'Return preparation', 'FTA filing & queries', 'Review-ready return file'] },
    { reg: 'Compliance', t: 'UAE Corporate Tax', icon: 'landmark', page: 'service-corporate-tax',
      d: 'Registration, period computation and return filing under the 9% regime, with QFZP analysis where relevant.',
      bullets: ['CT registration', 'Period computation', 'QFZP / FTA filings', 'Position memos'] },
    { reg: 'Compliance', t: 'Financial statements', icon: 'file-spreadsheet',
      d: 'Balance Sheet, P&L, Cash Flow and notes prepared to IFRS / IFRS for SMEs.',
      bullets: ['Statutory FS', 'Group consolidation', 'Audit preparation', 'Disclosure schedules'] },
    { reg: 'Compliance', t: 'Audit support', icon: 'clipboard-check', page: 'service-audit-support',
      d: 'Pre-audit preparation, auditor liaison, sample selection and post-audit closeout for statutory and group audits.',
      bullets: ['Audit preparation', 'Auditor liaison', 'Sample selection', 'Closeout schedules'] },
    { reg: 'Compliance', t: 'Fixed asset tagging', icon: 'tag',
      d: 'Physical asset verification, register reconstruction, depreciation policy review and impairment indicators.',
      bullets: ['Asset verification', 'Register reconstruction', 'Depreciation policy', 'Impairment review'] },
    { reg: 'Advisory', t: 'Business valuations', icon: 'gauge', page: 'service-valuations',
      d: 'DCF, comparables and asset-based valuations for transactions, disputes and statutory purposes.',
      bullets: ['Equity & enterprise value', 'Purchase price allocation', 'Impairment testing', 'Litigation support'] },
    { reg: 'Advisory', t: 'M&A support', icon: 'merge', page: 'service-transaction-advisory',
      d: 'Buy-side and sell-side assistance, deal structuring and closing support.',
      bullets: ['Information memorandum', 'Buy-side diligence', 'Closing accounts', 'Completion mechanics'] },
    { reg: 'Advisory', t: 'Financial due diligence', icon: 'search', page: 'service-transaction-advisory',
      d: 'Quality-of-earnings, working capital and debt-like item analyses for investors and lenders.',
      bullets: ['Quality of earnings', 'Working capital', 'Net debt analysis', 'Red-flag report'] },
    { reg: 'Advisory', t: 'Forensic accounting', icon: 'fingerprint',
      d: 'Fraud investigation, dispute support, expert testimony and evidence reconstruction for contested matters.',
      bullets: ['Fraud investigation', 'Dispute support', 'Expert testimony', 'Evidence reconstruction'] },
    { reg: 'Advisory', t: 'Internal controls', icon: 'shield',
      d: 'Design, walkthroughs and remediation for regulated entities and pre-IPO issuers.',
      bullets: ['Risk & control matrix', 'Walkthrough testing', 'Remediation plan', 'Management attestation'] },
    { reg: 'Advisory', t: 'Financial modeling', icon: 'function-square',
      d: 'Operating, transaction and board-pack models — fully auditable, FAST-standard formatted.',
      bullets: ['Operating models', 'LBO / acquisition', 'Refinancing models', 'Board scenarios'] },
    { reg: 'Advisory', t: 'CFO services', icon: 'briefcase', page: 'service-cfo',
      d: 'Interim and fractional CFO leadership — Board reporting, treasury, fundraising support and finance function build-out.',
      bullets: ['Interim CFO', 'Board reporting packs', 'Treasury & cash', 'Finance function build'] },
    { reg: 'Advisory', t: 'Tax planning', icon: 'calculator',
      d: 'Pre-transaction tax structuring, free-zone optimisation, transfer pricing alignment and CT position memos.',
      bullets: ['Transaction structuring', 'Free-zone analysis', 'Transfer pricing', 'CT position memos'] },
    { reg: 'Advisory', t: 'Feasibility studies', icon: 'bar-chart-3',
      d: 'Project-level financial feasibility, sensitivity analysis, scenario modelling and pre-investment recommendations.',
      bullets: ['Financial modelling', 'Sensitivity analysis', 'Scenario testing', 'Pre-investment memo'] },
    { reg: 'Advisory', t: 'Strategic advisory', icon: 'compass',
      d: 'Accounting policy selection, complex transactions and Board-level positions.',
      bullets: ['Accounting policy', 'Complex transactions', 'Board memos', 'Restructuring'] },
  ];

  const [filter, setFilter] = useStateSvc('All');

  const filtered = filter === 'All' ? allServices : allServices.filter(s => s.reg === filter);

  return (
    <div>
      {/* Hero */}
      <section className="aa-hero-image" style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--aa-rule)', padding: '72px 0 80px' }}>
        <div
          className="aa-hero-image__bg"
          role="img"
          aria-label="A single crystal chess rook standing in cool blue mist — the structural framework"
          style={{ backgroundImage: "url('assets/images/chess-rook.jpg')" }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--aa-cyan-200)' }}>
                <span style={{ width: 24, height: 1, background: 'var(--aa-cyan)', display: 'inline-block' }}></span>
                Services
              </div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: '#fff', lineHeight: 1.0, textWrap: 'balance',
              }}>
                Many engagements.<br />
                One <span style={{ color: 'var(--aa-cyan)' }}>controls</span> standard.
              </h1>
            </div>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: 460, margin: 0 }}>
              Every service is delivered against the same control framework — from a five-line VAT return to a nine-figure valuation. Pick a line below or talk to us about a hybrid scope.
            </p>
          </div>
        </div>
      </section>

      {/* Filter row */}
      <section style={{ background: 'var(--aa-surface-off)', borderBottom: '1px solid var(--aa-rule)', padding: '24px 0' }}>
        <div className="container" style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="eyebrow eyebrow--steel">Filter by practice</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'Compliance', 'Advisory'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '10px 18px',
                  fontSize: 13, fontWeight: 600, fontFamily: 'var(--aa-font-sans)',
                  background: filter === f ? 'var(--aa-charcoal)' : '#fff',
                  color: filter === f ? '#fff' : 'var(--aa-charcoal)',
                  border: '1px solid ' + (filter === f ? 'var(--aa-charcoal)' : 'var(--aa-rule-strong)'),
                  cursor: 'pointer',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, borderTop: '1px solid var(--aa-rule)', borderLeft: '1px solid var(--aa-rule)' }}>
            {filtered.map((s, i) => (
              <a
                key={s.t}
                href={pathForPage(s.page || 'contact')}
                onClick={(e) => {
                  e.preventDefault();
                  if (s.page) { onNav(s.page); return; }
                  try {
                    sessionStorage.setItem('aa_intent_service', s.t);
                    sessionStorage.setItem('aa_scroll_target', 'aa-contact-wizard');
                  } catch (err) {}
                  onNav('contact');
                }}
                style={{
                  textDecoration: 'none', color: 'inherit',
                  padding: 36,
                  borderRight: '1px solid var(--aa-rule)',
                  borderBottom: '1px solid var(--aa-rule)',
                  display: 'flex', flexDirection: 'column', gap: 16,
                  background: '#fff',
                  transition: 'background 150ms ease-out',
                  minHeight: 280,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--aa-surface-off)'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <i data-lucide={s.icon} style={{ width: 28, height: 28, color: 'var(--aa-cyan)' }}></i>
                  <span className="eyebrow eyebrow--steel" style={{ fontSize: 11 }}>{s.reg}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--aa-font-display)', fontWeight: 700, fontSize: 28, textTransform: 'uppercase', letterSpacing: '0.01em', color: 'var(--aa-charcoal)', lineHeight: 1.1 }}>
                    {s.t}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--aa-steel-700)', marginTop: 12, lineHeight: 1.55 }}>
                    {s.d}
                  </div>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: 13, color: 'var(--aa-charcoal)' }}>
                  {s.bullets.map(b => (
                    <li key={b} style={{ display: 'flex', gap: 6 }}>
                      <span style={{ color: 'var(--aa-cyan)' }}>·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <span className="mono">{String(i + 1).padStart(2, '0')} / {filtered.length.toString().padStart(2, '0')}</span>
                  <span style={{ color: 'var(--aa-cyan-700)', fontWeight: 600 }}>
                    {s.page ? 'View details →' : 'Start a scope →'}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">Engagement models</div>
            <h2>Pick a shape that fits the work.</h2>
          </div>
          <p style={{ margin: '-12px 0 28px', maxWidth: 720, fontSize: 15, color: 'var(--aa-steel-700)', lineHeight: 1.6 }}>
            There is no one-size-fits-all rate card. Every engagement is scoped and priced around what you actually need — so you only pay for the work that fits your business.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { t: 'Retained',   sub: 'Monthly · ongoing',     d: 'Continuous compliance and management reporting on a retained monthly basis. Best for SMEs and groups with steady volume.', cta: 'Common for bookkeeping, VAT, CT' },
              { t: 'Project',    sub: 'Fixed scope · defined deliverable', d: 'A defined deliverable — a valuation, a model, a closeout pack. Scoping note in 24 hours.', cta: 'Common for valuations, DD, modeling' },
              { t: 'Statement of work', sub: 'Phased · scope-capped', d: 'Open-ended advisory with a defined scope cap. Periodic check-ins, monthly status. Used where the question is still being shaped.', cta: 'Common for controls, restructuring' },
            ].map(m => (
              <div key={m.t} style={{ background: '#fff', border: '1px solid var(--aa-rule)', padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="eyebrow eyebrow--charcoal">{m.t}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-cyan-700)', fontWeight: 600 }}>{m.sub}</div>
                <div style={{ fontSize: 14, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{m.d}</div>
                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--aa-rule)', fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{m.cta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// VAT detail page (exemplar)
function ServiceVATPage({ onNav }) {
  return (
    <div>
      {/* Crumbtrail + hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('services')} onClick={(e) => { e.preventDefault(); onNav('services'); }} style={{ color: 'var(--aa-steel-700)' }}>Services</a>
            <span>/</span>
            <span>Compliance</span>
            <span>/</span>
            <span style={{ color: 'var(--aa-charcoal)' }}>VAT compliance</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Compliance · 5% standard rate</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0,
              }}>
                VAT compliance.<br />
                Defensible by line item.
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 600 }}>
                We register, prepare, review and file VAT returns with the Federal Tax Authority — with a position memo behind every contested line and a review-ready return file at the end of every quarter.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button className="btn btn--primary" onClick={() => onNav('contact')}>
                  Request a VAT scoping
                  <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
                </button>
                <a className="btn btn--ghost" href="https://wa.me/971565484635" target="_blank" rel="noopener">
                  <i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>
                  WhatsApp us
                </a>
              </div>
            </div>
            <aside style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24 }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>At a glance</div>
              <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                {[
                  ['Registration threshold', 'AED 375,000 (mandatory)'],
                  ['Voluntary threshold',   'AED 187,500'],
                  ['Standard rate',         '5%'],
                  ['Filing cadence',        'Quarterly (most clients)'],
                  ['Pricing',               'Customised to your scope'],
                  ['Engagement model',      'Retained or project'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--aa-rule)' }}>
                    <dt style={{ color: 'var(--aa-steel)' }}>{k}</dt>
                    <dd style={{ margin: 0, color: 'var(--aa-charcoal)', fontWeight: 600 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">The quarter, end to end</div>
            <h2>From source data to FTA portal.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['01', 'Source capture', 'Sales, purchases, imports, RCM transactions ingested from your ERP or workpaper templates.'],
              ['02', 'Classification', 'Standard, zero-rated, exempt, out-of-scope. Designated zone vs. mainland flagged.'],
              ['03', 'Position memo', 'Every contested line gets a memo with FTA decision references.'],
              ['04', 'Review',        'Manager review followed by Partner sign-off before submission.'],
              ['05', 'File & archive','VAT201 filed; closeout pack archived for the statutory 5-year period.'],
            ].map((s, i) => (
              <div key={i} style={{
                padding: 24,
                borderRight: i < 4 ? '1px solid var(--aa-rule)' : 'none',
                position: 'relative',
              }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--aa-cyan)', marginBottom: 8 }}>{s[0]}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--aa-charcoal)', marginBottom: 8 }}>{s[1]}</div>
                <div style={{ fontSize: 12, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{s[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--off">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head">
            <div className="section-head__eyebrow">FAQ</div>
            <h2>What clients ask first.</h2>
          </div>
          <FAQList items={[
            { q: 'When does my business need to register for VAT?',
              a: 'You must register if your taxable turnover crossed AED 375,000 in the past 12 months, or you reasonably expect it to in the next 30 days. Voluntary registration is available from AED 187,500.' },
            { q: 'Can you handle a backlog of unfiled returns?',
              a: 'Yes. We run a recovery scope: reconstruct source data, file outstanding returns, and propose a voluntary disclosure pathway where penalties may be mitigated.' },
            { q: 'How do you handle designated-zone vs. mainland classification?',
              a: 'Every transaction is tagged at source against the relevant designated-zone schedule. Reclassifications are documented in the position memo and revisited each quarter.' },
            { q: 'How do you price a VAT engagement?',
              a: 'There is no one-size-fits-all rate. We price every engagement around what you actually need — transaction volume, number of entities and the level of support — and give you a clear, tailored quote for that scope. Ask us for a quote.' },
          ]} />
        </div>
      </section>
    </div>
  );
}

// Corporate Tax detail page
function ServiceCorporateTaxPage({ onNav }) {
  const CT_FAQ = (window.AARoutes && window.AARoutes.CORPTAX_FAQ) || [];
  return (
    <div>
      {/* Crumbtrail + hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('services')} onClick={(e) => { e.preventDefault(); onNav('services'); }} style={{ color: 'var(--aa-steel-700)' }}>Services</a>
            <span>/</span>
            <span>Compliance</span>
            <span>/</span>
            <span style={{ color: 'var(--aa-charcoal)' }}>Corporate Tax</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Compliance · 9% Federal Corporate Tax</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0,
              }}>
                UAE Corporate Tax.<br />
                Registered, computed, filed.
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>
                We handle UAE Corporate Tax end to end — registration on EmaraTax, taxable-income computation, free-zone (QFZP) analysis, Small Business Relief elections and return filing with the Federal Tax Authority — under Federal Decree-Law No. 47 of 2022, with a position memo behind every judgement call.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => onNav('contact')}>
                  Request a Corporate Tax scoping
                  <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
                </button>
                <a className="btn btn--ghost" href="https://wa.me/971565484635" target="_blank" rel="noopener">
                  <i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>
                  WhatsApp us
                </a>
              </div>
            </div>
            <aside style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24 }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>At a glance</div>
              <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                {[
                  ['Standard rate', '9% (above AED 375,000)'],
                  ['0% rate band', 'First AED 375,000'],
                  ['Free zone', '0% on qualifying income (QFZP)'],
                  ['Small Business Relief', 'Revenue up to AED 3M · to 31 Dec 2026'],
                  ['Return filing', 'Within 9 months of year-end'],
                  ['Late-registration penalty', 'AED 10,000'],
                  ['Pricing', 'Customised to your scope'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '6px 0', borderBottom: '1px solid var(--aa-rule)' }}>
                    <dt style={{ color: 'var(--aa-steel)' }}>{k}</dt>
                    <dd style={{ margin: 0, color: 'var(--aa-charcoal)', fontWeight: 600, textAlign: 'right' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* What it covers */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">What the engagement covers</div>
            <h2>From registration to a filed return.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['landmark', 'Registration', 'EmaraTax registration and your Corporate Tax Registration Number, with the correct first tax period confirmed.'],
              ['calculator', 'Computation', 'Accounting profit converted to taxable income — add-backs, exempt income, reliefs and interest limitation.'],
              ['building-2', 'Free zone / QFZP', 'Qualifying income analysis, substance and de minimis testing for free zone persons seeking the 0% rate.'],
              ['file-check', 'Filing & support', 'Return filed on EmaraTax within nine months, with FTA query handling and audit-ready workpapers.'],
            ].map(([ic, t, d], i) => (
              <div key={t} style={{ padding: 28, borderRight: i < 3 ? '1px solid var(--aa-rule)' : 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <i data-lucide={ic} style={{ width: 24, height: 24, color: 'var(--aa-cyan)' }}></i>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">The tax period, end to end</div>
            <h2>How we run your Corporate Tax.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['01', 'Register', 'EmaraTax registration, Tax Registration Number and the correct first tax period.'],
              ['02', 'Scope & data', 'Trial balance, free-zone status and related-party (transfer pricing) transactions gathered.'],
              ['03', 'Compute', 'Accounting profit to taxable income: add-backs, exempt income, Small Business Relief or QFZP, interest limitation.'],
              ['04', 'Review', 'Manager review and Partner sign-off, with a position memo on every judgement area.'],
              ['05', 'File & pay', 'Return filed on EmaraTax within nine months; workpapers archived for the record.'],
            ].map((s, i) => (
              <div key={i} style={{ padding: 24, borderRight: i < 4 ? '1px solid var(--aa-rule)' : 'none' }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--aa-cyan)', marginBottom: 8 }}>{s[0]}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--aa-charcoal)', marginBottom: 8 }}>{s[1]}</div>
                <div style={{ fontSize: 12, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{s[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — shares CORPTAX_FAQ with the FAQPage schema */}
      <section className="section">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head">
            <div className="section-head__eyebrow">FAQ</div>
            <h2>UAE Corporate Tax, answered.</h2>
          </div>
          <FAQList items={CT_FAQ} />
          <p style={{ marginTop: 28, fontSize: 13, color: 'var(--aa-steel)', lineHeight: 1.6 }}>
            Legal basis: Federal Decree-Law No. 47 of 2022 and related Cabinet and Ministerial Decisions. General guidance, not tax advice — confirm against the latest UAE Ministry of Finance / Federal Tax Authority sources.
          </p>
          <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span className="eyebrow eyebrow--steel">Related</span>
            <a href={pathForPage('service-vat')} onClick={(e) => { e.preventDefault(); onNav('service-vat'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>VAT compliance →</a>
            <a href={pathForPage('e-invoicing')} onClick={(e) => { e.preventDefault(); onNav('e-invoicing'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>E-invoicing readiness →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Bookkeeping / outsourced accounting detail page
function ServiceBookkeepingPage({ onNav }) {
  const BK_FAQ = (window.AARoutes && window.AARoutes.BOOKKEEPING_FAQ) || [];
  return (
    <div>
      {/* Crumbtrail + hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('services')} onClick={(e) => { e.preventDefault(); onNav('services'); }} style={{ color: 'var(--aa-steel-700)' }}>Services</a>
            <span>/</span>
            <span>Compliance</span>
            <span>/</span>
            <span style={{ color: 'var(--aa-charcoal)' }}>Bookkeeping</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Compliance · Outsourced finance function</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0,
              }}>
                Outsourced bookkeeping.<br />
                Books that hold up.
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>
                We run your day-to-day bookkeeping end to end — recording, bank and ledger reconciliations, a disciplined monthly close and a management accounts pack — kept VAT and Corporate Tax-ready and delivered against a documented controls framework.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => onNav('contact')}>
                  Request a bookkeeping scoping
                  <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
                </button>
                <a className="btn btn--ghost" href="https://wa.me/971565484635" target="_blank" rel="noopener">
                  <i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>
                  WhatsApp us
                </a>
              </div>
            </div>
            <aside style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24 }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>At a glance</div>
              <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                {[
                  ['Scope', 'Full-charge bookkeeping'],
                  ['Cadence', 'Monthly close'],
                  ['Software', 'Tally · Zoho · QuickBooks · Xero · SAP'],
                  ['Deliverable', 'Management accounts pack'],
                  ['Compliance', 'VAT & Corporate Tax-ready'],
                  ['Engagement', 'Retained (monthly)'],
                  ['Pricing', 'Customised to your scope'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '6px 0', borderBottom: '1px solid var(--aa-rule)' }}>
                    <dt style={{ color: 'var(--aa-steel)' }}>{k}</dt>
                    <dd style={{ margin: 0, color: 'var(--aa-charcoal)', fontWeight: 600, textAlign: 'right' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* What it covers */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">What the engagement covers</div>
            <h2>A complete finance function.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['book-open', 'Recording', 'Sales, purchases, expenses and bank transactions posted to your chart of accounts — accurately and on time.'],
              ['scale', 'Reconciliations', 'Bank, cash, receivables, payables and intercompany reconciled and resolved to zero every period.'],
              ['calendar-check', 'Monthly close', 'A disciplined close with accruals, prepayments and a documented checklist — no surprises at year-end.'],
              ['bar-chart-3', 'Management reporting', 'A monthly pack — profit & loss, balance sheet and cash flow — so you can actually run the business.'],
            ].map(([ic, t, d], i) => (
              <div key={t} style={{ padding: 28, borderRight: i < 3 ? '1px solid var(--aa-rule)' : 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <i data-lucide={ic} style={{ width: 24, height: 24, color: 'var(--aa-cyan)' }}></i>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">The month, end to end</div>
            <h2>How we keep your books.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['01', 'Onboard', 'Chart of accounts, opening balances and software access set up — in your system or one we recommend.'],
              ['02', 'Capture', 'Invoices, bills, expenses and bank feeds ingested digitally or via workpaper templates.'],
              ['03', 'Record & classify', 'Every transaction posted and categorised against the chart of accounts, tagged for VAT and Corporate Tax.'],
              ['04', 'Reconcile', 'Bank, cash, AR, AP and intercompany reconciled and resolved to zero.'],
              ['05', 'Close & report', 'Monthly close, then your management pack and tax-ready data delivered.'],
            ].map((s, i) => (
              <div key={i} style={{ padding: 24, borderRight: i < 4 ? '1px solid var(--aa-rule)' : 'none' }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--aa-cyan)', marginBottom: 8 }}>{s[0]}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--aa-charcoal)', marginBottom: 8 }}>{s[1]}</div>
                <div style={{ fontSize: 12, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{s[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — shares BOOKKEEPING_FAQ with the FAQPage schema */}
      <section className="section">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head">
            <div className="section-head__eyebrow">FAQ</div>
            <h2>Outsourced bookkeeping, answered.</h2>
          </div>
          <FAQList items={BK_FAQ} />
          <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span className="eyebrow eyebrow--steel">Related</span>
            <a href={pathForPage('service-vat')} onClick={(e) => { e.preventDefault(); onNav('service-vat'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>VAT compliance →</a>
            <a href={pathForPage('service-corporate-tax')} onClick={(e) => { e.preventDefault(); onNav('service-corporate-tax'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Corporate Tax →</a>
            <a href={pathForPage('e-invoicing')} onClick={(e) => { e.preventDefault(); onNav('e-invoicing'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>E-invoicing readiness →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Audit support / preparation detail page (we support the audit; we are not the auditor)
function ServiceAuditSupportPage({ onNav }) {
  const AU_FAQ = (window.AARoutes && window.AARoutes.AUDIT_FAQ) || [];
  return (
    <div>
      {/* Crumbtrail + hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('services')} onClick={(e) => { e.preventDefault(); onNav('services'); }} style={{ color: 'var(--aa-steel-700)' }}>Services</a>
            <span>/</span>
            <span>Compliance</span>
            <span>/</span>
            <span style={{ color: 'var(--aa-charcoal)' }}>Audit Support</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Compliance · Audit preparation &amp; liaison</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0,
              }}>
                Audit support.<br />
                Ready before fieldwork.
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>
                We get your books and schedules audit-ready, act as the single point of contact with your appointed auditor, and close out findings — so your statutory or group audit runs fast and clean. We are not your auditor; we make the audit easy.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => onNav('contact')}>
                  Request audit support
                  <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
                </button>
                <a className="btn btn--ghost" href="https://wa.me/971565484635" target="_blank" rel="noopener">
                  <i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>
                  WhatsApp us
                </a>
              </div>
            </div>
            <aside style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24 }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>At a glance</div>
              <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                {[
                  ['Scope', 'Audit preparation & support'],
                  ['Covers', 'Statutory & group audits'],
                  ['Standards', 'IFRS / IFRS for SMEs'],
                  ['Deliverable', 'Audit-ready file & schedules'],
                  ['Liaison', 'Single point with your auditor'],
                  ['Engagement', 'Project or retained'],
                  ['Pricing', 'Customised to your scope'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '6px 0', borderBottom: '1px solid var(--aa-rule)' }}>
                    <dt style={{ color: 'var(--aa-steel)' }}>{k}</dt>
                    <dd style={{ margin: 0, color: 'var(--aa-charcoal)', fontWeight: 600, textAlign: 'right' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* What it covers */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">What the engagement covers</div>
            <h2>A clean, fast external audit.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['clipboard-check', 'Audit preparation', 'A tied-out trial balance, lead schedules for every material balance, and reconciliations the auditor can rely on.'],
              ['folder-check', 'Evidence & PBC', 'We assemble the supporting documents and answers to the auditor’s prepared-by-client (PBC) request list.'],
              ['users', 'Auditor liaison', 'A single point of contact that manages queries and sample requests and keeps fieldwork moving.'],
              ['check-check', 'Findings & closeout', 'Audit adjustments posted, financial statements finalised, and findings tracked to resolution.'],
            ].map(([ic, t, d], i) => (
              <div key={t} style={{ padding: 28, borderRight: i < 3 ? '1px solid var(--aa-rule)' : 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <i data-lucide={ic} style={{ width: 24, height: 24, color: 'var(--aa-cyan)' }}></i>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">The audit, end to end</div>
            <h2>How we run audit support.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['01', 'Plan', 'Scope, timeline and the PBC list aligned with your appointed auditor before fieldwork.'],
              ['02', 'Prepare', 'Lead schedules, reconciliations and supporting documentation assembled into an audit-ready file.'],
              ['03', 'Liaise', 'We field auditor queries and sample requests as your single point of contact.'],
              ['04', 'Resolve', 'Work through findings and propose and post audit adjustments.'],
              ['05', 'Finalise', 'Sign-off-ready financial statements and a clean closeout file, archived for the record.'],
            ].map((s, i) => (
              <div key={i} style={{ padding: 24, borderRight: i < 4 ? '1px solid var(--aa-rule)' : 'none' }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--aa-cyan)', marginBottom: 8 }}>{s[0]}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--aa-charcoal)', marginBottom: 8 }}>{s[1]}</div>
                <div style={{ fontSize: 12, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{s[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — shares AUDIT_FAQ with the FAQPage schema */}
      <section className="section section--off">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head">
            <div className="section-head__eyebrow">FAQ</div>
            <h2>Audit support, answered.</h2>
          </div>
          <FAQList items={AU_FAQ} />
          <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span className="eyebrow eyebrow--steel">Related</span>
            <a href={pathForPage('service-bookkeeping')} onClick={(e) => { e.preventDefault(); onNav('service-bookkeeping'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Bookkeeping →</a>
            <a href={pathForPage('service-corporate-tax')} onClick={(e) => { e.preventDefault(); onNav('service-corporate-tax'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Corporate Tax →</a>
            <a href={pathForPage('service-vat')} onClick={(e) => { e.preventDefault(); onNav('service-vat'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>VAT compliance →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Business valuations detail page (Advisory)
function ServiceValuationsPage({ onNav }) {
  const VL_FAQ = (window.AARoutes && window.AARoutes.VALUATIONS_FAQ) || [];
  return (
    <div>
      {/* Crumbtrail + hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('services')} onClick={(e) => { e.preventDefault(); onNav('services'); }} style={{ color: 'var(--aa-steel-700)' }}>Services</a>
            <span>/</span>
            <span>Advisory</span>
            <span>/</span>
            <span style={{ color: 'var(--aa-charcoal)' }}>Valuations</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Advisory · Independent business valuation</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0,
              }}>
                Business valuations.<br />
                Defensible by method.
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>
                Independent valuations built on the income, market and asset approaches — for M&amp;A, shareholder disputes, financial reporting and statutory needs. Every number traces to a documented assumption, to International Valuation Standards.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => onNav('contact')}>
                  Request a valuation
                  <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
                </button>
                <a className="btn btn--ghost" href="https://wa.me/971565484635" target="_blank" rel="noopener">
                  <i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>
                  WhatsApp us
                </a>
              </div>
            </div>
            <aside style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24 }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>At a glance</div>
              <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                {[
                  ['Approaches', 'Income · Market · Asset'],
                  ['Methods', 'DCF · comparables · NAV'],
                  ['Standards', 'IVS · IFRS 13 fair value'],
                  ['Purposes', 'M&A · disputes · reporting'],
                  ['Deliverable', 'Independent valuation report'],
                  ['Engagement', 'Project (fixed scope)'],
                  ['Pricing', 'Customised to your scope'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '6px 0', borderBottom: '1px solid var(--aa-rule)' }}>
                    <dt style={{ color: 'var(--aa-steel)' }}>{k}</dt>
                    <dd style={{ margin: 0, color: 'var(--aa-charcoal)', fontWeight: 600, textAlign: 'right' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* What it covers — the three approaches */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">How we value</div>
            <h2>Three approaches, cross-checked.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['trending-up', 'Income approach', 'Discounted cash flow — forecast cash flows, a built-up cost of capital and a tested terminal value.'],
              ['bar-chart-3', 'Market approach', 'Comparable companies and precedent transactions, with multiples adjusted for size, growth and risk.'],
              ['layers', 'Asset approach', 'Net asset value — tangible and intangible assets revalued where the balance sheet drives value.'],
              ['file-text', 'Report & support', 'An independent report with assumptions and sensitivities, and support for auditors, investors and courts.'],
            ].map(([ic, t, d], i) => (
              <div key={t} style={{ padding: 28, borderRight: i < 3 ? '1px solid var(--aa-rule)' : 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <i data-lucide={ic} style={{ width: 24, height: 24, color: 'var(--aa-cyan)' }}></i>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">The engagement, end to end</div>
            <h2>How we run a valuation.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['01', 'Scope & purpose', 'Define the purpose, the standard of value and the valuation date with you.'],
              ['02', 'Information & analysis', 'Gather financials, forecasts and the cap table; analyse the business and its market.'],
              ['03', 'Method selection', 'Select and weight the income, market and asset approaches for the case.'],
              ['04', 'Model & cross-check', 'Build the model, reconcile the approaches and run sensitivity analysis.'],
              ['05', 'Review & report', 'Partner review, then an independent valuation report you can put in front of third parties.'],
            ].map((s, i) => (
              <div key={i} style={{ padding: 24, borderRight: i < 4 ? '1px solid var(--aa-rule)' : 'none' }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--aa-cyan)', marginBottom: 8 }}>{s[0]}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--aa-charcoal)', marginBottom: 8 }}>{s[1]}</div>
                <div style={{ fontSize: 12, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{s[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — shares VALUATIONS_FAQ with the FAQPage schema */}
      <section className="section section--off">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head">
            <div className="section-head__eyebrow">FAQ</div>
            <h2>Business valuation, answered.</h2>
          </div>
          <FAQList items={VL_FAQ} />
          <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span className="eyebrow eyebrow--steel">Related</span>
            <a href={pathForInsight('dcf-terminal-values-family-office')} onClick={(e) => { e.preventDefault(); onNav('insight', 'dcf-terminal-values-family-office'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Insight: DCF terminal values →</a>
            <a href={pathForPage('service-audit-support')} onClick={(e) => { e.preventDefault(); onNav('service-audit-support'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Audit support →</a>
            <a href={pathForPage('service-corporate-tax')} onClick={(e) => { e.preventDefault(); onNav('service-corporate-tax'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Corporate Tax →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Transaction advisory detail page — M&A support + financial due diligence (Advisory)
function ServiceTransactionAdvisoryPage({ onNav }) {
  const TX_FAQ = (window.AARoutes && window.AARoutes.TRANSACTION_FAQ) || [];
  return (
    <div>
      {/* Crumbtrail + hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('services')} onClick={(e) => { e.preventDefault(); onNav('services'); }} style={{ color: 'var(--aa-steel-700)' }}>Services</a>
            <span>/</span>
            <span>Advisory</span>
            <span>/</span>
            <span style={{ color: 'var(--aa-charcoal)' }}>Transaction Advisory</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Advisory · M&amp;A support &amp; due diligence</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0,
              }}>
                Transaction advisory.<br />
                Diligence before you sign.
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>
                Buy-side and sell-side support across the deal — financial due diligence, quality of earnings, working-capital and net-debt analysis, structuring and closing mechanics — so you go into the transaction with the numbers proven, not assumed.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => onNav('contact')}>
                  Discuss a transaction
                  <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
                </button>
                <a className="btn btn--ghost" href="https://wa.me/971565484635" target="_blank" rel="noopener">
                  <i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>
                  WhatsApp us
                </a>
              </div>
            </div>
            <aside style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24 }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>At a glance</div>
              <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                {[
                  ['Scope', 'M&A support & due diligence'],
                  ['Side', 'Buy-side & sell-side'],
                  ['DD focus', 'QoE · working capital · net debt'],
                  ['Deliverable', 'Diligence / red-flag report'],
                  ['Mechanics', 'SPA inputs · closing accounts'],
                  ['Engagement', 'Project (fixed scope)'],
                  ['Pricing', 'Customised to your scope'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '6px 0', borderBottom: '1px solid var(--aa-rule)' }}>
                    <dt style={{ color: 'var(--aa-steel)' }}>{k}</dt>
                    <dd style={{ margin: 0, color: 'var(--aa-charcoal)', fontWeight: 600, textAlign: 'right' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* What it covers */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">What the engagement covers</div>
            <h2>The numbers behind the deal.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['search', 'Financial due diligence', 'Quality of earnings, revenue and margin analysis, normalised EBITDA and the key risks that move price.'],
              ['scale', 'Working capital & net debt', 'Peg setting, debt-like items and the bridge from enterprise value to equity value.'],
              ['git-merge', 'Deal structuring', 'Tax-aware structuring, financial inputs to the SPA and completion mechanics.'],
              ['briefcase', 'Sell-side readiness', 'Vendor due diligence, the information memorandum and data-room support for a clean process.'],
            ].map(([ic, t, d], i) => (
              <div key={t} style={{ padding: 28, borderRight: i < 3 ? '1px solid var(--aa-rule)' : 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <i data-lucide={ic} style={{ width: 24, height: 24, color: 'var(--aa-cyan)' }}></i>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">The deal, end to end</div>
            <h2>How we run transaction advisory.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['01', 'Scope', 'Define the deal, the questions and the diligence perimeter with you.'],
              ['02', 'Analyse', 'Quality of earnings, working capital, net debt, forecasts, key contracts and risks.'],
              ['03', 'Structure', 'Deal structure, SPA financial mechanics and the enterprise-to-equity bridge.'],
              ['04', 'Report', 'A findings / red-flag report focused on the issues that move price or risk.'],
              ['05', 'Close', 'Completion accounts, closing mechanics and post-close adjustments.'],
            ].map((s, i) => (
              <div key={i} style={{ padding: 24, borderRight: i < 4 ? '1px solid var(--aa-rule)' : 'none' }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--aa-cyan)', marginBottom: 8 }}>{s[0]}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--aa-charcoal)', marginBottom: 8 }}>{s[1]}</div>
                <div style={{ fontSize: 12, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{s[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — shares TRANSACTION_FAQ with the FAQPage schema */}
      <section className="section section--off">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head">
            <div className="section-head__eyebrow">FAQ</div>
            <h2>M&amp;A and due diligence, answered.</h2>
          </div>
          <FAQList items={TX_FAQ} />
          <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span className="eyebrow eyebrow--steel">Related</span>
            <a href={pathForInsight('working-capital-pegs-uae-deals')} onClick={(e) => { e.preventDefault(); onNav('insight', 'working-capital-pegs-uae-deals'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Insight: Working-capital pegs →</a>
            <a href={pathForPage('service-valuations')} onClick={(e) => { e.preventDefault(); onNav('service-valuations'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Valuations →</a>
            <a href={pathForPage('service-corporate-tax')} onClick={(e) => { e.preventDefault(); onNav('service-corporate-tax'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Corporate Tax →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// CFO services detail page (Advisory)
function ServiceCFOPage({ onNav }) {
  const CF_FAQ = (window.AARoutes && window.AARoutes.CFO_FAQ) || [];
  return (
    <div>
      {/* Crumbtrail + hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('services')} onClick={(e) => { e.preventDefault(); onNav('services'); }} style={{ color: 'var(--aa-steel-700)' }}>Services</a>
            <span>/</span>
            <span>Advisory</span>
            <span>/</span>
            <span style={{ color: 'var(--aa-charcoal)' }}>CFO Services</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Advisory · Interim &amp; fractional CFO</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0,
              }}>
                CFO services.<br />
                Leadership, not just numbers.
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>
                Senior finance leadership on an interim, fractional or project basis — board reporting, budgeting and forecasting, cash and treasury, fundraising support and finance function build-out. The strategy and control of a CFO, without a full-time hire.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => onNav('contact')}>
                  Talk to a CFO
                  <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
                </button>
                <a className="btn btn--ghost" href="https://wa.me/971565484635" target="_blank" rel="noopener">
                  <i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>
                  WhatsApp us
                </a>
              </div>
            </div>
            <aside style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24 }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>At a glance</div>
              <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                {[
                  ['Model', 'Interim · fractional · project'],
                  ['Focus', 'Reporting · cash · fundraising'],
                  ['Cadence', 'Monthly board pack'],
                  ['Deliverable', 'Board-grade MIS & forecast'],
                  ['Builds', 'Finance function & controls'],
                  ['Engagement', 'Retained or interim'],
                  ['Pricing', 'Customised to your scope'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '6px 0', borderBottom: '1px solid var(--aa-rule)' }}>
                    <dt style={{ color: 'var(--aa-steel)' }}>{k}</dt>
                    <dd style={{ margin: 0, color: 'var(--aa-charcoal)', fontWeight: 600, textAlign: 'right' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* What it covers */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">What the engagement covers</div>
            <h2>The finance leadership agenda.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['presentation', 'Board & MIS reporting', 'A monthly board pack, KPIs and the story behind the numbers — so the Board steers on insight, not lag.'],
              ['line-chart', 'Budgeting & forecasting', 'Annual budget, a rolling forecast, scenarios and a clear view of cash runway.'],
              ['wallet', 'Cash & treasury', 'Cash flow discipline, working capital, banking relationships and funding.'],
              ['rocket', 'Fundraising & finance build', 'Investor reporting, model and data room — plus building the team, systems and controls to scale.'],
            ].map(([ic, t, d], i) => (
              <div key={t} style={{ padding: 28, borderRight: i < 3 ? '1px solid var(--aa-rule)' : 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <i data-lucide={ic} style={{ width: 24, height: 24, color: 'var(--aa-cyan)' }}></i>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">The mandate, end to end</div>
            <h2>How a CFO engagement runs.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['01', 'Diagnose', 'Review the finance function, reporting, cash position and the key risks.'],
              ['02', 'Stand up reporting', 'A board pack, KPIs and a forecast you can actually steer the business with.'],
              ['03', 'Cash & controls', 'Cash flow discipline, working-capital management and the core controls.'],
              ['04', 'Build the function', 'People, systems and process to scale the finance function.'],
              ['05', 'Strategic agenda', 'Fundraising, transactions and the priorities the Board cares about.'],
            ].map((s, i) => (
              <div key={i} style={{ padding: 24, borderRight: i < 4 ? '1px solid var(--aa-rule)' : 'none' }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--aa-cyan)', marginBottom: 8 }}>{s[0]}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--aa-charcoal)', marginBottom: 8 }}>{s[1]}</div>
                <div style={{ fontSize: 12, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{s[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — shares CFO_FAQ with the FAQPage schema */}
      <section className="section section--off">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head">
            <div className="section-head__eyebrow">FAQ</div>
            <h2>CFO services, answered.</h2>
          </div>
          <FAQList items={CF_FAQ} />
          <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span className="eyebrow eyebrow--steel">Related</span>
            <a href={pathForPage('service-transaction-advisory')} onClick={(e) => { e.preventDefault(); onNav('service-transaction-advisory'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Transaction advisory →</a>
            <a href={pathForPage('service-bookkeeping')} onClick={(e) => { e.preventDefault(); onNav('service-bookkeeping'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Bookkeeping →</a>
            <a href={pathForPage('service-audit-support')} onClick={(e) => { e.preventDefault(); onNav('service-audit-support'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Audit support →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQList({ items }) {
  const [open, setOpen] = useStateSvc(0);
  return (
    <div style={{ borderTop: '2px solid var(--aa-charcoal)' }}>
      {items.map((it, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--aa-rule)' }}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{
              width: '100%', textAlign: 'left',
              padding: '24px 0', background: 'transparent', border: 0, cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24,
              fontFamily: 'var(--aa-font-sans)',
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{it.q}</span>
            <i data-lucide={open === i ? 'minus' : 'plus'} style={{ width: 18, height: 18, color: 'var(--aa-cyan)', flexShrink: 0 }}></i>
          </button>
          {open === i && (
            <div style={{ paddingBottom: 24, fontSize: 15, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 720 }}>
              {it.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { ServicesPage, ServiceVATPage, ServiceCorporateTaxPage, ServiceBookkeepingPage, ServiceAuditSupportPage, ServiceValuationsPage, ServiceTransactionAdvisoryPage, ServiceCFOPage, FAQList });
