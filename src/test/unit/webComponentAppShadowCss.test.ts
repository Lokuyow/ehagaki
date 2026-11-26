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
function minify(css: string): string {
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

/** Declarations of top-level rules whose selector is exactly `selector`. */
function declarationsFor(css: string, selector: string): string {
    const normalized = css.replaceAll(/\s+/g, " ");
    const escaped = selector.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return Array.from(
        normalized.matchAll(new RegExp(`(?<=^|[{}] ?)${escaped} ?\\{([^}]*)\\}`, "g")),
        (match) => match[1],
    ).join(";");
}

describe("Web Component app.css shadow-root transform", () => {
    for (const [label, load] of [
        ["formatted development CSS", () => appCss],
        ["minified production CSS", () => minify(appCss)],
    ] as const) {
        it(`applies the body text rules to the shell in ${label}`, () => {
            const transformed = transformAppCssForShadowRoot(load());
            const shellRules = declarationsFor(transformed, ".ehagaki-web-component-shell");

            expect(transformed).not.toContain(":root");
            expect(shellRules).toMatch(/overflow-wrap: ?anywhere/);
            expect(shellRules).toMatch(/line-break: ?strict/);
        });

        it(`keeps document scrolling rules off the host in ${label}`, () => {
            const transformed = transformAppCssForShadowRoot(load()).replaceAll(/\s+/g, "");

            // The host owns the component box; clipping it would cut off overlays.
            expect(transformed).not.toMatch(/:host,\.ehagaki-web-component-shell\{/);
            expect(transformed).not.toMatch(/(^|[{}]):host\{[^}]*overflow-x:hidden/);
        });
    }

    it("does not rewrite selectors that merely contain body", () => {
        const css = ".modal-body{color:red}tbody{color:blue}#apple{color:green}";
        expect(transformAppCssForShadowRoot(css)).toBe(css);
    });
});
