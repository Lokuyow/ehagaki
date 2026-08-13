import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const outputRoot = join(process.cwd(), "dist-web-component");

async function listFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async (entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? listFiles(path) : [path];
    }));
    return nested.flat();
}

const files = await listFiles(outputRoot);
const entry = join(outputRoot, "ehagaki-composer.js");
if (!files.includes(entry)) {
    throw new Error("Web Component entry was not emitted");
}
if (files.some((file) => /(^|[\\/])sw\.js$|manifest\.webmanifest$/.test(file))) {
    throw new Error("Web Component build must not emit a service worker or manifest");
}
const source = (await Promise.all(
    files.filter((file) => file.endsWith(".js")).map((file) => readFile(file, "utf8")),
)).join("\n");
for (const forbidden of ["virtual:pwa-register", "serviceWorkerBootstrap", "embed-parent-client-example"]) {
    if (source.includes(forbidden)) {
        throw new Error(`Web Component build contains forbidden runtime: ${forbidden}`);
    }
}
const unresolvedAppAssetReferences = [
    /url\(\s*(["'])?\/icons\//,
    /src=["']\.\/ehagaki_icon\.svg["']/,
];
for (const pattern of unresolvedAppAssetReferences) {
    if (pattern.test(source)) {
        throw new Error(
            `Web Component build contains an unresolved app-owned asset reference: ${pattern}`,
        );
    }
}
console.log("[web-component-build] standalone output verified");
