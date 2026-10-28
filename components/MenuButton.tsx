"use client";

import { useState } from "react";
import { HOLD, PANELS } from "./Journey";

// Panels inside the sideways section sit in a transformed track, so a plain
// anchor jump lands in the wrong place. Work out the scroll position instead.
function jump(href: string) {
  const el = document.querySelector<HTMLElement>(href);
  const wrap = el?.closest<HTMLElement>("[data-journey]");
  if (!el || !wrap || el.dataset.panel === undefined) return false;
  const i = Number(el.dataset.panel);
  const total = wrap.offsetHeight - window.innerHeight;
  const at = i === 0 ? HOLD : HOLD + i; // education: after the plane lands
  window.scrollTo({ top: wrap.offsetTop + (at / (PANELS - 1 + HOLD)) * total, behavior: "smooth" });
  return true;
}

export default function MenuButton({ items, fontClass }: { items: string[][]; fontClass: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-md border border-navy/40 bg-card/70 backdrop-blur"
      >
        <span className={`block h-0.5 w-5 ${open ? "bg-mist" : "bg-navy"} transition ${open ? "translate-y-1 rotate-45" : ""}`} />
        <span className={`block h-0.5 ${open ? "bg-mist" : "bg-navy"} transition ${open ? "w-5 -translate-y-1 -rotate-45" : "w-3"}`} />
      </button>
      {open && (
        <nav className="fixed inset-0 z-40 flex items-center justify-center bg-deep/95 backdrop-blur">
          <ul className="space-y-1 text-center">
            {items.map(([label, href], i) => (
              <li key={href}>
                <a href={href} onClick={(e) => { setOpen(false); if (jump(href)) e.preventDefault(); }} className={`${fontClass} group flex items-baseline justify-center gap-3 py-1.5 text-3xl font-medium text-mist transition hover:text-red sm:text-4xl`}>
                  <span className="font-sans text-xs tracking-widest text-mist/40 group-hover:text-red">{String(i + 1).padStart(2, "0")}</span>
                  <span className="italic">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
