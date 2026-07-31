import React, { useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { applyPwaUpdate, subscribePwaNeedRefresh } from "../utils/pwaUpdate";
import Button from "./Button";
import styles from "./UpdateBanner.module.css";

export default function UpdateBanner() {
  const { language } = useSettings();
  const [available, setAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => subscribePwaNeedRefresh(setAvailable), []);

  if (!available || dismissed) return null;

  return (
    <div className={styles.banner} role="status">
      <span className={styles.body}>
        {language === "zh"
          ? "小故事大啟發有新內容可用。"
          : "A new version of Little Stories is ready."}
      </span>
      <div className={styles.actions}>
        <Button variant="primary" size="sm" onClick={() => applyPwaUpdate()}>
          {language === "zh" ? "重新載入以更新" : "Reload to update"}
        </Button>
        <Button variant="ghost" size="sm" className={styles.later} onClick={() => setDismissed(true)}>
          {language === "zh" ? "稍後" : "Later"}
        </Button>
      </div>
    </div>
  );
}
