// Services overview page + VAT service detail page
const { useState: useStateSvc } = React;
const { pathForPage } = window.AARoutes;

function ServicesPage({ onNav }) {
  const allServices = [
    { reg: 'Compliance', t: 'Outsourced accounting', icon: 'book-open',
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
    { reg: 'Compliance', t: 'Audit support', icon: 'clipboard-check',
      d: 'Pre-audit preparation, auditor liaison, sample selection and post-audit closeout for statutory and group audits.',
      bullets: ['Audit preparation', 'Auditor liaison', 'Sample selection', 'Closeout schedules'] },
    { reg: 'Compliance', t: 'E-Invoicing support', icon: 'send',
      d: 'Readiness assessment, ASP selection, ERP field mapping and go-live testing for the UAE e-invoicing mandate.',
      bullets: ['Readiness assessment', 'ASP selection', 'ERP field mapping', 'Go-live testing'] },
    { reg: 'Compliance', t: 'Fixed asset tagging', icon: 'tag',
      d: 'Physical asset verification, register reconstruction, depreciation policy review and impairment indicators.',
      bullets: ['Asset verification', 'Register reconstruction', 'Depreciation policy', 'Impairment review'] },
    { reg: 'Advisory', t: 'Business valuations', icon: 'gauge',
      d: 'DCF, comparables and asset-based valuations for transactions, disputes and statutory purposes.',
      bullets: ['Equity & enterprise value', 'Purchase price allocation', 'Impairment testing', 'Litigation support'] },
    { reg: 'Advisory', t: 'M&A support', icon: 'merge',
      d: 'Buy-side and sell-side assistance, deal structuring and closing support.',
      bullets: ['Information memorandum', 'Buy-side diligence', 'Closing accounts', 'Completion mechanics'] },
    { reg: 'Advisory', t: 'Financial due diligence', icon: 'search',
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
    { reg: 'Advisory', t: 'CFO services', icon: 'briefcase',
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { t: 'Retained',   sub: 'Monthly · ongoing',     d: 'Continuous compliance and management reporting against a fixed monthly fee. Best for SMEs and groups with steady volume.', cta: 'Common for bookkeeping, VAT, CT' },
              { t: 'Project',    sub: 'Fixed scope · fixed fee', d: 'A defined deliverable — a valuation, a model, a closeout pack. Scoping note in 24 hours.', cta: 'Common for valuations, DD, modeling' },
              { t: 'Statement of work', sub: 'Time & materials · capped', d: 'Open-ended advisory with a cap. Periodic check-ins, monthly status. Used where the question is still being shaped.', cta: 'Common for controls, restructuring' },
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
                <button
                  className="btn btn--ghost"
                  onClick={() => alert('Sample VAT201 return file — download mocked in this preview.')}
                >
                  Sample return file
                  <i data-lucide="download" style={{ width: 14, height: 14 }}></i>
                </button>
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
                  ['Typical fee',           'From AED 2,500 / quarter'],
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

      {/* Sample return */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">Sample return file</div>
            <h2>What you receive at filing.</h2>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--aa-rule)', maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ padding: '16px 20px', borderBottom: '2px solid var(--aa-charcoal)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="eyebrow eyebrow--charcoal">VAT201 · Q2 FY2026 · AUTHENTIC HOLDINGS FZ-LLC</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--aa-steel)' }}>TRN 100123456700003</div>
            </div>
            <table className="aa-table">
              <thead>
                <tr>
                  <th>Box</th>
                  <th>Description</th>
                  <th className="aa-num">Amount (AED)</th>
                  <th className="aa-num">VAT (AED)</th>
                  <th>Memo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1a', 'Standard-rated supplies — Dubai',         842210,  42110, '—'],
                  ['1b', 'Standard-rated supplies — other emirates', 318044,  15902, '—'],
                  ['2',  'Tax refunds for tourists',                       0,      0, '—'],
                  ['3',  'Reverse charge — services',                  64200,   3210, 'Cited M-217'],
                  ['4',  'Zero-rated supplies — exports',             204800,      0, 'Cited M-184'],
                  ['5',  'Exempt supplies',                            12480,      0, '—'],
                  ['9',  'Standard-rated expenses',                  421050,  21052, '—'],
                  ['10', 'Reverse charge — recoverable',              64200,   3210, '—'],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td className="mono" style={{ fontSize: 12 }}>{r[0]}</td>
                    <td>{r[1]}</td>
                    <td className="aa-num">{r[2].toLocaleString()}</td>
                    <td className="aa-num">{r[3].toLocaleString()}</td>
                    <td style={{ fontSize: 12, color: 'var(--aa-steel)' }}>{r[4]}</td>
                  </tr>
                ))}
                <tr className="aa-total">
                  <td>—</td>
                  <td>Net VAT payable</td>
                  <td className="aa-num">—</td>
                  <td className="aa-num">36,970</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--aa-rule)', fontSize: 11, color: 'var(--aa-steel)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Reviewed by · Partner / 28 Apr 2026</span>
              <span className="mono">file-ref vat-2026-q2-0112</span>
            </div>
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
            { q: 'What is the typical fee structure?',
              a: 'Quarterly retainers start at AED 2,500 for SMEs with under 200 monthly transactions. Larger groups are quoted on a per-entity basis. Fees include the closeout pack and one round of FTA queries.' },
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

      {/* Worked computation */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">A worked computation</div>
            <h2>Accounting profit to tax payable.</h2>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--aa-rule)', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ padding: '16px 20px', borderBottom: '2px solid var(--aa-charcoal)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="eyebrow eyebrow--charcoal">CT computation · FY2025 · illustrative</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--aa-steel)' }}>9% regime</div>
            </div>
            <table className="aa-table">
              <thead>
                <tr>
                  <th>Line</th>
                  <th className="aa-num">Amount (AED)</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Accounting net profit', '1,200,000', '—'],
                  ['Add: non-deductible expenses', '35,000', 'Fines, 50% entertainment'],
                  ['Less: exempt dividend income', '(80,000)', 'Participation exemption'],
                  ['Taxable income', '1,155,000', '—'],
                  ['0% band — first AED 375,000', '0', 'Rate band'],
                  ['9% on remaining AED 780,000', '70,200', '—'],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td className="aa-num">{r[1]}</td>
                    <td style={{ fontSize: 12, color: 'var(--aa-steel)' }}>{r[2]}</td>
                  </tr>
                ))}
                <tr className="aa-total">
                  <td>Corporate Tax payable</td>
                  <td className="aa-num">70,200</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--aa-rule)', fontSize: 11, color: 'var(--aa-steel)' }}>
              Illustrative only. Your computation depends on your facts, elections and free-zone status.
            </div>
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

Object.assign(window, { ServicesPage, ServiceVATPage, ServiceCorporateTaxPage, FAQList });
