"use client";

import { Layers, Monitor, Workflow } from "lucide-react";

import { cn } from "@/lib/utils";

const optionIcons = { Monitor, Workflow, Layers };
export type OptionIconName = keyof typeof optionIcons;

/**
 * Both selectors wrap a real <input type="radio"> kept in `sr-only`, so arrow
 * keys, tab order, and form semantics come from the browser rather than being
 * re-implemented with role="radio".
 */

type OptionCardProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  description: string;
  icon: OptionIconName;
};

export function OptionCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  icon,
}: OptionCardProps) {
  const Icon = optionIcons[icon];

  return (
    <label className="group relative block cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <div
        className={cn(
          "flex h-full flex-col rounded-[3px] border bg-surface p-5 transition-colors duration-300",
          "border-cream/12 hover:border-primary/45 hover:bg-surface-raised",
          "peer-checked:border-primary peer-checked:bg-primary/10",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink",
        )}
      >
        <span
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-[3px] transition-colors duration-300",
            checked ? "gradient-brand text-on-brand" : "bg-primary/15 text-primary",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="mt-4 text-[1.0625rem] font-semibold tracking-[-0.02em] text-cream">
          {title}
        </span>
        <span className="mt-2 text-[0.8125rem] leading-[1.5] text-cream/60">
          {description}
        </span>
      </div>
    </label>
  );
}

type OptionChipProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
};

export function OptionChip({ name, value, checked, onChange, label }: OptionChipProps) {
  return (
    <label className="relative cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <span
        className={cn(
          "inline-flex items-center rounded-[3px] border px-4 py-2.5 font-mono text-[0.75rem] tracking-[0.04em] transition-colors duration-250",
          "border-cream/12 bg-surface text-cream/80 hover:border-primary/45 hover:text-cream",
          "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-on-brand",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink",
        )}
      >
        {label}
      </span>
    </label>
  );
}
