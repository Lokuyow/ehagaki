import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('CI test output filtering', () => {
    it('keeps numeric Vitest timings, diagnostics, and skipped/todo counts', () => {
        const lines = [
            ' Duration  119.60s (environment 50%, tests 30%, import 9%, worker 5%, transform 4%, setup 2%)',
            '\x1b[32m Duration  750ms (tests 99%, typecheck 1%)\x1b[0m',
            ' Duration  1.50s',
            ' Isolate  479 workers spawned · ~2.00s startup each (spawn + environment, per file)',
            ' Environment  jsdom was created 479 times · 59.20s total, 50% of tracked time',
            'Unhandled errors: 0',
            'Unhandled errors: 2',
            ' Test Files  478 passed | 1 skipped (479)',
            ' Tests  1 failed | 6193 passed | 1 skipped | 1 todo (6196)',
            'fs cache was cleared because lockfile has changed',
            '\x1b[2m10:20:30 PM \x1b[33m[vitest]\x1b[0m fs cache was cleared because lockfile has changed',
        ];
        const result = spawnSync(process.execPath, ['scripts/filterTestOutput.mjs'], {
            encoding: 'utf8',
            input: lines.join('\r\n'),
        });
        expect(result.status).toBe(0);
        expect(result.stdout).toBe([
            'Duration  119.60s (environment 50%, tests 30%, import 9%, worker 5%, transform 4%, setup 2%)',
            'Duration  750ms (tests 99%, typecheck 1%)',
            'Duration  1.50s',
            'Isolate  479 workers spawned · ~2.00s startup each (spawn + environment, per file)',
            'Environment  jsdom was created 479 times · 59.20s total, 50% of tracked time',
            'Unhandled errors: 0',
            'Unhandled errors: 2',
            'Test Files  478 passed | 1 skipped (479)',
            'Tests  1 failed | 6193 passed | 1 skipped | 1 todo (6196)',
            'fs cache was cleared because lockfile has changed',
            'fs cache was cleared because lockfile has changed',
            '',
        ].join('\n'));
    });

    it('keeps file timings only for existing repository test paths on either OS', () => {
        const result = spawnSync(process.execPath, ['scripts/filterTestOutput.mjs'], {
            encoding: 'utf8',
            input: [
                '\x1b[32m ✓ src/test/unit/filterTestOutput.test.ts (2 tests) 123ms\x1b[0m',
                ' ✓ src\\test\\unit\\filterTestOutput.test.ts (1 test) 1.5ms',
                ' ❯ src/test/unit/filterTestOutput.test.ts (4 tests | 1 failed | 1 skipped | 1 todo) 42ms',
                ' ↓ src/test/unit/filterTestOutput.test.ts (1 test | 1 skipped) 0ms',
                ' ✓ src/test/integration/editor-url-paste.integration.test.ts (1 test) 3ms',
            ].join('\n'),
        });
        expect(result.status).toBe(0);
        expect(result.stdout).toBe([
            '✓ src/test/unit/filterTestOutput.test.ts (2 tests) 123ms',
            '✓ src/test/unit/filterTestOutput.test.ts (1 test) 1.5ms',
            '❯ src/test/unit/filterTestOutput.test.ts (4 tests | 1 failed | 1 skipped | 1 todo) 42ms',
            '↓ src/test/unit/filterTestOutput.test.ts (1 test | 1 skipped) 0ms',
            '✓ src/test/integration/editor-url-paste.integration.test.ts (1 test) 3ms',
            '',
        ].join('\n'));
    });

    it('rejects performance lines containing titles, values, or unknown fields', () => {
        const result = spawnSync(process.execPath, ['scripts/filterTestOutput.mjs'], {
            encoding: 'utf8',
            input: [
                'private title Duration 1.00s (tests 100%)',
                'Duration 1.00s (tests 100%) private payload',
                'Duration 1.00s (private 100%)',
                'Duration 1.00s (tests 100%, token 123%)',
                'Duration NaNs (tests 100%)',
                'Duration 1..00s (tests 100%)',
                'Duration 1.00s (tests private%)',
                'Isolate 479 workers spawned · ~2.00s startup each (private title)',
                'Environment private was created 479 times · 1.00s total, 50% of tracked time',
                'Unhandled errors: 0 private payload',
                'Unhandled errors: private',
                'private title fs cache was cleared because lockfile has changed',
                'fs cache was cleared because lockfile has changed private payload',
                '✓ src/test/unit/filterTestOutput.test.ts > private title (1 test) 1ms',
                '✓ src/test/unit/filterTestOutput.test.ts (1 test) 1ms private payload',
                '✓ src/test/unit/filterTestOutput.test.ts (1 test | private payload) 1ms',
                '✓ src/test/unit/filterTestOutput.test.ts (1 test) NaNms',
            ].join('\n'),
        });
        expect(result.status).toBe(0);
        // The existing location-only fallback remains safe for rejected lines.
        expect(result.stdout).toBe('Test location: src/test/unit/filterTestOutput.test.ts\n');
    });

    it('rejects file timings for missing, absolute, or traversing paths', () => {
        const result = spawnSync(process.execPath, ['scripts/filterTestOutput.mjs'], {
            encoding: 'utf8',
            input: [
                '✓ src/test/unit/nonexistent-private.test.ts (1 test) 1ms',
                '✓ /tmp/src/test/unit/filterTestOutput.test.ts (1 test) 1ms',
                '✓ ../src/test/unit/filterTestOutput.test.ts (1 test) 1ms',
                '✓ src/test/unit/../unit/filterTestOutput.test.ts (1 test) 1ms',
                '✓ scripts/filterTestOutput.mjs (1 test) 1ms',
            ].join('\n'),
        });
        expect(result.status).toBe(0);
        expect(result.stdout).toBe([
            'Test location: src/test/unit/filterTestOutput.test.ts',
            'Test location: scripts/filterTestOutput.mjs',
            '',
        ].join('\n'));
    });

    it.each([0, 2])('reports %i unhandled errors without serializing their contents', (count) => {
        const result = spawnSync(process.execPath, ['--input-type=module', '--eval', `
            import Reporter from './scripts/vitestMetricsReporter.mjs';
            new Reporter().onTestRunEnd(
                [{ title: 'private title' }],
                Array.from({ length: ${count} }, () => ({ message: 'private payload' })),
            );
        `], { encoding: 'utf8' });
        expect(result.status).toBe(0);
        expect(result.stdout).toBe(`Unhandled errors: ${count}\n`);
        expect(result.stderr).toBe('');
    });

    it('identifies Service Worker browser failures without exposing titles or values', () => {
        const result = spawnSync(process.execPath, ['scripts/filterTestOutput.mjs'], {
            encoding: 'utf8',
            input: ['chromium', 'firefox', 'webkit'].map(browser =>
                `1) [sw-${browser}] › src/test/e2e/uploadedMediaServiceWorker.spec.ts:307:9 › private title`,
            ).join('\n') + '\nError: private payload\n1) [private-project] › private title',
        });
        expect(result.status).toBe(0);
        expect(result.stdout).toBe([
            'Failure: sw-chromium src/test/e2e/uploadedMediaServiceWorker.spec.ts:307:9',
            'Test location: src/test/e2e/uploadedMediaServiceWorker.spec.ts:307:9',
            'Failure: sw-firefox src/test/e2e/uploadedMediaServiceWorker.spec.ts:307:9',
            'Failure: sw-webkit src/test/e2e/uploadedMediaServiceWorker.spec.ts:307:9',
            '',
        ].join('\n'));
    });

    it('keeps failure counts and locations while dropping sensitive diagnostics', () => {
        const result = spawnSync(process.execPath, ['scripts/filterTestOutput.mjs'], {
            encoding: 'utf8',
            input: [
                '\x1b[31m Test Files  1 failed | 433 passed | 1 skipped (435)\x1b[0m',
                ' Tests  1 failed | 5442 passed | 1 skipped (5444)',
                '  10 failed',
                '  918 passed (15.7m)',
                ' FAIL src/test/unit/playwrightWorktreePort.test.ts > private test title',
                '    at src/test/unit/playwrightWorktreePort.test.ts:180:21',
                'AssertionError: expected private payload to equal private key',
                'stdout | authentication token and signing request body',
                'Error: private post body',
                '1) [mobile-webkit] › src/test/e2e/historyTabs.spec.ts:87:1 › private title',
                'Error: expect(received).toEqual(expected) // private values',
                'CI_METRICS {"testLine":87,"year":2026,"month":10,"day":22,"scrollTop":12.5,"secret":"private post body","count":"private"}',
                'CI_METRICS {"testLine":"private title","token":123456,"rows":["private"]}',
                '\x1b[1A runner progress CI_METRICS {"testLine":123,"count":8,"token":"private"}',
                'CI_METRICS {"mediaListingActions":12,"mediaListingRequests":13,"mediaListingSignatures":13,"payload":"private"}',
            ].join('\n'),
        });
        expect(result.status).toBe(0);
        expect(result.stdout).toBe([
            'Test Files  1 failed | 433 passed | 1 skipped (435)',
            'Tests  1 failed | 5442 passed | 1 skipped (5444)',
            '10 failed',
            '918 passed (15.7m)',
            'Test location: src/test/unit/playwrightWorktreePort.test.ts',
            'Test location: src/test/unit/playwrightWorktreePort.test.ts:180:21',
            'Error category: AssertionError',
            'Failure: mobile-webkit src/test/e2e/historyTabs.spec.ts:87:1',
            'Test location: src/test/e2e/historyTabs.spec.ts:87:1',
            'Assertion: toEqual',
            'CI metrics: {"testLine":87,"year":2026,"month":10,"day":22,"scrollTop":12.5}',
            'CI metrics: {}',
            'CI metrics: {"testLine":123,"count":8}',
            'CI metrics: {"mediaListingActions":12,"mediaListingRequests":13,"mediaListingSignatures":13}',
            '',
        ].join('\n'));
    });
});
