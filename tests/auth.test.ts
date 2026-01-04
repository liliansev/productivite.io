import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle(/Connexion/);
    await expect(page.locator("h1")).toContainText("Bon retour");

    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should show register page", async ({ page }) => {
    await page.goto("/register");

    await expect(page).toHaveTitle(/Inscription/);

    // Check form elements
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("should navigate from login to register", async ({ page }) => {
    await page.goto("/login");

    await page.click('a[href="/register"]');
    await expect(page).toHaveURL("/register");
  });

  test("should show error on invalid login", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', "invalid@test.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Wait for error message
    await expect(page.locator(".bg-red-50")).toBeVisible({ timeout: 5000 });
  });
});
