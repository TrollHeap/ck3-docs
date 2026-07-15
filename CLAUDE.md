# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# CK3 Scenario Docs — Project Context

This project is a static documentation site for CK3 / Warcraft-style scenario modding.

It was migrated from a fragile single-file `index.html` into an Astro project to make the codebase easier to maintain. The goal is to keep the same dark premium documentation design while separating layout, pages, data, components, styles, and scripts.

## Purpose

The site documents reusable CK3 narrative scripting patterns:

- story campaigns;
- hidden setup events;
- persistent story state;
- event chains;
- actor retrieval;
- travel / scheme / war / cooldown recipes;
- Jomini / CK3 code snippets;
- debugging and implementation checklists.

## Commands

```bash
npm run dev       # dev server at localhost:4321
npm run build     # static build → dist/
npm run preview   # preview the built dist/
```

No linter or test suite is configured.

## Architecture

Static site built with Astro 5, deployed to GitHub Pages at `TrollHeap.github.io/ck3-docs/`. All content and i18n lives in one JSON file; the Astro pages are thin renderers over that data.

### Data model

`src/data/appData.json` is the single source of truth with two top-level keys:

**`snippets`** — raw Jomini code strings, keyed by id:

```
{ [id: string]: string }
```

**`i18n`** — per-language copy keyed by lang code (`en`, `fr`, `es`). Each language object contains:

- `docsSections[]` — `{ id, title, kicker, html }` — `html` is raw HTML injected via `set:html` (not markdown)
- `recipes[]` — `{ id, title, tags[], snippet, diagram, steps[] }` where `snippet` is a key into `data.snippets`
- `checklist[]` — plain string array
- All UI strings: `metaTitle`, `brandTitle`, `brandSub`, `tabs`, `heroTitle`, `heroText`, etc.

Adding a new language: add a key to `i18n`, add the code to `langs` in `src/utils/paths.js`.

### Routing

All pages live under `src/pages/[lang]/` and use `getStaticPaths()` to iterate over `Object.keys(data.i18n)`. The root `index.astro` is a redirect to `/en/docs/`.

| Route                   | File                                        | Note                                   |
| ----------------------- | ------------------------------------------- | -------------------------------------- |
| `/[lang]/docs/`         | `src/pages/[lang]/docs/index.astro`         |                                        |
| `/[lang]/recipes/`      | `src/pages/[lang]/recipes/index.astro`      | Hard-wired to `recipes[0]`             |
| `/[lang]/recipes/[id]/` | `src/pages/[lang]/recipes/[id]/index.astro` | Same template as above, driven by `id` |
| `/[lang]/tools/`        | `src/pages/[lang]/tools/index.astro`        |                                        |

`recipes/index.astro` and `recipes/[id]/index.astro` are nearly identical templates — the index page is just hard-wired to `recipes[0]` instead of using `Astro.params.id`.

### Layout and components

`AppLayout.astro` owns the full page shell: topbar with tabs + language switcher, optional left sidebar (Docs only), main `<slot />`, `ChecklistDrawer`. Props: `lang`, `active`, `title`, `sidebarItems`, `currentId`, `recipeId`.

`recipeId` is passed when `active === 'recipes'` so the language switcher redirects to the same recipe in the target language rather than the first recipe.

`ChecklistDrawer.astro` renders a slide-in drawer; checklist state persists per-lang in `localStorage` under the key `ck3docs.checklist.<lang>`.

`CodeBlock.astro` wraps a code snippet with a copy button wired to `[data-copy-code]`. It calls `highlightJomini()` **at build time** (server-side Astro component), so syntax tokens are pre-rendered as `<span class="jom-*">` — no client-side JS needed for highlighting.

### Jomini syntax highlighter

`src/utils/highlight.js` exports `highlightJomini(raw)`. Called only in `CodeBlock.astro` at build time. Token CSS classes (styled in `global.css`):

| Class         | Matches                                                  |
| ------------- | -------------------------------------------------------- |
| `jom-comment` | `# …` lines                                              |
| `jom-string`  | quoted strings                                           |
| `jom-number`  | numeric literals                                         |
| `jom-bool`    | `yes`, `no`, `always`                                    |
| `jom-op`      | `=`, `>=`, `<=`, `{`, `}`                                |
| `jom-scope`   | `root`, `prev`, `this`, `liege`, etc. or `scope:` prefix |
| `jom-ref`     | `word:word` namespace references                         |
| `jom-key`     | built-in Jomini keywords (fixed list in the file)        |

### Client-side scripts

**Critical**: `AppLayout.astro` uses Astro's `<ClientRouter />` (View Transitions). All client-side code must therefore listen to `astro:page-load` (replaces `DOMContentLoaded`) and `astro:after-swap` (replaces `document` swap) — never plain `DOMContentLoaded`.

`public/scripts/site.js` — single IIFE loaded on every page (no bundler):

- Theme toggle (dark default, light via `localStorage` key `ck3docs.theme`)
- Language `<select>` navigation
- Copy-to-clipboard for code blocks
- Checklist drawer open/close and `localStorage` persistence (`ck3docs.checklist.<lang>`)
- IntersectionObserver for sidebar active-link highlighting

`public/scripts/tools.js` — loaded only on the Tools page via a `<script>` tag inside `tools/index.astro` (not through AppLayout). Handles the snippet generator form.

### localStorage keys

| Key                        | Values            | Purpose                       |
| -------------------------- | ----------------- | ----------------------------- |
| `ck3docs.theme`            | `"light"` / unset | Theme override (dark default) |
| `ck3docs.checklist.<lang>` | JSON object       | Checklist checkbox states     |

### Path helpers

`src/utils/paths.js` exports `langs`, `withBase()` (prepends `BASE_URL`), and `langPath(lang, section, id?)` for all internal links. Always use these; never hardcode `/ck3-docs/`.

### GitHub Pages

`astro.config.mjs` sets `base: '/ck3-docs/'` and `trailingSlash: 'always'`. Build output goes to `dist/`. Deploy `dist/` via GitHub Actions.
