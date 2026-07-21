# API reference (`/api/v1`)

All errors are returned in the form `{ "error": { "code": "...", "message": "..." } }`.

## Health / text

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/translations/text` | Text translation (synchronous). body: `sourceText, sourceLanguage, targetLanguage, options{preserveParagraphs, glossaryId}` |
| GET | `/translations/{id}` | Get translation result |
| PATCH | `/translations/{id}` | Edit block translations. body: `blocks[{id, translatedText}], version` (optimistic locking) |
| GET | `/translations/{id}/status` | Get status |

## Upload / document

| Method | Path | Description |
|---|---|---|
| GET | `/uploads/limits` | Allowed extensions and maximum size |
| POST | `/uploads/presign` | Issue an upload URL. body: `fileName, contentType, fileSize` |
| PUT | `/uploads/{uploadId}/content?file_name=` | (local mode) Upload file bytes |
| POST | `/translations/documents` | Create a document translation job. body: `uploadId, fileName, sourceLanguage, glossaryId` |

## Jobs / export

| Method | Path | Description |
|---|---|---|
| GET | `/jobs` | Job history list |
| GET | `/jobs/{id}` | Job details (progress/errors) |
| POST | `/jobs/{id}/cancel` | Cancel a job |
| DELETE | `/jobs/{id}` | Delete job/document/blocks/files (including storage cleanup) |
| POST | `/translations/{id}/exports` | Generate a result file. body: `format(txt\|docx\|pdf), layout` |
| GET | `/exports/{exportId}/download` | Download the result file |

Layouts: `translated_only`, `source_then_translation`, `side_by_side`.

## Glossary

| Method | Path | Description |
|---|---|---|
| GET | `/glossaries` | List |
| POST | `/glossaries` | Create. body: `name, sourceLanguage` |
| GET | `/glossaries/{id}` | Details (including terms) |
| DELETE | `/glossaries/{id}` | Delete |
| POST | `/glossaries/{id}/terms` | Add a term. body: `sourceTerm, targetTerm, caseSensitive` |

## Error codes

`EMPTY_DOCUMENT`, `FILE_TOO_LARGE`, `UNSUPPORTED_FILE_TYPE`, `INVALID_FILE_CONTENT`,
`UNSUPPORTED_LANGUAGE`, `OCR_REQUIRED`, `DOCUMENT_PARSE_FAILED`, `DOC_CONVERSION_FAILED`,
`HWP_NOT_SUPPORTED`, `EXPORT_FAILED`, `STORAGE_ERROR`, `VERSION_CONFLICT`, `NOT_FOUND`.
