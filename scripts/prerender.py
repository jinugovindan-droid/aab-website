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

import datetime
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
    "industry-real-estate": "/industries/real-estate",
    "industry-construction": "/industries/construction",
    "industry-trading": "/industries/trading",
    "industry-hospitality": "/industries/hospitality",
    "industry-ecommerce": "/industries/ecommerce",
    "industry-manufacturing": "/industries/manufacturing",
    "about": "/about",
    "insights": "/insights",
    "careers": "/careers",
    "contact": "/contact",
    "privacy": "/privacy",
    "terms": "/terms",
}

PAGE_SEO = {
    "services": {
        "title": "Accounting, VAT & Corporate Tax Consultancy Dubai, UAE",
        "description": "Full-scope services for UAE businesses: accounting, VAT consultancy, Corporate Tax, IFRS financial statements, valuations and e-invoicing readiness.",
    },
    "service-vat": {
        "title": "VAT Registration & Return Filing UAE — Free Checker",
        "description": "UAE VAT registration, return filing, voluntary disclosures and FTA correspondence support — plus a free VAT registration checker and deadline countdown.",
    },
    "service-corporate-tax": {
        "title": "Corporate Tax Registration & Filing UAE — 9% Compliance",
        "description": "UAE Corporate Tax registration, computation and FTA filing — 0% and 9% bands, Small Business Relief, QFZP analysis and a free Corporate Tax estimator.",
    },
    "service-bookkeeping": {
        "title": "Outsourced Bookkeeping & Accounting Services Dubai",
        "description": "Outsourced bookkeeping in Dubai: daily recording, bank reconciliations, monthly close and management accounts — VAT and Corporate Tax-ready books.",
    },
    "service-audit-support": {
        "title": "Audit Support & Preparation Services Dubai, UAE",
        "description": "Audit-ready trial balance, lead schedules, reconciliations and auditor liaison for statutory and group audits under IFRS — a faster, cleaner external audit.",
    },
    "service-valuations": {
        "title": "Business Valuation Services Dubai, UAE — DCF & Fair Value",
        "description": "Independent business valuations in the UAE — DCF, market multiples and asset-based — for M&A, disputes, IFRS 13 fair value and fundraising.",
    },
    "service-transaction-advisory": {
        "title": "Financial Due Diligence & M&A Support Dubai, UAE",
        "description": "Buy-side and sell-side financial due diligence in the UAE — quality of earnings, working capital and net debt analysis, deal structuring and closing support.",
    },
    "service-cfo": {
        "title": "Outsourced & Fractional CFO Services Dubai, UAE",
        "description": "Fractional and outsourced CFO services in the UAE — board reporting, budgeting, cash and treasury, fundraising support and finance team build-out.",
    },
    "service-financial-statements": {
        "title": "IFRS Financial Statements Preparation Dubai, UAE",
        "description": "IFRS and IFRS for SMEs financial statements in the UAE — full sets with notes and disclosures, group consolidation, audit- and Corporate Tax-ready.",
    },
    "service-tax-planning": {
        "title": "Corporate Tax Advisory & Planning UAE — QFZP & Structuring",
        "description": "UAE Corporate Tax advisory — group and transaction structuring, free-zone QFZP optimisation, transfer pricing alignment and defensible position memos.",
    },
    "service-fixed-asset-tagging": {
        "title": "Fixed Asset Tagging & Verification UAE — All 7 Emirates",
        "description": "Physical fixed-asset verification and tagging, register reconstruction and depreciation review — on site across Dubai, RAK, UAQ and all seven emirates.",
    },
    "service-forensic-accounting": {
        "title": "Forensic Accounting & Fraud Investigation Dubai, UAE",
        "description": "Forensic accounting in the UAE — fraud investigation, dispute and litigation support, expert testimony and evidence reconstruction for contested matters.",
    },
    "service-internal-controls": {
        "title": "Internal Controls & Internal Audit Support Dubai, UAE",
        "description": "Internal controls design, walkthroughs and remediation for UAE businesses, regulated entities and pre-IPO issuers — risk-and-control matrices and testing.",
    },
    "service-financial-modelling": {
        "title": "Financial Modelling Services Dubai — FAST-Standard Models",
        "description": "Auditable financial models for UAE businesses — operating, transaction, LBO and board-pack models with scenario and sensitivity analysis built in.",
    },
    "service-feasibility-studies": {
        "title": "Project Feasibility Study Services Dubai, UAE",
        "description": "Project feasibility studies in the UAE — financial modelling, sensitivity and scenario analysis, and a clear pre-investment recommendation for new ventures.",
    },
    "service-strategic-advisory": {
        "title": "Strategic Financial Advisory Dubai — Board-Level Support",
        "description": "Board-level financial advisory in the UAE — accounting policy selection, complex transactions, restructuring and defensible Board-grade positions.",
    },
    "e-invoicing": {
        "title": "UAE E-Invoicing Readiness — ASP, Peppol & 2026 Deadlines",
        "description": "Get ready for the 30 October 2026 UAE e-invoicing deadline — ASP selection, Peppol readiness, process design and a free readiness PDF.",
    },
    "industries": {
        "title": "Industries — Accounting & Advisory by Sector, UAE",
        "description": "Sector-focused accounting and advisory for real estate, construction, trading, hospitality, e-commerce and manufacturing businesses across Dubai and the UAE.",
    },
    "industry-real-estate": {
        "title": "Real Estate Accounting Dubai — Developers & Property",
        "description": "Accounting, VAT and Corporate Tax for UAE developers and property managers — IFRS 15 revenue, escrow and service-charge accounting, audit-ready books.",
    },
    "industry-construction": {
        "title": "Construction & Contracting Accounting Dubai, UAE",
        "description": "Accounting for UAE construction and contracting firms — IFRS 15 over-time revenue, WIP and cost-to-complete, retentions and audit-ready project reporting.",
    },
    "industry-trading": {
        "title": "Trading & Distribution Accounting Dubai, UAE",
        "description": "Accounting, VAT and Corporate Tax for UAE trading and distribution companies — inventory and COGS, import VAT and reverse charge, designated-zone treatment.",
    },
    "industry-hospitality": {
        "title": "Hospitality, F&B & Restaurant Accounting Dubai, UAE",
        "description": "Accounting for UAE hotels, restaurants and F&B groups — multi-outlet consolidation, daily POS reconciliation, cost control and VAT compliance.",
    },
    "industry-ecommerce": {
        "title": "E-commerce & Retail Accounting Dubai, UAE",
        "description": "Accounting and VAT for UAE e-commerce and retail — marketplace and payment-gateway reconciliation, multi-channel revenue, import VAT, inventory and returns.",
    },
    "industry-manufacturing": {
        "title": "Manufacturing Accounting Dubai — Cost & Inventory",
        "description": "Accounting for UAE manufacturers — cost and overhead allocation, WIP and finished-goods inventory valuation, fixed assets, VAT and Corporate Tax compliance.",
    },
    "about": {
        "title": "About Us — Dubai Accounting & Advisory Firm Since 2017",
        "description": "Authentic Accounting and Bookkeeping L.L.C — Dubai firm serving all 7 emirates since 2017. Reconciliation-led accounting, tax and Board-grade advisory.",
    },
    "insights": {
        "title": "UAE VAT, Corporate Tax & E-Invoicing Insights",
        "description": "Practical articles on UAE VAT, Corporate Tax, e-invoicing and IFRS from a Dubai accounting team — plain-English guides plus free calculators and tools.",
    },
    "careers": {
        "title": "Careers — Accounting Jobs in Dubai, UAE",
        "description": "Explore open roles at a Dubai accounting and advisory firm serving all 7 emirates since 2017. Send your CV and grow with a compliance-first team.",
    },
    "contact": {
        "title": "Contact — Book an Accounting Consultation in Dubai",
        "description": "Speak to our Dubai team about accounting, VAT, Corporate Tax or E-Invoicing. Call, email or book a consultation — we serve businesses across the UAE.",
    },
    "privacy": {
        "title": "Privacy Policy — How We Handle Your Data",
        "description": "How Authentic Accounting collects, uses, retains and protects personal data submitted via aaccounting.me, in line with the UAE Personal Data Protection Law.",
    },
    "terms": {
        "title": "Terms of Use — aaccounting.me",
        "description": "Terms governing use of the aaccounting.me website — general information, not professional advice or an engagement; governed by UAE law as applied in Dubai.",
    },
}

INSIGHTS = [
    {"slug": "ifrs-financial-statements-uae",
     "seoTitle": "IFRS Financial Statements in the UAE: Who Needs Them", "seoDesc": "Who must prepare IFRS statements in the UAE, the standards Corporate Tax accepts (IFRS, IFRS for SMEs, cash basis), and what a complete set contains.", "tag": "Financial Reporting", "date": "15 Apr 2026",
     "title": "IFRS financial statements in the UAE: who needs them, and what a full set contains.",
     "author": "Sabith Abdul Rahman", "reviewer": "Jinu Govindan", "reference": "Ministerial Decision No. 114 of 2023 (accounting standards for UAE Corporate Tax)",
     "excerpt": "Who must prepare IFRS financial statements in the UAE, the accounting standards Corporate Tax requires (IFRS, IFRS for SMEs up to AED 50M, cash basis up to AED 3M), what a complete set contains, and why audit-ready statements matter for free zones, banks and the FTA.",
     "published": True},
    {"slug": "prepare-erp-for-uae-e-invoicing",
     "seoTitle": "UAE E-Invoicing ERP Readiness Checklist", "seoDesc": "Master-data hygiene, field mapping, tax-code cleanup and testing — the ERP groundwork that decides whether your UAE e-invoicing go-live is smooth.", "tag": "E-Invoicing", "date": "10 Mar 2026",
     "title": "Getting your ERP ready for UAE e-invoicing: a practical checklist.",
     "author": "CA Kiran Prasad S", "reviewer": "Jinu Govindan", "reference": "Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)",
     "excerpt": "E-invoicing is not just a tax change — it is a data change. The master-data hygiene, field mapping and testing that decide whether your go-live is smooth or painful.",
     "published": True},
    {"slug": "choosing-accredited-service-provider-asp",
     "seoTitle": "UAE E-Invoicing ASP List: 42 Pre-Approved Providers", "seoDesc": "How to choose an Accredited Service Provider for UAE e-invoicing — with the full MoF pre-approved list of 42 providers and the questions to ask first.", "tag": "E-Invoicing", "date": "22 Jan 2026",
     "title": "Choosing an Accredited Service Provider (ASP) for UAE e-invoicing.",
     "author": "CA Kiran Prasad S", "reviewer": "Jinu Govindan", "reference": "Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)",
     "excerpt": "Every in-scope business must appoint an Accredited Service Provider to transmit its e-invoices. What an ASP does, pre-approved vs accredited status, the full MoF pre-approved list (42 providers, July 2026), and the questions to ask before you sign.",
     "published": True},
    {"slug": "uae-e-invoicing-deadlines-phases",
     "seoTitle": "UAE E-Invoicing Deadlines & Phases: Full Timeline", "seoDesc": "The UAE e-invoicing rollout tier by tier: ASP appointment deadlines and mandatory go-live dates by annual revenue, laid out in one clear timeline.", "tag": "E-Invoicing", "date": "08 Dec 2025",
     "title": "UAE e-invoicing deadlines and phases: who must comply, and by when.",
     "author": "CA Kiran Prasad S", "reviewer": "Jinu Govindan", "reference": "Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)",
     "excerpt": "The rollout is phased by annual revenue, with two dates that matter for each business — the deadline to appoint an Accredited Service Provider, and the mandatory go-live. Here is the full timeline, tier by tier.",
     "published": True},
    {"slug": "uae-e-invoicing-explained",
     "seoTitle": "UAE E-Invoicing Explained: Peppol 5-Corner Guide", "seoDesc": "Plain-English guide to the UAE’s mandatory B2B and B2G e-invoicing: what actually changes, why, and how the Peppol 5-corner model reshapes invoicing.", "tag": "E-Invoicing", "date": "17 Nov 2025",
     "title": "UAE e-invoicing explained: a plain-English guide for businesses.",
     "author": "CA Kiran Prasad S", "reviewer": "Jinu Govindan", "reference": "Ministerial Decisions 243 and 244 of 2025 (UAE Ministry of Finance)",
     "excerpt": "The UAE is moving to mandatory structured e-invoicing for B2B and B2G transactions. What that actually means, why it is happening, and how the OpenPeppol 5-corner model changes the way you issue an invoice.",
     "published": True},
    {"slug": "free-zone-qualifying-income",
     "seoTitle": "Free Zone Qualifying Income: 3 UAE Corporate Tax Traps", "seoDesc": "Three ways tax teams misread the UAE free-zone rules under Cabinet Decision 100 and Ministerial Decision 229 of 2025 — and what each trap costs at filing.", "tag": "Corporate Tax", "date": "06 May 2025",
     "title": "Free zone qualifying income — three traps in the UAE free-zone tax rules.",
     "author": "Sabith Abdul Rahman", "reviewer": "Jinu Govindan", "reference": "Cabinet Decision 100 of 2023 · Ministerial Decision 229 of 2025 (replacing MD 265 of 2023)",
     "excerpt": "The UAE’s free-zone tax rules — Cabinet Decision 100 of 2023 and Ministerial Decision 229 of 2025 (which replaced MD 265 of 2023) — are being read three different ways by tax teams in the UAE. We unpack the three traps we keep seeing in client positions, and what the consequence is at filing.",
     "published": True},
    {"slug": "uae-corporate-tax-guide-sme",
     "seoTitle": "UAE Corporate Tax Guide for SMEs & Free Zones 2026", "seoDesc": "Who pays 0% and 9%, registration and the AED 10,000 late penalty, Small Business Relief and its 2026 sunset, QFZP status and the 15% top-up tax.", "tag": "Corporate Tax", "date": "18 Feb 2025",
     "title": "UAE Corporate Tax: a complete guide for SMEs and free-zone businesses.",
     "author": "Jinu Govindan", "reviewer": "Sabith Abdul Rahman", "reference": "Federal Decree-Law No. 47 of 2022 (UAE Corporate Tax)",
     "excerpt": "Who pays UAE Corporate Tax, the 0% and 9% bands, registration and the AED 10,000 late-registration penalty, the nine-month filing deadline, Small Business Relief and its 31 December 2026 sunset, free-zone QFZP status, and the 15% domestic minimum top-up tax — in plain English for UAE businesses.",
     "published": True},
    {"slug": "outsourced-bookkeeping-dubai",
     "seoTitle": "Outsourced Bookkeeping in Dubai: What Good Looks Like", "seoDesc": "What proper outsourced bookkeeping covers in a VAT and Corporate Tax world, the record-retention rules, and when to outsource versus hire in-house.", "tag": "Bookkeeping", "date": "12 Sep 2023",
     "title": "Outsourced bookkeeping in Dubai: what good looks like in a VAT and Corporate Tax world.",
     "author": "Johncy", "reviewer": "Jinu Govindan", "reference": "UAE VAT (FDL 8 of 2017) & Corporate Tax (FDL 47 of 2022) record-keeping requirements",
     "excerpt": "Since VAT and Corporate Tax arrived, clean books are a legal requirement, not a nicety. What proper outsourced bookkeeping covers, the record-retention rules (five years for VAT, seven for Corporate Tax), and when to outsource versus hire in-house.",
     "published": True},
    {"slug": "uae-vat-guide-dubai",
     "seoTitle": "UAE VAT Registration, Filing & Recovery: Dubai Guide", "seoDesc": "The 5% rate, AED 375,000 and AED 187,500 registration thresholds, EmaraTax filing deadlines, input-VAT recovery and the zero-rated vs exempt line.", "tag": "VAT", "date": "20 Mar 2023",
     "title": "VAT in the UAE: registration, filing and recovery — a Dubai business guide.",
     "author": "Jinu Govindan", "reviewer": "Sabith Abdul Rahman", "reference": "Federal Decree-Law No. 8 of 2017 on VAT (as amended)",
     "excerpt": "The 5% standard rate, the AED 375,000 mandatory and AED 187,500 voluntary registration thresholds, EmaraTax filing and the 28-day deadline, input-VAT recovery, and the zero-rated vs exempt distinction — what every UAE business needs to get right.",
     "published": True},
    {"slug": "uae-corporate-tax-is-coming",
     "seoTitle": "UAE Corporate Tax at 9%: Preparing Your Business", "seoDesc": "Written as the 9% federal Corporate Tax was announced: the AED 375,000 threshold, effective dates and the groundwork to lay before day one.", "tag": "Corporate Tax", "date": "28 Sep 2022",
     "title": "UAE Corporate Tax is coming: what businesses should start doing now.",
     "author": "Jinu Govindan", "reviewer": "Sabith Abdul Rahman", "reference": "UAE Ministry of Finance Corporate Tax announcement (2022)",
     "excerpt": "The UAE has confirmed a federal Corporate Tax from financial years starting on or after 1 June 2023. Written as the regime was announced — the headline 9% rate, the AED 375,000 threshold, and the groundwork to lay before it arrives.",
     "published": True},
    {"slug": "management-accounts-that-drive-decisions",
     "seoTitle": "Management Accounts That Drive Decisions: UAE Guide", "seoDesc": "What belongs in a monthly management pack a UAE owner-manager can actually steer by — the KPIs, cash view and variances that lead to decisions.", "tag": "Advisory", "date": "14 Oct 2021",
     "title": "Management accounts that actually drive decisions.",
     "author": "Sabith Abdul Rahman", "reviewer": "Jinu Govindan",
     "excerpt": "Statutory accounts look backward; management accounts should help you steer. What belongs in a monthly pack a UAE owner-manager can actually run the business on.",
     "published": True},
    {"slug": "protecting-cash-flow-downturn",
     "seoTitle": "Protecting Cash Flow in a Downturn: 13-Week Method", "seoDesc": "Profit is an opinion, cash is a fact. A practical 13-week cash-flow discipline for UAE SMEs when revenue suddenly slows, written in the 2020 slowdown.", "tag": "Advisory", "date": "20 May 2020",
     "title": "Protecting cash flow when revenue stalls.",
     "author": "Jinu Kurikesu", "reviewer": "Jinu Govindan",
     "excerpt": "Written in the 2020 slowdown: profit is an opinion, cash is a fact. A practical 13-week cash discipline for UAE SMEs when revenue suddenly slows.",
     "published": True},
    {"slug": "economic-substance-regulations-uae",
     "seoTitle": "Economic Substance Regulations UAE: Are You in Scope?", "seoDesc": "Which relevant activities bring a UAE company into ESR scope, the notification and reporting duties that follow, and what filing actually requires.", "tag": "Compliance", "date": "16 Sep 2019",
     "title": "Economic Substance Regulations: do they apply to your UAE company?",
     "author": "Rijo Mathew", "reviewer": "Jinu Govindan", "reference": "UAE Economic Substance Regulations (Cabinet Resolution, 2019)",
     "excerpt": "The UAE’s Economic Substance Regulations introduced notification and reporting duties for companies carrying on “relevant activities”. How to tell whether you are in scope — and what filing actually requires.",
     "published": True},
    {"slug": "uae-vat-5-percent-primer",
     "seoTitle": "UAE VAT at 5%: A First-Principles Primer (2018)", "seoDesc": "From 1 January 2018 the UAE introduced 5% VAT. A first-principles primer from the year it landed — who registers, what to charge, which records to keep.", "tag": "VAT", "date": "26 Feb 2018",
     "title": "VAT has arrived: a 5% primer for UAE businesses.",
     "author": "Rijo Mathew", "reviewer": "Jinu Govindan", "reference": "Federal Decree-Law No. 8 of 2017 on VAT",
     "excerpt": "From 1 January 2018 the UAE introduced a 5% Value Added Tax. A first-principles primer from the year it landed — who registers, what to charge, and the records to keep from day one.",
     "published": True},
    {"slug": "bookkeeping-foundation",
     "seoTitle": "Bookkeeping Discipline: The Foundation of a Business", "seoDesc": "Clean, reconciled books are not overhead — they are what every financing, audit and tax position is built on. The firm’s founding note from 2017.", "tag": "Bookkeeping", "date": "11 Dec 2017",
     "title": "Why disciplined bookkeeping is the foundation of every business.",
     "author": "Jinu Govindan", "reviewer": "Johncy",
     "excerpt": "Our first note, from the firm’s founding: clean, reconciled books are not overhead — they are the foundation every financing, audit and tax position is built on. The discipline we have run on ever since.",
     "published": True},
    {"slug": "dcf-terminal-values-family-office",
     "seoTitle": "DCF Terminal Values: Where UAE Family Offices Drift", "seoDesc": "Terminal value carries most of a DCF’s weight — and it is where UAE family-office valuations most often go wrong. The assumptions we test first.", "tag": "Valuations", "date": "24 Mar 2021",
     "title": "Why DCF terminal values are mispriced for UAE family-office holdings.",
     "author": "Jinu Govindan",
     "excerpt": "Terminal value carries most of the weight in a DCF, yet it is where UAE family-office valuations most often drift. A note on the assumptions we test first.",
     "published": True},
    {"slug": "control-framework-erp-migrations",
     "seoTitle": "Internal Controls That Survive ERP Migrations", "seoDesc": "Most control breaks trace back to an ERP migration. The controls that must survive the cutover, and how to test them before go-live rather than after.", "tag": "Controls", "date": "09 May 2023",
     "title": "A control framework that survives ERP migrations: a practitioner’s note.",
     "author": "Jinu Kurikesu",
     "excerpt": "Most control breaks we are called in to fix trace back to an ERP migration. A practitioner’s note on the controls that have to survive the cutover.",
     "published": True},
    {"slug": "designated-zone-reclassification",
     "seoTitle": "Designated Zone VAT: The Movement Trail to Keep", "seoDesc": "Goods in a UAE designated zone can be reclassified as taxable supplies when the movement trail is thin. The records that keep your position defensible.", "tag": "VAT", "date": "22 Feb 2024",
     "title": "Designated zone reclassification — the trail you must keep.",
     "author": "Sabith Abdul Rahman", "reviewer": "Jinu Govindan",
     "excerpt": "Goods in a VAT designated zone can be reclassified as taxable supplies when the movement trail is thin. What records keep the position defensible.",
     "published": True},
    {"slug": "working-capital-pegs-uae-deals",
     "seoTitle": "Working Capital Pegs in UAE Deals: Setting the Target", "seoDesc": "The working-capital peg is where UAE deals quietly gain or lose value at close. Closing-mechanic patterns we keep seeing, and how to set the peg well.", "tag": "M&A", "date": "14 Apr 2022",
     "title": "Working capital pegs in UAE deals: closing-mechanic patterns we keep seeing.",
     "author": "Jinu Govindan",
     "excerpt": "The working-capital peg is where UAE deals quietly gain or lose value at close. Patterns we keep seeing in closing mechanics, and how to set the target.",
     "published": True},
    {"slug": "transfer-pricing-thresholds-board",
     "seoTitle": "UAE Transfer Pricing Thresholds & Documentation Guide", "seoDesc": "The thresholds that make UAE transfer pricing documentation mandatory — disclosure form, master file, local file — and what a Board should expect to see.", "tag": "Corporate Tax", "date": "16 Sep 2024",
     "title": "Transfer pricing thresholds and the documentation a Board should expect.",
     "author": "Sabith Abdul Rahman", "reviewer": "Jinu Govindan",
     "excerpt": "What documentation a UAE Board should expect to see on transfer pricing, and the thresholds that decide how much of it is mandatory.",
     "published": True},
    {"slug": "reconciliation-resolve-to-zero",
     "seoTitle": "Why Every Reconciliation Should Resolve to Zero", "seoDesc": "A reconciliation that closes to a tolerance is not reconciled. Why we hold the line at zero, and the disciplined way to clear any residual balance.", "tag": "Controls", "date": "18 Nov 2020",
     "title": "Why every reconciliation should resolve to zero — and what to do when it does not.",
     "author": "Jinu Kurikesu",
     "excerpt": "A reconciliation that closes to a tolerance is not reconciled. Why we hold the line at zero, and the disciplined way to clear a residual.",
     "published": True},
    {"slug": "cost-of-equity-gcc-buildup",
     "seoTitle": "Cost of Equity in the GCC: A Practitioner’s Build-Up", "seoDesc": "Off-the-shelf cost-of-equity inputs travel badly to the GCC. A component-by-component build-up with the local adjustments that actually matter.", "tag": "Valuations", "date": "12 Jun 2019",
     "title": "Cost-of-equity in the GCC: a practitioner’s build-up.",
     "author": "Jinu Govindan",
     "excerpt": "Off-the-shelf cost-of-equity inputs travel badly to the GCC. A practitioner’s build-up, component by component, with the local adjustments that matter.",
     "published": True},
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
    "industry-real-estate": "Real Estate", "industry-construction": "Construction & Contracting",
    "industry-trading": "Trading & Distribution", "industry-hospitality": "Hospitality & F&B",
    "industry-ecommerce": "E-commerce & Retail", "industry-manufacturing": "Manufacturing",
    "insights": "Insights", "careers": "Careers", "contact": "Contact",
    "privacy": "Privacy Policy", "terms": "Terms of Use",
}

MONTHS = {"Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
          "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"}

ORG = {
    "@type": "Organization",
    "name": "Authentic Accounting and Bookkeeping L.L.C",
    "url": SITE_ORIGIN + "/",
    "logo": {"@type": "ImageObject", "url": SITE_ORIGIN + "/assets/logos/aab-short-eng.png"},
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
     "a": "Ministerial Decision 243 of 2025 establishes the system and MD 244 of 2025 sets the phased timeline (as amended by MD 66 of 2026); ASP accreditation is governed by MD 64 of 2025, as amended by MD 56 of 2026 — all issued by the UAE Ministry of Finance."},
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
     "a": "Businesses with revenue of AED 3 million or less in the relevant tax period AND all previous tax periods can elect Small Business Relief and be treated as having no taxable income. It is a transitional measure for tax periods ending on or before 31 December 2026, is not available to Qualifying Free Zone Persons or members of large multinational groups, and must be actively elected with the FTA."},
    {"q": "Do free zone companies pay Corporate Tax?",
     "a": "A Qualifying Free Zone Person (QFZP) can benefit from a 0% rate on its qualifying income if it meets all conditions (adequate substance, qualifying activities and the de minimis limits) under Cabinet Decision 100 of 2023 and Ministerial Decision 229 of 2025. Non-qualifying income is taxed at 9%, and free zone businesses must still register and file."},
    {"q": "When is my Corporate Tax return due?",
     "a": "The return must be filed, and any tax paid, within nine months of the end of your tax period. For a 31 December year-end, the return is due by 30 September of the following year."},
    {"q": "What is the penalty for registering late?",
     "a": "Late Corporate Tax registration carries an administrative penalty of AED 10,000. The FTA has waived this penalty where a business files its first Corporate Tax return within seven months of the end of its first tax period."},
    {"q": "What about large multinational groups?",
     "a": "Multinational groups with consolidated global revenue of EUR 750 million or more in at least two of the four preceding financial years are subject to a 15% Domestic Minimum Top-up Tax (DMTT) for financial years starting on or after 1 January 2025, in line with the OECD Pillar Two rules."},
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
     "a": "You must register if your taxable turnover crossed AED 375,000 in the past 12 months, or you reasonably expect it to in the next 30 days. Voluntary registration is available once taxable turnover or expenses exceed AED 187,500."},
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
    if page.startswith("industry-") and page in BREADCRUMB_LABELS:
        items.append({"name": "Industries", "url": SITE_ORIGIN + PAGE_TO_PATH["industries"]})
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


SERVICES_HUB_FAQ = [
    {"q": "What services does an accounting firm in Dubai typically provide?",
     "a": "A full-service Dubai accounting firm covers bookkeeping, VAT and Corporate Tax compliance, financial statements, audit support and advisory work such as valuations, due diligence and CFO services. Authentic Accounting delivers these under one engagement, spanning compliance — monthly close, FTA filings, IFRS statements — and advisory, including financial modelling, tax planning and transaction support."},
    {"q": "When must a UAE business register for VAT?",
     "a": "A UAE business must register for VAT once its taxable supplies and imports exceed AED 375,000 over the previous 12 months, or are expected to within the next 30 days. Voluntary registration is available from AED 187,500. Registration, return preparation and FTA filing are part of our VAT compliance service, so thresholds are monitored before they become a problem."},
    {"q": "What is the Corporate Tax rate in the UAE?",
     "a": "UAE Corporate Tax applies at 9% on taxable income above AED 375,000, with a 0% rate on taxable income up to that level. Qualifying free zone persons can access a 0% rate on qualifying income, subject to conditions. Our UAE Corporate Tax service handles registration, the period computation and return filing, including free-zone (QFZP) analysis where relevant."},
    {"q": "When does e-invoicing become mandatory in the UAE?",
     "a": "UAE e-invoicing goes live in phases by revenue: businesses with annual revenue of AED 50 million or more go live on 1 January 2027, after appointing an Accredited Service Provider by 30 October 2026; other businesses follow on 1 July 2027 and government entities on 1 October 2027. Our E-Invoicing support service covers readiness assessment, ASP selection and ERP data preparation ahead of your dates."},
]

INDUSTRIES_HUB_FAQ = [
    {"q": "Does industry matter when choosing an accounting firm in Dubai?",
     "a": "Yes — the accounting judgements that matter most are sector-specific: IFRS 15 revenue for developers and contractors, designated-zone VAT for traders, daily POS reconciliation for F&B, cost absorption for manufacturers. A firm that knows your sector asks the right questions from day one. Authentic Accounting organises its work around these industry differences."},
    {"q": "Which industries does Authentic Accounting work with in the UAE?",
     "a": "We work across government and public sector, large enterprises, SMEs and family offices, financial services, real estate and construction, and healthcare and education — with dedicated capability in trading, hospitality, e-commerce and manufacturing. The engagement model flexes from a full outsourced finance function to project-based advisory, sector by sector."},
    {"q": "Do regulated financial firms in the UAE need specialised accounting support?",
     "a": "Yes — SCA and CBUAE-regulated entities carry obligations beyond standard bookkeeping, including controls attestation, risk-and-control matrix design and regulator-ready reporting. Asset managers, brokers and insurers each have their own reporting nuances. We support regulated entities with controls work alongside the core accounting engagement."},
    {"q": "What accounting support do UAE healthcare and education providers need?",
     "a": "Healthcare and education providers face regulatory cost reporting and funder reconciliation on top of normal accounting — DOH cost submissions for healthcare and KHDA requirements for Dubai schools being common examples. Funder and insurer settlements need disciplined reconciliation. We support hospital groups and school operators with both."},
]

IND_REALESTATE_FAQ = [
    {"q": "How is VAT applied to real estate in the UAE?",
     "a": "The first supply of a new residential building is zero-rated, subsequent residential sales and leases are exempt, and commercial property is taxed at the standard 5% rate. Mixed-use buildings need the treatment applied line by line, which also affects how much input VAT a property business can recover. Our VAT compliance work for property companies covers exactly this analysis."},
    {"q": "How do UAE developers recognise revenue on off-plan sales?",
     "a": "Under IFRS 15, off-plan revenue is recognised either over time as the project progresses or at a point in time on handover, depending on the contract terms and the developer’s enforceable right to payment. It is usually the biggest accounting judgement on a developer’s books, and one we document with audit-ready workings as part of our financial statements service."},
    {"q": "What is service-charge accounting for jointly owned property in Dubai?",
     "a": "Service-charge accounting keeps owners’ contributions, budgets and spending for a jointly owned property in separate, auditable ledgers, distinct from the management company’s own books. RERA escrow discipline and Owners’-Committee reporting sit alongside it. We run service-charge ledgers and reporting as part of our bookkeeping work for property managers."},
    {"q": "Do UAE companies pay Corporate Tax on rental income?",
     "a": "Yes — rental income earned by a UAE company forms part of its taxable income and is taxed at 9% above AED 375,000, with 0% below that level. The position can differ for individuals holding property personally, so ownership structure matters. Our Corporate Tax service computes taxable income for property holdings, including any free-zone analysis."},
]

IND_CONSTRUCTION_FAQ = [
    {"q": "How do construction companies recognise revenue in the UAE?",
     "a": "Most UAE contractors recognise revenue over time under IFRS 15, typically on a cost-to-cost (input) basis that is re-estimated each reporting period. That makes reliable cost-to-complete estimates and work-in-progress schedules essential, because they drive both revenue and margin. We compute and evidence over-time revenue and WIP so the numbers hold up at audit."},
    {"q": "What accounting records must a UAE construction contractor keep?",
     "a": "A UAE contractor should keep per-project cost ledgers, work-in-progress and cost-to-complete schedules, retention ageing, variation and claim files, and VAT records for each milestone billing — on top of the general books UAE tax law requires every business to maintain. Our project bookkeeping service builds these records so contract margins stay visible and auditable."},
    {"q": "How is retention money accounted for in construction contracts?",
     "a": "Retention should be tracked as a separate receivable (amounts clients withhold from you) and payable (amounts you withhold from sub-contractors), aged apart from normal trade balances. Because retention can stay outstanding for years, mixing it with trade debtors hides real collection risk. We keep retention ledgers separate and aged as standard for contracting clients."},
    {"q": "How does VAT apply to construction contracts in the UAE?",
     "a": "Construction services in the UAE are generally subject to VAT at 5%, with tax points typically triggered by milestone billings, certified payments or receipts under the date-of-supply rules. Sub-contractor chains add input-recovery and timing questions of their own. Our VAT compliance service handles contract, milestone and sub-contractor treatment correctly."},
]

IND_TRADING_FAQ = [
    {"q": "How should a trading company in Dubai value its inventory?",
     "a": "Inventory should be valued under IAS 2 at the lower of cost and net realisable value, using FIFO or weighted average cost. Landed cost — duty, freight and handling — belongs in cost, otherwise reported margin is overstated. We set up perpetual inventory, COGS and landed-cost capture for trading clients so margin by SKU is real, not an estimate."},
    {"q": "How does import VAT work for UAE trading companies?",
     "a": "A VAT-registered UAE importer generally self-accounts for import VAT through its VAT return under the reverse-charge mechanism, rather than paying at the border, and recovers it as input tax where the goods are used for taxable supplies. Getting the customs-to-return linkage right matters at FTA review. Our VAT compliance service manages import VAT and reverse charge end to end."},
    {"q": "Are goods in a UAE designated zone subject to VAT?",
     "a": "Goods inside a designated zone can be treated as outside the scope of UAE VAT while certain conditions are met, but supplies become taxable when goods move to the mainland or the conditions fail. The rules are transaction-specific, so blanket assumptions are risky. We map designated-zone flows for trading clients as part of VAT compliance."},
    {"q": "Do free zone trading companies pay Corporate Tax in the UAE?",
     "a": "Free zone companies are within the UAE Corporate Tax regime, but a Qualifying Free Zone Person can access a 0% rate on qualifying income if it meets the conditions; other income is taxed at 9% above AED 375,000. Whether trading activity qualifies depends on the facts, including who the customers are. Our Corporate Tax service includes this free-zone analysis."},
]

IND_HOSPITALITY_FAQ = [
    {"q": "Do restaurants in Dubai need to register for VAT?",
     "a": "Yes — a restaurant must register for VAT once taxable supplies exceed AED 375,000 over the previous 12 months, and may register voluntarily from AED 187,500. Dine-in, delivery and aggregator sales all count towards the threshold, so multi-channel outlets often cross it earlier than expected. We handle VAT registration and returns for F&B businesses."},
    {"q": "What is daily sales reconciliation for a restaurant?",
     "a": "Daily sales reconciliation matches what the POS says you sold to what actually arrived — cash counts, card settlements and aggregator payouts — every single day. It is the fastest way to catch leakage, missed settlements and aggregator fee errors in F&B. We run daily POS-to-bank reconciliation as part of multi-outlet bookkeeping for hospitality clients."},
    {"q": "How are municipality and tourism fees accounted for by UAE restaurants?",
     "a": "Service charge, municipality and tourism fees should be identified and accounted for separately from food and beverage revenue, since they follow their own rules and remittance obligations by emirate. Bundling them into sales overstates revenue and muddies the VAT workings. We separate these fees in the ledgers as standard for hospitality clients."},
    {"q": "How do multi-outlet F&B groups consolidate their accounts?",
     "a": "Consolidation works when every outlet uses a consistent chart of accounts, per-outlet ledgers roll into one group view, and inter-outlet transactions are eliminated. Done properly, you can compare outlets like-for-like on prime cost and margin. Our hospitality bookkeeping consolidates multi-outlet groups and produces outlet-level management accounts."},
]

IND_ECOMMERCE_FAQ = [
    {"q": "How does VAT apply to e-commerce sales in the UAE?",
     "a": "VAT on e-commerce follows place-of-supply rules: sales delivered within the UAE are generally standard-rated at 5%, while cross-border sales and imported goods each have their own treatment. Selling through marketplaces adds questions about who accounts for the VAT. Our VAT compliance service maps the right treatment across website, marketplace and retail channels."},
    {"q": "How do online sellers reconcile payment gateway and marketplace payouts?",
     "a": "Reconcile each payout back to the individual orders it settles, then tie the net amount to the bank — capturing the gateway’s fees, refunds and holdbacks in between. Skipping this step leaves revenue, fees and VAT all approximate. We reconcile Stripe, PayTabs, Amazon, Noon and similar settlements to orders and bank as core e-commerce bookkeeping."},
    {"q": "Do e-commerce businesses in the UAE pay Corporate Tax?",
     "a": "Yes — UAE e-commerce businesses are subject to Corporate Tax like any other company: 9% on taxable income above AED 375,000 and 0% below. Online and omni-channel models raise their own computation questions, from channel-level revenue recognition to marketplace fees. Our Corporate Tax service handles registration, computation and filing for online sellers."},
    {"q": "How should an online store account for returns and chargebacks?",
     "a": "Returns, refunds and chargebacks should reduce recognised revenue and flow back into stock and VAT adjustments in the period they happen, not sit unrecorded in a gateway balance. High-return categories can materially change true margin. We build returns and chargebacks into the monthly close so revenue and inventory stay accurate."},
]

IND_MANUFACTURING_FAQ = [
    {"q": "What costing method should a UAE manufacturer use?",
     "a": "Most manufacturers use standard or absorption costing, allocating production overheads to units through defined cost centres — which is also what IAS 2 expects for inventory valuation. The real test is whether the overhead allocation is defensible at audit. We set up job and process costing with overhead absorption that stands up to that scrutiny."},
    {"q": "How are raw materials, WIP and finished goods valued?",
     "a": "All three inventory categories are valued under IAS 2 at the lower of cost and net realisable value, with cost building up through the production process: materials, direct labour and absorbed production overheads. Each stage needs its own valuation workings. We maintain raw-material, WIP and finished-goods valuations as part of manufacturing bookkeeping."},
    {"q": "Can UAE manufacturers recover VAT on machinery and raw materials?",
     "a": "Generally yes — input VAT on machinery, raw materials and production costs is recoverable where the purchases are used to make taxable supplies, subject to the normal documentation rules. Recovery gets harder if some output is exempt or out of scope. Our VAT compliance service manages input recovery and return filing for manufacturers."},
    {"q": "Why do manufacturers need a fixed asset register?",
     "a": "A fixed asset register ties plant and machinery on the floor to the ledger — recording cost, location, depreciation and impairment indicators for every asset. It underpins the depreciation in your Corporate Tax computation and is one of the first things auditors test. Our fixed asset tagging service physically verifies assets and reconstructs the register."},
]

FAQ_BY_PAGE = {
    "e-invoicing": EINVOICE_FAQ, "service-corporate-tax": CORPTAX_FAQ,
    "service-bookkeeping": BOOKKEEPING_FAQ, "service-audit-support": AUDIT_FAQ,
    "service-valuations": VALUATIONS_FAQ, "service-transaction-advisory": TRANSACTION_FAQ,
    "service-cfo": CFO_FAQ, "service-financial-statements": FS_FAQ,
    "service-tax-planning": TAXPLAN_FAQ, "service-vat": VAT_FAQ,
    "service-fixed-asset-tagging": FIXED_ASSET_FAQ, "service-forensic-accounting": FORENSIC_FAQ,
    "service-internal-controls": CONTROLS_FAQ, "service-financial-modelling": MODELLING_FAQ,
    "service-feasibility-studies": FEASIBILITY_FAQ, "service-strategic-advisory": STRATEGIC_FAQ,
    "services": SERVICES_HUB_FAQ, "industries": INDUSTRIES_HUB_FAQ, "industry-real-estate": IND_REALESTATE_FAQ, "industry-construction": IND_CONSTRUCTION_FAQ, "industry-trading": IND_TRADING_FAQ, "industry-hospitality": IND_HOSPITALITY_FAQ, "industry-ecommerce": IND_ECOMMERCE_FAQ, "industry-manufacturing": IND_MANUFACTURING_FAQ,
}

# Answer-first capsules for the money pages — mirror of routes.js ANSWER_FIRST.
ANSWER_FIRST = {
    "service-vat":
        "UAE VAT is a 5% tax on most goods and services. Registration with the Federal Tax Authority is mandatory once taxable supplies and imports exceed AED 375,000 over the previous 12 months — or are expected to within the next 30 days — and voluntary from AED 187,500. Registered businesses file VAT returns on EmaraTax, quarterly for most, with the return and payment due within 28 days of the period end.",
    "service-corporate-tax":
        "UAE Corporate Tax is charged at 9% on annual taxable income above AED 375,000 — the first AED 375,000 is taxed at 0%. Every taxable person must register with the Federal Tax Authority, then file a return and pay any tax due within 9 months of financial year-end. Qualifying Free Zone Persons can keep a 0% rate on qualifying income, and Small Business Relief may apply where revenue is AED 3 million or less, for tax periods ending on or before 31 December 2026.",
    "e-invoicing":
        "UAE e-invoicing replaces PDF and paper invoices for in-scope B2B and B2G transactions with structured e-invoices exchanged through Accredited Service Providers and reported to the FTA in near-real time. Go-live is phased: 1 January 2027 for businesses with revenue of AED 50 million or more, 1 July 2027 for other businesses, and 1 October 2027 for government entities. The first deadline lands earlier — Phase 1 businesses must appoint an Accredited Service Provider by 30 October 2026.",
}

# Contextual related guides & tools per page — mirror of routes.js RELATED_READING.
# Each entry: (kind, target, label); 'insight' → /insights/<target>, 'page' → PAGE_TO_PATH[target].
RELATED_READING = {
    "service-vat": [
        ("insight", "uae-vat-guide-dubai", "UAE VAT guide"),
        ("insight", "uae-vat-5-percent-primer", "The 5% VAT primer"),
        ("insight", "designated-zone-reclassification", "Designated zones & VAT"),
    ],
    "service-corporate-tax": [
        ("insight", "uae-corporate-tax-guide-sme", "Corporate Tax guide for SMEs"),
        ("insight", "free-zone-qualifying-income", "Free-zone qualifying income"),
        ("insight", "transfer-pricing-thresholds-board", "Transfer pricing for the Board"),
    ],
    "service-bookkeeping": [
        ("insight", "bookkeeping-foundation", "Bookkeeping as the foundation"),
        ("insight", "outsourced-bookkeeping-dubai", "Outsourced bookkeeping in Dubai"),
        ("page", "service-vat", "VAT registration checker"),
    ],
    "service-audit-support": [
        ("insight", "ifrs-financial-statements-uae", "IFRS financial statements in the UAE"),
        ("insight", "reconciliation-resolve-to-zero", "Reconciliation: resolve to zero"),
        ("insight", "control-framework-erp-migrations", "Controls through ERP migrations"),
    ],
    "service-valuations": [
        ("insight", "cost-of-equity-gcc-buildup", "Cost of equity in the GCC"),
        ("insight", "working-capital-pegs-uae-deals", "Working-capital pegs in UAE deals"),
    ],
    "service-transaction-advisory": [
        ("insight", "dcf-terminal-values-family-office", "DCF terminal values"),
        ("insight", "cost-of-equity-gcc-buildup", "Cost of equity in the GCC"),
    ],
    "service-cfo": [
        ("insight", "management-accounts-that-drive-decisions", "Management accounts that drive decisions"),
        ("insight", "protecting-cash-flow-downturn", "Protecting cash flow in a downturn"),
        ("page", "service-corporate-tax", "Corporate Tax estimator"),
    ],
    "service-financial-statements": [
        ("insight", "ifrs-financial-statements-uae", "IFRS financial statements in the UAE"),
        ("insight", "bookkeeping-foundation", "Bookkeeping as the foundation"),
        ("insight", "management-accounts-that-drive-decisions", "Management accounts that drive decisions"),
    ],
    "service-tax-planning": [
        ("insight", "economic-substance-regulations-uae", "Economic substance regulations"),
        ("insight", "designated-zone-reclassification", "Designated zones & VAT"),
        ("page", "service-corporate-tax", "Corporate Tax estimator"),
    ],
    "service-fixed-asset-tagging": [
        ("insight", "ifrs-financial-statements-uae", "IFRS financial statements in the UAE"),
        ("insight", "reconciliation-resolve-to-zero", "Reconciliation: resolve to zero"),
    ],
    "service-forensic-accounting": [
        ("insight", "reconciliation-resolve-to-zero", "Reconciliation: resolve to zero"),
        ("insight", "control-framework-erp-migrations", "Controls through ERP migrations"),
    ],
    "service-internal-controls": [
        ("insight", "control-framework-erp-migrations", "Controls through ERP migrations"),
        ("insight", "reconciliation-resolve-to-zero", "Reconciliation: resolve to zero"),
    ],
    "service-financial-modelling": [
        ("insight", "dcf-terminal-values-family-office", "DCF terminal values"),
        ("insight", "cost-of-equity-gcc-buildup", "Cost of equity in the GCC"),
        ("insight", "working-capital-pegs-uae-deals", "Working-capital pegs in UAE deals"),
    ],
    "service-feasibility-studies": [
        ("insight", "dcf-terminal-values-family-office", "DCF terminal values"),
        ("insight", "cost-of-equity-gcc-buildup", "Cost of equity in the GCC"),
    ],
    "service-strategic-advisory": [
        ("insight", "transfer-pricing-thresholds-board", "Transfer pricing for the Board"),
        ("insight", "economic-substance-regulations-uae", "Economic substance regulations"),
        ("insight", "uae-corporate-tax-guide-sme", "Corporate Tax guide for SMEs"),
    ],
    "industry-real-estate": [
        ("insight", "uae-vat-guide-dubai", "UAE VAT guide"),
        ("insight", "ifrs-financial-statements-uae", "IFRS financial statements in the UAE"),
        ("page", "e-invoicing", "E-invoicing readiness check"),
    ],
    "industry-construction": [
        ("insight", "protecting-cash-flow-downturn", "Protecting cash flow in a downturn"),
        ("insight", "ifrs-financial-statements-uae", "IFRS financial statements in the UAE"),
        ("insight", "uae-vat-guide-dubai", "UAE VAT guide"),
    ],
    "industry-trading": [
        ("insight", "designated-zone-reclassification", "Designated zones & VAT"),
        ("insight", "uae-vat-guide-dubai", "UAE VAT guide"),
        ("insight", "reconciliation-resolve-to-zero", "Reconciliation: resolve to zero"),
    ],
    "industry-hospitality": [
        ("insight", "management-accounts-that-drive-decisions", "Management accounts that drive decisions"),
        ("insight", "uae-vat-5-percent-primer", "The 5% VAT primer"),
        ("insight", "protecting-cash-flow-downturn", "Protecting cash flow in a downturn"),
    ],
    "industry-ecommerce": [
        ("insight", "uae-vat-guide-dubai", "UAE VAT guide"),
        ("insight", "prepare-erp-for-uae-e-invoicing", "Getting your ERP e-invoicing ready"),
        ("insight", "reconciliation-resolve-to-zero", "Reconciliation: resolve to zero"),
    ],
    "industry-manufacturing": [
        ("insight", "control-framework-erp-migrations", "Controls through ERP migrations"),
        ("insight", "ifrs-financial-statements-uae", "IFRS financial statements in the UAE"),
        ("insight", "prepare-erp-for-uae-e-invoicing", "Getting your ERP e-invoicing ready"),
    ],
}


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
        block["image"] = ORG["logo"]  # Article rich results want an image; brand logo as fallback
        blocks.append(block)
    if page == "services" or page == "e-invoicing" or page.startswith("service-") or page.startswith("industry-"):
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
    if page in FAQ_BY_PAGE:
        blocks.append({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": f["q"],
                 "acceptedAnswer": {"@type": "Answer", "text": f["a"]}}
                for f in FAQ_BY_PAGE[page]
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


# Home isn't in PAGE_SEO (it's the root template); give it a crawlable heading/intro.
HOME_SEO = {
    "h1": "UAE Compliance & Advisory Accounting — Authentic Accounting",
    "intro": "Authentic Accounting and Bookkeeping L.L.C is a Dubai-based accounting and advisory firm serving SMEs, enterprises and Government across all seven emirates — accounting, VAT, UAE Corporate Tax, e-invoicing, IFRS financial statements, valuations and due diligence, delivered with reconciliation discipline.",
}

# Pages to expose as crawlable internal links on every page (the crawl graph).
NAV_PAGES = [
    "services", "service-bookkeeping", "service-vat", "service-corporate-tax",
    "service-financial-statements", "service-audit-support", "e-invoicing",
    "service-valuations", "service-transaction-advisory", "service-cfo",
    "service-tax-planning", "service-internal-controls", "service-forensic-accounting",
    "service-financial-modelling", "service-feasibility-studies", "service-fixed-asset-tagging",
    "service-strategic-advisory", "industries",
    "industry-real-estate", "industry-construction", "industry-trading",
    "industry-hospitality", "industry-ecommerce", "industry-manufacturing",
    "about", "insights", "careers", "contact",
]


def lead_heading(page, slug):
    if page == "insight":
        return strip_period(INSIGHTS_BY_SLUG.get(slug, INSIGHTS[0])["title"])
    if page == "home":
        return HOME_SEO["h1"]
    if page in PAGE_SEO:
        return re.split(r"\s+[|]\s+", PAGE_SEO[page]["title"])[0].strip()
    return BREADCRUMB_LABELS.get(page, "Authentic Accounting")


def intro_text(page, slug):
    if page == "insight":
        return INSIGHTS_BY_SLUG.get(slug, INSIGHTS[0])["excerpt"]
    if page == "home":
        return HOME_SEO["intro"]
    if page in PAGE_SEO:
        return PAGE_SEO[page]["description"]
    return ""


def seo_body(page, slug=None):
    """Crawlable static content injected into #root (React's createRoot replaces it
    on mount, so users get the SPA; crawlers and no-JS clients get real content)."""
    parts = ['<div class="container" style="padding:48px 0">']
    parts.append("<h1>%s</h1>" % esc(lead_heading(page, slug)))
    intro = intro_text(page, slug)
    if intro:
        parts.append("<p>%s</p>" % esc(intro))
    # Answer-first capsule (mirror of the visible on-page block).
    if page in ANSWER_FIRST:
        parts.append("<p>%s</p>" % esc(ANSWER_FIRST[page]))
    # FAQ as real headings + paragraphs (the council's explicit ask).
    if page in FAQ_BY_PAGE:
        parts.append("<section><h2>Frequently asked questions</h2>")
        for f in FAQ_BY_PAGE[page]:
            parts.append("<h3>%s</h3><p>%s</p>" % (esc(f["q"]), esc(f["a"])))
        parts.append("</section>")
    # Contextual related guides & tools (mirror of the visible on-page links) —
    # topical internal links, ahead of the generic Explore nav below.
    if page in RELATED_READING:
        parts.append("<section><h2>Related guides and tools</h2><ul>")
        for kind, target, label in RELATED_READING[page]:
            href = SITE_ORIGIN + "/insights/" + target if kind == "insight" else PAGE_TO_PATH[target]
            parts.append('<li><a href="%s">%s</a></li>' % (esc(href, attr=True), esc(label)))
        parts.append("</ul></section>")
    # Internal-link graph — present on every page so crawlers can traverse the site.
    parts.append('<nav aria-label="Site sections"><h2>Explore</h2><ul>')
    for p in NAV_PAGES:
        parts.append('<li><a href="%s">%s</a></li>' % (esc(PAGE_TO_PATH[p], attr=True), esc(BREADCRUMB_LABELS.get(p, p))))
    for a in INSIGHTS:
        if a["published"]:
            parts.append('<li><a href="%s">%s</a></li>' % (esc(SITE_ORIGIN + "/insights/" + a["slug"], attr=True), esc(strip_period(a["title"]))))
    parts.append("</ul></nav></div>")
    return "".join(parts)


def inject_root(html, body):
    # Replace the entire contents of <div id="root">…</div> with the prerendered
    # body. The end is anchored to the comment that follows #root in the template
    # so the match is unambiguous even though `body` itself contains </div> tags,
    # which keeps this idempotent across re-runs.
    new, n = re.subn(r'<div id="root">.*?</div>(\s*<!-- Tweak defaults)',
                     lambda m: '<div id="root">' + body + '</div>' + m.group(1),
                     html, count=1, flags=re.S)
    if n == 0:
        raise RuntimeError("inject_root: #root anchor not found — template structure changed")
    return new


def render(template, title, description, canonical, jsonld, robots=None, body=None):
    html = template
    html = html.replace("<head>", '<head>\n  <base href="/">', 1)
    # The home hero image preload must NOT ship on every route (209KB wasted
    # per page) — strip the marked line for all prerendered (non-home) pages.
    html = re.sub(r"[ \t]*<link rel=\"preload\"[^>]*data-aa-home-lcp[^>]*/>\n?", "", html)
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
    if body is not None:
        html = inject_root(html, body)
    return html


def write(route_path, html):
    rel = route_path.strip("/")
    out_dir = os.path.join(ROOT, *rel.split("/")) if rel else ROOT
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "index.html")
    with open(out_file, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    return os.path.relpath(out_file, ROOT).replace("\\", "/")


def write_sitemap():
    """Generate sitemap.xml from PAGE_TO_PATH + published insights so it can
    never drift from the routes we actually prerender."""
    today = datetime.date.today().isoformat()

    def priority(page):
        if page == "home":
            return "1.0"
        if page.startswith("service-") or page in ("services", "e-invoicing"):
            return "0.8"
        return "0.5"

    def changefreq(page):
        return "weekly" if page == "home" else "monthly"

    rows = []
    for page, path in PAGE_TO_PATH.items():
        loc = SITE_ORIGIN + path
        rows.append((loc, priority(page), changefreq(page), today))
    for a in INSIGHTS:
        if a["published"]:
            # Articles carry their real publish date, not the prerender date —
            # a uniform, ever-changing lastmod teaches crawlers to distrust it.
            rows.append((SITE_ORIGIN + "/insights/" + a["slug"], "0.6", "monthly", iso_date(a["date"]) or today))

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, prio, freq, lastmod in rows:
        lines += ["  <url>",
                  "    <loc>%s</loc>" % loc,
                  "    <lastmod>%s</lastmod>" % lastmod,
                  "    <changefreq>%s</changefreq>" % freq,
                  "    <priority>%s</priority>" % prio,
                  "  </url>"]
    lines.append("</urlset>")

    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")
    return len(rows)


def main():
    with open(os.path.join(ROOT, "index.html"), encoding="utf-8") as f:
        template = f.read()

    written = []

    # Static pages (home is the root index.html — already correct, skip)
    for page in ("services", "service-vat", "service-corporate-tax", "service-bookkeeping", "service-audit-support", "service-valuations", "service-transaction-advisory", "service-cfo", "service-financial-statements", "service-tax-planning", "service-fixed-asset-tagging", "service-forensic-accounting", "service-internal-controls", "service-financial-modelling", "service-feasibility-studies", "service-strategic-advisory", "e-invoicing", "industries",
                 "industry-real-estate", "industry-construction", "industry-trading", "industry-hospitality", "industry-ecommerce", "industry-manufacturing", "about",
                 "insights", "careers", "contact", "privacy", "terms"):
        meta = PAGE_SEO[page]
        canonical = full_url(page)
        html = render(template, meta["title"], meta["description"], canonical, build_jsonld(page, None), body=seo_body(page))
        written.append(write(PAGE_TO_PATH[page], html))

    # Insight articles
    for a in INSIGHTS:
        path = "/insights/" + a["slug"]
        # seoTitle/seoDesc are search-tuned (<=60 / <=158 chars, no brand suffix —
        # Google shows the site name separately); the on-page headline stays a["title"].
        title = a.get("seoTitle") or strip_period(a["title"]) + " | Authentic Accounting Insights"
        canonical = SITE_ORIGIN + path
        robots = None if a["published"] else "noindex, follow"
        html = render(template, title, a.get("seoDesc") or a["excerpt"], canonical, build_jsonld("insight", a["slug"]), robots=robots, body=seo_body("insight", a["slug"]))
        # Articles get article OG semantics (og:type + published_time) for social/rich results.
        html = html.replace('<meta property="og:type" content="website"/>', '<meta property="og:type" content="article"/>', 1)
        iso = iso_date(a["date"])
        if iso:
            html = html.replace(
                '<meta property="og:type" content="article"/>',
                '<meta property="og:type" content="article"/>\n  <meta property="article:published_time" content="%s"/>' % iso,
                1,
            )
        written.append(write(path, html))

    # Home (the root index.html is the template): only refresh its #root crawlable
    # body in place, leaving the head/markers pristine so it stays a clean template.
    home_html = inject_root(template, seo_body("home"))
    with open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8", newline="\n") as f:
        f.write(home_html)
    written.append("index.html (home)")

    n_urls = write_sitemap()
    print("Prerendered %d routes:" % len(written))
    for w in written:
        print("  " + w)
    print("Wrote sitemap.xml with %d URLs" % n_urls)


if __name__ == "__main__":
    main()
