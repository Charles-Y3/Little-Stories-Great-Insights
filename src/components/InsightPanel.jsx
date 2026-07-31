import React, { useEffect, useRef, useState } from "react";
import useInsights from "../hooks/useInsights";
import useVisualViewport from "../hooks/useVisualViewport";
import Button from "./Button";
import styles from "./InsightPanel.module.css";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

// A third face, not a split of the back — a split would either force the
// story pane below the 15px floor or give it its own scrollbar. This slides
// in over the whole scene instead (see InsightPanel.module.css: slide+fade,
// deliberately not a third rotateY — three-face 3D geometry compounds the
// Safari backface-visibility problems the card already works around).
//
// The textarea is the ONE element in this whole app allowed to scroll. "No
// scrolling" is a constraint about authored content being cut off, not about
// interacting with the user's own in-progress writing.
export default function InsightPanel({ story, uiLanguage, contentLanguage, onClose }) {
  const { getInsight, setInsight } = useInsights();
  useVisualViewport();

  const existing = getInsight(story.id);
  const [text, setText] = useState(existing?.text || "");
  const [promptIndex, setPromptIndex] = useState(existing?.promptIndex || 0);
  const [savedAt, setSavedAt] = useState(existing?.updatedAt || null);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const prompts = story.prompts?.[contentLanguage] || [];
  const prompt = prompts.length ? prompts[promptIndex % prompts.length] : "";

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    setInsight(story.id, value, contentLanguage, promptIndex);
    setSavedAt(Date.now());
  };

  const cyclePrompt = () => {
    const next = (promptIndex + 1) % prompts.length;
    setPromptIndex(next);
    if (text.trim()) setInsight(story.id, text, contentLanguage, next);
  };

  const lang = contentLanguage === "zh" ? "zh-Hant" : "en";

  return (
    <div
      className={styles.panel}
      data-no-flip
      role="dialog"
      aria-modal="true"
      aria-label={uiLanguage === "zh" ? "我的心得" : "My insight"}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{uiLanguage === "zh" ? "我的心得" : "My Insight"}</h2>
        <Button variant="primary" size="sm" onClick={onClose}>
          {uiLanguage === "zh" ? "完成" : "Done"}
        </Button>
      </div>

      {prompt && (
        <div className={styles.promptRow}>
          <p className={styles.prompt} lang={lang}>
            {prompt}
          </p>
          {prompts.length > 1 && (
            <Button
              variant="ghost"
              icon
              size="sm"
              onClick={cyclePrompt}
              aria-label={uiLanguage === "zh" ? "換一個提示" : "Another prompt"}
              title={uiLanguage === "zh" ? "換一個提示" : "Another prompt"}
            >
              ↻
            </Button>
          )}
        </div>
      )}

      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={text}
        onChange={handleChange}
        lang={lang}
        placeholder={uiLanguage === "zh" ? "寫下你的心得…" : "Write what this stirred in you…"}
      />

      <p className={styles.saved}>
        {savedAt
          ? uiLanguage === "zh"
            ? `已儲存 · ${formatTime(savedAt)}`
            : `Saved · ${formatTime(savedAt)}`
          : " "}
      </p>
    </div>
  );
}
