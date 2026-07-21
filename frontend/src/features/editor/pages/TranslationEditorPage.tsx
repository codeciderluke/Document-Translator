import { CopyIcon, DownloadIcon, LoaderIcon, PrinterIcon } from "@/components/icons";
import { getTranslation } from "@/lib/api";
import { copyText } from "@/lib/download";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TranslatedBlocksEditor } from "@/features/text-translation/components/TranslatedBlocksEditor";
import { ExportDialog } from "@/features/exports/ExportDialog";
import { useBlockEditing } from "../hooks/useBlockEditing";

const SAVE_LABEL: Record<string, string> = {
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
  idle: "",
};

export function TranslationEditorPage() {
  const { id } = useParams();
  const editor = useBlockEditing();
  const [exportOpen, setExportOpen] = useState(false);

  const query = useQuery({
    queryKey: ["translation", id],
    queryFn: () => getTranslation(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.data) editor.load(query.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  if (query.isLoading) {
    return (
      <div className="flex items-center gap-2 p-6 text-muted">
        <LoaderIcon /> Loading translation…
      </div>
    );
  }

  const lowConfidence = editor.blocks.filter(
    (b) => b.ocrConfidence != null && b.ocrConfidence < 0.6,
  ).length;

  return (
    <div className="mx-auto flex h-full max-w-[1100px] flex-col gap-4 p-6">
      <header className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-content">Edit Translation</h1>
          <p className="text-xs text-muted">
            {editor.blocks.length} paragraphs
            {lowConfidence > 0 && (
              <span className="ml-2 text-danger">
                · {lowConfidence} need review (low OCR confidence)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-1 text-xs text-muted">{SAVE_LABEL[editor.saveStatus]}</span>
          <button
            onClick={() => void copyText(editor.combinedText)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-content hover:border-accent hover:text-accent"
          >
            <CopyIcon /> Copy
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-content hover:border-accent hover:text-accent"
          >
            <PrinterIcon /> Print
          </button>
          {id && (
            <button
              onClick={() => setExportOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-onaccent"
            >
              <DownloadIcon /> Export
            </button>
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <TranslatedBlocksEditor
          blocks={editor.blocks}
          values={editor.values}
          onEdit={editor.handleEdit}
        />
      </div>

      {id && (
        <ExportDialog
          translationId={id}
          open={exportOpen}
          onClose={() => setExportOpen(false)}
        />
      )}
    </div>
  );
}
