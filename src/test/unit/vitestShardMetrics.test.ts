import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { aggregateShards, buildShardOutput, canonicalTestPath, inventoryPaths, validateMetrics } from '../../../scripts/vitestShardMetrics.mjs';

const names = ['src/test/unit/alpha.test.ts', 'src/test/unit/beta.integration.test.ts', 'src/test/unit/gamma.test.ts'];
const script = resolve('scripts/vitestShardMetrics.mjs');
let root: string;
const zero = () => ({ total: 0, passed: 0, failed: 0, skipped: 0, todo: 0 });

function metrics(files = names.slice(0, 2)) {
    return {
        version: 1, status: 'passed', files,
        fileCounts: { ...zero(), total: files.length, passed: files.length },
        testCounts: { ...zero(), total: files.length * 2, passed: files.length * 2 },
        unhandledErrors: 0,
    };
}

function shards(os = 'Linux') {
    return [
        buildShardOutput(metrics(), names.map(file => ({ file: join(root, file) })), os, 1, root).value,
        buildShardOutput(metrics(names.slice(2)), null, os, 2, root).value,
    ];
}

function cli(args: string[], env: Record<string, string> = {}) {
    return spawnSync(process.execPath, [script, ...args], {
        cwd: root, encoding: 'utf8',
        env: {
            ...process.env, GITHUB_OUTPUT: join(root, 'outputs.txt'),
            VITEST_SHARD_METRICS_PATH: join(root, 'metrics.json'),
            VITEST_ALL_FILES_PATH: join(root, 'inventory.json'), ...env,
        },
    });
}

describe('Vitest shard metrics', () => {
    beforeEach(() => {
        root = mkdtempSync(join(tmpdir(), 'ehagaki-shard-metrics-'));
        mkdirSync(join(root, 'src/test/unit'), { recursive: true });
        names.forEach(file => writeFileSync(join(root, file), ''));
    });
    afterEach(() => rmSync(root, { recursive: true, force: true }));

    it('canonicalizes existing inventory paths including dotted test names', () => {
        expect(canonicalTestPath(root, join(root, names[1]))).toBe(names[1]);
        expect(inventoryPaths([...names].reverse().map(file => ({ file: join(root, file) })), root)).toEqual([...names].sort());
    });

    it('conserves passed, skipped and todo counts while checking the exact file union', () => {
        const values = shards();
        values[0].files.reverse();
        values[0].testCounts = { total: 5, passed: 3, failed: 0, skipped: 1, todo: 1 };
        values[1].fileCounts = { ...zero(), total: 1, skipped: 1 };
        values[1].testCounts = { ...zero(), total: 1, skipped: 1 };
        expect(aggregateShards(values, ['success', 'success'], 'Linux', root)).toEqual({
            fileCounts: { total: 3, passed: 2, failed: 0, skipped: 1, todo: 0 },
            testCounts: { total: 6, passed: 3, failed: 0, skipped: 2, todo: 1 },
            unhandledErrors: 0,
        });
    });

    it.each([
        ['Linux', 1, 'linux_1'], ['Linux', 2, 'linux_2'],
        ['Windows', 1, 'windows_1'], ['Windows', 2, 'windows_2'],
    ] as const)('namespaces %s shard %i outputs', (os, shard, key) => {
        const inventory = shard === 1 ? names.map(file => ({ file })) : null;
        expect(buildShardOutput(metrics(), inventory, os, shard, root).key).toBe(key);
    });

    it.each(['failure', 'cancelled', 'skipped', ''])('rejects a %s shard job even when its metrics say passed', status => {
        expect(() => aggregateShards(shards(), ['success', status], 'Linux', root)).toThrow('Invalid Vitest shard data');
    });

    it('rejects overlapping files even when total counts match the inventory size', () => {
        const values = shards();
        values[1].files = [names[0]];
        expect(() => aggregateShards(values, ['success', 'success'], 'Linux', root)).toThrow('Invalid Vitest shard data');
    });

    it('rejects missing files instead of accepting a successful partial run', () => {
        const values = shards();
        values[1].files = [];
        values[1].fileCounts = zero();
        values[1].testCounts = zero();
        expect(() => aggregateShards(values, ['success', 'success'], 'Linux', root)).toThrow('Invalid Vitest shard data');
    });

    it('rejects extra existing files outside the discovered inventory', () => {
        const extra = 'src/test/unit/extra.test.ts';
        writeFileSync(join(root, extra), '');
        const values = shards();
        values[1].files = [extra];
        expect(() => aggregateShards(values, ['success', 'success'], 'Linux', root)).toThrow('Invalid Vitest shard data');
    });

    it('rejects a missing output, swapped shards and mixed operating systems', () => {
        expect(() => aggregateShards([shards()[0]], ['success', 'success'], 'Linux', root)).toThrow();
        expect(() => aggregateShards(shards().reverse(), ['success', 'success'], 'Linux', root)).toThrow();
        expect(() => aggregateShards([shards()[0], shards('Windows')[1]], ['success', 'success'], 'Linux', root)).toThrow();
    });

    it.each([-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, '2'])('rejects invalid count %s', value => {
        expect(() => validateMetrics({ ...metrics(), unhandledErrors: value }, root)).toThrow('Invalid Vitest shard data');
    });

    it('rejects overflow and count totals that do not conserve statuses', () => {
        const input = metrics();
        input.testCounts.passed = Number.MAX_SAFE_INTEGER;
        input.testCounts.skipped = 1;
        input.testCounts.total = Number.MAX_SAFE_INTEGER;
        expect(() => validateMetrics(input, root)).toThrow();
        expect(() => validateMetrics({ ...metrics(), fileCounts: { ...zero(), total: 2, passed: 1 } }, root)).toThrow();
    });

    it.each(['failed', 'interrupted'])('rejects a %s run at publication', status => {
        expect(() => buildShardOutput({ ...metrics(), status }, names.map(file => ({ file })), 'Linux', 1, root)).toThrow();
    });

    it('rejects unhandled errors and failed tests even if the status claims success', () => {
        expect(() => buildShardOutput({ ...metrics(), unhandledErrors: 1 }, names.map(file => ({ file })), 'Linux', 1, root)).toThrow();
        const input = metrics();
        input.testCounts.failed = 1;
        input.testCounts.passed--;
        expect(() => buildShardOutput(input, null, 'Linux', 2, root)).toThrow();
    });

    it.each([
        '/private/nonexistent.test.ts', '../src/test/unit/alpha.test.ts',
        'src/test/unit/../unit/alpha.test.ts', 'src/test/unit/missing.test.ts',
    ])('rejects noncanonical or missing path %s', file => {
        expect(() => validateMetrics(metrics([file]), root)).toThrow('Invalid Vitest shard data');
    });

    it('rejects a directory symlink that leaves the checkout', () => {
        const outside = mkdtempSync(join(tmpdir(), 'ehagaki-shard-outside-'));
        try {
            writeFileSync(join(outside, 'escape.test.ts'), '');
            symlinkSync(outside, join(root, 'src/test/unit/external'), 'junction');
            expect(() => canonicalTestPath(root, 'src/test/unit/external/escape.test.ts')).toThrow('Invalid Vitest shard data');
        } finally { rmSync(outside, { recursive: true, force: true }); }
    });

    it('rejects duplicate inventory entries and an empty inventory', () => {
        expect(() => inventoryPaths([{ file: names[0] }, { file: names[0] }], root)).toThrow();
        expect(() => inventoryPaths([], root)).toThrow();
    });

    it('publishes exactly one safe output without titles or diagnostic values', () => {
        writeFileSync(join(root, 'metrics.json'), JSON.stringify(metrics()));
        writeFileSync(join(root, 'inventory.json'), JSON.stringify(names.map(file => ({ file }))));
        const result = cli(['publish', 'Linux', '1']);
        expect(result.status).toBe(0);
        expect(result.stdout).toBe('');
        expect(result.stderr).toBe('');
        const output = readFileSync(join(root, 'outputs.txt'), 'utf8');
        expect(output.startsWith('linux_1=')).toBe(true);
        expect(output.split('\n')).toHaveLength(2);
        expect(JSON.parse(output.slice('linux_1='.length))).toEqual(shards()[0]);
    });

    it('never echoes malformed JSON or unexpected sensitive fields', () => {
        const secret = 'synthetic private payload';
        writeFileSync(join(root, 'metrics.json'), JSON.stringify({ ...metrics(), title: secret }));
        writeFileSync(join(root, 'inventory.json'), JSON.stringify(names.map(file => ({ file }))));
        for (const value of [JSON.stringify({ ...metrics(), title: secret }), `{"private":"${secret}`]) {
            writeFileSync(join(root, 'metrics.json'), value);
            const result = cli(['publish', 'Linux', '1']);
            expect(result.status).toBe(1);
            expect(result.stdout).toBe('');
            expect(result.stderr).toBe('Vitest shard validation failed\n');
        }
    });

    it('emits only numeric summaries and fails closed on missing matrix outputs', () => {
        const values = shards();
        const env = {
            VITEST_SHARD_1: JSON.stringify(values[0]), VITEST_SHARD_2: JSON.stringify(values[1]),
            VITEST_SHARD_1_RESULT: 'success', VITEST_SHARD_2_RESULT: 'success',
        };
        const success = cli(['aggregate', 'Linux'], env);
        expect(success.status).toBe(0);
        expect(success.stdout).toBe('Test Files  3 passed (3)\nTests  6 passed (6)\nUnhandled errors: 0\nInventory: 3 files verified across 2 shards\n');
        for (const override of [{ VITEST_SHARD_2: '' }, { VITEST_SHARD_2_RESULT: 'failure' }]) {
            const result = cli(['aggregate', 'Linux'], { ...env, ...override });
            expect(result.status).toBe(1);
            expect(result.stdout).toBe('');
            expect(result.stderr).toBe('Vitest shard validation failed\n');
        }
    });
});
