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
let loadGeneration = 0;
const cacheReadPromises = new Map<LoadKey, Promise<CustomEmojiItem[]>>();

interface LoadScope {
    loadKey: LoadKey;
    generation: number;
}

function beginLoad(loadKey: LoadKey): LoadScope {
    activeLoadKey = loadKey;
    loadGeneration += 1;
    return { loadKey, generation: loadGeneration };
}

function isCurrentLoad(scope: LoadScope): boolean {
    return activeLoadKey === scope.loadKey && loadGeneration === scope.generation;
}

function clearState(): void {
    items = [];
    loading = false;
    error = null;
    lastLoadKey = null;
    lastFetchedLoadKey = null;
    activeLoadKey = null;
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

async function applyCachedItems(scope: LoadScope): Promise<boolean> {
    const cachedItems = await getCachedItems(scope.loadKey);
    if (!isCurrentLoad(scope) || cachedItems.length === 0) {
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

        const scope = beginLoad(loadKey);
        try {
            await applyCachedItems(scope);
        } catch {
            // Cache preloading is best-effort.
        }
    },

    async load(params: { rxNostr?: RxNostr | null; pubkey?: string | null; force?: boolean }): Promise<void> {
        if (!params.rxNostr || !params.pubkey) {
            loadGeneration += 1;
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
            : (lastLoadKey === loadKey && items.length > 0) || await applyCachedItems(scope);

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

    reset(): void {
        loadGeneration += 1;
        clearState();
        cacheReadPromises.clear();
    },
};
