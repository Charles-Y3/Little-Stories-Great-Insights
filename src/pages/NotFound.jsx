import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function NotFound() {
  const { language } = useSettings();
  useDocumentTitle(language === "zh" ? "找不到頁面" : "Not Found");

  return (
    <AppShell>
      <div style={{ textAlign: "center", padding: "var(--space-7) var(--space-4)" }}>
        <h2>{language === "zh" ? "找不到這個頁面" : "Page not found"}</h2>
        <p style={{ color: "var(--color-ink-soft)", margin: "var(--space-3) 0 var(--space-5)" }}>
          {language === "zh" ? "連結可能已失效。" : "The link you followed may be broken."}
        </p>
        <Link to="/">
          <Button variant="primary">{language === "zh" ? "回到首頁" : "Back home"}</Button>
        </Link>
      </div>
    </AppShell>
  );
}
