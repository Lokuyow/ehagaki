import { createWebComponentBuildWorkingDirectory } from "./webComponentBuildWorkingDirectory.mjs";
import { runWebComponentInitialBuild } from "./webComponentBuildRunner.mjs";
import { fileURLToPath } from "node:url";

const physicalRepositoryRoot = fileURLToPath(new URL("..", import.meta.url));

let workingDirectoryHandle;
let activeChild;
let shuttingDown = false;

function waitForExit(child) {
    return new Promise((resolve) => child.once("exit", resolve));
}

async function shutdown(exitCode) {
    if (shuttingDown) return;
    shuttingDown = true;
    try {
        if (activeChild?.exitCode === null) {
            const exited = waitForExit(activeChild);
            activeChild.kill("SIGTERM");
            await exited;
        }
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        exitCode = 1;
    }
    try {
        await workingDirectoryHandle?.cleanup();
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        exitCode = 1;
    }
    process.exitCode = exitCode;
}

const shutdownSignals = ["SIGINT", "SIGTERM", "SIGHUP"];
if (process.platform === "win32") shutdownSignals.push("SIGBREAK");

for (const signal of shutdownSignals) {
    process.once(signal, () => {
        void shutdown(0).catch((error) => {
            console.error(error instanceof Error ? error.message : error);
            process.exitCode = 1;
        });
    });
}

try {
    workingDirectoryHandle = await createWebComponentBuildWorkingDirectory({ physicalRepositoryRoot });
    await runWebComponentInitialBuild(workingDirectoryHandle.workingDirectory, {
        onChildStarted: (child) => {
            activeChild = child;
        },
    });
    await shutdown(0);
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    await shutdown(1);
}
