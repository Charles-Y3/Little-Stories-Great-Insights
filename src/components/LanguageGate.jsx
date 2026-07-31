import React from "react";
import { useSettings } from "../context/SettingsContext";
import AppLogo from "./AppLogo";
import Button from "./Button";
import styles from "./LanguageGate.module.css";

export default function LanguageGate() {
  const { chooseLanguage } = useSettings();

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
      </div>
    </div>
  );
}
