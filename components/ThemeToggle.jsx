"use client";

import { useEffect, useState } from "react";

/** Toggles light/dark theme by setting data-theme on <html> and persisting to localStorage. */
export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const t = (document.documentElement.dataset.theme) || "light";
    setTheme(t);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("iam-theme", next);
    } catch {
      /* ignore */
    }
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle}>
      <span style={{ fontSize: 15 }}>{theme === "light" ? "🌙" : "☀️"}</span>
      <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}

export default ThemeToggle;
