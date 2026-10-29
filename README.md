# Cynbit QuickNav

A keyboard-driven command palette that lets visitors jump to any page of [cynbit.in](https://www.cynbit.in/) in a few keystrokes.

> **This is an independent improvement prototype** built for the Cynbit website challenge. It is not integrated into, or part of, the official Cynbit website.

- **Live demo:** https://cynbit-quicknav.vercel.app/
- **Repository:** https://github.com/Aryan-H2005/Cynbit-Quicknav

## Problem

cynbit.in has three dropdown menus, two direct links and a footer, plus a `/navigation` page that maps the whole site. The same page can be called different things in different places (the header says "Our Story", the footer says "About Us", both go to `/story`), and pages such as Learning Paths, Careers or the product sections sit behind menus or inside other pages. QuickNav gives visitors one search box that understands both names and topics.

## Features

- `Ctrl + K` (Windows/Linux) or `Cmd + K` (macOS) opens the palette; the header button does too.
- Instant, case-insensitive search over titles, categories and keyword aliases (`about` finds Our Story, `jobs` finds Careers, `rent` finds TenantEase).
- Arrow keys move, `Enter` opens, `Esc` closes. Mouse hover and click work too.
- Empty state with suggestions, matched text highlighted.
- 20 destinations, all taken from the live site's own menus and Navigation Map. Pages open on cynbit.in in a new tab.
- Dialog semantics, combobox/listbox ARIA, focus moved into the dialog and returned on close, focus kept inside while open, visible focus outlines, light and dark mode, reduced-motion support.
- Only `Ctrl/Cmd + K` is captured. Plain letters never trigger anything, so typing in fields is unaffected.

## Tech stack

React 18 · Vite · JavaScript · Tailwind CSS 3 · Lucide React · Vitest + Testing Library. No backend, no API, no network requests at runtime (the only external fetch is the Cynbit logo image).

## Run it

```bash
npm install
npm run dev       # local dev server
npm test          # unit and interaction tests
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel choose **Add New, Project**, import the repository.
3. Vercel detects Vite. Keep the defaults (build `npm run build`, output `dist`) and deploy.
4. Open the deployed URL and follow the manual checklist below.

## Testing

Automated (`npm test`): 20 tests covering search ranking and aliases, both shortcuts, the header button, focus, filtering, empty state, arrow keys, Enter, Escape, mouse selection, typing safety, dialog semantics and focus return. They run in jsdom, not a real browser.

Manual checklist for a real browser: both shortcuts, tab through the dialog, resize to phone width, try dark mode and reduced motion, open every destination, check the console for errors.

## Customising

- Destinations and aliases: `src/data/navigation.js`
- Ranking rules: `src/lib/search.js`
- Colors: `tailwind.config.js`. The `brand` palette is a placeholder because Cynbit's real colors could not be read from the site.

## Integrating into the real site

The palette is self-contained. On the production site it would be mounted once at the layout level, fed from the site's own route list, and `onNavigate` would call the site's router instead of `window.open`. See `docs/technical-report.md`.
