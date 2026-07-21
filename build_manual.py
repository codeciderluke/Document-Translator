"""Generate the English user manual (docs/USER_MANUAL.pdf).

Requires reportlab:  pip install reportlab
Run:                 python build_manual.py
"""

from __future__ import annotations

import os

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

ACCENT = colors.HexColor("#4f46e5")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "docs", "USER_MANUAL.pdf")


def _styles():
    ss = getSampleStyleSheet()
    ss.add(ParagraphStyle("TitleBig", parent=ss["Title"], fontSize=30, leading=36, textColor=ACCENT))
    ss.add(ParagraphStyle("Sub", parent=ss["Normal"], fontSize=13, leading=18, textColor=colors.HexColor("#555555"), alignment=TA_CENTER))
    ss.add(ParagraphStyle("H1", parent=ss["Heading1"], fontSize=16, leading=20, textColor=ACCENT, spaceBefore=14, spaceAfter=6))
    ss.add(ParagraphStyle("H2", parent=ss["Heading2"], fontSize=12.5, leading=16, spaceBefore=8, spaceAfter=3))
    ss.add(ParagraphStyle("Body", parent=ss["Normal"], fontSize=10.5, leading=15, spaceAfter=4))
    ss.add(ParagraphStyle("MBullet", parent=ss["Normal"], fontSize=10.5, leading=15))
    return ss


def _bullets(items, style):
    return ListFlowable(
        [ListItem(Paragraph(t, style), leftIndent=6) for t in items],
        bulletType="bullet",
        bulletColor=ACCENT,
        start="•",
        leftIndent=12,
    )


def _footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#999999"))
    canvas.drawString(20 * mm, 12 * mm, "Document Translator — User Manual")
    canvas.drawRightString(190 * mm, 12 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build() -> None:
    ss = _styles()
    doc = SimpleDocTemplate(
        OUT, pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=22 * mm, bottomMargin=20 * mm, title="Document Translator — User Manual",
    )
    s = []

    # Title page
    s += [Spacer(1, 60 * mm)]
    s += [Paragraph("Document Translator", ss["TitleBig"])]
    s += [Spacer(1, 6 * mm)]
    s += [Paragraph("User Manual", ss["Sub"])]
    s += [Spacer(1, 3 * mm)]
    s += [Paragraph("Mutual translation between English, Japanese, Korean, and Chinese", ss["Sub"])]
    s += [Spacer(1, 40 * mm)]
    s += [Paragraph("Version 0.1.0 &nbsp;·&nbsp; Designed by Codecider Lab", ss["Sub"])]
    s += [PageBreak()]

    # 1. Overview
    s += [Paragraph("1. Overview", ss["H1"])]
    s += [Paragraph(
        "Document Translator is a local desktop app for translating text and documents between "
        "English, Japanese, Korean, and Chinese (Simplified and Traditional), in any direction. "
        "You can paste text or upload a document, edit the translation, and save it as TXT, DOCX, "
        "or PDF, or print it. The app runs entirely on your own computer; only the translation "
        "step uses an online service, so an internet connection is required for translation.", ss["Body"])]

    # 2. Getting started
    s += [Paragraph("2. Getting Started", ss["H1"])]
    s += [_bullets([
        "Download the latest release archive and unzip it to any folder.",
        "Double-click <b>run.bat</b> (or open the <b>document-translator-server</b> folder and run "
        "<b>document-translator-server.exe</b>).",
        "A console window opens and your browser navigates to <b>http://localhost:8000</b>.",
        "To stop the app, close the console window.",
        "If Windows SmartScreen warns about an unsigned app, choose “More info” → “Run anyway”.",
    ], ss["MBullet"])]

    # 3. Text translation
    s += [Paragraph("3. Text Translation", ss["H1"])]
    s += [Paragraph("Open <b>Text Translation</b> from the sidebar.", ss["Body"])]
    s += [_bullets([
        "Choose the <b>source</b> language (or Auto-detect) and the <b>target</b> language. "
        "Use the swap button (⇄) to reverse them.",
        "Type or paste your text on the left. The character count is shown at the bottom.",
        "Click <b>Translate</b>. A progress bar appears while translating.",
        "The result appears on the right and can be edited directly; edits are saved automatically.",
        "Switch the result view between <b>Separated</b> (one box per paragraph) and "
        "<b>Continuous</b> (one flowing text).",
        "Use <b>Copy</b>, <b>TXT</b>, or <b>Print</b> for quick output.",
    ], ss["MBullet"])]

    # 4. Document translation
    s += [Paragraph("4. Document Translation", ss["H1"])]
    s += [Paragraph("Open <b>Document Translation</b> from the sidebar.", ss["Body"])]
    s += [_bullets([
        "Pick the source and target languages, then drag a file onto the drop zone or click to choose one.",
        "Supported files: <b>TXT, DOCX, text PDF, scanned PDF (OCR), HWPX</b>. DOC is converted when "
        "LibreOffice is available; HWP is not supported (convert to HWPX or DOCX first).",
        "Upload progress is shown as a percentage; then the job is processed in the background.",
        "The progress page shows the live status (Analyzing → Translating → Completed) and opens the "
        "editor automatically when finished.",
        "For scanned PDFs, low-confidence OCR paragraphs are flagged for review in the editor.",
    ], ss["MBullet"])]

    # 5. Exporting
    s += [Paragraph("5. Exporting Results", ss["H1"])]
    s += [_bullets([
        "In the editor, click <b>Export</b> and choose a format: <b>TXT</b>, <b>DOCX</b>, or <b>PDF</b>.",
        "Choose a layout: translation only, source then translation, or source and translation side by side.",
        "Enable <b>Preserve original layout</b> (DOCX/PDF, uploaded documents only) to keep the original "
        "formatting and positions and replace only the text.",
        "Use the browser’s <b>Print</b> option to print the translation directly.",
    ], ss["MBullet"])]

    # 6. Glossaries, history, appearance
    s += [Paragraph("6. Glossaries, History, and Appearance", ss["H1"])]
    s += [Paragraph("Glossaries", ss["H2"])]
    s += [Paragraph(
        "Under <b>Glossaries</b>, create a glossary and add source→target term pairs. Matching terms "
        "are applied automatically so your preferred terminology stays consistent.", ss["Body"])]
    s += [Paragraph("Job History", ss["H2"])]
    s += [Paragraph(
        "Under <b>History</b>, review past jobs, open a completed result, or delete a job. Deleting a "
        "job also removes its source and exported files.", ss["Body"])]
    s += [Paragraph("Theme", ss["H2"])]
    s += [Paragraph(
        "Use the theme toggle at the bottom of the sidebar to switch between dark and light mode. Your "
        "choice is remembered.", ss["Body"])]

    # 7. Notes & troubleshooting
    s += [Paragraph("7. Notes & Troubleshooting", ss["H1"])]
    s += [_bullets([
        "<b>Internet:</b> translation uses a free online engine, so translation requires an internet "
        "connection. All other processing is local.",
        "<b>Privacy:</b> your documents are processed on your machine. A local database "
        "(document_translator.db) and a storage_data folder are created next to the program.",
        "<b>Port in use:</b> if http://localhost:8000 does not open, another program may be using port "
        "8000. Close it and restart the app.",
        "<b>Nothing happens on a click:</b> make sure the console window is still open (closing it stops "
        "the server), then refresh the browser.",
    ], ss["MBullet"])]

    # 8. License
    s += [Paragraph("8. License", ss["H1"])]
    s += [Paragraph(
        "The frontend is open source under the MIT License. The backend is distributed as a prebuilt "
        "binary and bundles third-party components, each under its own permissive license (see "
        "THIRD_PARTY_LICENSES). For production use, an official translation provider "
        "(DeepL, Google Cloud, or Azure) can be configured. Designed by Codecider Lab.", ss["Body"])]

    doc.build(s, onFirstPage=_footer, onLaterPages=_footer)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
