import { FileTextIcon, HistoryIcon, LoaderIcon, TrashIcon } from "@/components/icons";
import { deleteJob, listJobs, type JobSummary } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const STATUS_STYLE: Record<string, string> = {
  COMPLETED: "bg-success/15 text-success",
  FAILED: "bg-danger/15 text-danger",
  CANCELLED: "bg-surface-2 text-muted",
};

const STATUS_LABEL: Record<string, string> = {
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  TRANSLATING: "Translating",
  QUEUED: "Queued",
  ANALYZING: "Analyzing",
  OCR_PROCESSING: "OCR",
};

export function HistoryPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["jobs"], queryFn: listJobs });

  const remove = useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <HistoryIcon />
        </div>
        <h1 className="text-lg font-semibold text-content">History</h1>
      </header>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted">
          <LoaderIcon /> Loading…
        </div>
      )}

      {data && data.length === 0 && (
        <p className="rounded-xl border border-border bg-surface px-4 py-10 text-center text-sm text-muted">
          No translation jobs yet.
        </p>
      )}

      <ul className="space-y-2">
        {data?.map((job: JobSummary) => (
          <li
            key={job.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3"
          >
            <FileTextIcon className="text-muted" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-content">
                {job.fileName ?? (job.inputType === "text" ? "Text translation" : "Document")}
              </div>
              <div className="text-xs text-muted">
                {new Date(job.createdAt).toLocaleString("en-US")} ·{" "}
                {job.characterCount.toLocaleString()} chars
                {job.detectedLanguage && ` · ${job.detectedLanguage.toUpperCase()}`}
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs ${
                STATUS_STYLE[job.status] ?? "bg-accent/15 text-accent"
              }`}
            >
              {STATUS_LABEL[job.status] ?? job.status}
            </span>
            {job.translationId && job.status === "COMPLETED" && (
              <Link
                to={`/translations/${job.translationId}`}
                className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-content hover:border-accent hover:text-accent"
              >
                Open
              </Link>
            )}
            <button
              onClick={() => remove.mutate(job.id)}
              aria-label="Delete"
              className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
