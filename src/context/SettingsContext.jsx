import React, { createContext, useContext, useEffect, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { lsgiKey } from "../utils/storage";

const SettingsContext = createContext(null);

// No *global* font-size stepper (deliberately — see docs/AUTHORING.md). A
// settings-wide scale would push validated stories past the card height.
// Per-card reading size lives on the story-card back rail instead, and
// enlarging there opts into a vertical scrollbar on that pane only.
export const THEMES = ["light", "dark", "sepia"];

function getDefaultSettings() {
  const prefersDark =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
  return {
    schema: 1,
    language: "zh",
    theme: prefersDark ? "dark" : "light",
    languageChosen: false
  };
}

function normalizeSettings(stored, defaults) {
  if (!stored || typeof stored !== "object") return { ...defaults };
  return {
    ...defaults,
    ...stored,
    theme: THEMES.includes(stored.theme) ? stored.theme : defaults.theme
  };
}

export function SettingsProvider({ children }) {
  const defaults = useMemo(getDefaultSettings, []);
  const [rawSettings, setRawSettings] = useLocalStorage(lsgiKey("settings"), defaults);
  const settings = useMemo(
    () => normalizeSettings(rawSettings, defaults),
    [rawSettings, defaults]
  );

  const setSettings = useCallback(
    (updater) => {
      setRawSettings((prev) => {
        const base = normalizeSettings(prev, defaults);
        return typeof updater === "function" ? updater(base) : updater;
      });
    },
    [defaults, setRawSettings]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", settings.theme);
    root.setAttribute("lang", settings.language === "zh" ? "zh-Hant" : "en");
  }, [settings.theme, settings.language]);

  const value = useMemo(
    () => ({
      language: settings.language,
      theme: settings.theme,
      languageChosen: Boolean(settings.languageChosen),
      setLanguage: (language) => setSettings((s) => ({ ...s, language })),
      chooseLanguage: (language) =>
        setSettings((s) => ({ ...s, language, languageChosen: true })),
      toggleLanguage: () =>
        setSettings((s) => ({ ...s, language: s.language === "zh" ? "en" : "zh" })),
      setTheme: (theme) => setSettings((s) => ({ ...s, theme: THEMES.includes(theme) ? theme : s.theme }))
    }),
    [settings, setSettings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
