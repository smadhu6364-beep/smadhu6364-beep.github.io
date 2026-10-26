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
      className="inline-flex min-h-10 items-center hover:text-ink"
    >
      Music: {on ? "on" : "off"}
    </button>
  );
}
