"use client";

import { useEffect, useState } from "react";
import { KEYS } from "../lib/storage";

/** Toggles light/dark theme by setting data-theme on <html> and persisting to localStorage. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const activeTheme =
      document.documentElement.dataset.theme ||
      localStorage.getItem(KEYS.theme) ||
      localStorage.getItem(KEYS.legacyTheme) ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    
    setTheme(activeTheme);
    document.documentElement.dataset.theme = activeTheme;
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEYS.theme, next);
    } catch {
      /* ignore */
    }
  }

  if (!mounted) {
    return (
      <button type="button" className="theme-toggle opacity-50" disabled>
        <span style={{ fontSize: 15 }}>☀️</span>
        <span>Theme Toggle</span>
      </button>
    );
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle visual theme">
      <span style={{ fontSize: 15 }}>{theme === "light" ? "🌙" : "☀️"}</span>
      <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
