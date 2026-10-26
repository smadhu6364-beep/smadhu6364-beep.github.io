import Link from "next/link";
import { profile } from "@/lib/data";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/90 backdrop-blur-md supports-[backdrop-filter]:bg-bg/75">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-4 sm:h-[72px] sm:px-8">
        <Link href="/" className="flex min-h-10 items-center gap-3" aria-label={`${profile.short}, ${profile.name}: home`}>
          <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full border border-ink/70 bg-lime pb-0.5 font-serif text-[22px] italic leading-none text-ink">
            m
          </span>
          <span className="hidden text-[15px] font-semibold tracking-tight sm:inline">{profile.name}</span>
          <span className="text-[15px] font-semibold tracking-tight sm:hidden">Madhu</span>
        </Link>
        <nav aria-label="Main" className="ml-auto">
          <ul className="flex items-center gap-1 text-[15px] sm:gap-2">
            <li className="hidden md:block"><Link href="/#work" className="rounded-full px-3 py-2 text-ink/75 hover:text-ink">Work</Link></li>
            <li className="hidden md:block"><Link href="/#about" className="rounded-full px-3 py-2 text-ink/75 hover:text-ink">About</Link></li>
            <li><Link href="/cv/" className="inline-flex min-h-10 items-center rounded-full px-3 text-ink/75 hover:text-ink">Résumé</Link></li>
            <li>
              <a href={`mailto:${profile.email}`} className="link-u inline-flex min-h-10 items-center px-2 font-medium sm:px-3">
                Let&rsquo;s talk <span aria-hidden="true" className="ml-1">↗</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
