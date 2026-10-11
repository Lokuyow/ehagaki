import { defineConfig, devices } from "@playwright/test";
import { resolvePlaywrightPort } from "./scripts/playwrightWorktreePort";

const port = resolvePlaywrightPort({});
// The server command receives the same port as this config, also on Windows.
process.env.EHAGAKI_E2E_PORT = String(port);
export default defineConfig({
    testDir: "./src/test/e2e", testMatch: "localRelayLive.spec.ts",
    timeout: 45_000, workers: 1,
    use: { baseURL: `https://127.0.0.1:${port}/ehagaki/`, locale: "ja-JP",
        ignoreHTTPSErrors: true, trace: "off", serviceWorkers: "block" },
    webServer: { command: "node scripts/localRelayE2eServer.mjs",
        url: `https://127.0.0.1:${port}/ehagaki/`, ignoreHTTPSErrors: true,
        reuseExistingServer: false, timeout: 120_000 },
    projects: [{ name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } }],
});
