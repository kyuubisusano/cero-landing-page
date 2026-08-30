"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";

/* ==========================================================================
   The page changes ground as you scroll.

   Paper while the payment is still a document. Dark from the moment value
   leaves the private side, through the flow. Paper again at disclosure, when
   people are reading their own slice.

   One scroll source, one transform, four stops. An earlier version had two
   independent scroll trackers subtracting from one another with a state-driven
   flip on top; the pieces could disagree and strand the page mid-swap — dark
   ground at the top of the document, or light type left on paper. The stops
   here are measured from the two sections that own those beats, so the whole
   swap is a pure function of scroll position.
   ========================================================================== */

const PAPER = {
  ground: "#C7D0C5",
  ground2: "#B6C0B4",
  fg: "#0A0C0A",
  fg2: "rgba(10, 12, 10, 0.70)",
  fg3: "rgba(10, 12, 10, 0.46)",
  rule: "rgba(10, 12, 10, 0.24)",
  ruleSoft: "rgba(10, 12, 10, 0.11)",
  pane: "#0D0F0D",
  fieldBg: "rgba(255, 255, 255, 0.5)",
  fieldRule: "rgba(10, 12, 10, 0.36)",
  quiet: "#0047FF",
  loud: "#E4002B",
};

const DARK = {
  ground: "#07090A",
  ground2: "#0E1113",
  fg: "#E6EAE5",
  fg2: "rgba(230, 234, 229, 0.68)",
  fg3: "rgba(230, 234, 229, 0.48)",
  rule: "rgba(230, 234, 229, 0.22)",
  ruleSoft: "rgba(230, 234, 229, 0.11)",
  // in the dark register the pane sits *above* the ground rather than below
  // it — the inset relationship inverts, so panes still read as instruments
  pane: "#14181A",
  fieldBg: "rgba(230, 234, 229, 0.08)",
  fieldRule: "rgba(230, 234, 229, 0.3)",
  quiet: "#6E93FF",
  loud: "#FF2D55",
};

/** scroll positions of the four beats, in document px */
type Stops = [number, number, number, number];

const UNMEASURED: Stops = [0, 1, 2, 3];

export default function ThemeScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  // Stops live in a ref rather than state: they are read inside a transform,
  // not rendered, and writing them from an effect would be a state-in-effect.
  // `remeasured` is bumped alongside so the transform re-runs on resize even
  // if the page has not scrolled.
  const stops = useRef<Stops>(UNMEASURED);
  const remeasured = useMotionValue(0);

  const measure = useCallback(() => {
    const door = document.getElementById("door");
    const disclosure = document.getElementById("disclosure");
    if (!door || !disclosure) return;

    const doorTop = door.getBoundingClientRect().top + window.scrollY;
    const doorH = door.offsetHeight;
    const discTop = disclosure.getBoundingClientRect().top + window.scrollY;

    // dark rises across the middle of the door set-piece, where the opaque
    // transfer completes and value heads for a public exit
    const darkStart = doorTop + doorH * 0.3;
    const darkEnd = doorTop + doorH * 0.46;
    // and falls again just before disclosure arrives
    const paperStart = discTop - window.innerHeight * 0.78;
    const paperEnd = discTop - window.innerHeight * 0.16;

    const next: Stops = [darkStart, darkEnd, paperStart, paperEnd];
    // a non-monotonic stop list would make the whole transform meaningless
    if (!next.every((v, i) => i === 0 || v > next[i - 1])) return;
    if (stops.current.every((v, i) => v === next[i])) return;
    stops.current = next;
    remeasured.set(remeasured.get() + 1);
  }, [remeasured]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const target = useTransform(() => {
    remeasured.get(); // tracked, so a resize re-runs this
    const y = scrollY.get();
    const [darkStart, darkEnd, paperStart, paperEnd] = stops.current;
    if (y <= darkStart) return 0;
    if (y < darkEnd) return (y - darkStart) / (darkEnd - darkStart);
    if (y <= paperStart) return 1;
    if (y < paperEnd) return 1 - (y - paperStart) / (paperEnd - paperStart);
    return 0;
  });
  const dark = useSpring(target, { stiffness: 150, damping: 30, mass: 0.4 });

  /* --------------------------------------------------------------------
     Crossing between two inverted palettes is the one thing that can go
     badly wrong here. Ramp ink and paper linearly against each other and
     they meet in the middle as the SAME mid-grey — foreground and ground
     converge and the text disappears for the length of the transition.

     So the swap is in two parts. The ground rides an S-curve that loiters
     near each register and crosses the middle fast; every foreground token
     steps over at halfway, on a short spring. It reads as one deliberate
     flip, and contrast never collapses.
     -------------------------------------------------------------------- */
  const curved = useTransform(dark, [0, 0.4, 0.6, 1], [0, 0.08, 0.92, 1]);
  const step = useTransform(dark, (v): number => (v > 0.5 ? 1 : 0));
  const flip = useSpring(step, { stiffness: 300, damping: 34, mass: 0.5 });

  // ground reads as a continuous ramp — nothing sits on it that can vanish
  const ground = useTransform(curved, [0, 1], [PAPER.ground, DARK.ground]);
  const ground2 = useTransform(curved, [0, 1], [PAPER.ground2, DARK.ground2]);
  // a pane is dark in both registers, so it is safe to ramp too
  const pane = useTransform(curved, [0, 1], [PAPER.pane, DARK.pane]);

  // everything that must stay legible against the ground steps instead
  const fg = useTransform(flip, [0, 1], [PAPER.fg, DARK.fg]);
  const fg2 = useTransform(flip, [0, 1], [PAPER.fg2, DARK.fg2]);
  const fg3 = useTransform(flip, [0, 1], [PAPER.fg3, DARK.fg3]);
  const rule = useTransform(flip, [0, 1], [PAPER.rule, DARK.rule]);
  const ruleSoft = useTransform(flip, [0, 1], [PAPER.ruleSoft, DARK.ruleSoft]);
  const fieldBg = useTransform(flip, [0, 1], [PAPER.fieldBg, DARK.fieldBg]);
  const fieldRule = useTransform(flip, [0, 1], [PAPER.fieldRule, DARK.fieldRule]);
  const quiet = useTransform(flip, [0, 1], [PAPER.quiet, DARK.quiet]);
  const loud = useTransform(flip, [0, 1], [PAPER.loud, DARK.loud]);

  const vars = {
    "--ground": ground,
    "--ground-2": ground2,
    "--fg": fg,
    "--fg-2": fg2,
    "--fg-3": fg3,
    "--rule": rule,
    "--rule-soft": ruleSoft,
    "--pane": pane,
    "--field-bg": fieldBg,
    "--field-rule": fieldRule,
    "--quiet": quiet,
    "--loud": loud,
    position: "relative",
    // The tokens are declared on THIS element, so `body { color: var(--fg) }`
    // still resolves against :root and would leave every inheriting heading at
    // the static paper ink — invisible once the ground turns. Inheritance has
    // to start here.
    color: "var(--fg)",
  } as unknown as MotionStyle;

  // Under reduced motion the ground never swaps — the page stays the document
  // it opens as.
  if (reduced) {
    return <div style={{ position: "relative" }}>{children}</div>;
  }

  return (
    <motion.div style={vars}>
      <motion.div
        aria-hidden
        style={{ backgroundColor: ground }}
        className="fixed inset-0 -z-10"
      />
      {children}
    </motion.div>
  );
}
