# CK3 Scenario Docs — Astro migration

This is the refactored Astro version of the previous single-file `index.html`.

## Why this migration exists

The old site had all of this in one HTML file:

- global CSS
- global JS
- tab state
- sidebar logic
- recipes UI
- tools generator
- checklist state
- Jomini syntax highlighting

That made fixes fragile. This Astro version separates the site into pages and components.

## Structure

```txt
src/
├─ components/
│  ├─ ChecklistDrawer.astro
│  └─ CodeBlock.astro
├─ data/
│  └─ appData.json
├─ layouts/
│  └─ AppLayout.astro
├─ pages/
│  ├─ index.astro
│  └─ [lang]/
│     ├─ docs/index.astro
│     ├─ recipes/index.astro
│     ├─ recipes/[id]/index.astro
│     └─ tools/index.astro
├─ styles/
│  └─ global.css
└─ utils/
   ├─ highlight.js
   └─ paths.js
```

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages

The repository `TrollHeap/ck3-docs` should use:

```js
base: '/ck3-docs/'
```

This is already set in `astro.config.mjs`.

Build output will be in:

```txt
dist/
```

Deploy `dist/` with GitHub Actions or another static host.

## Current routes

```txt
/en/docs/
/en/recipes/
/en/recipes/<recipe-id>/
/en/tools/

/fr/docs/
/fr/recipes/
/fr/recipes/<recipe-id>/
/fr/tools/

/es/docs/
/es/recipes/
/es/recipes/<recipe-id>/
/es/tools/
```

## Important design choice

The checklist is now a drawer, not a permanent right column. This avoids layout bugs across Docs, Recipes and Tools. The Recipes tab now points directly to the first real recipe page, while `/recipes/` renders that same first recipe instead of using a meta-refresh redirect.
