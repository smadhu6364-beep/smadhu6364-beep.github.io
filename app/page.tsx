import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProjectGrid from "@/components/ProjectGrid";
import { education, experience, profile, projects, skills } from "@/lib/data";

const LEAD = "irish-property";
const ordered = [...projects].sort((a, b) => Number(b.id === LEAD) - Number(a.id === LEAD));

type Stop = { when: string; title: string; place: string; note?: string };
const timeline: Stop[] = [
  { when: education[0].dates.replace("present", "now"), title: education[0].title, place: `${education[0].school}, ${education[0].place}`, note: education[0].modules.join(" · ") },
  ...experience.slice(0, 2).map((j) => ({ when: j.dates, title: j.role, place: `${j.company}, ${j.place}`, note: j.points[0] })),
  { when: education[1].dates, title: education[1].title, place: `${education[1].school}, ${education[1].place}` },
  { when: experience[2].length, title: experience[2].role, place: `${experience[2].company}, ${experience[2].place}`, note: experience[2].points[0] },
];

function SectionHead({ n, label, id }: { n: string; label: string; id: string }) {
  return (
    <p id={id} className="label flex items-center gap-3">
      <span>{n} / {label}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </p>
  );
}

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-full bg-ink px-4 py-3 text-bg focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <Header />
      <main id="main" className="mx-auto max-w-[1240px] px-4 sm:px-8">
        {/* Hero */}
        <section aria-labelledby="hero-title" className="grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.7fr_1fr] lg:gap-12 lg:pb-28 lg:pt-24">
          <div>
            <p className="flex items-center gap-2.5 text-sm text-ink/80">
              <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-dot opacity-40 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-dot" />
              </span>
              Open to data analyst roles in Ireland
            </p>
            <h1 id="hero-title" className="mt-7 text-[44px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-7xl lg:text-[78px]">
              From the front line
              <br />
              <span className="serif-i text-[1.08em] tracking-[-0.02em]">to the data.</span>
            </h1>
            <p className="mt-8 max-w-[34rem] text-lg leading-relaxed text-ink/80">
              I&rsquo;m Madhu. I spent two years in operations in Bengaluru, sorting out bookings and keeping shift figures in order. Now I&rsquo;m doing an MSc in Business Analytics at DCU in Dublin and building projects in SQL and Python.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#work" className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-bg hover:opacity-90">
                See my work <span aria-hidden="true" className="ml-2">↓</span>
              </a>
              <a href="/Madhu_Sudhan_Srinivas_CV.pdf" download className="link-u inline-flex min-h-12 items-center text-[15px] font-medium">
                Download my CV (PDF)
              </a>
            </div>
          </div>

          <aside aria-label="Field notes" className="mx-auto w-full max-w-[400px] px-2 lg:mx-0 lg:justify-self-end">
            <div className="notes-card px-7 pb-8 pt-9 sm:px-9">
              <span className="tape" aria-hidden="true" />
              <p className="label !text-[11px]">Field notes · Vol. 01 / 2026</p>
              <blockquote className="mt-6 font-serif text-[28px] italic leading-[1.15] sm:text-[32px]">
                &ldquo;Clean the data first. It usually changes the answer.&rdquo;
              </blockquote>
              <p className="mt-6 text-sm text-ink/75">From my notes on the Irish property project, where the encoding, the text prices and the VAT each moved the numbers.</p>
              <p className="mt-6 border-t border-dashed border-line pt-4 text-sm">
                <span aria-hidden="true">↳ </span>Currently: MSc Business Analytics at DCU
              </p>
            </div>
          </aside>
        </section>

        {/* Projects */}
        <section aria-labelledby="work" className="pb-24 lg:pb-32">
          <SectionHead n="01" label="Selected projects" id="work" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-end">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl">
              A few things I&rsquo;ve <span className="serif-i text-[1.08em]">worked on.</span>
            </h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink/75 lg:justify-self-end lg:text-right">
              Each one started with a question I wanted to answer. The case studies say what I did, what I found and where the work stops.
            </p>
          </div>
          <ProjectGrid projects={ordered} />
        </section>

        {/* About */}
        <section aria-labelledby="about" className="pb-24 lg:pb-32">
          <SectionHead n="02" label="A little context" id="about" />
          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-20">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl">
              Learning by <span className="serif-i text-[1.08em]">making things.</span>
            </h2>
            <div className="space-y-5 text-[17px] leading-relaxed text-ink/85">
              <p>
                Before the MSc I worked in operations at Thomas Cook and Trip Factory in Bengaluru. A lot of the job was finding errors in booking records and putting shift figures into tracking files so a supervisor could plan the week. It taught me to check a number before I trust it.
              </p>
              <p>
                At DCU I&rsquo;m studying statistics, Power BI and Python. Outside the modules I learn by building: an SQL study of every Irish house sale since 2010, an LLM benchmark co-authored with Kruthik Jadhav, and a few web apps.
              </p>
              <ul className="flex flex-wrap gap-1.5 pt-2" aria-label="Main skills">
                {["SQL", "Python", "Power BI", "Statistics", "pandas", "DuckDB", "Data visualisation", "Advanced Excel"].map((s) => (
                  <li key={s} className="tag">{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section aria-labelledby="along" className="pb-24 lg:pb-32">
          <SectionHead n="03" label="Along the way" id="along" />
          <ol className="mt-8 border-t border-line">
            {timeline.map((t) => (
              <li key={t.title + t.place} className="grid gap-1 border-b border-line py-6 sm:grid-cols-[11rem_1fr] sm:gap-8 lg:grid-cols-[14rem_1fr_1fr]">
                <p className="label pt-1">{t.when}</p>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{t.title}</h3>
                  <p className="text-[15px] text-muted">{t.place}</p>
                </div>
                {t.note && <p className="text-[15px] leading-relaxed text-ink/75 sm:col-start-2 lg:col-start-3">{t.note}</p>}
              </li>
            ))}
          </ol>
        </section>

        {/* Toolkit */}
        <section aria-labelledby="toolkit" className="pb-24 lg:pb-32">
          <SectionHead n="04" label="Toolkit" id="toolkit" />
          <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {skills.map((g) => (
              <div key={g.name}>
                <dt className="font-serif text-2xl italic">{g.name}</dt>
                <dd className="mt-3">
                  <ul className="space-y-1.5 text-[15px] text-ink/80">
                    {g.skills.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* Contact */}
      <section aria-labelledby="contact" className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <div className="rounded-[28px] bg-lime px-6 py-14 sm:px-12 sm:py-20 lg:px-16">
          <p id="contact" className="label !text-ink/70">05 / Say hello</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl">
              A good conversation is a good <span className="serif-i text-[1.08em]">start.</span>
            </h2>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <a href={`mailto:${profile.email}`} className="inline-flex min-h-12 max-w-full items-center rounded-full border border-ink px-6 text-[15px] font-medium hover:bg-ink hover:text-lime">
                <span className="truncate">{profile.email}</span> <span aria-hidden="true" className="ml-2">↗</span>
              </a>
              <ul className="flex flex-wrap gap-x-6 gap-y-1 text-[15px] font-medium">
                <li><a className="link-u inline-flex min-h-10 items-center" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
                <li><a className="link-u inline-flex min-h-10 items-center" href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
                <li><a className="link-u inline-flex min-h-10 items-center" href="/Madhu_Sudhan_Srinivas_CV.pdf" download>CV (PDF)</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
