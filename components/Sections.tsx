"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { compounds, education, experience, profile, projects, type Project } from "@/lib/data";
import { useSettings } from "./Settings";

const wrap = "mx-auto max-w-7xl px-4 lg:pr-[300px]";

function Head({ id, kicker, title, sub }: { id: string; kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-10">
      <p className="font-cond text-sm font-semibold uppercase tracking-[0.35em] text-papaya">{kicker}</p>
      <h2 id={id} className="mt-2 font-display text-4xl font-black uppercase italic tracking-tight sm:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-3 max-w-2xl text-mute">{sub}</p>}
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { motion: m } = useSettings();
  return (
    <motion.div
      initial={m ? { opacity: 0, y: 24 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Experience: pit-wall timing tower ---------- */
export function Experience() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="pitwall" tabIndex={-1} aria-labelledby="pitwall-h" className="py-20 outline-none sm:py-28">
      <div className={wrap}>
        <Head id="pitwall-h" kicker="Sector 1 · Pit wall" title="Experience" sub="Each role is a stint. Most recent at the top. Open a row for the detail." />
        <Reveal>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-carbon-900">
            <div className="hidden grid-cols-[56px_1fr_1fr_140px_40px] gap-3 border-b border-white/10 bg-carbon-800 px-4 py-2 font-cond text-xs uppercase tracking-[0.25em] text-mute md:grid">
              <span>Pos</span>
              <span>Team</span>
              <span>Role</span>
              <span>Stint</span>
              <span className="sr-only">Expand</span>
            </div>
            <ol>
              {experience.map((s, i) => {
                const isOpen = open === i;
                const panelId = `stint-${i}`;
                return (
                  <li key={s.team} className="border-b border-white/5 last:border-0">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="grid w-full grid-cols-[44px_1fr_28px] items-center gap-3 px-4 py-4 text-left hover:bg-carbon-800 md:grid-cols-[56px_1fr_1fr_140px_40px]"
                      >
                        <span className={`flex h-9 w-9 items-center justify-center font-display text-lg font-black italic ${i === 0 ? "bg-papaya text-carbon-950" : "bg-carbon-700 text-chalk"}`}>
                          {s.pos}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-lg font-bold uppercase leading-tight">{s.team}</span>
                          <span className="block text-sm text-mute md:hidden">{s.role}</span>
                          <span className="block font-mono text-xs text-teal md:hidden">{s.dates}</span>
                        </span>
                        <span className="hidden text-chalk/90 md:block">{s.role}</span>
                        <span className="hidden font-mono text-sm text-teal md:block">
                          {s.dates}
                          {s.dates !== s.length && <span className="block text-xs text-mute">{s.length}</span>}
                        </span>
                        <span aria-hidden="true" className={`justify-self-end text-papaya transition-transform ${isOpen ? "rotate-45" : ""}`}>
                          +
                        </span>
                      </button>
                    </h3>
                    <div id={panelId} hidden={!isOpen} className="px-4 pb-5 md:pl-[84px]">
                      <p className="mb-2 font-cond text-sm uppercase tracking-widest text-mute">{s.place}</p>
                      <ul className="space-y-1.5 text-chalk/90">
                        {s.points.map((p) => (
                          <li key={p} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-3 shrink-0 bg-papaya" aria-hidden="true" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Projects: telemetry cards ---------- */
function trace(seed: number) {
  // Deterministic decorative line. Not data.
  const pts: string[] = [];
  let v = 40;
  for (let i = 0; i <= 40; i++) {
    const s = Math.sin(i * 0.55 + seed) * 22 + Math.sin(i * 1.7 + seed * 2) * 8;
    v = 50 - s;
    pts.push(`${(i * 300) / 40},${Math.max(6, Math.min(74, v)).toFixed(1)}`);
  }
  return pts.join(" ");
}

function Telemetry({ seed, color }: { seed: number; color: string }) {
  return (
    <svg viewBox="0 0 300 80" className="h-20 w-full" aria-hidden="true" preserveAspectRatio="none">
      {[20, 40, 60].map((y) => (
        <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#2c363f" strokeDasharray="2 4" />
      ))}
      {[100, 200].map((x) => (
        <line key={x} x1={x} x2={x} y1="0" y2="80" stroke="#2c363f" />
      ))}
      <polyline points={trace(seed)} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <polyline points={trace(seed + 1.3)} fill="none" stroke="#a3adb6" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const cardColours = ["#ff7a1a", "#14b8a6", "#f4f1ea", "#ffd21a", "#5eead4"];

function ProjectPanel({ p, onClose }: { p: Project; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>("a, button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`panel-${p.id}`}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        className="max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-carbon-900 sm:rounded-2xl"
      >
        <div className="h-2 bg-gradient-to-r from-papaya via-teal to-chalk" />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h3 id={`panel-${p.id}`} className="font-display text-3xl font-black uppercase italic leading-none">
              {p.name}
            </h3>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close project details" className="rounded p-2 text-mute ring-1 ring-white/20 hover:text-chalk">
              <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-lg text-chalk/90">{p.tagline}</p>
          <ul className="mt-5 space-y-2 text-chalk/90">
            {p.detail.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="mt-2 h-1.5 w-3 shrink-0 bg-papaya" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
          {p.note && <p className="mt-4 border-l-4 border-teal pl-3 text-sm text-mute">{p.note}</p>}
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Built with">
            {p.stack.map((s) => (
              <li key={s} className="rounded bg-carbon-700 px-2.5 py-1 font-cond text-sm uppercase tracking-wider">
                {s}
              </li>
            ))}
          </ul>
          <a href={p.repo} target="_blank" rel="noopener noreferrer" className="skew mt-8 inline-block bg-papaya px-6 py-3 font-display font-bold uppercase tracking-wider text-carbon-950 hover:bg-papaya-soft">
            <span className="unskew inline-block">View code on GitHub</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [sel, setSel] = useState<Project | null>(null);
  return (
    <section id="telemetry" tabIndex={-1} aria-labelledby="telemetry-h" className="carbon border-y border-white/5 py-20 outline-none sm:py-28">
      <div className={wrap}>
        <Head id="telemetry-h" kicker="Sector 2 · Telemetry" title="Projects" sub="Things I've built. Open a card for the detail and the code." />
        <ul className="grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.id} className={i === 0 ? "md:col-span-2" : ""}>
              <Reveal delay={i * 0.05}>
                <article className="group relative h-full overflow-hidden rounded-xl border border-white/10 bg-carbon-900/95 transition hover:border-papaya/70">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-cond text-xs uppercase tracking-[0.25em] text-mute">
                    <span>Car {String(i + 1).padStart(2, "0")}</span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: cardColours[i] }} aria-hidden="true" />
                      Telemetry trace
                    </span>
                  </div>
                  <div className="px-4 pt-3">
                    <Telemetry seed={i * 2.1 + 0.4} color={cardColours[i]} />
                    <div className="mt-1 grid grid-cols-3 gap-1 font-mono text-[11px] text-mute" aria-hidden="true">
                      <span className="border-t-2 border-kerb pt-1">S1 ▪▪▪</span>
                      <span className="border-t-2 border-teal pt-1">S2 ▪▪▪</span>
                      <span className="border-t-2 border-papaya pt-1">S3 ▪▪▪</span>
                    </div>
                  </div>
                  <div className="p-4 pt-4">
                    <h3 className="font-display text-2xl font-bold uppercase leading-tight">
                      <button type="button" onClick={() => setSel(p)} className="text-left after:absolute after:inset-0 after:content-[''] hover:text-papaya">
                        {p.name}
                      </button>
                    </h3>
                    <p className="mt-2 text-chalk/85">{p.tagline}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {p.stack.slice(0, 5).map((s) => (
                        <li key={s} className="rounded bg-carbon-700 px-2 py-0.5 font-cond text-xs uppercase tracking-wider text-chalk/90">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 font-cond text-sm uppercase tracking-widest text-papaya" aria-hidden="true">
                      Open details →
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-mute">Traces and sector bars on the cards are decoration only, not measurements.</p>
      </div>
      <AnimatePresence>{sel && <ProjectPanel key={sel.id} p={sel} onClose={() => setSel(null)} />}</AnimatePresence>
    </section>
  );
}

/* ---------- Skills: tyre compounds ---------- */
function Tyre({ color, letter }: { color: string; letter: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0" aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="#0d1114" stroke="#2c363f" strokeWidth="2" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="5" strokeDasharray="52 8" />
      <circle cx="50" cy="50" r="27" fill="#1f272e" />
      <text x="50" y="59" textAnchor="middle" fontSize="26" fontWeight="900" fill={color} fontFamily="Titillium Web">
        {letter}
      </text>
    </svg>
  );
}

export function Skills() {
  return (
    <section id="tyres" tabIndex={-1} aria-labelledby="tyres-h" className="py-20 outline-none sm:py-28">
      <div className={wrap}>
        <Head id="tyres-h" kicker="Sector 2 · Tyre allocation" title="Skills" sub="Grouped like tyre compounds. Each set is a kind of work, not a score." />
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {compounds.map((c, i) => (
            <li key={c.name}>
              <Reveal delay={i * 0.05}>
                <div className="flex h-full gap-4 rounded-xl border border-white/10 bg-carbon-900 p-5">
                  <Tyre color={c.color} letter={c.letter} />
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-bold uppercase">{c.name}</h3>
                    <p className="font-cond text-xs uppercase tracking-[0.25em] text-mute">{c.compound} compound</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {c.skills.map((s) => (
                        <li key={s} className="rounded border border-white/15 px-2 py-0.5 text-sm">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
      <div className="kerb mt-20" aria-hidden="true" />
    </section>
  );
}

/* ---------- Education: qualifying ---------- */
export function Education() {
  return (
    <section id="qualifying" tabIndex={-1} aria-labelledby="qualifying-h" className="py-20 outline-none sm:py-28">
      <div className={wrap}>
        <Head id="qualifying-h" kicker="Sector 3 · Qualifying" title="Education" />
        <ol className="grid gap-5 md:grid-cols-2">
          {education.map((e, i) => (
            <li key={e.title}>
              <Reveal delay={i * 0.08}>
                <div className={`relative h-full overflow-hidden rounded-xl border bg-carbon-900 p-6 ${i === 0 ? "border-papaya/60" : "border-white/10"}`}>
                  <div className="flex items-center justify-between font-cond text-sm uppercase tracking-[0.25em]">
                    <span className="text-mute">{e.round}</span>
                    <span className={`rounded px-2 py-0.5 font-bold ${i === 0 ? "bg-papaya text-carbon-950" : "bg-carbon-700 text-chalk"}`}>{e.status}</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-tight">{e.title}</h3>
                  <p className="mt-1 text-chalk/90">
                    {e.school}, {e.place}
                  </p>
                  <p className="mt-1 font-mono text-sm text-teal">{e.dates}</p>
                  {e.modules.length > 0 && (
                    <>
                      <h4 className="mt-5 font-cond text-xs uppercase tracking-[0.25em] text-mute">Modules</h4>
                      <ul className="mt-2 space-y-1">
                        {e.modules.map((m) => (
                          <li key={m} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-3 shrink-0 bg-teal" aria-hidden="true" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Contact: chequered flag ---------- */
export function Contact() {
  const { motion: m } = useSettings();
  return (
    <section id="finish" tabIndex={-1} aria-labelledby="finish-h" className="outline-none">
      <motion.div
        className="chequer h-16 sm:h-24"
        aria-hidden="true"
        initial={m ? { backgroundPositionX: "0px" } : false}
        whileInView={m ? { backgroundPositionX: "56px" } : undefined}
        transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
      />
      <div className="carbon py-20 sm:py-28">
        <div className={wrap}>
          <p className="font-cond text-sm font-semibold uppercase tracking-[0.35em] text-papaya">Sector 3 · Finish line</p>
          <h2 id="finish-h" className="mt-2 font-display text-5xl font-black uppercase italic tracking-tight sm:text-7xl">
            Box, box.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-chalk/90">
            If you're hiring for a data or analytics role in Ireland, or want to talk about any of the projects, send me an email.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={`mailto:${profile.email}`} className="skew bg-papaya px-6 py-4 text-center font-display text-lg font-bold uppercase tracking-wider text-carbon-950 hover:bg-papaya-soft">
              <span className="unskew inline-block break-all">{profile.email}</span>
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="skew border-2 border-chalk px-6 py-4 text-center font-display text-lg font-bold uppercase tracking-wider hover:border-papaya hover:text-papaya">
              <span className="unskew inline-block">GitHub · {profile.githubHandle}</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <p className="mt-6 text-mute">{profile.location}</p>
        </div>
      </div>
    </section>
  );
}
