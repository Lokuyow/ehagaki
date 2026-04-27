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
const cacheReadPromises = new Map<LoadKey, Promise<CustomEmojiItem[]>>();

function getCachedItems(loadKey: LoadKey): Promise<CustomEmojiItem[]> {
    const existing = cacheReadPromises.get(loadKey);
    if (existing) return existing;

    const promise = readCachedCustomEmojiItems(loadKey).finally(() => {
        cacheReadPromises.delete(loadKey);
    });
    cacheReadPromises.set(loadKey, promise);
    return promise;
}

async function applyCachedItems(loadKey: LoadKey): Promise<boolean> {
    const cachedItems = await getCachedItems(loadKey);
    if (activeLoadKey !== loadKey || cachedItems.length === 0) {
        return false;
    }

    items = cachedItems;
    error = null;
    lastLoadKey = loadKey;
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

        activeLoadKey = loadKey;
        try {
            await applyCachedItems(loadKey);
        } catch {
            // Cache preloading is best-effort.
        }
    },

    async load(params: { rxNostr?: RxNostr | null; pubkey?: string | null; force?: boolean }): Promise<void> {
        if (!params.rxNostr || !params.pubkey) {
            items = [];
            loading = false;
            error = null;
            lastLoadKey = null;
            lastFetchedLoadKey = null;
            activeLoadKey = null;
            return;
        }

        const loadKey = params.pubkey;
        activeLoadKey = loadKey;
        if (!params.force && lastFetchedLoadKey === loadKey && items.length > 0) {
            return;
        }

        const hasCachedItems = params.force
            ? false
            : (lastLoadKey === loadKey && items.length > 0) || await applyCachedItems(loadKey);

        loading = !hasCachedItems;
        error = null;
        lastLoadKey = loadKey;

        try {
            const nextItems = await fetchCustomEmojiList({
                rxNostr: params.rxNostr,
                pubkey: params.pubkey,
            });
            if (nextItems.length > 0 || !hasCachedItems) {
                items = nextItems;
                await writeCachedCustomEmojiItems(loadKey, nextItems);
                cacheCustomEmojiImages(nextItems.map((item) => item.src));
            }
            lastFetchedLoadKey = loadKey;
        } catch {
            error = "customEmoji.load_failed";
            if (!hasCachedItems) {
                items = [];
            }
        } finally {
            loading = false;
        }
    },

    reset(): void {
        items = [];
        loading = false;
        error = null;
        lastLoadKey = null;
        lastFetchedLoadKey = null;
        activeLoadKey = null;
        cacheReadPromises.clear();
    },
};
