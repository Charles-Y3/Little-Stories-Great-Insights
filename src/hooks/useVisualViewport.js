import { useEffect } from "react";

// On iOS Safari, 100dvh does NOT account for the software keyboard — a
// textarea inside a fixed panel gets pushed under the keyboard. Call this
// only while InsightPanel is mounted. It sets --kb-inset so the panel can
// pad its bottom edge; the panel itself must NOT shrink to --vv-height
// (that + aspect-ratio collapsed it into a tiny floating modal).
export default function useVisualViewport() {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return undefined;
    const root = document.documentElement;

    const update = () => {
      root.style.setProperty(
        "--kb-inset",
        `${Math.max(0, window.innerHeight - vv.height - vv.offsetTop)}px`
      );
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      root.style.removeProperty("--kb-inset");
    };
  }, []);
}
