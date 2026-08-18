/**
 * Estimate form types, validation, and the single submission entry point.
 */

export type PlanId = "basic" | "business" | "enterprise" | "automation";
export type NeedId = "website" | "automation" | "both";
export type BudgetId = "under-800" | "800-2500" | "2500-5000" | "5000-plus" | "unsure";
export type TimelineId = "asap" | "1-2-months" | "flexible";

export type EstimateData = {
  need: NeedId | null;
  budget: BudgetId | null;
  timeline: TimelineId | null;
  details: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  /** Set when the visitor arrived from a pricing card. */
  plan: PlanId | null;
};

export const emptyEstimate: EstimateData = {
  need: null,
  budget: null,
  timeline: null,
  details: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  plan: null,
};

/** Human-readable plan names, used by the "Customising: …" chip. */
export const planLabels: Record<PlanId, string> = {
  basic: "Basic Website",
  business: "Business Website",
  enterprise: "Enterprise Website",
  automation: "Custom Business Automation",
};

export function isPlanId(value: string | null | undefined): value is PlanId {
  return value === "basic" || value === "business" || value === "enterprise" || value === "automation";
}

/** Which "what do you need" option a pricing plan implies. */
export function planToNeed(plan: PlanId): NeedId {
  return plan === "automation" ? "automation" : "website";
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                  */
/* -------------------------------------------------------------------------- */

export type Errors = Partial<Record<keyof EstimateData, string>>;

/** Deliberately permissive — enough to catch typos, not to reject valid addresses. */
export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function validateStep(step: number, data: EstimateData): Errors {
  const errors: Errors = {};

  if (step === 0 && !data.need) {
    errors.need = "Pick one so we know where to start.";
  }

  if (step === 1) {
    if (!data.budget) errors.budget = "Give us a rough range — “Not sure” is fine.";
    if (!data.timeline) errors.timeline = "Roughly when would you like to launch?";
    if (data.details.trim().length < 10) {
      errors.details = "A sentence or two about the project helps us quote accurately.";
    }
  }

  if (step === 2) {
    if (!data.name.trim()) errors.name = "What should we call you?";
    if (!data.email.trim()) errors.email = "We need an email to send the quote to.";
    else if (!isValidEmail(data.email)) errors.email = "That email doesn't look quite right.";
  }

  return errors;
}

/* -------------------------------------------------------------------------- */
/* Submission                                                                  */
/* -------------------------------------------------------------------------- */

export type SubmitResult = { ok: true } | { ok: false; message: string };

/**
 * Single entry point for sending an estimate request.
 *
 * TODO(stage 5): wire this to the real backend — POST to an API route that
 * emails the team and pushes the lead into the CRM. Until then it resolves
 * successfully after a short delay so the success state can be exercised.
 */
export async function submitEstimate(data: EstimateData): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (process.env.NODE_ENV !== "production") {
    console.info("[estimate] payload ready for backend:", data);
  }

  return { ok: true };
}
