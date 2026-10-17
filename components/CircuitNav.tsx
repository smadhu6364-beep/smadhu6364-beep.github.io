"use client";
import { useEffect, useRef, useState } from "react";
import { sections } from "@/lib/data";
import { useSettings } from "./Settings";

// Stylised, hand-drawn approximation of a lakeside street circuit. Not a traced map.
const TRACK =
  "M70 170 L190 172 Q210 172 214 160 L222 140 Q228 128 242 126 L262 122 Q278 118 276 102 L268 70 Q264 52 248 46 L200 30 Q186 26 176 34 L150 56 Q140 64 126 60 L96 50 Q78 44 66 56 L40 86 Q30 98 34 112 L44 150 Q48 168 70 170 Z";

const SECTOR_COLOURS = ["#c40500", "#14b8a6", "#ff7a1a"];

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return p;
}

function useActiveSection() {
  const [active, setActive] = useState<string>(sections[0].id);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return active;
}

function go(id: string, smooth: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  el.focus({ preventScroll: true });
}

export default function CircuitNav() {
  const { motion } = useSettings();
  const progress = useScrollProgress();
  const active = useActiveSection();
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  const [car, setCar] = useState({ x: 70, y: 170, a: 180 });
  const [marks, setMarks] = useState<{ x: number; y: number }[]>([]);

  // Travel runs backwards along the path so the car goes anticlockwise.
  const at = (f: number) => {
    const p = pathRef.current;
    if (!p || !len) return { x: 70, y: 170 };
    const pt = p.getPointAtLength(len * (1 - (f % 1)));
    return { x: pt.x, y: pt.y };
  };

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    if (!len) return;
    setMarks(sections.map((_, i) => at(0.03 + (i / sections.length) * 0.97)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len]);

  useEffect(() => {
    if (!len) return;
    const f = Math.min(progress, 0.995);
    const a = at(f);
    const b = at(f + 0.004);
    setCar({ x: a.x, y: a.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, len]);

  const activeSector = sections.find((s) => s.id === active)?.sector ?? 1;
  const link = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    go(id, motion);
  };

  return (
    <>
      {/* Desktop: circuit map */}
      <nav
        aria-label="Sections (circuit map)"
        className="fixed bottom-6 right-6 z-40 hidden w-[260px] rounded-xl border border-white/10 bg-carbon-900/90 p-3 shadow-2xl backdrop-blur lg:block"
      >
        <div className="flex items-center justify-between font-cond text-xs uppercase tracking-[0.25em] text-mute">
          <span>Albert Park</span>
          <span className="tabular-nums text-chalk">Lap {Math.round(progress * 100)}%</span>
        </div>
        <svg viewBox="20 18 270 168" className="mt-1 w-full" role="group" aria-label="Stylised circuit map. The car marker shows how far down the page you are.">
          <ellipse cx="158" cy="104" rx="78" ry="30" transform="rotate(-14 158 104)" fill="#0b5f63" opacity="0.55" />
          <text x="158" y="108" textAnchor="middle" fontSize="8" fill="#5eead4" opacity="0.7" fontFamily="Barlow Condensed" letterSpacing="2">
            ALBERT PARK LAKE
          </text>
          <path d={TRACK} fill="none" stroke="#2c363f" strokeWidth="9" strokeLinejoin="round" />
          <path ref={pathRef} d={TRACK} fill="none" stroke="#f4f1ea" strokeWidth="2" strokeLinejoin="round" />
          <defs>
            <pattern id="chq" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="2" height="2" fill="#fff" />
              <rect x="2" y="2" width="2" height="2" fill="#fff" />
            </pattern>
          </defs>
          <rect x="68" y="164" width="4" height="12" fill="url(#chq)" />
          {marks.map((m, i) => {
            const s = sections[i];
            const on = s.id === active;
            return (
              <a key={s.id} href={`#${s.id}`} onClick={link(s.id)} aria-label={`${s.corner}: ${s.label}`} aria-current={on ? "true" : undefined}>
                <circle cx={m.x} cy={m.y} r="11" fill="transparent" />
                <circle cx={m.x} cy={m.y} r={on ? 6 : 4.5} fill={SECTOR_COLOURS[s.sector - 1]} stroke="#07090b" strokeWidth="1.5" />
                <text x={m.x} y={m.y - 9} textAnchor="middle" fontSize="10" fill={on ? "#f4f1ea" : "#a3adb6"} fontFamily="Barlow Condensed" fontWeight={700}>
                  {s.corner}
                </text>
              </a>
            );
          })}
          <g transform={`translate(${car.x} ${car.y}) rotate(${car.a})`} aria-hidden="true">
            <rect x="-6" y="-3" width="12" height="6" rx="2" fill="#ff7a1a" stroke="#07090b" strokeWidth="1" />
            <rect x="2" y="-2" width="3" height="4" fill="#14b8a6" />
          </g>
        </svg>
        <ol className="mt-2 grid grid-cols-3 gap-1 font-cond text-[11px] font-bold uppercase tracking-wider" aria-label="Sectors">
          {[1, 2, 3].map((n) => (
            <li
              key={n}
              className="rounded px-1.5 py-1 text-center"
              style={{ background: activeSector === n ? SECTOR_COLOURS[n - 1] : "#1f272e", color: activeSector === n && n !== 1 ? "#07090b" : "#f4f1ea" }}
            >
              <a
                href={`#${sections.find((s) => s.sector === n)!.id}`}
                onClick={link(sections.find((s) => s.sector === n)!.id)}
                className="block"
              >
                Sector {n}
              </a>
            </li>
          ))}
        </ol>
        <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={link(s.id)}
                className={`block rounded px-1 py-0.5 hover:text-papaya ${s.id === active ? "text-papaya" : "text-mute"}`}
              >
                <span className="font-mono text-[10px]">{s.corner}</span> {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile: compact sector bar */}
      <nav aria-label="Sections" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-carbon-900/95 backdrop-blur lg:hidden">
        <div className="h-1 bg-carbon-700">
          <div className="h-1 bg-papaya" style={{ width: `${progress * 100}%` }} />
        </div>
        <ul className="flex">
          {sections.map((s) => (
            <li key={s.id} className="min-w-0 flex-1">
              <a
                href={`#${s.id}`}
                onClick={link(s.id)}
                aria-current={s.id === active ? "true" : undefined}
                className={`flex min-h-[48px] flex-col items-center justify-center font-cond text-[11px] uppercase leading-tight tracking-wide ${
                  s.id === active ? "text-papaya" : "text-mute"
                }`}
              >
                <span className="h-1 w-6 rounded" style={{ background: SECTOR_COLOURS[s.sector - 1] }} aria-hidden="true" />
                <span className="mt-1 truncate">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
