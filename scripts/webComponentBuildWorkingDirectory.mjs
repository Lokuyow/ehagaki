import { createHash, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, open, readFile, realpath, rename, rm, unlink, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, win32 } from "node:path";

const candidateDriveLetters = "ZYXWVUTSRQPONMLKJIHGFED";
const stateFormatVersion = 1;
const stateDirectoryName = "ehagaki-web-component-build";

/** @param {string} repositoryRoot @param {NodeJS.Platform} [platform] */
export function needsWindowsAsciiWorkingDirectory(repositoryRoot, platform = process.platform) {
    return platform === "win32" && /[^\x00-\x7F]/.test(repositoryRoot);
}

/** @param {string} repositoryRoot */
export function normalizeWindowsRepositoryRoot(repositoryRoot) {
    const normalized = win32.normalize(repositoryRoot).replaceAll("/", "\\");
    if (/^[a-z]:\\$/i.test(normalized)) return normalized.toLowerCase();
    return normalized.replace(/[\\]+$/, "").toLowerCase();
}

/** @param {string} normalizedRepositoryRoot @param {string} [stateDirectory] */
export function getWebComponentBuildStatePaths(normalizedRepositoryRoot, stateDirectory = tmpdir()) {
    const rootHash = createHash("sha256").update(normalizedRepositoryRoot).digest("hex");
    const directory = join(stateDirectory, stateDirectoryName, rootHash);
    return {
        directory,
        leasePath: join(directory, "lease.json"),
        mappingStatePath: join(directory, "mapping-state.json"),
    };
}

/** @param {(path: string) => boolean} [pathExists] */
export function findAvailableSubstDriveLetter(pathExists = existsSync) {
    for (const driveLetter of candidateDriveLetters) {
        if (!pathExists(`${driveLetter}:\\`)) return driveLetter;
    }
    throw new Error("Could not find an unused Windows drive letter for the temporary Web Component build path.");
}

/**
 * @param {string[]} args
 * @param {typeof spawn} [spawnProcess]
 * @returns {Promise<Buffer|void>}
 */
export function runSubst(args, spawnProcess = spawn) {
    return new Promise((resolve, reject) => {
        const child = spawnProcess("subst", args, {
            stdio: ["ignore", "pipe", "pipe"],
            windowsHide: true,
        });
        /** @type {Buffer[]} */
        const chunks = [];
        child.stdout.on("data", (chunk) => { chunks.push(Buffer.from(chunk)); });
        child.stderr.on("data", (chunk) => { chunks.push(Buffer.from(chunk)); });
        child.once("error", reject);
        child.once("exit", (code) => {
            if (code === 0) {
                resolve(args.length === 0 ? Buffer.concat(chunks) : undefined);
                return;
            }
            reject(new Error(`subst ${args.join(" ")} failed (${code ?? "unknown"}).`));
        });
    });
}

/** @param {Buffer|string} output */
export function parseSubstDriveLetters(output) {
    const listing = Buffer.isBuffer(output) ? output.toString("latin1") : output;
    return [...listing.matchAll(/^([A-Z]):\\:\s*=>/gim)].map((match) => `${match[1].toUpperCase()}:`);
}

/**
 * @param {string} drive
 * @param {() => Promise<Buffer|string>} [listSubst]
 * @param {(path: string) => Promise<string>} [resolveMappingTarget]
 */
export async function readSubstMapping(
    drive,
    listSubst = async () => {
        const output = await runSubst([]);
        if (!Buffer.isBuffer(output)) throw new Error("subst listing did not return output.");
        return output;
    },
    resolveMappingTarget = realpath,
) {
    const listedDrives = parseSubstDriveLetters(await listSubst());
    const normalizedDrive = `${drive.slice(0, 1).toUpperCase()}:`;
    if (!listedDrives.includes(normalizedDrive)) return null;
    return resolveMappingTarget(`${normalizedDrive}\\`);
}

/**
 * @typedef {object} WebComponentBuildWorkingDirectoryOptions
 * @property {string} physicalRepositoryRoot
 * @property {NodeJS.Platform} [platform]
 * @property {(path: string) => boolean} [pathExists]
 * @property {(args: string[]) => Promise<void>} [executeSubst]
 * @property {(drive: string) => Promise<string|null>} [readSubstMapping]
 * @property {(pid: number) => "alive"|"dead"|"unknown"} [getProcessStatus]
 * @property {string} [stateDirectory]
 * @property {number} [ownerPid]
 * @property {() => string} [createLeaseId]
 * @property {(path: string, value: unknown) => Promise<void>} [writeState]
 * @property {(message: string) => void} [log]
 */

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
    return typeof value === "object" && value !== null;
}

/** @param {unknown} value @returns {value is { code?: string }} */
function isFileNotFoundError(value) {
    return isRecord(value) && value.code === "ENOENT";
}

/** @param {number} pid */
function getProcessStatus(pid) {
    try {
        process.kill(pid, 0);
        return "alive";
    } catch (error) {
        if (isRecord(error) && error.code === "ESRCH") return "dead";
        return "unknown";
    }
}

/** @param {string} path */
async function readJson(path) {
    return JSON.parse(await readFile(path, "utf8"));
}

/** @param {string} path @param {unknown} value */
async function writeJsonAtomically(path, value) {
    await mkdir(dirname(path), { recursive: true });
    const temporaryPath = `${path}.${process.pid}.${randomUUID()}.tmp`;
    try {
        await writeFile(temporaryPath, `${JSON.stringify(value)}\n`, { flag: "wx" });
        await rename(temporaryPath, path);
    } finally {
        await rm(temporaryPath, { force: true });
    }
}

/** @param {string} path */
async function removeFile(path) {
    await unlink(path).catch((error) => {
        if (!isFileNotFoundError(error)) throw error;
    });
}

/** @param {unknown} value @param {string} normalizedRoot @param {string} kind */
function validateState(value, normalizedRoot, kind) {
    if (!isRecord(value)) {
        throw new Error(`Invalid Web Component ${kind} format.`);
    }
    const ownerPid = value.ownerPid;
    const leaseId = value.leaseId;
    if (value.formatVersion !== stateFormatVersion
        || (normalizedRoot && value.normalizedPhysicalRepositoryRoot !== normalizedRoot)
        || typeof ownerPid !== "number"
        || !Number.isSafeInteger(ownerPid)
        || ownerPid <= 0
        || typeof leaseId !== "string"
        || leaseId.length === 0) {
        throw new Error(`Invalid Web Component ${kind} format.`);
    }
    if (kind === "mapping state"
        && (typeof value.drive !== "string"
            || !/^[A-Z]:$/i.test(value.drive)
            || (value.phase !== "prepared" && value.phase !== "mapped"))) {
        throw new Error("Invalid Web Component mapping state format.");
    }
    return /** @type {Record<string, unknown>} */ (value);
}

/** @param {string} prefix @param {Record<string, unknown>} details */
function diagnosticError(prefix, details) {
    return new Error(`${prefix} ${Object.entries(details).map(([key, value]) => `${key}=${String(value)}`).join(" ")}`);
}

/** @param {string} mappingTarget @param {string} normalizedRoot */
function isMatchingMapping(mappingTarget, normalizedRoot) {
    return normalizeWindowsRepositoryRoot(mappingTarget) === normalizedRoot;
}

/**
 * @param {{ leasePath: string; mappingStatePath: string }} paths
 * @param {Record<string, unknown>} lease
 * @param {string} normalizedRoot
 * @param {(drive: string) => Promise<string|null>} readMapping
 * @param {(args: string[]) => Promise<void>} executeSubst
 */
async function recoverStaleLease(paths, lease, normalizedRoot, readMapping, executeSubst) {
    validateState(lease, normalizedRoot, "lease");
    let mappingState;
    try {
        mappingState = validateState(await readJson(paths.mappingStatePath), normalizedRoot, "mapping state");
    } catch (error) {
        if (isFileNotFoundError(error)) {
            await removeFile(paths.leasePath);
            return;
        }
        throw diagnosticError("Cannot recover invalid Web Component lease.", {
            leasePath: paths.leasePath,
            mappingStatePath: paths.mappingStatePath,
            physicalRoot: normalizedRoot,
            recordedPhysicalRoot: lease.normalizedPhysicalRepositoryRoot,
            recordedPid: lease.ownerPid,
            mappingStatePresent: true,
            reason: error instanceof Error ? error.message : String(error),
        });
    }

    if (mappingState.leaseId !== lease.leaseId || mappingState.ownerPid !== lease.ownerPid) {
        throw diagnosticError("Cannot recover mismatched Web Component lease state.", {
            leasePath: paths.leasePath,
            mappingStatePath: paths.mappingStatePath,
            physicalRoot: normalizedRoot,
            recordedPid: lease.ownerPid,
            recordedDrive: mappingState.drive,
            mappingStatePresent: true,
            reason: "lease and mapping state identity differs",
        });
    }

    const drive = String(mappingState.drive).toUpperCase();
    const mappingTarget = await readMapping(drive);
    if (mappingTarget === null) {
        await removeFile(paths.mappingStatePath);
        await removeFile(paths.leasePath);
        return;
    }
    if (!isMatchingMapping(mappingTarget, normalizedRoot)) {
        await removeFile(paths.mappingStatePath);
        await removeFile(paths.leasePath);
        return;
    }

    await executeSubst([drive, "/D"]);
    if (await readMapping(drive) !== null) {
        throw diagnosticError("Web Component stale mapping cleanup did not remove the mapping.", {
            leasePath: paths.leasePath,
            mappingStatePath: paths.mappingStatePath,
            physicalRoot: normalizedRoot,
            recordedPid: lease.ownerPid,
            recordedDrive: drive,
            mappingTarget,
            mappingStatePresent: true,
            reason: "subst mapping remains after /D",
        });
    }
    await removeFile(paths.mappingStatePath);
    await removeFile(paths.leasePath);
}

/**
 * @param {{ leasePath: string; mappingStatePath: string; directory: string }} paths
 * @param {string} normalizedRoot
 * @param {number} ownerPid
 * @param {string} leaseId
 * @param {(pid: number) => "alive"|"dead"|"unknown"} getStatus
 * @param {(drive: string) => Promise<string|null>} readMapping
 * @param {(args: string[]) => Promise<void>} executeSubst
 */
async function acquireLease(paths, normalizedRoot, ownerPid, leaseId, getStatus, readMapping, executeSubst) {
    await mkdir(paths.directory, { recursive: true });
    const lease = {
        formatVersion: stateFormatVersion,
        normalizedPhysicalRepositoryRoot: normalizedRoot,
        ownerPid,
        leaseId,
    };

    for (;;) {
        try {
            const handle = await open(paths.leasePath, "wx");
            try {
                await handle.writeFile(`${JSON.stringify(lease)}\n`);
            } finally {
                await handle.close();
            }
            return lease;
        } catch (error) {
            if (!isRecord(error) || error.code !== "EEXIST") throw error;
        }

        let existingLease;
        try {
            existingLease = validateState(await readJson(paths.leasePath), normalizedRoot, "lease");
        } catch (error) {
            if (isFileNotFoundError(error)) continue;
            throw diagnosticError("Cannot inspect existing Web Component lease.", {
                leasePath: paths.leasePath,
                physicalRoot: normalizedRoot,
                mappingStatePresent: existsSync(paths.mappingStatePath),
                reason: error instanceof Error ? error.message : String(error),
            });
        }

        const status = getStatus(/** @type {number} */ (existingLease.ownerPid));
        if (status !== "dead") {
            throw diagnosticError("A Web Component build is already active for this repository.", {
                leasePath: paths.leasePath,
                physicalRoot: normalizedRoot,
                recordedPid: existingLease.ownerPid,
                mappingStatePresent: existsSync(paths.mappingStatePath),
                reason: status === "unknown" ? "owner liveness could not be confirmed" : "owner is alive",
            });
        }
        await recoverStaleLease(paths, existingLease, normalizedRoot, readMapping, executeSubst);
    }
}

/** @param {{ mappingStatePath: string; leasePath: string }} paths @param {string} normalizedRoot @param {string} leaseId @param {number} ownerPid */
async function removeOwnedState(paths, normalizedRoot, leaseId, ownerPid) {
    let lease;
    try {
        lease = validateState(await readJson(paths.leasePath), normalizedRoot, "lease");
    } catch (error) {
        if (isFileNotFoundError(error)) return;
        throw error;
    }
    if (lease.leaseId !== leaseId || lease.ownerPid !== ownerPid) {
        throw new Error("Web Component lease ownership changed before cleanup.");
    }
    await removeFile(paths.mappingStatePath);
    await removeFile(paths.leasePath);
}

/** @param {WebComponentBuildWorkingDirectoryOptions} options */
export async function createWebComponentBuildWorkingDirectory({
    physicalRepositoryRoot,
    platform = process.platform,
    pathExists = existsSync,
    executeSubst = async (args) => { await runSubst(args); },
    readSubstMapping: readMapping = (drive) => readSubstMapping(drive),
    getProcessStatus: getStatus = getProcessStatus,
    stateDirectory = tmpdir(),
    ownerPid = process.pid,
    createLeaseId = randomUUID,
    writeState = writeJsonAtomically,
    log = console.log,
}) {
    if (!needsWindowsAsciiWorkingDirectory(physicalRepositoryRoot, platform)) {
        return {
            workingDirectory: physicalRepositoryRoot,
            usesTemporaryWindowsPath: false,
            cleanup: async () => {},
        };
    }

    const normalizedRoot = normalizeWindowsRepositoryRoot(physicalRepositoryRoot);
    const paths = getWebComponentBuildStatePaths(normalizedRoot, stateDirectory);
    const leaseId = createLeaseId();
    const lease = await acquireLease(paths, normalizedRoot, ownerPid, leaseId, getStatus, readMapping, executeSubst);
    let drive;
    let cleanedUp = false;

    try {
        for (;;) {
            const driveLetter = findAvailableSubstDriveLetter(pathExists);
            drive = `${driveLetter}:`;
            await writeState(paths.mappingStatePath, {
                formatVersion: stateFormatVersion,
                normalizedPhysicalRepositoryRoot: normalizedRoot,
                ownerPid,
                leaseId,
                drive,
                phase: "prepared",
            });

            try {
                await executeSubst([drive, physicalRepositoryRoot]);
            } catch (error) {
                const mappingTarget = await readMapping(drive);
                if (mappingTarget !== null && isMatchingMapping(mappingTarget, normalizedRoot)) {
                    await executeSubst([drive, "/D"]);
                    if (await readMapping(drive) !== null) {
                        throw new Error("Temporary Web Component subst mapping remained after collision cleanup.");
                    }
                } else if (mappingTarget !== null) {
                    await removeFile(paths.mappingStatePath);
                    continue;
                } else {
                    await removeFile(paths.mappingStatePath);
                    throw error;
                }
                await removeFile(paths.mappingStatePath);
                continue;
            }

            const mappingTarget = await readMapping(drive);
            if (mappingTarget === null) {
                await removeFile(paths.mappingStatePath);
                throw new Error(`subst succeeded but ${drive} was not visible as a mapping.`);
            }
            if (!isMatchingMapping(mappingTarget, normalizedRoot)) {
                await removeFile(paths.mappingStatePath);
                throw diagnosticError("Temporary Web Component drive became a foreign mapping.", {
                    leasePath: paths.leasePath,
                    mappingStatePath: paths.mappingStatePath,
                    physicalRoot: normalizedRoot,
                    recordedPid: ownerPid,
                    recordedDrive: drive,
                    mappingTarget,
                    reason: "mapping target does not match current repository",
                });
            }

            try {
                await writeState(paths.mappingStatePath, {
                    formatVersion: stateFormatVersion,
                    normalizedPhysicalRepositoryRoot: normalizedRoot,
                    ownerPid,
                    leaseId,
                    drive,
                    phase: "mapped",
                });
            } catch (error) {
                await executeSubst([drive, "/D"]);
                if (await readMapping(drive) === null) {
                    await removeOwnedState(paths, normalizedRoot, leaseId, ownerPid);
                }
                throw error;
            }
            break;
        }
    } catch (error) {
        try {
            const mappingTarget = drive ? await readMapping(drive) : null;
            if (mappingTarget === null || !isMatchingMapping(mappingTarget, normalizedRoot)) {
                await removeOwnedState(paths, normalizedRoot, leaseId, ownerPid);
            }
        } catch (cleanupError) {
            throw new Error(
                `Could not create a temporary Windows path for the Web Component build: ${error instanceof Error ? error.message : String(error)}; `
                + `setup cleanup also failed: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`,
            );
        }
        throw new Error(`Could not create a temporary Windows path for the Web Component build: ${error instanceof Error ? error.message : String(error)}`);
    }

    log(`Web Component build uses temporary Windows path ${drive}\\`);
    return {
        workingDirectory: `${drive}\\`,
        usesTemporaryWindowsPath: true,
        cleanup: async () => {
            if (cleanedUp) return;
            cleanedUp = true;
            let currentLease;
            try {
                currentLease = validateState(await readJson(paths.leasePath), normalizedRoot, "lease");
            } catch (error) {
                if (isFileNotFoundError(error)) return;
                cleanedUp = false;
                throw error;
            }
            if (currentLease.leaseId !== lease.leaseId || currentLease.ownerPid !== ownerPid) {
                cleanedUp = false;
                throw new Error("Web Component lease ownership changed before cleanup.");
            }

            const mappingTarget = await readMapping(drive);
            if (mappingTarget === null) {
                await removeOwnedState(paths, normalizedRoot, leaseId, ownerPid);
                return;
            }
            if (!isMatchingMapping(mappingTarget, normalizedRoot)) {
                await removeOwnedState(paths, normalizedRoot, leaseId, ownerPid);
                throw diagnosticError("Refusing to remove a foreign Web Component mapping.", {
                    leasePath: paths.leasePath,
                    mappingStatePath: paths.mappingStatePath,
                    physicalRoot: normalizedRoot,
                    recordedPid: ownerPid,
                    recordedDrive: drive,
                    mappingTarget,
                    reason: "mapping target changed before cleanup",
                });
            }
            await executeSubst([drive, "/D"]);
            if (await readMapping(drive) !== null) {
                cleanedUp = false;
                throw new Error(`Temporary Web Component subst mapping ${drive} remained after cleanup.`);
            }
            await removeOwnedState(paths, normalizedRoot, leaseId, ownerPid);
        },
    };
}
