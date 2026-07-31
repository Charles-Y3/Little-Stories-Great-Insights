// Ten stories means no index is worth building — a filter over ten objects
// per keystroke is free, and stays free well past a thousand. This is
// deliberately simpler than the sibling project's search.js, which needed an
// index because it searched 15 works x hundreds of chapters x 3 fields.
const FIELDS = ["title", "tags", "source", "story"];
const FIELD_RANK = { title: 0, tags: 1, source: 2, story: 3 };

// NFKC folds full-width Latin/punctuation (what a Chinese IME often emits)
// onto their ASCII equivalents before lowercasing, so typing full-width
// "Ｚｉｘｉａ" still matches ASCII "zixia" in the data.
function norm(s) {
  return String(s).normalize("NFKC").toLowerCase();
}

function fieldText(story, field, lang) {
  if (field === "tags") return (story.tags?.[lang] || []).join(" ");
  return story[field]?.[lang] || "";
}

/**
 * Returns { story, field, lang, content } for every story that matches,
 * collapsed to the single best-matching field per story: the active
 * reading language wins over the other language, then title > tags >
 * source > story text. Empty query returns every story (field/lang null).
 */
export function searchStories(query, activeLang, stories) {
  const q = norm(query.trim());
  if (!q) return stories.map((story) => ({ story, field: null, lang: activeLang, content: "" }));

  const hits = [];
  for (const story of stories) {
    let best = null;
    for (const field of FIELDS) {
      for (const lang of ["zh", "en"]) {
        const raw = fieldText(story, field, lang);
        if (!raw || !norm(raw).includes(q)) continue;
        const candidate = { story, field, lang, content: raw };
        if (!best) {
          best = candidate;
          continue;
        }
        const bestIsActive = best.lang === activeLang;
        const candIsActive = lang === activeLang;
        if (candIsActive && !bestIsActive) best = candidate;
        else if (candIsActive === bestIsActive && FIELD_RANK[field] < FIELD_RANK[best.field]) best = candidate;
      }
    }
    if (best) hits.push(best);
  }
  return hits;
}

export function makeSnippet(content, query, context = 36) {
  const idx = content.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return content.slice(0, context * 2);
  const start = Math.max(0, idx - context);
  const end = Math.min(content.length, idx + query.length + context);
  let snippet = content.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) snippet = "…" + snippet;
  if (end < content.length) snippet = snippet + "…";
  return snippet;
}
