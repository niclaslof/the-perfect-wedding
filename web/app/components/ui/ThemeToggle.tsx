"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("wedding-theme", next);
    } catch {
      /* ignore */
    }
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  if (theme === null) {
    return <div aria-hidden="true" className="w-9 h-9 md:w-10 md:h-10" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Byt till ljust tema" : "Byt till mörkt tema"}
      title={isDark ? "Byt till ljust tema" : "Byt till mörkt tema"}
      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
      <rect x="9" y="9" width="6" height="6" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="5" y1="5" x2="7" y2="7" />
      <line x1="17" y1="17" x2="19" y2="19" />
      <line x1="5" y1="19" x2="7" y2="17" />
      <line x1="17" y1="7" x2="19" y2="5" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
      <path d="M20 15A9 9 0 0 1 9 4 7 7 0 1 0 20 15Z" />
    </svg>
  );
}
