// Everything the dashboard shows is derived here from lib/data.ts, so the
// numbers on screen always match the CV data. No hand-typed totals.
import { education, experience, projects, projectKinds, skills, type ProjectKind } from "./data";

export type Row = {
  id: string;
  label: string;
  sub: string;
  group: "Work" | "Study";
  start?: string;
  end?: string; // undefined with a start means "present"
  dates: string;
  tags: string[];
};

export const rows: Row[] = [
  ...education.map((e) => ({
    id: e.school,
    label: e.title.replace(" (Computing)", ""),
    sub: `${e.school}, ${e.place}`,
    group: "Study" as const,
    start: e.start,
    end: e.end,
    dates: e.dates,
    tags: e.tags,
  })),
  ...experience.map((j) => ({
    id: j.company,
    label: j.role,
    sub: `${j.company}, ${j.place}`,
    group: "Work" as const,
    start: j.start,
    end: j.end,
    dates: j.start ? j.dates : `${j.length}, dates not listed`,
    tags: j.tags,
  })),
];

const monthIndex = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};
export const ym = monthIndex;

/** Months of dated operations work (inclusive), from the CV dates only */
export const datedOpsMonths = experience
  .filter((j) => j.start && j.end)
  .reduce((n, j) => n + monthIndex(j.end!) - monthIndex(j.start!) + 1, 0);
export const undatedOpsRoles = experience.filter((j) => !j.start).map((j) => `${j.length} at ${j.company}`);

export const allSkills = skills.flatMap((g) => g.skills.map((s) => ({ skill: s, group: g.name })));

export type Filter = { skills: string[]; kind: ProjectKind | null };
export const emptyFilter: Filter = { skills: [], kind: null };

export const hasAny = (tags: string[], set: string[]) => tags.some((t) => set.includes(t));

/** The skill set that other visuals are highlighted by (null = no filter) */
export function skillScope(f: Filter): string[] | null {
  if (f.skills.length) return f.skills;
  if (f.kind) return Array.from(new Set(projects.filter((p) => p.kind === f.kind).flatMap((p) => p.tags)));
  return null;
}

export const projectMatches = (f: Filter, p: (typeof projects)[number]) =>
  (!f.skills.length || hasAny(p.tags, f.skills)) && (!f.kind || p.kind === f.kind);

export const rowMatches = (f: Filter, r: Row) => {
  const s = skillScope(f);
  return !s || hasAny(r.tags, s);
};

export type SkillStat = { skill: string; group: string; projects: number; roles: number; total: number; fProjects: number; fRoles: number };

export function skillStats(f: Filter): SkillStat[] {
  const fp = projects.filter((p) => projectMatches(f, p));
  const fr = rows.filter((r) => rowMatches(f, r));
  return allSkills.map(({ skill, group }) => {
    const pr = projects.filter((p) => p.tags.includes(skill)).length;
    const ro = rows.filter((r) => r.tags.includes(skill)).length;
    return {
      skill,
      group,
      projects: pr,
      roles: ro,
      total: pr + ro,
      fProjects: fp.filter((p) => p.tags.includes(skill)).length,
      fRoles: fr.filter((r) => r.tags.includes(skill)).length,
    };
  });
}

/** Skills that appear somewhere in the data, most used first (these become slicer chips) */
export const slicerSkills = skillStats(emptyFilter)
  .filter((s) => s.total > 0)
  .sort((a, b) => b.total - a.total || a.skill.localeCompare(b.skill));

export const kindCounts = projectKinds.map((k) => ({ kind: k, n: projects.filter((p) => p.kind === k).length })).filter((k) => k.n > 0);

export const tabs = ["overview", "projects", "experience", "skills", "contact"] as const;
export type Tab = (typeof tabs)[number];
export const tabLabel: Record<Tab, string> = {
  overview: "Overview",
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  contact: "Contact",
};
