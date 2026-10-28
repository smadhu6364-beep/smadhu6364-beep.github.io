"use client";

import { useEffect, useRef, useState } from "react";
import { MUSIC_EVENT } from "./CarLoader";

// Original race-style loop made with the Web Audio API (no audio files):
// driving 16th-note bass, kick, offbeat hats and a bright arpeggio over Am-F-C-G.
const BPM = 126;
const STEP = 60 / BPM / 4; // one 16th note
const CHORDS = [
  [57, 60, 64], // Am
  [53, 57, 60], // F
  [48, 52, 55], // C
  [55, 59, 62], // G
];
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export default function RaceMusic() {
  const [on, setOn] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const timer = useRef<number>(0);
  const step = useRef(0);
  const next = useRef(0);

  useEffect(() => () => { window.clearInterval(timer.current); ctx.current?.close(); }, []);

  const note = (freq: number, t: number, len: number, type: OscillatorType, vol: number, cutoff = 4000) => {
    const ac = ctx.current!;
    const o = ac.createOscillator();
    const f = ac.createBiquadFilter();
    const g = ac.createGain();
    o.type = type;
    o.frequency.value = freq;
    f.type = "lowpass";
    f.frequency.value = cutoff;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(f).connect(g).connect(master.current!);
    o.start(t);
    o.stop(t + len + 0.02);
  };

  const kick = (t: number) => {
    const ac = ctx.current!;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g).connect(master.current!);
    o.start(t);
    o.stop(t + 0.3);
  };

  const hat = (t: number) => {
    const ac = ctx.current!;
    const buf = ac.createBuffer(1, ac.sampleRate * 0.05, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource();
    const f = ac.createBiquadFilter();
    const g = ac.createGain();
    s.buffer = buf;
    f.type = "highpass";
    f.frequency.value = 7000;
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(f).connect(g).connect(master.current!);
    s.start(t);
  };

  const schedule = () => {
    const ac = ctx.current!;
    while (next.current < ac.currentTime + 0.12) {
      const t = next.current;
      const s = step.current;
      const chord = CHORDS[Math.floor(s / 16) % 4];
      const inBar = s % 16;
      if (inBar % 4 === 0) kick(t);
      if (inBar % 4 === 2) hat(t);
      note(hz(chord[0] - 24), t, STEP * 0.9, "sawtooth", 0.22, 500 + 300 * Math.sin(s / 8)); // bass
      if (inBar % 2 === 0) note(hz(chord[(inBar / 2) % 3] + 12), t, STEP * 1.6, "square", 0.05, 2600); // arp
      next.current += STEP;
      step.current = s + 1;
    }
  };

  const toggle = () => {
    if (on) {
      window.clearInterval(timer.current);
      master.current?.gain.setTargetAtTime(0, ctx.current!.currentTime, 0.2);
      setOn(false);
      return;
    }
    if (!ctx.current) {
      ctx.current = new AudioContext();
      master.current = ctx.current.createGain();
      master.current.connect(ctx.current.destination);
    }
    ctx.current.resume();
    master.current!.gain.cancelScheduledValues(ctx.current.currentTime);
    master.current!.gain.setValueAtTime(0, ctx.current.currentTime);
    master.current!.gain.linearRampToValueAtTime(0.18, ctx.current.currentTime + 1.5); // fade in, kept quiet
    next.current = ctx.current.currentTime + 0.05;
    timer.current = window.setInterval(schedule, 25);
    setOn(true);
  };

  // "Enter with sound" on the loading screen starts the music.
  const toggleRef = useRef(toggle);
  toggleRef.current = toggle;
  const onRef = useRef(on);
  onRef.current = on;
  useEffect(() => {
    const start = () => { if (!onRef.current) toggleRef.current(); };
    window.addEventListener(MUSIC_EVENT, start);
    return () => window.removeEventListener(MUSIC_EVENT, start);
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn music off" : "Turn music on"}
      title={on ? "Music off" : "Music on"}
      className="flex h-11 w-11 items-center justify-center rounded-md border border-navy/40 bg-card/70 text-navy backdrop-blur transition hover:text-red"
    >
      {on ? (
        <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="eq-bar w-[3px] rounded-sm bg-red" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
          <style>{`.eq-bar{height:30%;animation:eq .5s ease-in-out infinite alternate}@keyframes eq{to{height:100%}}`}</style>
        </span>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )}
    </button>
  );
}
