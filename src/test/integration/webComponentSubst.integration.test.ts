import { describe, expect, it } from "vitest";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
    createWebComponentBuildWorkingDirectory,
    getWebComponentBuildStatePaths,
    normalizeWindowsRepositoryRoot,
} from "../../../scripts/webComponentBuildWorkingDirectory.mjs";

const enabled = process.platform === "win32" && process.env.EHAGAKI_RUN_SUBST_INTEGRATION === "1";

function runSubst(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        const command = args.length === 0 ? "cmd.exe" : "subst";
        const commandArgs = args.length === 0 ? ["/d", "/s", "/c", "chcp 65001>nul & subst"] : args;
        const child = spawn(command, commandArgs, {
            stdio: ["ignore", "pipe", "pipe"],
            windowsHide: true,
        });
        const chunks: Buffer[] = [];
        child.stdout.on("data", (chunk) => { chunks.push(Buffer.from(chunk)); });
        child.stderr.on("data", (chunk) => { chunks.push(Buffer.from(chunk)); });
        child.once("error", reject);
        child.once("exit", (code) => {
            if (code === 0) {
                resolve(new TextDecoder("shift_jis").decode(Buffer.concat(chunks)));
                return;
            }
            reject(new Error(`subst ${args.join(" ")} failed (${code ?? "unknown"}): ${Buffer.concat(chunks).toString("utf8").trim()}`));
        });
    });
}

function parseMappings(output: string): Map<string, string> {
    const mappings = new Map<string, string>();
    for (const line of output.split(/\r?\n/)) {
        const match = line.match(/^([A-Z]):\\:\s*=>\s*(.+)$/i);
        if (match) mappings.set(`${match[1].toUpperCase()}:`, match[2].trim());
    }
    return mappings;
}

const testGroup = enabled ? describe : describe.skip;

testGroup("Web Component subst integration", () => {
    it("recovers a stale mapping after an abrupt-termination fixture", async () => {
        const stateDirectory = await mkdtemp(join(tmpdir(), "ehagaki-subst-integration-"));
        const physicalRoot = await mkdtemp(join(tmpdir(), "ehagaki-subst-日本-"));
        const initialMappings = parseMappings(await runSubst([]));
        const normalizedRoot = normalizeWindowsRepositoryRoot(physicalRoot);
        const paths = getWebComponentBuildStatePaths(normalizedRoot, stateDirectory);
        const drivesCreatedByTest = new Set<string>();
        let firstHandle: Awaited<ReturnType<typeof createWebComponentBuildWorkingDirectory>> | undefined;
        let secondHandle: Awaited<ReturnType<typeof createWebComponentBuildWorkingDirectory>> | undefined;

        try {
            firstHandle = await createWebComponentBuildWorkingDirectory({
                physicalRepositoryRoot: physicalRoot,
                stateDirectory,
            });
            const firstDrive = firstHandle.workingDirectory.slice(0, 2).toUpperCase();
            drivesCreatedByTest.add(firstDrive);

            const lease = JSON.parse(await readFile(paths.leasePath, "utf8"));
            const state = JSON.parse(await readFile(paths.mappingStatePath, "utf8"));
            await writeFile(paths.leasePath, JSON.stringify({ ...lease, ownerPid: 999999 }));
            await writeFile(paths.mappingStatePath, JSON.stringify({ ...state, ownerPid: 999999 }));

            secondHandle = await createWebComponentBuildWorkingDirectory({
                physicalRepositoryRoot: physicalRoot,
                stateDirectory,
                getProcessStatus: () => "dead",
            });
            drivesCreatedByTest.add(secondHandle.workingDirectory.slice(0, 2).toUpperCase());
            const recoveredMappings = parseMappings(await runSubst([]));
            expect(recoveredMappings.get(firstDrive)).toBe(physicalRoot);
            expect([...recoveredMappings.entries()].filter(([drive]) => !initialMappings.has(drive))).toHaveLength(1);
        } finally {
            for (const drive of drivesCreatedByTest) {
                const currentMappings = parseMappings(await runSubst([]));
                if (currentMappings.get(drive) === physicalRoot) {
                    await runSubst([drive, "/D"]);
                }
            }
            if (secondHandle) await secondHandle.cleanup().catch(() => {});
            if (firstHandle) await firstHandle.cleanup().catch(() => {});
            try {
                const finalMappings = parseMappings(await runSubst([]));
                expect([...finalMappings.entries()]).toEqual([...initialMappings.entries()]);
            } finally {
                await rm(stateDirectory, { recursive: true, force: true });
                await rm(physicalRoot, { recursive: true, force: true });
            }
        }
    });
});
