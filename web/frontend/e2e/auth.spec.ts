import { test, expect } from '@playwright/test';

test.describe.serial('Authentication Flow', () => {
  const uniqueId = Date.now();
  const userData = {
    firstName: 'E2E',
    lastName: 'Test',
    email: `e2e-${uniqueId}@test.com`,
    password: 'Password123!',
  };

  test('should register a new user', async ({ page }) => {
    await page.goto('/register');

    // Fill registration form
    await page.fill('input[placeholder="First Name"]', userData.firstName);
    await page.fill('input[placeholder="Last Name"]', userData.lastName);
    await page.fill('input[placeholder="Email address"]', userData.email);
    await page.fill('input[placeholder="Password"]', userData.password);

    // Submit
    await page.click('button[type="submit"]');

    // Expect redirect to home
    await expect(page).toHaveURL('/');

    // Optional: Check if we are logged in (e.g. verify presence of Logout button if we added one,
    // or just that we are on home and not finding the login form anymore)
    // For now, URL check is good.
  });

  test('should login with the registered user', async ({ page }) => {
    // Ensure we are logged out or start fresh.
    // Since state is not shared between tests by default unless configured,
    // this test starts with a fresh context, BUT the backend DB persists the user.

    await page.goto('/login');

    // Fill login form
    await page.fill('input[placeholder="Email address"]', userData.email);
    await page.fill('input[placeholder="Password"]', userData.password);

    // Submit
    await page.click('button[type="submit"]');

    // Expect redirect to home
    await expect(page).toHaveURL('/');
  });
});
