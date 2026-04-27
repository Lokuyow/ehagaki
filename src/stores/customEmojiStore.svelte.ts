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

    async load(params: { rxNostr?: RxNostr | null; pubkey?: string | null; force?: boolean }): Promise<void> {
        if (!params.rxNostr || !params.pubkey) {
            items = [];
            loading = false;
            error = null;
            lastLoadKey = null;
            return;
        }

        const loadKey = params.pubkey;
        if (!params.force && lastLoadKey === loadKey && items.length > 0) {
            return;
        }

        const cachedItems = params.force ? [] : await readCachedCustomEmojiItems(loadKey);
        const hasCachedItems = cachedItems.length > 0;
        if (hasCachedItems) {
            items = cachedItems;
        }

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
    },
};
