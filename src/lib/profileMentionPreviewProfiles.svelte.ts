import type { RxNostr } from "rx-nostr";
import { SvelteMap } from "svelte/reactivity";

import { profileMetadataCache } from "./profileMetadataCache.svelte";
import type { ProfileMention } from "./profileMention";
import {
    createPostHistoryProfileSyncCoordinator,
    type PostHistoryProfileSyncCoordinator,
} from "./postHistoryProfileSync";
import type { ProfileData } from "./types";

/** Upper bound on remembered mention pubkeys; older ones are released first. */
export const PROFILE_MENTION_PREVIEW_LIMIT = 500;

interface ProfileMentionPreviewProfilesParams {
    getRxNostr: () => RxNostr | undefined;
    profileSync?: PostHistoryProfileSyncCoordinator;
    profileCache?: Pick<typeof profileMetadataCache, "getCachedProfiles" | "getReactiveEntry">;
    limit?: number;
}

/**
 * Keeps resolved profiles for mentions shown in read-only previews (post history, notifications).
 * The shared metadata cache garbage-collects its in-memory entries, so displayed mentions keep their
 * own copy as a fallback instead of falling back to npub while still visible.
 */
export function createProfileMentionPreviewProfiles({
    getRxNostr,
    profileSync = createPostHistoryProfileSyncCoordinator({ getShow: () => true, getRxNostr }),
    profileCache = profileMetadataCache,
    limit = PROFILE_MENTION_PREVIEW_LIMIT,
}: ProfileMentionPreviewProfilesParams) {
    const profiles = new SvelteMap<string, ProfileData>();
    // Insertion order doubles as recency for eviction.
    const requested = new Map<string, string[]>();
    let disposed = false;
    const unsubscribe = profileSync.subscribe((pubkey, profile) => {
        if (requested.has(pubkey) && profiles.get(pubkey) !== profile) profiles.set(pubkey, profile);
    });

    const ensureUnresolved = (pubkeys: Iterable<string>): void => {
        for (const pubkey of pubkeys) {
            const relayHints = requested.get(pubkey);
            // A resolved profile keeps updating through the shared cache; skipping it here avoids
            // force-refreshing the same pubkey whenever another post carries different relay hints.
            if (relayHints && !profiles.has(pubkey)) profileSync.ensureProfile(pubkey, relayHints);
        }
    };

    const evictOverflow = (): boolean => {
        if (requested.size <= limit) return false;
        for (const pubkey of requested.keys()) {
            if (requested.size <= limit) break;
            requested.delete(pubkey);
            profiles.delete(pubkey);
        }
        return true;
    };

    const restart = (): void => {
        profileSync.reset();
        ensureUnresolved(requested.keys());
    };

    return {
        read(pubkey: string): ProfileData | null | undefined {
            return profileCache.getReactiveEntry(pubkey)?.profile ?? profiles.get(pubkey);
        },
        load(mentions: ProfileMention[]): void {
            if (disposed) return;
            const added: string[] = [];
            const widened = new Set<string>();
            for (const { pubkey, relayHints } of mentions) {
                const known = requested.get(pubkey);
                const merged = known ? [...new Set([...known, ...relayHints])] : [...relayHints];
                requested.delete(pubkey);
                requested.set(pubkey, merged);
                if (!known) added.push(pubkey);
                else if (merged.length > known.length) widened.add(pubkey);
            }
            // Releasing coordinator entries is only possible as a whole, so restart with the survivors.
            if (evictOverflow()) {
                restart();
                return;
            }
            // New hints still help a pubkey that has not resolved yet.
            ensureUnresolved(widened);
            const unresolved = added.filter(pubkey => !profiles.has(pubkey));
            if (!unresolved.length) return;
            // One bulk IndexedDB read warms the memory cache before per-pubkey sync starts.
            void profileCache.getCachedProfiles(unresolved).catch(() => undefined).then(() => {
                if (!disposed) ensureUnresolved(unresolved);
            });
        },
        /** Retries unresolved mentions after the relay runtime changes. */
        refresh(): void {
            if (!disposed) restart();
        },
        dispose(): void {
            disposed = true;
            unsubscribe();
            profileSync.dispose();
            requested.clear();
        },
    };
}
