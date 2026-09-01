interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  colorClassName?: string;
}

export default function ProgressBar({ value, label, colorClassName = 'bg-blue-600' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label && <div className="mb-1 flex justify-between text-sm text-slate-500 dark:text-slate-400">{label}</div>}
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full rounded-full transition-all ${colorClassName}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
