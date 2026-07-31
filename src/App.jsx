import React from "react";
import { Routes, Route } from "react-router-dom";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AppShell from "./components/AppShell";
import Button from "./components/Button";
import LanguageGate from "./components/LanguageGate";
import UpdateBanner from "./components/UpdateBanner";
import Home from "./pages/Home";
import Stories from "./pages/Stories";
import Story from "./pages/Story";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";

function CrashFallback(error, reset) {
  return (
    <AppShell>
      <div style={{ textAlign: "center", padding: "var(--space-7) var(--space-4)" }}>
        <h2>Something went wrong</h2>
        <p style={{ color: "var(--color-ink-soft)", margin: "var(--space-3) 0 var(--space-5)" }}>
          The page hit an unexpected error. You can try again or head back home.
        </p>
        <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center" }}>
          <Button
            variant="primary"
            onClick={() => {
              reset();
              window.location.assign("/");
            }}
          >
            Back home
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function AppRoutes() {
  const { languageChosen } = useSettings();

  return (
    <>
      {!languageChosen && <LanguageGate />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:slug" element={<Story />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <ErrorBoundary fallback={CrashFallback}>
        <UpdateBanner />
        <AppRoutes />
      </ErrorBoundary>
    </SettingsProvider>
  );
}
