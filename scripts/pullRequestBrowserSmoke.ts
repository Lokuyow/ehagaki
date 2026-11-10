import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export interface PullRequestBrowserSmokeStep {
    id: "desktop-chromium" | "service-worker";
    npmScript: "test:e2e:parallel" | "test:e2e:sw";
    args: readonly string[];
}

export interface PullRequestSmokeSpawnOptions {
    shell: false;
    env: NodeJS.ProcessEnv;
}

/** Titles selected from the ordinary desktop Chromium project. */
export const pullRequestDesktopChromiumTitles = [
    "pastes HTML with clipboard plain text and submits the plain content",
    "pastes HTML with clipboard plain text and sends that content through Host-owned Lite",
    "keeps bounded container layout inside the component while host page scrolls",
    "desktopと代表mobile幅で投稿履歴型のフッター配置とsurfaceを維持する",
] as const;

/**
 * Substrings of the Service Worker update and share-target tests.
 * Both base paths expand these titles at runtime.
 */
export const pullRequestServiceWorkerTitleFragments = [
    "applies only on user action",
    "share-target File",
] as const;

const desktopChromiumSpecs = [
    "src/test/e2e/postEditorSending.spec.ts",
    "src/test/e2e/webComponentLite.spec.ts",
    "src/test/e2e/webComponentEmbed.spec.ts",
    "src/test/e2e/composerTargetDialog.spec.ts",
] as const;

const serviceWorkerSpec = "src/test/e2e/serviceWorkerUpdate.spec.ts";

function playwrightArgs(project: string, grep: string, specs: readonly string[]): string[] {
    return [
        "--reporter=dot",
        "--retries=0",
        `--project=${project}`,
        `--grep=${grep}`,
        ...specs,
    ];
}

export function pullRequestBrowserSmokeSteps(): readonly PullRequestBrowserSmokeStep[] {
    return [
        {
            id: "desktop-chromium",
            npmScript: "test:e2e:parallel",
            args: playwrightArgs(
                "desktop-chromium",
                pullRequestDesktopChromiumTitles.join("|"),
                desktopChromiumSpecs,
            ),
        },
        {
            id: "service-worker",
            npmScript: "test:e2e:sw",
            args: playwrightArgs(
                "sw-chromium",
                pullRequestServiceWorkerTitleFragments.join("|"),
                [serviceWorkerSpec],
            ),
        },
    ];
}

export function pullRequestBrowserSmokeTitlePattern(grep: string): RegExp {
    return new RegExp(grep, "gi");
}

export async function runPullRequestBrowserSmoke(
    spawnCommand: (
        command: string,
        args: readonly string[],
        options: PullRequestSmokeSpawnOptions,
    ) => Promise<number> = defaultSpawn,
): Promise<number> {
    const env = { ...process.env, EHAGAKI_E2E_ALL_BROWSERS: "0" };
    let failure = 0;
    for (const step of pullRequestBrowserSmokeSteps()) {
        const status = await spawnCommand(
            "npm",
            ["run", step.npmScript, "--", ...step.args],
            { shell: false, env },
        );
        if (status !== 0 && failure === 0) failure = status;
    }
    return failure;
}

function defaultSpawn(
    command: string,
    args: readonly string[],
    options: PullRequestSmokeSpawnOptions,
): Promise<number> {
    const child = spawn(command, args, {
        shell: false,
        stdio: "inherit",
        env: options.env,
    });
    return new Promise((resolvePromise, reject) => {
        child.once("error", reject);
        child.once("exit", (status) => resolvePromise(status ?? 1));
    });
}

function isDirectExecution(): boolean {
    const entry = process.argv[1];
    if (!entry) return false;
    return import.meta.url === pathToFileURL(resolve(entry)).href;
}

if (isDirectExecution()) {
    runPullRequestBrowserSmoke().then((status) => {
        process.exit(status);
    }).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "pull request browser smoke failed";
        process.stderr.write(`${message}\n`);
        process.exit(1);
    });
}
