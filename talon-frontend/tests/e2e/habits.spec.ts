import { expect, test } from "@playwright/test";
import { createHabit, openFromSidebar, registerUser, uniqueHabitName } from "./helpers";

test.beforeEach(async ({ page }) => {
  await registerUser(page);
});

test("creating a habit adds it to the list", async ({ page }) => {
  const name = await createHabit(page);

  await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
});

test("a weekly habit needs at least one day", async ({ page }) => {
  await page.getByRole("link", { name: "New habit", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill(uniqueHabitName());
  await page.getByRole("button", { name: "Weekly", exact: true }).click();
  await page.getByRole("button", { name: "Mon", exact: true }).click();
  await page.getByRole("button", { name: "Create habit" }).click();

  await expect(page.getByText("Pick at least one day.")).toBeVisible();
  await expect(page).toHaveURL(/\/app\/habits\/new$/);

  await page.getByRole("button", { name: "Wed", exact: true }).click();
  await page.getByRole("button", { name: "Create habit" }).click();

  await page.waitForURL(/\/app\/habits$/);
  await expect(page.getByText(/Weekly · Wed/)).toBeVisible();
});

test("editing a habit updates its detail page", async ({ page }) => {
  const name = await createHabit(page);
  const renamed = uniqueHabitName();

  await page.getByRole("link", { name, exact: true }).click();
  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill(renamed);
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page).toHaveURL(/\/app\/habits\/[0-9a-f-]{36}$/);
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(renamed);
});

test("an archived habit moves to the Roost and can be restored", async ({ page }) => {
  const name = await createHabit(page);

  await page.getByRole("link", { name, exact: true }).click();
  await page.getByRole("button", { name: "Archive", exact: true }).click();
  await expect(page.getByRole("heading", { level: 2 }).getByText("Archived")).toBeVisible();

  await openFromSidebar(page, "Roost");
  await expect(page).toHaveURL(/tab=archived/);
  await expect(page.getByRole("link", { name: "Archived", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.getByRole("link", { name, exact: true })).toBeVisible();

  await page.getByRole("button", { name: `Options for ${name}` }).click();
  await page.getByRole("menuitem", { name: "Restore" }).click();
  await expect(page.getByText("No archived habits.")).toBeVisible();

  await page.getByRole("link", { name: "Active", exact: true }).click();
  await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
});
