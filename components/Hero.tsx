"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import ExitScore from "./ExitScore";
import WaitlistForm from "./WaitlistForm";
import { CropMarks, LeaderRow, Perforation } from "./Marks";
import SetField from "./SetField";
import { riseLine, riseSoft, stagger } from "./motion";

/* The finding from Guo et al. is the whole pitch, so it is the headline:
   pool size is not exit size. The second line carries the red. */
const LINES = ["The pool", "is big.", "The exit", "is one."];

/* The paper's own three pillars, in its own words. */
const PILLARS = [
  ["01", "The door", "Stop mint and burn from becoming a fingerprint."],
  ["02", "The desk", "Let only the mandated viewer open a pay-run."],
  ["03", "The score", "Measure anonymity instead of asserting it."],
];

export default function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, reduced ? 1 : 0.2]);

  return (
    <section id="top" ref={ref} className="relative pt-[112px] sm:pt-[128px]">
      <CropMarks />

      <motion.div className="wrap" style={{ y, opacity }}>
        {/* ---------- the paper's masthead ---------- */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap items-end gap-x-8 gap-y-2 pb-4 border-b"
          style={{ borderColor: "var(--rule)" }}
        >
          <span className="lbl" style={{ color: "var(--fg)" }}>
            Working paper
          </span>
          <span className="lbl" style={{ color: "var(--fg-3)" }}>
            v0.1 · August 2026
          </span>
          <span className="lbl ml-auto" style={{ color: "var(--fg-3)" }}>
            Draft for critique · Not a token sale
          </span>
        </motion.div>

        {/* ---------- the statement ----------
            Deliberately wider than the wrap and allowed to bleed off the right
            edge: the only element on the page that refuses the grid. */}
        <motion.h1
          className="disp h-hero mt-8 sm:mt-10 lg:w-[112%] lg:max-w-none"
          variants={stagger(0.08, 0.25)}
          initial="hidden"
          animate="show"
        >
          {LINES.map((line, i) => (
            <span key={line} className="line-mask">
              <motion.span
                variants={riseLine}
                className="block"
                style={i >= 2 ? { color: "var(--loud)" } : undefined}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* ---------- the set, as it appears ----------
            Flat and uniform until the cursor falls on it, at which point the
            singletons show. The interaction is the argument. */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-10 sm:mt-14 relative"
        >
          <div className="flex items-baseline justify-between pb-3">
            <span className="lbl" style={{ color: "var(--fg-3)" }}>
              Recent USDCx exits · move the cursor across
            </span>
            <span className="lbl hidden sm:block" style={{ color: "var(--loud)" }}>
              Red = singleton
            </span>
          </div>
          <SetField
            interactive
            count={112}
            height={72}
            rarity={7}
            className="w-full"
            style={{ width: "100%" }}
          />
        </motion.div>

        {/* ---------- the particulars ---------- */}
        <div className="grid gap-10 lg:gap-16 mt-12 sm:mt-16 lg:grid-cols-[1fr_600px] items-start pb-14 relative z-10">
          <motion.div
            variants={stagger(0.08, 0.7)}
            initial="hidden"
            animate="show"
            className="max-w-[560px]"
          >
            <motion.p variants={riseSoft} className="copy text-[16.5px] sm:text-[18px] m-0">
              Private stablecoins already hide the middle of a payment. They still
              leak at the door, and they still leave finance teams without a desk
              that can open only their slice of the book.{" "}
              <span className="mark">Cero is that missing layer.</span>
            </motion.p>

            <motion.div variants={riseSoft} className="flex flex-col gap-3 mt-9">
              <LeaderRow label="01 Network" value="Aleo" />
              <LeaderRow label="02 Dollar" value="USDCx / USAD" />
              <LeaderRow label="03 Status" value="Under formation" tone="var(--loud)" />
            </motion.div>

            <motion.div variants={riseSoft} className="mt-9">
              <WaitlistForm id="hero" />
            </motion.div>
          </motion.div>

          <ExitScore />
        </div>

        {/* ---------- the three pillars ---------- */}
        <motion.div
          variants={stagger(0.09, 0.9)}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-3 border-t pb-16 sm:pb-20"
          style={{ borderColor: "var(--rule)" }}
        >
          {PILLARS.map(([n, title, line], i) => (
            <motion.div
              key={n}
              variants={riseSoft}
              className={`pt-6 sm:pr-8 ${i > 0 ? "sm:pl-8 sm:border-l" : ""}`}
              style={{ borderColor: "var(--rule)" }}
            >
              <span className="mono text-[11px]" style={{ color: "var(--fg-3)" }}>
                {n}
              </span>
              <h2 className="disp text-[22px] sm:text-[26px] mt-2">{title}</h2>
              <p className="copy text-[14.5px] mt-2 mb-0">{line}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <Perforation />
    </section>
  );
}
