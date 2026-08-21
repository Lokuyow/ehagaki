import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface VercelConfig {
    rewrites: Array<{ source: string; destination: string }>;
    headers: Array<{
        source: string;
        headers: Array<{ key: string; value: string }>;
    }>;
}

const config = JSON.parse(
    readFileSync(resolve("vercel.json"), "utf8"),
) as VercelConfig;

describe("Vercel routing", () => {
    it("static asset namespacesをSPA fallbackから除外する", () => {
        expect(config.rewrites).toEqual([
            {
                source: "/((?!assets/|web-component(?:/|$)|web-component-parent-client-example\\.(?:html|js)$|host-owned-composer-example\\.html$).*)",
                destination: "/index.html",
            },
        ]);

        const fallback = new RegExp(`^${config.rewrites[0].source}`);
        expect([
            "/assets/app.js",
            "/web-component-parent-client-example.html",
            "/web-component-parent-client-example.js",
            "/host-owned-composer-example.html",
            "/web-component/ehagaki-composer.js",
            "/web-component/assets/entry.js",
            "/web-component/icons/settings.svg",
            "/web-component/ffmpeg-core/ffmpeg-core.wasm",
        ].every((path) => !fallback.test(path))).toBe(true);
        expect(fallback.test("/settings")).toBe(true);
    });

    it("Service Workerとnosniff headersを維持する", () => {
        expect(config.headers).toContainEqual({
            source: "/sw.js",
            headers: expect.arrayContaining([
                {
                    key: "Cache-Control",
                    value: "public, max-age=0, must-revalidate",
                },
                { key: "Service-Worker-Allowed", value: "/" },
            ]),
        });
        expect(config.headers).toContainEqual({
            source: "/(.*)",
            headers: expect.arrayContaining([
                { key: "X-Content-Type-Options", value: "nosniff" },
            ]),
        });
    });
});
