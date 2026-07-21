import { patchTranslation } from "@/lib/api";
import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface Options {
  translationId: string | null;
  /** Returns the current known version for a block id. */
  getVersion: (blockId: string) => number;
  /** Called after a successful save so the caller can bump the stored version. */
  onSaved: (blockId: string, newVersion: number) => void;
  delayMs?: number;
}

/**
 * Debounced per-block autosave. Edits to the translated text are queued and
 * flushed via PATCH after the user stops typing.
 */
export function useAutosave({ translationId, getVersion, onSaved, delayMs = 800 }: Options) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const pending = useRef<Map<string, string>>(new Map());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    if (!translationId || pending.current.size === 0) return;
    const edits = Array.from(pending.current.entries());
    pending.current.clear();
    setStatus("saving");
    try {
      for (const [blockId, text] of edits) {
        const result = await patchTranslation(
          translationId,
          [{ id: blockId, translatedText: text }],
          getVersion(blockId),
        );
        const updated = result.blocks.find((b) => b.id === blockId);
        if (updated) onSaved(blockId, updated.version);
      }
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, [translationId, getVersion, onSaved]);

  const schedule = useCallback(
    (blockId: string, text: string) => {
      pending.current.set(blockId, text);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, delayMs);
    },
    [flush, delayMs],
  );

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  return { status, schedule };
}
