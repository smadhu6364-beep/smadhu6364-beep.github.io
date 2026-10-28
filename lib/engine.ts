// A short, made-up race car pass: engine revs through two gear changes while the
// sound sweeps left to right and drops in pitch as it goes by. Web Audio only.
export function playDriveBy() {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  const ac = new Ctx();
  const t = ac.currentTime + 0.02;
  const end = t + 2.4;

  const out = ac.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(0.32, t + 0.9); // approaching
  out.gain.exponentialRampToValueAtTime(0.22, t + 1.4);
  out.gain.exponentialRampToValueAtTime(0.0001, end); // gone
  const pan = ac.createStereoPanner();
  pan.pan.setValueAtTime(-0.9, t);
  pan.pan.linearRampToValueAtTime(0.9, t + 2);
  const tone = ac.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.setValueAtTime(900, t);
  tone.frequency.linearRampToValueAtTime(2400, t + 1);
  tone.frequency.linearRampToValueAtTime(700, end);
  tone.connect(pan).connect(out).connect(ac.destination);

  // engine: two detuned oscillators, revving with gear changes, then a Doppler drop
  const pitch = (f: AudioParam) => {
    f.setValueAtTime(110, t);
    f.exponentialRampToValueAtTime(260, t + 0.55);
    f.setValueAtTime(170, t + 0.6); // shift
    f.exponentialRampToValueAtTime(320, t + 1.05);
    f.setValueAtTime(240, t + 1.1); // shift
    f.exponentialRampToValueAtTime(380, t + 1.35);
    f.exponentialRampToValueAtTime(190, end); // passing: pitch falls
  };
  [["sawtooth", 0], ["square", 7]].forEach(([type, detune]) => {
    const o = ac.createOscillator();
    o.type = type as OscillatorType;
    o.detune.value = detune as number;
    pitch(o.frequency);
    const g = ac.createGain();
    g.gain.value = type === "square" ? 0.35 : 0.6;
    o.connect(g).connect(tone);
    o.start(t);
    o.stop(end);
  });

  // road and wind noise
  const buf = ac.createBuffer(1, ac.sampleRate * 2.5, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const n = ac.createBufferSource();
  n.buffer = buf;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1200;
  const ng = ac.createGain();
  ng.gain.value = 0.25;
  n.connect(bp).connect(ng).connect(pan);
  n.start(t);
  n.stop(end);

  window.setTimeout(() => ac.close(), 2800);
}
