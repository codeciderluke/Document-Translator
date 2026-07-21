import { LanguagesIcon } from "@/components/icons";

const SOURCE_OPTIONS = [
  { value: "auto", label: "Auto-detect" },
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese (日本語)" },
  { value: "ko", label: "Korean" },
  { value: "zh-CN", label: "Chinese Simplified (简体)" },
  { value: "zh-TW", label: "Chinese Traditional (繁體)" },
];

const TARGET_OPTIONS = [
  { value: "ko", label: "Korean" },
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese (日本語)" },
  { value: "zh-CN", label: "Chinese Simplified (简体)" },
  { value: "zh-TW", label: "Chinese Traditional (繁體)" },
];

const LANGUAGE_LABEL: Record<string, string> = {
  en: "English",
  ja: "Japanese",
  ko: "Korean",
  "zh-CN": "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  auto: "Auto-detect",
  unknown: "Unknown",
};

interface Props {
  source: string;
  target: string;
  detected: string | null;
  onSourceChange: (value: string) => void;
  onTargetChange: (value: string) => void;
  onSwap?: () => void;
  disabled?: boolean;
}

const selectClass =
  "rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-content outline-none focus:border-accent disabled:opacity-50";

export function LanguageSelector({
  source,
  target,
  detected,
  onSourceChange,
  onTargetChange,
  onSwap,
  disabled,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <LanguagesIcon className="text-accent" />
      <label className="flex items-center gap-2">
        <span className="text-muted">Source</span>
        <select
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          disabled={disabled}
          className={selectClass}
        >
          {SOURCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      {source === "auto" && detected && detected !== "unknown" && (
        <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted">
          Detected: {LANGUAGE_LABEL[detected] ?? detected}
        </span>
      )}
      <button
        type="button"
        onClick={onSwap}
        disabled={disabled || source === "auto"}
        aria-label="Swap languages"
        title="Swap source/target languages"
        className="rounded-lg border border-border bg-surface-2 px-2 py-1.5 text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
      >
        ⇄
      </button>
      <label className="flex items-center gap-2">
        <span className="text-muted">Target</span>
        <select
          value={target}
          onChange={(e) => onTargetChange(e.target.value)}
          disabled={disabled}
          className={selectClass}
        >
          {TARGET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
