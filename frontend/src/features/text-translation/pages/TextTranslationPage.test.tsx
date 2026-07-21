import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TextTranslationPage } from "./TextTranslationPage";

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { mutations: { retry: 0 } } });
  return render(
    <QueryClientProvider client={qc}>
      <TextTranslationPage />
    </QueryClientProvider>,
  );
}

const mockResult = {
  jobId: "job-1",
  translationId: "doc-1",
  status: "COMPLETED",
  sourceLanguage: "auto",
  detectedLanguage: "en",
  targetLanguage: "ko",
  blocks: [
    { id: "b1", sequence: 0, sourceText: "Hello", translatedText: "[ko] Hello", version: 1 },
  ],
};

describe("TextTranslationPage", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(mockResult), { status: 200 })),
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("disables translate button when input is empty", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /Translate/ })).toBeDisabled();
  });

  it("translates text and shows the editable result", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/paste/i), "Hello");
    await user.click(screen.getByRole("button", { name: /Translate/ }));

    await waitFor(() =>
      expect(screen.getByLabelText("Translated paragraph 1")).toHaveValue("[ko] Hello"),
    );
  });
});
