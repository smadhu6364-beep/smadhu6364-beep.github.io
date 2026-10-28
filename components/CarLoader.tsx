"use client";

import { useEffect, useRef, useState } from "react";
import { playDriveBy } from "@/lib/engine";
import CarSvg from "./CarSvg";

// Loading screen: a red car drives across left to right while a short boot log
// prints, then the visitor picks "Enter with sound" or "Enter without".
// Plays once per browser session; reduced motion skips straight to the page.
const KEY = "carLoaderSeen";
const DRIVE_MS = 2800;

const LOG = [
  "load profile --name 'Madhu Sudhan'",
  "[ OK ] education: DSATM Bengaluru → DCU Dublin",
  "[ OK ] experience: 3 roles, operations to data",
  "[ OK ] projects: SQL, Python, LLMs",
  "[ OK ] tyres warm. grid ready.",
];

export const MUSIC_EVENT = "race-music-on";

export default function CarLoader() {
  const [state, setState] = useState<"drive" | "gate" | "leaving" | "gone">("drive");
  const [lines, setLines] = useState(0);
  const wheels = useRef<SVGGElement[]>([]);
  const addWheel = (el: SVGGElement | null) => { if (el && !wheels.current.includes(el)) wheels.current.push(el); };

  // Spin the wheels: fast while driving, easing off as the car stops in the middle
  useEffect(() => {
    let raf = 0, a = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const p = (now - t0) / DRIVE_MS;
      const speed = p < 0.45 ? 38 - p * 50 : p < 0.62 ? 4 : 30;
      a = (a + speed) % 360;
      wheels.current.forEach((w) => w.setAttribute("transform", `rotate(${a})`));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("gone");
      return;
    }
    document.body.style.overflow = "hidden";
    const each = DRIVE_MS / LOG.length;
    const ticks = LOG.map((_, i) => window.setTimeout(() => setLines(i + 1), each * i + 150));
    const t = window.setTimeout(() => setState("gate"), DRIVE_MS);
    return () => {
      ticks.forEach(window.clearTimeout);
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  const enter = (sound: boolean) => {
    // Dispatched inside the click, so the browser allows audio to start.
    if (sound) {
      playDriveBy();
      window.dispatchEvent(new Event(MUSIC_EVENT));
    }
    setState("leaving");
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    window.setTimeout(() => {
      setState("gone");
      document.body.style.overflow = "";
    }, 500);
  };

  if (state === "gone") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-sky px-4 transition-opacity duration-500 ${state === "leaving" ? "opacity-0" : "opacity-100"}`}
    >
      <p className="text-center font-serif text-5xl italic text-red sm:text-7xl">Madhu Sudhan</p>
      <p className="mt-3 text-xs font-semibold tracking-[0.35em] text-navy/70">LOADING THE GRID</p>

      <div aria-hidden="true" className="relative mt-8 h-24 w-full sm:h-36">
        <div className="absolute inset-x-0 bottom-2 h-px bg-navy/20" />
        <div className="car-drive absolute bottom-2 left-0 h-full">
          <div className="car-rumble h-full">
          <span className="absolute right-[92%] top-1/2 h-1 w-[40vw] -translate-y-1/2 bg-gradient-to-r from-transparent to-red/60" />
          <svg viewBox="-60 -260 960 300" className="h-full w-auto">
            <CarSvg spins={addWheel} />
          </svg>
          </div>
        </div>
      </div>

      <div className="mt-6 h-[8.5rem] w-full max-w-md rounded-md border border-navy/15 bg-card/60 p-4 font-mono text-[11px] leading-relaxed text-navy/80 sm:text-xs">
        <p className="text-navy/50">$ ./start-portfolio</p>
        {LOG.slice(0, lines).map((l) => (
          <p key={l}>
            {l.startsWith("[ OK ]") ? (
              <>
                <span className="text-[#1f9d55]">[ OK ]</span>
                {l.slice(6)}
              </>
            ) : (
              l
            )}
          </p>
        ))}
        {state === "drive" && <span className="inline-block h-3 w-1.5 animate-pulse bg-navy/60 align-middle" />}
      </div>

      <div className={`mt-6 flex gap-3 transition-opacity duration-300 ${state === "drive" ? "pointer-events-none opacity-0" : "opacity-100"}`}>
        <button type="button" onClick={() => enter(true)} className="rounded-md bg-red px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:brightness-110">
          Enter with sound
        </button>
        <button type="button" onClick={() => enter(false)} className="rounded-md border border-navy/30 px-5 py-3 text-sm font-semibold tracking-wide text-navy transition hover:border-red hover:text-red">
          Enter without
        </button>
      </div>

      <style>{`
        .car-rumble { animation: rumble .09s linear infinite alternate; }
        @keyframes rumble { to { transform: translateY(1.5px); } }
        .car-drive { animation: drive ${DRIVE_MS}ms linear forwards; }
        @keyframes drive { 0% { transform: translateX(-110%); animation-timing-function: cubic-bezier(.2,.7,.3,1); } 45% { transform: translateX(calc(50vw - 50%)); } 62% { transform: translateX(calc(50vw - 50%)); animation-timing-function: cubic-bezier(.7,0,.9,.4); } 100% { transform: translateX(110vw); } }
      `}</style>
    </div>
  );
}
