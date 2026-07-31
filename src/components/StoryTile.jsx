import React from "react";
import { Link } from "react-router-dom";
import { storyHref } from "../utils/routes";
import styles from "./StoryTile.module.css";

// Miniature of the card front — same image, same title-over-scrim
// treatment — so tapping a tile into the full card reads as a zoom, not a
// jump to something unrelated. The `tile-${slug}` id is the anchor Story.jsx
// (Phase 5) will restore focus to when a card closes.
export default function StoryTile({ story, language }) {
  const img = story.image;
  return (
    <Link
      to={storyHref(story.id)}
      id={`tile-${story.id}`}
      className={styles.tile}
      style={{ backgroundImage: `url(${img.lqip})` }}
    >
      <img
        src={img.thumb}
        width={img.width}
        height={img.height}
        alt=""
        loading="lazy"
        decoding="async"
        className={styles.image}
      />
      <span className={styles.scrim} aria-hidden="true" />
      <span className={styles.title} lang={language === "zh" ? "zh-Hant" : "en"}>
        {story.title[language]}
      </span>
    </Link>
  );
}
