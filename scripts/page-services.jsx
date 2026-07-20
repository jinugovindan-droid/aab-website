// Services overview page + VAT service detail page
const { useState: useStateSvc } = React;
const { pathForPage, pathForInsight } = window.AARoutes;

// Navigate to the contact wizard with a service pre-selected. The wizard reads
// `aa_intent_service`, skips step 1 and lands on step 2 with the service chosen.
function goContact(service, onNav) {
  try {
    if (service) sessionStorage.setItem('aa_intent_service', service);
    sessionStorage.setItem('aa_scroll_target', 'aa-contact-wizard');
  } catch (err) {}
  onNav('contact');
}

// ---------------------------------------------------------------------------
// Shared lead-tool helpers (Corporate Tax estimator + VAT checker).
// A branded, auto-paginating PDF and the jsPDF/logo loaders — the same pattern
// used by the E-Invoicing readiness tool, generalised so both tax tools reuse it.
// ---------------------------------------------------------------------------
const AA_MONEY = (n) => {
  const v = Math.round(Number(n) || 0);
  return 'AED ' + v.toLocaleString('en-US');
};
const aaParseNum = (s) => { const n = parseFloat(String(s).replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; };
const aaLoadJsPDF = () => new Promise((res, rej) => {
  if (window.jspdf && window.jspdf.jsPDF) return res();
  // Self-hosted first (corporate networks often block CDNs); unpkg as fallback.
  const s = document.createElement('script');
  s.src = 'assets/vendor/jspdf-2.5.1.umd.min.js';
  s.onload = res;
  s.onerror = () => {
    const cdn = document.createElement('script');
    cdn.src = 'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js';
    cdn.onload = res; cdn.onerror = rej; document.head.appendChild(cdn);
  };
  document.head.appendChild(s);
});
const aaLogoDataUrl = (src) => new Promise((res) => {
  const img = new Image(); img.crossOrigin = 'anonymous';
  img.onload = () => { try { const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; c.getContext('2d').drawImage(img, 0, 0); res({ url: c.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight }); } catch (e) { res(null); } };
  img.onerror = () => res(null); img.src = src;
});
const aaReportDate = () => { try { return new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Dubai', day: '2-digit', month: 'long', year: 'numeric' }); } catch (e) { return new Date().toDateString(); } };

// Submit a lead and REPORT THE TRUTH: resolves true only when the sheet
// confirmed receipt (bounded at 6s so a slow Apps Script can't hang the UI).
// Callers vary their done-state copy on this — never claim "we received your
// details" for a submission that may have been lost.
const aaSubmitLead = async (payload) => {
  if (!(window.AAContactSheet && window.AAContactSheet.submitRaw)) return false;
  try {
    await Promise.race([
      window.AAContactSheet.submitRaw(payload),
      new Promise((resolve, reject) => setTimeout(() => reject(new Error('lead-timeout')), 6000)),
    ]);
    return true;
  } catch (e) { return false; }
};

// "Today" anchored to the UAE, shared by the deadline cards so day-counts
// agree for overseas visitors (previously CT used the visitor's local clock).
const aaDubaiToday = () => {
  try {
    const iso = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' });
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  } catch (e) { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
};

// cfg: { title, subtitle, forWho, stats:[{label,big,sub}], verdictTitle, verdictBody,
//        inputs:[[k,v]], nextTitle, nextMoves:[str], ctaLines:[str], legal, fileName }
async function aaBuildBrandedPdf(cfg) {
  await aaLoadJsPDF();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const M = 48; const colW = W - 2 * M;
  const cyan = [41, 171, 226], charcoal = [26, 26, 46], steel = [110, 120, 135], ink = [55, 58, 70], offbg = [244, 245, 247];
  const setC = (rgb) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  let y = 54;
  const ensure = (need) => { if (y + need > PH - 70) { doc.addPage(); y = 60; } };
  const heading = (t) => { ensure(44); setC(charcoal); doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text(t, M, y); y += 9; doc.setDrawColor(cyan[0], cyan[1], cyan[2]); doc.setLineWidth(1.4); doc.line(M, y, M + 40, y); y += 16; };
  const para = (t, o) => { o = o || {}; doc.setFont('helvetica', o.bold ? 'bold' : 'normal'); doc.setFontSize(o.size || 10.5); setC(o.color || ink); doc.splitTextToSize(t, colW).forEach((ln) => { ensure(15); doc.text(ln, M, y); y += 15; }); y += (o.gap == null ? 8 : o.gap); };
  const bullet = (t) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); const lines = doc.splitTextToSize(t, colW - 16); ensure(lines.length * 14 + 2); setC(cyan); doc.text('•', M, y); setC(ink); lines.forEach((ln) => { doc.text(ln, M + 16, y); y += 14; }); y += 4; };

  // Header: logo + firm identity
  try { const lg = await aaLogoDataUrl('assets/logos/aab-short-eng-classic.png'); if (lg) doc.addImage(lg.url, 'PNG', M, y - 6, 104, 104 * lg.h / lg.w); } catch (e) {}
  doc.setTextColor.apply(doc, steel); doc.setFontSize(8.5);
  doc.text('Authentic Accounting & Bookkeeping L.L.C · Dubai, UAE', W - M, y + 2, { align: 'right' });
  doc.text('www.aaccounting.me', W - M, y + 14, { align: 'right' });
  y += 84;

  doc.setTextColor.apply(doc, charcoal); doc.setFont('helvetica', 'bold'); doc.setFontSize(21);
  doc.splitTextToSize(cfg.title, colW).forEach((ln) => { doc.text(ln, M, y); y += 22; });
  if (cfg.subtitle) { doc.setFont('helvetica', 'italic'); doc.setFontSize(11.5); setC(cyan); doc.text(cfg.subtitle, M, y); y += 18; }
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor.apply(doc, steel);
  if (cfg.forWho) { doc.text(cfg.forWho, M, y); y += 15; }
  doc.setFontSize(9.5); doc.text('Report date: ' + aaReportDate(), M, y); y += 24;

  // Dark hero stat band (1 or 2 headline figures)
  const stats = cfg.stats || [];
  if (stats.length) {
    const bandH = 92;
    doc.setFillColor.apply(doc, charcoal); doc.rect(M, y, colW, bandH, 'F');
    const cw = colW / stats.length;
    stats.forEach((st, i) => {
      const x = M + 16 + i * cw;
      setC(cyan); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(String(st.label).toUpperCase(), x, y + 24);
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.text(String(st.big), x, y + 54);
      if (st.sub) { setC(cyan); doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text(String(st.sub), x, y + 74); }
    });
    y += bandH + 24;
  }

  if (cfg.verdictTitle) { ensure(60); setC(charcoal); doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.splitTextToSize(cfg.verdictTitle, colW).forEach((ln) => { doc.text(ln, M, y); y += 17; }); }
  if (cfg.verdictBody) para(cfg.verdictBody, { gap: 12 });

  if (cfg.inputs && cfg.inputs.length) {
    heading('Your inputs');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    cfg.inputs.forEach(([k, v]) => { ensure(15); setC(steel); doc.text(k + ':', M, y); setC(ink); doc.text(String(v), M + 200, y); y += 15; });
    y += 8;
  }

  if (cfg.nextMoves && cfg.nextMoves.length) {
    heading(cfg.nextTitle || 'Your next moves');
    cfg.nextMoves.forEach((m) => bullet(m));
  }

  // CTA box
  const ctaLines = cfg.ctaLines || ['Phone / WhatsApp: +971 4 396 0399  ·  +971 56 548 4635', 'info@aaccounting.me   ·   www.aaccounting.me'];
  ensure(80);
  doc.setFillColor.apply(doc, offbg); doc.rect(M, y, colW, 34 + ctaLines.length * 16, 'F');
  setC(charcoal); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
  doc.text('Talk to us — book a scoping call', M + 16, y + 22);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); setC(ink);
  let cy = y + 40; ctaLines.forEach((ln) => { doc.text(ln, M + 16, cy); cy += 16; });
  y += 34 + ctaLines.length * 16 + 14;

  if (cfg.legal) { ensure(34); setC(steel); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.splitTextToSize(cfg.legal, colW).forEach((ln) => { ensure(10); doc.text(ln, M, y); y += 10; }); }

  // Footers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(225, 228, 232); doc.setLineWidth(0.5); doc.line(M, PH - 40, W - M, PH - 40);
    setC(steel); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    doc.text('Authentic Accounting & Bookkeeping L.L.C', M, PH - 28);
    doc.text('Page ' + p + ' of ' + totalPages, W - M, PH - 28, { align: 'right' });
  }
  doc.save(cfg.fileName || 'Authentic-Accounting-Report.pdf');
}

// Shared input styles for the lead tools.
const AA_TOOL_INPUT = { width: '100%', padding: '10px 12px', fontSize: 15, border: '1px solid var(--aa-rule-strong)', boxSizing: 'border-box', background: '#fff', fontFamily: 'var(--aa-font-sans)' };
const AA_TOOL_LABEL = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--aa-charcoal)', marginBottom: 6 };

function ServicesPage({ onNav }) {
  // Card titles must stay in lockstep with CONTACT_SERVICES (page-other.jsx)
  // and the footer columns (chrome.jsx): the contact wizard's buttons and the
  // card→wizard prefill both match on the exact title string.
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
    { reg: 'Compliance', t: 'E-Invoicing support', icon: 'file-output', page: 'e-invoicing',
      d: 'Readiness for the UAE e-invoicing mandate — phase mapping by revenue, ASP selection and ERP data preparation ahead of the 2027 go-live dates.',
      bullets: ['Readiness assessment', 'ASP selection', 'ERP field mapping', 'Phased go-live plan'] },
    { reg: 'Compliance', t: 'Financial statements', icon: 'file-spreadsheet', page: 'service-financial-statements',
      d: 'Balance Sheet, P&L, Cash Flow and notes prepared to IFRS / IFRS for SMEs.',
      bullets: ['Statutory FS', 'Group consolidation', 'Audit preparation', 'Disclosure schedules'] },
    { reg: 'Compliance', t: 'Audit support', icon: 'clipboard-check', page: 'service-audit-support',
      d: 'Pre-audit preparation, auditor liaison, sample selection and post-audit closeout for statutory and group audits.',
      bullets: ['Audit preparation', 'Auditor liaison', 'Sample selection', 'Closeout schedules'] },
    { reg: 'Compliance', t: 'Fixed asset tagging', icon: 'tag', page: 'service-fixed-asset-tagging',
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
    { reg: 'Advisory', t: 'Forensic accounting', icon: 'fingerprint', page: 'service-forensic-accounting',
      d: 'Fraud investigation, dispute support, expert testimony and evidence reconstruction for contested matters.',
      bullets: ['Fraud investigation', 'Dispute support', 'Expert testimony', 'Evidence reconstruction'] },
    { reg: 'Advisory', t: 'Internal controls', icon: 'shield', page: 'service-internal-controls',
      d: 'Design, walkthroughs and remediation for regulated entities and pre-IPO issuers.',
      bullets: ['Risk & control matrix', 'Walkthrough testing', 'Remediation plan', 'Management attestation'] },
    { reg: 'Advisory', t: 'Financial modeling', icon: 'function-square', page: 'service-financial-modelling',
      d: 'Operating, transaction and board-pack models — fully auditable, FAST-standard formatted.',
      bullets: ['Operating models', 'LBO / acquisition', 'Refinancing models', 'Board scenarios'] },
    { reg: 'Advisory', t: 'CFO services', icon: 'briefcase', page: 'service-cfo',
      d: 'Interim and fractional CFO leadership — Board reporting, treasury, fundraising support and finance function build-out.',
      bullets: ['Interim CFO', 'Board reporting packs', 'Treasury & cash', 'Finance function build'] },
    { reg: 'Advisory', t: 'Tax planning', icon: 'calculator', page: 'service-tax-planning',
      d: 'Pre-transaction tax structuring, free-zone optimisation, transfer pricing alignment and CT position memos.',
      bullets: ['Transaction structuring', 'Free-zone analysis', 'Transfer pricing', 'CT position memos'] },
    { reg: 'Advisory', t: 'Feasibility studies', icon: 'bar-chart-3', page: 'service-feasibility-studies',
      d: 'Project-level financial feasibility, sensitivity analysis, scenario modelling and pre-investment recommendations.',
      bullets: ['Financial modelling', 'Sensitivity analysis', 'Scenario testing', 'Pre-investment memo'] },
    { reg: 'Advisory', t: 'Strategic advisory', icon: 'compass', page: 'service-strategic-advisory',
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
// ---- VAT return deadline countdown (data-driven, owner-verified table) ------
// Reads window.AARoutes.VAT_DEADLINES (28th-of-month, weekend-shifted, verified).
// "Today" is anchored to UAE time so the monthly reset/day-count is correct
// regardless of the visitor's timezone. Targets the next upcoming deadline, so it
// resets to the current month on the 1st and rolls forward once the date passes.
function VatDeadlineCard({ onNav }) {
  const list = (window.AARoutes && window.AARoutes.VAT_DEADLINES) || [];
  let todayISO;
  try { todayISO = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' }); }
  catch (e) { todayISO = new Date().toISOString().slice(0, 10); }
  const next = list.find((d) => d.due >= todayISO);

  const shell = (children) => (
    <div className="aa-stack-sm" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
      background: 'var(--aa-charcoal)', color: '#fff', padding: '28px 32px', borderTop: '3px solid var(--aa-cyan)',
    }}>{children}</div>
  );

  if (!next) {
    // Table exhausted — graceful fallback until the annual refresh lands.
    return shell(
      <React.Fragment>
        <div style={{ minWidth: 240 }}>
          <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 8 }}>VAT filing deadline</div>
          <div style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, lineHeight: 1.05 }}>The 28th of the month</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 10, lineHeight: 1.5, maxWidth: 540 }}>VAT returns and payment are due the 28th of the month after your tax period ends (moved to the next working day for UAE weekends/holidays). Talk to us to confirm your exact deadline.</div>
        </div>
        <button className="btn btn--primary" onClick={() => goContact('VAT compliance', onNav)}>Book a VAT scoping <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i></button>
      </React.Fragment>
    );
  }

  const dayMs = 86400000;
  const daysLeft = Math.round((Date.parse(next.due + 'T00:00:00Z') - Date.parse(todayISO + 'T00:00:00Z')) / dayMs);
  const big = daysLeft <= 0 ? 'Today' : daysLeft.toLocaleString();
  const cap = daysLeft <= 0 ? 'return due' : (daysLeft === 1 ? 'day left' : 'days left');
  return shell(
    <React.Fragment>
      <div style={{ minWidth: 240 }}>
        <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 8 }}>Next VAT filing deadline</div>
        <div style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', letterSpacing: '0.01em', fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 700, lineHeight: 1.05 }}>{next.dueLabel}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 10, lineHeight: 1.5, maxWidth: 560 }}>
          {next.period}. Returns are due the 28th of the month after your tax period ends (shifted for UAE weekends and public holidays). <strong style={{ color: '#fff' }}>Your assigned tax period is on your VAT certificate.</strong>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--aa-font-mono)', fontSize: 48, fontWeight: 700, lineHeight: 1, color: 'var(--aa-cyan)' }}>{big}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{cap}</div>
        </div>
        <button className="btn btn--primary" onClick={() => goContact('VAT compliance', onNav)}>
          Book a VAT scoping <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
        </button>
      </div>
    </React.Fragment>
  );
}

// ---- VAT registration / threshold checker (lead tool) ----------------------
function VatChecker({ onNav }) {
  const uid = React.useId();
  const [f, setF] = React.useState({ company: '', name: '', email: '', phone: '', t12: '', fwd: '', consent: false });
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [sentOk, setSentOk] = React.useState(true);
  const upd = (k) => (e) => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setF((p) => ({ ...p, [k]: v })); };
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const MAND = 375000, VOL = 187500;
  const t12 = aaParseNum(f.t12);
  const fwd = aaParseNum(f.fwd);
  // FDL 8/2017: registration obligations attach when the threshold is EXCEEDED
  // (strictly greater), matching the helper copy — not >=.
  const isMandatory = t12 > MAND || fwd > MAND;
  const isVoluntary = !isMandatory && t12 > VOL;
  const status = isMandatory ? 'Mandatory' : isVoluntary ? 'Voluntary' : 'Not yet required';
  const statusColor = isMandatory ? 'var(--aa-cyan)' : isVoluntary ? '#ffd27a' : 'rgba(255,255,255,0.85)';
  const showResult = f.t12.trim() !== '' || f.fwd.trim() !== '';

  const verdict = () => {
    if (isMandatory) return { t: 'Mandatory VAT registration', b: 'Your taxable turnover has exceeded — or is expected to exceed — the AED 375,000 mandatory threshold. UAE law requires you to apply to register for VAT within 30 days of exceeding it; late registration carries an AED 10,000 penalty. Once registered you charge 5% VAT and file returns (usually quarterly) within 28 days of each period-end.' };
    if (isVoluntary) return { t: 'Voluntary VAT registration available', b: 'Your taxable turnover (or expenses) is above the AED 187,500 voluntary threshold but below the AED 375,000 mandatory one. You may register voluntarily — useful if your customers are VAT-registered or you want to recover input VAT — but it is not yet compulsory.' };
    return { t: 'Below the VAT thresholds', b: 'On the figures entered, you are below the AED 187,500 voluntary threshold, so VAT registration is not required or available yet. Keep a rolling 12-month view of taxable turnover — you must register within 30 days of crossing AED 375,000, or when you expect to within the next 30 days.' };
  };

  const handle = async () => {
    setErr('');
    if (!f.company.trim() || !f.name.trim() || !f.email.trim() || !f.phone.trim()) { setErr('Please complete company name, your name, email and phone.'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) { setErr('Please enter a valid work email.'); return; }
    if (f.t12.trim() === '' && f.fwd.trim() === '') { setErr('Please enter your taxable turnover so we can check your registration status.'); return; }
    if (!f.consent) { setErr('Please confirm you agree to our Privacy Policy so we can prepare your result.'); return; }
    setBusy(true);
    const v = verdict();
    try {
      let downloadDate = '';
      try { downloadDate = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' (GST)'; } catch (e) { downloadDate = new Date().toISOString(); }
      const inputs = [
        ['Taxable turnover (past 12 months)', t12 ? AA_MONEY(t12) : '—'],
        ['Expected turnover (next 30 days)', fwd ? AA_MONEY(fwd) : '—'],
        ['Mandatory threshold', AA_MONEY(MAND)],
        ['Voluntary threshold', AA_MONEY(VOL)],
        ['Registration status', status],
      ];
      const summary = ['Company: ' + f.company, 'Name: ' + f.name, 'Email: ' + f.email, 'Phone: ' + f.phone, 'Turnover 12m: ' + (t12 ? AA_MONEY(t12) : '—'), 'Forward 30d: ' + (fwd ? AA_MONEY(fwd) : '—'), 'Status: ' + status, 'Verdict: ' + v.t, 'Downloaded: ' + downloadDate].join('\n');
      const sent = await aaSubmitLead({ type: 'VAT Registration Check', company: f.company, name: f.name, email: f.email, phone: f.phone, turnover12m: t12 ? AA_MONEY(t12) : '', forward30d: fwd ? AA_MONEY(fwd) : '', status, verdict: v.t, downloadDate, summary, consent: 'Yes', consentAt: new Date().toISOString() });
      setSentOk(sent);
      if (window.gtag) window.gtag('event', 'generate_lead', { event_category: 'vat', event_label: status });
      await aaBuildBrandedPdf({
        title: 'Your UAE VAT Registration Check',
        subtitle: '5% VAT · registration thresholds',
        forWho: 'Prepared for ' + f.company + '  ·  ' + f.name,
        stats: [
          { label: 'Registration status', big: status, sub: isMandatory ? 'Apply within 30 days' : isVoluntary ? 'Optional' : 'Monitor turnover' },
          { label: 'VAT return', big: 'Usually quarterly', sub: 'due 28 days after period-end' },
        ],
        verdictTitle: v.t, verdictBody: v.b,
        inputs,
        nextMoves: [
          isMandatory ? 'Apply for VAT registration on EmaraTax now — within 30 days of exceeding AED 375,000 — to avoid the AED 10,000 penalty.' : isVoluntary ? 'Decide whether voluntary registration helps you (input-VAT recovery, B2B credibility) before you cross the mandatory threshold.' : 'Track a rolling 12-month taxable turnover and register within 30 days of expecting to cross AED 375,000.',
          'Classify your supplies correctly — standard-rated, zero-rated, exempt and out-of-scope — and flag designated-zone vs mainland.',
          'Set up VAT-ready bookkeeping so each quarterly return files on EmaraTax within 28 days, with workpapers kept for five years.',
        ],
        legal: 'Indicative check only — not tax advice. Registration also depends on taxable expenses and specific supply rules under Federal Decree-Law No. 8 of 2017 on VAT (as amended). Confirm against the latest UAE Federal Tax Authority sources.',
        fileName: 'UAE-VAT-Registration-Check-' + (f.company || 'Report').replace(/[^A-Za-z0-9]+/g, '-') + '.pdf',
      });
    } catch (e) { setErr('Sorry — the result could not be generated. Please try again or contact us.'); setBusy(false); return; }
    setBusy(false); setDone(true);
  };

  const v = verdict();
  return (
    <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
      <div style={{ padding: 32, borderRight: '1px solid var(--aa-rule)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label htmlFor={uid + '-company'} style={AA_TOOL_LABEL}>Company name *</label><input id={uid + '-company'} autoComplete="organization" style={AA_TOOL_INPUT} value={f.company} onChange={upd('company')} placeholder="Your company" /></div>
          <div><label htmlFor={uid + '-name'} style={AA_TOOL_LABEL}>Your name *</label><input id={uid + '-name'} autoComplete="name" style={AA_TOOL_INPUT} value={f.name} onChange={upd('name')} placeholder="Full name" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
          <div><label htmlFor={uid + '-email'} style={AA_TOOL_LABEL}>Work email *</label><input id={uid + '-email'} type="email" autoComplete="email" style={AA_TOOL_INPUT} value={f.email} onChange={upd('email')} placeholder="name@company.ae" /></div>
          <div><label htmlFor={uid + '-phone'} style={AA_TOOL_LABEL}>Phone / WhatsApp *</label><input id={uid + '-phone'} type="tel" autoComplete="tel" style={AA_TOOL_INPUT} value={f.phone} onChange={upd('phone')} placeholder="+971 …" /></div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label htmlFor={uid + '-t12'} style={AA_TOOL_LABEL}>Taxable turnover — past 12 months (AED) *</label>
          <input id={uid + '-t12'} style={{ ...AA_TOOL_INPUT, fontFamily: 'var(--aa-font-mono)' }} inputMode="numeric" value={f.t12} onChange={upd('t12')} placeholder="e.g. 420,000" />
        </div>
        <div style={{ marginTop: 14 }}>
          <label htmlFor={uid + '-fwd'} style={AA_TOOL_LABEL}>Expected taxable turnover — next 30 days (AED)</label>
          <input id={uid + '-fwd'} style={{ ...AA_TOOL_INPUT, fontFamily: 'var(--aa-font-mono)' }} inputMode="numeric" value={f.fwd} onChange={upd('fwd')} placeholder="optional" />
          <p style={{ fontSize: 12, color: 'var(--aa-steel)', marginTop: 8, lineHeight: 1.5 }}>Registration becomes mandatory once turnover exceeds AED 375,000, or when you expect it to within 30 days.</p>
        </div>
      </div>
      <div style={{ padding: 32, background: 'var(--aa-charcoal)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 320 }}>
        {done ? (
          <div>
            <i data-lucide="check-circle-2" style={{ width: 34, height: 34, color: 'var(--aa-cyan)' }}></i>
            <h3 style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', fontSize: 22, letterSpacing: '0.01em', margin: '14px 0 8px' }}>Result downloading</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.6 }}>{sentOk ? 'Your VAT registration check is downloading now. We’ve received your details — the team will be in touch, or reach us on WhatsApp.' : 'Your VAT registration check is downloading now. We could not confirm your details reached us — please WhatsApp us on +971 56 548 4635 so we can follow up.'}</p>
            <button className="btn btn--primary btn--sm" style={{ marginTop: 16 }} onClick={() => goContact('VAT compliance', onNav)}>Book a VAT scoping <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i></button>
          </div>
        ) : (
          <div>
            {showResult ? (
              <div style={{ marginBottom: 20 }}>
                <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 10 }}>Registration status</div>
                <div style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', fontSize: 30, fontWeight: 700, lineHeight: 1.05, color: statusColor }}>{status}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 10 }}>{v.t}</div>
              </div>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>Enter your taxable turnover to see whether VAT registration is mandatory, voluntary or not yet required — then download a personalised PDF with your next steps.</p>
            )}
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, cursor: 'pointer', marginBottom: 14 }}>
              <input type="checkbox" checked={f.consent} onChange={upd('consent')} style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0 }} />
              <span>I agree to Authentic Accounting using my details to prepare this result and follow up, as described in the <a href={pathForPage('privacy')} onClick={(e) => { e.preventDefault(); onNav('privacy'); }} style={{ color: 'var(--aa-cyan)', fontWeight: 600 }}>Privacy Policy</a>. *</span>
            </label>
            <button className="btn btn--primary" onClick={handle} disabled={busy}>
              {busy ? 'Generating…' : 'Check my VAT status (PDF)'}
              <i data-lucide="download" style={{ width: 16, height: 16 }}></i>
            </button>
            {err ? <p role="alert" style={{ color: '#ff9a9a', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>{err}</p> : null}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 14, lineHeight: 1.5 }}>Indicative check · instant PDF · not tax advice.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceVATPage({ onNav }) {
  const VAT_FAQ = (window.AARoutes && window.AARoutes.VAT_FAQ) || [];
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
                <button className="btn btn--primary" onClick={() => goContact('VAT compliance', onNav)}>
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
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--aa-rule)' }}>
                    <dt style={{ color: 'var(--aa-steel)' }}>{k}</dt>
                    <dd style={{ margin: 0, color: 'var(--aa-charcoal)', fontWeight: 600, textAlign: 'right' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* VAT deadline countdown + registration checker (lead tool) */}
      <section id="aa-vat-checker" className="section section--off" style={{ scrollMarginTop: 128 }}>
        <div className="container">
          <VatDeadlineCard onNav={onNav} />
          <div className="section-head" style={{ marginTop: 56 }}>
            <div className="section-head__eyebrow">Free · Instant registration check</div>
            <h2>Do you need to register for VAT?</h2>
          </div>
          <VatChecker onNav={onNav} />
        </div>
      </section>

      {/* What it covers */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">What the engagement covers</div>
            <h2>End-to-end VAT compliance.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['file-check', 'Registration', 'VAT registration, deregistration and tax-group set-up, with the right effective dates.'],
              ['calculator', 'Returns & filing', 'Transaction classification, return preparation and filing on the FTA EmaraTax portal.'],
              ['shield', 'Position memos', 'A defensible memo behind every contested line, with FTA decision references.'],
              ['messages-square', 'FTA correspondence', 'Queries, audits, voluntary disclosures and refund claims handled end to end.'],
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
      <section className="section">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head">
            <div className="section-head__eyebrow">FAQ</div>
            <h2>What clients ask first.</h2>
          </div>
          <FAQList items={VAT_FAQ} asOf />
          <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span className="eyebrow eyebrow--steel">Related</span>
            <a href={pathForPage('service-corporate-tax')} onClick={(e) => { e.preventDefault(); onNav('service-corporate-tax'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Corporate Tax →</a>
            <a href={pathForPage('service-bookkeeping')} onClick={(e) => { e.preventDefault(); onNav('service-bookkeeping'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Bookkeeping →</a>
            <a href={pathForPage('e-invoicing')} onClick={(e) => { e.preventDefault(); onNav('e-invoicing'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>E-invoicing readiness →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---- Corporate Tax return deadline countdown (auto-rolling, zero-maintenance)
// CT return + payment are due within 9 months of year-end → 30 Sep for a 31 Dec
// (calendar) financial year. Computed live from today's date; rolls to next year
// automatically once the date passes, so it never goes stale.
function CorpTaxDeadlineCard({ onNav }) {
  const now = aaDubaiToday();                                        // UAE-anchored, matches the VAT card
  const y = now.getFullYear();
  const endOfDue = new Date(y, 8, 30, 23, 59, 59, 999);              // 30 Sep this year (month index 8)
  const target = now > endOfDue ? new Date(y + 1, 8, 30) : new Date(y, 8, 30);
  const daysLeft = Math.round((target - now) / 86400000);
  const fy = target.getFullYear() - 1;                              // FY ended 31 Dec of the prior year
  const dateLabel = '30 September ' + target.getFullYear();
  const big = daysLeft <= 0 ? 'Today' : daysLeft.toLocaleString();
  const cap = daysLeft <= 0 ? 'return due' : (daysLeft === 1 ? 'day left' : 'days left');
  return (
    <div className="aa-stack-sm" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
      background: 'var(--aa-charcoal)', color: '#fff', padding: '28px 32px', borderTop: '3px solid var(--aa-cyan)',
    }}>
      <div style={{ minWidth: 240 }}>
        <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 8 }}>Next Corporate Tax return deadline</div>
        <div style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', letterSpacing: '0.01em', fontSize: 'clamp(26px, 3.6vw, 40px)', fontWeight: 700, lineHeight: 1 }}>{dateLabel}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 10, lineHeight: 1.5, maxWidth: 540 }}>
          For a 31 December financial year-end (FY{fy}) — the return <strong style={{ color: '#fff' }}>and payment</strong> fall due within 9 months. A different year-end? Use the estimator below for your exact date.
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--aa-font-mono)', fontSize: 48, fontWeight: 700, lineHeight: 1, color: 'var(--aa-cyan)' }}>{big}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{cap}</div>
        </div>
        <button className="btn btn--primary" onClick={() => goContact('UAE Corporate Tax', onNav)}>
          Book a scoping call <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
        </button>
      </div>
    </div>
  );
}

// ---- Corporate Tax liability estimator (lead tool) --------------------------
function CorpTaxEstimator({ onNav }) {
  const uid = React.useId();
  const [f, setF] = React.useState({ company: '', name: '', email: '', phone: '', profit: '', revenue: '', freezone: false, yearEnd: '12', consent: false });
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [sentOk, setSentOk] = React.useState(true);
  const upd = (k) => (e) => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setF((p) => ({ ...p, [k]: v })); };
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const profit = aaParseNum(f.profit);
  const revenue = aaParseNum(f.revenue);
  const THRESH = 375000;
  const sbrEligible = revenue > 0 && revenue <= 3000000;           // Small Business Relief: revenue ≤ AED 3M
  // SBR is NOT available to Qualifying Free Zone Persons (MD 73/2023), so a
  // free-zone company never gets the automatic AED 0 — the estimate stays at
  // the mainland-equivalent figure the free-zone caption describes.
  const sbrApplied = sbrEligible && !f.freezone;
  const taxable = Math.max(0, profit);                              // simplified: taxable income ≈ accounting profit
  const ctBeforeRelief = Math.max(0, taxable - THRESH) * 0.09;     // 0% on first 375k, 9% above
  const ct = sbrApplied ? 0 : ctBeforeRelief;
  const effRate = taxable > 0 ? (ct / taxable) * 100 : 0;
  const yeIdx = parseInt(f.yearEnd, 10) - 1;
  const filingDue = MONTHS[(yeIdx + 9) % 12] + ((yeIdx + 9) >= 12 ? ' (following year)' : '');
  const hasInput = f.profit.trim() !== '' && profit >= 0 && f.profit.trim() !== '';
  const showResult = f.profit.trim() !== '';

  const verdict = () => {
    if (f.freezone) return { t: 'Free zone — a QFZP analysis is essential', b: 'As a free zone person you may qualify for the 0% rate on qualifying income — but only if you meet the substance, de minimis and qualifying-activity tests. Non-qualifying income is taxed at 9%, and Small Business Relief is not available to Qualifying Free Zone Persons. The figure shown assumes taxable (mainland-equivalent) income; your actual position depends on a QFZP assessment, which we can run for you.' };
    if (sbrApplied) return { t: 'Likely AED 0 — Small Business Relief', b: 'Your revenue is at or below AED 3,000,000, so you may be able to elect Small Business Relief and be treated as having no taxable income for the period. Conditions apply: revenue must be AED 3M or below in this and all previous tax periods (from June 2023), the relief ends for periods ending after 31 December 2026, and it is not available to Qualifying Free Zone Persons or members of large multinational groups. You still must register and file — the relief is claimed on the return.' };
    if (ct === 0) return { t: 'Within the 0% band', b: 'Your taxable income is at or below the AED 375,000 threshold, so the estimated Corporate Tax is nil at the 0% band. You must still register with the FTA and file a return for the period.' };
    return { t: 'Estimated liability: ' + AA_MONEY(ct), b: 'Based on an accounting profit of ' + AA_MONEY(profit) + ', the first AED 375,000 is taxed at 0% and the balance at 9% — an effective rate of about ' + effRate.toFixed(1) + '%. This is an indicative estimate: your actual taxable income reflects add-backs, exempt income, reliefs and interest-limitation rules.' };
  };

  const handle = async () => {
    setErr('');
    if (!f.company.trim() || !f.name.trim() || !f.email.trim() || !f.phone.trim()) { setErr('Please complete company name, your name, email and phone.'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) { setErr('Please enter a valid work email.'); return; }
    if (f.profit.trim() === '') { setErr('Please enter your accounting net profit so we can estimate your liability.'); return; }
    if (!f.consent) { setErr('Please confirm you agree to our Privacy Policy so we can prepare your estimate.'); return; }
    setBusy(true);
    const v = verdict();
    try {
      let downloadDate = '';
      try { downloadDate = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' (GST)'; } catch (e) { downloadDate = new Date().toISOString(); }
      const inputs = [
        ['Accounting net profit', AA_MONEY(profit)],
        ['Annual revenue', revenue ? AA_MONEY(revenue) : '—'],
        ['Free zone person', f.freezone ? 'Yes' : 'No'],
        ['Financial year-end', MONTHS[yeIdx]],
        ['Small Business Relief', sbrApplied ? 'Likely eligible — verify prior-period revenue too' : (f.freezone && sbrEligible ? 'Not applied — QFZPs are excluded' : 'Not eligible on revenue')],
      ];
      const summary = ['Company: ' + f.company, 'Name: ' + f.name, 'Email: ' + f.email, 'Phone: ' + f.phone, 'Profit: ' + AA_MONEY(profit), 'Revenue: ' + (revenue ? AA_MONEY(revenue) : '—'), 'Free zone: ' + (f.freezone ? 'Yes' : 'No'), 'Year-end: ' + MONTHS[yeIdx], 'Estimated CT: ' + AA_MONEY(ct), 'Effective rate: ' + effRate.toFixed(1) + '%', 'Verdict: ' + v.t, 'Downloaded: ' + downloadDate].join('\n');
      const sent = await aaSubmitLead({ type: 'Corporate Tax Estimate', company: f.company, name: f.name, email: f.email, phone: f.phone, profit: AA_MONEY(profit), revenue: revenue ? AA_MONEY(revenue) : '', freezone: f.freezone ? 'Yes' : 'No', yearEnd: MONTHS[yeIdx], estimatedCT: AA_MONEY(ct), effectiveRate: effRate.toFixed(1) + '%', verdict: v.t, downloadDate, summary, consent: 'Yes', consentAt: new Date().toISOString() });
      setSentOk(sent);
      if (window.gtag) window.gtag('event', 'generate_lead', { event_category: 'corporate-tax', event_label: v.t });
      await aaBuildBrandedPdf({
        title: 'Your UAE Corporate Tax Estimate',
        subtitle: '9% Federal Corporate Tax · indicative figures',
        forWho: 'Prepared for ' + f.company + '  ·  ' + f.name,
        stats: [
          { label: 'Estimated CT liability', big: AA_MONEY(ct), sub: effRate.toFixed(1) + '% effective rate' },
          { label: 'Return filing due', big: filingDue, sub: '9 months after year-end' },
        ],
        verdictTitle: v.t, verdictBody: v.b,
        inputs,
        nextMoves: [
          'Register for Corporate Tax on EmaraTax and confirm your first tax period (late registration carries an AED 10,000 penalty).',
          sbrApplied ? 'Check Small Business Relief eligibility — revenue must be AED 3M or below in this and all previous tax periods, and the relief ends for periods ending after 31 Dec 2026 — then elect it on your return.' : 'Prepare a taxable-income computation — add-backs, exempt income, reliefs and interest limitation — from your financial statements.',
          f.freezone ? 'Commission a Qualifying Free Zone Person (QFZP) assessment before relying on the 0% rate.' : 'File your return on EmaraTax within nine months of your year-end and keep audit-ready workpapers.',
        ],
        legal: 'Indicative estimate only — not tax advice. Taxable income is simplified here as accounting profit; your actual position reflects add-backs, exempt income, reliefs, transfer pricing and interest-limitation rules under Federal Decree-Law No. 47 of 2022 and related decisions. Confirm against the latest UAE Ministry of Finance / Federal Tax Authority sources.',
        fileName: 'UAE-Corporate-Tax-Estimate-' + (f.company || 'Report').replace(/[^A-Za-z0-9]+/g, '-') + '.pdf',
      });
    } catch (e) { setErr('Sorry — the estimate could not be generated. Please try again or contact us.'); setBusy(false); return; }
    setBusy(false); setDone(true);
  };

  const v = verdict();
  return (
    <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
      <div style={{ padding: 32, borderRight: '1px solid var(--aa-rule)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label htmlFor={uid + '-company'} style={AA_TOOL_LABEL}>Company name *</label><input id={uid + '-company'} autoComplete="organization" style={AA_TOOL_INPUT} value={f.company} onChange={upd('company')} placeholder="Your company" /></div>
          <div><label htmlFor={uid + '-name'} style={AA_TOOL_LABEL}>Your name *</label><input id={uid + '-name'} autoComplete="name" style={AA_TOOL_INPUT} value={f.name} onChange={upd('name')} placeholder="Full name" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
          <div><label htmlFor={uid + '-email'} style={AA_TOOL_LABEL}>Work email *</label><input id={uid + '-email'} type="email" autoComplete="email" style={AA_TOOL_INPUT} value={f.email} onChange={upd('email')} placeholder="name@company.ae" /></div>
          <div><label htmlFor={uid + '-phone'} style={AA_TOOL_LABEL}>Phone / WhatsApp *</label><input id={uid + '-phone'} type="tel" autoComplete="tel" style={AA_TOOL_INPUT} value={f.phone} onChange={upd('phone')} placeholder="+971 …" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
          <div><label htmlFor={uid + '-profit'} style={AA_TOOL_LABEL}>Accounting net profit (AED) *</label><input id={uid + '-profit'} style={{ ...AA_TOOL_INPUT, fontFamily: 'var(--aa-font-mono)' }} inputMode="numeric" value={f.profit} onChange={upd('profit')} placeholder="e.g. 900,000" /></div>
          <div><label htmlFor={uid + '-revenue'} style={AA_TOOL_LABEL}>Annual revenue (AED)</label><input id={uid + '-revenue'} style={{ ...AA_TOOL_INPUT, fontFamily: 'var(--aa-font-mono)' }} inputMode="numeric" value={f.revenue} onChange={upd('revenue')} placeholder="e.g. 2,500,000" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14, alignItems: 'end' }}>
          <div><label htmlFor={uid + '-yearend'} style={AA_TOOL_LABEL}>Financial year-end</label>
            <select id={uid + '-yearend'} style={AA_TOOL_INPUT} value={f.yearEnd} onChange={upd('yearEnd')}>
              {MONTHS.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
            </select></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--aa-charcoal)', cursor: 'pointer', paddingBottom: 10 }}>
            <input type="checkbox" checked={f.freezone} onChange={upd('freezone')} style={{ width: 16, height: 16 }} /> Free zone company
          </label>
        </div>
      </div>
      <div style={{ padding: 32, background: 'var(--aa-charcoal)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 320 }}>
        {done ? (
          <div>
            <i data-lucide="check-circle-2" style={{ width: 34, height: 34, color: 'var(--aa-cyan)' }}></i>
            <h3 style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', fontSize: 22, letterSpacing: '0.01em', margin: '14px 0 8px' }}>Estimate downloading</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.6 }}>{sentOk ? 'Your Corporate Tax estimate is downloading now. We’ve received your details — the team will be in touch, or reach us on WhatsApp.' : 'Your Corporate Tax estimate is downloading now. We could not confirm your details reached us — please WhatsApp us on +971 56 548 4635 so we can follow up.'}</p>
            <button className="btn btn--primary btn--sm" style={{ marginTop: 16 }} onClick={() => goContact('UAE Corporate Tax', onNav)}>Book a scoping call <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i></button>
          </div>
        ) : (
          <div>
            {showResult ? (
              <div style={{ marginBottom: 20 }}>
                <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 10 }}>Estimated CT liability</div>
                <div style={{ fontFamily: 'var(--aa-font-mono)', fontSize: 34, fontWeight: 700, lineHeight: 1.05 }}>{AA_MONEY(ct)}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>{v.t}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>Return filing due <strong style={{ color: '#fff' }}>{filingDue}</strong> <span style={{ color: 'var(--aa-cyan)' }}>· 9 months after year-end</span></div>
              </div>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>Enter your accounting net profit to see an indicative 9% Corporate Tax estimate — then download a personalised PDF with your deadlines and next steps.</p>
            )}
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, cursor: 'pointer', marginBottom: 14 }}>
              <input type="checkbox" checked={f.consent} onChange={upd('consent')} style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0 }} />
              <span>I agree to Authentic Accounting using my details to prepare this estimate and follow up, as described in the <a href={pathForPage('privacy')} onClick={(e) => { e.preventDefault(); onNav('privacy'); }} style={{ color: 'var(--aa-cyan)', fontWeight: 600 }}>Privacy Policy</a>. *</span>
            </label>
            <button className="btn btn--primary" onClick={handle} disabled={busy}>
              {busy ? 'Generating…' : 'Get my estimate (PDF)'}
              <i data-lucide="download" style={{ width: 16, height: 16 }}></i>
            </button>
            {err ? <p role="alert" style={{ color: '#ff9a9a', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>{err}</p> : null}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 14, lineHeight: 1.5 }}>Indicative estimate · instant PDF · not tax advice.</p>
          </div>
        )}
      </div>
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
                <button className="btn btn--primary" onClick={() => goContact('UAE Corporate Tax', onNav)}>
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
                  ['Small Business Relief', 'Revenue up to AED 3M · to 31 Dec 2026'],
                  ['Return filing', 'Within 9 months of year-end'],
                  ['Late-registration penalty', 'AED 10,000'],
                  ['Pricing', 'Customised to your scope'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--aa-rule)' }}>
                    <dt style={{ color: 'var(--aa-steel)' }}>{k}</dt>
                    <dd style={{ margin: 0, color: 'var(--aa-charcoal)', fontWeight: 600, textAlign: 'right' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Corporate Tax deadline countdown + estimator (lead tool) */}
      <section id="aa-ct-estimator" className="section section--off" style={{ scrollMarginTop: 128 }}>
        <div className="container">
          <CorpTaxDeadlineCard onNav={onNav} />
          <div className="section-head" style={{ marginTop: 56 }}>
            <div className="section-head__eyebrow">Free · Instant estimate with your filing deadline</div>
            <h2>Estimate your Corporate Tax.</h2>
          </div>
          <CorpTaxEstimator onNav={onNav} />
        </div>
      </section>

      {/* What it covers */}
      <section className="section">
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
      <section className="section section--off">
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
          <FAQList items={CT_FAQ} asOf />
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
                <button className="btn btn--primary" onClick={() => goContact('Outsourced accounting', onNav)}>
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
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--aa-rule)' }}>
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
                <button className="btn btn--primary" onClick={() => goContact('Audit support', onNav)}>
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
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--aa-rule)' }}>
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
                <button className="btn btn--primary" onClick={() => goContact('Business valuations', onNav)}>
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
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--aa-rule)' }}>
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
                <button className="btn btn--primary" onClick={() => goContact('M&A support', onNav)}>
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
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--aa-rule)' }}>
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
                <button className="btn btn--primary" onClick={() => goContact('CFO services', onNav)}>
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
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--aa-rule)' }}>
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

// Financial statements (IFRS) detail page (Compliance)
function ServiceFinancialStatementsPage({ onNav }) {
  const FS_FAQ = (window.AARoutes && window.AARoutes.FS_FAQ) || [];
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
            <span style={{ color: 'var(--aa-charcoal)' }}>Financial Statements</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Compliance · IFRS financial statements</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0,
              }}>
                Financial statements.<br />
                IFRS, audit-ready.
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>
                We prepare your year-end financial statements under IFRS or IFRS for SMEs — balance sheet, income statement, cash flow, changes in equity and the notes — consolidated where needed, and ready to drop straight into the audit and the Corporate Tax computation.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => goContact('Financial statements', onNav)}>
                  Request financial statements
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
                  ['Framework', 'IFRS / IFRS for SMEs'],
                  ['Statements', 'BS · P&L · cash flow · notes'],
                  ['Scope', 'Statutory & consolidated'],
                  ['Deliverable', 'Sign-off-ready statements'],
                  ['Ready for', 'Audit & Corporate Tax'],
                  ['Engagement', 'Project or annual'],
                  ['Pricing', 'Customised to your scope'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--aa-rule)' }}>
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
            <h2>A complete, compliant set.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['file-spreadsheet', 'Statutory statements', 'The full IFRS set — financial position, income, cash flow and changes in equity.'],
              ['layers', 'Group consolidation', 'Consolidated statements with intercompany eliminations and non-controlling interests (NCI).'],
              ['list', 'Notes & disclosures', 'Accounting policies, related parties and the disclosures auditors and regulators expect.'],
              ['check-check', 'Audit & tax ready', 'Lead schedules and a basis consistent with your audit and Corporate Tax computation.'],
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
            <div className="section-head__eyebrow">Year-end, end to end</div>
            <h2>How we build your statements.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['01', 'Trial balance', 'Finalise and reconcile the trial balance so the numbers are complete and tie out.'],
              ['02', 'Framework', 'Confirm IFRS vs IFRS for SMEs and the accounting policies that apply.'],
              ['03', 'Statements', 'Build the balance sheet, income statement, cash flow and statement of changes in equity.'],
              ['04', 'Notes & disclosures', 'Draft accounting policies, related-party and the required disclosure notes.'],
              ['05', 'Review & finalise', 'Partner review, then a sign-off-ready set of financial statements.'],
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

      {/* FAQ — shares FS_FAQ with the FAQPage schema */}
      <section className="section section--off">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head">
            <div className="section-head__eyebrow">FAQ</div>
            <h2>Financial statements, answered.</h2>
          </div>
          <FAQList items={FS_FAQ} />
          <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span className="eyebrow eyebrow--steel">Related</span>
            <a href={pathForPage('service-audit-support')} onClick={(e) => { e.preventDefault(); onNav('service-audit-support'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Audit support →</a>
            <a href={pathForPage('service-bookkeeping')} onClick={(e) => { e.preventDefault(); onNav('service-bookkeeping'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Bookkeeping →</a>
            <a href={pathForPage('service-corporate-tax')} onClick={(e) => { e.preventDefault(); onNav('service-corporate-tax'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Corporate Tax →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Tax planning / structuring detail page (Advisory)
function ServiceTaxPlanningPage({ onNav }) {
  const TP_FAQ = (window.AARoutes && window.AARoutes.TAXPLAN_FAQ) || [];
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
            <span style={{ color: 'var(--aa-charcoal)' }}>Tax Planning</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Advisory · Corporate Tax planning &amp; structuring</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0,
              }}>
                Tax planning.<br />
                Efficient, and defensible.
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>
                Compliant UAE Corporate Tax planning — group and transaction structuring, free-zone (QFZP) optimisation and transfer pricing alignment — with every position documented to its legal basis. Efficiency that holds up if the FTA looks.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => goContact('Tax planning', onNav)}>
                  Plan your tax position
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
                  ['Focus', 'CT structuring & positions'],
                  ['Free zone', 'QFZP optimisation'],
                  ['Transfer pricing', "Arm's-length & docs"],
                  ['Deliverable', 'Documented position memos'],
                  ['Basis', 'FTA-defensible'],
                  ['Engagement', 'Project or advisory'],
                  ['Pricing', 'Customised to your scope'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--aa-rule)' }}>
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
            <h2>Structure, free zone, pricing.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['network', 'Structure & holding', 'Group and holding structure, entity selection and mainland-versus-free-zone positioning.'],
              ['building-2', 'Free zone / QFZP', 'Qualifying income, substance and de minimis testing — keeping the 0% rate where it genuinely applies.'],
              ['scale', 'Transfer pricing', "Arm's-length policy, master and local file, and the related-party disclosure."],
              ['git-merge', 'Transaction structuring', 'Pre-deal tax structuring with documented Corporate Tax positions and their legal basis.'],
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
            <h2>How we plan your tax.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['01', 'Review', 'Your current structure, transactions and Corporate Tax exposure.'],
              ['02', 'Options', 'Structuring options, with the tax and compliance trade-offs laid out.'],
              ['03', 'Position', 'The recommended position, with its legal basis under the Corporate Tax law.'],
              ['04', 'Document', 'Position memos and transfer-pricing documentation prepared.'],
              ['05', 'Implement', 'Support implementation and the related Corporate Tax filings.'],
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

      {/* FAQ — shares TAXPLAN_FAQ with the FAQPage schema */}
      <section className="section section--off">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head">
            <div className="section-head__eyebrow">FAQ</div>
            <h2>Tax planning, answered.</h2>
          </div>
          <FAQList items={TP_FAQ} asOf />
          <p style={{ marginTop: 28, fontSize: 13, color: 'var(--aa-steel)', lineHeight: 1.6 }}>
            General guidance, not tax advice — positions depend on your facts. Confirm against the latest UAE Ministry of Finance / Federal Tax Authority sources.
          </p>
          <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span className="eyebrow eyebrow--steel">Related</span>
            <a href={pathForInsight('free-zone-qualifying-income')} onClick={(e) => { e.preventDefault(); onNav('insight', 'free-zone-qualifying-income'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Insight: Free-zone qualifying income →</a>
            <a href={pathForPage('service-corporate-tax')} onClick={(e) => { e.preventDefault(); onNav('service-corporate-tax'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Corporate Tax →</a>
            <a href={pathForPage('service-transaction-advisory')} onClick={(e) => { e.preventDefault(); onNav('service-transaction-advisory'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Transaction advisory →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Config-driven detail page for the specialist services (same template, no illustration).
const SIMPLE_SERVICES = {
  'service-fixed-asset-tagging': {
    cat: 'Compliance', crumb: 'Fixed Asset Tagging', eyebrow: 'Compliance · Fixed assets',
    h1a: 'Fixed asset tagging.', h1b: 'A register you can trust.', cta: 'Request asset tagging', intent: 'Fixed asset tagging',
    intro: 'Physical verification and durable tagging of your assets, register reconstruction, and a depreciation and impairment review — so your fixed-asset register matches reality and stands up at audit.',
    faqKey: 'FIXED_ASSET_FAQ',
    glance: [['Scope', 'Verification & tagging'], ['Method', 'Physical count & tag'], ['Output', 'Reconciled FA register'], ['Covers', 'Depreciation & impairment'], ['Ready for', 'Audit'], ['Engagement', 'Project'], ['Pricing', 'Customised to your scope']],
    covers: [['scan-line', 'Physical verification', 'A floor-to-register count of every asset, with condition and location captured.'], ['tag', 'Tagging & barcoding', 'Durable asset tags or barcodes applied so each asset is uniquely identifiable.'], ['file-spreadsheet', 'Register reconstruction', 'A complete fixed-asset register rebuilt and tied to the general ledger.'], ['trending-down', 'Depreciation & impairment', 'Useful lives and depreciation policy reviewed, with impairment indicators flagged.']],
    process: [['01', 'Plan', 'Agree scope, locations and the asset categories to cover.'], ['02', 'Count & tag', 'Physically verify and tag every asset on site.'], ['03', 'Reconcile', 'Match the count to the register and resolve differences.'], ['04', 'Policy review', 'Review depreciation policy and flag impairment indicators.'], ['05', 'Report', 'Deliver the reconciled register and supporting schedules.']],
    related: [['service-audit-support', 'Audit support'], ['service-financial-statements', 'Financial statements'], ['service-bookkeeping', 'Bookkeeping']],
  },
  'service-forensic-accounting': {
    cat: 'Advisory', crumb: 'Forensic Accounting', eyebrow: 'Advisory · Forensic & dispute',
    h1a: 'Forensic accounting.', h1b: 'Evidence that stands up.', cta: 'Discuss an investigation', intent: 'Forensic accounting',
    intro: 'Fraud investigation, dispute and litigation support, expert testimony and evidence reconstruction — independent, discreet, and to a standard that holds up in negotiation and in court.',
    faqKey: 'FORENSIC_FAQ',
    glance: [['Focus', 'Fraud & disputes'], ['Acts as', 'Independent expert'], ['Deliverable', 'Findings & expert report'], ['Supports', 'Litigation & arbitration'], ['Handling', 'Strictly confidential'], ['Engagement', 'Project'], ['Pricing', 'Customised to your scope']],
    covers: [['search', 'Fraud investigation', 'Tracing misappropriation and misstatement through the records to the source.'], ['gavel', 'Dispute & litigation support', 'Quantifying loss and supporting shareholder, contractual and matrimonial disputes.'], ['user-check', 'Expert testimony', 'Independent expert reports and testimony for proceedings.'], ['folder-search', 'Evidence reconstruction', 'Rebuilding the transaction trail where records are incomplete or contested.']],
    process: [['01', 'Scope', 'Define the question, the period and the evidence perimeter.'], ['02', 'Secure data', 'Gather and preserve records and the digital evidence trail.'], ['03', 'Investigate', 'Analyse transactions, trace flows and quantify the impact.'], ['04', 'Report', 'An independent findings or expert report with the evidence.'], ['05', 'Support', 'Support negotiation, mediation or proceedings as needed.']],
    related: [['service-audit-support', 'Audit support'], ['service-internal-controls', 'Internal controls'], ['service-transaction-advisory', 'Transaction advisory']],
  },
  'service-internal-controls': {
    cat: 'Advisory', crumb: 'Internal Controls', eyebrow: 'Advisory · Risk & control',
    h1a: 'Internal controls.', h1b: 'Designed, tested, trusted.', cta: 'Strengthen your controls', intent: 'Internal controls',
    intro: 'Design, walkthroughs and remediation of the controls that keep your numbers reliable and your assets safe — for growing businesses, regulated entities and pre-IPO issuers.',
    faqKey: 'CONTROLS_FAQ',
    glance: [['Scope', 'Design · test · remediate'], ['Deliverable', 'Risk & control matrix'], ['For', 'SMEs, regulated, pre-IPO'], ['Testing', 'Walkthroughs & samples'], ['Output', 'Remediation plan'], ['Engagement', 'Project or retained'], ['Pricing', 'Customised to your scope']],
    covers: [['grid-3x3', 'Risk & control matrix', 'Mapping key risks to the controls that mitigate them, by process.'], ['footprints', 'Walkthrough testing', 'Walking each key control end to end and testing it on samples.'], ['wrench', 'Remediation', 'A prioritised plan to close gaps, with owners and timelines.'], ['badge-check', 'Management attestation', 'Support for management sign-off and the evidence behind it.']],
    process: [['01', 'Scope', 'Identify the in-scope processes and key risks.'], ['02', 'Document', 'Build the risk-and-control matrix and process walkthroughs.'], ['03', 'Test', 'Test design and operating effectiveness on samples.'], ['04', 'Remediate', 'Agree and track a remediation plan for the gaps.'], ['05', 'Attest', 'Support management attestation and ongoing monitoring.']],
    related: [['service-audit-support', 'Audit support'], ['service-cfo', 'CFO services'], ['service-forensic-accounting', 'Forensic accounting']],
  },
  'service-financial-modelling': {
    cat: 'Advisory', crumb: 'Financial Modelling', eyebrow: 'Advisory · Modelling',
    h1a: 'Financial modelling.', h1b: 'Auditable by design.', cta: 'Request a model', intent: 'Financial modeling',
    intro: 'Operating, transaction and board-pack models built to a transparent, FAST-style standard — clear inputs, switchable scenarios and sensitivity analysis, so decisions rest on numbers you can trust.',
    faqKey: 'MODELLING_FAQ',
    glance: [['Models', 'Operating · transaction · board'], ['Standard', 'FAST-style, auditable'], ['Includes', 'Scenarios & sensitivities'], ['Deliverable', 'Model & assumptions'], ['Also', 'Review & repair'], ['Engagement', 'Project'], ['Pricing', 'Customised to your scope']],
    covers: [['line-chart', 'Operating models', 'Three-statement operating models linking P&L, balance sheet and cash flow.'], ['git-merge', 'Transaction & LBO', 'Acquisition, LBO and investment models with returns analysis.'], ['refresh-cw', 'Refinancing models', 'Debt, covenant and refinancing scenarios.'], ['sliders-horizontal', 'Board scenarios', 'Switchable scenarios and sensitivity tables for the Board.']],
    process: [['01', 'Scope', 'Agree the decision the model must support and its structure.'], ['02', 'Build', 'Build the model — clear inputs, logical flow, no hard-coding.'], ['03', 'Scenarios', 'Add scenarios and sensitivities on the key drivers.'], ['04', 'Stress-test', 'Check the logic and stress the assumptions.'], ['05', 'Hand over', 'Deliver the model with an assumptions log and a walkthrough.']],
    related: [['service-valuations', 'Valuations'], ['service-feasibility-studies', 'Feasibility studies'], ['service-transaction-advisory', 'Transaction advisory']],
  },
  'service-feasibility-studies': {
    cat: 'Advisory', crumb: 'Feasibility Studies', eyebrow: 'Advisory · Feasibility',
    h1a: 'Feasibility studies.', h1b: 'Invest on evidence.', cta: 'Request a feasibility study', intent: 'Feasibility studies',
    intro: 'Project-level feasibility — a financial model, market and cost assumptions, sensitivity and scenario analysis, and a clear go / no-go recommendation before you commit capital.',
    faqKey: 'FEASIBILITY_FAQ',
    glance: [['Scope', 'Project feasibility'], ['Metrics', 'NPV · IRR · payback'], ['Includes', 'Sensitivity & scenarios'], ['Deliverable', 'Study & recommendation'], ['Supports', 'Funding applications'], ['Engagement', 'Project'], ['Pricing', 'Customised to your scope']],
    covers: [['calculator', 'Financial modelling', 'A project model with revenue, cost and funding assumptions.'], ['sliders-horizontal', 'Sensitivity analysis', 'How the returns move as the key assumptions change.'], ['layers', 'Scenario testing', 'Base, upside and downside cases for the project.'], ['clipboard-check', 'Pre-investment memo', 'A clear recommendation: go, no-go or proceed-with-conditions.']],
    process: [['01', 'Scope', 'Define the project, the questions and the success metrics.'], ['02', 'Assumptions', 'Build market, cost and funding assumptions with you.'], ['03', 'Model', 'Model the returns — NPV, IRR and payback.'], ['04', 'Test', 'Run sensitivities and scenarios on the drivers.'], ['05', 'Recommend', 'Deliver the study with a reasoned recommendation.']],
    related: [['service-financial-modelling', 'Financial modelling'], ['service-valuations', 'Valuations'], ['service-cfo', 'CFO services']],
  },
  'service-strategic-advisory': {
    cat: 'Advisory', crumb: 'Strategic Advisory', eyebrow: 'Advisory · Board-level',
    h1a: 'Strategic advisory.', h1b: 'Board-grade positions.', cta: 'Talk to an advisor', intent: 'Strategic advisory',
    intro: 'Board-level support on the questions that do not fit a standard engagement — accounting policy, complex transactions, restructuring — set out as a documented, defensible position.',
    faqKey: 'STRATEGIC_FAQ',
    glance: [['Focus', 'Policy · transactions · restructuring'], ['Level', 'Board-grade'], ['Deliverable', 'Documented positions'], ['Basis', 'IFRS & UAE tax'], ['Cadence', 'Periodic check-ins'], ['Engagement', 'Advisory'], ['Pricing', 'Customised to your scope']],
    covers: [['book-open', 'Accounting policy', 'Selecting and documenting the right accounting policies and elections.'], ['git-merge', 'Complex transactions', 'Working through the accounting, tax and reporting of one-off deals.'], ['shuffle', 'Restructuring', 'Group and capital restructuring, with the implications mapped.'], ['file-text', 'Board memos', 'Documented positions and recommendations for the Board.']],
    process: [['01', 'Frame', 'Define the question and what the Board needs to decide.'], ['02', 'Analyse', 'Work through the accounting, tax and reporting implications.'], ['03', 'Options', 'Set out the options and the trade-offs.'], ['04', 'Position', 'Recommend a defensible position with its basis.'], ['05', 'Document', 'Deliver a Board-ready memo.']],
    related: [['service-cfo', 'CFO services'], ['service-transaction-advisory', 'Transaction advisory'], ['service-corporate-tax', 'Corporate Tax']],
  },
};

function ServiceSimplePage({ page, onNav }) {
  const cfg = SIMPLE_SERVICES[page];
  if (!cfg) return null;
  const faq = (window.AARoutes && window.AARoutes[cfg.faqKey]) || [];
  return (
    <div>
      {/* Crumbtrail + hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('services')} onClick={(e) => { e.preventDefault(); onNav('services'); }} style={{ color: 'var(--aa-steel-700)' }}>Services</a>
            <span>/</span><span>{cfg.cat}</span><span>/</span>
            <span style={{ color: 'var(--aa-charcoal)' }}>{cfg.crumb}</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>{cfg.eyebrow}</div>
              <h1 style={{ fontFamily: 'var(--aa-font-display)', fontWeight: 700, fontSize: 'clamp(44px, 6vw, 72px)', textTransform: 'uppercase', letterSpacing: '0.01em', margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0 }}>
                {cfg.h1a}<br />{cfg.h1b}
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>{cfg.intro}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => goContact(cfg.intent, onNav)}>{cfg.cta}<i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i></button>
                <a className="btn btn--ghost" href="https://wa.me/971565484635" target="_blank" rel="noopener"><i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>WhatsApp us</a>
              </div>
            </div>
            <aside style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24 }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>At a glance</div>
              <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                {cfg.glance.map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--aa-rule)' }}>
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
          <div className="section-head"><div className="section-head__eyebrow">What the engagement covers</div><h2>{cfg.crumb}, end to end.</h2></div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {cfg.covers.map(([ic, t, d], i) => (
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
          <div className="section-head"><div className="section-head__eyebrow">The engagement, end to end</div><h2>How we run it.</h2></div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {cfg.process.map((s, i) => (
              <div key={i} style={{ padding: 24, borderRight: i < 4 ? '1px solid var(--aa-rule)' : 'none' }}>
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
          <div className="section-head"><div className="section-head__eyebrow">FAQ</div><h2>{cfg.crumb}, answered.</h2></div>
          <FAQList items={faq} />
          <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span className="eyebrow eyebrow--steel">Related</span>
            {cfg.related.map(([pg, label]) => (
              <a key={pg} href={pathForPage(pg)} onClick={(e) => { e.preventDefault(); onNav(pg); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>{label} →</a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQList({ items, asOf }) {
  const [open, setOpen] = useStateSvc(0);
  const uid = React.useId();
  return (
    <div>
    {asOf &&
      <p style={{ fontSize: 13, color: 'var(--aa-steel)', margin: '0 0 18px', fontStyle: 'italic' }}>
        Tax rules current as at {(window.AARoutes && window.AARoutes.TAX_RULES_ASOF) || ''} — general guidance only; confirm against the latest UAE FTA / Ministry of Finance sources.
      </p>
    }
    <div style={{ borderTop: '2px solid var(--aa-charcoal)' }}>
      {items.map((it, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--aa-rule)' }}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            aria-controls={uid + '-faq-' + i}
            style={{
              width: '100%', textAlign: 'left',
              padding: '24px 0', background: 'transparent', border: 0, cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24,
              fontFamily: 'var(--aa-font-sans)',
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{it.q}</span>
            <i data-lucide={open === i ? 'minus' : 'plus'} style={{ width: 18, height: 18, color: 'var(--aa-cyan)', flexShrink: 0 }} aria-hidden="true"></i>
          </button>
          {open === i && (
            <div id={uid + '-faq-' + i} style={{ paddingBottom: 24, fontSize: 15, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 720 }}>
              {it.a}
            </div>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}

Object.assign(window, { ServicesPage, ServiceVATPage, ServiceCorporateTaxPage, ServiceBookkeepingPage, ServiceAuditSupportPage, ServiceValuationsPage, ServiceTransactionAdvisoryPage, ServiceCFOPage, ServiceFinancialStatementsPage, ServiceTaxPlanningPage, ServiceSimplePage, FAQList });
