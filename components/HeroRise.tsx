"use client";
import { useEffect, useRef } from "react";

/**
 * Scales the hero device from 0.85 to 1 and lifts it as the page scrolls.
 * Browsers with scroll-driven animations do it in CSS (.hero-rise in globals.css).
 * Others get a small rAF scroll handler that only runs while the hero is on screen.
 * With reduced motion, or no JS, it simply sits at full size.
 */
export default function HeroRise({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (CSS.supports("animation-timeline: scroll()")) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("hero-rise-js");
    let raf = 0;
    let visible = true;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.6)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className="hero-rise">
      {children}
    </div>
  );
}
