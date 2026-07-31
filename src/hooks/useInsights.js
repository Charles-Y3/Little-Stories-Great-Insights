import useLocalStorage from "./useLocalStorage";
import { lsgiKey } from "../utils/storage";

// One insight per story, not per language — `lang` records which reading
// language it was written in (for correct font/lang attribute on redisplay)
// but does not key the record, so toggling content language mid-thought
// never splits or hides what's already been written. Upsert-by-filter-and-
// append, empty text deletes the record, saves on every keystroke — same
// shape as the sibling project's useNotes.js.
export default function useInsights() {
  const [insights, setInsights] = useLocalStorage(lsgiKey("insights"), []);

  const getInsight = (slug) => insights.find((i) => i.slug === slug) || null;

  const hasInsight = (slug) => {
    const entry = insights.find((i) => i.slug === slug);
    return Boolean(entry && entry.text.trim());
  };

  const setInsight = (slug, text, lang, promptIndex = 0) => {
    setInsights((list) => {
      const trimmed = text.trim();
      const without = list.filter((i) => i.slug !== slug);
      if (!trimmed) return without;
      return [...without, { slug, text, lang, promptIndex, updatedAt: Date.now() }];
    });
  };

  const removeInsight = (slug) => {
    setInsights((list) => list.filter((i) => i.slug !== slug));
  };

  return { insights, getInsight, hasInsight, setInsight, removeInsight };
}
