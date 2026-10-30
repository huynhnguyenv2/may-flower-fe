import { test, expect } from "@playwright/test";

test.describe("AI Florist", () => {
  test("find-your-flowers loads chat UI", async ({ page }) => {
    await page.goto("/vi/find-your-flowers");
    await expect(page.getByRole("heading", { name: /AI Florist/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Mô tả bó hoa/i)).toBeVisible({ timeout: 15_000 });
  });
});
