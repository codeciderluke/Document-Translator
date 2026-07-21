# File format support status

| Format | Extension | Handling | Library/approach | Notes |
|---|---|---|---|---|
| Text | `.txt` | ✅ | charset-normalizer decoding, blank line = paragraph | UTF-8/BOM/encoding inference |
| Word | `.docx` | ✅ | python-docx | Extracts paragraphs, headings, lists, table cells; preserves style names |
| PDF (text) | `.pdf` | ✅ | pdfminer.six + pypdf | Text boxes, coordinates, font size; reading-order sorting |
| PDF (scanned) | `.pdf` | ✅ | pypdfium2 render → OCR pipeline | OcrProvider abstraction, default MockOcr, low-confidence review flag |
| Hangul | `.hwpx` | ✅ | ZIP/XML parsing | `hp:p`/`hp:t` in `Contents/sectionN.xml` |
| Word 97 | `.doc` | ⚠️ | LibreOffice headless → DOCX | Clear error when soffice is not installed |
| Hangul binary | `.hwp` | ⛔ | Limited | Guidance to convert to HWPX/DOCX |

## Output

- **TXT**: UTF-8, translation only or source + translation.
- **DOCX**: python-docx. Reapplies heading/list styles; `side_by_side` uses a table layout.
- **PDF**: reportlab with a built-in CID font chosen per target language (Korean/Japanese/Chinese), three layouts. Layout-preserving export overlays translations onto the original page via reportlab + pypdf.

## Extension interfaces

- `DocumentProcessor` (`services/documents/`): `extract(data, filename) -> ExtractResult`.
  Extension→processor mapping lives in `registry.py`. PDF/HWPX are registered only when their optional dependencies are available.
- `TranslationProvider` (`services/translation/provider.py`): default `MockTranslationProvider`.
- `OcrProvider` (`services/ocr/`): default `MockOcrProvider`. Real engines (PaddleOCR, etc.) can be swapped in via the same protocol.

## Known limitations

- Pixel-perfect preservation of the original layout is not guaranteed (translation length changes).
- Real OCR and DOC conversion require an OCR engine and a LibreOffice installation, respectively (the defaults are Mock/guarded).
- HWP binary is excluded due to licensing and technical constraints.
