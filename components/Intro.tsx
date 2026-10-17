"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { beep, rev, unlock } from "@/lib/engine";
import { useSettings } from "./Settings";

type Phase = "hidden" | "idle" | "lights" | "out";

export default function Intro() {
  const { reduced, muted } = useSettings();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [lit, setLit] = useState(0);
  const timers = useRef<number[]>([]);
  const startBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("introSeen") === "1"; } catch {}
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!seen && !rm) setPhase("idle");
  }, []);

  useEffect(() => {
    if (reduced && phase !== "hidden") finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    if (phase === "idle") startBtn.current?.focus();
    if (phase === "hidden") return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") finish(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function finish() {
    timers.current.forEach(clearTimeout);
    try { sessionStorage.setItem("introSeen", "1"); } catch {}
    setPhase("hidden");
  }

  function go(withSound: boolean) {
    if (withSound) unlock();
    setPhase("lights");
    const sound = withSound && !muted;
    for (let i = 1; i <= 5; i++) {
      timers.current.push(window.setTimeout(() => { setLit(i); if (sound) beep(660, 0.1); }, i * 650));
    }
    const hold = 5 * 650 + 500 + Math.random() * 700;
    timers.current.push(window.setTimeout(() => {
      setLit(0);
      setPhase("out");
      if (sound) rev(2.6);
    }, hold));
    timers.current.push(window.setTimeout(finish, hold + 1300));
  }

  return (
    <AnimatePresence>
      {phase !== "hidden" && (
        <motion.div
          key="intro"
          role="dialog"
          aria-modal="true"
          aria-label="Race start intro"
          className="carbon fixed inset-0 z-[100] flex flex-col items-center justify-center px-4"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.5 } }}
        >
          <p className="font-cond text-sm uppercase tracking-[0.35em] text-mute">Albert Park · Melbourne</p>
          <div className="mt-6 flex gap-2 rounded-lg bg-black/80 p-3 shadow-2xl ring-1 ring-white/10 sm:gap-4 sm:p-5" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex flex-col gap-2 rounded-md bg-carbon-800 p-2 sm:p-3">
                {[0, 1].map((r) => (
                  <span
                    key={r}
                    className={`block h-8 w-8 rounded-full transition-all duration-100 sm:h-12 sm:w-12 ${
                      lit >= n ? "bg-kerb shadow-[0_0_24px_6px_rgba(225,6,0,0.7)]" : "bg-carbon-600"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {phase === "lights" ? `${lit} of 5 lights on` : phase === "out" ? "Lights out" : ""}
          </p>
          <div className="mt-10 h-24 text-center">
            {phase === "idle" && (
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <button
                  ref={startBtn}
                  onClick={() => go(true)}
                  className="skew bg-papaya px-7 py-3 font-display text-lg font-bold uppercase tracking-wider text-carbon-950 hover:bg-papaya-soft"
                >
                  <span className="unskew inline-block">Start engine</span>
                </button>
                <button onClick={() => go(false)} className="font-cond uppercase tracking-widest text-chalk underline-offset-4 hover:underline">
                  Start without sound
                </button>
              </div>
            )}
            {phase === "out" && (
              <motion.p
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-5xl font-black uppercase italic tracking-tight text-chalk sm:text-7xl"
              >
                Lights out
              </motion.p>
            )}
          </div>
          <button onClick={finish} className="absolute right-4 top-4 font-cond text-sm uppercase tracking-widest text-mute hover:text-chalk">
            Skip intro (Esc)
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
