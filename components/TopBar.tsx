"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "./Settings";
import { profile } from "@/lib/data";

function useClock(tz: string) {
  const [t, setT] = useState<string>("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IE", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: tz });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return t;
}

export default function TopBar() {
  const { drs, setDrs, muted, setMutedState, reduced } = useSettings();
  const mel = useClock("Australia/Melbourne");
  const dub = useClock("Europe/Dublin");

  const items = [
    `MELBOURNE ${mel}`,
    `DUBLIN ${dub}`,
    "Now: MSc Business Analytics, DCU",
    "Looking for data and analytics roles in Ireland",
    `Based in ${profile.location}`,
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-carbon-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
        <a href="#start" className="flex shrink-0 items-center gap-2 font-display font-bold uppercase tracking-wider">
          <span className="skew inline-block bg-papaya px-2 py-0.5 text-carbon-950">
            <span className="unskew inline-block">MS</span>
          </span>
          <span className="hidden sm:inline">Madhu Sudhan Srinivas</span>
        </a>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/cv/" className="rounded border border-white/20 px-2.5 py-1.5 font-cond text-sm uppercase tracking-wider hover:border-papaya hover:text-papaya">
            Plain CV
          </Link>
          <button
            type="button"
            onClick={() => setDrs(!drs)}
            aria-pressed={drs}
            title={reduced ? "Your system asks for reduced motion, so effects stay off" : "Toggle motion effects"}
            className={`rounded px-2.5 py-1.5 font-cond text-sm font-bold uppercase tracking-wider ring-1 ${
              drs && !reduced ? "bg-teal text-carbon-950 ring-teal" : "text-mute ring-white/20"
            }`}
          >
            DRS {drs && !reduced ? "on" : "off"}
            <span className="sr-only"> (motion effects)</span>
          </button>
          <button
            type="button"
            onClick={() => setMutedState(!muted)}
            aria-pressed={muted}
            aria-label={muted ? "Unmute engine sound" : "Mute engine sound"}
            className="rounded p-1.5 text-chalk ring-1 ring-white/20 hover:ring-papaya"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" />
              {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" />}
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-hidden border-t border-white/5 bg-carbon-900 font-cond text-xs uppercase tracking-[0.2em] text-mute" aria-label="Live ticker">
        <div className="flex">
          <span className="z-10 shrink-0 bg-kerb px-3 py-1 font-bold text-white">Live</span>
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div className="ticker-track flex w-max whitespace-nowrap py-1">
              {[0, 1].map((k) => (
                <span key={k} aria-hidden={k === 1 ? true : undefined} className="flex">
                  {items.map((it) => (
                    <span key={it.slice(0, 8)} className="px-6 tabular-nums">
                      <span className="text-papaya">▸</span> {it}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
