import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import AppShell from "../components/AppShell";
import AppLogo from "../components/AppLogo";
import Button from "../components/Button";
import HeaderHomeLink from "../components/HeaderHomeLink";
import SettingsPopover from "../components/SettingsPopover";
import useDocumentTitle from "../hooks/useDocumentTitle";
import styles from "./Home.module.css";

export default function Home() {
  const { language } = useSettings();
  useDocumentTitle(language === "zh" ? "首頁" : "Home");
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppShell
      header={
        <div className={styles.headerRow}>
          <HeaderHomeLink language={language} />
          <Button
            variant="ghost"
            icon
            aria-label={language === "zh" ? "設定" : "Settings"}
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((v) => !v)}
          >
            ⚙
          </Button>
          <SettingsPopover open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
      }
    >
      <div className={styles.hero}>
        <AppLogo size={72} />
        <h1 className={styles.title}>
          <span className={language === "zh" ? styles.stackVisible : styles.stackHidden}>
            小故事大啟發
          </span>
          <span className={language === "en" ? styles.stackVisible : styles.stackHidden}>
            Little Stories Great Insights
          </span>
        </h1>
        <p className={styles.tagline}>
          {language === "zh"
            ? "翻開卡片，讀一則小故事，寫下你的心得。"
            : "Flip a card, read a short story, write down what it stirs in you."}
        </p>
        <div className={styles.actions}>
          <Link to="/stories">
            <Button variant="primary" block>
              {language === "zh" ? "瀏覽故事" : "Browse stories"}
            </Button>
          </Link>
          <Link to="/insights">
            <Button variant="ghost" block>
              {language === "zh" ? "我的心得" : "My insights"}
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
