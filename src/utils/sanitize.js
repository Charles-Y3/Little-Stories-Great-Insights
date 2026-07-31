// Tiny allowlist sanitizer, kept in reserve for any future data field that
// needs inline emphasis via dangerouslySetInnerHTML. No story field uses HTML
// in v1 (story/prompts/source are all plain text), so nothing calls this yet —
// but if one ever does, route it through here rather than rendering raw.
const ALLOWED_TAGS = new Set(["br", "b", "strong", "em", "i"]);

export function sanitizeHtml(html) {
  if (!html) return "";
  return html.replace(/<\/?([a-zA-Z0-9]+)[^>]*>/g, (match, tag) => {
    const lower = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lower)) return "";
    if (lower === "br") return "<br />";
    return match.startsWith("</") ? `</${lower}>` : `<${lower}>`;
  });
}
