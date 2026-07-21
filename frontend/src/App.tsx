import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { DocumentUploadPage } from "./features/document-translation/pages/DocumentUploadPage";
import { TranslationEditorPage } from "./features/editor/pages/TranslationEditorPage";
import { GlossaryPage } from "./features/glossaries/pages/GlossaryPage";
import { HistoryPage } from "./features/history/pages/HistoryPage";
import { JobProgressPage } from "./features/jobs/pages/JobProgressPage";
import { TextTranslationPage } from "./features/text-translation/pages/TextTranslationPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/translate/text" replace />} />
        <Route path="/translate/text" element={<TextTranslationPage />} />
        <Route path="/translate/document" element={<DocumentUploadPage />} />
        <Route path="/jobs/:jobId" element={<JobProgressPage />} />
        <Route path="/translations/:id" element={<TranslationEditorPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings/glossaries" element={<GlossaryPage />} />
        <Route path="*" element={<Navigate to="/translate/text" replace />} />
      </Route>
    </Routes>
  );
}
