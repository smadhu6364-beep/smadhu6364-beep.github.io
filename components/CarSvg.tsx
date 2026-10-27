// Side-on generic open-wheel race car, nose to the right. Car-local units:
// x 0..830, ground at y=0. Generic red, no real team marks.
const FONT = { fontFamily: "var(--font-display), Arial Narrow, sans-serif" };

function Wheel({ spin, r = 62 }: { spin?: (el: SVGGElement | null) => void; r?: number }) {
  const k = r / 62;
  return (
    <g transform={`scale(${k})`}>
      <circle r={62} fill="#0b0b0d" />
      <circle r={59} fill="none" stroke="#1f2024" strokeWidth={4} />
      <circle r={50} fill="none" stroke="#e8e8ea" strokeWidth={2.5} opacity={0.85} />
      <circle r={37} fill="#1c1d21" />
      <g ref={spin}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <rect key={a} x={-2.5} y={-34} width={5} height={28} rx={2.5} fill="#3e4149" transform={`rotate(${a})`} />
        ))}
      </g>
      <circle r={9} fill="#8e929b" />
      <circle r={4} fill="#c8102e" />
    </g>
  );
}

export default function CarSvg({ spins, blur }: { spins?: (el: SVGGElement | null) => void; blur?: string }) {
  return (
    <g>
      <defs>
        <linearGradient id="carPaint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff3b4e" />
          <stop offset=".35" stopColor="#d40018" />
          <stop offset="1" stopColor="#7d0012" />
        </linearGradient>
        <linearGradient id="carPod" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0223a" />
          <stop offset="1" stopColor="#8a0014" />
        </linearGradient>
        <radialGradient id="carShadow"><stop offset="0" stopColor="#000" stopOpacity=".55" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx={410} cy={2} rx={430} ry={12} fill="url(#carShadow)" />
      <g filter={blur}>
        {/* rear wing */}
        <path d="M8,-206 L70,-206 L66,-86 L16,-86 Z" fill="#141518" />
        <path d="M-6,-210 Q36,-228 88,-214 L88,-205 Q40,-216 -4,-200 Z" fill="#c8102e" />
        <path d="M2,-188 Q40,-200 82,-190 L82,-183 Q40,-192 4,-180 Z" fill="#26282e" />
        <line x1={46} y1={-86} x2={64} y2={-104} stroke="#26282e" strokeWidth={6} />
        {/* diffuser and floor */}
        <path d="M34,-40 L120,-40 L104,-18 L44,-26 Z" fill="#0d0e10" />
        <rect x={80} y={-24} width={650} height={9} rx={3} fill="#0d0e10" />
        {/* body */}
        <path
          d="M36,-70 L36,-98 C120,-112 220,-150 300,-178 L318,-198 L354,-198 L364,-160 L374,-128 L470,-122 C540,-116 620,-96 700,-70 L792,-50 L796,-40 L700,-40 C600,-44 520,-50 470,-52 L470,-40 L90,-40 L36,-58 Z"
          fill="url(#carPaint)"
        />
        <path d="M120,-108 C200,-128 260,-152 300,-172" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={2} fill="none" />
        <path d="M300,-178 L66,-118 L66,-108 L296,-160 Z" fill="#a0061a" />
        <text x={186} y={-118} fontSize={30} fontStyle="italic" fontWeight={700} fill="#ffffff" style={FONT} transform="rotate(-12 186 -118)">26</text>
        <rect x={344} y={-196} width={9} height={22} rx={2} fill="#0a0a0c" />
        <rect x={316} y={-206} width={34} height={8} rx={3} fill="#141518" />
        {/* sidepod */}
        <path d="M240,-58 L240,-98 C300,-112 420,-118 476,-110 L476,-64 C430,-54 330,-50 240,-58 Z" fill="url(#carPod)" />
        <ellipse cx={474} cy={-87} rx={7} ry={20} fill="#0a0a0c" />
        <path d="M110,-56 C220,-54 360,-60 476,-66 L476,-60 C360,-52 220,-48 110,-50 Z" fill="#ffffff" opacity={0.9} />
        <text x={262} y={-74} fontSize={30} fontStyle="italic" fontWeight={700} letterSpacing={1.5} fill="#ffffff" style={FONT}>SRINIVAS</text>
        {/* nose */}
        <path d="M470,-121 C540,-115 620,-96 700,-70 L792,-50 L790,-46 L700,-62 C620,-84 540,-104 470,-110 Z" fill="#ff5a6a" opacity={0.55} />
        <text x={598} y={-66} fontSize={24} fontStyle="italic" fontWeight={700} fill="#ffffff" style={FONT} transform="rotate(10 598 -66)">26</text>
        {/* front wing */}
        <path d="M724,-54 L818,-48 L822,-10 L712,-10 Z" fill="#141518" />
        <path d="M690,-16 Q760,-30 830,-26" stroke="#c8102e" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M704,-30 Q766,-44 826,-40" stroke="#2f3238" strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* suspension */}
        <g stroke="#2b2d33" strokeWidth={4} strokeLinecap="round">
          <line x1={480} y1={-62} x2={640} y2={-58} />
          <line x1={500} y1={-96} x2={636} y2={-70} />
          <line x1={36} y1={-74} x2={130} y2={-66} />
        </g>
        {/* driver, halo, mirror */}
        <circle cx={404} cy={-138} r={21} fill="#f1f1f3" />
        <path d="M392,-150 L426,-146 L426,-134 L396,-136 Z" fill="#111216" />
        <path d="M384,-160 L404,-160" stroke="#c8102e" strokeWidth={4} />
        <path d="M360,-140 C378,-176 432,-178 462,-140 L472,-122" stroke="#1a1b1f" strokeWidth={8} fill="none" strokeLinecap="round" />
        <line x1={486} y1={-118} x2={492} y2={-136} stroke="#1a1b1f" strokeWidth={3} />
        <rect x={484} y={-144} width={20} height={9} rx={3} fill="#1a1b1f" />
        <rect x={28} y={-84} width={9} height={7} rx={1} fill="#ff2a3c" />
      </g>
      <g transform="translate(130 -62)"><Wheel spin={spins} /></g>
      <g transform="translate(640 -58)"><Wheel spin={spins} r={58} /></g>
    </g>
  );
}
