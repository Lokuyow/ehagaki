import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CustomEmojiUsageItem } from "../../lib/customEmojiUsage";
import { customEmojiUsageStore } from "../../stores/customEmojiUsageStore.svelte";

function createUsageItem(shortcode: string, lastUsedAt = 1000): CustomEmojiUsageItem {
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

describe("customEmojiUsageStore", () => {
    beforeEach(() => {
        customEmojiUsageStore.reset();
        vi.clearAllMocks();
    });

    it("loads recent custom emoji items for the current pubkey", async () => {
        const items = [createUsageItem("blobcat")];
        const repository = {
            getUsageHistory: vi.fn().mockResolvedValue(items),
        };

        await customEmojiUsageStore.load({ pubkey: "pubkey", repository });

        expect(repository.getUsageHistory).toHaveBeenCalledWith("pubkey", 100);
        expect(customEmojiUsageStore.items).toEqual(items);
        expect(customEmojiUsageStore.loading).toBe(false);
    });

    it("clears items when pubkey is missing", async () => {
        const repository = {
            getUsageHistory: vi.fn().mockResolvedValue([createUsageItem("blobcat")]),
        };
        await customEmojiUsageStore.load({ pubkey: "pubkey", repository });

        await customEmojiUsageStore.load({ pubkey: null, repository });

        expect(customEmojiUsageStore.items).toEqual([]);
        expect(customEmojiUsageStore.loading).toBe(false);
    });

    it("records usage and replaces items from the repository result", async () => {
        const items = [createUsageItem("party", 2000)];
        const repository = {
            recordUse: vi.fn().mockResolvedValue(items),
        };

        await customEmojiUsageStore.recordUse({
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
        expect(customEmojiUsageStore.items).toEqual(items);
    });
});
