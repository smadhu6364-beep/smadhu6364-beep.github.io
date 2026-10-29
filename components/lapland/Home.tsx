"use client";

import { useEffect, useState } from "react";
import Immersive from "@/components/Immersive";
import WhatsAppButton from "@/components/WhatsAppButton";
import { education, experience, profile, projects, skills } from "@/lib/data";
import Scene from "./Scene";
import { AuroraGame, Clocks, PostOffice, useLaplandSound } from "./Widgets";

// Lapland has its own names for the seasons; we show the one Rovaniemi is in now.
function season(d = new Date()) {
  const m = d.getMonth();
  if (m === 10 || m === 11 || m === 0) return ["Kaamos", "polar night"];
  if (m <= 3) return ["Hanki", "crust snow"];
  if (m <= 6) return ["Yötön yö", "nightless night"];
  return ["Ruska", "autumn colours"];
}

function Label({ fi, en, mono }: { fi: string; en: string; mono: string }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="text-sm font-semibold text-[color:var(--lap-red)]">{fi}</span>
      <span className={`${mono} text-[10px] uppercase tracking-[0.25em] opacity-60`}>{en}</span>
    </p>
  );
}

// Small hand-drawn emblem for each project, like the art on a card
function Emblem({ id }: { id: string }) {
  const common = { width: 64, height: 64, viewBox: "0 0 64 64", "aria-hidden": true } as const;
  switch (id) {
    case "benchmark":
      return (
        <svg {...common}><rect x="12" y="8" width="40" height="48" rx="4" fill="#f3efe6" stroke="#1d2233" strokeWidth="2" />
          {[18, 28, 38].map((y) => (<g key={y}><rect x="18" y={y} width="6" height="6" rx="1" fill="#2fb380" /><rect x="28" y={y + 1} width="18" height="4" rx="2" fill="#1d2233" opacity=".5" /></g>))}
          <path d="M18 50 h28" stroke="#c8372d" strokeWidth="3" strokeLinecap="round" /></svg>
      );
    case "irish-property":
      return (
        <svg {...common}><path d="M8 30 L32 10 L56 30 V56 H8 Z" fill="#f3efe6" stroke="#1d2233" strokeWidth="2" />
          {[[16, 40, 14], [26, 34, 20], [36, 28, 26], [46, 22, 32]].map(([x, y, h]) => (<rect key={x} x={x} y={y} width="7" height={h} fill={x === 46 ? "#c8372d" : "#2f6fb3"} />))}</svg>
      );
    case "civicpulse":
      return (
        <svg {...common}><circle cx="32" cy="32" r="24" fill="#dfeee6" stroke="#1d2233" strokeWidth="2" />
          <path d="M32 50 C 22 38, 20 32, 20 27 a12 12 0 0 1 24 0 c0 5 -2 11 -12 23 Z" fill="#c8372d" /><circle cx="32" cy="27" r="4.5" fill="#f3efe6" /></svg>
      );
    case "roam":
      return (
        <svg {...common}><circle cx="32" cy="32" r="24" fill="#f3efe6" stroke="#1d2233" strokeWidth="2" />
          <path d="M32 12 L37 32 L32 52 L27 32 Z" fill="#1d2233" /><path d="M32 12 L37 32 L27 32 Z" fill="#c8372d" /><circle cx="32" cy="32" r="3" fill="#f3efe6" /></svg>
      );
    default:
      return (
        <svg {...common}><path d="M6 32 C 16 16, 48 16, 58 32 C 48 48, 16 48, 6 32 Z" fill="#f3efe6" stroke="#1d2233" strokeWidth="2" />
          <circle cx="32" cy="32" r="10" fill="#2fb380" /><circle cx="32" cy="32" r="4" fill="#1d2233" /><path d="M10 14 l6 6 M54 14 l-6 6 M32 6 v7" stroke="#c8372d" strokeWidth="2.5" strokeLinecap="round" /></svg>
      );
  }
}

export default function LaplandHome({ serif, mono }: { serif: string; mono: string }) {
  const [night, setNight] = useState(true);
  const [lively, setLively] = useState(true);
  const sound = useLaplandSound();
  const [fi, en] = season();

  useEffect(() => {
    try {
      const m = localStorage.getItem("lapNight");
      if (m) setNight(m === "1");
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem("lapNight", night ? "1" : "0"); } catch {} }, [night]);

  const card = "lap-card rounded-[22px] p-6 sm:p-7";
  const pill = `${mono} inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--lap-line)] bg-[color:var(--lap-card)] px-3.5 text-[11px] uppercase tracking-[0.15em] backdrop-blur transition hover:border-[color:var(--lap-red)]`;
  const [msc, be] = education;

  return (
    <div className={`lap ${night ? "lap-night" : "lap-day"} ${serif} min-h-screen`}>
      <Scene night={night} lively={lively} />
      <Immersive />
      <WhatsAppButton />

      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 pt-6 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--lap-red)] text-xl text-white" aria-hidden="true">❄</span>
          <span>
            <span className="block text-lg font-semibold leading-tight">Madhu Sudhan</span>
            <span className={`${mono} block text-[10px] uppercase tracking-[0.25em] opacity-70`}>Dublin 9 · 53°N, dreaming of 66°N</span>
          </span>
        </a>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={pill} onClick={() => setNight(!night)} aria-pressed={night}>
            <span aria-hidden="true">{night ? "☾" : "☀"}</span>{night ? "Polar night" : "Blue hour"}
          </button>
          <button type="button" className={pill} onClick={() => setLively(!lively)} aria-pressed={lively}>
            <span aria-hidden="true">❄</span>{lively ? "Lively" : "Calm"}
          </button>
          <button type="button" className={pill} onClick={sound.toggle} aria-pressed={sound.on}>
            <span aria-hidden="true">♪</span>{sound.on ? "Sound on" : "Sound off"}
          </button>
          <span className={`${pill} hidden sm:inline-flex`} title={`Season in Lapland: ${en}`}>
            <span aria-hidden="true">✦</span>{fi}
          </span>
        </div>
      </header>

      <main id="top" className="mx-auto grid max-w-6xl gap-4 px-4 pb-[38vh] pt-8 sm:px-6 lg:grid-cols-12">
        {/* Intro */}
        <section data-reveal className={`${card} lg:col-span-7`}>
          <Label fi="Minä" en="Madhu Sudhan" mono={mono} />
          <h1 className="mt-5 text-[30px] font-medium leading-[1.12] tracking-[-0.01em] sm:text-[40px]">
            I used to fix booking mistakes for a living. Now I go looking for them in data.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed opacity-80">
            Two years in operations in Bengaluru, now an MSc Business Analytics student at DCU. I write SQL and Python, I check my numbers twice, and I&rsquo;m looking for analyst roles in Ireland.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href="/cv" className={pill}>CV ↗</a>
            <a href={profile.github} target="_blank" rel="noreferrer" className={pill}>GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className={pill}>LinkedIn ↗</a>
            <a href={`mailto:${profile.email}`} className={pill}>Email</a>
          </div>
        </section>

        {/* Clocks */}
        <section data-reveal style={{ ["--d" as string]: ".1s" }} className="rounded-[22px] bg-[#101624] p-6 text-white shadow-xl lg:col-span-5">
          <Label fi="Nyt" en="Now in Dublin" mono={mono} />
          <div className="mt-5"><Clocks /></div>
        </section>

        {/* Route */}
        <section data-reveal data-tilt className={`${card} lg:col-span-5`}>
          <Label fi="Reitti" en="The route" mono={mono} />
          <svg viewBox="0 0 300 120" className="mt-4 w-full" aria-hidden="true">
            <path d="M30 95 C 90 10, 210 10, 270 70" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" strokeDasharray="6 7" />
            <path d="M30 95 C 90 10, 210 10, 270 70" fill="none" stroke="var(--lap-red)" strokeWidth="2.5" pathLength={1} strokeDasharray="1" className="lap-route" />
            <circle cx="30" cy="95" r="5" fill="var(--lap-red)" /><circle cx="270" cy="70" r="5" fill="var(--lap-red)" />
            <text x="30" y="115" textAnchor="middle" fontSize="11" fill="currentColor" className={mono}>BLR</text>
            <text x="270" y="90" textAnchor="middle" fontSize="11" fill="currentColor" className={mono}>DUB</text>
          </svg>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div><p className="font-semibold">{be.school}</p><p className="opacity-70">{be.title}</p><p className={`${mono} mt-1 text-[11px] opacity-60`}>{be.dates}</p></div>
            <div className="text-right"><p className="font-semibold">DCU</p><p className="opacity-70">{msc.title}</p><p className={`${mono} mt-1 text-[11px] opacity-60`}>{msc.dates}</p></div>
          </div>
        </section>

        {/* Work */}
        <section data-reveal style={{ ["--d" as string]: ".1s" }} className={`${card} lg:col-span-7`}>
          <Label fi="Työ" en="Work" mono={mono} />
          <ol className="mt-5 space-y-5">
            {experience.map((j) => (
              <li key={j.company} className="grid gap-1 border-l-2 border-[color:var(--lap-red)] pl-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-lg font-medium leading-snug">{j.role}</p>
                  <p className="text-sm opacity-75">{j.company} · {j.place}</p>
                  <p className="mt-1 text-sm leading-relaxed opacity-70">{j.points[0]}</p>
                </div>
                <p className={`${mono} text-[11px] uppercase tracking-wider opacity-60`}>{j.dates}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Projects */}
        <div className="flex items-end justify-between pt-6 lg:col-span-12">
          <h2 className="text-3xl font-medium sm:text-4xl"><span className="text-[color:var(--lap-red)]">Projektit</span> · things I&rsquo;ve built</h2>
        </div>
        {projects.map((p, i) => (
          <a key={p.id} href={p.repo} target="_blank" rel="noreferrer" data-reveal data-tilt style={{ ["--d" as string]: `${i * 0.08}s` }}
            className={`${card} group flex flex-col ${i === 0 ? "lg:col-span-8" : "lg:col-span-4"}`}>
            <div className="flex items-start justify-between gap-4">
              <p className={`${mono} text-[10px] uppercase tracking-[0.25em] opacity-60`}>{p.kind}</p>
              <span className="text-[color:var(--lap-red)] transition group-hover:translate-x-1">→</span>
            </div>
            <div className="mt-4 flex items-start gap-4">
              <div className="shrink-0 rounded-xl bg-white/70 p-1 shadow-sm"><Emblem id={p.id} /></div>
              <div>
                <h3 className="text-xl font-medium leading-snug sm:text-2xl">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-75">{p.tagline}</p>
              </div>
            </div>
            <p className={`${mono} mt-auto pt-5 text-[11px] opacity-60`}>{p.stack.slice(0, 4).join(" · ")}</p>
          </a>
        ))}

        {/* Skills */}
        <section data-reveal className={`${card} lg:col-span-5`}>
          <Label fi="Taidot" en="Toolkit" mono={mono} />
          <div className="mt-4 space-y-3">
            {skills.slice(0, 4).map((g) => (
              <div key={g.name}>
                <p className={`${mono} text-[10px] uppercase tracking-[0.2em] opacity-60`}>{g.name}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {g.skills.map((s) => (
                    <span key={s} className="rounded-full border border-[color:var(--lap-line)] px-2.5 py-1 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Game */}
        <section data-reveal style={{ ["--d" as string]: ".1s" }} className={`${card} lg:col-span-4`}>
          <Label fi="Revontulet" en="Catch the lights" mono={mono} />
          <p className="mt-3 text-sm opacity-75">The aurora won&rsquo;t sit still. Tap the sparks before they fade. You get twenty seconds.</p>
          <div className="mt-4"><AuroraGame /></div>
        </section>

        {/* Hobbies */}
        <section data-reveal style={{ ["--d" as string]: ".2s" }} className={`${card} lg:col-span-3`}>
          <Label fi="Vapaa-aika" en="Off the clock" mono={mono} />
          <p className="mt-4 text-lg leading-snug">Coming soon.</p>
          <p className="mt-2 text-sm opacity-70">I&rsquo;m writing this one myself.</p>
        </section>

        {/* Post office */}
        <section data-reveal className={`${card} lg:col-span-7`}>
          <Label fi="Postitoimisto" en="Arctic Circle post office" mono={mono} />
          <h2 className="mt-4 text-2xl font-medium">Leave me a note.</h2>
          <p className="mt-2 text-sm opacity-75">Santa&rsquo;s post office on the Arctic Circle gets letters from all over the world. Mine gets fewer, so yours will definitely be read.</p>
          <div className="mt-4"><PostOffice email={profile.email} /></div>
        </section>

        {/* Contact */}
        <section data-reveal style={{ ["--d" as string]: ".1s" }} className="rounded-[22px] bg-[color:var(--lap-red)] p-7 text-white shadow-xl lg:col-span-5">
          <p className={`${mono} text-[10px] uppercase tracking-[0.25em] opacity-80`}>Ota yhteyttä · get in touch</p>
          <p className="mt-4 text-3xl font-medium leading-tight">Hiring a data analyst in Ireland?</p>
          <a href={`mailto:${profile.email}`} className={`${mono} mt-6 block text-sm underline-offset-4 hover:underline`}>{profile.email}</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className={`${mono} mt-1 block text-sm underline-offset-4 hover:underline`}>LinkedIn ↗</a>
        </section>
      </main>

      <footer className={`${mono} mx-auto max-w-6xl px-4 pb-8 text-[11px] uppercase tracking-[0.2em] text-white [text-shadow:0_1px_6px_rgb(0_0_0/.6)] sm:px-6`}>
        © 2026 Madhu Sudhan · scene drawn in code, no stock photos
      </footer>
    </div>
  );
}
