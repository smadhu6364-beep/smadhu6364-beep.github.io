"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import TopBar from "./TopBar";
import Footer from "./Footer";
import { BarLegend, Card, Gantt, Kpi, ProjectTile, SkillBars } from "./Visuals";
import { airbnbKpi } from "@/lib/private/airbnb";
import { PUBLISH_AIRBNB, education, experience, profile, projects, projectKinds, type ProjectKind } from "@/lib/data";
import { caseStudies } from "@/lib/caseStudies";
import {
  datedOpsMonths,
  emptyFilter,
  kindCounts,
  projectMatches,
  rowMatches,
  rows,
  skillScope,
  skillStats,
  slicerSkills,
  tabLabel,
  tabs,
  undatedOpsRoles,
  type Filter,
  type Tab,
} from "@/lib/model";
import { playUi } from "@/lib/sound";

function readUrl(): { tab: Tab; filter: Filter } {
  const q = new URLSearchParams(window.location.search);
  const page = q.get("page") as Tab | null;
  const known = new Set(slicerSkills.map((s) => s.skill));
  const kind = q.get("type") as ProjectKind | null;
  return {
    tab: page && (tabs as readonly string[]).includes(page) ? page : "overview",
    filter: {
      skills: q.getAll("skill").filter((s) => known.has(s)),
      kind: kind && (projectKinds as readonly string[]).includes(kind) ? kind : null,
    },
  };
}

function writeUrl(tab: Tab, f: Filter, push: boolean) {
  const q = new URLSearchParams();
  if (tab !== "overview") q.set("page", tab);
  f.skills.forEach((s) => q.append("skill", s));
  if (f.kind) q.set("type", f.kind);
  const url = `${window.location.pathname}${q.toString() ? `?${q}` : ""}`;
  if (push) window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

const years = Math.floor(datedOpsMonths / 12);

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [filter, setFilter] = useState<Filter>(emptyFilter);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const sync = () => {
      const s = readUrl();
      setTab(s.tab);
      setFilter(s.filter);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const goTab = useCallback(
    (t: Tab) => {
      setTab(t);
      writeUrl(t, filter, true);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    },
    [filter],
  );

  const update = (f: Filter) => {
    playUi("click");
    setFilter(f);
    writeUrl(tab, f, false);
  };
  const toggleSkill = (s: string) =>
    update({ ...filter, skills: filter.skills.includes(s) ? filter.skills.filter((x) => x !== s) : [...filter.skills, s] });
  const toggleKind = (k: ProjectKind) => update({ ...filter, kind: filter.kind === k ? null : k });
  const clear = () => update(emptyFilter);

  const stats = useMemo(() => skillStats(filter), [filter]);
  const scope = skillScope(filter);
  const active = filter.skills.length > 0 || filter.kind !== null;
  const matchedProjects = projects.filter((p) => projectMatches(filter, p));
  const matchedRows = rows.filter((r) => rowMatches(filter, r));
  const usedSkills = stats.filter((s) => s.fProjects > 0).length;

  const status = active
    ? `Filtered by ${[filter.kind, ...filter.skills].filter(Boolean).join(" + ")}: ${matchedProjects.length} of ${projects.length} projects, ${matchedRows.length} of ${rows.length} jobs and courses`
    : `No filters. Showing all ${projects.length} projects and ${rows.length} jobs and courses.`;

  const slicers = (
    <aside aria-label="Filters" className="lg:sticky lg:top-[4.5rem] lg:self-start">
      <div className="card p-3 lg:p-4">
        <div className="flex min-h-6 items-center justify-between gap-2">
          <h2 className="visual-title hidden lg:block">Filters</h2>
          <button
            type="button"
            aria-expanded={sheet}
            aria-controls="filter-panel"
            onClick={() => setSheet((o) => !o)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium text-ink lg:hidden"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 5h18M6 12h12M10 19h4"/></svg>
            Filters{active ? ` (${filter.skills.length + (filter.kind ? 1 : 0)})` : ""}
          </button>
          {active && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex min-h-10 items-center rounded-full px-3 text-xs font-medium text-accent transition hover:bg-accent/10 lg:min-h-0 lg:px-2.5 lg:py-1"
            >
              Clear filters
            </button>
          )}
        </div>
        <div id="filter-panel" className={`${sheet ? "block" : "hidden"} mt-2 lg:block`}>
          <p className="pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">Project type</p>
          <div role="group" aria-label="Project type" className="mt-2 flex flex-wrap gap-1.5">
            {kindCounts.map(({ kind, n }) => (
              <button key={kind} type="button" className="chip" aria-pressed={filter.kind === kind} onClick={() => toggleKind(kind)}>
                {kind} <span className="n">{n}</span>
              </button>
            ))}
          </div>
          <p className="pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted">Skill</p>
          <div role="group" aria-label="Skill" className="mt-2 flex flex-wrap gap-1.5">
            {slicerSkills.map((s) => (
              <button key={s.skill} type="button" className="chip" aria-pressed={filter.skills.includes(s.skill)} onClick={() => toggleSkill(s.skill)}>
                {s.skill} <span className="n">{s.total}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-snug text-muted">
            Numbers show how many projects, jobs and courses use each one. Pick several to combine them.
          </p>
          <button
            type="button"
            onClick={() => setSheet(false)}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-white lg:hidden dark:text-[#06101c]"
          >
            Show results
          </button>
        </div>
      </div>
    </aside>
  );

  const kpis = (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {PUBLISH_AIRBNB && airbnbKpi ? (
        <Kpi value={airbnbKpi.value} label={airbnbKpi.label} sub={airbnbKpi.sub} />
      ) : (
        <Kpi value="812,018" label="Property sales analysed in SQL" sub="Ireland's Property Price Register, 2010 to 2026" />
      )}
      <Kpi value={active ? `${matchedProjects.length}/${projects.length}` : String(projects.length)} label="Projects" sub={active ? "match the filter" : `${caseStudies.length} with a report page`} />
      <Kpi value={String(usedSkills)} label={active ? "Skills in filtered projects" : "Skills used in projects"} sub="counted from each project's stack" />
      <Kpi value="MSc" label="Business Analytics" sub={`${education[0].school}, ${education[0].dates}`} />
      <Kpi
        value={`${years}+ yrs`}
        className="col-span-2 sm:col-span-1"
        label="Operations experience"
        sub={`${datedOpsMonths} months in dated roles, plus ${undatedOpsRoles.join(", ")}`}
      />
    </div>
  );

  const noRows = active && matchedRows.length === 0 && (
    <p className="mb-3 rounded-lg bg-accent/10 px-3 py-2 text-xs leading-snug text-ink">
      None of my jobs or courses used this. See the projects below.
    </p>
  );

  const typeBars = (
    <ul className="space-y-2">
      {kindCounts.map(({ kind, n }) => {
        const f = matchedProjects.filter((p) => p.kind === kind).length;
        const max = Math.max(...kindCounts.map((k) => k.n));
        return (
          <li key={kind}>
            <button
              type="button"
              aria-pressed={filter.kind === kind}
              onClick={() => toggleKind(kind)}
              className={`grid min-h-10 w-full grid-cols-[6.5rem_1fr_2rem] items-center lg:min-h-0 gap-2 rounded-md px-1 py-1.5 text-left text-xs transition hover:bg-accent/5 ${filter.kind === kind ? "bg-accent/10 font-semibold" : ""}`}
            >
              <span className="text-ink">{kind}</span>
              <span className="relative h-5 rounded-sm bg-line/40" aria-hidden="true">
                <span className="absolute inset-y-0 left-0 rounded-sm bg-accent/20" style={{ width: `${(n / max) * 100}%` }} />
                <span className="xf-bar absolute inset-y-0 left-0 rounded-sm bg-accent" style={{ width: `${(f / max) * 100}%` }} />
              </span>
              <span className="text-right tabular-nums text-muted">{f === n ? n : `${f}/${n}`}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const projectGrid = (detailed: boolean) => {
    const list = detailed ? [...projects].sort((a, b) => Number(projectMatches(filter, b)) - Number(projectMatches(filter, a))) : projects;
    return (
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <li key={p.id}>
            <ProjectTile p={p} on={projectMatches(filter, p)} highlight={scope} detailed={detailed} />
          </li>
        ))}
      </ul>
    );
  };

  let body: React.ReactNode;
  if (tab === "overview") {
    body = (
      <>
        {kpis}
        <div className="grid gap-3 xl:grid-cols-3">
          <Card title="About me">
            <p className="text-[15px] leading-relaxed text-ink">
              I&apos;m Madhu. Before my MSc I worked in operations in Bengaluru, mostly sorting out booking problems for customers and keeping
              records straight. Now I&apos;m studying Business Analytics at DCU and building data and AI tools in my own time.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink">I&apos;m looking for data and analytics roles in Ireland.</p>
            <p className="mt-4 rounded-lg bg-accent/10 px-3 py-2 text-xs leading-snug text-ink">
              This page works like a report. Pick a skill or project type in the filters, or click a bar, and every visual updates.
            </p>
          </Card>
          <Card title="Where each skill was used" sub="Count of projects, jobs and courses. Click a bar to filter.">
            <SkillBars stats={stats} selected={filter.skills} onToggle={toggleSkill} limit={9} />
            <BarLegend />
          </Card>
          <Card title="Projects by type" sub="Click a bar to filter.">
            {typeBars}
            <button type="button" onClick={() => goTab("skills")} className="mt-2 inline-flex min-h-10 items-center text-xs font-medium text-accent hover:underline">
              See every skill →
            </button>
          </Card>
        </div>
        <Card title="Work and study timeline" sub="Dates from my CV. Rows that don't use the filtered skills fade back.">
          {noRows}
          <Gantt filter={filter} />
        </Card>
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="visual-title">Projects</h2>
            <button type="button" onClick={() => goTab("projects")} className="inline-flex min-h-10 items-center text-xs font-medium text-accent hover:underline">
              Project details →
            </button>
          </div>
          {projectGrid(false)}
        </div>
      </>
    );
  } else if (tab === "projects") {
    body = projectGrid(true);
  } else if (tab === "experience") {
    body = (
      <>
        <Card title="Work and study timeline" sub="Dates from my CV.">
          {noRows}
          <Gantt filter={filter} />
        </Card>
        <ul className="grid gap-3 md:grid-cols-2">
          {experience.map((j) => {
            const on = rowMatches(filter, rows.find((r) => r.id === j.company)!);
            return (
              <li key={j.company} className={`card xf p-4 sm:p-5 ${on ? "" : "xf-off"}`}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Work · {j.start ? j.dates : j.length}</p>
                <h3 className="mt-1 text-base font-semibold text-ink">{j.role}</h3>
                <p className="text-sm text-muted">
                  {j.company}, {j.place}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-4 text-sm leading-snug text-ink">
                  {j.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </li>
            );
          })}
          {education.map((e) => {
            const on = rowMatches(filter, rows.find((r) => r.id === e.school)!);
            return (
              <li key={e.title} className={`card xf p-4 sm:p-5 ${on ? "" : "xf-off"}`}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7a45c2] dark:text-[#c3a2f5]">
                  Study · {e.status} · {e.dates}
                </p>
                <h3 className="mt-1 text-base font-semibold text-ink">{e.title}</h3>
                <p className="text-sm text-muted">
                  {e.school}, {e.place}
                </p>
                {e.modules.length > 0 && <p className="mt-3 text-sm leading-snug text-ink">Modules: {e.modules.join(", ")}</p>}
              </li>
            );
          })}
        </ul>
      </>
    );
  } else if (tab === "skills") {
    const cols = [
      ...projects.map((p) => ({ id: p.id, name: p.name, tags: p.tags, on: projectMatches(filter, p), kind: "Project" })),
      ...rows.map((r) => ({ id: r.id, name: r.sub.split(",")[0], tags: r.tags, on: rowMatches(filter, r), kind: r.group })),
    ];
    const listed = [...stats].sort((a, b) => a.group.localeCompare(b.group) || b.total - a.total);
    body = (
      <>
        <Card title="Where each skill was used" sub="Every skill on my CV that appears in a project, job or course. Click a bar to filter.">
          <SkillBars stats={stats} selected={filter.skills} onToggle={toggleSkill} />
          <BarLegend />
          {stats.some((s) => s.total === 0) && (
            <p className="mt-3 text-xs leading-snug text-muted">
              On my CV but not yet in a project listed here: {stats.filter((s) => s.total === 0).map((s) => s.skill).join(", ")}.
            </p>
          )}
        </Card>
        <Card className="min-w-0" title="Skill by project and role" sub="A filled cell means the skill was used there. Scroll sideways on small screens.">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-xs">
              <caption className="sr-only">Which skills were used in which projects, jobs and courses</caption>
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 bg-surface p-1 text-left font-medium text-muted">Skill</th>
                  {cols.map((c) => (
                    <th key={c.id} scope="col" className={`xf h-28 p-1 align-bottom font-medium text-ink ${c.on ? "" : "xf-off"}`}>
                      <span className="mx-auto block max-h-28 w-4 whitespace-nowrap [writing-mode:vertical-rl] rotate-180 text-left">{c.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listed
                  .filter((s) => s.total > 0)
                  .map((s) => (
                    <tr key={s.skill}>
                      <th scope="row" className="sticky left-0 whitespace-nowrap bg-surface py-0.5 pr-2 text-left font-normal text-ink">
                        {s.skill} <span className="text-muted">· {s.group}</span>
                      </th>
                      {cols.map((c) => {
                        const used = c.tags.includes(s.skill);
                        const lit = used && c.on && (!filter.skills.length || filter.skills.includes(s.skill));
                        return (
                          <td key={c.id} className="p-0.5">
                            <span
                              className={`xf block h-5 rounded-[3px] ${used ? (lit ? (c.kind === "Project" ? "bg-accent" : "bg-[#8e5bd0] dark:bg-[#b58cf0]") : "bg-accent/25") : "bg-line/30"}`}
                              title={used ? `${s.skill} in ${c.name}` : undefined}
                            />
                            <span className="sr-only">{used ? "used" : "not used"}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </>
    );
  } else {
    body = (
      <div className="grid gap-3 md:grid-cols-2">
        <Card title="Get in touch">
          <p className="text-[15px] leading-relaxed text-ink">
            I&apos;m in {profile.location} and looking for data and analytics roles. Email is the best way to reach me.
          </p>
          <dl className="mt-4 divide-y divide-line/70 text-sm">
            <div className="grid grid-cols-[5.5rem_1fr] gap-2 py-2">
              <dt className="text-muted">Email</dt>
              <dd><a className="inline-block break-all py-2.5 font-medium text-accent hover:underline lg:py-0" href={`mailto:${profile.email}`}>{profile.email}</a></dd>
            </div>
            <div className="grid grid-cols-[5.5rem_1fr] gap-2 py-2">
              <dt className="text-muted">GitHub</dt>
              <dd><a className="inline-block break-all py-2.5 font-medium text-accent hover:underline lg:py-0" href={profile.github} target="_blank" rel="noopener noreferrer">github.com/{profile.githubHandle}</a></dd>
            </div>
            <div className="grid grid-cols-[5.5rem_1fr] gap-2 py-2">
              <dt className="text-muted">Location</dt>
              <dd className="text-ink">{profile.location}</dd>
            </div>
          </dl>
        </Card>
        <Card title="CV">
          <p className="text-[15px] leading-relaxed text-ink">Download the PDF, or read a plain version that prints well.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="/Madhu_Sudhan_Srinivas_CV.pdf" download className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 dark:text-[#06101c]">
              Download CV (PDF)
            </a>
            <Link href="/cv/" className="rounded-full border border-accent px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent/10">
              Plain CV page
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <a href="#main" className="sr-only z-50 rounded bg-accent px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <TopBar current={tab} onTab={goTab} />
      <div className={`mx-auto max-w-[1440px] px-4 pb-10 pt-4 sm:px-6 ${tab === "contact" ? "" : "lg:grid lg:grid-cols-[250px_1fr] lg:gap-4"}`}>
        {tab !== "contact" && slicers}
        <main id="main" className="mt-3 min-w-0 lg:mt-0">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{tabLabel[tab]}</h1>
            {tab !== "contact" && (
              <p className="text-xs text-muted" aria-live="polite">
                {status}
              </p>
            )}
          </div>
          {tab === "overview" && (
            <p className="mb-3 max-w-3xl text-[15px] leading-snug text-ink sm:text-base">
              MSc Business Analytics at DCU. Power BI, Python and statistics. Looking for data analyst roles in Ireland.
            </p>
          )}
          <div key={tab} className="tab-panel space-y-3">
            {body}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
