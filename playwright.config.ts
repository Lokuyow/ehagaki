import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './src/test/e2e',
    timeout: 30_000,
    expect: {
        timeout: 5_000,
    },
    fullyParallel: false,
    workers: 1,
    use: {
        baseURL: 'http://127.0.0.1:4173/ehagaki/',
        locale: 'ja-JP',
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'npx vite --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173/ehagaki/post-history-dialog-playwright.html',
        reuseExistingServer: true,
        timeout: 120_000,
    },
    projects: [
        {
            name: 'desktop-chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'mobile-chromium',
            use: {
                ...devices['iPhone 13'],
            },
        },
    ],
});