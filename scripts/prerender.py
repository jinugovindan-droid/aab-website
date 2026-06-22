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
    {"slug": "free-zone-qualifying-income", "tag": "Corporate Tax", "date": "12 Apr 2026",
     "title": "Free zone qualifying income — three traps in the UAE free-zone tax rules.",
     "author": "CA Kiran Prasad S", "reviewer": "Jinu Govindan", "reference": "Cabinet Decision 100 of 2023 · Ministerial Decision 265 of 2023 (am. 229 of 2025)",
     "excerpt": "The UAE’s free-zone tax rules — Cabinet Decision 100 of 2023 and Ministerial Decision 265 of 2023, since updated by Ministerial Decision 229 of 2025 — are being read three different ways by tax teams in the UAE. We unpack the three traps we keep seeing in client positions, and what the consequence is at filing.",
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
    if page in ("services", "service-vat", "e-invoicing"):
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
    for page in ("services", "service-vat", "e-invoicing", "industries", "about",
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
