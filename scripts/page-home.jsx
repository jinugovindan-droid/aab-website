// Home page — hero, services, industries, approach, stats, insights, contact
const { useState: useStateHome, useEffect: useEffectHome, useRef: useRefHome } = React;
const { pathForPage, pathForInsight, INSIGHTS } = window.AARoutes;

// ---------- Hero (static, with a "Right now" panel) ----------
// Replaced the three-slide carousel on 22 Sep 2026. The rotation cost more
// than it earned: slides 2 and 3 were read by almost nobody, the counter,
// arrows and dots were chrome, and three 2400px photographs made the home
// page's mobile LCP nine seconds. One statement, one photograph, and the
// time-sensitive messages live in a panel that reads from live data — the
// e-invoicing countdown from the same tiers the ticker uses, the latest note
// from the insights registry — so it stays current without a code change.
const HERO_MAIN = {
  eyebrow: 'Advisory · Controls · Compliance',
  title: (
    <>
      Advisory<br />
      Engineered<span style={{ color: 'var(--aa-cyan-text)' }}>.</span>
    </>
  ),
  lead: 'Accounting, VAT, UAE Corporate Tax, valuations and due diligence for SMEs, enterprises and Government organisations across the UAE — delivered with reconciliation discipline.',
  ctaPrimary:   { label: 'Book a consultation', page: 'contact' },
  ctaSecondary: { label: 'Meet the firm',       page: 'about' },
  bgImage: 'dubai-night-king',
  bgAlt: 'Crystal chess king on polished marble, Dubai night skyline with Burj Khalifa behind',
};

// E-invoicing go-live tiers — Ministerial Decisions 243 & 244 of 2025, the
// same dates the ticker counts down. The panel shows the nearest one still
// ahead, so it moves on by itself after 1 January 2027.
const HERO_TIERS = [
  { who: 'AED 50M+ businesses', asp: '30 October', liveLabel: '1 January 2027', goISO: '2027-01-01T00:00:00', phase: 'Phase 1' },
  { who: 'businesses under AED 50M', asp: '31 March 2027', liveLabel: '1 July 2027', goISO: '2027-07-01T00:00:00', phase: 'Phase 2' },
  { who: 'government entities', asp: '31 March 2027', liveLabel: '1 October 2027', goISO: '2027-10-01T00:00:00', phase: 'Phase 3' },
];

const heroDubaiToday = () => {
  try {
    const p = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' }).split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  } catch (e) { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
};

function RightNowPanel({ onNav }) {
  const R = window.AARoutes || {};
  // Days are computed on the client so the static snapshot never bakes in a
  // count; until React mounts the row shows the date alone.
  const [days, setDays] = useStateHome(null);
  useEffectHome(() => {
    const now = heroDubaiToday();
    const left = HERO_TIERS.map((t) => Math.ceil((new Date(t.goISO) - now) / 86400000));
    setDays(left);
  }, []);
  const idx = days ? Math.max(0, days.findIndex((d) => d > 0)) : 0;
  const tier = HERO_TIERS[idx] || HERO_TIERS[HERO_TIERS.length - 1];
  const n = days ? days[idx] : null;

  const latest = (R.INSIGHTS || []).filter((a) => a.published).slice()
    .sort((x, y) => heroLatestTime(y.date) - heroLatestTime(x.date))[0];
  const latestDay = latest ? String(latest.date).split(' ').slice(0, 2).join(' ') : '';

  const Row = ({ num, small, title, sub, page, slug, label }) => (
    <div className="aa-rightnow__row">
      <div className="aa-rightnow__num mono">{num}<small>{small}</small></div>
      <div>
        <div className="aa-rightnow__title">{title}</div>
        <div className="aa-rightnow__sub">
          {sub}{' '}
          <a href={slug ? (R.pathForInsight ? R.pathForInsight(slug) : '/insights/' + slug) : pathForPage(page)}
            onClick={(e) => { e.preventDefault(); slug ? onNav('insight', slug) : onNav(page); }}>{label}</a>
        </div>
      </div>
    </div>
  );

  return (
    <aside className="aa-rightnow aa-on-dark" aria-label="Right now">
      <div className="aa-rightnow__head">
        <span>Right now</span>
        {latest && <span className="mono">updated {latestDay}</span>}
      </div>
      <Row
        num={n != null ? n.toLocaleString('en-US') : tier.liveLabel.split(' ')[0]}
        small={n != null ? 'days' : ''}
        title={`E-invoicing ${tier.phase} goes live ${tier.liveLabel}`}
        sub={`${tier.who.charAt(0).toUpperCase() + tier.who.slice(1)} appoint an Accredited Service Provider by ${tier.asp}.`}
        page="e-invoicing" label="The briefing →" />
      {latest && (
        <Row
          num={latestDay.split(' ')[0]} small={latestDay.split(' ')[1]}
          title={String(latest.title).replace(/\.\s*$/, '')}
          sub={latest.tag ? `Latest note · ${latest.tag}.` : 'Latest note.'}
          slug={latest.slug} label="Read it →" />
      )}
      <Row
        num="9%" small="CT"
        title="Corporate Tax, filed on time and defensible by line"
        sub="A position memo behind every contested item, a review-ready file every period."
        page="service-corporate-tax" label="Corporate Tax →" />
    </aside>
  );
}

const HERO_MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const heroLatestTime = (d) => {
  const p = String(d || '').split(' ');
  return new Date(parseInt(p[2], 10) || 2017, HERO_MONTHS[p[1]] || 0, parseInt(p[0], 10) || 1).getTime();
};

function HomeHero({ onNav }) {
  const S = HERO_MAIN;
  return (
    <section
      className="aa-hero aa-hero--bg aa-hero--static"
      style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', position: 'relative', overflow: 'hidden' }}
    >
      <div className="aa-hero__bg">
        {/* The page's LCP: eager, high priority, and the template preloads the same srcset. */}
        <HeroPhoto name={S.bgImage} alt={S.bgAlt} priority />
      </div>

      <div className="container aa-hero__container aa-hero__split">
        <div className="aa-hero__copy">
          {/* Light cyan, not brand cyan: measured against the pixels of the photograph
              under the scrim, 12px #00B0F0 falls to 3.60:1 over dubai-night-king (AA
              wants 4.5); --aa-cyan-200 takes it to 5.34:1. */}
          <div className="eyebrow eyebrow--cyan-light" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ width: 24, height: 1, background: 'var(--aa-cyan)', display: 'inline-block' }}></span>
            <span>{S.eyebrow}</span>
          </div>

          <h1 className="aa-hero__title" style={{
            fontFamily: 'var(--aa-font-display)', fontWeight: 700, lineHeight: 0.98, letterSpacing: '0.005em',
            textTransform: 'uppercase', color: '#fff', margin: 0, textWrap: 'balance',
          }}>
            {S.title}
          </h1>

          <p style={{ fontSize: 19, lineHeight: 1.55, color: 'rgba(255,255,255,0.88)', marginTop: 28, maxWidth: 600 }}>
            {S.lead}
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
            <button className="btn btn--primary" onClick={() => onNav(S.ctaPrimary.page)}>
              {S.ctaPrimary.label}
              <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
            </button>
            <button className="btn btn--ghost-light" onClick={() => onNav(S.ctaSecondary.page)}>
              {S.ctaSecondary.label}
              <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
            </button>
          </div>
        </div>

        <RightNowPanel onNav={onNav} />
      </div>

      <div className="container aa-hero__container" style={{ paddingTop: 0 }}>
        <div className="aa-hero__below aa-hero__stats" style={{
          marginTop: 56,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid var(--aa-rule)',
          gap: 0,
          background: '#fff',
          position: 'relative', zIndex: 2,
        }}>
          <HeroStat value="1,200+"   label="Engagements delivered" />
          <HeroStat value="9 yrs"    label="Continuous practice" />
          <HeroStat value="7"        label="Emirates served" />
          <HeroStat value="2 line"   label="Review on every deliverable" last />
        </div>

        <div className="aa-hero__below" style={{
          borderTop: '1px solid var(--aa-rule)',
          padding: '20px 0 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12,
          fontSize: 13, color: 'var(--aa-steel-700)',
          background: '#fff',
          position: 'relative', zIndex: 2,
        }}>
          <i data-lucide="shield-check" style={{ width: 16, height: 16, color: 'var(--aa-cyan-text)' }}></i>
          <span>Every workpaper carries an evidence trail. Every deliverable passes a two-line review before it leaves the firm.</span>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ value, label, last }) {
  return (
    <div className={`aa-hero-stat${last ? ' is-last' : ''}`}>
      <div style={{
        fontFamily: 'var(--aa-font-display)',
        fontWeight: 700,
        fontSize: 'clamp(28px, 3.2vw, 40px)',
        color: 'var(--aa-charcoal)',
        lineHeight: 1,
        letterSpacing: '0.01em',
        textTransform: 'uppercase',
      }}>{value}</div>
      <div style={{
        marginTop: 10,
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--aa-steel)',
        fontWeight: 600,
      }}>{label}</div>
    </div>
  );
}

// ---------- Emirates coverage strip ----------
function TrustStrip() {
  const items = [
    'Abu Dhabi',
    'Dubai',
    'Sharjah',
    'Ajman',
    'Umm Al Quwain',
    'Ras Al Khaimah',
    'Fujairah',
  ];
  return (
    <section style={{
      background: 'var(--aa-surface-off)',
      borderBottom: '1px solid var(--aa-rule)',
      padding: '36px 0',
    }}>
      <div className="container aa-emirates">
        <div className="eyebrow eyebrow--steel aa-emirates__label">
          Serving all 7 Emirates
        </div>
        <div className="aa-emirates__list">
          {items.map(n => (
            <span key={n} style={{
              fontFamily: 'var(--aa-font-display)',
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--aa-steel-700)',
            }}>
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Services ----------
function HomeServices({ onNav }) {
  const compliance = [
    { t: 'Outsourced accounting', d: 'Day-to-day bookkeeping, monthly close, reconciliations and a management pack — full finance function on a documented controls engine.', icon: 'book-open', route: 'service-bookkeeping' },
    { t: 'VAT compliance', d: 'Registration, return preparation, review and filing with the FTA.', icon: 'file-check', route: 'service-vat' },
    { t: 'UAE Corporate Tax', d: 'Registration, period computation, and return filing under the 9% regime.', icon: 'landmark', route: 'service-corporate-tax' },
    { t: 'Financial statements', d: 'BS, P&L, Cash Flow and notes prepared to IFRS / IFRS for SMEs.', icon: 'file-spreadsheet', route: 'service-financial-statements' },
    { t: 'Audit support', d: 'Pre-audit preparation, auditor liaison and post-audit closeout.', icon: 'clipboard-check', route: 'service-audit-support' },
    { t: 'E-Invoicing support', d: 'Readiness assessment, ASP selection and go-live support for the UAE e-invoicing mandate.', icon: 'send', route: 'e-invoicing' },
    { t: 'Fixed asset tagging', d: 'Physical asset verification, register reconstruction and depreciation review.', icon: 'tag', route: 'service-fixed-asset-tagging' },
    { t: 'Transfer pricing', d: 'Disclosure form, Master and Local File, and the benchmarking behind them — for groups over the thresholds.', icon: 'git-merge', route: 'service-transfer-pricing' },
  ];
  const advisory = [
    { t: 'Business valuations', d: 'DCF, comparables and asset-based valuations for transactions and disputes.', icon: 'gauge', route: 'service-valuations' },
    { t: 'M&A support', d: 'Buy-side and sell-side assistance, deal structuring, and closing support.', icon: 'merge', route: 'service-transaction-advisory' },
    { t: 'Financial due diligence', d: 'Quality-of-earnings, working capital and debt-like item analyses.', icon: 'search', route: 'service-transaction-advisory' },
    { t: 'Forensic accounting', d: 'Fraud investigation, dispute support and expert testimony for contested matters.', icon: 'fingerprint', route: 'service-forensic-accounting' },
    { t: 'Internal controls', d: 'Design, walkthroughs and remediation for regulated entities.', icon: 'shield', route: 'service-internal-controls' },
    { t: 'Financial modeling', d: 'Operating, transaction and board-pack models with full auditability.', icon: 'function-square', route: 'service-financial-modelling' },
    { t: 'CFO services', d: 'Interim and fractional CFO leadership — Board reporting, treasury and finance build-out.', icon: 'briefcase', route: 'service-cfo' },
    { t: 'Tax planning', d: 'Pre-transaction tax structuring, free-zone optimisation and transfer pricing alignment.', icon: 'calculator', route: 'service-tax-planning' },
    { t: 'Feasibility studies', d: 'Project-level financial feasibility, sensitivity analysis and pre-investment recommendations.', icon: 'bar-chart-3', route: 'service-feasibility-studies' },
    { t: 'Strategic advisory', d: 'Accounting policy, complex transactions and Board-level positions.', icon: 'compass', route: 'service-strategic-advisory' },
  ];

  return (
    <section className="section section--off" id="services">
      <div className="container">
        <div className="section-head">
          <div className="section-head__eyebrow">Two practices · one standard of care</div>
          <h2>What we do</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
          <ServiceColumn kicker="Compliance" desc="Statutory close, filings and reporting — on time, on standard." items={compliance} onNav={onNav}
            after={(
              /* Eight items against ten: the scoping card fills the shorter column
                 instead of leaving two rows of white beside the advisory list. */
              <div style={{
                marginTop: 28, padding: '22px 24px',
                background: '#fff', border: '1px solid var(--aa-rule)',
                display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start',
              }}>
                <div style={{ fontSize: 14, color: 'var(--aa-charcoal)', lineHeight: 1.55 }}>
                  <strong>Need a scoping note?</strong> Tell us the deliverable and timeline; we'll send a structured proposal within two business days.
                </div>
                <button className="btn btn--ghost btn--sm" onClick={() => onNav('contact')}>
                  Start a scope
                  <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
                </button>
              </div>
            )} />
          <ServiceColumn kicker="Advisory"   desc="Transaction support, valuations and Board-grade analysis."   items={advisory} onNav={onNav} />
        </div>
      </div>
    </section>
  );
}

function ServiceColumn({ kicker, desc, items, onNav, after }) {
  return (
    <div>
      <div className="divider-thick">
        <div className="eyebrow eyebrow--charcoal">{kicker}</div>
        <div style={{ marginTop: 6, fontSize: 14, color: 'var(--aa-steel-700)' }}>{desc}</div>
      </div>
      <div>
        {items.map((it, i) => (
          <a
            key={i}
            href={pathForPage(it.route || 'services')}
            onClick={(e) => { e.preventDefault(); onNav(it.route || 'services'); }}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 32px 1fr auto',
              gap: 16,
              padding: '22px 0',
              borderBottom: '1px solid var(--aa-rule)',
              alignItems: 'start',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div className="mono" style={{ fontSize: 12, color: 'var(--aa-steel)', paddingTop: 4 }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <i data-lucide={it.icon} style={{ width: 20, height: 20, color: 'var(--aa-cyan-text)', marginTop: 2 }}></i>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{it.t}</div>
              <div style={{ fontSize: 14, color: 'var(--aa-steel-700)', marginTop: 4, lineHeight: 1.5 }}>{it.d}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--aa-cyan-text)', whiteSpace: 'nowrap', paddingTop: 2 }}>
              Read more →
            </span>
          </a>
        ))}
      </div>
      {after || null}
    </div>
  );
}

// ---------- Industries strip ----------
function HomeIndustries({ onNav }) {
  const rows = [
    ['01', 'Government & public sector',  'Statutory filings · regulatory submissions · performance audit'],
    ['02', 'Large enterprises',           'Group consolidations · CT compliance · M&A advisory'],
    ['03', 'SMEs & family offices',       'Outsourced finance · VAT · advisory on demand'],
    ['04', 'Financial services',          'SCA / CBUAE engagements · controls attestation'],
    ['05', 'Real estate & construction',  'Revenue recognition · project costing · valuation'],
    ['06', 'Healthcare & education',      'Regulatory cost reporting · funder reconciliation'],
  ];
  return (
    <section className="section" id="industries">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 80, alignItems: 'start' }}>
          <div>
            <div className="section-head__eyebrow">Industries served</div>
            <h2 style={{
              fontFamily: 'var(--aa-font-display)', fontWeight: 700,
              fontSize: 'clamp(36px, 4vw, 48px)',
              textTransform: 'uppercase', letterSpacing: '0.01em',
              margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.05,
            }}>
              Regulated and<br />unregulated,<br />
              <span style={{ color: 'var(--aa-cyan-text)' }}>without shortcuts</span>.
            </h2>
            <p style={{ marginTop: 24, fontSize: 15, color: 'var(--aa-steel-700)', maxWidth: 360, lineHeight: 1.6 }}>
              We serve clients across the full spectrum — every engagement is scoped against the same control framework regardless of size or sector.
            </p>
            <button className="btn btn--ghost btn--sm" style={{ marginTop: 24 }} onClick={() => onNav('industries')}>
              Browse all industries
              <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
            </button>
          </div>
          <div>
            {rows.map((r, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '48px 1.1fr 2fr 24px',
                gap: 24, padding: '24px 0',
                borderBottom: '1px solid var(--aa-rule)',
                alignItems: 'baseline',
                cursor: 'pointer',
              }} onClick={() => onNav('industries')}>
                <div className="mono" style={{ color: 'var(--aa-steel)' }}>{r[0]}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{r[1]}</div>
                <div style={{ fontSize: 13, color: 'var(--aa-steel-700)' }}>{r[2]}</div>
                <i data-lucide="arrow-up-right" style={{ width: 16, height: 16, color: 'var(--aa-steel)' }}></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Approach (dark) ----------
function HomeApproach() {
  const steps = [
    ['01', 'Scoping & control mapping',     'We scope the engagement, confirm deliverables, and map the controls that will govern every workpaper.'],
    ['02', 'Data capture & reconciliation', 'Source data is ingested into our custom engine. Proration, classification and validation run before any human review.'],
    ['03', 'Review & second-line sign-off', 'Every deliverable passes a two-line review before it leaves the firm. Working papers carry the evidence trail.'],
    ['04', 'Filing or issuance',            'We file with the authority, issue the report or hand-over to the Board — with a closeout pack archived for the statutory period.'],
  ];
  return (
    <section className="section section--dark">
      <div className="container">
        <div className="section-head" style={{ marginBottom: 48 }}>
          <div className="eyebrow eyebrow--cyan-light" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 1, background: 'var(--aa-cyan-200)', display: 'inline-block' }}></span>
            How we work
          </div>
          <h2 style={{
            fontFamily: 'var(--aa-font-display)', fontWeight: 700,
            fontSize: 'clamp(36px, 4.6vw, 56px)',
            textTransform: 'uppercase', letterSpacing: '0.01em',
            margin: 0, color: '#fff',
          }}>
            Four steps. Every engagement.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ borderTop: '2px solid var(--aa-cyan)', paddingTop: 24 }}>
              <div className="mono" style={{ color: 'var(--aa-cyan-200)', fontSize: 12 }}>{s[0]}</div>
              <div style={{ fontSize: 22, fontWeight: 600, marginTop: 12, color: '#fff', lineHeight: 1.25 }}>{s[1]}</div>
              <div style={{ fontSize: 13, color: 'var(--aa-steel-200)', marginTop: 14, lineHeight: 1.65 }}>{s[2]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Numbers band ----------
function NumbersBand() {
  return (
    <section className="section section--off" style={{ padding: '72px 0' }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: 32, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 32 }}>
          <div>
            <div className="section-head__eyebrow">Firm by the numbers</div>
            <h2 style={{
              fontFamily: 'var(--aa-font-display)', fontWeight: 700,
              fontSize: 'clamp(32px, 3.6vw, 44px)',
              textTransform: 'uppercase', letterSpacing: '0.01em',
              margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.05,
            }}>
              Measured in deliverables,<br />not headcount.
            </h2>
          </div>
          <div className="muted" style={{ fontSize: 13, maxWidth: 320 }}>
            Our UAE practice at a glance.
          </div>
        </div>
        <div className="statline">
          <div className="statline__inner" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="statline__cell">
              <div className="statline__num">1,200<small>+</small></div>
              <div className="statline__lbl">Engagements a year</div>
            </div>
            <div className="statline__cell">
              <div className="statline__num">7</div>
              <div className="statline__lbl">Emirates served</div>
            </div>
            <div className="statline__cell">
              <div className="statline__num">2017</div>
              <div className="statline__lbl">Practising since</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Insights preview ----------
function HomeInsights({ onNav }) {
  const items = INSIGHTS.slice(0, 3);
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 48 }}>
          <div>
            <div className="section-head__eyebrow">Insights</div>
            <h2 style={{
              fontFamily: 'var(--aa-font-display)', fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 48px)',
              textTransform: 'uppercase', letterSpacing: '0.01em',
              margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.05,
            }}>
              Notes from the desk.
            </h2>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={() => onNav('insights')}>
            All articles
            <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {items.map((a) => (
            <a
              key={a.slug}
              href={pathForInsight(a.slug)}
              onClick={(e) => { e.preventDefault(); onNav('insight', a.slug); }}
              aria-label={a.title + (a.published ? '' : ' (in preparation)')}
              style={{
                display: 'flex', flexDirection: 'column', gap: 16,
                textDecoration: 'none', color: 'inherit',
                borderTop: '2px solid var(--aa-charcoal)', paddingTop: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                <span style={{ color: 'var(--aa-cyan-text)' }}>{a.tag}</span>
                <span style={{ color: 'var(--aa-steel)' }}>{a.date}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--aa-charcoal)', lineHeight: 1.25, textWrap: 'balance' }}>
                {a.title}
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--aa-steel)' }}>
                <span>{a.published ? a.read + ' read' : 'In preparation'}</span>
                <span style={{ color: 'var(--aa-cyan-text)', fontWeight: 600 }}>{a.published ? 'Read note →' : 'View →'}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Testimonials / pull quote ----------
function HomeQuote() {
  return (
    <section className="section section--off">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 64, alignItems: 'start' }}>
        <div>
          <div className="section-head__eyebrow">In their words</div>
          <h2 style={{
            fontFamily: 'var(--aa-font-display)', fontWeight: 700,
            fontSize: 'clamp(28px, 3.4vw, 40px)',
            textTransform: 'uppercase', letterSpacing: '0.01em',
            margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.05,
          }}>
            Engagements,<br />on the record.
          </h2>
          <p className="muted" style={{ marginTop: 16, fontSize: 14, maxWidth: 280 }}>
            Quotes are reproduced with permission. Engagement details are anonymised where confidentiality applies.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              q: '"They closed our first audit with zero adjustments and a closeout pack that the auditors used wholesale."',
              who: 'Chief Financial Officer',
              org: 'Listed industrial holding · Abu Dhabi',
            },
            {
              q: '"Their valuation memo was cited verbatim by counsel. Defensible, traceable, and quietly thorough."',
              who: 'General Counsel',
              org: 'Family office · Dubai',
            },
            {
              q: '"VAT positions explained with the relevant FTA citations. We finally have a return file that is review-ready."',
              who: 'Finance Director',
              org: 'Logistics group · Sharjah',
            },
            {
              q: '"They are the only firm that pushed back on our model assumptions before the Board did."',
              who: 'Head of Corporate Development',
              org: 'Healthcare platform · UAE',
            },
          ].map((t, i) => (
            <figure key={i} style={{
              margin: 0,
              background: '#fff',
              border: '1px solid var(--aa-rule)',
              padding: 28,
              display: 'flex', flexDirection: 'column', gap: 18,
              minHeight: 200,
            }}>
              <i data-lucide="quote" style={{ width: 22, height: 22, color: 'var(--aa-cyan-text)' }}></i>
              <blockquote style={{
                margin: 0, fontSize: 16, lineHeight: 1.55, color: 'var(--aa-charcoal)',
                fontFamily: 'var(--aa-font-sans)', fontWeight: 500,
              }}>
                {t.q}
              </blockquote>
              <figcaption style={{ marginTop: 'auto', borderTop: '1px solid var(--aa-rule)', paddingTop: 14, fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: 'var(--aa-charcoal)' }}>{t.who}</div>
                <div style={{ color: 'var(--aa-steel)' }}>{t.org}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- CTA band ----------
function HomeCTA({ onNav }) {
  return (
    <section style={{ background: 'var(--aa-charcoal)', '--aa-cyan-text': 'var(--aa-cyan)', color: '#fff', padding: '72px 0' }}>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 48, alignItems: 'center',
      }}>
        <div>
          <div className="eyebrow eyebrow--cyan-light" style={{ marginBottom: 16 }}>Engage</div>
          <h2 style={{
            fontFamily: 'var(--aa-font-display)', fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 48px)',
            textTransform: 'uppercase', letterSpacing: '0.01em',
            margin: 0, color: '#fff', lineHeight: 1.05,
          }}>
            Start with a structured conversation.
          </h2>
          <p style={{ marginTop: 16, fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 540 }}>
            Tell us the engagement context and the deliverable. We will respond within two business days with a scoping note and a fee indication.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <button className="btn btn--primary" onClick={() => onNav('contact')} style={{ fontSize: 15, padding: '16px 24px' }}>
            Book a consultation
            <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
          </button>
          <button className="btn btn--ghost-light" onClick={() => onNav('about')} style={{ fontSize: 15, padding: '16px 24px' }}>
            Meet the firm
          </button>
        </div>
      </div>
    </section>
  );
}

// ---------- Page ----------
function HomePage({ onNav }) {
  return (
    <div>
      <HomeHero onNav={onNav} />
      <TrustStrip />
      <HomeServices onNav={onNav} />
      <HomeIndustries onNav={onNav} />
      <HomeApproach />
      <NumbersBand />
      <HomeInsights onNav={onNav} />
      <HomeCTA onNav={onNav} />
    </div>
  );
}

Object.assign(window, { HomePage });
