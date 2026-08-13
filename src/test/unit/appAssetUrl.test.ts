import { afterEach, describe, expect, it } from "vitest";
import {
    configureAppRuntimeEnvironment,
    getAppRuntimeEnvironment,
} from "../../lib/appRuntimeEnvironment";
import { resolveAppAssetUrl } from "../../lib/appAssetUrl";

const previousEnvironment = getAppRuntimeEnvironment();

afterEach(() => {
    configureAppRuntimeEnvironment(previousEnvironment);
});

describe("resolveAppAssetUrl", () => {
    it("uses the active runtime asset base", () => {
        configureAppRuntimeEnvironment({
            assetBase: new URL("https://component.example/assets/"),
        });

        expect(resolveAppAssetUrl("ehagaki_icon.svg")).toBe(
            "https://component.example/assets/ehagaki_icon.svg",
        );
    });
});
