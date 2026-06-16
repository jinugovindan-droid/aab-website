# Authentic Accounting Website — Technical Summary & Disaster-Recovery Guide

**Last updated:** 17 Jun 2026 · **Snapshot commit:** `8cb5ef1`
**Live site:** https://www.aaccounting.me

This document explains, in plain language, what the website is, what was set up,
where everything lives, and exactly how to get the site back if it ever breaks.
Keep it with your backups.

---

## 1. What the website is (in plain terms)

It is a **static website** — a set of HTML/CSS/JavaScript files served directly to
visitors. There is **no database and no server-side code to maintain**. The pages
are built with React, but React is loaded from a public CDN and the page code is
compiled **in the visitor's browser** (so there is no "build" to run for normal
hosting — the raw files just work).

On top of that, a small **prerender step** creates a static copy of each page
(with the correct title/description/Google data) so that Google and social media
see real content. Those are the `index.html` files inside the `services/`,
`about/`, `insights/...` folders, etc.

**Tech stack:** Static HTML · React 18.3.1 (production build, from unpkg CDN) ·
Babel Standalone (compiles the JSX in the browser) · Lucide icons · No build tool.

---

## 2. Where everything lives (accounts & services)

| Thing | Where | Detail / ID |
|---|---|---|
| **Source code** | GitHub | `github.com/jinugovindan-droid/aab-website` |
| **Production branch** | GitHub | `claude/implement-accounting-website-Esr4o` |
| **Hosting** | Vercel | project **aab-website** (team: jinugovindan-droids-projects); URL `aab-website.vercel.app` |
| **Domain** | `aaccounting.me` | canonical host is **www.aaccounting.me** |
| **DNS / proxy** | **Cloudflare** → Vercel | Cloudflare sits in front of Vercel (redirects non-www→www, manages robots.txt, blocks AI crawlers) |
| **Analytics 1** | Google Analytics 4 | Measurement ID **G-GF3Z86ETK2** · Property ID **542031701** · stream `aaccounting.me` |
| **Analytics 2** | Vercel Web Analytics | cookieless, enabled on Hobby (free) plan |
| **Search Console** | Google | property **https://www.aaccounting.me/** (verified via HTML meta tag) |
| **Contact form** | Google Apps Script → Google Sheet | endpoint URL is in `scripts/contact-sheet.js` |
| **Google account** | `jinugovindan@gmail.com` | owns GA4, Search Console, the contact sheet, Drive backup |

---

## 3. What was done (summary of the work)

**Content & accuracy**
- Reviewed all "Insights" articles. Corrected factual errors in the free-zone
  Corporate Tax (QFZP) article (substance test, the "no annual election" point,
  the de-minimis cap) and fixed a mis-attribution to the FTA.
- About page: added **Sabith Abdul Rahman** (Director — CFO Services); moved
  **Johncy Mathew** into the first row, strengthened his bio, retitled him
  **Relationships Manager**.

**Site architecture / SEO**
- Built real **per-article routing** for Insights (each article has its own URL;
  unwritten ones show an honest "in preparation" state and are `noindex`).
- Aligned the whole site to the **www** canonical host (canonical tags, Open
  Graph, sitemap, robots).
- Switched React to the **production** build (faster).
- Added **structured data** (JSON-LD) on every page: Organization, Breadcrumbs,
  Article (on insights), Service (on service pages).
- Added `lastmod` dates to the sitemap.
- **Prerendering** (`scripts/prerender.py`): writes a static HTML file per route
  with the correct meta + JSON-LD, so crawlers/social previews work.

**Analytics & Search**
- Set up **Google Analytics 4** + **Vercel Web Analytics**, with a **cookie
  consent banner** and Google **Consent Mode v2** (analytics off until the
  visitor accepts), plus a privacy-policy update.
- Created and **verified the site in Google Search Console**, submitted the
  sitemap (12 URLs, "Success"), and removed an old 2020 sitemap.

**Backups (disaster recovery)**
- Local folder + zip in `Documents\aab-website-DR\`.
- Source + history on **GitHub**.
- A Drive folder (this guide + the zip).

---

## 4. How the site is built & deployed (the normal workflow)

1. Edit the files (in `index.html` or `scripts/*.jsx`, etc.).
2. If you changed page content or SEO text, **re-run the prerender** so the static
   snapshots match:
   ```
   python scripts/prerender.py
   ```
   (The data inside `scripts/prerender.py` must match `scripts/routes.js`.)
3. Commit and push to GitHub.
4. **Vercel auto-deploys** the pushed branch within ~1 minute. No manual build.

> Cache note: script files in `index.html` carry a `?v=...` version tag. Bump it
> when you change a `.jsx`/`.js`/`.css` file so browsers fetch the new version.

---

## 5. ⭐ HOW TO RESTORE IF THE WEBSITE CRASHES

Pick the scenario that matches the problem.

### Scenario A — "A change broke the live site" (most common, fastest fix)
You don't need any files. Roll back to the last good version in Vercel:
1. Go to **vercel.com** → project **aab-website** → **Deployments**.
2. Find the last deployment that was working (green, before the bad one).
3. Click the **⋯** menu → **Promote to Production** (a.k.a. Rollback).
4. The live site instantly reverts. Then fix the code and redeploy when ready.

### Scenario B — "The code on my PC is lost, but GitHub is fine"
Everything is safe on GitHub. Get it back:
```
git clone https://github.com/jinugovindan-droid/aab-website.git
```
That restores all files and history. Vercel keeps deploying from GitHub as normal.

### Scenario C — "I need to redeploy the whole site from the backup"
Use the DR zip (from `Documents\aab-website-DR\` or Google Drive):
1. Unzip it → you get the full deployable site folder.
2. **Easiest:** go to **vercel.com → Add New → Project**, drag the folder in.
   - Framework: **Other** · Build command: **none** · Output dir: **/ (root)**.
3. Deploy, then re-point the domain (see Scenario E).
   *(Alternative: open a terminal in the folder and run `vercel --prod`.)*

### Scenario D — "Vercel is gone / I'm moving to a different host"
The site is plain static files, so any static host works (Netlify, AWS S3 +
CloudFront, nginx, Apache). Upload the unzipped DR folder, and configure **one**
rule so the app's navigation works:
- Unknown paths must fall back to **`/index.html`** (this is the rule already in
  `vercel.json`: `source "/(.*)" → destination "/index.html"`).
- The real per-route folders (`services/`, `about/`, `insights/<slug>/` …) must be
  served directly first; the fallback is only for paths that don't exist.

### Scenario E — Re-pointing the domain (`aaccounting.me`)
The domain routes **Cloudflare → Vercel**. After a new deployment:
- In **Vercel** → project → **Domains**, attach `aaccounting.me` / `www` to the new
  deployment, **or**
- In **Cloudflare** (the DNS that fronts the site), update the record that points
  to Vercel. The non-www→www redirect also lives in Cloudflare.

### Scenario F — Contact form stops collecting leads
Leads go to a **Google Apps Script** web app (URL in `scripts/contact-sheet.js`)
that writes to a Google Sheet, under `jinugovindan@gmail.com`. If leads stop:
1. Check the Apps Script project is still **deployed** and set to "Anyone" access.
2. The form uses `mode: 'no-cors'`, so it **cannot detect failures** — the visitor
   always sees "success." Test by submitting the form and confirming a new row
   appears in the Sheet.

---

## 6. Where the backups are

| Backup | Location | Contains | Off-machine? |
|---|---|---|---|
| GitHub repo | `github.com/jinugovindan-droid/aab-website` | Full source + history | ✅ |
| Local DR folder | `C:\Users\Authentic -1\Documents\aab-website-DR\site_2026-06-17_commit-8cb5ef1\` | Ready-to-deploy site | ❌ |
| Local DR zip | `…\Documents\aab-website-DR\aab-website_2026-06-17_commit-8cb5ef1.zip` | Same, zipped | ❌ |
| Google Drive | folder "aab-website-DR (2026-06-17, commit 8cb5ef1)" | This guide (+ the zip, once dragged in) | ✅ |

To refresh the backup later: re-run the copy and re-zip the project folder
(excluding `.git` and `.claude`), and update the date/commit in the names.

---

## 7. Good-to-know limitations (not urgent)

- **Speed:** the browser compiles the page code on every load (Babel in-browser,
  ~900 KB). It works, but is slower than a precompiled build. Fixing it needs a
  build step (Node.js) and is optional.
- **Prerender is manual:** after content/SEO edits, re-run `python scripts/prerender.py`
  or the static snapshots go stale.
- **Contact form** can't detect its own failures (see Scenario F) — test it
  occasionally.
- **Unknown URLs** return the homepage with a 200 status (a "soft 404"). Harmless
  unless old/dead URLs get indexed.
- **non-www → www** redirect is a 307 (temporary) at Cloudflare; a 301 (permanent)
  would be marginally cleaner. Low priority.

---

## 8. Quick reference card

```
Live site        : https://www.aaccounting.me
Repo             : github.com/jinugovindan-droid/aab-website  (branch: claude/implement-accounting-website-Esr4o)
Host             : Vercel project "aab-website"
DNS/proxy        : Cloudflare -> Vercel
GA4 Measurement  : G-GF3Z86ETK2   (Property ID 542031701)
Vercel Analytics : enabled (cookieless)
Search Console   : property https://www.aaccounting.me/ (HTML-tag verified)
Contact endpoint : Google Apps Script (URL in scripts/contact-sheet.js)
Google account   : jinugovindan@gmail.com
Redeploy after change : push to GitHub -> Vercel auto-deploys (~1 min)
Fastest crash fix     : Vercel -> Deployments -> Promote a previous good one
```
