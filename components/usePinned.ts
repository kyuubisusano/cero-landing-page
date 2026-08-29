"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Whether a set-piece should pin and scrub against scroll.
 *
 * Pinning needs viewport height to spend, so below `lg` the same choreography
 * plays once on entry instead. Reduced motion never pins.
 */
export function usePinned(minWidth = 1024, minHeight = 620) {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${minWidth}px) and (min-height: ${minHeight}px)`
    );
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [minWidth, minHeight]);

  return wide && !reduced;
}
