import { beforeEach, describe, expect, it, vi } from "vitest";

const customEmojiMocks = vi.hoisted(() => ({
    cacheCustomEmojiImages: vi.fn(),
    fetchCustomEmojiList: vi.fn(),
    readCachedCustomEmojiItems: vi.fn(),
    writeCachedCustomEmojiItems: vi.fn(),
}));

vi.mock("../../lib/customEmoji", () => ({
    cacheCustomEmojiImages: customEmojiMocks.cacheCustomEmojiImages,
    fetchCustomEmojiList: customEmojiMocks.fetchCustomEmojiList,
    readCachedCustomEmojiItems: customEmojiMocks.readCachedCustomEmojiItems,
    writeCachedCustomEmojiItems: customEmojiMocks.writeCachedCustomEmojiItems,
}));

import { customEmojiStore } from "../../stores/customEmojiStore.svelte";
import type { CustomEmojiItem } from "../../lib/customEmoji";

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((promiseResolve, promiseReject) => {
        resolve = promiseResolve;
        reject = promiseReject;
    });

    return { promise, resolve, reject };
}

describe("customEmojiStore", () => {
    beforeEach(() => {
        customEmojiStore.reset();
        vi.clearAllMocks();
        customEmojiMocks.writeCachedCustomEmojiItems.mockResolvedValue(undefined);
    });

    it("restores cached items before relay fetch finishes", async () => {
        const cachedItems: CustomEmojiItem[] = [
            { shortcode: "cached", src: "https://example.com/cached.webp" },
        ];
        const fetchedItems: CustomEmojiItem[] = [
            { shortcode: "fresh", src: "https://example.com/fresh.webp" },
        ];
        const fetchDeferred = createDeferred<CustomEmojiItem[]>();
        customEmojiMocks.readCachedCustomEmojiItems.mockResolvedValue(cachedItems);
        customEmojiMocks.fetchCustomEmojiList.mockReturnValue(fetchDeferred.promise);

        const loadPromise = customEmojiStore.load({ rxNostr: {} as never, pubkey: "pubkey" });

        await vi.waitFor(() => {
            expect(customEmojiMocks.fetchCustomEmojiList).toHaveBeenCalled();
        });
        expect(customEmojiStore.items).toEqual(cachedItems);

        fetchDeferred.resolve(fetchedItems);
        await loadPromise;

        expect(customEmojiStore.items).toEqual(fetchedItems);
        expect(customEmojiMocks.writeCachedCustomEmojiItems).toHaveBeenCalledWith("pubkey", fetchedItems);
        expect(customEmojiMocks.cacheCustomEmojiImages).toHaveBeenCalledWith(["https://example.com/fresh.webp"]);
    });

    it("prefetches cached items before the picker opens", async () => {
        const cachedItems: CustomEmojiItem[] = [
            { shortcode: "cached", src: "https://example.com/cached.webp" },
        ];
        customEmojiMocks.readCachedCustomEmojiItems.mockResolvedValue(cachedItems);

        await customEmojiStore.prefetchCache({ pubkey: "pubkey" });

        expect(customEmojiStore.items).toEqual(cachedItems);
        expect(customEmojiMocks.fetchCustomEmojiList).not.toHaveBeenCalled();
    });

    it("keeps prefetched items visible and still fetches fresh items on first open", async () => {
        const cachedItems: CustomEmojiItem[] = [
            { shortcode: "cached", src: "https://example.com/cached.webp" },
        ];
        const fetchedItems: CustomEmojiItem[] = [
            { shortcode: "fresh", src: "https://example.com/fresh.webp" },
        ];
        customEmojiMocks.readCachedCustomEmojiItems.mockResolvedValue(cachedItems);
        customEmojiMocks.fetchCustomEmojiList.mockResolvedValue(fetchedItems);

        await customEmojiStore.prefetchCache({ pubkey: "pubkey" });
        await customEmojiStore.load({ rxNostr: {} as never, pubkey: "pubkey" });

        expect(customEmojiMocks.readCachedCustomEmojiItems).toHaveBeenCalledTimes(1);
        expect(customEmojiMocks.fetchCustomEmojiList).toHaveBeenCalled();
        expect(customEmojiStore.items).toEqual(fetchedItems);
    });

    it("does not read IndexedDB cache when force loading", async () => {
        const fetchedItems: CustomEmojiItem[] = [
            { shortcode: "fresh", src: "https://example.com/fresh.webp" },
        ];
        customEmojiMocks.fetchCustomEmojiList.mockResolvedValue(fetchedItems);

        await customEmojiStore.load({ rxNostr: {} as never, pubkey: "pubkey", force: true });

        expect(customEmojiMocks.readCachedCustomEmojiItems).not.toHaveBeenCalled();
        expect(customEmojiStore.items).toEqual(fetchedItems);
    });

    it("writes fetched items to IndexedDB cache after a successful load", async () => {
        const fetchedItems: CustomEmojiItem[] = [
            { shortcode: "party", src: "https://example.com/party.webp" },
        ];
        customEmojiMocks.readCachedCustomEmojiItems.mockResolvedValue([]);
        customEmojiMocks.fetchCustomEmojiList.mockResolvedValue(fetchedItems);

        await customEmojiStore.load({ rxNostr: {} as never, pubkey: "pubkey" });

        expect(customEmojiMocks.writeCachedCustomEmojiItems).toHaveBeenCalledWith("pubkey", fetchedItems);
    });
});
