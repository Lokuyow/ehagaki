import { defineConfig } from '@playwright/test';
import { resolvePlaywrightBrowserNames } from './scripts/playwrightChromiumOnlyMode.mjs';

const serviceWorkerBrowsers = resolvePlaywrightBrowserNames(['chromium', 'firefox', 'webkit']);

export default defineConfig({
    testDir: './src/test/e2e',
    testMatch: ['**/serviceWorkerUpdate.spec.ts', '**/uploadedMediaServiceWorker.spec.ts'],
    globalSetup: './scripts/buildServiceWorkerTestFixtures.mjs',
    workers: 1,
    use: { locale: 'ja-JP', viewport: { width: 360, height: 800 } },
    projects: serviceWorkerBrowsers.map((browserName) => ({
        name: `sw-${browserName}`,
        use: { browserName: browserName as 'chromium' | 'firefox' | 'webkit' },
    })),
});
