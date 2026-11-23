import { describe, expect, it, vi } from "vitest";

import { createPostHistoryProfileSyncCoordinator } from "../../lib/postHistoryProfileSync";
import { createProfileMentionPreviewProfiles } from "../../lib/profileMentionPreviewProfiles.svelte";
import type { ProfileData } from "../../lib/types";

const pubkey = "a".repeat(64);
const otherPubkey = "b".repeat(64);

function createProfile(name: string): ProfileData {
    return { name, displayName: name, picture: `https://example.com/${name}.png`, npub: "", nprofile: "" };
}

async function flush(): Promise<void> {
    for (let i = 0; i < 8; i++) await Promise.resolve();
}

function setup(options: {
    getProfile: (pubkey: string, options: { rxNostr?: unknown; forceRefresh?: boolean }) => Promise<ProfileData | null>;
    limit?: number;
}) {
    const state = { rxNostr: { tag: "rx" } as unknown, cacheEntries: new Map<string, ProfileData>() };
    const getProfile = vi.fn(options.getProfile);
    const getCachedProfiles = vi.fn(async () => ({}));
    const profileSync = createPostHistoryProfileSyncCoordinator({
        getShow: () => true,
        getRxNostr: () => state.rxNostr as never,
        profileCache: { getProfile: getProfile as never, subscribe: () => () => undefined },
    });
    const previews = createProfileMentionPreviewProfiles({
        getRxNostr: () => state.rxNostr as never,
        profileSync,
        limit: options.limit,
        profileCache: {
            getCachedProfiles: getCachedProfiles as never,
            getReactiveEntry: (key: string) => {
                const profile = state.cacheEntries.get(key);
                return profile ? { profile } as never : null;
            },
        },
    });
    return { state, getProfile, getCachedProfiles, previews };
}

describe("profileMentionPreviewProfiles", () => {
    it("bulk-reads new mentions once, then fetches with relay hints and keeps the profile", async () => {
        const { getProfile, getCachedProfiles, previews } = setup({ getProfile: async () => createProfile("Alice") });

        previews.load([{ pubkey, relayHints: ["wss://hint.example.com"] }, { pubkey: otherPubkey, relayHints: [] }]);
        await flush();

        expect(getCachedProfiles).toHaveBeenCalledOnce();
        expect(getCachedProfiles).toHaveBeenCalledWith([pubkey, otherPubkey]);
        expect(getProfile).toHaveBeenCalledWith(pubkey, expect.objectContaining({
            rxNostr: { tag: "rx" },
            additionalRelays: ["wss://hint.example.com/"],
        }));
        expect(previews.read(pubkey)).toMatchObject({ displayName: "Alice" });
        previews.dispose();
    });

    it("prefers a newer shared-cache profile over its own copy", async () => {
        const { state, previews } = setup({ getProfile: async () => createProfile("Old") });
        previews.load([{ pubkey, relayHints: [] }]);
        await flush();
        expect(previews.read(pubkey)).toMatchObject({ displayName: "Old" });

        state.cacheEntries.set(pubkey, createProfile("New"));
        expect(previews.read(pubkey)).toMatchObject({ displayName: "New" });
        state.cacheEntries.delete(pubkey);
        expect(previews.read(pubkey)).toMatchObject({ displayName: "Old" });
        previews.dispose();
    });

    it("does not refetch a resolved pubkey for new relay hints or a runtime change", async () => {
        const { state, getProfile, previews } = setup({ getProfile: async () => createProfile("Alice") });
        previews.load([{ pubkey, relayHints: [] }]);
        await flush();

        previews.load([{ pubkey, relayHints: ["wss://other.example.com"] }]);
        state.rxNostr = { tag: "rx2" };
        previews.refresh();
        await flush();

        expect(getProfile).toHaveBeenCalledOnce();
        previews.dispose();
    });

    it("retries unresolved mentions after the relay runtime changes", async () => {
        const { state, getProfile, previews } = setup({
            getProfile: async (_pubkey, options) => options.rxNostr ? createProfile("Bob") : null,
        });
        state.rxNostr = undefined;

        previews.load([{ pubkey, relayHints: [] }]);
        await flush();
        expect(previews.read(pubkey)).toBeUndefined();

        state.rxNostr = { tag: "rx" };
        previews.refresh();
        await flush();
        expect(getProfile).toHaveBeenCalledTimes(2);
        expect(previews.read(pubkey)).toMatchObject({ displayName: "Bob" });
        previews.dispose();
    });

    it("forgets the oldest mentions beyond the limit and stops retrying them", async () => {
        const { state, getProfile, previews } = setup({ getProfile: async () => null, limit: 2 });
        const keys = ["1", "2", "3"].map(digit => digit.repeat(64));

        previews.load([{ pubkey: keys[0]!, relayHints: [] }, { pubkey: keys[1]!, relayHints: [] }]);
        await flush();
        previews.load([{ pubkey: keys[2]!, relayHints: [] }]);
        await flush();
        getProfile.mockClear();

        state.rxNostr = { tag: "rx2" };
        previews.refresh();
        await flush();
        expect(getProfile.mock.calls.map(([key]) => key).sort()).toEqual([keys[1], keys[2]]);
        previews.dispose();
    });
});
