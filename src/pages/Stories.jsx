import React from "react";
import { useSearchParams } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import stories from "../data/stories";
import AppShell from "../components/AppShell";
import HeaderHomeLink from "../components/HeaderHomeLink";
import StoryTile from "../components/StoryTile";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { searchStories } from "../utils/search";
import styles from "./Stories.module.css";

export default function Stories() {
  const { language } = useSettings();
  const title = language === "zh" ? "故事目錄" : "Story catalog";
  useDocumentTitle(title);
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";

  const results = searchStories(q, language, stories).map((hit) => hit.story);

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
      <p className={styles.lede}>
        {language === "zh"
          ? "挑選一則小故事，翻開卡片細讀，再寫下你的心得。"
          : "Pick a short story, flip the card to read, then write what it stirs in you."}
      </p>

      <div className={styles.searchRow}>
        <input
          type="search"
          className={styles.search}
          value={q}
          onChange={(e) => {
            const next = e.target.value;
            setParams(next ? { q: next } : {}, { replace: true });
          }}
          placeholder={language === "zh" ? "搜尋故事…" : "Search stories…"}
          aria-label={language === "zh" ? "搜尋故事" : "Search stories"}
        />
      </div>

      <p className={styles.count}>
        {language === "zh"
          ? `找到 ${results.length} 個故事`
          : `${results.length} ${results.length === 1 ? "story" : "stories"} found`}
      </p>

      {results.length > 0 ? (
        <div className={styles.grid}>
          {results.map((story) => (
            <StoryTile key={story.id} story={story} language={language} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          {language === "zh" ? "沒有符合的故事。" : "No stories match your search."}
        </p>
      )}
    </AppShell>
  );
}
