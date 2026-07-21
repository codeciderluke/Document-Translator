import { AlertIcon, DownloadIcon, LoaderIcon } from "@/components/icons";
import { ApiError, createExport, exportDownloadUrl } from "@/lib/api";
import { useState } from "react";

const FORMATS = [
  { value: "txt", label: "TXT" },
  { value: "docx", label: "DOCX" },
  { value: "pdf", label: "PDF" },
] as const;

const LAYOUTS = [
  { value: "translated_only", label: "Translation only" },
  { value: "source_then_translation", label: "Source then translation" },
  { value: "side_by_side", label: "Source and translation side by side" },
];

interface Props {
  translationId: string;
  open: boolean;
  onClose: () => void;
}

export function ExportDialog({ translationId, open, onClose }: Props) {
  const [format, setFormat] = useState<(typeof FORMATS)[number]["value"]>("docx");
  const [layout, setLayout] = useState("translated_only");
  const [preserveLayout, setPreserveLayout] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const canPreserve = format === "docx" || format === "pdf";

  const handleExport = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await createExport(
        translationId,
        format,
        layout,
        canPreserve && preserveLayout,
      );
      // Trigger a browser download of the generated file.
      const a = document.createElement("a");
      a.href = exportDownloadUrl(result.exportId);
      a.download = `translation.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-base font-semibold text-content">Export to file</h3>

        <label className="mb-1 block text-xs text-muted">Format</label>
        <div className="mb-4 flex gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFormat(f.value)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                format === f.value
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-surface-2 text-content"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <label className="mb-1 block text-xs text-muted">Layout</label>
        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          disabled={canPreserve && preserveLayout}
          className="mb-3 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-content outline-none focus:border-accent disabled:opacity-50"
        >
          {LAYOUTS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        {canPreserve && (
          <label className="mb-4 flex items-start gap-2 text-sm text-content">
            <input
              type="checkbox"
              checked={preserveLayout}
              onChange={(e) => setPreserveLayout(e.target.checked)}
              className="mt-0.5 accent-accent"
            />
            <span>
              Preserve original layout
              <span className="block text-xs text-muted">
                Keeps the original document (DOCX/PDF) formatting and positions,
                replacing only the text. Applies to uploaded documents only.
              </span>
            </span>
          </label>
        )}

        {error && (
          <div className="mb-3 flex items-center gap-2 text-sm text-danger">
            <AlertIcon />
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm text-content"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-onaccent disabled:opacity-50"
          >
            {busy ? <LoaderIcon /> : <DownloadIcon />}
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
