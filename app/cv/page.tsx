import type { Metadata } from "next";
import Link from "next/link";
import { education, experience, profile, projects, skills } from "@/lib/data";

export const metadata: Metadata = {
  title: "CV | Madhu Sudhan Srinivas",
  description: "Plain, print-friendly CV for Madhu Sudhan Srinivas.",
  alternates: { canonical: "/cv/" },
  openGraph: { url: "/cv/", title: "CV | Madhu Sudhan Srinivas" },
};

export default function CV() {
  return (
    <div className="min-h-screen bg-bg text-ink print:bg-white print:text-black">
      <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16 print:max-w-none print:px-0 print:py-0 print:text-[10.5pt] print:leading-snug">
        <nav className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm print:hidden">
          <Link href="/" className="label inline-flex min-h-10 items-center hover:text-ink">← Back to the main site</Link>
          <a
            href="/Madhu_Sudhan_Srinivas_CV.pdf"
            download
            className="btn !min-h-10 !px-4"
          >
            Download CV (PDF)
          </a>
        </nav>
        <header className="border-b border-ink pb-6 print:pb-3">
          <h1 className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl print:text-3xl">{profile.name}</h1>
          <p className="mt-1 text-muted print:text-neutral-700">
            {profile.location} · <a className="underline" href={`mailto:${profile.email}`}>{profile.email}</a> ·{" "}
            <a className="underline" href={profile.github}>github.com/{profile.githubHandle}</a> ·{" "}
            <a className="underline" href={profile.linkedin}>linkedin.com/in/{profile.linkedinHandle}</a>
          </p>
          <p className="mt-4 text-[17px] leading-relaxed print:text-[10.5pt]">{profile.positioning}</p>
        </header>

        <section className="mt-8 print:mt-4" aria-labelledby="cv-edu">
          <h2 id="cv-edu" className="label border-b border-line pb-2 !text-ink print:border-neutral-300">Education</h2>
          {education.map((e) => (
            <div key={e.title} className="mt-3">
              <div className="flex flex-wrap justify-between gap-x-4">
                <h3 className="font-semibold">{e.title}</h3>
                <span className="text-muted print:text-neutral-700">{e.dates}</span>
              </div>
              <p className="text-muted print:text-neutral-700">{e.school}, {e.place}</p>
              {e.modules.length > 0 && <p className="text-sm">Modules: {e.modules.join("; ")}</p>}
            </div>
          ))}
        </section>

        <section className="mt-8 print:mt-4" aria-labelledby="cv-exp">
          <h2 id="cv-exp" className="label border-b border-line pb-2 !text-ink print:border-neutral-300">Experience</h2>
          {experience.map((s) => (
            <div key={s.company} className="mt-3 break-inside-avoid">
              <div className="flex flex-wrap justify-between gap-x-4">
                <h3 className="font-semibold">{s.role}, {s.company}</h3>
                <span className="text-muted print:text-neutral-700">{s.dates}</span>
              </div>
              <p className="text-sm text-muted print:text-neutral-700">{s.place}</p>
              <ul className="ml-5 list-disc text-sm">
                {s.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-8 print:mt-4" aria-labelledby="cv-proj">
          <h2 id="cv-proj" className="label border-b border-line pb-2 !text-ink print:border-neutral-300">Projects</h2>
          {projects.map((p) => (
            <div key={p.id} className="mt-3 break-inside-avoid">
              <h3 className="font-semibold">
                {p.name} · <a className="text-sm font-normal underline" href={p.repo}>{p.repo.replace("https://", "")}</a>{p.demo && <> · <a className="text-sm font-normal underline" href={p.demo}>live demo</a></>}
              </h3>
              <p className="text-sm">{p.detail.join(" ")}{p.note ? ` ${p.note}` : ""}</p>
              <p className="text-sm text-muted print:text-neutral-700">{p.stack.join(", ")}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 print:mt-4" aria-labelledby="cv-skills">
          <h2 id="cv-skills" className="label border-b border-line pb-2 !text-ink print:border-neutral-300">Skills</h2>
          <dl className="mt-2 space-y-1 text-sm">
            {skills.map((c) => (
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
