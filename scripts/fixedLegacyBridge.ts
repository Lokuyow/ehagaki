import { createHash } from "node:crypto";
import {
    existsSync,
    readFileSync,
    readdirSync,
    statSync,
} from "node:fs";
import { resolve, relative, sep } from "node:path";
import type { OutputAsset, OutputChunk } from "rollup";
import type { Plugin } from "vite";

export interface FixedLegacyBridgeAsset {
    path: `assets/${string}`;
    sourceUrl: string;
    contentType: string;
    byteSize: number;
    sha256: string;
}

export interface FixedLegacyBridgeManifest {
    sourceDeploymentId: string;
    sourceBaseUrl: string;
    totalBytes: number;
    assets: FixedLegacyBridgeAsset[];
}

const LEGACY_BRIDGE_ROOT = resolve("legacy-bridge");
const LEGACY_BRIDGE_ASSET_ROOT = resolve(LEGACY_BRIDGE_ROOT, "assets");
const LEGACY_BRIDGE_MANIFEST_PATH = resolve(
    LEGACY_BRIDGE_ROOT,
    "manifest.json",
);
const FIXED_LEGACY_BRIDGE_MANIFEST_SHA256 =
    "ffca05a036796b6a17ef7fb57363d8e06f4c5ad002b011675dcbbadc30f2a801";

function fail(message: string): never {
    throw new Error(`[fixed-legacy-bridge] ${message}`);
}

function sha256(bytes: Uint8Array): string {
    return createHash("sha256").update(bytes).digest("hex");
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertExactKeys(
    value: Record<string, unknown>,
    expectedKeys: string[],
    location: string,
): void {
    const actualKeys = Object.keys(value).sort();
    const expected = [...expectedKeys].sort();
    if (
        actualKeys.length !== expected.length ||
        actualKeys.some((key, index) => key !== expected[index])
    ) {
        fail(`${location} has unexpected or missing fields`);
    }
}

function collectFiles(directory: string): string[] {
    const files: string[] = [];
    for (const entry of readdirSync(directory)) {
        const absolutePath = resolve(directory, entry);
        if (statSync(absolutePath).isDirectory()) {
            files.push(...collectFiles(absolutePath));
        } else {
            files.push(absolutePath);
        }
    }
    return files;
}

function normalizePath(path: string): string {
    return path.split(sep).join("/");
}

function isHtml(bytes: Uint8Array): boolean {
    const prefix = Buffer.from(bytes.subarray(0, 256))
        .toString("utf8")
        .trimStart()
        .toLowerCase();
    return prefix.startsWith("<!doctype html") || prefix.startsWith("<html");
}

function parseAsset(value: unknown, index: number): FixedLegacyBridgeAsset {
    if (!isRecord(value)) {
        fail(`assets[${index}] must be an object`);
    }
    assertExactKeys(
        value,
        ["path", "sourceUrl", "contentType", "byteSize", "sha256"],
        `assets[${index}]`,
    );

    const { path, sourceUrl, contentType, byteSize, sha256: digest } = value;
    if (
        typeof path !== "string" ||
        !/^assets\/[A-Za-z0-9_.-]+$/.test(path)
    ) {
        fail(`assets[${index}].path is invalid`);
    }
    if (typeof sourceUrl !== "string" || !sourceUrl.startsWith("https://")) {
        fail(`assets[${index}].sourceUrl is invalid`);
    }
    if (typeof contentType !== "string" || contentType === "text/html") {
        fail(`assets[${index}].contentType is invalid`);
    }
    if (!Number.isSafeInteger(byteSize) || (byteSize as number) <= 0) {
        fail(`assets[${index}].byteSize is invalid`);
    }
    if (typeof digest !== "string" || !/^[a-f0-9]{64}$/.test(digest)) {
        fail(`assets[${index}].sha256 is invalid`);
    }

    return {
        path: path as `assets/${string}`,
        sourceUrl,
        contentType,
        byteSize: byteSize as number,
        sha256: digest,
    };
}

export function loadFixedLegacyBridgeManifest(): FixedLegacyBridgeManifest {
    if (!existsSync(LEGACY_BRIDGE_MANIFEST_PATH)) {
        fail("manifest.json is missing");
    }

    const manifestBytes = readFileSync(LEGACY_BRIDGE_MANIFEST_PATH);
    if (sha256(manifestBytes) !== FIXED_LEGACY_BRIDGE_MANIFEST_SHA256) {
        fail(
            "manifest digest changed; fixed legacy compatibility changes require explicit review",
        );
    }
    const parsed: unknown = JSON.parse(manifestBytes.toString("utf8"));
    if (!isRecord(parsed)) {
        fail("manifest must be an object");
    }
    assertExactKeys(
        parsed,
        ["sourceDeploymentId", "sourceBaseUrl", "totalBytes", "assets"],
        "manifest",
    );

    const { sourceDeploymentId, sourceBaseUrl, totalBytes, assets } = parsed;
    if (
        typeof sourceDeploymentId !== "string" ||
        sourceDeploymentId.length === 0
    ) {
        fail("sourceDeploymentId is required");
    }
    if (
        typeof sourceBaseUrl !== "string" ||
        !sourceBaseUrl.startsWith("https://") ||
        sourceBaseUrl.endsWith("/")
    ) {
        fail("sourceBaseUrl must be an HTTPS URL without a trailing slash");
    }
    if (!Number.isSafeInteger(totalBytes) || (totalBytes as number) <= 0) {
        fail("totalBytes is invalid");
    }
    if (!Array.isArray(assets) || assets.length === 0) {
        fail("assets must contain the fixed legacy generation");
    }

    const parsedAssets = assets.map(parseAsset);
    const paths = new Set<string>();
    let calculatedTotal = 0;
    for (const asset of parsedAssets) {
        if (paths.has(asset.path)) {
            fail(`duplicate asset path: ${asset.path}`);
        }
        paths.add(asset.path);
        if (asset.sourceUrl !== `${sourceBaseUrl}/${asset.path}`) {
            fail(`sourceUrl does not match sourceBaseUrl: ${asset.path}`);
        }
        calculatedTotal += asset.byteSize;
    }
    if (calculatedTotal !== totalBytes) {
        fail(`totalBytes mismatch: expected ${totalBytes}, got ${calculatedTotal}`);
    }

    return {
        sourceDeploymentId,
        sourceBaseUrl,
        totalBytes: totalBytes as number,
        assets: parsedAssets,
    };
}

export function verifyFixedLegacyBridgeSources(
    manifest = loadFixedLegacyBridgeManifest(),
): void {
    if (!existsSync(LEGACY_BRIDGE_ASSET_ROOT)) {
        fail("asset directory is missing");
    }

    const expectedPaths = new Set<string>(
        manifest.assets.map((asset) => asset.path),
    );
    const actualPaths = collectFiles(LEGACY_BRIDGE_ASSET_ROOT).map((path) =>
        normalizePath(`assets/${relative(LEGACY_BRIDGE_ASSET_ROOT, path)}`),
    );

    for (const actualPath of actualPaths) {
        if (!expectedPaths.has(actualPath)) {
            fail(`unlisted asset file: ${actualPath}`);
        }
    }
    if (actualPaths.length !== expectedPaths.size) {
        fail(
            `asset file count mismatch: expected ${expectedPaths.size}, got ${actualPaths.length}`,
        );
    }

    for (const asset of manifest.assets) {
        const sourcePath = resolve(
            LEGACY_BRIDGE_ASSET_ROOT,
            asset.path.slice("assets/".length),
        );
        if (!existsSync(sourcePath)) {
            fail(`missing asset file: ${asset.path}`);
        }
        const bytes = readFileSync(sourcePath);
        if (bytes.byteLength !== asset.byteSize) {
            fail(`byteSize mismatch: ${asset.path}`);
        }
        if (sha256(bytes) !== asset.sha256) {
            fail(`sha256 mismatch: ${asset.path}`);
        }
        if (isHtml(bytes)) {
            fail(`HTML content is not allowed: ${asset.path}`);
        }
    }
}

function bundleEntryBytes(entry: OutputAsset | OutputChunk): Buffer {
    if (entry.type === "chunk") {
        return Buffer.from(entry.code, "utf8");
    }
    return typeof entry.source === "string"
        ? Buffer.from(entry.source, "utf8")
        : Buffer.from(entry.source);
}

export function fixedLegacyBridgeEmitPlugin(
    manifest = loadFixedLegacyBridgeManifest(),
): Plugin {
    return {
        name: "ehagaki-fixed-legacy-bridge-emit",
        apply: "build",
        enforce: "pre",
        buildStart() {
            verifyFixedLegacyBridgeSources(manifest);
        },
        generateBundle(_options, bundle) {
            for (const asset of manifest.assets) {
                const sourcePath = resolve(
                    LEGACY_BRIDGE_ASSET_ROOT,
                    asset.path.slice("assets/".length),
                );
                const source = readFileSync(sourcePath);
                const existing = bundle[asset.path];
                if (existing) {
                    const existingBytes = bundleEntryBytes(existing);
                    if (!existingBytes.equals(source)) {
                        fail(
                            `generated asset collision: ${asset.path} ` +
                                `(generated ${existingBytes.byteLength} bytes/${sha256(existingBytes)}, ` +
                                `fixed ${source.byteLength} bytes/${asset.sha256})`,
                        );
                    }
                    continue;
                }
                this.emitFile({
                    type: "asset",
                    fileName: asset.path,
                    source,
                });
            }
        },
    };
}
