import type { WeekDayStat } from '../../services/statsService';

const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土'];

function weekdayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return WEEKDAY_JA[date.getDay()];
}

interface WeekChartProps {
  data: WeekDayStat[];
}

export default function WeekChart({ data }: WeekChartProps) {
  const max = Math.max(30, ...data.map((d) => d.minutes));

  return (
    <div className="flex items-stretch justify-between gap-2" style={{ height: 140 }}>
      {data.map((d) => (
        <div key={d.date} className="flex h-full flex-1 flex-col items-center gap-1">
          <span className="text-xs text-slate-400">{d.minutes > 0 ? d.minutes : ''}</span>
          <div className="flex w-full flex-1 items-end">
            <div
              className={`w-full rounded-t-md ${d.minutes > 0 ? 'bg-blue-500' : 'bg-slate-100 dark:bg-slate-800'}`}
              style={{ height: `${Math.max(4, (d.minutes / max) * 100)}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{weekdayLabel(d.date)}</span>
        </div>
      ))}
    </div>
  );
}
