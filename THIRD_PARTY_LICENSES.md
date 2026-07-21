# Third-Party Licenses

The prebuilt backend binary bundles the following components. All are under
permissive licenses (no copyleft), so the binary may be distributed in closed
form.

## Backend (bundled in the binary)

| Component | License |
|---|---|
| FastAPI | MIT |
| Starlette | BSD-3-Clause |
| Uvicorn | BSD-3-Clause |
| Pydantic / pydantic-settings | MIT |
| SQLAlchemy | MIT |
| Alembic | MIT |
| python-docx | MIT |
| pdfminer.six | MIT |
| pypdf | BSD-3-Clause |
| pypdfium2 | Apache-2.0 / BSD-3-Clause |
| PDFium (bundled by pypdfium2) | BSD-3-Clause |
| Pillow | MIT-CMU (HPND) |
| reportlab | BSD-3-Clause |
| deep-translator | MIT |
| charset-normalizer | MIT |
| boto3 / botocore | Apache-2.0 |
| Celery | BSD-3-Clause |
| redis-py | MIT |
| PyInstaller (packaging tool) | GPL-2.0 with bundling exception (does not affect the app license) |

Note: PyMuPDF (AGPL-3.0) was intentionally **not** used; PDF handling relies on
pdfminer.six / pypdf / pypdfium2, which are permissively licensed.

## Frontend (source in this repository)

| Component | License |
|---|---|
| React / React DOM | MIT |
| React Router | MIT |
| Vite | MIT |
| TanStack Query | MIT |
| Tailwind CSS | MIT |
| Zod | MIT |

## Translation engine note

The default translation engine uses deep-translator's free Google endpoint,
which is subject to Google's Terms of Service and may rate-limit or block
automated use. For production, configure an official provider
(DeepL / Google Cloud Translation / Azure) via the `TRANSLATION_PROVIDER`
environment variable.
