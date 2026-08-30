"use client";

import { motion } from "framer-motion";
import WaitlistForm from "./WaitlistForm";
import { IN_VIEW, riseLine, riseSoft, stagger } from "./motion";

const LINES = ["Tell us", "what’s wrong."];

export default function Waitlist() {
  return (
    <section id="waitlist" className="border-t" style={{ borderColor: "var(--rule)" }}>
      <motion.div
        className="wrap py-24 sm:py-32 grid gap-12 lg:gap-20 lg:grid-cols-[1fr_470px] items-start"
        variants={stagger(0.09)}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW}
      >
        <h2 className="disp h-cta max-w-[620px]">
          {LINES.map((line) => (
            <span key={line} className="line-mask">
              <motion.span variants={riseLine} className="block">
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        <div className="lg:pt-3">
          <motion.p variants={riseSoft} className="copy text-[16px] sm:text-[16.5px] m-0">
            Read this as a product under formation, not a finished protocol. If you
            have shipped or audited shielded UTXO systems, private stablecoins,
            payroll on Aleo or investigator tooling, the useful response is a list
            of what is wrong.
          </motion.p>

          <motion.div variants={riseSoft} className="mt-7">
            <WaitlistForm id="cta" />
          </motion.div>

          <motion.div
            variants={riseSoft}
            className="copy text-[13.5px] mt-4 max-w-[440px]"
            style={{ color: "var(--fg-3)" }}
          >
Is the door-plus-desk frame one product or two? Is the v1 score too crude to publish? Who holds the investigator key today?
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
