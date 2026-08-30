"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { SLAM } from "./motion";
import { usePinned } from "./usePinned";

/* ==========================================================================
   Set-piece 2 — scoped disclosure.

   Pinned. The same settled run stays on screen while the key changes hands:
   controller, then investigator, then donor desk. Fields that the incoming key
   cannot open are replaced by a redaction bar that slams in from the left.

   The bar is honest. A redacted field is not rendered as covered text — there
   is no text. `null` in the data means nothing is put in the DOM at all.
   ========================================================================== */

const FIELDS = [
  "Settlement",
  "Block",
  "Run",
  "Period",
  "Payments",
  "Total",
  "Counterparty",
  "Override",
] as const;

/** deterministic bar widths, so the redactions don't reflow between renders */
const BAR_W = ["66%", "58%", "52%", "70%", "44%", "72%", "86%", "56%"];

type Role = {
  name: string;
  key: string;
  scope: string;
  released: string;
  /** null = never decrypted for this key */
  values: (string | null)[];
  /** index of a value that should read as a flagged state */
  flag?: number;
};

const ROLES: Role[] = [
  {
    name: "Public",
    key: "no key · explorer, analytics, competitors",
    scope: "scope chain.public",
    released: "2 of 8 fields released",
    values: [
      "burn_private",
      "4,912,077",
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    name: "Owner",
    key: "key owner@acme · no expiry",
    scope: "scope org.records",
    released: "8 of 8 fields released",
    values: [
      "burn_private",
      "4,912,077",
      "2026-W35",
      "24–30 Aug",
      "41",
      "184,200 USDCx",
      "17 vendors",
      "0 logged",
    ],
  },
  {
    name: "Mandated",
    key: "key warrant-8841 · ttl 14d",
    scope: "scope payment#17",
    released: "7 of 8 fields released",
    values: [
      "burn_private",
      "4,912,077",
      "2026-W35",
      "24–30 Aug",
      "1 of 41",
      null,
      "al1q…4f8d",
      "1 · logged",
    ],
    flag: 7,
  },
];

export default function Disclosure() {
  const reduced = useReducedMotion();
  const pinned = usePinned();
  const outer = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });

  const played = useMotionValue(0);
  const entered = useInView(inner, { once: true, amount: 0.3 });
  useEffect(() => {
    if (pinned) return;
    if (reduced) {
      played.set(1);
      return;
    }
    if (entered) animate(played, 1, { duration: 0.9, ease: SLAM });
  }, [pinned, reduced, entered, played]);

  const p: MotionValue<number> = pinned ? scrollYProgress : played;
  const introO = useTransform(p, [0, 0.1], [0, 1]);
  const introY = useTransform(p, [0, 0.1], [24, 0]);

  // scroll hands the key on; clicking a tab takes over until scroll moves again
  const [scrollRole, setScrollRole] = useState(0);
  const [manual, setManual] = useState<number | null>(null);
  const lastScrollRole = useRef(0);

  useMotionValueEvent(p, "change", (v) => {
    if (!pinned) return;
    const next = v < 0.34 ? 0 : v < 0.64 ? 1 : 2;
    if (next !== lastScrollRole.current) {
      lastScrollRole.current = next;
      setScrollRole(next);
      setManual(null);
    }
  });

  const active = manual ?? scrollRole;
  const role = ROLES[active];

  return (
    <section
      id="disclosure"
      ref={outer}
      className={`relative ${pinned ? "h-[300vh]" : ""}`}
    >

      <div
        ref={inner}
        className={`${pinned ? "sticky top-0 h-screen" : ""} flex items-center py-24 lg:pt-24 lg:pb-10`}
      >
        <div className="wrap w-full">
          <motion.div
            style={{ opacity: introO, y: introY }}
            className="grid gap-8 lg:gap-20 lg:grid-cols-[520px_1fr] items-end"
          >
            <div>
              <div className="lbl" style={{ color: "var(--fg-3)" }}>
                04 — The desk
              </div>
              <h2 className="disp h-section mt-5">
                Three viewers. Three graphs.
              </h2>
            </div>
            <p className="copy text-[15px] sm:text-[16px] max-w-[520px] lg:mb-1">
              Institutional privacy is not personal privacy. The street must see
              nothing in real time. A fund must see its own book. A regulator may
              have to see a window. Clearing houses already live this rule — people
              who can see every member’s position are barred from trading it.{" "}
              <span className="mark">The desk is that rule as software.</span>
            </p>
          </motion.div>

          {/* ---------- role tabs ---------- */}
          <div
            className="flex mt-10 sm:mt-12 border-b"
            style={{ borderColor: "var(--rule)" }}
            role="tablist"
            aria-label="Viewing key"
          >
            {ROLES.map((r, i) => (
              <button
                key={r.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setManual(i)}
                className="relative h-14 flex-1 sm:flex-none sm:min-w-[220px] px-3 sm:px-7 text-left lbl text-[10px] sm:text-[11px] border-l first:border-l-0 transition-colors duration-200"
                style={{
                  color: i === active ? "var(--fg)" : "var(--fg-3)",
                  borderColor: "var(--rule)",
                }}
              >
                <span className="block mono text-[9px] mb-1" style={{ color: "var(--fg-3)" }}>
                  {`0${i + 1}`}
                </span>
                {r.name}
                {i === active && (
                  <motion.span
                    layoutId="role-underline"
                    className="absolute left-0 right-0 -bottom-px h-[3px]"
                    style={{ background: "var(--fg)" }}
                    transition={{ duration: 0.34, ease: SLAM }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* ---------- the pane ---------- */}
          <div className="pane mt-6 px-5 py-6 sm:px-7 sm:py-[26px]">
            <div className="flex items-baseline justify-between gap-4 pb-[18px] border-b pane-rule">
              <span className="lbl text-[11px] text-[#F2EEE6]">{role.name}</span>
              <span className="mono text-[11px] sm:text-[11.5px] text-[rgba(242,238,230,0.48)] text-right">
                {role.key}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-7 pt-6 pb-7">
              {FIELDS.map((label, i) => {
                const value = role.values[i];
                return (
                  <div key={label}>
                    <div className="pane-lbl">{label}</div>
                    {value === null ? (
                      <motion.span
                        key={`redaction-${active}-${label}`}
                        aria-label="Not decrypted for this key"
                        className="redaction mt-[10px] h-[17px] origin-left"
                        style={{ width: BAR_W[i] }}
                        initial={reduced ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, ease: SLAM, delay: i * 0.028 }}
                      />
                    ) : (
                      <motion.div
                        key={`value-${active}-${label}`}
                        className="pane-val text-[14px] sm:text-[15px] mt-[9px]"
                        style={{ color: role.flag === i ? "#D9793C" : undefined }}
                        initial={reduced ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, ease: SLAM, delay: i * 0.028 }}
                      >
                        {value}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-4 border-t pane-rule pt-4">
              <span className="mono text-[11px] sm:text-[11.5px] text-[rgba(242,238,230,0.48)]">
                {role.scope}
              </span>
              <span className="mono text-[11px] sm:text-[11.5px] text-[rgba(242,238,230,0.48)]">
                {role.released}
              </span>
            </div>
          </div>

          <p className="copy text-[14.5px] sm:text-[15px] mt-6 max-w-[820px]">
            Cero does not invent visibility the program did not emit — it renders
            and scopes what the rail already writes. The blanked fields are not
            hidden by the interface; they are never decrypted for that key.
          </p>
        </div>
      </div>
    </section>
  );
}
