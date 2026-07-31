// Image pipeline for story artwork.
//
// Two modes:
//   node scripts/build-images.mjs            full generation (needs sharp)
//   node scripts/build-images.mjs --check     verify committed outputs only
//
// The --check mode deliberately never imports sharp (see the dynamic import
// below, gated behind `!checking`). Vercel's build runs --check via
// predev/prebuild and must succeed even if sharp's native binary isn't
// available in that environment — the actual generation is a local/manual
// step (`npm run images`) whose committed output (public/story-images/ +
// src/data/imageManifest.js) is what ships.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ASSETS_SRC = path.join(ROOT, "assets-src");
const OUT_DIR = path.join(ROOT, "public", "story-images");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "imageManifest.js");
const SLUGS_PATH = path.join(__dirname, "story-slugs.json");

const checking = process.argv.includes("--check");

// -- shared: load + validate the slug table -------------------------------

function loadSlugTable() {
  if (!fs.existsSync(SLUGS_PATH)) {
    console.error(`build-images: missing ${path.relative(ROOT, SLUGS_PATH)}`);
    process.exit(1);
  }
  /** @type {Array<{file:string, slug:string, titleZh:string}>} */
  const table = JSON.parse(fs.readFileSync(SLUGS_PATH, "utf8"));

  let errors = 0;
  const seenSlugs = new Set();
  const slugPattern = /^[a-z0-9-]+$/;

  for (const entry of table) {
    if (!slugPattern.test(entry.slug)) {
      console.error(`[story-slugs] "${entry.slug}" is not a valid slug (must match ${slugPattern})`);
      errors++;
    }
    if (seenSlugs.has(entry.slug)) {
      console.error(`[story-slugs] duplicate slug "${entry.slug}"`);
      errors++;
    }
    seenSlugs.add(entry.slug);

    const srcPath = path.join(ASSETS_SRC, entry.file);
    if (!fs.existsSync(srcPath)) {
      console.error(`[story-slugs] "${entry.file}" listed for slug "${entry.slug}" but not found in assets-src/`);
      errors++;
    }
  }

  // Bijection, other direction: every PNG on disk must be claimed by the table.
  const filesOnDisk = fs.existsSync(ASSETS_SRC)
    ? fs.readdirSync(ASSETS_SRC).filter((f) => f.toLowerCase().endsWith(".png"))
    : [];
  const claimed = new Set(table.map((e) => e.file));
  for (const file of filesOnDisk) {
    if (!claimed.has(file)) {
      console.error(`[story-slugs] assets-src/${file} exists but is not listed in story-slugs.json`);
      errors++;
    }
  }

  if (errors > 0) {
    console.error(`\nbuild-images: ${errors} error(s) in story-slugs.json / assets-src/.`);
    process.exit(1);
  }

  return table;
}

// -- --check mode: pure fs verification, no sharp --------------------------

function runCheck(table) {
  let errors = 0;
  const manifestExists = fs.existsSync(MANIFEST_PATH);
  if (!manifestExists) {
    console.error(`build-images --check: missing ${path.relative(ROOT, MANIFEST_PATH)} — run "npm run images" locally and commit the result.`);
    errors++;
  }

  let manifestSlugs = new Set();
  if (manifestExists) {
    const src = fs.readFileSync(MANIFEST_PATH, "utf8");
    // Cheap slug extraction without executing the module (this file must stay
    // sharp-free and side-effect-free): manifest keys are quoted at the start
    // of a line by construction (see writeManifest below).
    for (const m of src.matchAll(/^\s*"([a-z0-9-]+)":\s*\{/gm)) manifestSlugs.add(m[1]);
  }

  for (const entry of table) {
    if (manifestExists && !manifestSlugs.has(entry.slug)) {
      console.error(`[${entry.slug}] missing from imageManifest.js`);
      errors++;
    }
    for (const suffix of ["-1200.webp", "-600.webp"]) {
      const p = path.join(OUT_DIR, `${entry.slug}${suffix}`);
      if (!fs.existsSync(p)) {
        console.error(`[${entry.slug}] missing public/story-images/${entry.slug}${suffix} — run "npm run images"`);
        errors++;
      }
    }
  }

  if (errors > 0) {
    console.error(`\nbuild-images --check: ${errors} error(s). Run "npm run images" locally, then commit public/story-images/ and src/data/imageManifest.js.`);
    process.exit(1);
  }
  console.log(`build-images --check: OK (${table.length} stories).`);
}

// -- full generation mode: sharp -------------------------------------------

// WCAG relative luminance + contrast ratio, used to guarantee every
// generated tint stays readable against that theme's ink colour. Extracting
// a "dominant" colour from a soft watercolour image and using it unvetted is
// what makes a card back look untinted (near-white on near-white) — this is
// the guardrail against that, not a decoration.
function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}
function relLuminance([r, g, b]) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}
function contrastRatio(rgbA, rgbB) {
  const lA = relLuminance(rgbA);
  const lB = relLuminance(rgbB);
  const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA];
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = 60 * (((g - b) / d) % 6); break;
      case g: h = 60 * ((b - r) / d + 2); break;
      case b: h = 60 * ((r - g) / d + 4); break;
    }
    if (h < 0) h += 360;
  }
  return [h, s, l];
}

function hslToRgb([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255].map((v) => Math.round(Math.max(0, Math.min(255, v))));
}

function toHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

// Ink colours pulled from src/styles/tokens.css — kept in sync manually
// (there are only three, and they change rarely enough that generating this
// from CSS isn't worth the added coupling).
const INK = {
  light: [0x2e, 0x36, 0x24], // --color-ink (light theme)
  dark: [0xe4, 0xe8, 0xd6],  // --color-ink (dark theme)
  sepia: [0x3a, 0x34, 0x20]  // --color-ink (sepia theme)
};

// Target lightness bands per theme, and which direction along L increases
// contrast against that theme's ink (light/sepia bg + dark ink -> lighter is
// more contrast; dark bg + light ink -> darker is more contrast).
const BANDS = {
  light: { min: 0.86, max: 0.94, walkTowardMax: true, ink: INK.light },
  dark: { min: 0.08, max: 0.18, walkTowardMax: false, ink: INK.dark },
  sepia: { min: 0.72, max: 0.82, walkTowardMax: true, ink: INK.sepia }
};

function fitTintToBand(hsl, band) {
  let [h, s, l] = hsl;
  s = Math.min(s, 0.35);
  l = Math.max(band.min, Math.min(band.max, l));

  const step = 0.02;
  let guard = 0;
  while (contrastRatio(hslToRgb([h, s, l]), band.ink) < 4.5 && guard < 40) {
    l += band.walkTowardMax ? step : -step;
    if (l > band.max || l < band.min) break;
    guard++;
  }
  return [h, s, l];
}

async function generateForStory(sharpLib, entry) {
  const srcPath = path.join(ASSETS_SRC, entry.file);
  const src = sharpLib(srcPath);
  const meta = await src.metadata();
  const aspect = `${meta.width} / ${meta.height}`;

  const full1200 = await sharpLib(srcPath)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });
  fs.writeFileSync(path.join(OUT_DIR, `${entry.slug}-1200.webp`), full1200.data);

  const thumb600 = await sharpLib(srcPath).resize({ width: 600 }).webp({ quality: 72 }).toBuffer();
  fs.writeFileSync(path.join(OUT_DIR, `${entry.slug}-600.webp`), thumb600);

  const lqipBuf = await sharpLib(srcPath).resize(20).webp({ quality: 40 }).toBuffer();
  if (lqipBuf.length > 1200) {
    throw new Error(`[${entry.slug}] LQIP is ${lqipBuf.length} bytes, expected <1200 — lower quality or check source image.`);
  }
  const lqip = `data:image/webp;base64,${lqipBuf.toString("base64")}`;

  // Tint: blend a true 1x1 average (accurate on soft/gradient art) with
  // sharp's dominant-colour stat (adds hue character a flat average can lose)
  // — see the header comment for why raw `stats().dominant` alone is wrong
  // for watercolour art (it skews near-white / indistinguishable from bg).
  const avgPixel = await sharpLib(srcPath).resize(1, 1, { fit: "cover" }).raw().toBuffer();
  const avgRgb = [avgPixel[0], avgPixel[1], avgPixel[2]];
  const stats = await sharpLib(srcPath).stats();
  const domRgb = [stats.dominant.r, stats.dominant.g, stats.dominant.b];
  const blended = avgRgb.map((v, i) => Math.round(v * 0.5 + domRgb[i] * 0.5));
  const baseHsl = rgbToHsl(blended);

  const colorLight = toHex(hslToRgb(fitTintToBand(baseHsl, BANDS.light)));
  const colorDark = toHex(hslToRgb(fitTintToBand(baseHsl, BANDS.dark)));
  const colorSepia = toHex(hslToRgb(fitTintToBand(baseHsl, BANDS.sepia)));
  const colorAccent = toHex(blended);

  return {
    slug: entry.slug,
    full: `/story-images/${entry.slug}-1200.webp`,
    thumb: `/story-images/${entry.slug}-600.webp`,
    lqip,
    width: full1200.info.width,
    height: full1200.info.height,
    aspect,
    colorLight,
    colorDark,
    colorSepia,
    colorAccent
  };
}

function writeManifest(entries) {
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  const lines = [];
  lines.push("// GENERATED by scripts/build-images.mjs — do not edit by hand.");
  lines.push("// Re-run `npm run images` after changing assets-src/ or scripts/story-slugs.json,");
  lines.push("// then commit this file together with public/story-images/.");
  lines.push("const IMAGES = {");
  for (const e of entries.sort((a, b) => a.slug.localeCompare(b.slug))) {
    lines.push(`  "${e.slug}": {`);
    lines.push(`    full: ${JSON.stringify(e.full)},`);
    lines.push(`    thumb: ${JSON.stringify(e.thumb)},`);
    lines.push(`    lqip: ${JSON.stringify(e.lqip)},`);
    lines.push(`    width: ${e.width},`);
    lines.push(`    height: ${e.height},`);
    lines.push(`    aspect: ${JSON.stringify(e.aspect)},`);
    lines.push(`    colorLight: ${JSON.stringify(e.colorLight)},`);
    lines.push(`    colorDark: ${JSON.stringify(e.colorDark)},`);
    lines.push(`    colorSepia: ${JSON.stringify(e.colorSepia)},`);
    lines.push(`    colorAccent: ${JSON.stringify(e.colorAccent)}`);
    lines.push(`  },`);
  }
  lines.push("};");
  lines.push("");
  lines.push("export default IMAGES;");
  lines.push("");
  fs.writeFileSync(MANIFEST_PATH, lines.join("\n"));
}

async function runGenerate(table) {
  const { default: sharpLib } = await import("sharp");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const entries = [];
  for (const entry of table) {
    process.stdout.write(`[${entry.slug}] generating... `);
    const result = await generateForStory(sharpLib, entry);
    entries.push(result);
    console.log(`OK (${result.width}x${result.height}, tint ${result.colorLight}/${result.colorDark}/${result.colorSepia})`);
  }

  writeManifest(entries);
  console.log(`\nbuild-images: wrote ${entries.length} stories to public/story-images/ and src/data/imageManifest.js`);
}

// -- entry -------------------------------------------------------------

const table = loadSlugTable();
if (checking) {
  runCheck(table);
} else {
  await runGenerate(table);
}
