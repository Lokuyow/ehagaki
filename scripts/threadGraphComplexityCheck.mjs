import fs from "node:fs";
import path from "node:path";

const TARGET_FILE = path.resolve("src/lib/hooks/usePostHistoryThreadGraph.svelte.ts");
const TARGET_FUNCTIONS = [
    "revalidateParentForNodeInBackground",
    "loadParentForNode",
    "revalidateChildrenForNodeInBackground",
    "loadChildrenForNode",
];

const BASELINE_BRANCH_COUNTS = {
    revalidateParentForNodeInBackground: 8,
    loadParentForNode: 3,
    revalidateChildrenForNodeInBackground: 6,
    loadChildrenForNode: 5,
};

const FUNCTION_DECLARATION_REGEX = /^\s*(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\(/;
const BRANCH_REGEX = /\b(if|for|while|switch|catch)\b/;

function collectFunctionBounds(lines) {
    const startsByName = new Map();
    for (let index = 0; index < lines.length; index += 1) {
        const match = lines[index].match(FUNCTION_DECLARATION_REGEX);
        if (!match) {
            continue;
        }

        const name = match[1];
        if (!TARGET_FUNCTIONS.includes(name)) {
            continue;
        }

        startsByName.set(name, index);
    }

    const missing = TARGET_FUNCTIONS.filter((name) => !startsByName.has(name));
    if (missing.length > 0) {
        throw new Error(`Target function not found: ${missing.join(", ")}`);
    }

    const bounds = [];
    for (const name of TARGET_FUNCTIONS) {
        const startIndex = startsByName.get(name);
        let endIndexExclusive = lines.length;
        for (let index = startIndex + 1; index < lines.length; index += 1) {
            if (FUNCTION_DECLARATION_REGEX.test(lines[index])) {
                endIndexExclusive = index;
                break;
            }
        }

        bounds.push({
            name,
            startLine: startIndex + 1,
            endLine: endIndexExclusive,
            lines: lines.slice(startIndex, endIndexExclusive),
        });
    }

    return bounds;
}

function buildMetrics(bounds) {
    return bounds.map((item) => {
        const lineCount = item.lines.length;
        const branchCount = item.lines.reduce((count, line) => (
            BRANCH_REGEX.test(line) ? count + 1 : count
        ), 0);

        return {
            name: item.name,
            startLine: item.startLine,
            endLine: item.endLine,
            lineCount,
            branchCount,
            baselineBranchCount: BASELINE_BRANCH_COUNTS[item.name],
        };
    });
}

function printMetrics(metrics) {
    console.log("[thread-graph-complexity] Target:", path.relative(process.cwd(), TARGET_FILE));
    for (const metric of metrics) {
        const delta = metric.branchCount - metric.baselineBranchCount;
        const deltaSign = delta > 0 ? `+${delta}` : `${delta}`;
        console.log(
            `- ${metric.name}: lines=${metric.lineCount} branches=${metric.branchCount} baseline=${metric.baselineBranchCount} delta=${deltaSign} (${metric.startLine}-${metric.endLine})`,
        );
    }
}

function assertNoBranchIncrease(metrics) {
    const increased = metrics.filter((metric) => metric.branchCount > metric.baselineBranchCount);
    if (increased.length === 0) {
        return;
    }

    const detail = increased
        .map((metric) => `${metric.name} (${metric.branchCount} > ${metric.baselineBranchCount})`)
        .join(", ");
    throw new Error(
        `[thread-graph-complexity] Branch count increased: ${detail}. If intentional, update BASELINE_BRANCH_COUNTS in scripts/threadGraphComplexityCheck.mjs.`,
    );
}

function main() {
    const source = fs.readFileSync(TARGET_FILE, "utf8");
    const lines = source.split(/\r?\n/);
    const bounds = collectFunctionBounds(lines);
    const metrics = buildMetrics(bounds);

    printMetrics(metrics);
    assertNoBranchIncrease(metrics);
}

main();
