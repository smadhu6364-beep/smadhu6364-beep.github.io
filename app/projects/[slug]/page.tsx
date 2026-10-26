import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PipelineDiagram from "@/components/PipelineDiagram";
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

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t border-line py-12 lg:grid-cols-[16rem_1fr] lg:gap-16 lg:py-16">
      <div>
        <p className="label">{n}</p>
        <h2 id={id} className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{title}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="max-w-[46rem] space-y-4 text-[17px] leading-relaxed text-ink/85">
      {items.map((t) => (
        <li key={t} className="relative pl-6">
          <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-px w-3 bg-ink/50" />
          {t}
        </li>
      ))}
    </ul>
  );
}

function Frame({ src, alt, w, h, caption, lazy = true }: { src: string; alt: string; w: number; h: number; caption: string; lazy?: boolean }) {
  return (
    <figure>
      <div className="mock-browser">
        <div className="mock-bar"><i /><i /><i /></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={w} height={h} loading={lazy ? "lazy" : "eager"} decoding="async" className="block h-auto w-full" />
      </div>
      <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const c = getCaseStudy(params.slug);
  if (!c) notFound();
  const p = projects.find((x) => x.id === c.slug);
  const idx = caseStudies.findIndex((x) => x.slug === c.slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];
  const hero = c.images?.[0];
  const isAirbnb = c.slug === "airbnb";
  const gallery = c.images ? c.images.slice(isAirbnb ? 0 : 1) : [];
  const words = c.title.split(" ");
  const head = words.slice(0, -1).join(" ");
  const tail = words[words.length - 1];
  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-full bg-ink px-4 py-3 text-bg focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <Header />
      <main id="main" className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <nav aria-label="Breadcrumb" className="pt-10 sm:pt-14">
          <Link href="/#work" className="label inline-flex min-h-10 items-center hover:text-ink">
            <span aria-hidden="true" className="mr-2">←</span> All work
          </Link>
        </nav>

        <header className="pb-12 pt-6 sm:pb-16">
          <p className="label">Case study{p ? ` · ${p.kind}` : ""}</p>
          <h1 className="mt-5 max-w-5xl text-[44px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-7xl lg:text-[84px]">
            {head && <>{head} </>}
            <span className="serif-i text-[1.08em] tracking-[-0.02em]">{tail}</span>
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-ink/80 sm:text-xl">{c.summary}</p>

          <dl className="mt-10 grid gap-6 border-t border-line pt-6 text-[15px] sm:grid-cols-3 sm:gap-10">
            <div>
              <dt className="label">Role</dt>
              <dd className="mt-2 leading-relaxed">{c.role}</dd>
            </div>
            <div>
              <dt className="label">{p?.credit ? "Who" : "Type"}</dt>
              <dd className="mt-2 leading-relaxed">{p?.credit ?? p?.kind ?? "Project"}</dd>
            </div>
            <div>
              <dt className="label">Stack</dt>
              <dd className="mt-2 leading-relaxed">{(p?.stack ?? c.stack.map((s) => s.tech)).join(", ")}</dd>
            </div>
          </dl>

          {c.links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3">
              {c.links.map((l, i) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-11 items-center rounded-full px-5 text-[15px] font-medium ${i === 0 ? "bg-ink text-bg hover:opacity-90" : "border border-ink hover:bg-ink hover:text-bg"}`}
                  >
                    {l.label} <span aria-hidden="true" className="ml-2">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className={`rounded-[28px] ${idx % 2 === 0 ? "bg-sage" : "bg-peach"} p-4 sm:p-10 lg:p-14`}>
          {hero ? (
            <Frame {...hero} lazy={false} />
          ) : (
            <figure className="rounded-2xl bg-surface p-5 sm:p-8">
              <PipelineDiagram nodes={c.diagram.nodes} title={`${c.title} pipeline`} />
              <figcaption className="mt-4 text-sm text-muted">{c.diagram.caption}</figcaption>
            </figure>
          )}
        </div>

        <ul className={`mt-12 grid grid-cols-2 gap-x-6 gap-y-8 ${c.kpis.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`} aria-label="Key numbers">
          {c.kpis.map((k) => (
            <li key={k.label} className="border-t border-ink/80 pt-4">
              <span className="block text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{k.value}</span>
              <span className="mt-2 block text-sm leading-snug text-muted">{k.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <Block n={num()} title="Problem">
            <div className="max-w-[46rem] space-y-5 text-[17px] leading-relaxed text-ink/85">
              {[...c.overview, ...c.problem].map((t) => <p key={t}>{t}</p>)}
            </div>
          </Block>

          <Block n={num()} title="What I did">
            <Bullets items={c.built} />
            {hero && (
              <figure className="mt-10 rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <PipelineDiagram nodes={c.diagram.nodes} title={`${c.title} pipeline`} />
                <figcaption className="mt-3 text-sm text-muted">{c.diagram.caption}</figcaption>
              </figure>
            )}
            <h3 className="label mt-12">Decisions along the way</h3>
            <dl className="mt-4 grid gap-x-10 gap-y-6 md:grid-cols-2">
              {c.decisions.map((d) => (
                <div key={d.title} className="border-t border-line pt-4">
                  <dt className="font-semibold">{d.title}</dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed text-ink/75">{d.body}</dd>
                </div>
              ))}
            </dl>
            <h3 className="label mt-12">Stack</h3>
            <dl className="mt-3 max-w-[46rem] text-[15px]">
              {c.stack.map((s) => (
                <div key={s.layer} className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-line py-2.5">
                  <dt className="text-muted">{s.layer}</dt>
                  <dd>{s.tech}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block n={num()} title="What I found">
            <Bullets items={c.findings ?? c.learned} />
            {isAirbnb && <div className="mt-10 space-y-4"><AirbnbReport /></div>}
            {gallery.length > 0 && (
              <>
                <h3 className="label mt-12">{isAirbnb ? "The Power BI report" : (c.galleryTitle ?? "More screens")}</h3>
                <ul className="mt-5 grid gap-8 md:grid-cols-2">
                  {gallery.map((im) => (
                    <li key={im.src}><Frame {...im} /></li>
                  ))}
                </ul>
              </>
            )}
            {c.findings && (
              <>
                <h3 className="label mt-12">What I learned</h3>
                <div className="mt-4"><Bullets items={c.learned} /></div>
              </>
            )}
          </Block>

          {c.next && (
            <Block n={num()} title="What I'd do next">
              <Bullets items={c.next} />
            </Block>
          )}

          <Block n={num()} title="Limitations">
            <Bullets items={c.status} />
          </Block>
        </div>

        {caseStudies.length > 1 && (
          <nav aria-label="Next case study" className="border-t border-line py-14">
            <Link href={`/projects/${next.slug}/`} className="group block">
              <span className="label">Next case study</span>
              <span className="mt-3 block text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                <span className="link-u decoration-1">{next.title}</span> <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-2">→</span>
              </span>
            </Link>
          </nav>
        )}
      </main>
      <Footer />
    </>
  );
}
