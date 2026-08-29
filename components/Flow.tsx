"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealGroup, RevealItem } from "./Reveal";
import { IN_VIEW, drawX } from "./motion";

const STEPS = [
  {
    n: "01",
    title: "Score",
    copy: "Before anything leaves the private side, Cero simulates the exit against the live anonymity set and returns how identifiable the run would be.",
    mono: ["POST /runs/:id/score", "→ { uniqueness, set_size, window }"],
  },
  {
    n: "02",
    title: "Route",
    copy: "Policy picks the quiet path — split the run into tranches, hold it to a dense window, or move the value through a different exit entirely.",
    mono: ["max_uniqueness 25", "split ≤8 · window 09:00–17:00"],
  },
  {
    n: "03",
    title: "Disclose",
    copy: "After settlement each reviewer opens a viewing key scoped to their slice — this week’s run, not the network.",
    mono: ["key controller@acme", "scope org.runs · ttl 90d"],
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
              02 — The flow
            </div>
          </RevealItem>
          <RevealItem>
            <h2 className="disp h-section mt-5 max-w-[720px]">
              On the flow, not beside it.
            </h2>
          </RevealItem>
        </RevealGroup>

        <div className="relative mt-14 sm:mt-16">
          {/* the rule the steps hang from, drawn as you arrive */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px origin-left"
            style={{ background: "var(--rule)", scaleX: spine }}
          />

          <div className="grid gap-0 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial="hidden"
                whileInView="show"
                viewport={IN_VIEW}
                transition={{ delayChildren: i * 0.12, staggerChildren: 0.07 }}
                className="relative pt-7 sm:pt-8 pb-2 lg:px-10 lg:first:pl-0 lg:last:pr-0 border-t lg:border-t-0 lg:border-l lg:first:border-l-0"
                style={{ borderColor: "var(--rule)" }}
              >
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                  className="mono text-xs"
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
