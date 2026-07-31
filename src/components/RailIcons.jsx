import React from "react";

// Stroke icons for the card toolbar — drawn as SVG so Chinese/English font
// stacks never swap the home (or other) glyph for a lookalike character.
const svgProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false"
};

export function HomeIcon() {
  return (
    <svg {...svgProps}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 9.5V20h11V9.5" />
    </svg>
  );
}

export function InsightIcon() {
  return (
    <svg {...svgProps}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.8c.6.45 1 1.05 1.15 1.7h4.7c.15-.65.55-1.25 1.15-1.7A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg {...svgProps} fill="currentColor" stroke="none">
      <path d="M8 5.5v13l11-6.5Z" />
    </svg>
  );
}

export function StopIcon() {
  return (
    <svg {...svgProps} fill="currentColor" stroke="none">
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.2" />
    </svg>
  );
}

export function BackIcon() {
  return (
    <svg {...svgProps}>
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}
