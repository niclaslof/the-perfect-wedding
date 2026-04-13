import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "emphasis" | "subtle" | "inverted";
  corners?: boolean;
  hover?: boolean;
};

const SIZES: Record<NonNullable<CardProps["size"]>, string> = {
  sm: "p-4 md:p-6",
  md: "p-5 md:p-8",
  lg: "p-6 md:p-10",
};

const VARIANTS: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "bg-white dark:bg-[#1a1918] border border-stone-200 dark:border-stone-800",
  emphasis: "bg-white dark:bg-[#1a1918] border-2 border-stone-900 dark:border-stone-100",
  subtle: "bg-[#eae6df] dark:bg-[#14130f] border border-stone-300 dark:border-stone-800 text-stone-800 dark:text-stone-200",
  inverted: "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900",
};

const CORNER_BASE = "absolute w-3 h-3";

export default function Card({
  children,
  className = "",
  size = "md",
  variant = "default",
  corners = true,
  hover = false,
}: CardProps) {
  const cornerColor =
    variant === "inverted"
      ? "border-stone-100 dark:border-stone-900"
      : "border-stone-900 dark:border-stone-100";

  return (
    <div
      className={`${VARIANTS[variant]} ${SIZES[size]} relative ${hover ? "card-hover" : ""} ${className}`}
    >
      {corners && (
        <>
          <div aria-hidden="true" className={`${CORNER_BASE} ${cornerColor} top-0 left-0 border-l-2 border-t-2`} />
          <div aria-hidden="true" className={`${CORNER_BASE} ${cornerColor} top-0 right-0 border-r-2 border-t-2`} />
          <div aria-hidden="true" className={`${CORNER_BASE} ${cornerColor} bottom-0 left-0 border-l-2 border-b-2`} />
          <div aria-hidden="true" className={`${CORNER_BASE} ${cornerColor} bottom-0 right-0 border-r-2 border-b-2`} />
        </>
      )}
      {children}
    </div>
  );
}
