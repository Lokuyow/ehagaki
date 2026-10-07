import { defineConfig, devices } from '@playwright/test';
import {
    buildPlaywrightEndpoints,
    buildPlaywrightViteCommand,
    resolvePlaywrightPort,
} from './scripts/playwrightWorktreePort';

const resolvedPort = resolvePlaywrightPort({});
const endpoints = buildPlaywrightEndpoints(resolvedPort);

export default defineConfig({
    testDir: './src/test/e2e',
    timeout: 30_000,
    expect: {
        timeout: 5_000,
    },
    fullyParallel: false,
    workers: 2,
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
            testIgnore: '**/webComponentDevServer.spec.ts',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'mobile-chromium',
            testIgnore: '**/webComponentDevServer.spec.ts',
            use: {
                ...devices['iPhone 13'],
                browserName: 'chromium',
            },
        },
        {
            name: 'android-chromium',
            testMatch: '**/webComponentLite.spec.ts',
            grep: /@android-chrome/,
            use: {
                ...devices['Pixel 7'],
                browserName: 'chromium',
            },
        },
        {
            name: 'mobile-webkit',
            testMatch: [
                '**/composerTargetDialog.spec.ts',
                '**/webComponentEmbed.spec.ts',
                '**/webComponentLite.spec.ts',
                '**/webComponentParentClientExample.spec.ts',
                '**/footerSettingShortcuts.spec.ts',
                '**/postEditorSending.spec.ts',
                '**/postHistoryDialog.spec.ts',
                '**/sensitiveContentPayload.spec.ts',
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
        {
            name: 'desktop-firefox-editor-paste',
            testMatch: ['**/postEditorSending.spec.ts', '**/webComponentLite.spec.ts'],
            grep: /pastes HTML with clipboard plain text/,
            use: {
                ...devices['Desktop Firefox'],
            },
        },
    ],
});
