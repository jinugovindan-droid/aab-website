// Tools: the /tools hub and the per-tool pages.
//
// A tool page is a fixed FRAME (crumbtrail, hero, answer-first capsule,
// assumptions, sources, FAQ, related links) around a BODY that does the work.
// Bodies are split out of the shared bundle by scripts/build.mjs — the same
// mechanism as article bodies — into dist/tools/<slug>.<hash>.js, loaded only
// on that tool's page (prerender.py adds the tag) or fetched on demand when the
// router moves there. Adding a tool therefore costs every other page nothing.
//
// A body must be one top-level function that references only React, the
// helpers exposed on window.AATools / window.AARoutes (see the tool prelude in
// build.mjs) and whatever it defines inside itself.
const { pathForPage, pathForInsight } = window.AARoutes;

// ---- Registry of tools: everything the frame and the hub need to know -------
// Keep page ids, slugs and labels in step with routes.js / prerender.py.
const TOOLS = [
  {
    page: 'tool-gratuity', slug: 'gratuity-calculator',
    name: 'UAE Gratuity Calculator',
    kicker: 'End of service · Federal Decree-Law No. 33 of 2021',
    h1a: 'UAE gratuity', h1b: 'calculator.',
    intro: 'End-of-service gratuity worked from Article 51 of the Labour Law — every figure traced to its clause, the conventions the law leaves open stated on the page, and the monthly provision an employer should be booking.',
    hubLine: 'Gratuity payable, the breakdown by article, the pay-by date and the monthly accrual to book.',
    needs: 'Basic wage, start and end dates',
    updated: '6 Sep 2026',
    intent: 'Bookkeeping & payroll',
    glance: [
      ['Entitlement', '21 / 30 days of basic wage per year'],
      ['Minimum service', 'One continuous year'],
      ['Wage base', 'Last basic wage — no allowances'],
      ['Ceiling', 'Two years’ wage'],
      ['Pay by', '14 days after the end date'],
      ['Resignation', 'No reduction under the 2021 law'],
    ],
    // What the Decree-Law fixes, and what this page decides where it is silent.
    assumptions: [
      ['A day’s wage', 'The Decree-Law fixes the entitlement in days of basic wage and does not say how a day is derived from a monthly wage. This page uses monthly basic ÷ 30 and shows the figure at ÷ 30.4167 beside it.'],
      ['The ceiling', 'Article 51(6) says “two years’ wage” — the defined term that includes allowances. The page applies 24 × last basic wage, the reading used in practice, and flags it when it bites.'],
      ['A year', 'Years of service are counted as 365-day blocks on calendar days served, less unpaid absence. The difference from anniversary counting is a day or two.'],
      ['Scope', 'Employers under the federal Labour Law, mainland and free zones. DIFC and ADGM have their own employment laws. UAE nationals come under the pension legislation.'],
    ],
    sources: [
      ['Federal Decree-Law No. 33 of 2021 — Articles 1, 51, 52 and 53 (MOHRE consolidated text)', 'https://www.mohre.gov.ae/assets/download/e82f7872/Federal%20Decree-Law%20No.%2033%20of%202021%20Regarding%20the%20Regulation%20of%20Employment%20Relationship%20and%20its%20amendments_638990571068264034.pdf.aspx'],
      ['Cabinet Resolution No. 1 of 2022 — Articles 29 and 30 (Executive Regulation)', 'https://mohre.gov.ae/assets/download/522c19d4/Cabinet%20Resolution%20_Executive%20Regulations%20Decree-Law%20No.%2033.pdf.aspx'],
      ['Cabinet Resolution No. 96 of 2023 — Article 6 (alternative end-of-service scheme)', 'https://mohre.gov.ae/assets/download/c7ea6970/cabinet-resolution-no-96-of-2023-regarding-an-alternative-end-of-service-benefits-system-en.aspx'],
      ['The Official Portal of the UAE Government — end of service benefits in the private sector', 'https://u.ae/en/information-and-services/jobs/Sector-of-employment/employment-in-the-private-sector/end-of-service-benefits-for-employees-in-the-private-sector'],
    ],
  },
  {
    page: 'tool-vat', slug: 'vat-calculator',
    name: 'UAE VAT Calculator',
    kicker: 'VAT · Federal Decree-Law No. 8 of 2017 · 5% since 1 January 2018',
    h1a: 'UAE VAT', h1b: 'calculator.',
    intro: 'Add 5% to a net amount, or take the VAT out of a gross one — with the formula beside the result, rounded to the fils the way the FTA’s own texts describe it, and every rule cited to its article.',
    hubLine: 'Add 5% or take it out of a gross amount, formula shown, rounded to the fils the way the FTA describes.',
    needs: 'One amount, in dirhams',
    updated: '7 Sep 2026',
    intent: 'VAT compliance',
    glance: [
      ['Standard rate', '5% of the value of the supply'],
      ['Since', '1 January 2018, unchanged'],
      ['VAT inside a gross', 'gross × 5 ÷ 105 = gross ÷ 21'],
      ['Rounding', 'Nearest fils, half up — permitted'],
      ['Displayed prices', 'Inclusive of VAT'],
      ['Currency', 'Dirhams, Central Bank rate'],
    ],
    // What the texts fix, and what this page decides where they are silent.
    assumptions: [
      ['The tie-break', 'Article 61 of the Executive Regulation says “mathematical rounding” and stops. The FTA’s Taxable Person Guide says a fraction of a half or more rounds up. This page rounds half up. In add mode an exact half-fils occurs whenever the net ends in 10, 30, 50, 70 or 90 fils; in extract mode it never does, because gross ÷ 21 never lands on an exact half.'],
      ['What gets rounded', 'Four texts name four objects — the Decree-Law “the total amount to be paid” (Art. 68), the Regulation “the Tax chargeable on a supply” (Art. 61), the Guide “the invoice amount”, VATP006 “the tax value”. This page rounds the VAT figure once and derives the other side from it, so net, VAT and gross always re-add.'],
      ['Per line or per invoice', 'On a full tax invoice on paper the FTA’s Public Clarification VATP006 calculates and rounds line by line; on an electronic invoice the Ministry of Finance’s June 2026 guidelines round at the invoice-level total only. The two can differ by a fils. This page computes one amount and says so; an invoice mode will carry both conventions.'],
      ['Permission and practice', 'The Regulation — in English and in the governing Arabic (يُسمح) — permits rounding to the nearest fils; the FTA’s 2022 leaflet says the amount must be rounded. The law permits it, the FTA expects it, this page does it.'],
      ['A fils', 'Neither VAT text defines it; Article 68 says “one fils of a UAE Dirham”. This page takes a fils as one hundredth of a dirham, so every amount has two decimals.'],
      ['The arithmetic', '÷ 1.05, ÷ 21 and × 5 ÷ 105 are the same operation, implied by Article 34(1); none is “the” legal formula and nothing here is “approved”. The Guide happens to write ÷ 21.'],
    ],
    sources: [
      ['Federal Decree-Law No. 8 of 2017 on VAT and its amendments — FTA consolidation of 28 November 2025 (four instruments; in force 1 January 2026): Articles 1, 3, 34, 38, 48, 68, 69', 'https://tax.gov.ae//Datafolder/Files/Legislation/2025/Federal%20Decree-Law%20No.%208%20of%202017%20and%20amendments%20-%20publishing%2028%2011%202025.pdf'],
      ['Cabinet Decision No. 52 of 2017, Executive Regulation, as amended — FTA text of 18 September 2025: Articles 27, 59, 61 (Arabic text checked for Article 61)', 'https://tax.gov.ae/Datafolder/Files/Legislation/Executive-Regulation-of-Federal-Decree-Law-No-08-of-2017-Publish-18-09-2025.pdf'],
      ['VATP006 — Tax Invoices (FTA Public Clarification): rounding on invoices, line by line on a full tax invoice, worked examples', 'https://tax.gov.ae/DataFolder/Files/Pdf/06-Tax-Invoices.pdf'],
      ['Taxable Person Guide for VAT (FTA, 2018), §3.5 (÷ 21) and §12.3.4 (a half rounds up)', 'https://tax.gov.ae/DownloadOpenTextFile?fileUrl=en/VAT_VAT_Guides/Taxable_Person_Guide_Value_Added_Tax/Taxable_Person_Guide_June_2018_EN.pdf'],
      ['“Get to know your tax obligations” (FTA booklet): AED 220 ÷ 21 = AED 10.48', 'https://tax.gov.ae/DataFolder/Files/Guides/VAT/Awareness/Get%20to%20know%20your%20Tax%20Obligations.pdf'],
      ['VATP020 — VAT-free special offers (FTA): Article 38 and Regulation Article 27 restated', 'https://tax.gov.ae/DataFolder/Files/Pdf/VATP020%20-%20VAT-free%20special%20offers.pdf'],
      ['VATP046 — Amendments to the VAT Decree-Law (FTA, 2026): the articles amended in 2024 and 2026', 'https://tax.gov.ae//Datafolder/Files/Guides/VAT/PublicClarifications/VATP046%20-%20Amendments%20to%20VAT%20Decree-Law%20-%2009%202026.pdf'],
      ['VATP004 — Use of exchange rates for VAT purposes (FTA)', 'https://tax.gov.ae/DataFolder/Files/Pdf/04-use-of-exchange-rates.pdf'],
      ['Cabinet Decision No. 40 of 2017 on administrative penalties, as consolidated November 2025 — Table 3', 'https://tax.gov.ae/Datafolder/Files/Legislation/2025/Cabinet%20Decision%20No.%2040%20of%202017%20and%20its%20amendments%20-%20publishing%2011%202025.pdf'],
      ['UAE Electronic Invoicing Guidelines V1.1 (Ministry of Finance, 1 June 2026), §12.2 — rounding at invoice level', 'https://mof.gov.ae/wp-content/uploads/2026/06/UAE-Electronic-Invoicing-Guidelines_V-1.1-01June2026.pdf'],
    ],
  },
];

// Tools that live on other pages, listed on the hub so it is a real index.
const HUB_ALSO = [
  { name: 'Corporate Tax estimator', page: 'service-corporate-tax', icon: 'calculator',
    line: 'Indicative 9% liability from accounting profit, with Small Business Relief and the free-zone caveat.', needs: 'Net profit, revenue, year-end' },
  { name: 'VAT registration checker', page: 'service-vat', icon: 'check-circle-2',
    line: 'Mandatory, voluntary or not yet — against the AED 375,000 and 187,500 thresholds.', needs: 'Turnover, last 12 months and next 30 days' },
  { name: 'Supplier check — Decision 13', insight: 'fta-decision-13-supplier-verification', icon: 'search',
    line: 'Which checks apply to a purchase under FTA Decision No. 13 of 2026, from two numbers.', needs: 'Rolling spend with the supplier, this invoice' },
  { name: 'E-invoicing readiness check', page: 'e-invoicing', icon: 'file-check',
    line: 'Your phase, your deadline and what has to be true before an Accredited Service Provider can connect.', needs: 'Revenue band, systems' },
];

function toolByPage(page) { return TOOLS.find((t) => t.page === page) || null; }

// ---- Hub -------------------------------------------------------------------
function ToolsHubPage({ onNav }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  const go = (e, page, slug) => { e.preventDefault(); if (slug) onNav('insight', slug); else onNav(page); };
  const card = (key, icon, name, line, needs, href, onClick, badge) => (
    <a key={key} href={href} onClick={onClick} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 28, background: '#fff', border: '1px solid var(--aa-rule)', textDecoration: 'none', color: 'inherit', position: 'relative' }}>
      {badge ? <span className="eyebrow" style={{ position: 'absolute', top: 16, right: 20, color: 'var(--aa-cyan)', margin: 0 }}>{badge}</span> : null}
      <i data-lucide={icon} style={{ width: 26, height: 26, color: 'var(--aa-cyan)' }}></i>
      <div style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', fontSize: 22, letterSpacing: '0.01em', color: 'var(--aa-charcoal)', lineHeight: 1.1 }}>{name}</div>
      <div style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--aa-charcoal-800)' }}>{line}</div>
      <div style={{ marginTop: 'auto', fontSize: 12.5, color: 'var(--aa-steel)', borderTop: '1px solid var(--aa-rule)', paddingTop: 12 }}>Needs: {needs}</div>
      <span style={{ color: 'var(--aa-cyan)', fontWeight: 600, fontSize: 14 }}>Open the tool →</span>
    </a>
  );
  return (
    <div>
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('home')} onClick={(e) => { e.preventDefault(); onNav('home'); }} style={{ color: 'var(--aa-steel-700)' }}>Home</a>
            <span>/</span><span style={{ color: 'var(--aa-charcoal)' }}>Tools</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Free tools · built from the law they apply</div>
              <h1 style={{ fontFamily: 'var(--aa-font-display)', fontWeight: 700, fontSize: 'clamp(44px, 6vw, 72px)', textTransform: 'uppercase', letterSpacing: '0.01em', margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0 }}>
                The number,<br />and the article<br />behind it.
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>
                Each tool works one question from the UAE rule that governs it, cites the clause on the page, and says out loud where the text is silent and what convention it applies. The result is free; nothing you type is sent anywhere unless you ask for a statement.
              </p>
            </div>
            <aside style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24 }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>How these are built</div>
              <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                {[['Source', 'The primary text, quoted'], ['Silence', 'Stated, with the convention used'], ['Result', 'Free, computed in your browser'], ['Statement', 'Branded PDF, on request'], ['Currency', 'Dated; re-checked as articles are']].map(([k, v]) => (
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

      <section className="section section--off">
        <div className="container">
          <div className="section-head"><div className="section-head__eyebrow">Calculators and checkers</div><h2>{['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][TOOLS.length + HUB_ALSO.length - 1]} questions, answered from the text.</h2></div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {TOOLS.map((t) => card(t.page, 'calculator', t.name, t.hubLine, t.needs, pathForPage(t.page), (e) => go(e, t.page), 'New'))}
            {HUB_ALSO.map((t) => card(t.name, t.icon, t.name, t.line, t.needs, t.insight ? pathForInsight(t.insight) : pathForPage(t.page), (e) => go(e, t.page, t.insight), null))}
          </div>
          <p style={{ margin: '26px 0 0', fontSize: 14, color: 'var(--aa-steel-700)', maxWidth: 720, lineHeight: 1.6 }}>
            Next in the set: a Corporate Tax deadline calculator that takes the year-end and the incorporation date, a penalty calculator, and an invoice mode for the VAT calculator that carries both rounding conventions. Each will be built the same way.
          </p>
        </div>
      </section>
    </div>
  );
}

// ---- Tool page frame ---------------------------------------------------------
const TOOL_CHUNKS_REQUESTED = new Set();

function ToolPage({ page, onNav }) {
  const tool = toolByPage(page);
  const [, forceBody] = React.useState(0);
  const Body = tool ? (TOOL_BODIES[tool.slug] || null) : null;
  // The page a visitor lands on already carries its own chunk; moving here
  // client-side has to fetch it. Until it arrives the frame renders without the
  // body and fills in on load. A direct visit never hits this path.
  React.useEffect(() => {
    if (!tool || Body) return;
    const file = (window.AAToolChunks || {})[tool.slug];
    if (!file) return;
    if (TOOL_CHUNKS_REQUESTED.has(file)) return;
    TOOL_CHUNKS_REQUESTED.add(file);
    const el = document.createElement('script');
    el.src = '/dist/tools/' + file;
    el.onload = () => forceBody((n) => n + 1);
    el.onerror = () => { TOOL_CHUNKS_REQUESTED.delete(file); forceBody((n) => n + 1); };
    document.head.appendChild(el);
  }, [tool && tool.slug, Body]);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  if (!tool) return null;
  const faq = (window.AARoutes.FAQ_BY_PAGE && window.AARoutes.FAQ_BY_PAGE[page]) || [];

  return (
    <div>
      {/* Crumbtrail + hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 48px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('tools')} onClick={(e) => { e.preventDefault(); onNav('tools'); }} style={{ color: 'var(--aa-steel-700)' }}>Tools</a>
            <span>/</span><span style={{ color: 'var(--aa-charcoal)' }}>{tool.name}</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>{tool.kicker}</div>
              <h1 style={{ fontFamily: 'var(--aa-font-display)', fontWeight: 700, fontSize: 'clamp(44px, 6vw, 72px)', textTransform: 'uppercase', letterSpacing: '0.01em', margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0 }}>
                {tool.h1a}<br />{tool.h1b}
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>{tool.intro}</p>
              <p style={{ margin: '14px 0 0', fontSize: 13, color: 'var(--aa-steel)' }}>Free · computed in your browser · sources and assumptions below · updated {tool.updated}</p>
            </div>
            <aside style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24 }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>At a glance</div>
              <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                {tool.glance.map(([k, v]) => (
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

      <AnswerFirst page={page} />

      {/* The tool itself */}
      <section className="section" id="tool">
        <div className="container">
          {Body ? <Body onNav={onNav} tool={tool} /> : (
            <p style={{ color: 'var(--aa-steel)', fontSize: 15 }}>This tool is loading…</p>
          )}
        </div>
      </section>

      {/* What the page assumes, and where every number comes from */}
      <section className="section section--off">
        <div className="container">
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div>
              <div className="section-head"><div className="section-head__eyebrow">Where the text is silent</div><h2>What this page assumes.</h2></div>
              <dl style={{ margin: 0 }}>
                {tool.assumptions.map(([k, v]) => (
                  <div key={k} style={{ padding: '14px 0', borderTop: '1px solid var(--aa-rule)' }}>
                    <dt style={{ fontWeight: 600, color: 'var(--aa-charcoal)', fontSize: 15, marginBottom: 4 }}>{k}</dt>
                    <dd style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--aa-charcoal-800)' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <div className="section-head"><div className="section-head__eyebrow">Sources</div><h2>Read the text yourself.</h2></div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {tool.sources.map(([label, href]) => (
                  <li key={href} style={{ padding: '12px 0', borderTop: '1px solid var(--aa-rule)', fontSize: 14.5, lineHeight: 1.55 }}>
                    <a href={href} target="_blank" rel="noopener" style={{ color: 'var(--aa-charcoal)', textDecoration: 'none' }}>{label} <span style={{ color: 'var(--aa-cyan)' }}>↗</span></a>
                  </li>
                ))}
              </ul>
              <p style={{ margin: '14px 0 0', fontSize: 13, color: 'var(--aa-steel)', lineHeight: 1.55 }}>
                The Ministry’s English texts state that they are not official translations; the Arabic texts govern. This page is general information on published law, not advice on any person’s position.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + related */}
      <section className="section">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head"><div className="section-head__eyebrow">FAQ</div><h2>{tool.name}, answered.</h2></div>
          <FAQList items={faq} />
          <RelatedReading page={page} onNav={onNav} />
        </div>
      </section>
    </div>
  );
}

// ---- Tool bodies (split into dist/tools/ by scripts/build.mjs) ---------------

function GratuityToolBody({ onNav, tool }) {
  // Everything the calculator needs is inside this one function so the build
  // can lift it out of the shared bundle. Helpers come from the chunk prelude:
  // aaParseNum, AA_MONEY, AA_TOOL_INPUT, AA_TOOL_LABEL, aaSubmitLead,
  // aaBuildBrandedPdf, goContact, pathForPage.
  const DAY = 86400000;
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const utc = (s) => { if (!s) return null; const p = String(s).split('-').map(Number); if (p.length < 3 || !p[0] || !p[1] || !p[2]) return null; return Date.UTC(p[0], p[1] - 1, p[2]); };
  const dmy = (ts) => { const d = new Date(ts); return d.getUTCDate() + ' ' + MON[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); };
  const isoToday = () => { try { return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' }); } catch (e) { return new Date().toISOString().slice(0, 10); } };
  const pct = (x) => (x * 100).toFixed(2) + '%';

  // The formula. Each line maps to a clause listed in the sources block.
  const eosb = (p) => {
    const r = { eligible: false, frozen: false, total: 0 };
    let endTs = p.end;
    if (p.schemeJoin != null && p.schemeJoin < p.end) { endTs = p.schemeJoin; r.frozen = true; }   // CR 96/2023: Decree-Law accrual stops at joining
    r.calDays = Math.round((endTs - p.start) / DAY);
    r.days = Math.max(0, r.calDays - (p.unpaid || 0));                                         // Art. 51(4)
    r.years = r.days / 365;                                                                    // assumption: 365-day years
    r.daily = p.basic / 30;                                                                    // assumption: ÷30
    r.ratio = (p.hoursWeek != null && p.hoursWeek > 0) ? Math.min(p.hoursWeek / 48, 1) : 1;    // CR 1/2022 Art. 30
    r.payBy = p.end + 14 * DAY;                                                                // Art. 53
    if (r.days < 365) return r;                                                                // Art. 51(2): one year of continuous service
    r.eligible = true;
    r.firstYears = Math.min(r.years, 5); r.beyondYears = Math.max(r.years - 5, 0);              // Art. 51(2)(a),(b); 51(3)
    r.firstPortion = r.firstYears * 21 * r.daily;
    r.beyondPortion = r.beyondYears * 30 * r.daily;
    r.grossFT = r.firstPortion + r.beyondPortion;
    r.capFT = 24 * p.basic;                                                                    // Art. 51(6), conservative reading
    r.capped = r.grossFT > r.capFT;
    r.fullTime = Math.min(r.grossFT, r.capFT);
    r.gross = r.fullTime * r.ratio;
    r.deductions = Math.min(p.deductions || 0, r.gross);                                        // Art. 51(7)
    r.total = r.gross - r.deductions;
    r.provisionRate = r.years < 5 ? 21 / 30 / 12 : 30 / 30 / 12;                                // = 5.83% / 8.33%
    r.provisionMonthly = p.basic * r.provisionRate * r.ratio;
    r.alt = r.total * 30 / (365 / 12);                                                          // sensitivity: ÷30.4167
    return r;
  };

  const uid = React.useId();
  // Fixed example, not "today": the prerendered page and the live page must
  // agree at rest, and a static day-count would be stale the day after build.
  const [f, setF] = React.useState({ basic: '8,000', type: 'foreign', start: '2021-03-01', end: '2026-09-30', unpaid: '0', hours: '24', join: '', ded: '', company: '', name: '', email: '', phone: '', consent: false });
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [sentOk, setSentOk] = React.useState(true);
  const fired = React.useRef(false);
  const CALC_KEYS = ['basic', 'type', 'start', 'end', 'unpaid', 'hours', 'join', 'ded'];
  const upd = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setF((p) => ({ ...p, [k]: v }));
    // One event per visit, on the first input that changes the example.
    if (!fired.current && CALC_KEYS.indexOf(k) !== -1) { fired.current = true; if (window.gtag) window.gtag('event', 'tool_result', { tool: 'gratuity' }); }
  };
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const p = {
    type: f.type, basic: aaParseNum(f.basic), start: utc(f.start), end: utc(f.end), unpaid: aaParseNum(f.unpaid),
    hoursWeek: f.type === 'part' ? aaParseNum(f.hours) : null, schemeJoin: utc(f.join), deductions: aaParseNum(f.ded),
  };
  const national = f.type === 'national';
  const valid = !national && p.start != null && p.end != null && p.basic > 0 && p.end > p.start;
  const r = valid ? eosb(p) : null;

  const verdict = () => {
    if (!r) return { t: '—', b: '' };
    if (!r.eligible) return { t: 'No gratuity due yet — service under one year', b: 'Article 51(2) requires a year of continuous service before the entitlement begins' + (r.frozen ? ', counted to the date the employee joined the savings scheme' : '') + '. Unpaid absence does not count towards it (Article 51(4)). Wages and other entitlements are still payable within 14 days of the end date (Article 53).' };
    const parts = ['Service of ' + r.days.toLocaleString('en-US') + ' days — ' + r.years.toFixed(2) + ' years on a 365-day count — at a last basic wage of ' + AA_MONEY(p.basic) + '.',
      'First five years: ' + r.firstYears.toFixed(2) + ' years × 21 days × ' + AA_MONEY(r.daily) + ' a day = ' + AA_MONEY(r.firstPortion) + '.'];
    if (r.beyondYears > 0) parts.push('Beyond five: ' + r.beyondYears.toFixed(2) + ' years × 30 days × ' + AA_MONEY(r.daily) + ' = ' + AA_MONEY(r.beyondPortion) + '.');
    if (r.capped) parts.push('The Article 51(6) ceiling applies: 24 × basic wage = ' + AA_MONEY(r.capFT) + '.');
    if (r.ratio < 1) parts.push('Part-time ratio ' + (p.hoursWeek) + '/48 hours applied to the full-time figure (Cabinet Resolution 1 of 2022, Article 30).');
    if (r.deductions > 0) parts.push('Less lawful deductions of ' + AA_MONEY(r.deductions) + ' (Article 51(7)).');
    if (r.frozen) parts.push('Decree-Law accrual counted to the savings-scheme joining date, on the basic wage at that date (Cabinet Resolution 96 of 2023); contributions since then sit in the fund, outside this figure.');
    return { t: 'Gratuity payable: ' + AA_MONEY(r.total) + (r.capped ? ' (ceiling applied)' : ''), b: parts.join(' ') };
  };

  const handle = async () => {
    setErr('');
    if (!f.company.trim() || !f.name.trim() || !f.email.trim() || !f.phone.trim()) { setErr('Please complete company name, your name, email and phone.'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) { setErr('Please enter a valid work email.'); return; }
    if (!r) { setErr('Enter a basic wage and a start date before the end date first.'); return; }
    if (!f.consent) { setErr('Please confirm you agree to our Privacy Policy so we can prepare your statement.'); return; }
    setBusy(true);
    const v = verdict();
    try {
      let downloadDate = '';
      try { downloadDate = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' (GST)'; } catch (e) { downloadDate = new Date().toISOString(); }
      const pattern = f.type === 'part' ? 'Part-time, ' + f.hours + ' h/week' : 'Full-time';
      const inputs = [
        ['Last monthly basic wage', AA_MONEY(p.basic)],
        ['Service', dmy(p.start) + ' to ' + dmy(p.end)],
        ['Days of service counted', r.days.toLocaleString('en-US') + ' (' + r.years.toFixed(2) + ' years)'],
        ['Unpaid absence', p.unpaid ? p.unpaid + ' days' : 'None'],
        ['Work pattern', pattern],
        ['Savings scheme joined', p.schemeJoin != null ? dmy(p.schemeJoin) : 'No'],
        ['Lawful deductions', p.deductions ? AA_MONEY(p.deductions) : 'None'],
        ['Day-wage convention', 'Basic ÷ 30 (the Decree-Law states no divisor)'],
      ];
      const summary = ['Company: ' + f.company, 'Name: ' + f.name, 'Email: ' + f.email, 'Phone: ' + f.phone, 'Basic wage: ' + AA_MONEY(p.basic), 'Service: ' + dmy(p.start) + ' to ' + dmy(p.end), 'Days: ' + r.days, 'Years: ' + r.years.toFixed(2), 'Pattern: ' + pattern, 'Unpaid days: ' + (p.unpaid || 0), 'Scheme joined: ' + (p.schemeJoin != null ? dmy(p.schemeJoin) : 'No'), 'Deductions: ' + (p.deductions || 0), 'Gratuity: ' + AA_MONEY(r.total), 'Monthly accrual: ' + AA_MONEY(r.provisionMonthly), 'Verdict: ' + v.t, 'Downloaded: ' + downloadDate].join('\n');
      const sent = await aaSubmitLead({ type: 'Gratuity Calculation', company: f.company, name: f.name, email: f.email, phone: f.phone, basicWage: AA_MONEY(p.basic), serviceFrom: dmy(p.start), serviceTo: dmy(p.end), serviceDays: String(r.days), serviceYears: r.years.toFixed(2), workPattern: pattern, unpaidDays: String(p.unpaid || 0), schemeJoined: p.schemeJoin != null ? dmy(p.schemeJoin) : 'No', deductions: p.deductions ? AA_MONEY(p.deductions) : '', gratuity: AA_MONEY(r.total), provisionMonthly: AA_MONEY(r.provisionMonthly), verdict: v.t, downloadDate, summary, consent: 'Yes', consentAt: new Date().toISOString() });
      setSentOk(sent);
      if (window.gtag) window.gtag('event', 'generate_lead', { event_category: 'gratuity', event_label: r.eligible ? (r.capped ? 'capped' : 'payable') : 'under-one-year' });
      await aaBuildBrandedPdf({
        title: 'End-of-Service Gratuity Statement',
        subtitle: 'Federal Decree-Law No. 33 of 2021, Article 51 · indicative figures',
        forWho: 'Prepared for ' + f.company + '  ·  ' + f.name,
        stats: [
          { label: 'Gratuity payable', big: AA_MONEY(r.total), sub: r.eligible ? r.years.toFixed(2) + ' years of service' : 'under one year of service' },
          { label: 'Monthly accrual to book', big: AA_MONEY(r.provisionMonthly), sub: pct(r.provisionRate) + ' of basic wage' },
        ],
        verdictTitle: v.t, verdictBody: v.b,
        inputs,
        nextMoves: [
          'Book the accrual monthly — ' + pct(r.provisionRate) + ' of basic wage for this employee — so the liability is on the balance sheet before the leaver appears, and reconcile the provision to the payroll list at every year-end.',
          'Pay within 14 days of the end date (Article 53), together with wages, accrued leave and other entitlements; the pay-by date for this case is ' + dmy(r.payBy) + '.',
          'Keep the basic-wage history. The figure runs on the LAST basic wage (Article 51(5)), so a change in the final months moves the whole entitlement.',
        ],
        legal: 'Indicative calculation, not legal or tax advice. Federal Decree-Law No. 33 of 2021 fixes the entitlement in days of basic wage and does not state how a day is derived from a monthly wage; this statement applies the ÷30 convention, a ceiling of 24 × basic wage and 365-day years. The Ministry’s English texts are not official translations; the Arabic texts govern. DIFC and ADGM employers are outside this law.',
        fileName: 'UAE-Gratuity-Statement-' + (f.company || 'Report').replace(/[^A-Za-z0-9]+/g, '-') + '.pdf',
      });
    } catch (e) { setErr('Sorry — the statement could not be generated. Please try again or contact us.'); setBusy(false); return; }
    setBusy(false); setDone(true);
  };

  const Row = ({ k, v, strong }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: 13 }}>
      <span style={{ color: strong ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: strong ? 600 : 400 }}>{k}</span>
      <span className="mono" style={{ color: '#fff', fontWeight: strong ? 600 : 400, textAlign: 'right' }}>{v}</span>
    </div>
  );
  const Note = ({ warn, children }) => (
    <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55, padding: '9px 11px', borderLeft: '3px solid ' + (warn ? '#F0C265' : 'var(--aa-cyan)'), background: 'rgba(255,255,255,0.06)', color: '#fff' }}>{children}</div>
  );
  const dateStyle = { ...AA_TOOL_INPUT, fontFamily: 'var(--aa-font-mono)' };
  const numStyle = { ...AA_TOOL_INPUT, fontFamily: 'var(--aa-font-mono)' };
  const hint = (t) => <p style={{ fontSize: 11.5, color: 'var(--aa-steel)', margin: '5px 0 0', lineHeight: 1.45 }}>{t}</p>;

  return (
    <div>
      {/* ---- The calculator: inputs left, result right ---- */}
      <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
        <div style={{ padding: 32, borderRight: '1px solid var(--aa-rule)' }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Work it out</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label htmlFor={uid + '-basic'} style={AA_TOOL_LABEL}>Last monthly basic wage (AED)</label><input id={uid + '-basic'} style={numStyle} inputMode="numeric" value={f.basic} onChange={upd('basic')} placeholder="e.g. 8,000" />{hint('Basic only — allowances are excluded (Articles 1 and 51(5)).')}</div>
            <div><label htmlFor={uid + '-type'} style={AA_TOOL_LABEL}>Employee</label>
              <select id={uid + '-type'} style={AA_TOOL_INPUT} value={f.type} onChange={upd('type')}>
                <option value="foreign">Foreign worker, full-time</option>
                <option value="part">Foreign worker, part-time or job-share</option>
                <option value="national">UAE national</option>
              </select>{hint('UAE nationals come under the pension legislation (Article 51(1)).')}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
            <div><label htmlFor={uid + '-start'} style={AA_TOOL_LABEL}>First day of service</label><input id={uid + '-start'} type="date" style={dateStyle} value={f.start} onChange={upd('start')} /></div>
            <div>
              <label htmlFor={uid + '-end'} style={{ ...AA_TOOL_LABEL, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span>Last day of service</span>
                <button type="button" onClick={() => setF((s) => ({ ...s, end: isoToday() }))} style={{ background: 'none', border: 0, padding: 0, color: 'var(--aa-cyan)', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Use today</button>
              </label>
              <input id={uid + '-end'} type="date" style={dateStyle} value={f.end} onChange={upd('end')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
            <div><label htmlFor={uid + '-unpaid'} style={AA_TOOL_LABEL}>Unpaid absence (days)</label><input id={uid + '-unpaid'} style={numStyle} inputMode="numeric" value={f.unpaid} onChange={upd('unpaid')} placeholder="0" />{hint('Not counted as service (Article 51(4)).')}</div>
            {f.type === 'part' ? (
              <div><label htmlFor={uid + '-hours'} style={AA_TOOL_LABEL}>Contracted hours per week</label><input id={uid + '-hours'} style={numStyle} inputMode="numeric" value={f.hours} onChange={upd('hours')} placeholder="e.g. 24" />{hint('Ratio to the 48-hour full-time week (Cabinet Resolution 1 of 2022, Article 30).')}</div>
            ) : (
              <div><label htmlFor={uid + '-join'} style={AA_TOOL_LABEL}>Joined the savings scheme on</label><input id={uid + '-join'} type="date" style={dateStyle} value={f.join} onChange={upd('join')} />{hint('Optional. Freezes Decree-Law accrual at this date (Cabinet Resolution 96 of 2023).')}</div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
            {f.type === 'part' ? (
              <div><label htmlFor={uid + '-join2'} style={AA_TOOL_LABEL}>Joined the savings scheme on</label><input id={uid + '-join2'} type="date" style={dateStyle} value={f.join} onChange={upd('join')} />{hint('Optional (Cabinet Resolution 96 of 2023).')}</div>
            ) : null}
            <div><label htmlFor={uid + '-ded'} style={AA_TOOL_LABEL}>Lawfully deductible amounts (AED)</label><input id={uid + '-ded'} style={numStyle} inputMode="numeric" value={f.ded} onChange={upd('ded')} placeholder="0" />{hint('Optional — loans, overpayments, court debts (Article 51(7); Cabinet Resolution 1 of 2022, Article 29).')}</div>
          </div>
          <p style={{ margin: '18px 0 0', fontSize: 12.5, color: 'var(--aa-steel)', lineHeight: 1.5 }}>
            The figures shown are an invented example until you change them. Nothing you type leaves your browser unless you ask for the statement below.
          </p>
        </div>

        <div style={{ padding: 32, background: 'var(--aa-charcoal)', color: '#fff', minHeight: 320 }} aria-live="polite">
          {national ? (
            <div>
              <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 10 }}>Result</div>
              <div style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', fontSize: 26, lineHeight: 1.1 }}>Pension, not gratuity</div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>Article 51(1): a national worker’s end-of-service benefit is governed by the pension and social-security legislation, not by the 21- and 30-day rule. There is nothing to compute here.</p>
            </div>
          ) : !r ? (
            <div>
              <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 10 }}>Gratuity payable</div>
              <div className="mono" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.05 }}>—</div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>Enter a basic wage and a start date before the end date.</p>
            </div>
          ) : (
            <div>
              <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 10 }}>Gratuity payable</div>
              <div className="mono" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.05 }}>{AA_MONEY(r.total)}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
                {r.days.toLocaleString('en-US')} days of service · {r.years.toFixed(2)} years · a day = {AA_MONEY(r.daily)} (basic ÷ 30){r.frozen ? ' · accrual frozen at scheme joining' : ''}
              </div>
              <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.14)' }}>
                {r.eligible ? (
                  <div>
                    <Row k={'First five years · ' + r.firstYears.toFixed(2) + ' yrs × 21 days'} v={AA_MONEY(r.firstPortion)} />
                    {r.beyondYears > 0 ? <Row k={'Beyond five · ' + r.beyondYears.toFixed(2) + ' yrs × 30 days'} v={AA_MONEY(r.beyondPortion)} /> : null}
                    {r.capped ? <Row k="Ceiling · 24 × basic wage (Art. 51(6))" v={AA_MONEY(r.capFT)} /> : null}
                    {r.ratio < 1 ? <Row k={'Part-time ratio · ' + p.hoursWeek + '/48 hours'} v={'× ' + r.ratio.toFixed(3)} /> : null}
                    {r.deductions > 0 ? <Row k="Deductions (Art. 51(7))" v={'− ' + AA_MONEY(r.deductions)} /> : null}
                    <Row k="Net payable" v={AA_MONEY(r.total)} strong />
                    <Row k="Pay by (Art. 53)" v={dmy(r.payBy)} />
                    <Row k="Accrual to book each month" v={AA_MONEY(r.provisionMonthly) + ' · ' + pct(r.provisionRate)} />
                    <Row k="At ÷ 30.4167 instead of ÷ 30" v={AA_MONEY(r.alt)} />
                  </div>
                ) : (
                  <div>
                    <Row k="Service under one year" v="nil" strong />
                    <Row k="Wages and entitlements due by (Art. 53)" v={dmy(r.payBy)} />
                  </div>
                )}
              </div>
              {!r.eligible ? <Note warn>Article 51(2): the entitlement begins once a year of continuous service is complete{r.frozen ? ' — counted to the scheme joining date' : ''}. Unpaid absence does not count (Article 51(4)).</Note> : null}
              {r.capped ? <Note warn>Ceiling reached. Article 51(6) says “two years’ wage” — the defined term that includes allowances — so the true ceiling may be higher than 24 × basic. Shown at the conservative reading.</Note> : null}
              {r.frozen ? <Note>Savings scheme: Decree-Law accrual counted to the joining date, on the basic wage at that date (Cabinet Resolution 96 of 2023). Contributions since then sit in the fund, outside this figure.</Note> : null}
              <Note>No reduction for resignation: Federal Decree-Law No. 33 of 2021 contains none (Article 51(2)).</Note>
            </div>
          )}
        </div>
      </div>

      {/* ---- Employer statement: the provision, then the PDF behind the form ---- */}
      <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 0, border: '1px solid var(--aa-rule)', borderTop: 0, background: 'var(--aa-surface-off)' }}>
        <div style={{ padding: 32, borderRight: '1px solid var(--aa-rule)' }}>
          <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>If you are the employer</div>
          <h3 style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', fontSize: 24, letterSpacing: '0.01em', margin: '0 0 12px', color: 'var(--aa-charcoal)', lineHeight: 1.1 }}>Book it monthly, not on the leaving day.</h3>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--aa-charcoal-800)', margin: '0 0 12px' }}>
            The liability grows every month the employee stays: 21/30 of a month’s basic wage a year for the first five years, a full month a year after that — {'5.83% and 8.33% of basic wage a month'}, the same fractions Cabinet Resolution 96 of 2023 sets as savings-scheme contributions. Accrue it, and the year-end provision reconciles to the payroll list instead of surprising the accounts.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--aa-charcoal-800)', margin: 0 }}>
            The statement puts this case on one page — the figure, the breakdown by article, the pay-by date and the monthly accrual — for the file. If you are the employee, the figure above is yours to use; no form needed.
          </p>
          <p style={{ margin: '18px 0 0', fontSize: 14 }}>
            We run payroll, the end-of-service provision and the year-end schedule as part of bookkeeping. <a href={pathForPage('contact')} onClick={(e) => { e.preventDefault(); goContact(tool.intent, onNav); }} style={{ color: 'var(--aa-cyan)', fontWeight: 600, textDecoration: 'none' }}>Talk to us →</a>
          </p>
        </div>
        <div style={{ padding: 32, background: '#fff' }}>
          {done ? (
            <div>
              <i data-lucide="check-circle-2" style={{ width: 34, height: 34, color: 'var(--aa-cyan)' }}></i>
              <h3 style={{ fontFamily: 'var(--aa-font-display)', textTransform: 'uppercase', fontSize: 22, letterSpacing: '0.01em', margin: '14px 0 8px', color: 'var(--aa-charcoal)' }}>Statement downloading</h3>
              <p style={{ color: 'var(--aa-charcoal-800)', fontSize: 14, lineHeight: 1.6 }}>{sentOk ? 'Your end-of-service statement is downloading now. We’ve received your details — the team will be in touch, or reach us on WhatsApp.' : 'Your statement is downloading now. We could not confirm your details reached us — please WhatsApp us on +971 56 548 4635 so we can follow up.'}</p>
              <button className="btn btn--primary btn--sm" style={{ marginTop: 16 }} onClick={() => goContact(tool.intent, onNav)}>Book a scoping call <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i></button>
            </div>
          ) : (
            <div>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 14 }}>Employer statement (PDF)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label htmlFor={uid + '-company'} style={AA_TOOL_LABEL}>Company name *</label><input id={uid + '-company'} autoComplete="organization" style={AA_TOOL_INPUT} value={f.company} onChange={upd('company')} placeholder="Your company" /></div>
                <div><label htmlFor={uid + '-name'} style={AA_TOOL_LABEL}>Your name *</label><input id={uid + '-name'} autoComplete="name" style={AA_TOOL_INPUT} value={f.name} onChange={upd('name')} placeholder="Full name" /></div>
                <div><label htmlFor={uid + '-email'} style={AA_TOOL_LABEL}>Work email *</label><input id={uid + '-email'} type="email" autoComplete="email" style={AA_TOOL_INPUT} value={f.email} onChange={upd('email')} placeholder="name@company.ae" /></div>
                <div><label htmlFor={uid + '-phone'} style={AA_TOOL_LABEL}>Phone / WhatsApp *</label><input id={uid + '-phone'} type="tel" autoComplete="tel" style={AA_TOOL_INPUT} value={f.phone} onChange={upd('phone')} placeholder="+971 …" /></div>
              </div>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5, color: 'var(--aa-charcoal-800)', lineHeight: 1.5, cursor: 'pointer', margin: '14px 0' }}>
                <input type="checkbox" checked={f.consent} onChange={upd('consent')} style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0 }} />
                <span>I agree to Authentic Accounting using my details to prepare this statement and follow up, as described in the <a href={pathForPage('privacy')} onClick={(e) => { e.preventDefault(); onNav('privacy'); }} style={{ color: 'var(--aa-cyan)', fontWeight: 600 }}>Privacy Policy</a>. *</span>
              </label>
              <button className="btn btn--primary" onClick={handle} disabled={busy}>
                {busy ? 'Generating…' : 'Get the statement (PDF)'}
                <i data-lucide="download" style={{ width: 16, height: 16 }}></i>
              </button>
              {err ? <p role="alert" style={{ color: '#B42318', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>{err}</p> : null}
              <p style={{ color: 'var(--aa-steel)', fontSize: 11, marginTop: 14, lineHeight: 1.5 }}>Indicative calculation · instant PDF · not legal or tax advice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VatToolBody({ onNav, tool }) {
  // Integer fils throughout — no floating-point rounding surprises — with the
  // FTA's half-up tie-break. Helpers come from the chunk prelude: AA_TOOL_INPUT,
  // AA_TOOL_LABEL, goContact, pathForPage.
  const toFils = (s) => { const n = parseFloat(String(s).replace(/[^0-9.]/g, '')); return isFinite(n) ? Math.round(n * 100) : NaN; };
  const addVat = (net) => { const vat = Math.floor((net * 5 + 50) / 100); return { net, vat, gross: net + vat, tie: (net * 5) % 100 === 50 }; };       // Art. 3: 5% of the value; half up (VATG001 §12.3.4)
  const extractVat = (gross) => { const vat = Math.floor((gross * 10 + 105) / 210); return { gross, vat, net: gross - vat, tie: false }; };            // Art. 34(1): value = consideration less tax → VAT = gross × 5/105 = gross ÷ 21
  const aed = (f) => 'AED ' + Math.floor(f / 100).toLocaleString('en-US') + '.' + String(f % 100).padStart(2, '0');
  const plain = (f) => (f / 100).toFixed(2);

  const uid = React.useId();
  // Fixed example at rest — the FTA's own worked example (AED 220 including VAT).
  const [mode, setMode] = React.useState('extract');
  const [amt, setAmt] = React.useState('220.00');
  const fired = React.useRef(false);
  const touch = () => { if (!fired.current) { fired.current = true; if (window.gtag) window.gtag('event', 'tool_result', { tool: 'vat' }); } };
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const f = toFils(amt);
  const valid = !isNaN(f) && f >= 0;
  const r = valid ? (mode === 'add' ? addVat(f) : extractVat(f)) : null;
  const exact = r ? (mode === 'add' ? r.net * 5 / 10000 : r.gross / 21 / 100) : 0;

  const Row = ({ k, v, strong }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: 13.5 }}>
      <span style={{ color: strong ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: strong ? 600 : 400 }}>{k}</span>
      <span className="mono" style={{ color: '#fff', fontWeight: strong ? 600 : 400 }}>{v}</span>
    </div>
  );
  const Note = ({ warn, children }) => (
    <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55, padding: '9px 11px', borderLeft: '3px solid ' + (warn ? '#F0C265' : 'var(--aa-cyan)'), background: 'rgba(255,255,255,0.06)', color: '#fff' }}>{children}</div>
  );
  const hint = (t) => <p style={{ fontSize: 11.5, color: 'var(--aa-steel)', margin: '5px 0 0', lineHeight: 1.45 }}>{t}</p>;
  const formulaLines = !r ? [] : mode === 'add'
    ? ['VAT   = net × 5 ÷ 100   = ' + plain(r.net) + ' × 0.05 = ' + exact.toFixed(4) + ' → ' + plain(r.vat),
       'Gross = net + VAT        = ' + plain(r.net) + ' + ' + plain(r.vat) + ' = ' + plain(r.gross),
       'Excel   =ROUND(A2*5%,2)']
    : ['VAT = gross × 5 ÷ 105 = gross ÷ 21 = ' + plain(r.gross) + ' ÷ 21 = ' + exact.toFixed(4) + ' → ' + plain(r.vat),
       'Net = gross − VAT       = ' + plain(r.gross) + ' − ' + plain(r.vat) + ' = ' + plain(r.net),
       'Excel   =ROUND(A2/21,2)   =A2-ROUND(A2/21,2)'];

  return (
    <div>
      <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
        <div style={{ padding: 32, borderRight: '1px solid var(--aa-rule)' }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Work it out</div>
          <label htmlFor={uid + '-mode'} style={AA_TOOL_LABEL}>What do you have?</label>
          <select id={uid + '-mode'} style={AA_TOOL_INPUT} value={mode} onChange={(e) => { setMode(e.target.value); touch(); }}>
            <option value="extract">A gross amount — take the VAT out</option>
            <option value="add">A net amount — add 5%</option>
          </select>
          {hint('An advertised or published price is a gross amount by law (Article 38), so “take the VAT out” is the mode that matches a price tag.')}
          <div style={{ marginTop: 16 }}>
            <label htmlFor={uid + '-amt'} style={AA_TOOL_LABEL}>Amount (AED)</label>
            <input id={uid + '-amt'} style={{ ...AA_TOOL_INPUT, fontFamily: 'var(--aa-font-mono)', fontSize: 18 }} inputMode="decimal" value={amt} onChange={(e) => { setAmt(e.target.value); touch(); }} placeholder="e.g. 1,050.00" />
            {hint('Dirhams, to two decimals. Another currency converts at the Central Bank rate on the date of supply first (Article 69).')}
          </div>
          {r ? (
            <div className="mono" style={{ marginTop: 18, fontSize: 12.5, lineHeight: 1.75, background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: '12px 14px', whiteSpace: 'pre-wrap', color: 'var(--aa-charcoal-800)' }}>
              {formulaLines.join('\n')}
            </div>
          ) : null}
          <p style={{ margin: '16px 0 0', fontSize: 12.5, color: 'var(--aa-steel)', lineHeight: 1.5 }}>
            The figures shown are the FTA’s own worked example until you change them. Nothing you type leaves your browser.
          </p>
        </div>

        <div style={{ padding: 32, background: 'var(--aa-charcoal)', color: '#fff', minHeight: 300 }} aria-live="polite">
          {!r ? (
            <div>
              <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 10 }}>VAT</div>
              <div className="mono" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.05 }}>—</div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>Enter an amount in dirhams.</p>
            </div>
          ) : (
            <div>
              <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 10 }}>{mode === 'add' ? 'VAT to add' : 'VAT inside the amount'}</div>
              <div className="mono" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.05 }}>{aed(r.vat)}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
                {mode === 'add' ? 'on a net amount of ' + aed(r.net) : 'in a gross amount of ' + aed(r.gross)} · rounded half up to the fils
              </div>
              <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.14)' }}>
                <Row k="Net — the value of the supply (Art. 34(1))" v={aed(r.net)} />
                <Row k="VAT at 5% (Art. 3)" v={aed(r.vat)} />
                <Row k="Gross — the consideration" v={aed(r.gross)} strong />
              </div>
              {r.tie ? <Note warn>Exact half-fils: 5% of {aed(r.net)} is {exact.toFixed(3)}. Half up takes it to {aed(r.vat)}, the FTA’s stated tie-break; banker’s rounding would give {aed(r.vat - ((r.vat % 2) ? 1 : 0))}, which is why tools can differ by one fils on cases like this.</Note> : null}
              <Note>Rounding to the nearest fils is permitted by Article 61 of the Executive Regulation and expected by the FTA. The other side is derived from the rounded VAT, so the three figures always re-add.</Note>
            </div>
          )}
        </div>
      </div>

      <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 0, border: '1px solid var(--aa-rule)', borderTop: 0, background: 'var(--aa-surface-off)' }}>
        <div style={{ padding: 32, borderRight: '1px solid var(--aa-rule)' }}>
          <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>One amount at a time, on purpose</div>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--aa-charcoal-800)', margin: '0 0 12px' }}>
            On a full tax invoice on paper, the FTA’s Public Clarification VATP006 calculates the tax line by line and rounds each line. On an electronic invoice, the Ministry of Finance’s June 2026 guidelines round at the invoice-level total only. Three lines of AED 33.33 give AED 5.01 one way and AED 5.00 the other. An invoice mode that carries both conventions is the next thing this page will do; until then it computes one amount and shows every step.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--aa-charcoal-800)', margin: 0 }}>
            The FTA’s own website has a two-field calculator that adds 5% or extracts 5/105. It shows the figures; this page shows the working and the sources. Neither is “approved” — the arithmetic follows from Articles 3 and 34(1).
          </p>
        </div>
        <div style={{ padding: 32, background: '#fff' }}>
          <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>If the invoices are yours to file</div>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--aa-charcoal-800)', margin: '0 0 16px' }}>
            The sum is the easy part. The return is the VAT on every line of every invoice, reconciled to the books, filed within 28 days of the period end. We run that cycle as a partner-reviewed quarterly engagement.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a className="btn btn--primary" href={pathForPage('service-vat-filing')} onClick={(e) => { e.preventDefault(); onNav('service-vat-filing'); }}>VAT return filing <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i></a>
            <a className="btn btn--ghost" href={pathForPage('service-vat')} onClick={(e) => { e.preventDefault(); onNav('service-vat'); }}>Do I need to register?</a>
          </div>
          <p style={{ margin: '16px 0 0', fontSize: 13 }}>
            Or <a href={pathForPage('contact')} onClick={(e) => { e.preventDefault(); goContact(tool.intent, onNav); }} style={{ color: 'var(--aa-cyan)', fontWeight: 600, textDecoration: 'none' }}>talk to us →</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Registry: slug -> body. scripts/build.mjs reads this to split each body into
// dist/tools/<slug>.<hash>.js and replaces it with a proxy over the chunks
// that have registered at runtime. Keep the quoting exactly like this.
const TOOL_BODIES = {
  'gratuity-calculator': GratuityToolBody,
  'vat-calculator': VatToolBody,
};

Object.assign(window, { ToolsHubPage, ToolPage });
