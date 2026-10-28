import { describe, expect, it } from "vitest";
import { formatDate, formatSchedule } from "@/lib/format";

describe("formatDate", () => {
  it("formats a server date without shifting the day", () => {
    expect(formatDate("2026-10-28", "EEE, MMM d")).toBe("Wed, Oct 28");
    expect(formatDate("2026-01-01", "yyyy-MM-dd")).toBe("2026-01-01");
  });
});

describe("formatSchedule", () => {
  it("shows Daily for daily habits", () => {
    expect(formatSchedule("daily", [0, 1, 2, 3, 4, 5, 6])).toBe("Daily");
  });

  it("lists weekly days Monday first, with Sunday last", () => {
    expect(formatSchedule("weekly", [0, 1, 3])).toBe("Weekly · Mon, Wed, Sun");
  });
});
