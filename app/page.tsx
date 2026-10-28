import { Anton, Bodoni_Moda } from "next/font/google";
import { profile } from "@/lib/data";

import MenuButton from "@/components/MenuButton";
import VtThemeToggle from "@/components/VtThemeToggle";
import RaceMusic from "@/components/RaceMusic";
import WhatsAppButton from "@/components/WhatsAppButton";
import DublinClock from "@/components/DublinClock";
import CarLoader from "@/components/CarLoader";
import Journey from "@/components/Journey";
import { L } from "@/lib/dummy";

const display = Bodoni_Moda({ subsets: ["latin"], weight: ["500", "700"], style: ["normal", "italic"], display: "swap" });
const block = Anton({ subsets: ["latin"], weight: "400", display: "swap" });


const NAV = [
  ["About", "#about"],
  ["Education", "#education"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Off the clock", "#hobbies"],
  ["Contact", "#contact"],
];

function Contours({ stroke, opacity = 0.18 }: { stroke: string; opacity?: number }) {
  const rings = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke={stroke} strokeOpacity={opacity} strokeWidth="1.2">
        {rings.map((i) => (
          <path key={"a" + i} d={`M ${180 - i * 34} ${260} C ${180 - i * 34} ${120 - i * 30}, ${420 + i * 30} ${110 - i * 26}, ${470 + i * 28} ${250} S ${330 + i * 22} ${470 + i * 30}, ${200 - i * 30} ${400 + i * 18} Z`} />
        ))}
        {rings.map((i) => (
          <path key={"b" + i} d={`M ${880 - i * 30} ${560} C ${860 - i * 36} ${420 - i * 30}, ${1080 + i * 30} ${380 - i * 26}, ${1110 + i * 30} ${540} S ${1020 + i * 24} ${740 + i * 26}, ${890 - i * 34} ${650 + i * 20} Z`} />
        ))}
        {rings.map((i) => (
          <path key={"c" + i} d={`M -40 ${700 - i * 40} C 300 ${640 - i * 46}, 520 ${780 - i * 40}, 760 ${700 - i * 44} S 1100 ${600 - i * 40}, 1260 ${660 - i * 42}`} />
        ))}
      </g>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="vt">
      <CarLoader />
      <WhatsAppButton />
      {/* Fixed chrome */}
      {/* Logo sits outside the header so its blend mode sees the page behind it */}
      <a href="#top" className={`${display.className} fixed left-4 top-4 z-40 leading-[0.8] sm:left-8 text-white mix-blend-difference`} aria-label="Madhu Sudhan, home">
        <span className="block text-[26px] tracking-tight">MADHU</span>
        <span className={`${block.className} block text-[13px] tracking-wide`}>SUDHAN</span>
      </a>
      <span aria-hidden="true" className={`${display.className} fixed left-1/2 top-5 z-40 hidden -translate-x-1/2 text-xl italic sm:block text-white mix-blend-difference`}>
        MS
      </span>
      <header className="fixed inset-x-0 top-0 z-40 flex items-start justify-end px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <a href="/cv" className={`${block.className} rounded-md bg-red px-4 py-2.5 text-sm tracking-wider text-white shadow-sm transition hover:brightness-110`}>
            CV
          </a>
          <RaceMusic />
          <VtThemeToggle />
          <MenuButton items={NAV} fontClass={display.className} />
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-sky pt-20">
          <h1 className="relative z-0 select-none text-center">
            <span className={`${display.className} block text-[26vw] font-medium leading-[0.8] text-red sm:text-[19vw]`}>MADHU</span>
            <span className={`${block.className} -mt-[2vw] block text-[17vw] leading-[0.9] text-navy sm:text-[13vw]`}>SUDHAN</span>
          </h1>
          <p className={`${block.className} absolute bottom-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm bg-deep px-4 py-2 text-[11px] tracking-[0.2em] text-white`}>
            DATA ANALYST. DUBLIN BASED.
          </p>
          <DublinClock className={`${block.className} absolute left-4 top-24 z-10 text-navy sm:left-8 sm:top-28`} />
          <div className="absolute bottom-6 left-4 z-20 hidden w-36 rounded-md border border-navy/30 bg-card/50 p-3 text-center text-navy backdrop-blur sm:left-8 sm:block">
            <p className={`${block.className} text-[10px] tracking-widest`}>NOW</p>
            <p className={`${display.className} mt-2 text-lg leading-tight`}>MSc Business Analytics</p>
            <p className={`${block.className} mt-2 text-[10px] tracking-widest`}>DCU · 2026</p>
          </div>
          <p className={`${block.className} absolute bottom-24 right-4 z-20 text-[22vw] sm:bottom-2 leading-none text-red sm:right-32 sm:text-[9vw]`} aria-hidden="true">
            26
          </p>
        </section>

        {/* About */}
        <section id="about" className="relative overflow-hidden bg-deep px-4 py-28 text-center text-mist sm:px-8 sm:py-40">
          <Contours stroke="#6f8fc7" />
          <div className="relative mx-auto max-w-5xl">
            <p className={`${block.className} text-xs tracking-[0.3em]`}>ABOUT ME</p>
            <h2 className={`${block.className} mt-8 text-[11vw] leading-[0.95] sm:text-[6.4vw]`}>
              STARTED IN <span className={`${display.className} italic font-medium`}>OPERATIONS.</span>
              <br />
              BUILT ON <span className={`${display.className} italic font-medium`}>DATA.</span>
              <br />
              NOW IN DUBLIN.
              <br />
              STILL ASKING <span className={`${display.className} italic font-medium text-red`}>WHY.</span>
            </h2>
            <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-mist/80">
              {L}
            </p>
          </div>
        </section>

        <Journey display={display.className} block={block.className} />

        {/* Contact */}
        <footer id="contact" className="bg-red px-4 py-20 text-white sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`${block.className} text-xs tracking-[0.3em]`}>CONTACT</p>
              <p className={`${display.className} mt-4 text-5xl italic sm:text-7xl`}>Let&rsquo;s talk data.</p>
            </div>
            <ul className={`${block.className} space-y-2 text-lg tracking-wider`}>
              <li><a className="hover:underline" href={`mailto:${profile.email}`}>{profile.email.toUpperCase()}</a></li>
              <li><a className="hover:underline" href={profile.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a></li>
              <li><a className="hover:underline" href={profile.github} target="_blank" rel="noreferrer">GITHUB ↗</a></li>
            </ul>
          </div>
          <p className="mx-auto mt-14 max-w-6xl text-xs text-white/70">© 2026 Madhu Sudhan · {profile.location}</p>
        </footer>
      </main>
    </div>
  );
}
