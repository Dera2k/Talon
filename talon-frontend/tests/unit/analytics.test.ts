import { describe, expect, it } from "vitest";
import { buildDays, completionRate, getRange, HEATMAP_DAYS, weekdayRates } from "@/lib/analytics";
import type { Heatmap } from "@/lib/api/types";

const TODAY = "2026-10-28"; // a Wednesday

type Row = { date: string; due: number; completed: number; skipped?: number };
const heatmap = (rows: Row[]) =>
  rows.map((row) => ({ skipped: 0, ...row })) as unknown as Heatmap;

describe("getRange", () => {
  it("spans 90 days ending today", () => {
    expect(getRange(TODAY)).toEqual({ from: "2026-07-31", to: TODAY });
  });
});

describe("buildDays", () => {
  it("returns 90 days, oldest first, ending today", () => {
    const days = buildDays(TODAY, heatmap([]));

    expect(days).toHaveLength(HEATMAP_DAYS);
    expect(days[0].date).toBe("2026-07-31");
    expect(days[HEATMAP_DAYS - 1].date).toBe(TODAY);
  });

  it("fills days the server omitted with zeros and keeps the ones it sent", () => {
    const days = buildDays(TODAY, heatmap([{ date: "2026-10-27", due: 3, completed: 2, skipped: 1 }]));

    expect(days.at(-2)).toEqual({ date: "2026-10-27", due: 3, completed: 2, skipped: 1 });
    expect(days.at(-1)).toEqual({ date: TODAY, due: 0, completed: 0, skipped: 0 });
  });
});

describe("completionRate", () => {
  const days = buildDays(
    TODAY,
    heatmap([
      { date: "2026-10-28", due: 4, completed: 2 },
      { date: "2026-10-27", due: 4, completed: 4 },
    ]),
  );

  it("sums due and completed over the window", () => {
    expect(completionRate(days, 1)).toBe(50);
    expect(completionRate(days, 2)).toBe(75);
    expect(completionRate(days, 7)).toBe(75);
  });

  it("is null when nothing was due", () => {
    expect(completionRate(buildDays(TODAY, heatmap([])), 7)).toBeNull();
  });

  it("rounds to a whole percent", () => {
    const third = buildDays(TODAY, heatmap([{ date: TODAY, due: 3, completed: 1 }]));
    expect(completionRate(third, 7)).toBe(33);
  });
});

describe("weekdayRates", () => {
  const days = buildDays(
    TODAY,
    heatmap([
      { date: "2026-10-26", due: 2, completed: 1 }, // Monday
      { date: "2026-10-27", due: 1, completed: 1 }, // Tuesday
      { date: "2026-08-03", due: 5, completed: 5 }, // Monday, outside the 30-day window
    ]),
  );
  const rates = weekdayRates(days);

  it("is ordered Monday first", () => {
    expect(rates.map((entry) => entry.day)).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  });

  it("groups by the right weekday and ignores days outside the window", () => {
    expect(rates[0]).toMatchObject({ day: "Mon", due: 2, rate: 50 });
    expect(rates[1]).toMatchObject({ day: "Tue", due: 1, rate: 100 });
    expect(rates[6]).toMatchObject({ day: "Sun", due: 0, rate: 0 });
  });
});
