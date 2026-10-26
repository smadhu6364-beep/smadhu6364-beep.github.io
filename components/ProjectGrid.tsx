"use client";
import Link from "next/link";
import { useState } from "react";
import type { Project, ProjectKind } from "@/lib/data";

const filters: { label: string; kind: ProjectKind | null }[] = [
  { label: "All work", kind: null },
  { label: "Data & SQL", kind: "Data & BI" },
  { label: "AI & research", kind: "AI & LLMs" },
  { label: "Web apps", kind: "Web apps" },
];

/** A second, narrower image for the phone mock where one exists */
const phoneImage: Record<string, { src: string; w: number; h: number }> = {
  "irish-property": { src: "/projects/irish-property-counties.webp", w: 1107, h: 996 },
  roam: { src: "/projects/roam-planner.webp", w: 1280, h: 800 },
};

const stretch = "after:absolute after:inset-0 after:rounded-[28px] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-ink";

function Img({ src, alt, w, h, className = "" }: { src: string; alt: string; w: number; h: number; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" className={`block h-full w-full object-cover object-left-top ${className}`} />;
}

function BenchmarkScreen({ big }: { big?: boolean }) {
  const steps = ["Extract + audit", "Run grid", "Match + score"];
  return (
    <div className={`flex h-full flex-col justify-between bg-surface ${big ? "p-5 sm:p-7" : "p-3"}`}>
      <div>
        <p className={`label ${big ? "" : "!text-[9px]"}`}>Offline test suite</p>
        <p className={`mt-1 font-semibold tracking-tight ${big ? "text-5xl sm:text-6xl" : "text-3xl"}`}>456</p>
        <p className={`text-muted ${big ? "text-sm" : "text-[10px] leading-tight"}`}>unit tests, no API keys needed</p>
      </div>
      {big ? (
        <ol className="mt-5 grid grid-cols-3 gap-1.5 text-[10px] sm:text-xs">
          {steps.map((s, i) => (
            <li key={s} className="rounded-md border border-line bg-bg px-1.5 py-2 text-center leading-tight">
              <span className="block text-muted">0{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-1 text-[10px] leading-tight">
          <li><b className="font-semibold">21</b> real projects</li>
          <li><b className="font-semibold">3 × 3</b> models × prompts</li>
          <li className="text-muted">Results held back until the paper is out</li>
        </ul>
      )}
    </div>
  );
}

function Mock({ p, wide }: { p: Project; wide: boolean }) {
  const ph = phoneImage[p.id] ?? (p.image ? { src: p.image.src, w: p.image.w, h: p.image.h } : null);
  return (
    <div className={`relative ${wide ? "pr-10 sm:pr-16" : "pr-10 sm:pr-14"}`} aria-hidden={p.image ? undefined : true}>
      <div className="mock-browser">
        <div className="mock-bar"><i /><i /><i /></div>
        <div className="aspect-[16/10]">
          {p.image ? <Img src={p.image.src} alt={p.image.alt} w={p.image.w} h={p.image.h} /> : <BenchmarkScreen big />}
        </div>
      </div>
      <div className={`mock-phone absolute bottom-[-18px] right-0 ${wide ? "w-[30%] max-w-[170px]" : "w-[32%] max-w-[130px]"}`} aria-hidden="true">
        <div className="aspect-[9/17]">
          {ph ? <Img src={ph.src} alt="" w={ph.w} h={ph.h} /> : <BenchmarkScreen />}
        </div>
      </div>
    </div>
  );
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [kind, setKind] = useState<ProjectKind | null>(null);
  const shown = projects.filter((p) => !kind || p.kind === kind);

  return (
    <>
      <div role="group" aria-label="Filter projects" className="mt-10 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f.label} type="button" className="pill" aria-pressed={kind === f.kind} onClick={() => setKind(f.kind)}>
            {f.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{shown.length} projects shown</p>

      <ul className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {shown.map((p, i) => {
          const wide = i === 0 && !kind;
          const tone = i % 2 === 0 ? "bg-sage" : "bg-peach";
          const href = p.caseStudy ? `/projects/${p.id}/` : (p.demo ?? p.repo);
          const external = !p.caseStudy;
          const cta = p.caseStudy ? "Read the case study" : "Try the live demo";
          return (
            <li key={p.id} className={wide ? "lg:col-span-2" : ""}>
              <article className={`proj-card group relative h-full rounded-[28px] ${tone} p-5 sm:p-8 ${wide ? "lg:grid lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-14 lg:p-12" : ""}`}>
                <div className="pb-6">
                  <Mock p={p} wide={wide} />
                </div>
                <div className={wide ? "mt-8 lg:mt-0" : "mt-8"}>
                  <p className="label">{String(i + 1).padStart(2, "0")} · {filters.find((f) => f.kind === p.kind)?.label}</p>
                  <h3 className={`mt-3 font-semibold tracking-[-0.025em] ${wide ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[28px]"}`}>
                    {external ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={stretch}>
                        {p.name}
                      </a>
                    ) : (
                      <Link href={href} className={stretch}>
                        {p.name}
                      </Link>
                    )}
                  </h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink/80">{p.tagline}</p>
                  {p.credit && <p className="mt-2 text-sm text-muted">{p.credit}</p>}
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tools">
                    {p.stack.slice(0, 4).map((s) => <li key={s} className="tag">{s}</li>)}
                  </ul>
                  <p className="mt-6 text-sm font-medium">
                    <span className="link-u">{cta}</span> <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">{external ? "↗" : "→"}</span>
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
