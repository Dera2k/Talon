import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { createHabit, openFromSidebar, registerUser } from "./helpers";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

test.use({ reducedMotion: "reduce" });

async function findViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  return violations.map((violation) => `${violation.id} ×${violation.nodes.length}: ${violation.help}`);
}

async function settle(page: Page) {
  await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  await page.waitForLoadState("networkidle");
}

for (const path of ["/", "/login", "/register", "/forgot-password"]) {
  test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    expect(await findViolations(page)).toEqual([]);
  });
}

test("app pages and overlays have no WCAG A/AA violations", async ({ page }) => {
  const findings: Record<string, string[]> = {};
  const scan = async (name: string) => {
    const violations = await findViolations(page);
    if (violations.length > 0) findings[name] = violations;
  };

  await registerUser(page);
  await createHabit(page);
  await settle(page);
  await scan("Habits");

  await openFromSidebar(page, "Perch");
  await settle(page);
  await scan("Perch");

  await page.getByRole("link", { name: "New habit", exact: true }).click();
  await settle(page);
  await scan("New habit");

  await openFromSidebar(page, "Analytics");
  await settle(page);
  await scan("Analytics");

  await openFromSidebar(page, "Settings");
  await settle(page);
  await scan("Settings");

  await page.getByRole("button", { name: /^Reminders/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.waitForLoadState("networkidle");
  await scan("Reminders drawer");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await scan("Change password dialog");

  expect(findings).toEqual({});
});
