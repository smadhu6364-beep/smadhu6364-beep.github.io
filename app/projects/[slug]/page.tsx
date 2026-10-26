import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CloudBackdrop from "@/components/CloudBackdrop";
import Footer from "@/components/Footer";
import PipelineDiagram from "@/components/PipelineDiagram";
import TopBar from "@/components/TopBar";
import { Kpi } from "@/components/Visuals";
import { caseStudies, getCaseStudy } from "@/lib/caseStudies";
import { AirbnbReport } from "@/lib/private/airbnb";
import { profile, projects } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCaseStudy(params.slug);
  if (!c) return {};
  const title = `${c.title} | ${profile.name}`;
  return {
    title,
    description: c.summary,
    alternates: { canonical: `/projects/${c.slug}/` },
    openGraph: { url: `/projects/${c.slug}/`, title, description: c.summary },
  };
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card p-4 sm:p-5 ${className}`} aria-label={title}>
      <h2 className="visual-title mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default function ReportPage({ params }: { params: { slug: string } }) {
  const c = getCaseStudy(params.slug);
  if (!c) notFound();
  const p = projects.find((x) => x.id === c.slug);
  const idx = caseStudies.findIndex((x) => x.slug === c.slug);
  const prev = caseStudies[(idx - 1 + caseStudies.length) % caseStudies.length];
  const next = caseStudies[(idx + 1) % caseStudies.length];
  const hero = c.images?.[0];
  const isAirbnb = c.slug === "airbnb";

  return (
    <>
      <a href="#main" className="sr-only z-50 rounded bg-accent px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <CloudBackdrop />
      <TopBar current="projects" />
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-3 text-xs text-muted">
          <Link href="/?page=projects" className="-my-3 inline-flex min-h-10 items-center py-3 font-medium text-accent hover:underline lg:my-0 lg:min-h-0 lg:py-0">
            Projects
          </Link>{" "}
          <span aria-hidden="true">/</span> <span className="text-ink">{c.title}</span>
        </nav>

        <main id="main" className="space-y-3">
          <header className="card p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                {p && <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{p.kind}</p>}
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{c.title}</h1>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">{c.summary}</p>
                <p className="mt-2 text-sm text-muted">{c.role}</p>
              </div>
              {c.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {c.links.map((l, i) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        i === 0
                          ? "rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 dark:text-[#06101c]"
                          : "rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/10"
                      }
                    >
                      {l.label} <span aria-hidden="true">↗</span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div className={`grid grid-cols-2 gap-3 ${c.kpis.length === 5 ? "sm:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-4"}`}>
            {c.kpis.map((k) => (
              <Kpi key={k.label} value={k.value} label={k.label} />
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
            <section className="card overflow-hidden" aria-label="Main visual">
              {hero ? (
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.src} alt={hero.alt} width={hero.w} height={hero.h} className="block h-auto w-full" />
                  <figcaption className="border-t border-line/70 px-4 py-2 text-xs text-muted">{hero.caption}</figcaption>
                </figure>
              ) : (
                <div className="flex h-full flex-col justify-center gap-4 p-4 sm:p-6">
                  <h2 className="visual-title">How it fits together</h2>
                  <PipelineDiagram nodes={c.diagram.nodes} title={`${c.title} pipeline`} />
                  <p className="visual-sub">{c.diagram.caption}</p>
                </div>
              )}
            </section>
            <Section title="The problem">
              <div className="space-y-3 text-sm leading-relaxed text-ink">
                {[...c.overview, ...c.problem].map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </Section>
          </div>

          {hero && (
            <Section title="How it fits together">
              <PipelineDiagram nodes={c.diagram.nodes} title={`${c.title} pipeline`} />
              <p className="visual-sub mt-2">{c.diagram.caption}</p>
            </Section>
          )}

          <div className="grid gap-3 lg:grid-cols-2">
            <Section title="Approach">
              <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-ink">
                {c.built.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Section>
            <Section title="Key decisions">
              <dl className="space-y-3 text-sm leading-relaxed">
                {c.decisions.map((d) => (
                  <div key={d.title}>
                    <dt className="font-semibold text-ink">{d.title}</dt>
                    <dd className="mt-0.5 text-muted">{d.body}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          </div>

          {c.findings && (
            <Section title="Key findings">
              <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-ink">
                {c.findings.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Section>
          )}

          {isAirbnb && <AirbnbReport />}

          {c.images && c.images.length > 1 && (
            <section aria-label="More screens">
              <h2 className="visual-title mb-2 pt-2">{isAirbnb ? "The Power BI report" : (c.galleryTitle ?? "More screens")}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {c.images.slice(isAirbnb ? 0 : 1).map((im) => (
                  <li key={im.src} className="card overflow-hidden">
                    <figure>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={im.src} alt={im.alt} width={im.w} height={im.h} loading="lazy" decoding="async" className="block h-auto w-full" />
                      <figcaption className="border-t border-line/70 px-4 py-2 text-xs text-muted">{im.caption}</figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="grid gap-3 lg:grid-cols-3">
            <Section title="Stack">
              <dl className="divide-y divide-line/70 text-sm">
                {c.stack.map((s) => (
                  <div key={s.layer} className="grid grid-cols-[7rem_1fr] gap-2 py-2">
                    <dt className="text-muted">{s.layer}</dt>
                    <dd className="text-ink">{s.tech}</dd>
                  </div>
                ))}
              </dl>
            </Section>
            <Section title="Status and limitations">
              <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-ink">
                {c.status.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Section>
            <Section title="What I learned">
              <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-ink">
                {c.learned.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Section>
          </div>

          {caseStudies.length > 1 && (
            <nav aria-label="Other projects" className="grid gap-3 sm:grid-cols-2">
              <Link href={`/projects/${prev.slug}/`} className="card block p-4 transition hover:border-accent">
                <span className="text-xs text-muted">← Previous report</span>
                <span className="mt-1 block font-semibold text-ink">{prev.title}</span>
              </Link>
              <Link href={`/projects/${next.slug}/`} className="card block p-4 text-right transition hover:border-accent">
                <span className="text-xs text-muted">Next report →</span>
                <span className="mt-1 block font-semibold text-ink">{next.title}</span>
              </Link>
            </nav>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
