import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { access, mkdir, open, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const cacheDirectory = join(repositoryRoot, "playwright", ".cache");
const markerPath = join(cacheDirectory, "web-component-e2e-output.json");
const lockPath = join(cacheDirectory, "web-component-e2e-output.lock");
const requiredOutputPaths = [
    "dist/web-component/ehagaki-composer.js",
    "dist/web-component-parent-client-example.html",
    "dist/web-component-parent-client-example.js",
    "dist-web-component/ehagaki-composer.js",
    "dist-web-component/host-owned/ehagaki-composer.js",
];
const sourceDirectories = ["public", "scripts", "legacy-bridge"];
const sourceFiles = [
    "index.html",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "vite.config.ts",
    "vite.web-component.config.ts",
];

/** @param {number} milliseconds */
function delay(milliseconds) {
    /** @type {Promise<void>} */
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/** @param {string} directory @returns {Promise<string[]>} */
async function listFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nestedFiles = await Promise.all(entries.map(async (entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? listFiles(path) : [path];
    }));
    return nestedFiles.flat();
}

/** @returns {Promise<string[]>} */
async function getBuildInputPaths() {
    const files = [...sourceFiles.map((path) => join(repositoryRoot, path))];
    const sourceRoot = join(repositoryRoot, "src");
    const sourceEntries = await readdir(sourceRoot, { withFileTypes: true });

    for (const entry of sourceEntries) {
        if (entry.name === "test") continue;
        const path = join(sourceRoot, entry.name);
        files.push(...(entry.isDirectory() ? await listFiles(path) : [path]));
    }

    for (const directory of sourceDirectories) {
        files.push(...await listFiles(join(repositoryRoot, directory)));
    }

    return files.sort((left, right) => left.localeCompare(right));
}

/** @returns {Promise<string>} */
async function createBuildInputFingerprint() {
    const digest = createHash("sha256");
    const files = await getBuildInputPaths();

    for (const file of files) {
        digest.update(relative(repositoryRoot, file));
        digest.update("\0");
        digest.update(await readFile(file));
        digest.update("\0");
    }

    return digest.digest("hex");
}

/** @param {string} fingerprint @returns {Promise<boolean>} */
async function outputIsCurrent(fingerprint) {
    try {
        const marker = JSON.parse(await readFile(markerPath, "utf8"));
        if (marker.fingerprint !== fingerprint) return false;
        await Promise.all(requiredOutputPaths.map((path) =>
            access(join(repositoryRoot, path)),
        ));
        return true;
    } catch {
        return false;
    }
}

/** @param {unknown} error */
function getErrorCode(error) {
    return typeof error === "object" && error !== null && "code" in error
        && typeof error.code === "string"
        ? error.code
        : undefined;
}

/** @param {string} fingerprint @returns {Promise<import("node:fs/promises").FileHandle | null>} */
async function acquireBuildLock(fingerprint) {
    const deadline = Date.now() + 10 * 60_000;
    while (Date.now() < deadline) {
        try {
            const lock = await open(lockPath, "wx");
            await lock.writeFile(`${JSON.stringify({ pid: process.pid })}\n`, "utf8");
            return lock;
        } catch (error) {
            if (getErrorCode(error) !== "EEXIST") throw error;
            if (await outputIsCurrent(fingerprint)) return null;

            const lockInfo = await stat(lockPath).catch(() => null);
            const lockOwner = await readFile(lockPath, "utf8")
                .then((source) => JSON.parse(source).pid)
                .catch(() => null);
            const ownerIsRunning = typeof lockOwner === "number" && (() => {
                try {
                    process.kill(lockOwner, 0);
                    return true;
                } catch (processError) {
                    return getErrorCode(processError) !== "ESRCH";
                }
            })();
            if (lockInfo && !ownerIsRunning && Date.now() - lockInfo.mtimeMs > 1_000) {
                await rm(lockPath, { force: true });
                continue;
            }
            await delay(100);
        }
    }

    throw new Error("Timed out waiting for the Web Component E2E build preparation.");
}

async function runProductionBuild() {
    const isWindows = process.platform === "win32";
    const command = isWindows ? (process.env.ComSpec ?? "cmd.exe") : "npm";
    const args = isWindows
        ? ["/d", "/s", "/c", "npm run build"]
        : ["run", "build"];
    /** @type {Promise<void>} */
    const buildCompleted = new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: repositoryRoot,
            stdio: "inherit",
            windowsHide: true,
        });
        child.once("error", reject);
        child.once("exit", (code, signal) => {
            if (code === 0) {
                resolve();
                return;
            }
            reject(new Error(`npm run build failed (${signal ?? code ?? "unknown"}).`));
        });
    });
    await buildCompleted;
}

/**
 * Rebuild the production files only when the source inputs differ from the
 * output previously prepared for a Web Component E2E run.
 */
export async function ensureWebComponentE2EOutput() {
    const fingerprint = await createBuildInputFingerprint();
    if (await outputIsCurrent(fingerprint)) return;

    await mkdir(cacheDirectory, { recursive: true });
    const lock = await acquireBuildLock(fingerprint);
    if (!lock) return;

    try {
        if (await outputIsCurrent(fingerprint)) return;

        await runProductionBuild();
        const temporaryMarkerPath = `${markerPath}.${process.pid}.tmp`;
        await writeFile(
            temporaryMarkerPath,
            `${JSON.stringify({ fingerprint })}\n`,
            "utf8",
        );
        await rename(temporaryMarkerPath, markerPath);
    } finally {
        await lock.close();
        await rm(lockPath, { force: true });
    }
}
