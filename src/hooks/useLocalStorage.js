import { useState, useEffect } from "react";
import { readJSON, writeJSON } from "../utils/storage";

export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => readJSON(key, defaultValue));

  useEffect(() => {
    writeJSON(key, value);
  }, [key, value]);

  return [value, setValue];
}
