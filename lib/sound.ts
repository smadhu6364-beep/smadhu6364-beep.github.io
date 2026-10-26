// Ambient loop and UI sounds, all synthesised with the Web Audio API.
// No audio files. Nothing plays until the visitor has clicked something,
// and everything stays off unless they turn sound on.

type UiSound = "click" | "whoosh" | "tick";

const KEY = "sound";
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let uiBus: GainNode | null = null;
let noise: AudioBuffer | null = null;
let enabled = false;
let timer: number | null = null;
let nextBeat = 0;
let beat = 0;
const lastUi: Record<UiSound, number> = { click: 0, whoosh: 0, tick: 0 };
const listeners = new Set<(on: boolean) => void>();

// Fmaj7 - Em7 - Dm7 - Cmaj7, voiced low and close (MIDI note numbers)
const CHORDS = [
  [53, 57, 60, 64],
  [52, 55, 59, 62],
  [50, 53, 57, 60],
  [48, 52, 55, 59],
];
const BPM = 72;
const SPB = 60 / BPM; // seconds per beat
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);
  musicBus = ctx.createGain();
  musicBus.gain.value = 0;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1400;
  musicBus.connect(lp).connect(master);
  uiBus = ctx.createGain();
  uiBus.gain.value = 0.5;
  uiBus.connect(master);
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}

function pad(chord: number[], t: number, dur: number) {
  if (!ctx || !musicBus) return;
  for (const m of chord) {
    for (const detune of [-6, 6]) {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = hz(m);
      o.detune.value = detune;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.022, t + 1.2);
      g.gain.setValueAtTime(0.022, t + dur - 1.2);
      g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(g).connect(musicBus);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
  }
}

function kick(t: number) {
  if (!ctx || !musicBus) return;
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(110, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.18);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.18, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  o.connect(g).connect(musicBus);
  o.start(t);
  o.stop(t + 0.4);
}

function hat(t: number, level: number) {
  if (!ctx || !musicBus || !noise) return;
  const s = ctx.createBufferSource();
  s.buffer = noise;
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 6000;
  f.Q.value = 0.8;
  const g = ctx.createGain();
  g.gain.setValueAtTime(level, t);
  g.gain.exponentialRampToValueAtTime(0.0005, t + 0.06);
  s.connect(f).connect(g).connect(musicBus);
  s.start(t, Math.random() * 0.5, 0.08);
}

function schedule() {
  if (!ctx) return;
  while (nextBeat < ctx.currentTime + 0.4) {
    const bar = Math.floor(beat / 4);
    const inBar = beat % 4;
    if (inBar === 0) pad(CHORDS[bar % CHORDS.length], nextBeat, SPB * 4 + 0.6);
    if (inBar === 0 || (inBar === 2 && bar % 2 === 1)) kick(nextBeat);
    // lazy swung hats on the off-beats
    hat(nextBeat + SPB * 0.58, 0.035);
    if (inBar === 3) hat(nextBeat + SPB * 0.83, 0.02);
    nextBeat += SPB;
    beat++;
  }
}

function startMusic() {
  const c = ensure();
  if (!c || !musicBus) return;
  void c.resume();
  musicBus.gain.cancelScheduledValues(c.currentTime);
  musicBus.gain.setTargetAtTime(0.55, c.currentTime, 0.8);
  if (timer === null) {
    nextBeat = c.currentTime + 0.1;
    timer = window.setInterval(schedule, 100);
    schedule();
  }
}

function stopMusic() {
  // Stop scheduling new notes straight away, fade out, then suspend the
  // context so nothing keeps running in the background.
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
  if (!ctx || !musicBus) return;
  musicBus.gain.cancelScheduledValues(ctx.currentTime);
  musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
  const c = ctx;
  window.setTimeout(() => {
    if (!enabled) void c.suspend();
  }, 250);
}

export function soundRemembered() {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function isSoundOn() {
  return enabled;
}

export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Must be called from a click (or other user gesture) handler. */
export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  if (on) startMusic();
  else stopMusic();
  listeners.forEach((l) => l(on));
}

export function playUi(kind: UiSound) {
  if (!enabled || !ctx || !uiBus || ctx.state !== "running") return;
  const now = performance.now();
  const gap = kind === "tick" ? 140 : 60;
  if (now - lastUi[kind] < gap) return;
  lastUi[kind] = now;
  const t = ctx.currentTime;
  if (kind === "whoosh" && noise) {
    const s = ctx.createBufferSource();
    s.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(400, t);
    f.frequency.exponentialRampToValueAtTime(2400, t + 0.28);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    s.connect(f).connect(g).connect(uiBus);
    s.start(t, 0, 0.4);
    return;
  }
  const o = ctx.createOscillator();
  o.type = "sine";
  const g = ctx.createGain();
  if (kind === "click") {
    o.frequency.setValueAtTime(880, t);
    o.frequency.exponentialRampToValueAtTime(520, t + 0.07);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
  } else {
    o.frequency.value = 2200;
    g.gain.setValueAtTime(0.025, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
  }
  o.connect(g).connect(uiBus);
  o.start(t);
  o.stop(t + 0.12);
}
