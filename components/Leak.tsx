"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { EASE } from "./motion";
import { usePinned } from "./usePinned";

/* ==========================================================================
   Set-piece 1 — the gap.

   Pinned. One payment's life draws itself across the full width of the page:
   the public mint, the opaque middle wiping across, the public exit. Leader
   lines drop and name what each end puts on a ledger. Then three weeks of the
   same run stack up underneath, on the same column grid, so the rule that
   marks the correlation falls exactly under the real exit block.

   The ground turns dark half way through this section, at the beat where value
   leaves the private side — see ThemeScroll, which measures its stops off the
   height of this element.
   ========================================================================== */

const MINT_LEAKS = ["amount in", "wallet of record", "timestamp"];
const EXIT_LEAKS = ["amount out", "settlement time", "destination shape", "run cadence"];
const WEEKS = ["2026-W33", "2026-W34", "2026-W35"];

export default function Leak() {
  const reduced = useReducedMotion();
  const pinned = usePinned();
  const outer = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });

  // Below the pin breakpoint (and under reduced motion) the same choreography
  // plays once on entry instead of scrubbing, so there is one code path.
  const played = useMotionValue(0);
  const entered = useInView(inner, { once: true, amount: 0.3 });
  useEffect(() => {
    if (pinned) return;
    if (reduced) {
      played.set(1);
      return;
    }
    if (entered) animate(played, 1, { duration: 2.2, ease: EASE });
  }, [pinned, reduced, entered, played]);

  const p: MotionValue<number> = pinned ? scrollYProgress : played;

  const headO = useTransform(p, [0, 0.1], [0, 1]);
  const headY = useTransform(p, [0, 0.12], [26, 0]);

  const mintO = useTransform(p, [0.1, 0.24], [0, 1]);
  const mintY = useTransform(p, [0.1, 0.24], [16, 0]);

  const barX = useTransform(p, [0.22, 0.46], [0, 1]);
  const barLabelO = useTransform(p, [0.38, 0.48], [0, 1]);

  const exitO = useTransform(p, [0.46, 0.6], [0, 1]);
  const exitY = useTransform(p, [0.46, 0.6], [16, 0]);

  const leaderY = useTransform(p, [0.56, 0.68], [0, 1]);
  const annO = useTransform(p, [0.6, 0.74], [0, 1]);

  const proofO = useTransform(p, [0.74, 0.86], [0, 1]);
  const alignY = useTransform(p, [0.86, 0.95], [0, 1]);
  const closeO = useTransform(p, [0.9, 1], [0, 1]);

  // one per week — declared flat, never inside the map
  const ghost0 = useTransform(p, [0.760, 0.810], [0, 1]);
  const ghost1 = useTransform(p, [0.795, 0.845], [0, 1]);
  const ghost2 = useTransform(p, [0.830, 0.880], [0, 1]);
  const ghosts = [ghost0, ghost1, ghost2];

  return (
    <section id="gap" ref={outer} className={`relative ${pinned ? "h-[340vh]" : ""}`}>

      <div
        ref={inner}
        className={`${pinned ? "sticky top-0 h-screen" : ""} flex items-center py-24 lg:pt-24 lg:pb-10`}
      >
        <div className="wrap w-full">
          {/* ---------- the claim ---------- */}
          <motion.div
            style={{ opacity: headO, y: headY }}
            className="grid gap-8 lg:gap-20 lg:grid-cols-[1fr_440px] items-end"
          >
            <div>
              <div className="lbl" style={{ color: "var(--fg-3)" }}>
                01 — The gap
              </div>
              <h2 className="disp h-section mt-5 max-w-[620px]">
                The ends still talk.
              </h2>
            </div>
            <p className="copy text-[15px] sm:text-[16px] lg:mb-2">
              USDCx hides the middle: a shielded transfer between two private
              accounts reveals nothing. But value has to enter and leave — and a
              pay-run that repeats every Friday is a signature long before anyone
              touches the cryptography.
            </p>
          </motion.div>

          {/* ---------- one payment, across the page ---------- */}
          <div className="mt-12 sm:mt-16">
            <div className="lifecycle items-stretch">
              <motion.div
                style={{ opacity: mintO, y: mintY, borderColor: "var(--loud)" }}
                className="border rounded-[2px] px-4 py-4 sm:px-5 sm:py-6 flex flex-col justify-between"
              >
                <div className="lbl text-[10px] sm:text-[11px]" style={{ color: "var(--loud)" }}>
                  Mint
                </div>
                <div className="mono text-[12px] sm:text-[14px] mt-4" style={{ color: "var(--fg-2)" }}>
                  public
                </div>
              </motion.div>

              <div className="relative rounded-[2px] overflow-hidden flex items-center justify-center min-h-[84px] sm:min-h-[104px]">
                <motion.div
                  className="absolute inset-0 origin-left"
                  style={{ scaleX: barX, background: "var(--fg)" }}
                />
                <motion.span
                  className="lbl relative text-[10px] sm:text-[11px] text-center px-3"
                  style={{ opacity: barLabelO, color: "var(--ground)" }}
                >
                  Private transfers · opaque
                </motion.span>
              </div>

              <motion.div
                style={{ opacity: exitO, y: exitY, borderColor: "var(--loud)" }}
                className="border rounded-[2px] px-4 py-4 sm:px-5 sm:py-6 flex flex-col justify-between"
              >
                <div className="lbl text-[10px] sm:text-[11px]" style={{ color: "var(--loud)" }}>
                  Burn / bridge exit
                </div>
                <div className="mono text-[12px] sm:text-[14px] mt-4" style={{ color: "var(--fg-2)" }}>
                  public
                </div>
              </motion.div>
            </div>

            {/* leader lines drop from the two public ends */}
            <div className="lifecycle h-7 sm:h-10">
              <motion.div
                className="w-px h-full ml-4 sm:ml-5 origin-top"
                style={{ scaleY: leaderY, background: "var(--loud)" }}
              />
              <div />
              <motion.div
                className="w-px h-full ml-4 sm:ml-5 origin-top"
                style={{ scaleY: leaderY, background: "var(--loud)" }}
              />
            </div>

            {/* what each end puts on a public ledger */}
            <motion.div style={{ opacity: annO }} className="lifecycle items-start">
              <div className="flex flex-col gap-2 pl-4 sm:pl-5">
                {MINT_LEAKS.map((t) => (
                  <span key={t} className="mono text-[11px] sm:text-[13px]" style={{ color: "var(--fg-2)" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="hidden sm:flex justify-center pt-1">
                <span className="mono text-[13px]" style={{ color: "var(--fg-3)" }}>
                  — no amount, no graph, no memo —
                </span>
              </div>
              <div className="flex flex-col gap-2 pl-4 sm:pl-5">
                {EXIT_LEAKS.map((t) => (
                  <span key={t} className="mono text-[11px] sm:text-[13px]" style={{ color: "var(--fg-2)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ---------- the proof: three weeks on the same grid ---------- */}
          <motion.div
            style={{ opacity: proofO, borderColor: "var(--rule)" }}
            className="mt-10 sm:mt-14 pt-6 border-t"
          >
            <div className="lifecycle">
              <span className="lbl text-[10px]" style={{ color: "var(--fg-3)" }}>
                The same run
              </span>
              <span />
              <span className="lbl text-[10px] pl-4 sm:pl-5" style={{ color: "var(--fg-3)" }}>
                Its exit
              </span>
            </div>

            <div className="relative mt-4">
              <div className="flex flex-col gap-[10px] sm:gap-3">
                {WEEKS.map((week, i) => (
                  <motion.div key={week} className="lifecycle items-center" style={{ opacity: ghosts[i] }}>
                    <span className="mono text-[11px] sm:text-[12px]" style={{ color: "var(--fg-3)" }}>
                      {week}
                    </span>
                    <span
                      className="h-[5px] rounded-[1px] block"
                      style={{ background: "var(--rule)" }}
                    />
                    <span
                      className="mono text-[11px] sm:text-[12px] pl-4 sm:pl-5"
                      style={{ color: "var(--fg-2)" }}
                    >
                      184,200 · Fri 14:02
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* falls exactly on the left edge of the exit column above */}
              <motion.div
                className="align-line absolute -top-2 -bottom-2 w-[2px] origin-top"
                style={{ scaleY: alignY, background: "var(--loud)" }}
              />
            </div>

            <motion.p
              style={{ opacity: closeO }}
              className="copy text-[15px] sm:text-[16px] mt-7 max-w-[620px]"
            >
              Three weeks and the two ends line up on amount and cadence. That
              correlation is the leak — not the transfer in between.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
