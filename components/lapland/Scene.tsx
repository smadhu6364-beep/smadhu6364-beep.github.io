"use client";

import { useEffect, useRef } from "react";

/*
  Lapland backdrop, drawn in code with canvas:
  - sky with stars, the Milky Way and (at night) soft northern lights with rays
  - fractal fells, spruce forest, snow lit by the aurora
  - small red cabins with warm windows and chimney smoke, the Arctic Circle
    sign from Santa Claus Village, and a reindeer crossing the snow
  - falling snow in front
  `night` switches polar night / blue hour, `lively` pauses all motion.
  The landscape is seeded, so it looks the same on every visit.
*/

type Star = { x: number; y: number; r: number; p: number; c: string };
type Flake = { x: number; y: number; r: number; v: number; w: number };
type Puff = { x: number; y: number; r: number; a: number };

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// midpoint displacement: a natural looking ridge line, values in -1..1
function ridge(rand: () => number, k: number, rough: number) {
  const n = (1 << k) + 1;
  const p = new Float32Array(n);
  p[0] = rand() * 2 - 1;
  p[n - 1] = rand() * 2 - 1;
  let scale = 1;
  for (let size = n - 1; size > 1; size >>= 1, scale *= rough) {
    for (let i = size >> 1; i < n; i += size) p[i] = (p[i - (size >> 1)] + p[i + (size >> 1)]) / 2 + (rand() * 2 - 1) * scale;
  }
  return p;
}

const sample = (p: Float32Array, f: number) => {
  const i = Math.max(0, Math.min(p.length - 1.001, f * (p.length - 1)));
  const a = Math.floor(i);
  return p[a] + (p[a + 1] - p[a]) * (i - a);
};

function spruce(c: CanvasRenderingContext2D, rand: () => number, x: number, y: number, h: number, fill: string, snow: string | null) {
  const w = h * (0.17 + rand() * 0.07);
  const tiers = Math.max(5, Math.round(h / 5));
  const right: [number, number][] = [];
  const left: [number, number][] = [];
  for (let i = 1; i <= tiers; i++) {
    const f = i / tiers;
    const yy = y - h + f * h * 0.94;
    const ww = w * Math.pow(f, 0.9) * (0.75 + rand() * 0.5);
    right.push([x + ww, yy], [x + ww * 0.3, yy - h * 0.025]);
    const wl = w * Math.pow(f, 0.9) * (0.75 + rand() * 0.5);
    left.push([x - wl, yy], [x - wl * 0.3, yy - h * 0.025]);
  }
  c.fillStyle = fill;
  c.beginPath();
  c.moveTo(x, y - h - h * 0.04);
  for (const [px, py] of right) c.lineTo(px, py);
  c.lineTo(x + w * 0.08, y);
  c.lineTo(x - w * 0.08, y);
  for (let i = left.length - 1; i >= 0; i--) c.lineTo(left[i][0], left[i][1]);
  c.closePath();
  c.fill();
  if (snow && h > 14) {
    c.strokeStyle = snow;
    c.lineWidth = Math.max(1, h / 60);
    c.beginPath();
    for (let i = 2; i < right.length; i += 4) {
      const [px, py] = right[i];
      c.moveTo(x + (px - x) * 0.25, py - h * 0.01);
      c.lineTo(px - 1, py - h * 0.004);
    }
    c.stroke();
  }
}

// Vertical light strip used for every aurora ray (bright lower edge, fading up)
function strip(colors: [number, string][]) {
  const s = document.createElement("canvas");
  s.width = 1;
  s.height = 256;
  const c = s.getContext("2d")!;
  const g = c.createLinearGradient(0, 0, 0, 256);
  for (const [o, col] of colors) g.addColorStop(o, col);
  c.fillStyle = g;
  c.fillRect(0, 0, 1, 256);
  return s;
}

// Path2D only exists in the browser, so build it inside the effect
const REINDEER_D = "M0 -24 C 6 -32, 34 -32, 42 -24 L 50 -36 L 54 -34 L 48 -22 C 48 -18, 44 -16, 40 -18 L 40 0 L 37 0 L 35 -14 L 10 -14 L 8 0 L 5 0 L 4 -16 C -2 -18, -4 -22, 0 -24 Z M50 -36 L 45 -50 L 47 -50 L 51 -39 L 58 -49 L 60 -48 L 52 -36 Z";

export default function Scene({ night, lively }: { night: boolean; lively: boolean }) {
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);
  const state = useRef({ night, lively });
  state.current = { night, lively };

  useEffect(() => {
    const A = back.current!, B = front.current!;
    const ca = A.getContext("2d")!, cb = B.getContext("2d")!;
    const REINDEER = new Path2D(REINDEER_D);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const land = document.createElement("canvas");
    const cl = land.getContext("2d")!;
    const aur = document.createElement("canvas");
    const cu = aur.getContext("2d")!;
    const greens = strip([[0, "rgba(160,90,255,0)"], [0.35, "rgba(170,90,230,0.35)"], [0.75, "rgba(60,240,160,0.75)"], [0.93, "rgba(170,255,210,1)"], [1, "rgba(80,255,170,0)"]]);
    const pale = strip([[0, "rgba(120,200,255,0)"], [0.6, "rgba(90,255,190,0.5)"], [0.95, "rgba(200,255,230,0.9)"], [1, "rgba(0,0,0,0)"]]);

    const skyStatic = document.createElement("canvas");
    const cs = skyStatic.getContext("2d")!;
    let W = 0, H = 0, dpr = 1, builtFor = "";
    let quality = 2; // 2 full, 1 lighter, 0 still
    let stars: Star[] = [];
    let flakes: Flake[] = [];
    let puffs: Puff[] = [];
    let near = new Float32Array(2), farR = new Float32Array(2), midR = new Float32Array(2);
    let cabins: { x: number; y: number; s: number }[] = [];
    let deerX = -0.1;

    const groundY = (x: number) => H * 0.8 + sample(near, x / W) * H * 0.03;

    const build = (isNight: boolean) => {
      const rand = rng(66);
      farR = ridge(rand, 9, 0.55);
      midR = ridge(rand, 9, 0.5);
      near = ridge(rand, 7, 0.4);
      land.width = W * dpr;
      land.height = H * dpr;
      cl.setTransform(dpr, 0, 0, dpr, 0, 0);
      cl.clearRect(0, 0, W, H);

      const layer = (p: Float32Array, base: number, amp: number, top: string, bottom: string) => {
        let minY = H;
        cl.beginPath();
        cl.moveTo(0, H);
        for (let x = 0; x <= W; x += 3) {
          const y = H * base + sample(p, x / W) * H * amp;
          minY = Math.min(minY, y);
          cl.lineTo(x, y);
        }
        cl.lineTo(W, H);
        cl.closePath();
        const g = cl.createLinearGradient(0, minY, 0, H * (base + amp));
        g.addColorStop(0, top);
        g.addColorStop(1, bottom);
        cl.fillStyle = g;
        cl.fill();
      };

      // far fells: moonlit snow tops fading into blue haze
      layer(farR, 0.6, 0.09, isNight ? "#6f86a8" : "#e7e1ec", isNight ? "#1d2f4a" : "#a9b6d0");
      // mid ridge and its forest line
      layer(midR, 0.69, 0.04, isNight ? "#2b3f5c" : "#b8c3d9", isNight ? "#142238" : "#8f9fbc");
      const tr = rng(7);
      for (let x = -10; x < W + 10; x += 2 + tr() * 5) {
        const y = H * 0.69 + sample(midR, x / W) * H * 0.04 + 4;
        if (tr() < 0.75) spruce(cl, tr, x, y, H * (0.018 + tr() * 0.022), isNight ? "#0b1626" : "#5d6d86", null);
      }
      // near snowfield
      let minY = H;
      cl.beginPath();
      cl.moveTo(0, H);
      for (let x = 0; x <= W; x += 3) { const y = groundY(x); minY = Math.min(minY, y); cl.lineTo(x, y); }
      cl.lineTo(W, H);
      cl.closePath();
      const sg = cl.createLinearGradient(0, minY, 0, H);
      sg.addColorStop(0, isNight ? "#a9bad3" : "#fbf6f3");
      sg.addColorStop(0.45, isNight ? "#7f93b3" : "#e6dfe8");
      sg.addColorStop(1, isNight ? "#53678a" : "#c9c7da");
      cl.fillStyle = sg;
      cl.fill();
      // soft wind-blown shadows in the snow
      cl.globalAlpha = isNight ? 0.18 : 0.12;
      cl.fillStyle = isNight ? "#2c3d5e" : "#9aa3c4";
      for (let i = 0; i < 7; i++) {
        const y = minY + (H - minY) * (0.25 + i * 0.1);
        cl.beginPath();
        cl.ellipse(W * tr(), y, W * (0.15 + tr() * 0.2), (H - minY) * 0.025, 0, 0, Math.PI * 2);
        cl.fill();
      }
      cl.globalAlpha = 1;
      // dense forest on both flanks, thinning towards the middle
      const fr = rng(21);
      for (let x = -20; x < W + 20; x += 3 + fr() * 6) {
        const edge = Math.abs(x / W - 0.5) * 2; // 0 middle, 1 edges
        if (fr() > edge * edge * 1.1 + 0.04) continue;
        const y = groundY(x) + fr() * H * 0.05;
        spruce(cl, fr, x, y, H * (0.05 + fr() * 0.09) * (0.6 + edge * 0.6), isNight ? "#050b12" : "#2a3a3f", isNight ? "rgba(220,232,250,0.55)" : "rgba(255,255,255,0.8)");
      }

      cabins = [{ x: 0.3, y: 0, s: 1 }, { x: 0.37, y: 0, s: 0.8 }, { x: 0.71, y: 0, s: 0.9 }].map((c) => ({ ...c, y: groundY(c.x * W) + H * 0.012 }));

      // cabins
      for (const c of cabins) {
        const x = c.x * W, y = c.y, s = (H / 900) * c.s;
        cl.save();
        cl.translate(x, y);
        cl.scale(s, s);
        cl.fillStyle = isNight ? "#5a1b17" : "#9a2f28";
        cl.fillRect(-40, -38, 80, 38);
        cl.fillStyle = "rgba(0,0,0,.25)";
        for (let k = -32; k < 0; k += 7) cl.fillRect(-40, k, 80, 1.5);
        cl.fillStyle = isNight ? "#dfe8f6" : "#ffffff";
        cl.beginPath();
        cl.moveTo(-48, -36); cl.lineTo(0, -66); cl.lineTo(48, -36); cl.lineTo(44, -32); cl.lineTo(-44, -32); cl.closePath();
        cl.fill();
        cl.fillStyle = "#2b1d19";
        cl.fillRect(22, -70, 8, 18);
        cl.fillRect(-5, -24, 12, 24);
        cl.restore();
      }

      // Arctic Circle sign
      const sx = W * 0.53, sy = groundY(W * 0.53) + H * 0.006, ss = H / 900;
      cl.save();
      cl.translate(sx, sy);
      cl.scale(ss, ss);
      cl.fillStyle = "#2b1d19";
      cl.fillRect(-2.5, -58, 5, 58);
      cl.fillStyle = "#1c4a7c";
      cl.fillRect(-52, -64, 104, 30);
      cl.strokeStyle = "#e9eef6";
      cl.lineWidth = 1.5;
      cl.strokeRect(-52, -64, 104, 30);
      cl.fillStyle = "#e9eef6";
      cl.font = "600 10px ui-monospace, monospace";
      cl.textAlign = "center";
      cl.fillText("ARCTIC CIRCLE", 0, -51);
      cl.fillStyle = "#ffd36e";
      cl.fillText("66°33′N", 0, -39);
      cl.restore();
      // sky drawn once per size/mode; only a few stars twinkle live
      skyStatic.width = W;
      skyStatic.height = H;
      const g = cs.createLinearGradient(0, 0, 0, H * 0.8);
      if (isNight) { g.addColorStop(0, "#02040c"); g.addColorStop(0.5, "#071428"); g.addColorStop(1, "#16304f"); }
      else { g.addColorStop(0, "#6f8fbf"); g.addColorStop(0.55, "#b9aecb"); g.addColorStop(1, "#f3cdbd"); }
      cs.fillStyle = g;
      cs.fillRect(0, 0, W, H);
      if (isNight) {
        cs.save();
        cs.translate(W / 2, H * 0.25);
        cs.rotate(Math.atan2(H * 0.4, W));
        const mw = cs.createLinearGradient(0, -H * 0.09, 0, H * 0.09);
        mw.addColorStop(0, "rgba(160,180,255,0)");
        mw.addColorStop(0.5, "rgba(170,185,240,0.07)");
        mw.addColorStop(1, "rgba(160,180,255,0)");
        cs.fillStyle = mw;
        cs.fillRect(-W, -H * 0.09, W * 2, H * 0.18);
        cs.restore();
        for (const st of stars) { cs.globalAlpha = 0.55; cs.fillStyle = st.c; cs.fillRect(st.x, st.y, st.r, st.r); }
        cs.globalAlpha = 1;
        const mg = cs.createRadialGradient(W * 0.86, H * 0.12, 0, W * 0.86, H * 0.12, H * 0.22);
        mg.addColorStop(0, "rgba(235,240,255,0.9)");
        mg.addColorStop(0.04, "rgba(235,240,255,0.5)");
        mg.addColorStop(0.08, "rgba(200,215,255,0.12)");
        mg.addColorStop(1, "rgba(200,215,255,0)");
        cs.fillStyle = mg;
        cs.fillRect(0, 0, W, H * 0.5);
      } else {
        const sg2 = cs.createRadialGradient(W * 0.78, H * 0.6, 0, W * 0.78, H * 0.6, H * 0.45);
        sg2.addColorStop(0, "rgba(255,226,190,0.95)");
        sg2.addColorStop(0.12, "rgba(255,205,175,0.55)");
        sg2.addColorStop(1, "rgba(255,200,170,0)");
        cs.fillStyle = sg2;
        cs.fillRect(0, 0, W, H);
      }
      builtFor = `${W}x${H}:${isNight}`;
    };

    const resize = () => {
      dpr = 1; // soft scene, so 1x is plenty and far cheaper on retina screens
      W = window.innerWidth;
      H = window.innerHeight;
      for (const c of [A, B]) {
        c.width = W * dpr;
        c.height = H * dpr;
        c.style.width = W + "px";
        c.style.height = H + "px";
      }
      ca.setTransform(dpr, 0, 0, dpr, 0, 0);
      cb.setTransform(dpr, 0, 0, dpr, 0, 0);
      const div = quality < 2 ? 8 : 5;
      aur.width = Math.ceil(W / div);
      aur.height = Math.ceil(H / div);
      const sr = rng(3);
      stars = Array.from({ length: Math.round((W * H) / 4500) }, () => {
        // a third of them crowd into a diagonal band: the Milky Way
        let x = sr() * W, y = sr() * H * 0.72;
        if (sr() < 0.35) { const t = sr(); x = t * W; y = H * (0.05 + t * 0.4) + (sr() - 0.5) * H * 0.12; }
        const warm = sr();
        return { x, y, r: sr() < 0.04 ? 1.4 : sr() * 0.9 + 0.2, p: sr() * 6, c: warm < 0.1 ? "#ffe6c4" : warm < 0.2 ? "#cfe0ff" : "#f2f6ff" };
      });
      flakes = Array.from({ length: Math.round(W / 14) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + 0.4, v: Math.random() * 0.5 + 0.25, w: Math.random() * 6 }));
      builtFor = "";
    };
    resize();
    window.addEventListener("resize", resize);

    // aurora: rays along a slowly folding curtain, drawn small then scaled up (soft, like long exposure)
    const curtain = (t: number, base: number, amp: number, len: number, speed: number, alpha: number, img: HTMLCanvasElement) => {
      const w = aur.width, h = aur.height;
      for (let x = -4; x < w + 4; x += 2) {
        const k = x / w;
        const y = h * base + Math.sin(k * 4.2 + t * speed) * h * amp + Math.sin(k * 11 - t * speed * 1.6) * h * amp * 0.4;
        const rays = 0.5 + 0.5 * Math.sin(k * 90 + t * 0.6) * Math.sin(k * 37 - t * 0.4);
        const L = h * len * (0.7 + 0.5 * Math.sin(k * 6 + t * speed * 0.7)) * (0.75 + rays * 0.5);
        cu.globalAlpha = 0.6 * alpha * (0.35 + 0.65 * Math.max(0, Math.sin(k * 3.1 - t * speed * 0.9) * 0.5 + 0.5)) * (0.6 + rays * 0.4);
        cu.drawImage(img, x - 1, y - L, 4.5, L + 2); // overlapping strips, so no visible banding
      }
    };

    let raf = 0, t = 0, last = performance.now();
    // Self-tuning: if drawing a frame costs too much on this machine, step down
    // (coarser aurora, then a still picture redrawn once a second).
    let lastDraw = 0, cost = 0, gap = 32;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden || now - lastDraw < gap) return; // ~30fps is plenty for drifting light
      lastDraw = now;
      const t0 = performance.now();
      const { night, lively } = state.current;
      const moving = lively && !reduced;
      const dt = Math.min(0.05, (now - last) / 1000);
      if (moving) t += dt;
      last = now;
      if (builtFor !== `${W}x${H}:${night}`) build(night);

      ca.drawImage(skyStatic, 0, 0);

      let glow = 0;
      if (night) {
        for (let i = 0; i < stars.length; i += 12) {
          const st = stars[i];
          ca.globalAlpha = 0.6 * Math.abs(Math.sin(st.p + t * 0.7));
          ca.fillStyle = st.c;
          ca.fillRect(st.x, st.y, st.r + 0.4, st.r + 0.4);
        }
        ca.globalAlpha = 1;
        cu.clearRect(0, 0, aur.width, aur.height);
        cu.globalCompositeOperation = "lighter";
        curtain(t, 0.42, 0.07, 0.34, 0.12, 0.55, greens);
        curtain(t + 30, 0.3, 0.06, 0.26, 0.09, 0.35, greens);
        curtain(t + 70, 0.5, 0.04, 0.18, 0.16, 0.3, pale);
        cu.globalCompositeOperation = "source-over";
        cu.globalAlpha = 1;
        ca.save();
        ca.globalCompositeOperation = "screen";
        ca.imageSmoothingQuality = "high";
        ca.drawImage(aur, 0, 0, W, H);
        ca.restore();
        glow = 0.7 + 0.3 * Math.sin(t * 0.3);
      }

      ca.drawImage(land, 0, 0, W, H);

      if (night) {
        // the aurora lights the snow a little green
        ca.save();
        ca.globalCompositeOperation = "soft-light";
        const rg = ca.createLinearGradient(0, H * 0.72, 0, H);
        rg.addColorStop(0, `rgba(80,255,170,${0.35 * glow})`);
        rg.addColorStop(1, "rgba(80,255,170,0)");
        ca.fillStyle = rg;
        ca.fillRect(0, H * 0.72, W, H * 0.28);
        ca.restore();
      }

      // cabin windows and smoke
      for (const c of cabins) {
        const x = c.x * W, y = c.y, s = (H / 900) * c.s;
        const flick = 0.85 + 0.15 * Math.sin(t * 7 + c.x * 50) * Math.sin(t * 3.3);
        const wg = ca.createRadialGradient(x, y - 18 * s, 0, x, y - 18 * s, 90 * s);
        wg.addColorStop(0, `rgba(255,190,90,${(night ? 0.45 : 0.15) * flick})`);
        wg.addColorStop(1, "rgba(255,190,90,0)");
        ca.fillStyle = wg;
        ca.fillRect(x - 90 * s, y - 108 * s, 180 * s, 180 * s);
        ca.fillStyle = `rgba(255,${night ? 205 : 225},${night ? 110 : 160},${flick})`;
        ca.fillRect(x - 30 * s, y - 26 * s, 12 * s, 10 * s);
        ca.fillRect(x + 16 * s, y - 26 * s, 12 * s, 10 * s);
        if (moving && Math.random() < 0.06) puffs.push({ x: x + 26 * s, y: y - 70 * s, r: 3 * s, a: 0.5 });
      }
      for (const p of puffs) {
        if (moving) { p.y -= 0.35; p.x += 0.18; p.r += 0.05; p.a -= 0.0035; }
        ca.fillStyle = night ? `rgba(190,200,220,${Math.max(0, p.a) * 0.6})` : `rgba(255,255,255,${Math.max(0, p.a) * 0.8})`;
        ca.beginPath();
        ca.arc(p.x, p.y, p.r, 0, 6.283);
        ca.fill();
      }
      puffs = puffs.filter((p) => p.a > 0);

      // reindeer crossing the snowfield, slowly
      if (moving) deerX += dt / 90;
      if (deerX > 1.1) deerX = -0.1;
      const dx = deerX * W, s = H / 1100;
      ca.save();
      ca.translate(dx, groundY(dx) + H * 0.035 + (moving ? Math.sin(t * 9) * 0.6 : 0));
      ca.scale(s, s);
      ca.fillStyle = night ? "#120c0a" : "#4a3427";
      ca.fill(REINDEER);
      ca.restore();

      // snow in front of everything
      cb.clearRect(0, 0, W, H);
      cb.fillStyle = night ? "rgba(235,242,255,0.8)" : "rgba(255,255,255,0.9)";
      for (const f of flakes) {
        if (moving) {
          f.y += f.v;
          f.x += Math.sin(t * 0.8 + f.w) * 0.3;
          if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; }
        }
        cb.beginPath();
        cb.arc(f.x, f.y, f.r, 0, 6.283);
        cb.fill();
      }
      cost = cost * 0.9 + (performance.now() - t0) * 0.1;
      (window as unknown as { __lap?: object }).__lap = { cost: Math.round(cost * 10) / 10, quality }; // handy for checking speed in devtools
      if (cost > 12 && quality > 0) {
        quality -= 1;
        cost = 0;
        if (quality === 1) { aur.width = Math.ceil(W / 8); aur.height = Math.ceil(H / 8); flakes = flakes.slice(0, flakes.length >> 1); }
        if (quality === 0) gap = 1000;
      }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden">
      <canvas ref={back} className="absolute inset-0" />
      <canvas ref={front} className="pointer-events-none absolute inset-0" />
    </div>
  );
}
