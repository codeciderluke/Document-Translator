Document Translator - Local App
================================

Mutual translation between English, Japanese, Korean, and Chinese.
Runs entirely on your machine. No installation, no API key required.

HOW TO RUN
----------
1. Double-click  run.bat   (or open the document-translator-server folder
   and double-click document-translator-server.exe).
2. A console window opens and your browser goes to:
       http://localhost:8000
3. To stop the app, close that console window.

NOTES
-----
- Translation uses a free online engine, so an internet connection is required
  for actual translation. Everything else runs locally.
- Your documents are processed on your own machine. A local database
  (document_translator.db) and a storage_data folder are created next to the
  program to hold jobs and files.
- Supported uploads: TXT, DOCX, text PDF, scanned PDF (OCR), HWPX.
- Windows may show a SmartScreen warning for an unsigned app; choose
  "More info" -> "Run anyway".

LICENSE
-------
See LICENSE and THIRD_PARTY_LICENSES.md.
Designed by Codecider Lab.
