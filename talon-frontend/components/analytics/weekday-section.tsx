import { WeekdayChartLazy } from "@/components/analytics/weekday-chart-lazy";
import { weekdayRates, type DayStat } from "@/lib/analytics";

export function WeekdaySection({ days }: { days: DayStat[] }) {
  const data = weekdayRates(days);
  const ranked = data.filter((entry) => entry.due > 0).sort((a, b) => b.rate - a.rate);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  return (
    <section className="rounded-2xl border bg-card p-6">
      <h3 className="font-display text-xl font-semibold">Completion by day</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {best && worst ? (
          <>
            Best: <span className="text-foreground">{best.day}</span> · Worst:{" "}
            <span className="text-foreground">{worst.day}</span>
          </>
        ) : (
          "Not enough data yet."
        )}
      </p>
      <div className="mt-6">
        <WeekdayChartLazy data={data} />
      </div>
      <table className="sr-only">
        <caption>Completion rate by weekday, last 30 days</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Completion</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.day}>
              <th scope="row">{entry.day}</th>
              <td>{entry.due ? `${entry.rate}%` : "Nothing due"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
