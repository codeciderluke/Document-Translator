import type { Block } from "./api";

export function blocksToText(blocks: Block[]): string {
  return blocks.map((b) => b.translatedText ?? "").join("\n\n");
}

export function downloadTxt(text: string, fileName = "translation.txt"): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
