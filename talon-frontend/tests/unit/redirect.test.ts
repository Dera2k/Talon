import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/lib/auth/redirect";

describe("safeNextPath", () => {
  it("keeps same-origin paths, including query strings", () => {
    expect(safeNextPath("/app/habits")).toBe("/app/habits");
    expect(safeNextPath("/app/habits?tab=archived")).toBe("/app/habits?tab=archived");
  });

  it("falls back to the app home when there is no target", () => {
    expect(safeNextPath(null)).toBe("/app");
    expect(safeNextPath("")).toBe("/app");
  });

  it.each([
    "//evil.example",
    "/\\evil.example",
    "https://evil.example",
    "javascript:alert(1)",
    "app/habits",
  ])("rejects %s", (target) => {
    expect(safeNextPath(target)).toBe("/app");
  });
});
