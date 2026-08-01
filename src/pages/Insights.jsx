import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import stories from "../data/stories";
import useInsights from "../hooks/useInsights";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import HeaderHomeLink from "../components/HeaderHomeLink";
import useDocumentTitle from "../hooks/useDocumentTitle";
import styles from "./Insights.module.css";

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function Insights() {
  const { language } = useSettings();
  const title = language === "zh" ? "我的心得" : "My Insights";
  useDocumentTitle(title);
  const { insights, removeInsight } = useInsights();
  const [pendingDelete, setPendingDelete] = useState(null);

  const rows = insights
    .map((entry) => ({ entry, story: stories.find((s) => s.id === entry.slug) }))
    .filter((r) => r.story)
    .sort((a, b) => b.entry.updatedAt - a.entry.updatedAt);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    removeInsight(pendingDelete.slug);
    setPendingDelete(null);
  };

  return (
    <AppShell
      header={
        <div className={styles.headerBar}>
          <HeaderHomeLink language={language} />
          <h1 className={styles.headerTitle}>{title}</h1>
          {/* Balances the logo so the title stays optically centered. */}
          <span className={styles.headerBalance} aria-hidden="true" />
        </div>
      }
    >
      {rows.length === 0 ? (
        <p className={styles.empty}>
          {language === "zh" ? "你還沒有寫下任何心得。" : "You haven't written any insights yet."}
        </p>
      ) : (
        <ul className={styles.list}>
          {rows.map(({ entry, story }) => (
            <li key={entry.slug} className={styles.item}>
              <Link to={`/stories/${encodeURIComponent(entry.slug)}?insight=1`} className={styles.row}>
                <img src={story.image.thumb} alt="" className={styles.thumb} loading="lazy" />
                <div className={styles.rowBody}>
                  <span className={styles.rowTitle} lang={language === "zh" ? "zh-Hant" : "en"}>
                    {story.title[language]}
                  </span>
                  <span className={styles.rowSnippet} lang={entry.lang === "zh" ? "zh-Hant" : "en"}>
                    {entry.text.split("\n")[0].slice(0, 60)}
                  </span>
                  <span className={styles.rowDate}>{formatDate(entry.updatedAt)}</span>
                </div>
              </Link>
              <Button
                variant="ghost"
                icon
                className={styles.deleteBtn}
                onClick={() => setPendingDelete({ slug: entry.slug, title: story.title[language] })}
                aria-label={language === "zh" ? "刪除心得" : "Delete insight"}
                title={language === "zh" ? "刪除心得" : "Delete insight"}
              >
                ✕
              </Button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={language === "zh" ? "刪除這則心得？" : "Delete this insight?"}
        message={
          language === "zh"
            ? `確定要刪除「${pendingDelete?.title || ""}」的心得？此操作無法復原。`
            : `Delete your insight for “${pendingDelete?.title || ""}”? This can't be undone.`
        }
        confirmLabel={language === "zh" ? "刪除" : "Delete"}
        cancelLabel={language === "zh" ? "取消" : "Cancel"}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AppShell>
  );
}
