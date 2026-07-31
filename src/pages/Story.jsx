import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { getStory } from "../data/stories";
import StoryCard from "../components/StoryCard";
import NotFound from "./NotFound";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Story() {
  const { slug } = useParams();
  const { language } = useSettings();
  const story = getStory(slug);
  const [searchParams, setSearchParams] = useSearchParams();

  // `?insight=1` opens the card straight to the insight panel (used by the
  // My Insights list), then self-clears — same pattern as the sibling
  // project's Reader.jsx `?note=1`, so refreshing or sharing the link
  // doesn't keep re-opening the panel.
  const openInsight = searchParams.get("insight") === "1";
  useEffect(() => {
    if (openInsight) setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openInsight]);

  useDocumentTitle(story ? story.title[language] : slug);

  if (!story) return <NotFound />;

  return <StoryCard story={story} initialInsightOpen={openInsight} />;
}
