import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
    createWebComponentBuildWorkingDirectory,
    getWebComponentBuildStatePaths,
    normalizeWindowsRepositoryRoot,
    parseSubstDriveLetters,
    readSubstMapping,
    runSubst,
} from "../../../scripts/webComponentBuildWorkingDirectory.mjs";

const enabled = process.platform === "win32" && process.env.EHAGAKI_RUN_SUBST_INTEGRATION === "1";

async function listMappings(): Promise<Map<string, string>> {
    const listing = await runSubst([]);
    if (!Buffer.isBuffer(listing)) throw new Error("subst listing did not return output.");
    return new Map(await Promise.all(parseSubstDriveLetters(listing).map(async (drive) => {
        const target = await readSubstMapping(drive, async () => listing);
        if (target === null) throw new Error(`subst mapping ${drive} disappeared while reading it.`);
        return [drive, target] as const;
    })));
}

const testGroup = enabled ? describe : describe.skip;

testGroup("Web Component subst integration", () => {
    it("recovers a stale mapping after an abrupt-termination fixture", async () => {
        const stateDirectory = await mkdtemp(join(tmpdir(), "ehagaki-subst-integration-"));
        const physicalRoot = await mkdtemp(join(tmpdir(), "ehagaki-subst-日本-"));
        const initialMappings = await listMappings();
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
            const recoveredMappings = await listMappings();
            expect(recoveredMappings.get(firstDrive)).toBe(physicalRoot);
            expect([...recoveredMappings.entries()].filter(([drive]) => !initialMappings.has(drive))).toHaveLength(1);
        } finally {
            for (const drive of drivesCreatedByTest) {
                const currentMappings = await listMappings();
                if (currentMappings.get(drive) === physicalRoot) {
                    await runSubst([drive, "/D"]);
                }
            }
            if (secondHandle) await secondHandle.cleanup().catch(() => {});
            if (firstHandle) await firstHandle.cleanup().catch(() => {});
            try {
                const finalMappings = await listMappings();
                expect([...finalMappings.entries()]).toEqual([...initialMappings.entries()]);
            } finally {
                await rm(stateDirectory, { recursive: true, force: true });
                await rm(physicalRoot, { recursive: true, force: true });
            }
        }
    });
});
