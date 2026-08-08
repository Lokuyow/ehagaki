import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDeferred } from "../deferredTestUtils";

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

function createEmoji(shortcode: string, src: string, sortIndex = 0): CustomEmojiItem {
    return {
        identityKey: `${shortcode.toLowerCase()}|${src}|`,
        shortcode,
        shortcodeLower: shortcode.toLowerCase(),
        src,
        setAddress: null,
        sortIndex,
        sourceType: "kind10030",
        sourceAddress: null,
    };
}

describe("customEmojiStore", () => {
    beforeEach(() => {
        customEmojiStore.reset();
        vi.clearAllMocks();
        customEmojiMocks.writeCachedCustomEmojiItems.mockResolvedValue(undefined);
    });

    it("restores cached items before relay fetch finishes", async () => {
        const cachedItems: CustomEmojiItem[] = [
            createEmoji("cached", "https://example.com/cached.webp"),
        ];
        const fetchedItems: CustomEmojiItem[] = [
            createEmoji("fresh", "https://example.com/fresh.webp"),
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
            createEmoji("cached", "https://example.com/cached.webp"),
        ];
        customEmojiMocks.readCachedCustomEmojiItems.mockResolvedValue(cachedItems);

        await customEmojiStore.prefetchCache({ pubkey: "pubkey" });

        expect(customEmojiStore.items).toEqual(cachedItems);
        expect(customEmojiMocks.fetchCustomEmojiList).not.toHaveBeenCalled();
    });

    it("keeps prefetched items visible and still fetches fresh items on first open", async () => {
        const cachedItems: CustomEmojiItem[] = [
            createEmoji("cached", "https://example.com/cached.webp"),
        ];
        const fetchedItems: CustomEmojiItem[] = [
            createEmoji("fresh", "https://example.com/fresh.webp"),
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
            createEmoji("fresh", "https://example.com/fresh.webp"),
        ];
        customEmojiMocks.fetchCustomEmojiList.mockResolvedValue(fetchedItems);

        await customEmojiStore.load({ rxNostr: {} as never, pubkey: "pubkey", force: true });

        expect(customEmojiMocks.readCachedCustomEmojiItems).not.toHaveBeenCalled();
        expect(customEmojiStore.items).toEqual(fetchedItems);
    });

    it("writes fetched items to IndexedDB cache after a successful load", async () => {
        const fetchedItems: CustomEmojiItem[] = [
            createEmoji("party", "https://example.com/party.webp"),
        ];
        customEmojiMocks.readCachedCustomEmojiItems.mockResolvedValue([]);
        customEmojiMocks.fetchCustomEmojiList.mockResolvedValue(fetchedItems);

        await customEmojiStore.load({ rxNostr: {} as never, pubkey: "pubkey" });

        expect(customEmojiMocks.writeCachedCustomEmojiItems).toHaveBeenCalledWith("pubkey", fetchedItems);
    });

    it("clears cached items when relay fetch succeeds with no emoji", async () => {
        const cachedItems: CustomEmojiItem[] = [
            createEmoji("cached", "https://example.com/cached.webp"),
        ];
        customEmojiMocks.readCachedCustomEmojiItems.mockResolvedValue(cachedItems);
        customEmojiMocks.fetchCustomEmojiList.mockResolvedValue([]);

        await customEmojiStore.load({ rxNostr: {} as never, pubkey: "pubkey" });

        expect(customEmojiStore.items).toEqual([]);
        expect(customEmojiMocks.writeCachedCustomEmojiItems).toHaveBeenCalledWith("pubkey", []);
        expect(customEmojiMocks.cacheCustomEmojiImages).toHaveBeenCalledWith([]);
    });

    it("keeps B state and caches when an older A load succeeds after an account switch", async () => {
        const aFetch = createDeferred<CustomEmojiItem[]>();
        const bFetch = createDeferred<CustomEmojiItem[]>();
        const aItems = [createEmoji("a", "https://example.com/a.webp")];
        const bItems = [createEmoji("b", "https://example.com/b.webp")];
        customEmojiMocks.readCachedCustomEmojiItems.mockResolvedValue([]);
        customEmojiMocks.fetchCustomEmojiList.mockImplementation(({ pubkey }: { pubkey: string }) =>
            pubkey === "account-a" ? aFetch.promise : bFetch.promise,
        );

        const aLoad = customEmojiStore.load({ rxNostr: {} as never, pubkey: "account-a" });
        await vi.waitFor(() => expect(customEmojiMocks.fetchCustomEmojiList).toHaveBeenCalledTimes(1));
        const bLoad = customEmojiStore.load({ rxNostr: {} as never, pubkey: "account-b" });
        await vi.waitFor(() => expect(customEmojiMocks.fetchCustomEmojiList).toHaveBeenCalledTimes(2));

        bFetch.resolve(bItems);
        await bLoad;
        aFetch.resolve(aItems);
        await aLoad;

        expect(customEmojiStore.items).toEqual(bItems);
        expect(customEmojiStore.error).toBeNull();
        expect(customEmojiStore.loading).toBe(false);
        expect(customEmojiMocks.writeCachedCustomEmojiItems).toHaveBeenCalledTimes(1);
        expect(customEmojiMocks.writeCachedCustomEmojiItems).toHaveBeenCalledWith("account-b", bItems);
        expect(customEmojiMocks.cacheCustomEmojiImages).toHaveBeenCalledWith(["https://example.com/b.webp"]);

        await customEmojiStore.load({ rxNostr: {} as never, pubkey: "account-b" });
        expect(customEmojiMocks.fetchCustomEmojiList).toHaveBeenCalledTimes(2);
    });

    it("does not let an older failed load clear the newer account's loading state or set its error", async () => {
        const aFetch = createDeferred<CustomEmojiItem[]>();
        const bFetch = createDeferred<CustomEmojiItem[]>();
        customEmojiMocks.readCachedCustomEmojiItems.mockResolvedValue([]);
        customEmojiMocks.fetchCustomEmojiList.mockImplementation(({ pubkey }: { pubkey: string }) =>
            pubkey === "account-a" ? aFetch.promise : bFetch.promise,
        );

        const aLoad = customEmojiStore.load({ rxNostr: {} as never, pubkey: "account-a" });
        await vi.waitFor(() => expect(customEmojiMocks.fetchCustomEmojiList).toHaveBeenCalledTimes(1));
        const bLoad = customEmojiStore.load({ rxNostr: {} as never, pubkey: "account-b" });
        await vi.waitFor(() => expect(customEmojiMocks.fetchCustomEmojiList).toHaveBeenCalledTimes(2));

        aFetch.reject(new Error("A failed"));
        await aLoad;
        expect(customEmojiStore.loading).toBe(true);
        expect(customEmojiStore.error).toBeNull();

        bFetch.resolve([createEmoji("b", "https://example.com/b.webp")]);
        await bLoad;
        expect(customEmojiStore.error).toBeNull();
        expect(customEmojiStore.loading).toBe(false);
    });

    it("does not restore items or caches when reset invalidates a pending load", async () => {
        const fetch = createDeferred<CustomEmojiItem[]>();
        const items = [createEmoji("a", "https://example.com/a.webp")];
        customEmojiMocks.readCachedCustomEmojiItems.mockResolvedValue([]);
        customEmojiMocks.fetchCustomEmojiList.mockReturnValue(fetch.promise);

        const load = customEmojiStore.load({ rxNostr: {} as never, pubkey: "account-a" });
        await vi.waitFor(() => expect(customEmojiMocks.fetchCustomEmojiList).toHaveBeenCalledOnce());
        customEmojiStore.reset();
        fetch.resolve(items);
        await load;

        expect(customEmojiStore.items).toEqual([]);
        expect(customEmojiStore.error).toBeNull();
        expect(customEmojiStore.loading).toBe(false);
        expect(customEmojiMocks.writeCachedCustomEmojiItems).not.toHaveBeenCalled();
        expect(customEmojiMocks.cacheCustomEmojiImages).not.toHaveBeenCalled();
    });

    it("does not let an older same-account force reload overwrite the newer result or cache", async () => {
        const firstFetch = createDeferred<CustomEmojiItem[]>();
        const secondFetch = createDeferred<CustomEmojiItem[]>();
        const firstItems = [createEmoji("first", "https://example.com/first.webp")];
        const secondItems = [createEmoji("second", "https://example.com/second.webp")];
        customEmojiMocks.fetchCustomEmojiList
            .mockReturnValueOnce(firstFetch.promise)
            .mockReturnValueOnce(secondFetch.promise);

        const firstLoad = customEmojiStore.load({ rxNostr: {} as never, pubkey: "account-a", force: true });
        const secondLoad = customEmojiStore.load({ rxNostr: {} as never, pubkey: "account-a", force: true });
        secondFetch.resolve(secondItems);
        await secondLoad;
        firstFetch.resolve(firstItems);
        await firstLoad;

        expect(customEmojiStore.items).toEqual(secondItems);
        expect(customEmojiMocks.writeCachedCustomEmojiItems).toHaveBeenCalledTimes(1);
        expect(customEmojiMocks.writeCachedCustomEmojiItems).toHaveBeenCalledWith("account-a", secondItems);
    });
});
