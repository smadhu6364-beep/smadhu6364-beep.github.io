import type { DiagramNode } from "@/lib/caseStudies";

/**
 * A small left-to-right flow diagram drawn as inline SVG.
 * Horizontal on wider screens, vertical on phones so the labels stay readable.
 * Colours come from the theme tokens, so it works in light and dark.
 */
export default function PipelineDiagram({ nodes, title }: { nodes: DiagramNode[]; title: string }) {
  const n = nodes.length;
  const uid = title.replace(/\W+/g, "").slice(0, 24);

  // Horizontal layout
  const bw = 132, bh = 64, gap = 28;
  const hw = n * bw + (n - 1) * gap;
  const hh = bh + 8;

  // Vertical layout
  const vw = 280, vbh = 54, vgap = 22;
  const vh = n * vbh + (n - 1) * vgap + 8;

  const box = "fill-surface stroke-line";
  const label = "fill-ink";
  const sub = "fill-muted";
  const arrow = "stroke-accent";

  return (
    <figure role="img" aria-label={`${title}: ${nodes.map((x) => x.label).join(", then ")}`}>
      <svg viewBox={`0 0 ${hw} ${hh}`} className="hidden h-auto w-full sm:block" aria-hidden="true">
        <defs>
          <marker id={`ah-h-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" className="fill-accent" />
          </marker>
        </defs>
        {nodes.map((node, i) => {
          const x = i * (bw + gap);
          return (
            <g key={node.label}>
              <rect x={x + 1} y={4} width={bw - 2} height={bh} rx={10} className={box} strokeWidth={1.5} />
              <rect x={x + 1} y={4} width={4} height={bh} rx={2} className="fill-accent" />
              <text x={x + bw / 2 + 2} y={node.sub ? 32 : 40} textAnchor="middle" fontSize={13} fontWeight={600} className={label}>
                {node.label}
              </text>
              {node.sub && (
                <text x={x + bw / 2 + 2} y={51} textAnchor="middle" fontSize={11} className={sub}>
                  {node.sub}
                </text>
              )}
              {i < n - 1 && (
                <line x1={x + bw + 3} y1={4 + bh / 2} x2={x + bw + gap - 4} y2={4 + bh / 2} className={arrow} strokeWidth={1.75} markerEnd={`url(#ah-h-${uid})`} />
              )}
            </g>
          );
        })}
      </svg>

      <svg viewBox={`0 0 ${vw} ${vh}`} className="mx-auto block h-auto w-full max-w-xs sm:hidden" aria-hidden="true">
        <defs>
          <marker id={`ah-v-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" className="fill-accent" />
          </marker>
        </defs>
        {nodes.map((node, i) => {
          const y = 4 + i * (vbh + vgap);
          return (
            <g key={node.label}>
              <rect x={1} y={y} width={vw - 2} height={vbh} rx={10} className={box} strokeWidth={1.5} />
              <rect x={1} y={y} width={4} height={vbh} rx={2} className="fill-accent" />
              <text x={vw / 2} y={node.sub ? y + 23 : y + 32} textAnchor="middle" fontSize={15} fontWeight={600} className={label}>
                {node.label}
              </text>
              {node.sub && (
                <text x={vw / 2} y={y + 42} textAnchor="middle" fontSize={13} className={sub}>
                  {node.sub}
                </text>
              )}
              {i < n - 1 && (
                <line x1={vw / 2} y1={y + vbh + 2} x2={vw / 2} y2={y + vbh + vgap - 3} className={arrow} strokeWidth={1.75} markerEnd={`url(#ah-v-${uid})`} />
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
