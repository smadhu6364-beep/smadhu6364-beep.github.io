"use client";
import { useEffect, useRef, useState } from "react";
import { counties, dublinVsRest, newVsSecond, overview } from "@/lib/propertyData";

// Light, theme-aware charts drawn from the CSVs in irish-property-sql/results.
// They are measured to their real width so the text stays readable on a phone.

const k = (v: number) => "€" + Math.round(v / 1000) + "k";

function useWidth(initial = 560) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function Legend({ items }: { items: { label: string; color: string; bar?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]" aria-hidden="true">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-2">
          <i className={i.bar ? "h-3 w-3 rounded-sm" : "h-[3px] w-5 rounded"} style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

/** National median (line) with the number of sales (bars), 2010 to 2025 */
export function MedianSalesChart() {
  const [ref, W] = useWidth();
  const data = overview.filter((d) => d.year <= 2025);
  const H = W < 480 ? 230 : 280, L = 44, R = 44, T = 12, B = 28;
  const step = (W - L - R) / data.length;
  const x = (i: number) => L + step * (i + 0.5);
  const yP = (v: number) => T + (1 - v / 400000) * (H - T - B);
  const yS = (v: number) => T + (1 - v / 60000) * (H - T - B);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${yP(d.median)}`).join(" ");
  const every = W < 480 ? 5 : 3;
  return (
    <div ref={ref}>
      <Legend items={[{ label: "Median price (left axis)", color: "rgb(var(--c1))" }, { label: "Sales (right axis)", color: "rgb(var(--c2) / .3)", bar: true }]} />
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 block h-auto w-full" role="img" aria-label="National median price rose from €148,000 in 2013 to €380,000 in 2025. Sales rose from 17,313 in 2011 to 58,688 in 2025.">
        {[0, 100000, 200000, 300000, 400000].map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={yP(t)} y2={yP(t)} className="stroke-line" />
            <text x={L - 6} y={yP(t) + 4} textAnchor="end" className="fill-muted text-[11px]">{t ? k(t) : "€0"}</text>
            <text x={W - R + 6} y={yP(t) + 4} className="fill-muted text-[11px]">{((t / 400000) * 60).toFixed(0)}k</text>
          </g>
        ))}
        {data.map((d, i) => (
          <rect key={d.year} x={x(i) - step * 0.32} width={step * 0.64} y={yS(d.sales)} height={H - B - yS(d.sales)} fill="rgb(var(--c2) / .28)" rx={2} />
        ))}
        <path d={line} fill="none" stroke="rgb(var(--c1))" strokeWidth={2.5} strokeLinejoin="round" />
        {data.map((d, i) => (i % every === 0 || i === data.length - 1) && (
          <text key={d.year} x={x(i)} y={H - 9} textAnchor="middle" className="fill-muted text-[11px]">{d.year}</text>
        ))}
      </svg>
    </div>
  );
}

/** New homes (VAT added back where needed) against second-hand, 2010 to 2025 */
export function NewVsSecondChart() {
  const [ref, W] = useWidth();
  const data = newVsSecond.filter((d) => d.year <= 2025);
  const H = W < 480 ? 230 : 280, L = 44, R = 12, T = 12, B = 28;
  const x = (i: number) => L + (i * (W - L - R)) / (data.length - 1);
  const y = (v: number) => T + (1 - v / 480000) * (H - T - B);
  const p = (key: "newIncVat" | "second") => data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d[key])}`).join(" ");
  const every = W < 480 ? 5 : 3;
  return (
    <div ref={ref}>
      <Legend items={[{ label: "New homes, VAT included", color: "rgb(var(--c1))" }, { label: "Second-hand homes", color: "rgb(var(--c2))" }]} />
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 block h-auto w-full" role="img" aria-label="New and second-hand homes were within 10% of each other in price until 2014. From 2016 to 2020 new homes cost 50 to 56% more. By 2025 the premium was 27.5%.">
        {[0, 100000, 200000, 300000, 400000].map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="stroke-line" />
            <text x={L - 6} y={y(t) + 4} textAnchor="end" className="fill-muted text-[11px]">{t ? k(t) : "€0"}</text>
          </g>
        ))}
        <path d={p("second")} fill="none" stroke="rgb(var(--c2))" strokeWidth={2.5} strokeLinejoin="round" />
        <path d={p("newIncVat")} fill="none" stroke="rgb(var(--c1))" strokeWidth={2.5} strokeLinejoin="round" />
        {data.map((d, i) => (i % every === 0 || i === data.length - 1) && (
          <text key={d.year} x={x(i)} y={H - 9} textAnchor="middle" className="fill-muted text-[11px]">{d.year}</text>
        ))}
      </svg>
    </div>
  );
}

/** Median price by county in 2025, as plain HTML bars so it reflows on a phone */
export function CountyBars({ limit, compact }: { limit?: number; compact?: boolean }) {
  const rows = limit ? counties.slice(0, limit) : counties;
  const max = counties[0].median;
  return (
    <ol className={compact ? "space-y-1 text-[9px]" : "space-y-1.5 text-[13px]"} aria-label="Median sale price by county, 2025">
      {rows.map((c) => (
        <li key={c.county} className={`grid items-center gap-2 ${compact ? "grid-cols-[3.2rem_1fr]" : "grid-cols-[5.5rem_1fr_4.5rem]"}`}>
          <span className="truncate">{c.county}</span>
          <span className={compact ? "h-2 rounded-sm" : "h-3 rounded-sm"} style={{ width: `${(c.median / max) * 100}%`, background: c.county === "Dublin" ? "rgb(var(--c1))" : "rgb(var(--c2) / .55)" }} />
          {!compact && <span className="text-right tabular-nums text-ink/80">€{c.median.toLocaleString("en-IE")}</span>}
        </li>
      ))}
    </ol>
  );
}

/** A small, static version of the Dublin chart for the project tile */
export function MiniDublin() {
  const data = dublinVsRest.filter((d) => d.year <= 2025);
  const W = 400, H = 250, L = 24, R = 175, T = 52, B = 30;
  const x = (i: number) => L + (i * (W - L - R)) / (data.length - 1);
  const y = (v: number) => T + (1 - v / 520000) * (H - T - B);
  const p = (key: "dublin" | "rest") => data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ");
  const last = data[data.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full bg-surface" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <text x={L} y={24} className="fill-ink text-[13px] font-semibold">Median sale price</text>
      <text x={L} y={40} className="fill-muted text-[11px]">Dublin against the rest, 2010 to 2025</text>
      {[100000, 200000, 300000, 400000, 500000].map((t) => <line key={t} x1={L} x2={W - R + 8} y1={y(t)} y2={y(t)} className="stroke-line" />)}
      <path d={p("rest")} fill="none" stroke="rgb(var(--c2))" strokeWidth={3} strokeLinejoin="round" />
      <path d={p("dublin")} fill="none" stroke="rgb(var(--c1))" strokeWidth={3} strokeLinejoin="round" />
      <text x={W - R + 6} y={y(last.dublin) + 4} className="text-[12px] font-semibold" fill="rgb(var(--c1))">Dublin</text>
      <text x={W - R + 6} y={y(last.rest) + 4} className="text-[12px] font-semibold" fill="rgb(var(--c2))">Rest</text>
      <text x={L} y={H - 10} className="fill-muted text-[11px]">2010</text>
      <text x={W - R} y={H - 10} textAnchor="middle" className="fill-muted text-[11px]">2025</text>
    </svg>
  );
}
