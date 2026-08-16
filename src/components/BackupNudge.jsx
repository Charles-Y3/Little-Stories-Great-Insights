import React from "react";
import { useSettings } from "../context/SettingsContext";
import Button from "./Button";
import styles from "./BackupNudge.module.css";

export default function BackupNudge({ open, onExport, onDismiss }) {
  const { language } = useSettings();
  if (!open) return null;
  return (
    <div className={styles.toast} role="status">
      <p className={styles.text}>
        {language === "zh"
          ? "此裝置未自動備份 — 要匯出一份心得嗎？"
          : "This device isn't auto-backing up — export your insights?"}
      </p>
      <div className={styles.actions}>
        <Button variant="gold" size="sm" onClick={onExport}>
          {language === "zh" ? "匯出" : "Export"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          {language === "zh" ? "稍後" : "Not now"}
        </Button>
      </div>
    </div>
  );
}
