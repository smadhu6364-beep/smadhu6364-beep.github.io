"use client";
import Link from "next/link";
import SoundToggle from "./SoundToggle";
import ThemeToggle from "./ThemeToggle";
import { profile } from "@/lib/data";
import { tabs, tabLabel, type Tab } from "@/lib/model";
import { playUi } from "@/lib/sound";

/**
 * Report-style header: name, page tabs, CV, sound and theme.
 * On the home page `onTab` switches pages in place; elsewhere the tabs are
 * plain links back to the dashboard.
 */
export default function TopBar({ current, onTab }: { current?: Tab; onTab?: (t: Tab) => void }) {
  return (
    <header className="bar-glass sticky top-0 z-40">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-1 px-4 pt-2.5 sm:px-6 lg:flex-nowrap lg:py-2.5">
        <Link href="/" className="flex min-h-10 min-w-0 items-center gap-2.5" onClick={() => onTab && onTab("overview")}>
          <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-sm font-semibold text-white dark:text-[#06101c]">
            MS
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold text-ink">{profile.name}</span>
            <span className="block text-xs text-muted">Business Analytics MSc · Dublin</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2 lg:order-3">
          <a
            href="/Madhu_Sudhan_Srinivas_CV.pdf"
            download
            className="inline-flex h-10 items-center lg:h-9 gap-1.5 rounded-full bg-accent px-3.5 text-xs font-semibold text-white transition hover:opacity-90 dark:text-[#06101c]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 3v12m0 0-5-5m5 5 5-5M5 21h14"/></svg>
            CV<span className="hidden sm:inline">&nbsp;(PDF)</span>
          </a>
          <SoundToggle />
          <ThemeToggle />
        </div>

        <nav aria-label="Report pages" className="no-scrollbar -mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 lg:order-2 lg:mx-0 lg:w-auto lg:px-0">
          <ul className="flex min-w-max gap-1">
            {tabs.map((t) => {
              const active = t === current;
              return (
                <li key={t}>
                  <a
                    href={t === "overview" ? "/" : `/?page=${t}`}
                    aria-current={active ? "page" : undefined}
                    onClick={(e) => {
                      if (!onTab) return;
                      e.preventDefault();
                      if (!active) playUi("whoosh");
                      onTab(t);
                    }}
                    className={`relative block px-3 py-2.5 text-sm transition lg:py-1.5 ${
                      active ? "font-semibold text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {tabLabel[t]}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-accent transition-opacity lg:-bottom-2.5 ${active ? "opacity-100" : "opacity-0"}`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
