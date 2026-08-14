import { describe, expect, it, vi } from "vitest";
import {
    createWebComponentBuildWorkingDirectory,
    findAvailableSubstDriveLetter,
    needsWindowsAsciiWorkingDirectory,
} from "../../../scripts/webComponentBuildWorkingDirectory.mjs";
import {
    createPhysicalViteDevServerCommand,
    createWebComponentBuildCommand,
} from "../../../scripts/webComponentBuildRunner.mjs";

describe("Web Component build working directory", () => {
    it("uses the physical repository path unless Windows has a non-ASCII path", () => {
        expect(needsWindowsAsciiWorkingDirectory("C:\\work\\ehagaki", "win32")).toBe(false);
        expect(needsWindowsAsciiWorkingDirectory("D:\\ドキュメント\\ehagaki", "linux")).toBe(false);
        expect(needsWindowsAsciiWorkingDirectory("D:\\ドキュメント\\ehagaki", "win32")).toBe(true);
    });

    it("selects an unused drive letter without replacing an existing mapping", () => {
        expect(findAvailableSubstDriveLetter((path) => path === "Z:\\" || path === "Y:\\")).toBe("X");
    });

    it("creates and removes only its temporary mapping for a Windows non-ASCII path", async () => {
        const executeSubst = vi.fn().mockResolvedValue(undefined);
        const log = vi.fn();
        const workingDirectory = await createWebComponentBuildWorkingDirectory({
            physicalRepositoryRoot: "D:\\ドキュメント\\GitHub\\ehagaki",
            platform: "win32",
            pathExists: (path) => path === "Z:\\",
            executeSubst,
            log,
        });

        expect(workingDirectory.workingDirectory).toBe("Y:\\");
        expect(workingDirectory.usesTemporaryWindowsPath).toBe(true);
        expect(executeSubst).toHaveBeenCalledWith(["Y:", "D:\\ドキュメント\\GitHub\\ehagaki"]);
        expect(log).toHaveBeenCalledWith("Web Component build uses temporary Windows path Y:\\");

        await workingDirectory.cleanup();
        await workingDirectory.cleanup();
        expect(executeSubst).toHaveBeenLastCalledWith(["Y:", "/D"]);
        expect(executeSubst).toHaveBeenCalledTimes(2);
    });

    it("keeps the Web Component build command on the selected safe path", () => {
        expect(createWebComponentBuildCommand("Y:\\", { watch: true })).toEqual({
            command: process.execPath,
            args: [
                "Y:\\node_modules\\vite\\bin\\vite.js",
                "build",
                "--config",
                "vite.web-component.config.ts",
                "--watch",
            ],
            cwd: "Y:\\",
        });
    });

    it("keeps the normal Vite dev server on the physical repository path", () => {
        const physicalRepositoryRoot = "D:\\ドキュメント\\GitHub\\ehagaki";
        const command = createPhysicalViteDevServerCommand(physicalRepositoryRoot, {
            host: "127.0.0.1",
            appPort: 5173,
            webComponentPort: 5174,
            environment: { PATH: "test" },
        });

        expect(command.cwd).toBe(physicalRepositoryRoot);
        expect(command.args[0]).toBe("D:\\ドキュメント\\GitHub\\ehagaki\\node_modules\\vite\\bin\\vite.js");
        expect(command.environment).toMatchObject({
            PATH: "test",
            EHAGAKI_WEB_COMPONENT_DEV_PROXY: "true",
            EHAGAKI_WEB_COMPONENT_DEV_PORT: "5174",
        });
    });

    it("can expose only the Vite app server while preserving the loopback proxy target", () => {
        const command = createPhysicalViteDevServerCommand("D:\\ドキュメント\\GitHub\\ehagaki", {
            host: "0.0.0.0",
            appPort: 5173,
            webComponentPort: 5174,
        });

        expect(command.args).toContain("0.0.0.0");
        expect(command.environment).toMatchObject({
            EHAGAKI_WEB_COMPONENT_DEV_PROXY: "true",
            EHAGAKI_WEB_COMPONENT_DEV_PORT: "5174",
        });
    });
});
