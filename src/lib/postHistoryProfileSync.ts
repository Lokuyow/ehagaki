import type { RxNostr } from "rx-nostr";

import { profileMetadataCache } from "./profileMetadataCache.svelte";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { ProfileData } from "./types";

interface PostHistoryProfileCache {
    getProfile(
        pubkey: string,
        options: {
            rxNostr?: RxNostr;
            additionalRelays?: string[];
            forceRefresh?: boolean;
            allowBackgroundRefresh?: boolean;
        },
    ): Promise<ProfileData | null>;
    subscribe(
        pubkey: string,
        callback: (profile: ProfileData | null) => void,
    ): () => void;
}

interface ActivePostHistoryProfileSync {
    pubkey: string;
    relayHints: string[];
    lastProfile: ProfileData | null;
    unsubscribe: () => void;
    pending: Promise<void> | null;
    refreshQueued: boolean;
    disposed: boolean;
}

export interface PostHistoryProfileSyncCoordinator {
    ensureProfile(pubkey: string, relayHints?: string[]): void;
    subscribe(
        listener: (pubkey: string, profile: ProfileData) => void,
    ): () => void;
    reset(): void;
    dispose(): void;
}

export interface CreatePostHistoryProfileSyncCoordinatorParams {
    getShow: () => boolean;
    getRxNostr: () => RxNostr | undefined;
    profileCache?: PostHistoryProfileCache;
    logger?: Pick<Console, "error">;
}

function areRelayHintsEqual(left: string[], right: string[]): boolean {
    return left.length === right.length
        && left.every((relay, index) => relay === right[index]);
}

export function createPostHistoryProfileSyncCoordinator({
    getShow,
    getRxNostr,
    profileCache = profileMetadataCache,
    logger = console,
}: CreatePostHistoryProfileSyncCoordinatorParams): PostHistoryProfileSyncCoordinator {
    const activeByPubkey = new Map<string, ActivePostHistoryProfileSync>();
    const listeners = new Set<(pubkey: string, profile: ProfileData) => void>();
    let disposed = false;

    const publish = (
        active: ActivePostHistoryProfileSync,
        profile: ProfileData | null,
    ): void => {
        if (
            disposed
            || active.disposed
            || activeByPubkey.get(active.pubkey) !== active
            || !getShow()
            || !profile
            || active.lastProfile === profile
        ) {
            return;
        }

        active.lastProfile = profile;
        for (const listener of listeners) {
            listener(active.pubkey, profile);
        }
    };

    const requestProfile = (
        active: ActivePostHistoryProfileSync,
        forceRefresh: boolean,
    ): void => {
        if (active.pending || active.disposed || disposed) {
            return;
        }

        const requestedRelayHints = active.relayHints;
        active.pending = profileCache.getProfile(active.pubkey, {
            rxNostr: getRxNostr(),
            additionalRelays: requestedRelayHints,
            forceRefresh,
            allowBackgroundRefresh: true,
        }).then((profile) => {
            publish(active, profile);
        }).catch((error) => {
            logger.error("投稿履歴プロフィールの取得に失敗:", error);
        }).finally(() => {
            if (activeByPubkey.get(active.pubkey) !== active) {
                return;
            }

            active.pending = null;
            if (active.refreshQueued) {
                active.refreshQueued = false;
                requestProfile(active, true);
            }
        });
    };

    const ensureProfile = (pubkey: string, relayHints: string[] = []): void => {
        if (!pubkey || disposed) {
            return;
        }

        const sanitizedRelayHints = RelayConfigUtils.sanitizeExternalRelayUrls(relayHints);
        const current = activeByPubkey.get(pubkey);
        if (current) {
            const mergedRelayHints = RelayConfigUtils.mergeRelayConfigs(
                current.relayHints,
                sanitizedRelayHints,
            );
            if (areRelayHintsEqual(current.relayHints, mergedRelayHints)) {
                return;
            }

            current.relayHints = mergedRelayHints;
            if (current.pending) {
                current.refreshQueued = true;
            } else {
                requestProfile(current, true);
            }
            return;
        }

        const active: ActivePostHistoryProfileSync = {
            pubkey,
            relayHints: sanitizedRelayHints,
            lastProfile: null,
            unsubscribe: () => undefined,
            pending: null,
            refreshQueued: false,
            disposed: false,
        };
        activeByPubkey.set(pubkey, active);
        active.unsubscribe = profileCache.subscribe(pubkey, (profile) => {
            publish(active, profile);
        });
        requestProfile(active, false);
    };

    const subscribe = (
        listener: (pubkey: string, profile: ProfileData) => void,
    ): (() => void) => {
        if (disposed) {
            return () => undefined;
        }

        listeners.add(listener);
        for (const active of activeByPubkey.values()) {
            if (active.lastProfile) {
                listener(active.pubkey, active.lastProfile);
            }
        }
        return () => listeners.delete(listener);
    };

    const reset = (): void => {
        for (const active of activeByPubkey.values()) {
            active.disposed = true;
            active.unsubscribe();
        }
        activeByPubkey.clear();
    };

    const dispose = (): void => {
        if (disposed) {
            return;
        }
        reset();
        listeners.clear();
        disposed = true;
    };

    return {
        ensureProfile,
        subscribe,
        reset,
        dispose,
    };
}
