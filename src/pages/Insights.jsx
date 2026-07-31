import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import stories from "../data/stories";
import useInsights from "../hooks/useInsights";
import AppShell from "../components/AppShell";
import HeaderHomeLink from "../components/HeaderHomeLink";
import useDocumentTitle from "../hooks/useDocumentTitle";
import styles from "./Insights.module.css";

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function Insights() {
  const { language } = useSettings();
  useDocumentTitle(language === "zh" ? "我的心得" : "My Insights");
  const { insights } = useInsights();

  const rows = insights
    .map((entry) => ({ entry, story: stories.find((s) => s.id === entry.slug) }))
    .filter((r) => r.story)
    .sort((a, b) => b.entry.updatedAt - a.entry.updatedAt);

  return (
    <AppShell header={<HeaderHomeLink language={language} />}>
      {rows.length === 0 ? (
        <p className={styles.empty}>
          {language === "zh" ? "你還沒有寫下任何心得。" : "You haven't written any insights yet."}
        </p>
      ) : (
        <ul className={styles.list}>
          {rows.map(({ entry, story }) => (
            <li key={entry.slug}>
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
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
