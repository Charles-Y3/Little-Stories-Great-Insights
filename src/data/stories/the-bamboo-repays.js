// The Chinese text below MERGES the source's 17 short dialogue paragraphs
// (each 主人-says / 竹子-says exchange on its own line, pasted by the user
// 2026-07-31) into fewer, fuller paragraphs, per the user's chosen resolution
// (plan §3: "I merge dialogue lines"). The per-paragraph minimum-one-line
// rule meant 17 short paragraphs cost ~27 estimated lines even though the
// raw character count was under the ceiling — merging fixes that.
//
// Merging alone was not enough (still ~18-20 lines): the user's fallback —
// "trim one repetition" — is also applied here, condensing the original's
// four asks (fell / strip leaves / cut branches / hollow joints) into three
// (fell / strip branches-and-leaves together / hollow joints). Every other
// beat, all dialogue, the tears, and the water-pipe ending are kept intact.
// Flagged for the user's review before this ships as final content.
export default {
  id: "the-bamboo-repays",
  order: 9,
  title: { zh: "竹子的回報", en: "The Bamboo's Repayment" },
  tags: { zh: ["犧牲", "奉獻"], en: ["sacrifice", "purpose"] },

  story: {
    zh: `有個主人種了一根竹子，悉心照顧，竹子漸漸長成園中最挺拔的一株，一心想報答主人。
主人說：「想請你幫個忙，你願意嗎？」竹子說：「主人，我正想報答你。」主人說：「我要砍了你。」竹子含淚：「那我便無法立足了……」主人說：「那豈不枉費我一片心思？」竹子還是答應了。
次日，主人說：「這次要將你的枝葉全部剪光削盡，你願意嗎？」竹子說：「太殘酷了吧？」主人說：「別忘了我一直以來的照顧。」竹子又含淚答應了。
最後，主人說：「這次我要將你的竹節全部鑿空，你願意嗎？」竹子哀聲：「為何偏偏苦毒我一個？」主人說：「前面受的苦豈不是都白受了？」竹子還是答應了。
竹子鑿空後，主人拿它做成水管，引水灌溉，使廣大的田野，從此不再缺乏水源。`,
    en: `A man once planted a bamboo shoot and tended it with care. It grew tall and strong — the finest stalk in the garden — and longed to repay him.

"Will you help me?" he asked. "Gladly," said the bamboo. "I want to cut you down." Tears welled up, but it agreed. Next: "I must strip your branches and leaves." It wept, and agreed again. Later: "I must hollow every joint." "Why me?" it cried. "Would all you've given be wasted now?" he asked. It agreed once more.

Hollow now, it became an irrigation pipe, carrying water to fields gone thirsty for years.`
  },

  prompts: {
    zh: ["你曾為了某個目的，一次次答應犧牲自己嗎？", "「前面受的苦豈不是都白受了」這句話，是安慰還是道德綁架？", "你認為竹子最後的犧牲值得嗎？"],
    en: [
      "Have you ever kept agreeing to sacrifice, step after step, for a purpose you couldn't yet see?",
      "Is \"wouldn't your earlier suffering be wasted\" comfort, or manipulation?",
      "Do you think the bamboo's final sacrifice was worth it?"
    ]
  },

  image: "the-bamboo-repays",
  speech: { zh: "" }
};
