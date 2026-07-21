import { CopyIcon, DownloadIcon, PrinterIcon } from "@/components/icons";
import type { SaveStatus } from "../hooks/useAutosave";

interface Props {
  disabled: boolean;
  saveStatus: SaveStatus;
  onCopy: () => void;
  onDownloadTxt: () => void;
  onPrint: () => void;
}

const SAVE_LABEL: Record<SaveStatus, string> = {
  idle: "",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
};

const SAVE_COLOR: Record<SaveStatus, string> = {
  idle: "text-muted",
  saving: "text-muted",
  saved: "text-success",
  error: "text-danger",
};

export function ResultToolbar({
  disabled,
  saveStatus,
  onCopy,
  onDownloadTxt,
  onPrint,
}: Props) {
  return (
    <div className="no-print flex items-center gap-2">
      <span className={`mr-2 text-xs ${SAVE_COLOR[saveStatus]}`}>
        {SAVE_LABEL[saveStatus]}
      </span>
      <ToolbarButton onClick={onCopy} disabled={disabled} icon={<CopyIcon />} label="Copy" />
      <ToolbarButton
        onClick={onDownloadTxt}
        disabled={disabled}
        icon={<DownloadIcon />}
        label="TXT"
      />
      <ToolbarButton
        onClick={onPrint}
        disabled={disabled}
        icon={<PrinterIcon />}
        label="Print"
      />
    </div>
  );
}

function ToolbarButton({
  onClick,
  disabled,
  icon,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-content transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-content"
    >
      {icon}
      {label}
    </button>
  );
}
