# Content Review Ledger

Tracks which stories in `src/data/stories/` have been checked against the
original source text in `docs/stories1.docx` / `docs/stories2.docx` (legacy
references to `docs/stories.docx` mean the same corpus), plus their English
adaptation and reflection prompts. **Any story listed below is considered
checked — do not re-check it** unless its `.js` file or the matching source
docx changes. Any story present in `src/data/stories/index.js` but
**missing** from this ledger is new and must go through the check before it
ships. See the project's `CLAUDE.md` for the automatic reminder rule.

## How to check a story

1. **Chinese fidelity** — compare `story.zh` word-for-word against its
   paragraph(s) in the matching source docx. Every word from the source should
   survive unless `node scripts/validate-data.mjs --report` shows the story
   at/near the 16-line no-scroll ceiling (headroom ≤ 1) — only then is
   trimming acceptable, and it must keep the same meaning, arc, and
   punchline. Dropping a bare `（註譯）` marker (an unfilled footnote
   placeholder in the source, not content) is always fine.
2. **English adaptation** — per `docs/AUTHORING.md`, `story.en` is a
   compressed adaptation, not a literal translation. Confirm it still
   carries the same meaning, arc, and punchline as `story.zh`.
3. **Prompts** — confirm each `prompts.zh`/`prompts.en` question logically
   follows from the story, and that the two language versions ask the same
   thing.
4. Record the result below with today's date.

## Status legend

- ✅ **verbatim** — zh matches the source exactly (only punctuation/typo
  normalization or a dropped `（註譯）` marker)
- ✅ **trimmed (justified)** — zh shortened because headroom ≤ 1; meaning,
  arc, and punchline preserved
- ⚠ **adapted (kept, intentional)** — zh diverges from the source because
  the source itself is a spoken transcript, not real narrative prose;
  restructuring into a readable story is an intentional, accepted choice
- 🚫 **unreviewed** — not yet checked

## Ledger

| slug | status | checked | notes |
|---|---|---|---|
| angel-of-the-flowers | ✅ verbatim | 2026-07-31 | Full text preserved, only quote-mark style normalized. |
| watch-your-step | ✅ verbatim | 2026-07-31 | Full text preserved. |
| fire-in-the-tower | ✅ verbatim | 2026-07-31 | Full text preserved; dropped a bare `（註譯）` marker only. |
| which-road-to-choose | ✅ verbatim | 2026-07-31 | Full text preserved. |
| bu-shang-umbrella | ✅ resolved | 2026-07-31 | Restored the dropped reasoning ("if he'd refused it would be awkward; if he'd lent it reluctantly it would leave a grudge") — fits at 13 zh lines, no en change needed. |
| hungry-ghosts-and-gods | ✅ verbatim | 2026-07-31 | Full text preserved; dropped a bare `（註譯）` marker and fixed an OCR typo (平→乎). |
| fotudeng | ✅ verbatim | 2026-07-31 | Exact match. |
| our-ladys-answer | ✅ trimmed (justified) | 2026-07-31 | Headroom 1. Dropped only the parenthetical gloss explaining what "告解" (confession) means — the word itself and full dialogue are kept. |
| the-bamboo-repays | ✅ resolved | 2026-07-31 | Restored all 4 escalating requests (fell / strip leaves / cut branches / hollow joints) as distinct beats, merging the source's 17 short paragraphs into 2 to stay under budget. zh 15 lines, en rewritten to match, both verified no overflow in browser. |
| why-the-buddha-did-not-speak | ✅ verbatim | 2026-07-31 | Full content preserved; a few synonym-level word swaps (適來→適才, 還→仍) that don't drop any content. |
| zen-master-and-daoist | ✅ resolved | 2026-07-31 | Restored the "呼風喚雨，風馳電掣" imagery, both rounds of dialogue, and the full quadruple description (有限有盡有量有邊 / 無限無盡無量無邊). zh 14 lines, en rewritten to match. |
| the-sower | ✅ verbatim | 2026-07-31 | Exact match; fixed an OCR typo (撤種→撒種). |
| the-thief-within | ✅ resolved | 2026-07-31 | Restored the master's name (利蹤禪師) and the authentic closing verse ("三十年來西子湖…") in place of the invented ending. zh 9 lines, en re-translated to carry the verse's meaning. |
| the-apple | ✅ resolved | 2026-07-31 | Restored the source's single-narrator, 3-progressively-deeper-levels structure and the correct third level (finish what's left with an unattached, grateful heart, not "give the whole apple away"). Also updated the 3rd zh/en prompt, which referenced the old "give it all away" scenario. |
| writer-and-news-vendor | ✅ resolved | 2026-07-31 | Restored the opening beat (friend says "thank you" first) and, notably, the correct role attribution — the source has the *friend* act politely and deliver the "why let him decide my behavior" line, observed by the writer; the previous version had swapped these roles. |
| anger-danger-angel | ⚠ adapted (kept, intentional) | 2026-07-31 | Source is a spoken dharma-talk transcript with audience call-and-response ("聽懂嗎？（懂）"); kept as adapted prose per user's decision. No change. |
| four-people-on-an-island | ✅ resolved | 2026-07-31 | zh field now uses the source's Chinese names (每個人/某個人/其他人/沒有人) instead of the English loanwords. en field keeps Everybody/Somebody/Anybody/Nobody (the standard English form of this parable) and follows the source's actual blame-chain logic. |
| the-bumblebee | ✅ resolved | 2026-07-31 | Restored the source's closing teaching ("what makes you foolish isn't knowing too little — it's knowing too much") and the biologist+physicist+behaviorist framing. zh 16 lines / en 15 lines, verified no overflow. |
| locomotive-and-carriages | ⚠ adapted (kept, intentional) | 2026-07-31 | Source is terse spoken-transcript style with no real prose narrative to restore; per user's decision, kept as adapted parable prose. No change. |
| two-wheel-drive-or-four | ⚠ adapted (kept, intentional) | 2026-07-31 | Same as above — source is fragmented spoken address ("那你們這台車叫做…"); kept as adapted prose per user's decision. No change. |
| company-at-the-start | ✅ resolved | 2026-07-31 | Removed invented specifics not in the source ("instant noodles," "sleeping in the office") and restored the source's actual reasoning (loss of cohesion because no one thinks of "the company's overall interest" anymore; fewer people are easier to guide and educate). |
| warships-facing-inward | ✅ resolved | 2026-07-31 | Restored the deception narrative (merchant ships borrow harbor space, overstay, then reveal war flags and attack) instead of the one-sentence summary. zh 11 lines / en 16 lines, verified no overflow. |
| a-bowl-of-noodles | ✅ resolved | 2026-07-31 | Removed invented details ("slept under a bridge," "dizzy from hunger") and restored the source's actual insight line — "a stranger's smallest kindness earns endless gratitude, but years of family care go unnoticed" — in place of the flattened version. |
| respect-for-elders | ✅ resolved | 2026-07-31 | Restored the named historical reference (管仲與晏嬰) as the story's illustration instead of an unnamed generic court. |
| finding-true-wealth | ✅ trimmed (justified) | 2026-07-31 | Headroom 3. Condensed prose, but every narrative beat (angel, desert map, journey, stone/box/note messages) is preserved. |
| jesus-and-the-doorkeeper | ✅ trimmed (justified) | 2026-07-31 | Headroom 1. Condensed prose, but every narrative beat is preserved intact. |
| affection-or-desire | ⚠ adapted (kept, intentional) | 2026-07-31 | Source addresses "you" directly in second person; kept the 甲/乙 restructuring per user's decision (same category as the other transcript-style talks). No change. |
| listening | ⚠ adapted (kept, intentional) | 2026-07-31 | Same restructuring as above (second-person address → 甲/乙); kept per user's decision. No change. |
| ability-and-achievement | ✅ verbatim | 2026-07-31 | Close paraphrase of source, same 甲/乙 framing already used in source; no content dropped. |
| foolish-donkey | ✅ trimmed (justified) | 2026-08-02 | Source: stories2.docx. Headroom forced a cut; meaning, arc, and closing question preserved. Fixed 自已→自己; quote marks normalized. |
| who-to-care-for | ✅ verbatim | 2026-08-02 | Source: stories2.docx. Full text preserved; quote marks normalized. |
| fire-of-ignorance | ✅ verbatim | 2026-08-02 | Source: stories2.docx. Full text preserved; quote marks normalized; dropped a stray trailing quote. |
| whose-fault | ✅ trimmed (justified) | 2026-08-02 | Source: stories2.docx. Condensed spoken-length setup while keeping worm → blame pile-on → cook's suicide → temple ruin arc. |
| what-is-zen | ✅ verbatim | 2026-08-02 | Source: stories2.docx. Full text preserved; 襌→禪; quote marks normalized. |
| shared-fate-bird | ✅ verbatim | 2026-08-02 | Source: stories2.docx. Full text preserved. |
| willing-to-face | ✅ trimmed (justified) | 2026-08-02 | Source: stories2.docx. Long source; kept hypnotist/patient, refusal to face, prior-life injury, release, and "願意面對" punchline. |
| put-yourself-there | ✅ verbatim | 2026-08-02 | Source: stories2.docx (設身處地1). Open dilemma kept intact; quote marks normalized. |
| virtue-or-kin | ✅ verbatim | 2026-08-02 | Source: stories2.docx (設身處地2). Title renamed 節孝難兩全 / Virtue or Kin; full dilemma text preserved; quote marks normalized. |
| two-zen-masters | ✅ trimmed (justified) | 2026-08-02 | Source: stories2.docx. Condensed snake vision + dream correspondence; punchline beats preserved. |
| rich-mans-heart | ✅ trimmed (justified) | 2026-08-02 | Source: stories2.docx. Headroom 0; eaves → ingratitude → giving the whole house arc preserved. |

## Resolution (2026-07-31)

User decision: restore full source wording wherever the line budget
allows; keep the spoken dharma-talk-transcript stories (anger-danger-angel,
locomotive-and-carriages, two-wheel-drive-or-four, affection-or-desire,
listening) as adapted prose since their raw source isn't real narrative.
12 stories were rewritten accordingly (marked ✅ resolved above), all
re-verified against `node scripts/validate-data.mjs` (0 errors) and in a
running dev server (no card-back overflow in zh or en for any of them).

## English adaptations & prompts

Spot-checked across all 29 stories: every `story.en` carries the same arc
and punchline as its `story.zh`, and every prompt in `prompts.zh`/`prompts.en`
logically follows from its story and matches across languages. No fixes
needed here as of this review.
