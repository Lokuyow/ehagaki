const passedWithDuration = /^\s*(\d+) passed(?:, (\d+) skipped)?(?:, (\d+) failed)?(?: \(([\d.]+(?:ms|s|m|h))\))?\s*$/;
const skippedWithDuration = /^\s*(\d+) skipped(?: \(([\d.]+(?:ms|s|m|h))\))?\s*$/;
const vitestSummary = /^\s*(Test Files|Tests)\s+(\d+)\s+(passed|failed|skipped)(?:\s+\|\s+(\d+)\s+(passed|failed|skipped))?\s+\((\d+)\)\s*$/;

function printSummary(line) {
    const vitest = vitestSummary.exec(line);
    if (vitest) {
        const [, suite, firstCount, firstStatus, secondCount, secondStatus, total] = vitest;
        const details = secondCount && secondStatus
            ? ` | ${secondCount} ${secondStatus}`
            : "";
        process.stdout.write(`${suite} ${firstCount} ${firstStatus}${details} (${total})\n`);
        return;
    }

    const passed = passedWithDuration.exec(line);
    if (passed) {
        const [, passedCount, skippedCount, failedCount, duration] = passed;
        const details = [
            skippedCount ? `${skippedCount} skipped` : undefined,
            failedCount ? `${failedCount} failed` : undefined,
        ].filter(Boolean).join(", ");
        const counts = details ? `${passedCount} passed, ${details}` : `${passedCount} passed`;
        process.stdout.write(`${counts}${duration ? ` (${duration})` : ""}\n`);
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
