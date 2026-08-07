// UAE E-Invoicing client briefing page — adapted from the print flyer design.
// Institutional register: square corners, hairline rules, tabular dates.
const { pathForPage, pathForInsight } = window.AARoutes;

function EInvoicingPage({ onNav, formOnly, onClose }) {
  // "Today" anchored to the UAE so day-counts match the other deadline cards
  // for overseas visitors.
  const dubaiToday = () => {
    try { const [y, m, d] = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' }).split('-').map(Number); return new Date(y, m - 1, d); }
    catch (e) { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  };
  const daysTo = (iso) => Math.ceil((new Date(iso + 'T00:00:00') - dubaiToday()) / 86400000);
  const dlabel = (iso) => { const n = daysTo(iso); return n > 0 ? n.toLocaleString() + ' days left' : 'now due'; };

  // Inside the readiness modal, refresh Lucide icons as the form state changes
  // (the app's global icon pass keys off page navigation, not modal-local state).
  React.useEffect(() => { if (formOnly && window.lucide) window.lucide.createIcons(); });

  // Pre-fill the contact wizard with E-Invoicing so it skips step 1 → lower friction.
  const bookReadiness = () => {
    try {
      sessionStorage.setItem('aa_intent_service', 'E-Invoicing support');
      sessionStorage.setItem('aa_scroll_target', 'aa-contact-wizard');
    } catch (e) {}
    if (onClose) onClose();
    onNav('contact');
  };

  // ----- Readiness assessment -----
  const FAQ = (window.AARoutes && window.AARoutes.EINVOICE_FAQ) || [];
  const uid = React.useId();
  const [f, setF] = React.useState({ company: '', name: '', email: '', phone: '', revenue: '', isGov: false, b2b: '', team: '', impl: '', asp: '', erp: '', consent: false });
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [sentOk, setSentOk] = React.useState(true);
  const upd = (k) => (e) => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setF((p) => ({ ...p, [k]: v })); };
  const inS = { width: '100%', padding: '10px 12px', fontSize: 15, border: '1px solid var(--aa-rule-strong)', boxSizing: 'border-box', background: '#fff', fontFamily: 'var(--aa-font-sans)' };
  const laS = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--aa-charcoal)', marginBottom: 6 };
  const lbl = { yes: 'Yes', no: 'No', unsure: 'Not sure', appointed: 'Appointed', evaluating: 'Evaluating' };
  const b2bLbl = { b2bg: 'B2B and/or B2G', mix: 'Business & consumers', b2c: 'Only B2C (consumers)' };
  // B2B/B2G transactions are in scope of the mandate; B2C-only is currently optional.
  const inScope = f.b2b !== 'b2c';

  // Revenue is captured as a BAND, not an exact figure: the mandate only cares
  // which side of AED 50m you sit on, and asking a prospect to disclose their
  // precise turnover in a first-touch form is both intrusive and costs
  // completions. Numeric strings are still parsed so any older saved value works.
  const GOV  = { who: 'Government entity · Phase 3', asp: '31 Mar 2027', aspISO: '2027-03-31', live: '1 Oct 2027', liveISO: '2027-10-01' };
  const BIG  = { who: 'Large business (AED 50M+) · Phase 1', asp: '30 Oct 2026', aspISO: '2026-10-30', live: '1 Jan 2027', liveISO: '2027-01-01' };
  const SMALL= { who: 'Business under AED 50M · Phase 2', asp: '31 Mar 2027', aspISO: '2027-03-31', live: '1 Jul 2027', liveISO: '2027-07-01' };
  const tierOf = (revenue, isGov) => {
    if (isGov) return GOV;
    if (revenue === 'gte50') return BIG;
    if (revenue === 'lt50') return SMALL;
    // Legacy/typed numeric values still resolve, so nothing breaks if an older
    // saved value or a pasted figure reaches this function.
    const n = parseFloat(String(revenue).replace(/[^0-9.]/g, ''));
    if (!isNaN(n) && n > 0) return n >= 50000000 ? BIG : SMALL;
    return null;
  };

  const TIER = tierOf(f.revenue, f.isGov);
  const revenueLabel = f.isGov ? 'Government entity'
    : f.revenue === 'gte50' ? 'AED 50 million or more'
    : f.revenue === 'lt50' ? 'Less than AED 50 million'
    : (f.revenue ? 'AED ' + f.revenue : '—');

  const loadJsPDF = () => new Promise((res, rej) => {
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
  const logoDataUrl = (src) => new Promise((res) => {
    const img = new Image(); img.crossOrigin = 'anonymous';
    img.onload = () => { try { const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; c.getContext('2d').drawImage(img, 0, 0); res({ url: c.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight }); } catch (e) { res(null); } };
    img.onerror = () => res(null); img.src = src;
  });
  const verdict = () => {
    if (!inScope) return { title: 'B2C issuing is optional — but receiving still applies', body: 'Based on your answer, you issue only business-to-consumer (B2C) invoices, which are currently outside the mandatory issuing obligation. This does not take you out of the system: if you buy from UAE businesses, those purchases are B2B transactions, so ahead of your phase go-live you must have appointed an Accredited Service Provider and be able to receive and process the e-invoices your suppliers send you. A single B2B or B2G sales invoice would also bring your own issuing into scope. Plan to be ready on your phase timeline below.' };
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
    const cyan = [0, 176, 240], charcoal = [26, 26, 46], steel = [110, 120, 135], ink = [55, 58, 70], offbg = [244, 245, 247];
    const PH = doc.internal.pageSize.getHeight();
    const setC = (rgb) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    let y = 54;
    // Auto page-breaking flow helpers
    const ensure = (need) => { if (y + need > PH - 70) { doc.addPage(); y = 60; } };
    const heading = (t) => { ensure(44); setC(charcoal); doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text(t, M, y); y += 9; doc.setDrawColor(cyan[0], cyan[1], cyan[2]); doc.setLineWidth(1.4); doc.line(M, y, M + 40, y); y += 16; };
    const para = (t, o) => { o = o || {}; doc.setFont('helvetica', o.bold ? 'bold' : 'normal'); doc.setFontSize(o.size || 10.5); setC(o.color || ink); doc.splitTextToSize(t, colW).forEach((ln) => { ensure(15); doc.text(ln, M, y); y += 15; }); y += (o.gap == null ? 8 : o.gap); };
    const bullet = (t) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); const lines = doc.splitTextToSize(t, colW - 16); ensure(lines.length * 14 + 2); setC(cyan); doc.text('•', M, y); setC(ink); lines.forEach((ln) => { doc.text(ln, M + 16, y); y += 14; }); y += 4; };
    try { const lg = await logoDataUrl('assets/logos/aab-short-eng-classic.png'); if (lg) doc.addImage(lg.url, 'PNG', M, y - 6, 104, 104 * lg.h / lg.w); } catch (e) {}
    doc.setTextColor.apply(doc, steel); doc.setFontSize(8.5);
    doc.text('Authentic Accounting & Bookkeeping L.L.C · Dubai, UAE', W - M, y + 2, { align: 'right' });
    doc.text('www.aaccounting.me', W - M, y + 14, { align: 'right' });
    y += 84;
    doc.setTextColor.apply(doc, charcoal); doc.setFont('helvetica', 'bold'); doc.setFontSize(21);
    doc.text('Your UAE E-Invoicing Readiness Status', M, y); y += 18;
    const reportDate = (() => { try { return new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Dubai', day: '2-digit', month: 'long', year: 'numeric' }); } catch (e) { return new Date().toDateString(); } })();
    doc.setFont('helvetica', 'italic'); doc.setFontSize(11.5); setC(cyan);
    doc.text('and your relevant deadlines', M, y); y += 18;
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
    [['Annual revenue', revenueLabel],
     ['Phase / tier', TIER.who],
     ['B2B / B2G invoices', b2bLbl[f.b2b] || '—'],
     ['In-house accounting team', lbl[f.team] || '—'],
     ['Can implement in-house', lbl[f.impl] || '—'],
     ['ASP status', lbl[f.asp] || '—'],
     ['ERP / accounting system', f.erp || '—']].forEach(([k, val]) => { ensure(15); setC(steel); doc.text(k + ':', M, y); setC(ink); doc.text(String(val), M + 184, y); y += 15; });

    // ===== PAGE 2 — the essentials (catchy, one page) =====
    doc.addPage(); y = 60;
    heading('What is changing');
    para('From your go-live date, a valid invoice is no longer a PDF or a print-out. It is a structured XML file (Peppol PINT AE), validated and exchanged between accredited providers and reported to the Federal Tax Authority in near-real time — and it must be issued and transmitted within 14 days, counted from the date of supply (an advance payment can start the clock earlier).', { gap: 10 });
    bullet('Paper, PDF and email attachments are NOT valid e-invoices — even when the VAT figures are correct.');
    bullet('B2B and B2G are in scope, including free zones; B2C is out of scope for now. Assume you are in scope unless a specific exclusion applies.');

    heading('Know your deadline');
    const tblRows = [
      ['Phase 1 — Revenue >= AED 50M', '30 Oct 2026', '1 Jan 2027'],
      ['Phase 2 — Revenue < AED 50M', '31 Mar 2027', '1 Jul 2027'],
      ['Phase 3 — Government entities', '31 Mar 2027', '1 Oct 2027'],
    ];
    const clientIdx = f.isGov ? 2 : (TIER.who.indexOf('50M+') >= 0 ? 0 : 1);
    const ca = M + 10, cb = M + colW * 0.54, cc = M + colW * 0.78, rh = 27;
    doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]); doc.rect(M, y, colW, 22, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.text('PHASE / WHO', ca, y + 15); doc.text('APPOINT ASP BY', cb, y + 15); doc.text('GO LIVE BY', cc, y + 15);
    y += 22;
    tblRows.forEach((r, i) => {
      if (i === clientIdx) { doc.setFillColor(225, 244, 251); doc.rect(M, y, colW, rh, 'F'); }
      doc.setDrawColor(225, 228, 232); doc.setLineWidth(0.5); doc.line(M, y + rh, M + colW, y + rh);
      setC(charcoal); doc.setFont('helvetica', i === clientIdx ? 'bold' : 'normal'); doc.setFontSize(10);
      doc.text(r[0], ca, y + 18);
      doc.setFont('helvetica', 'normal'); setC(ink);
      doc.text(r[1], cb, y + 18); doc.text(r[2], cc, y + 18);
      y += rh;
    });
    y += 12;
    para('Your row is highlighted. You are in ' + TIER.who + ' — appoint your ASP by ' + TIER.asp + ' (' + dlabel(TIER.aspISO) + ') and go live by ' + TIER.live + ' (' + dlabel(TIER.liveISO) + '). The appointment date is the one that bites: selecting, integrating and testing an ASP takes time.', { gap: 12 });

    // The cost of waiting — penalties callout
    ensure(82);
    doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]); doc.rect(M, y, colW, 60, 'F');
    setC(cyan); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.text('THE COST OF WAITING', M + 16, y + 17);
    const pen = [['AED 5,000 / mo', 'No ASP appointed in time'], ['AED 100 / invoice', 'Late issuance · cap 5k/mo'], ['AED 1,000 / day', 'Notification failures']];
    const pcw = (colW - 32) / 3;
    pen.forEach((pp, i) => { const px = M + 16 + i * pcw; doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text(pp[0], px, y + 38); setC(steel); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.text(pp[1], px, y + 50); });
    y += 68;
    setC(steel); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
    doc.text('Penalties (Cabinet Decision 106 of 2025) start as each deadline passes — the ASP-appointment date is first, before go-live.', M, y); y += 16;

    heading('Your next moves');
    bullet(f.asp === 'appointed' ? 'Validate your appointed ASP — set-up, connectivity and accreditation.' : 'Appoint a Service Provider from the current MoF pre-approved list (see mof.gov.ae for the latest list).');
    bullet('Clean your master data — TRNs, legal names and addresses vs FTA records — and map your ' + (f.erp ? f.erp : 'ERP / accounting') + ' fields to the e-invoice format.');
    bullet('Run a pilot 60–90 days before your go-live date — and let us take you from scope assessment to go-live.');

    // CTA box
    ensure(80);
    doc.setFillColor(offbg[0], offbg[1], offbg[2]); doc.rect(M, y, colW, 70, 'F');
    setC(charcoal); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
    doc.text('Get ahead of your deadline — talk to us', M + 16, y + 22);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); setC(ink);
    doc.text('Phone / WhatsApp: +971 4 396 0399  ·  +971 56 548 4635', M + 16, y + 40);
    doc.text('info@aaccounting.me   ·   www.aaccounting.me/e-invoicing', M + 16, y + 56); y += 84;
    ensure(34); setC(steel); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
    doc.splitTextToSize('Legal basis: MD 243 of 2025 (system) and MD 244 of 2025 (timeline, as amended by MD 66 of 2026), with MD 64 of 2025 / MD 56 of 2026 (ASP accreditation) and the UAE e-Invoicing Guidelines v1.1. General guidance, not advice — confirm against the latest UAE Ministry of Finance / FTA sources. Day-counts are as at the report date above.', colW).forEach((ln) => { ensure(10); doc.text(ln, M, y); y += 10; });

    // ---- page footers (page numbers + firm) ----
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(225, 228, 232); doc.setLineWidth(0.5); doc.line(M, PH - 40, W - M, PH - 40);
      setC(steel); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
      doc.text('Authentic Accounting & Bookkeeping L.L.C', M, PH - 28);
      doc.text('Page ' + p + ' of ' + totalPages, W - M, PH - 28, { align: 'right' });
    }

    doc.save('UAE-E-Invoicing-Readiness-Status-' + (f.company || 'Report').replace(/[^A-Za-z0-9]+/g, '-') + '.pdf');
  };

  const handleGenerate = async () => {
    setErr('');
    if (!f.company.trim() || !f.name.trim() || !f.email.trim() || !f.phone.trim()) { setErr('Please complete company name, your name, email and phone.'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) { setErr('Please enter a valid work email.'); return; }
    if (!TIER) { setErr('Please choose your revenue band (or tick “government entity”) so we can calculate your deadline.'); return; }
    if (!f.b2b) { setErr('Please tell us whether you issue B2B / B2G invoices — it decides whether the mandate applies to you.'); return; }
    if (!f.consent) { setErr('Please confirm you agree to our Privacy Policy so we can prepare your report.'); return; }
    setBusy(true);
    try {
      let downloadDate = '';
      try { downloadDate = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' (GST)'; } catch (e) { downloadDate = new Date().toISOString(); }
      const summary = ['Company: ' + f.company, 'Name: ' + f.name, 'Email: ' + f.email, 'Phone: ' + f.phone, 'Revenue: ' + revenueLabel, 'Tier: ' + TIER.who, 'B2B/B2G scope: ' + (b2bLbl[f.b2b] || '—'), 'In-house team: ' + (lbl[f.team] || '—'), 'Can implement in-house: ' + (lbl[f.impl] || '—'), 'ASP status: ' + (lbl[f.asp] || '—'), 'ERP: ' + (f.erp || '—'), 'Downloaded: ' + downloadDate].join('\n');
      // Awaited + bounded (6s): the done-state copy must tell the truth about
      // whether the details actually reached us.
      let sent = false;
      if (window.AAContactSheet && window.AAContactSheet.submitRaw) {
        try {
          await Promise.race([
            window.AAContactSheet.submitRaw({ type: 'E-Invoicing Readiness Assessment', company: f.company, name: f.name, email: f.email, phone: f.phone, revenue: revenueLabel, tier: TIER.who, b2bScope: b2bLbl[f.b2b] || '', inHouseTeam: lbl[f.team] || '', canImplement: lbl[f.impl] || '', aspStatus: lbl[f.asp] || '', erp: f.erp, downloadDate, summary, consent: 'Yes', consentAt: new Date().toISOString() }),
            new Promise((resolve, reject) => setTimeout(() => reject(new Error('lead-timeout')), 6000)),
          ]);
          sent = true;
        } catch (e) { sent = false; }
      }
      setSentOk(sent);
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
      qual: 'Commercial transactions',
      asp: '31 Mar 2027', aspISO: '2027-03-31',
      ready: '1 Oct 2027', readyISO: '2027-10-01',
      key: false,
    },
  ];

  const concepts = [
    ['OpenPeppol standard', 'Invoices are exchanged as structured data on the international OpenPeppol framework — not as PDFs or scans.', 'network'],
    ['5-corner model', 'Invoices are exchanged between the two parties’ accredited service providers over Peppol, with tax data reported to the FTA in near-real time.', 'route'],
    ['B2B and B2G scope', 'Mandatory for business-to-business and business-to-government transactions. Business-to-consumer (B2C) is currently optional / out of scope.', 'building-2'],
    ['Accredited Service Provider', 'Each entity must appoint an ASP — to transmit its own e-invoices and to receive and process its suppliers’. From go-live, PDF and paper are no longer valid for in-scope transactions.', 'badge-check'],
  ];

  const scope = [
    'Scope assessment & impact analysis',
    'Accredited Service Provider (ASP) selection',
    'ERP & accounting-system field mapping',
    'End-to-end compliance & go-live support',
  ];

  // The lead form + live deadline preview + PDF generator. Shared between the
  // on-page section and the global readiness modal (formOnly).
  const formGrid = (
    <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
      <div style={{ padding: 32, borderRight: '1px solid var(--aa-rule)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label htmlFor={uid + '-company'} style={laS}>Company name *</label><input id={uid + '-company'} autoComplete="organization" style={inS} value={f.company} onChange={upd('company')} placeholder="Your company" /></div>
          <div><label htmlFor={uid + '-name'} style={laS}>Your name *</label><input id={uid + '-name'} autoComplete="name" style={inS} value={f.name} onChange={upd('name')} placeholder="Full name" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
          <div><label htmlFor={uid + '-email'} style={laS}>Work email *</label><input id={uid + '-email'} type="email" autoComplete="email" style={inS} value={f.email} onChange={upd('email')} placeholder="name@company.ae" /></div>
          <div><label htmlFor={uid + '-phone'} style={laS}>Phone / WhatsApp *</label><input id={uid + '-phone'} type="tel" autoComplete="tel" style={inS} value={f.phone} onChange={upd('phone')} placeholder="+971 …" /></div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label htmlFor={uid + '-revenue'} style={laS}>Annual revenue band *</label>
          <select id={uid + '-revenue'} style={inS} value={f.revenue} onChange={upd('revenue')} disabled={f.isGov}>
            <option value="">Select your revenue band…</option>
            <option value="gte50">AED 50 million or more</option>
            <option value="lt50">Less than AED 50 million</option>
          </select>
          <div style={{ fontSize: 12.5, color: 'var(--aa-steel)', marginTop: 6 }}>We only need the band — AED 50 million is the line that sets your phase. No exact figures.</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 14, color: 'var(--aa-charcoal)', cursor: 'pointer' }}>
            <input type="checkbox" checked={f.isGov} onChange={upd('isGov')} style={{ width: 16, height: 16 }} /> We are a government entity
          </label>
        </div>
        <div style={{ marginTop: 14 }}>
          <label htmlFor={uid + '-b2b'} style={laS}>Do you issue B2B or B2G (business / government) invoices? *</label>
          <select id={uid + '-b2b'} style={inS} value={f.b2b} onChange={upd('b2b')}>
            <option value="">Select…</option>
            <option value="b2bg">Yes — B2B and/or B2G</option>
            <option value="mix">A mix of business and consumers</option>
            <option value="b2c">Only B2C (consumers)</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
          <div><label htmlFor={uid + '-team'} style={laS}>In-house accounting team?</label>
            <select id={uid + '-team'} style={inS} value={f.team} onChange={upd('team')}><option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option></select></div>
          <div><label htmlFor={uid + '-impl'} style={laS}>Can your team implement it in-house?</label>
            <select id={uid + '-impl'} style={inS} value={f.impl} onChange={upd('impl')}><option value="">Select…</option><option value="yes">Yes</option><option value="unsure">Not sure</option><option value="no">No — we’d want help</option></select></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
          <div><label htmlFor={uid + '-asp'} style={laS}>ASP identified / appointed?</label>
            <select id={uid + '-asp'} style={inS} value={f.asp} onChange={upd('asp')}><option value="">Select…</option><option value="appointed">Appointed</option><option value="evaluating">Evaluating</option><option value="no">Not yet</option></select></div>
          <div><label htmlFor={uid + '-erp'} style={laS}>ERP / accounting software</label>
            <input id={uid + '-erp'} style={inS} value={f.erp} onChange={upd('erp')} placeholder="e.g. Tally, Zoho, SAP" /></div>
        </div>
      </div>
      <div style={{ padding: 32, background: 'var(--aa-charcoal)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 320 }}>
        {done ? (
          <div>
            <i data-lucide="check-circle-2" style={{ width: 34, height: 34, color: 'var(--aa-cyan)' }}></i>
            <h3 style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', fontSize: 22, letterSpacing: '0.01em', margin: '14px 0 8px' }}>Readiness status downloading</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.6 }}>{sentOk ? 'Your personalised readiness status is downloading now. We’ve received your details and the team will be in touch — or reach us directly on WhatsApp.' : 'Your personalised readiness status is downloading now. We could not confirm your details reached us — please WhatsApp us on +971 56 548 4635 so we can follow up.'}</p>
            <button className="btn btn--primary btn--sm" style={{ marginTop: 16 }} onClick={bookReadiness}>Book a readiness call <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i></button>
          </div>
        ) : (
          <div>
            {TIER ? (
              <div style={{ marginBottom: 20 }}>
                <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 10 }}>{TIER.who}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Appoint ASP by <strong style={{ color: '#fff' }}>{TIER.asp}</strong>{!window.__AA_SNAPSHOT && <span style={{ color: 'var(--aa-cyan)' }}> ({dlabel(TIER.aspISO)})</span>}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Go live by <strong style={{ color: '#fff' }}>{TIER.live}</strong>{!window.__AA_SNAPSHOT && <span style={{ color: 'var(--aa-cyan)' }}> ({dlabel(TIER.liveISO)})</span>}</div>
              </div>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>Fill in your details and revenue band to generate your personalised PDF — your exact deadlines, a tailored verdict, and your next steps.</p>
            )}
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, cursor: 'pointer', marginBottom: 14 }}>
              <input type="checkbox" checked={f.consent} onChange={upd('consent')} style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0 }} />
              <span>I agree to Authentic Accounting using my details to prepare this report and follow up, as described in the <a href={pathForPage('privacy')} onClick={(e) => { e.preventDefault(); if (onClose) onClose(); onNav('privacy'); }} style={{ color: 'var(--aa-cyan)', fontWeight: 600 }}>Privacy Policy</a>. *</span>
            </label>
            <button className="btn btn--primary" onClick={handleGenerate} disabled={busy}>
              {busy ? 'Generating…' : 'Get my readiness status'}
              <i data-lucide="download" style={{ width: 16, height: 16 }}></i>
            </button>
            {err ? <p role="alert" style={{ color: '#ff9a9a', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>{err}</p> : null}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 14, lineHeight: 1.5 }}>Instant PDF download · indicative guidance, not tax advice.</p>
          </div>
        )}
      </div>
    </div>
  );

  if (formOnly) return formGrid;

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
              <div className="eyebrow" style={{ marginBottom: 16 }}>Client briefing · UAE Ministry of Finance e-invoicing mandate</div>
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
                mandatory structured e-invoicing system for <strong style={{ color: 'var(--aa-charcoal)' }}>B2B</strong> and{' '}
                <strong style={{ color: 'var(--aa-charcoal)' }}>B2G</strong> transactions (limited exclusions apply), built on the international{' '}
                <strong style={{ color: 'var(--aa-charcoal)' }}>OpenPeppol</strong> standard and a{' '}
                <strong style={{ color: 'var(--aa-charcoal)' }}>5-corner</strong> model: invoices are exchanged between the two
                parties&rsquo; accredited service providers, with tax data reported to the Federal Tax Authority in near-real
                time — under Ministerial Decisions 243 and 244 of 2025. Authentic Accounting guides each client through
                readiness and compliance — well ahead of the phased deadlines below.
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
                  ['Issued via', 'Your appointed ASP'],
                  ['First ASP deadline', <a href={pathForPage('einv-deadline')} onClick={(e) => { e.preventDefault(); onNav('einv-deadline'); }} style={{ color: 'inherit', textDecorationColor: 'var(--aa-cyan)' }}>{'30 Oct 2026' + (window.__AA_SNAPSHOT ? '' : ' · ' + dlabel('2026-10-30'))}</a>],
                  ['Phase 1 go-live', '1 Jan 2027' + (window.__AA_SNAPSHOT ? '' : ' · ' + dlabel('2027-01-01'))],
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

      {window.AnswerFirst && <window.AnswerFirst page="e-invoicing" />}

      {/* ============== READINESS ASSESSMENT ============== */}
      <section id="aa-einv-assessment" className="section section--off" style={{ scrollMarginTop: 128 }}>
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">Free · Instant personalised PDF with your deadlines</div>
            <h2>Get your e-invoicing readiness status.</h2>
          </div>
          {formGrid}
        </div>
      </section>

      {/* ============== WHAT'S CHANGING ============== */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">What is changing</div>
            <h2>Structured invoices, transmitted and validated.</h2>
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
                    {/* Live day-counts only — dropped in the static snapshot where they'd go stale. */}
                    {!window.__AA_SNAPSHOT && <span style={{ display: 'block', fontWeight: 400, fontSize: 12, color: 'var(--aa-cyan)', marginTop: 2 }}>{dlabel(p.aspISO)}</span>}
                  </td>
                  <td className="aa-num" style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--aa-charcoal)' }}>
                    {p.ready}
                    {!window.__AA_SNAPSHOT && <span style={{ display: 'block', fontWeight: 400, fontSize: 12, color: 'var(--aa-cyan)', marginTop: 2 }}>{dlabel(p.readyISO)}</span>}
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
            valid for in-scope transactions. PDF and paper invoices will not.
            <br /><br />
            <span style={{ color: 'var(--aa-steel-700)' }}>Legal basis: MD 243 of 2025 (system) and MD 244 of 2025 (timeline, as amended by MD 66 of 2026). This briefing is general guidance, not advice — confirm dates and scope against the latest UAE Ministry of Finance / FTA sources.</span>
          </p>
        </div>
      </section>

      {/* ============== OFFICIAL RESOURCE · MoF ASP LIST ============== */}
      <section className="section">
        <div className="container">
          <a
            href="https://mof.gov.ae/en/about-us/initiatives/einvoicing/pre-approved-einvoicing-service-providers/"
            target="_blank" rel="noopener noreferrer"
            className="aa-stack-sm"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
              padding: '28px 32px', border: '1px solid var(--aa-rule)', background: 'var(--aa-surface-off)',
              textDecoration: 'none', color: 'inherit', flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <i data-lucide="badge-check" style={{ width: 30, height: 30, color: 'var(--aa-cyan)', flexShrink: 0 }}></i>
              <div>
                <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 6 }}>Official resource · UAE Ministry of Finance</div>
                <div style={{ fontSize: 19, fontWeight: 600, color: 'var(--aa-charcoal)', lineHeight: 1.3 }}>Pre-Approved E-Invoicing Service Providers</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', marginTop: 4, lineHeight: 1.5, maxWidth: 620 }}>
                  The Ministry of Finance&rsquo;s register of pre-approved (Article&nbsp;15) service providers you can appoint today. Full Article-16 accreditation is granted separately, so verify each provider&rsquo;s current status before you appoint.
                </div>
              </div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--aa-cyan)', whiteSpace: 'nowrap' }}>
              View the MoF list
              <i data-lucide="external-link" style={{ width: 16, height: 16 }}></i>
            </span>
          </a>
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
                <span style={{ marginTop: 4, fontSize: 13, fontWeight: 600, color: 'var(--aa-cyan)' }}>Read the guide →</span>
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
          <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--aa-steel)' }}>Rules current as at {(window.AARoutes && window.AARoutes.TAX_RULES_ASOF) || 'June 2026'} — general guidance, not tax advice.</p>
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

// Global pop-up readiness form. Mounted once in the app shell; opened from the
// marquee (and anywhere) via window.dispatchEvent(new Event('aa:open-einvoice')).
// Renders EInvoicingPage in formOnly mode so there is a single source of truth.
function EInvoiceReadinessModal({ onNav }) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener('aa:open-einvoice', openHandler);
    return () => window.removeEventListener('aa:open-einvoice', openHandler);
  }, []);

  const panelRef = React.useRef(null);

  // Focus management (WAI-ARIA modal pattern): move focus in on open, keep Tab
  // inside the dialog, hide the rest of the app from assistive tech, and
  // restore focus to whatever opened it on close.
  React.useEffect(() => {
    if (!open) return;
    const root = document.getElementById('root');
    const opener = document.activeElement;
    const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = Array.prototype.filter.call(panelRef.current.querySelectorAll(FOCUSABLE), (el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (root) root.setAttribute('aria-hidden', 'true');
    if (window.lucide) window.lucide.createIcons();
    const t = setTimeout(() => { if (panelRef.current) panelRef.current.focus(); }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      if (root) root.removeAttribute('aria-hidden');
      if (opener && opener.focus) opener.focus();
    };
  }, [open]);

  if (!open) return null;

  const viewFull = (e) => { e.preventDefault(); setOpen(false); onNav('e-invoicing'); };

  return (
    <div role="dialog" aria-modal="true" aria-label="E-invoicing readiness status" onClick={close}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,12,20,0.66)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
      <div ref={panelRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', width: '100%', maxWidth: 760, position: 'relative', boxShadow: '0 24px 70px rgba(0,0,0,0.45)', outline: 'none' }}>
        <button onClick={close} aria-label="Close"
          style={{ position: 'absolute', top: 8, right: 10, zIndex: 2, width: 38, height: 38, border: 0, background: 'transparent', fontSize: 26, lineHeight: 1, color: 'var(--aa-steel)', cursor: 'pointer' }}>×</button>
        <div style={{ padding: '28px 28px 0' }}>
          <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 8 }}>Free · Instant personalised PDF</div>
          <h2 style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', letterSpacing: '0.01em', fontSize: 'clamp(22px, 3vw, 30px)', margin: '0 0 6px', color: 'var(--aa-charcoal)', lineHeight: 1.05 }}>Get your e-invoicing readiness status.</h2>
          <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--aa-steel-700)', lineHeight: 1.5 }}>Answer a few quick questions — your exact deadlines, a tailored verdict and next steps, as an instant PDF.</p>
        </div>
        <div style={{ padding: '0 28px 24px' }}>
          <EInvoicingPage formOnly onNav={onNav} onClose={close} />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <a href={pathForPage('e-invoicing')} onClick={viewFull} style={{ fontSize: 13, fontWeight: 600, color: 'var(--aa-cyan)', textDecoration: 'none' }}>Read the full e-invoicing briefing →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- 30 October 2026 deadline landing page ---------------------------------
// The campaign piece for the first binding e-invoicing deadline (Phase 1 ASP
// appointment, MD 244/2025 as amended by MD 66/2026). Every figure mirrors the
// QC'd flagship/readiness-tool copy — edit there first, then here.
function EInvDeadlinePage({ onNav }) {
  const dubaiToday = () => {
    try { const [y, m, d] = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' }).split('-').map(Number); return new Date(y, m - 1, d); }
    catch (e) { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  };
  const daysLeft = Math.ceil((new Date('2026-10-30T00:00:00') - dubaiToday()) / 86400000);
  const bookReadiness = () => {
    try { window.dispatchEvent(new Event('aa:open-einvoice')); }
    catch (e) { onNav('e-invoicing'); }
  };
  const AnswerFirst = window.AnswerFirst;
  const RelatedReading = window.RelatedReading;
  const FAQ = (window.AARoutes && window.AARoutes.FAQ_BY_PAGE && window.AARoutes.FAQ_BY_PAGE['einv-deadline']) || [];
  const PHASES = [
    ['Phase 1 — Revenue ≥ AED 50M', '30 Oct 2026', '1 Jan 2027'],
    ['Phase 2 — Revenue < AED 50M', '31 Mar 2027', '1 Jul 2027'],
    ['Phase 3 — Government entities', '31 Mar 2027', '1 Oct 2027'],
  ];
  const GUIDES = [
    ['choosing-accredited-service-provider-asp', 'Choosing an Accredited Service Provider (ASP)'],
    ['prepare-erp-for-uae-e-invoicing', 'Getting your ERP ready for e-invoicing'],
    ['uae-e-invoicing-deadlines-phases', 'UAE e-invoicing deadlines and phases'],
    ['uae-e-invoicing-explained', 'UAE e-invoicing explained: a plain-English guide'],
  ];
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'var(--aa-charcoal)', color: '#fff', padding: '48px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('e-invoicing')} onClick={(e) => { e.preventDefault(); onNav('e-invoicing'); }} style={{ color: 'rgba(255,255,255,0.75)' }}>E-Invoicing</a>
            <span>/</span><span style={{ color: '#fff' }}>30 October 2026</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 16 }}>E-Invoicing · The first binding deadline</div>
              <h1 style={{ fontFamily: 'var(--aa-font-display)', fontWeight: 700, fontSize: 'clamp(44px, 6vw, 72px)', textTransform: 'uppercase', letterSpacing: '0.01em', margin: 0, lineHeight: 1.0, color: '#fff' }}>
                30 October 2026.<br />
                <span style={{ color: 'var(--aa-cyan)' }}>The clock is already running.</span>
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: 640 }}>
                By this date, UAE businesses with annual revenue of <strong style={{ color: '#fff' }}>AED 50 million or more</strong> must
                have appointed an <strong style={{ color: '#fff' }}>Accredited Service Provider</strong> for e-invoicing — under Ministerial
                Decision 244 of 2025 as amended by MD 66 of 2026. It is the first deadline of the mandate, it lands <strong style={{ color: '#fff' }}>before</strong> the
                1 January 2027 go-live, and penalties attach to it directly.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={bookReadiness}>
                  Check your readiness status
                  <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
                </button>
                <a className="btn btn--ghost-light" href="https://wa.me/971565484635" target="_blank" rel="noopener">
                  <i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>
                  WhatsApp us
                </a>
              </div>
            </div>
            <aside style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', padding: 24 }}>
              {/* Live countdown only — the static snapshot keeps the absolute date. */}
              {!window.__AA_SNAPSHOT && (
                <div style={{ textAlign: 'center', paddingBottom: 18, marginBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <div style={{ fontFamily: 'var(--aa-font-mono)', fontSize: 56, fontWeight: 700, lineHeight: 1, color: 'var(--aa-cyan)' }}>{daysLeft > 0 ? daysLeft.toLocaleString() : 'Now'}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{daysLeft > 0 ? (daysLeft === 1 ? 'day left' : 'days left') : 'due'}</div>
                </div>
              )}
              <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                {[
                  ['Deadline', '30 October 2026'],
                  ['Who', 'Revenue ≥ AED 50M (Phase 1)'],
                  ['Obligation', 'Appoint an accredited ASP'],
                  ['Missed-appointment penalty', 'AED 5,000 / month'],
                  ['Phase 1 go-live', '1 January 2027'],
                  ['Legal basis', 'MD 244/2025 · MD 66/2026'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                    <dt style={{ color: 'rgba(255,255,255,0.6)' }}>{k}</dt>
                    <dd style={{ margin: 0, color: '#fff', fontWeight: 600, textAlign: 'right' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {AnswerFirst && <AnswerFirst page="einv-deadline" />}

      {/* What must happen */}
      <section className="section">
        <div className="container">
          <div className="section-head"><div className="section-head__eyebrow">What the date demands</div><h2>Three things to understand about 30 October.</h2></div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['user-check', 'Appointing is the obligation', 'Phase 1 businesses must have an Accredited Service Provider appointed by the date — the ASP transmits your e-invoices and receives your suppliers’, so it is the gateway to the whole mandate.'],
              ['wrench', 'The contract is the start, not the finish', 'Between appointment and the 1 January 2027 go-live sit master-data cleanup, ERP field mapping and end-to-end testing. Appointing late compresses exactly the stages that need the most time.'],
              ['shield', 'Penalties attach before go-live', 'Cabinet Decision 106 of 2025 sets AED 5,000 per month for failing to appoint in time — the first penalty of the regime, and it bites at the appointment deadline, not at go-live.'],
            ].map(([ic, t, d], i) => (
              <div key={t} style={{ padding: 28, borderRight: i < 2 ? '1px solid var(--aa-rule)' : 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <i data-lucide={ic} style={{ width: 24, height: 24, color: 'var(--aa-cyan)' }}></i>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t}</div>
                <div style={{ fontSize: 13.5, color: 'var(--aa-steel-700)', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All phases */}
      <section className="section section--off">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head"><div className="section-head__eyebrow">Not in Phase 1?</div><h2>Every deadline, one table.</h2></div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid var(--aa-rule)', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--aa-charcoal)', color: '#fff', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Who</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, whiteSpace: 'nowrap' }}>Appoint ASP by</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, whiteSpace: 'nowrap' }}>Go-live</th>
                </tr>
              </thead>
              <tbody>
                {PHASES.map(([who, asp, live], i) => (
                  <tr key={who} style={{ borderTop: '1px solid var(--aa-rule)', background: i === 0 ? 'rgba(0,176,240,0.07)' : '#fff' }}>
                    <td style={{ padding: '12px 16px', fontWeight: i === 0 ? 700 : 400 }}>{who}</td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontWeight: i === 0 ? 700 : 400 }}>{asp}</td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{live}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--aa-steel)', fontStyle: 'italic' }}>
            Phase 2 and government appointments fall due 31 March 2027 — five months after Phase 1. The selection lessons below apply to everyone; only the urgency differs.
          </p>
        </div>
      </section>

      {/* Choosing well in a hurry */}
      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="section-head"><div className="section-head__eyebrow">Selection under time pressure</div><h2>Choosing fast without choosing badly.</h2></div>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--aa-charcoal-800)', margin: 0 }}>
            The Ministry of Finance publishes a register of <strong>pre-approved</strong> (Article 15) service providers — 42 names as at July 2026 — but
            pre-approval is not accreditation. Accreditation is granted by the Ministry under Article 16 of MD 64 of 2025 (as amended by MD 56 of 2026),
            and the FTA’s EmaraTax onboarding screen listed 38 entries as at July 2026 (one of them an FTA test row) — in practice the closest
            thing to an accredited list available today, though it is an operational onboarding view, not the official register.
            Contract for Article 16 accreditation, not just pre-approval — and say so in the agreement.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--aa-charcoal-800)', margin: '14px 0 0' }}>
            Fit matters as much as status: transaction volumes, your ERP’s integration options, exception handling and support model differ sharply
            across providers. Our selection guide walks the shortlist questions; we run the comparison as part of a readiness engagement.
          </p>
          <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
            <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>The guides</div>
            <ul className="aa-linkrow" style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
              {GUIDES.map(([slug, label]) => (
                <li key={slug}>
                  <a href={pathForInsight(slug)} onClick={(e) => { e.preventDefault(); onNav('insight', slug); }}
                    style={{ color: 'var(--aa-cyan)', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
                    {label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {FAQ.length > 0 && (
        <section className="section section--off">
          <div className="container" style={{ maxWidth: 860 }}>
            <div className="section-head"><div className="section-head__eyebrow">FAQ</div><h2>The deadline, answered.</h2></div>
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
            {RelatedReading && <RelatedReading page="einv-deadline" onNav={onNav} />}
            <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--aa-steel)' }}>Rules current as at {(window.AARoutes && window.AARoutes.TAX_RULES_ASOF) || 'August 2026'} — general guidance, not tax advice. Sources: MD 243/2025, MD 244/2025 (as amended by MD 66/2026), MD 64/2025 (as amended by MD 56/2026), CD 106/2025.</p>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section style={{ background: 'var(--aa-charcoal)', color: '#fff', padding: '48px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 8 }}>Free · 2 minutes · personalised PDF</div>
            <div style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, lineHeight: 1.05 }}>Where do you stand today?</div>
          </div>
          <button className="btn btn--primary" onClick={bookReadiness}>
            Get my readiness status
            <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
          </button>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { EInvoicingPage, EInvoiceReadinessModal, EInvDeadlinePage });
