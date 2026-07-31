import { useEffect } from "react";

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — Little Stories Great Insights` : "Little Stories Great Insights";
  }, [title]);
}
