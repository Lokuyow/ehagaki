import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { transformAppCssForShadowRoot } from "../../web-component/appShadowCss";

const appCss = readFileSync(resolve("src/app.css"), "utf8");

/**
 * Minifies like the production build. esbuild refuses to run inside the jsdom
 * test environment, so it runs in a plain Node child process.
 */
async function minify(css: string): Promise<string> {
    return execFileSync(
        process.execPath,
        [
            "-e",
            "require('esbuild').transform(require('fs').readFileSync(0, 'utf8'), { loader: 'css', minify: true })"
                + ".then((result) => process.stdout.write(result.code))",
        ],
        { input: css, encoding: "utf8" },
    );
}

/** Selector lists of top-level rules, normalized without whitespace. */
function selectors(css: string): string[] {
    return Array.from(css.matchAll(/(?:^|[{}])\s*([^{}@;]+?)\s*\{/g), (match) =>
        match[1].replaceAll(/\s+/g, ""));
}

describe("Web Component app.css shadow-root transform", () => {
    for (const [label, load] of [
        ["formatted development CSS", async () => appCss],
        ["minified production CSS", () => minify(appCss)],
    ] as const) {
        it(`rewrites document-root selectors in ${label}`, async () => {
            const transformed = transformAppCssForShadowRoot(await load());
            const ruleSelectors = selectors(transformed);

            expect(transformed).not.toContain(":root");
            expect(ruleSelectors).toContain(":host,.ehagaki-web-component-shell");
            expect(ruleSelectors.filter((selector) => selector === ".ehagaki-web-component-shell")).toHaveLength(2);
            for (const selector of ruleSelectors) {
                const parts = selector.split(",");
                expect(parts, selector).not.toContain("html");
                expect(parts, selector).not.toContain("body");
                expect(parts, selector).not.toContain("#app");
            }
        });
    }

    it("keeps the shell rules that the document-root rules provided", async () => {
        const transformed = transformAppCssForShadowRoot(await minify(appCss));
        const shellRules = Array.from(
            transformed.matchAll(/(?<=^|})\.ehagaki-web-component-shell\{([^}]*)\}/g),
            (match) => match[1],
        ).join(";");

        expect(shellRules).toContain("overflow-wrap:anywhere");
        expect(shellRules).toContain("line-break:strict");
        expect(transformed).toMatch(/:host,\.ehagaki-web-component-shell\{[^}]*overflow-x:hidden/);
    });

    it("does not rewrite selectors that merely contain body or app", () => {
        const css = ".modal-body{color:red}tbody{color:blue}#apple{color:green}";
        expect(transformAppCssForShadowRoot(css)).toBe(css);
    });
});
