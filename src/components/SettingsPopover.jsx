import React, { useEffect, useRef, useState } from "react";
import { useSettings, THEMES } from "../context/SettingsContext";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";
import { readBackupFile, applyBackup, isValidBackup } from "../utils/backup";
import {
  isFolderBackupSupported,
  isFolderBackupEnabled,
  getFolderName,
  enableFolderBackup,
  disableFolderBackup,
  exportSmart
} from "../utils/folderBackup";
import {
  subscribePwaInstall,
  getDeferredInstallPrompt,
  promptPwaInstall,
  isStandaloneDisplay,
  installGuideKind
} from "../utils/pwaInstall";
import { subscribeOfflineReady } from "../utils/offlineReady";
import { flagJustImported } from "../utils/backupReminder";
import styles from "./SettingsPopover.module.css";

const THEME_LABELS = {
  light: { zh: "亮色", en: "Light" },
  dark: { zh: "暗色", en: "Dark" },
  sepia: { zh: "復古", en: "Sepia" }
};

export default function SettingsPopover({ open, onClose }) {
  const { language, theme, setLanguage, setTheme } = useSettings();
  const panelRef = useRef(null);
  const fileInputRef = useRef(null);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const [importError, setImportError] = useState("");
  const [folderEnabled, setFolderEnabled] = useState(() => isFolderBackupEnabled());
  const [folderName, setFolderName] = useState(() => getFolderName());
  const [folderBusy, setFolderBusy] = useState(false);
  const [folderError, setFolderError] = useState("");

  useEffect(() => subscribePwaInstall(() => setInstallAvailable(Boolean(getDeferredInstallPrompt()))), []);
  useEffect(() => subscribeOfflineReady(setOfflineReady), []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const onClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open, onClose]);

  const standalone = isStandaloneDisplay();
  const guide = installGuideKind();

  const handleFilePick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const obj = await readBackupFile(file);
      if (!isValidBackup(obj)) {
        setImportError(language === "zh" ? "備份檔案格式不正確。" : "That doesn't look like a valid backup file.");
        return;
      }
      setImportError("");
      setPendingImport(obj);
    } catch {
      setImportError(language === "zh" ? "無法讀取備份檔案。" : "Could not read that file.");
    }
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    applyBackup(pendingImport);
    setPendingImport(null);
    flagJustImported();
    window.location.reload();
  };

  const handleEnableFolderBackup = async () => {
    setFolderError("");
    setFolderBusy(true);
    try {
      const name = await enableFolderBackup();
      setFolderName(name);
      setFolderEnabled(true);
    } catch (err) {
      if (err?.name !== "AbortError") {
        setFolderError(
          language === "zh" ? "無法存取該資料夾，請再試一次。" : "Couldn’t access that folder — please try again."
        );
      }
    } finally {
      setFolderBusy(false);
    }
  };

  const handleDisableFolderBackup = async () => {
    await disableFolderBackup();
    setFolderEnabled(false);
    setFolderName("");
  };

  // Delegates the actual "what should Export do" decision to exportSmart()
  // (shared with the write-triggered nudge's Export button, so the two
  // can't drift apart) — this just reflects the outcome into local UI state.
  const handleExportClick = async () => {
    setFolderError("");
    setFolderBusy(true);
    try {
      const result = await exportSmart();
      if (result.mode === "folder") {
        setFolderEnabled(true);
        setFolderName(result.folderName);
      }
      if (result.error) {
        setFolderError(
          language === "zh"
            ? "資料夾存取已失效，改為下載檔案。"
            : "Folder access is no longer available — downloading a file instead."
        );
      }
    } finally {
      setFolderBusy(false);
    }
  };

  return (
    <>
      {open && (
      <div
        className={styles.panel}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={language === "zh" ? "設定" : "Settings"}
      >
        <Button
          variant="ghost"
          icon
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={language === "zh" ? "關閉" : "Close"}
          title={language === "zh" ? "關閉" : "Close"}
        >
          ✕
        </Button>

        <section className={styles.section}>
          <h3 className={styles.heading}>{language === "zh" ? "語言" : "Language"}</h3>
          <div className={styles.langRow}>
            <Button size="sm" variant={language === "zh" ? "primary" : "ghost"} onClick={() => setLanguage("zh")}>
              中文
            </Button>
            <Button size="sm" variant={language === "en" ? "primary" : "ghost"} onClick={() => setLanguage("en")}>
              English
            </Button>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>{language === "zh" ? "主題" : "Theme"}</h3>
          <div className={styles.themeRow}>
            {THEMES.map((t) => (
              <Button key={t} size="sm" variant={theme === t ? "primary" : "ghost"} onClick={() => setTheme(t)}>
                {THEME_LABELS[t][language]}
              </Button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>{language === "zh" ? "應用程式" : "App"}</h3>
          {standalone ? (
            <p className={styles.hint}>{language === "zh" ? "已安裝為應用程式。" : "Installed as an app."}</p>
          ) : installAvailable ? (
            <Button size="sm" variant="gold" block onClick={() => promptPwaInstall()}>
              {language === "zh" ? "安裝應用程式" : "Install app"}
            </Button>
          ) : guide === "ios" ? (
            <p className={styles.hint}>
              {language === "zh"
                ? "在 Safari 中點擊「分享」→「加入主畫面」即可安裝。"
                : "In Safari, tap Share → Add to Home Screen to install."}
            </p>
          ) : (
            <p className={styles.hint}>
              {language === "zh" ? "此瀏覽器目前無法安裝。" : "Install isn't available in this browser yet."}
            </p>
          )}
          <p className={styles.hint}>
            {offlineReady
              ? language === "zh"
                ? "✓ 已可離線使用"
                : "✓ Ready to work offline"
              : language === "zh"
                ? "尚未完成離線快取"
                : "Not yet cached for offline use"}
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>{language === "zh" ? "備份與還原" : "Backup & Restore"}</h3>
          <div className={styles.row}>
            <Button size="sm" variant="ghost" onClick={() => void handleExportClick()} disabled={folderBusy}>
              {language === "zh" ? "匯出備份" : "Export backup"}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleFilePick}>
              {language === "zh" ? "匯入備份" : "Import backup"}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className={styles.fileInput}
            onChange={handleFileChange}
          />
          {importError && <p className={styles.error}>{importError}</p>}

          {isFolderBackupSupported() && (
            <>
              <h3 className={styles.heading} style={{ marginTop: "var(--space-2)" }}>
                {language === "zh" ? "自動儲存到資料夾" : "Auto-save to folder"}
              </h3>
              {folderEnabled ? (
                <>
                  <p className={styles.hint}>
                    {language === "zh"
                      ? `已啟用 — 儲存到「${folderName}」，每次寫心得或匯出都會覆寫同一個檔案。`
                      : `Enabled — saving to “${folderName}”. Writing an insight or exporting overwrites the same file.`}
                  </p>
                  <Button size="sm" variant="ghost" onClick={() => void handleDisableFolderBackup()}>
                    {language === "zh" ? "停用" : "Disable"}
                  </Button>
                </>
              ) : (
                <>
                  <p className={styles.hint}>
                    {language === "zh"
                      ? "選擇一個裝置上的資料夾，之後心得與匯出會自動覆寫儲存到那裡。"
                      : "Pick a folder on this device — insights and exports will auto-save there, overwriting the same file."}
                  </p>
                  <Button size="sm" variant="ghost" onClick={() => void handleEnableFolderBackup()} disabled={folderBusy}>
                    {language === "zh" ? "選擇資料夾" : "Choose folder"}
                  </Button>
                </>
              )}
              {folderError && <p className={styles.error}>{folderError}</p>}
            </>
          )}
        </section>
      </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingImport)}
        title={language === "zh" ? "覆蓋目前資料？" : "Overwrite current data?"}
        message={
          language === "zh"
            ? "匯入備份將取代目前的心得與設定，且無法復原。"
            : "Importing will replace your current insights and settings. This can't be undone."
        }
        confirmLabel={language === "zh" ? "匯入" : "Import"}
        cancelLabel={language === "zh" ? "取消" : "Cancel"}
        onConfirm={confirmImport}
        onCancel={() => setPendingImport(null)}
      />
    </>
  );
}
