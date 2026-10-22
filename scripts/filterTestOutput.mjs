import { existsSync } from 'node:fs';

const passedWithDuration = /^\s*(\d+) (passed|failed|skipped)(?: \(([\d.]+(?:ms|s|m|h))\))?\s*$/;
const skippedWithDuration = /^\s*(\d+) skipped(?: \(([\d.]+(?:ms|s|m|h))\))?\s*$/;
const vitestSummary = /^\s*(Test Files|Tests)\s+\d+\s+(?:passed|failed|skipped)(?:\s+\|\s+\d+\s+(?:passed|failed|skipped)){0,2}\s+\(\d+\)\s*$/;
const reported = new Set();

function printSummary(line) {
    line = line.replace(/\x1b\[[0-9;]*m/g, '');
    const failure = line.replaceAll('\\', '/').match(/\[(desktop-chromium|mobile-chromium|android-chromium|mobile-webkit|desktop-firefox|desktop-firefox-editor-paste)\].*?(src\/test\/e2e\/[A-Za-z0-9_-]+\.spec\.ts:\d+:\d+)/);
    if (failure && existsSync(failure[2].split(':')[0])) {
        process.stdout.write(`Failure: ${failure[1]} ${failure[2]}\n`);
    }
    const assertion = line.match(/^\s*(?:Error: )?expect\((?:received|locator)\)\.(?:not\.)?(to[A-Za-z]+)\(/);
    if (assertion) process.stdout.write(`Assertion: ${assertion[1]}\n`);
    // Emit only existing repository test paths and numeric locations, never titles,
    // assertion values, source excerpts, console output, or arbitrary error text.
    for (const match of line.replaceAll('\\', '/').matchAll(/(?:src\/test\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.(?:test|spec)\.[jt]s|scripts\/[A-Za-z0-9_-]+\.(?:mjs|js|ts)|node_modules\/(?:[@A-Za-z0-9_.-]+\/)+[A-Za-z0-9_.-]+\.(?:mjs|cjs|js))(?::\d+(?::\d+)?)?/g)) {
        const location = match[0];
        if (existsSync(location.split(':')[0]) && !reported.has(location)) {
            reported.add(location);
            process.stdout.write(`Test location: ${location}\n`);
        }
    }
    for (const kind of ['TimeoutError', 'AssertionError', 'TypeError', 'ReferenceError', 'SyntaxError', 'RangeError', 'EACCES', 'EADDRINUSE', 'ENOENT', 'EINVAL', 'ERR_MODULE_NOT_FOUND', 'ERR_NO_BUFFER_SPACE', 'Cannot find module', 'Could not resolve', 'Executable doesn\'t exist', 'Failed to launch', 'Execution context was destroyed', 'Test timeout of', 'Target page, context or browser has been closed']) {
        if (line.includes(kind) && !reported.has(kind)) {
            reported.add(kind);
            process.stdout.write(`Error category: ${kind}\n`);
        }
    }
    const vitest = vitestSummary.exec(line);
    if (vitest) {
        process.stdout.write(`${vitest[0].trim()}\n`);
        return;
    }

    const passed = passedWithDuration.exec(line);
    if (passed) {
        process.stdout.write(`${passed[1]} ${passed[2]}${passed[3] ? ` (${passed[3]})` : ''}\n`);
        return;
    }

    const skipped = skippedWithDuration.exec(line);
    if (skipped) {
        process.stdout.write(`${skipped[1]} skipped${skipped[2] ? ` (${skipped[2]})` : ""}\n`);
    }
}

let pending = "";
for await (const chunk of process.stdin) {
    const lines = `${pending}${chunk.toString()}`.split(/\r?\n/);
    pending = lines.pop() ?? "";
    for (const line of lines) printSummary(line);
}
if (pending) printSummary(pending);
