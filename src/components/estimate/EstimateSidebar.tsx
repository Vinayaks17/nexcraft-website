import { Mail } from "lucide-react";

import { contactFallback, whatHappensNext } from "@/lib/estimate-content";
import { contact } from "@/lib/site";

export function EstimateSidebar() {
  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-2xl border border-white/8 bg-surface p-6">
        <h2 className="font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase">
          {whatHappensNext.heading}
        </h2>

        <ol className="mt-5 flex flex-col gap-5">
          {whatHappensNext.steps.map((step, i) => (
            <li key={step.number} className="relative flex gap-4">
              {/* Connector between the numbered markers */}
              {i < whatHappensNext.steps.length - 1 && (
                <span
                  className="absolute top-9 left-[15px] h-[calc(100%+4px)] w-px bg-primary/30"
                  aria-hidden
                />
              )}
              <span className="gradient-brand relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading text-[0.6875rem] font-semibold text-on-brand">
                {step.number}
              </span>
              <div>
                <h3 className="font-heading text-sm font-semibold text-cream">
                  {step.title}
                </h3>
                <p className="mono-caption mt-1.5 text-cream/70">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-white/8 bg-surface p-6">
        <h2 className="font-heading text-sm font-semibold text-cream">
          {contactFallback.heading}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-cream/70">
          {contactFallback.description}
        </p>
        <a
          href={`mailto:${contact.email}`}
          className="mt-4 inline-flex items-center gap-2.5 font-heading text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-light"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {contact.email}
        </a>
      </div>
    </aside>
  );
}

export default EstimateSidebar;
