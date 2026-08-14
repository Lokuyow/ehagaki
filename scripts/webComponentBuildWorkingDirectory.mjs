import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

const candidateDriveLetters = "ZYXWVUTSRQPONMLKJIHGFED";

/** @param {string} repositoryRoot @param {NodeJS.Platform} [platform] */
export function needsWindowsAsciiWorkingDirectory(repositoryRoot, platform = process.platform) {
    return platform === "win32" && /[^\x00-\x7F]/.test(repositoryRoot);
}

/** @param {(path: string) => boolean} [pathExists] */
export function findAvailableSubstDriveLetter(pathExists = existsSync) {
    for (const driveLetter of candidateDriveLetters) {
        if (!pathExists(`${driveLetter}:\\`)) {
            return driveLetter;
        }
    }
    throw new Error("Could not find an unused Windows drive letter for the temporary Web Component build path.");
}

/** @param {string[]} args @returns {Promise<void>} */
function runSubst(args) {
    return new Promise((resolve, reject) => {
        const child = spawn("subst", args, {
            stdio: ["ignore", "pipe", "pipe"],
            windowsHide: true,
        });
        let output = "";
        child.stdout.on("data", (chunk) => {
            output += String(chunk);
        });
        child.stderr.on("data", (chunk) => {
            output += String(chunk);
        });
        child.once("error", reject);
        child.once("exit", (code) => {
            if (code === 0) {
                resolve();
                return;
            }
            reject(new Error(`subst ${args.join(" ")} failed (${code ?? "unknown"})${output ? `: ${output.trim()}` : ""}`));
        });
    });
}

/**
 * @typedef {object} WebComponentBuildWorkingDirectoryOptions
 * @property {string} physicalRepositoryRoot
 * @property {NodeJS.Platform} [platform]
 * @property {(path: string) => boolean} [pathExists]
 * @property {(args: string[]) => Promise<void>} [executeSubst]
 * @property {(message: string) => void} [log]
 */

/** @param {WebComponentBuildWorkingDirectoryOptions} options */
export async function createWebComponentBuildWorkingDirectory({
    physicalRepositoryRoot,
    platform = process.platform,
    pathExists = existsSync,
    executeSubst = runSubst,
    log = console.log,
}) {
    if (!needsWindowsAsciiWorkingDirectory(physicalRepositoryRoot, platform)) {
        return {
            workingDirectory: physicalRepositoryRoot,
            usesTemporaryWindowsPath: false,
            cleanup: async () => {},
        };
    }

    const driveLetter = findAvailableSubstDriveLetter(pathExists);
    const drive = `${driveLetter}:`;
    try {
        await executeSubst([drive, physicalRepositoryRoot]);
    } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        throw new Error(`Could not create a temporary Windows path for the Web Component build: ${detail}`);
    }

    let cleanedUp = false;
    log(`Web Component build uses temporary Windows path ${drive}\\`);
    return {
        workingDirectory: `${drive}\\`,
        usesTemporaryWindowsPath: true,
        cleanup: async () => {
            if (cleanedUp) return;
            cleanedUp = true;
            await executeSubst([drive, "/D"]);
        },
    };
}
