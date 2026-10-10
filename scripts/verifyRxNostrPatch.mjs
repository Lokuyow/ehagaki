import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const version = "3.7.8";
const hashes = {
    "src/rx-nostr/rx-nostr.ts": "246200b4009b67c4460cfb1113753a46b15e41e3d190c3180cfd3b9368ae60ba",
    "dist/rx-nostr.js": "6caaa4cc0bbf0a5c807082cf7fef421cc334a8141109937a0717641b67971cc5",
    "dist/rx-nostr.cjs": "2404509b8d33e970556f2952dba90763535979a30a1075063fe8ed8daf72d502",
    "dist/rx-nostr.umd.cjs": "e29c29a0c9ebc330147f672ef7c82f7546d49867abf8e61ce1d9ced81ea2485a",
};

/** Fail closed before Vite/Vitest can reuse or build an unpatched dependency. */
export function verifyRxNostrPatch() {
    /** @param {string} path */
    const json = path => JSON.parse(readFileSync(path, "utf8"));
    /** @param {boolean} condition @param {string} message */
    const assert = (condition, message) => { if (!condition) throw new Error(`[rx-nostr-patch] ${message}`); };
    const manifest = json(resolve(root, "package.json"));
    const lock = json(resolve(root, "package-lock.json"));
    assert(manifest.dependencies?.["rx-nostr"] === version, `package.json must pin ${version}`);
    assert(lock.packages?.[""]?.dependencies?.["rx-nostr"] === version, "root lock pin changed");
    const installations = Object.entries(lock.packages ?? {}).filter(([path]) => path.endsWith("node_modules/rx-nostr"));
    assert(installations.length === 1 && installations[0][0] === "node_modules/rx-nostr"
        && installations[0][1].version === version, "lock must contain a single rx-nostr 3.7.8 installation");
    assert(existsSync(resolve(root, `patches/rx-nostr+${version}.patch`)), "versioned patch missing");
    const require = createRequire(resolve(root, "package.json"));
    const packageRoot = resolve(root, "node_modules/rx-nostr");
    assert(dirname(require.resolve("rx-nostr/package.json")) === packageRoot, "unexpected package placement");
    const installed = json(resolve(packageRoot, "package.json"));
    assert(installed.version === version, "installed version changed");
    assert(require.resolve("rx-nostr") === resolve(packageRoot, "dist/rx-nostr.cjs"), "CJS resolution changed");
    assert(fileURLToPath(import.meta.resolve("rx-nostr")) === resolve(packageRoot, "dist/rx-nostr.js"), "ESM resolution changed");
    assert(installed.exports?.["."]?.require?.default === "./dist/rx-nostr.umd.cjs", "UMD export changed");
    for (const [artifact, expected] of Object.entries(hashes)) {
        const content = readFileSync(resolve(packageRoot, artifact), "utf8").replace(/\r\n/g, "\n");
        const hash = createHash("sha256").update(content).digest("hex");
        assert(hash === expected, `${artifact} is unpatched or changed; run npm ci and review the patch before updating hashes`);
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    verifyRxNostrPatch();
    console.log(`[rx-nostr-patch] ${version}: source/ESM/CJS/UMD verified`);
}
