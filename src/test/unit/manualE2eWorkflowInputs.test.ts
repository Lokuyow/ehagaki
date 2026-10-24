import { describe, expect, it } from "vitest";
import { resolveManualE2eInputs } from "../../../scripts/manualE2eWorkflowInputs";

describe("manual E2E workflow input resolution", () => {
    it("preserves full CI coverage for default and explicit both-OS runs", () => {
        for (const input of [{}, { os: "both" }]) {
            expect(resolveManualE2eInputs(input)).toEqual({
                focused: false,
                os: input.os ?? "auto",
                specs: [],
                project: "all",
                grep: "",
                repeat: 1,
                runners: [
                    { os: "ubuntu-latest", engines: "all", all_browsers: "1" },
                    { os: "windows-latest", engines: "chromium", all_browsers: "0" },
                ],
            });
        }
    });

    it("keeps the existing grep-only input focused on Ubuntu", () => {
        expect(resolveManualE2eInputs({ grep: "close responds" })).toMatchObject({
            focused: true,
            runners: [{ os: "ubuntu-latest", engines: "all", all_browsers: "1" }],
        });
    });

    it("selects the WebKit project and repeats only the requested spec", () => {
        expect(resolveManualE2eInputs({
            specs: "src/test/e2e/postHistoryFullScan.spec.ts:123",
            project: "mobile-webkit",
            repeat: "5",
        })).toMatchObject({
            focused: true,
            specs: ["src/test/e2e/postHistoryFullScan.spec.ts:123"],
            repeat: 5,
            runners: [{ os: "ubuntu-latest", engines: "all", all_browsers: "1" }],
        });
    });

    it("allows Firefox on Ubuntu and Chromium-only filtering on Windows", () => {
        expect(resolveManualE2eInputs({ os: "ubuntu", project: "desktop-firefox" }).runners)
            .toEqual([{ os: "ubuntu-latest", engines: "all", all_browsers: "1" }]);
        expect(resolveManualE2eInputs({ os: "windows", project: "mobile-chromium" }).runners)
            .toEqual([{ os: "windows-latest", engines: "chromium", all_browsers: "0" }]);
    });

    it("rejects a repeated full run without a spec or title filter", () => {
        expect(() => resolveManualE2eInputs({ repeat: "5" }))
            .toThrow("Repeated E2E runs require e2e_specs or e2e_grep");
    });

    it("rejects unsupported projects, runner combinations, and option injection", () => {
        expect(() => resolveManualE2eInputs({ project: "chromium" })).toThrow("Unsupported Playwright project");
        expect(() => resolveManualE2eInputs({ os: "windows", project: "mobile-webkit" }))
            .toThrow("is available only on Ubuntu");
        expect(() => resolveManualE2eInputs({ os: "both", project: "desktop-firefox" }))
            .toThrow("is available only on Ubuntu");
        expect(() => resolveManualE2eInputs({ specs: "src/test/e2e/../../package.json" }))
            .toThrow("Invalid E2E spec path");
    });
});
