import IMAGES from "../imageManifest.js";

import angelOfTheFlowers from "./angel-of-the-flowers.js";
import watchYourStep from "./watch-your-step.js";
import fireInTheTower from "./fire-in-the-tower.js";
import whichRoadToChoose from "./which-road-to-choose.js";
import buShangUmbrella from "./bu-shang-umbrella.js";
import hungryGhostsAndGods from "./hungry-ghosts-and-gods.js";
import fotudeng from "./fotudeng.js";
import ourLadysAnswer from "./our-ladys-answer.js";
import theBambooRepays from "./the-bamboo-repays.js";
import whyTheBuddhaDidNotSpeak from "./why-the-buddha-did-not-speak.js";

// Ten explicit imports is right at this scale — greppable, and reading order
// is authored via `order`, not inferred from the filesystem. At ~40+ stories,
// switch to `import.meta.glob("./stories/*.js", { eager: true })`; that's
// safe specifically because `order` never depended on file discovery order.
const raw = [
  angelOfTheFlowers,
  watchYourStep,
  fireInTheTower,
  whichRoadToChoose,
  buShangUmbrella,
  hungryGhostsAndGods,
  fotudeng,
  ourLadysAnswer,
  theBambooRepays,
  whyTheBuddhaDidNotSpeak
];

// Story files stay 100% human-authored prose — nobody hand-types a base64
// LQIP blob or a hex tint. Merging the generated image manifest in here
// (rather than inlining paths in each story file) means the image pipeline
// can be re-run at any time without touching a word of content.
const stories = raw
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((s) => ({ ...s, image: IMAGES[s.image] }));

export function getStory(id) {
  return stories.find((s) => s.id === id);
}

export function allStories() {
  return stories;
}

export default stories;
