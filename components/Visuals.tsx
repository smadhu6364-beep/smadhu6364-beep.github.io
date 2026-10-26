"use client";
import Link from "next/link";
import type { Project } from "@/lib/data";
import { getCaseStudy } from "@/lib/caseStudies";
import { rows, rowMatches, ym, type Filter, type SkillStat } from "@/lib/model";
import { playUi } from "@/lib/sound";

export function Card({ title, sub, children, className = "" }: { title?: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card p-4 sm:p-5 ${className}`} aria-label={title}>
      {title && (
        <header className="mb-3">
          <h2 className="visual-title">{title}</h2>
          {sub && <p className="visual-sub mt-0.5">{sub}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Kpi({ value, label, sub, className = "" }: { value: string; label: string; sub?: string; className?: string }) {
  return (
    <div className={`card kpi flex min-h-[7.5rem] flex-col justify-between p-4 transition-colors sm:p-5 ${className}`} onMouseEnter={() => playUi("tick")}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <div>
        <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-ink sm:text-[2.1rem]">{value}</p>
        {sub && <p className="mt-1 text-xs leading-snug text-muted">{sub}</p>}
      </div>
    </div>
  );
}

/* ---------- Timeline (Gantt) ---------- */
const NOW = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
})();

export function Gantt({ filter, compact = false }: { filter: Filter; compact?: boolean }) {
  const dated = rows.filter((r) => r.start);
  const y0 = Math.min(...dated.map((r) => Number(r.start!.slice(0, 4))));
  const y1 = Number(NOW.slice(0, 4)) + 1;
  const a = y0 * 12;
  const span = y1 * 12 - a;
  const pct = (m: number) => ((m - a) / span) * 100;
  const years = Array.from({ length: y1 - y0 + 1 }, (_, i) => y0 + i);
  const ordered = [...rows].sort((p, q) => (q.start ? ym(q.start) : -1) - (p.start ? ym(p.start) : -1));

  return (
    <div role="list" aria-label="Timeline of work and study">
      <div className="relative ml-0 h-5 sm:ml-[38%] lg:ml-[32%]" aria-hidden="true">
        {years.map((y) => (
          <span key={y} className={`absolute -translate-x-1/2 text-[11px] tabular-nums text-muted ${y % 2 ? "hidden sm:inline" : ""}`} style={{ left: `${pct(y * 12)}%` }}>
            {compact && y % 2 ? "" : y}
          </span>
        ))}
      </div>
      {ordered.map((r) => {
        const on = rowMatches(filter, r);
        const s = r.start ? ym(r.start) : null;
        const e = r.end ? ym(r.end) + 1 : ym(NOW) + 1;
        return (
          <div key={r.id} role="listitem" className={`xf grid items-center gap-x-3 gap-y-1 border-t border-line/70 py-2 sm:grid-cols-[38%_1fr] lg:grid-cols-[32%_1fr] ${on ? "" : "xf-off"}`}>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{r.label}</p>
              <p className="truncate text-xs text-muted">
                {r.sub} · {r.dates}
              </p>
            </div>
            <div className="relative h-6">
              {years.map((y) => (
                <span key={y} aria-hidden="true" className="absolute inset-y-0 w-px bg-line/60" style={{ left: `${pct(y * 12)}%` }} />
              ))}
              {s !== null ? (
                <span
                  className={`absolute inset-y-1 rounded-md ${r.group === "Work" ? "bg-accent" : "bg-[#8e5bd0] dark:bg-[#b58cf0]"}`}
                  style={{ left: `${pct(s)}%`, width: `${Math.max(pct(e) - pct(s), 1)}%` }}
                  title={`${r.label}: ${r.dates}`}
                />
              ) : (
                <span className="absolute inset-y-1 left-0 flex items-center text-[11px] italic text-muted">not placed on the axis: {r.dates}</span>
              )}
            </div>
          </div>
        );
      })}
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-hidden="true">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-accent" />Work</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-[#8e5bd0] dark:bg-[#b58cf0]" />Study</span>
      </p>
    </div>
  );
}

/* ---------- Skill usage bars ---------- */
export function SkillBars({
  stats,
  selected,
  onToggle,
  limit,
}: {
  stats: SkillStat[];
  selected: string[];
  onToggle: (s: string) => void;
  limit?: number;
}) {
  const list = [...stats].filter((s) => s.total > 0).sort((p, q) => q.total - p.total || p.skill.localeCompare(q.skill));
  const shown = limit ? list.slice(0, limit) : list;
  const max = Math.max(...list.map((s) => s.total), 1);
  return (
    <ul className="space-y-1">
      {shown.map((s) => {
        const f = s.fProjects + s.fRoles;
        const pressed = selected.includes(s.skill);
        return (
          <li key={s.skill}>
            <button
              type="button"
              aria-pressed={pressed}
              onClick={() => onToggle(s.skill)}
              className={`group grid min-h-10 w-full grid-cols-[7.5rem_1fr_2.25rem] items-center lg:min-h-0 gap-2 rounded-md px-1 py-1 text-left text-xs transition hover:bg-accent/5 sm:grid-cols-[9rem_1fr_2.5rem] ${pressed ? "bg-accent/10" : ""}`}
            >
              <span className={`truncate ${pressed ? "font-semibold text-accent" : "text-ink"}`}>{s.skill}</span>
              <span className="relative h-3.5 rounded-sm bg-line/40" aria-hidden="true">
                <span className="absolute inset-y-0 left-0 rounded-sm bg-accent/20" style={{ width: `${(s.total / max) * 100}%` }} />
                <span className="xf-bar absolute inset-y-0 left-0 rounded-sm bg-accent" style={{ width: `${(s.fProjects / max) * 100}%` }} />
                <span
                  className="xf-bar absolute inset-y-0 rounded-r-sm bg-[#8e5bd0] dark:bg-[#b58cf0]"
                  style={{ left: `${(s.fProjects / max) * 100}%`, width: `${(s.fRoles / max) * 100}%` }}
                />
              </span>
              <span className="text-right tabular-nums text-muted">
                {f === s.total ? s.total : `${f}/${s.total}`}
              </span>
              <span className="sr-only">
                : used in {s.projects} project{s.projects === 1 ? "" : "s"} and {s.roles} {s.roles === 1 ? "role or course" : "roles or courses"}
                {f !== s.total ? `, ${f} in the current filter` : ""}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function BarLegend() {
  return (
    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-hidden="true">
      <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-accent" />Projects</span>
      <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-[#8e5bd0] dark:bg-[#b58cf0]" />Jobs and courses</span>
      <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-accent/20" />Outside the filter</span>
    </p>
  );
}

/* ---------- Project tile ---------- */
export function ProjectTile({ p, on, highlight, detailed = false }: { p: Project; on: boolean; highlight: string[] | null; detailed?: boolean }) {
  const cs = p.caseStudy ? getCaseStudy(p.id) : undefined;
  const href = cs ? `/projects/${p.id}/` : p.demo || p.repo;
  const external = !cs;
  const visual = p.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={p.image.src} alt={p.image.alt} width={p.image.w} height={p.image.h} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
  ) : cs ? (
    <figure
      role="img"
      aria-label={`${p.name} pipeline: ${cs.diagram.nodes.map((x) => x.label).join(", then ")}`}
      className="flex h-full flex-col justify-center gap-2 p-3 sm:p-4"
    >
      <p aria-hidden="true" className="text-[11px] font-semibold uppercase tracking-wider text-muted">Pipeline</p>
      <ol aria-hidden="true" className="grid grid-cols-3 gap-2">
        {cs.diagram.nodes.map((n, i) => (
          <li key={n.label} className="relative rounded-lg border border-line bg-surface px-2 py-2">
            <span className="absolute inset-y-1.5 left-0 w-1 rounded-r bg-accent" />
            <span className="block text-[11px] font-semibold tabular-nums text-accent">{i + 1}</span>
            <span className="block text-[13px] font-semibold leading-tight text-ink">{n.label}</span>
            {n.sub && <span className="mt-0.5 block text-[11px] leading-tight text-muted">{n.sub}</span>}
          </li>
        ))}
      </ol>
    </figure>
  ) : null;

  return (
    <article className={`card xf group relative flex h-full flex-col overflow-hidden ${on ? "" : "xf-off"}`}>
      <div className="aspect-[16/9] overflow-hidden border-b border-line/70 bg-bg">{visual}</div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{p.kind}</p>
        <h3 className="mt-1 text-base font-semibold text-ink">
          <Link
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() => playUi("whoosh")}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {p.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm leading-snug text-muted">{p.tagline}</p>
        {p.credit && <p className="mt-2 text-xs text-muted">{p.credit}</p>}
        {detailed && (
          <ul className="mt-3 list-disc space-y-1 pl-4 text-sm leading-snug text-muted">
            {p.detail.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Skills used">
          {p.tags.map((t) => {
            const hit = highlight?.includes(t);
            return (
              <li key={t} className={`rounded px-1.5 py-0.5 text-[11px] ${hit ? "bg-accent text-white dark:text-[#06101c]" : "bg-line/50 text-ink"}`}>
                {t}
              </li>
            );
          })}
        </ul>
        <p className="mt-auto pt-3 text-xs font-medium text-accent">
          {cs ? "Open report page →" : p.demo ? "Live demo ↗" : "Code on GitHub ↗"}
        </p>
      </div>
    </article>
  );
}
