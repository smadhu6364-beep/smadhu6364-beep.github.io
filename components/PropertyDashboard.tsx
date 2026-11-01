"use client";

import { useMemo, useState } from "react";
import data from "@/lib/dashboardData.json";

// Interactive dashboard over the Irish property SQL results (09_county_year,
// 02_overview, 06_seasonality, 05_new_vs_second_hand). Every number comes
// straight from those result tables; nothing is recomputed in the browser
// except sums over the chosen year range.

type Row = [string, number, number, number, number | null, number]; // county, year, sales, median, yoy, rank
const ROWS = data.countyYear as Row[];
const NATIONAL = data.national as [number, number, number][]; // year, sales, median
const COUNTIES = Array.from(new Set(ROWS.map((r) => r[0]))).sort();
const YEARS = NATIONAL.map((n) => n[0]);
const LAST_FULL = 2025; // 2026 only runs to October

const eur = (v: number) => "€" + Math.round(v).toLocaleString("en-IE");
const short = (v: number) => (v >= 1e6 ? `€${(v / 1e6).toFixed(2)}m` : `€${Math.round(v / 1000)}k`);

function Kpi({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="label">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums sm:text-3xl">{value}</p>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
    </div>
  );
}

function TrendChart({ series, from, to }: { series: { name: string; color: string; points: [number, number][] }[]; from: number; to: number }) {
  const W = 640, H = 280, P = { l: 66, r: 14, t: 14, b: 34 };
  const all = series.flatMap((s) => s.points.map((p) => p[1]));
  // round axis steps (€50k, €100k, ...) so the gridlines read cleanly
  const top = Math.max(...all);
  const step = [25e3, 50e3, 100e3, 200e3].find((s) => top / s <= 5) ?? 250e3;
  const max = Math.ceil((top * 1.04) / step) * step, min = 0;
  const x = (y: number) => P.l + ((y - from) / Math.max(1, to - from)) * (W - P.l - P.r);
  const y = (v: number) => H - P.b - ((v - min) / (max - min)) * (H - P.t - P.b);
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Median sale price by year">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="rgb(var(--line))" />
          <text x={P.l - 8} y={y(t) + 4} textAnchor="end" fontSize="15" fill="rgb(var(--muted))">{short(t)}</text>
        </g>
      ))}
      {YEARS.filter((yr) => yr >= from && yr <= to && (to - from < 9 || yr % 2 === 0)).map((yr) => (
        <text key={yr} x={x(yr)} y={H - 8} textAnchor="middle" fontSize="15" fill="rgb(var(--muted))">{yr}</text>
      ))}
      {series.map((s) => (
        <g key={s.name}>
          <polyline fill="none" stroke={s.color} strokeWidth="2.5" points={s.points.map(([a, b]) => `${x(a)},${y(b)}`).join(" ")} />
          {s.points.map(([a, b]) => (
            <circle key={a} cx={x(a)} cy={y(b)} r="3.5" fill={s.color}>
              <title>{`${s.name}, ${a}: ${eur(b)}${a === 2026 ? " (Jan to Oct)" : ""}`}</title>
            </circle>
          ))}
        </g>
      ))}
    </svg>
  );
}

// Small column chart: fixed-height plot area so bar heights in % have something to measure against.
function Bars({ items, max }: { items: { key: string; label: string; value: number; title: string; hot?: boolean }[]; max: number }) {
  return (
    <div className="mt-4">
      <div className="flex h-28 items-end gap-1">
        {items.map((it) => (
          <div key={it.key} className="flex h-full min-w-0 flex-1 items-end" title={it.title}>
            <span className="block w-full rounded-t" style={{ height: `${Math.max(3, (it.value / max) * 100)}%`, background: it.hot ? "rgb(var(--c1))" : "rgb(var(--c2) / .65)" }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1">
        {items.map((it) => (
          <span key={it.key} className="min-w-0 flex-1 truncate text-center text-[10px] text-muted">{it.label}</span>
        ))}
      </div>
    </div>
  );
}

export default function PropertyDashboard() {
  const [county, setCounty] = useState("All of Ireland");
  const [from, setFrom] = useState(2015);
  const [to, setTo] = useState(LAST_FULL);
  const isAll = county === "All of Ireland";

  const view = useMemo(() => {
    const inRange = (yr: number) => yr >= from && yr <= to;
    const mine = isAll
      ? NATIONAL.filter((n) => inRange(n[0])).map((n) => ({ year: n[0], sales: n[1], median: n[2], rank: null as number | null }))
      : ROWS.filter((r) => r[0] === county && inRange(r[1])).map((r) => ({ year: r[1], sales: r[2], median: r[3], rank: r[5] }));
    const first = mine[0], last = mine[mine.length - 1];
    const ranking = ROWS.filter((r) => r[1] === to).sort((a, b) => b[3] - a[3]);
    return {
      mine,
      sales: mine.reduce((s, r) => s + r.sales, 0),
      first,
      last,
      change: first && last ? (100 * (last.median / first.median - 1)) : 0,
      ranking,
      maxMedian: ranking[0]?.[3] ?? 1,
    };
  }, [county, from, to, isAll]);

  const series = [
    { name: "All of Ireland", color: "rgb(var(--c2))", points: NATIONAL.filter((n) => n[0] >= from && n[0] <= to).map((n) => [n[0], n[2]] as [number, number]) },
    ...(isAll ? [] : [{ name: county, color: "rgb(var(--c1))", points: view.mine.map((r) => [r.year, r.median] as [number, number]) }]),
  ];
  const select = "min-h-10 rounded-full border border-line bg-surface px-4 text-sm text-ink";

  return (
    <div>
      {/* filters */}
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="label">County</span>
          <select className={select} value={county} onChange={(e) => setCounty(e.target.value)}>
            <option>All of Ireland</option>
            {COUNTIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="label">From</span>
          <select className={select} value={from} onChange={(e) => setFrom(Math.min(Number(e.target.value), to - 1))}>
            {YEARS.slice(0, -1).map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="label">To</span>
          <select className={select} value={to} onChange={(e) => setTo(Math.max(Number(e.target.value), from + 1))}>
            {YEARS.slice(1).map((y) => <option key={y} value={y}>{y === 2026 ? "2026 (to Oct)" : y}</option>)}
          </select>
        </label>
        <button type="button" className="pill" onClick={() => { setCounty("All of Ireland"); setFrom(2015); setTo(LAST_FULL); }}>Reset</button>
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label={`Median price ${view.last?.year ?? ""}`} value={view.last ? eur(view.last.median) : "–"} note={county} />
        <Kpi label={`Change since ${view.first?.year ?? ""}`} value={`${view.change >= 0 ? "+" : ""}${view.change.toFixed(1)}%`} note="median price" />
        <Kpi label="Homes sold" value={view.sales.toLocaleString("en-IE")} note={`${from} to ${to}${to === 2026 ? " (Oct)" : ""}`} />
        <Kpi label={`Price rank ${to}`} value={isAll ? "–" : `#${view.last?.rank ?? "–"} of 26`} note={isAll ? "pick a county" : "by median price"} />
      </div>

      {/* charts */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 rounded-2xl border border-line bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="label">Median sale price by year</p>
            <p className="flex gap-3 text-xs text-muted">
              {series.map((s) => (
                <span key={s.name} className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name}</span>
              ))}
            </p>
          </div>
          <div className="mt-3"><TrendChart series={series} from={from} to={to} /></div>
        </div>

        <div className="min-w-0 rounded-2xl border border-line bg-surface p-4">
          <p className="label">Counties by median price, {to}{to === 2026 ? " (to Oct)" : ""}</p>
          <ol className="mt-3 max-h-[290px] space-y-1 overflow-y-auto pr-1">
            {view.ranking.map((r, i) => {
              const on = r[0] === county;
              return (
                <li key={r[0]}>
                  <button type="button" onClick={() => setCounty(r[0])} className="grid w-full grid-cols-[22px_86px_1fr_auto] items-center gap-2 rounded-md px-1 py-0.5 text-left text-xs hover:bg-ink/5" aria-pressed={on}>
                    <span className="tabular-nums text-muted">{i + 1}</span>
                    <span className={on ? "font-semibold text-ink" : "text-ink/85"}>{r[0]}</span>
                    <span className="h-2 rounded-full" style={{ width: `${(100 * r[3]) / view.maxMedian}%`, background: on ? "rgb(var(--c1))" : "rgb(var(--c2) / .55)" }} />
                    <span className="tabular-nums text-muted">{short(r[3])}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-line bg-surface p-4">
          <p className="label">Busiest months · share of a year&rsquo;s sales, average</p>
          <Bars
            items={(data.seasonality as [string, number][]).map(([m, v]) => ({ key: m, label: m.slice(0, 1), value: v, title: `${m}: ${v}% of a year's sales`, hot: v >= 10 }))}
            max={13}
          />
        </div>
        <div className="min-w-0 rounded-2xl border border-line bg-surface p-4">
          <p className="label">New homes as a share of all sales</p>
          <Bars
            items={(data.newShare as [number, number][]).filter(([y]) => y >= from && y <= to).map(([y, v]) => ({ key: String(y), label: String(y).slice(2), value: v, title: `${y}: ${v}% new homes` }))}
            max={30}
          />
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">{data.source}. Hover a point or bar for the exact value; click a county to filter. December is the busiest month, with 12.6% of a year's sales on average.</p>
    </div>
  );
}
