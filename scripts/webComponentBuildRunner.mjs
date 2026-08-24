import { spawn } from "node:child_process";
import { resolve } from "node:path";

/**
 * @typedef {object} NodeCommand
 * @property {string} command
 * @property {string[]} args
 * @property {string} cwd
 */

/** @typedef {{ watch?: boolean }} WebComponentBuildOptions */

/**
 * @typedef {object} StartNodeCommandOptions
 * @property {NodeJS.ProcessEnv} [environment]
 * @property {import("node:child_process").StdioOptions} [stdio]
 */

/**
 * @typedef {object} PhysicalViteDevServerOptions
 * @property {string} host
 * @property {number} appPort
 * @property {number} webComponentPort
 * @property {NodeJS.ProcessEnv} [environment]
 */

/** @param {string} workingDirectory @param {WebComponentBuildOptions} [options] @returns {NodeCommand} */
export function createWebComponentBuildCommand(workingDirectory, { watch = false } = {}) {
    const viteCli = resolve(workingDirectory, "node_modules", "vite", "bin", "vite.js");
    return {
        command: process.execPath,
        args: [viteCli, "build", "--config", "vite.web-component.config.ts", ...(watch ? ["--watch"] : [])],
        cwd: workingDirectory,
    };
}

/** @param {string} workingDirectory @returns {NodeCommand} */
export function createHostOwnedLiteWebComponentBuildCommand(workingDirectory) {
    const viteCli = resolve(workingDirectory, "node_modules", "vite", "bin", "vite.js");
    return {
        command: process.execPath,
        args: [viteCli, "build", "--config", "vite.web-component.config.ts", "--mode", "host-owned-lite"],
        cwd: workingDirectory,
    };
}

/** @param {string} physicalRepositoryRoot @param {PhysicalViteDevServerOptions} options */
export function createPhysicalViteDevServerCommand(physicalRepositoryRoot, {
    host,
    appPort,
    webComponentPort,
    environment = process.env,
}) {
    return {
        command: process.execPath,
        args: [
            resolve(physicalRepositoryRoot, "node_modules", "vite", "bin", "vite.js"),
            "--host",
            host,
            "--port",
            String(appPort),
            "--strictPort",
        ],
        cwd: physicalRepositoryRoot,
        environment: {
            ...environment,
            EHAGAKI_WEB_COMPONENT_DEV_PROXY: "true",
            EHAGAKI_WEB_COMPONENT_DEV_PORT: String(webComponentPort),
        },
    };
}

/** @param {string} workingDirectory @returns {NodeCommand} */
function createWebComponentBuildVerificationCommand(workingDirectory) {
    return {
        command: process.execPath,
        args: [resolve(workingDirectory, "scripts", "verifyWebComponentBuild.mjs")],
        cwd: workingDirectory,
    };
}

/** @param {NodeCommand} command @param {StartNodeCommandOptions} [options] */
export function startNodeCommand(command, { environment = process.env, stdio = "inherit" } = {}) {
    return spawn(command.command, command.args, {
        cwd: command.cwd,
        env: environment,
        stdio,
        windowsHide: true,
    });
}

/** @param {string} workingDirectory @param {WebComponentBuildOptions & StartNodeCommandOptions} [options] */
export function startWebComponentBuild(workingDirectory, options) {
    return startNodeCommand(createWebComponentBuildCommand(workingDirectory, options), options);
}

/** @param {string} label @param {import("node:child_process").ChildProcess} child @returns {Promise<void>} */
function waitForSuccessfulExit(label, child) {
    return new Promise((resolveExit, reject) => {
        child.once("error", reject);
        child.once("exit", (code, signal) => {
            if (code === 0) {
                resolveExit();
                return;
            }
            reject(new Error(`${label} failed (${signal ?? code ?? "unknown"}).`));
        });
    });
}

/**
 * @param {string} workingDirectory
 * @param {{ onChildStarted?: (child: import("node:child_process").ChildProcess | undefined) => void }} [options]
 */
export async function runWebComponentInitialBuild(workingDirectory, { onChildStarted } = {}) {
    /** @type {[string, NodeCommand][]} */
    const commands = [
        ["Web Component build", createWebComponentBuildCommand(workingDirectory)],
        ["Host-owned Composer Lite build", createHostOwnedLiteWebComponentBuildCommand(workingDirectory)],
        ["Web Component build verification", createWebComponentBuildVerificationCommand(workingDirectory)],
    ];
    for (const [label, command] of commands) {
        const child = startNodeCommand(command);
        onChildStarted?.(child);
        try {
            await waitForSuccessfulExit(label, child);
        } finally {
            onChildStarted?.(undefined);
        }
    }
}
