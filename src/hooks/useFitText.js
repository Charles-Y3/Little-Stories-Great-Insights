import { useLayoutEffect } from "react";

// Bounded auto-fit for the card's story pane: CSS clamp() sets the hard
// 15-18px bound (see StoryCardBack.module.css --fit-scale usage), and this
// hook finds the largest of four fixed steps that makes the text fit without
// overflowing its pane. Modeled on the single-pass measured fit in the
// sibling project's Home.jsx (~line 98) — deliberately a direct measure-then-
// pick, not an iterative shrink-and-remeasure loop, so it can't oscillate.
const STEPS = [1, 0.94, 0.88, 0.82];

export default function useFitText(paneRef, textRef, deps = []) {
  useLayoutEffect(() => {
    const pane = paneRef.current;
    const text = textRef.current;
    if (!pane || !text) return undefined;
    let cancelled = false;

    const fit = () => {
      for (let i = 0; i < STEPS.length; i++) {
        text.style.setProperty("--fit-scale", String(STEPS[i]));
        if (text.scrollHeight <= pane.clientHeight) return i;
      }
      return STEPS.length - 1;
    };

    const run = () => {
      if (cancelled) return;
      const stepIndex = fit();
      const overflowing = text.scrollHeight > pane.clientHeight;
      // The overflow escape hatch must apply in production too — a story
      // that slips past the build-time validator (or a device whose fonts
      // render wider than the design floor assumed) is exactly the case
      // this exists for. Only the diagnostic log is dev-only.
      if (stepIndex === STEPS.length - 1 && overflowing) {
        if (import.meta.env.DEV) {
          console.error(
            "[useFitText] story overflows its pane even at the smallest fit step — the no-scroll validator should have caught this before it shipped."
          );
        }
        // Let this one pane scroll, and stop reading taps inside it as a
        // flip gesture (a scroll attempt must never be swallowed as "flip
        // the card back to front").
        pane.dataset.overflow = "true";
        pane.dataset.noFlip = "true";
      } else {
        delete pane.dataset.overflow;
        delete pane.dataset.noFlip;
      }
    };

    // document.fonts.ready resolving does not guarantee the browser has
    // already committed the reflow that follows a font swap — a display
    // font finishing late can still grow the title and shrink the pane
    // after that promise fires. Re-measure once more, two frames later,
    // once layout has actually settled.
    const runAfterLayoutSettles = () => {
      run();
      requestAnimationFrame(() => requestAnimationFrame(run));
    };

    if (document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(runAfterLayoutSettles);
    } else {
      runAfterLayoutSettles();
    }

    const ro = new ResizeObserver(run);
    ro.observe(pane);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
