"use client";

import React, { useEffect, useState, useRef } from "react";
import { Palette, Sparkles, Sun, Moon, Check, Layout } from "lucide-react";

const PRESETS = [
  { id: "aurora", name: "Aurora Dream", gradient: "linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4)" },
  { id: "cyber", name: "GCP Cyber", gradient: "linear-gradient(135deg, #10b981, #0ea5e9, #6366f1)" },
  { id: "sunset", name: "Sunset Glow", gradient: "linear-gradient(135deg, #f43f5e, #f59e0b, #8b5cf6)" },
  { id: "cosmic", name: "Cosmic Nebula", gradient: "linear-gradient(135deg, #6366f1, #d946ef, #0284c7)" },
];

const MOTIONS = [
  { id: "flow", label: "Flowing Live" },
  { id: "pulse", label: "Pulse Glow" },
  { id: "static", label: "Static Soft" },
];

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [preset, setPreset] = useState("aurora");
  const [motion, setMotion] = useState("flow");
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("iam-theme") || localStorage.getItem("jira:theme");
      if (savedTheme === "dark") {
        document.documentElement.dataset.theme = "dark";
        setDark(true);
      }
      const savedPreset = localStorage.getItem("iam-bg-preset");
      if (savedPreset) {
        document.documentElement.dataset.bgPreset = savedPreset;
        setPreset(savedPreset);
      }
      const savedMotion = localStorage.getItem("iam-bg-motion");
      if (savedMotion) {
        document.documentElement.dataset.bgMotion = savedMotion;
        setMotion(savedMotion);
      }
    } catch (e) {}

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    try {
      if (next) {
        document.documentElement.dataset.theme = "dark";
        localStorage.setItem("iam-theme", "dark");
        localStorage.setItem("jira:theme", "dark");
      } else {
        delete document.documentElement.dataset.theme;
        localStorage.setItem("iam-theme", "light");
        localStorage.setItem("jira:theme", "light");
      }
    } catch (e) {}
  };

  const changePreset = (p) => {
    setPreset(p);
    try {
      if (p === "aurora") {
        delete document.documentElement.dataset.bgPreset;
        localStorage.removeItem("iam-bg-preset");
      } else {
        document.documentElement.dataset.bgPreset = p;
        localStorage.setItem("iam-bg-preset", p);
      }
    } catch (e) {}
  };

  const changeMotion = (m) => {
    setMotion(m);
    try {
      if (m === "flow") {
        delete document.documentElement.dataset.bgMotion;
        localStorage.removeItem("iam-bg-motion");
      } else {
        document.documentElement.dataset.bgMotion = m;
        localStorage.setItem("iam-bg-motion", m);
      }
    } catch (e) {}
  };

  const activeGradient = PRESETS.find((p) => p.id === preset)?.gradient || PRESETS[0].gradient;

  return (
    <div style={{ position: "relative", width: "100%" }} ref={menuRef}>
      <button
        className="theme-toggle"
        onClick={() => setOpen(!open)}
        type="button"
        title="Customize Theme & Gradient Palette"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Palette style={{ width: 16, height: 16, color: "var(--primary)" }} />
          <span>Live Theme</span>
        </div>
        <div className="theme-swatch-badge" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: activeGradient,
              boxShadow: "0 0 6px rgba(124, 58, 237, 0.4)",
            }}
          />
        </div>
      </button>

      {open && (
        <div className="theme-popover">
          <div className="theme-popover-header">
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 13 }}>
              <Sparkles style={{ width: 14, height: 14, color: "var(--primary)" }} />
              <span>Theme & Layout</span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-mode-btn"
              title="Toggle Light/Dark Mode"
            >
              {dark ? <Sun style={{ width: 14, height: 14 }} /> : <Moon style={{ width: 14, height: 14 }} />}
              <span>{dark ? "Dark" : "Light"}</span>
            </button>
          </div>

          <div className="theme-section-label">Gradient Palette</div>
          <div className="preset-grid">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => changePreset(p.id)}
                className={`preset-card ${preset === p.id ? "active" : ""}`}
              >
                <div className="preset-swatch" style={{ background: p.gradient }} />
                <span>{p.name}</span>
                {preset === p.id && <Check style={{ width: 12, height: 12, marginLeft: "auto", color: "var(--primary)" }} />}
              </button>
            ))}
          </div>

          <div className="theme-section-label" style={{ marginTop: 10 }}>Motion Animation</div>
          <div className="motion-selector">
            {MOTIONS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => changeMotion(m.id)}
                className={`motion-btn ${motion === m.id ? "active" : ""}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
