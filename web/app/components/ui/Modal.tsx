"use client";

import { ReactNode, useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export default function Modal({ open, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative bg-white dark:bg-[#1a1918] border border-stone-200 dark:border-stone-800 w-full max-w-md p-6 md:p-8">
        {/* Corner markers */}
        <div aria-hidden="true" className="absolute w-3 h-3 top-0 left-0 border-l-2 border-t-2 border-stone-900 dark:border-stone-100" />
        <div aria-hidden="true" className="absolute w-3 h-3 top-0 right-0 border-r-2 border-t-2 border-stone-900 dark:border-stone-100" />
        <div aria-hidden="true" className="absolute w-3 h-3 bottom-0 left-0 border-l-2 border-b-2 border-stone-900 dark:border-stone-100" />
        <div aria-hidden="true" className="absolute w-3 h-3 bottom-0 right-0 border-r-2 border-b-2 border-stone-900 dark:border-stone-100" />

        {title && (
          <h2 className="text-lg font-serif text-stone-900 dark:text-stone-100 mb-4">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
