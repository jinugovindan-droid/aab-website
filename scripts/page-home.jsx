// Home page — hero, services, industries, approach, stats, insights, contact
const { useState: useStateHome, useEffect: useEffectHome, useRef: useRefHome } = React;
const { pathForPage } = window.AARoutes;

// ---------- Hero ----------
function HomeHero({ onNav }) {
  return (
    <section className="aa-hero" style={{
      background: '#fff',
      borderBottom: '1px solid var(--aa-rule)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* corner index marker — quiet editorial touch */}
      <div className="mono aa-hide-sm" style={{
        position: 'absolute', top: 24, right: 32,
        fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--aa-steel)',
      }}>
        01 / Home
      </div>

      <div className="container aa-hero__container" style={{
        textAlign: 'center',
      }}>
        <div className="fade-in" style={{ maxWidth: 980, margin: '0 auto' }}>
          <div className="eyebrow" style={{
            marginBottom: 28,
            display: 'inline-flex', alignItems: 'center', gap: 12,
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <span style={{ width: 24, height: 1, background: 'var(--aa-cyan)', display: 'inline-block' }}></span>
            <span>UAE · Compliance & Advisory · Since 2017</span>
            <span style={{ width: 24, height: 1, background: 'var(--aa-cyan)', display: 'inline-block' }}></span>
          </div>

          <h1 className="aa-hero__title" style={{
            fontFamily: 'var(--aa-font-display)',
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: '0.005em',
            textTransform: 'uppercase',
            color: 'var(--aa-charcoal)',
            margin: 0,
            textWrap: 'balance',
          }}>
            Compliance<br />
            and advisory,<br />
            built on <span style={{ color: 'var(--aa-cyan)' }}>controls</span>.
          </h1>

          <p style={{
            fontSize: 19, lineHeight: 1.55,
            color: 'var(--aa-charcoal-800)',
            marginTop: 36, marginLeft: 'auto', marginRight: 'auto',
            maxWidth: 640,
          }}>
            Bookkeeping, VAT, UAE Corporate Tax, valuations and due diligence
            for SMEs, enterprises and Government organisations across the UAE —
            delivered with reconciliation discipline.
          </p>

          <div style={{
            display: 'flex', gap: 12, marginTop: 40,
            justifyContent: 'center', flexWrap: 'wrap',
          }}>
            <button className="btn btn--primary" onClick={() => onNav('contact')}>
              Book a consultation
              <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
            </button>
            <button className="btn btn--ghost" onClick={() => onNav('about')}>
              Meet the firm
              <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
            </button>
          </div>
        </div>

        <div style={{
          marginTop: 96,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid var(--aa-rule)',
          gap: 0,
        }}>
          <HeroStat value="1,200+"   label="Engagements delivered" />
          <HeroStat value="9 yrs"    label="Continuous practice" />
          <HeroStat value="7"        label="Emirates served" />
          <HeroStat value="2 line"   label="Review on every deliverable" last />
        </div>

        <div style={{
          borderTop: '1px solid var(--aa-rule)',
          padding: '20px 0 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12,
          fontSize: 13, color: 'var(--aa-steel-700)',
        }}>
          <i data-lucide="shield-check" style={{ width: 16, height: 16, color: 'var(--aa-cyan)' }}></i>
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
      <div className="container" style={{
        display: 'flex', alignItems: 'center', gap: 32, justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}>
        <div className="eyebrow eyebrow--steel" style={{ flexShrink: 0 }}>
          Serving all 7 Emirates
        </div>
        <div style={{
          display: 'flex', gap: 40, flex: 1, justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}>
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
    { t: 'Bookkeeping', d: 'Monthly ledger close with documented proration, classification and validation steps.', icon: 'book-open' },
    { t: 'VAT compliance', d: 'Registration, return preparation, review and filing with the FTA.', icon: 'file-check', route: 'service-vat' },
    { t: 'UAE Corporate Tax', d: 'Registration, period computation, and return filing under the 9% regime.', icon: 'landmark' },
    { t: 'Financial statements', d: 'BS, P&L, Cash Flow and notes prepared to IFRS / IFRS for SMEs.', icon: 'file-spreadsheet' },
  ];
  const advisory = [
    { t: 'Business valuations', d: 'DCF, comparables and asset-based valuations for transactions and disputes.', icon: 'gauge' },
    { t: 'M&A support', d: 'Buy-side and sell-side assistance, deal structuring, and closing support.', icon: 'merge' },
    { t: 'Financial due diligence', d: 'Quality-of-earnings, working capital and debt-like item analyses.', icon: 'search' },
    { t: 'Internal controls', d: 'Design, walkthroughs and remediation for regulated entities.', icon: 'shield' },
    { t: 'Financial modeling', d: 'Operating, transaction and board-pack models with full auditability.', icon: 'function-square' },
    { t: 'Strategic advisory', d: 'Accounting policy, complex transactions and Board-level positions.', icon: 'compass' },
  ];

  return (
    <section className="section section--off" id="services">
      <div className="container">
        <div className="section-head">
          <div className="section-head__eyebrow">Two practices · one standard of care</div>
          <h2>What we do</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
          <ServiceColumn kicker="Compliance" desc="Statutory close, filings and reporting — on time, on standard." items={compliance} onNav={onNav} />
          <ServiceColumn kicker="Advisory"   desc="Transaction support, valuations and Board-grade analysis."   items={advisory} onNav={onNav} />
        </div>

        <div style={{
          marginTop: 56,
          padding: '20px 24px',
          background: '#fff',
          border: '1px solid var(--aa-rule)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontSize: 14, color: 'var(--aa-charcoal)' }}>
            <strong>Need a scoping note?</strong> Tell us the deliverable and timeline; we'll send a structured proposal within one business day.
          </div>
          <button className="btn btn--ghost btn--sm" onClick={() => onNav('contact')}>
            Start a scope
            <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
          </button>
        </div>
      </div>
    </section>
  );
}

function ServiceColumn({ kicker, desc, items, onNav }) {
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
            <i data-lucide={it.icon} style={{ width: 20, height: 20, color: 'var(--aa-cyan)', marginTop: 2 }}></i>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--aa-charcoal)' }}>{it.t}</div>
              <div style={{ fontSize: 14, color: 'var(--aa-steel-700)', marginTop: 4, lineHeight: 1.5 }}>{it.d}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--aa-cyan-700)', whiteSpace: 'nowrap', paddingTop: 2 }}>
              Read more →
            </span>
          </a>
        ))}
      </div>
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
              <span style={{ color: 'var(--aa-cyan)' }}>without shortcuts</span>.
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
            Trailing-twelve-month figures, audited by our internal quality function. Updated quarterly.
          </div>
        </div>
        <div className="statline">
          <div className="statline__inner" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="statline__cell">
              <div className="statline__num">1,247</div>
              <div className="statline__lbl">Engagements TTM</div>
            </div>
            <div className="statline__cell">
              <div className="statline__num">98.4<small>%</small></div>
              <div className="statline__lbl">Filings on first review</div>
            </div>
            <div className="statline__cell">
              <div className="statline__num">AED 4.2<small>B</small></div>
              <div className="statline__lbl">Assets under engagement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Insights preview ----------
function HomeInsights({ onNav }) {
  const items = [
    { tag: 'Corporate Tax', date: '12 Apr 2026', title: 'Free zone qualifying income — three traps in the FTA\u2019s latest decision.', read: '6 min' },
    { tag: 'Valuations',    date: '02 Apr 2026', title: 'Why DCF terminal values are mispriced for UAE family-office holdings.',   read: '9 min' },
    { tag: 'Controls',      date: '21 Mar 2026', title: 'A control framework that survives ERP migrations: a practitioner\u2019s note.', read: '11 min' },
  ];
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
          {items.map((a, i) => (
            <a
              key={i}
              href={pathForPage('insight')}
              onClick={(e) => { e.preventDefault(); onNav('insight'); }}
              style={{
                display: 'flex', flexDirection: 'column', gap: 16,
                textDecoration: 'none', color: 'inherit',
                borderTop: '2px solid var(--aa-charcoal)', paddingTop: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                <span style={{ color: 'var(--aa-cyan)' }}>{a.tag}</span>
                <span style={{ color: 'var(--aa-steel)' }}>{a.date}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--aa-charcoal)', lineHeight: 1.25, textWrap: 'balance' }}>
                {a.title}
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--aa-steel)' }}>
                <span>{a.read} read</span>
                <span style={{ color: 'var(--aa-cyan-700)', fontWeight: 600 }}>Read note →</span>
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
              <i data-lucide="quote" style={{ width: 22, height: 22, color: 'var(--aa-cyan)' }}></i>
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
    <section style={{ background: 'var(--aa-charcoal)', color: '#fff', padding: '72px 0' }}>
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
            Tell us the engagement context and the deliverable. We will respond within one business day with a scoping note and a fee indication.
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
      <HomeQuote />
      <HomeCTA onNav={onNav} />
    </div>
  );
}

Object.assign(window, { HomePage });
