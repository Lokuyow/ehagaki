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
const liteEntry = join(outputRoot, "host-owned", "ehagaki-composer.js");
if (!files.includes(entry)) {
    throw new Error("Web Component entry was not emitted");
}
if (!files.includes(liteEntry)) {
    throw new Error("Host-owned Composer Lite entry was not emitted");
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
// Published files must not carry absolute build paths (for example module id
// debug comments such as `// C:/Users/...` or `// /home/...`). The build may
// run from a short substituted drive root such as `Z:\`, which is too short to
// search for, so only a deeper working directory is matched literally.
const buildRoot = process.cwd();
if (buildRoot.replace(/[\\/]+$/, "").length > 3) {
    for (const root of new Set([buildRoot, buildRoot.replaceAll("\\", "/")])) {
        if (source.includes(root)) {
            throw new Error("Web Component build contains the absolute build directory path");
        }
    }
}
if (/^\s*\/\/ (?:[A-Za-z]:[\\/]|\/(?:home|Users|tmp|var|private)\/)/m.test(source)) {
    throw new Error("Web Component build contains absolute module path comments");
}
if (/(?:[A-Za-z]:|\/(?:home|Users))[\\/][^"'`\s]*[\\/]node_modules[\\/]/.test(source)) {
    throw new Error("Web Component build contains absolute node_modules paths");
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
