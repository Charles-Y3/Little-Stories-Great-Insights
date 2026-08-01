import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import stories from "../data/stories";
import { storyHref } from "../utils/routes";
import AppShell from "../components/AppShell";
import AppLogo from "../components/AppLogo";
import Button from "../components/Button";
import SettingsPopover from "../components/SettingsPopover";
import useDocumentTitle from "../hooks/useDocumentTitle";
import styles from "./Home.module.css";

const APP_VERSION = "1.0.0";

export default function Home() {
  const { language } = useSettings();
  useDocumentTitle(language === "zh" ? "首頁" : "Home");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Pick once per visit so the header control stays stable while on Home.
  const randomStoryHref = useMemo(() => {
    if (!stories.length) return "/stories";
    const pick = stories[Math.floor(Math.random() * stories.length)];
    return storyHref(pick.id);
  }, []);

  return (
    <AppShell
      header={
        <div className={styles.headerRow}>
          <Link
            to={randomStoryHref}
            className={styles.randomLink}
            aria-label={language === "zh" ? "隨機一則故事" : "Open a random story"}
            title={language === "zh" ? "隨機一則故事" : "Open a random story"}
          >
            <AppLogo size={42} />
          </Link>
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
      <div className={styles.page}>
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

        <footer className={styles.footer}>
          <p className={styles.thanks}>
            {language === "zh"
              ? "致謝：這些小故事來自歷代師長、修行者與信仰傳統口耳相傳、筆錄流傳的智慧。感謝每一位曾講述、抄寫、保存它們的人；若無前人的分享，我們無從在今日翻開這些卡片。"
              : "Acknowledgments: These little stories come from teachers, practitioners, and faith traditions — wisdom passed on by word of mouth and by hand. Thank you to everyone who told, wrote down, and kept them; without that sharing, we could not open these cards today."}
          </p>
          <p className={styles.disclaimer}>
            {language === "zh"
              ? "免責聲明：本應用內的故事與心得僅供靈性啟發與個人反思之用，不構成宗教、醫療、法律或其他專業建議。"
              : "Disclaimer: Stories and insights in this app are for spiritual inspiration and personal reflection only. They are not religious, medical, legal, or other professional advice."}
          </p>
          <p className={styles.version}>v{APP_VERSION}</p>
        </footer>
      </div>
    </AppShell>
  );
}
