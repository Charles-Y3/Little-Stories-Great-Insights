import React, { useEffect, useRef, useState } from "react";
import useInsights from "../hooks/useInsights";
import useVisualViewport from "../hooks/useVisualViewport";
import Button from "./Button";
import styles from "./InsightPanel.module.css";

function formatTime(ts, language) {
  return new Date(ts).toLocaleTimeString(language === "zh" ? "zh-Hant" : "en", {
    hour: "2-digit",
    minute: "2-digit"
  });
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
export default function InsightPanel({ story, contentLanguage, onClose }) {
  const { getInsight, setInsight } = useInsights();
  useVisualViewport();

  const existing = getInsight(story.id);
  const [text, setText] = useState(existing?.text || "");
  const [savedAt, setSavedAt] = useState(existing?.updatedAt || null);
  const textareaRef = useRef(null);

  // Focus after the enter animation so the panel paints at full card size
  // before the mobile keyboard (and --kb-inset) compresses the inner layout.
  useEffect(() => {
    const id = window.setTimeout(() => textareaRef.current?.focus(), 280);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const prompts = story.prompts?.[contentLanguage] || [];

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    setInsight(story.id, value, contentLanguage, 0);
    setSavedAt(Date.now());
  };

  const lang = contentLanguage === "zh" ? "zh-Hant" : "en";
  // Panel chrome follows the reading language so switching 中/EN on the card
  // updates Done / title / placeholder together with the prompts.
  const zh = contentLanguage === "zh";

  return (
    <div
      className={styles.panel}
      data-no-flip
      role="dialog"
      aria-modal="true"
      aria-label={zh ? "我的心得" : "My Insights"}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{zh ? "我的心得" : "My Insights"}</h2>
        <Button variant="primary" size="sm" onClick={onClose}>
          {zh ? "完成" : "Done"}
        </Button>
      </div>

      {prompts.length > 0 && (
        <ul className={styles.prompts} lang={lang}>
          {prompts.map((prompt, i) => (
            <li key={i} className={styles.prompt}>
              {prompt}
            </li>
          ))}
        </ul>
      )}

      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={text}
        onChange={handleChange}
        lang={lang}
        placeholder={zh ? "寫下你的心得…" : "Write what this stirred in you…"}
      />

      <p className={styles.saved}>
        {savedAt
          ? zh
            ? `已儲存 · ${formatTime(savedAt, "zh")}`
            : `Saved · ${formatTime(savedAt, "en")}`
          : " "}
      </p>
    </div>
  );
}
