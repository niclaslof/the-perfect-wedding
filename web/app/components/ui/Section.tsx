import { ReactNode } from "react";

type SectionProps = {
  number: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  spacing?: string;
};

export default function Section({
  number,
  title,
  intro,
  children,
  spacing = "mb-12 md:mb-16",
}: SectionProps) {
  return (
    <section className={spacing}>
      <div className="flex items-baseline gap-3 md:gap-4 mb-4 md:mb-6 flex-wrap">
        <span className="font-mono text-xs md:text-sm text-stone-500 dark:text-stone-400">
          &sect; {number}
        </span>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-serif text-stone-900 dark:text-stone-100 break-words">
          {title}
        </h2>
      </div>
      {intro && (
        <div className="text-sm md:text-base text-stone-600 dark:text-stone-200 leading-relaxed mb-4 md:mb-6 max-w-3xl">
          {intro}
        </div>
      )}
      {children}
    </section>
  );
}
