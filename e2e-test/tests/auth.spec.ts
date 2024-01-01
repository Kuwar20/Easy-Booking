import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173';

test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL);

  //get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading",{name:"Sign In"})).toBeVisible();
  
  await page.locator("[name=email]").fill("test4@gmail.com");
  await page.locator("[name=password]").fill("Test4@gmail.com");

  await page.getByRole("button",{name:"Login"}).click();

  await expect(page.getByText("Sign in Successfull")).toBeVisible();
  await expect(page.getByRole("link",{name:"My Bookings"})).toBeVisible();
  await expect(page.getByRole("link",{name:"My Hotels"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Sign Out"})).toBeVisible();
});