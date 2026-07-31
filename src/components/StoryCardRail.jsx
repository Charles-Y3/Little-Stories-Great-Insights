import React from "react";
import Button from "./Button";
import styles from "./StoryCardRail.module.css";

// The one wrapper that owns stopPropagation, not four individual buttons —
// per-button stopPropagation is fragile (one new button added without it and
// the card flips out from under the user). The parent's tap-away handler
// never sees clicks that originate inside this element.
// Flip lives on tap-anywhere (useTapAway), not as a rail control.
export default function StoryCardRail({
  uiLanguage,
  contentLanguage,
  onToggleContentLanguage,
  onOpenInsight,
  insightDisabled,
  onCycleFontSize,
  fontSizeLabel,
  onExit
}) {
  return (
    <div className={styles.rail} data-no-flip onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        icon
        className={styles.railBtn}
        onClick={onOpenInsight}
        disabled={insightDisabled}
        aria-label={uiLanguage === "zh" ? "寫下心得" : "Write an insight"}
        title={uiLanguage === "zh" ? "寫下心得" : "Write an insight"}
      >
        ✎
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={styles.railBtn}
        onClick={onCycleFontSize}
        aria-label={uiLanguage === "zh" ? "調整字級" : "Change font size"}
        title={uiLanguage === "zh" ? `字級 ${fontSizeLabel}` : `Font size ${fontSizeLabel}`}
      >
        {fontSizeLabel}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={styles.railBtn}
        onClick={onToggleContentLanguage}
        aria-label={uiLanguage === "zh" ? "切換閱讀語言" : "Toggle reading language"}
        title={uiLanguage === "zh" ? "切換閱讀語言" : "Toggle reading language"}
      >
        {contentLanguage === "zh" ? "中" : "EN"}
      </Button>
      <Button
        variant="ghost"
        icon
        className={styles.railBtn}
        onClick={onExit}
        aria-label={uiLanguage === "zh" ? "關閉" : "Close"}
        title={uiLanguage === "zh" ? "關閉" : "Close"}
      >
        ✕
      </Button>
    </div>
  );
}
