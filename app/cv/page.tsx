import type { Metadata } from "next";
import Link from "next/link";
import { compounds, education, experience, profile, projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "CV | Madhu Sudhan Srinivas",
  description: "Plain, print-friendly CV for Madhu Sudhan Srinivas.",
};

export default function CV() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 print:bg-white">
      <main className="mx-auto max-w-3xl px-5 py-10 print:py-0">
        <nav className="mb-8 flex justify-between text-sm print:hidden">
          <Link href="/" className="text-teal-deep underline">← Back to the full site</Link>
          <span className="text-neutral-600">Tip: print this page or save it as PDF</span>
        </nav>
        <header className="border-b-4 border-papaya pb-4">
          <h1 className="font-display text-4xl font-bold">{profile.name}</h1>
          <p className="mt-1 text-neutral-700">
            {profile.location} · <a className="underline" href={`mailto:${profile.email}`}>{profile.email}</a> ·{" "}
            <a className="underline" href={profile.github}>github.com/{profile.githubHandle}</a>
          </p>
          <p className="mt-3">{profile.positioning}</p>
        </header>

        <section className="mt-8" aria-labelledby="cv-edu">
          <h2 id="cv-edu" className="font-display text-xl font-bold uppercase tracking-wide">Education</h2>
          {education.map((e) => (
            <div key={e.title} className="mt-3">
              <div className="flex flex-wrap justify-between gap-x-4">
                <h3 className="font-semibold">{e.title}</h3>
                <span className="text-neutral-700">{e.dates}</span>
              </div>
              <p className="text-neutral-700">{e.school}, {e.place}</p>
              {e.modules.length > 0 && <p className="text-sm">Modules: {e.modules.join("; ")}</p>}
            </div>
          ))}
        </section>

        <section className="mt-8" aria-labelledby="cv-exp">
          <h2 id="cv-exp" className="font-display text-xl font-bold uppercase tracking-wide">Experience</h2>
          {experience.map((s) => (
            <div key={s.team} className="mt-3 break-inside-avoid">
              <div className="flex flex-wrap justify-between gap-x-4">
                <h3 className="font-semibold">{s.role}, {s.team}</h3>
                <span className="text-neutral-700">{s.dates}</span>
              </div>
              <p className="text-sm text-neutral-700">{s.place}</p>
              <ul className="ml-5 list-disc text-sm">
                {s.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-8" aria-labelledby="cv-proj">
          <h2 id="cv-proj" className="font-display text-xl font-bold uppercase tracking-wide">Projects</h2>
          {projects.map((p) => (
            <div key={p.id} className="mt-3 break-inside-avoid">
              <h3 className="font-semibold">
                {p.name} · <a className="text-sm font-normal underline" href={p.repo}>{p.repo.replace("https://", "")}</a>
              </h3>
              <p className="text-sm">{p.detail.join(" ")}{p.note ? ` ${p.note}` : ""}</p>
              <p className="text-sm text-neutral-700">{p.stack.join(", ")}</p>
            </div>
          ))}
        </section>

        <section className="mt-8" aria-labelledby="cv-skills">
          <h2 id="cv-skills" className="font-display text-xl font-bold uppercase tracking-wide">Skills</h2>
          <dl className="mt-2 space-y-1 text-sm">
            {compounds.map((c) => (
              <div key={c.name} className="flex gap-2">
                <dt className="w-24 shrink-0 font-semibold">{c.name}</dt>
                <dd>{c.skills.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
}
