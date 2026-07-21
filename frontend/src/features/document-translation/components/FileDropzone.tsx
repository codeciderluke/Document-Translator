import { UploadIcon } from "@/components/icons";
import { useRef, useState } from "react";

interface Props {
  onFile: (file: File) => void;
  accept: string[];
  maxSizeMb: number;
  disabled?: boolean;
}

export function FileDropzone({ onFile, accept, maxSizeMb, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-16 text-center transition-colors ${
        dragging ? "border-accent bg-accent/10" : "border-border bg-surface"
      } ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-accent"}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
        <UploadIcon width={24} height={24} />
      </div>
      <p className="text-sm text-content">
        Drag and drop a file or <span className="text-accent">click to select</span>
      </p>
      <p className="text-xs text-muted">
        Supported: {accept.join(", ")} · Max {maxSizeMb}MB
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
