import { describe, expect, it, vi } from "vitest";
import {
    createWebComponentIconAssetApplier,
    getWebComponentIconVariableName,
} from "../../web-component/iconAssets";

function createStyle(css: string): HTMLStyleElement {
    const style = document.createElement("style");
    style.textContent = css;
    return style;
}

describe("Web Component icon asset applier", () => {
    const deletePath = "delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
    const addPath = "add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
    const deleteVariable = getWebComponentIconVariableName(deletePath);
    const addVariable = getWebComponentIconVariableName(addPath);
    const assetBase = new URL("https://component.example/wc/");

    it("sets each icon variable once per mount", () => {
        const host = document.createElement("div");
        const root = host.attachShadow({ mode: "open" });
        root.append(createStyle(`.a { mask-image: var(${deleteVariable}); }`));
        const setProperty = vi.spyOn(host.style, "setProperty");
        const applier = createWebComponentIconAssetApplier(host, assetBase);

        applier.applyRoot(root);
        applier.applyRoot(root);

        expect(setProperty).toHaveBeenCalledTimes(1);
        expect(host.style.getPropertyValue(deleteVariable)).toBe(
            `url("https://component.example/wc/icons/${deletePath}")`,
        );
    });

    it("applies styles added later, including nested ones, and ignores other nodes", () => {
        const host = document.createElement("div");
        const applier = createWebComponentIconAssetApplier(host, assetBase);
        const setProperty = vi.spyOn(host.style, "setProperty");

        const paragraph = document.createElement("p");
        paragraph.textContent = `var(${deleteVariable})`;
        applier.applyAddedNodes([paragraph, document.createTextNode("typing")]);
        expect(setProperty).not.toHaveBeenCalled();

        const wrapper = document.createElement("div");
        wrapper.append(createStyle(`.b { mask-image: var(${addVariable}); }`));
        applier.applyAddedNodes([createStyle(`.a { mask-image: var(${deleteVariable}); }`), wrapper]);

        expect(host.style.getPropertyValue(deleteVariable)).toContain(deletePath);
        expect(host.style.getPropertyValue(addVariable)).toContain(addPath);
    });
});

describe("Web Component icon assets", () => {
    it("resolves transformed icon variables from the component asset base", () => {
        const host = document.createElement("div");
        const root = host.attachShadow({ mode: "open" });
        const iconPath = "delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
        const iconVariable = getWebComponentIconVariableName(iconPath);
        const style = document.createElement("style");
        style.textContent = `.icon { mask-image: var(${iconVariable}); }`;
        root.append(style);

        createWebComponentIconAssetApplier(
            host,
            new URL("https://component.example/"),
        ).applyRoot(root);

        expect(host.style.getPropertyValue(iconVariable)).toBe(
            `url("https://component.example/icons/${iconPath}")`,
        );
    });
});
