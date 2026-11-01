"use client";

import { useEffect, useState } from "react";
import SqlInAction from "@/components/SqlInAction";
import { education, experience, profile, projects, skills } from "@/lib/data";
import Scene from "./Scene";
import { SusGame, TopChips, useLaplandSound } from "./Widgets";
import feeds from "@/lib/feeds.json";

function Label({ fi, en, mono }: { fi: string; en: string; mono: string }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="text-[13px] font-semibold tracking-wide text-[color:var(--lap-accent)]">{en}</span>
      <span className={`${mono} text-[11px] uppercase tracking-[0.25em] opacity-65`}>{fi}</span>
    </p>
  );
}

// Work in progress. Statuses are honest: nothing here is finished until it says so.
const KITCHEN = [
  { icon: "📰", dish: "A second HackerNoon article", status: "with the editors", note: "How we re-ran a research project's experiments on free GPUs, with a co-author. In editorial review." },
  { icon: "🧪", dish: "LLM risk-register benchmark paper", status: "simmering", note: "Writing it up with Kruthik Jadhav, being prepared for an IEEE conference." },
  { icon: "📊", dish: "MSc Business Analytics at DCU", status: "on the stove", note: "Statistics, Power BI and machine learning in Python, one module at a time." },
  { icon: "❄️", dish: "This website", status: "plating", note: "Every tree, train and ray of aurora is drawn in code. Still adding little things." },
];

// projects with a written case study at /projects/<id>/
const CASE_STUDIES = new Set(["benchmark", "irish-property", "civicpulse", "roam"]);

const BADGES = [
  {
    role: "Author",
    org: "HackerNoon",
    when: "Oct 2026",
    title: "How we caught an LLM scoring bug and fixed it without compromising our research",
    note: "Published with Kruthik Jadhav. The story of a parser bug in our benchmark and how we fixed it in the open.",
    cta: "Read it",
    href: "https://hackernoon.com/how-we-caught-an-llm-scoring-bug-and-fixed-it-without-compromising-our-research",
    color: "#7fe3bf",
  },
  {
    role: "Researcher",
    org: "LLM Risk Register Benchmark",
    when: "2026",
    title: "Can LLMs draft a project risk register?",
    note: "Co-authored with Kruthik Jadhav. 21 real planning documents, a no-leakage evaluation, 456 unit tests. Being prepared for an IEEE conference.",
    cta: "See the repo",
    href: "https://github.com/smadhu6364-beep/public-reproducible-benchmark",
    color: "#f2c57c",
  },
  {
    role: "Student",
    org: "Dublin City University",
    when: "2026 – now",
    title: "MSc in Business Analytics",
    note: "Statistics, Power BI, and machine learning in Python, after two years in operations in Bengaluru.",
    cta: "See my CV",
    href: "/cv",
    color: "#b9a6ff",
  },
];

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

export default function LaplandHome({ display, sans, mono }: { display: string; sans: string; mono: string }) {
  const [night, setNight] = useState(true);
  const [lively, setLively] = useState(true);
  const sound = useLaplandSound();

  useEffect(() => {
    try {
      const m = localStorage.getItem("lapNight");
      if (m) setNight(m === "1");
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem("lapNight", night ? "1" : "0"); } catch {} }, [night]);

  // cards fade up once as they come into view
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const card = "lap-card rounded-[22px] p-6 sm:p-7";
  const pill = `${mono} inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--lap-line)] bg-[color:var(--lap-card)] px-3.5 text-[11px] uppercase tracking-[0.15em] transition hover:border-[color:var(--lap-accent)]`;
  const [msc, be] = education;

  // the most data-related line from each job, so the work history reads as analyst experience
  const dataPoint = (points: string[]) => [/figure|data|record/i, /track|stock|inventor/i].map((re) => points.find((p) => re.test(p))).find(Boolean) ?? points[0];
  const icon = `${mono} inline-flex h-10 w-10 items-center justify-center rounded-full sm:h-8 sm:w-8 border border-[color:var(--lap-line)] bg-[color:var(--lap-card)] text-[13px] transition hover:border-[color:var(--lap-accent)]`;
  // the 30-second version, as a terminal session
  const TERMINAL: [string, string[]][] = [
    ["whoami", ["data analyst · dublin · open to roles in ireland"]],
    ["cat stack.txt", ["SQL  Python  Power BI  Excel  DuckDB  pandas"]],
    ["ls proof/", ["irish-property-sql/  · 812,018 sales", "llm-benchmark/       · 456 tests", "hackernoon.md        · published"]],
    ["cat education.txt", [`MSc Business Analytics, DCU (${msc.dates})`, "BE Computer Science, DSATM (2019 – 2023)"]],
  ];

  return (
    <div className={`lap ${night ? "lap-night" : "lap-day"} ${sans} min-h-screen`}>
      <Scene night={night} lively={lively} />

      {/* Top bar: who, what, live clocks, and the controls as small icons */}
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-5 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--lap-accent)] text-lg text-[#06231a]" aria-hidden="true">❄</span>
          <span>
            <span className={`${display} block text-2xl leading-tight [text-shadow:0_1px_8px_rgb(0_0_0/.35)]`}>Madhu Sudhan</span>
            <span className={`${mono} block text-[11px] uppercase tracking-[0.2em] opacity-80`}>Data Analyst · Dublin · Open to roles</span>
          </span>
        </a>
        <div className="flex flex-wrap items-center gap-1.5">
          <TopChips mono={mono} />
          <button type="button" className={icon} onClick={() => setNight(!night)} aria-pressed={night} aria-label={night ? "Switch to day view" : "Switch to night view"} title={night ? "Night view" : "Day view"}>
            {night ? "☾" : "☀"}
          </button>
          <button type="button" className={icon} onClick={() => setLively(!lively)} aria-pressed={lively} aria-label={lively ? "Pause the animation" : "Play the animation"} title={lively ? "Animation on" : "Animation paused"}>
            {lively ? "❄" : "⏸"}
          </button>
          <button type="button" className={icon} onClick={sound.toggle} aria-pressed={sound.on} aria-label={sound.on ? "Turn music off" : "Turn music on"} title={sound.on ? "Music on" : "Music off"}>
            {sound.on ? "♪" : "♩"}
          </button>
          <a href="/cv" className={`${pill} h-8 border-[color:var(--lap-accent)] px-3 text-[11px]`}>Recruiter view →</a>
        </div>
      </header>

      <main id="top" className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-4 px-4 pb-[38vh] pt-6 sm:px-6 lg:grid-cols-12">
        {/* Intro */}
        <section id="about" className={`${card} scroll-mt-6 lg:col-span-7`}>
          <Label fi="minä" en="About me" mono={mono} />
          <h1 className={`${display} mt-4 text-[32px] leading-[1.08] sm:text-[44px]`}>
            I used to fix booking mistakes for a living. Now I go looking for them in data.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed opacity-80">
            Two years in operations in Bengaluru, now an MSc Business Analytics student at DCU. I write SQL and Python, I check my numbers twice, and I&rsquo;m looking for analyst roles in Ireland.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href="/cv" className={pill}>CV ↗</a>
            <a href={profile.github} target="_blank" rel="noreferrer" className={pill}>GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className={pill}>LinkedIn ↗</a>
            <a href={`mailto:${profile.email}`} className={pill}>Email</a>
          </div>
        </section>

        {/* At a glance, as a terminal */}
        <section className="overflow-hidden rounded-[22px] border border-[color:var(--lap-line)] bg-[#050a14f2] text-[#d9f7ea] shadow-xl lg:col-span-5">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#06d6a0]" />
            <span className={`${mono} ml-2 text-[11px] opacity-60`}>madhu@dublin: ~ · at a glance</span>
          </div>
          <div className={`${mono} space-y-3 p-5 text-[12.5px] leading-relaxed`}>
            {TERMINAL.map(([cmd, out]) => (
              <div key={cmd}>
                <p><span className="text-[#7fe3bf]">$</span> {cmd}</p>
                {out.map((line) => (
                  <p key={line} className="whitespace-pre-wrap opacity-80">{line}</p>
                ))}
              </div>
            ))}
            <p><span className="text-[#7fe3bf]">$</span> <span className="lap-caret inline-block h-3.5 w-2 translate-y-0.5 bg-[#7fe3bf]" /></p>
          </div>
        </section>

        {/* Projects */}
        <div id="work" className="flex scroll-mt-6 items-end justify-between pt-4 lg:col-span-12">
          <h2 className={`${display} text-4xl text-white [text-shadow:0_2px_12px_rgb(0_0_0/.5)] sm:text-5xl`}>Things I&rsquo;ve built</h2>
        </div>
        {projects.map((p, i) => (
          <a key={p.id} href={CASE_STUDIES.has(p.id) ? `/projects/${p.id}/` : p.repo} {...(CASE_STUDIES.has(p.id) ? {} : { target: "_blank", rel: "noreferrer" })} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}
            className={`${card} group flex flex-col ${i === 0 ? "lg:col-span-8" : "lg:col-span-4"}`}>
            <div className="flex items-start justify-between gap-4">
              <p className={`${mono} text-[11px] uppercase tracking-[0.25em] opacity-60`}>{p.kind}</p>
              <span className="text-[color:var(--lap-accent)] transition group-hover:translate-x-1">→</span>
            </div>
            <div className="mt-4 flex items-start gap-4">
              <div className="shrink-0 rounded-xl bg-white/70 p-1 shadow-sm"><Emblem id={p.id} /></div>
              <div>
                <h3 className="text-lg font-semibold leading-snug sm:text-xl">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-75">{p.tagline}</p>
              </div>
            </div>
            <p className={`${mono} mt-auto pt-5 text-[11px] opacity-60`}>{p.stack.slice(0, 4).join(" · ")}</p>
            <p className={`${mono} mt-2 text-[11px] text-[color:var(--lap-accent)]`}>{CASE_STUDIES.has(p.id) ? "Read the case study →" : "View the code ↗"}</p>
          </a>
        ))}

        {/* Proof: real queries with their real result rows */}
        <section data-reveal className={`${card} lap-sql lg:col-span-12`}>
          <Label fi="näyttö" en="Proof · SQL in action" mono={mono} />
          <h2 className={`${display} mt-3 text-3xl sm:text-4xl`}>Real queries, real rows.</h2>
          <p className="mb-5 mt-2 max-w-2xl text-sm opacity-75">From my Irish property project: 812,018 sales from the Property Price Register, cleaned and queried in DuckDB. Pick a question to see the SQL and what it returned.</p>
          <SqlInAction />
        </section>

        {/* Work */}
        <section data-reveal className={`${card} lg:col-span-7`}>
          <Label fi="työ" en="Work" mono={mono} />
          <ol className="mt-5 space-y-5">
            {experience.map((j) => (
              <li key={j.company} className="grid gap-1 border-l-2 border-[color:var(--lap-accent)] pl-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-lg font-medium leading-snug">{j.role}</p>
                  <p className="text-sm opacity-75">{j.company} · {j.place}</p>
                  <p className="mt-1 text-sm leading-relaxed opacity-70">{dataPoint(j.points)}</p>
                </div>
                <p className={`${mono} text-[11px] uppercase tracking-wider opacity-60`}>{j.dates}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Education, as the route from Bengaluru to Dublin */}
        <section data-reveal style={{ ["--d" as string]: ".1s" }} className={`${card} lg:col-span-5`}>
          <Label fi="reitti" en="Education · the route" mono={mono} />
          <svg viewBox="0 0 300 120" className="mt-4 w-full" aria-hidden="true">
            <path d="M30 95 C 90 10, 210 10, 270 70" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" strokeDasharray="6 7" />
            <path d="M30 95 C 90 10, 210 10, 270 70" fill="none" stroke="var(--lap-accent)" strokeWidth="2.5" pathLength={1} strokeDasharray="1" className="lap-route" />
            <circle cx="30" cy="95" r="5" fill="var(--lap-accent)" /><circle cx="270" cy="70" r="5" fill="var(--lap-accent)" />
            <text x="30" y="115" textAnchor="middle" fontSize="11" fill="currentColor" className={mono}>BLR</text>
            <text x="270" y="90" textAnchor="middle" fontSize="11" fill="currentColor" className={mono}>DUB</text>
          </svg>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div><p className="font-semibold">{be.school}</p><p className="opacity-70">{be.title}</p><p className={`${mono} mt-1 text-[11px] opacity-60`}>{be.dates}</p></div>
            <div className="text-right"><p className="font-semibold">DCU</p><p className="opacity-70">{msc.title}</p><p className={`${mono} mt-1 text-[11px] opacity-60`}>{msc.dates}</p></div>
          </div>
        </section>

        {/* Badges, hung like event lanyards */}
        <section className="pt-4 lg:col-span-12">
          <Label fi="kortit" en="Badges I've earned" mono={mono} />
          <div className="relative mt-5">
            <div aria-hidden className="absolute inset-x-0 top-[6px] h-[5px] rounded-full bg-gradient-to-b from-[#cfd8e6] to-[#8a97ad] shadow" />
            <div className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-4 sm:justify-around sm:overflow-visible">
              {BADGES.map((b, i) => (
                <a key={b.role} href={b.href} target="_blank" rel="noreferrer" className="lap-lanyard flex w-[230px] shrink-0 snap-center flex-col items-center" style={{ animationDelay: `${i * 0.6}s` }}>
                  <span aria-hidden className="h-4 w-4 rounded-full border-[3px] border-[#a9b4c6]" />
                  <span aria-hidden className="-mt-1 block w-[12px] rounded-sm" style={{ height: 70 + i * 18, background: `repeating-linear-gradient(0deg, ${b.color} 0 14px, rgb(255 255 255 / .35) 14px 16px)` }} />
                  <span aria-hidden className="-mt-1 h-4 w-8 rounded-md bg-gradient-to-b from-[#e2e6ee] to-[#9aa3b3]" />
                  <span className="lap-card -mt-1 block w-full overflow-hidden rounded-2xl text-left">
                    <span className="block px-4 py-3 text-[#06121f]" style={{ background: b.color }}>
                      <span className={`${mono} block text-[11px] uppercase tracking-[0.2em] opacity-80`}>{b.org}</span>
                      <span className="mt-1 block text-[26px] font-extrabold uppercase leading-none tracking-tight">{b.role}</span>
                    </span>
                    <span className="block px-4 pb-4 pt-3">
                      <span className={`${mono} block text-[11px] uppercase tracking-[0.2em] opacity-60`}>Madhu Sudhan · {b.when}</span>
                      <span className="mt-1 block text-[15px] font-semibold leading-snug">{b.title}</span>
                      <span className="mt-1.5 block text-xs leading-relaxed opacity-70">{b.note}</span>
                      <span className={`${mono} mt-3 block text-[11px] text-[color:var(--lap-accent)]`}>{b.cta} ↗</span>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section data-reveal className={`${card} lg:col-span-5`}>
          <Label fi="taidot" en="Toolkit" mono={mono} />
          <div className="mt-4 space-y-3">
            {skills.slice(0, 4).map((g) => (
              <div key={g.name}>
                <p className={`${mono} text-[11px] uppercase tracking-[0.2em] opacity-60`}>{g.name}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {g.skills.map((s) => (
                    <span key={s} className="rounded-full border border-[color:var(--lap-line)] px-2.5 py-1 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What we're cooking */}
        <section data-reveal style={{ ["--d" as string]: ".1s" }} className={`${card} lg:col-span-7`}>
          <Label fi="keittiössä" en="What we're cooking" mono={mono} />
          <ul className="mt-4 space-y-3">
            {KITCHEN.map((k) => (
              <li key={k.dish} className="flex items-start gap-3 rounded-xl border border-[color:var(--lap-line)] p-3.5">
                <span aria-hidden className="text-2xl leading-none">{k.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[15px] font-semibold">{k.dish}</span>
                    <span className={`${mono} rounded-full bg-[color:var(--lap-accent)]/15 px-2 py-0.5 text-[11px] uppercase tracking-[0.15em] text-[color:var(--lap-accent)]`}>{k.status}</span>
                  </span>
                  <span className="mt-1 block text-sm leading-snug opacity-75">{k.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tech news: what I read */}
        <section data-reveal className={`${card} lg:col-span-7`}>
          <Label fi="luen" en="What I'm reading · top of Hacker News" mono={mono} />
          <ol className="mt-4 divide-y divide-[color:var(--lap-line)]">
            {feeds.tech.slice(0, 5).map((n, i) => (
              <li key={n.link} className="flex gap-3 py-2.5">
                <span className={`${mono} w-5 shrink-0 pt-0.5 text-xs text-[color:var(--lap-accent)]`}>{i + 1}</span>
                <span className="min-w-0">
                  <a href={n.link} target="_blank" rel="noreferrer" className="text-sm leading-snug transition hover:text-[color:var(--lap-accent)]">{n.title}</a>
                  <span className={`${mono} mt-0.5 block truncate text-[11px] uppercase tracking-[0.15em] opacity-70`}>
                    {n.site} · {n.points} points ·{" "}
                    <a href={n.comments} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">discussion</a>
                  </span>
                </span>
              </li>
            ))}
          </ol>
          {feeds.updated && (
            <p className={`${mono} mt-3 text-[11px] uppercase tracking-[0.15em] opacity-65`}>
              Refreshed {new Date(feeds.updated).toLocaleDateString("en-IE", { day: "numeric", month: "short" })}, every morning
            </p>
          )}
        </section>

        {/* Something sus */}
        <section data-reveal style={{ ["--d" as string]: ".1s" }} className={`${card} lg:col-span-5`}>
          <Label fi="epäilyttävä" en="Something sus" mono={mono} />
          <p className="mb-4 mt-3 text-sm opacity-75">Four of these are true. One is the impostor.</p>
          <SusGame mono={mono} />
        </section>

        {/* Contact */}
        <section id="contact" data-reveal className="lap-contact flex flex-col gap-6 rounded-[22px] p-7 text-white shadow-xl sm:flex-row sm:items-end sm:justify-between lg:col-span-12">
          <div>
            <p className={`${mono} text-[11px] uppercase tracking-[0.25em] opacity-80`}>Get in touch · ota yhteyttä</p>
            <p className={`${display} mt-3 text-4xl leading-tight`}>Hiring a data analyst in Ireland?</p>
          </div>
          <div className={`${mono} flex flex-col gap-1 text-sm`}>
            <a href={`mailto:${profile.email}`} className="underline-offset-4 hover:underline">{profile.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">LinkedIn ↗</a>
            <a href="/cv" className="underline-offset-4 hover:underline">CV ↗</a>
          </div>
        </section>
      </main>

      <footer className={`${mono} mx-auto max-w-6xl px-4 pb-8 text-[11px] uppercase tracking-[0.2em] text-white [text-shadow:0_1px_6px_rgb(0_0_0/.6)] sm:px-6`}>
        © 2026 Madhu Sudhan · scene drawn in code, no stock photos
      </footer>
    </div>
  );
}
