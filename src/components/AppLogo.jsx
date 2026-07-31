import React, { useId } from "react";

// Procedural mark (five-petal flower over a leaf) instead of a raster asset —
// there is no logo image in this project, and drawing it in SVG means it
// re-themes for free via CSS var() fills, like TraditionEmblem in the sibling
// project. useId() namespaces the gradient so multiple logos on one page
// (e.g. HeaderHomeLink + a settings popover) never collide.
export default function AppLogo({ size = 42 }) {
  const uid = useId();
  const gradId = `lsgi-logo-grad-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Little Stories Great Insights"
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="var(--color-surface-alt)" stroke="var(--color-border)" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="32"
          cy="19"
          rx="7"
          ry="12"
          fill={`url(#${gradId})`}
          opacity="0.92"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="6.5" fill="var(--color-gold-strong)" />
    </svg>
  );
}
