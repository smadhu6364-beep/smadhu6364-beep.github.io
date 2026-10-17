// Synthesised engine note with the Web Audio API. No audio files are used.
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function setMuted(m: boolean) {
  if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.18, ctx.currentTime, 0.05);
}

/** Short beep for each start light. */
export function beep(freq = 880, dur = 0.12) {
  const c = getCtx();
  if (!c || !master) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "square";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.25, c.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(master);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

/** Rev: two detuned sawtooths through a low-pass, pitch sweeping up then down. */
export function rev(seconds = 2.6) {
  const c = getCtx();
  if (!c || !master) return;
  if (c.state === "suspended") void c.resume();
  const t = c.currentTime;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(600, t);
  filter.frequency.linearRampToValueAtTime(2400, t + seconds * 0.6);
  filter.frequency.linearRampToValueAtTime(500, t + seconds);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5, t + 0.15);
  g.gain.setValueAtTime(0.5, t + seconds * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  filter.connect(g).connect(master);
  [0, 7].forEach((detune) => {
    const o = c.createOscillator();
    o.type = "sawtooth";
    o.detune.value = detune;
    o.frequency.setValueAtTime(55, t);
    o.frequency.exponentialRampToValueAtTime(70, t + 0.3);
    o.frequency.exponentialRampToValueAtTime(260, t + seconds * 0.6);
    o.frequency.exponentialRampToValueAtTime(90, t + seconds);
    // amplitude wobble for a "firing" texture
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = 38;
    lfoGain.gain.value = 18;
    lfo.connect(lfoGain).connect(o.frequency);
    o.connect(filter);
    o.start(t);
    lfo.start(t);
    o.stop(t + seconds + 0.05);
    lfo.stop(t + seconds + 0.05);
  });
}

export function unlock() {
  const c = getCtx();
  if (c && c.state === "suspended") void c.resume();
}
