import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e',

    // Run tests in parallel
    fullyParallel: true,

    // Fail build on CI if test.only is left in source code
    forbidOnly: !!process.env.CI,

    // Retry failed tests on CI
    retries: process.env.CI ? 2 : 0,

    // Limit workers on CI
    workers: process.env.CI ? 1 : undefined,

    // Reporter configuration
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['list'],
    ],

    // Shared settings for all tests
    use: {
        // Base URL for navigation
        baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',

        // Collect trace on failure
        trace: 'on-first-retry',

        // Screenshot on failure
        screenshot: 'only-on-failure',

        // Video on failure
        video: 'retain-on-failure',

        // Viewport
        viewport: { width: 1280, height: 720 },

        // Timeout for actions
        actionTimeout: 10000,

        // Navigation timeout
        navigationTimeout: 30000,
    },

    // Test timeout
    timeout: 60000,

    // Global setup/teardown
    globalSetup: require.resolve('./e2e/global-setup.ts'),

    // Configure projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        // Mobile viewports
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],

    // Run local dev server before starting tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
});
