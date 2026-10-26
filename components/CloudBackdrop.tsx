// Fixed page background: Lewis Hamilton at Silverstone, crossfading slowly,
// colour-graded to a warm sunset so the frosted cards and text sit on top.
// The photos are daytime shots; the sunset look comes from the grading layer.
// Photos: Jen Ross and Andrew & Alan Frost, CC BY 2.0, via Wikimedia Commons
// (credited in the footer). Decorative only; the crossfade stops for
// visitors who prefer reduced motion.
export const BG_PHOTOS = ["hamilton-2024", "hamilton-wave", "hamilton-2016", "hamilton-low"];

export default function CloudBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="race-photos">
        {BG_PHOTOS.map((name, i) => (
          <div
            key={name}
            className="race-photo"
            style={{ backgroundImage: `url(/bg/${name}.webp)`, animationDelay: `${i * 8}s` }}
          />
        ))}
      </div>
      {/* golden-hour grade: amber sky into pink into dusk purple */}
      <div className="sunset-grade" />
      {/* wash so the photos sit back behind the content */}
      <div className="race-wash" />
    </div>
  );
}
