import type { Block } from "@/lib/api";
import { useState } from "react";

interface Props {
  blocks: Block[];
  values: Record<string, string>;
  onEdit: (blockId: string, text: string) => void;
  loading?: boolean;
}

type ViewMode = "separated" | "continuous";

export function TranslatedBlocksEditor({ blocks, values, onEdit, loading }: Props) {
  const [mode, setMode] = useState<ViewMode>("separated");
  const joined = blocks.map((b) => values[b.id] ?? "").join("\n\n");

  // Map a continuous edit back onto blocks; the last block absorbs any overflow
  // so text is never lost when paragraph breaks are added/removed.
  const handleContinuousEdit = (text: string) => {
    const parts = text.split("\n\n");
    blocks.forEach((b, i) => {
      const next =
        i < blocks.length - 1 ? (parts[i] ?? "") : parts.slice(i).join("\n\n");
      if ((values[b.id] ?? "") !== next) onEdit(b.id, next);
    });
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface shadow-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 no-print">
        <h2 className="text-sm font-medium text-content">Translation</h2>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 p-0.5 text-xs">
          {(["separated", "continuous"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-md px-2.5 py-1 capitalize transition-colors ${
                mode === m ? "bg-accent text-onaccent" : "text-muted hover:text-content"
              }`}
            >
              {m === "separated" ? "Separated" : "Continuous"}
            </button>
          ))}
        </div>
      </div>

      <div className="print-area flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {loading && <SkeletonBlocks />}

        {!loading && blocks.length === 0 && (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted">
            Enter source text and press <span className="mx-1 text-accent">Translate</span>
            to see the result here.
          </div>
        )}

        {!loading && blocks.length > 0 && mode === "continuous" && (
          <textarea
            value={joined}
            onChange={(e) => handleContinuousEdit(e.target.value)}
            spellCheck={false}
            aria-label="Translation (continuous)"
            className="h-full min-h-[300px] w-full resize-none whitespace-pre-wrap rounded-md bg-transparent text-[15px] leading-relaxed text-content outline-none"
          />
        )}

        {!loading &&
          mode === "separated" &&
          blocks.map((block) => (
            <div
              key={block.id}
              className="rounded-lg border border-border/60 bg-surface-2/40 p-3"
            >
              <p className="mb-2 whitespace-pre-wrap text-xs text-muted no-print">
                {block.sourceText}
              </p>
              <textarea
                value={values[block.id] ?? ""}
                onChange={(e) => onEdit(block.id, e.target.value)}
                rows={Math.max(2, (values[block.id] ?? "").split("\n").length)}
                spellCheck={false}
                aria-label={`Translated paragraph ${block.sequence + 1}`}
                className="w-full resize-none rounded-md bg-transparent text-[15px] leading-relaxed text-content outline-none focus:bg-surface-2"
              />
            </div>
          ))}
      </div>
    </div>
  );
}

function SkeletonBlocks() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse rounded-lg bg-surface-2/60 p-3">
          <div className="mb-2 h-3 w-2/3 rounded bg-border" />
          <div className="h-4 w-full rounded bg-border" />
        </div>
      ))}
    </div>
  );
}
