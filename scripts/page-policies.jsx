// Privacy Policy + Terms of Use — institutional register, statutory voice.
// Last-updated date is rendered at the top of each page.
const { pathForPage: pathForPolicyPage } = window.AARoutes;

const POLICY_LAST_UPDATED = '24 May 2026';

// Shared chrome — hero + container — keeps both pages visually consistent.
function PolicyHero({ eyebrow, title, intro }) {
  return (
    <section style={{ background: '#fff', borderBottom: '1px solid var(--aa-rule)', padding: '56px 0 48px' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</div>
        <h1 style={{
          fontFamily: 'var(--aa-font-display)', fontWeight: 700,
          fontSize: 'clamp(40px, 5vw, 60px)',
          textTransform: 'uppercase', letterSpacing: '0.01em',
          margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.05, textWrap: 'balance',
        }}>
          {title}
        </h1>
        <div className="mono" style={{
          marginTop: 18, fontSize: 12, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--aa-steel)',
        }}>
          Last updated · {POLICY_LAST_UPDATED}
        </div>
        {intro && (
          <p style={{ marginTop: 24, fontSize: 17, lineHeight: 1.65, color: 'var(--aa-charcoal-800)' }}>
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}

// Section: numbered h2 + body. Numbering kept manually so links/anchors are stable.
function PolicySection({ n, title, children, id }) {
  return (
    <section id={id} style={{ marginTop: 48 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderTop: '2px solid var(--aa-charcoal)', paddingTop: 18 }}>
        <span className="mono" style={{ color: 'var(--aa-cyan)', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em' }}>
          {String(n).padStart(2, '0')}
        </span>
        <h2 style={{
          fontFamily: 'var(--aa-font-display)', fontWeight: 700,
          fontSize: 'clamp(22px, 2.4vw, 30px)',
          textTransform: 'uppercase', letterSpacing: '0.01em',
          margin: 0, color: 'var(--aa-charcoal)', lineHeight: 1.1,
        }}>
          {title}
        </h2>
      </div>
      <div style={{ marginTop: 18, fontSize: 15.5, lineHeight: 1.7, color: 'var(--aa-charcoal-800)' }}>
        {children}
      </div>
    </section>
  );
}

function PolicyBody({ children }) {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        {children}
      </div>
    </section>
  );
}

function P({ children }) {
  return <p style={{ margin: '0 0 14px' }}>{children}</p>;
}

function PolicyList({ items }) {
  return (
    <ul style={{ margin: '0 0 14px', paddingLeft: 0, listStyle: 'none' }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: 'grid', gridTemplateColumns: '12px 1fr', gap: 12, padding: '6px 0', alignItems: 'baseline' }}>
          <span style={{ width: 6, height: 6, background: 'var(--aa-cyan)', display: 'block', transform: 'translateY(2px)' }}></span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

// ---------- PRIVACY POLICY ----------
function PrivacyPolicyPage({ onNav }) {
  return (
    <div>
      <PolicyHero
        eyebrow="Privacy"
        title="Privacy Policy."
        intro="Authentic Accounting and Bookkeeping L.L.C (the firm, we, us) is committed to protecting the personal information of website visitors and clients. This Privacy Policy explains what we collect when you use aaccounting.me, why we collect it, how it is used and retained, and the rights you hold under UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL)."
      />

      <PolicyBody>
        <PolicySection n={1} title="Who we are" id="who">
          <P>The data controller is <strong>Authentic Accounting and Bookkeeping L.L.C</strong>, a UAE limited liability company registered in Dubai with offices at Office 406, Mai Tower, Al Nahda 1, Dubai, United Arab Emirates.</P>
          <P>For any privacy-related question, contact us at <a href="mailto:info@aaccounting.me" style={{ color: 'var(--aa-cyan-700)' }}>info@aaccounting.me</a> or <a href="tel:+97143960399" style={{ color: 'var(--aa-cyan-700)' }}>+971 4 396 0399</a>.</P>
        </PolicySection>

        <PolicySection n={2} title="Information we collect" id="collect">
          <P>We only collect what you choose to provide, and a limited set of technical data generated automatically.</P>
          <P><strong>Information you provide directly</strong> — when you submit the contact form or email us:</P>
          <PolicyList items={[
            'Name and, where given, role or job title',
            'Email address and, optionally, phone number',
            'Entity / company name and segment (SME, enterprise, Government, financial services)',
            'A free-text description of the engagement, deliverable or query',
            'Any attachments you choose to send (CV, scoping note, etc.)',
          ]}/>
          <P><strong>Technical information collected automatically</strong> — when you visit the site, our hosting provider and analytics systems may log standard request metadata: IP address, user-agent, referring URL, pages viewed, and timestamps. We use privacy-focused, cookieless Vercel Web Analytics to measure aggregate traffic. Where enabled, we also use Google Analytics 4 (with IP anonymisation) for more detailed traffic analysis — it sets analytics cookies and is loaded only after you accept our cookie banner. We do not use advertising or cross-site tracking cookies.</P>
        </PolicySection>

        <PolicySection n={3} title="Why we use it (purpose)" id="purpose">
          <P>We use personal information strictly for the purposes for which it was provided:</P>
          <PolicyList items={[
            'To respond to your enquiry and, where you ask, to scope a potential engagement',
            'To send our scoping note, fee indication and engagement letter',
            'To consider applications and CVs submitted to our talent network',
            'To keep the website secure, prevent abuse, and improve content',
            'To meet our legal, regulatory and professional obligations as a UAE accounting firm',
          ]}/>
        </PolicySection>

        <PolicySection n={4} title="Lawful basis" id="basis">
          <P>Where the UAE PDPL applies, we rely on the following lawful bases:</P>
          <PolicyList items={[
            'Your consent (Articles 4–6 PDPL) — when you submit the contact form or send your CV',
            'Performance of an engagement, or pre-engagement steps you have requested',
            'Compliance with a legal obligation to which the firm is subject',
            'The legitimate interests of the firm in operating a secure, professional website — balanced against your rights',
          ]}/>
        </PolicySection>

        <PolicySection n={5} title="Who we share it with" id="share">
          <P>We do not sell personal information and we do not share it for advertising.</P>
          <P>We share information only with:</P>
          <PolicyList items={[
            'Members of the firm who need it to respond to your enquiry or deliver the engagement',
            'Third-party processors that operate strictly on our instructions — currently our website hosting and cookieless analytics provider (Vercel Inc., USA), our email provider, where you consent our analytics provider (Google LLC, USA, for Google Analytics 4), and where engaged, a contact-form submission service',
            'Government authorities, regulators or courts where disclosure is required by UAE law',
            'Professional advisors (legal, audit) bound by confidentiality',
          ]}/>
          <P>Where processors are located outside the UAE, we rely on contractual safeguards and limit transfers to what is necessary.</P>
        </PolicySection>

        <PolicySection n={6} title="How long we keep it" id="retention">
          <P>We retain personal information only for as long as needed:</P>
          <PolicyList items={[
            'Enquiry form submissions that do not become engagements: up to 24 months, then deleted',
            'CVs sent to our talent network: 18 months, with a re-confirmation request before any client introduction',
            'Engagement records: retained for the statutory period applicable to UAE accounting and tax engagements (currently a minimum of 5 years)',
            'Web access logs: retained on a short rolling window for security purposes',
          ]}/>
        </PolicySection>

        <PolicySection n={7} title="Your rights" id="rights">
          <P>Under the UAE PDPL you have the right, subject to applicable conditions, to:</P>
          <PolicyList items={[
            'Request access to the personal information we hold about you',
            'Request correction of inaccurate or incomplete information',
            'Request deletion of your personal information, where there is no overriding lawful reason to retain it',
            'Withdraw consent you previously gave, at any time',
            'Object to or restrict certain processing',
            'Request the transfer of your personal information to another controller, where technically feasible',
          ]}/>
          <P>To exercise any of these rights, email <a href="mailto:info@aaccounting.me" style={{ color: 'var(--aa-cyan-700)' }}>info@aaccounting.me</a>. We will respond within a reasonable period and, where applicable, within the timelines set out by the UAE Data Office.</P>
        </PolicySection>

        <PolicySection n={8} title="Security" id="security">
          <P>We apply reasonable administrative, technical and physical safeguards to protect the personal information we hold, including access controls, encryption in transit, and review of third-party processors. No method of transmission over the internet is fully secure; we ask that you do not send highly sensitive information by email without prior arrangement.</P>
        </PolicySection>

        <PolicySection n={9} title="Cookies" id="cookies">
          <P><strong>Strictly necessary</strong> — cookies and equivalent storage required for the site to function, and to remember your cookie choice. These are always on.</P>
          <P><strong>Analytics</strong> — we measure aggregate traffic with Vercel Web Analytics, which is cookieless. Where Google Analytics 4 is enabled, it sets analytics cookies and is loaded only after you accept our cookie banner; until then, analytics storage is denied by default (Google Consent Mode). We do not use advertising or cross-site tracking cookies.</P>
          <P>You can change or withdraw your analytics choice at any time by clearing this site&rsquo;s storage in your browser, which will show the cookie banner again on your next visit.</P>
        </PolicySection>

        <PolicySection n={10} title="Changes to this policy" id="changes">
          <P>We may update this Privacy Policy from time to time. Material changes will be notified by updating the &ldquo;Last updated&rdquo; date at the top of this page. The current version always governs.</P>
        </PolicySection>

        <PolicySection n={11} title="Contact" id="contact">
          <P>Questions, requests and complaints regarding this policy may be sent to:</P>
          <P>
            <strong>Authentic Accounting and Bookkeeping L.L.C</strong><br/>
            Office 406, Mai Tower<br/>
            Al Nahda 1, Dubai, United Arab Emirates<br/>
            <a href="mailto:info@aaccounting.me" style={{ color: 'var(--aa-cyan-700)' }}>info@aaccounting.me</a> &middot; <a href="tel:+97143960399" style={{ color: 'var(--aa-cyan-700)' }}>+971 4 396 0399</a>
          </P>
        </PolicySection>

      </PolicyBody>
    </div>
  );
}

// ---------- TERMS OF USE ----------
function TermsPage({ onNav }) {
  return (
    <div>
      <PolicyHero
        eyebrow="Terms"
        title="Terms of Use."
        intro="These Terms of Use govern your access to and use of aaccounting.me, the marketing website of Authentic Accounting and Bookkeeping L.L.C. By using the website you agree to be bound by these terms. If you do not agree, please do not use the site."
      />

      <PolicyBody>
        <PolicySection n={1} title="The website is informational" id="informational">
          <P>aaccounting.me is the marketing and informational website of the firm. Its content describes our services, sectors and approach. It is provided for general information only and does not constitute professional accounting, tax, legal or advisory advice.</P>
          <P>No part of this website forms a professional engagement, a quotation, or a commitment to undertake work. A professional engagement begins only when a written engagement letter has been signed by both you and the firm.</P>
        </PolicySection>

        <PolicySection n={2} title="No reliance" id="reliance">
          <P>We take care that the content on this website is accurate and current, but regulations in the UAE change frequently. The firm makes no representation or warranty, express or implied, regarding the completeness, accuracy or timeliness of the content. You should not act, or refrain from acting, on the basis of any content on the website without taking specific professional advice on your own circumstances.</P>
          <P>The firm accepts no liability for any action taken or not taken in reliance on website content.</P>
        </PolicySection>

        <PolicySection n={3} title="Permitted use" id="use">
          <P>You may view, download and print pages of the website for your own personal or internal business use, provided you do not modify the content and you retain all copyright and other proprietary notices. You agree not to:</P>
          <PolicyList items={[
            'Use the website in a way that disrupts or impairs its operation',
            'Attempt to gain unauthorised access to any part of the website or its supporting systems',
            'Use any automated system (scraping, harvesting, mass-download) without our prior written consent',
            'Submit false, misleading, abusive or unlawful content through any contact form',
            'Misrepresent yourself or impersonate another person or entity',
          ]}/>
        </PolicySection>

        <PolicySection n={4} title="Intellectual property" id="ip">
          <P>All content on the website &mdash; including text, layout, design, graphics, logos, the &ldquo;Authentic Accounting&rdquo; wordmark and the firm&rsquo;s control framework &mdash; is owned by Authentic Accounting and Bookkeeping L.L.C or its licensors and is protected by UAE intellectual property law and international conventions.</P>
          <P>Nothing on the website grants you any licence or right to use any trade mark, logo or content of the firm without prior written permission.</P>
        </PolicySection>

        <PolicySection n={5} title="Third-party links" id="links">
          <P>The website may contain links to third-party websites (for example, the Federal Tax Authority, government portals, or articles cited in our insights). Those websites are operated by third parties and are not under the firm&rsquo;s control. The firm is not responsible for the content, accuracy or availability of any third-party website and the inclusion of a link does not constitute endorsement.</P>
        </PolicySection>

        <PolicySection n={6} title="Confidentiality of communications" id="confidential">
          <P>Communications sent through the website&rsquo;s contact form or by email are not, of themselves, privileged or confidential beyond what applies under general law. You should not send highly sensitive information through the website without prior arrangement. The handling of personal information is governed by our <a href={pathForPolicyPage('privacy')} onClick={(e) => { e.preventDefault(); onNav('privacy'); }} style={{ color: 'var(--aa-cyan-700)' }}>Privacy Policy</a>.</P>
        </PolicySection>

        <PolicySection n={7} title="Limitation of liability" id="liability">
          <P>To the maximum extent permitted by UAE law, the firm, its partners, directors, employees and contractors shall not be liable for any indirect, incidental, special, consequential or punitive loss or damage &mdash; including loss of profits, revenue, data or goodwill &mdash; arising out of or in connection with your use of, or inability to use, the website.</P>
          <P>Nothing in these terms limits any liability that cannot be excluded under UAE law.</P>
        </PolicySection>

        <PolicySection n={8} title="Changes to the website and these terms" id="changes">
          <P>We may modify, suspend or discontinue any part of the website at any time without notice. We may also revise these Terms of Use from time to time; the revised version becomes effective on the date shown at the top of this page. Your continued use of the website after a change indicates acceptance of the revised terms.</P>
        </PolicySection>

        <PolicySection n={9} title="Governing law and jurisdiction" id="law">
          <P>These Terms of Use and any dispute or claim arising out of or in connection with them, or with use of the website, are governed by the laws of the United Arab Emirates as applied in the Emirate of Dubai.</P>
          <P>The courts of Dubai shall have exclusive jurisdiction to settle any such dispute or claim.</P>
        </PolicySection>

        <PolicySection n={10} title="Contact" id="contact">
          <P>Questions about these Terms of Use may be sent to:</P>
          <P>
            <strong>Authentic Accounting and Bookkeeping L.L.C</strong><br/>
            Office 406, Mai Tower<br/>
            Al Nahda 1, Dubai, United Arab Emirates<br/>
            <a href="mailto:info@aaccounting.me" style={{ color: 'var(--aa-cyan-700)' }}>info@aaccounting.me</a> &middot; <a href="tel:+97143960399" style={{ color: 'var(--aa-cyan-700)' }}>+971 4 396 0399</a>
          </P>
        </PolicySection>

      </PolicyBody>
    </div>
  );
}

Object.assign(window, { PrivacyPolicyPage, TermsPage });
