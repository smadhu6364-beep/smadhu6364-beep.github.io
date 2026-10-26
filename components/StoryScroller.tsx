"use client";
import { useEffect, useRef, useState } from "react";
import DeviceFrame from "./DeviceFrame";

type Step = { title: string; body: string };

/**
 * Sticky scrollytelling. On wide screens the steps scroll on the left while one
 * device stays pinned on the right and swaps its picture per step.
 * On phones each step simply shows its own picture underneath it.
 */
export default function StoryScroller({
  steps,
  visuals,
  mobile,
}: {
  steps: Step[];
  /** What the pinned device shows for each step on wide screens. */
  visuals: React.ReactNode[];
  /** What each step shows on phones, and whether it sits in a laptop frame. */
  mobile: { node: React.ReactNode; framed: boolean }[];
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
      <ol className="space-y-6 md:space-y-0">
        {steps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-i={i}
            className="md:flex md:min-h-[70vh] md:items-center"
          >
            <div
              className={`glass w-full p-6 transition-opacity duration-500 sm:p-7 ${
                active === i ? "md:opacity-100" : "md:opacity-50"
              }`}
              aria-current={active === i ? "step" : undefined}
            >
              <p className="text-sm font-semibold text-accent">Step {i + 1}</p>
              <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
              <div className="mt-5 md:hidden">
                {mobile[i].framed ? <DeviceFrame>{mobile[i].node}</DeviceFrame> : mobile[i].node}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="hidden md:block" aria-hidden="true">
        <div className="sticky top-[18vh]">
          <DeviceFrame>
            {visuals.map((v, i) => (
              <div
                key={i}
                className="story-visual absolute inset-0"
                style={{ opacity: active === i ? 1 : 0 }}
              >
                {v}
              </div>
            ))}
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}
