# Authoring a story

Ten stories exist today. This is what to know before adding an eleventh.

## The no-scroll rule

Card backs never scroll — a parable's punchline must never fall below the
fold. `npm run audit-fit` (or `node scripts/validate-data.mjs --report`)
prints every story's estimated line count against the 16-line ceiling before
you commit anything:

```
slug                             zh lines  en lines  headroom
watch-your-step                          6        10        6
our-ladys-answer                        12        15        1  ⚠ tight
```

`npm run build` runs the strict version of the same check and fails the
build on any story over budget — it names the field, the overage in lines,
the cut needed, and the single longest paragraph.

**Budget:** roughly 250–290 CJK characters (≤360 hard ceiling) or
120–150 English words (≤900 characters, ≤160 words). Short paragraphs are
expensive — each one costs a minimum of one rendered line regardless of how
few characters it holds, so seventeen one-line dialogue exchanges will blow
the budget even though the raw character count looks fine. Merge short
back-and-forth dialogue onto shared lines before trimming actual content.

**The one exception:** the insight-writing textarea may scroll. "No
scrolling" is a constraint about *authored* content being cut off; it
doesn't apply to a reader's own in-progress writing, where scrolling is
normal text-field behavior.

**Runtime safety net:** `useFitText` will shrink a story's font down to
82% (bounded at a 15px floor) if it's still slightly too tall at render
time — different devices render the same text at slightly different
widths. If a story ever needs the safety net's *scroll* fallback (visible
as an actual scrollbar on the card back), treat that as a bug report
against this validator's assumptions, not a shippable state — cut the
story down instead of leaning on the fallback.

## English is an adaptation, not a translation

A faithful English rendering of a 300-character Chinese parable runs
180–220 words — well over budget. Write English as a *compressed
adaptation*: same meaning, same arc, same punchline, tighter prose. It will
not be a literal line-by-line rendering of the Chinese, and that's
expected.

## Adding a story

1. Rename the artwork `assets-src/<slug>.png` (ASCII slug, meaning-based —
   not transliterated pinyin) and add a row to `scripts/story-slugs.json`
   with `{file, slug, titleZh}`.
2. Run `npm run images` — generates `public/story-images/<slug>-{600,1200}.webp`,
   a base64 LQIP, and WCAG-verified tints (`colorLight`/`colorDark`/`colorSepia`)
   into `src/data/imageManifest.js`. Commit both together.
3. Write `src/data/stories/<slug>.js`:
   ```js
   export default {
     id: "<slug>",           // must equal the manifest key
     order: 11,               // reading-list position
     title: { zh, en },       // zh ≤12 chars, en ≤40 chars
     source: { zh, en },      // optional — omit if there's no clear provenance
     tags: { zh, en },        // optional, ≤5 each
     story: { zh, en },       // the length-gated fields — see above
     prompts: { zh, en },     // 2–4 reflection questions per language
     image: "<slug>",
     speech: { zh: "" }       // reserved, unused until TTS ships
   };
   ```
4. Add the import to `src/data/stories/index.js`.
5. `npm run audit-fit` — iterate on the prose until every line shows
   headroom, not just a pass.
6. Never let a slug filename contain non-ASCII characters or come straight
   from a source filename without checking it against the actual title —
   `bu-shang-umbrella`'s source PNG had a Japanese katakana character
   (U+30C8 ト) standing in for 卜 by mistake. `story-slugs.json` exists
   specifically so that kind of error gets caught once, by a human, instead
   of being silently baked into a permanent URL.
