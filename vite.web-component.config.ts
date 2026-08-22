import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { getWebComponentIconVariableName } from "./src/web-component/iconAssets";

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

/**
 * Standalone Web Component distribution. It intentionally excludes the PWA
 * plugin, manifest, service worker registration, share target, and fixed
 * iframe bridge used by the regular application build.
 */
export default defineConfig({
    base: "./",
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
        svelte({ compilerOptions: { customElement: true } }),
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
        outDir: "dist-web-component",
        emptyOutDir: true,
        cssCodeSplit: false,
        lib: {
            entry: "src/web-component/entry.ts",
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
});
