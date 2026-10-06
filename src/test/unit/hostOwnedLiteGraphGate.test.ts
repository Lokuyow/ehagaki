import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
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

    it("rejects the Full-only headless upload service from the Lite graph", () => {
        const entry = resolve(process.cwd(), "src/web-component/host-owned-entry.ts");
        const headlessUpload = resolve(process.cwd(), "src/lib/upload/headlessUpload.ts");
        const plugin = createHostOwnedLiteGraphGate(process.cwd());

        expect(() => plugin.generateBundle.call({
            getModuleIds: () => [entry, headlessUpload],
            getModuleInfo: (id: string) => id === entry
                ? { importedIds: [headlessUpload], dynamicallyImportedIds: [] }
                : { importedIds: [], dynamicallyImportedIds: [] },
            error: (message: string) => { throw new Error(message); },
        })).toThrow("headlessUpload.ts");
    });
});
