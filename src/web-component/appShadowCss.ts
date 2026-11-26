const SHELL_SELECTOR = ".ehagaki-web-component-shell";

/**
 * app.css is authored for the document root. The Web Component copies it into
 * its open shadow tree, so `:root` rules are rewritten to the host.
 *
 * The document scrolling and positioning rules (`html, body, #app` and `#app`)
 * do not apply inside the component: the host page owns the component's box,
 * and clipping overflow on the host would cut off overlays at its edges. Their
 * selectors match nothing in the shadow tree and are left as they are.
 *
 * The `body` rule carries the inherited text rules (colour and line breaking
 * such as `overflow-wrap: anywhere`), so it is applied to the component shell.
 * Its layout declarations are overridden by the shell rules that follow app.css.
 *
 * The rewrite must work on both the formatted development CSS and the minified
 * production CSS (`}body{`), so selectors are matched with optional whitespace
 * and anchored at a rule boundary.
 */
export function transformAppCssForShadowRoot(css: string): string {
    return css
        .replaceAll(/:root:is\(\s*\.light\s*,\s*\.dark\s*\)/g, ":host(:is(.light, .dark))")
        .replaceAll(":root", ":host")
        .replace(/(^|[{};\s])body\s*\{/, `$1${SHELL_SELECTOR}{`);
}
