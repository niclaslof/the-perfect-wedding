import { ReactNode } from "react";

type HeroProps = {
  eyebrow: string;
  titleLine1: string;
  titleLine2?: string;
  intro?: ReactNode;
  meta?: string;
};

export default function Hero({
  eyebrow,
  titleLine1,
  titleLine2,
  intro,
  meta,
}: HeroProps) {
  return (
    <header className="mb-12 md:mb-16 relative">
      <div className="hidden md:block absolute -top-6 -left-6 w-5 h-5 border-l-2 border-t-2 border-stone-900 dark:border-stone-100" />

      <div className="text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] text-stone-500 dark:text-stone-400 uppercase mb-3 md:mb-4">
        {eyebrow}
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-stone-900 dark:text-stone-100 leading-[1.1] md:leading-[1.05] break-words">
        {titleLine1}
        {titleLine2 && (
          <span>
            <br />
            <span className="italic">{titleLine2}</span>
          </span>
        )}
      </h1>

      <div className="mt-4 md:mt-6 w-12 md:w-16 h-px bg-stone-900 dark:bg-stone-100" />

      {intro && (
        <div className="mt-4 md:mt-6 text-sm md:text-base text-stone-600 dark:text-stone-200 max-w-2xl leading-relaxed">
          {intro}
        </div>
      )}

      {meta && (
        <div className="mt-3 text-[10px] tracking-[0.15em] md:tracking-[0.2em] text-stone-500 dark:text-stone-400 uppercase font-mono">
          {meta}
        </div>
      )}
    </header>
  );
}
