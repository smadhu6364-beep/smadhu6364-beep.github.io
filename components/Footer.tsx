import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-carbon-950 pb-24 pt-8 lg:pb-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-sm text-mute sm:flex-row sm:items-center sm:justify-between lg:pr-[300px]">
        <p>© 2026 Madhu Sudhan Srinivas · <Link href="/cv/" className="underline hover:text-papaya">Plain CV view</Link></p>
        <p className="text-xs">Fan-made racing theme. Not affiliated with Formula 1 or the FIA.</p>
      </div>
    </footer>
  );
}
