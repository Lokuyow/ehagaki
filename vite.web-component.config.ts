import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { getWebComponentIconVariableName } from "./src/web-component/iconAssets";
import { createHostOwnedLiteGraphGate } from "./scripts/hostOwnedLiteGraphGate.mjs";
import { resolve } from "node:path";

const iconUrlPattern = /url\((["'])\/icons\/([^"'()]+)\1\)/g;

function resolveWebComponentIconUrls() {
    return {
        name: "ehagaki-web-component-icon-urls",
        enforce: "pre" as const,
        transform(source: string, id: string) {
            if (!id.endsWith(".svelte") || !source.includes("/icons/")) {
                return null;
            }
            return {
                code: source.replace(
                    iconUrlPattern,
                    (_match, _quote, iconPath: string) =>
                        `var(${getWebComponentIconVariableName(iconPath)})`,
                ),
                map: null,
            };
        },
    };
}

function resolveHostOwnedLiteFullOnlyImports() {
    const root = process.cwd();
    const fullOnlyStub = resolve(root, "src/host-owned-composer-lite/fullOnlyRuntimeStub.ts");
    const normalUploadStub = resolve(root, "src/host-owned-composer-lite/normalUploadLiteStub.ts");
    const fullOnlyImports = new Set([
        "../lib/postManager",
        "../lib/nip46Service",
        "../lib/parentClientAuthService",
        "../lib/postHistoryMediaPersistence",
        "../lib/storage/postHistoryRepository",
        "../lib/replyQuoteService",
    ]);
    return {
        name: "ehagaki-host-owned-lite-full-only-imports",
        enforce: "pre" as const,
        resolveId(source: string, importer?: string) {
            if (source.endsWith("/customEmoji") || source === "../customEmoji") {
                return resolve(root, "src/host-owned-composer-lite/customEmojiLite.ts");
            }
            if (source.includes("customEmojiStore.svelte")) {
                return resolve(root, "src/host-owned-composer-lite/customEmojiStoreLite.ts");
            }
            if (!importer?.endsWith("src/components/PostComponent.svelte")) return null;
            if (fullOnlyImports.has(source)) return fullOnlyStub;
            if (source === "../lib/normalUploadHelper") return normalUploadStub;
            return null;
        },
    };
}

/**
 * Standalone Web Component distribution. It intentionally excludes the PWA
 * plugin, manifest, service worker registration, share target, and fixed
 * iframe bridge used by the regular application build.
 */
export default defineConfig(({ mode }) => {
    const isHostOwnedLite = mode === "host-owned-lite";
    const isWatchBuild = mode === "web-component-watch";
    const distributionDirectory = isHostOwnedLite
        ? "dist-web-component/host-owned"
        : "dist-web-component";

    return {
    base: "./",
    define: {
        __EHAGAKI_COMPOSER_LITE__: isHostOwnedLite ? "true" : "false",
    },
    // Do not copy the PWA's public service worker or iframe sample. The small
    // set of runtime assets used by the component is copied explicitly below.
    publicDir: false,
    optimizeDeps: {
        exclude: ["@jsquash/webp"],
    },
    worker: { format: "es" },
    assetsInclude: ["**/*.wasm"],
    plugins: [
        resolveWebComponentIconUrls(),
        ...(isHostOwnedLite ? [resolveHostOwnedLiteFullOnlyImports()] : []),
        svelte({ compilerOptions: { customElement: true } }),
        ...(isHostOwnedLite ? [createHostOwnedLiteGraphGate(process.cwd())] : []),
        viteStaticCopy({
            targets: [
                {
                    src: "public/icons/**/*",
                    dest: "icons",
                },
                {
                    src: "public/ehagaki_icon.svg",
                    dest: ".",
                },
            ],
        }),
    ],
    build: {
        outDir: distributionDirectory,
        // The Lite directory is nested under the full distribution output.
        // It must not erase the full files built immediately before it.
        emptyOutDir: !isHostOwnedLite && !isWatchBuild,
        cssCodeSplit: false,
        lib: {
            entry: isHostOwnedLite
                ? "src/web-component/host-owned-entry.ts"
                : "src/web-component/entry.ts",
            formats: ["es"],
            fileName: "ehagaki-composer",
        },
        rollupOptions: {
            output: {
                entryFileNames: "ehagaki-composer.js",
                chunkFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash][extname]",
            },
        },
    },
};
});
