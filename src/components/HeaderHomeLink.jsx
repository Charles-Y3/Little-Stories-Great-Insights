import React from "react";
import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";
import styles from "./HeaderHomeLink.module.css";

/** Compact seal logo that navigates to the home page. */
export default function HeaderHomeLink({ language = "zh", size = 42 }) {
  return (
    <Link
      to="/"
      className={styles.link}
      aria-label={language === "zh" ? "返回首頁" : "Back to home"}
    >
      <AppLogo size={size} />
    </Link>
  );
}
