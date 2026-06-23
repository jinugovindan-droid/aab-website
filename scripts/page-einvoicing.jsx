// UAE E-Invoicing client briefing page — adapted from the print flyer design.
// Institutional register: square corners, hairline rules, tabular dates.
const { pathForPage, pathForInsight } = window.AARoutes;

function EInvoicingPage({ onNav }) {
  const daysTo = (iso) => Math.ceil((new Date(iso + 'T00:00:00') - new Date()) / 86400000);
  const dlabel = (iso) => { const n = daysTo(iso); return n > 0 ? n.toLocaleString() + ' days left' : 'now due'; };

  // Pre-fill the contact wizard with E-Invoicing so it skips step 1 → lower friction.
  const bookReadiness = () => {
    try {
      sessionStorage.setItem('aa_intent_service', 'E-Invoicing support');
      sessionStorage.setItem('aa_scroll_target', 'aa-contact-wizard');
    } catch (e) {}
    onNav('contact');
  };

  // ----- Readiness assessment -----
  const FAQ = (window.AARoutes && window.AARoutes.EINVOICE_FAQ) || [];
  const [f, setF] = React.useState({ company: '', name: '', email: '', phone: '', revenue: '', isGov: false, b2b: '', team: '', impl: '', asp: '', erp: '' });
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const upd = (k) => (e) => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setF((p) => ({ ...p, [k]: v })); };
  const inS = { width: '100%', padding: '10px 12px', fontSize: 15, border: '1px solid var(--aa-rule-strong)', boxSizing: 'border-box', background: '#fff', fontFamily: 'var(--aa-font-sans)' };
  const laS = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--aa-charcoal)', marginBottom: 6 };
  const lbl = { yes: 'Yes', no: 'No', unsure: 'Not sure', appointed: 'Appointed', evaluating: 'Evaluating' };
  const b2bLbl = { b2bg: 'B2B and/or B2G', mix: 'Business & consumers', b2c: 'Only B2C (consumers)' };
  // B2B/B2G transactions are in scope of the mandate; B2C-only is currently optional.
  const inScope = f.b2b !== 'b2c';

  const tierOf = (revenue, isGov) => {
    const n = parseFloat(String(revenue).replace(/[^0-9.]/g, ''));
    if (isGov) return { who: 'Government entity · Phase 3', asp: '31 Mar 2027', aspISO: '2027-03-31', live: '1 Oct 2027', liveISO: '2027-10-01' };
    if (!isNaN(n) && n > 0) return n >= 50000000
      ? { who: 'Large business (AED 50M+) · Phase 1', asp: '30 Oct 2026', aspISO: '2026-10-30', live: '1 Jan 2027', liveISO: '2027-01-01' }
      : { who: 'Business under AED 50M · Phase 2', asp: '31 Mar 2027', aspISO: '2027-03-31', live: '1 Jul 2027', liveISO: '2027-07-01' };
    return null;
  };
  const TIER = tierOf(f.revenue, f.isGov);

  const loadJsPDF = () => new Promise((res, rej) => {
    if (window.jspdf && window.jspdf.jsPDF) return res();
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js';
    s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });
  const logoDataUrl = (src) => new Promise((res) => {
    const img = new Image(); img.crossOrigin = 'anonymous';
    img.onload = () => { try { const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; c.getContext('2d').drawImage(img, 0, 0); res({ url: c.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight }); } catch (e) { res(null); } };
    img.onerror = () => res(null); img.src = src;
  });
  const verdict = () => {
    if (!inScope) return { title: 'Likely outside the current mandatory scope', body: 'Based on your answer, you issue only business-to-consumer (B2C) invoices. B2C invoicing is currently optional under the UAE e-invoicing mandate — the obligation applies to business-to-business (B2B) and business-to-government (B2G) transactions. We recommend you confirm your transaction mix carefully (a single B2B or B2G invoice brings you into scope) and prepare early if that is likely.' };
    const noAsp = f.asp !== 'appointed';
    const needHelp = f.impl === 'no' || f.impl === 'unsure' || f.team === 'no';
    if (noAsp && needHelp) return { title: 'Action needed — start now', body: 'You issue B2B/B2G invoices and are in scope, you have not yet appointed an Accredited Service Provider, and you indicated you may need support to implement. With your go-live approaching, we recommend a guided readiness engagement: scope assessment, ASP selection, ERP field-mapping and end-to-end testing before go-live.' };
    if (noAsp) return { title: 'On track — ASP is the next step', body: 'You are in scope and have in-house capacity, but appointing an Accredited Service Provider is the critical next step. We can shortlist ASPs suited to your transaction profile and validate readiness ahead of go-live.' };
    return { title: 'Well positioned — validate before go-live', body: 'You are in scope, have appointed an ASP and have in-house capability. We recommend an independent readiness health-check: confirm invoice fields, exception handling and your go-live cutover plan against the latest FTA guidance.' };
  };

  const generatePdf = async () => {
    await loadJsPDF();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const M = 48; const colW = W - 2 * M;
    const cyan = [41, 171, 226], charcoal = [26, 26, 46], steel = [110, 120, 135], ink = [55, 58, 70], offbg = [244, 245, 247];
    const PH = doc.internal.pageSize.getHeight();
    const setC = (rgb) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    let y = 54;
    // Auto page-breaking flow helpers
    const ensure = (need) => { if (y + need > PH - 70) { doc.addPage(); y = 60; } };
    const heading = (t) => { ensure(44); setC(charcoal); doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text(t, M, y); y += 9; doc.setDrawColor(cyan[0], cyan[1], cyan[2]); doc.setLineWidth(1.4); doc.line(M, y, M + 40, y); y += 16; };
    const para = (t, o) => { o = o || {}; doc.setFont('helvetica', o.bold ? 'bold' : 'normal'); doc.setFontSize(o.size || 10.5); setC(o.color || ink); doc.splitTextToSize(t, colW).forEach((ln) => { ensure(15); doc.text(ln, M, y); y += 15; }); y += (o.gap == null ? 8 : o.gap); };
    const bullet = (t) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); const lines = doc.splitTextToSize(t, colW - 16); ensure(lines.length * 14 + 2); setC(cyan); doc.text('•', M, y); setC(ink); lines.forEach((ln) => { doc.text(ln, M + 16, y); y += 14; }); y += 4; };
    try { const lg = await logoDataUrl('assets/logos/aab-short-eng.png?v=2'); if (lg) doc.addImage(lg.url, 'PNG', M, y - 6, 104, 104 * lg.h / lg.w); } catch (e) {}
    doc.setTextColor.apply(doc, steel); doc.setFontSize(8.5);
    doc.text('Authentic Accounting & Bookkeeping L.L.C · Dubai, UAE', W - M, y + 2, { align: 'right' });
    doc.text('www.aaccounting.me', W - M, y + 14, { align: 'right' });
    y += 84;
    doc.setTextColor.apply(doc, charcoal); doc.setFont('helvetica', 'bold'); doc.setFontSize(21);
    doc.text('UAE E-Invoicing Readiness Report', M, y); y += 22;
    const reportDate = (() => { try { return new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Dubai', day: '2-digit', month: 'long', year: 'numeric' }); } catch (e) { return new Date().toDateString(); } })();
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor.apply(doc, steel);
    doc.text('Prepared for ' + f.company + '  ·  ' + f.name, M, y); y += 15;
    doc.setFontSize(9.5);
    doc.text('Report date: ' + reportDate, M, y); y += 24;

    doc.setFillColor.apply(doc, charcoal); doc.rect(M, y, colW, 92, 'F');
    doc.setTextColor.apply(doc, cyan); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text(TIER.who.toUpperCase(), M + 16, y + 22);
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text('APPOINT YOUR ASP BY', M + 16, y + 46); doc.text('GO LIVE BY', M + colW / 2 + 16, y + 46);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
    doc.text(TIER.asp, M + 16, y + 68); doc.text(TIER.live, M + colW / 2 + 16, y + 68);
    doc.setTextColor.apply(doc, cyan); doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(dlabel(TIER.aspISO), M + 16, y + 82); doc.text(dlabel(TIER.liveISO), M + colW / 2 + 16, y + 82);
    y += 116;

    const v = verdict();
    ensure(60); setC(charcoal); doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
    doc.text(v.title, M, y); y += 17;
    para(v.body, { gap: 12 });

    heading('Your inputs');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    [['Annual revenue', f.isGov ? 'Government entity' : (f.revenue ? 'AED ' + f.revenue : '—')],
     ['Phase / tier', TIER.who],
     ['B2B / B2G invoices', b2bLbl[f.b2b] || '—'],
     ['In-house accounting team', lbl[f.team] || '—'],
     ['Can implement in-house', lbl[f.impl] || '—'],
     ['ASP status', lbl[f.asp] || '—'],
     ['ERP / accounting system', f.erp || '—']].forEach(([k, val]) => { ensure(15); setC(steel); doc.text(k + ':', M, y); setC(ink); doc.text(String(val), M + 184, y); y += 15; });

    // ===== PAGE 2 — understanding e-invoicing =====
    doc.addPage(); y = 60;
    heading('Understanding UAE e-invoicing');
    para('Under the UAE mandate, e-invoicing does not mean emailing a PDF. An e-invoice is a structured electronic file, exchanged machine-to-machine through accredited providers, that your accounting system and your counterparty’s system can both read and validate automatically. From your phase’s go-live date, PDF and paper invoices will no longer be valid for the covered transactions.');
    heading('What is changing');
    bullet('From documents to data: invoices are issued as structured data built to a defined standard — not as PDFs, scans or paper.');
    bullet('Issued through an ASP: every in-scope business must appoint an Accredited Service Provider to transmit its invoices.');
    bullet('Reported to the FTA: the Federal Tax Authority receives the invoice data as part of the exchange.');
    bullet('Scope: B2B and B2G are mandatory, B2C is currently optional, and free zone companies are included.');
    heading('The 5-corner (OpenPeppol) model');
    para('The UAE has adopted the international OpenPeppol framework in a 5-corner configuration. In plain terms: you (corner 1) send the invoice to your ASP (corner 2); your ASP transmits it over the Peppol network to your customer’s ASP (corner 3), who delivers it to your customer (corner 4); and the Federal Tax Authority (corner 5) receives the reporting data. The invoice never travels as an email attachment — it moves as validated data between accredited providers.');
    heading('What is in scope');
    para('The mandate covers business-to-business (B2B) and business-to-government (B2G) transactions, across the UAE including free zones, based on annual-revenue thresholds. Business-to-consumer (B2C) invoicing is currently optional. A single B2B or B2G invoice is enough to bring a business into scope, so confirm your transaction mix carefully.');

    // ===== PAGE 3 — the phased timeline =====
    doc.addPage(); y = 60;
    heading('The phased timeline');
    para('The rollout is phased by annual revenue. For every business, two dates matter: the deadline to appoint an Accredited Service Provider, and the go-live date from which structured e-invoicing becomes mandatory.', { gap: 12 });
    const tblRows = [
      ['Phase 1 — Revenue >= AED 50M', '30 Oct 2026', '1 Jan 2027'],
      ['Phase 2 — Revenue < AED 50M', '31 Mar 2027', '1 Jul 2027'],
      ['Phase 3 — Government entities', '31 Mar 2027', '1 Oct 2027'],
    ];
    const clientIdx = f.isGov ? 2 : (TIER.who.indexOf('50M+') >= 0 ? 0 : 1);
    const ca = M + 10, cb = M + colW * 0.54, cc = M + colW * 0.78, rh = 30;
    doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]); doc.rect(M, y, colW, 24, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.text('PHASE / WHO', ca, y + 16); doc.text('APPOINT ASP BY', cb, y + 16); doc.text('GO LIVE BY', cc, y + 16);
    y += 24;
    tblRows.forEach((r, i) => {
      if (i === clientIdx) { doc.setFillColor(225, 244, 251); doc.rect(M, y, colW, rh, 'F'); }
      doc.setDrawColor(225, 228, 232); doc.setLineWidth(0.5); doc.line(M, y + rh, M + colW, y + rh);
      setC(charcoal); doc.setFont('helvetica', i === clientIdx ? 'bold' : 'normal'); doc.setFontSize(10);
      doc.text(r[0], ca, y + 19);
      doc.setFont('helvetica', 'normal'); setC(ink);
      doc.text(r[1], cb, y + 19); doc.text(r[2], cc, y + 19);
      y += rh;
    });
    y += 18;
    para('Your row is highlighted. The appoint-ASP date is the deadline to appoint your Accredited Service Provider; the go-live date is when only structured invoices transmitted through an accredited ASP will be valid — PDF and paper will not.', { gap: 12 });
    heading('Where you fall');
    para('Based on your inputs, you are in ' + TIER.who + '. You must appoint an ASP by ' + TIER.asp + ' (' + dlabel(TIER.aspISO) + ') and go live by ' + TIER.live + ' (' + dlabel(TIER.liveISO) + '). The appointment deadline is the one that bites: selecting, contracting, integrating and testing an ASP takes time, so treat it as the start of the work, not the finish line.');

    // ===== PAGE 4 — roadmap + CTA =====
    doc.addPage(); y = 60;
    heading('Your roadmap to readiness');
    bullet('Confirm your in-scope transactions — B2B and B2G are mandatory; B2C is currently optional.');
    bullet(f.asp === 'appointed' ? 'Validate your appointed ASP set-up, connectivity and accreditation.' : 'Select and appoint an Accredited Service Provider accredited by the Ministry of Finance.');
    bullet('Clean your master data: TRNs, legal names, addresses and standardised item / tax codes — for your business and your customers.');
    bullet('Map your ' + (f.erp ? f.erp : 'ERP / accounting') + ' fields to the required structured e-invoice format.');
    bullet('Design for the awkward cases: credit notes, discounts, multi-currency, partial deliveries and advance payments.');
    bullet('Run end-to-end testing — system to ASP, transmitted and acknowledged — well before your go-live date.');
    y += 4;
    heading('How Authentic Accounting helps');
    para('We support clients end-to-end: scope assessment and impact analysis, ASP selection, ERP and accounting-system field mapping, and end-to-end compliance and go-live support — tailored to your transaction profile and your phase.', { gap: 14 });
    ensure(96);
    doc.setFillColor(offbg[0], offbg[1], offbg[2]); doc.rect(M, y, colW, 80, 'F');
    setC(charcoal); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
    doc.text('Get ahead of your deadline — talk to us', M + 16, y + 24);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); setC(ink);
    doc.text('Phone / WhatsApp: +971 4 396 0399  ·  +971 56 548 4635', M + 16, y + 44);
    doc.text('info@aaccounting.me   ·   www.aaccounting.me/e-invoicing', M + 16, y + 60); y += 96;
    ensure(40); setC(steel); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    doc.splitTextToSize('Legal basis: Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance). This report is general guidance, not advice — confirm dates, scope and the latest requirements against the official UAE Ministry of Finance / Federal Tax Authority sources. Day-counts are calculated as at the report date shown above.', colW).forEach((ln) => { ensure(11); doc.text(ln, M, y); y += 11; });

    // ---- page footers (page numbers + firm) ----
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(225, 228, 232); doc.setLineWidth(0.5); doc.line(M, PH - 40, W - M, PH - 40);
      setC(steel); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
      doc.text('Authentic Accounting & Bookkeeping L.L.C', M, PH - 28);
      doc.text('Page ' + p + ' of ' + totalPages, W - M, PH - 28, { align: 'right' });
    }

    doc.save('UAE-E-Invoicing-Readiness-' + (f.company || 'Report').replace(/[^A-Za-z0-9]+/g, '-') + '.pdf');
  };

  const handleGenerate = async () => {
    setErr('');
    if (!f.company.trim() || !f.name.trim() || !f.email.trim() || !f.phone.trim()) { setErr('Please complete company name, your name, email and phone.'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) { setErr('Please enter a valid work email.'); return; }
    if (!TIER) { setErr('Please enter your annual revenue (or tick “government entity”) so we can calculate your deadline.'); return; }
    if (!f.b2b) { setErr('Please tell us whether you issue B2B / B2G invoices — it decides whether the mandate applies to you.'); return; }
    setBusy(true);
    try {
      let downloadDate = '';
      try { downloadDate = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' (GST)'; } catch (e) { downloadDate = new Date().toISOString(); }
      const summary = ['Company: ' + f.company, 'Name: ' + f.name, 'Email: ' + f.email, 'Phone: ' + f.phone, 'Revenue: ' + (f.isGov ? 'Government entity' : f.revenue), 'Tier: ' + TIER.who, 'B2B/B2G scope: ' + (b2bLbl[f.b2b] || '—'), 'In-house team: ' + (lbl[f.team] || '—'), 'Can implement in-house: ' + (lbl[f.impl] || '—'), 'ASP status: ' + (lbl[f.asp] || '—'), 'ERP: ' + (f.erp || '—'), 'Downloaded: ' + downloadDate].join('\n');
      if (window.AAContactSheet && window.AAContactSheet.submitRaw) {
        window.AAContactSheet.submitRaw({ type: 'E-Invoicing Readiness Assessment', company: f.company, name: f.name, email: f.email, phone: f.phone, revenue: f.isGov ? 'Government' : f.revenue, tier: TIER.who, b2bScope: b2bLbl[f.b2b] || '', inHouseTeam: lbl[f.team] || '', canImplement: lbl[f.impl] || '', aspStatus: lbl[f.asp] || '', erp: f.erp, downloadDate, summary });
      }
      if (window.gtag) window.gtag('event', 'generate_lead', { event_category: 'e-invoicing', event_label: TIER.who });
    } catch (e) {}
    try { await generatePdf(); } catch (e) { setErr('Sorry — the report could not be generated. Please try again or contact us.'); setBusy(false); return; }
    setBusy(false); setDone(true);
  };

  const phases = [
    {
      label: 'Phase 1 — Large Business',
      qual: 'Annual revenue ≥ AED 50,000,000',
      asp: '30 Oct 2026', aspISO: '2026-10-30',
      ready: '1 Jan 2027', readyISO: '2027-01-01',
      key: true,
    },
    {
      label: 'Phase 2 — Small / Medium Business',
      qual: 'Annual revenue < AED 50,000,000',
      asp: '31 Mar 2027', aspISO: '2027-03-31',
      ready: '1 Jul 2027', readyISO: '2027-07-01',
      key: false,
    },
    {
      label: 'Phase 3 — All Government Entities',
      qual: 'In scope',
      asp: '31 Mar 2027', aspISO: '2027-03-31',
      ready: '1 Oct 2027', readyISO: '2027-10-01',
      key: false,
    },
  ];

  const concepts = [
    ['OpenPeppol standard', 'Invoices are exchanged as structured data on the international OpenPeppol framework — not as PDFs or scans.', 'network'],
    ['5-corner model', 'Every invoice routes through accredited service providers and the Federal Tax Authority before it reaches your counterparty.', 'route'],
    ['B2B and B2G scope', 'Mandatory for business-to-business and business-to-government transactions. Business-to-consumer (B2C) is currently optional / out of scope.', 'building-2'],
    ['Accredited Service Provider', 'Each entity must appoint an ASP to transmit compliant invoices. PDF and paper invoices will no longer be valid.', 'badge-check'],
  ];

  const scope = [
    'Scope assessment & impact analysis',
    'Accredited Service Provider (ASP) selection',
    'ERP & accounting-system field mapping',
    'End-to-end compliance & go-live support',
  ];

  return (
    <div>
      {/* ============== HERO ============== */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32, flexWrap: 'wrap' }}>
            <a href={pathForPage('services')} onClick={(e) => { e.preventDefault(); onNav('services'); }} style={{ color: 'var(--aa-steel-700)' }}>Services</a>
            <span>/</span>
            <span>Compliance</span>
            <span>/</span>
            <span style={{ color: 'var(--aa-charcoal)' }}>UAE E-Invoicing</span>
          </div>

          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Client briefing · UAE Ministry of Finance</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(40px, 5.6vw, 68px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.02, textWrap: 'balance',
              }}>
                UAE E-Invoicing is coming.<br />
                <span style={{ color: 'var(--aa-cyan)' }}>We have you covered.</span>
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-charcoal-800)', lineHeight: 1.6, maxWidth: 640 }}>
                The <strong style={{ color: 'var(--aa-charcoal)' }}>UAE Ministry of Finance</strong> is rolling out a
                mandatory structured e-invoicing system for all <strong style={{ color: 'var(--aa-charcoal)' }}>B2B</strong> and{' '}
                <strong style={{ color: 'var(--aa-charcoal)' }}>B2G</strong> transactions, built on the international{' '}
                <strong style={{ color: 'var(--aa-charcoal)' }}>OpenPeppol</strong> standard and a{' '}
                <strong style={{ color: 'var(--aa-charcoal)' }}>5-corner</strong> exchange model that routes every invoice
                through accredited service providers and the Federal Tax Authority, under Ministerial Decisions 243 and 244
                of 2025. Authentic Accounting guides each client through readiness and compliance — well ahead of the
                phased deadlines below.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={bookReadiness}>
                  Book a readiness consultation
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
                  ['Standard', 'OpenPeppol'],
                  ['Exchange model', '5-corner'],
                  ['Scope', 'B2B + B2G'],
                  ['Issued via', 'Accredited ASP only'],
                  ['First ASP deadline', '30 Oct 2026 · ' + dlabel('2026-10-30')],
                  ['Phase 1 go-live', '1 Jan 2027 · ' + dlabel('2027-01-01')],
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

      {/* ============== READINESS ASSESSMENT ============== */}
      <section id="aa-einv-assessment" className="section section--off" style={{ scrollMarginTop: 96 }}>
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">Free · Instant PDF guide with your deadlines</div>
            <h2>Get your e-invoicing readiness report.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            <div style={{ padding: 32, borderRight: '1px solid var(--aa-rule)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label style={laS}>Company name *</label><input style={inS} value={f.company} onChange={upd('company')} placeholder="Your company" /></div>
                <div><label style={laS}>Your name *</label><input style={inS} value={f.name} onChange={upd('name')} placeholder="Full name" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
                <div><label style={laS}>Work email *</label><input type="email" style={inS} value={f.email} onChange={upd('email')} placeholder="name@company.ae" /></div>
                <div><label style={laS}>Phone / WhatsApp *</label><input style={inS} value={f.phone} onChange={upd('phone')} placeholder="+971 …" /></div>
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={laS}>Approximate annual revenue (AED) *</label>
                <input style={{ ...inS, fontFamily: 'var(--aa-font-mono)' }} inputMode="numeric" value={f.revenue} onChange={upd('revenue')} placeholder="e.g. 75,000,000" disabled={f.isGov} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 14, color: 'var(--aa-charcoal)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={f.isGov} onChange={upd('isGov')} style={{ width: 16, height: 16 }} /> We are a government entity
                </label>
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={laS}>Do you issue B2B or B2G (business / government) invoices? *</label>
                <select style={inS} value={f.b2b} onChange={upd('b2b')}>
                  <option value="">Select…</option>
                  <option value="b2bg">Yes — B2B and/or B2G</option>
                  <option value="mix">A mix of business and consumers</option>
                  <option value="b2c">Only B2C (consumers)</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
                <div><label style={laS}>In-house accounting team?</label>
                  <select style={inS} value={f.team} onChange={upd('team')}><option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option></select></div>
                <div><label style={laS}>Can your team implement it in-house?</label>
                  <select style={inS} value={f.impl} onChange={upd('impl')}><option value="">Select…</option><option value="yes">Yes</option><option value="unsure">Not sure</option><option value="no">No — we’d want help</option></select></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
                <div><label style={laS}>ASP identified / appointed?</label>
                  <select style={inS} value={f.asp} onChange={upd('asp')}><option value="">Select…</option><option value="appointed">Appointed</option><option value="evaluating">Evaluating</option><option value="no">Not yet</option></select></div>
                <div><label style={laS}>ERP / accounting software</label>
                  <input style={inS} value={f.erp} onChange={upd('erp')} placeholder="e.g. Tally, Zoho, SAP" /></div>
              </div>
            </div>
            <div style={{ padding: 32, background: 'var(--aa-charcoal)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 320 }}>
              {done ? (
                <div>
                  <i data-lucide="check-circle-2" style={{ width: 34, height: 34, color: 'var(--aa-cyan)' }}></i>
                  <h3 style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', fontSize: 22, letterSpacing: '0.01em', margin: '14px 0 8px' }}>Report downloading</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.6 }}>Your personalised readiness report is downloading now. We’ve received your details and the team will be in touch — or reach us directly on WhatsApp.</p>
                  <button className="btn btn--primary btn--sm" style={{ marginTop: 16 }} onClick={bookReadiness}>Book a readiness call <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i></button>
                </div>
              ) : (
                <div>
                  {TIER ? (
                    <div style={{ marginBottom: 20 }}>
                      <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 10 }}>{TIER.who}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Appoint ASP by <strong style={{ color: '#fff' }}>{TIER.asp}</strong> <span style={{ color: 'var(--aa-cyan)' }}>({dlabel(TIER.aspISO)})</span></div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Go live by <strong style={{ color: '#fff' }}>{TIER.live}</strong> <span style={{ color: 'var(--aa-cyan)' }}>({dlabel(TIER.liveISO)})</span></div>
                    </div>
                  ) : (
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>Fill in your details and revenue to generate a personalised PDF report — your exact deadlines, a tailored verdict, and your next steps.</p>
                  )}
                  <button className="btn btn--primary" onClick={handleGenerate} disabled={busy}>
                    {busy ? 'Generating…' : 'Generate my report'}
                    <i data-lucide="download" style={{ width: 16, height: 16 }}></i>
                  </button>
                  {err ? <p style={{ color: '#ff9a9a', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>{err}</p> : null}
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 14, lineHeight: 1.5 }}>Instant PDF download. We use your details only to prepare your report and follow up.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============== WHAT'S CHANGING ============== */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">What is changing</div>
            <h2>Structured invoices, transmitted and cleared.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {concepts.map(([t, d, ic], i) => (
              <div key={t} style={{
                padding: 28,
                borderRight: i < concepts.length - 1 ? '1px solid var(--aa-rule)' : 'none',
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <i data-lucide={ic} style={{ width: 24, height: 24, color: 'var(--aa-cyan)' }}></i>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== IMPLEMENTATION TIMELINES ============== */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">Implementation timelines · Phased rollout</div>
            <h2>Know your deadline.</h2>
          </div>

          <table className="aa-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th scope="col">Phase · Business category</th>
                <th scope="col" className="aa-num" style={{ whiteSpace: 'nowrap' }}>ASP selection</th>
                <th scope="col" className="aa-num" style={{ whiteSpace: 'nowrap' }}>System readiness</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((p) => (
                <tr key={p.label} style={p.key ? { background: 'var(--aa-cyan-050)' } : undefined}>
                  <td>
                    <span style={{ display: 'block', fontWeight: 600, color: 'var(--aa-charcoal)' }}>{p.label}</span>
                    <span style={{ display: 'block', color: 'var(--aa-steel-700)', fontSize: 13, marginTop: 4 }}>{p.qual}</span>
                  </td>
                  <td className="aa-num" style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--aa-charcoal)' }}>
                    {p.asp}
                    <span style={{ display: 'block', fontWeight: 400, fontSize: 12, color: 'var(--aa-cyan-700)', marginTop: 2 }}>{dlabel(p.aspISO)}</span>
                  </td>
                  <td className="aa-num" style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--aa-charcoal)' }}>
                    {p.ready}
                    <span style={{ display: 'block', fontWeight: 400, fontSize: 12, color: 'var(--aa-cyan-700)', marginTop: 2 }}>{dlabel(p.readyISO)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ marginTop: 20, fontSize: 13, lineHeight: 1.55, color: 'var(--aa-steel)', maxWidth: 860 }}>
            <span style={{ color: 'var(--aa-cyan)', fontWeight: 600, marginRight: 4 }}>†</span>
            <strong style={{ color: 'var(--aa-charcoal)' }}>ASP selection</strong> — deadline for each business to appoint
            its Accredited Service Provider. <strong style={{ color: 'var(--aa-charcoal)' }}>System readiness</strong> —
            mandatory go-live; from this date, only structured invoices transmitted through an accredited ASP will be
            valid. PDF and paper invoices will not.
            <br /><br />
            <span style={{ color: 'var(--aa-steel-700)' }}>Legal basis: Ministerial Decisions 243 and 244 of 2025. This briefing is general guidance, not advice — confirm dates and scope against the latest UAE Ministry of Finance / FTA sources.</span>
          </p>
        </div>
      </section>

      {/* ============== OUR COMMITMENT ============== */}
      <section className="section section--off">
        <div className="container">
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 64, alignItems: 'start' }}>
            <div style={{ borderTop: '2px solid var(--aa-charcoal)', paddingTop: 24 }}>
              <h2 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(28px, 3.4vw, 40px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.05,
              }}>
                Our<br />commitment
              </h2>
              <div className="eyebrow eyebrow--steel" style={{ marginTop: 14 }}>To every client</div>
            </div>

            <div>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--aa-charcoal-800)' }}>
                Authentic Accounting supports clients end-to-end on the UAE e-invoicing transition.
                Our engagement covers:
              </p>
              <ul style={{
                listStyle: 'none', margin: '24px 0', padding: '20px 0',
                borderTop: '1px solid var(--aa-rule)', borderBottom: '1px solid var(--aa-rule)',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px',
              }}>
                {scope.map((s) => (
                  <li key={s} style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontSize: 15, color: 'var(--aa-charcoal)', lineHeight: 1.4 }}>
                    <span style={{ width: 6, height: 6, background: 'var(--aa-cyan)', flexShrink: 0, transform: 'translateY(-1px)' }}></span>
                    {s}
                  </li>
                ))}
              </ul>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--aa-charcoal-800)' }}>
                We will be reaching out to each client in due course with the specific further course of action tailored
                to their business. In the meantime, clients are welcome to contact us directly at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== GUIDES ============== */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">Learn more · Plain-English guides</div>
            <h2>Understand the mandate.</h2>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['uae-e-invoicing-explained', 'UAE e-invoicing explained', 'What structured e-invoicing is, the 5-corner model, and what is in scope.'],
              ['uae-e-invoicing-deadlines-phases', 'Deadlines and phases', 'Who must comply and by when — the full timeline, tier by tier.'],
              ['choosing-accredited-service-provider-asp', 'Choosing an ASP', 'What an Accredited Service Provider does, and the questions to ask before you sign.'],
              ['prepare-erp-for-uae-e-invoicing', 'Getting your ERP ready', 'The master-data hygiene, field mapping and testing behind a smooth go-live.'],
            ].map(([slug, title, desc], i) => (
              <a key={slug} href={pathForInsight(slug)} onClick={(e) => { e.preventDefault(); onNav('insight', slug); }}
                style={{
                  padding: 28, textDecoration: 'none', color: 'inherit',
                  borderRight: i % 2 === 0 ? '1px solid var(--aa-rule)' : 'none',
                  borderBottom: i < 2 ? '1px solid var(--aa-rule)' : 'none',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{desc}</div>
                <span style={{ marginTop: 4, fontSize: 13, fontWeight: 600, color: 'var(--aa-cyan-700)' }}>Read the guide →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="section-head">
            <div className="section-head__eyebrow">FAQ</div>
            <h2>UAE e-invoicing, answered.</h2>
          </div>
          <div style={{ borderTop: '1px solid var(--aa-rule)' }}>
            {FAQ.map((f, i) => (
              <details key={i} style={{ borderBottom: '1px solid var(--aa-rule)', padding: '18px 4px' }}>
                <summary style={{ cursor: 'pointer', fontSize: 17, fontWeight: 600, color: 'var(--aa-charcoal)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <span>{f.q}</span>
                  <span style={{ color: 'var(--aa-cyan)', flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ margin: '12px 0 0', fontSize: 15, lineHeight: 1.65, color: 'var(--aa-steel-700)' }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA BAND ============== */}
      <section className="section section--dark">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-head__eyebrow" style={{ justifyContent: 'center' }}>Get ahead of the mandate</div>
          <h2 style={{
            fontFamily: 'var(--aa-font-display)', fontWeight: 700,
            fontSize: 'clamp(30px, 4vw, 52px)',
            textTransform: 'uppercase', letterSpacing: '0.01em',
            margin: '0 auto', color: '#fff', lineHeight: 1.05, maxWidth: 720, textWrap: 'balance',
          }}>
            Let&rsquo;s map your readiness now.
          </h2>
          <p style={{ margin: '20px auto 0', maxWidth: 600, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)' }}>
            Whether you fall under Phase 1 in January 2027 or a later wave, the work starts with a scope assessment.
            We&rsquo;ll tell you exactly what your transition requires.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn--primary" onClick={bookReadiness}>
              Book a readiness consultation
              <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
            </button>
            <a className="btn btn--ghost-light" href="https://wa.me/971565484635" target="_blank" rel="noopener">
              <i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>
              +971 56 548 4635
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { EInvoicingPage });
