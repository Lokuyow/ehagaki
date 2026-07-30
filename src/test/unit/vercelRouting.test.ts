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
    it("assetsをSPA fallbackから除外する", () => {
        expect(config.rewrites).toEqual([
            {
                source: "/((?!assets/).*)",
                destination: "/index.html",
            },
        ]);
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
