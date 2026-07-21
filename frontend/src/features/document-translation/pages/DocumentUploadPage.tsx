import { AlertIcon, UploadIcon } from "@/components/icons";
import { ProgressBar } from "@/components/ProgressBar";
import { ApiError, getUploadLimits, uploadDocument } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileDropzone } from "../components/FileDropzone";

const SOURCE_OPTIONS = [
  { value: "auto", label: "Auto-detect" },
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh-CN", label: "Chinese (Simplified)" },
  { value: "zh-TW", label: "Chinese (Traditional)" },
];

const TARGET_OPTIONS = [
  { value: "ko", label: "Korean" },
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese" },
  { value: "zh-CN", label: "Chinese (Simplified)" },
  { value: "zh-TW", label: "Chinese (Traditional)" },
];

export function DocumentUploadPage() {
  const navigate = useNavigate();
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("ko");
  const [error, setError] = useState<string | null>(null);
  const [percent, setPercent] = useState(0);

  const limits = useQuery({ queryKey: ["upload-limits"], queryFn: getUploadLimits });

  const upload = useMutation({
    mutationFn: (file: File) =>
      uploadDocument(file, sourceLanguage, targetLanguage, null, setPercent),
    onMutate: () => setPercent(0),
    onSuccess: (res) => navigate(`/jobs/${res.jobId}`),
    onError: (e) =>
      setError(e instanceof ApiError ? e.message : "Upload failed."),
  });

  const accepted = limits.data?.acceptedExtensions ?? [
    ".txt",
    ".docx",
    ".pdf",
    ".hwpx",
  ];
  const maxSizeMb = limits.data?.maxUploadSizeMb ?? 50;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <UploadIcon />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-content">Document Translation</h1>
          <p className="text-xs text-muted">Upload TXT · DOCX · PDF · HWPX</p>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted">Source</span>
        <select
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
          className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-content outline-none focus:border-accent"
        >
          {SOURCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="text-muted">→ Target</span>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-content outline-none focus:border-accent"
        >
          {TARGET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {upload.isPending ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface px-8 py-16">
          <div className="w-full max-w-sm">
            <ProgressBar value={percent} />
          </div>
          <span className="text-sm text-muted">
            {percent < 100 ? `Uploading… ${percent}%` : "Preparing translation job…"}
          </span>
        </div>
      ) : (
        <FileDropzone
          onFile={(f) => {
            setError(null);
            upload.mutate(f);
          }}
          accept={accepted}
          maxSizeMb={maxSizeMb}
        />
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm text-danger">
          <AlertIcon />
          <span>{error}</span>
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        Uploaded documents are processed on the server, and the source and result
        files are managed according to the retention policy. Be careful when
        uploading documents that contain sensitive information.
      </p>
    </div>
  );
}
