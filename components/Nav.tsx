"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { EASE } from "./motion";
import { CeroMark } from "./SetField";

const LINKS = [
  ["Door", "#door"],
  ["Research", "#research"],
  ["Desk", "#disclosure"],
  ["Limits", "#limits"],
];

export default function Nav() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 40));

  return (
    <motion.header
      // opaque, not transparent: headlines are large enough here that they
      // collide with the nav as they scroll under it
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "var(--ground)" }}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
    >
      <motion.div
        className="wrap flex items-center justify-between"
        animate={{ height: condensed ? 62 : 78 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <a href="#top" className="flex items-center gap-[9px]" aria-label="Cero, home">
          <span className="disp text-[24px] tracking-[-0.05em]">Cero</span>
          <CeroMark height={18} />
        </a>

        <nav className="flex items-center gap-6 sm:gap-8">
          {/* hidden on the group, not per-link: `.btn-ghost` sets display and
              is declared after Tailwind, so it would beat `.hidden` */}
          <div className="hidden sm:flex items-center gap-8">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} className="btn-ghost lbl whitespace-nowrap">
                {label}
              </a>
            ))}
          </div>
          <a className="btn h-10 px-4 text-[11px] whitespace-nowrap" href="#waitlist">
            <span>Request a key</span>
          </a>
        </nav>
      </motion.div>

      {/* the rule only appears once you have left the top of the page */}
      <motion.div
        className="h-px origin-left"
        style={{ background: "var(--rule)" }}
        animate={{ scaleX: condensed ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      />
    </motion.header>
  );
}
