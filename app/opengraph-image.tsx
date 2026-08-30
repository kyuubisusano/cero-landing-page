import { ImageResponse } from "next/og";

/* The link preview: what X, Slack, iMessage and LinkedIn show when someone
   pastes cero. Same stock, same mark, same claim as the page — a set that
   looks uniform until you notice the one standing alone. */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Cero — the pool is big, the exit is one. A control room for private dollars on Aleo.";

const GROUND = "#C7D0C5";
const INK = "#0A0C0A";
const LOUD = "#E4002B";

/** integer-exact, matching components/SetField.tsx */
function hash(i: number, salt = 0) {
  let x = ((i + 1) * 0x9e3779b1) ^ ((salt + 1) * 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 16), 0x21f0aaad);
  x = Math.imul(x ^ (x >>> 15), 0x735a2d97);
  x = x ^ (x >>> 15);
  return (x >>> 0) / 4294967296;
}

export default function OpengraphImage() {
  const COUNT = 78;
  const MAX = 150;

  // no two singletons adjacent — see components/SetField.tsx
  const bars: { h: number; singleton: boolean }[] = [];
  for (let i = 0; i < COUNT; i++) {
    const singleton =
      Math.floor(hash(i, 7) * 13) === 0 && !bars[i - 1]?.singleton;
    bars.push({
      h: singleton ? MAX : MAX * (0.16 + hash(i) * 0.26),
      singleton,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: GROUND,
          color: INK,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "62px 68px",
          fontFamily: "sans-serif",
        }}
      >
        {/* masthead */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 21 }}>
          <div style={{ display: "flex", letterSpacing: 2, fontWeight: 600 }}>
            CERO
          </div>
          <div style={{ display: "flex", letterSpacing: 2, opacity: 0.5 }}>
            WORKING PAPER · V0.1
          </div>
        </div>

        {/* the claim */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 118,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 1,
            }}
          >
            THE POOL IS BIG.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 118,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 1,
              color: LOUD,
            }}
          >
            THE EXIT IS ONE.
          </div>
        </div>

        {/* the set — one tick standing alone */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              height: MAX,
              gap: 8,
            }}
          >
            {bars.map((b, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: b.h,
                  background: b.singleton ? LOUD : INK,
                  opacity: b.singleton ? 1 : 0.34,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 22,
              fontSize: 20,
              letterSpacing: 2,
              opacity: 0.62,
            }}
          >
            <div style={{ display: "flex" }}>
              A CONTROL ROOM FOR PRIVATE DOLLARS ON ALEO
            </div>
            <div style={{ display: "flex", color: LOUD, opacity: 1 }}>
              RED = SINGLETON
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
