import { defineConfig, devices, type Project } from '@playwright/test';
import {
    buildPlaywrightEndpoints,
    buildPlaywrightViteCommand,
    resolvePlaywrightPort,
} from './scripts/playwrightWorktreePort';
import { isChromiumOnlyPlaywrightRun } from './scripts/playwrightChromiumOnlyMode.mjs';

const resolvedPort = resolvePlaywrightPort({});
const endpoints = buildPlaywrightEndpoints(resolvedPort);

const productionSwSpecs = [
    '**/serviceWorkerUpdate.spec.ts',
    '**/uploadedMediaServiceWorker.spec.ts',
];

const playwrightProjects: Project[] = [
    {
        name: 'desktop-chromium',
        testIgnore: ['**/webComponentDevServer.spec.ts', ...productionSwSpecs],
        use: {
            ...devices['Desktop Chrome'],
        },
    },
    {
        name: 'mobile-chromium',
        testMatch: [
            '**/postHistoryDialog.spec.ts',
            '**/uploadRelaySync.spec.ts',
            '**/postEditorSending.spec.ts',
            '**/webComponentEmbed.spec.ts',
            '**/webComponentLite.spec.ts',
            '**/composerTargetDialog.spec.ts',
        ],
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
            '**/uploadRelaySync.spec.ts',
            '**/composerTargetDialog.spec.ts',
            '**/webComponentEmbed.spec.ts',
            '**/webComponentLite.spec.ts',
            '**/webComponentParentClientExample.spec.ts',
            '**/footerSettingShortcuts.spec.ts',
            '**/postEditorSending.spec.ts',
            '**/postHistoryDialog.spec.ts',
            '**/historyTabs.spec.ts',
            '**/iframeParentLogin.spec.ts',
            '**/postHistoryFullScan.spec.ts',
            '**/postHistoryJsonlWorker.spec.ts',
            '**/postRepost.spec.ts',
            '**/postReaction.spec.ts',
            '**/sensitiveContentPayload.spec.ts',
        ],
        use: {
            ...devices['iPhone 13'],
            browserName: 'webkit',
        },
    },
    {
        name: 'desktop-firefox',
        testMatch: ['**/webComponentEmbed.spec.ts', '**/uploadRelaySync.spec.ts', '**/iframeParentLogin.spec.ts'],
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
];

const projects = isChromiumOnlyPlaywrightRun()
    ? playwrightProjects.filter((project) => {
          const name = project.name ?? '';
          return !name.includes('firefox') && !name.includes('webkit');
      })
    : playwrightProjects;

export default defineConfig({
    testDir: './src/test/e2e',
    testIgnore: productionSwSpecs,
    timeout: 30_000,
    expect: {
        timeout: 5_000,
    },
    fullyParallel: false,
    workers: 4,
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
    projects,
});
