"use client";

import { motion } from "framer-motion";
import { RevealGroup, RevealItem } from "./Reveal";
import { Perforation } from "./Marks";
import { IN_VIEW, drawX } from "./motion";

/* ==========================================================================
   The evidence.

   Four results, each naming a different layer, together describing one missing
   product. Every figure here comes from the working paper — nothing on this
   page is an invented statistic, which is exactly why it can carry the page.
   ========================================================================== */

const FINDINGS = [
  {
    stat: "1,228",
    unit: "singleton unshields",
    source: "Guo, Chaliasos, Feng, Xu · arXiv 2608.22987 · 24 Aug 2026",
    title: "The Anonymity Gap",
    body: "Using only public traces on Railgun and Hinkal, mean anonymity-set size fell 40–59% against the temporal baseline. 3,679 unshields retained at most ten candidate addresses; 1,228 were singletons. Public token constraints were the most stable pruner.",
  },
  {
    stat: "17.65%",
    unit: "of withdraws uniquely linked",
    source: "Huseynov et al. · arXiv 2606.25926 · Jun 2026",
    title: "A Tattered Cloak of Invisibility",
    body: "Even a cryptographically strong pool leaks from behaviour: timing, address reuse, amount fingerprints, graph proximity, knapsack splits. The lesson is product design, not more proving time — default exits must not be the naive ones.",
  },
  {
    stat: "38",
    unit: "teams surveyed",
    source: "PSE Private Transfers study · May 2026",
    title: "What builders actually hit",
    body: "Top blockers were proving cost and DeFi composability. Tied near the top: privacy leakage at deposit and withdrawal. Six teams said demand and product-market fit were themselves the problem.",
  },
  {
    stat: "0",
    unit: "Aleo records in the sample",
    source: "Aleo private-stablecoin design · 2025–2026",
    title: "The measurement nobody has run",
    body: "USDCx is minted against USDC in Circle xReserve, and every public-private boundary can emit a ComplianceRecord to a designated investigator. The design assumes a RiskManager. It does not ship the desk, the scoped view, or an exit coordinator.",
  },
];

export default function Research() {
  return (
    <>
      <section id="research" className="py-20 sm:py-28">
        <div className="wrap">
          <RevealGroup>
            <RevealItem>
              <div className="lbl" style={{ color: "var(--fg-3)" }}>
                02 — The research
              </div>
            </RevealItem>
            <RevealItem>
              <h2 className="disp h-section mt-5 max-w-[760px]">
                Not a narrative in search of citations.
              </h2>
            </RevealItem>
            <RevealItem>
              <p className="copy text-[15.5px] sm:text-[16.5px] mt-5 max-w-[620px]">
                Four results that keep repeating the same hole. Each names a
                different layer. Together they describe one missing product.
              </p>
            </RevealItem>
          </RevealGroup>

          <div className="mt-12 sm:mt-14">
            {FINDINGS.map((f, i) => (
              <motion.div
                key={f.stat + f.title}
                initial="hidden"
                whileInView="show"
                viewport={IN_VIEW}
                transition={{ staggerChildren: 0.06 }}
                className="grid gap-4 lg:gap-12 lg:grid-cols-[300px_1fr] py-8 sm:py-10 border-t"
                style={{ borderColor: "var(--rule)" }}
              >
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                >
                  <div
                    className="disp text-[46px] sm:text-[64px] leading-none"
                    style={{ color: i === 3 ? "var(--loud)" : "var(--fg)" }}
                  >
                    {f.stat}
                  </div>
                  <div className="lbl mt-2" style={{ color: "var(--fg-3)" }}>
                    {f.unit}
                  </div>
                </motion.div>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                >
                  <h3 className="disp text-[20px] sm:text-[24px]">{f.title}</h3>
                  <p className="copy text-[14.5px] sm:text-[15.5px] mt-3 max-w-[640px]">
                    {f.body}
                  </p>
                  <div
                    className="mono text-[10.5px] mt-4"
                    style={{ color: "var(--fg-3)" }}
                  >
                    {f.source}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={drawX}
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            className="h-px origin-left"
            style={{ background: "var(--rule)" }}
          />

          <RevealGroup className="pt-8">
            <RevealItem>
              <p className="text-[16px] sm:text-[18px] max-w-[720px] m-0">
                Aleo records were not in any of these samples.{" "}
                <span className="mark">That absence is the measurement Cero runs first.</span>
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
      <Perforation />
    </>
  );
}
