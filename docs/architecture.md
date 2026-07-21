# Architecture overview

## Layers

```
React SPA  ──HTTPS/REST──▶  FastAPI (/api/v1)
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
               PostgreSQL   Redis+Celery   MinIO
              (jobs/blocks) (async jobs)   (source/result files)
```

## Design principles (spec 3.1)

- The frontend never uses translation API secret keys → translation happens only on the backend.
- Large document processing runs asynchronously in the Celery Worker. (Text translation is fast, so it runs synchronously within the request.)
- Parsers, translation engines, and output generators are separated behind interfaces.
  - `TranslationProvider` (`app/services/translation/provider.py`) — default `MockTranslationProvider`.
  - `DocumentProcessor` (Phase 2+) — TXT/DOCX/PDF parsers.
- Source and result files go to object storage, not the DB.

## Data model

`translation_jobs 1─1 translation_documents 1─N translation_blocks`,
`translation_documents 1─N export_files`.
A shared mixin manages the UUID PK (`id`) and `created_at`/`updated_at` (`app/db/base.py`).

## Error handling

Domain exceptions (`app/core/errors.py`) are converted into stable codes plus English messages
in the form `{ "error": { "code", "message" } }`. The original exception is never exposed to the client.

## Document processing pipeline (Worker)

```
Upload (presign→PUT) → create job → [ANALYZING] identify/extract format
  → (DOC via LibreOffice conversion / scanned PDF via [OCR_PROCESSING])
  → language detection → save blocks → [TRANSLATING] block-level translation (+ glossary)
  → [COMPLETED] → edit/export (TXT, DOCX, PDF)
```

Locally/in development it runs synchronously within the request via `CELERY_EAGER=true`; in production a Celery worker handles it.

## Implementation scope

All of Phase 0–6: text/document translation, TXT/DOCX/PDF/HWPX parsers, scanned PDF OCR pipeline,
DOC conversion (guarded)/HWP guidance, TXT/DOCX/PDF output, job history/deletion, and glossary.
