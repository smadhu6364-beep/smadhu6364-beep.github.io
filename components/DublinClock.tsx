"use client";

import { useEffect, useState } from "react";

// Live Dublin time and date, e.g. "21:59" / "WED 28 OCT · DUBLIN".
const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IE", { timeZone: "Europe/Dublin", ...opts });

export default function DublinClock({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return <span className={className}>&nbsp;</span>;
  const time = fmt({ hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  const day = fmt({ weekday: "short", day: "numeric", month: "short" }).formatToParts(now);
  const get = (t: string) => day.find((p) => p.type === t)?.value ?? "";
  return (
    <span className={className}>
      <span className="block text-3xl leading-none tabular-nums">{time}</span>
      <span className="mt-1 block text-[10px] tracking-[0.25em]">{`${get("weekday")} ${get("day")} ${get("month")}`.toUpperCase()} · DUBLIN</span>
    </span>
  );
}
