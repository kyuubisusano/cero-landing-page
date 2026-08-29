"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FAST, MID } from "./motion";

type State = "idle" | "pending" | "done" | "error";

/**
 * TODO: point this at your endpoint (Formspree, Resend, an API route…).
 * It is deliberately not wired to anything — no backend is invented here.
 */
async function submitEmail(email: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 700));
  if (!email) throw new Error("empty");
}

const VALID = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function WaitlistForm({ id }: { id: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "pending") return;

    const value = email.trim();
    if (!value) {
      setState("error");
      setMessage("Enter an email so we can reply.");
      return;
    }
    if (!VALID.test(value)) {
      setState("error");
      setMessage("That address doesn’t look right.");
      return;
    }

    setState("pending");
    setMessage("");
    try {
      await submitEmail(value);
      setState("done");
    } catch {
      setState("error");
      setMessage("Couldn’t send that. Try again in a moment.");
    }
  }

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={MID}
            className="flex items-center gap-3 h-12"
          >
            <span
              className="block w-6 h-[10px] rounded-[1px] shrink-0"
              style={{ background: "var(--quiet)" }}
            />
            <span className="text-[15px]" style={{ color: "var(--fg)" }}>
              On the list. We’ll be in touch about a key.
            </span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FAST}
            className="flex flex-col sm:flex-row gap-[10px]"
          >
            <label htmlFor={`email-${id}`} className="sr-only">
              Work email
            </label>
            <input
              id={`email-${id}`}
              name="email"
              type="email"
              autoComplete="email"
              className="field flex-1"
              placeholder="you@treasury.co"
              value={email}
              aria-invalid={state === "error"}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") {
                  setState("idle");
                  setMessage("");
                }
              }}
            />
            <button className="btn shrink-0" type="submit" disabled={state === "pending"}>
              <span>{state === "pending" ? "Sending…" : "Request a key"}</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={FAST}
            role="alert"
            className="lbl pt-3"
            style={{ color: "var(--loud)" }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
