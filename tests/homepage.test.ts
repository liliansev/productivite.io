import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");

    // Check title
    await expect(page).toHaveTitle(/Productivité/);

    // Check hero section
    await expect(page.locator("h1")).toContainText("productivité");

    // Check navigation links
    await expect(page.locator('a[href="/tools"]')).toBeVisible();
    await expect(page.locator('a[href="/categories"]')).toBeVisible();
  });

  test("should display tool cards", async ({ page }) => {
    await page.goto("/");

    // Wait for tools to load
    await page.waitForSelector('[href^="/tools/"]');

    // Check that tool cards are displayed
    const toolCards = page.locator('[href^="/tools/"]');
    await expect(toolCards.first()).toBeVisible();
  });

  test("should display category cards", async ({ page }) => {
    await page.goto("/");

    // Scroll to categories section
    await page.evaluate(() => window.scrollTo(0, 1000));

    // Check that category cards are displayed
    const categoryCards = page.locator('[href^="/categories/"]');
    await expect(categoryCards.first()).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("should navigate to tools page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/tools"]:first-of-type');

    await expect(page).toHaveURL("/tools");
    await expect(page.locator("h1")).toContainText("Outils");
  });

  test("should navigate to categories page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/categories"]:first-of-type');

    await expect(page).toHaveURL("/categories");
    await expect(page.locator("h1")).toContainText("Catégories");
  });
});
