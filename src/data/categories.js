// Catalog filters: All + three thematic buckets. Every story id must appear
// in exactly one bucket (validate with CATEGORY_IDS / storyCoverage).

export const CATEGORIES = [
  {
    id: "all",
    label: { zh: "全部", en: "All" }
  },
  {
    id: "awakening",
    label: { zh: "覺醒", en: "Awakening" }
  },
  {
    id: "character",
    label: { zh: "修心", en: "Character" }
  },
  {
    id: "together",
    label: { zh: "同行", en: "Together" }
  }
];

/** @type {Record<string, "awakening" | "character" | "together">} */
const STORY_CATEGORY = {
  "angel-of-the-flowers": "awakening",
  "watch-your-step": "awakening",
  "which-road-to-choose": "awakening",
  fotudeng: "awakening",
  "our-ladys-answer": "awakening",
  "the-bamboo-repays": "awakening",
  "why-the-buddha-did-not-speak": "awakening",
  "zen-master-and-daoist": "awakening",
  "the-sower": "awakening",
  "the-thief-within": "awakening",
  "hungry-ghosts-and-gods": "awakening",
  "finding-true-wealth": "awakening",
  "jesus-and-the-doorkeeper": "awakening",

  "fire-in-the-tower": "character",
  "bu-shang-umbrella": "character",
  "the-apple": "character",
  "writer-and-news-vendor": "character",
  "anger-danger-angel": "character",
  "the-bumblebee": "character",
  "a-bowl-of-noodles": "character",
  "respect-for-elders": "character",
  "affection-or-desire": "character",
  listening: "character",
  "ability-and-achievement": "character",

  "four-people-on-an-island": "together",
  "locomotive-and-carriages": "together",
  "two-wheel-drive-or-four": "together",
  "company-at-the-start": "together",
  "warships-facing-inward": "together"
};

export function categoryOf(storyId) {
  return STORY_CATEGORY[storyId] || null;
}

export function storyMatchesCategory(storyId, categoryId) {
  if (!categoryId || categoryId === "all") return true;
  return categoryOf(storyId) === categoryId;
}
