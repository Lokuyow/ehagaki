import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './src/test/e2e',
    testMatch: '**/serviceWorkerUpdate.spec.ts',
    globalSetup: './scripts/buildServiceWorkerTestFixtures.mjs',
    workers: 1,
    use: { locale: 'ja-JP', viewport: { width: 360, height: 800 } },
    projects: ['chromium', 'firefox', 'webkit'].map((browserName) => ({
        name: `sw-${browserName}`,
        use: { browserName: browserName as 'chromium' | 'firefox' | 'webkit' },
    })),
});
