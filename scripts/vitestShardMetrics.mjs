import { appendFileSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @typedef {{ total: number, passed: number, failed: number, skipped: number, todo: number }} Counts */
/** @typedef {{ version: 1, status: 'passed' | 'failed' | 'interrupted', files: string[], fileCounts: Counts, testCounts: Counts, unhandledErrors: number }} Metrics */
const metricKeys = ['version', 'status', 'files', 'fileCounts', 'testCounts', 'unhandledErrors'];
const countKeys = ['total', 'passed', 'failed', 'skipped', 'todo'];
const testPath = /^src\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+\.(?:test|spec)\.[jt]s$/;

/** @returns {never} */
function invalid() { throw new Error('Invalid Vitest shard data'); }

/** @param {unknown} value @param {string[]} keys @returns {Record<string, unknown>} */
function record(value, keys) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return invalid();
    if (Object.keys(value).length !== keys.length || keys.some(key => !Object.hasOwn(value, key))) return invalid();
    return /** @type {Record<string, unknown>} */ (value);
}

/** @param {unknown} value @returns {number} */
function count(value) {
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) return invalid();
    return value;
}

/** @param {number[]} values */
function sum(values) { return count(values.reduce((total, value) => total + value, 0)); }

/** @param {unknown} value @returns {Counts} */
function counts(value) {
    const data = record(value, countKeys);
    const result = {
        total: count(data.total), passed: count(data.passed), failed: count(data.failed),
        skipped: count(data.skipped), todo: count(data.todo),
    };
    if (result.total !== sum([result.passed, result.failed, result.skipped, result.todo])) return invalid();
    return result;
}

/** Only existing files inside the checkout can become public test paths.
 * @param {string} root @param {unknown} filename @returns {string}
 */
export function canonicalTestPath(root, filename) {
    if (typeof filename !== 'string') return invalid();
    try {
        const full = realpathSync(resolve(root, filename));
        const path = relative(realpathSync(root), full).replaceAll('\\', '/');
        if (isAbsolute(path) || !testPath.test(path) || !statSync(full).isFile()) return invalid();
        return path;
    } catch { return invalid(); }
}

/** @param {unknown} value @param {string} root @returns {string[]} */
function paths(value, root) {
    if (!Array.isArray(value)) return invalid();
    const result = value.map(path => {
        if (typeof path !== 'string' || !testPath.test(path) || canonicalTestPath(root, path) !== path) return invalid();
        return path;
    }).sort();
    if (new Set(result).size !== result.length) return invalid();
    return result;
}

/** @param {unknown} value @param {string} root @returns {Metrics} */
export function validateMetrics(value, root) {
    const data = record(value, metricKeys);
    if (data.version !== 1 || (data.status !== 'passed' && data.status !== 'failed' && data.status !== 'interrupted')) return invalid();
    const files = paths(data.files, root);
    const fileCounts = counts(data.fileCounts);
    const testCounts = counts(data.testCounts);
    if (fileCounts.total !== files.length || fileCounts.todo !== 0) return invalid();
    return {
        version: 1, status: /** @type {Metrics['status']} */ (data.status), files,
        fileCounts, testCounts, unhandledErrors: count(data.unhandledErrors),
    };
}

/** @param {Metrics} metrics */
function requireSuccess(metrics) {
    if (metrics.status !== 'passed' || metrics.fileCounts.failed || metrics.testCounts.failed || metrics.unhandledErrors) invalid();
}

/** Convert `vitest list --filesOnly --json=<path>` without collecting test titles.
 * @param {unknown} value @param {string} root
 */
export function inventoryPaths(value, root) {
    if (!Array.isArray(value) || value.length === 0) return invalid();
    return paths(value.map(entry => canonicalTestPath(root, record(entry, ['file']).file)), root);
}

/** @param {unknown} value @param {unknown} inventory @param {string} os @param {number} shard @param {string} root */
export function buildShardOutput(value, inventory, os, shard, root) {
    if (!['Linux', 'Windows'].includes(os) || (shard !== 1 && shard !== 2)) return invalid();
    const metrics = validateMetrics(value, root);
    requireSuccess(metrics);
    const expectedFiles = shard === 1 ? inventoryPaths(inventory, root) : null;
    if (shard === 2 && inventory !== null) return invalid();
    if (expectedFiles && metrics.files.some(file => !expectedFiles.includes(file))) return invalid();
    return {
        key: `${os === 'Linux' ? 'linux' : 'windows'}_${shard}`,
        value: { ...metrics, os, shard, expectedFiles },
    };
}

/** @param {unknown[]} values @param {string[]} results @param {string} os @param {string} root */
export function aggregateShards(values, results, os, root) {
    if (!['Linux', 'Windows'].includes(os) || values.length !== 2 || results.length !== 2 || results.some(result => result !== 'success')) return invalid();
    const shards = values.map((value, index) => {
        const data = record(value, [...metricKeys, 'os', 'shard', 'expectedFiles']);
        if (data.os !== os || data.shard !== index + 1) return invalid();
        const { os: _os, shard: _shard, expectedFiles, ...raw } = data;
        const metrics = validateMetrics(raw, root);
        requireSuccess(metrics);
        return { ...metrics, expectedFiles: index === 0 ? paths(expectedFiles, root) : expectedFiles };
    });
    const expected = shards[0].expectedFiles;
    if (!Array.isArray(expected) || expected.length === 0 || shards[1].expectedFiles !== null) return invalid();
    const files = shards.flatMap(shard => shard.files).sort();
    if (new Set(files).size !== files.length || files.length !== expected.length || files.some((file, index) => file !== expected[index])) return invalid();
    /** @param {'fileCounts' | 'testCounts'} key @returns {Counts} */
    const combine = key => counts(Object.fromEntries(countKeys.map(field => [field, sum(shards.map(shard => shard[key][/** @type {keyof Counts} */ (field)]))])));
    return { fileCounts: combine('fileCounts'), testCounts: combine('testCounts'), unhandledErrors: sum(shards.map(shard => shard.unhandledErrors)) };
}

/** Reporter intentionally reads only paths and states, never titles, errors, or values. */
export default class VitestShardReporter {
    root = process.cwd();

    /** @param {import('vitest/node').Vitest} context */
    onInit(context) { this.root = context.config.root; }

    /** @param {ReadonlyArray<import('vitest/node').TestModule>} modules
     * @param {ReadonlyArray<unknown>} errors
     * @param {import('vitest/node').TestRunEndReason} reason
     */
    onTestRunEnd(modules, errors, reason) {
        const empty = () => ({ total: 0, passed: 0, failed: 0, skipped: 0, todo: 0 });
        const fileCounts = empty();
        const testCounts = empty();
        const files = modules.map(module => {
            const state = module.state();
            if (state !== 'passed' && state !== 'failed' && state !== 'skipped') return invalid();
            fileCounts[state]++;
            fileCounts.total++;
            for (const test of module.children.allTests()) {
                const state = test.options.mode === 'todo' ? 'todo' : test.result().state;
                if (state === 'pending') return invalid();
                testCounts[state]++;
                testCounts.total++;
            }
            return canonicalTestPath(this.root, module.moduleId);
        });
        const metrics = validateMetrics({ version: 1, status: reason, files, fileCounts, testCounts, unhandledErrors: errors.length }, this.root);
        const destination = process.env.VITEST_SHARD_METRICS_PATH;
        if (!destination) return invalid();
        writeFileSync(destination, JSON.stringify(metrics));
    }
}

/** @param {string} label @param {Counts} value */
function formatCounts(label, value) {
    const parts = [`${value.passed} passed`];
    for (const state of ['failed', 'skipped', 'todo']) {
        const amount = value[/** @type {keyof Counts} */ (state)];
        if (amount) parts.push(`${amount} ${state}`);
    }
    return `${label}  ${parts.join(' | ')} (${value.total})`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        const [command, os, shard] = process.argv.slice(2);
        const root = process.cwd();
        if (command === 'publish' && process.argv.length === 5) {
            const metrics = JSON.parse(readFileSync(process.env.VITEST_SHARD_METRICS_PATH || '', 'utf8'));
            const inventory = shard === '1' ? JSON.parse(readFileSync(process.env.VITEST_ALL_FILES_PATH || '', 'utf8')) : null;
            const output = buildShardOutput(metrics, inventory, os, Number(shard), root);
            if (!process.env.GITHUB_OUTPUT) invalid();
            appendFileSync(process.env.GITHUB_OUTPUT || '', `${output.key}=${JSON.stringify(output.value)}\n`);
        } else if (command === 'aggregate' && process.argv.length === 4) {
            const result = aggregateShards(
                [JSON.parse(process.env.VITEST_SHARD_1 || ''), JSON.parse(process.env.VITEST_SHARD_2 || '')],
                [process.env.VITEST_SHARD_1_RESULT || '', process.env.VITEST_SHARD_2_RESULT || ''], os, root,
            );
            console.log(formatCounts('Test Files', result.fileCounts));
            console.log(formatCounts('Tests', result.testCounts));
            console.log(`Unhandled errors: ${result.unhandledErrors}`);
            console.log(`Inventory: ${result.fileCounts.total} files verified across 2 shards`);
        } else invalid();
    } catch {
        // Do not echo parser errors, input values, paths, or exception payloads.
        console.error('Vitest shard validation failed');
        process.exitCode = 1;
    }
}
