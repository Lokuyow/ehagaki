import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath, URL as NodeURL } from 'node:url';
import {
    buildPlaywrightEndpoints,
    buildPlaywrightViteCommand,
    resolvePlaywrightPort,
} from './scripts/playwrightWorktreePort';

const worktreeRoot = import.meta.url.startsWith('file://')
    ? fileURLToPath(new NodeURL('.', import.meta.url))
    : process.cwd();
const resolvedPort = resolvePlaywrightPort({ rootPath: worktreeRoot });
const endpoints = buildPlaywrightEndpoints(resolvedPort);

export default defineConfig({
    testDir: './src/test/e2e',
    timeout: 30_000,
    expect: {
        timeout: 5_000,
    },
    fullyParallel: false,
    workers: 1,
    use: {
        baseURL: endpoints.appBaseURL,
        locale: 'ja-JP',
        trace: 'on-first-retry',
    },
    webServer: {
        command: buildPlaywrightViteCommand(resolvedPort),
        url: endpoints.readyURL,
        reuseExistingServer: false,
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
        {
            name: 'mobile-webkit',
            testMatch: [
                '**/composerTargetDialog.spec.ts',
                '**/webComponentEmbed.spec.ts',
            ],
            use: {
                ...devices['iPhone 13'],
                browserName: 'webkit',
            },
        },
        {
            name: 'desktop-firefox',
            testMatch: '**/webComponentEmbed.spec.ts',
            use: {
                ...devices['Desktop Firefox'],
            },
        },
    ],
});
