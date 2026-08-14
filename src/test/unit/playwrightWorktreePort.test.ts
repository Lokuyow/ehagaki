import { describe, expect, it } from 'vitest';
import {
    buildPlaywrightEndpoints,
    buildPlaywrightViteCommand,
    derivePlaywrightPort,
    normalizeWorktreeRoot,
    parsePlaywrightPort,
    resolvePlaywrightPort,
} from '../../../scripts/playwrightWorktreePort';

describe('playwright worktree port resolver', () => {
    it('uses a valid explicit port and trims surrounding whitespace', () => {
        expect(parsePlaywrightPort('4173')).toBe(4173);
        expect(
            resolvePlaywrightPort({
                rootPath: 'C:/worktrees/ehagaki',
                envPort: '  51234  ',
                platform: 'win32',
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

    it('normalizes Windows separators, case, dot segments, and trailing separators', () => {
        const slashPath = normalizeWorktreeRoot(
            'C:/Users/Example/ehagaki/./test/../',
            'win32',
        );
        const backslashPath = normalizeWorktreeRoot(
            'c:\\users\\example\\ehagaki\\',
            'win32',
        );

        expect(slashPath).toBe('c:\\users\\example\\ehagaki');
        expect(backslashPath).toBe(slashPath);
    });

    it('derives a stable port for the same root and distinct ports for representative roots', () => {
        const firstRoot = normalizeWorktreeRoot(
            'C:/Users/Example/.codex/worktrees/first/ehagaki',
            'win32',
        );
        const secondRoot = normalizeWorktreeRoot(
            'C:/Users/Example/.codex/worktrees/second/ehagaki',
            'win32',
        );

        const firstPort = derivePlaywrightPort(firstRoot);
        expect(resolvePlaywrightPort({
            rootPath: 'c:\\users\\example\\.codex\\worktrees\\first\\ehagaki\\',
            platform: 'win32',
        })).toBe(firstPort);
        expect(firstPort).not.toBe(derivePlaywrightPort(secondRoot));
        expect(firstPort).toBeGreaterThanOrEqual(1024);
        expect(firstPort).toBeLessThanOrEqual(65535);
    });

    it('is independent of time, process id, and randomness', () => {
        const root = normalizeWorktreeRoot('C:/worktrees/ehagaki', 'win32');

        expect([
            derivePlaywrightPort(root),
            derivePlaywrightPort(root),
            derivePlaywrightPort(root),
        ]).toEqual([expect.any(Number), expect.any(Number), expect.any(Number)]);
        expect(derivePlaywrightPort(root)).toBe(derivePlaywrightPort(root));
    });
});

describe('Playwright config connection values', () => {
    it('uses one host and port for the app, server command, and ready URL', async () => {
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
        ]);
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
