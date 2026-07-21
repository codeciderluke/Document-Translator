import { z } from "zod";
import { API_BASE, ApiError, putWithProgress, requestJson, requestVoid } from "./http";

export { ApiError };

/* ---------- Translation blocks & results ---------- */

export const BlockSchema = z.object({
  id: z.string(),
  sequence: z.number(),
  blockType: z.string().optional(),
  pageNumber: z.number().nullable().optional(),
  sourceText: z.string(),
  translatedText: z.string().nullable(),
  ocrConfidence: z.number().nullable().optional(),
  version: z.number(),
});
export type Block = z.infer<typeof BlockSchema>;

export const TranslationResultSchema = z.object({
  jobId: z.string(),
  translationId: z.string(),
  status: z.string(),
  sourceLanguage: z.string(),
  detectedLanguage: z.string().nullable(),
  targetLanguage: z.string(),
  blocks: z.array(BlockSchema),
});
export type TranslationResult = z.infer<typeof TranslationResultSchema>;

export interface TranslateTextInput {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage?: string;
  glossaryId?: string | null;
}

export function translateText(input: TranslateTextInput): Promise<TranslationResult> {
  const { glossaryId, ...rest } = input;
  return requestJson(
    "/translations/text",
    {
      method: "POST",
      body: JSON.stringify({ targetLanguage: "ko", ...rest, options: { glossaryId } }),
    },
    TranslationResultSchema,
  );
}

export function getTranslation(id: string): Promise<TranslationResult> {
  return requestJson(`/translations/${id}`, { method: "GET" }, TranslationResultSchema);
}

export interface BlockEdit {
  id: string;
  translatedText: string;
}

export function patchTranslation(
  id: string,
  blocks: BlockEdit[],
  version: number,
): Promise<TranslationResult> {
  return requestJson(
    `/translations/${id}`,
    { method: "PATCH", body: JSON.stringify({ blocks, version }) },
    TranslationResultSchema,
  );
}

/* ---------- Uploads & document jobs ---------- */

const PresignSchema = z.object({
  uploadId: z.string(),
  uploadUrl: z.string(),
  objectKey: z.string(),
  mode: z.string(),
  expiresIn: z.number(),
});

const UploadLimitsSchema = z.object({
  maxUploadSizeMb: z.number(),
  acceptedExtensions: z.array(z.string()),
});
export type UploadLimits = z.infer<typeof UploadLimitsSchema>;

export function getUploadLimits(): Promise<UploadLimits> {
  return requestJson("/uploads/limits", { method: "GET" }, UploadLimitsSchema);
}

const DocumentJobSchema = z.object({
  jobId: z.string(),
  translationId: z.string(),
  status: z.string(),
});

export async function uploadDocument(
  file: File,
  sourceLanguage: string,
  targetLanguage = "ko",
  glossaryId?: string | null,
  onProgress?: (percent: number) => void,
): Promise<z.infer<typeof DocumentJobSchema>> {
  const presign = await requestJson(
    "/uploads/presign",
    {
      method: "POST",
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        fileSize: file.size,
      }),
    },
    PresignSchema,
  );

  const bytes = await file.arrayBuffer();
  const putUrl =
    presign.mode === "local"
      ? `${API_BASE}/uploads/${presign.uploadId}/content?file_name=${encodeURIComponent(file.name)}`
      : presign.uploadUrl;
  await putWithProgress(putUrl, bytes, onProgress ?? (() => {}));

  return requestJson(
    "/translations/documents",
    {
      method: "POST",
      body: JSON.stringify({
        uploadId: presign.uploadId,
        fileName: file.name,
        sourceLanguage,
        targetLanguage,
        glossaryId,
      }),
    },
    DocumentJobSchema,
  );
}

/* ---------- Jobs ---------- */

export const JobDetailSchema = z.object({
  id: z.string(),
  status: z.string(),
  progress: z.number(),
  currentStep: z.string().nullable(),
  inputType: z.string(),
  sourceLanguage: z.string(),
  detectedLanguage: z.string().nullable(),
  targetLanguage: z.string(),
  translationId: z.string().nullable(),
  fileName: z.string().nullable(),
  errorCode: z.string().nullable(),
  error: z.string().nullable(),
});
export type JobDetail = z.infer<typeof JobDetailSchema>;

export function getJob(jobId: string): Promise<JobDetail> {
  return requestJson(`/jobs/${jobId}`, { method: "GET" }, JobDetailSchema);
}

export const JobSummarySchema = z.object({
  id: z.string(),
  status: z.string(),
  inputType: z.string(),
  fileName: z.string().nullable(),
  translationId: z.string().nullable(),
  characterCount: z.number(),
  detectedLanguage: z.string().nullable(),
  createdAt: z.string(),
});
export type JobSummary = z.infer<typeof JobSummarySchema>;

export function listJobs(): Promise<JobSummary[]> {
  return requestJson("/jobs", { method: "GET" }, z.array(JobSummarySchema));
}

export function deleteJob(jobId: string): Promise<void> {
  return requestVoid(`/jobs/${jobId}`, { method: "DELETE" });
}

/* ---------- Exports ---------- */

const ExportSchema = z.object({
  exportId: z.string(),
  format: z.string(),
  layout: z.string().nullable(),
  status: z.string(),
});

export function createExport(
  translationId: string,
  format: "txt" | "docx" | "pdf",
  layout: string,
  preserveLayout = false,
): Promise<z.infer<typeof ExportSchema>> {
  return requestJson(
    `/translations/${translationId}/exports`,
    { method: "POST", body: JSON.stringify({ format, layout, preserveLayout }) },
    ExportSchema,
  );
}

export function exportDownloadUrl(exportId: string): string {
  return `${API_BASE}/exports/${exportId}/download`;
}

/* ---------- Glossaries ---------- */

export const TermSchema = z.object({
  id: z.string(),
  sourceTerm: z.string(),
  targetTerm: z.string(),
  caseSensitive: z.boolean(),
});
export const GlossarySchema = z.object({
  id: z.string(),
  name: z.string(),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  terms: z.array(TermSchema),
});
export type Glossary = z.infer<typeof GlossarySchema>;

export function listGlossaries(): Promise<Glossary[]> {
  return requestJson("/glossaries", { method: "GET" }, z.array(GlossarySchema));
}

export function createGlossary(name: string, sourceLanguage: string): Promise<Glossary> {
  return requestJson(
    "/glossaries",
    { method: "POST", body: JSON.stringify({ name, sourceLanguage }) },
    GlossarySchema,
  );
}

export function deleteGlossary(id: string): Promise<void> {
  return requestVoid(`/glossaries/${id}`, { method: "DELETE" });
}

export function addGlossaryTerm(
  glossaryId: string,
  sourceTerm: string,
  targetTerm: string,
): Promise<z.infer<typeof TermSchema>> {
  return requestJson(
    `/glossaries/${glossaryId}/terms`,
    { method: "POST", body: JSON.stringify({ sourceTerm, targetTerm }) },
    TermSchema,
  );
}
