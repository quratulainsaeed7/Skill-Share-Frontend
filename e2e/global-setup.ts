// e2e/global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright E2E tests
 * Runs once before all tests
 */
async function globalSetup(config: FullConfig) {
    const { baseURL } = config.projects[0].use;

    console.log(`🚀 Setting up E2E tests with baseURL: ${baseURL}`);

    // Verify the application is running
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto(baseURL!, { timeout: 30000 });
        console.log('✅ Application is running');
    } catch (error) {
        console.error('❌ Failed to connect to application. Make sure the dev server is running.');
        throw error;
    } finally {
        await browser.close();
    }

    // Set up test users/data if needed
    // This could include API calls to seed the database
    console.log('✅ Global setup complete');
}

export default globalSetup;
