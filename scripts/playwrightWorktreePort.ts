import path from 'node:path';

export const PLAYWRIGHT_HOST = '127.0.0.1';
export const PLAYWRIGHT_APP_BASE_PATH = '/ehagaki/';
export const PLAYWRIGHT_READY_PATH =
    '/ehagaki/post-history-dialog-playwright.html';
export const PLAYWRIGHT_PORT_ENV = 'EHAGAKI_E2E_PORT';
export const MIN_PLAYWRIGHT_PORT = 1_024;
export const MAX_PLAYWRIGHT_PORT = 65_535;

const AUTO_PORT_MIN = 45_000;
const AUTO_PORT_SPAN = 10_000;

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

export function normalizeWorktreeRoot(
    rootPath: string,
    platform: NodeJS.Platform = process.platform,
): string {
    if (!rootPath.trim()) {
        throw new Error('Playwright worktree root path must not be empty.');
    }

    const pathApi = platform === 'win32' ? path.win32 : path.posix;
    const normalized = pathApi.normalize(pathApi.resolve(rootPath));
    const root = pathApi.parse(normalized).root;
    const withoutTrailingSeparator =
        normalized.length > root.length
            ? normalized.replace(/[\\/]+$/, '')
            : normalized;

    return platform === 'win32'
        ? withoutTrailingSeparator.toLowerCase()
        : withoutTrailingSeparator;
}

export function hashWorktreeRoot(normalizedRoot: string): number {
    let hash = 2_166_136_261;

    for (let index = 0; index < normalizedRoot.length; index += 1) {
        hash ^= normalizedRoot.charCodeAt(index);
        hash = Math.imul(hash, 16_777_619);
    }

    return hash >>> 0;
}

export function derivePlaywrightPort(normalizedRoot: string): number {
    return AUTO_PORT_MIN + (hashWorktreeRoot(normalizedRoot) % AUTO_PORT_SPAN);
}

export interface ResolvePlaywrightPortOptions {
    rootPath: string;
    envPort?: string;
    platform?: NodeJS.Platform;
}

export function resolvePlaywrightPort({
    rootPath,
    envPort = process.env[PLAYWRIGHT_PORT_ENV],
    platform = process.platform,
}: ResolvePlaywrightPortOptions): number {
    if (envPort !== undefined) {
        return parsePlaywrightPort(envPort);
    }

    return derivePlaywrightPort(normalizeWorktreeRoot(rootPath, platform));
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
