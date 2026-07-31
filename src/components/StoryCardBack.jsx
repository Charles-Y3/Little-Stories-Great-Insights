import React, { useEffect, useRef, useState } from "react";
import StoryCardRail from "./StoryCardRail";
import useTapAway from "../hooks/useTapAway";
import useReadAloud from "../hooks/useReadAloud";
import styles from "./StoryCardBack.module.css";

// Discrete reading sizes on the card back. Enlarging past what fits turns on
// the pane's vertical scrollbar (see overflow sync below) — intentional, so
// readers can choose comfort over the default no-scroll fit.
const FONT_STEPS = [
  { px: 16, label: "A−" },
  { px: 17, label: "A" },
  { px: 19, label: "A+" },
  { px: 21, label: "A++" }
];
const DEFAULT_STEP = 1;

// Same note as StoryCardFront: no outer face/positioning here, that lives in
// the single shared StoryCard.module.css so cross-face CSS selectors work.
// Title stays visually on the front only; a visually-hidden heading keeps
// aria-labelledby / focus-on-flip working for the back face.
export default function StoryCardBack({
  story,
  uiLanguage,
  contentLanguage,
  onToggleContentLanguage,
  onOpenInsight,
  insightDisabled,
  onFlip,
  onHome,
  onCatalog,
  titleId,
  headingRef
}) {
  const paneRef = useRef(null);
  const textRef = useRef(null);
  const tapAway = useTapAway(onFlip);
  const [fontStep, setFontStep] = useState(DEFAULT_STEP);

  const storyText = String(story.story[contentLanguage] || "");
  const { speaking, toggle: toggleReadAloud, supported: speechSupported, stop: stopSpeech } =
    useReadAloud(storyText, contentLanguage);

  const cycleFontSize = () => setFontStep((i) => (i + 1) % FONT_STEPS.length);

  const handleBack = () => {
    stopSpeech();
    onCatalog();
  };

  // When the chosen size overflows the pane, allow scroll and stop treating
  // taps inside the pane as a flip (scroll gestures must not flip the card).
  useEffect(() => {
    const pane = paneRef.current;
    const text = textRef.current;
    if (!pane || !text) return undefined;

    const syncOverflow = () => {
      const overflowing = text.scrollHeight > pane.clientHeight + 1;
      if (overflowing) {
        pane.dataset.overflow = "true";
        pane.dataset.noFlip = "true";
      } else {
        delete pane.dataset.overflow;
        delete pane.dataset.noFlip;
      }
    };

    syncOverflow();
    const ro = new ResizeObserver(syncOverflow);
    ro.observe(pane);
    ro.observe(text);
    return () => ro.disconnect();
  }, [story.id, contentLanguage, fontStep]);

  const lang = contentLanguage === "zh" ? "zh-Hant" : "en";
  const paragraphs = storyText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const font = FONT_STEPS[fontStep];

  return (
    <div className={styles.content} {...tapAway}>
      <h2 id={titleId} ref={headingRef} tabIndex={-1} className={styles.srTitle} lang={lang}>
        {story.title[contentLanguage]}
      </h2>

      <div className={styles.storyPane} ref={paneRef}>
        <div
          className={styles.storyText}
          ref={textRef}
          lang={lang}
          style={{ "--story-font-size": `${font.px}px` }}
        >
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

      <StoryCardRail
        uiLanguage={uiLanguage}
        contentLanguage={contentLanguage}
        onHome={onHome}
        onOpenInsight={onOpenInsight}
        insightDisabled={insightDisabled}
        onCycleFontSize={cycleFontSize}
        fontSizeLabel={font.label}
        onToggleContentLanguage={onToggleContentLanguage}
        onReadAloud={toggleReadAloud}
        speaking={speaking}
        speechSupported={speechSupported}
        onBack={handleBack}
      />
    </div>
  );
}
