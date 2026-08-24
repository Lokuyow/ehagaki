import { describe, expect, it, vi } from "vitest";
import { EventEmitter } from "node:events";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PassThrough } from "node:stream";
import {
    createWebComponentBuildWorkingDirectory,
    findAvailableSubstDriveLetter,
    getWebComponentBuildStatePaths,
    needsWindowsAsciiWorkingDirectory,
    normalizeWindowsRepositoryRoot,
    parseSubstDriveLetters,
    readSubstMapping,
    runSubst,
} from "../../../scripts/webComponentBuildWorkingDirectory.mjs";
import {
    createPhysicalViteDevServerCommand,
    createWebComponentBuildCommand,
} from "../../../scripts/webComponentBuildRunner.mjs";

const physicalRoot = "D:\\ドキュメント\\GitHub\\ehagaki";
const normalizedRoot = normalizeWindowsRepositoryRoot(physicalRoot);

async function createHarness(initialMappings: Record<string, string> = {}) {
    const stateDirectory = await mkdtemp(join(tmpdir(), "ehagaki-web-component-test-"));
    const mappings = new Map(Object.entries(initialMappings).map(([drive, target]) => [
        `${drive.slice(0, 1).toUpperCase()}:`,
        target,
    ]));
    const substCalls: string[][] = [];
    const executeSubst = vi.fn(async (args: string[]) => {
        substCalls.push(args);
        const drive = args[0];
        if (args[1] === "/D") {
            if (!mappings.has(drive)) throw new Error(`mapping ${drive} is absent`);
            mappings.delete(drive);
            return;
        }
        if (mappings.has(drive)) throw new Error(`mapping ${drive} is occupied`);
        mappings.set(drive, args[1]);
    });
    const readMapping = vi.fn(async (drive: string) => mappings.get(drive) ?? null);
    const pathExists = (path: string) => mappings.has(`${path.slice(0, 1).toUpperCase()}:`);
    const dispose = async () => rm(stateDirectory, { recursive: true, force: true });
    return { stateDirectory, mappings, substCalls, executeSubst, readMapping, pathExists, dispose };
}

async function writeLeaseAndState(
    stateDirectory: string,
    {
        leaseId = "stale-lease",
        ownerPid = 999999,
        drive = "Z:",
        phase = "prepared",
        includeState = true,
        lease = {},
        state = {},
    }: {
        leaseId?: string;
        ownerPid?: number;
        drive?: string;
        phase?: "prepared" | "mapped";
        includeState?: boolean;
        lease?: Record<string, unknown>;
        state?: Record<string, unknown>;
    } = {},
) {
    const paths = getWebComponentBuildStatePaths(normalizedRoot, stateDirectory);
    await mkdir(paths.directory, { recursive: true });
    await writeFile(paths.leasePath, JSON.stringify({
        formatVersion: 1,
        normalizedPhysicalRepositoryRoot: normalizedRoot,
        ownerPid,
        leaseId,
        ...lease,
    }));
    if (includeState) {
        await writeFile(paths.mappingStatePath, JSON.stringify({
            formatVersion: 1,
            normalizedPhysicalRepositoryRoot: normalizedRoot,
            ownerPid,
            leaseId,
            drive,
            phase,
            ...state,
        }));
    }
    return paths;
}

async function createWorkingDirectory(harness: Awaited<ReturnType<typeof createHarness>>, options: Record<string, unknown> = {}) {
    return createWebComponentBuildWorkingDirectory({
        physicalRepositoryRoot: physicalRoot,
        platform: "win32",
        stateDirectory: harness.stateDirectory,
        pathExists: harness.pathExists,
        executeSubst: harness.executeSubst,
        readSubstMapping: harness.readMapping,
        getProcessStatus: () => "dead",
        ownerPid: 1234,
        createLeaseId: () => "current-lease",
        log: vi.fn(),
        ...options,
    });
}

function createSuccessfulSubstSpawn(output = Buffer.from([0x80])) {
    return vi.fn(() => {
        const child = Object.assign(new EventEmitter(), {
            stdout: new PassThrough(),
            stderr: new PassThrough(),
        });
        queueMicrotask(() => {
            child.stdout.end(output);
            child.stderr.end();
            child.emit("exit", 0);
        });
        return child;
    });
}

describe("Web Component build working directory", () => {
    it("uses the physical repository path unless Windows has a non-ASCII path", async () => {
        expect(needsWindowsAsciiWorkingDirectory("C:\\work\\ehagaki", "win32")).toBe(false);
        expect(needsWindowsAsciiWorkingDirectory("D:\\ドキュメント\\ehagaki", "linux")).toBe(false);
        expect(needsWindowsAsciiWorkingDirectory(physicalRoot, "win32")).toBe(true);

        const harness = await createHarness();
        try {
            const result = await createWebComponentBuildWorkingDirectory({
                physicalRepositoryRoot: physicalRoot,
                platform: "linux",
                stateDirectory: harness.stateDirectory,
                executeSubst: harness.executeSubst,
                readSubstMapping: harness.readMapping,
            });
            expect(result.workingDirectory).toBe(physicalRoot);
            expect(result.usesTemporaryWindowsPath).toBe(false);
            expect(harness.executeSubst).not.toHaveBeenCalled();
        } finally {
            await harness.dispose();
        }
    });

    it("normalizes equivalent Windows roots to one state identity", () => {
        expect(normalizeWindowsRepositoryRoot("D:/ドキュメント/GitHub/ehagaki\\")).toBe(normalizedRoot);
        expect(getWebComponentBuildStatePaths(normalizedRoot).leasePath).toContain("ehagaki-web-component-build");
    });

    it("selects an unused drive letter without replacing an existing mapping", () => {
        expect(findAvailableSubstDriveLetter((path) => path === "Z:\\" || path === "Y:\\")).toBe("X");
    });

    it("creates, maps, and removes only its temporary mapping", async () => {
        const harness = await createHarness({ Z: "D:\\other" });
        try {
            const workingDirectory = await createWorkingDirectory(harness);
            expect(workingDirectory.workingDirectory).toBe("Y:\\");

            await workingDirectory.cleanup();
            await workingDirectory.cleanup();
            expect(harness.substCalls).toEqual([["Y:", physicalRoot], ["Y:", "/D"]]);
            expect(harness.mappings.get("Z:")).toBe("D:\\other");
            expect(harness.mappings.has("Y:")).toBe(false);
        } finally {
            await harness.dispose();
        }
    });

    it("recovers a lease-only stale state without querying or deleting subst mappings", async () => {
        const harness = await createHarness({ Z: "D:\\foreign" });
        try {
            await writeLeaseAndState(harness.stateDirectory, { includeState: false });
            const workingDirectory = await createWorkingDirectory(harness);
            expect(harness.substCalls[0]).toEqual(["Y:", physicalRoot]);
            expect(harness.readMapping).toHaveBeenCalledTimes(1);
            expect(harness.substCalls.some(([drive, command]) => command === "/D" && drive === "Z:")).toBe(false);
            expect(harness.mappings.get("Z:")).toBe("D:\\foreign");
            await workingDirectory.cleanup();
        } finally {
            await harness.dispose();
        }
    });

    it.each(["prepared", "mapped"] as const)("recovers %s state when its mapping is absent without /D", async (phase) => {
        const harness = await createHarness();
        try {
            await writeLeaseAndState(harness.stateDirectory, { drive: "Z:", phase });
            const workingDirectory = await createWorkingDirectory(harness);
            expect(harness.substCalls).toContainEqual(["Z:", physicalRoot]);
            expect(harness.substCalls).not.toContainEqual(["Z:", "/D"]);
            await workingDirectory.cleanup();
        } finally {
            await harness.dispose();
        }
    });

    it.each(["prepared", "mapped"] as const)("recovers matching %s mapping", async (phase) => {
        const harness = await createHarness({ Z: physicalRoot });
        try {
            await writeLeaseAndState(harness.stateDirectory, { drive: "Z:", phase });
            const workingDirectory = await createWorkingDirectory(harness);
            expect(harness.substCalls[0]).toEqual(["Z:", "/D"]);
            await workingDirectory.cleanup();
        } finally {
            await harness.dispose();
        }
    });

    it("retires stale state and lease when the recorded drive is foreign", async () => {
        const harness = await createHarness({ Z: "D:\\foreign" });
        try {
            await writeLeaseAndState(harness.stateDirectory, { drive: "Z:", phase: "mapped" });
            const workingDirectory = await createWorkingDirectory(harness);
            expect(harness.substCalls).not.toContainEqual(["Z:", "/D"]);
            expect(harness.mappings.get("Z:")).toBe("D:\\foreign");
            await workingDirectory.cleanup();
        } finally {
            await harness.dispose();
        }
    });

    it("fails closed for malformed lease-only state", async () => {
        const harness = await createHarness({ Z: "D:\\foreign" });
        try {
            await writeLeaseAndState(harness.stateDirectory, {
                includeState: false,
                lease: { formatVersion: 999 },
            });
            await expect(createWorkingDirectory(harness)).rejects.toThrow(/leasePath=.*mappingStatePresent=false/);
            expect(harness.substCalls).toEqual([]);
            expect(harness.mappings.get("Z:")).toBe("D:\\foreign");
        } finally {
            await harness.dispose();
        }
    });

    it.each(["alive", "unknown"] as const)("fails fast when the existing owner is %s", async (status) => {
        const harness = await createHarness();
        try {
            await writeLeaseAndState(harness.stateDirectory, { includeState: false, ownerPid: 4321 });
            await expect(createWorkingDirectory(harness, { getProcessStatus: () => status })).rejects.toThrow(
                new RegExp(`recordedPid=4321`),
            );
            expect(harness.substCalls).toEqual([]);
        } finally {
            await harness.dispose();
        }
    });

    it("retries a foreign drive collision only after saving the next prepared state", async () => {
        const harness = await createHarness({ Z: "D:\\other" });
        try {
            let firstDriveProbe = true;
            const workingDirectory = await createWorkingDirectory(harness, {
                pathExists: (path: string) => {
                    if (path === "Z:\\") {
                        const occupied = !firstDriveProbe;
                        firstDriveProbe = false;
                        return occupied;
                    }
                    return false;
                },
            });
            const paths = getWebComponentBuildStatePaths(normalizedRoot, harness.stateDirectory);
            expect(harness.substCalls).toEqual([["Z:", physicalRoot], ["Y:", physicalRoot]]);
            const stateAfterMapping = JSON.parse(await readFile(paths.mappingStatePath, "utf8"));
            expect(stateAfterMapping.drive).toBe("Y:");
            expect(stateAfterMapping.phase).toBe("mapped");
            await workingDirectory.cleanup();
        } finally {
            await harness.dispose();
        }
    });

    it("does not create a new mapping when the mapped-state update fails", async () => {
        const harness = await createHarness();
        try {
            const writeState = vi.fn(async (path: string, value: { phase: string }) => {
                if (value.phase === "mapped") throw new Error("state update failed");
                await writeFile(path, JSON.stringify(value));
            });
            await expect(createWorkingDirectory(harness, { writeState })).rejects.toThrow(/state update failed/);
            expect(harness.substCalls).toEqual([["Z:", physicalRoot], ["Z:", "/D"]]);
            expect(harness.mappings.size).toBe(0);
        } finally {
            await harness.dispose();
        }
    });

    it("keeps ownership state when mapping confirmation cannot read the subst listing", async () => {
        const harness = await createHarness();
        try {
            const readMapping = vi.fn(async () => { throw new Error("subst listing unavailable"); });
            await expect(createWorkingDirectory(harness, { readSubstMapping: readMapping })).rejects.toThrow(
                /subst listing unavailable/,
            );
            const paths = getWebComponentBuildStatePaths(normalizedRoot, harness.stateDirectory);
            expect(harness.substCalls).toEqual([["Z:", physicalRoot]]);
            expect(harness.mappings.get("Z:")).toBe(physicalRoot);
            await expect(readFile(paths.leasePath, "utf8")).resolves.toContain("current-lease");
            await expect(readFile(paths.mappingStatePath, "utf8")).resolves.toContain("prepared");
        } finally {
            await harness.dispose();
        }
    });

    it("does not delete a foreign mapping when listing it fails during stale recovery", async () => {
        const harness = await createHarness({ Z: "D:\\foreign" });
        try {
            const paths = await writeLeaseAndState(harness.stateDirectory, { drive: "Z:", phase: "mapped" });
            const readMapping = vi.fn(async () => { throw new Error("subst listing unavailable"); });
            await expect(createWorkingDirectory(harness, { readSubstMapping: readMapping })).rejects.toThrow(
                /subst listing unavailable/,
            );
            expect(harness.substCalls).toEqual([]);
            expect(harness.mappings.get("Z:")).toBe("D:\\foreign");
            await expect(readFile(paths.leasePath, "utf8")).resolves.toContain("stale-lease");
            await expect(readFile(paths.mappingStatePath, "utf8")).resolves.toContain("stale-lease");
        } finally {
            await harness.dispose();
        }
    });

    it("does not decode successful subst mutations", async () => {
        const spawnProcess = createSuccessfulSubstSpawn();
        const fakeSpawn = spawnProcess as unknown as typeof import("node:child_process").spawn;
        await expect(runSubst(["Z:", physicalRoot], fakeSpawn)).resolves.toBeUndefined();
        await expect(runSubst(["Z:", "/D"], fakeSpawn)).resolves.toBeUndefined();
        expect(spawnProcess).toHaveBeenNthCalledWith(1, "subst", ["Z:", physicalRoot], expect.anything());
        expect(spawnProcess).toHaveBeenNthCalledWith(2, "subst", ["Z:", "/D"], expect.anything());
    });

    it("keeps the Web Component build command on the selected safe path", () => {
        expect(createWebComponentBuildCommand("Y:\\", { watch: true })).toEqual({
            command: process.execPath,
            args: [
                "Y:\\node_modules\\vite\\bin\\vite.js",
                "build",
                "--config",
                "vite.web-component.config.ts",
                "--mode",
                "web-component-watch",
                "--watch",
            ],
            cwd: "Y:\\",
        });
    });

    it("keeps the normal Vite dev server on the physical repository path", () => {
        const command = createPhysicalViteDevServerCommand(physicalRoot, {
            host: "127.0.0.1",
            appPort: 5173,
            webComponentPort: 5174,
            environment: { PATH: "test" },
        });
        expect(command.cwd).toBe(physicalRoot);
        expect(command.args[0]).toBe(`${physicalRoot}\\node_modules\\vite\\bin\\vite.js`);
        expect(command.environment).toMatchObject({
            PATH: "test",
            EHAGAKI_WEB_COMPONENT_DEV_PROXY: "true",
            EHAGAKI_WEB_COMPONENT_DEV_PORT: "5174",
        });
    });

    it("can expose only the Vite app server while preserving the loopback proxy target", () => {
        const command = createPhysicalViteDevServerCommand(physicalRoot, {
            host: "0.0.0.0",
            appPort: 5173,
            webComponentPort: 5174,
        });

        expect(command.args).toContain("0.0.0.0");
        expect(command.environment).toMatchObject({
            EHAGAKI_WEB_COMPONENT_DEV_PROXY: "true",
            EHAGAKI_WEB_COMPONENT_DEV_PORT: "5174",
        });
    });

    it("parses a subst listing for one drive", async () => {
        const rawListing = Buffer.concat([Buffer.from("Y:\\: => "), Buffer.from([0x80]), Buffer.from("\r\n")]);
        expect(parseSubstDriveLetters(rawListing)).toEqual(["Y:"]);
        await expect(readSubstMapping("Y:", async () => rawListing, async () => physicalRoot)).resolves.toBe(
            "D:\\ドキュメント\\GitHub\\ehagaki",
        );
        await expect(readSubstMapping("Z:", async () => rawListing, async () => physicalRoot)).resolves.toBeNull();
    });
});
