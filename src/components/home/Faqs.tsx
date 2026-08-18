"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/home-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Faqs() {
  // Single-open accordion; first item starts open so the section never reads
  // as an empty stack of bars.
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <SectionWrapper id="faqs" spacing="lg" animate={false} width="narrow">
      <motion.div
        {...enterProps("scale")}
      >
        <SectionHeading
          eyebrow={faqs.eyebrow}
          heading={faqs.heading}
          align="center"
          className="mx-auto"
        />
      </motion.div>

      <div className="mt-12 flex flex-col gap-3">
        {faqs.items.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `${baseId}-panel-${i}`;
          const buttonId = `${baseId}-button-${i}`;

          return (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
              className={cn(
                "overflow-hidden rounded-2xl border transition-colors duration-300",
                isOpen
                  ? "border-primary/35 bg-surface-raised shadow-soft"
                  : "border-white/8 bg-surface hover:border-white/15",
              )}
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="font-heading text-base font-semibold text-cream sm:text-lg">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                      isOpen ? "gradient-brand text-on-brand" : "bg-primary/15 text-primary",
                    )}
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={2.5} aria-hidden />
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
                    <p className="px-5 pb-5 text-sm leading-relaxed text-cream/70 sm:px-6 sm:pb-6 sm:text-base">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

export default Faqs;
