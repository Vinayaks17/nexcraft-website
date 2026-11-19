/**
 * Estimate form types, validation, and the single submission entry point.
 */

export type NeedId = "website" | "automation" | "both";
export type BudgetId = "under-1000" | "1000-3000" | "3000-6000" | "6000-plus" | "unsure";
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
};

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

const ENDPOINT = "https://api.web3forms.com/submit";

/**
 * Every failure path ends with the same instruction, because there is only one
 * thing a visitor who has just typed out a brief can usefully do: send it
 * somewhere that works. The address is inlined rather than imported from
 * site.ts to keep this module free of UI imports — if it changes there, it
 * changes here, and the test in the QA sweep catches the drift.
 */
const FALLBACK = "Please email it to info@thenexcraft.com and we'll pick it up from there.";

/** Human labels, so the email reads in the words the visitor actually saw. */
const NEED_LABELS: Record<NeedId, string> = {
  website: "Website",
  automation: "Automation",
  both: "Both — website and automation",
};

const BUDGET_LABELS: Record<BudgetId, string> = {
  "under-1000": "Under USD 1,000",
  "1000-3000": "USD 1,000 - 3,000",
  "3000-6000": "USD 3,000 - 6,000",
  "6000-plus": "USD 6,000+",
  unsure: "Not sure yet",
};

const TIMELINE_LABELS: Record<TimelineId, string> = {
  asap: "ASAP",
  "1-2-months": "1-2 months",
  flexible: "Flexible",
};

/**
 * Single entry point for sending an estimate request.
 *
 * Web3Forms takes the POST and emails it on; there is no server of ours in the
 * path, which is why the access key is a `NEXT_PUBLIC_` variable and is
 * expected to be visible in the bundle. That is the service's design — the key
 * only authorises delivery to the address it was registered with, so the worst
 * a scraper can do with it is send us mail. The honeypot below is what keeps
 * that from being worth doing.
 *
 * Keys in the payload are the labels that appear in the email, so they are
 * written for a person reading it on a phone rather than for a parser.
 *
 * @param botcheck Value of the hidden honeypot field. A human leaves it empty;
 *   anything else and Web3Forms drops the submission server-side. It is sent
 *   rather than checked here on purpose — a client-side check is trivially
 *   skipped by the same bots the field exists to catch.
 */
export async function submitEstimate(
  data: EstimateData,
  botcheck = "",
): Promise<SubmitResult> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  if (!accessKey) {
    /* A misconfigured deploy must never look like a delivered brief: the form
       reports the failure and points at email rather than showing the success
       state on a submission that went nowhere. */
    console.warn(
      "[estimate] NEXT_PUBLIC_WEB3FORMS_KEY is not set — the form cannot deliver. " +
        "Add it to .env.local (see .env.example) and restart the dev server.",
    );
    return { ok: false, message: `We couldn't send that from here. ${FALLBACK}` };
  }

  const payload = {
    access_key: accessKey,
    subject: "New estimate request — NexCRAFT",
    from_name: data.name.trim() || "NexCRAFT website",
    replyto: data.email.trim(),
    botcheck,

    Name: data.name.trim(),
    Email: data.email.trim(),
    Company: data.company.trim() || "—",
    Phone: data.phone.trim() || "—",
    "What they need": data.need ? NEED_LABELS[data.need] : "—",
    Budget: data.budget ? BUDGET_LABELS[data.budget] : "—",
    Timeline: data.timeline ? TIMELINE_LABELS[data.timeline] : "—",
    "Project details": data.details.trim(),
  };

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    /* Web3Forms answers 200 with `{ success: false }` for a rejected key or a
       tripped honeypot, so the status code alone is not the answer. */
    const result = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

    if (response.ok && result?.success) return { ok: true };

    console.error("[estimate] delivery failed:", response.status, result);
    return { ok: false, message: `That didn't send. ${FALLBACK}` };
  } catch (error) {
    // Offline, DNS, blocked by an extension — all indistinguishable from here.
    console.error("[estimate] network error:", error);
    return {
      ok: false,
      message: `We couldn't reach the server. Check your connection, or ${FALLBACK[0].toLowerCase()}${FALLBACK.slice(1)}`,
    };
  }
}
