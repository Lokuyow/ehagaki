import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RecentCustomEmojiItem } from "../../lib/recentCustomEmoji";
import { recentCustomEmojiStore } from "../../stores/recentCustomEmojiStore.svelte";

function createRecent(shortcode: string, lastUsedAt = 1000): RecentCustomEmojiItem {
    return {
        identityKey: `${shortcode}|https://example.com/${shortcode}.webp|`,
        shortcode,
        shortcodeLower: shortcode.toLowerCase(),
        src: `https://example.com/${shortcode}.webp`,
        setAddress: null,
        lastUsedAt,
        count: 1,
    };
}

describe("recentCustomEmojiStore", () => {
    beforeEach(() => {
        recentCustomEmojiStore.reset();
        vi.clearAllMocks();
    });

    it("loads recent custom emoji items for the current pubkey", async () => {
        const items = [createRecent("blobcat")];
        const repository = {
            getRecent: vi.fn().mockResolvedValue(items),
        };

        await recentCustomEmojiStore.load({ pubkey: "pubkey", repository });

        expect(repository.getRecent).toHaveBeenCalledWith("pubkey", 100);
        expect(recentCustomEmojiStore.items).toEqual(items);
        expect(recentCustomEmojiStore.loading).toBe(false);
    });

    it("clears items when pubkey is missing", async () => {
        const repository = {
            getRecent: vi.fn().mockResolvedValue([createRecent("blobcat")]),
        };
        await recentCustomEmojiStore.load({ pubkey: "pubkey", repository });

        await recentCustomEmojiStore.load({ pubkey: null, repository });

        expect(recentCustomEmojiStore.items).toEqual([]);
        expect(recentCustomEmojiStore.loading).toBe(false);
    });

    it("records usage and replaces items from the repository result", async () => {
        const items = [createRecent("party", 2000)];
        const repository = {
            recordUse: vi.fn().mockResolvedValue(items),
        };

        await recentCustomEmojiStore.recordUse({
            pubkey: "pubkey",
            emoji: {
                shortcode: "party",
                src: "https://example.com/party.webp",
                setAddress: "30030:pubkey:set",
            },
            repository,
        });

        expect(repository.recordUse).toHaveBeenCalledWith("pubkey", {
            shortcode: "party",
            src: "https://example.com/party.webp",
            setAddress: "30030:pubkey:set",
        });
        expect(recentCustomEmojiStore.items).toEqual(items);
    });
});
