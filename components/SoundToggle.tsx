"use client";
import { useEffect, useState } from "react";
import { onSoundChange, setSound, soundRemembered } from "@/lib/sound";

export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const off = onSoundChange(setOn);
    // If the visitor turned sound on last time, wait for their first click on
    // the page before starting it. Browsers block audio before a gesture anyway.
    if (soundRemembered()) {
      setOn(true);
      const start = () => setSound(true);
      window.addEventListener("pointerdown", start, { once: true });
      window.addEventListener("keydown", start, { once: true });
      return () => {
        off();
        window.removeEventListener("pointerdown", start);
        window.removeEventListener("keydown", start);
      };
    }
    return off;
  }, []);

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => {
        e.stopPropagation();
        setSound(!on);
      }}
      title={on ? "Sound on: soft music and UI sounds" : "Sound off"}
      className="inline-flex h-10 items-center lg:h-9 gap-1.5 rounded-full border border-line px-3 text-xs font-medium text-muted transition hover:text-ink aria-pressed:border-accent aria-pressed:text-accent"
    >
      {on ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/></svg>
      )}
      <span className="hidden sm:inline">Sound</span>
      <span className="sr-only">{on ? "(on)" : "(off)"}</span>
    </button>
  );
}
