import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

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

const precacheUrls = Array.from(
    swText.matchAll(/\{"revision":(?:null|"[^"]*"),"url":"([^"]+)"\}/g),
    (match) => match[1],
);

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

console.log(
    `[precache-build] verified ${precacheUrls.length} precache entries; excluded ${excludedSamplePaths.length} samples and retained ${requiredPrecachePaths.join(", ")}`,
);
