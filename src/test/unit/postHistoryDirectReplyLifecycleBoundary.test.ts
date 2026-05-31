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

describe("postHistoryDirectReplyLifecycle boundary contract", () => {
    const srcRootPath = join(process.cwd(), "src");

    it("Checklist 1: cleanup singleton import allowlist", () => {
        const importers = collectSourceFiles(srcRootPath)
            .filter((filePath) => readFileSync(filePath, "utf8").includes("postHistoryDirectReplyDeletionCleanupService"))
            .map((filePath) => toNormalizedRelativePath(srcRootPath, filePath))
            .filter((filePath) => filePath !== "lib/postHistoryDirectReplyDeletionCleanupService.ts");

        expect(importers).toEqual([
            "lib/postHistoryDirectReplyLifecycleTrigger.ts",
        ]);
    });

    it("Checklist 2: trigger caller allowlist", () => {
        const importers = collectSourceFiles(srcRootPath)
            .filter((filePath) => /\btriggerPostHistoryDirectReplyLifecycle\s*\(/.test(readFileSync(filePath, "utf8")))
            .map((filePath) => toNormalizedRelativePath(srcRootPath, filePath))
            .filter((filePath) => filePath !== "lib/postHistoryDirectReplyLifecycleTrigger.ts");

        expect(importers.sort()).toEqual([
            "lib/postHistoryChildInteractionDeletionLifecycleTrigger.ts",
        ]);
    });
});
