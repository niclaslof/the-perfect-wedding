import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
};

const VARIANTS: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5
        text-[10px] tracking-[0.15em] uppercase font-medium
        ${VARIANTS[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
