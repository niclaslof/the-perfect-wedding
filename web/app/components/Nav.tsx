"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ui/ThemeToggle";

const links = [
  { href: "/", label: "Hem" },
  { href: "/info", label: "Info" },
  { href: "/schedule", label: "Schema" },
  { href: "/chat", label: "Chat" },
  { href: "/guestbook", label: "Gästbok" },
  { href: "/photos", label: "Foton" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 dark:border-stone-800 bg-[var(--background)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 md:px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-7 h-7 border-2 border-stone-900 dark:border-stone-100 flex items-center justify-center">
            <span className="text-[10px] font-serif font-bold leading-none">W</span>
          </div>
          <span className="text-sm font-serif tracking-wide text-stone-900 dark:text-stone-100 hidden sm:block">
            The Perfect Wedding
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 text-xs tracking-[0.1em] uppercase transition-colors ${
                pathname === link.href
                  ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-stone-600 dark:text-stone-400"
            aria-label="Meny"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-[var(--background)] px-4 py-4">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 text-xs tracking-[0.1em] uppercase transition-colors ${
                  pathname === link.href
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                    : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
