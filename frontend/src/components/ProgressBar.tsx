interface Props {
  value?: number; // 0–100 (ignored when indeterminate)
  indeterminate?: boolean;
  className?: string;
}

export function ProgressBar({ value = 0, indeterminate, className = "" }: Props) {
  return (
    <div
      className={`relative h-1.5 w-full overflow-hidden rounded-full bg-surface-2 ${className}`}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(value)}
    >
      {indeterminate ? (
        <div className="bar-indeterminate bg-accent" />
      ) : (
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      )}
    </div>
  );
}
