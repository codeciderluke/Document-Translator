import { BookIcon, LoaderIcon, PlusIcon, TrashIcon } from "@/components/icons";
import {
  addGlossaryTerm,
  createGlossary,
  deleteGlossary,
  listGlossaries,
  type Glossary,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function GlossaryPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["glossaries"], queryFn: listGlossaries });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["glossaries"] });
  const create = useMutation({
    mutationFn: () => createGlossary(name.trim(), "en"),
    onSuccess: () => {
      setName("");
      invalidate();
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteGlossary(id),
    onSuccess: invalidate,
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <BookIcon />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-content">Glossaries</h1>
          <p className="text-xs text-muted">Define fixed translations to keep terminology consistent</p>
        </div>
      </header>

      <div className="mb-6 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New glossary name"
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-content outline-none focus:border-accent"
        />
        <button
          onClick={() => name.trim() && create.mutate()}
          disabled={!name.trim() || create.isPending}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-onaccent disabled:opacity-50"
        >
          <PlusIcon /> Create
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted">
          <LoaderIcon /> Loading…
        </div>
      )}

      <div className="space-y-4">
        {data?.map((g) => (
          <GlossaryCard key={g.id} glossary={g} onDelete={() => remove.mutate(g.id)} onChanged={invalidate} />
        ))}
      </div>
    </div>
  );
}

function GlossaryCard({
  glossary,
  onDelete,
  onChanged,
}: {
  glossary: Glossary;
  onDelete: () => void;
  onChanged: () => void;
}) {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");

  const add = useMutation({
    mutationFn: () => addGlossaryTerm(glossary.id, source.trim(), target.trim()),
    onSuccess: () => {
      setSource("");
      setTarget("");
      onChanged();
    },
  });

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-content">{glossary.name}</h2>
          <span className="text-xs text-muted">
            {glossary.sourceLanguage} → {glossary.targetLanguage} · {glossary.terms.length} terms
          </span>
        </div>
        <button
          onClick={onDelete}
          aria-label="Delete glossary"
          className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
        >
          <TrashIcon />
        </button>
      </div>

      {glossary.terms.length > 0 && (
        <ul className="mb-3 space-y-1">
          {glossary.terms.map((t) => (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <span className="rounded bg-surface-2 px-2 py-0.5 text-content">{t.sourceTerm}</span>
              <span className="text-muted">→</span>
              <span className="rounded bg-accent/15 px-2 py-0.5 text-accent">{t.targetTerm}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source term"
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-content outline-none focus:border-accent"
        />
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target term"
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-content outline-none focus:border-accent"
        />
        <button
          onClick={() => source.trim() && target.trim() && add.mutate()}
          disabled={!source.trim() || !target.trim() || add.isPending}
          className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-content hover:border-accent hover:text-accent disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}
