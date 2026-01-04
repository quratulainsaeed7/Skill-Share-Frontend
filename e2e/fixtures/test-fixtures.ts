// e2e/fixtures/test-fixtures.ts
import { test as base, Page } from '@playwright/test';

// Test user credentials
export const testUsers = {
    learner: {
        email: 'test-learner@example.com',
        password: 'TestPassword123!',
        name: 'Test Learner',
    },
    mentor: {
        email: 'test-mentor@example.com',
        password: 'TestPassword123!',
        name: 'Test Mentor',
    },
    admin: {
        email: 'test-admin@example.com',
        password: 'AdminPassword123!',
        name: 'Test Admin',
    },
};

// Custom fixtures
export interface TestFixtures {
    authenticatedPage: Page;
    learnerPage: Page;
    mentorPage: Page;
    adminPage: Page;
}

// Helper function to login
async function login(page: Page, email: string, password: string): Promise<void> {
    await page.goto('/login');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for navigation after successful login
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
}

// Extended test with fixtures
export const test = base.extend<TestFixtures>({
    // Authenticated page with default test user
    authenticatedPage: async ({ page }, use) => {
        await login(page, testUsers.learner.email, testUsers.learner.password);
        await use(page);
    },

    // Learner authenticated page
    learnerPage: async ({ page }, use) => {
        await login(page, testUsers.learner.email, testUsers.learner.password);
        await use(page);
    },

    // Mentor authenticated page
    mentorPage: async ({ page }, use) => {
        await login(page, testUsers.mentor.email, testUsers.mentor.password);
        await use(page);
    },

    // Admin authenticated page
    adminPage: async ({ page }, use) => {
        await login(page, testUsers.admin.email, testUsers.admin.password);
        await use(page);
    },
});

export { expect } from '@playwright/test';
