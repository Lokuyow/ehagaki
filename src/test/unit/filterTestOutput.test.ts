import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('CI test output filtering', () => {
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
            '',
        ].join('\n'));
    });
});
