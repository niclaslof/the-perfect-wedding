import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 dark:text-stone-400"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5
          bg-white dark:bg-[#1a1918]
          border ${error ? "border-red-500" : "border-stone-300 dark:border-stone-700"}
          text-stone-900 dark:text-stone-100
          placeholder:text-stone-400 dark:placeholder:text-stone-600
          focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:ring-offset-1
          font-sans text-sm
          transition-colors
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
      )}
    </div>
  );
}
