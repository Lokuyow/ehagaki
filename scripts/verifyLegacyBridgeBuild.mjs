import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const manifest = JSON.parse(
    readFileSync(resolve("legacy-bridge", "manifest.json"), "utf8"),
);
const outDir = resolve("dist");

function fail(message) {
    throw new Error(`[fixed-legacy-bridge] ${message}`);
}

for (const asset of manifest.assets) {
    const builtPath = resolve(outDir, asset.path);
    if (!existsSync(builtPath)) {
        fail(`built asset is missing: ${asset.path}`);
    }
    const bytes = readFileSync(builtPath);
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (bytes.byteLength !== asset.byteSize || digest !== asset.sha256) {
        fail(`built asset does not match the fixed bytes: ${asset.path}`);
    }
}

const swPath = resolve(outDir, "sw.js");
if (!existsSync(swPath)) {
    fail("generated sw.js is missing");
}
const swText = readFileSync(swPath, "utf8");
const manifestUrls = Array.from(
    swText.matchAll(/"url":"(assets\/[^"]+)"/g),
    (match) => match[1],
);
const fixedUrls = new Set(manifest.assets.map((asset) => asset.path));
for (const asset of manifest.assets) {
    const count = manifestUrls.filter((url) => url === asset.path).length;
    if (count !== 1) {
        fail(`generated sw.js must contain ${asset.path} exactly once; found ${count}`);
    }
}

const unexpectedLegacyUrls = manifestUrls.filter(
    (url) =>
        url.startsWith("assets/") &&
        !fixedUrls.has(url) &&
        !url.split("/").at(-1)?.includes("-bridge-"),
);
if (unexpectedLegacyUrls.length > 0) {
    fail(
        `unexpected non-bridge asset URLs in sw.js: ${unexpectedLegacyUrls.join(", ")}`,
    );
}

const indexHtml = readFileSync(resolve(outDir, "index.html"), "utf8");
const expectedAssetPrefix = process.env.VERCEL ? "/assets/" : "/ehagaki/assets/";
if (!indexHtml.includes(expectedAssetPrefix)) {
    fail(`index.html does not use expected asset base: ${expectedAssetPrefix}`);
}

console.log(
    `Verified ${manifest.assets.length} fixed legacy assets in dist and sw.js (${manifest.totalBytes} bytes).`,
);
