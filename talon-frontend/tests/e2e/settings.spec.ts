import { expect, test } from "@playwright/test";
import {
  formAlert,
  login,
  NEW_PASSWORD,
  openFromSidebar,
  registerUser,
  type TestUser,
} from "./helpers";

let user: TestUser;

test.beforeEach(async ({ page }) => {
  user = await registerUser(page);
  await openFromSidebar(page, "Settings");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText("Settings");
});

test("updating the profile changes the sidebar and persists", async ({ page }) => {
  await page.getByLabel("First name").fill("Grace");
  await page.getByLabel("Last name").fill("Hopper");
  await page.getByRole("button", { name: "Save profile" }).click();

  await expect(page.getByText("Profile updated")).toBeVisible();
  await expect(page.getByText("Grace Hopper")).toBeVisible();

  await page.reload();
  await expect(page.getByLabel("First name")).toHaveValue("Grace");
});

test("changing the timezone persists", async ({ page }) => {
  await page.getByLabel("Local timezone").selectOption("Europe/London");
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await expect(page.getByText("Timezone updated")).toBeVisible();

  await page.reload();
  await expect(page.getByLabel("Local timezone")).toHaveValue("Europe/London");
});

test("a wrong current password shows an error and keeps the session", async ({ page }) => {
  await page.getByRole("button", { name: "Change password" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Current password").fill("Wrong-Password-1!");
  await dialog.getByLabel("New password", { exact: true }).fill(NEW_PASSWORD);
  await dialog.getByLabel("Confirm new password").fill(NEW_PASSWORD);
  await dialog.getByRole("button", { name: "Update password" }).click();

  await expect(dialog.getByRole("alert").first()).toBeVisible();
  await expect(page).toHaveURL(/\/app\/settings$/);
});

test("changing the password signs the user out, and only the new password works", async ({ page }) => {
  await page.getByRole("button", { name: "Change password" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Current password").fill(user.password);
  await dialog.getByLabel("New password", { exact: true }).fill(NEW_PASSWORD);
  await dialog.getByLabel("Confirm new password").fill(NEW_PASSWORD);
  await dialog.getByRole("button", { name: "Update password" }).click();

  await expect(page).toHaveURL(/\/login\?reset=1/);
  await expect(page.getByText(/password updated/i)).toBeVisible();

  await login(page, user);
  await expect(formAlert(page)).toBeVisible();
  await expect(page).toHaveURL(/\/login/);

  await login(page, { email: user.email, password: NEW_PASSWORD });
  await expect(page).toHaveURL(/\/app$/);
});

test("deleting the account signs out and the account can no longer log in", async ({ page }) => {
  await page.getByRole("button", { name: "Delete my account" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Confirm password").fill(user.password);
  await dialog.getByRole("button", { name: "I understand, delete" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Grip the day");

  await login(page, user);
  await expect(formAlert(page)).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});
