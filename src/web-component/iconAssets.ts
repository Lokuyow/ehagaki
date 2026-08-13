const ICON_VARIABLE_PREFIX = "--ehagaki-icon-";
const ICON_VARIABLE_PATTERN = /--ehagaki-icon-([0-9a-f]+)/g;

function encodeIconPath(path: string): string {
    return Array.from(
        path,
        (character) => character.charCodeAt(0).toString(16).padStart(2, "0"),
    ).join("");
}

function decodeIconPath(encodedPath: string): string | null {
    if (encodedPath.length === 0 || encodedPath.length % 2 !== 0) return null;
    const path = Array.from({ length: encodedPath.length / 2 }, (_, index) =>
        String.fromCharCode(
            Number.parseInt(encodedPath.slice(index * 2, index * 2 + 2), 16),
        ),
    ).join("");
    return /^[A-Za-z0-9._-]+\.svg$/.test(path) ? path : null;
}

/**
 * A build-only transform uses this stable CSS property name in place of a
 * document-root `/icons/...` URL. The property value is resolved once the
 * Web Component knows its delivery `assetBase`.
 */
export function getWebComponentIconVariableName(iconPath: string): string {
    return `${ICON_VARIABLE_PREFIX}${encodeIconPath(iconPath)}`;
}

export function applyWebComponentIconAssetUrls(
    root: ShadowRoot,
    target: HTMLElement,
    assetBase: URL,
): void {
    const names = new Set<string>();
    for (const style of root.querySelectorAll("style")) {
        for (const match of style.textContent?.matchAll(ICON_VARIABLE_PATTERN) ?? []) {
            names.add(match[0]);
        }
    }
    for (const name of names) {
        const iconPath = decodeIconPath(name.slice(ICON_VARIABLE_PREFIX.length));
        if (!iconPath) continue;
        target.style.setProperty(
            name,
            `url("${new URL(`icons/${iconPath}`, assetBase).href}")`,
        );
    }
}
