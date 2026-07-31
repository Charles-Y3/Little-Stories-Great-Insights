// Validates src/data/stories/index.js against the no-scroll card budget.
//
// The card back has a fixed height (aspect-ratio 768/1376, no scrolling by
// design — see docs/AUTHORING.md). A story that's too long doesn't get caught
// by a runtime layout bug; it gets caught here, at authoring time, as a build
// error naming the field, the overage in lines, and the worst paragraph.
//
// Run with:
//   node scripts/validate-data.mjs            strict — exits 1 on any error
//   node scripts/validate-data.mjs --report    prints the headroom table, exits 0
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storiesPath = path.join(__dirname, "../src/data/stories/index.js");

const reportMode = process.argv.includes("--report");

let storiesModule;
try {
  storiesModule = await import("file://" + storiesPath.replace(/\\/g, "/"));
} catch (err) {
  console.error(`validate-data: could not load src/data/stories/index.js\n${err.message}`);
  process.exit(1);
}
const stories = storiesModule.default;

// -- line-budget model -------------------------------------------------
// Derived in the plan from a 360x640 phone: the card's story pane is
// ~300x430px at the design floor. At 16px / 1.65 line-height that's ~16
// lines. 300px / ~16px per CJK glyph ~= 18 chars/line; Latin at ~7.1px
// average advance ~= 42 chars/line.
const CPL = { zh: 18, en: 42 };
const MAX_LINES = 16;
const WARN_LINES = 14;

const CJK_RE = /[一-鿿]/g;
const KANA_RE = /[぀-ヿ]/; // hiragana + katakana — a lookalike-substitution bug in zh text

function countUnits(paragraph, lang) {
  if (lang === "zh") {
    const m = paragraph.match(CJK_RE);
    return m ? m.length : 0;
  }
  return paragraph.length;
}

function paragraphs(text) {
  return String(text)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function estimateLines(text, lang) {
  let total = 0;
  let worst = null;
  for (const p of paragraphs(text)) {
    const units = countUnits(p, lang);
    const lines = Math.max(1, Math.ceil(units / CPL[lang]));
    total += lines;
    if (!worst || units > worst.units) worst = { text: p, units, lines };
  }
  return { total, worst };
}

function rawCjkCount(text) {
  const m = String(text).match(CJK_RE);
  return m ? m.length : 0;
}

// -- per-story checks -----------------------------------------------------

let errors = 0;
let warnings = 0;
const report = [];

function fail(slug, msg) {
  console.error(`[${slug}] ${msg}`);
  errors++;
}
function warn(slug, msg) {
  console.warn(`[${slug}] WARN: ${msg}`);
  warnings++;
}

for (const story of stories) {
  const slug = story.id;
  const row = { slug };

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    fail(slug || "(missing id)", `invalid id/slug "${slug}"`);
  }

  // -- titles --
  for (const lang of ["zh", "en"]) {
    const t = story.title?.[lang];
    if (!t || !t.trim()) fail(slug, `missing title.${lang}`);
    else if (lang === "zh" && t.length > 12) fail(slug, `title.zh "${t}" is ${t.length} chars, max 12`);
    else if (lang === "en" && t.length > 40) fail(slug, `title.en "${t}" is ${t.length} chars, max 40`);
    if (t && KANA_RE.test(t)) fail(slug, `title.${lang} "${t}" contains kana (U+3040-U+30FF) — likely a lookalike-character bug, not intentional Japanese text`);
  }

  // -- story text: the no-scroll gate --
  for (const lang of ["zh", "en"]) {
    const text = story.story?.[lang];
    if (!text || !text.trim()) {
      fail(slug, `missing story.${lang}`);
      continue;
    }
    if (lang === "zh" && KANA_RE.test(text)) {
      fail(slug, `story.zh contains kana (U+3040-U+30FF) — check for a lookalike-character bug`);
    }

    const floorUnits = lang === "zh" ? 40 : 200;
    const units = countUnits(text.replace(/\n+/g, ""), lang);
    if (units < floorUnits) {
      fail(slug, `story.${lang} is only ${units} ${lang === "zh" ? "CJK chars" : "chars"} — looks like a stub (floor: ${floorUnits})`);
    }

    const { total: lines, worst } = estimateLines(text, lang);
    row[`${lang}Lines`] = lines;

    if (lang === "zh" && rawCjkCount(text) > 360) {
      fail(slug, `story.zh is ${rawCjkCount(text)} raw CJK chars, over the 360-char ceiling regardless of line estimate`);
    }
    if (lang === "en" && text.length > 900) {
      fail(slug, `story.en is ${text.length} chars, over the 900-char ceiling`);
    }
    if (lang === "en" && text.trim().split(/\s+/).length > 160) {
      fail(slug, `story.en is ${text.trim().split(/\s+/).length} words, over the 160-word ceiling`);
    }

    if (lines > MAX_LINES) {
      const cutUnits = (lines - MAX_LINES) * CPL[lang];
      fail(
        slug,
        `story.${lang} ≈ ${lines} lines, max ${MAX_LINES}.\n` +
          `    Cut ~${cutUnits} ${lang === "zh" ? "characters" : "characters"} (${lines - MAX_LINES} lines).\n` +
          `    Longest paragraph (${worst.units} ${lang === "zh" ? "chars" : "chars"}, ${worst.lines} lines): "${worst.text.slice(0, 60)}${worst.text.length > 60 ? "…" : ""}"`
      );
    } else if (lines > WARN_LINES) {
      warn(slug, `story.${lang} ≈ ${lines} lines (max ${MAX_LINES}, ${MAX_LINES - lines} headroom)`);
    }
  }

  // -- prompts --
  for (const lang of ["zh", "en"]) {
    const list = story.prompts?.[lang];
    if (!Array.isArray(list) || list.length < 2 || list.length > 4) {
      fail(slug, `prompts.${lang} must have 2-4 entries, has ${Array.isArray(list) ? list.length : 0}`);
    } else {
      for (const p of list) {
        const units = countUnits(p, lang);
        const limit = lang === "zh" ? 40 : 140;
        if (units > limit) fail(slug, `prompts.${lang} entry exceeds ${limit} ${lang === "zh" ? "chars" : "chars"}: "${p}"`);
        if (lang === "zh" && KANA_RE.test(p)) fail(slug, `prompts.zh entry contains kana: "${p}"`);
      }
    }
  }

  // -- tags (optional, but bounded if present) --
  for (const lang of ["zh", "en"]) {
    const tags = story.tags?.[lang];
    if (tags && tags.length > 5) fail(slug, `tags.${lang} has ${tags.length} entries, max 5`);
  }

  // -- image --
  if (!story.image || !story.image.full) {
    fail(slug, `missing image manifest data — run "npm run images" and check scripts/story-slugs.json`);
  }

  report.push(row);
}

// -- ids must be present and unique --
const seen = new Set();
for (const s of stories) {
  if (seen.has(s.id)) fail(s.id, `duplicate story id`);
  seen.add(s.id);
}

// -- headroom table --
if (reportMode || warnings > 0 || errors === 0) {
  console.log("\nslug".padEnd(32) + "zh lines".padStart(10) + "en lines".padStart(10) + "  headroom");
  for (const row of report) {
    const zh = row.zhLines ?? "?";
    const en = row.enLines ?? "?";
    const worstLines = Math.max(row.zhLines ?? 0, row.enLines ?? 0);
    const headroom = MAX_LINES - worstLines;
    const flag = headroom < 0 ? " ⚠ over" : headroom <= 1 ? " ⚠ tight" : "";
    console.log(
      row.slug.padEnd(32) + String(zh).padStart(10) + String(en).padStart(10) + `  ${headroom}${flag}`
    );
  }
}

if (errors > 0) {
  console.error(`\nvalidate-data: ${errors} error(s), ${warnings} warning(s).`);
  if (!reportMode) process.exit(1);
} else {
  console.log(`\nvalidate-data: all good (${stories.length} stories checked, ${warnings} warning(s)).`);
}
