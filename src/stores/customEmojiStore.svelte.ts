import type { RxNostr } from "rx-nostr";
import {
    cacheCustomEmojiImages,
    fetchCustomEmojiList,
    readCachedCustomEmojiItems,
    type CustomEmojiItem,
    writeCachedCustomEmojiItems,
} from "../lib/customEmoji";

type LoadKey = string;

let items = $state<CustomEmojiItem[]>([]);
let loading = $state(false);
let error = $state<string | null>(null);
let lastLoadKey = $state<LoadKey | null>(null);
let lastFetchedLoadKey: LoadKey | null = null;
let activeLoadKey: LoadKey | null = null;
let ownerEpoch = 0;
let loadGeneration = 0;
let prefetchGeneration = 0;
const cacheReadPromises = new Map<LoadKey, Promise<CustomEmojiItem[]>>();

interface LoadScope {
    loadKey: LoadKey;
    ownerEpoch: number;
    generation: number;
}

interface PrefetchScope extends LoadScope {
    foregroundGeneration: number;
}

function ensureOwner(loadKey: LoadKey): number {
    if (activeLoadKey !== loadKey) {
        activeLoadKey = loadKey;
        ownerEpoch += 1;
    }
    return ownerEpoch;
}

function beginLoad(loadKey: LoadKey): LoadScope {
    loadGeneration += 1;
    return {
        loadKey,
        ownerEpoch: ensureOwner(loadKey),
        generation: loadGeneration,
    };
}

function isCurrentLoad(scope: LoadScope): boolean {
    return activeLoadKey === scope.loadKey
        && ownerEpoch === scope.ownerEpoch
        && loadGeneration === scope.generation;
}

function beginPrefetch(loadKey: LoadKey): PrefetchScope {
    prefetchGeneration += 1;
    return {
        loadKey,
        ownerEpoch: ensureOwner(loadKey),
        generation: prefetchGeneration,
        foregroundGeneration: loadGeneration,
    };
}

function isCurrentPrefetch(scope: PrefetchScope): boolean {
    return activeLoadKey === scope.loadKey
        && ownerEpoch === scope.ownerEpoch
        && prefetchGeneration === scope.generation
        && loadGeneration === scope.foregroundGeneration;
}

function clearState(): void {
    items = [];
    loading = false;
    error = null;
    lastLoadKey = null;
    lastFetchedLoadKey = null;
    activeLoadKey = null;
}

function invalidatePendingLoads(): void {
    ownerEpoch += 1;
    loading = false;
}

function getCachedItems(loadKey: LoadKey): Promise<CustomEmojiItem[]> {
    const existing = cacheReadPromises.get(loadKey);
    if (existing) return existing;

    const promise = readCachedCustomEmojiItems(loadKey).finally(() => {
        cacheReadPromises.delete(loadKey);
    });
    cacheReadPromises.set(loadKey, promise);
    return promise;
}

async function applyCachedItems(
    scope: Pick<LoadScope, "loadKey">,
    isCurrent: () => boolean,
): Promise<boolean> {
    const cachedItems = await getCachedItems(scope.loadKey);
    if (!isCurrent() || cachedItems.length === 0) {
        return false;
    }

    items = cachedItems;
    error = null;
    lastLoadKey = scope.loadKey;
    return true;
}

export const customEmojiStore = {
    get items() {
        return items;
    },
    get loading() {
        return loading;
    },
    get error() {
        return error;
    },

    async prefetchCache(params: { pubkey?: string | null }): Promise<void> {
        if (!params.pubkey) return;

        const loadKey = params.pubkey;
        if (lastLoadKey === loadKey && items.length > 0) {
            return;
        }

        const scope = beginPrefetch(loadKey);
        try {
            if (loading && activeLoadKey === loadKey) return;
            await applyCachedItems(scope, () => isCurrentPrefetch(scope));
        } catch {
            // Cache preloading is best-effort.
        }
    },

    async load(params: { rxNostr?: RxNostr | null; pubkey?: string | null; force?: boolean }): Promise<void> {
        if (!params.rxNostr || !params.pubkey) {
            ownerEpoch += 1;
            clearState();
            return;
        }

        const loadKey = params.pubkey;
        const scope = beginLoad(loadKey);
        if (!params.force && lastFetchedLoadKey === loadKey && items.length > 0) {
            return;
        }

        const hasCachedItems = params.force
            ? false
            : (lastLoadKey === loadKey && items.length > 0)
                || await applyCachedItems(scope, () => isCurrentLoad(scope));

        if (!isCurrentLoad(scope)) {
            return;
        }

        loading = !hasCachedItems;
        error = null;
        lastLoadKey = loadKey;

        try {
            const nextItems = await fetchCustomEmojiList({
                rxNostr: params.rxNostr,
                pubkey: params.pubkey,
            });
            if (!isCurrentLoad(scope)) {
                return;
            }

            items = nextItems;
            await writeCachedCustomEmojiItems(scope.loadKey, nextItems);
            if (!isCurrentLoad(scope)) {
                return;
            }

            cacheCustomEmojiImages(nextItems.map((item) => item.src));
            lastFetchedLoadKey = scope.loadKey;
        } catch {
            if (!isCurrentLoad(scope)) {
                return;
            }

            error = "customEmoji.load_failed";
            if (!hasCachedItems) {
                items = [];
            }
        } finally {
            if (isCurrentLoad(scope)) {
                loading = false;
            }
        }
    },

    invalidatePendingLoads(): void {
        invalidatePendingLoads();
    },

    reset(): void {
        invalidatePendingLoads();
        clearState();
        cacheReadPromises.clear();
    },
};
