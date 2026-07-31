import React, { useEffect, useId, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { lsgiKey } from "../utils/storage";
import { DEFAULT_FONT_STEP, FONT_STEPS } from "../utils/readingFont";
import StoryCardFront from "./StoryCardFront";
import StoryCardBack from "./StoryCardBack";
import InsightPanel from "./InsightPanel";
import styles from "./StoryCard.module.css";

export default function StoryCard({ story, initialInsightOpen = false }) {
  const { language, theme } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const uid = useId();

  const [insightOpen, setInsightOpen] = useState(() => Boolean(initialInsightOpen));

  // Two independent language axes, same pattern as the sibling project:
  // `language` is the interface language (global, in settings); this is the
  // READING language, its own localStorage key, defaulting to the interface
  // language only the first time it's ever read.
  const [contentLanguage, setContentLanguage] = useLocalStorage(lsgiKey("contentLanguage"), language);
  const [face, setFace] = useState("front");
  // Lifted so the insight panel can match the card-back reading size.
  const [fontStep, setFontStep] = useState(DEFAULT_FONT_STEP);

  const sceneRef = useRef(null);
  const frontHeadingRef = useRef(null);
  const backHeadingRef = useRef(null);
  const frontFaceRef = useRef(null);
  const backFaceRef = useRef(null);
  const didMountRef = useRef(false);

  const frontTitleId = `story-front-title-${uid}`;
  const backTitleId = `story-back-title-${uid}`;

  useEffect(() => {
    sceneRef.current?.focus();
  }, []);

  // Focus the newly-visible face's heading on flip — but not on the initial
  // mount (that's handled above, landing on the scene itself).
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    (face === "back" ? backHeadingRef : frontHeadingRef).current?.focus();
  }, [face]);

  // Belt-and-braces on top of `visibility: hidden` (StoryCard.module.css),
  // which already removes the hidden face from the a11y tree and tab order
  // in every modern engine — `inert` is a defensive redundancy for older
  // Safari inconsistencies. React 18 has no `inert` prop, hence the ref.
  //
  // Also inert-ed whenever the insight panel is open: it's a sibling
  // element that visually covers whichever face is active, but without this
  // its rail buttons stay in tab order underneath — a keyboard user could
  // Tab onto a "Flip card" button they can't see and never meant to reach.
  useEffect(() => {
    if (frontFaceRef.current) frontFaceRef.current.inert = face !== "front" || insightOpen;
    if (backFaceRef.current) backFaceRef.current.inert = face !== "back" || insightOpen;
  }, [face, insightOpen]);

  const flip = () => setFace((f) => (f === "front" ? "back" : "front"));

  const handleExit = () => {
    const tileId = `tile-${story.id}`;
    if (location.key !== "default") navigate(-1);
    else navigate("/stories");
    window.setTimeout(() => document.getElementById(tileId)?.focus(), 0);
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleCatalog = () => {
    const tileId = `tile-${story.id}`;
    navigate("/stories");
    window.setTimeout(() => document.getElementById(tileId)?.focus(), 0);
  };

  useEffect(() => {
    const onKey = (e) => {
      // InsightPanel owns Escape while it's open (closes just the panel);
      // don't also exit the whole card out from under it.
      if (e.key === "Escape" && !insightOpen) handleExit();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insightOpen]);

  const toggleContentLanguage = () => setContentLanguage((l) => (l === "zh" ? "en" : "zh"));
  const cycleFontSize = () => setFontStep((i) => (i + 1) % FONT_STEPS.length);
  const readingFontPx = (FONT_STEPS[fontStep] || FONT_STEPS[DEFAULT_FONT_STEP]).px;

  const img = story.image;
  const tint = theme === "dark" ? img.colorDark : theme === "sepia" ? img.colorSepia : img.colorLight;

  return (
    <div
      className={styles.scene}
      role="dialog"
      aria-modal="true"
      aria-labelledby={face === "back" ? backTitleId : frontTitleId}
      ref={sceneRef}
      tabIndex={-1}
    >
      {/* Shared size box so the insight panel always covers the card exactly —
          a separate absolute panel was shrinking with the keyboard (vv-height
          × aspect-ratio) into the tiny floating modal. */}
      <div className={styles.stage}>
        <div className={styles.card} data-face={face} style={{ "--story-tint": tint }}>
          <div className={`${styles.face} ${styles.front}`} ref={frontFaceRef}>
            <StoryCardFront
              story={story}
              uiLanguage={language}
              onFlip={flip}
              onExit={handleExit}
              titleId={frontTitleId}
              headingRef={frontHeadingRef}
            />
          </div>
          <div className={`${styles.face} ${styles.back}`} ref={backFaceRef}>
            <StoryCardBack
              story={story}
              uiLanguage={language}
              contentLanguage={contentLanguage}
              onToggleContentLanguage={toggleContentLanguage}
              onOpenInsight={() => setInsightOpen(true)}
              insightDisabled={false}
              onFlip={flip}
              onHome={handleHome}
              onCatalog={handleCatalog}
              fontStep={fontStep}
              onCycleFontSize={cycleFontSize}
              titleId={backTitleId}
              headingRef={backHeadingRef}
            />
          </div>
        </div>

        {insightOpen && (
          <InsightPanel
            story={story}
            contentLanguage={contentLanguage}
            fontSizePx={readingFontPx}
            onClose={() => setInsightOpen(false)}
          />
        )}
      </div>

      <p className={styles.srAnnounce} aria-live="polite">
        {face === "back"
          ? language === "zh"
            ? "顯示故事"
            : "Showing story"
          : language === "zh"
            ? "顯示插圖"
            : "Showing illustration"}
      </p>
    </div>
  );
}
