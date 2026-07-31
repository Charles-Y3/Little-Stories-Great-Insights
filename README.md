# Little Stories Great Insights 小故事大啟發

A bilingual (Traditional Chinese / English) card deck of short parables.
Flip a card to read the story, write down what it stirs in you.

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
```

## Content

Adding or editing a story? See [docs/AUTHORING.md](docs/AUTHORING.md) — the
card back never scrolls, so story length is a hard, validated budget.

```bash
npm run audit-fit   # per-story line-count headroom report
npm run images       # regenerate public/story-images/ + imageManifest.js
                      # after changing assets-src/ or story-slugs.json
```

## Build

```bash
npm run build      # runs the content validator + image check first
npm run preview    # serve the production build locally, http://localhost:4173
```

Deploys to Vercel (`vercel.json`); the build fails loudly if any story is
over its no-scroll budget or an image asset is missing.
