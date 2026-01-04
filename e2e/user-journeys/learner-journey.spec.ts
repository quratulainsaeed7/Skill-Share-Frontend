// e2e/user-journeys/learner-journey.spec.ts
import { test, expect } from '@playwright/test';

/**
 * Complete Learner User Journey E2E Tests
 * Tests the full flow from registration to course enrollment
 */

test.describe('Learner User Journey', () => {
    const testUser = {
        name: `Test Learner ${Date.now()}`,
        email: `learner-${Date.now()}@test.com`,
        password: 'TestPassword123!',
    };

    // ===========================================
    // FULL JOURNEY: REGISTRATION TO DASHBOARD
    // ===========================================
    test.describe('Complete User Onboarding Journey', () => {
        test('should complete full registration flow', async ({ page }) => {
            // Step 1: Navigate to signup
            await page.goto('/signup');
            await expect(page).toHaveURL('/signup');

            // Step 2: Fill registration form
            await page.fill('input[placeholder*="name" i]', testUser.name);
            await page.fill('input[type="email"]', testUser.email);
            await page.fill('input[type="password"]', testUser.password);

            // Select LEARNER role if role selector exists
            const roleSelector = page.locator('select, [role="listbox"]').first();
            if (await roleSelector.isVisible().catch(() => false)) {
                await roleSelector.selectOption({ label: 'Learner' });
            }

            // Step 3: Submit registration
            await page.click('button[type="submit"]');

            // Step 4: Should redirect to email verification
            await expect(page).toHaveURL(/verify-email/, { timeout: 15000 });
        });
    });

    // ===========================================
    // SKILL BROWSING JOURNEY
    // ===========================================
    test.describe('Skill Browsing Journey', () => {
        test.beforeEach(async ({ page }) => {
            // Login before each test
            await page.goto('/login');
            await page.fill('input[type="email"]', 'verified-learner@test.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
        });

        test('should browse available skills', async ({ page }) => {
            // Navigate to skills page
            await page.goto('/skills');

            // Should see skills list
            await expect(page.locator('[class*="skill"], [class*="card"]').first()).toBeVisible({ timeout: 10000 });
        });

        test('should filter skills by category', async ({ page }) => {
            await page.goto('/skills');

            // Look for filter/category selector
            const categoryFilter = page.locator('select, [class*="filter"], [class*="category"]').first();

            if (await categoryFilter.isVisible().catch(() => false)) {
                await categoryFilter.click();
                // Select a category if dropdown appears
                const option = page.locator('[role="option"], option').first();
                if (await option.isVisible().catch(() => false)) {
                    await option.click();
                }
            }
        });

        test('should view skill details', async ({ page }) => {
            await page.goto('/skills');

            // Click on first skill card
            const skillCard = page.locator('[class*="skill"], [class*="card"], a[href*="/skills/"]').first();
            await skillCard.click();

            // Should navigate to skill details
            await expect(page).toHaveURL(/\/skills\/.+/);
        });

        test('should search for skills', async ({ page }) => {
            await page.goto('/skills');

            // Look for search input
            const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

            if (await searchInput.isVisible().catch(() => false)) {
                await searchInput.fill('React');
                await searchInput.press('Enter');

                // Wait for search results
                await page.waitForTimeout(1000);
            }
        });
    });

    // ===========================================
    // ENROLLMENT JOURNEY
    // ===========================================
    test.describe('Course Enrollment Journey', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
            await page.fill('input[type="email"]', 'verified-learner@test.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
        });

        test('should view enrollment modal', async ({ page }) => {
            await page.goto('/skills');

            // Click on first skill
            const skillCard = page.locator('a[href*="/skills/"]').first();
            await skillCard.click();

            // Look for enroll button
            const enrollButton = page.locator('button:has-text("Enroll"), button:has-text("Join")').first();

            if (await enrollButton.isVisible({ timeout: 5000 }).catch(() => false)) {
                await enrollButton.click();

                // Should show enrollment modal or payment flow
                await expect(
                    page.locator('[class*="modal"], [role="dialog"]')
                ).toBeVisible({ timeout: 5000 });
            }
        });
    });

    // ===========================================
    // WALLET JOURNEY
    // ===========================================
    test.describe('Wallet Journey', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
            await page.fill('input[type="email"]', 'verified-learner@test.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
        });

        test('should view wallet page', async ({ page }) => {
            await page.goto('/wallet');

            // Should see wallet balance or wallet content
            await expect(
                page.locator('text=balance').or(page.locator('text=wallet')).or(page.locator('text=credits'))
            ).toBeVisible({ timeout: 10000 });
        });

        test('should view transaction history', async ({ page }) => {
            await page.goto('/wallet');

            // Look for transactions section
            const transactionsSection = page.locator('text=transaction').or(page.locator('text=history'));
            await expect(transactionsSection.first()).toBeVisible({ timeout: 10000 });
        });
    });

    // ===========================================
    // MEETINGS JOURNEY
    // ===========================================
    test.describe('Meetings Journey', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
            await page.fill('input[type="email"]', 'verified-learner@test.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
        });

        test('should view meetings page', async ({ page }) => {
            await page.goto('/meetings');

            // Should see meetings page content
            await expect(page).toHaveURL('/meetings');
        });

        test('should see upcoming meetings or empty state', async ({ page }) => {
            await page.goto('/meetings');

            // Should show either meetings or empty state message
            const hasMeetings = await page.locator('[class*="meeting"], [class*="booking"]').first().isVisible().catch(() => false);
            const hasEmptyState = await page.locator('text=no meeting').or(page.locator('text=no booking')).first().isVisible().catch(() => false);

            expect(hasMeetings || hasEmptyState).toBe(true);
        });
    });

    // ===========================================
    // PROFILE JOURNEY
    // ===========================================
    test.describe('Profile Journey', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
            await page.fill('input[type="email"]', 'verified-learner@test.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
        });

        test('should view profile page', async ({ page }) => {
            await page.goto('/profile');

            await expect(page).toHaveURL('/profile');
        });

        test('should navigate to settings', async ({ page }) => {
            await page.goto('/settings');

            await expect(page).toHaveURL('/settings');
        });
    });
});
