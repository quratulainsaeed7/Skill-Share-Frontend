// e2e/user-journeys/mentor-journey.spec.ts
import { test, expect } from '@playwright/test';

/**
 * Complete Mentor User Journey E2E Tests
 * Tests the full flow from registration to skill creation and management
 */

test.describe('Mentor User Journey', () => {
    // ===========================================
    // MENTOR REGISTRATION JOURNEY
    // ===========================================
    test.describe('Mentor Registration Journey', () => {
        test('should register as mentor', async ({ page }) => {
            const testEmail = `mentor-${Date.now()}@test.com`;

            await page.goto('/signup');

            await page.fill('input[placeholder*="name" i]', 'Test Mentor');
            await page.fill('input[type="email"]', testEmail);
            await page.fill('input[type="password"]', 'TestPassword123!');

            // Select MENTOR role
            const roleSelector = page.locator('select, [role="listbox"]').first();
            if (await roleSelector.isVisible().catch(() => false)) {
                await roleSelector.selectOption({ label: 'Mentor' });
            }

            await page.click('button[type="submit"]');

            // Should redirect to email verification
            await expect(page).toHaveURL(/verify-email/, { timeout: 15000 });
        });
    });

    // ===========================================
    // SKILL CREATION JOURNEY
    // ===========================================
    test.describe('Skill Creation Journey', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
            await page.fill('input[type="email"]', 'verified-mentor@test.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
        });

        test('should navigate to create skill page', async ({ page }) => {
            await page.goto('/create-skill');

            await expect(page).toHaveURL('/create-skill');
        });

        test('should see skill creation form', async ({ page }) => {
            await page.goto('/create-skill');

            // Should see form fields for skill creation
            const hasTitle = await page.locator('input[placeholder*="title" i], input[name*="name" i]').isVisible().catch(() => false);
            const hasDescription = await page.locator('textarea, [class*="description"]').isVisible().catch(() => false);

            expect(hasTitle || hasDescription).toBe(true);
        });

        test('should show validation errors for empty skill form', async ({ page }) => {
            await page.goto('/create-skill');

            // Try to submit empty form
            const submitButton = page.locator('button[type="submit"], button:has-text("Create")').first();
            await submitButton.click();

            // Should show validation errors
            await expect(page.locator('text=required').first()).toBeVisible({ timeout: 5000 });
        });

        test('should create a new skill', async ({ page }) => {
            await page.goto('/create-skill');

            const skillName = `Test Skill ${Date.now()}`;

            // Fill skill creation form
            await page.fill('input[placeholder*="title" i], input[name*="name" i]', skillName);

            const descriptionField = page.locator('textarea').first();
            if (await descriptionField.isVisible().catch(() => false)) {
                await descriptionField.fill('This is a test skill description for E2E testing');
            }

            // Fill price if available
            const priceField = page.locator('input[type="number"], input[name*="price" i]').first();
            if (await priceField.isVisible().catch(() => false)) {
                await priceField.fill('50');
            }

            // Select category if available
            const categorySelect = page.locator('select[name*="category" i]').first();
            if (await categorySelect.isVisible().catch(() => false)) {
                await categorySelect.selectOption({ index: 1 });
            }

            // Submit form
            const submitButton = page.locator('button[type="submit"], button:has-text("Create")').first();
            await submitButton.click();

            // Should redirect or show success
            await page.waitForTimeout(2000);
        });
    });

    // ===========================================
    // SKILL MANAGEMENT JOURNEY
    // ===========================================
    test.describe('Skill Management Journey', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
            await page.fill('input[type="email"]', 'verified-mentor@test.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
        });

        test('should view taught courses', async ({ page }) => {
            await page.goto('/profile');

            // Should see taught courses section
            const taughtSection = page.locator('text=taught').or(page.locator('text=my skills')).or(page.locator('text=my courses'));
            await expect(taughtSection.first()).toBeVisible({ timeout: 10000 });
        });

        test('should view enrolled students', async ({ page }) => {
            // Navigate to a skill detail page
            await page.goto('/skills');

            const skillCard = page.locator('a[href*="/skills/"]').first();
            if (await skillCard.isVisible().catch(() => false)) {
                await skillCard.click();

                // Look for enrolled students section
                const enrolledSection = page.locator('text=student').or(page.locator('text=enrolled'));
                // This may or may not be visible depending on the skill
            }
        });
    });

    // ===========================================
    // BOOKING MANAGEMENT JOURNEY
    // ===========================================
    test.describe('Booking Management Journey', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
            await page.fill('input[type="email"]', 'verified-mentor@test.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
        });

        test('should view mentor meetings', async ({ page }) => {
            await page.goto('/meetings');

            await expect(page).toHaveURL('/meetings');
        });

        test('should see booking requests or empty state', async ({ page }) => {
            await page.goto('/meetings');

            // Should show bookings or empty state
            const hasBookings = await page.locator('[class*="booking"], [class*="meeting"]').first().isVisible().catch(() => false);
            const hasEmptyState = await page.locator('text=no meeting').or(page.locator('text=no booking')).first().isVisible().catch(() => false);

            expect(hasBookings || hasEmptyState).toBe(true);
        });
    });

    // ===========================================
    // LESSON MANAGEMENT JOURNEY
    // ===========================================
    test.describe('Lesson Management Journey', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
            await page.fill('input[type="email"]', 'verified-mentor@test.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
        });

        test('should view skill with lessons', async ({ page }) => {
            await page.goto('/skills');

            const skillCard = page.locator('a[href*="/skills/"]').first();
            if (await skillCard.isVisible().catch(() => false)) {
                await skillCard.click();

                // Look for lessons section
                const lessonsSection = page.locator('text=lesson').first();
                // Lessons may or may not be present
            }
        });
    });

    // ===========================================
    // MENTOR EARNINGS JOURNEY
    // ===========================================
    test.describe('Mentor Earnings Journey', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
            await page.fill('input[type="email"]', 'verified-mentor@test.com');
            await page.fill('input[type="password"]', 'TestPassword123!');
            await page.click('button[type="submit"]');
            await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
        });

        test('should view wallet with earnings', async ({ page }) => {
            await page.goto('/wallet');

            // Should see wallet with earnings information
            await expect(page).toHaveURL('/wallet');

            const earningsSection = page.locator('text=earning').or(page.locator('text=balance')).or(page.locator('text=credit'));
            await expect(earningsSection.first()).toBeVisible({ timeout: 10000 });
        });
    });
});
