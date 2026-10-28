import { expect, test } from "@playwright/test";
import {
  fillRegisterForm,
  formAlert,
  login,
  logout,
  newUser,
  perchHeading,
  registerUser,
  submitLogin,
} from "./helpers";

test("registering signs the user in", async ({ page }) => {
  const user = await registerUser(page);

  await expect(perchHeading(page)).toContainText(`${user.firstName}, the branch is bare.`);
  await expect(page.getByText(user.email)).toBeVisible();
});

test("a weak password is rejected on the field", async ({ page }) => {
  await fillRegisterForm(page, { ...newUser(), password: "alllowercaseletters" });

  await expect(formAlert(page)).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
});

test("registering a taken email shows an error", async ({ page }) => {
  const user = await registerUser(page);

  await fillRegisterForm(page, user);

  await expect(formAlert(page)).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
});

test("protected routes redirect to login and remember the target", async ({ page }) => {
  await page.goto("/app/habits");

  await expect(page).toHaveURL(/\/login\?next=%2Fapp%2Fhabits$/);
});

test("a wrong password shows an error and stays on the login page", async ({ page }) => {
  const user = await registerUser(page);
  await logout(page);

  await login(page, { email: user.email, password: "Wrong-Password-1!" });

  await expect(formAlert(page)).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test("logging out ends the session, and logging in returns to the requested page", async ({ page }) => {
  const user = await registerUser(page);
  await logout(page);

  await page.goto("/app/analytics");
  await expect(page).toHaveURL(/\/login\?next=%2Fapp%2Fanalytics$/);

  await submitLogin(page, user);
  await expect(page).toHaveURL(/\/app\/analytics$/);
});

test("login ignores an unsafe next target", async ({ page }) => {
  const user = await registerUser(page);
  await logout(page);

  await page.goto("/login?next=%2F%2Fevil.example");
  await submitLogin(page, user);

  await expect(page).toHaveURL(/\/app$/);
  expect(new URL(page.url()).hostname).toBe("localhost");
});

test("forgot password always confirms", async ({ page }) => {
  await page.goto("/forgot-password");
  await page.getByLabel("Email").fill(newUser().email);
  await page.getByRole("button", { name: "Send reset link" }).click();

  await expect(page.getByText(/a reset link is on its way/i)).toBeVisible();
});
