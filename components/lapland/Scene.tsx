"use client";

import { useEffect, useRef } from "react";

/*
  Lapland backdrop, drawn in code:
  - back canvas: sky, stars and (at night) the northern lights
  - SVG: fells, pines, red cabins with lit windows, chimney smoke, a reindeer,
    and the Arctic Circle sign from Santa Claus Village
  - front canvas: falling snow
  `night` switches polar night / blue hour, `lively` pauses all motion.
*/

type Star = { x: number; y: number; r: number; p: number };
type Flake = { x: number; y: number; r: number; v: number; w: number };

export default function Scene({ night, lively }: { night: boolean; lively: boolean }) {
  const sky = useRef<HTMLCanvasElement>(null);
  const snow = useRef<HTMLCanvasElement>(null);
  const state = useRef({ night, lively });
  state.current = { night, lively };

  useEffect(() => {
    const a = sky.current!, b = snow.current!;
    const ca = a.getContext("2d")!, cb = b.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1;
    let stars: Star[] = [];
    let flakes: Flake[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      for (const c of [a, b]) {
        c.width = W * dpr;
        c.height = H * dpr;
        c.style.width = W + "px";
        c.style.height = H + "px";
      }
      ca.setTransform(dpr, 0, 0, dpr, 0, 0);
      cb.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.round((W * H) / 5200) }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.7, r: Math.random() * 1.3 + 0.2, p: Math.random() * 6 }));
      flakes = Array.from({ length: Math.round(W / 9) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.2 + 0.6, v: Math.random() * 0.6 + 0.35, w: Math.random() * 6 }));
    };
    resize();
    window.addEventListener("resize", resize);

    // one aurora curtain: a wavy line of vertical light strokes
    const curtain = (t: number, base: number, amp: number, hue: [string, string], speed: number, alpha: number) => {
      ca.globalCompositeOperation = "lighter";
      const step = 5;
      for (let x = -40; x < W + 40; x += step) {
        const k = x / W;
        const y = H * base + Math.sin(k * 5 + t * speed) * H * amp + Math.sin(k * 13 - t * speed * 1.7) * H * amp * 0.35;
        const len = H * (0.16 + 0.1 * Math.sin(k * 9 + t * speed * 0.8));
        const fade = 0.55 + 0.45 * Math.sin(k * 7 - t * speed * 1.3);
        const g = ca.createLinearGradient(0, y - len, 0, y + 20);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(0.55, hue[1]);
        g.addColorStop(1, hue[0]);
        ca.globalAlpha = alpha * fade;
        ca.fillStyle = g;
        ca.fillRect(x, y - len, step + 1, len + 20);
      }
      ca.globalAlpha = 1;
      ca.globalCompositeOperation = "source-over";
    };

    let raf = 0, t = 0, last = performance.now();
    const frame = (now: number) => {
      const { night, lively } = state.current;
      const moving = lively && !reduced;
      if (moving) t += (now - last) / 1000;
      last = now;

      // sky
      const g = ca.createLinearGradient(0, 0, 0, H);
      if (night) {
        g.addColorStop(0, "#030714");
        g.addColorStop(0.55, "#0a1a33");
        g.addColorStop(1, "#16304d");
      } else {
        g.addColorStop(0, "#7d9cc8");
        g.addColorStop(0.5, "#c9b6cf");
        g.addColorStop(1, "#f6d3c3");
      }
      ca.fillStyle = g;
      ca.fillRect(0, 0, W, H);

      if (night) {
        for (const s of stars) {
          ca.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(s.p + t * 0.9));
          ca.fillStyle = "#e9f1ff";
          ca.beginPath();
          ca.arc(s.x, s.y, s.r, 0, 6.283);
          ca.fill();
        }
        ca.globalAlpha = 1;
        curtain(t, 0.3, 0.07, ["rgba(70,255,170,0.95)", "rgba(40,210,150,0.4)"], 0.22, 0.75);
        curtain(t + 40, 0.18, 0.05, ["rgba(120,255,210,0.85)", "rgba(150,110,255,0.4)"], 0.16, 0.55);
        curtain(t + 90, 0.44, 0.04, ["rgba(60,230,160,0.7)", "rgba(200,90,220,0.22)"], 0.28, 0.25);
      } else {
        // low winter sun, sitting on the horizon
        const sg = ca.createRadialGradient(W * 0.78, H * 0.62, 0, W * 0.78, H * 0.62, H * 0.35);
        sg.addColorStop(0, "rgba(255,226,190,0.95)");
        sg.addColorStop(0.15, "rgba(255,200,170,0.55)");
        sg.addColorStop(1, "rgba(255,200,170,0)");
        ca.fillStyle = sg;
        ca.fillRect(0, 0, W, H);
      }

      // snow
      cb.clearRect(0, 0, W, H);
      cb.fillStyle = night ? "rgba(235,242,255,0.85)" : "rgba(255,255,255,0.9)";
      for (const f of flakes) {
        if (moving) {
          f.y += f.v;
          f.x += Math.sin(t * 0.8 + f.w) * 0.35;
          if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; }
        }
        cb.beginPath();
        cb.arc(f.x, f.y, f.r, 0, 6.283);
        cb.fill();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const lit = night ? "#ffcf6e" : "#f2d9a8";

  return (
    <div aria-hidden="true" className={`lap-scene fixed inset-0 z-0 overflow-hidden ${lively ? "" : "lap-still"}`}>
      <canvas ref={sky} className="absolute inset-0" />
      <svg className="absolute inset-x-0 bottom-0 h-[46vh] min-h-[260px] w-full" viewBox="0 0 1600 500" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="fellFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={night ? "#24405f" : "#b9c4dc"} />
            <stop offset="1" stopColor={night ? "#1a314d" : "#d9d6e4"} />
          </linearGradient>
          <linearGradient id="snowGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={night ? "#c9d7ee" : "#fbf7f4"} />
            <stop offset="1" stopColor={night ? "#8ea4c6" : "#e9e2ea"} />
          </linearGradient>
          <radialGradient id="glow">
            <stop offset="0" stopColor={lit} stopOpacity={night ? 0.7 : 0.25} />
            <stop offset="1" stopColor={lit} stopOpacity="0" />
          </radialGradient>
          <symbol id="pine" viewBox="-30 -120 60 124">
            <rect x="-3" y="-8" width="6" height="12" fill="#3b2a22" />
            <path d="M0 -120 L18 -84 L9 -86 L25 -54 L12 -56 L30 -20 L-30 -20 L-12 -56 L-25 -54 L-9 -86 L-18 -84 Z" fill={night ? "#0f2a2a" : "#2f4a45"} />
            <path d="M0 -120 L10 -100 L3 -98 L0 -104 L-3 -98 L-10 -100 Z M-14 -58 L-4 -64 L4 -60 L14 -58 L8 -54 L0 -58 L-8 -54 Z M-22 -24 L-8 -30 L2 -26 L22 -24 L12 -20 L-12 -20 Z" fill={night ? "#dfe9fa" : "#ffffff"} />
          </symbol>
          <symbol id="cabin" viewBox="0 0 120 100">
            <rect x="10" y="40" width="100" height="58" fill={night ? "#7a1f1f" : "#a8322c"} />
            <path d="M10 46 h100 M10 56 h100 M10 66 h100 M10 76 h100 M10 86 h100" stroke="#00000025" strokeWidth="2" />
            <path d="M0 44 L60 6 L120 44 Z" fill={night ? "#e3ecf9" : "#ffffff"} />
            <path d="M4 44 L60 12 L116 44" fill="none" stroke="#2a1a16" strokeWidth="3" />
            <rect x="80" y="10" width="12" height="22" fill="#3a2a25" />
            <rect x="24" y="56" width="20" height="18" fill={lit} stroke="#f3efe6" strokeWidth="3" />
            <rect x="76" y="56" width="20" height="18" fill={lit} stroke="#f3efe6" strokeWidth="3" />
            <rect x="50" y="62" width="18" height="36" fill="#3a2422" />
          </symbol>
        </defs>

        {/* far fells */}
        <path d="M0 300 L120 230 L230 270 L380 180 L520 260 L640 220 L780 280 L930 200 L1080 270 L1230 190 L1380 260 L1500 220 L1600 250 L1600 500 L0 500 Z" fill="url(#fellFar)" />
        <path d="M380 180 L410 198 L395 196 L372 192 Z M930 200 L960 216 L940 214 Z M1230 190 L1262 208 L1240 206 Z" fill={night ? "#d5e2f5" : "#ffffff"} opacity="0.8" />

        {/* far pines */}
        {[60, 140, 210, 470, 560, 690, 1010, 1130, 1320, 1450, 1540].map((x, i) => (
          <use key={x} href="#pine" x={x - 15} y={268 + (i % 3) * 8} width="30" height="62" opacity="0.75" />
        ))}

        {/* snow ground */}
        <path d="M0 360 C 260 320, 480 350, 760 330 S 1300 320, 1600 345 L1600 500 L0 500 Z" fill="url(#snowGround)" />

        {/* cabins with window glow and smoke */}
        {[[300, 288, 1], [470, 300, 0.8], [1180, 292, 0.9]].map(([x, y, s], i) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
            <ellipse cx="60" cy="72" rx="110" ry="60" fill="url(#glow)" className="lap-flicker" style={{ animationDelay: `${i * 0.7}s` }} />
            <use href="#cabin" width="120" height="100" />
            {[0, 1, 2].map((k) => (
              <circle key={k} cx="86" cy="8" r="7" fill={night ? "#cfd8e6" : "#ffffff"} className="lap-smoke" style={{ animationDelay: `${k * 1.3 + i * 0.5}s` }} />
            ))}
          </g>
        ))}

        {/* Arctic Circle sign, Santa Claus Village */}
        <g transform="translate(820 300)">
          <rect x="-3" y="0" width="6" height="74" fill="#3a2a25" />
          <rect x="-58" y="6" width="116" height="34" rx="3" fill={night ? "#173a63" : "#1d4d80"} stroke="#f3efe6" strokeWidth="2" />
          <text x="0" y="22" textAnchor="middle" fontSize="11" fill="#f3efe6" fontFamily="ui-monospace, monospace" letterSpacing="1">ARCTIC CIRCLE</text>
          <text x="0" y="35" textAnchor="middle" fontSize="11" fill="#ffd36e" fontFamily="ui-monospace, monospace">66°33′N</text>
        </g>
        <path d="M0 386 C 400 376, 1200 396, 1600 382" stroke={night ? "#ffd36e" : "#d1a24a"} strokeWidth="2" strokeDasharray="10 10" fill="none" opacity="0.6" />

        {/* reindeer walking along the snow */}
        <g className="lap-reindeer">
          <g transform="translate(0 368)">
            <g className="lap-trot">
              <path d="M0 -24 C 6 -32, 34 -32, 42 -24 L 50 -36 L 54 -34 L 48 -22 C 48 -18, 44 -16, 40 -18 L 40 0 L 36 0 L 35 -14 L 10 -14 L 8 0 L 4 0 L 4 -16 C -2 -18, -4 -22, 0 -24 Z" fill={night ? "#2a1d18" : "#5b3f30"} />
              <path d="M50 -36 L 46 -50 M 50 -36 L 58 -48 M 46 -44 L 40 -48 M 55 -44 L 62 -42" stroke={night ? "#2a1d18" : "#5b3f30"} strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </g>
          </g>
        </g>

        {/* near pines */}
        {[20, 150, 640, 980, 1420, 1560].map((x, i) => (
          <use key={x} href="#pine" x={x - 30} y={318 + (i % 2) * 14} width="60" height="124" />
        ))}
      </svg>
      <canvas ref={snow} className="pointer-events-none absolute inset-0" />
    </div>
  );
}
