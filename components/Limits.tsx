"use client";

import { motion } from "framer-motion";
import { RevealGroup, RevealItem } from "./Reveal";
import { Perforation } from "./Marks";
import { IN_VIEW } from "./motion";

/* ==========================================================================
   Limits.

   "A privacy product that will not list its own failures is advertising."
   Straight from the paper, and the reason this page reads like a working
   document rather than a pitch. It stays.
   ========================================================================== */

const OUT_OF_SCOPE = [
  "A global adversary who already controls xReserve, an exchange, and the user’s device.",
  "A legal demand that the issuer open every ComplianceRecord. Cero can scope. It cannot overrule an issuer.",
  "Making a thin anonymity set thick. If ten people used USDCx this week, Cero cannot invent an eleventh.",
  "Stopping leakage at CEX KYC and bank off-ramps. Those edges are outside Aleo.",
  "Protecting a user who overrides every warning. The log exists so the desk can see the override, not so physics changes.",
  "Formal verification of Leo programs Cero did not write. USDCx security is upstream.",
];

const NOT = [
  ["Not a new stablecoin.", "USDCx and USAD already exist."],
  ["Not a mixer.", "It measures and degrades fingerprints. It does not invent a larger set."],
  ["Not a bank or a wallet.", "Toku, Request, Utila and Ledger already occupy those seats."],
  ["Not a rail.", "Circle, Predicate and Verulink are the rails. Cero is the client around them."],
];

export default function Limits() {
  return (
    <>
      <section id="limits" className="py-20 sm:py-28">
        <div className="wrap">
          <div className="grid gap-10 lg:gap-20 lg:grid-cols-[1fr_1fr] items-start">
            <div>
              <RevealGroup>
                <RevealItem>
                  <div className="lbl" style={{ color: "var(--fg-3)" }}>
                    06 — Limits
                  </div>
                </RevealItem>
                <RevealItem>
                  <h2 className="disp h-section mt-5">
                    A privacy product that will not list its own failures is
                    advertising.
                  </h2>
                </RevealItem>
              </RevealGroup>

              <RevealGroup className="mt-9 flex flex-col gap-4" gap={0.05}>
                {NOT.map(([head, tail]) => (
                  <RevealItem key={head}>
                    <div className="flex gap-3 items-baseline">
                      <span
                        className="mono text-[13px] shrink-0"
                        style={{ color: "var(--loud)" }}
                      >
                        ×
                      </span>
                      <p className="text-[14.5px] sm:text-[15.5px] m-0">
                        <span style={{ color: "var(--fg)" }}>{head}</span>{" "}
                        <span className="copy">{tail}</span>
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <div>
              <RevealGroup>
                <RevealItem>
                  <div className="lbl pb-4 border-b" style={{ color: "var(--fg-3)", borderColor: "var(--rule)" }}>
                    Out of scope — said out loud
                  </div>
                </RevealItem>
              </RevealGroup>

              <RevealGroup gap={0.05}>
                {OUT_OF_SCOPE.map((line, i) => (
                  <RevealItem key={line}>
                    <div
                      className="flex gap-5 py-4 border-b"
                      style={{ borderColor: "var(--rule)" }}
                    >
                      <span
                        className="mono text-[11px] shrink-0 pt-[3px]"
                        style={{ color: "var(--fg-3)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="copy text-[14.5px] m-0">{line}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={IN_VIEW}
                className="mt-8 p-5 sm:p-6"
                style={{ border: "2px solid var(--loud)" }}
              >
                <span className="chip" style={{ color: "var(--loud)" }}>
                  Hard line
                </span>
                <p className="text-[14.5px] sm:text-[15.5px] mt-4 mb-0">
                  Cero will not market itself as a way to evade sanctions, freeze
                  lists, or lawful process. Freeze-list non-membership stays a
                  required proof. The desk exists so mandated viewers can do their
                  job with a narrower window, not so the window disappears.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <Perforation />
    </>
  );
}
