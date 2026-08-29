"use client";

import { motion } from "framer-motion";
import WaitlistForm from "./WaitlistForm";
import { IN_VIEW, riseLine, riseSoft, stagger } from "./motion";

const LINES = ["Don’t sign", "your pay-run."];

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
            Cero is in private beta with treasury and grant teams running weekly
            payouts on Aleo. Tell us what you pay out and we’ll set up a key.
          </motion.p>

          <motion.div variants={riseSoft} className="mt-7">
            <WaitlistForm id="cta" />
          </motion.div>

          <motion.div
            variants={riseSoft}
            className="lbl mt-4"
            style={{ color: "var(--fg-3)" }}
          >
            We reply to every request · No newsletter
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
