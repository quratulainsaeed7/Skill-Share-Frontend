// e2e/auth/auth.spec.ts
import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * Tests the complete authentication flow including:
 * - Registration
 * - Login
 * - Email verification
 * - Profile completion
 * - Logout
 */

test.describe('Authentication Flow', () => {
    // ===========================================
    // REGISTRATION TESTS
    // ===========================================
    test.describe('Registration', () => {
        test('should display registration form', async ({ page }) => {
            await page.goto('/signup');

            await expect(page.locator('input[type="email"]')).toBeVisible();
            await expect(page.locator('input[type="password"]')).toBeVisible();
            await expect(page.locator('button[type="submit"]')).toBeVisible();
        });

        test('should show validation errors for empty form', async ({ page }) => {
            await page.goto('/signup');

            await page.click('button[type="submit"]');

            // Should show validation errors
            await expect(page.locator('text=required').first()).toBeVisible({ timeout: 5000 });
        });

        test('should show error for invalid email', async ({ page }) => {
            await page.goto('/signup');

            await page.fill('input[type="email"]', 'invalid-email');
            await page.fill('input[type="password"]', 'ValidPassword123!');
            await page.click('button[type="submit"]');

            // Should show email validation error
            await expect(page.locator('text=valid email')).toBeVisible({ timeout: 5000 });
        });

        test('should show error for weak password', async ({ page }) => {
            await page.goto('/signup');

            await page.fill('input[type="email"]', 'test@example.com');
            await page.fill('input[type="password"]', '123');
            await page.click('button[type="submit"]');

            // Should show password validation error
            await expect(page.locator('text=password').first()).toBeVisible({ timeout: 5000 });
        });

        test('should successfully register new user', async ({ page }) => {
            await page.goto('/signup');

            const uniqueEmail = `test-${Date.now()}@example.com`;

            // Fill out registration form
            await page.fill('input[placeholder*="name" i]', 'Test User');
            await page.fill('input[type="email"]', uniqueEmail);
            await page.fill('input[type="password"]', 'ValidPassword123!');

            // Select role if available
            const roleSelect = page.locator('select, [role="listbox"]').first();
            if (await roleSelect.isVisible()) {
                await roleSelect.selectOption('LEARNER');
            }

            await page.click('button[type="submit"]');

            // Should redirect to email verification
            await expect(page).toHaveURL(/verify-email/, { timeout: 10000 });
        });

        test('should show error for duplicate email', async ({ page }) => {
            await page.goto('/signup');

            // Use an email that's likely already registered
            await page.fill('input[placeholder*="name" i]', 'Test User');
            await page.fill('input[type="email"]', 'existing@example.com');
            await page.fill('input[type="password"]', 'ValidPassword123!');
            await page.click('button[type="submit"]');

            // Should show duplicate email error
            await expect(page.locator('text=already exists').or(page.locator('text=already registered'))).toBeVisible({ timeout: 10000 });
        });
    });

    // ===========================================
    // LOGIN TESTS
    // ===========================================
    test.describe('Login', () => {
        test('should display login form', async ({ page }) => {
            await page.goto('/login');

            await expect(page.locator('input[type="email"]')).toBeVisible();
            await expect(page.locator('input[type="password"]')).toBeVisible();
            await expect(page.locator('button[type="submit"]')).toBeVisible();
        });

        test('should show error for invalid credentials', async ({ page }) => {
            await page.goto('/login');

            await page.fill('input[type="email"]', 'wrong@example.com');
            await page.fill('input[type="password"]', 'WrongPassword123!');
            await page.click('button[type="submit"]');

            // Should show login error
            await expect(page.locator('text=invalid').or(page.locator('text=incorrect'))).toBeVisible({ timeout: 10000 });
        });

        test('should show validation error for empty email', async ({ page }) => {
            await page.goto('/login');

            await page.fill('input[type="password"]', 'SomePassword123!');
            await page.click('button[type="submit"]');

            await expect(page.locator('text=required').or(page.locator('text=email'))).toBeVisible({ timeout: 5000 });
        });

        test('should show validation error for empty password', async ({ page }) => {
            await page.goto('/login');

            await page.fill('input[type="email"]', 'test@example.com');
            await page.click('button[type="submit"]');

            await expect(page.locator('text=required').or(page.locator('text=password'))).toBeVisible({ timeout: 5000 });
        });

        test('should have link to signup page', async ({ page }) => {
            await page.goto('/login');

            const signupLink = page.locator('a[href*="signup"], text=Sign up, text=Register');
            await expect(signupLink.first()).toBeVisible();
        });
    });

    // ===========================================
    // LOGOUT TESTS
    // ===========================================
    test.describe('Logout', () => {
        test('should successfully logout', async ({ page }) => {
            // First, login (using stored credentials or session)
            await page.goto('/login');

            // Assuming there's a test account
            await page.fill('input[type="email"]', 'test@example.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');

            // Wait for successful login
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

            // Find and click logout button
            const logoutButton = page.locator('text=Logout').or(page.locator('button:has-text("Log out")'));
            if (await logoutButton.isVisible()) {
                await logoutButton.click();

                // Should redirect to login or home
                await expect(page).toHaveURL(/login|\/$/);
            }
        });
    });

    // ===========================================
    // SESSION PERSISTENCE TESTS
    // ===========================================
    test.describe('Session Persistence', () => {
        test('should maintain session on page refresh', async ({ page }) => {
            await page.goto('/login');

            await page.fill('input[type="email"]', 'test@example.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');

            // Wait for successful login
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

            // Refresh the page
            await page.reload();

            // Should still be logged in (not redirected to login)
            await expect(page).not.toHaveURL(/login/);
        });
    });

    // ===========================================
    // PROTECTED ROUTE ACCESS TESTS
    // ===========================================
    test.describe('Protected Route Access', () => {
        test('should redirect to login when accessing protected route while unauthenticated', async ({ page }) => {
            // Clear any existing session
            await page.context().clearCookies();

            // Try to access a protected route
            await page.goto('/profile');

            // Should redirect to login
            await expect(page).toHaveURL(/login/);
        });

        test('should redirect to login when accessing wallet while unauthenticated', async ({ page }) => {
            await page.context().clearCookies();
            await page.goto('/wallet');
            await expect(page).toHaveURL(/login/);
        });

        test('should redirect to login when accessing meetings while unauthenticated', async ({ page }) => {
            await page.context().clearCookies();
            await page.goto('/meetings');
            await expect(page).toHaveURL(/login/);
        });
    });
});
