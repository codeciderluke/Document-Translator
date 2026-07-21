import { AlertIcon, LanguagesIcon, LoaderIcon, RefreshIcon } from "@/components/icons";
import { ProgressBar } from "@/components/ProgressBar";
import { ApiError, type Block, type TranslationResult } from "@/lib/api";
import { blocksToText, copyText, downloadTxt } from "@/lib/download";
import { useCallback, useMemo, useRef, useState } from "react";
import { LanguageSelector } from "../components/LanguageSelector";
import { ResultToolbar } from "../components/ResultToolbar";
import { SourceTextEditor } from "../components/SourceTextEditor";
import { TranslatedBlocksEditor } from "../components/TranslatedBlocksEditor";
import { useTranslateText } from "../api/textTranslationApi";
import { useAutosave } from "../hooks/useAutosave";

const MAX_CHARS = 100_000;

export function TextTranslationPage() {
  const [sourceText, setSourceText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("ko");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const versions = useRef<Record<string, number>>({});

  const onTranslated = useCallback((r: TranslationResult) => {
    setResult(r);
    const nextValues: Record<string, string> = {};
    r.blocks.forEach((b: Block) => {
      nextValues[b.id] = b.translatedText ?? "";
      versions.current[b.id] = b.version;
    });
    setValues(nextValues);
  }, []);

  const translation = useTranslateText(onTranslated);

  const autosave = useAutosave({
    translationId: result?.translationId ?? null,
    getVersion: (id) => versions.current[id] ?? 1,
    onSaved: (id, version) => {
      versions.current[id] = version;
    },
  });

  const blocks = result?.blocks ?? [];
  const hasResult = blocks.length > 0;
  const charCount = sourceText.length;

  const handleTranslate = () => {
    if (!sourceText.trim()) return;
    translation.mutate({ sourceText, sourceLanguage, targetLanguage });
  };

  const handleSwap = () => {
    if (sourceLanguage === "auto") return;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const handleReset = () => {
    setSourceText("");
    setResult(null);
    setValues({});
    versions.current = {};
    translation.reset();
  };

  const handleEdit = (blockId: string, text: string) => {
    setValues((prev) => ({ ...prev, [blockId]: text }));
    autosave.schedule(blockId, text);
  };

  const combinedText = useMemo(
    () => blocks.map((b) => values[b.id] ?? "").join("\n\n"),
    [blocks, values],
  );

  const errorMessage =
    translation.error instanceof ApiError
      ? translation.error.message
      : translation.error
        ? "An error occurred during translation."
        : null;

  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-4 p-5">
      <header className="no-print flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <LanguagesIcon />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-content">Document Translator</h1>
          <p className="text-xs text-muted">
            Translate between English, Japanese, Korean, and Chinese
          </p>
        </div>
      </header>

      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
        <LanguageSelector
          source={sourceLanguage}
          target={targetLanguage}
          detected={result?.detectedLanguage ?? null}
          onSourceChange={setSourceLanguage}
          onTargetChange={setTargetLanguage}
          onSwap={handleSwap}
          disabled={translation.isPending}
        />
        <ResultToolbar
          disabled={!hasResult}
          saveStatus={autosave.status}
          onCopy={() => void copyText(combinedText)}
          onDownloadTxt={() => downloadTxt(blocksToText(blocks.map((b) => ({ ...b, translatedText: values[b.id] ?? "" }))))}
          onPrint={() => window.print()}
        />
      </div>

      {errorMessage && (
        <div className="no-print flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm text-danger">
          <AlertIcon />
          <span>{errorMessage}</span>
        </div>
      )}

      {translation.isPending && (
        <div className="no-print flex items-center gap-3">
          <ProgressBar indeterminate className="flex-1" />
          <span className="text-xs text-muted">Translating…</span>
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <SourceTextEditor
          value={sourceText}
          onChange={setSourceText}
          disabled={translation.isPending}
          maxChars={MAX_CHARS}
        />
        <TranslatedBlocksEditor
          blocks={blocks}
          values={values}
          onEdit={handleEdit}
          loading={translation.isPending}
        />
      </div>

      <footer className="no-print flex items-center justify-between gap-3">
        <span className="text-sm text-muted">
          {charCount.toLocaleString()} chars
          {charCount >= MAX_CHARS && (
            <span className="ml-2 text-danger">Character limit reached</span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={translation.isPending || (!sourceText && !hasResult)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm text-content transition-colors hover:border-accent disabled:opacity-40"
          >
            <RefreshIcon />
            Reset
          </button>
          <button
            type="button"
            onClick={handleTranslate}
            disabled={translation.isPending || !sourceText.trim()}
            className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-onaccent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {translation.isPending ? <LoaderIcon /> : <LanguagesIcon />}
            {translation.isPending ? "Translating…" : "Translate"}
          </button>
        </div>
      </footer>
    </div>
  );
}
