import { useRef } from "react";

// Distinguishes "the user tapped this surface to flip the card" from a drag,
// a scroll-intent gesture, a long-press, or releasing after selecting text.
// Modeled on the ref-based pointer tracking in the sibling project's
// useSwipe.js. A raw onClick fires after all of those too, which is exactly
// why "tap anywhere to flip" needs a guard, not a plain click handler.
export default function useTapAway(onTapAway, { moveThreshold = 10, durationThreshold = 400 } = {}) {
  const start = useRef(null);

  const onPointerDown = (e) => {
    start.current = {
      x: e.clientX,
      y: e.clientY,
      t: Date.now(),
      pointerType: e.pointerType
    };
  };

  const onPointerUp = (e) => {
    const s = start.current;
    start.current = null;
    if (!s) return;

    if (e.target.closest("[data-no-flip]")) return;

    const dx = Math.abs(e.clientX - s.x);
    const dy = Math.abs(e.clientY - s.y);
    if (dx > moveThreshold || dy > moveThreshold) return;

    if (Date.now() - s.t > durationThreshold) return;

    const selection = window.getSelection?.();
    if (selection && selection.toString().trim()) return;

    onTapAway(e);
  };

  return { onPointerDown, onPointerUp };
}
