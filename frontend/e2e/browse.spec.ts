import { test, expect } from "@playwright/test";

test("home to product and cart", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Studio|studio/i);

  await page.getByRole("link", { name: "Xem bộ sưu tập" }).click();
  await expect(page).toHaveURL(/collections/);

  await page.locator('a[href^="/collections/"]').first().click();
  await page.locator('a[href^="/products/"]').first().click();
  await expect(page.getByRole("button", { name: "Thêm vào giỏ" }).first()).toBeVisible();

  await page.getByRole("button", { name: "Thêm vào giỏ" }).first().click();
  await page.getByRole("link", { name: /Giỏ hàng/ }).click();
  await expect(page.getByRole("heading", { name: "Giỏ hàng" })).toBeVisible();
});

test("checkout form validation", async ({ page }) => {
  await page.goto("/products/binh-minh-ua");
  await page.getByRole("button", { name: "Thêm vào giỏ" }).first().click();
  await page.goto("/checkout");
  await page.getByRole("button", { name: "Đặt hàng" }).click();
  await expect(page.getByPlaceholder("Họ tên")).toBeVisible();
});
