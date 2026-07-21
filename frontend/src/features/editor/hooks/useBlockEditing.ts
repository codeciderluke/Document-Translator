import type { Block, TranslationResult } from "@/lib/api";
import { useCallback, useMemo, useRef, useState } from "react";
import { useAutosave } from "@/features/text-translation/hooks/useAutosave";

/** Holds editable translated text per block, versions, and debounced autosave. */
export function useBlockEditing() {
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const versions = useRef<Record<string, number>>({});

  const load = useCallback((r: TranslationResult) => {
    setResult(r);
    const next: Record<string, string> = {};
    r.blocks.forEach((b: Block) => {
      next[b.id] = b.translatedText ?? "";
      versions.current[b.id] = b.version;
    });
    setValues(next);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setValues({});
    versions.current = {};
  }, []);

  const autosave = useAutosave({
    translationId: result?.translationId ?? null,
    getVersion: (id) => versions.current[id] ?? 1,
    onSaved: (id, version) => {
      versions.current[id] = version;
    },
  });

  const handleEdit = useCallback(
    (blockId: string, text: string) => {
      setValues((prev) => ({ ...prev, [blockId]: text }));
      autosave.schedule(blockId, text);
    },
    [autosave],
  );

  const blocks = result?.blocks ?? [];
  const editedBlocks = useMemo(
    () => blocks.map((b) => ({ ...b, translatedText: values[b.id] ?? "" })),
    [blocks, values],
  );
  const combinedText = useMemo(
    () => blocks.map((b) => values[b.id] ?? "").join("\n\n"),
    [blocks, values],
  );

  return {
    result,
    blocks,
    values,
    editedBlocks,
    combinedText,
    saveStatus: autosave.status,
    load,
    reset,
    handleEdit,
  };
}
