/**
 * Terms and Privacy.
 *
 * ⚠️ TODO — EVERY `body` STRING BELOW IS PLACEHOLDER TEXT AND IS NOT LEGAL
 * ADVICE. The section *structure* is real and reviewed; the wording inside each
 * section is a plain-English stand-in written so a lawyer can see what each
 * clause is meant to cover and replace it with binding language.
 *
 * Do not publish these pages as-is. `lastUpdated` stays null until they are:
 * the pages render "Not yet published" rather than a date, so neither document
 * can imply it is in force before it is.
 */

export type LegalSection = {
  num: string;
  title: string;
  /** TODO: placeholder. Replace with reviewed legal copy. */
  body: string[];
};

export type LegalDocument = {
  label: string;
  heading: string;
  intro: string;
  /** ISO date once a reviewed version is published; null until then. */
  lastUpdated: string | null;
  sections: LegalSection[];
};

/** Shown in place of a date while `lastUpdated` is null. */
export const NOT_YET_PUBLISHED = "Draft — not yet published";

export const terms: LegalDocument = {
  label: "Terms of service",
  heading: "Terms of *service.*",
  intro:
    "The agreement between NexCRAFT and the people who hire us — what we deliver, what it costs, who owns the result, and what happens when something goes wrong.",
  lastUpdated: null,
  sections: [
    {
      num: "01",
      title: "Services",
      body: [
        "TODO — PLACEHOLDER. Define the scope of what NexCRAFT provides: website design and development, business automation build-out, and the add-on services listed on the pricing page. State that the specific deliverables, milestones and acceptance criteria for any engagement are set out in a written proposal or statement of work, and that the proposal governs where it conflicts with these terms.",
        "TODO — PLACEHOLDER. Cover revisions: how many rounds are included at each tier, what counts as a revision versus a change of scope, and how out-of-scope work is quoted and approved before it is started.",
      ],
    },
    {
      num: "02",
      title: "Payments",
      body: [
        "TODO — PLACEHOLDER. Set out the payment schedule (deposit percentage, milestone payments, final payment before or after launch), accepted methods, and the currency. Prices on the site are starting points in EUR; state that the quoted figure in the accepted proposal is the binding one.",
        "TODO — PLACEHOLDER. Cover late payment: the grace period, any interest or fee, and the right to pause work or withhold launch on an overdue account. Cover cancellation and refunds — what is refundable before work starts and what is not once design or development is under way.",
        "TODO — PLACEHOLDER. State how recurring charges work for maintenance and retainer plans: billing period, notice required to cancel, and what happens to hosting or automations on cancellation.",
      ],
    },
    {
      num: "03",
      title: "Intellectual property",
      body: [
        "TODO — PLACEHOLDER. State when ownership of the delivered work transfers to the client — typically on final payment — and what the client owns: the design, the code, the content they supplied. Note the site's promise that clients own their build outright, with no rented page builder underneath.",
        "TODO — PLACEHOLDER. Carve out what NexCRAFT retains: reusable components, internal tooling, and the automation frameworks built in-house. Cover third-party licences (fonts, plugins, stock assets, SaaS integrations) that stay with their original licensor.",
        "TODO — PLACEHOLDER. Cover the client's content warranty: that they have the right to everything they supply, and that they indemnify NexCRAFT against claims arising from it. Also cover NexCRAFT's right to show the work in its portfolio, and how a client opts out of that.",
      ],
    },
    {
      num: "04",
      title: "Client responsibilities",
      body: [
        "TODO — PLACEHOLDER. Set out what the client has to provide and by when: content, brand assets, access to domains, hosting, analytics and any third-party accounts. State the effect of delay on the timeline, and how long a stalled project can sit before it is treated as cancelled.",
        "TODO — PLACEHOLDER. Cover approvals: who on the client side can sign off, and what happens if feedback is not returned within the stated window.",
      ],
    },
    {
      num: "05",
      title: "Liability",
      body: [
        "TODO — PLACEHOLDER. Include the standard limitation of liability: cap on damages (commonly the fees paid under the engagement), exclusion of indirect and consequential loss, and exclusion of lost profits or data. This clause in particular must be drafted by a lawyer for the governing jurisdiction.",
        "TODO — PLACEHOLDER. Disclaim warranties for third-party services and platforms outside NexCRAFT's control — hosting providers, payment processors, integration APIs, search rankings. State explicitly that no specific SEO ranking, traffic level or conversion rate is guaranteed.",
        "TODO — PLACEHOLDER. Cover the warranty period on delivered work: how long after launch defects are fixed free of charge, and what counts as a defect rather than a change.",
      ],
    },
    {
      num: "06",
      title: "Governing law",
      body: [
        "TODO — PLACEHOLDER. Name the governing jurisdiction and the forum for disputes. NexCRAFT operates from India and serves clients in the EU and the US, so this needs deliberate legal input rather than a default — including whether consumer-protection rules in the client's country override the choice.",
        "TODO — PLACEHOLDER. Set out the dispute process before litigation: notice, good-faith negotiation, and any agreed mediation or arbitration step.",
      ],
    },
    {
      num: "07",
      title: "Changes and contact",
      body: [
        "TODO — PLACEHOLDER. State how these terms may be updated, how clients are notified, and that continued use or an ongoing engagement constitutes acceptance of the current version.",
        "TODO — PLACEHOLDER. Give the contact route for questions about these terms, and the registered business name and address once they are confirmed.",
      ],
    },
  ],
};

export const privacy: LegalDocument = {
  label: "Privacy policy",
  heading: "Privacy *policy.*",
  intro:
    "What we collect when you use this site or hire us, why we hold it, who else sees it, and how you get it back or get it deleted.",
  lastUpdated: null,
  sections: [
    {
      num: "01",
      title: "Who we are",
      body: [
        "TODO — PLACEHOLDER. Identify the data controller: registered business name, address and contact address for privacy requests. Under GDPR this has to be a real, monitored route, not a generic inbox that nobody owns.",
        "TODO — PLACEHOLDER. State whether an EU representative or a Data Protection Officer is required and, if so, name them. NexCRAFT is established in India and serves EU clients, so Article 27 representation needs checking.",
      ],
    },
    {
      num: "02",
      title: "What we collect",
      body: [
        "TODO — PLACEHOLDER. List the categories actually collected. On this site that is the estimate form: name, email, optional company, optional phone, and the project details, budget range and timeline the visitor selects. Note that no account is created and no payment details are taken through the site.",
        "TODO — PLACEHOLDER. Cover anything collected automatically — server logs, IP address, and any analytics — and confirm what is and is not enabled in production before this page is published.",
      ],
    },
    {
      num: "03",
      title: "Why we hold it, and for how long",
      body: [
        "TODO — PLACEHOLDER. State the lawful basis for each purpose: responding to an enquiry, quoting for work, performing a contract, and any marketing follow-up. Marketing needs its own basis and, in most of the EU, its own opt-in.",
        "TODO — PLACEHOLDER. Give a concrete retention period for each category rather than 'as long as necessary' — how long an unconverted enquiry is kept, and how long client project records are kept after an engagement ends.",
      ],
    },
    {
      num: "04",
      title: "Who else sees it",
      body: [
        "TODO — PLACEHOLDER. List the processors and sub-processors that handle personal data: hosting, form or email delivery, CRM, and any automation platform an enquiry passes through. Each needs a data processing agreement in place before this page goes live.",
        "TODO — PLACEHOLDER. Cover international transfers. Data reaching a team in India from EU visitors is a transfer out of the EEA and needs a stated safeguard — Standard Contractual Clauses or equivalent.",
        "TODO — PLACEHOLDER. Confirm that personal data is never sold, and state the narrow circumstances in which it would be disclosed (legal obligation, or a business transfer).",
      ],
    },
    {
      num: "05",
      title: "Cookies and tracking",
      body: [
        "TODO — PLACEHOLDER. Describe exactly what this site sets. Audit this before publishing: the site currently ships no analytics or advertising tags, and if that is still true at launch this section should say so plainly rather than describing cookies that do not exist.",
        "TODO — PLACEHOLDER. If any non-essential cookie or tracker is added later, a consent banner meeting EU requirements has to ship with it — consent before the tag fires, and refusal as easy as acceptance. Record that decision here.",
      ],
    },
    {
      num: "06",
      title: "Your rights",
      body: [
        "TODO — PLACEHOLDER. Set out the GDPR rights: access, rectification, erasure, restriction, portability, objection, and withdrawal of consent. State how a request is made, how identity is verified, and the response deadline (one month under GDPR).",
        "TODO — PLACEHOLDER. Name the supervisory authority a visitor can complain to, and add the equivalent rights notice for any US state law that applies to the client base.",
      ],
    },
    {
      num: "07",
      title: "Security and contact",
      body: [
        "TODO — PLACEHOLDER. Describe the safeguards in place — encryption in transit, access control, and who internally can read enquiry submissions — without overstating them. Cover the breach-notification commitment and its timeframe.",
        "TODO — PLACEHOLDER. Give the contact route for privacy questions and requests, and state how changes to this policy are communicated.",
      ],
    },
  ],
};
