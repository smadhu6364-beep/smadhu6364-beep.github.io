import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CloudBackdrop from "@/components/CloudBackdrop";
import PipelineDiagram from "@/components/PipelineDiagram";
import ThemeToggle from "@/components/ThemeToggle";
import { caseStudies, getCaseStudy } from "@/lib/caseStudies";
import { profile } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCaseStudy(params.slug);
  if (!c) return {};
  return {
    title: `${c.title} case study | ${profile.name}`,
    description: c.summary,
  };
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <div className="kerb mb-3" aria-hidden="true" />
      <h2 id={id} className="font-display text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

function Paras({ items }: { items: string[] }) {
  return (
    <>
      {items.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </>
  );
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const c = getCaseStudy(params.slug);
  if (!c) notFound();

  const idx = caseStudies.findIndex((x) => x.slug === c.slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded bg-accent px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>
      <CloudBackdrop />

      <div className="mx-auto max-w-3xl px-5 pb-20 pt-8 sm:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-4">
          <Link href="/#projects" className="text-sm font-medium text-accent underline-offset-4 hover:underline">
            ← All projects
          </Link>
          <ThemeToggle />
        </nav>

        <main id="main">
          <header className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Case study</p>
            <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{c.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink">{c.summary}</p>
            <p className="mt-3 text-sm text-muted">{c.role}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {c.links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    i === 0
                      ? "inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:text-[#0b111c]"
                      : "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
                  }
                >
                  {l.label} <span aria-hidden="true">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ))}
            </div>
          </header>

          {c.images?.[0] && (
            <figure className="mt-10">
              <div className="glass overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.images[0].src} alt={c.images[0].alt} width={c.images[0].w} height={c.images[0].h} className="h-auto w-full" />
              </div>
              <figcaption className="mt-2 text-sm text-muted">{c.images[0].caption}</figcaption>
            </figure>
          )}

          <Section id="overview" title="Overview">
            <Paras items={c.overview} />
          </Section>

          <Section id="problem" title="The problem">
            <Paras items={c.problem} />
          </Section>

          <Section id="built" title="What I built">
            <ul className="list-disc space-y-2 pl-5">
              {c.built.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="glass !mt-8 rounded-2xl border border-line bg-surface/80 p-4 sm:p-6">
              <PipelineDiagram nodes={c.diagram.nodes} title={`${c.title} architecture`} />
              <p className="mt-4 text-sm text-muted">{c.diagram.caption}</p>
            </div>
          </Section>

          <Section id="decisions" title="Key decisions">
            <div className="grid gap-4 sm:grid-cols-2">
              {c.decisions.map((d) => (
                <div key={d.title} className="glass rounded-2xl border border-line bg-surface p-5">
                  <h3 className="font-semibold text-ink">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{d.body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="stack" title="Tech stack">
            <dl className="divide-y divide-line border-y border-line">
              {c.stack.map((s) => (
                <div key={s.layer} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="text-sm font-semibold text-ink">{s.layer}</dt>
                  <dd className="text-sm">{s.tech}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {c.images && c.images.length > 1 && (
            <section aria-label="More screenshots" className="mt-14 space-y-8">
              {c.images.slice(1).map((im) => (
                <figure key={im.src}>
                  <div className="glass overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={im.src} alt={im.alt} width={im.w} height={im.h} loading="lazy" className="h-auto w-full" />
                  </div>
                  <figcaption className="mt-2 text-sm text-muted">{im.caption}</figcaption>
                </figure>
              ))}
            </section>
          )}

          <Section id="status" title="Status and limitations">
            <ul className="list-disc space-y-2 pl-5">
              {c.status.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Section>

          <Section id="learned" title="What I learned">
            <ul className="list-disc space-y-2 pl-5">
              {c.learned.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Section>

          <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm">
            <Link href="/#projects" className="font-medium text-accent underline-offset-4 hover:underline">
              ← All projects
            </Link>
            <Link href={`/projects/${next.slug}/`} className="font-medium text-accent underline-offset-4 hover:underline">
              Next: {next.title} →
            </Link>
          </footer>
        </main>
      </div>
    </>
  );
}
