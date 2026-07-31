// The Chinese text below is a TRIMMED adaptation of the source pasted by the
// user (2026-07-31) — the original ran ~246 CJK chars as one unbroken
// paragraph, estimating to ~15 rendered lines with zero headroom against the
// card's 16-line no-scroll ceiling. Per the user's decision (plan §3), the
// author (me) tightened the prose to the same story and ending, ~157 CJK
// chars across three natural paragraph breaks. Flagged for the user's review
// before this ships as final content — see the conversation for the original.
export default {
  id: "bu-shang-umbrella",
  order: 5,
  title: { zh: "卜商有傘", en: "Bu Shang's Umbrella" },
  source: { zh: "孔門故事", en: "A story of Confucius and his disciples" },
  tags: { zh: ["體諒", "為師之道"], en: ["consideration", "teaching"] },

  story: {
    zh: `孔夫子有一天出遊，帶著眾多學生，途中忽然下起雨來，大家都沒有準備雨具。
有學生說：「卜商有傘。」卜商也是他的學生之一。孔夫子聽了，卻沒有去向他借。
原來孔夫子知道卜商生性吝嗇，捨不得財物。若當眾向他借傘，卜商若不肯借，場面會很難堪；若勉強借出，日後也會心存芥蒂。
孔夫子寧可自己淋雨，也不讓學生的短處，在眾人面前顯露出來。
為人師者，能想得如此周到，才是學生一生感念的地方。`,
    en: `One day Confucius set out with his students, and partway through the journey it began to rain — no one had brought an umbrella. A student mentioned that Bu Shang, a fellow disciple, had one.

Confucius thought it over, then chose not to ask. He knew Bu Shang held tightly to his things — asking aloud would shame him into refusing, or force a grudging loan and quiet resentment.

So Confucius let himself get wet rather than expose a student's weakness. A teacher who thinks this carefully of his students is what they remember, and are grateful for, all their lives.`
  },

  prompts: {
    zh: ["你曾經像孔夫子一樣，寧可自己吃虧，也不揭穿別人的短處嗎？", "為什麼「不說」有時候比「說」更體貼？", "你認同孔夫子的做法嗎？換作是你，會怎麼做？"],
    en: [
      "Have you ever taken the loss yourself rather than expose someone else's weakness?",
      "Why can staying silent sometimes be more considerate than speaking up?",
      "Do you agree with how Confucius handled it? What would you have done?"
    ]
  },

  image: "bu-shang-umbrella",
  speech: { zh: "" }
};
