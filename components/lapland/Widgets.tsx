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
      <div className="mt-6 border-t border-white/15 pt-4 font-mono text-xs text-white/70">
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
        className="w-full resize-none rounded-lg border border-[color:var(--lap-line)] bg-transparent p-3 text-sm outline-none placeholder:opacity-50 focus:border-[color:var(--lap-red)]"
      />
      <a href={href} className="mt-2 inline-flex items-center gap-2 rounded-full bg-[color:var(--lap-red)] px-4 py-2 text-sm text-white transition hover:brightness-110">
        Post it <span aria-hidden="true">✉</span>
      </a>
    </div>
  );
}

/** Wind over the fells with the odd sleigh bell. Made with Web Audio, no files. */
export function useLaplandSound() {
  const ctx = useRef<AudioContext | null>(null);
  const out = useRef<GainNode | null>(null);
  const bells = useRef(0);
  const [on, setOn] = useState(false);

  const bell = () => {
    const ac = ctx.current!;
    const t = ac.currentTime;
    for (let i = 0; i < 6; i++) {
      const at = t + i * 0.09 + Math.random() * 0.03;
      [2093, 2637, 3136].forEach((f) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = "sine";
        o.frequency.value = f * (1 + (Math.random() - 0.5) * 0.01);
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.02, at + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.5);
        o.connect(g).connect(out.current!);
        o.start(at);
        o.stop(at + 0.55);
      });
    }
  };

  const toggle = () => {
    if (on) {
      out.current?.gain.setTargetAtTime(0, ctx.current!.currentTime, 0.4);
      window.clearInterval(bells.current);
      setOn(false);
      return;
    }
    if (!ctx.current) {
      const ac = new AudioContext();
      ctx.current = ac;
      out.current = ac.createGain();
      out.current.gain.value = 0;
      out.current.connect(ac.destination);
      // wind: looping noise through a slowly moving band-pass
      const buf = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate);
      const d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
      const n = ac.createBufferSource();
      n.buffer = buf;
      n.loop = true;
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 500;
      bp.Q.value = 0.7;
      const lfo = ac.createOscillator();
      const depth = ac.createGain();
      lfo.frequency.value = 0.07;
      depth.gain.value = 300;
      lfo.connect(depth).connect(bp.frequency);
      n.connect(bp).connect(out.current);
      n.start();
      lfo.start();
      // a low, warm pad underneath
      [110, 164.8, 220].forEach((f) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        g.gain.value = 0.025;
        o.connect(g).connect(out.current!);
        o.start();
      });
    }
    ctx.current.resume();
    out.current!.gain.setTargetAtTime(0.5, ctx.current.currentTime, 1);
    bell();
    bells.current = window.setInterval(() => { if (Math.random() < 0.5) bell(); }, 9000);
    setOn(true);
  };

  useEffect(() => () => { window.clearInterval(bells.current); ctx.current?.close(); }, []);
  return { on, toggle };
}
