import React from "react";
import styles from "./AppShell.module.css";

export default function AppShell({
  header,
  footer,
  children,
  bodyRef,
  className = "",
  compactHeader = false
}) {
  return (
    <div className={styles.shell}>
      <div className={`${styles.frame} ${className}`}>
        {header && (
          <header className={`${styles.header} ${compactHeader ? styles.headerCompact : ""}`.trim()}>
            {header}
          </header>
        )}
        <main className={styles.body} ref={bodyRef}>
          {children}
        </main>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  );
}
