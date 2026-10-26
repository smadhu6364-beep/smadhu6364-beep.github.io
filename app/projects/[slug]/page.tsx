import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CloudBackdrop from "@/components/CloudBackdrop";
import DeviceFrame from "@/components/DeviceFrame";
import HeroRise from "@/components/HeroRise";
import PipelineDiagram from "@/components/PipelineDiagram";
import Reveal from "@/components/Reveal";
import StoryScroller from "@/components/StoryScroller";
import ThemeToggle from "@/components/ThemeToggle";
import { caseStudies, getCaseStudy } from "@/lib/caseStudies";
import { profile } from "@/lib/data";
import { launches, type StoryVisual } from "@/lib/launch";

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

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-24 sm:mt-32">
      <Reveal>
        <div className="glass inline-block px-6 py-3 sm:px-8 sm:py-4">
          <h2 id={id} className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            {title}
          </h2>
        </div>
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  );
}

const btnPrimary =
  "inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 dark:text-[#0b111c]";
const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-accent px-5 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/10";

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const c = getCaseStudy(params.slug);
  if (!c) notFound();
  const l = launches[c.slug];

  const idx = caseStudies.findIndex((x) => x.slug === c.slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];
  const nextLaunch = launches[next.slug];

  const diagram = (active?: number[]) => (
    <div className="story-diagram flex-col justify-center gap-[6%]">
      {active ? (
        <div className="text-center" aria-hidden="true">
          <p className="font-display text-[clamp(1.25rem,3vw,2.6rem)] font-semibold leading-tight tracking-tight text-ink">
            {active.map((a) => c.diagram.nodes[a].label).join(" → ")}
          </p>
          <p className="mt-2 text-[clamp(.8rem,1.4vw,1.1rem)] text-muted">
            {active.map((a) => c.diagram.nodes[a].sub).filter(Boolean).join(" · ")}
          </p>
        </div>
      ) : (
        <p className="text-center font-display text-[clamp(1.25rem,3vw,2.6rem)] font-semibold tracking-tight text-ink" aria-hidden="true">
          {c.diagram.nodes[0].label} → {c.diagram.nodes[c.diagram.nodes.length - 1].label}
        </p>
      )}
      <div className="w-full">
        <PipelineDiagram nodes={c.diagram.nodes} title={`${c.title} pipeline`} active={active} layout="horizontal" />
      </div>
    </div>
  );
  const image = (i: number, eager = false) => {
    const im = c.images?.[i];
    if (!im) return diagram();
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={im.src} alt={im.alt} width={im.w} height={im.h} loading={eager ? "eager" : "lazy"} decoding="async" />
    );
  };
  const visual = (v: StoryVisual) => (v.kind === "image" ? image(v.index) : diagram(v.active));
  const mobile = l.story.map((s) =>
    s.visual.kind === "image"
      ? { node: image(s.visual.index), framed: true }
      : {
          node: (
            <div className="rounded-2xl border border-line bg-bg/40 p-4">
              <PipelineDiagram nodes={c.diagram.nodes} title={`${c.title} pipeline`} active={s.visual.active} />
            </div>
          ),
          framed: false,
        },
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded bg-accent px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>
      <CloudBackdrop />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-8">
        <nav aria-label="Breadcrumb" className="glass flex items-center justify-between gap-4 !rounded-full px-5 py-2">
          <Link href="/#projects" className="text-sm font-medium text-accent underline-offset-4 hover:underline">
            ← All projects
          </Link>
          <span className="hidden text-sm font-semibold text-ink sm:inline">{c.title}</span>
          <ThemeToggle />
        </nav>

        <main id="main">
          <header className="mx-auto mt-10 max-w-3xl text-center sm:mt-16">
            <div className="glass px-6 py-10 sm:px-12 sm:py-14">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{l.eyebrow}</p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                {l.headline}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink sm:text-xl">{l.subhead}</p>
              <p className="mt-3 text-sm text-muted">{c.role}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {c.links.map((link, i) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={i === 0 ? btnPrimary : btnGhost}>
                    {link.label} <span aria-hidden="true">↗</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>
          </header>

          <div className="mx-auto mt-12 max-w-5xl sm:mt-16">
            <HeroRise>
              <DeviceFrame>{c.images?.[0] ? image(0, true) : diagram()}</DeviceFrame>
            </HeroRise>
          </div>

          <section aria-labelledby="why" className="mt-24 sm:mt-32">
            <Reveal>
              <div className="glass mx-auto max-w-3xl p-6 sm:p-10">
                <h2 id="why" className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Why I built it
                </h2>
                <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
                  {[...c.overview, ...c.problem].map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>

          <Block id="how" title="How it works">
            <StoryScroller steps={l.story} visuals={l.story.map((s) => visual(s.visual))} mobile={mobile} />
          </Block>

          <Block id="facts" title="In numbers">
            <ul className={`grid grid-cols-2 gap-3 sm:gap-4 ${l.facts.length === 4 ? "" : "lg:grid-cols-3"}`}>
              {l.facts.map((f, i) => (
                <li key={f.label} className={i === 0 && l.facts.length % 2 === 1 ? "col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
                  <Reveal className="h-full">
                    <div className="glass flex h-full min-h-[9rem] flex-col justify-end p-5 sm:min-h-[11rem] sm:p-7">
                      <p
                        className={`font-display font-semibold leading-none tracking-tight text-ink ${
                          f.value.length > 7
                            ? "text-2xl sm:text-4xl"
                            : i === 0
                              ? "text-6xl sm:text-8xl"
                              : "text-4xl sm:text-6xl"
                        }`}
                      >
                        {f.value}
                      </p>
                      <p className="mt-3 text-sm font-medium text-muted sm:text-base">{f.label}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="decisions" title="Key decisions">
            <div className="grid gap-4 md:grid-cols-2">
              {c.decisions.map((d) => (
                <Reveal key={d.title} className="h-full">
                  <div className="glass h-full p-6 sm:p-8">
                    <h3 className="font-display text-xl font-semibold text-ink">{d.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{d.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Block>

          <Block id="stack" title="Tech stack">
            <Reveal>
              <dl className="glass divide-y divide-line px-6 sm:px-8">
                {c.stack.map((s) => (
                  <div key={s.layer} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                    <dt className="font-semibold text-ink">{s.layer}</dt>
                    <dd className="text-muted">{s.tech}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Block>

          <div className="mt-24 grid gap-4 sm:mt-32 md:grid-cols-2">
            <section aria-labelledby="status" className="glass p-6 sm:p-8">
              <h2 id="status" className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Status and limitations
              </h2>
              <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-muted">
                {c.status.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="learned" className="glass p-6 sm:p-8">
              <h2 id="learned" className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                What I learned
              </h2>
              <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-muted">
                {c.learned.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          </div>

          <Link href={`/projects/${next.slug}/`} className="launch-card glass group mt-24 block p-8 text-center sm:mt-32 sm:p-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">Next project</span>
            <span className="mt-3 block font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              {next.title}{" "}
              <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
            <span className="mt-3 block text-lg text-muted">{nextLaunch.headline}</span>
          </Link>

          <footer className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-xs text-muted">
            <Link href="/#projects" className="text-sm font-medium text-accent underline-offset-4 hover:underline">
              ← All projects
            </Link>
            <p>
              Background photos: Lewis Hamilton at the British Grand Prix, Silverstone, by Jen Ross and Andrew &amp; Alan
              Frost, colour-graded,{" "}
              <a className="underline hover:text-ink" href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">
                CC BY 2.0
              </a>
              , via{" "}
              <a
                className="underline hover:text-ink"
                href="https://commons.wikimedia.org/w/index.php?search=Lewis+Hamilton+British+Grand+Prix&amp;title=Special:MediaSearch&amp;type=image"
                target="_blank"
                rel="noreferrer"
              >
                Wikimedia Commons
              </a>
              .
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
