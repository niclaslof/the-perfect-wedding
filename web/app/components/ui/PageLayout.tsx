import { ReactNode } from "react";
import Nav from "../Nav";

type PageLayoutProps = {
  children: ReactNode;
  maxWidth?: "max-w-3xl" | "max-w-4xl" | "max-w-5xl" | "max-w-6xl";
  footer?: ReactNode;
  /** Hide nav (e.g. on login page) */
  hideNav?: boolean;
};

export default function PageLayout({
  children,
  maxWidth = "max-w-5xl",
  footer,
  hideNav = false,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <a href="#main-content" className="skip-to-content">
        Hoppa till innehåll
      </a>
      {!hideNav && <Nav />}
      {/* Blueprint grid background — light */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-[0.025] dark:opacity-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Blueprint grid background — dark */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-0 dark:opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <main
        id="main-content"
        className={`${maxWidth} mx-auto px-4 md:px-6 py-10 md:py-16 relative`}
      >
        {children}
        {footer ?? <DefaultFooter />}
      </main>
    </div>
  );
}

function DefaultFooter() {
  return (
    <footer className="mt-20 pt-12 border-t border-stone-300 dark:border-stone-800 text-xs tracking-[0.18em] text-stone-500 dark:text-stone-400 uppercase">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="font-serif normal-case tracking-normal text-sm text-stone-700 dark:text-stone-300">
          The Perfect Wedding
        </span>
        <span className="font-mono text-[10px]">
          2026
        </span>
      </div>
    </footer>
  );
}
