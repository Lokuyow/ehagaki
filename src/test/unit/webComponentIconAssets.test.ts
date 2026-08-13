import { describe, expect, it } from "vitest";
import {
    applyWebComponentIconAssetUrls,
    getWebComponentIconVariableName,
} from "../../web-component/iconAssets";

describe("Web Component icon assets", () => {
    it("resolves transformed icon variables from the component asset base", () => {
        const host = document.createElement("div");
        const root = host.attachShadow({ mode: "open" });
        const iconPath = "delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
        const iconVariable = getWebComponentIconVariableName(iconPath);
        const style = document.createElement("style");
        style.textContent = `.icon { mask-image: var(${iconVariable}); }`;
        root.append(style);

        applyWebComponentIconAssetUrls(
            root,
            host,
            new URL("https://component.example/"),
        );

        expect(host.style.getPropertyValue(iconVariable)).toBe(
            `url("https://component.example/icons/${iconPath}")`,
        );
    });
});
