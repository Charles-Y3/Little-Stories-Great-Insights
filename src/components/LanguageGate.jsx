import React, { useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import AppLogo from "./AppLogo";
import Button from "./Button";
import { readBackupFile, applyBackup, isValidBackup } from "../utils/backup";
import { flagJustImported } from "../utils/backupReminder";
import { isFolderBackupSupported, importFromFolder } from "../utils/folderBackup";
import styles from "./LanguageGate.module.css";

export default function LanguageGate() {
  const { chooseLanguage } = useSettings();
  const fileInputRef = useRef(null);
  const [importError, setImportError] = useState("");
  const [importBusy, setImportBusy] = useState(false);

  // Nothing to protect with an "overwrite?" confirm here — this screen only
  // shows when storage was just wiped or on first launch, so there's no
  // existing data yet. Apply immediately once the backup is read, rather
  // than adding a fourth prompt on top of the two the browser already
  // shows for folder + write-access permission.
  const applyAndReload = (backup) => {
    applyBackup(backup);
    flagJustImported();
    window.location.reload();
  };

  // When the File System Access API is available, one folder picker does
  // double duty: it reads the backup file out of the chosen folder AND
  // re-grants auto-save access to that same folder — so restoring data and
  // re-enabling auto-save after storage was cleared is a single action.
  // Falls back to a plain file picker (readBackupFile) where unsupported.
  const handleImportClick = async () => {
    if (!isFolderBackupSupported()) {
      fileInputRef.current?.click();
      return;
    }
    setImportError("");
    setImportBusy(true);
    try {
      const { backup } = await importFromFolder();
      if (!isValidBackup(backup)) {
        setImportError("That folder's backup file doesn't look valid. / 該資料夾內的備份檔案格式不正確。");
        return;
      }
      applyAndReload(backup);
    } catch (err) {
      if (err?.name !== "AbortError") {
        setImportError(
          err?.message === "NO_BACKUP_FILE"
            ? "No backup file found in that folder. / 該資料夾內找不到備份檔案。"
            : "Could not read that folder. / 無法讀取該資料夾。"
        );
      }
    } finally {
      setImportBusy(false);
    }
  };

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
      applyAndReload(obj);
    } catch {
      setImportError("Could not read that file. / 無法讀取備份檔案。");
    }
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
          Load saved data from a folder — select the folder you previously
          used for auto-save.
          <br />
          從資料夾載入已儲存的資料——選擇您先前用於自動儲存的資料夾。
        </p>
        <Button variant="ghost" size="sm" onClick={() => void handleImportClick()} disabled={importBusy}>
          Select folder / 選擇資料夾
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
    </div>
  );
}
