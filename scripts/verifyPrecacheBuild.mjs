import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { HASHED_PRECACHE_ASSET_PATTERN } from "../src/lib/swPrecacheInstall.ts";

const swPath = resolve("dist", "sw.js");
const excludedSamplePaths = [
    "host-owned-composer-lite-example.html",
    "web-component-parent-client-example.html",
    "web-component-parent-client-example.js",
    "embed-parent-client-example.html",
    "embed-parent-client-example.js",
];
const requiredPrecachePaths = ["index.html", "manifest.webmanifest"];

function fail(message) {
    throw new Error(`[precache-build] ${message}`);
}

const swText = await readFile(swPath, "utf8").catch(() => {
    fail(`generated service worker is missing: ${swPath}`);
});

const precacheEntries = Array.from(
    swText.matchAll(/\{"revision":(null|"[^"]*"),"url":"([^"]+)"\}/g),
    (match) => ({ revision: JSON.parse(match[1]), url: match[2] }),
);
const precacheUrls = precacheEntries.map((entry) => entry.url);

if (precacheUrls.length === 0) {
    fail("generated service worker does not contain an injected precache manifest");
}

const excludedUrls = excludedSamplePaths.filter((path) => precacheUrls.includes(path));
if (excludedUrls.length > 0) {
    fail(`excluded sample paths must not be precached: ${excludedUrls.join(", ")}`);
}

const missingRequiredUrls = requiredPrecachePaths.filter((path) => !precacheUrls.includes(path));
if (missingRequiredUrls.length > 0) {
    fail(`expected PWA precache paths are missing: ${missingRequiredUrls.join(", ")}`);
}

for (const { url, revision } of precacheEntries) {
    if (HASHED_PRECACHE_ASSET_PATTERN.test(url) && revision !== null) {
        fail(`content-hashed asset must use its URL as cache key: ${url}`);
    }
    if (!url.startsWith("assets/") && revision === null) {
        fail(`unhashed static asset must retain its content revision: ${url}`);
    }
}

console.log(
    `[precache-build] verified ${precacheUrls.length} precache entries; excluded ${excludedSamplePaths.length} samples and retained ${requiredPrecachePaths.join(", ")}`,
);
