import { AlertIcon, CheckIcon, LoaderIcon } from "@/components/icons";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJobPolling } from "../hooks/useJobPolling";

const STEPS = [
  { key: "QUEUED", label: "Queued" },
  { key: "ANALYZING", label: "Analyzing document" },
  { key: "OCR_PROCESSING", label: "OCR processing" },
  { key: "TRANSLATING", label: "Translating" },
  { key: "COMPLETED", label: "Completed" },
];

const STEP_ORDER: Record<string, number> = {
  QUEUED: 0,
  ANALYZING: 1,
  OCR_PROCESSING: 2,
  TRANSLATING: 3,
  REBUILDING: 3,
  COMPLETED: 4,
};

export function JobProgressPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { data: job } = useJobPolling(jobId);

  useEffect(() => {
    if (job?.status === "COMPLETED" && job.translationId) {
      const t = setTimeout(() => navigate(`/translations/${job.translationId}`), 700);
      return () => clearTimeout(t);
    }
  }, [job?.status, job?.translationId, navigate]);

  const current = job ? (STEP_ORDER[job.status] ?? 0) : 0;
  const failed = job?.status === "FAILED";

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-1 text-lg font-semibold text-content">Translation Progress</h1>
      <p className="mb-6 text-xs text-muted">{job?.fileName ?? "Document"}</p>

      {!job && (
        <div className="flex items-center gap-2 text-muted">
          <LoaderIcon /> Loading status…
        </div>
      )}

      {job && !failed && (
        <>
          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <ol className="space-y-3">
            {STEPS.map((step, i) => {
              const done = i < current;
              const active = i === current;
              return (
                <li key={step.key} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      done
                        ? "bg-success/20 text-success"
                        : active
                          ? "bg-accent/20 text-accent"
                          : "bg-surface-2 text-muted"
                    }`}
                  >
                    {done ? <CheckIcon width={14} height={14} /> : active ? <LoaderIcon width={14} height={14} /> : i + 1}
                  </span>
                  <span className={active ? "text-content" : done ? "text-muted" : "text-muted"}>
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
          {job.currentStep && (
            <p className="mt-4 text-sm text-muted">{job.currentStep}…</p>
          )}
        </>
      )}

      {failed && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 p-5">
          <div className="mb-2 flex items-center gap-2 text-danger">
            <AlertIcon />
            <span className="font-medium">Translation failed</span>
          </div>
          <p className="text-sm text-content">{job?.error}</p>
          {job?.errorCode && (
            <p className="mt-1 text-xs text-muted">Error code: {job.errorCode}</p>
          )}
          <button
            onClick={() => navigate("/translate/document")}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-onaccent"
          >
            Upload again
          </button>
        </div>
      )}
    </div>
  );
}
