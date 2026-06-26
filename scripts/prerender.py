#!/usr/bin/env python3
"""
Static prerender for the Authentic Accounting site.

The site is a CDN-React SPA that sets <head> meta and JSON-LD at runtime, so
crawlers/social scrapers that don't run JS see only the homepage's meta on every
URL. This script writes a static <route>/index.html for each route with the
correct per-page <title>, description, canonical, Open Graph / Twitter tags and
JSON-LD baked into the raw HTML. The body stays the SPA shell (Googlebot renders
it; the page still hydrates into the SPA for client-side navigation).

Run:  python3 scripts/prerender.py
Re-run after any change to SEO copy, the insights list, or index.html.

IMPORTANT: the PAGE_SEO / INSIGHTS / PAGE_TO_PATH data below must stay in sync
with scripts/routes.js (single source of truth at runtime).
"""

import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_ORIGIN = "https://www.aaccounting.me"

PAGE_TO_PATH = {
    "home": "/",
    "services": "/services",
    "service-vat": "/services/vat",
    "service-corporate-tax": "/services/corporate-tax",
    "service-bookkeeping": "/services/bookkeeping",
    "service-audit-support": "/services/audit-support",
    "service-valuations": "/services/valuations",
    "service-transaction-advisory": "/services/transaction-advisory",
    "service-cfo": "/services/cfo-services",
    "service-financial-statements": "/services/financial-statements",
    "service-tax-planning": "/services/tax-planning",
    "service-fixed-asset-tagging": "/services/fixed-asset-tagging",
    "service-forensic-accounting": "/services/forensic-accounting",
    "service-internal-controls": "/services/internal-controls",
    "service-financial-modelling": "/services/financial-modelling",
    "service-feasibility-studies": "/services/feasibility-studies",
    "service-strategic-advisory": "/services/strategic-advisory",
    "e-invoicing": "/e-invoicing",
    "industries": "/industries",
    "about": "/about",
    "insights": "/insights",
    "careers": "/careers",
    "contact": "/contact",
    "privacy": "/privacy",
    "terms": "/terms",
}

PAGE_SEO = {
    "services": {
        "title": "Services — Bookkeeping, VAT, Corporate Tax & Advisory | Authentic Accounting",
        "description": "Compliance and advisory services for UAE businesses: bookkeeping, VAT, Corporate Tax, IFRS financial statements, valuations, M&A support and due diligence.",
    },
    "service-vat": {
        "title": "VAT Compliance UAE — Registration, Filing & FTA Support | Authentic Accounting",
        "description": "End-to-end UAE VAT compliance: registration, return filing, FTA correspondence, voluntary disclosures and audit support for SMEs and enterprises.",
    },
    "service-corporate-tax": {
        "title": "UAE Corporate Tax — Registration, Filing & 9% Compliance | Authentic Accounting",
        "description": "End-to-end UAE Corporate Tax compliance under Federal Decree-Law 47 of 2022: registration, taxable-income computation, free-zone (QFZP) analysis, Small Business Relief and FTA return filing for SMEs, free zones and groups.",
    },
    "service-bookkeeping": {
        "title": "Outsourced Bookkeeping & Accounting Services Dubai, UAE | Authentic Accounting",
        "description": "Outsourced bookkeeping and accounting in Dubai: day-to-day recording, bank and ledger reconciliations, monthly close and management accounts — VAT and Corporate Tax-ready, delivered against a documented controls framework.",
    },
    "service-audit-support": {
        "title": "Audit Support & Preparation Services Dubai, UAE | Authentic Accounting",
        "description": "Audit preparation and support in the UAE: audit-ready trial balance and lead schedules, reconciliations, auditor liaison and findings closeout for statutory and group audits under IFRS — so your external audit runs fast and clean.",
    },
    "service-valuations": {
        "title": "Business Valuation Services Dubai, UAE — DCF & Fair Value | Authentic Accounting",
        "description": "Independent business valuations in the UAE — DCF, market-multiple and asset-based — for M&A, shareholder disputes, financial reporting (IFRS 13 fair value), fundraising and statutory purposes, to International Valuation Standards.",
    },
    "service-transaction-advisory": {
        "title": "M&A Support & Financial Due Diligence Dubai, UAE | Authentic Accounting",
        "description": "Buy-side and sell-side M&A support and financial due diligence in the UAE — quality of earnings, working capital and net debt analysis, deal structuring and closing mechanics. Independent, evidence-led transaction advisory.",
    },
    "service-cfo": {
        "title": "Outsourced & Fractional CFO Services Dubai, UAE | Authentic Accounting",
        "description": "Interim, fractional and outsourced CFO services in the UAE — board reporting, budgeting and forecasting, cash and treasury, fundraising support and finance function build-out. Senior finance leadership without a full-time hire.",
    },
    "service-financial-statements": {
        "title": "IFRS Financial Statements Preparation Dubai, UAE | Authentic Accounting",
        "description": "Preparation of IFRS and IFRS for SMEs financial statements in the UAE — balance sheet, income statement, cash flow and notes, group consolidation and disclosures — audit- and Corporate Tax-ready.",
    },
    "service-tax-planning": {
        "title": "Corporate Tax Planning & Structuring Dubai, UAE | Authentic Accounting",
        "description": "UAE Corporate Tax planning and structuring — group and transaction structuring, free-zone (QFZP) optimisation, transfer pricing alignment and Corporate Tax position memos. Compliant, FTA-defensible tax advisory.",
    },
    "service-fixed-asset-tagging": {
        "title": "Fixed Asset Tagging & Register Services Dubai, UAE | Authentic Accounting",
        "description": "Physical fixed-asset verification and tagging, register reconstruction, depreciation policy review and impairment indicators across the UAE — a clean, auditable fixed-asset register.",
    },
    "service-forensic-accounting": {
        "title": "Forensic Accounting & Fraud Investigation Dubai, UAE | Authentic Accounting",
        "description": "Forensic accounting in the UAE — fraud investigation, dispute and litigation support, expert testimony and evidence reconstruction for contested financial matters.",
    },
    "service-internal-controls": {
        "title": "Internal Controls Design & Review Dubai, UAE | Authentic Accounting",
        "description": "Internal controls design, walkthroughs and remediation for UAE businesses, regulated entities and pre-IPO issuers — risk-and-control matrices, testing and management attestation.",
    },
    "service-financial-modelling": {
        "title": "Financial Modelling Services Dubai, UAE | Authentic Accounting",
        "description": "Auditable financial models for UAE businesses — operating, transaction, LBO and board-pack models, FAST-standard, with scenarios and sensitivity analysis.",
    },
    "service-feasibility-studies": {
        "title": "Feasibility Study Services Dubai, UAE | Authentic Accounting",
        "description": "Project feasibility studies in the UAE — financial modelling, sensitivity and scenario analysis and a clear pre-investment recommendation for new projects and ventures.",
    },
    "service-strategic-advisory": {
        "title": "Strategic Financial Advisory Dubai, UAE | Authentic Accounting",
        "description": "Board-level strategic financial advisory in the UAE — accounting policy selection, complex transactions, restructuring and Board-grade positions.",
    },
    "e-invoicing": {
        "title": "UAE E-Invoicing Readiness — Peppol & FTA Compliance | Authentic Accounting",
        "description": "Prepare your UAE business for e-invoicing mandates. System readiness, Peppol integration guidance, process design and compliance advisory.",
    },
    "industries": {
        "title": "Industries We Serve — UAE Accounting & Advisory | Authentic Accounting",
        "description": "Sector-specific accounting and advisory for trading, manufacturing, hospitality, healthcare, real estate, technology and Government entities across the UAE.",
    },
    "about": {
        "title": "About Us — Authentic Accounting | UAE Chartered Accountants Since 2017",
        "description": "Learn about Authentic Accounting and Bookkeeping L.L.C — a Dubai-based firm delivering reconciliation discipline, regulatory compliance and Board-grade advisory since 2017.",
    },
    "insights": {
        "title": "Insights — UAE Tax, Compliance & Advisory Articles | Authentic Accounting",
        "description": "Regulatory updates, FTA guidance, Corporate Tax notes and advisory articles from Authentic Accounting's UAE compliance team.",
    },
    "careers": {
        "title": "Careers — Join Authentic Accounting | Dubai, UAE",
        "description": "Explore career opportunities at Authentic Accounting. Join a UAE compliance and advisory team built on reconciliation discipline and professional standards.",
    },
    "contact": {
        "title": "Contact Us — Book a Consultation | Authentic Accounting Dubai",
        "description": "Contact Authentic Accounting in Dubai. Book a consultation for bookkeeping, VAT, Corporate Tax, valuations or advisory support across the UAE.",
    },
    "privacy": {
        "title": "Privacy Policy | Authentic Accounting Dubai",
        "description": "How Authentic Accounting and Bookkeeping L.L.C collects, uses, retains and protects personal information submitted through aaccounting.me, in line with UAE Federal Decree-Law No. 45 of 2021 (PDPL).",
    },
    "terms": {
        "title": "Terms of Use | Authentic Accounting Dubai",
        "description": "Terms governing use of the aaccounting.me website. Marketing site only — does not constitute a professional engagement. UAE law and Dubai courts apply.",
    },
}

INSIGHTS = [
    {"slug": "uae-e-invoicing-explained", "tag": "E-Invoicing", "date": "20 Jun 2026",
     "title": "UAE e-invoicing explained: a plain-English guide for businesses.",
     "author": "CA Kiran Prasad S", "reviewer": "Jinu Govindan", "reference": "Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)",
     "excerpt": "The UAE is moving to mandatory structured e-invoicing for B2B and B2G transactions. What that actually means, why it is happening, and how the OpenPeppol 5-corner model changes the way you issue an invoice.",
     "published": True},
    {"slug": "uae-e-invoicing-deadlines-phases", "tag": "E-Invoicing", "date": "18 Jun 2026",
     "title": "UAE e-invoicing deadlines and phases: who must comply, and by when.",
     "author": "CA Kiran Prasad S", "reviewer": "Jinu Govindan", "reference": "Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)",
     "excerpt": "The rollout is phased by annual revenue, with two dates that matter for each business — the deadline to appoint an Accredited Service Provider, and the mandatory go-live. Here is the full timeline, tier by tier.",
     "published": True},
    {"slug": "choosing-accredited-service-provider-asp", "tag": "E-Invoicing", "date": "16 Jun 2026",
     "title": "Choosing an Accredited Service Provider (ASP) for UAE e-invoicing.",
     "author": "CA Kiran Prasad S", "reviewer": "Jinu Govindan", "reference": "Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)",
     "excerpt": "Every in-scope business must appoint an Accredited Service Provider to transmit its e-invoices. What an ASP does in the 5-corner model, and the questions to ask before you sign.",
     "published": True},
    {"slug": "prepare-erp-for-uae-e-invoicing", "tag": "E-Invoicing", "date": "12 Jun 2026",
     "title": "Getting your ERP ready for UAE e-invoicing: a practical checklist.",
     "author": "CA Kiran Prasad S", "reviewer": "Jinu Govindan", "reference": "Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)",
     "excerpt": "E-invoicing is not just a tax change — it is a data change. The master-data hygiene, field mapping and testing that decide whether your go-live is smooth or painful.",
     "published": True},
    {"slug": "free-zone-qualifying-income", "tag": "Corporate Tax", "date": "12 Apr 2026",
     "title": "Free zone qualifying income — three traps in the UAE free-zone tax rules.",
     "author": "CA Kiran Prasad S", "reviewer": "Jinu Govindan", "reference": "Cabinet Decision 100 of 2023 · Ministerial Decision 229 of 2025 (replacing MD 265 of 2023)",
     "excerpt": "The UAE’s free-zone tax rules — Cabinet Decision 100 of 2023 and Ministerial Decision 229 of 2025 (which replaced MD 265 of 2023) — are being read three different ways by tax teams in the UAE. We unpack the three traps we keep seeing in client positions, and what the consequence is at filing.",
     "published": True},
    {"slug": "dcf-terminal-values-family-office", "tag": "Valuations", "date": "02 Apr 2026",
     "title": "Why DCF terminal values are mispriced for UAE family-office holdings.",
     "author": "Jinu Govindan",
     "excerpt": "Terminal value carries most of the weight in a DCF, yet it is where UAE family-office valuations most often drift. A note on the assumptions we test first.",
     "published": False},
    {"slug": "control-framework-erp-migrations", "tag": "Controls", "date": "21 Mar 2026",
     "title": "A control framework that survives ERP migrations: a practitioner’s note.",
     "author": "Jinu Kurikesu",
     "excerpt": "Most control breaks we are called in to fix trace back to an ERP migration. A practitioner’s note on the controls that have to survive the cutover.",
     "published": False},
    {"slug": "designated-zone-reclassification", "tag": "VAT", "date": "14 Mar 2026",
     "title": "Designated zone reclassification — the trail you must keep.",
     "author": "CA Kiran Prasad S",
     "excerpt": "Goods in a VAT designated zone can be reclassified as taxable supplies when the movement trail is thin. What records keep the position defensible.",
     "published": False},
    {"slug": "working-capital-pegs-uae-deals", "tag": "M&A", "date": "02 Mar 2026",
     "title": "Working capital pegs in UAE deals: closing-mechanic patterns we keep seeing.",
     "author": "Jinu Govindan",
     "excerpt": "The working-capital peg is where UAE deals quietly gain or lose value at close. Patterns we keep seeing in closing mechanics, and how to set the target.",
     "published": False},
    {"slug": "transfer-pricing-thresholds-board", "tag": "Corporate Tax", "date": "18 Feb 2026",
     "title": "Transfer pricing thresholds and the documentation a Board should expect.",
     "author": "CA Kiran Prasad S",
     "excerpt": "What documentation a UAE Board should expect to see on transfer pricing, and the thresholds that decide how much of it is mandatory.",
     "published": False},
    {"slug": "reconciliation-resolve-to-zero", "tag": "Controls", "date": "05 Feb 2026",
     "title": "Why every reconciliation should resolve to zero — and what to do when it does not.",
     "author": "Jinu Kurikesu",
     "excerpt": "A reconciliation that closes to a tolerance is not reconciled. Why we hold the line at zero, and the disciplined way to clear a residual.",
     "published": False},
    {"slug": "cost-of-equity-gcc-buildup", "tag": "Valuations", "date": "21 Jan 2026",
     "title": "Cost-of-equity in the GCC: a practitioner’s build-up.",
     "author": "Jinu Govindan",
     "excerpt": "Off-the-shelf cost-of-equity inputs travel badly to the GCC. A practitioner’s build-up, component by component, with the local adjustments that matter.",
     "published": False},
]
INSIGHTS_BY_SLUG = {a["slug"]: a for a in INSIGHTS}

BREADCRUMB_LABELS = {
    "home": "Home", "services": "Services", "service-vat": "VAT Compliance",
    "service-corporate-tax": "Corporate Tax", "service-bookkeeping": "Bookkeeping",
    "service-audit-support": "Audit Support", "service-valuations": "Valuations",
    "service-transaction-advisory": "Transaction Advisory", "service-cfo": "CFO Services",
    "service-financial-statements": "Financial Statements", "service-tax-planning": "Tax Planning",
    "service-fixed-asset-tagging": "Fixed Asset Tagging", "service-forensic-accounting": "Forensic Accounting",
    "service-internal-controls": "Internal Controls", "service-financial-modelling": "Financial Modelling",
    "service-feasibility-studies": "Feasibility Studies", "service-strategic-advisory": "Strategic Advisory",
    "e-invoicing": "E-Invoicing", "industries": "Industries", "about": "About",
    "insights": "Insights", "careers": "Careers", "contact": "Contact",
    "privacy": "Privacy Policy", "terms": "Terms of Use",
}

MONTHS = {"Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
          "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"}

ORG = {
    "@type": "Organization",
    "name": "Authentic Accounting and Bookkeeping L.L.C",
    "url": SITE_ORIGIN + "/",
    "logo": {"@type": "ImageObject", "url": SITE_ORIGIN + "/assets/logos/authentic-accounting-full.png"},
}

# Keep in sync with EINVOICE_FAQ in scripts/routes.js.
EINVOICE_FAQ = [
    {"q": "Is e-invoicing mandatory in the UAE?",
     "a": "Yes. The UAE is introducing mandatory structured e-invoicing for business-to-business (B2B) and business-to-government (B2G) transactions, under Ministerial Decisions 243 and 244 of 2025. Business-to-consumer (B2C) invoicing is currently optional. The rollout is phased by annual revenue."},
    {"q": "When is the UAE e-invoicing deadline for my business?",
     "a": "It depends on your annual revenue. Businesses with revenue of AED 50 million or more must appoint an Accredited Service Provider (ASP) by 30 October 2026 and go live on 1 January 2027. Businesses under AED 50 million appoint by 31 March 2027 and go live on 1 July 2027. Government entities appoint by 31 March 2027 and go live on 1 October 2027."},
    {"q": "What is an Accredited Service Provider (ASP)?",
     "a": "An ASP is a provider accredited by the UAE Ministry of Finance to transmit your e-invoices through the official network. Every in-scope business must appoint one — invoices are issued and exchanged through your ASP."},
    {"q": "What is the 5-corner (OpenPeppol) model?",
     "a": "The UAE uses the OpenPeppol “5-corner” model: each invoice is exchanged as structured data between your ASP and your counterparty’s ASP, with the Federal Tax Authority as a reporting corner — replacing PDFs and paper."},
    {"q": "Will PDF or paper invoices still be valid?",
     "a": "No. From your phase’s go-live date, only structured invoices transmitted through an accredited ASP will be valid for the covered transactions. PDF and paper invoices will not."},
    {"q": "Does a free zone company have to comply?",
     "a": "Yes. The mandate applies to B2B and B2G transactions across the UAE, including free zone companies, based on the same revenue thresholds."},
    {"q": "What is the legal basis for UAE e-invoicing?",
     "a": "Ministerial Decisions 243 and 244 of 2025, issued by the UAE Ministry of Finance, set the scope, obligations, ASP accreditation and the phased timeline."},
    {"q": "How do I get my business ready?",
     "a": "Assess your transaction scope, appoint an Accredited Service Provider, map your ERP / accounting-system fields to the required e-invoice format, and run end-to-end testing before your go-live date."},
]

# Keep in sync with CORPTAX_FAQ in scripts/routes.js.
CORPTAX_FAQ = [
    {"q": "Who has to pay UAE Corporate Tax?",
     "a": "UAE Corporate Tax applies to businesses and commercial activities for financial years starting on or after 1 June 2023, under Federal Decree-Law No. 47 of 2022. The rate is 0% on taxable income up to AED 375,000 and 9% on taxable income above AED 375,000."},
    {"q": "Do I still need to register if my income is below AED 375,000?",
     "a": "Yes. The AED 375,000 threshold is a 0% rate band, not an exemption. Every taxable person must register for Corporate Tax, obtain a Tax Registration Number and file an annual return — even when the tax due is zero."},
    {"q": "What is Small Business Relief?",
     "a": "Businesses with total revenue of AED 3 million or less in a tax period can elect Small Business Relief and be treated as having no taxable income. It is a transitional measure available for tax periods ending on or before 31 December 2026, and it must be actively elected with the FTA."},
    {"q": "Do free zone companies pay Corporate Tax?",
     "a": "A Qualifying Free Zone Person (QFZP) can benefit from a 0% rate on its qualifying income if it meets all conditions (adequate substance, qualifying activities and the de minimis limits) under Cabinet Decision 100 of 2023 and Ministerial Decision 229 of 2025. Non-qualifying income is taxed at 9%, and free zone businesses must still register and file."},
    {"q": "When is my Corporate Tax return due?",
     "a": "The return must be filed, and any tax paid, within nine months of the end of your tax period. For a 31 December year-end, the return is due by 30 September of the following year."},
    {"q": "What is the penalty for registering late?",
     "a": "Late Corporate Tax registration carries an administrative penalty of AED 10,000. The FTA has waived this penalty where a business files its first Corporate Tax return within seven months of the end of its first tax period."},
    {"q": "What about large multinational groups?",
     "a": "Multinational groups with consolidated global revenue of EUR 750 million or more are subject to a 15% Domestic Minimum Top-up Tax (DMTT) for financial years starting on or after 1 January 2025, in line with the OECD Pillar Two rules."},
]

# Keep in sync with BOOKKEEPING_FAQ in scripts/routes.js.
BOOKKEEPING_FAQ = [
    {"q": "What does outsourced bookkeeping include?",
     "a": "A complete day-to-day finance function: recording sales, purchases and expenses, bank and ledger reconciliations, a disciplined monthly close, and a management accounts pack (profit & loss, balance sheet and cash flow). Your books stay current, accurate and audit-ready."},
    {"q": "Which accounting software do you work with?",
     "a": "We work in your existing system — Tally, Zoho Books, QuickBooks, Xero, SAP, Microsoft Dynamics and others — or recommend and set up the right one if you are starting fresh."},
    {"q": "How does bookkeeping keep me VAT and Corporate Tax compliant?",
     "a": "Accurate, reconciled books are the foundation of every correct VAT return and Corporate Tax computation. We tag transactions at source so your filings are straightforward and defensible, and your records meet the FTA’s retention requirements."},
    {"q": "Can you clear a backlog of unrecorded months?",
     "a": "Yes. We run a catch-up scope to reconstruct and reconcile prior periods, bring your books fully up to date, and then move you onto a steady monthly cycle."},
    {"q": "How often will I receive reports?",
     "a": "Reporting follows your engagement — from weekly through monthly, quarterly or yearly. We agree the cadence and the pack contents up front, and can move to a tighter cycle whenever you need a closer view of cash and performance."},
    {"q": "Who owns the data and the books?",
     "a": "You do. The records are maintained in your accounting system, and everything is exportable on request."},
]

# Keep in sync with AUDIT_FAQ in scripts/routes.js.
AUDIT_FAQ = [
    {"q": "Do you perform the audit?",
     "a": "No. We are not your statutory auditor. We prepare your books, schedules and supporting evidence, act as the single point of contact with your appointed audit firm, and close out findings — so the external audit runs quickly and cleanly. You appoint the licensed auditor, and we can recommend suitable firms."},
    {"q": "Does my UAE company need an audit?",
     "a": "Most UAE mainland companies are required to prepare audited financial statements, and many free zones require audited accounts for licence renewal. Even where it is not mandatory, lenders, investors and group reporting usually require an audit."},
    {"q": "What do you prepare for the audit?",
     "a": "An audit-ready file: a tied-out trial balance, lead schedules for each material balance, reconciliations, and the supporting documents and explanations that answer the auditor’s prepared-by-client (PBC) list."},
    {"q": "Which reporting standards do you work to?",
     "a": "IFRS and IFRS for SMEs — the financial reporting frameworks used across the UAE — including the disclosures and notes your auditor will expect."},
    {"q": "Can you help if our books are behind?",
     "a": "Yes. We run a catch-up and clean-up before the audit — reconstructing and reconciling prior periods — so you go into fieldwork with complete, defensible records."},
    {"q": "Do you handle group and consolidated audits?",
     "a": "Yes. We prepare consolidation schedules, intercompany eliminations and group reporting packs, and coordinate across entities and auditors for a group audit."},
]

# Keep in sync with VALUATIONS_FAQ in scripts/routes.js.
VALUATIONS_FAQ = [
    {"q": "How do you value a business?",
     "a": "We use the three recognised approaches — income (discounted cash flow), market (comparable companies and precedent transactions) and asset-based (net asset value) — and select and weight them based on the company, the industry and the purpose of the valuation."},
    {"q": "What can the valuation be used for?",
     "a": "Mergers and acquisitions, share transfers and buy-outs, shareholder or partner disputes, financial reporting (purchase price allocation and impairment under IFRS), fundraising, employee share schemes, and statutory or regulatory requirements."},
    {"q": "Which valuation standards do you follow?",
     "a": "We work to the International Valuation Standards (IVS), and to IFRS 13 fair value where the valuation is for financial reporting — so the result is independent and defensible to auditors, investors and courts."},
    {"q": "What information do you need from us?",
     "a": "Typically three to five years of financial statements, current management accounts, forecasts or a business plan, the cap table, and key contracts. We confirm a tailored information request once we understand the purpose and valuation date."},
    {"q": "How long does a valuation take?",
     "a": "Most engagements take around two to four weeks from receiving complete information, depending on the complexity of the business and the level of assurance required."},
    {"q": "Is the valuation independent and defensible?",
     "a": "Yes. Every valuation is methodology-led, with documented assumptions, cross-checked approaches and sensitivity analysis, set out in a report suitable for third parties such as auditors, investors and courts."},
]

# Keep in sync with TRANSACTION_FAQ in scripts/routes.js.
TRANSACTION_FAQ = [
    {"q": "Do you act buy-side or sell-side?",
     "a": "Both. We run buy-side financial due diligence for acquirers and investors, and sell-side (vendor) due diligence and readiness for owners preparing to sell — so each side goes into the deal with the numbers proven."},
    {"q": "What does financial due diligence cover?",
     "a": "Quality of earnings, revenue and margin sustainability, working capital, net debt and debt-like items, the forecast and the key commercial risks — summarised in a red-flag report focused on what moves price or risk."},
    {"q": "What is quality of earnings?",
     "a": "Quality of earnings adjusts reported EBITDA to a normalised, sustainable run-rate by stripping out one-offs and accounting distortions. It is the number a buyer actually applies a multiple to, so it usually drives the headline price."},
    {"q": "How do working capital and net debt affect the price?",
     "a": "A deal price typically bridges from enterprise value to equity value through a working-capital peg and net debt. We set and defend the peg and identify debt-like items, so value is not quietly lost at completion."},
    {"q": "Do you help with the SPA and closing?",
     "a": "Yes. We provide the financial inputs to the sale and purchase agreement (SPA), prepare completion accounts and handle the post-close adjustment mechanics through to a clean close."},
    {"q": "How long does due diligence take?",
     "a": "Most engagements run around two to four weeks depending on deal size and data availability, with expedited timelines possible for competitive processes."},
]

# Keep in sync with CFO_FAQ in scripts/routes.js.
CFO_FAQ = [
    {"q": "What is a fractional or outsourced CFO?",
     "a": "Senior finance leadership on a part-time, interim or project basis. You get CFO-level strategy, reporting, cash management and controls — without the cost of a full-time hire — scaled to what your business needs right now."},
    {"q": "When do I need a CFO rather than an accountant?",
     "a": "A bookkeeper or accountant keeps the records accurate; a CFO turns those numbers into decisions — forecasting, cash, fundraising, board reporting and controls. It is the right step when you are scaling, raising capital, or preparing for a transaction."},
    {"q": "What does the engagement include?",
     "a": "Board and management reporting, budgeting and rolling forecasts, cash flow and treasury, KPI dashboards, fundraising and investor support, and building out your finance team, systems and controls."},
    {"q": "Interim, fractional or project — which model?",
     "a": "Interim covers a full-time gap for a defined period; fractional is ongoing part-time leadership; project is a specific deliverable such as a fundraise, a budget cycle or a systems implementation. We scope the model to your stage."},
    {"q": "Can you support fundraising and investors?",
     "a": "Yes. We prepare investor reporting, the financial model and the data room, and get you diligence-ready — then support the process through to close."},
    {"q": "How quickly can you start?",
     "a": "Typically within a week or two of an initial scoping conversation, with a faster start where there is an urgent gap to cover."},
]

# Keep in sync with FS_FAQ in scripts/routes.js.
FS_FAQ = [
    {"q": "What financial statements do you prepare?",
     "a": "A complete set under IFRS or IFRS for SMEs: the statement of financial position (balance sheet), the income statement (profit & loss), the statement of cash flows, the statement of changes in equity, and the accompanying notes and disclosures."},
    {"q": "IFRS or IFRS for SMEs — which applies to me?",
     "a": "It depends on your size, ownership and reporting needs. Most UAE SMEs report under IFRS for SMEs, while larger or public-interest entities use full IFRS. We confirm the right framework and apply it consistently."},
    {"q": "Are the financial statements audit-ready?",
     "a": "Yes. They are prepared with lead schedules, reconciliations and the disclosures auditors expect, so they go straight into the audit with minimal rework."},
    {"q": "Do you handle group consolidation?",
     "a": "Yes. We prepare consolidated financial statements with intercompany eliminations, minority interests and group accounting policies applied across entities."},
    {"q": "Do the financial statements support Corporate Tax?",
     "a": "Yes. Your financial statements are the starting point for the Corporate Tax computation, so we prepare them on a basis consistent with your Corporate Tax position."},
    {"q": "How long does preparation take?",
     "a": "Typically one to three weeks once the trial balance is finalised, depending on the complexity of the business and whether a consolidation is involved."},
]

# Keep in sync with TAXPLAN_FAQ in scripts/routes.js.
TAXPLAN_FAQ = [
    {"q": "What is tax planning, and how is it different from avoidance?",
     "a": "Tax planning is arranging your affairs to manage tax efficiently within the law. We focus on compliant, FTA-defensible positions backed by the legislation — not aggressive schemes that create risk. The aim is certainty, not exposure."},
    {"q": "What does UAE Corporate Tax planning cover?",
     "a": "Group and holding structure, mainland versus free-zone positioning, free-zone (QFZP) qualifying income, transfer pricing alignment, transaction and deal structuring, and documented Corporate Tax positions."},
    {"q": "Can a free zone company keep the 0% Corporate Tax rate?",
     "a": "With the right structure and genuine substance, a Qualifying Free Zone Person can retain 0% on its qualifying income. We test the conditions and the de minimis limits and document the position so it holds up on review."},
    {"q": "What is transfer pricing, and do I need documentation?",
     "a": "Transactions between related parties must be priced at arm’s length. Depending on the thresholds, you may need a transfer pricing disclosure and a master and local file. We align your pricing policy and prepare the documentation."},
    {"q": "When should I plan?",
     "a": "Before transactions and before year-end. Structuring is far more effective — and defensible — when it is set up in advance rather than reconstructed after the fact."},
    {"q": "Do you provide documented positions?",
     "a": "Yes. We set out each position in a memo with its legal basis, so your decisions are defensible if the FTA reviews them."},
]

# Keep in sync with VAT_FAQ in scripts/routes.js.
VAT_FAQ = [
    {"q": "When does my business need to register for VAT?",
     "a": "You must register if your taxable turnover crossed AED 375,000 in the past 12 months, or you reasonably expect it to in the next 30 days. Voluntary registration is available once you reach AED 187,500."},
    {"q": "How often do I file VAT returns?",
     "a": "Most businesses file quarterly; some are assigned monthly periods by the FTA. Returns are filed and any VAT paid through the FTA’s EmaraTax portal within 28 days of the end of each period."},
    {"q": "Can you handle a backlog of unfiled returns?",
     "a": "Yes. We run a recovery scope: reconstruct the source data, file the outstanding returns, and propose a voluntary disclosure pathway where penalties may be mitigated."},
    {"q": "How do you handle designated-zone vs. mainland classification?",
     "a": "Every transaction is tagged at source against the relevant designated-zone schedule, and any reclassification is documented in a position memo and revisited each period."},
    {"q": "What about zero-rated and exempt supplies?",
     "a": "Exports and certain services are zero-rated, while some supplies are exempt — and the distinction affects what input VAT you can recover. We classify each correctly so your recovery position is protected and defensible."},
    {"q": "How do you price a VAT engagement?",
     "a": "There is no one-size-fits-all rate. We price every engagement around what you actually need — transaction volume, number of entities and the level of support — and give you a clear, tailored quote for that scope. Ask us for a quote."},
]

# --- Specialist service FAQs (keep in sync with scripts/routes.js) ---
FIXED_ASSET_FAQ = [
    {"q": "What does fixed asset tagging involve?",
     "a": "A physical verification of your assets, durable tagging (barcodes or asset labels), and reconciliation of what exists on the floor to your fixed-asset register — so the register reflects reality."},
    {"q": "Why does my register need reconstruction?",
     "a": "Over time, registers drift: disposals are not removed, transfers are not recorded and additions are mislabelled. We rebuild a complete, accurate register that ties to the general ledger."},
    {"q": "Do you review depreciation and impairment?",
     "a": "Yes. We review useful lives and depreciation policy for reasonableness and flag impairment indicators, so your carrying values are defensible at audit."},
    {"q": "Is the output audit-ready?",
     "a": "Yes. You receive a reconciled register and supporting schedules that your auditor can rely on directly."},
]
FORENSIC_FAQ = [
    {"q": "What is forensic accounting?",
     "a": "The use of accounting and investigative techniques to examine financial records for fraud, misappropriation or disputes — producing findings and evidence that can be relied on in negotiations or proceedings."},
    {"q": "When should I engage a forensic accountant?",
     "a": "When you suspect fraud or misstatement, face a shareholder, contractual or matrimonial dispute, or need an independent expert to quantify a financial loss."},
    {"q": "Can you act as an expert witness?",
     "a": "Yes. We provide expert reports and testimony, and reconstruct the evidence trail to a standard suitable for dispute resolution and the courts."},
    {"q": "Is the engagement confidential?",
     "a": "Yes. Forensic work is handled discreetly and under strict confidentiality, with findings shared only with those you authorise."},
]
CONTROLS_FAQ = [
    {"q": "What are internal controls?",
     "a": "The policies and procedures that keep your finances accurate and your assets safe — covering authorisation, segregation of duties, reconciliations and review. They reduce the risk of error and fraud."},
    {"q": "What does an internal controls engagement deliver?",
     "a": "A risk-and-control matrix, walkthroughs and testing of key controls, a remediation plan for the gaps, and management attestation support."},
    {"q": "Do you support pre-IPO and regulated entities?",
     "a": "Yes. We design and document control frameworks to the standard expected by regulators, auditors and investors ahead of a listing or licensing review."},
    {"q": "How is this different from an audit?",
     "a": "An audit gives an opinion on your financial statements; an internal-controls engagement designs, tests and improves the controls that produce reliable numbers in the first place."},
]
MODELLING_FAQ = [
    {"q": "What kinds of models do you build?",
     "a": "Operating and three-statement models, transaction and LBO models, refinancing models and board-pack scenario models — built to be transparent and auditable."},
    {"q": "Are the models auditable?",
     "a": "Yes. We build to a consistent, FAST-style standard — clear inputs, no hard-coding in formulas, and a logical flow anyone can follow and stress-test."},
    {"q": "Can the model handle scenarios and sensitivities?",
     "a": "Yes. Models include switchable scenarios and sensitivity tables on the drivers that matter, so you can see the range of outcomes, not just a single case."},
    {"q": "Can you refresh or fix an existing model?",
     "a": "Yes. We review, repair and rebuild inherited models — fixing errors, adding structure and making them maintainable."},
]
FEASIBILITY_FAQ = [
    {"q": "What does a feasibility study include?",
     "a": "A financial model of the project, market and cost assumptions, sensitivity and scenario analysis, key return metrics (NPV, IRR, payback) and a clear pre-investment recommendation."},
    {"q": "When do I need a feasibility study?",
     "a": "Before committing capital to a new project, venture or expansion — and when a lender, investor or board requires an independent view of whether the numbers work."},
    {"q": "Will it tell me whether to proceed?",
     "a": "Yes. We set out the returns, the risks and the break-evens, and give a clear, reasoned recommendation — go, no-go or proceed-with-conditions."},
    {"q": "Can it support a funding application?",
     "a": "Yes. The study and model are prepared to a standard you can put in front of banks and investors."},
]
STRATEGIC_FAQ = [
    {"q": "What does strategic financial advisory cover?",
     "a": "Board-level support on the questions that do not fit a standard engagement — accounting policy selection, complex or one-off transactions, restructuring, and documented positions for the Board."},
    {"q": "How is it delivered?",
     "a": "As a focused advisory engagement, usually with periodic check-ins and a written position or recommendation you can take to the Board."},
    {"q": "Can you help with complex or unusual transactions?",
     "a": "Yes. We work through the accounting, tax and reporting implications of complex transactions and set out a defensible treatment."},
    {"q": "Do you provide written Board positions?",
     "a": "Yes. We document the recommendation and its basis so the Board has a clear, defensible record for its decision."},
]


def iso_date(d):
    m = re.match(r"^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$", d or "")
    if not m:
        return None
    return "%s-%s-%s" % (m.group(3), MONTHS.get(m.group(2), "01"), m.group(1).zfill(2))


def strip_period(s):
    return re.sub(r"\.\s*$", "", s)


def path_for_insight(slug):
    s = slug if slug in INSIGHTS_BY_SLUG else INSIGHTS[0]["slug"]
    return "/insights/" + s


def full_url(page):
    return SITE_ORIGIN + (PAGE_TO_PATH[page] if PAGE_TO_PATH[page] != "/" else "/")


def breadcrumb_chain(page, slug):
    items = [{"name": "Home", "url": SITE_ORIGIN + "/"}]
    if page == "home":
        return items
    if page.startswith("service-") and page in BREADCRUMB_LABELS:
        items.append({"name": "Services", "url": SITE_ORIGIN + PAGE_TO_PATH["services"]})
        items.append({"name": BREADCRUMB_LABELS[page], "url": full_url(page)})
        return items
    if page == "service-vat":
        items.append({"name": "Services", "url": SITE_ORIGIN + PAGE_TO_PATH["services"]})
        items.append({"name": BREADCRUMB_LABELS["service-vat"], "url": full_url("service-vat")})
        return items
    if page == "service-corporate-tax":
        items.append({"name": "Services", "url": SITE_ORIGIN + PAGE_TO_PATH["services"]})
        items.append({"name": BREADCRUMB_LABELS["service-corporate-tax"], "url": full_url("service-corporate-tax")})
        return items
    if page == "service-bookkeeping":
        items.append({"name": "Services", "url": SITE_ORIGIN + PAGE_TO_PATH["services"]})
        items.append({"name": BREADCRUMB_LABELS["service-bookkeeping"], "url": full_url("service-bookkeeping")})
        return items
    if page == "service-audit-support":
        items.append({"name": "Services", "url": SITE_ORIGIN + PAGE_TO_PATH["services"]})
        items.append({"name": BREADCRUMB_LABELS["service-audit-support"], "url": full_url("service-audit-support")})
        return items
    if page == "service-valuations":
        items.append({"name": "Services", "url": SITE_ORIGIN + PAGE_TO_PATH["services"]})
        items.append({"name": BREADCRUMB_LABELS["service-valuations"], "url": full_url("service-valuations")})
        return items
    if page == "service-transaction-advisory":
        items.append({"name": "Services", "url": SITE_ORIGIN + PAGE_TO_PATH["services"]})
        items.append({"name": BREADCRUMB_LABELS["service-transaction-advisory"], "url": full_url("service-transaction-advisory")})
        return items
    if page == "service-cfo":
        items.append({"name": "Services", "url": SITE_ORIGIN + PAGE_TO_PATH["services"]})
        items.append({"name": BREADCRUMB_LABELS["service-cfo"], "url": full_url("service-cfo")})
        return items
    if page == "service-financial-statements":
        items.append({"name": "Services", "url": SITE_ORIGIN + PAGE_TO_PATH["services"]})
        items.append({"name": BREADCRUMB_LABELS["service-financial-statements"], "url": full_url("service-financial-statements")})
        return items
    if page == "service-tax-planning":
        items.append({"name": "Services", "url": SITE_ORIGIN + PAGE_TO_PATH["services"]})
        items.append({"name": BREADCRUMB_LABELS["service-tax-planning"], "url": full_url("service-tax-planning")})
        return items
    if page == "insight":
        a = INSIGHTS_BY_SLUG.get(slug, INSIGHTS[0])
        items.append({"name": "Insights", "url": SITE_ORIGIN + PAGE_TO_PATH["insights"]})
        items.append({"name": strip_period(a["title"]), "url": SITE_ORIGIN + path_for_insight(a["slug"])})
        return items
    if page in BREADCRUMB_LABELS:
        items.append({"name": BREADCRUMB_LABELS[page], "url": full_url(page)})
    return items


def build_jsonld(page, slug):
    blocks = []
    chain = breadcrumb_chain(page, slug)
    if len(chain) > 1:
        blocks.append({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1, "name": c["name"], "item": c["url"]}
                for i, c in enumerate(chain)
            ],
        })
    if page == "insight":
        a = INSIGHTS_BY_SLUG.get(slug, INSIGHTS[0])
        block = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": strip_period(a["title"]),
            "description": a["excerpt"],
            "author": {"@type": "Person", "name": a["author"]},
            "publisher": ORG,
            "mainEntityOfPage": SITE_ORIGIN + path_for_insight(a["slug"]),
        }
        iso = iso_date(a["date"])
        if iso:
            block["datePublished"] = iso
            block["dateModified"] = iso
        blocks.append(block)
    if page == "services" or page == "e-invoicing" or page.startswith("service-"):
        meta = PAGE_SEO[page]
        blocks.append({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": re.split(r"[|—]", meta["title"])[0].strip(),
            "description": meta["description"],
            "serviceType": BREADCRUMB_LABELS.get(page, "Accounting services"),
            "areaServed": {"@type": "Country", "name": "United Arab Emirates"},
            "provider": ORG,
        })
    faq_by_page = {"e-invoicing": EINVOICE_FAQ, "service-corporate-tax": CORPTAX_FAQ, "service-bookkeeping": BOOKKEEPING_FAQ, "service-audit-support": AUDIT_FAQ, "service-valuations": VALUATIONS_FAQ, "service-transaction-advisory": TRANSACTION_FAQ, "service-cfo": CFO_FAQ, "service-financial-statements": FS_FAQ, "service-tax-planning": TAXPLAN_FAQ, "service-vat": VAT_FAQ, "service-fixed-asset-tagging": FIXED_ASSET_FAQ, "service-forensic-accounting": FORENSIC_FAQ, "service-internal-controls": CONTROLS_FAQ, "service-financial-modelling": MODELLING_FAQ, "service-feasibility-studies": FEASIBILITY_FAQ, "service-strategic-advisory": STRATEGIC_FAQ}
    if page in faq_by_page:
        blocks.append({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": f["q"],
                 "acceptedAnswer": {"@type": "Answer", "text": f["a"]}}
                for f in faq_by_page[page]
            ],
        })
    return blocks


def esc(s, attr=False):
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    if attr:
        s = s.replace('"', "&quot;")
    return s


def set_title(html, title):
    return re.sub(r"<title>.*?</title>", lambda m: "<title>" + esc(title) + "</title>", html, count=1, flags=re.S)


def set_meta(html, attr, name, value):
    # attr is 'name' or 'property'
    pat = r'(<meta ' + attr + r'="' + re.escape(name) + r'" content=")(.*?)(")'
    return re.sub(pat, lambda m: m.group(1) + esc(value, attr=True) + m.group(3), html, count=1, flags=re.S)


def set_canonical(html, url):
    return re.sub(r'(<link rel="canonical" href=")(.*?)(")',
                  lambda m: m.group(1) + esc(url, attr=True) + m.group(3), html, count=1, flags=re.S)


def set_robots(html, value):
    return re.sub(r'(<meta name="robots" content=")(.*?)(")',
                  lambda m: m.group(1) + esc(value, attr=True) + m.group(3), html, count=1, flags=re.S)


def render(template, title, description, canonical, jsonld, robots=None):
    html = template
    html = html.replace("<head>", '<head>\n  <base href="/">', 1)
    html = set_title(html, title)
    html = set_meta(html, "name", "description", description)
    html = set_canonical(html, canonical)
    html = set_meta(html, "property", "og:url", canonical)
    html = set_meta(html, "property", "og:title", title)
    html = set_meta(html, "property", "og:description", description)
    html = set_meta(html, "name", "twitter:title", title)
    html = set_meta(html, "name", "twitter:description", description)
    if robots:
        html = set_robots(html, robots)
    if jsonld:
        tags = "".join(
            '\n  <script type="application/ld+json" data-aa-jsonld>%s</script>'
            % json.dumps(b, ensure_ascii=False, separators=(",", ":"))
            for b in jsonld
        )
        html = html.replace("</head>", tags + "\n</head>", 1)
    html = html.replace(
        "<!doctype html>",
        "<!doctype html>\n<!-- Prerendered by scripts/prerender.py — do not edit by hand; re-run the script. -->",
        1,
    )
    return html


def write(route_path, html):
    rel = route_path.strip("/")
    out_dir = os.path.join(ROOT, *rel.split("/")) if rel else ROOT
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "index.html")
    with open(out_file, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    return os.path.relpath(out_file, ROOT).replace("\\", "/")


def main():
    with open(os.path.join(ROOT, "index.html"), encoding="utf-8") as f:
        template = f.read()

    written = []

    # Static pages (home is the root index.html — already correct, skip)
    for page in ("services", "service-vat", "service-corporate-tax", "service-bookkeeping", "service-audit-support", "service-valuations", "service-transaction-advisory", "service-cfo", "service-financial-statements", "service-tax-planning", "service-fixed-asset-tagging", "service-forensic-accounting", "service-internal-controls", "service-financial-modelling", "service-feasibility-studies", "service-strategic-advisory", "e-invoicing", "industries", "about",
                 "insights", "careers", "contact", "privacy", "terms"):
        meta = PAGE_SEO[page]
        canonical = full_url(page)
        html = render(template, meta["title"], meta["description"], canonical, build_jsonld(page, None))
        written.append(write(PAGE_TO_PATH[page], html))

    # Insight articles
    for a in INSIGHTS:
        path = "/insights/" + a["slug"]
        title = strip_period(a["title"]) + " | Authentic Accounting Insights"
        canonical = SITE_ORIGIN + path
        robots = None if a["published"] else "noindex, follow"
        html = render(template, title, a["excerpt"], canonical, build_jsonld("insight", a["slug"]), robots=robots)
        written.append(write(path, html))

    print("Prerendered %d routes:" % len(written))
    for w in written:
        print("  " + w)


if __name__ == "__main__":
    main()
