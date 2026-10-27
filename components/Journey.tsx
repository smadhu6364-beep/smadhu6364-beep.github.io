"use client";

import { useEffect, useRef, useState } from "react";
import { education, experience, hobbies, projects } from "@/lib/dummy";

// Pinned section: vertical scroll drives a sideways track.
// The first stretch of scroll flies the plane Bengaluru -> Dublin, then the panels slide.
export const PANELS = 4;
export const HOLD = 1; // screens of scroll spent on the flight before sliding

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function Journey({ display, block }: { display: string; block: string }) {
  const wrap = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [p, setP] = useState(0);
  const [plane, setPlane] = useState({ x: 120, y: 330, a: -30 });

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setP(clamp(-r.top / total));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const steps = PANELS - 1 + HOLD;
  const flight = clamp((p * steps) / HOLD);
  const slide = clamp((p * steps - HOLD) / (PANELS - 1));

  useEffect(() => {
    const el = path.current;
    if (!el) return;
    const len = el.getTotalLength();
    const a = el.getPointAtLength(flight * len);
    const b = el.getPointAtLength(Math.min(len, flight * len + 1));
    setPlane({ x: a.x, y: a.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI });
  }, [flight]);

  const label = `${block} text-xs tracking-[0.3em]`;

  return (
    <section ref={wrap} style={{ height: `${(PANELS + HOLD) * 100}vh` }} className="relative bg-deep" data-journey>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="flex h-full will-change-transform" style={{ width: `${PANELS * 100}vw`, transform: `translateX(${-slide * (PANELS - 1) * 100}vw)` }}>
          {/* 1. Education + flight */}
          <div id="education" data-panel="0" className="relative flex h-full w-screen flex-col justify-center overflow-hidden bg-cream px-4 text-navy sm:px-12">
            <p className={`${display} text-center text-[12vw] font-medium leading-none text-red sm:text-[6vw]`}>Education</p>
            <p className={`${label} mt-2 text-center text-navy/60`}>BENGALURU → DUBLIN</p>
            <div className="relative mx-auto mt-4 w-full max-w-5xl">
              <svg viewBox="0 0 1000 420" className="h-auto w-full" aria-hidden="true">
                <path ref={path} d="M 120 330 C 300 40, 700 40, 880 330" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="8 10" />
                <path d="M 120 330 C 300 40, 700 40, 880 330" fill="none" stroke="#e8213b" strokeWidth="3" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - flight} />
                {[[120, "BLR"], [880, "DUB"]].map(([x, code]) => (
                  <g key={code} transform={`translate(${x} 330)`}>
                    <circle r="9" fill="#e8213b" />
                    <circle r="18" fill="none" stroke="#e8213b" strokeOpacity="0.35" />
                    <text y="48" textAnchor="middle" fontSize="22" fill="currentColor" className={block}>{code}</text>
                  </g>
                ))}
                <g transform={`translate(${plane.x} ${plane.y}) rotate(${plane.a})`}>
                  <path d="M 22 0 L -8 -4 L -14 -20 L -20 -20 L -16 -4 L -26 -3 L -30 -10 L -34 -10 L -32 0 L -34 10 L -30 10 L -26 3 L -16 4 L -20 20 L -14 20 L -8 4 Z" fill="currentColor" />
                </g>
              </svg>
              <div className="mt-2 grid grid-cols-2 gap-6 sm:gap-16">
                {education.map((e, i) => (
                  <div key={e.title} className={`transition duration-500 ${i === 1 && flight < 0.95 ? "translate-y-4 opacity-30" : "opacity-100"} ${i ? "text-right" : ""}`}>
                    <p className={`${block} text-3xl leading-none sm:text-6xl`}>{e.school.toUpperCase()}</p>
                    <p className={`${display} mt-1 text-lg italic text-red sm:text-2xl`}>{e.place}</p>
                    <p className="mt-3 text-sm font-medium sm:text-base">{e.title}</p>
                    <p className="text-xs text-navy/60 sm:text-sm">{e.dates}</p>
                    <p className="mt-2 hidden text-sm leading-relaxed text-navy/70 sm:block">{e.note}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className={`${label} absolute bottom-6 left-1/2 -translate-x-1/2 text-navy/50`}>{flight < 1 ? "KEEP SCROLLING ↓" : "NEXT →"}</p>
          </div>

          {/* 2. Experience */}
          <div id="experience" data-panel="1" className="flex h-full w-screen flex-col justify-center bg-slate px-4 text-white sm:px-12">
            <p className={`${display} text-center text-3xl sm:text-5xl`}>Every shift, <span className="italic">a lesson</span><span className="text-red">.</span></p>
            <p className={`${label} mt-3 text-center text-white/70`}>EXPERIENCE</p>
            <div className="mx-auto mt-10 grid w-full max-w-6xl gap-4 sm:grid-cols-3 sm:gap-8">
              {experience.map((j, i) => (
                <article key={j.company} className={`rounded-sm bg-card p-4 text-navy shadow-xl sm:p-6 ${i % 2 ? "sm:mt-12 sm:rotate-1" : "sm:-rotate-1"}`}>
                  <p className={`${block} text-[10px] tracking-[0.2em] text-navy/60`}>{j.place.toUpperCase()} · {j.dates.toUpperCase()}</p>
                  <h3 className={`${block} mt-2 text-2xl leading-none sm:mt-4 sm:text-3xl`}>{j.role.toUpperCase()}</h3>
                  <p className={`${display} mt-1 text-lg italic text-red`}>{j.company}</p>
                  <ul className="mt-3 hidden space-y-2 text-sm leading-relaxed text-navy/80 sm:block">
                    {j.points.map((pt) => <li key={pt}>— {pt}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          {/* 3. Projects */}
          <div id="projects" data-panel="2" className="flex h-full w-screen flex-col justify-center bg-deep px-4 text-mist sm:px-12">
            <div className="mx-auto w-full max-w-6xl">
              <p className={label}>PROJECTS</p>
              <h2 className={`${block} mt-2 text-[12vw] leading-none sm:text-[5.5vw]`}>BUILT <span className={`${display} font-medium italic text-red`}>for real</span></h2>
              <ol className="mt-6 divide-y divide-mist/15 border-y border-mist/15">
                {projects.map((pr, i) => (
                  <li key={pr.id} className="grid grid-cols-[3rem_1fr] items-baseline gap-3 py-3 sm:grid-cols-[5rem_1fr] sm:py-4">
                    <span className={`${block} text-2xl text-red sm:text-4xl`}>{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <a href={pr.repo} target="_blank" rel="noreferrer" className={`${block} block text-xl tracking-wide transition hover:text-red sm:text-3xl`}>{pr.name.toUpperCase()} <span className="text-sm text-mist/50">↗</span></a>
                      <span className="hidden text-sm text-mist/70 sm:block">{pr.tagline}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 4. Hobbies */}
          <div id="hobbies" data-panel="3" className="flex h-full w-screen flex-col justify-center bg-sky px-4 text-center text-navy sm:px-12">
            <p className={`${display} text-4xl font-medium text-red sm:text-6xl`}>Off the clock</p>
            <p className={`${block} text-[15vw] leading-none sm:text-[8vw]`}>HOBBIES</p>
            <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-2 gap-4 text-left lg:grid-cols-4 lg:gap-6">
              {hobbies.map((h, i) => (
                <div key={h.title} className="rounded-md border border-navy/20 bg-card/60 p-4 sm:p-6">
                  <p className={`${block} text-4xl text-red`}>{String(i + 1).padStart(2, "0")}</p>
                  <p className={`${block} mt-3 text-xl`}>{h.title.toUpperCase()}</p>
                  <p className="mt-2 text-xs leading-relaxed text-navy/70 sm:text-sm">{h.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* progress rail */}
        <div className="absolute bottom-0 left-0 h-1 bg-red" style={{ width: `${p * 100}%` }} />
      </div>
    </section>
  );
}
