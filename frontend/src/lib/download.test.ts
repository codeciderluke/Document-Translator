import { describe, expect, it } from "vitest";
import type { Block } from "./api";
import { blocksToText } from "./download";

function block(id: string, seq: number, translated: string | null): Block {
  return { id, sequence: seq, sourceText: "src", translatedText: translated, version: 1 };
}

describe("blocksToText", () => {
  it("joins translated blocks with blank lines", () => {
    const text = blocksToText([block("a", 0, "A"), block("b", 1, "B")]);
    expect(text).toBe("A\n\nB");
  });

  it("treats missing translations as empty", () => {
    expect(blocksToText([block("a", 0, null)])).toBe("");
  });
});
