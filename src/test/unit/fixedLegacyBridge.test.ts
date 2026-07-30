import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
    loadFixedLegacyBridgeManifest,
    verifyFixedLegacyBridgeSources,
} from "../../../scripts/fixedLegacyBridge";

describe("fixed legacy bridge", () => {
    it("一つの固定deploymentと完全なasset集合を検証する", () => {
        const manifest = loadFixedLegacyBridgeManifest();

        expect(manifest.sourceDeploymentId).toBe("ehagaki-mszetyk2g");
        expect(manifest.assets).toHaveLength(56);
        expect(new Set(manifest.assets.map((asset) => asset.path)).size).toBe(56);
        expect(
            manifest.assets.reduce((total, asset) => total + asset.byteSize, 0),
        ).toBe(manifest.totalBytes);
        expect(() => verifyFixedLegacyBridgeSources(manifest)).not.toThrow();
    });

    it("固定setはlazy componentとそのWASM依存を含む", () => {
        const manifest = loadFixedLegacyBridgeManifest();
        const paths = manifest.assets.map((asset) => asset.path);

        expect(paths.some((path) => path.includes("ProfileComponent-"))).toBe(true);
        expect(paths.some((path) => path.includes("SettingsDialog-"))).toBe(true);
        expect(paths.some((path) => path.includes("DraftListDialog-"))).toBe(true);
        expect(paths.some((path) => path.includes("ComposerTargetDialog-"))).toBe(true);
        expect(paths.filter((path) => path.endsWith(".wasm"))).toHaveLength(3);
        expect(paths).toContain("assets/App-g4k_eF4X.js");
        expect(paths).toContain("assets/index-CaVOpWjO.js");

        const rawManifest = readFileSync(
            resolve("legacy-bridge", "manifest.json"),
            "utf8",
        );
        expect(rawManifest).not.toContain("ehagaki.vercel.app/assets/");
    });
});
