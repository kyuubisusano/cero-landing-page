"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { EASE, FAST } from "./motion";

/* ==========================================================================
   The exit-score instrument.

   A pay-run is about to leave the private side. The widget resolves the
   anonymity set in the exit window, scores how identifiable each candidate
   exit would be, and routes the quiet one. Twelve steps, ~7.4s, then it loops.

   Every value shown belongs to one labelled example run. Nothing here is a
   decorative animation: the score moves because the routing changed.
   ========================================================================== */

/** ticks are a fixed 3px + 3px gap, so how many fit is a function of width */
const TICK_SLOT = 6;
const TICKS_DEFAULT = 72;
const STEP_MS = 620;
const STEPS = 12;

/** score by step — "––" until the set has resolved */
const SCORES: (number | null)[] = [
  null, null, null, 87, 87, 87, 61, 34, 9, 9, 9, 9,
];

const PHASES = [
  "Scanning exit window",
  "Scanning exit window",
  "Set resolved",
  "Scoring candidates",
  "Scoring candidates",
  "Scoring candidates",
  "Routing",
  "Routing",
  "Routed — quiet path",
  "Routed — quiet path",
  "Routed — quiet path",
  "Routed — quiet path",
];

// framer-motion interpolates colours, not CSS variables, so the pane-lit pair
// is written literally here. It matches --quiet-lit / --loud-lit in globals.css.
const QUIET = "#4FD08C";
const LOUD = "#FF4A2B";
const DIM = "rgba(232,237,228,0.46)";

export default function ExitScore() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });

  // The set fills whatever width it is given rather than overflowing narrow
  // screens. Starts at the SSR count, then measures once mounted.
  const [ticks, setTicks] = useState(TICKS_DEFAULT);
  useEffect(() => {
    const el = setRef.current;
    if (!el) return;
    const measure = () => {
      const n = Math.max(18, Math.floor(el.clientWidth / TICK_SLOT));
      setTicks(n);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 9 is the first fully-routed step — the resting state for reduced motion
  const [t, setT] = useState(reduced ? 9 : 0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (!inView || held) return;
    const id = setInterval(() => setT((v) => (v + 1) % STEPS), STEP_MS);
    return () => clearInterval(id);
  }, [reduced, inView, held]);

  // the score counts rather than cuts, so the drop from loud to quiet reads
  const scoreTarget = useMotionValue(SCORES[t] ?? 87);
  const scoreSpring = useSpring(scoreTarget, {
    stiffness: 90,
    damping: 18,
    mass: 0.5,
  });
  const scoreText = useTransform(scoreSpring, (v) =>
    String(Math.round(v)).padStart(2, "0")
  );

  useEffect(() => {
    const next = SCORES[t];
    if (next !== null) scoreTarget.set(next);
  }, [t, scoreTarget]);

  const resolved = t >= 2;
  const scoring = t >= 3;
  const routed = t >= 8;
  const aOn = t >= 3 && t <= 5;
  const bOn = t >= 6;

  const fill = t < 1 ? 0.28 : t < 2 ? 0.66 : 1;
  const scoreColor = !scoring ? "rgba(232,237,228,0.26)" : routed ? QUIET : t >= 7 ? "#E8EDE4" : LOUD;
  const phaseColor = routed ? QUIET : scoring ? LOUD : DIM;

  return (
    <motion.div
      ref={ref}
      className="pane p-5 sm:p-7"
      onHoverStart={() => setHeld(true)}
      onHoverEnd={() => setHeld(false)}
      initial={reduced ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
    >
      {/* header */}
      <div className="flex items-baseline justify-between border-b pane-rule pb-[15px]">
        <span className="lbl text-[10.5px] text-[rgba(232,237,228,0.92)]">
          Pay-run 2026-W35
        </span>
        <span className="lbl text-[10.5px] text-[rgba(232,237,228,0.44)]">
          Example run
        </span>
      </div>

      {/* run header values */}
      <div className="flex gap-7 sm:gap-[34px] pt-[17px] pb-[21px]">
        {[
          ["Payments", "41"],
          ["Value", "184,200 USDCx"],
          ["Exit window", "09:00–17:00"],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="pane-lbl">{label}</div>
            <div className="pane-val text-[15px] sm:text-[16px] mt-[5px]">{value}</div>
          </div>
        ))}
      </div>

      {/* anonymity set — each tick is a real exit in the same window */}
      <div className="pane-lbl">Anonymity set at exit window</div>
      <div ref={setRef} className="flex items-end gap-[3px] h-8 mt-[11px] overflow-hidden">
        {Array.from({ length: ticks }, (_, i) => {
          const on = i < Math.round(ticks * fill);
          const mine = i % 9 === 4;
          const color = !on
            ? "rgba(232,237,228,0.05)"
            : mine
              ? routed
                ? QUIET
                : scoring
                  ? LOUD
                  : "rgba(232,237,228,0.55)"
              : "rgba(232,237,228,0.15)";
          return (
            <motion.span
              key={i}
              className="block w-[3px] shrink-0 rounded-[1px]"
              style={{ height: mine ? 30 : 18, background: color }}
              initial={reduced ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.5 + i * 0.006 }}
            />
          );
        })}
      </div>
      <div className="mono text-[11px] text-[rgba(232,237,228,0.5)] mt-[9px]">
        {resolved ? "1,284 exits in window · 41 ours" : "… resolving exits in window"}
      </div>

      {/* score */}
      <div className="flex items-end justify-between mt-[22px] pt-[18px] border-t pane-rule">
        <div>
          <div className="pane-lbl">Exit uniqueness</div>
          <div
            className="mono leading-none tracking-[-0.035em] mt-[7px] text-[56px] sm:text-[76px]"
            style={{ color: scoreColor, transition: "color 300ms linear" }}
          >
            {scoring ? <motion.span>{scoreText}</motion.span> : <span>––</span>}
          </div>
        </div>
        <div
          className="lbl text-[10.5px] text-right"
          style={{ color: phaseColor, transition: "color 300ms linear" }}
        >
          {PHASES[t]}
        </div>
      </div>

      {/* the two candidate exits */}
      <div className="flex flex-col gap-2 mt-[18px]">
        <Candidate label="Exit A · single burn · 14:02 UTC" score="87" on={aOn} tone={LOUD} />
        <Candidate label="Exit B · 6 tranches · held to window" score="09" on={bOn} tone={QUIET} />
      </div>

      {/* verdict — holds its space so nothing jumps */}
      <div
        className="mono text-[11.5px] mt-[18px] pt-[15px] border-t pane-rule"
        style={{
          color: QUIET,
          opacity: routed ? 1 : 0,
          transition: "opacity 340ms ease",
        }}
      >
        Routed · Exit B · 6 tranches held to 17:00 · uniqueness 09
      </div>
    </motion.div>
  );
}

function Candidate({
  label,
  score,
  on,
  tone,
}: {
  label: string;
  score: string;
  on: boolean;
  tone: string;
}) {
  return (
    <motion.div
      className="flex items-center justify-between px-[13px] py-[11px] rounded-[2px] border"
      animate={{
        borderColor: on ? tone : "rgba(232,237,228,0.10)",
        backgroundColor: on ? "rgba(232,237,228,0.05)" : "rgba(232,237,228,0)",
      }}
      transition={FAST}
    >
      <div className="flex items-center gap-[11px] min-w-0">
        <motion.span
          className="block w-2 h-2 rounded-[1px] shrink-0"
          animate={{ backgroundColor: on ? tone : "rgba(232,237,228,0.22)" }}
          transition={FAST}
        />
        <span className="mono text-[11.5px] sm:text-xs text-[rgba(232,237,228,0.86)] truncate">
          {label}
        </span>
      </div>
      <motion.span
        className="mono text-[13px] shrink-0 pl-3"
        animate={{ color: on ? tone : "rgba(232,237,228,0.34)" }}
        transition={FAST}
      >
        {score}
      </motion.span>
    </motion.div>
  );
}
