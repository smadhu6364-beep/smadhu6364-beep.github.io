// Stylised outline of the Albert Park circuit, Melbourne. Decorative only.
const TRACK =
  "M70 170 L190 172 Q210 172 214 160 L222 140 Q228 128 242 126 L262 122 Q278 118 276 102 L268 70 Q264 52 248 46 L200 30 Q186 26 176 34 L150 56 Q140 64 126 60 L96 50 Q78 44 66 56 L40 86 Q30 98 34 112 L44 150 Q48 168 70 170 Z";

export default function Circuit({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="20 18 270 168" className={className} aria-hidden="true" focusable="false">
      <path d={TRACK} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M118 165 L118 177" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
