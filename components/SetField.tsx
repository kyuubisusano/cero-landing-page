"use client";

import { useCallback, useRef } from "react";

/* ==========================================================================
   The set field — Cero's mark.

   A row of ticks: every exit in a window. Most sit at a uniform, anonymous
   height. A few are singletons and stand alone in red.

   It is the product's core claim as a picture, and it is the whole identity
   system: the logotype, the favicon, the section markers, and the interactive
   band in the hero.

   Interaction argues the thesis. At rest the field is flat and every tick
   looks the same — the set appears anonymous. The cursor is a light: wherever
   it falls, ticks resolve to their true heights and the singletons show red.
   Anonymity is only apparent until somebody looks.

   The reveal is a masked second copy of the field rather than per-tick state,
   so moving the cursor writes two CSS variables instead of re-rendering a
   hundred nodes.
   ========================================================================== */

/**
 * Deterministic across environments — this must produce bit-identical output on
 * the server and in the browser or the field hydrates with a mismatch.
 *
 * An earlier version used Math.sin, which is NOT specified to the last bit and
 * genuinely differs between Node and V8-in-Chrome: the server sent
 * height="20.12070078567951" and the client computed 20.12070078585763. React
 * refuses to patch attribute mismatches, so the whole hero stopped animating.
 * Integer ops are exact, and the result is rounded before it reaches the DOM.
 */
function hash(i: number, salt = 0) {
  let x = ((i + 1) * 0x9e3779b1) ^ ((salt + 1) * 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 16), 0x21f0aaad);
  x = Math.imul(x ^ (x >>> 15), 0x735a2d97);
  x = x ^ (x >>> 15);
  return (x >>> 0) / 4294967296;
}

/** two decimals is plenty for a 3px bar, and leaves no float tail to diverge */
function px(n: number) {
  return Math.round(n * 100) / 100;
}

export type SetFieldProps = {
  /** number of ticks */
  count?: number;
  /** px height of the tallest tick */
  height?: number;
  /** px width of one tick */
  tick?: number;
  /** px gap between ticks */
  gap?: number;
  /** roughly 1 in N ticks is a singleton */
  rarity?: number;
  /** varies the pattern between instances */
  salt?: number;
  /** the cursor resolves the true distribution */
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function SetField({
  count = 64,
  height = 44,
  tick = 3,
  gap = 3,
  rarity = 8,
  salt = 0,
  interactive = false,
  className = "",
  style,
}: SetFieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Set the two custom properties straight from the handler. An earlier version
  // deferred this to requestAnimationFrame; that stalls wherever frames are
  // throttled, and the in-flight guard latches so no later move is ever read.
  // Pointermove already fires about once a frame, and writing a custom property
  // consumed only by a mask costs nothing worth batching.
  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.dataset.lit = "1";
  }, []);

  // `data-lit` is never declared in JSX — React would reset it on any
  // re-render. The CSS default is unlit; JS only ever adds the lit state.
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) delete el.dataset.lit;
  }, []);

  const width = count * tick + (count - 1) * gap;

  // At rest every tick sits at the same anonymous height. Lit, each shows what
  // it actually is — and the singletons are the ones standing alone.
  // No two singletons adjacent: side-by-side reds read as a rendering fault
  // rather than as a distribution, and a singleton standing next to another
  // one is a contradiction in terms.
  const bars: { x: number; trueH: number; singleton: boolean }[] = [];
  for (let i = 0; i < count; i++) {
    const r = hash(i, salt);
    const singleton =
      Math.floor(hash(i, salt + 7) * rarity) === 0 && !bars[i - 1]?.singleton;
    bars.push({
      x: i * (tick + gap),
      trueH: px(singleton ? height : height * (0.3 + r * 0.55)),
      singleton,
    });
  }

  // The rest state has to read as genuinely uniform and the lit state as
  // genuinely varied, or "looking resolves the set" is a claim the graphic
  // does not actually make.
  const restH = px(height * 0.28);

  return (
    <div
      ref={ref}
      className={`set-field ${interactive ? "set-field--live" : ""} ${className}`}
      style={{ width, height, ...style }}
      onPointerEnter={interactive ? onMove : undefined}
      onPointerMove={interactive ? onMove : undefined}
      onPointerLeave={interactive ? onLeave : undefined}
      aria-hidden
    >
      {/* the set as it appears: uniform, anonymous */}
      <svg
        className="set-field__base"
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        fill="none"
      >
        {bars.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={height - restH}
            width={tick}
            height={restH}
            fill="currentColor"
            opacity={0.34}
          />
        ))}
      </svg>

      {/* the set as it is: true heights, singletons in red */}
      <svg
        className="set-field__lit"
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        fill="none"
      >
        {bars.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={height - b.trueH}
            width={tick}
            height={b.trueH}
            fill={b.singleton ? "var(--loud)" : "currentColor"}
            opacity={b.singleton ? 1 : 0.7}
          />
        ))}
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The logotype. The wordmark plus a compact field where one tick stands alone.
   -------------------------------------------------------------------------- */

export function CeroMark({
  height = 22,
  count = 13,
}: {
  height?: number;
  count?: number;
}) {
  const tick = 3;
  const gap = 3;
  const width = count * tick + (count - 1) * gap;
  // the singleton sits off-centre — a mark, not a pattern
  const lone = count - 4;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden
      style={{ display: "block", overflow: "visible" }}
    >
      {Array.from({ length: count }, (_, i) => {
        const singleton = i === lone;
        const h = px(singleton ? height : height * (0.3 + hash(i, 3) * 0.22));
        return (
          <rect
            key={i}
            x={i * (tick + gap)}
            y={height - h}
            width={tick}
            height={h}
            fill={singleton ? "var(--loud)" : "currentColor"}
            opacity={singleton ? 1 : 0.55}
          />
        );
      })}
    </svg>
  );
}
