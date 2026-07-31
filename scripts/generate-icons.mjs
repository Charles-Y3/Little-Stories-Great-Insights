// One-off PWA icon generator: rasterizes a static version of AppLogo.jsx
// (real hex colors, no CSS vars — these are OS launcher icons, not
// re-themed at runtime) into the three sizes vite.config.js's manifest and
// index.html reference. Re-run with `npm run icons` if the mark changes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Same five-petal-flower mark as AppLogo.jsx, light-theme colors baked in.
function flowerSvg({ size, bg, petalScale = 1, includeBg = true }) {
  const cx = size / 2;
  const petalCy = size * 0.297; // matches AppLogo's cy=19 of viewBox 64 (19/64)
  const petalRx = size * (7 / 64) * petalScale;
  const petalRy = size * (12 / 64) * petalScale;
  const centerR = size * (6.5 / 64) * petalScale;

  const petals = [0, 72, 144, 216, 288]
    .map(
      (angle) => `<ellipse cx="${cx}" cy="${petalCy}" rx="${petalRx}" ry="${petalRy}"
        fill="url(#g)" opacity="0.92" transform="rotate(${angle} ${cx} ${cx})" />`
    )
    .join("");

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g" cx="50%" cy="42%" r="65%">
        <stop offset="0%" stop-color="#d1a94e" />
        <stop offset="100%" stop-color="#6b8f5a" />
      </radialGradient>
    </defs>
    ${includeBg ? `<rect width="${size}" height="${size}" fill="${bg}" />` : ""}
    ${petals}
    <circle cx="${cx}" cy="${cx}" r="${centerR}" fill="#a8813a" />
  </svg>`;
}

async function render(name, size, opts) {
  const svg = flowerSvg({ size, ...opts });
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT_DIR, name));
  console.log(`icons: wrote ${name} (${size}x${size})`);
}

await render("icon192.png", 192, { bg: "#f3f1e6" });
await render("icon512.png", 512, { bg: "#f3f1e6" });
// Maskable: OS masks (circle/squircle) can clip up to ~20% from each edge,
// so the mark is shrunk into the safe zone rather than filling the canvas.
await render("iconMaskable512.png", 512, { bg: "#f3f1e6", petalScale: 0.62 });

console.log("\nicons: done.");
