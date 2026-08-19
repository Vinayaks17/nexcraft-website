"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  FuelSectionMeta,
  fuelBody,
  fuelLabel,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { fuelFaq, sectionIndex } from "@/lib/home-fuel-content";
import { faqs } from "@/lib/home-content";
import { EASE, enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * (09) FAQ — our three existing questions in the reference's numbered
 * accordion: no card, no chrome, just a hairline per row, a mono index, and a
 * `+` that rotates into a `×`.
 */
export function FuelFaqs() {
  // Single-open accordion. Nothing starts open here: the numbered rows read as
  // a deliberate list on their own, which the card-based version didn't.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="faqs" className="bg-ink py-20 sm:py-24 lg:py-32">
      <div className={fuelShell}>
        <FuelSectionMeta {...sectionIndex.faq} />

        <div className="mt-14 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-12">
          <motion.p
            {...enterProps("left")}
            className={cn(fuelLabel, "text-cream/55 lg:col-span-3")}
          >
            {fuelFaq.intro}
          </motion.p>

          <div className="border-t border-cream/12 lg:col-span-9">
            {faqs.items.map((item, i) => {
              const isOpen = openIndex === i;
              const panelId = `${baseId}-panel-${i}`;
              const buttonId = `${baseId}-button-${i}`;

              return (
                <motion.div
                  key={item.question}
                  {...enterProps("up", i * 0.07)}
                  className="border-b border-cream/12"
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="group flex w-full items-start justify-between gap-6 py-6 text-left sm:py-7"
                    >
                      <span className="flex items-start gap-5 sm:gap-8">
                        <span
                          className={cn(
                            fuelLabel,
                            "mt-1.5 shrink-0 transition-colors duration-200",
                            isOpen ? "text-primary" : "text-cream/55",
                          )}
                        >
                          (0{i + 1})
                        </span>
                        <span
                          className={cn(
                            "text-[1.0625rem] leading-[1.25] font-medium tracking-[-0.02em] transition-colors duration-200 sm:text-[1.375rem]",
                            isOpen ? "text-cream" : "text-cream/80 group-hover:text-cream",
                          )}
                        >
                          {item.question}
                        </span>
                      </span>

                      {/* Rotating 45° turns the plus into a cross — one glyph,
                          two states, and the transform is free. */}
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        aria-hidden
                        className={cn(
                          "mt-1 shrink-0 text-2xl leading-none transition-colors duration-200",
                          isOpen ? "text-primary" : "text-cream/50 group-hover:text-cream",
                        )}
                      >
                        +
                      </motion.span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.38, ease: EASE },
                          opacity: { duration: 0.25, ease: EASE },
                        }}
                        className="overflow-hidden"
                      >
                        {/* Indented to clear the index column, so the answer
                            hangs off the question rather than the number. */}
                        <p
                          className={cn(
                            fuelBody,
                            "max-w-[62ch] pb-7 pl-[3.25rem] text-cream/65 sm:pl-[4.5rem]",
                          )}
                        >
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FuelFaqs;
