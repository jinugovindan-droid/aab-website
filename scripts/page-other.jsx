// Industries, About, Insights list, Insight article, Careers, Contact pages
const { useState: useStateP } = React;
const { pathForPage } = window.AARoutes;
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
                <span style={{ color: 'var(--aa-cyan)' }}>sector-bound</span>.
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
    </div>);

}

// ---------- About ----------
function AboutPage({ onNav }) {
  const team = [
  { name: 'Jinu Govindan', role: 'Founder Director', bio: 'M.Com · CMA. Management consultant, trainer and subject matter expert in Accounting, Financial Management, Taxation and Strategic Planning. 20 years in UAE across Trading, Construction, Manufacturing, Media, Holding Companies and Hospitality.' },
  { name: 'Jinu Kurikesu', role: 'Audit Manager', bio: 'CMA. Finance professional with 8+ years heading Accounts, Finance and Corporate divisions. Expert in Construction, Manufacturing, Retail and Trading industries.' },
  { name: 'CA Kiran Prasad S', role: 'Accounts, Audit & Taxation Manager', bio: 'B.Com · ACA. 10+ years across accounting, auditing and taxation. 3 years Big 4 experience at KPMG in Audit (Wealth and Asset Management) — disciplined risk and controls focus.' },
  { name: 'Ratheesh Manoharan', role: 'Manager · IT Operations', bio: 'ITIL V3 Certified Professional. IT Service Delivery Management, Quality Assurance, Design and Implementations.' },
  { name: 'Johncy Mathew', role: 'Marketing Manager', bio: 'B.Com. Customer Relationship and strategy development. 20 years gulf experience in retail and corporate marketing.' }];

  return (
    <div>
      <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '64px 0 72px' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>About the firm</div>
          <h1 style={{
            fontFamily: 'var(--aa-font-display)', fontWeight: 700,
            fontSize: 'clamp(44px, 6vw, 80px)',
            textTransform: 'uppercase', letterSpacing: '0.005em',
            margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.0, maxWidth: 1100, textWrap: 'balance'
          }}>
            A small, deliberate firm —<br />built for institutional work.
          </h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, marginTop: 48 }}>
            <p style={{ fontSize: 18, color: 'var(--aa-charcoal-800)', lineHeight: 1.6, margin: 0 }}>
              Authentic Accounting and Bookkeeping L.L.C was founded in 2017 to do compliance and advisory the way an audit committee would want it done — written down, reviewed twice, archived in full. Nine years on, we deliver a thousand-plus engagements a year against the same control framework that started us.
            </p>
            <div style={{ borderTop: '2px solid var(--aa-charcoal)', paddingTop: 18 }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 12 }}>Operating principles</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--aa-charcoal)' }}>
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
              ['2017', 'Founded', 'Two-partner firm in Dubai. First retained client: a logistics SME.'],
              ['2018', 'VAT launch', 'UAE introduces 5% VAT. We file 70 first-quarter returns.'],
              ['2024', 'CT readiness', 'UAE Corporate Tax kicks in. We complete 240 first-period registrations.'],
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
            <div className="section-head__eyebrow">Partnership & directors</div>
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
function InsightsPage({ onNav }) {
  const articles = [
  { tag: 'Corporate Tax', date: '12 Apr 2026', read: '6 min', title: 'Free zone qualifying income — three traps in the FTA\u2019s latest decision.', author: 'CA Kiran Prasad S' },
  { tag: 'Valuations', date: '02 Apr 2026', read: '9 min', title: 'Why DCF terminal values are mispriced for UAE family-office holdings.', author: 'Jinu Govindan' },
  { tag: 'Controls', date: '21 Mar 2026', read: '11 min', title: 'A control framework that survives ERP migrations: a practitioner\u2019s note.', author: 'Jinu Kurikesu' },
  { tag: 'VAT', date: '14 Mar 2026', read: '5 min', title: 'Designated zone reclassification — the trail you must keep.', author: 'CA Kiran Prasad S' },
  { tag: 'M&A', date: '02 Mar 2026', read: '8 min', title: 'Working capital pegs in UAE deals: closing-mechanic patterns we keep seeing.', author: 'Jinu Govindan' },
  { tag: 'Corporate Tax', date: '18 Feb 2026', read: '7 min', title: 'Transfer pricing thresholds and the documentation a Board should expect.', author: 'CA Kiran Prasad S' },
  { tag: 'Controls', date: '05 Feb 2026', read: '6 min', title: 'Why every reconciliation should resolve to zero — and what to do when it does not.', author: 'Jinu Kurikesu' },
  { tag: 'Valuations', date: '21 Jan 2026', read: '10 min', title: 'Cost-of-equity in the GCC: a practitioner\u2019s build-up.', author: 'Jinu Govindan' }];

  const [filter, setFilter] = useStateP('All');
  const tags = ['All', 'Corporate Tax', 'VAT', 'Valuations', 'Controls', 'M&A'];
  const list = filter === 'All' ? articles : articles.filter((a) => a.tag === filter);

  const featured = articles[0];

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
            Working notes on regulation, controls and practice. Written by partners and directors for finance teams, Boards, and counsel.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="section">
        <div className="container">
          <a href={pathForPage('insight')} onClick={(e) => {e.preventDefault();onNav('insight');}} style={{
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
              <div style={{
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
                The FTA’s most recent decision on free-zone qualifying income is being read three different ways by tax teams in the UAE. We unpack the three traps we keep seeing in client positions — and what the consequence is at filing.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <span className="pill pill--charcoal">QFZP</span>
                <span className="pill pill--charcoal">Substance</span>
                <span className="pill pill--charcoal">Election</span>
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
            <button key={t} onClick={() => setFilter(t)} style={{
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
            {list.map((a, i) =>
            <a key={i} href={pathForPage('insight')} onClick={(e) => {e.preventDefault();onNav('insight');}} style={{
              padding: 32, background: '#fff',
              borderRight: '1px solid var(--aa-rule)', borderBottom: '1px solid var(--aa-rule)',
              display: 'flex', flexDirection: 'column', gap: 14,
              textDecoration: 'none', color: 'inherit',
              minHeight: 220
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  <span style={{ color: 'var(--aa-cyan)' }}>{a.tag}</span>
                  <span style={{ color: 'var(--aa-steel)' }}>{a.date}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--aa-charcoal)', lineHeight: 1.25, textWrap: 'balance' }}>{a.title}</div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--aa-steel)' }}>
                  <span>{a.author}</span>
                  <span>{a.read} read</span>
                </div>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>);

}

// ---------- Single article ----------
function InsightArticlePage({ onNav }) {
  return (
    <div>
      <article style={{ background: '#fff' }}>
        <div className="container" style={{ maxWidth: 820, padding: '64px 32px 48px' }}>
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--aa-steel)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <a href={pathForPage('insights')} onClick={(e) => {e.preventDefault();onNav('insights');}} style={{ color: 'var(--aa-steel-700)' }}>Insights</a>
            <span>/</span>
            <span>Corporate Tax</span>
          </div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Corporate Tax · 12 Apr 2026 · 6 min read</div>
          <h1 style={{
            fontFamily: 'var(--aa-font-display)', fontWeight: 700,
            fontSize: 'clamp(36px, 4.6vw, 56px)',
            textTransform: 'uppercase', letterSpacing: '0.01em',
            margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.05, textWrap: 'balance'
          }}>
            Free zone qualifying income — three traps in the FTA’s latest decision.
          </h1>
          <div style={{ marginTop: 28, display: 'flex', gap: 24, fontSize: 13, color: 'var(--aa-steel-700)', borderTop: '1px solid var(--aa-rule)', borderBottom: '1px solid var(--aa-rule)', padding: '16px 0' }}>
            <div><span className="muted">Author</span> · <strong style={{ color: 'var(--aa-charcoal)' }}>CA Kiran Prasad S</strong></div>
            <div><span className="muted">Reviewed</span> · Jinu Govindan</div>
            <div><span className="muted">Reference</span> · <span className="mono">CT-2026-MEMO-018</span></div>
          </div>
        </div>

        <div className="container" style={{ maxWidth: 820, padding: '32px', fontSize: 17, lineHeight: 1.75, color: 'var(--aa-charcoal-800)' }}>
          <p style={{ fontSize: 19, color: 'var(--aa-charcoal)', fontWeight: 500, lineHeight: 1.5 }}>
            The Federal Tax Authority’s most recent decision on free-zone qualifying income is being read three different ways by tax teams in the UAE. We unpack the three traps we keep seeing in client positions — and what the consequence is at filing.
          </p>
          <h3 style={{ fontFamily: 'var(--aa-font-display)', fontSize: 28, marginTop: 40, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.01em' }}>1. Substance is read transactionally, not entity-wide.</h3>
          <p>The decision treats the substance test as a per-transaction question, not a once-a-year statement. A free-zone entity with qualifying activity in one revenue stream and disqualifying activity in another may find both streams tainted if the apportionment trail is not maintained at source.</p>
          <p>This is the most common position error we have re-papered: clients book the substance assessment as an annual exercise and lose the per-transaction tagging that the FTA actually relies on.</p>

          {/* Pull quote */}
          <blockquote style={{
            margin: '40px 0', borderLeft: '2px solid var(--aa-cyan)',
            paddingLeft: 24, fontFamily: 'var(--aa-font-display)',
            fontSize: 26, lineHeight: 1.3, color: 'var(--aa-charcoal)',
            textTransform: 'uppercase', letterSpacing: '0.01em', fontWeight: 700
          }}>
            “Substance is a transactional question. The trail must be at source, not in a year-end memo.”
          </blockquote>

          <h3 style={{ fontFamily: 'var(--aa-font-display)', fontSize: 28, marginTop: 40, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.01em' }}>2. The election is irrevocable in practice.</h3>
          <p>Although the regime presents the election as an annual choice, the operational consequence — once intercompany pricing, profit-allocation memos and counterparty contracts have been reset — makes a reversal commercially expensive. Boards should treat the first election as binding for the period of the current commercial structure, not the period of the current return.</p>

          <h3 style={{ fontFamily: 'var(--aa-font-display)', fontSize: 28, marginTop: 40, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.01em' }}>3. “Excluded” activities have a halo.</h3>
          <p>The list of excluded activities reaches further than its plain-text reading. Activities that share a contract, a counterparty or an underlying asset with an excluded activity have, in our experience with the FTA, been treated as carrying the same disqualification.</p>

          <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 24, marginTop: 40 }}>
            <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 8 }}>What we recommend</div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: 'var(--aa-charcoal)', lineHeight: 1.6 }}>
              <li>Tag every revenue line at source with a qualifying / disqualifying flag.</li>
              <li>Reconfirm the election in writing each year, even when it is unchanged.</li>
              <li>Map every excluded-activity-adjacent contract before signing.</li>
            </ul>
          </div>

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
            {[
            { tag: 'VAT', title: 'Designated zone reclassification — the trail you must keep.', date: '14 Mar 2026' },
            { tag: 'Controls', title: 'Why every reconciliation should resolve to zero.', date: '05 Feb 2026' },
            { tag: 'Corporate Tax', title: 'Transfer pricing thresholds and the documentation a Board should expect.', date: '18 Feb 2026' }].
            map((a, i) =>
            <a key={i} href={pathForPage('insight')} onClick={(e) => {e.preventDefault();onNav('insight');}} style={{
              borderTop: '2px solid var(--aa-charcoal)', paddingTop: 18,
              textDecoration: 'none', color: 'inherit',
              display: 'flex', flexDirection: 'column', gap: 12
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  <span style={{ color: 'var(--aa-cyan)' }}>{a.tag}</span>
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
                We hire every quarter. For <span style={{ color: 'var(--aa-cyan)' }}>ourselves</span> — and for our clients.
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
function ContactPage({ onNav }) {
  const [step, setStep] = useStateP(1);
  const [submitting, setSubmitting] = useStateP(false);
  const [submitted, setSubmitted] = useStateP(false);
  const [form, setForm] = useStateP({
    service: '', entity: '', email: '', context: '', timeline: '6-weeks', segment: 'sme'
  });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await window.AAContactSheet.submit(form);
      setSubmitted(true);
    } catch (err) {
      alert('Could not send your request. Please email info@aaccounting.me directly.');
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
                Scoping note within <strong style={{ color: 'var(--aa-charcoal)' }}>one business day</strong>. Fee indication within three.
              </div>
            </div>
          </div>

          {/* Right: wizard */}
          <div style={{ background: '#fff', border: '1px solid var(--aa-rule)' }}>
            {submitted ?
            <div style={{ padding: '64px 32px', textAlign: 'center' }}>
              <div className="eyebrow eyebrow--charcoal" style={{ marginBottom: 16 }}>Request received</div>
              <h2 style={{
                fontFamily: 'var(--aa-font-display)', fontWeight: 700, fontSize: 32,
                textTransform: 'uppercase', letterSpacing: '0.01em',
                margin: '0 0 16px', color: 'var(--aa-charcoal)', lineHeight: 1.1
              }}>
                Scoping note within one business day.
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {['Bookkeeping', 'VAT compliance', 'Corporate Tax', 'Financial statements', 'Business valuation', 'M&A support', 'Due diligence', 'Internal controls', 'Financial modeling', 'Other / unsure'].map((s) =>
                  <button key={s} onClick={() => update('service', s)} style={{
                    padding: '14px 16px', textAlign: 'left',
                    background: form.service === s ? 'var(--aa-charcoal)' : '#fff',
                    color: form.service === s ? '#fff' : 'var(--aa-charcoal)',
                    border: '1px solid ' + (form.service === s ? 'var(--aa-charcoal)' : 'var(--aa-rule-strong)'),
                    cursor: 'pointer', fontFamily: 'var(--aa-font-sans)', fontSize: 14, fontWeight: 500
                  }}>{s}</button>
                  )}
                  </div>

                  <div className="eyebrow eyebrow--charcoal" style={{ marginTop: 8 }}>Client segment</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[['gov', 'Government'], ['ent', 'Enterprise'], ['sme', 'SME / family'], ['fin', 'Financial services']].map(([id, lbl]) =>
                  <button key={id} onClick={() => update('segment', id)} style={{
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
                  <label className="field">
                    <div className="field__label">Engagement context</div>
                    <textarea className="field__textarea" rows={5} value={form.context} onChange={(e) => update('context', e.target.value)} placeholder="Describe the engagement, deliverable, jurisdiction and any specific concerns. The more specific, the faster our scoping note." />
                  </label>
                  <div className="eyebrow eyebrow--charcoal">Target timeline</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[['urgent', 'Within 2 weeks'], ['6-weeks', '6 weeks'], ['quarter', 'This quarter'], ['flex', 'Flexible']].map(([id, lbl]) =>
                  <button key={id} onClick={() => update('timeline', id)} style={{
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
                    <div className="field__label">Legal entity name</div>
                    <input className="field__input" value={form.entity} onChange={(e) => update('entity', e.target.value)} placeholder="e.g. Authentic Holdings FZ-LLC" />
                  </label>
                  <label className="field">
                    <div className="field__label">Email</div>
                    <input className="field__input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="name@entity.ae" />
                  </label>
                  <div style={{ background: 'var(--aa-surface-off)', border: '1px solid var(--aa-rule)', padding: 16, fontSize: 13, color: 'var(--aa-steel-700)', lineHeight: 1.6 }}>
                    By submitting, you accept our engagement scoping protocol. We will respond within one business day.
                  </div>
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
                disabled={submitting || !form.entity.trim() || !form.email.trim()}
                style={{
                  opacity: submitting || !form.entity.trim() || !form.email.trim() ? 0.45 : 1,
                  cursor: submitting || !form.entity.trim() || !form.email.trim() ? 'not-allowed' : 'pointer'
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

Object.assign(window, { IndustriesPage, AboutPage, InsightsPage, InsightArticlePage, CareersPage, ContactPage });