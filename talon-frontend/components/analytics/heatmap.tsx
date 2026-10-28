import type { DayStat } from "@/lib/analytics";

const LEGEND_STEPS = [10, 30, 55, 80, 100];
const MIN_INTENSITY = 0.15;

const limeAt = (percent: number) =>
  `color-mix(in oklab, var(--primary) ${percent}%, transparent)`;

function cellColor(day: DayStat): string | undefined {
  if (day.due === 0 || day.completed === 0) return undefined;
  return limeAt(Math.round(Math.max(MIN_INTENSITY, day.completed / day.due) * 100));
}

// The cells are color-only, so assistive tech gets the overall result as text instead.
function summarize(days: DayStat[]): string {
  const due = days.reduce((sum, day) => sum + day.due, 0);
  const completed = days.reduce((sum, day) => sum + day.completed, 0);
  return `Completion heatmap for the last ${days.length} days: ${completed} of ${due} scheduled check-ins completed.`;
}

export function Heatmap({ days }: { days: DayStat[] }) {
  return (
    <section className="rounded-2xl border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">Last 90 days</h3>
        <div aria-hidden="true" className="flex items-center gap-2 text-xs text-muted-foreground">
          Less
          {LEGEND_STEPS.map((step) => (
            <span
              key={step}
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: limeAt(step) }}
            />
          ))}
          More
        </div>
      </div>
      <div
        role="img"
        aria-label={summarize(days)}
        className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(30,minmax(0,1fr))]"
      >
        {days.map((day) => {
          const color = cellColor(day);
          return (
            <div
              key={day.date}
              title={`${day.date} — ${day.completed}/${day.due}`}
              className={`aspect-square rounded-sm border border-white/5 ${color ? "" : "bg-muted"}`}
              style={color ? { backgroundColor: color } : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
