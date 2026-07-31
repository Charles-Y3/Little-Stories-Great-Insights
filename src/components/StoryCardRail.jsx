import React from "react";
import Button from "./Button";
import { BackIcon, HomeIcon, InsightIcon, PlayIcon, StopIcon } from "./RailIcons";
import styles from "./StoryCardRail.module.css";

// Bottom toolbar: equal-width tabs. stopPropagation lives on the wrapper so
// taps never fall through as "flip the card". Flip / back is an explicit
// control here; tap-away on the story pane still flips too.
export default function StoryCardRail({
  uiLanguage,
  contentLanguage,
  onHome,
  onOpenInsight,
  insightDisabled,
  onCycleFontSize,
  fontSizeLabel,
  onToggleContentLanguage,
  onReadAloud,
  speaking,
  speechSupported,
  onBack
}) {
  const zh = uiLanguage === "zh";

  return (
    <div className={styles.rail} data-no-flip onClick={(e) => e.stopPropagation()} role="toolbar">
      <Button
        variant="ghost"
        className={styles.railBtn}
        onClick={onHome}
        aria-label={zh ? "首頁" : "Home"}
        title={zh ? "首頁" : "Home"}
      >
        <HomeIcon />
      </Button>
      <Button
        variant="ghost"
        className={styles.railBtn}
        onClick={onOpenInsight}
        disabled={insightDisabled}
        aria-label={zh ? "寫下心得" : "Write an insight"}
        title={zh ? "寫下心得" : "Write an insight"}
      >
        <InsightIcon />
      </Button>
      <Button
        variant="ghost"
        className={styles.railBtn}
        onClick={onCycleFontSize}
        aria-label={zh ? "調整字級" : "Change font size"}
        title={zh ? `字級 ${fontSizeLabel}` : `Font size ${fontSizeLabel}`}
      >
        {fontSizeLabel}
      </Button>
      <Button
        variant="ghost"
        className={styles.railBtn}
        onClick={onToggleContentLanguage}
        aria-label={zh ? "切換閱讀語言" : "Toggle reading language"}
        title={zh ? "切換閱讀語言" : "Toggle reading language"}
      >
        {contentLanguage === "zh" ? "中" : "EN"}
      </Button>
      <Button
        variant="ghost"
        className={styles.railBtn}
        onClick={onReadAloud}
        disabled={!speechSupported}
        aria-pressed={speaking}
        aria-label={
          speaking
            ? zh
              ? "停止朗讀"
              : "Stop reading aloud"
            : zh
              ? "朗讀"
              : "Read aloud"
        }
        title={
          speaking
            ? zh
              ? "停止朗讀"
              : "Stop reading aloud"
            : zh
              ? "朗讀"
              : "Read aloud"
        }
      >
        {speaking ? <StopIcon /> : <PlayIcon />}
      </Button>
      <Button
        variant="ghost"
        className={styles.railBtn}
        onClick={onBack}
        aria-label={zh ? "返回目錄" : "Back to catalog"}
        title={zh ? "返回目錄" : "Back to catalog"}
      >
        <BackIcon />
      </Button>
    </div>
  );
}
