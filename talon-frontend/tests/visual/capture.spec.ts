import { expect, test, type Page } from "@playwright/test";
import { seedEmptyAccount, seedFullAccount, type SeededAccount } from "./seed";

const WIDTHS = [390, 768, 1024, 1440];
const HEIGHT = 900;
const DESKTOP_MIN = 768;
const OUTPUT = "tests/visual/output";
const CHART_ANIMATION_MS = 1_500;

test.use({ reducedMotion: "reduce" });

const PUBLIC_PAGES: [name: string, path: string][] = [
  ["landing", "/"],
  ["login", "/login"],
  ["register", "/register"],
  ["forgot-password", "/forgot-password"],
  ["reset-password", "/reset-password?token=visual"],
  ["not-found", "/does-not-exist"],
];

async function shot(page: Page, width: number, name: string, options: { fullPage?: boolean } = {}) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: `${OUTPUT}/${width}/${name}.png`,
    fullPage: options.fullPage ?? true,
    animations: "disabled",
  });
}

async function goTo(page: Page, width: number, name: string) {
  const mobile = width < DESKTOP_MIN;
  if (mobile) await page.getByRole("button", { name: "Toggle Sidebar" }).first().click();
  await page.getByRole("link", { name, exact: true }).click();
  if (mobile) await page.keyboard.press("Escape");
}

async function settleChart(page: Page) {
  await page.locator(".recharts-wrapper").waitFor();
  await page.waitForTimeout(CHART_ANIMATION_MS);
}

async function openReminders(page: Page) {
  await page.getByRole("button", { name: /^Reminders/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

test("public pages", async ({ page }) => {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: HEIGHT });

    for (const [name, path] of PUBLIC_PAGES) {
      await page.goto(path);
      await shot(page, width, name);
    }

    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill("visual@example.com");
    await page.getByRole("button", { name: "Send reset link" }).click();
    await expect(page.getByText(/a reset link is on its way/i)).toBeVisible();
    await shot(page, width, "forgot-password-sent");
  }
});

async function captureWithData(page: Page, width: number, { habits }: SeededAccount) {
  const mobile = width < DESKTOP_MIN;

  await goTo(page, width, "Perch");
  await expect(page.getByText("The Perch ·")).toBeVisible();
  await shot(page, width, "perch");

  await page.getByText("1 skipped today").click();
  await shot(page, width, "perch-skipped-open");
  await page.getByText("1 skipped today").click();

  await page.getByRole("button", { name: `Options for ${habits.pending}` }).click();
  await shot(page, width, "habit-card-menu", { fullPage: false });
  await page.keyboard.press("Escape");

  await openReminders(page);
  await shot(page, width, "notifications-drawer", { fullPage: false });
  await page.keyboard.press("Escape");

  const toggle = page.getByRole("button", { name: "Toggle Sidebar" }).first();
  await toggle.click();
  if (mobile) {
    await expect(page.getByRole("dialog")).toBeVisible();
    await shot(page, width, "sidebar-mobile", { fullPage: false });
    await page.keyboard.press("Escape");
  } else {
    await shot(page, width, "perch-sidebar-collapsed");
    await toggle.click();
  }

  await goTo(page, width, "Habits");
  await expect(page.getByRole("link", { name: habits.pending, exact: true })).toBeVisible();
  await shot(page, width, "habits-list");

  await goTo(page, width, "Roost");
  await expect(page.getByRole("link", { name: habits.archived, exact: true })).toBeVisible();
  await shot(page, width, "habits-archived");

  await page.getByRole("link", { name: "New habit", exact: true }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Create a habit" })).toBeVisible();
  await shot(page, width, "habit-new");

  await page.getByRole("button", { name: "Weekly", exact: true }).click();
  await page.getByRole("button", { name: "Wed", exact: true }).click();
  await shot(page, width, "habit-new-weekly");

  await goTo(page, width, "Habits");
  await page.getByRole("link", { name: habits.gripped, exact: true }).click();
  await expect(page.getByRole("heading", { level: 2, name: habits.gripped })).toBeVisible();
  await shot(page, width, "habit-detail");

  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Edit habit" })).toBeVisible();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue(habits.gripped);
  await shot(page, width, "habit-edit");

  await goTo(page, width, "Analytics");
  await expect(page.getByRole("heading", { name: "Last 90 days" })).toBeVisible();
  await settleChart(page);
  await shot(page, width, "analytics");

  await goTo(page, width, "Settings");
  await expect(page.getByRole("heading", { level: 2, name: "Settings" })).toBeVisible();
  await shot(page, width, "settings");

  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await shot(page, width, "dialog-change-password", { fullPage: false });
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Delete my account" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await shot(page, width, "dialog-delete-account", { fullPage: false });
  await page.keyboard.press("Escape");
}

test("app pages with data", async ({ page }) => {
  const account = await seedFullAccount(page);
  await page.goto("/app");

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: HEIGHT });
    await captureWithData(page, width, account);
  }
});

test("empty states", async ({ page }) => {
  await seedEmptyAccount(page);
  await page.goto("/app");

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: HEIGHT });

    await goTo(page, width, "Perch");
    await expect(page.getByText("The branch is bare.")).toBeVisible();
    await shot(page, width, "perch-empty");

    await openReminders(page);
    await expect(page.getByText(/all caught up/i)).toBeVisible();
    await shot(page, width, "notifications-empty", { fullPage: false });
    await page.keyboard.press("Escape");

    await goTo(page, width, "Habits");
    await expect(page.getByText("No active habits. Create one to get started.")).toBeVisible();
    await shot(page, width, "habits-empty");

    await goTo(page, width, "Roost");
    await expect(page.getByText("No archived habits.")).toBeVisible();
    await shot(page, width, "habits-archived-empty");

    await goTo(page, width, "Analytics");
    await expect(page.getByRole("heading", { name: "Last 90 days" })).toBeVisible();
    await settleChart(page);
    await shot(page, width, "analytics-empty");
  }
});
