import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://www.care.piedmont.org/providers');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Piedmont/);
});