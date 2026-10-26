"use client";
import Link from "next/link";
import { useState } from "react";
import { education, experience, projects, skills } from "@/lib/data";

type Proof = { label: string; kind: string; href: string; external?: boolean };

// Built only from the tags already in data.ts, so nothing is claimed that the data doesn't say.
function proofFor(skill: string): Proof[] {
  const out: Proof[] = [];
  for (const p of projects) {
    if (!p.tags.includes(skill)) continue;
    out.push(p.caseStudy ? { label: p.name, kind: "Project", href: `/projects/${p.id}/` } : { label: p.name, kind: "Project", href: p.demo ?? p.repo, external: true });
  }
  for (const j of experience) if (j.tags.includes(skill)) out.push({ label: `${j.role}, ${j.company}`, kind: "Job", href: "#along" });
  for (const e of education) if (e.tags.includes(skill)) out.push({ label: `${e.title}, ${e.school}`, kind: "Study", href: "#along" });
  return out;
}

export default function SkillsProof() {
  const [skill, setSkill] = useState<string | null>("SQL");
  const proof = skill ? proofFor(skill) : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
      <div className="space-y-6">
        {skills.map((g) => (
          <div key={g.name}>
            <h3 className="font-serif text-2xl italic">{g.name}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {g.skills.map((s) => {
                const n = proofFor(s).length;
                return (
                  <li key={s}>
                    <button type="button" className="pill !min-h-10 !px-3.5" aria-pressed={skill === s} aria-controls="skill-proof" onClick={() => setSkill(skill === s ? null : s)}>
                      {s}
                      {n > 0 && <span className="ml-2 rounded-full bg-ink/[.07] px-1.5 text-xs tabular-nums text-ink/70"><span className="sr-only">, </span>{n}<span className="sr-only"> {n === 1 ? "example" : "examples"}</span></span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div id="skill-proof" aria-live="polite" className="self-start rounded-[22px] bg-sage p-6 sm:p-8 lg:sticky lg:top-24">
        {skill ? (
          <>
            <p className="label">Where I&rsquo;ve used it</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{skill}</p>
            {proof.length ? (
              <ul className="mt-5 space-y-3">
                {proof.map((p) => (
                  <li key={p.kind + p.label} className="border-t border-ink/10 pt-3">
                    <span className="label !text-[11px]">{p.kind}</span>
                    <span className="block">
                      {p.external ? (
                        <a href={p.href} target="_blank" rel="noopener noreferrer" className="link-u font-medium">{p.label} <span aria-hidden="true">↗</span></a>
                      ) : p.href.startsWith("#") ? (
                        <a href={p.href} className="link-u font-medium">{p.label}</a>
                      ) : (
                        <Link href={p.href} className="link-u font-medium">{p.label} <span aria-hidden="true">→</span></Link>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[15px] leading-relaxed text-ink/80">It&rsquo;s on my CV, but none of the projects on this site uses it yet.</p>
            )}
          </>
        ) : (
          <p className="text-[15px] leading-relaxed text-ink/80">Pick a skill to see the projects, jobs or study that back it up.</p>
        )}
      </div>
    </div>
  );
}
