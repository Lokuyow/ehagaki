import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createWebComponentBuildWorkingDirectory } from "./webComponentBuildWorkingDirectory.mjs";
import {
    createPhysicalViteDevServerCommand,
    runWebComponentInitialBuild,
    startNodeCommand,
    startHostOwnedLiteWebComponentBuild,
    startWebComponentBuild,
} from "./webComponentBuildRunner.mjs";
import {
    createLanSampleUrls,
    createSampleUrls,
    getLanIPv4Addresses,
    resolveWebComponentDevHosts,
} from "./webComponentDevServerConfig.mjs";

const physicalRepositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const webComponentDirectory = resolve(physicalRepositoryRoot, "dist-web-component");
const lanMode = parseArguments(process.argv.slice(2));
const { appHost, webComponentHost } = resolveWebComponentDevHosts(lanMode);
const appPort = parsePort(process.env.EHAGAKI_WEB_COMPONENT_DEV_APP_PORT, 5173, "EHAGAKI_WEB_COMPONENT_DEV_APP_PORT");
const webComponentPort = parsePort(process.env.EHAGAKI_WEB_COMPONENT_DEV_PORT, 5174, "EHAGAKI_WEB_COMPONENT_DEV_PORT");

let webComponentServer;
let webComponentBuildWorkingDirectory;
let initialBuild;
let watcher;
let liteWatcher;
let viteServer;
let shuttingDown = false;

function parsePort(value, fallback, variableName) {
    if (value === undefined) return fallback;
    if (!/^[0-9]+$/.test(value)) {
        throw new Error(`${variableName} must be a valid TCP port.`);
    }
    const port = Number(value);
    if (!Number.isSafeInteger(port) || port < 1024 || port > 65535) {
        throw new Error(`${variableName} must be a valid TCP port.`);
    }
    return port;
}

function parseArguments(args) {
    const unknownArgument = args.find((argument) => argument !== "--lan");
    if (unknownArgument) {
        throw new Error(`Unknown argument: ${unknownArgument}`);
    }
    return args.includes("--lan");
}

function contentType(filePath) {
    switch (extname(filePath)) {
        case ".js": return "text/javascript; charset=utf-8";
        case ".css": return "text/css; charset=utf-8";
        case ".json": return "application/json; charset=utf-8";
        case ".svg": return "image/svg+xml";
        case ".wasm": return "application/wasm";
        case ".png": return "image/png";
        case ".jpg":
        case ".jpeg": return "image/jpeg";
        case ".webp": return "image/webp";
        case ".ico": return "image/x-icon";
        default: return "application/octet-stream";
    }
}

function resolveAssetPath(requestUrl) {
    const pathname = decodeURIComponent(new URL(requestUrl ?? "/", `http://${webComponentHost}`).pathname);
    const filePath = resolve(webComponentDirectory, `.${pathname}`);
    const pathFromRoot = relative(webComponentDirectory, filePath);
    if (pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot)) {
        return null;
    }
    return filePath;
}

function startWebComponentServer() {
    return new Promise((resolveServer, reject) => {
        const server = createServer(async (request, response) => {
            if (request.method !== "GET" && request.method !== "HEAD") {
                response.writeHead(405, { Allow: "GET, HEAD" }).end();
                return;
            }

            let filePath;
            try {
                filePath = resolveAssetPath(request.url);
            } catch {
                response.writeHead(400).end();
                return;
            }
            if (!filePath) {
                response.writeHead(400).end();
                return;
            }

            try {
                const file = await stat(filePath);
                if (!file.isFile()) {
                    response.writeHead(404).end();
                    return;
                }
                response.writeHead(200, {
                    "Content-Length": file.size,
                    "Content-Type": contentType(filePath),
                    "Cache-Control": "no-store",
                });
                if (request.method === "HEAD") {
                    response.end();
                    return;
                }
                createReadStream(filePath).pipe(response);
            } catch {
                response.writeHead(404).end();
            }
        });
        server.once("error", reject);
        server.listen(webComponentPort, webComponentHost, () => {
            server.off("error", reject);
            resolveServer(server);
        });
    });
}

function watchChild(label, child) {
    let handled = false;
    const handleFailure = (detail) => {
        if (handled || shuttingDown) return;
        handled = true;
        console.error(`${label} stopped unexpectedly (${detail}).`);
        requestShutdown(1);
    };
    child.once("error", (error) => {
        handleFailure(error instanceof Error ? error.message : String(error));
    });
    child.once("exit", (code, signal) => {
        handleFailure(signal ?? code ?? "unknown");
    });
}

function requestShutdown(exitCode) {
    void shutdown(exitCode).catch((error) => {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
    });
}

function closeServer(server) {
    return new Promise((resolveClose) => {
        if (!server) {
            resolveClose();
            return;
        }
        server.close(() => resolveClose());
    });
}

function terminateChild(child) {
    return new Promise((resolveTerminate) => {
        if (!child?.pid || child.exitCode !== null) {
            resolveTerminate();
            return;
        }
        if (process.platform === "win32") {
            const taskkill = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
                stdio: "ignore",
                windowsHide: true,
            });
            taskkill.once("error", resolveTerminate);
            taskkill.once("exit", resolveTerminate);
            return;
        }
        child.once("exit", resolveTerminate);
        child.kill("SIGTERM");
    });
}

async function shutdown(exitCode) {
    if (shuttingDown) return;
    shuttingDown = true;
    const terminationResults = await Promise.allSettled([
        terminateChild(initialBuild),
        terminateChild(watcher),
        terminateChild(liteWatcher),
        terminateChild(viteServer),
        closeServer(webComponentServer),
    ]);
    for (const result of terminationResults) {
        if (result.status === "rejected") {
            console.error(result.reason instanceof Error ? result.reason.message : result.reason);
            exitCode = 1;
        }
    }
    try {
        await webComponentBuildWorkingDirectory?.cleanup();
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        exitCode = 1;
    }
    process.exitCode = exitCode;
}

async function main() {
    if (appPort === webComponentPort) {
        throw new Error("The app and Web Component dev server ports must be different.");
    }

    console.log("Building the Web Component for local development...");
    webComponentBuildWorkingDirectory = await createWebComponentBuildWorkingDirectory({ physicalRepositoryRoot });
    await runWebComponentInitialBuild(webComponentBuildWorkingDirectory.workingDirectory, {
        onChildStarted: (child) => {
            initialBuild = child;
        },
    });

    webComponentServer = await startWebComponentServer();
    watcher = startWebComponentBuild(webComponentBuildWorkingDirectory.workingDirectory, { watch: true });
    liteWatcher = startHostOwnedLiteWebComponentBuild(webComponentBuildWorkingDirectory.workingDirectory, { watch: true });
    console.log(`Vite dev server uses physical repository path ${physicalRepositoryRoot}`);
    const viteDevServerCommand = createPhysicalViteDevServerCommand(physicalRepositoryRoot, {
        host: appHost,
        appPort,
        webComponentPort,
    });
    viteServer = startNodeCommand(viteDevServerCommand, { environment: viteDevServerCommand.environment });
    watchChild("Web Component watcher", watcher);
    watchChild("Host-owned Composer Lite watcher", liteWatcher);
    watchChild("Vite dev server", viteServer);

    if (lanMode) {
        console.log("LAN mode enabled: the Vite development server is exposed to the trusted local network.");
        console.log("LAN mode uses HTTP. Secure-context-only browser APIs may be unavailable; use HTTPS for final production-path verification.");
        const lanUrls = createLanSampleUrls(appPort, getLanIPv4Addresses());
        if (lanUrls.length > 0) {
            for (const url of lanUrls) console.log(`Web Component sample (LAN): ${url}`);
        } else {
            console.log("No non-internal LAN IPv4 address was found; use Vite's Network URL or the PC's LAN IP.");
        }
    } else {
        for (const url of createSampleUrls(appPort, "localhost")) {
            console.log(`Web Component sample: ${url}`);
        }
    }
}

const shutdownSignals = ["SIGINT", "SIGTERM", "SIGHUP"];
if (process.platform === "win32") shutdownSignals.push("SIGBREAK");

for (const signal of shutdownSignals) {
    process.once(signal, () => {
        requestShutdown(0);
    });
}

main().catch(async (error) => {
    console.error(error instanceof Error ? error.message : error);
    await shutdown(1);
});
