"use client";
import { useEffect, useId, useRef, useState } from "react";
import { dublinVsRest } from "@/lib/propertyData";

// Full calendar years only. 2026 runs to October, so it stays out of the chart.
const data = dublinVsRest.filter((d) => d.year <= 2025);
const eur = (v: number) => "€" + v.toLocaleString("en-IE");
const k = (v: number) => "€" + Math.round(v / 1000) + "k";

const L = 48, R = 22, T = 16, B = 32;
const maxY = 520000;
const ticks = [0, 100000, 200000, 300000, 400000, 500000];

export default function DublinChart({ caption = true }: { caption?: boolean }) {
  const [sel, setSel] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // Draw at the real pixel width so the axis text stays readable on a phone.
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = W < 500 ? 260 : 340;
  const x = (i: number) => L + (i * (W - L - R)) / (data.length - 1);
  const y = (v: number) => T + (1 - v / maxY) * (H - T - B);
  const path = (key: "dublin" | "rest") => data.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  const every = W < 500 ? 5 : 3;
  const active = sel ?? data.length - 1;
  const d = data[active];

  function pick(clientX: number) {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const vx = ((clientX - box.left) / box.width) * W;
    const i = Math.round(((vx - L) / (W - L - R)) * (data.length - 1));
    setSel(Math.max(0, Math.min(data.length - 1, i)));
  }

  function onKey(e: React.KeyboardEvent) {
    const cur = sel ?? data.length - 1;
    let n = cur;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") n = cur - 1;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") n = cur + 1;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = data.length - 1;
    else return;
    e.preventDefault();
    setSel(Math.max(0, Math.min(data.length - 1, n)));
  }

  const tipLeft = (x(active) / W) * 100;

  return (
    <figure>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-2"><i aria-hidden="true" className="h-[3px] w-5 rounded bg-[rgb(var(--c1))]" />Dublin</span>
        <span className="inline-flex items-center gap-2"><i aria-hidden="true" className="h-[3px] w-5 rounded bg-[rgb(var(--c2))]" />Rest of Ireland</span>
        <span className="text-muted">Median sale price, 2010 to 2025</span>
      </div>

      <p className="mt-3 text-[15px] tabular-nums sm:hidden" aria-hidden="true">
        <b className="font-semibold">{d.year}</b>: Dublin {eur(d.dublin)}, rest {eur(d.rest)}, <b className="font-semibold">{d.ratio.toFixed(2)}×</b>
      </p>
      <div ref={wrapRef} className="relative mt-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-pan-y select-none outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          role="slider"
          tabIndex={0}
          aria-labelledby={titleId}
          aria-valuemin={data[0].year}
          aria-valuemax={data[data.length - 1].year}
          aria-valuenow={d.year}
          aria-valuetext={`${d.year}: Dublin ${eur(d.dublin)}, rest of Ireland ${eur(d.rest)}, Dublin ${d.ratio} times the rest`}
          onKeyDown={onKey}
          onPointerMove={(e) => pick(e.clientX)}
          onPointerDown={(e) => pick(e.clientX)}
          onPointerLeave={(e) => { if (e.pointerType === "mouse" && document.activeElement !== svgRef.current) setSel(null); }}
        >
          <title id={titleId}>Dublin against rest of Ireland median price by year. Use the arrow keys to move between years.</title>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="stroke-line" strokeWidth={1} />
              <text x={L - 8} y={y(t) + 4} textAnchor="end" className="fill-muted text-[11px]">{t === 0 ? "€0" : k(t)}</text>
            </g>
          ))}
          {data.map((p, i) => (i % every === 0 || i === data.length - 1) && (
            <text key={p.year} x={x(i)} y={H - 12} textAnchor="middle" className="fill-muted text-[11px]">{p.year}</text>
          ))}
          <line x1={x(active)} x2={x(active)} y1={T} y2={H - B} className="stroke-ink/30" strokeDasharray="3 3" />
          <path d={path("rest")} fill="none" stroke="rgb(var(--c2))" strokeWidth={2.5} strokeLinejoin="round" />
          <path d={path("dublin")} fill="none" stroke="rgb(var(--c1))" strokeWidth={2.5} strokeLinejoin="round" />
          <circle cx={x(active)} cy={y(d.dublin)} r={5} fill="rgb(var(--c1))" className="stroke-surface" strokeWidth={2} />
          <circle cx={x(active)} cy={y(d.rest)} r={5} fill="rgb(var(--c2))" className="stroke-surface" strokeWidth={2} />
          <rect x={L} y={T} width={W - L - R} height={H - T - B} fill="transparent" />
        </svg>

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute hidden w-44 rounded-xl border border-line bg-surface/95 p-3 text-[13px] shadow-[0_12px_30px_-18px_rgb(40_30_10/.35)] ${sel === null ? "" : "sm:block"}`}
          style={{ left: active > data.length / 2 ? `max(0px, calc(${tipLeft}% - 11rem - 14px))` : `min(calc(100% - 11rem), calc(${tipLeft}% + 14px))`, ...(active > data.length / 2 ? { bottom: 44 } : { top: 4 }) }}
        >
          <p className="font-semibold">{d.year}</p>
          <p className="mt-1 flex justify-between"><span className="text-muted">Dublin</span><span className="tabular-nums">{eur(d.dublin)}</span></p>
          <p className="flex justify-between"><span className="text-muted">Rest</span><span className="tabular-nums">{eur(d.rest)}</span></p>
          <p className="mt-1 border-t border-line pt-1">Dublin is <b className="font-semibold">{d.ratio.toFixed(2)}×</b> the rest</p>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{sel !== null ? `${d.year}: Dublin ${eur(d.dublin)}, rest of Ireland ${eur(d.rest)}, ratio ${d.ratio}` : ""}</p>

      {caption && (
        <figcaption className="mt-3 text-sm text-muted">
          Hover, tap or use the arrow keys to pick a year. Source: Property Price Register, full-market sales, VAT included.
        </figcaption>
      )}
      <details className="mt-3 text-sm">
        <summary className="inline-flex min-h-10 cursor-pointer items-center text-muted hover:text-ink">Show the numbers as a table</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[22rem] text-left tabular-nums">
            <caption className="sr-only">Median sale price by year, Dublin and rest of Ireland</caption>
            <thead className="text-muted"><tr><th className="py-1 pr-4 font-medium">Year</th><th className="py-1 pr-4 font-medium">Dublin</th><th className="py-1 pr-4 font-medium">Rest of Ireland</th><th className="py-1 font-medium">Ratio</th></tr></thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.year} className="border-t border-line"><td className="py-1 pr-4">{r.year}</td><td className="py-1 pr-4">{eur(r.dublin)}</td><td className="py-1 pr-4">{eur(r.rest)}</td><td className="py-1">{r.ratio.toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
