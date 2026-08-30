"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealGroup, RevealItem } from "./Reveal";
import { IN_VIEW, drawX } from "./motion";

const STEPS = [
  {
    n: "Days 0–14",
    title: "Observe",
    copy: "Index USDCx public-private boundary events on mainnet and reconstruct a minimal exit table: time, public amount band, destination family. No UI. A CSV and a script.",
    mono: ["mint_private · burn_private", "convert · freeze · pause"],
  },
  {
    n: "Days 14–45",
    title: "Score and warn",
    copy: "A CLI in front of burn_private: print estimated set size, block the obvious singleton, offer split and delay. Publish an ugly public page of recent USDCx exit scores.",
    mono: ["token + amount bucket", "time window + destination reuse"],
  },
  {
    n: "Days 45–90",
    title: "One desk, one key",
    copy: "A web pane for a single investigator or payroll operator. Timeline of records they can decrypt, freeze hits, override log, month-end CSV. If no real key holder logs in, stop.",
    mono: ["scoped timeline · freeze hits", "csv export · key expiry"],
  },
  {
    n: "After pull",
    title: "Library",
    copy: "Extract the scorer and the quiet-path builder as a package other Aleo apps import. That is distribution. A second branded desk is not.",
    mono: ["open scorer", "quiet-path builder"],
  },
];

export default function Flow() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  // a spine that fills as you move through the three steps
  const spine = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // The dark register lives here. It needs real scroll distance, or the ground
  // turns and starts turning back before the section has even arrived.
  return (
    <section
      id="flow"
      ref={ref}
      className="min-h-screen flex items-center py-28 sm:py-32"
    >
      <div className="wrap w-full">
        <RevealGroup>
          <RevealItem>
            <div className="lbl" style={{ color: "var(--fg-3)" }}>
              05 — What ships first
            </div>
          </RevealItem>
          <RevealItem>
            <h2 className="disp h-section mt-5 max-w-[820px]">
              Shipping “the platform” is how this dies.
            </h2>
          </RevealItem>
        </RevealGroup>

        <div className="relative mt-14 sm:mt-16">
          {/* the rule the steps hang from, drawn as you arrive */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px origin-left"
            style={{ background: "var(--rule)", scaleX: spine }}
          />

          <div className="grid gap-0 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial="hidden"
                whileInView="show"
                viewport={IN_VIEW}
                transition={{ delayChildren: i * 0.12, staggerChildren: 0.07 }}
                className="relative pt-7 sm:pt-8 pb-2 lg:px-6 lg:first:pl-0 lg:last:pr-0 border-t lg:border-t-0 lg:border-l lg:first:border-l-0"
                style={{ borderColor: "var(--rule)" }}
              >
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                  className="mono text-[11px] whitespace-nowrap"
                  style={{ color: "var(--fg-3)" }}
                >
                  {step.n}
                </motion.div>

                <motion.h3
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  className="disp h-step mt-3"
                >
                  {step.title}
                </motion.h3>

                <motion.p
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  className="copy text-[15px] sm:text-[15.5px] mt-3 mb-6"
                >
                  {step.copy}
                </motion.p>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  className="mono text-[11.5px] rounded-[2px] px-3 py-[10px] leading-[1.75]"
                  style={{ color: "var(--fg-2)", background: "var(--rule-soft)" }}
                >
                  {step.mono.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </motion.div>

                {/* each step underlines itself once it has arrived */}
                <motion.div
                  variants={drawX}
                  className="h-px mt-7 origin-left lg:hidden"
                  style={{ background: "var(--rule)" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
