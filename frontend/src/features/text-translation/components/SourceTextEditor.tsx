interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxChars: number;
}

export function SourceTextEditor({ value, onChange, disabled, maxChars }: Props) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface shadow-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-sm font-medium text-content">Source</h2>
        <span className="text-xs text-muted">English · Japanese · Korean</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxChars))}
        disabled={disabled}
        placeholder="Type or paste the text you want to translate."
        spellCheck={false}
        className="flex-1 resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed text-content outline-none placeholder:text-muted disabled:opacity-60"
      />
    </div>
  );
}
