import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    AUTO_PORT_MAX_EXCLUSIVE,
    AUTO_PORT_MIN,
    buildPlaywrightEndpoints,
    buildPlaywrightViteCommand,
    generatePlaywrightPort,
    parsePlaywrightPort,
    resolvePlaywrightPort,
} from '../../../scripts/playwrightWorktreePort';

describe('playwright port resolver', () => {
    const originalPortOverride = process.env.EHAGAKI_E2E_PORT;
    const originalAutoPort = process.env.EHAGAKI_E2E_AUTO_PORT;

    beforeEach(() => {
        delete process.env.EHAGAKI_E2E_PORT;
        delete process.env.EHAGAKI_E2E_AUTO_PORT;
    });

    afterEach(() => {
        if (originalPortOverride === undefined) {
            delete process.env.EHAGAKI_E2E_PORT;
        } else {
            process.env.EHAGAKI_E2E_PORT = originalPortOverride;
        }
        if (originalAutoPort === undefined) {
            delete process.env.EHAGAKI_E2E_AUTO_PORT;
        } else {
            process.env.EHAGAKI_E2E_AUTO_PORT = originalAutoPort;
        }
    });

    it('uses a valid explicit port and trims surrounding whitespace', () => {
        expect(parsePlaywrightPort('4173')).toBe(4173);
        expect(
            resolvePlaywrightPort({
                envPort: '  51234  ',
            }),
        ).toBe(51234);
    });

    it.each(['', '0', '1023', '65536', '-1', '12abc', '4173.5', '  '])(
        'rejects invalid explicit port %j',
        (value) => {
            expect(() => parsePlaywrightPort(value)).toThrow(
                /EHAGAKI_E2E_PORT.*1024.*65535/,
            );
        },
    );

    it('accepts the safe non-privileged port boundaries', () => {
        expect(parsePlaywrightPort('1024')).toBe(1024);
        expect(parsePlaywrightPort('65535')).toBe(65535);
    });

    it('generates a port in the automatic range', () => {
        expect(generatePlaywrightPort(() => AUTO_PORT_MIN)).toBe(AUTO_PORT_MIN);
        expect(
            generatePlaywrightPort(() => AUTO_PORT_MAX_EXCLUSIVE - 1),
        ).toBe(AUTO_PORT_MAX_EXCLUSIVE - 1);
    });

    it('reuses one generated port when the config is evaluated again', () => {
        delete process.env.EHAGAKI_E2E_AUTO_PORT;
        const portSource = vi.fn(() => 45_123);

        expect(resolvePlaywrightPort({ portSource })).toBe(45_123);
        expect(resolvePlaywrightPort({ portSource })).toBe(45_123);
        expect(portSource).toHaveBeenCalledTimes(1);
    });

    it.each([44_999, 55_000, 45_123.5, Number.NaN])(
        'rejects an invalid generated port %j',
        (value) => {
            expect(() => generatePlaywrightPort(() => value)).toThrow(
                /Generated Playwright port/,
            );
        },
    );

    it('does not allow the automatic source to override an explicit port', () => {
        const portSource = () => {
            throw new Error('port source should not be called');
        };

        expect(
            resolvePlaywrightPort({ envPort: '51234', portSource }),
        ).toBe(51234);
    });
});

describe('Playwright config connection values', () => {
    it('uses one host and port for the app, server command, and ready URL', async () => {
        const originalPortOverride = process.env.EHAGAKI_E2E_PORT;
        const originalAutoPort = process.env.EHAGAKI_E2E_AUTO_PORT;

        try {
            delete process.env.EHAGAKI_E2E_PORT;
            delete process.env.EHAGAKI_E2E_AUTO_PORT;
            vi.resetModules();

            const { default: config } = await import('../../../playwright.config');
            const baseURL = config.use?.baseURL;
            const webServer = config.webServer as {
                command: string;
                reuseExistingServer?: boolean;
                url: string;
            };
            const baseUrl = new URL(baseURL as string);
            const readyUrl = new URL(webServer.url);

            expect(baseUrl.hostname).toBe('127.0.0.1');
            expect(readyUrl.hostname).toBe('127.0.0.1');
            expect(baseUrl.port).toBe(readyUrl.port);
            expect(Number(baseUrl.port)).toBeGreaterThanOrEqual(AUTO_PORT_MIN);
            expect(Number(baseUrl.port)).toBeLessThan(AUTO_PORT_MAX_EXCLUSIVE);
            expect(baseUrl.pathname).toBe('/ehagaki/');
            expect(readyUrl.pathname).toBe(
                '/ehagaki/post-history-dialog-playwright.html',
            );
            expect(webServer.command).toContain(`--host 127.0.0.1`);
            expect(webServer.command).toContain(`--port ${baseUrl.port}`);
            expect(webServer.command).toContain('--strictPort');
            expect(webServer.reuseExistingServer).toBe(false);
            expect(config.projects?.map((project) => project.name)).toEqual([
                'desktop-chromium',
                'mobile-chromium',
                'mobile-webkit',
                'desktop-firefox',
            ]);
            expect(config.projects?.[2]?.testMatch).toEqual([
                '**/composerTargetDialog.spec.ts',
                '**/webComponentEmbed.spec.ts',
                '**/webComponentParentClientExample.spec.ts',
                '**/postEditorSending.spec.ts',
            ]);
        } finally {
            if (originalPortOverride === undefined) {
                delete process.env.EHAGAKI_E2E_PORT;
            } else {
                process.env.EHAGAKI_E2E_PORT = originalPortOverride;
            }
            if (originalAutoPort === undefined) {
                delete process.env.EHAGAKI_E2E_AUTO_PORT;
            } else {
                process.env.EHAGAKI_E2E_AUTO_PORT = originalAutoPort;
            }
            vi.resetModules();
        }
    });

    it('builds all connection values from a supplied port', () => {
        const endpoints = buildPlaywrightEndpoints(54321);

        expect(endpoints).toEqual({
            origin: 'http://127.0.0.1:54321',
            appBaseURL: 'http://127.0.0.1:54321/ehagaki/',
            readyURL:
                'http://127.0.0.1:54321/ehagaki/post-history-dialog-playwright.html',
        });
        expect(buildPlaywrightViteCommand(54321)).toBe(
            'npx vite --host 127.0.0.1 --port 54321 --strictPort',
        );
    });
});
