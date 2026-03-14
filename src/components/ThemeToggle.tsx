"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      className="theme-switch"
      aria-label="Toggle dark mode"
      aria-pressed={theme === 'dark'}
      type="button"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-switch-label" aria-hidden>{theme === 'dark' ? 'Dark' : 'Light'}</span>
      <span className="theme-switch-track" aria-hidden>
        <span className={`theme-switch-thumb ${theme === 'dark' ? 'is-dark' : ''}`}></span>
      </span>
    </button>
  );
}
