import { describe, expect, it, vi } from 'vitest';
import {
    HASHED_PRECACHE_ASSET_PATTERN,
    installServiceWorkerPrecache,
} from '../../lib/swPrecacheInstall';

type InstallOptions = Parameters<typeof installServiceWorkerPrecache>[0];
const base = 'https://example.com/ehagaki/';
const asset = (name: string) => `${base}assets/${name}-bridge-AbCd_123.js`;

function deferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (reason: unknown) => void;
    const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
}

function setup(entries: Array<[string, string]>, cached: string[] = []) {
    const responses = new Map(cached.map((url) => [url, new Response(url)]));
    const cache = {
        keys: vi.fn(async () => Array.from(responses.keys(), (url) => new Request(url))),
        match: vi.fn(async (request: RequestInfo | URL) => responses.get(
            request instanceof Request ? request.url : String(request),
        )?.clone()),
        put: vi.fn(async (request: RequestInfo | URL, response: Response) => {
            responses.set(request instanceof Request ? request.url : String(request), response.clone());
        }),
    };
    const handleAll = vi.fn<InstallOptions['controller']['strategy']['handleAll']>((options) => {
        const { request, params } = options as unknown as { request: Request; params: { cacheKey: string } };
        const response = new Response(request.url);
        return [Promise.resolve(response), cache.put(params.cacheKey, response.clone())];
    });
    const controller = {
        getURLsToCacheKeys: () => new Map(entries),
        getIntegrityForCacheKey: vi.fn((_key: string): string | undefined => undefined),
        strategy: { cacheName: 'existing-workbox-cache', handleAll },
    };
    const options: InstallOptions = {
        controller,
        cacheStorage: { open: vi.fn(async () => cache) },
        event: Object.assign(new Event('install'), { waitUntil: vi.fn() }),
    };
    return { options, cache, responses, controller, handleAll };
}

describe('service worker precache installation', () => {
    it('recognizes content hashes without treating static files as immutable', () => {
        for (const url of ['assets/App-bridge-AbCd_123.js', '/ehagaki/assets/webp_enc-AbCd_123.wasm']) {
            expect(HASHED_PRECACHE_ASSET_PATTERN.test(url)).toBe(true);
        }
        for (const url of ['index.html', 'icons/icon-AbCd_123.svg', 'assets/config.js', 'assets/config-v1.js']) {
            expect(HASHED_PRECACHE_ASSET_PATTERN.test(url)).toBe(false);
        }
    });

    it('checks cached keys once and does not fetch unchanged assets', async () => {
        const url = asset('stable');
        const state = setup([[url, url]], [url]);
        await installServiceWorkerPrecache(state.options);
        expect(state.cache.keys).toHaveBeenCalledOnce();
        expect(state.handleAll).not.toHaveBeenCalled();
        expect(state.cache.put).not.toHaveBeenCalled();
    });

    it('fetches only changed, added, and missing entries, retaining old revisions', async () => {
        const stable = asset('stable');
        const added = asset('added');
        const missing = asset('missing');
        const html = `${base}index.html`;
        const oldHtmlKey = `${html}?__WB_REVISION__=old`;
        const htmlKey = `${html}?__WB_REVISION__=new`;
        const state = setup([[stable, stable], [html, htmlKey], [added, added], [missing, missing]], [stable, oldHtmlKey]);
        await installServiceWorkerPrecache(state.options);
        const requests = state.handleAll.mock.calls.map(([options]) => (options as { request: Request }).request);
        expect(requests.map((request) => request.url)).toEqual([html, added, missing]);
        expect(requests.map((request) => request.cache)).toEqual(['reload', 'default', 'default']);
        expect(requests.every((request) => request.credentials === 'same-origin')).toBe(true);
        expect(state.responses.has(oldHtmlKey)).toBe(true);
    });

    it('copies only the identical hashed URL and keeps its old key until activation', async () => {
        const url = asset('stable');
        const oldKey = `${url}?__WB_REVISION__=old`;
        const state = setup([[url, url]], [oldKey]);
        await installServiceWorkerPrecache(state.options);
        expect(state.handleAll).not.toHaveBeenCalled();
        expect(state.cache.put).toHaveBeenCalledOnce();
        expect(await state.responses.get(url)?.text()).toBe(oldKey);
        expect(state.responses.has(oldKey)).toBe(true);
    });

    it('does not migrate other hashes, origins, query parameters, or unhashed URLs', async () => {
        const urls = [asset('current'), asset('foreign'), asset('query'), `${base}assets/config.js`];
        const state = setup(urls.map((url) => [url, url]), [
            `${asset('older')}?__WB_REVISION__=old`,
            `${asset('foreign').replace('example.com', 'other.example')}?__WB_REVISION__=old`,
            `${asset('query')}?__WB_REVISION__=old&other=1`,
            `${base}assets/config.js?__WB_REVISION__=old`,
        ]);
        await installServiceWorkerPrecache(state.options);
        expect(state.handleAll).toHaveBeenCalledTimes(4);
        expect(state.cache.match).not.toHaveBeenCalled();
    });

    it('fetches when a legacy response disappeared after the key snapshot', async () => {
        const url = asset('missing');
        const state = setup([[url, url]], [`${url}?__WB_REVISION__=old`]);
        state.cache.match.mockResolvedValue(undefined);
        await installServiceWorkerPrecache(state.options);
        expect(state.handleAll).toHaveBeenCalledOnce();
    });

    it('preserves integrity checks instead of migrating a response without verifying it', async () => {
        const url = asset('verified');
        const state = setup([[url, url]], [`${url}?__WB_REVISION__=old`]);
        state.controller.getIntegrityForCacheKey.mockReturnValue('sha256-example');
        await installServiceWorkerPrecache(state.options);
        expect(state.cache.match).not.toHaveBeenCalled();
        const options = state.handleAll.mock.calls[0][0] as unknown as { request: Request; params: { integrity: string } };
        expect(options.request.integrity).toBe('sha256-example');
        expect(options.params.integrity).toBe('sha256-example');
    });

    it('runs four jobs concurrently and waits for saves before starting more or completing', async () => {
        const urls = Array.from({ length: 6 }, (_, i) => asset(`asset${i}`));
        const state = setup(urls.map((url) => [url, url]));
        const saves = urls.map(() => deferred<void>());
        const firstFour = deferred<void>();
        const fifth = deferred<void>();
        let settled = false;
        state.handleAll.mockImplementation(() => {
            const index = state.handleAll.mock.calls.length - 1;
            if (index === 3) firstFour.resolve();
            if (index === 4) fifth.resolve();
            return [Promise.resolve(new Response('saved later')), saves[index].promise];
        });
        const installation = installServiceWorkerPrecache(state.options).then(() => { settled = true; });
        await firstFour.promise;
        expect(state.handleAll).toHaveBeenCalledTimes(4);
        expect(settled).toBe(false);
        saves[0].resolve();
        await fifth.promise;
        expect(state.handleAll).toHaveBeenCalledTimes(5);
        expect(settled).toBe(false);
        saves.forEach((save) => save.resolve());
        await installation;
        expect(state.handleAll).toHaveBeenCalledTimes(6);
        expect(settled).toBe(true);
    });

    it.each(['fetch', 'save'] as const)('drains pending jobs and fails installation on a %s error', async (failure) => {
        const urls = Array.from({ length: 8 }, (_, i) => asset(`asset${i}`));
        const oldKey = `${base}index.html?__WB_REVISION__=old`;
        const state = setup(urls.map((url) => [url, url]), [oldKey]);
        const responses = urls.map(() => deferred<Response>());
        const saves = urls.map(() => deferred<void>());
        const started = deferred<void>();
        state.handleAll.mockImplementation(() => {
            const index = state.handleAll.mock.calls.length - 1;
            if (index === 3) started.resolve();
            return [responses[index].promise, saves[index].promise];
        });
        let settled = false;
        const installation = installServiceWorkerPrecache(state.options);
        installation.then(() => { settled = true; }, () => { settled = true; });
        const error = new Error(`${failure} failed`);
        const rejected = expect(installation).rejects.toBe(error);
        await started.promise;
        if (failure === 'fetch') responses[0].reject(error);
        if (failure === 'save') saves[0].reject(error);
        // Stop scheduling as soon as either promise fails, while its companion
        // and the other in-flight jobs are still held.
        await Promise.allSettled([failure === 'fetch' ? responses[0].promise : saves[0].promise]);
        await Promise.resolve();
        expect(settled).toBe(false);
        for (let i = 1; i < 4; i++) {
            responses[i].resolve(new Response('downloaded'));
            saves[i].resolve();
        }
        await Promise.allSettled(saves.slice(1, 4).map((save) => save.promise));
        expect(state.handleAll).toHaveBeenCalledTimes(4);
        expect(settled).toBe(false);
        if (failure === 'fetch') saves[0].resolve();
        else responses[0].resolve(new Response('downloaded'));
        await rejected;
        expect(state.handleAll).toHaveBeenCalledTimes(4);
        expect(state.responses.has(oldKey)).toBe(true);
    });

    it('fails on a migration cache write error without deleting or redownloading the old response', async () => {
        const url = asset('stable');
        const oldKey = `${url}?__WB_REVISION__=old`;
        const state = setup([[url, url]], [oldKey]);
        const error = new Error('quota exceeded');
        state.cache.put.mockRejectedValue(error);
        await expect(installServiceWorkerPrecache(state.options)).rejects.toBe(error);
        expect(state.handleAll).not.toHaveBeenCalled();
        expect(state.responses.has(oldKey)).toBe(true);
    });
});
