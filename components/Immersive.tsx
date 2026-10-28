"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

/*
  Page-wide feel, all opt-in through data attributes so the markup stays plain:
  - smooth, weighted scrolling (Lenis), exposed as window.__lenis for menu jumps
  - [data-depth="n"]   moves with the mouse (parallax) and drifts on scroll
  - [data-reveal]      glides in when it enters the viewport
  - [data-tilt]        tilts in 3D under the cursor
  - a custom cursor that grows over links and buttons
  - a faint film grain over everything
  Reduced motion or touch devices get the plain page.
*/
export default function Immersive() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const root = document.documentElement;

    // Reveal on scroll (always on; reduced motion just shows them)
    const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (reduced) reveals.forEach((el) => el.classList.add("is-in"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { threshold: 0.2 },
    );
    if (!reduced) reveals.forEach((el) => io.observe(el));
    if (reduced) return () => io.disconnect();

    // Smooth scroll
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let raf = requestAnimationFrame(function loop(t) { lenis.raf(t); raf = requestAnimationFrame(loop); });

    // Parallax layers: mouse + scroll
    const layers = [...document.querySelectorAll<HTMLElement>("[data-depth]")];
    let mx = 0, my = 0, cx = 0, cy = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      if (dot.current && ring.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        ring.current.style.setProperty("--x", `${e.clientX}px`);
        ring.current.style.setProperty("--y", `${e.clientY}px`);
      }
    };
    let praf = requestAnimationFrame(function loop() {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      const sy = window.scrollY;
      for (const el of layers) {
        const d = Number(el.dataset.depth);
        const fade = Math.max(0, 1 - sy / (window.innerHeight * 0.9));
        el.style.transform = `translate3d(${cx * d * 40}px, ${cy * d * 30 + sy * d * 0.25}px, 0) scale(${1 + (sy / window.innerHeight) * d * 0.15})`;
        el.style.opacity = String(el.dataset.fade === "no" ? 1 : fade);
      }
      if (ring.current) {
        const r = ring.current;
        const tx = parseFloat(r.dataset.tx || "0"), ty = parseFloat(r.dataset.ty || "0");
        const x = parseFloat(r.style.getPropertyValue("--x")) || 0, y = parseFloat(r.style.getPropertyValue("--y")) || 0;
        const nx = tx + (x - tx) * 0.2, ny = ty + (y - ty) * 0.2;
        r.dataset.tx = String(nx); r.dataset.ty = String(ny);
        r.style.transform = `translate(${nx}px, ${ny}px)`;
      }
      praf = requestAnimationFrame(loop);
    });
    window.addEventListener("pointermove", onMove, { passive: true });

    // 3D tilt
    const onTilt = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-tilt]");
      document.querySelectorAll<HTMLElement>("[data-tilt].tilting").forEach((t) => {
        if (t !== el) { t.classList.remove("tilting"); t.style.transform = ""; }
      });
      if (!el) return;
      const b = el.getBoundingClientRect();
      const px = (e.clientX - b.left) / b.width - 0.5, py = (e.clientY - b.top) / b.height - 0.5;
      el.classList.add("tilting");
      el.style.transform = `perspective(900px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg) translateY(-4px)`;
      el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
    };
    window.addEventListener("pointermove", onTilt, { passive: true });

    // Cursor grows over anything clickable
    const onOver = (e: Event) => {
      const hot = (e.target as HTMLElement).closest("a,button");
      ring.current?.classList.toggle("cursor-hot", !!hot);
    };
    if (fine) {
      root.classList.add("has-cursor");
      window.addEventListener("pointerover", onOver, { passive: true });
    }

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(praf);
      lenis.destroy();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointermove", onTilt);
      window.removeEventListener("pointerover", onOver);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} aria-hidden="true" className="cursor-ring" />
      <div ref={dot} aria-hidden="true" className="cursor-dot" />
      <div aria-hidden="true" className="grain" />
    </>
  );
}
