import React, { useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import AppLogo from "./AppLogo";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";
import { readBackupFile, applyBackup, isValidBackup } from "../utils/backup";
import { flagJustImported } from "../utils/backupReminder";
import styles from "./LanguageGate.module.css";

export default function LanguageGate() {
  const { chooseLanguage } = useSettings();
  const fileInputRef = useRef(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [importError, setImportError] = useState("");

  const handleFilePick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const obj = await readBackupFile(file);
      if (!isValidBackup(obj)) {
        setImportError("That doesn't look like a valid backup file. / 備份檔案格式不正確。");
        return;
      }
      setImportError("");
      setPendingImport(obj);
    } catch {
      setImportError("Could not read that file. / 無法讀取備份檔案。");
    }
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    applyBackup(pendingImport);
    setPendingImport(null);
    flagJustImported();
    window.location.reload();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="lang-gate-title">
      <div className={styles.card}>
        <AppLogo size={88} />
        <h1 id="lang-gate-title" className={styles.title}>
          Little Stories
        </h1>
        <p className={styles.subtitle}>
          Great Insights
          <br />
          小故事大啟發
        </p>
        <p className={styles.prompt}>
          Choose your reading language
          <br />
          請選擇閱讀語言
        </p>
        <div className={styles.actions}>
          <Button variant="primary" block onClick={() => chooseLanguage("zh")}>
            中文
          </Button>
          <Button variant="gold" block onClick={() => chooseLanguage("en")}>
            English
          </Button>
        </div>
        <p className={styles.hint}>
          You can change this later in Settings
          <br />
          之後可在設定中更改
        </p>
        <p className={styles.importHint}>
          Load your previously saved data instead — restores your insights,
          language, and settings from a backup file.
          <br />
          或載入先前儲存的資料——從備份檔還原您的心得、語言與設定。
        </p>
        <Button variant="ghost" size="sm" onClick={handleFilePick}>
          Import backup / 匯入備份
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className={styles.fileInput}
          onChange={handleFileChange}
        />
        {importError && <p className={styles.error}>{importError}</p>}
      </div>

      <ConfirmDialog
        open={Boolean(pendingImport)}
        title="Overwrite current data? / 覆蓋目前資料？"
        message="Importing will replace your current insights and settings. This can't be undone. / 匯入備份將取代目前的心得與設定，且無法復原。"
        confirmLabel="Import / 匯入"
        cancelLabel="Cancel / 取消"
        onConfirm={confirmImport}
        onCancel={() => setPendingImport(null)}
      />
    </div>
  );
}
