import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import stories from "../data/stories";
import { storyHref } from "../utils/routes";
import AppShell from "../components/AppShell";
import AppLogo from "../components/AppLogo";
import Button from "../components/Button";
import SettingsPopover from "../components/SettingsPopover";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useInsights from "../hooks/useInsights";
import { exportSmart, isFolderBackupSupported, isFolderBackupEnabled, enableFolderBackup } from "../utils/folderBackup";
import {
  shouldShowBackupReminder,
  snoozeBackupReminder,
  consumeJustImportedFlag
} from "../utils/backupReminder";
import styles from "./Home.module.css";

const APP_VERSION = "1.1.1";

export default function Home() {
  const { language } = useSettings();
  useDocumentTitle(language === "zh" ? "首頁" : "Home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { insights } = useInsights();
  const hasBackupData = insights.some((i) => i.text?.trim());
  // Consumed once, right on mount, so both banners below agree on whether
  // this load is the one right after an import — the stale-backup nudge
  // would otherwise fire alongside the import notice for no reason.
  const [justImported] = useState(() => consumeJustImportedFlag());
  const [showBackupReminder, setShowBackupReminder] = useState(false);
  useEffect(() => {
    if (justImported) return;
    setShowBackupReminder(shouldShowBackupReminder(hasBackupData));
  }, [hasBackupData, justImported]);
  // One-time, right after an import: folder auto-save can't be restored
  // from the imported file itself (see backupReminder.js), so if it isn't
  // currently active, tell the user they'll need to re-choose the folder
  // rather than let them silently assume it's still protecting new writes.
  const [showImportFolderNotice, setShowImportFolderNotice] = useState(false);
  useEffect(() => {
    if (justImported && isFolderBackupSupported() && !isFolderBackupEnabled()) {
      setShowImportFolderNotice(true);
    }
  }, [justImported]);

  // Delegates to the same exportSmart() decision as the Settings Export
  // button and the write-triggered nudge, so this can't drift into its own
  // "just download" behavior again — it was doing exactly that before,
  // never actually prompting for a folder on first use.
  const handleBackupNow = async () => {
    const result = await exportSmart();
    if (result.mode !== "cancelled") setShowBackupReminder(false);
  };

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
        {showBackupReminder && (
          <div className={styles.backupBanner}>
            <p className={styles.backupBannerText}>
              {language === "zh"
                ? "您已有一段時間沒有備份心得了，資料仍只存在此裝置上。"
                : "It's been a while since you backed up your insights — they still only live on this device."}
            </p>
            <div className={styles.backupBannerActions}>
              <Button variant="gold" size="sm" onClick={() => void handleBackupNow()}>
                {language === "zh" ? "立即備份" : "Back up now"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  snoozeBackupReminder();
                  setShowBackupReminder(false);
                }}
              >
                {language === "zh" ? "稍後提醒" : "Remind me later"}
              </Button>
            </div>
          </div>
        )}
        {showImportFolderNotice && (
          <div className={styles.backupBanner}>
            <p className={styles.backupBannerText}>
              {language === "zh"
                ? "已匯入資料。若您先前有開啟「自動儲存到資料夾」，需要重新選擇一次資料夾——匯入無法還原資料夾的存取權限。"
                : "Data imported. If you had “Auto-save to folder” on before, you'll need to choose the folder again — an import can't restore folder access."}
            </p>
            <div className={styles.backupBannerActions}>
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  void enableFolderBackup().catch(() => {});
                  setShowImportFolderNotice(false);
                }}
              >
                {language === "zh" ? "選擇資料夾" : "Choose folder"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowImportFolderNotice(false)}>
                {language === "zh" ? "知道了" : "Got it"}
              </Button>
            </div>
          </div>
        )}
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
