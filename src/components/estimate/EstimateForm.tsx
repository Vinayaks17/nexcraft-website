"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { renderAccent } from "@/components/ui/AccentWord";
import { OptionCard, OptionChip } from "@/components/estimate/OptionInputs";
import { TextAreaField, TextField } from "@/components/estimate/FormField";
import {
  budgetOptions,
  needOptions,
  steps,
  successState,
  timelineOptions,
} from "@/lib/estimate-content";
import {
  emptyEstimate,
  isPlanId,
  planLabels,
  planToNeed,
  submitEstimate,
  validateStep,
  type BudgetId,
  type Errors,
  type EstimateData,
  type NeedId,
  type TimelineId,
} from "@/lib/estimate";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export function EstimateForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const initialPlan = isPlanId(planParam) ? planParam : null;

  // Lazy initialisers so the ?plan= prefill is applied on the very first render
  // rather than being patched in afterwards.
  const [data, setData] = useState<EstimateData>(() => ({
    ...emptyEstimate,
    plan: initialPlan,
    need: initialPlan ? planToNeed(initialPlan) : null,
  }));
  const [showPlanChip, setShowPlanChip] = useState(() => initialPlan !== null);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const headingRef = useRef<HTMLHeadingElement>(null);

  const update = <K extends keyof EstimateData>(key: K, value: EstimateData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    // Clear the error for a field as soon as the visitor fixes it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const goTo = (next: number, dir: number) => {
    setDirection(dir);
    setStep(next);
    // Move focus to the new step so keyboard and screen-reader users land in
    // the right place instead of at the top of the document.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const handleNext = () => {
    const found = validateStep(step, data);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    goTo(step + 1, 1);
  };

  const handleBack = () => {
    setErrors({});
    goTo(step - 1, -1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // The last step submits; earlier steps advance (covers Enter-to-submit).
    if (step < steps.length - 1) {
      handleNext();
      return;
    }

    const found = validateStep(step, data);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    const result = await submitEstimate(data);
    setStatus(result.ok ? "success" : "idle");
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="rounded-2xl border border-primary/30 bg-surface p-8 text-center shadow-lift sm:p-12"
        role="status"
      >
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className="gradient-brand mx-auto flex h-16 w-16 items-center justify-center rounded-full text-on-brand shadow-glow"
        >
          <Check className="h-8 w-8" strokeWidth={3} aria-hidden />
        </motion.span>
        <h2 className="mt-6 text-[1.75rem] sm:text-4xl">{renderAccent(successState.heading)}</h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-cream/70">
          {successState.description}
        </p>
        <div className="mt-8 flex justify-center">
          <Button href={successState.cta.href} variant="outline">
            {successState.cta.label}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-surface p-6 shadow-soft sm:p-8">
      {/* Progress */}
      <ol className="flex items-center gap-2" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s.id} className="flex flex-1 flex-col gap-2">
            <span
              className={cn(
                "h-1.5 w-full rounded-full transition-colors duration-500",
                i <= step ? "gradient-brand" : "bg-cream/12",
              )}
            />
            <span
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase transition-colors duration-300",
                i <= step ? "text-primary" : "text-cream/50",
              )}
            >
              {s.short}
            </span>
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate className="mt-8">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl outline-none sm:text-3xl"
        >
          {steps[step].title}
        </h2>

        {/* Plan prefill chip */}
        <AnimatePresence>
          {showPlanChip && data.plan && step === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream px-3.5 py-1.5"
            >
              <span className="font-mono text-[0.6875rem] font-semibold tracking-[0.04em] text-ink">
                Customising: {planLabels[data.plan]}
              </span>
              <button
                type="button"
                onClick={() => setShowPlanChip(false)}
                aria-label="Dismiss selected plan"
                className="rounded-full p-0.5 text-ink/60 transition-colors hover:text-ink"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mt-6">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: EASE }}
            >
              {step === 0 && (
                <fieldset>
                  <legend className="sr-only">What do you need?</legend>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {needOptions.map((option) => (
                      <OptionCard
                        key={option.id}
                        name="need"
                        value={option.id}
                        checked={data.need === option.id}
                        onChange={(value) => update("need", value as NeedId)}
                        title={option.title}
                        description={option.description}
                        icon={option.icon}
                      />
                    ))}
                  </div>
                  {errors.need && (
                    <p role="alert" className="mt-3 text-sm font-medium text-primary-light">
                      {errors.need}
                    </p>
                  )}
                </fieldset>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-7">
                  <fieldset>
                    <legend className="mb-3 font-mono text-[0.75rem] font-medium tracking-[0.06em] text-cream uppercase">
                      Budget range
                    </legend>
                    <div className="flex flex-wrap gap-2.5">
                      {budgetOptions.map((option) => (
                        <OptionChip
                          key={option.id}
                          name="budget"
                          value={option.id}
                          checked={data.budget === option.id}
                          onChange={(value) => update("budget", value as BudgetId)}
                          label={option.label}
                        />
                      ))}
                    </div>
                    {errors.budget && (
                      <p role="alert" className="mt-3 text-sm font-medium text-primary-light">
                        {errors.budget}
                      </p>
                    )}
                  </fieldset>

                  <fieldset>
                    <legend className="mb-3 font-mono text-[0.75rem] font-medium tracking-[0.06em] text-cream uppercase">
                      Timeline
                    </legend>
                    <div className="flex flex-wrap gap-2.5">
                      {timelineOptions.map((option) => (
                        <OptionChip
                          key={option.id}
                          name="timeline"
                          value={option.id}
                          checked={data.timeline === option.id}
                          onChange={(value) => update("timeline", value as TimelineId)}
                          label={option.label}
                        />
                      ))}
                    </div>
                    {errors.timeline && (
                      <p role="alert" className="mt-3 text-sm font-medium text-primary-light">
                        {errors.timeline}
                      </p>
                    )}
                  </fieldset>

                  <TextAreaField
                    id="details"
                    label="Tell us about your project"
                    value={data.details}
                    onChange={(value) => update("details", value)}
                    placeholder="What are you building, who's it for, and what does success look like?"
                    error={errors.details}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    id="name"
                    label="Name"
                    value={data.name}
                    onChange={(value) => update("name", value)}
                    autoComplete="name"
                    error={errors.name}
                  />
                  <TextField
                    id="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(value) => update("email", value)}
                    autoComplete="email"
                    error={errors.email}
                  />
                  <TextField
                    id="company"
                    label="Company"
                    value={data.company}
                    onChange={(value) => update("company", value)}
                    autoComplete="organization"
                    optional
                  />
                  <TextField
                    id="phone"
                    label="Phone / WhatsApp"
                    type="tel"
                    value={data.phone}
                    onChange={(value) => update("phone", value)}
                    autoComplete="tel"
                    optional
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-9 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-heading text-sm font-medium text-cream/70 transition-colors duration-200 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Back
            </button>
          ) : (
            <span />
          )}

          <Button type="submit" size="lg" disabled={status === "submitting"}>
            {step < steps.length - 1
              ? "Continue"
              : status === "submitting"
                ? "Sending…"
                : "Send my request"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EstimateForm;
