import { describe, expect, it, vi } from "vitest";

import { createPostHistoryProfileSyncCoordinator } from "../../lib/postHistoryProfileSync";
import { createProfileMentionPreviewProfiles } from "../../lib/profileMentionPreviewProfiles.svelte";
import type { ProfileData } from "../../lib/types";

const pubkey = "a".repeat(64);

function createProfile(name: string): ProfileData {
    return { name, displayName: name, picture: `https://example.com/${name}.png`, npub: "", nprofile: "" };
}

async function flush(): Promise<void> {
    for (let i = 0; i < 4; i++) await Promise.resolve();
}

describe("profileMentionPreviewProfiles", () => {
    it("fetches mentions with relay hints and keeps the resolved profile", async () => {
        let rxNostr: unknown = { tag: "rx" };
        const getProfile = vi.fn().mockResolvedValue(createProfile("Alice"));
        const profileSync = createPostHistoryProfileSyncCoordinator({
            getShow: () => true,
            getRxNostr: () => rxNostr as never,
            profileCache: { getProfile, subscribe: () => () => undefined },
        });
        const previews = createProfileMentionPreviewProfiles({ getRxNostr: () => rxNostr as never, profileSync });

        previews.load([{ pubkey, relayHints: ["wss://hint.example.com"] }]);
        await flush();

        expect(getProfile).toHaveBeenCalledWith(pubkey, expect.objectContaining({
            rxNostr: { tag: "rx" },
            additionalRelays: ["wss://hint.example.com/"],
        }));
        expect(previews.read(pubkey)).toMatchObject({ displayName: "Alice" });

        rxNostr = { tag: "rx2" };
        previews.refresh();
        expect(getProfile).toHaveBeenCalledOnce();
        expect(previews.read(pubkey)).toMatchObject({ displayName: "Alice" });
        previews.dispose();
    });

    it("retries unresolved mentions after the relay runtime changes", async () => {
        let rxNostr: unknown;
        const getProfile = vi.fn(async (_pubkey: string, options: { rxNostr?: unknown }) =>
            options.rxNostr ? createProfile("Bob") : null);
        const profileSync = createPostHistoryProfileSyncCoordinator({
            getShow: () => true,
            getRxNostr: () => rxNostr as never,
            profileCache: { getProfile, subscribe: () => () => undefined },
        });
        const previews = createProfileMentionPreviewProfiles({ getRxNostr: () => rxNostr as never, profileSync });

        previews.load([{ pubkey, relayHints: [] }]);
        await flush();
        expect(previews.read(pubkey)).toBeUndefined();

        rxNostr = { tag: "rx" };
        previews.refresh();
        await flush();
        expect(getProfile).toHaveBeenCalledTimes(2);
        expect(previews.read(pubkey)).toMatchObject({ displayName: "Bob" });
        previews.dispose();
    });
});
