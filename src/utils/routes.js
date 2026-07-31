// All story URL construction lives here — the unitLabel.js lesson from the
// sibling project (centralize i18n/URL grammar in one module) carried over.
export function storyHref(slug) {
  return `/stories/${encodeURIComponent(slug)}`;
}

export function storiesHref(q) {
  return q ? `/stories?q=${encodeURIComponent(q)}` : "/stories";
}
