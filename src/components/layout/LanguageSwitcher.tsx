"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const LANGUAGES = ["EN", "NL"] as const;
type Language = (typeof LANGUAGES)[number];

type LanguageSwitcherProps = {
  className?: string;
  /** `onLight` inverts for the cream CTA section. */
  tone?: "light" | "onLight";
};

/**
 * UI only — no i18n wiring yet. Swapping this for a locale router later only
 * needs the onClick to push the localized route.
 */
export function LanguageSwitcher({ className, tone = "light" }: LanguageSwitcherProps) {
  const [active, setActive] = useState<Language>("EN");

  return (
    <div
      className={cn("flex items-center gap-1 text-[0.8125rem] font-heading", className)}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((lang, i) => (
        <span key={lang} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden className={tone === "onLight" ? "text-ink/25" : "text-cream/30"}>
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => setActive(lang)}
            aria-pressed={active === lang}
            className={cn(
              "rounded-full px-1 py-0.5 transition-colors duration-200",
              active === lang
                ? tone === "onLight"
                  ? "font-bold text-ink"
                  : "font-bold text-cream"
                : tone === "onLight"
                  ? "font-medium text-ink/50 hover:text-ink"
                  : "font-medium text-cream/55 hover:text-cream",
            )}
          >
            {lang}
          </button>
        </span>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
