# Document Translator

Mutual translation between **English, Japanese, Korean, and Chinese** (any direction).
Paste text or upload a document, edit the result, then save it as TXT/DOCX/PDF or print it.

Runs entirely on your machine — no installation and no API key required.

> **About this repository:** this repo contains the **frontend source**. The
> backend is distributed as a **prebuilt local binary** (closed source) attached
> to [Releases](../../releases). The binary bundles the built frontend, so it
> serves the whole app on its own.

## Features

- **Mutual translation** among English, Japanese, Korean, and Chinese (Simplified/Traditional), with a swap button
- **Text translation**: paragraph-level translation, side-by-side editing, autosave, progress indicator
- **Document translation**: drag-and-drop upload with byte-progress → background processing → real-time job progress
  - TXT, DOCX, text PDF, scanned PDF (OCR), HWPX; DOC (LibreOffice conversion) and HWP (guidance)
- **Result view**: Separated (per-paragraph) or Continuous (flowing text) editing modes
- **Export**: TXT, DOCX, PDF (three layouts) or browser print, with optional **original-layout preservation** (DOCX in-place text replacement, PDF coordinate overlay)
- **Job history**, **glossaries** (fixed terminology), **dark / light theme**

## Run the app (end users)

1. Download the latest release from [Releases](../../releases) and unzip it.
2. Double-click **`run.bat`** (or `document-translator-server.exe`).
3. Your browser opens at **http://localhost:8000**. Close the console window to stop.

An internet connection is needed for the actual translation (free online engine);
everything else runs locally. Your documents are processed on your own machine.

## Frontend development

The frontend is a React + TypeScript + Vite app. Run the backend binary (it serves
the API on port 8000), then start the dev server for hot reload:

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173, proxies /api to the binary on :8000
```

Build the static frontend with `npm run build` (output in `frontend/dist`).

## Stack

| Area | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, TanStack Query, Tailwind, Zod |
| Backend (binary) | Python 3.12, FastAPI, SQLAlchemy 2.x |
| Document processing | python-docx, pdfminer.six, pypdf, pypdfium2, Pillow, reportlab |
| Translation | deep-translator (free Google endpoint by default; DeepL/Google/Azure pluggable) |
| Packaging | PyInstaller (standalone local binary) |

All backend dependencies are permissively licensed (MIT/BSD/Apache) — see
[THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md). PyMuPDF (AGPL) is deliberately
not used.

## Documentation

[docs/architecture.md](docs/architecture.md) · [docs/api.md](docs/api.md) · [docs/file-formats.md](docs/file-formats.md)

## License

Frontend source: MIT (see [LICENSE](LICENSE)). The backend binary is closed source
and bundles third-party components listed in
[THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

Designed by Codecider Lab.
