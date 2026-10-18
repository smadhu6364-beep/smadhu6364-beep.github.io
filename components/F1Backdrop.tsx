// Fixed page background: Albert Park, Melbourne at night. A full-size circuit
// with kerbs and a glowing car lapping it, speed streaks, and the city skyline
// over the lake. Purely decorative and behind all content; the car and streaks
// stop for visitors who prefer reduced motion.
import { TRACK } from "./Circuit";

const W = 1440;

// deterministic skyline so the static export is identical on every load
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const SKY = (() => {
  const r = rng(7);
  const towers: { x: number; w: number; h: number; spire: boolean }[] = [];
  for (let x = 0; x < W; ) {
    const w = 26 + Math.floor(r() * 46);
    const tall = r() < 0.15;
    towers.push({ x, w, h: tall ? 150 + r() * 90 : 40 + r() * 100, spire: tall && r() < 0.6 });
    x += w + 3;
  }
  const windows: { x: number; y: number }[] = [];
  towers.forEach((t) => {
    for (let wy = 260 - t.h + 10; wy < 252; wy += 12)
      for (let wx = t.x + 5; wx < t.x + t.w - 5; wx += 9) if (r() < 0.18) windows.push({ x: wx, y: wy });
  });
  const streaks = Array.from({ length: 14 }, () => ({ top: 8 + r() * 80, w: 80 + r() * 220, dur: 2.5 + r() * 3, delay: r() * 5 }));
  return { towers, windows, streaks };
})();

export default function F1Backdrop() {
  return (
    <div aria-hidden="true" className="f1-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* night sky wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgb(var(--accent)/0.10),transparent_60%),radial-gradient(ellipse_at_90%_90%,rgba(255,122,26,0.10),transparent_55%)]" />

      {/* speed streaks */}
      <div className="absolute inset-0">
        {SKY.streaks.map((s, i) => (
          <span
            key={i}
            className="f1-streak absolute h-px rounded-full"
            style={{ top: `${s.top}%`, width: s.w, animationDuration: `${s.dur}s`, animationDelay: `-${s.delay}s` }}
          />
        ))}
      </div>

      {/* the circuit, large, with a car lapping it */}
      <svg
        viewBox="20 18 270 168"
        preserveAspectRatio="xMidYMid meet"
        className="absolute left-1/2 top-1/2 h-[120vh] w-[150vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.55] lg:left-[62%] lg:top-[44%] lg:h-[100vh] lg:w-[90vw]"
      >
        <defs>
          <filter id="carGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* asphalt, edge lines, red/white kerbs */}
        <path d={TRACK} fill="none" stroke="rgb(var(--ink) / 0.10)" strokeWidth="7" strokeLinejoin="round" />
        <path d={TRACK} fill="none" stroke="rgb(var(--ink) / 0.35)" strokeWidth="0.5" strokeDasharray="5 3" />
        <path d={TRACK} fill="none" stroke="#e11d2e" strokeWidth="1.4" strokeDasharray="1.6 1.6" strokeOpacity="0.45" transform="translate(0 0)" />
        {/* lake in the infield */}
        <ellipse cx="160" cy="105" rx="70" ry="22" transform="rotate(-12 160 105)" fill="rgb(var(--accent) / 0.10)" />
        {/* start/finish line */}
        <path d="M118 165 L118 177" stroke="rgb(var(--ink) / 0.6)" strokeWidth="1.6" strokeDasharray="1.2 1.2" />
        {/* the car: glowing head + fading trail */}
        <g className="f1-car" filter="url(#carGlow)">
          {[0, 0.12, 0.24, 0.36, 0.48].map((lag, i) => (
            <circle key={i} r={2.4 - i * 0.4} fill={i === 0 ? "#ff7a1a" : "rgb(var(--accent))"} opacity={1 - i * 0.18}>
              <animateMotion dur="14s" begin={`-${lag}s`} repeatCount="indefinite" rotate="auto" path={TRACK} />
            </circle>
          ))}
        </g>
      </svg>

      {/* Melbourne skyline over the lake */}
      <svg
        viewBox={`0 0 ${W} 260`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[110px] w-full opacity-60 md:h-[150px]"
      >
        {SKY.towers.map((t, i) => (
          <g key={i} fill="rgb(var(--ink) / 0.07)">
            <rect x={t.x} y={260 - t.h} width={t.w} height={t.h} />
            {t.spire && <rect x={t.x + t.w / 2 - 1} y={260 - t.h - 34} width={2} height={34} />}
          </g>
        ))}
        {SKY.windows.map((w, i) => (
          <rect key={i} className="f1-window" x={w.x} y={w.y} width={3} height={5} />
        ))}
      </svg>

      {/* kerb stripe along the very bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[repeating-linear-gradient(90deg,#e11d2e_0_22px,#f5f5f4_22px_44px)] opacity-80" />

      {/* readability veils: soften the scene behind the text columns, keep it strong at the edges */}
      <div className="absolute inset-y-0 left-0 hidden w-[50%] bg-gradient-to-r from-[rgb(var(--bg))] via-[rgb(var(--bg)/0.85)] to-transparent lg:block" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_70%_at_62%_50%,rgb(var(--bg)/0.78),transparent_75%)] lg:bg-[radial-gradient(ellipse_32%_75%_at_66%_50%,rgb(var(--bg)/0.8),transparent_80%)]" />
    </div>
  );
}
