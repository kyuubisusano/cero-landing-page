"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import ExitScore from "./ExitScore";
import WaitlistForm from "./WaitlistForm";
import { CropMarks, LeaderRow, Perforation } from "./Marks";
import { riseLine, riseSoft, stagger } from "./motion";

/* The statement is the fold. Four short lines set as large as the measure
   allows, each rising out of its own mask — the page prints itself. */
const LINES = ["The middle", "is private.", "The ends", "are not."];

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
        {/* ---------- the form's masthead ---------- */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap items-end gap-x-8 gap-y-2 pb-4 border-b"
          style={{ borderColor: "var(--rule)" }}
        >
          <span className="lbl" style={{ color: "var(--fg)" }}>
            Remittance advice
          </span>
          <span className="lbl" style={{ color: "var(--fg-3)" }}>
            Form C-17
          </span>
          <span className="lbl ml-auto" style={{ color: "var(--fg-3)" }}>
            Private dollars on Aleo
          </span>
        </motion.div>

        {/* ---------- the statement ---------- */}
        <motion.h1
          className="disp h-hero mt-8 sm:mt-10"
          variants={stagger(0.08, 0.25)}
          initial="hidden"
          animate="show"
        >
          {LINES.map((line, i) => (
            <span key={line} className="line-mask">
              <motion.span
                variants={riseLine}
                className="block"
                // the two lines that name the exposure carry the red
                style={i >= 2 ? { color: "var(--loud)" } : undefined}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* ---------- the particulars ---------- */}
        <div className="grid gap-10 lg:gap-16 mt-12 sm:mt-16 lg:grid-cols-[1fr_600px] items-start pb-16 sm:pb-20">
          <motion.div
            variants={stagger(0.08, 0.7)}
            initial="hidden"
            animate="show"
            className="max-w-[520px]"
          >
            <motion.p variants={riseSoft} className="copy text-[16.5px] sm:text-[18px] m-0">
              USDCx already hides the body of a payment. Cero handles the ends —
              scoring how much a pay-run gives away at mint, burn and bridge exit,
              routing the quiet path, then opening only the slice each reviewer is
              cleared for.
            </motion.p>

            <motion.div variants={riseSoft} className="flex flex-col gap-3 mt-9">
              <LeaderRow label="01 Status" value="Private beta" />
              <LeaderRow label="02 Network" value="Aleo mainnet" />
              <LeaderRow label="03 Public record" value="None" tone="var(--loud)" />
            </motion.div>

            <motion.div variants={riseSoft} className="mt-9">
              <WaitlistForm id="hero" />
            </motion.div>
          </motion.div>

          <ExitScore />
        </div>
      </motion.div>

      <Perforation />
    </section>
  );
}
