// Catalog filters: All + five thematic buckets. Every story id must appear
// in exactly one bucket.

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
  },
  {
    id: "choice",
    label: { zh: "抉擇", en: "Choice" }
  },
  {
    id: "compassion",
    label: { zh: "慈悲", en: "Compassion" }
  }
];

/** @type {Record<string, "awakening" | "character" | "together" | "choice" | "compassion">} */
const STORY_CATEGORY = {
  // Awakening — insight / sudden seeing
  "angel-of-the-flowers": "awakening",
  "watch-your-step": "awakening",
  fotudeng: "awakening",
  "our-ladys-answer": "awakening",
  "the-bamboo-repays": "awakening",
  "why-the-buddha-did-not-speak": "awakening",
  "zen-master-and-daoist": "awakening",
  "the-sower": "awakening",
  "the-thief-within": "awakening",
  "hungry-ghosts-and-gods": "awakening",
  "jesus-and-the-doorkeeper": "awakening",
  "foolish-donkey": "awakening",
  "fire-of-ignorance": "awakening",
  "what-is-zen": "awakening",
  "two-zen-masters": "awakening",
  "willing-to-face": "awakening",

  // Character — temper, pride, gratitude, inner work
  "fire-in-the-tower": "character",
  "bu-shang-umbrella": "character",
  "the-apple": "character",
  "writer-and-news-vendor": "character",
  "anger-danger-angel": "character",
  "the-bumblebee": "character",
  "respect-for-elders": "character",
  "affection-or-desire": "character",
  listening: "character",
  "ability-and-achievement": "character",
  "who-to-care-for": "character",

  // Together — relationships, community, shared fate
  "four-people-on-an-island": "together",
  "locomotive-and-carriages": "together",
  "two-wheel-drive-or-four": "together",
  "company-at-the-start": "together",
  "warships-facing-inward": "together",
  "shared-fate-bird": "together",
  "whose-fault": "together",

  // Choice — dilemmas, forks, hard decisions
  "which-road-to-choose": "choice",
  "put-yourself-there": "choice",
  "virtue-or-kin": "choice",

  // Compassion — kindness, helping others, generosity
  "a-bowl-of-noodles": "compassion",
  "finding-true-wealth": "compassion",
  "rich-mans-heart": "compassion"
};

export function categoryOf(storyId) {
  return STORY_CATEGORY[storyId] || null;
}

export function storyMatchesCategory(storyId, categoryId) {
  if (!categoryId || categoryId === "all") return true;
  return categoryOf(storyId) === categoryId;
}
