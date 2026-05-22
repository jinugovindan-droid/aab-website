// UAE E-Invoicing client briefing page — adapted from the print flyer design.
// Institutional register: square corners, hairline rules, tabular dates.
function EInvoicingPage({ onNav }) {
  const phases = [
    {
      label: 'Phase 1 — Large Business',
      qual: 'Annual revenue ≥ AED 50,000,000',
      asp: '30 Oct 2026',
      ready: '1 Jan 2027',
      key: true,
    },
    {
      label: 'Phase 2 — Small / Medium Business',
      qual: 'Annual revenue < AED 50,000,000',
      asp: '31 Mar 2027',
      ready: '1 Jul 2027',
      key: false,
    },
    {
      label: 'Phase 3 — All Government Entities',
      qual: 'In scope',
      asp: '31 Mar 2027',
      ready: '1 Oct 2027',
      key: false,
    },
  ];

  const concepts = [
    ['OpenPeppol standard', 'Invoices are exchanged as structured data on the international OpenPeppol framework — not as PDFs or scans.', 'network'],
    ['5-corner model', 'Every invoice routes through accredited service providers and the Federal Tax Authority before it reaches your counterparty.', 'route'],
    ['B2B and B2G scope', 'Mandatory for all business-to-business and business-to-government transactions across the UAE.', 'building-2'],
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
            <a href="#services" onClick={(e) => { e.preventDefault(); onNav('services'); }} style={{ color: 'var(--aa-steel-700)' }}>Services</a>
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
                through accredited service providers and the Federal Tax Authority. Authentic Accounting is fully prepared
                to guide each client through readiness and compliance — well ahead of the phased deadlines below.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => onNav('contact')}>
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
                  ['First ASP deadline', '30 Oct 2026'],
                  ['Phase 1 go-live', '1 Jan 2027'],
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
                  <td className="aa-num" style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--aa-charcoal)' }}>{p.asp}</td>
                  <td className="aa-num" style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--aa-charcoal)' }}>{p.ready}</td>
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
                Authentic Accounting is fully ready to support clients end-to-end on the UAE e-invoicing transition.
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
            <button className="btn btn--primary" onClick={() => onNav('contact')}>
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
