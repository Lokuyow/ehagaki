import { describe, expect, it } from "vitest";
import { collectReachableModuleIds } from "../../../scripts/hostOwnedLiteGraphGate.mjs";

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
});
