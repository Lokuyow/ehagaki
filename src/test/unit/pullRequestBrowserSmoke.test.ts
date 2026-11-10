import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
    pullRequestBrowserSmokeTitlePattern,
    pullRequestBrowserSmokeSteps,
    pullRequestDesktopChromiumTitles,
    pullRequestServiceWorkerTitleFragments,
    runPullRequestBrowserSmoke,
    type PullRequestSmokeSpawnOptions,
} from "../../../scripts/pullRequestBrowserSmoke";

function findRepositoryRoot(start: string): string {
    let current = start;
    for (let depth = 0; depth < 8; depth += 1) {
        if (existsSync(resolve(current, "package.json")) && existsSync(resolve(current, ".github/workflows/test-reliability.yml"))) {
            return current;
        }
        const parent = resolve(current, "..");
        if (parent === current) break;
        current = parent;
    }
    throw new Error(`repository root not found from ${start}`);
}

const repositoryRoot = findRepositoryRoot(fileURLToPath(import.meta.url));

function readRepoFile(path: string): string {
    return readFileSync(resolve(repositoryRoot, path), "utf8");
}

function grepSource(args: readonly string[]): string {
    const grep = args.find((arg) => arg.startsWith("--grep="));
    expect(grep).toBeDefined();
    return grep!.slice("--grep=".length);
}

function matchesTitle(args: readonly string[], title: string): boolean {
    return pullRequestBrowserSmokeTitlePattern(grepSource(args)).test(title);
}

function jobBlock(workflow: string, name: string): string {
    const marker = `\n  ${name}:\n`;
    const start = workflow.indexOf(marker);
    expect(start).toBeGreaterThanOrEqual(0);
    const rest = workflow.slice(start + 1);
    const nextJob = rest.slice(1).search(/\n  [a-z0-9-]+:\n/);
    return nextJob < 0 ? rest : rest.slice(0, nextJob + 1);
}

describe("pull request browser smoke", () => {
    const steps = pullRequestBrowserSmokeSteps();
    const desktop = steps[0];
    const serviceWorker = steps[1];

    it("selects one desktop Chromium smoke and one Chromium Service Worker subset", () => {
        expect(steps.map((step) => step.id)).toEqual(["desktop-chromium", "service-worker"]);
        expect(desktop?.npmScript).toBe("test:e2e:parallel");
        expect(serviceWorker?.npmScript).toBe("test:e2e:sw");
        expect(desktop?.args).toContain("--project=desktop-chromium");
        expect(serviceWorker?.args).toContain("--project=sw-chromium");
        expect(desktop?.args).toEqual(expect.arrayContaining([
            "--reporter=dot",
            "--retries=0",
            "src/test/e2e/postEditorSending.spec.ts",
            "src/test/e2e/webComponentLite.spec.ts",
            "src/test/e2e/webComponentEmbed.spec.ts",
            "src/test/e2e/composerTargetDialog.spec.ts",
        ]));
        expect(serviceWorker?.args).toContain("src/test/e2e/serviceWorkerUpdate.spec.ts");
        expect(serviceWorker?.args.join(" ")).not.toContain("uploadedMediaServiceWorker.spec.ts");
        for (const step of steps) {
            expect(step.args.join(" ")).not.toMatch(/firefox|webkit|windows-latest|mobile-chromium|android-chromium/);
            expect(step.args).toContain("--retries=0");
        }
    });

    it("matches paste, embed layout, and composer layout without the rest of those files", () => {
        const args = desktop!.args;
        for (const title of pullRequestDesktopChromiumTitles) {
            expect(matchesTitle(args, title)).toBe(true);
            expect(matchesTitle(args, `composer target dialog fixture ${title}`)).toBe(true);
        }
        expect(matchesTitle(args, "long-press submits once without losing focus and freezes the document until success")).toBe(false);
        expect(matchesTitle(args, "Lite minimal configuration exposes only text composition and preserves success/failure content")).toBe(false);
        expect(matchesTitle(args, "Full upload destination controls remain accessible at 320px and 360px (ja)")).toBe(false);
        expect(matchesTitle(args, "320pxと375pxで横方向にはみ出さない")).toBe(false);

        const specForTitle = [
            ["src/test/e2e/postEditorSending.spec.ts", pullRequestDesktopChromiumTitles[0]],
            ["src/test/e2e/webComponentLite.spec.ts", pullRequestDesktopChromiumTitles[1]],
            ["src/test/e2e/webComponentEmbed.spec.ts", pullRequestDesktopChromiumTitles[2]],
            ["src/test/e2e/composerTargetDialog.spec.ts", pullRequestDesktopChromiumTitles[3]],
        ] as const;
        for (const [spec, title] of specForTitle) {
            const source = readRepoFile(spec);
            expect(source.split(title)).toHaveLength(2);
        }
    });

    it("matches Service Worker update and share-target titles at both base paths", () => {
        const args = serviceWorker!.args;
        const source = readRepoFile("src/test/e2e/serviceWorkerUpdate.spec.ts");
        const templates = [...source.matchAll(/\btest\(\s*`([^`]*)`/g)].map((match) => match[1] ?? "");
        const expanded = templates.flatMap((template) => ["/ehagaki/", "/"].map((basePath) => template.replaceAll("${basePath}", basePath)));
        const matched = expanded.filter((title) => matchesTitle(args, title));

        expect(templates).toHaveLength(4);
        expect(matched).toEqual([
            "/ehagaki/ migrates old keys, installs in parallel, applies only on user action, and restarts offline",
            "/ migrates old keys, installs in parallel, applies only on user action, and restarts offline",
            "/ehagaki/ round-trips a share-target File through the production Service Worker MessageChannel",
            "/ round-trips a share-target File through the production Service Worker MessageChannel",
        ]);
        for (const fragment of pullRequestServiceWorkerTitleFragments) {
            expect(source.split(fragment)).toHaveLength(2);
        }
        expect(matchesTitle(args, "/ehagaki/ fails an update without deleting the active worker's cache")).toBe(false);
        expect(matchesTitle(args, "/ehagaki/ loads the production JSONL verifier Worker online and offline")).toBe(false);
        expect(matchesTitle(args, "/ehagaki/ production SW image caching, CORS/opaque, offline, sharing and eviction")).toBe(false);
    });

    it("runs every smoke step with Chromium only and keeps the first failure", async () => {
        const calls: Array<{ command: string; args: readonly string[]; options: PullRequestSmokeSpawnOptions }> = [];
        const previous = process.env.EHAGAKI_E2E_ALL_BROWSERS;
        process.env.EHAGAKI_E2E_ALL_BROWSERS = "1";
        try {
            const status = await runPullRequestBrowserSmoke(async (command, args, options) => {
                calls.push({ command, args, options });
                return calls.length === 1 ? 7 : 0;
            });
            expect(status).toBe(7);
            expect(process.env.EHAGAKI_E2E_ALL_BROWSERS).toBe("1");
        } finally {
            if (previous === undefined) delete process.env.EHAGAKI_E2E_ALL_BROWSERS;
            else process.env.EHAGAKI_E2E_ALL_BROWSERS = previous;
        }

        expect(calls.map((call) => [call.command, call.args[0], call.args[1], call.args[2]])).toEqual([
            ["npm", "run", "test:e2e:parallel", "--"],
            ["npm", "run", "test:e2e:sw", "--"],
        ]);
        expect(calls[0]?.args.slice(3)).toEqual(desktop?.args);
        expect(calls[1]?.args.slice(3)).toEqual(serviceWorker?.args);
        for (const call of calls) {
            expect(call.options.shell).toBe(false);
            expect(call.options.env.EHAGAKI_E2E_ALL_BROWSERS).toBe("0");
        }
    });

    it("keeps the full matrix off pull requests and invokes the smoke runner there", () => {
        const workflow = readRepoFile(".github/workflows/test-reliability.yml");
        const smoke = jobBlock(workflow, "pr-browser-smoke");
        const browser = jobBlock(workflow, "browser-e2e");
        const serviceWorkerJob = jobBlock(workflow, "service-worker-e2e");
        const unit = jobBlock(workflow, "unit-and-build");

        expect(smoke).toContain("if: github.event_name == 'pull_request'");
        expect(smoke).toContain("runs-on: ubuntu-latest");
        expect(smoke).toContain("node scripts/pullRequestBrowserSmoke.ts");
        expect(smoke).toContain("npx playwright install --with-deps chromium");
        expect(smoke).not.toContain("firefox");
        expect(smoke).not.toContain("webkit");
        expect(smoke).not.toContain("windows-latest");
        expect(browser).toContain("github.event_name != 'pull_request'");
        expect(serviceWorkerJob).toContain("github.event_name != 'pull_request'");
        expect(unit).toContain(
            "github.event_name == 'pull_request' && '[\"ubuntu-latest\"]' || '[\"ubuntu-latest\",\"windows-latest\"]'",
        );
    });
});
