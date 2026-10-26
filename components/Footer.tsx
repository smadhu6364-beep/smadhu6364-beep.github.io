import Link from "next/link";
import { profile } from "@/lib/data";
import SoundToggle from "./SoundToggle";
import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1240px] px-4 pb-10 pt-8 sm:px-8">
      <div className="flex flex-col gap-4 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-medium text-ink">{profile.name}</span> · A portfolio <span className="serif-i text-[1.05em]">in progress</span>
        </p>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <li><a className="inline-flex min-h-10 items-center hover:text-ink" href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a className="inline-flex min-h-10 items-center hover:text-ink" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><Link className="inline-flex min-h-10 items-center hover:text-ink" href="/cv/">Résumé</Link></li>
          <li><SoundToggle /></li>
          <li><ThemeToggle /></li>
        </ul>
      </div>
      <p className="mt-3 text-xs text-muted">Every number here comes from my CV or the project files. The music is made in your browser and stays off until you turn it on.</p>
    </footer>
  );
}
