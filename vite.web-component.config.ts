import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
        exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util", "@jsquash/webp"],
    },
    worker: { format: "es" },
    assetsInclude: ["**/*.wasm"],
    plugins: [
        svelte({ compilerOptions: { customElement: true } }),
        viteStaticCopy({
            targets: [
                {
                    src: "node_modules/@ffmpeg/core/dist/esm/*",
                    dest: "ffmpeg-core",
                },
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
