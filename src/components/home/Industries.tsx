"use client";

import { motion } from "framer-motion";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";
import { industries } from "@/lib/home-content";
import { enterProps } from "@/lib/motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Industries() {
  return (
    <SectionWrapper id="industries" spacing="lg" animate={false}>
      <motion.div
        {...enterProps("up")}
      >
        <SectionHeading
          eyebrow={industries.eyebrow}
          heading={industries.heading}
          intro={industries.intro}
        />
      </motion.div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {industries.items.map((item) => (
          <motion.li
            key={item.title}
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
            }}
            className="group"
          >
            {/* whileHover="card-hover" propagates to the icon below, so the
                icon reacts to hovering anywhere on the card. */}
            <motion.div
              whileHover="card-hover"
              variants={{ "card-hover": { y: -8 } }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="flex h-full flex-col rounded-2xl border border-white/8 bg-surface p-6 shadow-soft transition-colors duration-300 hover:border-primary/35 hover:bg-surface-raised hover:shadow-lift"
            >
              <motion.span
                variants={{ "card-hover": { rotate: -8, scale: 1.08 } }}
                transition={{ type: "spring", stiffness: 340, damping: 18 }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary/25"
              >
                <Icon name={item.icon as IconName} className="h-6 w-6" />
              </motion.span>

              <h3 className="mt-5 font-heading text-lg leading-snug font-semibold">
                {item.title}
              </h3>
              <p className="mono-caption mt-3 text-cream/70">
                {item.description}
              </p>
            </motion.div>
          </motion.li>
        ))}
      </motion.ul>
    </SectionWrapper>
  );
}

export default Industries;
