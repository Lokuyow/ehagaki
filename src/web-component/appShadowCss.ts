const SHELL_SELECTOR = ".ehagaki-web-component-shell";

/**
 * app.css is authored for the document root. The Web Component copies it into
 * its open shadow tree, so document-root selectors are rewritten to the host
 * and the component shell instead of touching host styles.
 *
 * The rewrite must work on both the formatted development CSS and the minified
 * production CSS (`html,body,#app{`), so selectors are matched with optional
 * whitespace and anchored at a rule boundary.
 */
export function transformAppCssForShadowRoot(css: string): string {
    return css
        .replaceAll(/:root:is\(\s*\.light\s*,\s*\.dark\s*\)/g, ":host(:is(.light, .dark))")
        .replaceAll(":root", ":host")
        .replace(
            /(^|[{};\s])html\s*,\s*body\s*,\s*#app\s*\{/,
            `$1:host,${SHELL_SELECTOR}{`,
        )
        .replace(/(^|[{};\s])#app\s*\{/, `$1${SHELL_SELECTOR}{`)
        .replace(/(^|[{};\s])body\s*\{/, `$1${SHELL_SELECTOR}{`);
}
