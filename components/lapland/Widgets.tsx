"use client";

import { useEffect, useRef, useState } from "react";

const time = (zone: string, d: Date, seconds = false) =>
  new Intl.DateTimeFormat("en-IE", { timeZone: zone, hour: "2-digit", minute: "2-digit", ...(seconds ? { second: "2-digit" } : {}), hour12: false }).format(d);

/** Live Dublin clock, with Rovaniemi's time and real temperature underneath. */
export function Clocks() {
  const [now, setNow] = useState<Date | null>(null);
  const [temp, setTemp] = useState<number | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    // Open-Meteo: free, no key. Rovaniemi 66.50N 25.73E
    fetch("https://api.open-meteo.com/v1/forecast?latitude=66.5&longitude=25.73&current=temperature_2m")
      .then((r) => r.json())
      .then((j) => setTemp(Math.round(j.current.temperature_2m)))
      .catch(() => {});
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="flex h-full flex-col justify-between">
      <p className="font-mono text-[44px] leading-none tracking-tight tabular-nums sm:text-[52px]">{now ? time("Europe/Dublin", now, true) : "--:--:--"}</p>
      <div className="mt-6 border-t border-[color:var(--lap-line)] pt-4 font-mono text-xs opacity-75">
        <p className="flex justify-between"><span>Rovaniemi</span><span className="tabular-nums">{now ? time("Europe/Helsinki", now) : "--:--"}</span></p>
        <p className="mt-1 flex justify-between"><span>right now there</span><span className="tabular-nums">{temp === null ? "…" : `${temp > 0 ? "+" : ""}${temp}°C`}</span></p>
      </div>
    </div>
  );
}

/** Catch the lights: click the aurora sparks before they fade. 20 seconds. */
export function AuroraGame() {
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; hue: number }[]>([]);
  const id = useRef(0);

  useEffect(() => {
    try { setBest(Number(localStorage.getItem("auroraBest") || 0)); } catch {}
  }, []);

  useEffect(() => {
    if (!running) return;
    const tick = window.setInterval(() => setLeft((l) => l - 1), 1000);
    const spawn = window.setInterval(() => {
      const s = { id: id.current++, x: 8 + Math.random() * 84, y: 12 + Math.random() * 70, hue: [150, 165, 280][Math.floor(Math.random() * 3)] };
      setSparks((all) => [...all.slice(-6), s]);
      window.setTimeout(() => setSparks((all) => all.filter((x) => x.id !== s.id)), 1300);
    }, 550);
    return () => { window.clearInterval(tick); window.clearInterval(spawn); };
  }, [running]);

  useEffect(() => {
    if (running && left <= 0) {
      setRunning(false);
      setSparks([]);
      setBest((b) => {
        const nb = Math.max(b, score);
        try { localStorage.setItem("auroraBest", String(nb)); } catch {}
        return nb;
      });
    }
  }, [left, running, score]);

  const start = () => { setScore(0); setLeft(20); setSparks([]); setRunning(true); };

  return (
    <div className="relative h-44 overflow-hidden rounded-xl bg-[#071226]">
      <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(120% 60% at 50% 0%, rgba(70,255,170,.25), transparent 60%)" }} />
      {sparks.map((s) => (
        <button
          key={s.id}
          type="button"
          aria-label="Catch this light"
          onClick={() => { setScore((v) => v + 1); setSparks((all) => all.filter((x) => x.id !== s.id)); }}
          className="lap-spark absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, background: `radial-gradient(circle, hsl(${s.hue} 100% 75%), hsl(${s.hue} 100% 55% / 0) 70%)` }}
        />
      ))}
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between font-mono text-xs text-white/80">
        <span>{running ? `${left}s · caught ${score}` : `best ${best}`}</span>
        {!running && (
          <button type="button" onClick={start} className="rounded-full bg-white/90 px-3 py-1.5 text-[#0b1a33] transition hover:bg-white">
            {score ? `caught ${score} · again?` : "start"}
          </button>
        )}
      </div>
    </div>
  );
}

/** A note to Madhu, sent the old way: it opens the visitor's email app. */
export function PostOffice({ email }: { email: string }) {
  const [note, setNote] = useState("");
  const href = `mailto:${email}?subject=${encodeURIComponent("A note from your portfolio")}&body=${encodeURIComponent(note)}`;
  return (
    <div>
      <label htmlFor="note" className="sr-only">Your note</label>
      <textarea
        id="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="Hi Madhu, ..."
        className="w-full resize-none rounded-lg border border-[color:var(--lap-line)] bg-transparent p-3 text-sm outline-none placeholder:opacity-50 focus:border-[color:var(--lap-accent)]"
      />
      <a href={href} className="mt-2 inline-flex items-center gap-2 rounded-full bg-[color:var(--lap-accent)] px-4 py-2 text-sm font-semibold text-[#06231a] transition hover:brightness-110">
        Post it <span aria-hidden="true">✉</span>
      </a>
    </div>
  );
}

/** A soft music-box melody: gentle notes on a calm scale with a little echo.
 *  Made with Web Audio, no files, and kept quiet. */
export function useLaplandSound() {
  const ctx = useRef<AudioContext | null>(null);
  const out = useRef<GainNode | null>(null);
  const echo = useRef<GainNode | null>(null);
  const timer = useRef(0);
  const step = useRef(0);
  const [on, setOn] = useState(false);

  // C major pentatonic over two octaves: nothing in it can clash
  const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];
  const PHRASE = [0, 2, 4, 3, 2, 1, 2, 0, 4, 5, 4, 3, 2, 3, 1, 0];

  const pluck = (f: number, t: number, vol: number) => {
    const ac = ctx.current!;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    [[f, "sine", 1], [f * 2, "sine", 0.18]].forEach(([freq, type, k]) => {
      const o = ac.createOscillator();
      const og = ac.createGain();
      o.type = type as OscillatorType;
      o.frequency.value = freq as number;
      og.gain.value = k as number;
      o.connect(og).connect(g);
      o.start(t);
      o.stop(t + 2.5);
    });
    g.connect(out.current!);
    g.connect(echo.current!);
  };

  const toggle = () => {
    if (on) {
      out.current?.gain.setTargetAtTime(0, ctx.current!.currentTime, 0.4);
      window.clearInterval(timer.current);
      setOn(false);
      return;
    }
    if (!ctx.current) {
      const ac = new AudioContext();
      ctx.current = ac;
      const master = ac.createGain();
      master.gain.value = 0;
      const soft = ac.createBiquadFilter();
      soft.type = "lowpass";
      soft.frequency.value = 2800;
      master.connect(soft).connect(ac.destination);
      out.current = master;
      // a gentle echo: delay fed back into itself, quieter each time
      const delay = ac.createDelay(1);
      delay.delayTime.value = 0.42;
      const fb = ac.createGain();
      fb.gain.value = 0.32;
      const send = ac.createGain();
      send.gain.value = 0.35;
      send.connect(delay).connect(fb).connect(delay);
      delay.connect(master);
      echo.current = send;
    }
    ctx.current.resume();
    out.current!.gain.setTargetAtTime(0.2, ctx.current.currentTime, 0.8);
    timer.current = window.setInterval(() => {
      const ac = ctx.current!;
      const s = step.current++;
      // leave some gaps so it breathes
      if (s % 8 === 7 || Math.random() < 0.15) return;
      pluck(SCALE[PHRASE[s % PHRASE.length]], ac.currentTime + 0.02, 0.09);
      if (s % 8 === 0) pluck(SCALE[PHRASE[s % PHRASE.length]] / 2, ac.currentTime + 0.02, 0.05); // soft low note on the bar
    }, 620);
    setOn(true);
  };

  useEffect(() => () => { window.clearInterval(timer.current); ctx.current?.close(); }, []);
  return { on, toggle };
}

/** Dublin right now: live temperature and today's sunset, from Open-Meteo (free, no key). */
export function DublinNow({ mono }: { mono: string }) {
  const [w, setW] = useState<{ temp: number; sunset: string } | null>(null);
  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=53.35&longitude=-6.26&current=temperature_2m&daily=sunset&timezone=Europe%2FDublin&forecast_days=1")
      .then((r) => r.json())
      .then((j) => setW({ temp: Math.round(j.current.temperature_2m), sunset: String(j.daily.sunset[0]).slice(11, 16) }))
      .catch(() => {});
  }, []);
  return (
    <p className={`${mono} flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.15em] opacity-75`}>
      <span>Dublin right now · {w ? `${w.temp > 0 ? "+" : ""}${w.temp}°C` : "…"}</span>
      <span>Sunset · {w ? w.sunset : "…"}</span>
    </p>
  );
}

/** Spot the impostor: four true facts and one that is sus. */
const CLAIMS = [
  { text: "My Irish property project queries 812,018 house sales in SQL.", sus: false, why: "True. It's all in DuckDB, and the queries are on this page." },
  { text: "The northern lights on this page are a stock photo.", sus: true, why: "Sus! Every star, tree and ray of light here is drawn in code. No photos at all." },
  { text: "Our LLM benchmark is covered by 456 unit tests.", sus: false, why: "True. They all run offline, and the repo is public." },
  { text: "I fixed booking issues for customers at Thomas Cook in Bengaluru.", sus: false, why: "True. That's where I learned to check every number twice." },
  { text: "I co-wrote an article that HackerNoon published.", sus: false, why: "True. It's about catching a scoring bug in our own research." },
];

export function SusGame({ mono }: { mono: string }) {
  const [pick, setPick] = useState<number | null>(null);
  const found = pick !== null && CLAIMS[pick].sus;
  return (
    <div>
      <ul className="space-y-2">
        {CLAIMS.map((c, i) => {
          const chosen = pick === i;
          const reveal = pick !== null && (chosen || c.sus);
          return (
            <li key={c.text}>
              <button
                type="button"
                onClick={() => setPick(i)}
                aria-pressed={chosen}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${
                  reveal && c.sus
                    ? "border-[#ff8fa3] bg-[#ff8fa3]/15"
                    : chosen
                      ? "border-[color:var(--lap-accent)] bg-[color:var(--lap-accent)]/10"
                      : "border-[color:var(--lap-line)] hover:border-[color:var(--lap-accent)]"
                }`}
              >
                {c.text}
                {reveal && <span className="mt-1 block text-xs opacity-80">{c.why}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <p className={`${mono} mt-3 text-[11px] uppercase tracking-[0.15em] opacity-70`} aria-live="polite">
        {pick === null ? "Tap the one that's sus" : found ? "Impostor found ✓" : "Not that one. Have another go"}
        {pick !== null && (
          <button type="button" onClick={() => setPick(null)} className="ml-3 underline underline-offset-4">
            reset
          </button>
        )}
      </p>
    </div>
  );
}
