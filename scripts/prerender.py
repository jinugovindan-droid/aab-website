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
    if page in ("services", "service-vat", "e-invoicing", "service-corporate-tax", "service-bookkeeping"):
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
    faq_by_page = {"e-invoicing": EINVOICE_FAQ, "service-corporate-tax": CORPTAX_FAQ, "service-bookkeeping": BOOKKEEPING_FAQ}
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
    for page in ("services", "service-vat", "service-corporate-tax", "service-bookkeeping", "e-invoicing", "industries", "about",
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
