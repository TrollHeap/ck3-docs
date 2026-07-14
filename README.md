# CK3 Scenario Modding Docs

A lightweight, single-file documentation website for Crusader Kings III scenario and story-cycle modding.

This project provides a practical reference for building reusable narrative systems in CK3 mods: event chains, story campaigns, persistent story variables, scripted effects, actor registries, branching outcomes, debugging patterns, and copy-ready recipes.

## Features

- **Single `index.html` file** — no build step, no framework, no dependencies.
- **Multilingual interface** — English by default, with Spanish and French available from the language dropdown.
- **Documentation + recipe library** — general CK3 scenario principles plus reusable implementation patterns.
- **Copy-ready snippets** — event templates, story-cycle patterns, travel missions, infiltration checks, endings, and notification flows.
- **Developer-focused tools** — command palette, quick search, persistent checklist, section anchors, pinned sections, and code copy buttons.
- **Mobile and split-screen friendly** — designed to stay readable while coding next to your editor.

## Main Sections

- **Docs** — architecture, event lifecycle, scopes, story variables, war/faction logic, artifacts, localization, and debug workflow.
- **Recipes** — ready-to-copy patterns for common scenario systems:
  - create a full story campaign;
  - create or retrieve an important actor;
  - send an agent on a mission;
  - build an infiltration cycle;
  - run an investigation with cooldown;
  - create canon / non-canon endings;
  - transfer the player to another character;
  - create a global crisis with regional notifications.
- **Tools** — quick generator, persistent checklist, debug notes, and reference links.

## Usage

Open the file directly in your browser:

```bash
open index.html
```

Or serve it locally:

```bash
python3 -m http.server 8080
```

Then open:

```txt
http://localhost:8080
```

## Keyboard Shortcuts

- `/` — focus quick search.
- `Ctrl + K` / `Cmd + K` — open the command palette.
- `Esc` — close dropdowns, overlays, or command palette.

## Recommended Repository Structure

```txt
ck3-scenario-docs/
├── index.html
├── README.md
└── .nojekyll
```

The `.nojekyll` file is recommended when deploying to GitHub Pages to ensure the page is served as a plain static site.

## Deployment

### GitHub Pages

1. Push `index.html`, `README.md`, and `.nojekyll` to a GitHub repository.
2. Go to **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Choose the `main` branch and `/root` folder.
5. Save and wait for the generated Pages URL.

### Netlify Drop

For a quick preview, drag and drop the folder containing `index.html` into Netlify Drop.

### Cloudflare Pages

Use Direct Upload if you want to upload the folder without connecting a Git repository.

## Notes

This documentation is intentionally practical rather than exhaustive. It focuses on patterns that are useful when building complex CK3 narrative systems, especially long-running story cycles with multiple characters, fallback branches, delayed events, and debugging safeguards.

The examples are generic, but some patterns are inspired by Warcraft-themed CK3 scenario modding workflows.

## License

Use and adapt freely for internal modding documentation unless your project requires a specific license.
