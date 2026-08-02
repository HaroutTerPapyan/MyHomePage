# Sunny Home Loans — Rebuilt Site

All four pages now share one design system (the homepage's black/blue/green/gold
palette, Arial) and one header, footer, and application modal — edit those once
and every page picks up the change.

## Folder layout

```
/
├── partials/
│   ├── header.html      ← sticky top bar + nav, used on every page
│   ├── footer.html      ← compliance footer, used on every page
│   └── modal.html        ← lead-capture form, used on landing pages + blog posts
├── assets/
│   ├── site.css          ← all shared design tokens, components, responsive rules
│   └── site.js           ← loads the partials, runs the modal + FAQ accordion + nav logic
├── homepage.html
├── dscr-loan-los-angeles.html
├── bank-statement-mortgage-los-angeles.html
├── adu-loan-santa-clarita.html
├── index.html               ← redirects the bare domain to /homepage.html
└── blog/
    ├── index.html                       ← resources/blog landing page
    ├── dscr-loan-requirements-2026.html ← your first live post
    └── _new-post-template.html          ← copy this to start a new post
```

**Note on `index.html`:** GitHub Pages automatically serves this file for the bare
domain (`haroutterpapyan.com/`). The root one is a one-line redirect to
`/homepage.html` so visitors land on your real homepage. The one inside `blog/`
is a different file — the actual blog listing page, shown at `/blog/`.

## What changed from your original files

- **One design system.** Your three landing pages were previously navy/gold with
  Playfair Display + Inter — a different look from the homepage. Everything now
  uses the homepage's black/blue/green/gold Arial system, per your call.
- **Shared header/nav/footer/modal.** Previously each of the 3 landing pages had
  its own copy-pasted nav and a near-identical modal with ~200 lines of duplicate
  HTML/CSS/JS each. Now there's one copy of each, loaded via `fetch()` into every
  page.
- **Formspree endpoints preserved.** Each landing page kept its own real
  Formspree ID (so your existing lead notifications/spreadsheets keep working) —
  set at the top of each page via `window.LEAD_FORM = { action, loanType }`
  before `site.js` loads.
- **All your real copy carried over** — hero content, stats, "who this is for"
  lists, parameter tables, process steps, FAQs, and service-area lists for DSCR,
  bank statement, and ADU are all still there, just restyled.
- **Nav is now context-aware.** The homepage's nav includes links to its own
  page sections (Perspective, Capabilities, Clients, Method). On other pages,
  `site.js` automatically hides those links since the sections don't exist
  there — no manual per-page nav editing needed.

## How to add a new blog post

1. Copy `blog/_new-post-template.html`, rename it, and edit the content inside
   `<article class="post">`, the FAQ section, the `<title>`/meta description,
   and the FAQ JSON-LD block.
2. Set `window.LEAD_FORM` near the top to whichever loan type/Formspree endpoint
   the post should route to.
3. Add a card for it in `blog/index.html`'s `.blog-grid`.

## Important: this needs real web hosting, not double-clicking the file

The header/footer/modal load via JavaScript `fetch()`, which browsers block on
`file://` pages for security reasons. Upload this whole folder to your actual
web host to see it work correctly — or preview locally first:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000/homepage.html`.

## Still worth doing

- Double-check the internal links in `partials/header.html` match your real
  hosted file paths (currently `/homepage.html`, `/dscr-loan-los-angeles.html`,
  etc. — adjust if your host uses different URLs or no leading slash).
- The homepage's inline scenario form and each landing page's modal still post
  to their original, separate Formspree IDs — confirm all four still deliver to
  the inbox/sheet you expect.
