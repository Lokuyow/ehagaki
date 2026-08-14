import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const webComponentDirectory = resolve(repositoryRoot, "dist-web-component");
const viteCli = resolve(repositoryRoot, "node_modules", "vite", "bin", "vite.js");
const host = "127.0.0.1";
const appPort = parsePort(process.env.EHAGAKI_WEB_COMPONENT_DEV_APP_PORT, 5173, "EHAGAKI_WEB_COMPONENT_DEV_APP_PORT");
const webComponentPort = parsePort(process.env.EHAGAKI_WEB_COMPONENT_DEV_PORT, 5174, "EHAGAKI_WEB_COMPONENT_DEV_PORT");

let webComponentServer;
let watcher;
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
    const pathname = decodeURIComponent(new URL(requestUrl ?? "/", `http://${host}`).pathname);
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
        server.listen(webComponentPort, host, () => {
            server.off("error", reject);
            resolveServer(server);
        });
    });
}

function runNode(args, environment = process.env) {
    return spawn(process.execPath, args, {
        cwd: repositoryRoot,
        env: environment,
        stdio: "inherit",
        windowsHide: true,
    });
}

function waitForExit(child) {
    return new Promise((resolveExit, reject) => {
        child.once("error", reject);
        child.once("exit", (code, signal) => resolveExit({ code, signal }));
    });
}

async function runInitialBuild() {
    for (const [label, args] of [
        ["Web Component build", [viteCli, "build", "--config", "vite.web-component.config.ts"]],
        ["Web Component build verification", ["scripts/verifyWebComponentBuild.mjs"]],
    ]) {
        const build = runNode(args);
        const { code, signal } = await waitForExit(build);
        if (code !== 0) {
            throw new Error(`${label} failed (${signal ?? code ?? "unknown"}).`);
        }
    }
}

function watchChild(label, child) {
    child.once("exit", (code, signal) => {
        if (!shuttingDown) {
            console.error(`${label} stopped unexpectedly (${signal ?? code ?? "unknown"}).`);
            void shutdown(code ?? 1);
        }
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
    await Promise.all([
        terminateChild(watcher),
        terminateChild(viteServer),
        closeServer(webComponentServer),
    ]);
    process.exitCode = exitCode;
}

async function main() {
    if (appPort === webComponentPort) {
        throw new Error("The app and Web Component dev server ports must be different.");
    }

    console.log("Building the Web Component for local development...");
    await runInitialBuild();

    webComponentServer = await startWebComponentServer();
    watcher = runNode([viteCli, "build", "--config", "vite.web-component.config.ts", "--watch"]);
    viteServer = runNode([viteCli, "--host", host, "--port", String(appPort), "--strictPort"], {
        ...process.env,
        EHAGAKI_WEB_COMPONENT_DEV_PROXY: "true",
        EHAGAKI_WEB_COMPONENT_DEV_PORT: String(webComponentPort),
    });
    watchChild("Web Component watcher", watcher);
    watchChild("Vite dev server", viteServer);

    console.log(`Web Component sample: http://localhost:${appPort}/ehagaki/web-component-parent-client-example.html`);
}

for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => {
        void shutdown(0);
    });
}

main().catch(async (error) => {
    console.error(error instanceof Error ? error.message : error);
    await shutdown(1);
});
