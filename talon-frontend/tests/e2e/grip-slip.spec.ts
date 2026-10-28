import { expect, test } from "@playwright/test";
import { createHabit, openFromSidebar, perchHeading, registerUser } from "./helpers";

test.beforeEach(async ({ page }) => {
  await registerUser(page);
});

test("gripping a habit updates the Perch and survives a reload", async ({ page }) => {
  const name = await createHabit(page);
  await openFromSidebar(page, "Perch");

  await expect(perchHeading(page)).toContainText("1 left to grip");
  await page.getByRole("button", { name: `Grip ${name}` }).click();

  await expect(perchHeading(page)).toContainText("0 left to grip");
  await expect(page.getByText("1/1", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: `Grip ${name}` })).toHaveCount(0);

  await page.reload();
  await expect(perchHeading(page)).toContainText("0 left to grip");
});

test("slipping a habit moves it to the skipped list", async ({ page }) => {
  const slipped = await createHabit(page);
  await createHabit(page);
  await openFromSidebar(page, "Perch");

  await page.getByRole("button", { name: `Slip ${slipped}` }).click();

  await expect(page.getByText("1 skipped today")).toBeVisible();
  await expect(perchHeading(page)).toContainText("1 left to grip");
});

test("a skipped habit can be switched to complete, then undone", async ({ page }) => {
  const name = await createHabit(page);
  await openFromSidebar(page, "Perch");
  await page.getByRole("button", { name: `Slip ${name}` }).click();
  await expect(page.getByText("1 skipped today")).toBeVisible();

  await openFromSidebar(page, "Habits");
  await page.getByRole("link", { name, exact: true }).click();

  await page.getByRole("button", { name: "Complete", exact: true }).click();
  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Complete", exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("button", { name: "Skip", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Complete", exact: true })).toBeVisible();
});
