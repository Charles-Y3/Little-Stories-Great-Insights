import React from "react";
import Button from "./Button";
import useTapAway from "../hooks/useTapAway";
import styles from "./StoryCardFront.module.css";

// No outer positioning here — StoryCard.module.css's .face/.front classes
// (a single shared module, so cross-selectors like `[data-face="back"] .front`
// actually resolve) own the absolute-fill box and the flip mechanics. This
// component only fills that box and styles what's inside it.
export default function StoryCardFront({ story, uiLanguage, onFlip, onExit, titleId, headingRef }) {
  const img = story.image;
  const tapAway = useTapAway(onFlip);

  return (
    <div className={styles.content} {...tapAway}>
      <img
        src={img.full}
        width={img.width}
        height={img.height}
        alt=""
        decoding="async"
        fetchpriority="high"
        className={styles.image}
        style={{ backgroundImage: `url(${img.lqip})`, backgroundSize: "cover" }}
      />
      <div className={styles.scrim} aria-hidden="true" />
      <h1
        id={titleId}
        ref={headingRef}
        tabIndex={-1}
        className={styles.title}
        lang={uiLanguage === "zh" ? "zh-Hant" : "en"}
      >
        {story.title[uiLanguage]}
      </h1>
      <div className={styles.exitSlot} data-no-flip onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          icon
          className={styles.exitBtn}
          onClick={onExit}
          aria-label={uiLanguage === "zh" ? "關閉" : "Close"}
          title={uiLanguage === "zh" ? "關閉" : "Close"}
        >
          ✕
        </Button>
      </div>
    </div>
  );
}
