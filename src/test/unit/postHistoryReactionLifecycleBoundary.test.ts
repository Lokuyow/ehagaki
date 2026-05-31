import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

function collectSourceFiles(rootPath: string): string[] {
    const files: string[] = [];
    for (const entry of readdirSync(rootPath, { withFileTypes: true })) {
        if (entry.name === "test" || entry.name.startsWith(".")) {
            continue;
        }

        const nextPath = join(rootPath, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectSourceFiles(nextPath));
            continue;
        }

        if (nextPath.endsWith(".ts") || nextPath.endsWith(".svelte")) {
            files.push(nextPath);
        }
    }

    return files;
}

function toNormalizedRelativePath(rootPath: string, filePath: string): string {
    return relative(rootPath, filePath).replaceAll("\\", "/");
}

describe("postHistoryReactionLifecycle boundary contract", () => {
    const srcRootPath = join(process.cwd(), "src");

    it("Checklist 1: cleanup singleton import allowlist", () => {
        const importers = collectSourceFiles(srcRootPath)
            .filter((filePath) => readFileSync(filePath, "utf8").includes("postHistoryReactionDeletionCleanupService"))
            .map((filePath) => toNormalizedRelativePath(srcRootPath, filePath))
            .filter((filePath) => filePath !== "lib/postHistoryReactionDeletionCleanupService.ts");

        expect(importers).toEqual([
            "lib/postHistoryReactionLifecycleTrigger.ts",
        ]);
    });

    it("Checklist 2: trigger caller allowlist", () => {
        const importers = collectSourceFiles(srcRootPath)
            .filter((filePath) => /\btriggerPostHistoryReactionLifecycle\s*\(/.test(readFileSync(filePath, "utf8")))
            .map((filePath) => toNormalizedRelativePath(srcRootPath, filePath))
            .filter((filePath) => filePath !== "lib/postHistoryReactionLifecycleTrigger.ts");

        expect(importers.sort()).toEqual([
            "lib/postHistoryChildInteractionDeletionLifecycleTrigger.ts",
        ]);
    });
});
