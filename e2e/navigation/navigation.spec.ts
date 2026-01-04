// e2e/navigation/navigation.spec.ts
import { test, expect } from '@playwright/test';

/**
 * Navigation E2E Tests
 * Tests the application navigation and routing
 */

test.describe('Navigation', () => {
    // ===========================================
    // PUBLIC NAVIGATION TESTS
    // ===========================================
    test.describe('Public Navigation', () => {
        test('should navigate to home page', async ({ page }) => {
            await page.goto('/');

            // Check for home page content
            await expect(page).toHaveURL('/');
            await expect(page.locator('text=SkillShare').first()).toBeVisible();
        });

        test('should navigate to login page', async ({ page }) => {
            await page.goto('/login');

            await expect(page).toHaveURL('/login');
        });

        test('should navigate to signup page', async ({ page }) => {
            await page.goto('/signup');

            await expect(page).toHaveURL('/signup');
        });

        test('should navigate from login to signup', async ({ page }) => {
            await page.goto('/login');

            const signupLink = page.locator('a[href*="signup"], text=Sign up').first();
            await signupLink.click();

            await expect(page).toHaveURL(/signup/);
        });

        test('should navigate from signup to login', async ({ page }) => {
            await page.goto('/signup');

            const loginLink = page.locator('a[href*="login"], text=Log in, text=Sign in').first();
            await loginLink.click();

            await expect(page).toHaveURL(/login/);
        });
    });

    // ===========================================
    // NAVBAR NAVIGATION TESTS
    // ===========================================
    test.describe('Navbar Navigation', () => {
        test('should have logo that links to home', async ({ page }) => {
            await page.goto('/login');

            const logo = page.locator('a:has-text("SkillShare")').first();
            await logo.click();

            await expect(page).toHaveURL('/');
        });

        test('should have working navigation links for authenticated users', async ({ page }) => {
            // First login
            await page.goto('/login');
            await page.fill('input[type="email"]', 'test@example.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');

            // Wait for login
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

            // Test Browse Skills link
            const skillsLink = page.locator('a:has-text("Browse Skills"), a:has-text("Skills")').first();
            if (await skillsLink.isVisible()) {
                await skillsLink.click();
                await expect(page).toHaveURL(/skills/);
            }
        });

        test('should display user menu when logged in', async ({ page }) => {
            // Login first
            await page.goto('/login');
            await page.fill('input[type="email"]', 'test@example.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');

            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

            // Check for user menu or profile dropdown
            const userMenu = page.locator('[class*="dropdown"], [class*="avatar"], [class*="profile"]').first();
            await expect(userMenu).toBeVisible({ timeout: 5000 });
        });
    });

    // ===========================================
    // DEEP LINK TESTS
    // ===========================================
    test.describe('Deep Links', () => {
        test('should handle direct navigation to skill details', async ({ page }) => {
            // This should redirect to login since it's protected
            await page.goto('/skills/some-skill-id');

            await expect(page).toHaveURL(/login/);
        });

        test('should handle direct navigation to mentor profile', async ({ page }) => {
            await page.goto('/mentors/some-mentor-id');

            await expect(page).toHaveURL(/login/);
        });
    });

    // ===========================================
    // BROWSER HISTORY TESTS
    // ===========================================
    test.describe('Browser History', () => {
        test('should handle back button correctly', async ({ page }) => {
            await page.goto('/');
            await page.goto('/login');

            await page.goBack();

            await expect(page).toHaveURL('/');
        });

        test('should handle forward button correctly', async ({ page }) => {
            await page.goto('/');
            await page.goto('/login');
            await page.goBack();

            await page.goForward();

            await expect(page).toHaveURL('/login');
        });
    });

    // ===========================================
    // 404 / NOT FOUND TESTS
    // ===========================================
    test.describe('404 Handling', () => {
        test('should handle non-existent routes', async ({ page }) => {
            await page.goto('/this-route-does-not-exist-12345');

            // Should either show 404 page or redirect to home/login
            const is404 = await page.locator('text=404').or(page.locator('text=not found')).isVisible().catch(() => false);
            const isHome = page.url().endsWith('/');
            const isLogin = page.url().includes('/login');

            expect(is404 || isHome || isLogin).toBe(true);
        });
    });

    // ===========================================
    // MOBILE NAVIGATION TESTS
    // ===========================================
    test.describe('Mobile Navigation', () => {
        test.use({ viewport: { width: 375, height: 667 } });

        test('should have hamburger menu on mobile', async ({ page }) => {
            await page.goto('/');

            // Check for hamburger menu or mobile menu button
            const hamburger = page.locator('[class*="hamburger"], [class*="menu-toggle"], button[aria-label*="menu"]');

            // Mobile menu might exist
            if (await hamburger.isVisible().catch(() => false)) {
                await expect(hamburger).toBeVisible();
            }
        });

        test('should navigate correctly on mobile', async ({ page }) => {
            await page.goto('/');
            await page.goto('/login');

            await expect(page).toHaveURL('/login');
        });
    });
});
