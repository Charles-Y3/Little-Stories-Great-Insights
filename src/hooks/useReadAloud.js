import { useCallback, useEffect, useState } from "react";

// Lightweight Web Speech wrapper for the card toolbar. Speaks the story body
// in the current reading language; toggles cancel when already speaking.
export default function useReadAloud(text, contentLanguage) {
  const supported =
    typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";
  const [speaking, setSpeaking] = useState(false);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const toggle = useCallback(() => {
    if (!supported) return;
    if (window.speechSynthesis.speaking) {
      stop();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = contentLanguage === "zh" ? "zh-TW" : "en-US";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [supported, text, contentLanguage, stop]);

  useEffect(() => () => stop(), [stop]);

  // Stop when the story or language changes so we don't keep reading stale text.
  useEffect(() => {
    stop();
  }, [text, contentLanguage, stop]);

  return { speaking, toggle, supported, stop };
}
