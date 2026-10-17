"use client";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import { useSettings } from "./Settings";

function Skyline() {
  // Simple invented city silhouette over the lake, with autumn trees in the park.
  const towers = [
    [0, 60], [22, 40], [40, 75], [58, 52], [80, 95], [100, 70], [118, 120], [134, 88], [150, 140], [168, 100],
    [186, 160], [204, 115], [222, 90], [240, 130], [258, 70], [276, 105], [296, 55], [316, 82], [336, 48], [356, 66], [380, 40],
  ];
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-56 w-full sm:h-72" aria-hidden="true">
      <defs>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a1a" stopOpacity="0" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b5f63" stopOpacity="0.7" />
          <stop offset="1" stopColor="#07090b" />
        </linearGradient>
      </defs>
      <rect width="400" height="180" fill="url(#dusk)" />
      {towers.map(([x, h]) => (
        <rect key={x} x={x} y={180 - h} width="18" height={h} fill="#151b20" />
      ))}
      <rect x="150" y="20" width="3" height="20" fill="#151b20" />
      {[30, 90, 210, 300, 360].map((x, i) => (
        <circle key={x} cx={x} cy={176} r={10 + (i % 2) * 4} fill={i % 2 ? "#b45309" : "#9a3412"} opacity="0.85" />
      ))}
      <rect y="180" width="400" height="40" fill="url(#lake)" />
      {[60, 140, 250, 330].map((x) => (
        <rect key={x} x={x} y={190 + (x % 3) * 6} width="30" height="1.5" fill="#5eead4" opacity="0.35" />
      ))}
    </svg>
  );
}

export default function Hero() {
  const { motion: m } = useSettings();
  return (
    <section id="start" tabIndex={-1} aria-labelledby="hero-name" className="carbon relative overflow-hidden outline-none">
      <div className="livery pointer-events-none absolute inset-0 opacity-90" aria-hidden="true" />
      <Skyline />
      <div className="relative mx-auto grid min-h-[calc(100svh-84px)] max-w-7xl items-center gap-10 px-4 pb-40 pt-12 sm:pb-48 lg:grid-cols-[1.2fr_1fr] lg:pr-[300px] xl:pr-4">
        <div>
          <p className="font-cond text-sm uppercase tracking-[0.35em] text-papaya">Round 1 · Albert Park, Melbourne</p>
          <motion.div
            initial={m ? { x: -60, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-6"
          >
            {/* Broadcast lower-third */}
            <div className="flex items-stretch">
              <div className="flex w-16 shrink-0 items-center justify-center bg-papaya font-display text-3xl font-black italic text-carbon-950 sm:w-20 sm:text-4xl">
                26
              </div>
              <div className="min-w-0 bg-chalk px-4 py-2 text-carbon-950 sm:px-6">
                <h1 id="hero-name" className="font-display text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl">
                  Madhu Sudhan <span className="block text-teal-deep sm:inline">Srinivas</span>
                </h1>
              </div>
            </div>
            <div className="flex">
              <div className="w-16 shrink-0 bg-teal-deep sm:w-20" />
              <p className="bg-carbon-800 px-4 py-1.5 font-cond text-sm uppercase tracking-[0.2em] text-chalk sm:px-6">
                Data &amp; analytics · Dublin, Ireland
              </p>
            </div>
          </motion.div>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-chalk/90">{profile.positioning}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#telemetry" className="skew bg-papaya px-6 py-3 font-display font-bold uppercase tracking-wider text-carbon-950 hover:bg-papaya-soft">
              <span className="unskew inline-block">See the projects</span>
            </a>
            <a href="#finish" className="skew border-2 border-chalk px-6 py-3 font-display font-bold uppercase tracking-wider hover:border-papaya hover:text-papaya">
              <span className="unskew inline-block">Get in touch</span>
            </a>
          </div>
        </div>

        {/* Driver card */}
        <motion.aside
          aria-label="Driver card"
          initial={m ? { y: 30, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-carbon-900/90 shadow-2xl"
        >
          <div className="h-2 bg-gradient-to-r from-papaya via-teal to-chalk" />
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-cond text-xs uppercase tracking-[0.3em] text-mute">Driver</p>
                <p className="font-display text-2xl font-bold uppercase">Madhu</p>
              </div>
              <p className="font-display text-6xl font-black italic leading-none text-papaya" aria-label="Car number 26">26</p>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-cond uppercase tracking-widest text-mute">Team</dt>
                <dd className="font-semibold">DCU · MSc BA</dd>
              </div>
              <div>
                <dt className="font-cond uppercase tracking-widest text-mute">Base</dt>
                <dd className="font-semibold">Dublin 9</dd>
              </div>
              <div>
                <dt className="font-cond uppercase tracking-widest text-mute">Previous series</dt>
                <dd className="font-semibold">Travel ops</dd>
              </div>
              <div>
                <dt className="font-cond uppercase tracking-widest text-mute">Target</dt>
                <dd className="font-semibold">Data roles, Ireland</dd>
              </div>
            </dl>
            <div className="kerb-thin mt-6" aria-hidden="true" />
          </div>
        </motion.aside>
      </div>
      <div className="kerb relative" aria-hidden="true" />
    </section>
  );
}
