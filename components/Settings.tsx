"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { setMuted } from "@/lib/engine";

type S = {
  drs: boolean;
  setDrs: (v: boolean) => void;
  muted: boolean;
  setMutedState: (v: boolean) => void;
  reduced: boolean;
  motion: boolean; // drs && !reduced
};

const Ctx = createContext<S | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [drs, setDrs] = useState(true);
  const [muted, setMutedState] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    try {
      const d = localStorage.getItem("drs");
      if (d !== null) setDrs(d === "1");
      if (localStorage.getItem("muted") === "1") setMutedState(true);
    } catch {}
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    setMuted(muted);
    try { localStorage.setItem("muted", muted ? "1" : "0"); } catch {}
  }, [muted]);
  useEffect(() => {
    try { localStorage.setItem("drs", drs ? "1" : "0"); } catch {}
  }, [drs]);

  const motion = drs && !reduced;
  useEffect(() => {
    document.documentElement.classList.toggle("no-motion", !motion);
  }, [motion]);

  return <Ctx.Provider value={{ drs, setDrs, muted, setMutedState, reduced, motion }}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSettings outside provider");
  return c;
}
