# Cynbit QuickNav: Website Navigation Command Palette

## 1. Project title
Cynbit QuickNav, a keyboard-driven navigation command palette for cynbit.in (improvement prototype).

## 2. Abstract
Cynbit's website organises its pages across three header dropdowns, two direct links, a footer and a Navigation Map page. QuickNav adds a single search box, opened with `Ctrl/Cmd + K`, that finds any page by title, topic or alias and opens it with the keyboard. It was built as a standalone React prototype because the production source is not available. It needs no backend, runs entirely in the browser, and is covered by 20 automated tests that all pass.

## 3. Existing website analysis
**Method.** I read the text and links of three pages with a page-fetching tool: the homepage, `/navigation` and `/products`. I could not see rendered visuals, CSS, mobile behaviour or JavaScript-only features.

**Verified from the page text**
- Header: dropdowns Company (Our Story, Our Team, Careers, Social Impact), Expertise (Services Hub, Product Suite, Case Studies) and BitElevate (The Ecosystem, Learning Paths, Student Diaries), plus Blog, Contact and a "Get Started Now" button. The mobile menu lists the same links.
- Footer: Explore, Impact and legal links, contact details, social links and a link to `/navigation`.
- `/navigation` is a full directory of 17 pages grouped under four headings, introduced as "Lost in the architecture?".
- `/products` has anchors `#cynbit-studio`, `#tenantease` and `#revio`.
- The same destination has different labels in different places: `/story` is "Our Story" in the header and "About Us" in the footer; `/contact` is "Contact" and "Contact Support".
- Menu text uses Material-Symbols-style icon names (for example `history_edu`), and the page has a `next-size-adjust` meta tag. These hint at the icon font and possibly Next.js, but I did not confirm the framework.

**Not verified**
- I did not load each individual page. Their URLs come from the site's own menus and Navigation Map, which I treated as authoritative.
- I found no search or shortcut feature in the page text, but I cannot rule out one that only appears with JavaScript.
- Fonts, colors, mobile layout and keyboard accessibility of the existing menus.

## 4. Problem statement
Reaching a page currently means opening the right dropdown or scanning the footer or Navigation Map, and knowing which label the site uses. A visitor typing "about" has no page called About to look for, and deeper destinations such as Learning Paths or the three products need two or more clicks. I did not measure real visitor behaviour, so this is an observed opportunity, not a proven pain point.

## 5. Objectives
1. One shortcut to open a search over every verified page.
2. Alias matching to bridge naming differences.
3. Full keyboard operation plus mouse support.
4. Accessible dialog semantics.
5. Lightweight: no backend, no paid service, few dependencies.

## 6. Proposed solution
A modal command palette over a static list of 20 destinations. Search is a local scoring function; selection opens the page on cynbit.in in a new tab.

## 7. Technology stack and justification
| Choice | Why |
|---|---|
| React + Vite (JavaScript) | Requested stack; fast dev server and small builds |
| Tailwind CSS 3 | Quick, consistent styling with dark mode and responsive utilities |
| Lucide React | Small icon set; imported per icon |
| Vitest + Testing Library + jsdom | Real interaction tests without a browser |
| Vercel + GitHub | Requested deployment path |

## 8. System architecture
```
App.jsx ── global Ctrl/Cmd+K listener, page layout
 ├─ SearchTrigger.jsx   header button + shortcut hint
 └─ CommandPalette.jsx  dialog, input, result list, keyboard handling
      ├─ lib/search.js        pure scoring and filtering
      ├─ data/navigation.js   destinations and aliases (data only)
      └─ lib/navigate.js      opens the chosen URL
```
Navigation data, search logic and UI are separate, so the palette can be mounted in another React app by passing it a `destinations` array and an `onNavigate` function.

## 9. Implementation details
- **Search:** every typed word must match. Title-start matches score highest, then title words, aliases, substrings and finally description/category. Ties keep the data order. Text is lowercased and accent-stripped, and regex characters in the query are escaped for highlighting.
- **Shortcut:** one `keydown` listener on `window` for Ctrl/Cmd + K, ignoring Shift/Alt and IME composition. Only the modifier combination is captured, so ordinary typing is never affected. The same shortcut toggles the palette closed.
- **Accessibility:** `role="dialog"` with `aria-modal` and a label; input is a `combobox` controlling a `listbox` of `option`s with `aria-activedescendant`; a polite status line announces result counts; Tab is kept within the dialog; focus returns to the opener on close; page scroll is locked while open.
- **Motion:** short fade and pop animations, disabled under `prefers-reduced-motion`.
- **Navigation:** `window.open(url, '_blank', 'noopener,noreferrer')`, since destinations are on another origin.
- **Deliberately left out:** a "recently visited" list, to keep the core reliable.

## 10. Testing and actual results
Performed in the build environment on 29 October 2026:
- `npm test`: **20 of 20 tests passed** (2 files). Covers unique ids and cynbit.in-only URLs, case-insensitive search, aliases (`about`, `jobs`, `rent`), multi-word and no-match queries, regex-safe input, Ctrl+K, Cmd+K, header button, input focus, filtering, empty-state message, ArrowUp/ArrowDown wrap-around, Enter, Escape, mouse click, typing "k" in a text field, dialog attributes and focus return.
- `npm run build`: succeeded. Output: JS 237 kB (75 kB gzip), CSS 13.6 kB (3.7 kB gzip).

**Not performed:** testing in a real browser, visual checks at phone, tablet and desktop widths, a console-error check in a real browser, an accessibility audit tool or screen reader pass, loading each destination URL, deployment, and any test on a deployed URL. The manual checklist in the README covers these.

## 11. Limitations
- Standalone prototype, not integrated with the production site, and it opens pages in a new tab.
- Destinations are a hand-maintained snapshot of the site's menus; pages added later will not appear until the data is updated.
- Brand colors and fonts are placeholders because they could not be read from the site; the logo is loaded from cynbit.in and falls back to text if that fails.
- Search covers page titles, descriptions and aliases, not page content or blog posts.
- Descriptions marked as site taglines in the code come from the menus; the rest are my own short summaries.

## 12. Future work
Generate the destination list from the site's routes or sitemap; add recently visited items and blog posts; add section-level destinations on the services page after verifying its structure; match the real brand tokens; add real-browser end-to-end tests; mount inside the production layout using the site's router.

## 13. Conclusion
QuickNav shows that one small, dependency-light component can give visitors a faster, alias-aware path to every page of cynbit.in. The core behaviour is covered by passing automated tests; real-browser, responsive and deployed checks remain to be done before submission.
