import CloudBackdrop from "@/components/CloudBackdrop";
import PipelineDiagram from "@/components/PipelineDiagram";
import ThemeToggle from "@/components/ThemeToggle";
import { getCaseStudy } from "@/lib/caseStudies";
import { education, experience, profile, projects, skills, type Project } from "@/lib/data";

const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const btn = "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition";
const btnPrimary = `${btn} bg-accent text-white dark:text-[#0b111c] hover:opacity-90`;
const btnGhost = `${btn} border border-line text-ink hover:border-accent hover:text-accent`;

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="kerb mb-3" aria-hidden="true" />
      <h2 id={`${id}-h`} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          {s}
        </li>
      ))}
    </ul>
  );
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
    >
      {children}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function CaseLink({ id, name }: { id: string; name: string }) {
  return (
    <a
      href={`/projects/${id}/`}
      className="inline-flex items-center gap-1 text-sm font-semibold text-accent underline-offset-4 hover:underline"
    >
      Read case study<span className="sr-only">: {name}</span> <span aria-hidden="true">→</span>
    </a>
  );
}

function ProjectMedia({ p }: { p: Project }) {
  if (p.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={p.image.src}
        alt={p.image.alt}
        width={p.image.w}
        height={p.image.h}
        loading="lazy"
        decoding="async"
        className="aspect-[16/10] h-auto w-full object-cover object-top"
      />
    );
  }
  const cs = getCaseStudy(p.id);
  if (!cs) return null;
  return (
    <div className="w-full bg-bg/60 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full">
        <PipelineDiagram nodes={cs.diagram.nodes} title={`${p.name} pipeline`} />
      </div>
    </div>
  );
}

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded bg-accent px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>

      {/* iCloud-style colour glows behind frosted cards */}
      <CloudBackdrop />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:flex lg:gap-16 lg:px-12">
        <header className="pt-10 lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[44%] lg:flex-col lg:justify-between lg:py-20">
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-medium text-accent">Dublin, Ireland · Open to data and analytics roles</p>
              <ThemeToggle />
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-3 text-lg font-medium text-ink">
              MSc Business Analytics student at DCU, building data and AI tools.
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              I spent the last few years in customer-facing operations, keeping records accurate and shifts running. Now I use
              Python, SQL and LLMs to turn messy information into something people can act on.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#projects" className={btnPrimary}>View projects</a>
              <a href={`mailto:${profile.email}`} className={btnGhost}>Email me</a>
              <a href={profile.github} className={btnGhost} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="/cv/" className={btnGhost}>View CV</a>
              <a href="/Madhu_Sudhan_Srinivas_CV.pdf" download className={btnGhost}>Download CV (PDF)</a>
            </div>

            <nav aria-label="Sections" className="mt-14 hidden lg:block">
              <ul className="space-y-3">
                {nav.map((n) => (
                  <li key={n.id}>
                    <a
                      href={`#${n.id}`}
                      className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted hover:text-ink"
                    >
                      <span className="h-px w-8 bg-line transition-all group-hover:w-14 group-hover:bg-ink" aria-hidden="true" />
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="mt-8 hidden text-sm text-muted lg:block">{profile.location}</p>
        </header>

        <main id="main" className="pb-16 pt-16 lg:w-[56%] lg:py-20">
          <section id="about" aria-labelledby="about-h" className="mb-24">
            <Heading id="about">About</Heading>
            <div className="space-y-4 leading-relaxed text-muted">
              <p>
                Before my master&apos;s I worked in operations in Bengaluru: customer service at Thomas Cook, onboarding and
                payments at Trip Factory, and a busy café counter before that. The common thread was fixing records, answering
                questions under pressure and keeping the figures straight so supervisors could plan.
              </p>
              <p>
                That work made me curious about the data behind it. I&apos;m now doing an MSc in Business Analytics at Dublin
                City University, and I build things alongside it: a benchmark that tests whether LLMs can draft project risk
                registers, a civic-reporting app, and a few smaller web and machine-learning projects.
              </p>
              <p>
                I&apos;m looking for data and analytics roles in Ireland where a practical operations sense and solid technical
                work both count.
              </p>
            </div>
          </section>

          <section id="experience" aria-labelledby="experience-h" className="mb-24">
            <Heading id="experience">Experience</Heading>
            <ol className="relative space-y-10 border-l border-line pl-6">
              {experience.map((j) => (
                <li key={j.company} className="relative">
                  <span
                    className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg"
                    aria-hidden="true"
                  />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">{j.dates}</p>
                  <h3 className="mt-1 font-semibold text-ink">
                    {j.role} <span className="font-normal text-muted">· {j.company}</span>
                  </h3>
                  <p className="text-sm text-muted">{j.place}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                    {j.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section id="projects" aria-labelledby="projects-h" className="mb-24">
            <Heading id="projects">Projects</Heading>
            <div className="space-y-6">
              {featured.map((p) => (
                <article key={p.id} className="glass overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
                  {p.caseStudy ? (
                    <a href={`/projects/${p.id}/`} tabIndex={-1} aria-hidden="true" className="block border-b border-line">
                      <ProjectMedia p={p} />
                    </a>
                  ) : (
                    <div className="border-b border-line"><ProjectMedia p={p} /></div>
                  )}
                  <div className="p-6 sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">Featured</p>
                    <h3 className="mt-2 font-display text-xl font-semibold">{p.name}</h3>
                    <p className="mt-2 font-medium text-ink">{p.tagline}</p>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                      {p.detail.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                    {p.note && <p className="mt-3 text-sm font-medium text-ink">{p.note}</p>}
                    <div className="mt-5">
                      <Chips items={p.stack} />
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-5">
                      {p.caseStudy && <CaseLink id={p.id} name={p.name} />}
                      <Ext href={p.repo}>Code on GitHub</Ext>
                      {p.demo && <Ext href={p.demo}>Live demo</Ext>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <h3 className="mb-2 mt-12 text-sm font-semibold uppercase tracking-widest text-muted">Other projects</h3>
            <ul className="divide-y divide-line border-y border-line">
              {others.map((p) => (
                <li key={p.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start">
                  {p.image && (
                    <a
                      href={p.caseStudy ? `/projects/${p.id}/` : p.demo ?? p.repo}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="block shrink-0 overflow-hidden rounded-lg border border-line sm:w-40"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image.src}
                        alt=""
                        width={p.image.w}
                        height={p.image.h}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[16/10] h-auto w-full object-cover object-top"
                      />
                    </a>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold">{p.name}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {p.tagline} {p.detail.join(" ")}
                    </p>
                    <p className="mt-2 text-xs text-muted">{p.stack.join(" · ")}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      {p.caseStudy && <CaseLink id={p.id} name={p.name} />}
                      <Ext href={p.repo}>Code</Ext>
                      {p.demo && <Ext href={p.demo}>Live demo</Ext>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section id="skills" aria-labelledby="skills-h" className="mb-24">
            <Heading id="skills">Skills</Heading>
            <div className="grid gap-6 sm:grid-cols-2">
              {skills.map((g) => (
                <div key={g.name}>
                  <h3 className="mb-2 text-sm font-semibold text-ink">{g.name}</h3>
                  <Chips items={g.skills} />
                </div>
              ))}
            </div>
          </section>

          <section id="education" aria-labelledby="education-h" className="mb-24">
            <Heading id="education">Education</Heading>
            <div className="space-y-5">
              {education.map((e) => (
                <div key={e.title} className="rounded-2xl border border-line bg-surface p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="font-semibold">{e.title}</h3>
                    <p className="text-sm text-muted">{e.dates}</p>
                  </div>
                  <p className="text-sm text-muted">
                    {e.school}, {e.place}
                  </p>
                  {e.modules.length > 0 && (
                    <p className="mt-3 text-sm text-muted">
                      <span className="font-medium text-ink">Modules:</span> {e.modules.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section id="contact" aria-labelledby="contact-h">
            <Heading id="contact">Contact</Heading>
            <p className="max-w-lg leading-relaxed text-muted">
              If you&apos;re hiring for a data or analytics role in Ireland, or want to talk about one of these projects, email
              is the best way to reach me.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`mailto:${profile.email}`} className={`${btnPrimary} break-all`}>{profile.email}</a>
              <a href={profile.github} className={btnGhost} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="/cv/" className={btnGhost}>View CV</a>
            </div>
          </section>

          <footer className="mt-24 border-t border-line pt-6 text-xs text-muted">
            <p>© 2026 {profile.name}. Built with Next.js and Tailwind CSS.</p>
            <p className="mt-1">The faint line in the background is the Albert Park circuit, Melbourne.</p>
          </footer>
        </main>
      </div>
    </>
  );
}
