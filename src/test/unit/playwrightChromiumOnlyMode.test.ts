import { afterEach, describe, expect, it } from "vitest";
import {
    isChromiumOnlyPlaywrightRun,
    resolvePlaywrightBrowserNames,
} from "../../../scripts/playwrightChromiumOnlyMode.mjs";

describe("playwrightChromiumOnlyMode", () => {
    const originalAgent = process.env.EHAGAKI_E2E_AGENT;
    const originalCi = process.env.CI;
    const originalAllBrowsers = process.env.EHAGAKI_E2E_ALL_BROWSERS;

    afterEach(() => {
        if (originalAgent === undefined) delete process.env.EHAGAKI_E2E_AGENT;
        else process.env.EHAGAKI_E2E_AGENT = originalAgent;
        if (originalCi === undefined) delete process.env.CI;
        else process.env.CI = originalCi;
        if (originalAllBrowsers === undefined) delete process.env.EHAGAKI_E2E_ALL_BROWSERS;
        else process.env.EHAGAKI_E2E_ALL_BROWSERS = originalAllBrowsers;
    });

    it("limits CI runs to chromium unless all browsers are requested", () => {
        delete process.env.EHAGAKI_E2E_AGENT;
        process.env.CI = "true";
        delete process.env.EHAGAKI_E2E_ALL_BROWSERS;

        expect(isChromiumOnlyPlaywrightRun()).toBe(true);
        expect(resolvePlaywrightBrowserNames(["chromium", "firefox", "webkit"])).toEqual(["chromium"]);

        process.env.EHAGAKI_E2E_ALL_BROWSERS = "1";
        expect(isChromiumOnlyPlaywrightRun()).toBe(false);
        expect(resolvePlaywrightBrowserNames(["chromium", "firefox", "webkit"])).toEqual([
            "chromium",
            "firefox",
            "webkit",
        ]);
    });
});
