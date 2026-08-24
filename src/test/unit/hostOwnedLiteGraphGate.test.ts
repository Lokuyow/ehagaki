import { describe, expect, it } from "vitest";
import {
    collectReachableModuleIds,
    createFullSelfPublishGraphGate,
    createHostOwnedLiteGraphGate,
} from "../../../scripts/hostOwnedLiteGraphGate.mjs";

describe("Host-owned Lite graph gate", () => {
    it("walks both static and dynamic module edges from the Lite entry", () => {
        const graph = new Map([
            ["entry", { importedIds: ["static"], dynamicallyImportedIds: ["dynamic"] }],
            ["static", { importedIds: [], dynamicallyImportedIds: ["nested"] }],
            ["dynamic", { importedIds: [], dynamicallyImportedIds: [] }],
            ["nested", { importedIds: [], dynamicallyImportedIds: [] }],
        ]);

        expect(collectReachableModuleIds("entry", (id: string) => graph.get(id))).toEqual(
            new Set(["entry", "static", "dynamic", "nested"]),
        );
    });

    it("provides separate gates for the Full and Lite composition roots", () => {
        expect(createFullSelfPublishGraphGate(process.cwd()).name).toBe("ehagaki-full-self-publish-graph-gate");
        expect(createHostOwnedLiteGraphGate(process.cwd()).name).toBe("ehagaki-host-owned-lite-graph-gate");
    });
});
