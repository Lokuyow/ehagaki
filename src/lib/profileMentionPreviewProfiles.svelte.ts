import type { RxNostr } from "rx-nostr";
import { SvelteMap } from "svelte/reactivity";

import { profileMetadataCache } from "./profileMetadataCache.svelte";
import type { ProfileMention } from "./profileMention";
import {
    createPostHistoryProfileSyncCoordinator,
    type PostHistoryProfileSyncCoordinator,
} from "./postHistoryProfileSync";
import type { ProfileData } from "./types";

interface ProfileMentionPreviewProfilesParams {
    getRxNostr: () => RxNostr | undefined;
    profileSync?: PostHistoryProfileSyncCoordinator;
}

/**
 * Keeps resolved profiles for mentions shown in read-only previews (post history, notifications).
 * The shared metadata cache garbage-collects its in-memory entries, so displayed mentions keep their
 * own reference instead of falling back to npub while still visible.
 */
export function createProfileMentionPreviewProfiles({
    getRxNostr,
    profileSync = createPostHistoryProfileSyncCoordinator({ getShow: () => true, getRxNostr }),
}: ProfileMentionPreviewProfilesParams) {
    const profiles = new SvelteMap<string, ProfileData>();
    const requested = new Map<string, string[]>();
    const unsubscribe = profileSync.subscribe((pubkey, profile) => {
        if (profiles.get(pubkey) !== profile) profiles.set(pubkey, profile);
    });

    return {
        read(pubkey: string): ProfileData | null | undefined {
            return profiles.get(pubkey) ?? profileMetadataCache.getReactiveEntry(pubkey)?.profile;
        },
        load(mentions: ProfileMention[]): void {
            for (const { pubkey, relayHints } of mentions) {
                requested.set(pubkey, [...new Set([...(requested.get(pubkey) ?? []), ...relayHints])]);
                profileSync.ensureProfile(pubkey, relayHints);
            }
        },
        /** Retries unresolved mentions after the relay runtime changes. */
        refresh(): void {
            profileSync.reset();
            for (const [pubkey, relayHints] of requested) {
                if (!profiles.has(pubkey)) profileSync.ensureProfile(pubkey, relayHints);
            }
        },
        dispose(): void {
            unsubscribe();
            profileSync.dispose();
            requested.clear();
        },
    };
}
