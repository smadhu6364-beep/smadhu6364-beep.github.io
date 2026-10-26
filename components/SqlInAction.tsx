"use client";
import { useRef, useState } from "react";
import { fileUrl, highlight, snippets } from "@/lib/sqlSnippets";

export default function SqlInAction() {
  const [i, setI] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = snippets[i];

  function onKey(e: React.KeyboardEvent, idx: number) {
    let n = idx;
    if (e.key === "ArrowRight") n = (idx + 1) % snippets.length;
    else if (e.key === "ArrowLeft") n = (idx - 1 + snippets.length) % snippets.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = snippets.length - 1;
    else return;
    e.preventDefault();
    setI(n);
    tabs.current[n]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="SQL queries" className="flex flex-wrap gap-2">
        {snippets.map((t, idx) => (
          <button
            key={t.id}
            ref={(el) => { tabs.current[idx] = el; }}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={idx === i}
            aria-controls={`panel-${t.id}`}
            tabIndex={idx === i ? 0 : -1}
            onClick={() => setI(idx)}
            onKeyDown={(e) => onKey(e, idx)}
            className="pill shrink-0"
          >
            {t.tab}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${s.id}`} aria-labelledby={`tab-${s.id}`} className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 text-[13px]">
            <span className="font-medium">sql/{s.file}</span>
            <a href={fileUrl(s.file)} target="_blank" rel="noopener noreferrer" className="link-u inline-flex min-h-8 items-center text-muted hover:text-ink">
              Full file on GitHub <span aria-hidden="true" className="ml-1">↗</span><span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <pre tabIndex={0} aria-label={`SQL from ${s.file}`} className="sql max-h-[26rem] overflow-auto p-4"><code>
            {highlight(s.sql).map(([c, t], j) => (c ? <span key={j} className={c}>{t}</span> : t))}
          </code></pre>
        </div>

        <div className="min-w-0">
          <p className="label">What it answers</p>
          <p className="mt-2 text-[17px] leading-relaxed">{s.answers}</p>
          <p className="label mt-6">{s.rowsLabel}</p>
          <div className="mt-2 overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full text-left text-[13px] tabular-nums">
              <caption className="sr-only">{s.rowsLabel} from results/{s.file.replace(".sql", ".csv")}</caption>
              <thead className="bg-sage/60 text-ink/80">
                <tr>{s.columns.map((c) => <th key={c} scope="col" className="whitespace-nowrap px-3 py-2 font-medium">{c}</th>)}</tr>
              </thead>
              <tbody>
                {s.rows.map((r, j) => (
                  <tr key={j} className="border-t border-line">
                    {r.map((v, m) => <td key={m} className="whitespace-nowrap px-3 py-2">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[13px] text-muted">From results/{s.file.replace(".sql", ".csv")}, run in DuckDB.</p>
        </div>
      </div>
    </div>
  );
}
