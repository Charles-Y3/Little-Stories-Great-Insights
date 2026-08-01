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
import zenMasterAndDaoist from "./zen-master-and-daoist.js";
import theSower from "./the-sower.js";
import theThiefWithin from "./the-thief-within.js";
import theApple from "./the-apple.js";
import writerAndNewsVendor from "./writer-and-news-vendor.js";
import angerDangerAngel from "./anger-danger-angel.js";
import fourPeopleOnAnIsland from "./four-people-on-an-island.js";
import theBumblebee from "./the-bumblebee.js";
import locomotiveAndCarriages from "./locomotive-and-carriages.js";
import twoWheelDriveOrFour from "./two-wheel-drive-or-four.js";
import companyAtTheStart from "./company-at-the-start.js";
import warshipsFacingInward from "./warships-facing-inward.js";
import aBowlOfNoodles from "./a-bowl-of-noodles.js";
import respectForElders from "./respect-for-elders.js";
import findingTrueWealth from "./finding-true-wealth.js";
import jesusAndTheDoorkeeper from "./jesus-and-the-doorkeeper.js";
import affectionOrDesire from "./affection-or-desire.js";
import listening from "./listening.js";
import abilityAndAchievement from "./ability-and-achievement.js";
import foolishDonkey from "./foolish-donkey.js";
import whoToCareFor from "./who-to-care-for.js";
import fireOfIgnorance from "./fire-of-ignorance.js";
import whoseFault from "./whose-fault.js";
import whatIsZen from "./what-is-zen.js";
import sharedFateBird from "./shared-fate-bird.js";
import willingToFace from "./willing-to-face.js";
import putYourselfThere from "./put-yourself-there.js";
import virtueOrKin from "./virtue-or-kin.js";
import twoZenMasters from "./two-zen-masters.js";
import richMansHeart from "./rich-mans-heart.js";

// Explicit imports stay greppable; reading order is authored via `order`.
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
  whyTheBuddhaDidNotSpeak,
  zenMasterAndDaoist,
  theSower,
  theThiefWithin,
  theApple,
  writerAndNewsVendor,
  angerDangerAngel,
  fourPeopleOnAnIsland,
  theBumblebee,
  locomotiveAndCarriages,
  twoWheelDriveOrFour,
  companyAtTheStart,
  warshipsFacingInward,
  aBowlOfNoodles,
  respectForElders,
  findingTrueWealth,
  jesusAndTheDoorkeeper,
  affectionOrDesire,
  listening,
  abilityAndAchievement,
  foolishDonkey,
  whoToCareFor,
  fireOfIgnorance,
  whoseFault,
  whatIsZen,
  sharedFateBird,
  willingToFace,
  putYourselfThere,
  virtueOrKin,
  twoZenMasters,
  richMansHeart
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
