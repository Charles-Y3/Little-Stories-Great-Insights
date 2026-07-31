import { useEffect } from "react";

// On iOS Safari, 100dvh does NOT account for the software keyboard — a
// textarea inside a position:fixed full-height panel gets pushed under the
// keyboard with no way to reach it. This is the number-one bug in "no
// scrolling + textarea" layouts, which is exactly InsightPanel's shape.
// Call this only while such a panel is mounted (not globally) — it drives
// --vv-height / --kb-inset, which the panel uses to cap its own height and
// pad its bottom edge above the keyboard.
export default function useVisualViewport() {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return undefined;
    const root = document.documentElement;

    const update = () => {
      root.style.setProperty("--vv-height", `${vv.height}px`);
      root.style.setProperty("--kb-inset", `${Math.max(0, window.innerHeight - vv.height - vv.offsetTop)}px`);
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      root.style.removeProperty("--vv-height");
      root.style.removeProperty("--kb-inset");
    };
  }, []);
}
