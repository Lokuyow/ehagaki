import type { PrecacheController } from 'workbox-precaching';

// Match Vite's content hashes, including workers and the fixed legacy assets.
// Workbox receives relative manifest URLs; migration checks absolute pathnames.
export const HASHED_PRECACHE_ASSET_PATTERN = /(?:^|\/)assets\/[^/]+-[A-Za-z0-9_-]{8}\.[A-Za-z0-9]+$/;

const INSTALL_CONCURRENCY = 4;
const REVISION_PARAMETER = '__WB_REVISION__';

type InstallController = Pick<PrecacheController, 'getURLsToCacheKeys' | 'getIntegrityForCacheKey'> & {
    strategy: Pick<PrecacheController['strategy'], 'cacheName' | 'handleAll'>;
};

export async function installServiceWorkerPrecache({
    controller,
    cacheStorage,
    event,
}: {
    controller: InstallController;
    cacheStorage: {
        open: (name: string) => Promise<Pick<Cache, 'keys' | 'match' | 'put'>>;
    };
    event: Parameters<PrecacheController['install']>[0];
}): Promise<void> {
    const cache = await cacheStorage.open(controller.strategy.cacheName);
    const cachedRequests = await cache.keys();
    const cachedKeys = new Set(cachedRequests.map((request) => request.url));
    const legacyKeys = new Map<string, string>();

    for (const request of cachedRequests) {
        const url = new URL(request.url);
        // Only the old Workbox revision parameter may differ from the new key.
        if (Array.from(url.searchParams).length === 1 && url.searchParams.get(REVISION_PARAMETER)) {
            url.searchParams.delete(REVISION_PARAMETER);
            legacyKeys.set(url.href, request.url);
        }
    }

    const missingEntries = Array.from(controller.getURLsToCacheKeys())
        .filter(([, cacheKey]) => !cachedKeys.has(cacheKey));
    let nextIndex = 0;
    let failed = false;

    const installNext = async () => {
        while (!failed && nextIndex < missingEntries.length) {
            const [url, cacheKey] = missingEntries[nextIndex++];
            try {
                const integrity = controller.getIntegrityForCacheKey(cacheKey);
                const legacyKey = cacheKey === url && !integrity
                    && HASHED_PRECACHE_ASSET_PATTERN.test(new URL(url).pathname)
                    ? legacyKeys.get(url)
                    : undefined;
                const legacyResponse = legacyKey ? await cache.match(legacyKey) : undefined;
                if (legacyResponse) {
                    // Keep the old key available to the active worker until activation.
                    // Consume the matched response directly; the stored old entry
                    // is independent, and an unused tee branch is unnecessary.
                    await cache.put(cacheKey, legacyResponse);
                    continue;
                }

                const request = new Request(url, {
                    integrity,
                    cache: cacheKey === url ? 'default' : 'reload',
                    credentials: 'same-origin',
                });
                const pending = controller.strategy.handleAll({
                    event,
                    request,
                    params: { cacheKey, integrity },
                });
                const results = await Promise.allSettled(pending.map((promise) => promise.catch((error) => {
                    failed = true;
                    throw error;
                })));
                // A response alone is insufficient: also wait for Workbox's cache writes.
                const rejection = results.find((result) => result.status === 'rejected');
                if (rejection?.status === 'rejected') throw rejection.reason;
            } catch (error) {
                failed = true;
                throw error;
            }
        }
    };

    // Drain in-flight work before rejecting, without starting more after a failure.
    const results = await Promise.allSettled(Array.from(
        { length: Math.min(INSTALL_CONCURRENCY, missingEntries.length) },
        installNext,
    ));
    const rejection = results.find((result) => result.status === 'rejected');
    if (rejection?.status === 'rejected') throw rejection.reason;
}
