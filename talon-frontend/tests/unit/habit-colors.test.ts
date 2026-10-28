import { describe, expect, it } from "vitest";
import {
  DEFAULT_HABIT_COLOR,
  getHabitColor,
  HABIT_COLOR_NAMES,
  HABIT_COLORS,
} from "@/lib/habit-colors";

describe("habit colors", () => {
  it("covers the backend's ten colors", () => {
    expect(HABIT_COLOR_NAMES).toHaveLength(10);
  });

  it("uses 6-digit hex values, because cards append alpha suffixes like `${hex}55`", () => {
    for (const hex of Object.values(HABIT_COLORS)) {
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("has a valid default", () => {
    expect(HABIT_COLOR_NAMES).toContain(DEFAULT_HABIT_COLOR);
  });

  it("resolves known names and falls back to gray for unknown ones", () => {
    expect(getHabitColor("indigo")).toBe(HABIT_COLORS.indigo);
    expect(getHabitColor("not-a-color")).toBe(HABIT_COLORS.gray);
    expect(getHabitColor("toString")).toBe(HABIT_COLORS.gray);
  });
});
