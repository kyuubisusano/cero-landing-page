import type { Transition, Variants } from "framer-motion";

/** One easing curve and three duration tiers, used everywhere. */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const SLAM = [0.2, 0.9, 0.1, 1] as const;

export const FAST: Transition = { duration: 0.26, ease: EASE };
export const MID: Transition = { duration: 0.52, ease: EASE };
export const SLOW: Transition = { duration: 0.9, ease: EASE };

export const IN_VIEW = { once: true, amount: 0.35 } as const;

/** Parent that staggers its children in. */
export const stagger = (gap = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** A line of type rising out of its mask. Pair with `.line-mask`. */
export const riseLine: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: SLOW },
};

/** Everything that is not a headline. */
export const riseSoft: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: MID },
};

/** A rule drawing itself across. Pair with `transform-origin: left`. */
export const drawX: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
};
