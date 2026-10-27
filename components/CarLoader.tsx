"use client";

import { useEffect, useState } from "react";
import CarSvg from "./CarSvg";

// Loading screen: a red car drives across left to right, then the page fades in.
// Plays once per browser session; skipped for reduced motion.
const KEY = "carLoaderSeen";
const DRIVE_MS = 2800;

export default function CarLoader() {
  const [state, setState] = useState<"show" | "leaving" | "gone">("show");

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("gone");
      return;
    }
    document.body.style.overflow = "hidden";
    const t1 = window.setTimeout(() => setState("leaving"), DRIVE_MS);
    const t2 = window.setTimeout(() => {
      setState("gone");
      document.body.style.overflow = "";
      try { sessionStorage.setItem(KEY, "1"); } catch {}
    }, DRIVE_MS + 500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-sky transition-opacity duration-500 ${state === "leaving" ? "opacity-0" : "opacity-100"}`}
    >
      <p className="text-center font-serif text-5xl italic text-red sm:text-7xl">Madhu Sudhan</p>
      <p className="mt-3 text-xs font-semibold tracking-[0.35em] text-navy/70">LOADING THE GRID</p>

      <div className="relative mt-10 h-28 w-full sm:h-40">
        {/* track line */}
        <div className="absolute inset-x-0 bottom-2 h-px bg-navy/20" />
        <div className="car-drive absolute bottom-2 left-0 h-full">
          <span className="car-trail absolute right-[92%] top-1/2 h-1 w-[40vw] -translate-y-1/2 bg-gradient-to-r from-transparent to-red/60" />
          <svg viewBox="-60 -260 960 300" className="h-full w-auto">
            <CarSvg />
          </svg>
        </div>
      </div>

      <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-navy/15">
        <div className="car-bar h-full bg-red" />
      </div>

      <style>{`
        .car-drive { animation: drive ${DRIVE_MS}ms linear forwards; }
        .car-bar { animation: bar ${DRIVE_MS}ms linear forwards; }
        @keyframes drive { 0% { transform: translateX(-110%); animation-timing-function: cubic-bezier(.2,.7,.3,1); } 45% { transform: translateX(calc(50vw - 50%)); } 62% { transform: translateX(calc(50vw - 50%)); animation-timing-function: cubic-bezier(.7,0,.9,.4); } 100% { transform: translateX(110vw); } }
        @keyframes bar { from { width: 0 } to { width: 100% } }
      `}</style>
    </div>
  );
}
