"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FieldShellProps = {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
};

/** Label + control + inline error, wired together for screen readers. */
export function FieldShell({
  id,
  label,
  optional,
  error,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[0.75rem] font-medium tracking-[0.06em] text-cream uppercase"
      >
        {label}
        {optional && (
          <span className="ml-1.5 font-sans text-xs font-normal text-cream/55">
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-primary-light">
          {error}
        </p>
      )}
    </div>
  );
}

const controlClasses =
  "w-full rounded-2xl border-2 border-white/10 bg-surface-raised px-4 py-3 text-base text-cream " +
  "transition-colors duration-200 placeholder:text-cream/55 hover:border-white/20 " +
  /* Keeping the outline (rather than focus:outline-none + a border swap) means
     the focus ring stays visible against both the card and the input fill. */
  "focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary";

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  optional?: boolean;
  error?: string;
  autoComplete?: string;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  optional,
  error,
  autoComplete,
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} error={error}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClasses, error && "border-primary-light")}
      />
    </FieldShell>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
};

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 5,
}: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClasses, "resize-y", error && "border-primary-light")}
      />
    </FieldShell>
  );
}
