import { translateText, type TranslateTextInput, type TranslationResult } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useTranslateText(onSuccess: (result: TranslationResult) => void) {
  return useMutation({
    mutationFn: (input: TranslateTextInput) => translateText(input),
    onSuccess,
  });
}
