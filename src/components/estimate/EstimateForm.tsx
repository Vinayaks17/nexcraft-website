"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  FuelBracketLink,
  fuelBody,
  fuelLabel,
  fuelStatement,
} from "@/components/fuel/FuelPrimitives";
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
  const [data, setData] = useState<EstimateData>(emptyEstimate);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  /* Delivery failures are separate from field errors: the brief is valid, it
     just didn't arrive, and the visitor needs a different instruction. */
  const [sendError, setSendError] = useState<string | null>(null);
  /* Web3Forms' honeypot. Real people never see this field, so anything in it
     came from something filling inputs by name. */
  const [botcheck, setBotcheck] = useState("");

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
    setSendError(null);
    const result = await submitEstimate(data, botcheck);

    if (result.ok) {
      setStatus("success");
      return;
    }

    setStatus("idle");
    setSendError(result.message);
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="rounded-[3px] border border-cream/12 bg-surface p-8 sm:p-12"
        role="status"
      >
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className="gradient-brand flex h-12 w-12 items-center justify-center rounded-[3px] text-on-brand"
        >
          <Check className="h-6 w-6" strokeWidth={3} aria-hidden />
        </motion.span>

        <p className={cn(fuelLabel, "mt-8 text-primary")}>(04) Sent</p>

        <h2 className={cn(fuelStatement, "mt-4 max-w-[18ch] text-cream")}>
          {renderAccent(successState.heading)}
        </h2>
        <p className={cn(fuelBody, "mt-6 max-w-[48ch] text-cream/60")}>
          {successState.description}
        </p>
        <FuelBracketLink href={successState.cta.href} className="mt-10">
          {successState.cta.label}
        </FuelBracketLink>
      </motion.div>
    );
  }

  return (
    <div className="rounded-[3px] border border-cream/12 bg-surface p-6 sm:p-8">
      {/* Progress — a hairline rule per step that fills as you advance, with the
          step's own number beside its label. Square and flat: the pill-shaped
          gradient bars it replaced were the last rounded chrome on the page. */}
      <ol className="flex items-start gap-3" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s.id} className="flex flex-1 flex-col gap-2.5">
            <span
              className={cn(
                "h-[2px] w-full transition-colors duration-500",
                i <= step ? "bg-primary" : "bg-cream/12",
              )}
            />
            <span
              aria-current={i === step ? "step" : undefined}
              className={cn(
                fuelLabel,
                "flex items-baseline gap-1.5 transition-colors duration-300",
                i <= step ? "text-cream" : "text-cream/55",
              )}
            >
              <span className={i <= step ? "text-primary" : undefined}>
                ({s.num})
              </span>
              <span className="hidden sm:inline">{s.short}</span>
            </span>
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate className="mt-10">
        <p className={cn(fuelLabel, "text-cream/55")}>({steps[step].num})</p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className={cn(
            "mt-3 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-cream outline-none",
          )}
        >
          {steps[step].title}
        </h2>

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
                    <legend className="mb-3 font-mono text-[0.6875rem] leading-none tracking-[0.1em] text-cream/60 uppercase">
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
                    <legend className="mb-3 font-mono text-[0.6875rem] leading-none tracking-[0.1em] text-cream/60 uppercase">
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

        {/* Honeypot. Hidden from sight and from assistive tech, and taken out
            of the tab order — anything that fills it is not a visitor. */}
        <input
          type="text"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          value={botcheck}
          onChange={(e) => setBotcheck(e.target.value)}
          className="absolute top-0 left-0 h-0 w-0 overflow-hidden border-0 p-0 opacity-0"
        />

        {/* Delivery failure. `role="alert"` so it is announced the moment it
            appears — the visitor has just pressed send and is not looking for
            new text further up the form. */}
        {sendError && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={cn(
              fuelBody,
              "mt-8 rounded-[3px] border border-primary/40 bg-primary/10 px-4 py-3 text-cream",
            )}
          >
            {sendError}
          </motion.p>
        )}

        {/* Controls */}
        <div className="mt-9 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className={cn(fuelLabel, "inline-flex items-center gap-1.5 py-2 text-cream/60 transition-colors duration-200 hover:text-primary")}
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
