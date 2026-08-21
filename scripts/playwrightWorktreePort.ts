import { randomInt } from 'node:crypto';

export const PLAYWRIGHT_HOST = '127.0.0.1';
export const PLAYWRIGHT_APP_BASE_PATH = '/ehagaki/';
export const PLAYWRIGHT_READY_PATH =
    '/ehagaki/post-history-dialog-playwright.html';
export const PLAYWRIGHT_PORT_ENV = 'EHAGAKI_E2E_PORT';
const PLAYWRIGHT_AUTO_PORT_ENV = 'EHAGAKI_E2E_AUTO_PORT';
export const MIN_PLAYWRIGHT_PORT = 1_024;
export const MAX_PLAYWRIGHT_PORT = 65_535;

export const AUTO_PORT_MIN = 45_000;
export const AUTO_PORT_MAX_EXCLUSIVE = 55_000;

export function parsePlaywrightPort(value: string): number {
    const trimmed = value.trim();

    if (!/^[0-9]+$/.test(trimmed)) {
        throw new Error(
            `${PLAYWRIGHT_PORT_ENV} must be a decimal integer from ${MIN_PLAYWRIGHT_PORT} to ${MAX_PLAYWRIGHT_PORT}.`,
        );
    }

    const port = Number(trimmed);
    if (
        !Number.isSafeInteger(port) ||
        port < MIN_PLAYWRIGHT_PORT ||
        port > MAX_PLAYWRIGHT_PORT
    ) {
        throw new Error(
            `${PLAYWRIGHT_PORT_ENV} must be a decimal integer from ${MIN_PLAYWRIGHT_PORT} to ${MAX_PLAYWRIGHT_PORT}.`,
        );
    }

    return port;
}

export function generatePlaywrightPort(
    portSource: () => number = () =>
        randomInt(AUTO_PORT_MIN, AUTO_PORT_MAX_EXCLUSIVE),
): number {
    const port = portSource();
    if (
        !Number.isSafeInteger(port) ||
        port < AUTO_PORT_MIN ||
        port >= AUTO_PORT_MAX_EXCLUSIVE
    ) {
        throw new Error(
            `Generated Playwright port must be an integer from ${AUTO_PORT_MIN} to ${AUTO_PORT_MAX_EXCLUSIVE - 1}.`,
        );
    }

    return port;
}

export interface ResolvePlaywrightPortOptions {
    envPort?: string;
    portSource?: () => number;
}

export function resolvePlaywrightPort({
    envPort = process.env[PLAYWRIGHT_PORT_ENV],
    portSource,
}: ResolvePlaywrightPortOptions): number {
    if (envPort !== undefined) {
        return parsePlaywrightPort(envPort);
    }

    const existingAutoPort = process.env[PLAYWRIGHT_AUTO_PORT_ENV];
    if (existingAutoPort !== undefined) {
        return parsePlaywrightPort(existingAutoPort);
    }

    const generatedPort = generatePlaywrightPort(portSource);
    process.env[PLAYWRIGHT_AUTO_PORT_ENV] = String(generatedPort);
    return generatedPort;
}

export interface PlaywrightEndpoints {
    origin: string;
    appBaseURL: string;
    readyURL: string;
}

export function buildPlaywrightEndpoints(port: number): PlaywrightEndpoints {
    const origin = `http://${PLAYWRIGHT_HOST}:${port}`;

    return {
        origin,
        appBaseURL: `${origin}${PLAYWRIGHT_APP_BASE_PATH}`,
        readyURL: `${origin}${PLAYWRIGHT_READY_PATH}`,
    };
}

export function buildPlaywrightViteCommand(port: number): string {
    return `npx vite --host ${PLAYWRIGHT_HOST} --port ${port} --strictPort`;
}
