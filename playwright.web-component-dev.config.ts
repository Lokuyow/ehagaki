import { defineConfig, devices } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
    ...baseConfig,
    webServer: undefined,
    fullyParallel: false,
    workers: 1,
    projects: [
        {
            name: 'web-component-dev-server',
            testMatch: '**/webComponentDevServer.spec.ts',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
});
