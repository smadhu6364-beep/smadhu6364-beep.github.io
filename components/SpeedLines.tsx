"use client";
import { useEffect, useState } from "react";
import { useSettings } from "./Settings";

/** Faint streaks that appear while the page is scrolling quickly. DRS only. */
export default function SpeedLines() {
  const { motion } = useSettings();
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!motion) { setOn(false); return; }
    let last = window.scrollY;
    let lastT = performance.now();
    let off = 0;
    const onScroll = () => {
      const now = performance.now();
      const v = Math.abs(window.scrollY - last) / Math.max(1, now - lastT);
      last = window.scrollY; lastT = now;
      if (v > 1.2) { setOn(true); clearTimeout(off); off = window.setTimeout(() => setOn(false), 220); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(off); };
  }, [motion]);
  return <div className={`speedlines ${on ? "on" : ""}`} aria-hidden="true" />;
}
