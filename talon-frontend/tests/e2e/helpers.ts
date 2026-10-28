import { expect, type Page } from "@playwright/test";

export const PASSWORD = "Talon-Test-Pass-9!";
export const NEW_PASSWORD = "Talon-New-Pass-7!";

export type TestUser = { firstName: string; lastName: string; email: string; password: string };
export type Credentials = Pick<TestUser, "email" | "password">;

const uniqueId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const newUser = (): TestUser => ({
  firstName: "Ada",
  lastName: "Tester",
  email: `e2e+${uniqueId()}@example.com`,
  password: PASSWORD,
});

export const uniqueHabitName = () => `Habit ${uniqueId()}`;

export const formAlert = (page: Page) => page.locator("form").getByRole("alert").first();

export const perchHeading = (page: Page) => page.getByRole("heading", { level: 2 });

export const openFromSidebar = (page: Page, name: string) =>
  page.getByRole("link", { name, exact: true }).click();

export async function fillRegisterForm(page: Page, user: TestUser) {
  await page.goto("/register");
  await page.getByLabel("First name").fill(user.firstName);
  await page.getByLabel("Last name").fill(user.lastName);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByRole("button", { name: "Create account" }).click();
}

export async function registerUser(page: Page, user: TestUser = newUser()): Promise<TestUser> {
  await fillRegisterForm(page, user);

  try {
    await page.waitForURL(/\/app$/, { timeout: 15_000 });
  } catch (error) {
    const message = await formAlert(page)
      .textContent({ timeout: 1_000 })
      .catch(() => null);
    if (message?.includes("Too many attempts")) {
      throw new Error("Registration was rate limited (429). Relax the API throttle for the test environment.");
    }
    throw error;
  }

  await expect(perchHeading(page)).toBeVisible();
  return user;
}

export async function submitLogin(page: Page, credentials: Credentials) {
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password", { exact: true }).fill(credentials.password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

export async function login(page: Page, credentials: Credentials) {
  await page.goto("/login");
  await submitLogin(page, credentials);
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: "Log out" }).click();
  await page.waitForURL(/\/login/);
}

export async function createHabit(page: Page, name: string = uniqueHabitName()): Promise<string> {
  await page.getByRole("link", { name: "New habit", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill(name);
  await page.getByRole("button", { name: "Create habit" }).click();
  await page.waitForURL(/\/app\/habits$/);
  return name;
}
