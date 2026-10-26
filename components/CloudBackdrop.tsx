// Fixed page background in the style of iCloud.com: soft, slowly drifting
// colour glows (Apple blue, purple, pink, teal) on a light grey canvas, with a
// faint highlight at the top. Cards above it use frosted glass (see globals.css).
// Decorative only; the drift stops for visitors who prefer reduced motion.
export default function CloudBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="cloud-blob cloud-blue" />
      <div className="cloud-blob cloud-purple" />
      <div className="cloud-blob cloud-pink" />
      <div className="cloud-blob cloud-teal" />
      {/* soft top highlight, like light through frosted glass */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/60 to-transparent dark:from-white/[0.04]" />
    </div>
  );
}
