@echo off
REM Launch Document Translator. A console window stays open while it runs;
REM close it to stop the server. The app opens automatically in your browser.
cd /d "%~dp0"
start "" "document-translator-server\document-translator-server.exe"
