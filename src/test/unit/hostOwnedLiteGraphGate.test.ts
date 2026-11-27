import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import {
    collectReachableModuleIds,
    createFullSelfPublishGraphGate,
    createHostOwnedLiteGraphGate,
    isFullSelfPublishForbiddenModule,
    isLiteForbiddenModule,
} from "../../../scripts/hostOwnedLiteGraphGate.mjs";

describe("Host-owned Lite graph gate", () => {
    it.each(['src/lib/reactionMediaController.ts', 'src/lib/upload/reactionImageCompression.ts'])('rejects app-owned Reaction module %s', path => {
        const entry = resolve(process.cwd(), 'src/web-component/host-owned-entry.ts');
        const module = resolve(process.cwd(), path);
        const plugin = createHostOwnedLiteGraphGate(process.cwd());
        expect(() => plugin.generateBundle.call({ getModuleIds: () => [entry, module],
            getModuleInfo: (id: string) => ({ importedIds: id === entry ? [module] : [], dynamicallyImportedIds: [] }),
            error: (message: string) => { throw new Error(message); },
        })).toThrow(path.split('/').at(-1));
    });
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

describe("Web Component forbidden module patterns", () => {
    // Vite module ids use forward slashes even on Windows; Node paths use the
    // platform separator. Both forms must match.
    const idsFor = (path: string) => [
        `C:\\repo\\${path.replaceAll("/", "\\")}`,
        `C:/repo/${path}`,
        `/repo/${path}`,
    ];

    it.each([
        "src/lib/hostOwnedComposer.ts",
        "src/lib/hostOwnedUpload.ts",
        "src/web-component/hostOwnedLiteElement.ts",
        "src/host-owned-composer-lite/HostOwnedComposerLiteApp.svelte",
        "src/lib/bootstrap/serviceWorkerBootstrap.ts",
    ])("rejects Host-owned or PWA-only module %s from the Full graph", (path) => {
        for (const id of idsFor(path)) {
            expect(isFullSelfPublishForbiddenModule(id), id).toBe(true);
        }
    });

    it.each([
        "src/web-component/fullHostOwnedRuntimeStub.ts",
        "src/components/PostComponent.svelte",
        "src/lib/hostOwnedComposerHelpers.ts",
    ])("allows %s in the Full graph", (path) => {
        for (const id of idsFor(path)) {
            expect(isFullSelfPublishForbiddenModule(id), id).toBe(false);
        }
    });

    it("rejects the PWA registration from the Lite graph", () => {
        expect(isLiteForbiddenModule("virtual:pwa-register/svelte")).toBe(true);
        for (const id of idsFor("src/lib/bootstrap/serviceWorkerBootstrap.ts")) {
            expect(isLiteForbiddenModule(id), id).toBe(true);
        }
    });
});
