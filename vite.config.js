import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["robots.txt"],
      manifest: {
        name: "Little Stories Great Insights 小故事大啟發",
        short_name: "Little Stories",
        description: "A bilingual card deck of short parables, with room to write your own insight.",
        start_url: "/",
        display: "standalone",
        background_color: "#f3f1e6",
        theme_color: "#4f7042",
        icons: [
          { src: "/icons/icon192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icons/iconMaskable512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        // NOTE: "webp" is required here — the story artwork ships as WebP.
        // A sibling project (words-of-sages) omitted it and silently missed
        // precaching every content image. Don't repeat that.
        globPatterns: ["**/*.{js,css,html,png,webp,ico,svg,woff,woff2}"],
        // Story art can run a few hundred KB; default cap is 2 MiB per file,
        // which comfortably covers our ~200-300 KB @1200w exports, but raise
        // it slightly for headroom if a future story's art runs larger.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "font",
            handler: "CacheFirst",
            options: {
              cacheName: "lsgi-fonts",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ]
});
