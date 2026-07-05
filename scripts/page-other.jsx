// Industries, About, Insights list, Insight article, Careers, Contact pages
const { useState: useStateP } = React;
const { pathForPage, pathForInsight, insightBySlug, INSIGHTS, DEFAULT_INSIGHT } = window.AARoutes;
const { LucideHost } = window;

// ---------- Industries ----------
function IndustriesPage({ onNav }) {
  const sectors = [
  { id: 'gov', n: '01', t: 'Government & public sector',
    d: 'Statutory filings, regulatory submissions and Auditor General queries. We work to public-sector procurement standards and clearance protocols.',
    tags: ['Statutory', 'Procurement', 'Performance audit'],
    cases: ['Federal entity · 18-month statutory remediation', 'Emirate authority · annual statutory'] },
  { id: 'ent', n: '02', t: 'Large enterprises',
    d: 'Group consolidations, Corporate Tax compliance and M&A advisory. Custom controls per legal entity, with intercompany elimination logs.',
    tags: ['Consolidation', 'CT', 'M&A', 'Group reporting'],
    cases: ['Listed industrial · CT-FY26 first filing', 'Diversified holding · 14-entity consolidation'] },
  { id: 'sme', n: '03', t: 'SMEs & family offices',
    d: 'Outsourced finance function, VAT and on-demand advisory. The same control framework, scaled to the engagement.',
    tags: ['Outsourced finance', 'VAT', 'Advisory'],
    cases: ['Trading SME · monthly close + VAT', 'Family office · valuation & restructuring'] },
  { id: 'fin', n: '04', t: 'Financial services',
    d: 'SCA / CBUAE-regulated entities, asset managers and insurers. Controls attestation and risk-and-control matrix design.',
    tags: ['SCA', 'CBUAE', 'Controls attestation'],
    cases: ['Category-3 broker · controls report', 'Insurance MGA · group consolidation'] },
  { id: 're', n: '05', t: 'Real estate & construction',
    d: 'Revenue recognition under IFRS 15, project costing, lease accounting and developer-side valuation work.',
    tags: ['IFRS 15', 'Project costing', 'Valuation'],
    cases: ['Master developer · IFRS 15 conversion', 'Contractor · cost-overrun review'] },
  { id: 'hc', n: '06', t: 'Healthcare & education',
    d: 'Regulatory cost reporting, funder reconciliation and DOH / KHDA compliance support.',
    tags: ['DOH', 'KHDA', 'Funder reporting'],
    cases: ['Hospital group · DOH cost reporting', 'School operator · KHDA submission'] }];

  return (
    <div>
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '64px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Industries</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0
              }}>
                Sector-shaped,<br />but never<br />
                <span style={{ color: 'var(--aa-cyan-700)' }}>sector-bound</span>.
              </h1>
            </div>
            <p className="muted" style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 460, margin: 0 }}>
              We have institutional depth in six sectors. The control framework is shared; the regulatory landscape and the disclosure language change.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {sectors.map((s, i) =>
          <div key={s.id} style={{
            display: 'grid',
            gridTemplateColumns: '80px 1.2fr 2fr 1fr',
            gap: 32, padding: '40px 0',
            borderTop: i === 0 ? '2px solid var(--aa-charcoal)' : '1px solid var(--aa-rule)',
            alignItems: 'start'
          }}>
              <div className="mono" style={{ fontSize: 14, color: 'var(--aa-steel)', paddingTop: 6 }}>{s.n}</div>
              <div>
                <div style={{ fontFamily: 'var(--aa-font-display)', fontWeight: 700, fontSize: 26, textTransform: 'uppercase', letterSpacing: '0.01em', color: 'var(--aa-charcoal)', lineHeight: 1.15 }}>{s.t}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                  {s.tags.map((tg) => <span key={tg} className="pill pill--charcoal">{tg}</span>)}
                </div>
              </div>
              <div style={{ fontSize: 15, color: 'var(--aa-steel-700)', lineHeight: 1.6 }}>{s.d}</div>
              <div>
                <div className="eyebrow eyebrow--steel" style={{ fontSize: 11, marginBottom: 10 }}>Recent</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--aa-charcoal)' }}>
                  {s.cases.map((c) => <div key={c}>· {c}</div>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Industry landing pages */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head"><div className="section-head__eyebrow">Industries we serve</div><h2>Accounting, shaped to your sector.</h2></div>
          <div className="aa-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {[
              ['industry-real-estate', 'Real estate & property', 'Developers, property and jointly-owned-property managers — IFRS 15, service charges and escrow.'],
              ['industry-construction', 'Construction & contracting', 'Over-time revenue, work-in-progress, retention and project costing.'],
              ['industry-trading', 'Trading & distribution', 'Inventory and COGS, import/export VAT and margin you can see.'],
              ['industry-hospitality', 'Hospitality, F&B & restaurants', 'Multi-outlet consolidation, daily reconciliation and food-cost control.'],
              ['industry-ecommerce', 'E-commerce & retail', 'Gateway and marketplace reconciliation and multi-channel VAT.'],
              ['industry-manufacturing', 'Manufacturing', 'Cost accounting, inventory valuation and fixed-asset discipline.'],
            ].map(([pg, t, d], i) => (
              <a key={pg} href={pathForPage(pg)} onClick={(e) => { e.preventDefault(); onNav(pg); }}
                style={{ textDecoration: 'none', color: 'inherit', padding: 28, borderRight: (i % 3 !== 2) ? '1px solid var(--aa-rule)' : 'none', borderTop: i >= 3 ? '1px solid var(--aa-rule)' : 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{d}</div>
                <div style={{ marginTop: 'auto', paddingTop: 10, color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 13 }}>Explore →</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>);

}

// ---------- About ----------
function AboutPage({ onNav }) {
  const team = [
  { name: 'Jinu Govindan', role: 'Founder Director', bio: 'M.Com · CMA. Management consultant, trainer and subject matter expert in Accounting, Financial Management, Taxation and Strategic Planning. 20 years in UAE across Trading, Construction, Manufacturing, Media, Holding Companies and Hospitality.' },
  { name: 'Sabith Abdul Rahman', role: 'Director — CFO Services', bio: 'CMA · MBA (Finance). Senior finance leader with 28+ years in the UAE and GCC, including multiple Group CFO roles across Manufacturing, Construction, Facilities Management and Trading. Expert in financial strategy, FP&A, treasury and IFRS reporting — strong controls and value-creation focus.' },
  { name: 'Johncy Mathew', role: 'Relationships Manager', bio: 'B.Com. Dual marketing-and-finance leader with 20+ years across the Gulf in retail and corporate marketing. Commands brand strategy, go-to-market planning and client relationship management while owning the commercial numbers behind them — marketing budgets, P&L, pricing and ROI. Pairs financial discipline with market insight to convert spend into measurable demand and durable positioning.' },
  { name: 'Jinu Kurikesu', role: 'Audit Manager', bio: 'CMA. Finance professional with 8+ years heading Accounts, Finance and Corporate divisions. Expert in Construction, Manufacturing, Retail and Trading industries.' },
  { name: 'CA Kiran Prasad S', role: 'Accounts, Audit & Taxation Manager', bio: 'B.Com · ACA. 10+ years across accounting, auditing and taxation. 3 years Big 4 experience at KPMG in Audit (Wealth and Asset Management) — disciplined risk and controls focus.' },
  { name: 'Ratheesh Manoharan', role: 'Manager · IT Operations', bio: 'ITIL V3 Certified Professional. IT Service Delivery Management, Quality Assurance, Design and Implementations.' }];

  return (
    <div>
      <section className="aa-hero-image" style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--aa-rule)', padding: '88px 0 96px' }}>
        <div
          className="aa-hero-image__bg"
          role="img"
          aria-label="A row of distinct crystal chess pieces aligned on polished marble — many engagements, one framework"
          style={{ backgroundImage: "url('assets/images/chess-row.jpg')" }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--aa-cyan-200)' }}>About the firm</div>
          <h1 style={{
            fontFamily: 'var(--aa-font-display)', fontWeight: 700,
            fontSize: 'clamp(44px, 6vw, 80px)',
            textTransform: 'uppercase', letterSpacing: '0.005em',
            margin: 0, color: '#fff', lineHeight: 1.0, maxWidth: 1100, textWrap: 'balance'
          }}>
            Many hands. One framework.<br />Built on <span style={{ color: 'var(--aa-cyan)' }}>controls</span>.
          </h1>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, marginTop: 48 }}>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>
              Authentic Accounting and Bookkeeping L.L.C was founded in 2017 to do compliance and advisory the way an audit committee would want it done — written down, reviewed twice, archived in full. Nine years on, we deliver a thousand-plus engagements a year against the same control framework that started us.
            </p>
            <div style={{ borderTop: '2px solid var(--aa-cyan)', paddingTop: 18 }}>
              <div className="eyebrow" style={{ marginBottom: 12, color: 'var(--aa-cyan-200)' }}>Operating principles</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.88)' }}>
                <li>· One control framework, scaled to the engagement.</li>
                <li>· Two-line review on every deliverable.</li>
                <li>· Position memos for every contested item.</li>
                <li>· Closeout packs archived for the statutory period.</li>
                <li>· Independence register reviewed quarterly.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">Trajectory</div>
            <h2>Nine years, no shortcuts.</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 24, height: 1, background: 'var(--aa-rule-strong)' }}></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
              {[
              ['2017', 'Founded', 'Single-partner firm in Dubai. First retained client: a logistics SME.'],
              ['2018', 'VAT launch', 'UAE introduces 5% VAT. We file 70 first-quarter returns.'],
              ['2024', 'CT readiness', 'UAE Corporate Tax registration and first-period filing get under way across our client base.'],
              ['2026', '1,200+', 'TTM engagements cross 1,200. Serving clients across all seven emirates of the UAE.']].
              map(([yr, t, d]) =>
              <div key={yr}>
                  <div style={{ width: 12, height: 12, background: 'var(--aa-cyan)', borderRadius: '50%', marginBottom: 18, position: 'relative', zIndex: 1, border: '3px solid var(--aa-surface-off)' }}></div>
                  <div className="mono" style={{ fontSize: 13, color: 'var(--aa-cyan-700)', fontWeight: 600 }}>{yr}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--aa-charcoal)', marginTop: 6 }}>{t}</div>
                  <div style={{ fontSize: 12, color: 'var(--aa-steel-700)', marginTop: 6, lineHeight: 1.5 }}>{d}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__eyebrow">Partner & directors</div>
            <h2>The people who sign the work.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid var(--aa-rule)', borderLeft: '1px solid var(--aa-rule)' }}>
            {team.map((p) =>
            <div key={p.name} style={{
              padding: 28,
              borderRight: '1px solid var(--aa-rule)',
              borderBottom: '1px solid var(--aa-rule)',
              display: 'flex', flexDirection: 'column', gap: 16,
              minHeight: 240, background: '#fff'
            }}>
                <div style={{
                width: 64, height: 64,
                background: 'var(--aa-charcoal)',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--aa-font-display)', fontWeight: 700, fontSize: 22,
                letterSpacing: '0.04em'
              }}>
                  {p.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{p.name}</div>
                  <div className="eyebrow eyebrow--steel" style={{ fontSize: 11, marginTop: 4 }}>{p.role}</div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{p.bio}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quality */}
      <section className="section section--dark">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64 }}>
          <div>
            <div className="eyebrow eyebrow--cyan-light" style={{ marginBottom: 16 }}>Quality function</div>
            <h2 style={{
              fontFamily: 'var(--aa-font-display)', fontWeight: 700, color: '#fff',
              fontSize: 'clamp(32px, 4vw, 48px)', textTransform: 'uppercase',
              letterSpacing: '0.01em', margin: 0, lineHeight: 1.05
            }}>
              An internal second line that owns standards.
            </h2>
            <p style={{ marginTop: 20, fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Independence register, engagement standards, file retention and review cadence are owned by a director-led quality function — separate from delivery.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,255,255,0.08)' }}>
            {[
            ['Engagement Standards Manual', 'v3.4 · 2026'],
            ['Independence policy', 'Reviewed quarterly'],
            ['File retention', '5 years (statutory)'],
            ['Quality monitoring', 'Annual cold-file review'],
            ['Whistleblower channel', 'Independent third party']].
            map(([k, v]) =>
            <div key={k} style={{ background: 'var(--aa-charcoal)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#fff', fontWeight: 500 }}>{k}</span>
                <span style={{ color: 'var(--aa-cyan-200)', fontFamily: 'var(--aa-font-mono)', fontSize: 13 }}>{v}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>);

}

// ---------- Insights list ----------
const INSIGHT_MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
function insightTime(d) {
  const p = String(d || '').split(' ');
  return new Date(parseInt(p[2], 10) || 2017, INSIGHT_MONTHS[p[1]] || 0, parseInt(p[0], 10) || 1).getTime();
}

function InsightsPage({ onNav }) {
  const articles = INSIGHTS.filter((a) => a.published).slice().sort((a, b) => insightTime(b.date) - insightTime(a.date));

  const [filter, setFilter] = useStateP('All');
  const tags = ['All', 'Corporate Tax', 'VAT', 'E-Invoicing', 'Bookkeeping', 'Financial Reporting', 'Advisory', 'Valuations', 'M&A', 'Controls'];
  const list = filter === 'All' ? articles : articles.filter((a) => a.tag === filter);

  const featured = articles[0];
  const openInsight = (e, slug) => { e.preventDefault(); onNav('insight', slug); };

  return (
    <div>
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '64px 0 56px' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Insights</div>
          <h1 style={{
            fontFamily: 'var(--aa-font-display)', fontWeight: 700,
            fontSize: 'clamp(44px, 6vw, 72px)',
            textTransform: 'uppercase', letterSpacing: '0.01em',
            margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0
          }}>
            Notes from the desk.
          </h1>
          <p className="muted" style={{ fontSize: 17, lineHeight: 1.6, marginTop: 24, maxWidth: 720 }}>
            Working notes on regulation, controls and practice. Written by the partner and directors for finance teams, Boards, and counsel.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="section">
        <div className="container">
          <a href={pathForInsight(featured.slug)} onClick={(e) => openInsight(e, featured.slug)}
            aria-label={'Featured note: ' + featured.title} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
            border: '1px solid var(--aa-rule)', textDecoration: 'none', color: 'inherit',
            background: '#fff'
          }}>
            <div style={{
              background: 'var(--aa-charcoal)',
              padding: 56,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              minHeight: 360,
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 8 }}>
                <span className="pill" style={{ background: 'rgba(41,171,226,0.2)', color: 'var(--aa-cyan-200)', borderColor: 'transparent' }}>Featured</span>
              </div>
              {/* big number-style watermark */}
              <div aria-hidden="true" style={{
                position: 'absolute', right: -20, bottom: -40,
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 280, color: 'rgba(41,171,226,0.08)', lineHeight: 0.85
              }}>9%</div>
              <div className="eyebrow" style={{ color: 'var(--aa-cyan)', position: 'relative' }}>{featured.tag} · {featured.date}</div>
              <div style={{ position: 'relative' }}>
                <div style={{ fontFamily: 'var(--aa-font-display)', fontWeight: 700, fontSize: 36, textTransform: 'uppercase', letterSpacing: '0.01em', color: '#fff', lineHeight: 1.1, textWrap: 'balance' }}>
                  {featured.title}
                </div>
                <div style={{ marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'flex', gap: 16 }}>
                  <span>By {featured.author}</span>
                  <span>{featured.read} read</span>
                </div>
              </div>
            </div>
            <div style={{ padding: 56, display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
              <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--aa-charcoal-800)', margin: 0 }}>
                {featured.excerpt}
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <span className="pill pill--charcoal">QFZP</span>
                <span className="pill pill--charcoal">Substance</span>
                <span className="pill pill--charcoal">De minimis</span>
              </div>
              <span style={{ marginTop: 16, color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14 }}>Read the full note →</span>
            </div>
          </a>
        </div>
      </section>

      {/* Filter + grid */}
      <section className="section section--off">
        <div className="container">
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {tags.map((t) =>
            <button key={t} onClick={() => setFilter(t)} aria-pressed={filter === t} style={{
              padding: '8px 14px', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
              fontWeight: 600, fontFamily: 'var(--aa-font-sans)',
              background: filter === t ? 'var(--aa-charcoal)' : '#fff',
              color: filter === t ? '#fff' : 'var(--aa-charcoal)',
              border: '1px solid ' + (filter === t ? 'var(--aa-charcoal)' : 'var(--aa-rule-strong)'),
              cursor: 'pointer'
            }}>{t}</button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, borderTop: '1px solid var(--aa-rule)', borderLeft: '1px solid var(--aa-rule)' }}>
            {list.map((a) =>
            <a key={a.slug} href={pathForInsight(a.slug)} onClick={(e) => openInsight(e, a.slug)}
              aria-label={a.title + (a.published ? '' : ' (in preparation)')} style={{
              padding: 32, background: '#fff',
              borderRight: '1px solid var(--aa-rule)', borderBottom: '1px solid var(--aa-rule)',
              display: 'flex', flexDirection: 'column', gap: 14,
              textDecoration: 'none', color: 'inherit',
              minHeight: 220
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  <span style={{ color: 'var(--aa-cyan-700)' }}>{a.tag}</span>
                  <span style={{ color: 'var(--aa-steel)' }}>{a.date}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--aa-charcoal)', lineHeight: 1.25, textWrap: 'balance' }}>{a.title}</div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--aa-steel)' }}>
                  <span>{a.author}</span>
                  {a.published
                    ? <span>{a.read} read</span>
                    : <span className="pill" style={{ fontSize: 10, background: 'var(--aa-surface-off)', color: 'var(--aa-steel-700)', borderColor: 'var(--aa-rule-strong)' }}>In preparation</span>}
                </div>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>);

}

// ---------- Single article: written body for the published note ----------
function FreeZoneArticleBody() {
  return (
    <div className="container" style={{ maxWidth: 820, padding: '32px', fontSize: 17, lineHeight: 1.75, color: 'var(--aa-charcoal-800)' }}>
      <p style={{ fontSize: 19, color: 'var(--aa-charcoal)', fontWeight: 500, lineHeight: 1.5 }}>
        The UAE free-zone tax rules — Cabinet Decision 100 of 2023 and Ministerial Decision 229 of 2025 (which replaced MD 265 of 2023) — are being read three different ways by tax teams in the UAE. We unpack the three traps we keep seeing in client positions — and what the consequence is at filing.
      </p>
      <h3 style={{ fontFamily: 'var(--aa-font-display)', fontSize: 28, marginTop: 40, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.01em' }}>1. Substance is tested per activity; income is classified per transaction.</h3>
      <p>Two different tests are routinely collapsed into one. Adequate substance is assessed at the level of the free-zone person for each qualifying activity: the core income-generating activities must actually be carried out in the zone, with adequate qualified staff, assets and operating expenditure — or outsourced to a related party in the zone under your supervision. Separately, each stream of income is classified as qualifying or non-qualifying, and that classification is effectively a per-transaction question.</p>
      <p>This is the most common position error we have re-papered: clients treat both as a once-a-year statement. The substance file has to evidence real activity in the zone, and the income trail has to be tagged at source so qualifying and non-qualifying revenue can be told apart at filing.</p>

      {/* Pull quote */}
      <blockquote style={{
        margin: '40px 0', borderLeft: '2px solid var(--aa-cyan)',
        paddingLeft: 24, fontFamily: 'var(--aa-font-display)',
        fontSize: 26, lineHeight: 1.3, color: 'var(--aa-charcoal)',
        textTransform: 'uppercase', letterSpacing: '0.01em', fontWeight: 700
      }}>
        “Substance is tested per activity in the zone; income is classified per transaction. Neither survives as a year-end memo.”
      </blockquote>

      <h3 style={{ fontFamily: 'var(--aa-font-display)', fontSize: 28, marginTop: 40, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.01em' }}>2. There is no annual election to be a QFZP.</h3>
      <p>A free-zone person is automatically a Qualifying Free Zone Person for a tax period whenever it meets the conditions — there is no yearly election to claim the 0% rate. The only election available is the option to opt out and be taxed under the standard 9% regime. What is sticky is failure: breach the conditions in a period and the person loses QFZP status from the start of that tax period and for the four subsequent tax periods. Boards should treat the conditions as binding for the life of the current commercial structure, not something re-chosen each return.</p>

      <h3 style={{ fontFamily: 'var(--aa-font-display)', fontSize: 28, marginTop: 40, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.01em' }}>3. Non-qualifying revenue is capped — watch the de minimis.</h3>
      <p>Qualifying status is not lost the moment a sliver of non-qualifying revenue appears: the de minimis rule allows non-qualifying revenue up to the lower of 5% of total revenue or AED 5 million. Above that ceiling, QFZP status falls away for the period. The excluded activities are now enumerated in Ministerial Decision 229 of 2025, which replaced Ministerial Decision 265 of 2023. In our experience, activities that share a contract, a counterparty or an underlying asset with an excluded activity invite scrutiny — so map them against both the list and your de minimis headroom before signing.</p>

      <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24, marginTop: 40 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 8 }}>What we recommend</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: 'var(--aa-charcoal)', lineHeight: 1.6 }}>
          <li>Tag every revenue line at source with a qualifying / non-qualifying flag.</li>
          <li>Re-test the QFZP conditions every tax period, even when nothing has changed.</li>
          <li>Map every excluded-activity-adjacent contract against the de minimis limit before signing.</li>
        </ul>
      </div>
    </div>
  );
}

// ---------- E-invoicing guide cluster (general-information pages) ----------
const ART = { maxWidth: 820, padding: '32px', fontSize: 17, lineHeight: 1.75, color: 'var(--aa-charcoal-800)' };
const LEAD = { fontSize: 19, color: 'var(--aa-charcoal)', fontWeight: 500, lineHeight: 1.5 };
const H3 = { fontFamily: 'var(--aa-font-display)', fontSize: 28, marginTop: 40, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.01em' };

// Shared call-to-action that routes readers into the readiness assessment tool.
function EInvoiceCTA({ onNav }) {
  return (
    <div style={{ background: 'var(--aa-charcoal)', color: '#fff', padding: 28, marginTop: 40 }}>
      <div className="eyebrow" style={{ color: 'var(--aa-cyan)', marginBottom: 8 }}>Free · Instant personalised PDF</div>
      <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.3, marginBottom: 8 }}>Find your exact e-invoicing deadline in two minutes.</div>
      <p style={{ margin: '0 0 16px', fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>
        Answer a few questions and download your personalised readiness status — your phase, your ASP and go-live dates with live day-counts, and your next steps.
      </p>
      <button className="btn btn--primary btn--sm" onClick={() => { try { window.dispatchEvent(new Event('aa:open-einvoice')); } catch (e) { onNav('e-invoicing'); } }}>
        Get your readiness status
        <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
      </button>
    </div>
  );
}

// Cross-links to the other guides in the cluster.
function EInvoiceGuideLinks({ onNav, current }) {
  const links = [
    ['uae-e-invoicing-explained', 'UAE e-invoicing explained: a plain-English guide'],
    ['uae-e-invoicing-deadlines-phases', 'UAE e-invoicing deadlines and phases'],
    ['choosing-accredited-service-provider-asp', 'Choosing an Accredited Service Provider (ASP)'],
    ['prepare-erp-for-uae-e-invoicing', 'Getting your ERP ready for e-invoicing'],
  ].filter(([s]) => s !== current);
  return (
    <div style={{ marginTop: 36, borderTop: '1px solid var(--aa-rule)', paddingTop: 20 }}>
      <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>More in this series</div>
      <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
        {links.map(([slug, label]) => (
          <li key={slug}>
            <a href={pathForInsight(slug)} onClick={(e) => { e.preventDefault(); onNav('insight', slug); }}
              style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
              {label} →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EInvoiceExplainedBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>
        “E-invoicing” does not mean emailing a PDF. Under the UAE’s new mandate, an e-invoice is a structured data file — exchanged machine-to-machine through accredited providers — that your accounting system and your counterparty’s system can both read without anyone re-typing it. Here is what is changing, and why.
      </p>

      <h3 style={H3}>1. From documents to structured data</h3>
      <p>Today most businesses issue an invoice as a PDF, a printout or a Word file — a document a human reads. A UAE e-invoice is instead a structured electronic file built to a defined data standard, so that software on both sides can validate, post and report it automatically. PDFs and paper will no longer be valid for in-scope transactions once your phase goes live.</p>

      <h3 style={H3}>2. The OpenPeppol 5-corner model</h3>
      <p>The UAE has adopted the international <strong>OpenPeppol</strong> framework in a “5-corner” configuration. In plain terms: you (corner 1) send the invoice to your Accredited Service Provider (corner 2); your provider transmits it over the Peppol network to your customer’s provider (corner 3), who delivers it to your customer (corner 4); and the Federal Tax Authority (corner 5) receives the reporting data. The invoice never travels as an email attachment — it moves as validated data between accredited providers.</p>

      <blockquote style={{ margin: '40px 0', borderLeft: '2px solid var(--aa-cyan)', paddingLeft: 24, fontFamily: 'var(--aa-font-display)', fontSize: 26, lineHeight: 1.3, color: 'var(--aa-charcoal)', textTransform: 'uppercase', letterSpacing: '0.01em', fontWeight: 700 }}>
        “An e-invoice is not a prettier PDF. It is data your systems exchange and the FTA can see.”
      </blockquote>

      <h3 style={H3}>3. What is in scope</h3>
      <p>The mandate covers <strong>business-to-business (B2B)</strong> and <strong>business-to-government (B2G)</strong> transactions. Business-to-consumer (B2C) invoicing is currently optional. The rules apply across the UAE — including free zone companies — based on annual revenue thresholds, under Ministerial Decisions 243 and 244 of 2025 issued by the Ministry of Finance.</p>

      <h3 style={H3}>4. Why the UAE is doing this</h3>
      <p>Structured e-invoicing gives the tax authority near-real-time visibility of transactions, reduces VAT leakage and fraud, and cuts the manual effort of matching invoices on both sides. For compliant businesses the upside is real: fewer disputes, faster reconciliation, and a clean audit trail that already lines up with what the FTA holds.</p>

      <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24, marginTop: 40 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 8 }}>The short version</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: 'var(--aa-charcoal)', lineHeight: 1.6 }}>
          <li>An e-invoice is structured data, not a PDF.</li>
          <li>It is exchanged through Accredited Service Providers on the Peppol network, with the FTA as a reporting corner.</li>
          <li>B2B and B2G are mandatory; B2C is currently optional; free zones are included.</li>
        </ul>
      </div>

      <EInvoiceCTA onNav={onNav} />
      <EInvoiceGuideLinks onNav={onNav} current="uae-e-invoicing-explained" />
    </div>
  );
}

function EInvoiceDeadlinesBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>
        The UAE e-invoicing mandate is being rolled out in phases by annual revenue. For every business there are two dates that matter: the deadline to <strong>appoint an Accredited Service Provider (ASP)</strong>, and the <strong>go-live</strong> date from which structured e-invoicing becomes mandatory.
      </p>

      <h3 style={H3}>The phased timeline</h3>
      <div style={{ overflowX: 'auto', marginTop: 8 }}>
        <table className="aa-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th scope="col">Phase · Who</th>
              <th scope="col" className="aa-num" style={{ whiteSpace: 'nowrap' }}>Appoint ASP by</th>
              <th scope="col" className="aa-num" style={{ whiteSpace: 'nowrap' }}>Go live by</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Phase 1</strong><br/>Businesses with revenue ≥ AED 50 million</td>
              <td className="aa-num" style={{ whiteSpace: 'nowrap' }}>30 Oct 2026</td>
              <td className="aa-num" style={{ whiteSpace: 'nowrap' }}>1 Jan 2027</td>
            </tr>
            <tr>
              <td><strong>Phase 2</strong><br/>Businesses with revenue &lt; AED 50 million</td>
              <td className="aa-num" style={{ whiteSpace: 'nowrap' }}>31 Mar 2027</td>
              <td className="aa-num" style={{ whiteSpace: 'nowrap' }}>1 Jul 2027</td>
            </tr>
            <tr>
              <td><strong>Phase 3</strong><br/>Government entities</td>
              <td className="aa-num" style={{ whiteSpace: 'nowrap' }}>31 Mar 2027</td>
              <td className="aa-num" style={{ whiteSpace: 'nowrap' }}>1 Oct 2027</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style={H3}>Why the ASP date matters more than it looks</h3>
      <p>The go-live date is the headline, but the appointment deadline is the one that bites. Appointing an ASP is not a same-day formality — you need to select a provider, contract, connect it to your ERP or accounting system, map your invoice fields and test end-to-end. Treat the ASP deadline as the start of the real work, not the finish line.</p>

      <h3 style={H3}>Which phase am I in?</h3>
      <p>Your phase follows your annual revenue. If you are at or above AED 50 million you are in Phase 1, with the earliest deadlines. Below AED 50 million places you in Phase 2. Government entities follow Phase 3. Free zone companies are included and follow the same revenue-based thresholds.</p>

      <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24, marginTop: 40 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 8 }}>What to do now</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: 'var(--aa-charcoal)', lineHeight: 1.6 }}>
          <li>Confirm which phase your revenue puts you in.</li>
          <li>Work back from the ASP appointment deadline, not just go-live.</li>
          <li>Build in time for ERP integration and end-to-end testing.</li>
        </ul>
      </div>

      <EInvoiceCTA onNav={onNav} />
      <EInvoiceGuideLinks onNav={onNav} current="uae-e-invoicing-deadlines-phases" />
    </div>
  );
}

function ChoosingASPBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>
        Under the UAE mandate you cannot issue compliant e-invoices on your own — they must be transmitted through an <strong>Accredited Service Provider (ASP)</strong> accredited by the Ministry of Finance. Choosing the right one is the single most important decision in your readiness programme.
      </p>

      <h3 style={H3}>What an ASP actually does</h3>
      <p>In the 5-corner model, your ASP is the corner that turns your invoice data into a compliant structured document, validates it, transmits it over the Peppol network to your counterparty’s ASP, and reports the required data to the Federal Tax Authority. It sits between your accounting system and the official network — so its reliability becomes your reliability.</p>

      <h3 style={H3}>Questions to ask before you sign</h3>
      <ul style={{ margin: '8px 0 0', paddingLeft: 20, lineHeight: 1.7 }}>
        <li><strong>Accreditation.</strong> Is the provider formally accredited by the UAE Ministry of Finance? Ask to see it confirmed, not implied.</li>
        <li><strong>Integration with your system.</strong> Does it have a tested connector for your ERP or accounting software (Tally, Zoho, SAP, Microsoft Dynamics, Oracle, QuickBooks, etc.), or will integration be custom work?</li>
        <li><strong>Coverage.</strong> Can it handle your full transaction profile — credit notes, multi-currency, partial deliveries, high volumes?</li>
        <li><strong>Support and SLAs.</strong> What happens when a transmission fails at month-end? What are the response times and uptime guarantees?</li>
        <li><strong>Data handling.</strong> Where is your invoice data stored and processed, and how is it protected?</li>
        <li><strong>Commercials.</strong> Is pricing per-document, per-user or flat — and how does it scale as your volume grows?</li>
      </ul>

      <blockquote style={{ margin: '40px 0', borderLeft: '2px solid var(--aa-cyan)', paddingLeft: 24, fontFamily: 'var(--aa-font-display)', fontSize: 26, lineHeight: 1.3, color: 'var(--aa-charcoal)', textTransform: 'uppercase', letterSpacing: '0.01em', fontWeight: 700 }}>
        “Your ASP becomes part of your control environment. Choose it like one.”
      </blockquote>

      <h3 style={H3}>Appoint early, test early</h3>
      <p>Accreditation, contracting and integration take time, and ASPs will get busier as deadlines approach. Appointing early gives you room to run a proper test cycle before go-live — which is where most problems surface. We help clients shortlist ASPs against their transaction profile and validate the set-up independently.</p>

      <EInvoiceCTA onNav={onNav} />
      <EInvoiceGuideLinks onNav={onNav} current="choosing-accredited-service-provider-asp" />
    </div>
  );
}

function PrepareERPBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>
        E-invoicing is often framed as a tax change, but the work is mostly a <strong>data</strong> change. The required structured format only validates if the fields behind your invoices are complete and clean. Here is the practical groundwork that decides whether your go-live is smooth or painful.
      </p>

      <h3 style={H3}>1. Fix your master data first</h3>
      <p>Structured invoices are validated against required fields, so gaps that PDFs forgave will now fail. Before anything else, clean up the basics: your own and your customers’ Tax Registration Numbers (TRNs), legal names, addresses, and standardised item and tax codes. Duplicate or incomplete customer records are the most common cause of rejected invoices.</p>

      <h3 style={H3}>2. Map your fields to the required format</h3>
      <p>Every field the e-invoice standard requires has to come from somewhere in your ERP or accounting system. Map each one — invoice lines, tax categories, units, totals — to its source field, and identify the gaps where your system does not currently capture what the format expects. This mapping is the heart of the integration work with your ASP.</p>

      <h3 style={H3}>3. Cover the awkward transactions</h3>
      <p>Standard sales invoices are the easy case. Make sure your design also handles credit notes, discounts, multi-currency, partial deliveries, advance payments and any sector-specific documents you raise — these are where field mapping tends to break.</p>

      <h3 style={H3}>4. Test end-to-end before go-live</h3>
      <p>Run real-world invoices through the full path — your system to your ASP, transmitted and acknowledged — well before your mandatory date. Validate the exceptions, not just the happy path, and confirm how failures are surfaced and corrected. A test cycle that only proves the easy invoices is not a test cycle.</p>

      <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24, marginTop: 40 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 8 }}>Readiness checklist</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: 'var(--aa-charcoal)', lineHeight: 1.6 }}>
          <li>TRNs, legal names and addresses verified for your business and your customers.</li>
          <li>Item and tax codes standardised across the ledger.</li>
          <li>Every required e-invoice field mapped to a source field.</li>
          <li>Credit notes and edge-case transactions designed in.</li>
          <li>End-to-end test cycle completed before go-live.</li>
        </ul>
      </div>

      <EInvoiceCTA onNav={onNav} />
      <EInvoiceGuideLinks onNav={onNav} current="prepare-erp-for-uae-e-invoicing" />
    </div>
  );
}

function CorporateTaxGuideBody({ onNav }) {
  const link = (page, label) => (
    <a href={pathForPage(page)} onClick={(e) => { e.preventDefault(); onNav(page); }}
      style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, textDecoration: 'none' }}>{label}</a>
  );
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>
        UAE Corporate Tax has applied since financial years beginning on or after 1&nbsp;June&nbsp;2023, under Federal Decree-Law No.&nbsp;47 of 2022. Nearly every business in the UAE — mainland or free zone, profitable or not — now has registration and filing obligations. Here is what actually applies, in plain English.
      </p>

      <h3 style={H3}>Who has to pay — and the 0% / 9% bands</h3>
      <p>Corporate Tax applies to businesses and commercial activities across the UAE. The headline rates are simple: <strong>0% on taxable income up to AED&nbsp;375,000</strong>, and <strong>9% on taxable income above AED&nbsp;375,000</strong>. The crucial point most owners miss: the AED&nbsp;375,000 threshold is a <em>rate band, not an exemption</em>. Being below it does not take you out of the system — you must still register, keep records, and file a return; you simply pay 0% on that first slice.</p>

      <h3 style={H3}>Registration — and the AED 10,000 penalty</h3>
      <p>Every taxable person must register for Corporate Tax with the Federal Tax Authority and obtain a Corporate Tax registration number, within the FTA&rsquo;s deadlines. Missing your registration deadline carries an <strong>AED&nbsp;10,000 late-registration penalty</strong>. There is relief: the FTA has waived that penalty where the business files its first Corporate Tax return (or annual declaration) <strong>within seven months of the end of its first tax period</strong>, rather than the usual nine. If you have not registered yet, this is the first thing to fix.</p>

      <blockquote style={{ margin: '40px 0', borderLeft: '2px solid var(--aa-cyan)', paddingLeft: 24, fontFamily: 'var(--aa-font-display)', fontSize: 26, lineHeight: 1.3, color: 'var(--aa-charcoal)', textTransform: 'uppercase', letterSpacing: '0.01em', fontWeight: 700 }}>
        &ldquo;Below AED 375,000 is a 0% rate, not an exemption. You still register, and you still file.&rdquo;
      </blockquote>

      <h3 style={H3}>Filing and payment — the nine-month rule</h3>
      <p>Corporate Tax is self-assessed and filed once per tax period. The return must be filed, and any tax paid, <strong>within nine months of the end of the tax period</strong>. For a business whose tax period is the 2024 calendar year, that means a deadline of 30&nbsp;September&nbsp;2025. There are no provisional or advance payments — one return, one payment, nine months after year-end. See our {link('service-corporate-tax', 'Corporate Tax compliance')} service for how we scope and file it.</p>

      <h3 style={H3}>Small Business Relief — and its 31 December 2026 sunset</h3>
      <p>If your revenue is <strong>AED&nbsp;3&nbsp;million or less</strong>, you can elect for <strong>Small Business Relief</strong>: you are treated as having no taxable income for the period (you still register and file, but you do not compute or pay Corporate Tax). Two things to watch. First, it is an <em>election</em> — you have to claim it on the return. Second, it is <strong>transitional: it is available only for tax periods ending on or before 31&nbsp;December&nbsp;2026</strong>. Plan now for the first post-relief period, because the step-up to normal computation is not automatic.</p>

      <h3 style={H3}>Free-zone businesses — the QFZP 0%</h3>
      <p>A Qualifying Free Zone Person can access a 0% rate on its <em>qualifying</em> income, while non-qualifying income is taxed at 9%. The conditions — adequate substance in the zone, qualifying activities, the de&nbsp;minimis limit on non-qualifying revenue, and audited financials — are strict, and breaching them costs you the status for that period plus four more. We unpack the three traps we see most often in {link('service-tax-planning', 'tax planning')} engagements and in our companion guide on free-zone qualifying income.</p>

      <h3 style={H3}>Large multinationals — the 15% top-up tax</h3>
      <p>Separately, multinational groups with consolidated revenue of <strong>EUR&nbsp;750&nbsp;million or more in at least two of the four preceding financial years</strong> fall within the UAE&rsquo;s <strong>Domestic Minimum Top-up Tax (DMTT)</strong> — a 15% effective-rate floor aligned with the OECD&rsquo;s Pillar Two rules — for financial years starting on or after 1&nbsp;January&nbsp;2025 (Cabinet Decision No.&nbsp;142 of 2024). This does not affect SMEs, but groups near the threshold should model it early.</p>

      <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24, marginTop: 40 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 8 }}>Your next steps</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: 'var(--aa-charcoal)', lineHeight: 1.6 }}>
          <li>Confirm you are registered and hold a Corporate Tax registration number.</li>
          <li>Mark your filing date — nine months after your tax-period end — in the calendar now.</li>
          <li>If revenue is ≤ AED 3M, decide on Small Business Relief and plan for its 2026 sunset.</li>
          <li>Free-zone? Re-test your QFZP conditions every period, not once a year.</li>
        </ul>
      </div>

      <p style={{ fontSize: 13, color: 'var(--aa-steel)', marginTop: 32, fontStyle: 'italic' }}>
        Tax rules current as at February 2025. This is general guidance, not a substitute for a formal engagement — confirm your position against the latest UAE Ministry of Finance / Federal Tax Authority sources, or talk to us.
      </p>

      <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{link('service-corporate-tax', 'UAE Corporate Tax compliance →')}</li>
          <li>{link('service-tax-planning', 'Corporate Tax planning & structuring →')}</li>
          <li><a href={pathForInsight('free-zone-qualifying-income')} onClick={(e) => { e.preventDefault(); onNav('insight', 'free-zone-qualifying-income'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, textDecoration: 'none' }}>Free zone qualifying income — three traps →</a></li>
        </ul>
      </div>
    </div>
  );
}

function VATGuideBody({ onNav }) {
  const link = (page, label) => (
    <a href={pathForPage(page)} onClick={(e) => { e.preventDefault(); onNav(page); }}
      style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, textDecoration: 'none' }}>{label}</a>
  );
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>
        VAT has applied in the UAE since 1&nbsp;January&nbsp;2018, under Federal Decree-Law No.&nbsp;8 of 2017. The standard rate is <strong>5%</strong>, and most businesses that buy and sell in the UAE are caught by it. Here is what registration, filing and recovery actually involve.
      </p>

      <h3 style={H3}>When you must register — AED 375,000 and AED 187,500</h3>
      <p>Registration is <strong>mandatory</strong> once your taxable supplies and imports exceed <strong>AED&nbsp;375,000</strong> over the previous 12 months, or you expect to cross it in the next 30 days. You may register <strong>voluntarily</strong> from <strong>AED&nbsp;187,500</strong> of supplies or taxable expenses — often worth it for start-ups that want to recover input VAT on set-up costs. Missing the mandatory deadline carries an <strong>AED&nbsp;10,000 late-registration penalty</strong>.</p>

      <h3 style={H3}>Filing — EmaraTax and the 28-day rule</h3>
      <p>VAT returns are filed online through the FTA&rsquo;s <strong>EmaraTax</strong> portal. Most businesses file quarterly; larger ones are assigned monthly periods. Whatever your cycle, the return must be filed and the net VAT paid <strong>by the 28th day of the month following the end of the tax period</strong>. You charge output VAT on your sales, recover input VAT on valid business expenses, and pay (or reclaim) the difference.</p>

      <blockquote style={{ margin: '40px 0', borderLeft: '2px solid var(--aa-cyan)', paddingLeft: 24, fontFamily: 'var(--aa-font-display)', fontSize: 26, lineHeight: 1.3, color: 'var(--aa-charcoal)', textTransform: 'uppercase', letterSpacing: '0.01em', fontWeight: 700 }}>
        &ldquo;Zero-rated and exempt look the same on a customer&rsquo;s invoice. They are opposites on your VAT return.&rdquo;
      </blockquote>

      <h3 style={H3}>Zero-rated vs exempt — the costliest confusion</h3>
      <p>This is where we re-paper the most positions. <strong>Zero-rated</strong> supplies are taxable at 0% — and crucially you can still <em>recover the input VAT</em> attributable to them. Examples include exports outside the GCC, international transport, and certain healthcare and education. <strong>Exempt</strong> supplies carry no VAT but <em>block input-VAT recovery</em> — examples include certain financial services, bare land, local passenger transport and residential leases. Misclassifying one as the other either overstates your reclaim or silently loses recoverable VAT.</p>

      <h3 style={H3}>Imports, designated zones and corrections</h3>
      <p>VAT on imported goods and services is generally accounted for under the <strong>reverse-charge mechanism</strong> — you self-account for it on your return rather than paying it at the border. Designated zones have their own treatment for goods. And if you find an error in a filed return, you correct it through a <strong>voluntary disclosure</strong> rather than quietly adjusting the next return. See our {link('service-vat', 'VAT compliance')} service for how we register, prepare, review and file.</p>

      <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24, marginTop: 40 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 8 }}>Get VAT right</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: 'var(--aa-charcoal)', lineHeight: 1.6 }}>
          <li>Track your rolling 12-month supplies against the AED 375,000 line.</li>
          <li>Diarise the 28th-of-the-month filing date for every period.</li>
          <li>Classify every revenue stream as standard / zero-rated / exempt at source.</li>
          <li>Keep valid tax invoices for every input-VAT claim.</li>
        </ul>
      </div>

      <p style={{ fontSize: 13, color: 'var(--aa-steel)', marginTop: 32, fontStyle: 'italic' }}>
        Tax rules current as at March 2023. This is general guidance, not a substitute for a formal engagement — confirm your position against the latest UAE Federal Tax Authority sources, or talk to us.
      </p>

      <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{link('service-vat', 'UAE VAT compliance →')}</li>
          <li>{link('service-corporate-tax', 'UAE Corporate Tax compliance →')}</li>
          <li><a href={pathForInsight('uae-corporate-tax-guide-sme')} onClick={(e) => { e.preventDefault(); onNav('insight', 'uae-corporate-tax-guide-sme'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, textDecoration: 'none' }}>UAE Corporate Tax: a complete guide →</a></li>
        </ul>
      </div>
    </div>
  );
}

function BookkeepingGuideBody({ onNav }) {
  const link = (page, label) => (
    <a href={pathForPage(page)} onClick={(e) => { e.preventDefault(); onNav(page); }}
      style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, textDecoration: 'none' }}>{label}</a>
  );
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>
        For years, bookkeeping in the UAE was optional housekeeping. Since VAT (2018) and Corporate Tax (2023), it is a <strong>legal requirement</strong> — your returns are only as defensible as the records behind them. Here is what good outsourced bookkeeping in Dubai actually looks like.
      </p>

      <h3 style={H3}>It is no longer optional — and the records must last</h3>
      <p>Both regimes require you to keep proper books and supporting documents. VAT records must generally be retained for <strong>five years</strong> (longer for real estate), and Corporate Tax records for <strong>seven years</strong> after the end of the tax period. Reconstructing a year of transactions the week before a deadline is how penalties and overpaid tax happen.</p>

      <h3 style={H3}>What proper bookkeeping covers</h3>
      <p>Day-to-day recording of every transaction; <strong>bank and ledger reconciliations</strong> so the books tie to reality; a disciplined <strong>monthly close</strong> rather than a year-end scramble; management accounts you can actually run the business on; and records structured to be <strong>VAT- and Corporate-Tax-ready</strong> from the start. We deliver all of this against a documented controls framework — see {link('service-bookkeeping', 'outsourced accounting')}.</p>

      <blockquote style={{ margin: '40px 0', borderLeft: '2px solid var(--aa-cyan)', paddingLeft: 24, fontFamily: 'var(--aa-font-display)', fontSize: 26, lineHeight: 1.3, color: 'var(--aa-charcoal)', textTransform: 'uppercase', letterSpacing: '0.01em', fontWeight: 700 }}>
        &ldquo;Your VAT and Corporate Tax returns are only as defensible as the books behind them.&rdquo;
      </blockquote>

      <h3 style={H3}>Cloud accounting — Tally, Zoho, QuickBooks, Xero</h3>
      <p>Modern bookkeeping runs on cloud platforms — Tally, Zoho Books, QuickBooks and Xero are all common in the UAE. The right choice depends on your transaction volume, VAT complexity and reporting needs; what matters more is that it is set up correctly, reconciled monthly, and mapped cleanly to your VAT and Corporate Tax positions.</p>

      <h3 style={H3}>Outsource or hire in-house?</h3>
      <p>A full-time bookkeeper is a fixed cost with single-person key-man risk and no built-in review. Outsourcing gives you a reviewed close, continuity, and senior oversight for a fraction of a salaried hire — and it scales with you. For most SMEs and growing groups, outsourced bookkeeping with a clear monthly cadence is the better economics. Our pricing is customised to your scope — there is no one-size-fits-all rate.</p>

      <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24, marginTop: 40 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 8 }}>What to insist on</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: 'var(--aa-charcoal)', lineHeight: 1.6 }}>
          <li>A monthly close with bank reconciliations, not a year-end catch-up.</li>
          <li>Records kept VAT- and Corporate-Tax-ready, retained 5–7 years.</li>
          <li>A second-person review on the numbers before they leave the building.</li>
          <li>Management accounts you can actually make decisions from.</li>
        </ul>
      </div>

      <p style={{ fontSize: 13, color: 'var(--aa-steel)', marginTop: 32, fontStyle: 'italic' }}>
        General guidance, current as at September 2023 — confirm any tax record-keeping specifics against the latest UAE FTA / Ministry of Finance sources, or talk to us.
      </p>

      <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{link('service-bookkeeping', 'Outsourced bookkeeping & accounting →')}</li>
          <li>{link('service-financial-statements', 'IFRS financial statements →')}</li>
          <li>{link('service-vat', 'VAT compliance →')}</li>
        </ul>
      </div>
    </div>
  );
}

// Shared helpers for the shorter historical posts.
const artLink = (onNav, page, label) => (
  <a href={pathForPage(page)} onClick={(e) => { e.preventDefault(); onNav(page); }}
    style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, textDecoration: 'none' }}>{label}</a>
);
const artInsightLink = (onNav, slug, label) => (
  <a href={pathForInsight(slug)} onClick={(e) => { e.preventDefault(); onNav('insight', slug); }}
    style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, textDecoration: 'none' }}>{label}</a>
);
const artNote = (text) => (
  <p style={{ fontSize: 13, color: 'var(--aa-steel)', marginTop: 32, fontStyle: 'italic' }}>{text}</p>
);

function CorporateTaxComingBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>The UAE has confirmed it will introduce a federal Corporate Tax for financial years starting on or after 1&nbsp;June&nbsp;2023. For a country built on a no-tax reputation, this is a structural shift — and the businesses that prepare early will have the easiest first filing.</p>
      <h3 style={H3}>What has been announced</h3>
      <p>The headline rate is <strong>9%</strong> on taxable profits, with a <strong>0% band on the first AED&nbsp;375,000</strong> to protect small businesses and start-ups. Free-zone businesses that meet the qualifying conditions are expected to keep a preferential rate on qualifying income. Detailed rules will follow in the law and its decisions — but the direction is set.</p>
      <h3 style={H3}>What to do now, before it arrives</h3>
      <p>Three things are worth starting today: get your <strong>bookkeeping clean and current</strong> so you can compute taxable income when the time comes; review your <strong>group and free-zone structure</strong> while there is time to adjust; and map your <strong>related-party transactions</strong>, because transfer-pricing discipline will matter. None of this is wasted effort — it is good housekeeping regardless.</p>
      {artNote('Written in 2022 as the Corporate Tax regime was announced; rules have since been finalised. See our current UAE Corporate Tax guide for the position as enacted.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artInsightLink(onNav, 'uae-corporate-tax-guide-sme', 'UAE Corporate Tax: a complete guide →')}</li>
          <li>{artLink(onNav, 'service-corporate-tax', 'UAE Corporate Tax compliance →')}</li>
        </ul>
      </div>
    </div>
  );
}

function ManagementAccountsBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>Statutory accounts tell you where you have been. Management accounts should help you decide where to go next — yet most owner-managers we meet only see numbers once a year, far too late to act on them.</p>
      <h3 style={H3}>What belongs in a monthly pack</h3>
      <p>A useful monthly pack is short and decision-oriented: a <strong>P&amp;L against budget</strong> with variances explained in plain language; a <strong>cash position and short forecast</strong>; <strong>receivables and payables ageing</strong> so nothing slips; and two or three <strong>KPIs</strong> that actually move your business. If a number does not change a decision, it does not need to be in the pack.</p>
      <h3 style={H3}>Cadence beats precision</h3>
      <p>A pack that lands by the tenth of the month, every month, is worth more than a perfect one that arrives in week four. Close quickly, reconcile properly, and review it as a team — the habit is where the value is.</p>
      {artNote('General guidance for UAE owner-managers; tailor the pack to your sector and stage.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artLink(onNav, 'service-bookkeeping', 'Outsourced bookkeeping & management accounts →')}</li>
          <li>{artLink(onNav, 'service-cfo', 'CFO services →')}</li>
        </ul>
      </div>
    </div>
  );
}

function CashFlowBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>When revenue slows suddenly — as it has for many UAE businesses this year — the question stops being &ldquo;are we profitable?&rdquo; and becomes &ldquo;do we have cash next week?&rdquo;. Profit is an opinion; cash is a fact.</p>
      <h3 style={H3}>Build a 13-week cash forecast</h3>
      <p>The single most useful tool in a downturn is a rolling <strong>13-week cash flow</strong>: every expected receipt and payment, week by week, updated every week. It turns vague anxiety into a clear view of the tightest week ahead — and buys you time to act before it arrives.</p>
      <h3 style={H3}>Then protect the runway</h3>
      <p>With the forecast in hand: chase receivables actively, talk to suppliers early about terms, separate essential from deferrable spend, and keep your bank informed rather than surprised. Decisions made six weeks early are choices; the same decisions made in the tight week are emergencies.</p>
      {artNote('Written during the 2020 slowdown; the cash discipline holds in any downturn.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artLink(onNav, 'service-cfo', 'CFO services — cash & treasury →')}</li>
          <li>{artLink(onNav, 'service-bookkeeping', 'Outsourced bookkeeping →')}</li>
        </ul>
      </div>
    </div>
  );
}

function ESRBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>The UAE has introduced Economic Substance Regulations (ESR), bringing notification and reporting duties for companies that carry on certain &ldquo;relevant activities&rdquo;. Many businesses are in scope without realising it.</p>
      <h3 style={H3}>Are you carrying on a relevant activity?</h3>
      <p>The relevant activities include banking, insurance, investment-fund management, lease-finance, headquarters, shipping, holding-company, intellectual-property and distribution-and-service-centre business. If any of these describes part of what your entity does, you likely have ESR obligations — even as a holding company.</p>
      <h3 style={H3}>What being in scope means</h3>
      <p>In-scope entities must file an annual <strong>notification</strong>, and those earning income from the activity must meet an <strong>economic substance test</strong> and file an <strong>ESR report</strong>, demonstrating adequate activity, people and expenditure in the UAE. Missing the filings carries penalties, so the first step is simply to assess scope deliberately rather than assume you are out.</p>
      {artNote('Written in 2019 as ESR was introduced; confirm current filing requirements and deadlines before relying on this.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artLink(onNav, 'service-corporate-tax', 'Corporate Tax & compliance →')}</li>
          <li>{artLink(onNav, 'service-financial-statements', 'Financial statements →')}</li>
        </ul>
      </div>
    </div>
  );
}

function VATPrimerBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>From 1&nbsp;January&nbsp;2018 the UAE introduced Value Added Tax at a standard rate of <strong>5%</strong>. For most businesses it is the first time tax has touched day-to-day operations — here is the first-principles version.</p>
      <h3 style={H3}>Who registers</h3>
      <p>Registration is mandatory once your taxable supplies cross <strong>AED&nbsp;375,000</strong> over twelve months, and voluntary from <strong>AED&nbsp;187,500</strong>. Once registered you charge 5% VAT on your taxable sales (output VAT) and can recover the VAT you pay on business costs (input VAT), paying the FTA the difference.</p>
      <h3 style={H3}>Get the records right from day one</h3>
      <p>VAT lives or dies on documentation: issue compliant tax invoices, keep them, and record every transaction so your periodic return is a report, not a reconstruction. Businesses that set up clean books now will find every future return — and every future tax — far easier.</p>
      {artNote('A primer from 2018, the year VAT launched. For the current detail — EmaraTax filing, recovery and the zero-rated vs exempt distinction — see our full UAE VAT guide.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artInsightLink(onNav, 'uae-vat-guide-dubai', 'VAT in the UAE: the full guide →')}</li>
          <li>{artLink(onNav, 'service-vat', 'VAT compliance →')}</li>
        </ul>
      </div>
    </div>
  );
}

function BookkeepingFoundationBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>This is our first note as a new firm, and it is the principle everything else rests on: clean, reconciled books are not overhead. They are the foundation on which every financing, audit, valuation and — increasingly — tax position is built.</p>
      <h3 style={H3}>Why it matters more than it seems</h3>
      <p>When the books are right, every other question gets easier: a bank funds you faster, an auditor signs off cleaner, an investor trusts the numbers, and you make decisions on fact rather than feel. When they are wrong, every one of those becomes a scramble — usually at the worst possible moment.</p>
      <h3 style={H3}>The discipline we run on</h3>
      <p>Record promptly, <strong>reconcile to zero</strong>, close monthly, and have a second person review before numbers leave the building. It is unglamorous and it is the whole game. It is the standard we are founding this firm on, and the one we will hold to.</p>
      {artNote('Our founding note, December 2017. The discipline has not changed — only the regulations built on top of it.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artLink(onNav, 'service-bookkeeping', 'Outsourced bookkeeping & accounting →')}</li>
          <li>{artInsightLink(onNav, 'outsourced-bookkeeping-dubai', 'Outsourced bookkeeping in Dubai →')}</li>
        </ul>
      </div>
    </div>
  );
}

function CostOfEquityBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>Drop a US cost-of-equity into a GCC valuation and you will misprice the asset. The capital-asset-pricing inputs that travel from a textbook do not reflect where the business actually earns and bears risk. We build it up, component by component.</p>
      <h3 style={H3}>Start from the right risk-free rate</h3>
      <p>The risk-free rate should match the currency of the cash flows. For AED- or USD-pegged cash flows we anchor on a long US Treasury yield, then layer a <strong>country risk premium</strong> for the specific GCC market — not a blanket &ldquo;emerging markets&rdquo; figure. The peg matters: a dirham cash flow does not carry the same currency risk as a free-floating emerging-market currency.</p>
      <h3 style={H3}>Then the premia that actually apply</h3>
      <p>On top sit the <strong>equity risk premium</strong>, a <strong>size premium</strong> for smaller private companies, and a <strong>company-specific premium</strong> for concentration — single-customer, single-asset or key-person risk, which is common in family-owned GCC businesses. Each should be argued, not borrowed. A build-up you can defend line by line is worth more than a precise-looking number you cannot.</p>
      {artNote('General valuation guidance for UAE/GCC practitioners; calibrate every input to the specific asset and date.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artLink(onNav, 'service-valuations', 'Business valuations →')}</li>
          <li>{artInsightLink(onNav, 'dcf-terminal-values-family-office', 'Why DCF terminal values are mispriced →')}</li>
        </ul>
      </div>
    </div>
  );
}

function DCFTerminalBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>In most discounted-cash-flow valuations, well over half the value sits in the terminal value — the period beyond the explicit forecast. So it is striking how often it is the least-examined number on the page, especially in UAE family-office holdings.</p>
      <h3 style={H3}>The growth assumption that quietly inflates value</h3>
      <p>A perpetual growth rate that exceeds long-run nominal GDP is a value machine that runs forever — and it is the single most common drift we re-test. Terminal growth should be modest, defensible, and consistent with the economics of the business at maturity, not an extrapolation of a good forecast year.</p>
      <h3 style={H3}>Make reinvestment consistent with growth</h3>
      <p>Growth is not free. If the terminal value assumes continued growth, it must also assume the reinvestment (capex and working capital) needed to fund it — otherwise the model creates cash from nothing. We check the implied return on capital in perpetuity, and prefer cross-checking the terminal value against an exit-multiple sanity test before relying on it.</p>
      {artNote('General valuation guidance; terminal-value assumptions must be set per asset and reviewed at each valuation date.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artLink(onNav, 'service-valuations', 'Business valuations →')}</li>
          <li>{artLink(onNav, 'service-financial-modelling', 'Financial modelling →')}</li>
        </ul>
      </div>
    </div>
  );
}

function WorkingCapitalPegBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>Two parties can agree a headline price and still fight over millions at completion. The battleground is almost always the <strong>working-capital peg</strong> — the closing mechanic that adjusts price for the working capital actually delivered on the day.</p>
      <h3 style={H3}>The peg is a normalised target, not a snapshot</h3>
      <p>The target (or &ldquo;peg&rdquo;) should be a <strong>normalised</strong> level of working capital — typically an average across a representative period that strips out one-offs and reflects the seasonality of the business. Set it off a single month-end and you bake in whatever distortion happened to sit on the balance sheet that day.</p>
      <h3 style={H3}>Define the line items before you sign</h3>
      <p>Most disputes are definitional: what counts as debt versus working capital, how accruals and provisions are treated, the cut-off, and the true-up timetable. In a cash-free, debt-free deal these definitions decide who keeps the cash. Agree them — in writing, with worked examples — in the SPA, not in a post-completion argument.</p>
      {artNote('General transaction guidance; closing mechanics should be drafted with deal counsel for the specific transaction.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artLink(onNav, 'service-transaction-advisory', 'M&A support & due diligence →')}</li>
          <li>{artLink(onNav, 'service-valuations', 'Business valuations →')}</li>
        </ul>
      </div>
    </div>
  );
}

function TransferPricingBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>UAE Corporate Tax brought transfer pricing into everyday compliance. Transactions between <strong>related parties</strong> must now be priced at <strong>arm&rsquo;s length</strong> (Article 34), and payments to <strong>connected persons</strong> — owners, directors and their relatives — are deductible only up to their <strong>market value</strong> (Article 36). The Board needs to know what documentation those rules create.</p>
      <h3 style={H3}>The arm&rsquo;s-length principle, applied</h3>
      <p>Related-party transactions — management fees, intra-group loans, shared services, IP charges — must be priced as they would be between independent parties, supported by a recognised transfer-pricing method. Mispricing is not just an adjustment risk; it can shift taxable income between entities and draw FTA scrutiny.</p>
      <h3 style={H3}>What documentation is expected</h3>
      <p>Depending on group size and revenue, obligations escalate from a transfer-pricing <strong>disclosure form</strong> filed with the return, up to a full <strong>master file and local file</strong> for larger groups, with thresholds set by the FTA. A Board should expect, at minimum: a related-party transaction register, a documented pricing policy, and benchmarking support proportionate to the group&rsquo;s size — confirm the exact thresholds that apply to you.</p>
      {artNote('General guidance on UAE Corporate Tax transfer pricing; confirm current thresholds and filing requirements against the latest FTA guidance.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artLink(onNav, 'service-tax-planning', 'Corporate Tax planning & structuring →')}</li>
          <li>{artInsightLink(onNav, 'uae-corporate-tax-guide-sme', 'UAE Corporate Tax: the full guide →')}</li>
        </ul>
      </div>
    </div>
  );
}

function ReconciliationBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>A reconciliation that &ldquo;closes to a tolerance&rdquo; is not reconciled — it is unreconciled by an amount someone decided to ignore. We hold the line at zero, and it is one of the most useful disciplines a finance function can adopt.</p>
      <h3 style={H3}>Why tolerances hide real problems</h3>
      <p>Small unexplained differences are not noise; they are usually a timing error, a duplicate, a missed entry or a control gap in miniature. Wave them through as &ldquo;within tolerance&rdquo; and you train the team to stop looking — and the small differences accumulate into a restatement waiting to happen.</p>
      <h3 style={H3}>How to clear a residual properly</h3>
      <p>When a reconciliation will not close, the discipline is to <strong>identify each component</strong> of the difference, not to plug it: list the reconciling items, age them, assign an owner, and resolve them to source. A residual that genuinely cannot be explained is escalated, not absorbed. Zero is not pedantry — it is the only number that proves you understand the account.</p>
      {artNote('A controls discipline we apply across engagements; adapt the escalation path to your organisation.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artLink(onNav, 'service-internal-controls', 'Internal controls →')}</li>
          <li>{artLink(onNav, 'service-bookkeeping', 'Outsourced bookkeeping →')}</li>
        </ul>
      </div>
    </div>
  );
}

function ControlFrameworkBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>Most control breaks we are called in to fix trace back to one event: an ERP migration. The new system goes live, and controls that were implicit in the old one quietly do not come across. A note on what has to survive the cutover.</p>
      <h3 style={H3}>Controls do not migrate themselves</h3>
      <p>Segregation of duties, approval limits, three-way matching, posting restrictions — these live in configuration and roles, not in the data you migrate. If they are not deliberately re-designed and re-tested in the new system, the migration silently loosens them. We map every key control to its new-system equivalent <em>before</em> go-live, not after the first bad month-end.</p>
      <h3 style={H3}>Protect data integrity at the boundary</h3>
      <p>The cutover itself is the highest-risk window: opening balances, master data and in-flight transactions all move at once. Reconcile the conversion to the legacy system, lock down access during the transition, and keep an auditable trail of what moved and how. Get the boundary right and the new controls hold; get it wrong and you spend a year chasing differences.</p>
      {artNote('A practitioner&rsquo;s note on control continuity through system change; scope the control set to your environment.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artLink(onNav, 'service-internal-controls', 'Internal controls →')}</li>
          <li>{artLink(onNav, 'service-audit-support', 'Audit support →')}</li>
        </ul>
      </div>
    </div>
  );
}

function DesignatedZoneBody({ onNav }) {
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>VAT designated zones can feel like they sit outside VAT — until a movement of goods quietly turns into a taxable supply and the trail to prove otherwise is thin. The position is defensible; the documentation is what makes it so.</p>
      <h3 style={H3}>When &ldquo;outside scope&rdquo; becomes taxable</h3>
      <p>Goods within a designated zone can be treated as outside the scope of UAE VAT for certain supplies — but that treatment depends on the goods staying within the zone framework and being used for a qualifying purpose. Consume them, or move them into the mainland, and the supply can be reclassified as taxable. The treatment follows the <em>movement and use</em> of the goods, not the address on the invoice.</p>
      <h3 style={H3}>Keep the trail that proves the position</h3>
      <p>What protects you is evidence: entry and exit records, customs and transport documentation, and a clear link between each movement and its VAT treatment. If you cannot show where the goods went and why the treatment applied, expect the FTA to default to taxable. Build the trail as the goods move, not when the query lands.</p>
      {artNote('General VAT guidance on designated zones; confirm the current rules and your specific facts with the latest FTA guidance.')}
      <div style={{ marginTop: 24, borderTop: '1px solid var(--aa-rule)', paddingTop: 18 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 10 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{artLink(onNav, 'service-vat', 'VAT compliance →')}</li>
          <li>{artInsightLink(onNav, 'uae-vat-guide-dubai', 'VAT in the UAE: the full guide →')}</li>
        </ul>
      </div>
    </div>
  );
}

function IFRSStatementsBody({ onNav }) {
  const link = (page, label) => (
    <a href={pathForPage(page)} onClick={(e) => { e.preventDefault(); onNav(page); }}
      style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, textDecoration: 'none' }}>{label}</a>
  );
  return (
    <div className="container" style={ART}>
      <p style={LEAD}>Since Corporate Tax arrived, &ldquo;the accounts&rdquo; are no longer a private internal document — they are the basis of your tax return, your free-zone licence renewal, and your bank&rsquo;s credit decision. Knowing which standard applies, and what a complete set looks like, matters more than it used to.</p>

      <h3 style={H3}>Which accounting standard applies to you</h3>
      <p>Under Ministerial Decision No.&nbsp;114 of 2023, UAE Corporate Tax sets the accounting standards: <strong>IFRS</strong> is the default; <strong>IFRS for SMEs</strong> may be used where revenue does not exceed <strong>AED&nbsp;50&nbsp;million</strong>; and a <strong>cash basis</strong> of accounting is permitted where revenue does not exceed <strong>AED&nbsp;3&nbsp;million</strong>. Choosing the right basis early avoids restating later.</p>

      <h3 style={H3}>Who actually needs prepared (and audited) statements</h3>
      <p>Most businesses need a proper set of financial statements to compute taxable income for the FTA. Many <strong>free zones require audited financial statements</strong> each year for licence renewal. And banks, investors and counterparties will ask for them before they lend, invest or transact. Audited or not, statements that are prepared properly the first time save a scramble at every one of those moments.</p>

      <blockquote style={{ margin: '40px 0', borderLeft: '2px solid var(--aa-cyan)', paddingLeft: 24, fontFamily: 'var(--aa-font-display)', fontSize: 26, lineHeight: 1.3, color: 'var(--aa-charcoal)', textTransform: 'uppercase', letterSpacing: '0.01em', fontWeight: 700 }}>
        &ldquo;Your financial statements are now the basis of your tax return, your licence renewal and your bank&rsquo;s decision — all at once.&rdquo;
      </blockquote>

      <h3 style={H3}>What a complete set contains</h3>
      <p>A full set under IFRS is more than a profit figure: a <strong>statement of financial position</strong> (balance sheet), a <strong>statement of profit or loss and other comprehensive income</strong>, a <strong>statement of changes in equity</strong>, a <strong>statement of cash flows</strong>, and the <strong>notes</strong> — accounting policies and the disclosures that make the numbers intelligible. Groups also need <strong>consolidation</strong>. The notes are where most preparation effort goes, and where most weak sets fall short.</p>

      <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24, marginTop: 40 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 8 }}>Get your statements right</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: 'var(--aa-charcoal)', lineHeight: 1.6 }}>
          <li>Confirm your basis — IFRS, IFRS for SMEs, or cash basis — against the revenue thresholds.</li>
          <li>Keep the books reconciled monthly so year-end preparation is assembly, not reconstruction.</li>
          <li>Check your free-zone licence for an annual audited-accounts requirement.</li>
          <li>Prepare the notes and disclosures, not just the primary statements.</li>
        </ul>
      </div>

      <p style={{ fontSize: 13, color: 'var(--aa-steel)', marginTop: 32, fontStyle: 'italic' }}>
        Tax and reporting rules current as at April 2026. General guidance, not a substitute for a formal engagement — confirm your position against the latest UAE Ministry of Finance / Federal Tax Authority sources, or talk to us.
      </p>

      <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20 }}>
        <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>Related</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8, fontSize: 15 }}>
          <li>{link('service-financial-statements', 'IFRS financial statements preparation →')}</li>
          <li>{link('service-audit-support', 'Audit support →')}</li>
          <li>{link('service-bookkeeping', 'Outsourced bookkeeping →')}</li>
        </ul>
      </div>
    </div>
  );
}

const INSIGHT_BODIES = {
  'ifrs-financial-statements-uae': IFRSStatementsBody,
  'uae-vat-guide-dubai': VATGuideBody,
  'outsourced-bookkeeping-dubai': BookkeepingGuideBody,
  'uae-corporate-tax-guide-sme': CorporateTaxGuideBody,
  'cost-of-equity-gcc-buildup': CostOfEquityBody,
  'dcf-terminal-values-family-office': DCFTerminalBody,
  'working-capital-pegs-uae-deals': WorkingCapitalPegBody,
  'transfer-pricing-thresholds-board': TransferPricingBody,
  'reconciliation-resolve-to-zero': ReconciliationBody,
  'control-framework-erp-migrations': ControlFrameworkBody,
  'designated-zone-reclassification': DesignatedZoneBody,
  'uae-corporate-tax-is-coming': CorporateTaxComingBody,
  'management-accounts-that-drive-decisions': ManagementAccountsBody,
  'protecting-cash-flow-downturn': CashFlowBody,
  'economic-substance-regulations-uae': ESRBody,
  'uae-vat-5-percent-primer': VATPrimerBody,
  'bookkeeping-foundation': BookkeepingFoundationBody,
  'free-zone-qualifying-income': FreeZoneArticleBody,
  'uae-e-invoicing-explained': EInvoiceExplainedBody,
  'uae-e-invoicing-deadlines-phases': EInvoiceDeadlinesBody,
  'choosing-accredited-service-provider-asp': ChoosingASPBody,
  'prepare-erp-for-uae-e-invoicing': PrepareERPBody,
};

// ---------- Single article ----------
function InsightArticlePage({ onNav, slug }) {
  const article = insightBySlug(slug) || DEFAULT_INSIGHT;
  const Body = INSIGHT_BODIES[article.slug] || null;
  const related = INSIGHTS.filter((a) => a.published && a.slug !== article.slug).slice(0, 3);
  const openInsight = (e, s) => { e.preventDefault(); onNav('insight', s); };

  return (
    <div>
      <article style={{ background: '#fff' }}>
        <section className="aa-hero-image" style={{ position: 'relative', overflow: 'hidden', padding: '64px 0 48px' }}>
          <div
            className="aa-hero-image__bg"
            role="img"
            aria-label="A single crystal chess bishop standing in cool blue mist — the considered advisor"
            style={{ backgroundImage: "url('assets/images/chess-bishop.jpg')" }}
          />
          <div className="container" style={{ maxWidth: 820, padding: '0 32px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
              <a href={pathForPage('insights')} onClick={(e) => {e.preventDefault();onNav('insights');}} style={{ color: 'rgba(255,255,255,0.85)' }}>Insights</a>
              <span>/</span>
              <span>{article.tag}</span>
            </div>
            <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--aa-cyan-200)' }}>{article.tag} · {article.date} · {article.read} read</div>
            <h1 style={{
              fontFamily: 'var(--aa-font-display)', fontWeight: 700,
              fontSize: 'clamp(36px, 4.6vw, 56px)',
              textTransform: 'uppercase', letterSpacing: '0.01em',
              margin: 0, color: '#fff', lineHeight: 1.05, textWrap: 'balance'
            }}>
              {article.title}
            </h1>
            <div style={{ marginTop: 28, display: 'flex', gap: 24, fontSize: 13, color: 'rgba(255,255,255,0.75)', borderTop: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)', padding: '16px 0', flexWrap: 'wrap' }}>
              <div><span style={{ color: 'rgba(255,255,255,0.55)' }}>Author</span> · <strong style={{ color: '#fff' }}>{article.author}</strong></div>
              {article.reviewer && <div><span style={{ color: 'rgba(255,255,255,0.55)' }}>Reviewed</span> · {article.reviewer}</div>}
              {article.reference && <div><span style={{ color: 'rgba(255,255,255,0.55)' }}>Sources</span> · {article.reference}</div>}
            </div>
          </div>
        </section>

        {Body
          ? <Body onNav={onNav}/>
          : (
            <div className="container" style={{ maxWidth: 820, padding: '32px', fontSize: 17, lineHeight: 1.75, color: 'var(--aa-charcoal-800)' }}>
              <p style={{ fontSize: 19, color: 'var(--aa-charcoal)', fontWeight: 500, lineHeight: 1.5 }}>
                {article.excerpt}
              </p>
              <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24, marginTop: 32 }}>
                <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 8 }}>This note is in preparation</div>
                <p style={{ margin: 0, fontSize: 15, color: 'var(--aa-charcoal)', lineHeight: 1.6 }}>
                  We are finalising this note for publication. If the topic is live for you now, we are happy to discuss your specific facts — reach the partner and directors directly through the contact page.
                </p>
                <button className="btn btn--primary btn--sm" style={{ marginTop: 16 }} onClick={() => onNav('contact')}>
                  Speak to the team
                  <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
                </button>
              </div>
            </div>
          )}

        <div className="container" style={{ maxWidth: 820, padding: '0 32px 32px' }}>
          <div style={{ marginTop: 48, fontSize: 12, color: 'var(--aa-steel)', borderTop: '1px solid var(--aa-rule)', paddingTop: 16, lineHeight: 1.6 }}>
            This note is general guidance and does not constitute tax advice. For an opinion on your facts, contact the firm directly.
          </div>
        </div>
      </article>

      {/* More */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head"><div className="section-head__eyebrow">Related</div><h2>Continue reading.</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {related.map((a) =>
            <a key={a.slug} href={pathForInsight(a.slug)} onClick={(e) => openInsight(e, a.slug)}
              aria-label={a.title + (a.published ? '' : ' (in preparation)')} style={{
              borderTop: '2px solid var(--aa-charcoal)', paddingTop: 18,
              textDecoration: 'none', color: 'inherit',
              display: 'flex', flexDirection: 'column', gap: 12
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  <span style={{ color: 'var(--aa-cyan-700)' }}>{a.tag}</span>
                  <span style={{ color: 'var(--aa-steel)' }}>{a.date}</span>
                </div>
                <div style={{ fontSize: 19, fontWeight: 600, color: 'var(--aa-charcoal)', lineHeight: 1.3 }}>{a.title}</div>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>);

}

// ---------- Careers ----------
function CareersPage({ onNav }) {
  const CV_MAILTO = 'mailto:careers@aaccounting.me?subject=CV%20for%20your%20Talent%20Network&body=Hi%20Authentic%20Accounting%20team%2C%0A%0AAttached%20is%20my%20CV%20for%20your%20AI-managed%20talent%20bank.%20Brief%20note%20on%20what%20I%E2%80%99m%20looking%20for%3A%0A%0A%E2%80%94%0A%0AThank%20you.';

  return (
    <div>
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '64px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Careers · Talent Network</div>
              <h1 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700,
                fontSize: 'clamp(44px, 6vw, 72px)',
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0
              }}>
                We hire every quarter. For <span style={{ color: 'var(--aa-cyan-700)' }}>ourselves</span> — and for our clients.
              </h1>
            </div>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.6, margin: 0 }}>
              Rather than publish a list that goes stale by Wednesday, we keep an AI-managed CV bank. One CV, every brief, on the record.
            </p>
          </div>
        </div>
      </section>

      {/* What you get — the work itself */}
      <section className="section section--off">
        <div className="container">
          <div className="section-head"><div className="section-head__eyebrow">Working at the firm</div><h2>What the role looks like.</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--aa-rule)', border: '1px solid var(--aa-rule)' }}>
            {[
            ['Real ownership', 'You sign your workpapers. Reviewers challenge but do not rewrite.', 'pen-tool'],
            ['Defined standards', 'A written Engagement Standards Manual — referenced, not vibed.', 'book-marked'],
            ['Time for craft', 'Quality function protects time for review, training and pro-bono.', 'clock'],
            ['Audit committee voice', 'Every Senior+ presents to a Board at least once a year.', 'mic']].
            map(([t, d, ic]) =>
            <div key={t} style={{ background: '#fff', padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <i data-lucide={ic} style={{ width: 24, height: 24, color: 'var(--aa-cyan)' }}></i>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{d}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CV bank — the new heart of the page */}
      <section className="section">
        <div className="container">
          <div className="section-head"><div className="section-head__eyebrow">Talent network</div><h2>Send your CV once.<br/>We&rsquo;ll keep finding the match.</h2></div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'start',
          }}>
            <div>
              <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--aa-charcoal-800)', margin: 0 }}>
                There&rsquo;s rarely a week when a brief isn&rsquo;t on the desk &mdash; a Senior Associate for our Compliance bench, a VAT Manager for a free-zone trader, a CFO-on-secondment for a Sharjah manufacturer, a controls reviewer for a healthcare platform. Most never become posts. They move too fast.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--aa-charcoal-800)', marginTop: 16 }}>
                So instead of a job board, we run a quiet one. <strong style={{ color: 'var(--aa-charcoal)' }}>Send us your CV once.</strong> Our AI-managed talent index reads it, indexes your craft &mdash; ledger close vs.&nbsp;close-to-IPO, FTA filings vs.&nbsp;transfer pricing, audit-side vs.&nbsp;advisory-side &mdash; and watches every brief that lands. When a real match shows up, a partner reviews it and writes to you personally.
              </p>

              <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <a className="btn btn--primary" href={CV_MAILTO}>
                  <i data-lucide="mail" style={{ width: 16, height: 16 }}></i>
                  Send your CV
                </a>
                <a className="btn btn--ghost" href="mailto:careers@aaccounting.me" style={{ fontFamily: 'var(--aa-font-mono)', fontSize: 13, letterSpacing: '0.02em' }}>
                  careers@aaccounting.me
                </a>
              </div>

              <div style={{
                marginTop: 28, padding: '14px 18px',
                background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)',
                fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55,
              }}>
                PDFs, DOCX or a link to your portfolio site &mdash; all welcome. A short note on what you&rsquo;re looking for helps, but isn&rsquo;t required.
              </div>

              <p style={{ marginTop: 14, fontSize: 12.5, color: 'var(--aa-steel)', lineHeight: 1.55 }}>
                By sending your CV you consent to Authentic Accounting storing and processing it &mdash; including automated indexing to match you to roles, always with a partner&rsquo;s review before any contact &mdash; as described in our <a href={pathForPage('privacy')} onClick={(e) => { e.preventDefault(); onNav('privacy'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600 }}>Privacy Policy</a>. We keep it for 18&nbsp;months; withdraw any time.
              </p>
            </div>

            <div style={{
              background: 'var(--aa-charcoal)', color: '#fff',
              padding: 32, position: 'relative', overflow: 'hidden',
            }}>
              <div className="eyebrow eyebrow--cyan-light" style={{ marginBottom: 18 }}>
                How the matching works
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {[
                  ['01', 'Indexed, not filed', 'Your CV is parsed into a skills graph: qualifications, sectors, jurisdictions, software, language pairs.'],
                  ['02', 'Matched on craft, not keywords', 'The system understands the difference between an FTA return and a transfer-pricing memo. No more lost-in-the-stack moments.'],
                  ['03', 'Surfaced when a brief fits', 'Each new role &mdash; ours or our clients&rsquo; &mdash; runs against the bank. The top matches are flagged to a partner the same day.'],
                  ['04', 'A human writes the first email', 'AI surfaces the match. A partner reads your CV before anyone reaches out. Always.'],
                ].map(([n, t, d]) => (
                  <div key={n} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 14 }}>
                    <div className="mono" style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--aa-cyan)', paddingTop: 3 }}>{n}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: '#fff', marginBottom: 4 }}>{t}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: d }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 28, paddingTop: 18,
                borderTop: '1px solid rgba(255,255,255,0.14)',
                fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em', lineHeight: 1.6,
              }}>
                We keep your CV in the bank for 18 months and re-confirm before any client introduction. Withdraw any time by replying to <span style={{ color: 'var(--aa-cyan-200)' }}>careers@aaccounting.me</span>.
              </div>
            </div>
          </div>

          {/* Who we keep an eye out for */}
          <div style={{
            marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--aa-rule)',
          }}>
            <div className="eyebrow eyebrow--steel" style={{ marginBottom: 18 }}>Who we&rsquo;re always reading CVs for</div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
              background: 'var(--aa-rule)', border: '1px solid var(--aa-rule)',
            }}>
              {[
                ['Compliance', 'Bookkeepers, VAT specialists, Corporate Tax preparers, IFRS reviewers, audit-side associates and managers.'],
                ['Advisory', 'Valuation analysts, M&A associates, due-diligence leads, financial modellers, controls reviewers.'],
                ['Client placements', 'Interim CFOs, financial controllers, group accountants and finance managers for our clients across UAE.'],
              ].map(([t, d]) => (
                <div key={t} style={{ background: '#fff', padding: '22px 24px' }}>
                  <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 8 }}>{t}</div>
                  <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>);

}

// ---------- Contact (multi-step wizard) ----------
// Service catalog — canonical list shared with the Services page + footer.
// Update here and the wizard, services grid and footer columns stay in sync.
const CONTACT_SERVICES = [
  // Compliance
  'Outsourced accounting',
  'VAT compliance',
  'UAE Corporate Tax',
  'Financial statements',
  'Audit support',
  'E-Invoicing support',
  'Fixed asset tagging',
  // Advisory
  'Business valuations',
  'M&A support',
  'Financial due diligence',
  'Forensic accounting',
  'Internal controls',
  'Financial modeling',
  'CFO services',
  'Tax planning',
  'Feasibility studies',
  'Strategic advisory',
  // Fallback
  'Others',
];

function ContactPage({ onNav }) {
  // Pull intent once at component construction so step and form agree.
  const intent = (() => {
    try {
      const s = sessionStorage.getItem('aa_intent_service') || '';
      if (s) sessionStorage.removeItem('aa_intent_service');
      return s;
    } catch (err) { return ''; }
  })();
  // If a Services-page card pre-filled the service, skip step 1 ("which
  // service?") — the user already answered that. Land them on step 2.
  const [step, setStep] = useStateP(intent ? 2 : 1);
  const [submitting, setSubmitting] = useStateP(false);
  const [submitted, setSubmitted] = useStateP(false);
  const [sendError, setSendError] = useStateP('');
  const [form, setForm] = useStateP({
    service: intent, entity: '', email: '', phone: '', context: '', timeline: '6-weeks', segment: 'sme',
    consent: false, marketing: false
  });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setSendError('');
    // The success screen promises a reply to this address — validate it like
    // the lead tools do instead of accepting anything non-empty.
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      setSendError('That email address doesn’t look right — please check it so we can reply to you.');
      return;
    }
    setSubmitting(true);
    try {
      await window.AAContactSheet.submit(form);
      setSubmitted(true);
    } catch (err) {
      setSendError('Could not send your request. Please try again, or email info@aaccounting.me / WhatsApp +971 56 548 4635 directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '56px 0' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Contact</div>
          <h1 style={{
            fontFamily: 'var(--aa-font-display)', fontWeight: 700,
            fontSize: 'clamp(40px, 5.5vw, 64px)',
            textTransform: 'uppercase', letterSpacing: '0.01em',
            margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.05, textWrap: 'balance'
          }}>
            Start a structured conversation.
          </h1>
        </div>
      </section>

      <section className="section section--off">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}>
          {/* Left: contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="divider-thick">
              <div className="eyebrow eyebrow--charcoal">Find us</div>
              <div style={{ marginTop: 14, fontSize: 14, color: 'var(--aa-charcoal)', lineHeight: 1.75 }}>
                <div style={{ fontWeight: 600 }}>Office 406, Mai Tower</div>
                <div style={{ color: 'var(--aa-steel-700)' }}>Al Nahda 1, Dubai, UAE</div>
              </div>
            </div>

            <div className="divider-thick">
              <div className="eyebrow eyebrow--charcoal">Phone</div>
              <div style={{ marginTop: 14, fontSize: 14, color: 'var(--aa-charcoal)', lineHeight: 1.9 }}>
                <div><a href="tel:+97143960399" style={{ color: 'inherit', textDecoration: 'none' }}>+971 4 396 0399</a></div>
                <div><a href="tel:+971565484635" style={{ color: 'inherit', textDecoration: 'none' }}>+971 56 548 4635</a></div>
              </div>
            </div>

            <div className="divider-thick">
              <div className="eyebrow eyebrow--charcoal">Email</div>
              <div style={{ marginTop: 14, fontSize: 14, color: 'var(--aa-charcoal)', lineHeight: 1.9 }}>
                <div><span style={{ color: 'var(--aa-steel)', display: 'inline-block', width: 90 }}>General</span> <a href="mailto:info@aaccounting.me" style={{ color: 'inherit', textDecoration: 'none' }}>info@aaccounting.me</a></div>
                <div><span style={{ color: 'var(--aa-steel)', display: 'inline-block', width: 90 }}>Careers</span> <a href="mailto:careers@aaccounting.me" style={{ color: 'inherit', textDecoration: 'none' }}>careers@aaccounting.me</a></div>
              </div>
            </div>

            <div className="divider-thick">
              <div className="eyebrow eyebrow--charcoal">WhatsApp & Social</div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                <a href="https://wa.me/971565484635" target="_blank" rel="noopener" style={{ color: 'var(--aa-charcoal)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>+971 56 548 4635
                </a>
                <a href="https://www.linkedin.com/company/14621146/" target="_blank" rel="noopener" style={{ color: 'var(--aa-charcoal)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <i data-lucide="briefcase" style={{ width: 16, height: 16 }}></i>LinkedIn
                </a>
                <a href="https://www.facebook.com/aaccounting.me/" target="_blank" rel="noopener" style={{ color: 'var(--aa-charcoal)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <i data-lucide="users" style={{ width: 16, height: 16 }}></i>Facebook
                </a>
                <a href="https://www.youtube.com/@authenticaccounting" target="_blank" rel="noopener" style={{ color: 'var(--aa-charcoal)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <i data-lucide="play-circle" style={{ width: 16, height: 16 }}></i>YouTube
                </a>
              </div>
            </div>

            <div className="divider-thick">
              <div className="eyebrow eyebrow--charcoal">Response time</div>
              <div style={{ marginTop: 14, fontSize: 14, color: 'var(--aa-steel-700)', lineHeight: 1.6 }}>
                Scoping note within <strong style={{ color: 'var(--aa-charcoal)' }}>two business days</strong>. Fee indication within three.
              </div>
            </div>
          </div>

          {/* Right: wizard */}
          <div id="aa-contact-wizard" style={{ background: '#fff', border: '1px solid var(--aa-rule)', scrollMarginTop: 128 }}>
            {submitted ?
            <div style={{ padding: '64px 32px', textAlign: 'center' }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 16 }}>Request received</div>
              <h2 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700, fontSize: 32,
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: '0 0 16px', color: 'var(--aa-charcoal)', lineHeight: 1.1
              }}>
                Scoping note within two business days.
              </h2>
              <p style={{ fontSize: 15, color: 'var(--aa-steel-700)', lineHeight: 1.65, maxWidth: 420, margin: '0 auto 28px' }}>
                We received your request for <strong style={{ color: 'var(--aa-charcoal)' }}>{form.service}</strong>.
                A member of the team will reply to <strong style={{ color: 'var(--aa-charcoal)' }}>{form.email}</strong>.
              </p>
              <button className="btn btn--ghost btn--sm" onClick={() => onNav('home')}>Back to home</button>
            </div> :

            <>
            {/* Stepper */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '2px solid var(--aa-charcoal)' }}>
              {['Service', 'Context', 'Contact'].map((label, i) => {
                const idx = i + 1;
                const active = step === idx;
                const done = step > idx;
                return (
                  <div key={label} style={{
                    padding: '18px 20px',
                    borderRight: i < 2 ? '1px solid var(--aa-rule)' : 'none',
                    background: active ? '#fff' : 'var(--aa-surface-off)',
                    color: active ? 'var(--aa-charcoal)' : 'var(--aa-steel)',
                    display: 'flex', flexDirection: 'column', gap: 4
                  }}>
                    <div className="mono" style={{ fontSize: 11, color: done ? 'var(--aa-positive)' : active ? 'var(--aa-cyan)' : 'var(--aa-steel)' }}>
                      {done ? '✓ DONE' : `STEP ${String(idx).padStart(2, '0')}`}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
                  </div>);

              })}
            </div>

            <div style={{ padding: 32, minHeight: 380 }}>
              {step === 1 &&
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="eyebrow eyebrow--charcoal">Which service line?</div>
                  <div role="group" aria-label="Which service line?" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {CONTACT_SERVICES.map((s) =>
                  <button key={s} onClick={() => update('service', s)} aria-pressed={form.service === s} style={{
                    padding: '14px 16px', textAlign: 'left',
                    background: form.service === s ? 'var(--aa-charcoal)' : '#fff',
                    color: form.service === s ? '#fff' : 'var(--aa-charcoal)',
                    border: '1px solid ' + (form.service === s ? 'var(--aa-charcoal)' : 'var(--aa-rule-strong)'),
                    cursor: 'pointer', fontFamily: 'var(--aa-font-sans)', fontSize: 14, fontWeight: 500
                  }}>{s}</button>
                  )}
                  </div>

                  <div className="eyebrow eyebrow--charcoal" style={{ marginTop: 8 }}>Client segment</div>
                  <div role="group" aria-label="Client segment" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[['gov', 'Government'], ['ent', 'Enterprise'], ['sme', 'SME / family'], ['fin', 'Financial services']].map(([id, lbl]) =>
                  <button key={id} onClick={() => update('segment', id)} aria-pressed={form.segment === id} style={{
                    padding: '10px 16px', fontSize: 13,
                    background: form.segment === id ? 'var(--aa-cyan)' : '#fff',
                    color: form.segment === id ? '#fff' : 'var(--aa-charcoal)',
                    border: '1px solid ' + (form.segment === id ? 'var(--aa-cyan)' : 'var(--aa-rule-strong)'),
                    cursor: 'pointer', fontFamily: 'var(--aa-font-sans)', fontWeight: 600
                  }}>{lbl}</button>
                  )}
                  </div>
                </div>
              }
              {step === 2 &&
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {form.service &&
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                    padding: '10px 14px',
                    background: 'var(--aa-cyan-050)', border: '1px solid var(--aa-cyan-100)',
                    fontSize: 13, color: 'var(--aa-charcoal)',
                  }}>
                    <span>
                      <span style={{ color: 'var(--aa-steel)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 11, marginRight: 8 }}>Service</span>
                      <strong>{form.service}</strong>
                    </span>
                    <button onClick={() => setStep(1)} style={{
                      background: 'transparent', border: 0, padding: 0,
                      color: 'var(--aa-cyan-700)', fontSize: 12, fontWeight: 600,
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                      cursor: 'pointer', fontFamily: 'var(--aa-font-sans)',
                    }}>Change</button>
                  </div>
                  }
                  <label className="field">
                    <div className="field__label">Engagement context</div>
                    <textarea className="field__textarea" rows={5} value={form.context} onChange={(e) => update('context', e.target.value)} placeholder="Describe the engagement, deliverable, jurisdiction and any specific concerns. The more specific, the faster our scoping note." />
                  </label>
                  <div className="eyebrow eyebrow--charcoal">Target timeline</div>
                  <div role="group" aria-label="Target timeline" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[['urgent', 'Within 2 weeks'], ['6-weeks', '6 weeks'], ['quarter', 'This quarter'], ['flex', 'Flexible']].map(([id, lbl]) =>
                  <button key={id} onClick={() => update('timeline', id)} aria-pressed={form.timeline === id} style={{
                    padding: '10px 16px', fontSize: 13,
                    background: form.timeline === id ? 'var(--aa-charcoal)' : '#fff',
                    color: form.timeline === id ? '#fff' : 'var(--aa-charcoal)',
                    border: '1px solid ' + (form.timeline === id ? 'var(--aa-charcoal)' : 'var(--aa-rule-strong)'),
                    cursor: 'pointer', fontFamily: 'var(--aa-font-sans)', fontWeight: 600
                  }}>{lbl}</button>
                  )}
                  </div>
                </div>
              }
              {step === 3 &&
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <label className="field">
                    <div className="field__label">Legal entity name <span style={{ color: 'var(--aa-negative)' }}>*</span></div>
                    <input className="field__input" value={form.entity} onChange={(e) => update('entity', e.target.value)} placeholder="e.g. Authentic Holdings FZ-LLC" />
                  </label>
                  <label className="field">
                    <div className="field__label">Email <span style={{ color: 'var(--aa-negative)' }}>*</span></div>
                    <input className="field__input" type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="name@entity.ae" />
                  </label>
                  <label className="field">
                    <div className="field__label">Phone / WhatsApp <span style={{ color: 'var(--aa-steel)', fontWeight: 400 }}>(optional)</span></div>
                    <input className="field__input" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+971 …" />
                  </label>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0 }} />
                    <span>I agree to Authentic Accounting processing my details to respond to my enquiry, as described in the <a href={pathForPage('privacy')} onClick={(e) => { e.preventDefault(); onNav('privacy'); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600 }}>Privacy Policy</a>. <span style={{ color: 'var(--aa-negative)' }}>*</span></span>
                  </label>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.marketing} onChange={(e) => update('marketing', e.target.checked)} style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0 }} />
                    <span>Optional: send me occasional UAE tax &amp; compliance updates. Unsubscribe any time.</span>
                  </label>
                  <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 16, fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.6 }}>
                    We will respond within two business days.
                  </div>
                  {sendError ? <p role="alert" style={{ margin: 0, fontSize: 13, color: 'var(--aa-negative)', lineHeight: 1.5 }}>{sendError}</p> : null}
                  {(!form.entity.trim() || !form.email.trim() || !form.consent) ?
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--aa-steel)', lineHeight: 1.5 }}>To send: fill the fields marked <span style={{ color: 'var(--aa-negative)' }}>*</span> and tick the consent box.</p> : null}
                </div>
              }
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 32px', borderTop: '1px solid var(--aa-rule)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--aa-surface-off)'
            }}>
              <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} style={{
                background: 'transparent', border: 0, color: step === 1 ? 'var(--aa-steel-300)' : 'var(--aa-charcoal)',
                fontWeight: 600, fontSize: 13, cursor: step === 1 ? 'default' : 'pointer',
                fontFamily: 'var(--aa-font-sans)', display: 'flex', alignItems: 'center', gap: 8
              }}>
                <LucideHost name="arrow-left" style={{ width: 14, height: 14 }} />
                Back
              </button>
              <div className="mono" style={{ fontSize: 11, color: 'var(--aa-steel)' }}>STEP {step} / 3</div>
              {step < 3 ?
              <button
                className="btn btn--primary btn--sm"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !form.service || step === 2 && !form.context.trim()}
                style={{
                  opacity: step === 1 && !form.service || step === 2 && !form.context.trim() ? 0.45 : 1,
                  cursor: step === 1 && !form.service || step === 2 && !form.context.trim() ? 'not-allowed' : 'pointer'
                }}>
                
                  Continue
                  <LucideHost name="arrow-right" style={{ width: 14, height: 14 }} />
                </button> :

              <button
                className="btn btn--primary btn--sm"
                onClick={handleSubmit}
                disabled={submitting || !form.entity.trim() || !form.email.trim() || !form.consent}
                style={{
                  opacity: submitting || !form.entity.trim() || !form.email.trim() || !form.consent ? 0.45 : 1,
                  cursor: submitting || !form.entity.trim() || !form.email.trim() || !form.consent ? 'not-allowed' : 'pointer'
                }}>
                
                  {submitting ? 'Sending…' : 'Send scoping request'}
                </button>
              }
            </div>
            </>
            }
          </div>
        </div>
      </section>
    </div>);

}

// ---------- Industry landing pages (config-driven) ----------
const INDUSTRIES = {
  'industry-real-estate': {
    crumb: 'Real Estate', eyebrow: 'Industry · Real estate & property',
    h1a: 'Real estate accounting.', h1b: 'Built for UAE property.', intent: 'Outsourced accounting', cta: 'Talk to us about real estate',
    intro: 'Accounting, tax and audit support for UAE developers, property companies and jointly-owned-property management companies — from off-plan revenue recognition to service-charge and escrow accounting.',
    glance: [['Sector', 'Real estate & property'], ['Revenue', 'IFRS 15'], ['Leases', 'IFRS 16'], ['VAT', 'Residential vs commercial'], ['Also', 'Developer valuations'], ['Engagement', 'Retained or project'], ['Pricing', 'Customised to your scope']],
    covers: [['book-open', 'Bookkeeping & service charges', 'Day-to-day accounting plus service-charge ledgers and Owners’-Committee / management-company reporting.'], ['file-check', 'VAT on property', 'Correct treatment across residential, commercial and mixed-use supplies.'], ['landmark', 'Corporate Tax & free zone', 'Taxable-income computation, rental income and free-zone analysis for property holdings.'], ['building-2', 'Statements & valuations', 'Audit-ready IFRS statements and independent developer-side valuations.']],
    considerations: [['trending-up', 'IFRS 15 revenue recognition', 'Off-plan sales recognised over time vs at handover — the single biggest judgement on a developer’s books.'], ['key-round', 'IFRS 16 leases', 'Lessor and lessee accounting for leases, with the right-of-use and lease-liability mechanics.'], ['wallet', 'Service-charge & escrow', 'Service-charge accounting and RERA escrow discipline kept separate and auditable.'], ['percent', 'VAT treatment', 'First supply of new residential zero-rated, subsequent residential exempt, commercial at 5%.']],
    related: [['service-bookkeeping', 'Outsourced bookkeeping'], ['service-vat', 'VAT compliance'], ['service-financial-statements', 'Financial statements'], ['service-valuations', 'Business valuations']],
  },
  'industry-construction': {
    crumb: 'Construction & Contracting', eyebrow: 'Industry · Construction & contracting',
    h1a: 'Construction accounting.', h1b: 'Costed to completion.', intent: 'Outsourced accounting', cta: 'Talk to us about construction',
    intro: 'Accounting and advisory for UAE contractors and sub-contractors — over-time revenue, work-in-progress, retention and project costing that hold up at audit.',
    glance: [['Sector', 'Construction & contracting'], ['Revenue', 'IFRS 15 (over time)'], ['Tracks', 'WIP & cost-to-complete'], ['Watch', 'Retention & variations'], ['Output', 'Project costing'], ['Engagement', 'Retained or project'], ['Pricing', 'Customised to your scope']],
    covers: [['hard-hat', 'Project bookkeeping & costing', 'Per-project cost ledgers, committed-cost tracking and contract margins.'], ['trending-up', 'Revenue & WIP', 'Over-time revenue and work-in-progress under IFRS 15, computed and evidenced.'], ['file-check', 'VAT on construction', 'VAT on contracts, milestones and sub-contractor chains, correctly handled.'], ['clipboard-check', 'Audit support & CFO', 'Audit-ready files and CFO-level oversight of cash and project profitability.']],
    considerations: [['trending-up', 'IFRS 15 over time', 'Revenue recognised over time on a cost-to-cost (input) basis, re-estimated each period.'], ['layers', 'WIP & cost-to-complete', 'Disciplined estimates of cost-to-complete — where most contractor profit is won or lost.'], ['hand-coins', 'Retention', 'Retention receivable and payable tracked and aged separately from trade balances.'], ['file-warning', 'Variations & claims', 'Variation orders, claims and onerous-contract provisions assessed and documented.']],
    related: [['service-bookkeeping', 'Outsourced bookkeeping'], ['service-audit-support', 'Audit support'], ['service-financial-statements', 'Financial statements'], ['service-cfo', 'CFO services']],
  },
  'industry-trading': {
    crumb: 'Trading & Distribution', eyebrow: 'Industry · Trading & distribution',
    h1a: 'Trading accounting.', h1b: 'Margin you can see.', intent: 'Outsourced accounting', cta: 'Talk to us about trading',
    intro: 'Accounting, VAT and Corporate Tax for UAE trading and distribution businesses — inventory, COGS, import/export VAT and the margin analysis that runs the business.',
    glance: [['Sector', 'Trading & distribution'], ['Inventory', 'IAS 2'], ['VAT', 'Imports & reverse charge'], ['Zones', 'Designated-zone rules'], ['Output', 'Margin analysis'], ['Engagement', 'Retained'], ['Pricing', 'Customised to your scope']],
    covers: [['boxes', 'Bookkeeping & inventory', 'Perpetual inventory, COGS and landed-cost capture across SKUs and warehouses.'], ['file-check', 'VAT on imports & exports', 'Import VAT, reverse charge, exports and designated-zone treatment, handled correctly.'], ['landmark', 'Corporate Tax', 'Taxable-income computation and free-zone analysis for trading entities.'], ['scan-line', 'Stock & asset controls', 'Stock-count discipline and a fixed-asset register that ties to the ledger.']],
    considerations: [['boxes', 'Inventory & COGS', 'Valuation under IAS 2 (FIFO or weighted average) and accurate cost of goods sold.'], ['ship', 'Import VAT & reverse charge', 'Self-accounting for import VAT and the reverse-charge mechanism on cross-border buys.'], ['map-pin', 'Designated zones', 'When goods in a designated zone stay outside scope — and when they become taxable.'], ['percent', 'Landed cost & margin', 'Duty, freight and handling loaded into cost so reported margin is real.']],
    related: [['service-bookkeeping', 'Outsourced bookkeeping'], ['service-vat', 'VAT compliance'], ['service-corporate-tax', 'Corporate Tax'], ['service-fixed-asset-tagging', 'Fixed asset tagging']],
  },
  'industry-hospitality': {
    crumb: 'Hospitality & F&B', eyebrow: 'Industry · Hospitality, F&B & restaurants',
    h1a: 'Hospitality accounting.', h1b: 'Outlet by outlet.', intent: 'Outsourced accounting', cta: 'Talk to us about hospitality',
    intro: 'Accounting for UAE hotels, restaurants and F&B groups — multi-outlet consolidation, daily sales reconciliation, food-cost control and the fees unique to the sector.',
    glance: [['Sector', 'Hospitality & F&B'], ['Scope', 'Multi-outlet'], ['Daily', 'POS reconciliation'], ['Watch', 'Service & municipality fees'], ['Control', 'Food cost'], ['Engagement', 'Retained'], ['Pricing', 'Customised to your scope']],
    covers: [['utensils', 'Multi-outlet bookkeeping', 'Per-outlet ledgers consolidated into one group view you can compare.'], ['file-check', 'VAT on F&B', 'VAT across dine-in, delivery and aggregators, correctly accounted.'], ['line-chart', 'Management accounts', 'Prime-cost and outlet-level reporting that drives daily decisions.'], ['briefcase', 'CFO & statements', 'CFO oversight and audit-ready financial statements for the group.']],
    considerations: [['receipt', 'Daily sales reconciliation', 'POS, cash, card and aggregator settlements reconciled to the books every day.'], ['layers', 'Multi-outlet consolidation', 'Consistent charts and inter-outlet eliminations across the estate.'], ['percent', 'Service & municipality fees', 'Service charge, municipality and tourism fees identified and accounted separately.'], ['utensils-crossed', 'Food & beverage cost', 'Recipe costing, wastage and prime-cost discipline to protect margin.']],
    related: [['service-bookkeeping', 'Outsourced bookkeeping'], ['service-vat', 'VAT compliance'], ['service-financial-statements', 'Financial statements'], ['service-cfo', 'CFO services']],
  },
  'industry-ecommerce': {
    crumb: 'E-commerce & Retail', eyebrow: 'Industry · E-commerce & retail',
    h1a: 'E-commerce accounting.', h1b: 'Every channel reconciled.', intent: 'Outsourced accounting', cta: 'Talk to us about e-commerce',
    intro: 'Accounting and VAT for UAE online and retail businesses — marketplace and payment-gateway reconciliation, multi-channel revenue and cross-border VAT.',
    glance: [['Sector', 'E-commerce & retail'], ['Reconcile', 'Gateways & marketplaces'], ['Revenue', 'Multi-channel'], ['VAT', 'Place of supply'], ['Watch', 'Returns & chargebacks'], ['Engagement', 'Retained'], ['Pricing', 'Customised to your scope']],
    covers: [['credit-card', 'Bookkeeping & reconciliation', 'Gateway payouts, fees and holdbacks reconciled to orders and to the bank.'], ['file-check', 'VAT for e-commerce', 'Place-of-supply, cross-border and import VAT across your channels.'], ['landmark', 'Corporate Tax', 'Taxable-income computation for online and omni-channel models.'], ['line-chart', 'Modelling & unit economics', 'Contribution and unit-economics models that show what actually makes money.']],
    considerations: [['credit-card', 'Gateway & marketplace reconciliation', 'Stripe, PayTabs, Amazon, Noon and others — fees, payouts and holdbacks tied out.'], ['layers', 'Multi-channel revenue', 'Revenue recognised consistently across website, marketplace and retail.'], ['globe', 'VAT place of supply', 'Domestic, cross-border and imported-goods VAT applied to the right transactions.'], ['undo-2', 'Returns & chargebacks', 'Returns, refunds and chargebacks reflected so revenue and stock stay true.']],
    related: [['service-bookkeeping', 'Outsourced bookkeeping'], ['service-vat', 'VAT compliance'], ['service-corporate-tax', 'Corporate Tax'], ['service-financial-modelling', 'Financial modelling']],
  },
  'industry-manufacturing': {
    crumb: 'Manufacturing', eyebrow: 'Industry · Manufacturing',
    h1a: 'Manufacturing accounting.', h1b: 'Cost to the unit.', intent: 'Outsourced accounting', cta: 'Talk to us about manufacturing',
    intro: 'Accounting and advisory for UAE manufacturers — cost accounting, inventory valuation across raw materials, WIP and finished goods, and fixed-asset discipline.',
    glance: [['Sector', 'Manufacturing'], ['Costing', 'Standard / absorption'], ['Inventory', 'Raw · WIP · finished'], ['Assets', 'Plant & machinery'], ['Output', 'Unit cost'], ['Engagement', 'Retained'], ['Pricing', 'Customised to your scope']],
    covers: [['factory', 'Bookkeeping & cost accounting', 'Job and process costing with overhead allocation you can defend.'], ['boxes', 'Inventory & fixed assets', 'Raw, WIP and finished-goods valuation plus a clean fixed-asset register.'], ['file-check', 'VAT & Corporate Tax', 'Full VAT and Corporate Tax compliance for manufacturing entities.'], ['briefcase', 'Statements & CFO', 'Audit-ready statements and CFO oversight of cost and capacity.']],
    considerations: [['calculator', 'Cost accounting', 'Standard or absorption costing with overhead allocation across cost centres.'], ['boxes', 'Inventory valuation', 'Raw materials, work-in-progress and finished goods valued under IAS 2.'], ['cog', 'Fixed assets & capacity', 'Plant and machinery, depreciation policy and capacity/overhead recovery.'], ['percent', 'VAT & Corporate Tax', 'Input recovery, taxable income and free-zone analysis for manufacturers.']],
    related: [['service-bookkeeping', 'Outsourced bookkeeping'], ['service-fixed-asset-tagging', 'Fixed asset tagging'], ['service-financial-statements', 'Financial statements'], ['service-cfo', 'CFO services']],
  },
};

function IndustrySimplePage({ page, onNav }) {
  const cfg = INDUSTRIES[page];
  if (!cfg) return null;
  const book = () => {
    try {
      if (cfg.intent) sessionStorage.setItem('aa_intent_service', cfg.intent);
      sessionStorage.setItem('aa_scroll_target', 'aa-contact-wizard');
    } catch (e) {}
    onNav('contact');
  };
  return (
    <div>
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '40px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('industries')} onClick={(e) => { e.preventDefault(); onNav('industries'); }} style={{ color: 'var(--aa-steel-700)' }}>Industries</a>
            <span>/</span><span style={{ color: 'var(--aa-charcoal)' }}>{cfg.crumb}</span>
          </div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>{cfg.eyebrow}</div>
              <h1 style={{ fontFamily: 'var(--aa-font-display)', fontWeight: 700, fontSize: 'clamp(44px, 6vw, 72px)', textTransform: 'uppercase', letterSpacing: '0.01em', margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0 }}>
                {cfg.h1a}<br />{cfg.h1b}
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, color: 'var(--aa-steel-700)', lineHeight: 1.6, maxWidth: 620 }}>{cfg.intro}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={book}>{cfg.cta}<i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i></button>
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

      <section className="section section--off">
        <div className="container">
          <div className="section-head"><div className="section-head__eyebrow">How we help</div><h2>What we do for {cfg.crumb.toLowerCase()}.</h2></div>
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

      <section className="section">
        <div className="container">
          <div className="section-head"><div className="section-head__eyebrow">Sector considerations</div><h2>What makes {cfg.crumb.toLowerCase()} different.</h2></div>
          <div className="aa-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--aa-rule)', background: '#fff' }}>
            {cfg.considerations.map(([ic, t, d], i) => (
              <div key={t} style={{ padding: 28, borderRight: i < 3 ? '1px solid var(--aa-rule)' : 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <i data-lucide={ic} style={{ width: 24, height: 24, color: 'var(--aa-cyan)' }}></i>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, borderTop: '1px solid var(--aa-rule)', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="eyebrow eyebrow--steel">Related services</span>
            {cfg.related.map(([pg, label]) => (
              <a key={pg} href={pathForPage(pg)} onClick={(e) => { e.preventDefault(); onNav(pg); }} style={{ color: 'var(--aa-cyan-700)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>{label} →</a>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--aa-steel)', marginTop: 24, fontStyle: 'italic', maxWidth: 720 }}>
            General guidance for {cfg.crumb.toLowerCase()} businesses in the UAE; confirm tax and accounting specifics for your facts against the latest FTA / Ministry of Finance sources, or talk to us.
          </p>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { IndustriesPage, IndustrySimplePage, AboutPage, InsightsPage, InsightArticlePage, CareersPage, ContactPage });