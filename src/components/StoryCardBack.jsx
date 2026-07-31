import React, { useRef } from "react";
import StoryCardRail from "./StoryCardRail";
import useTapAway from "../hooks/useTapAway";
import useFitText from "../hooks/useFitText";
import styles from "./StoryCardBack.module.css";

// Same note as StoryCardFront: no outer face/positioning here, that lives in
// the single shared StoryCard.module.css so cross-face CSS selectors work.
export default function StoryCardBack({
  story,
  uiLanguage,
  contentLanguage,
  onToggleContentLanguage,
  onOpenInsight,
  insightDisabled,
  onFlip,
  onExit,
  titleId,
  headingRef
}) {
  const paneRef = useRef(null);
  const textRef = useRef(null);
  const tapAway = useTapAway(onFlip);

  useFitText(paneRef, textRef, [story.id, contentLanguage]);

  const lang = contentLanguage === "zh" ? "zh-Hant" : "en";
  const paragraphs = String(story.story[contentLanguage])
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={styles.content} {...tapAway}>
      <StoryCardRail
        uiLanguage={uiLanguage}
        contentLanguage={contentLanguage}
        onToggleContentLanguage={onToggleContentLanguage}
        onOpenInsight={onOpenInsight}
        insightDisabled={insightDisabled}
        onFlip={onFlip}
        flipped
        onExit={onExit}
      />

      <h2 id={titleId} ref={headingRef} tabIndex={-1} className={styles.title} lang={lang}>
        {story.title[contentLanguage]}
      </h2>

      <div className={styles.storyPane} ref={paneRef}>
        <div className={styles.storyText} ref={textRef} lang={lang}>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {story.source?.[contentLanguage] && (
        <p className={styles.source} lang={lang}>
          {story.source[contentLanguage]}
        </p>
      )}
    </div>
  );
}
