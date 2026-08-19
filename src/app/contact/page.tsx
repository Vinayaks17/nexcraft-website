import type { Metadata } from "next";

import {
  FuelBracketLink,
  FuelPageHeader,
  fuelLabel,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { FuelNextSteps } from "@/components/fuel/FuelNextSteps";
import { contactPage } from "@/lib/contact-content";
import { contactChannels } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to NexCRAFT about a website, an automation, or both. We reply within 24 hours.",
};

/**
 * Contact — deliberately the plainest page on the site.
 *
 * No form: /estimate already asks the qualifying questions properly, and a
 * second, shallower form here would only split the same submission across two
 * places. This page's job is to hand over the channels and point at the two
 * things worth doing next.
 */
export default function ContactPage() {
  return (
    <>
      <FuelPageHeader
        num={contactPage.num}
        label={contactPage.label}
        heading={contactPage.heading}
        intro={contactPage.intro}
      />

      <section className={cn(fuelShell, "pt-16 pb-24 sm:pt-20 lg:pt-24 lg:pb-32")}>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Left — the channels, as a mono-labelled list. Values come from
              site.ts, so Stage 5 fills them in one place. */}
          <div className="lg:col-span-6">
            <h2 className={cn(fuelLabel, "text-cream/55")}>
              {contactPage.channelsLabel}
            </h2>

            <dl className="mt-5 border-t border-cream/12">
              {contactChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="grid grid-cols-12 items-baseline gap-4 border-b border-cream/12 py-5"
                >
                  <dt className={cn(fuelLabel, "col-span-4 text-cream/55")}>
                    {channel.label}
                  </dt>
                  <dd className="col-span-8">
                    <a
                      href={channel.href}
                      {...(channel.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-[0.9375rem] font-medium tracking-[-0.01em] text-cream underline decoration-cream/20 underline-offset-[6px] transition-colors duration-200 hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      {channel.value}
                    </a>
                  </dd>
                </div>
              ))}

              {/* Not a channel — no link, so it stays a plain row. */}
              <div className="grid grid-cols-12 items-baseline gap-4 border-b border-cream/12 py-5">
                <dt className={cn(fuelLabel, "col-span-4 text-cream/55")}>
                  {contactPage.location.label}
                </dt>
                <dd className="col-span-8">
                  <p className="text-[0.9375rem] font-medium tracking-[-0.01em] text-cream">
                    {contactPage.location.value}
                  </p>
                  <p className={cn(fuelLabel, "mt-2 text-cream/55")}>
                    {contactPage.location.note}
                  </p>
                </dd>
              </div>
            </dl>
          </div>

          {/* Right — the two actions, then the promise. */}
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className={cn(fuelLabel, "text-cream/55")}>
              {contactPage.actionsLabel}
            </h2>

            <div className="mt-6 flex flex-col gap-6">
              <FuelBracketLink href={contactPage.primary.href} className="max-w-none">
                {contactPage.primary.label}
              </FuelBracketLink>
              <FuelBracketLink href={contactPage.secondary.href} className="max-w-none">
                {contactPage.secondary.label}
              </FuelBracketLink>
            </div>

            <FuelNextSteps className="mt-14" />
          </div>
        </div>
      </section>
    </>
  );
}
