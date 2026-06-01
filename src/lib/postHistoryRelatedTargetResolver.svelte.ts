import type { RxNostr } from "rx-nostr";
import {
    postHistoryContextFetchService,
    type PostHistoryContextFetchService,
    type PostHistoryContextFetchTask,
} from "./postHistoryContextFetchService";
import {
    postHistoryDeletionFetchService,
    type PostHistoryDeletionFetchService,
    type PostHistoryDeletionFetchTask,
} from "./postHistoryDeletionFetchService";
import { RelayConfigUtils } from "./relayConfigUtils";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";
import {
    profilesRepository,
    type ProfilesRepository,
} from "./storage/profilesRepository";
import { toEventFromPostHistoryRecord } from "./postHistoryThreadGraphUtils";
import type { NostrEvent, ProfileData, RelayConfig } from "./types";
import { profileMetadataCache } from "./profileMetadataCache.svelte";

const POST_HISTORY_RELATED_TARGET_RELAY_LIMIT = 8;

export type PostHistoryRelatedTargetStatus =
    | "loading"
    | "resolved"
    | "not-found"
    | "deleted"
    | "error";

export type PostHistoryRelatedTargetErrorCode =
    | "fetch_failed"
    | "nostr_not_ready"
    | null;

export interface RelatedTargetDescriptor {
    targetEventId: string;
    relationKind: string;
    scopeKey: string;
    sourceEventId?: string;
    relayHints?: string[];
    authorHint?: string | null;
}

export interface PostHistoryRelatedTargetSnapshot {
    targetEventId: string;
    status: PostHistoryRelatedTargetStatus;
    event: NostrEvent | null;
    profile: ProfileData | null;
    authorPubkey: string | null;
    relayHints: string[];
    errorCode: PostHistoryRelatedTargetErrorCode;
    updatedAt: number | null;
}

interface CreatePostHistoryRelatedTargetResolverParams {
    getShow: () => boolean;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    postHistoryRepositoryImpl?: Pick<PostHistoryRepository, "getByEventId">;
    contextFetchService?: Pick<PostHistoryContextFetchService, "fetchEventById">;
    deletionRequestsRepositoryImpl?: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets" | "upsertValidDeletionRequests"
    >;
    deletionFetchService?: Pick<PostHistoryDeletionFetchService, "fetchDeletionRequests">;
    profilesRepositoryImpl?: Pick<ProfilesRepository, "get">;
}

interface EnsureRelatedTargetOptions {
    force?: boolean;
    background?: boolean;
}

interface RelatedTargetSnapshotUpdate {
    status?: PostHistoryRelatedTargetStatus;
    event?: NostrEvent | null;
    profile?: ProfileData | null;
    authorPubkey?: string | null;
    relayHints?: string[];
    errorCode?: PostHistoryRelatedTargetErrorCode;
    updatedAt?: number | null;
}

function sanitizeRelayHints(relayHints: string[]): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relayHints, {
        limit: POST_HISTORY_RELATED_TARGET_RELAY_LIMIT,
    });
}

function areStringArraysEqual(left: string[], right: string[]): boolean {
    if (left.length !== right.length) {
        return false;
    }

    return left.every((value, index) => value === right[index]);
}

function createSyntheticTargetEvent(
    targetEventId: string,
    pubkey: string,
): NostrEvent {
    return {
        id: targetEventId,
        pubkey,
        kind: 1,
        content: "",
        tags: [],
        created_at: 0,
        sig: "",
    };
}

function createInitialSnapshot(
    descriptor: RelatedTargetDescriptor,
): PostHistoryRelatedTargetSnapshot {
    return {
        targetEventId: descriptor.targetEventId,
        status: "loading",
        event: null,
        profile: null,
        authorPubkey: descriptor.authorHint ?? null,
        relayHints: sanitizeRelayHints(descriptor.relayHints ?? []),
        errorCode: null,
        updatedAt: null,
    };
}

export function createPostHistoryRelatedTargetResolver({
    getShow,
    getRxNostr,
    getRelayConfig,
    postHistoryRepositoryImpl = postHistoryRepository,
    contextFetchService = postHistoryContextFetchService,
    deletionRequestsRepositoryImpl = postHistoryDeletionRequestsRepository,
    deletionFetchService = postHistoryDeletionFetchService,
    profilesRepositoryImpl = profilesRepository,
}: CreatePostHistoryRelatedTargetResolverParams) {
    let snapshotsByTargetId = $state.raw<Record<string, PostHistoryRelatedTargetSnapshot>>({});
    let scopeRevisionByKey = $state<Record<string, number>>({});
    let scopeGenerationByKey = $state<Record<string, number>>({});

    const targetIdsByScopeKey = new Map<string, Set<string>>();
    const scopeKeysByTargetId = new Map<string, Set<string>>();
    const pendingLoadsByTargetId = new Map<string, Promise<PostHistoryRelatedTargetSnapshot | null>>();
    const loadTasksByTargetId = new Map<string, PostHistoryContextFetchTask>();
    const pendingDeletionChecksByTargetId = new Map<string, Promise<boolean>>();
    const deletionTasksByTargetId = new Map<string, PostHistoryDeletionFetchTask>();
    const profileRefreshTasksByPubkey = new Map<string, Promise<void>>();
    const profileSubscriptionsByPubkey = new Map<string, () => void>();
    const loadRequestIdsByTargetId = new Map<string, number>();
    let nextLoadRequestId = 0;

    function bumpScopeRevision(scopeKey: string): void {
        scopeRevisionByKey = {
            ...scopeRevisionByKey,
            [scopeKey]: (scopeRevisionByKey[scopeKey] ?? 0) + 1,
        };
    }

    function bumpTargetScopeRevisions(targetEventId: string): void {
        const scopeKeys = scopeKeysByTargetId.get(targetEventId);
        if (!scopeKeys) {
            return;
        }

        for (const scopeKey of scopeKeys) {
            bumpScopeRevision(scopeKey);
        }
    }

    function updateSnapshot(
        targetEventId: string,
        updater: (
            current: PostHistoryRelatedTargetSnapshot | undefined,
        ) => PostHistoryRelatedTargetSnapshot,
    ): PostHistoryRelatedTargetSnapshot {
        const current = snapshotsByTargetId[targetEventId];
        const next = updater(current);
        if (
            current
            && current.status === next.status
            && current.event === next.event
            && current.profile === next.profile
            && current.authorPubkey === next.authorPubkey
            && current.errorCode === next.errorCode
            && current.updatedAt === next.updatedAt
            && areStringArraysEqual(current.relayHints, next.relayHints)
        ) {
            return current;
        }

        snapshotsByTargetId = {
            ...snapshotsByTargetId,
            [targetEventId]: next,
        };
        bumpTargetScopeRevisions(targetEventId);
        return next;
    }

    function applySnapshotUpdate(
        targetEventId: string,
        update: RelatedTargetSnapshotUpdate,
    ): PostHistoryRelatedTargetSnapshot {
        return updateSnapshot(targetEventId, (current) => {
            const base = current ?? createInitialSnapshot({
                targetEventId,
                relationKind: "related-target",
                scopeKey: "",
            });

            return {
                targetEventId,
                status: update.status ?? base.status,
                event: update.event !== undefined ? update.event : base.event,
                profile: update.profile !== undefined ? update.profile : base.profile,
                authorPubkey: update.authorPubkey !== undefined
                    ? update.authorPubkey
                    : base.authorPubkey,
                relayHints: update.relayHints
                    ? sanitizeRelayHints(update.relayHints)
                    : base.relayHints,
                errorCode: update.errorCode !== undefined ? update.errorCode : base.errorCode,
                updatedAt: update.updatedAt !== undefined ? update.updatedAt : base.updatedAt,
            };
        });
    }

    function mergeDescriptorContext(descriptor: RelatedTargetDescriptor): boolean {
        const current = snapshotsByTargetId[descriptor.targetEventId];
        const nextRelayHints = sanitizeRelayHints([
            ...(current?.relayHints ?? []),
            ...(descriptor.relayHints ?? []),
        ]);
        const nextAuthorPubkey = current?.authorPubkey ?? descriptor.authorHint ?? null;
        const changed = !current
            || current.authorPubkey !== nextAuthorPubkey
            || !areStringArraysEqual(current.relayHints, nextRelayHints);

        applySnapshotUpdate(descriptor.targetEventId, {
            authorPubkey: nextAuthorPubkey,
            relayHints: nextRelayHints,
        });
        return changed;
    }

    function registerDescriptor(descriptor: RelatedTargetDescriptor): void {
        const scopeTargetIds = targetIdsByScopeKey.get(descriptor.scopeKey) ?? new Set<string>();
        scopeTargetIds.add(descriptor.targetEventId);
        targetIdsByScopeKey.set(descriptor.scopeKey, scopeTargetIds);

        const targetScopeKeys = scopeKeysByTargetId.get(descriptor.targetEventId) ?? new Set<string>();
        targetScopeKeys.add(descriptor.scopeKey);
        scopeKeysByTargetId.set(descriptor.targetEventId, targetScopeKeys);

        if (!(descriptor.scopeKey in scopeGenerationByKey)) {
            scopeGenerationByKey = {
                ...scopeGenerationByKey,
                [descriptor.scopeKey]: 0,
            };
        }
        if (!(descriptor.scopeKey in scopeRevisionByKey)) {
            scopeRevisionByKey = {
                ...scopeRevisionByKey,
                [descriptor.scopeKey]: 0,
            };
        }
    }

    async function isDeletedTarget(
        authorPubkey: string,
        targetEventId: string,
    ): Promise<boolean> {
        const deletedTargets = await deletionRequestsRepositoryImpl.getDeletedTargets([
            {
                targetAuthorPubkey: authorPubkey,
                targetEventId,
            },
        ]);

        return deletedTargets.get(authorPubkey)?.has(targetEventId) ?? false;
    }

    function mergeProfileForPubkey(pubkey: string, profile: ProfileData | null): void {
        if (!pubkey || !profile) {
            return;
        }

        for (const [targetEventId, snapshot] of Object.entries(snapshotsByTargetId)) {
            if (snapshot.authorPubkey !== pubkey) {
                continue;
            }

            applySnapshotUpdate(targetEventId, {
                profile,
            });
        }
    }

    function ensureProfileSubscription(pubkey: string): void {
        if (!pubkey || profileSubscriptionsByPubkey.has(pubkey)) {
            return;
        }

        const unsubscribe = profileMetadataCache.subscribe(pubkey, (profile) => {
            if (!getShow() || !profile) {
                return;
            }

            mergeProfileForPubkey(pubkey, profile);
        });
        profileSubscriptionsByPubkey.set(pubkey, unsubscribe);
    }

    function ensureProfileForTarget(
        targetEventId: string,
        pubkey: string,
        relayHints: string[],
    ): void {
        ensureProfileSubscription(pubkey);

        if (!pubkey || profileRefreshTasksByPubkey.has(pubkey)) {
            return;
        }

        const task = (async () => {
            const currentSnapshot = snapshotsByTargetId[targetEventId];
            if (currentSnapshot?.status !== "resolved" || currentSnapshot.authorPubkey !== pubkey) {
                return;
            }

            const rxNostr = getRxNostr();
            if (!getShow()) {
                return;
            }

            const profile = await profileMetadataCache.getProfile(pubkey, {
                rxNostr,
                additionalRelays: relayHints,
                forceRefresh: false,
                allowBackgroundRefresh: true,
            });
            if (!profile) {
                return;
            }

            mergeProfileForPubkey(pubkey, profile);
        })()
            .catch(() => undefined)
            .finally(() => {
                profileRefreshTasksByPubkey.delete(pubkey);
            });

        profileRefreshTasksByPubkey.set(pubkey, task);
    }

    async function runDeletionCheck(
        targetEvent: NostrEvent,
        relayHints: string[],
        options: { background?: boolean } = {},
    ): Promise<boolean> {
        if (!targetEvent.pubkey || !targetEvent.id) {
            return false;
        }

        if (await isDeletedTarget(targetEvent.pubkey, targetEvent.id)) {
            applySnapshotUpdate(targetEvent.id, {
                status: "deleted",
                event: null,
                authorPubkey: targetEvent.pubkey,
                relayHints,
                errorCode: null,
                updatedAt: Date.now(),
            });
            return true;
        }

        if (pendingDeletionChecksByTargetId.has(targetEvent.id)) {
            return pendingDeletionChecksByTargetId.get(targetEvent.id) ?? false;
        }

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            return false;
        }

        const taskPromise = (async (): Promise<boolean> => {
            try {
                const task = deletionFetchService.fetchDeletionRequests(rxNostr, {
                    targets: [{ event: targetEvent, relayUrls: relayHints }],
                    relayHints,
                    relayConfig: getRelayConfig(),
                });
                deletionTasksByTargetId.set(targetEvent.id, task);

                const result = await task.promise;
                if (result.events.length > 0) {
                    await deletionRequestsRepositoryImpl.upsertValidDeletionRequests({
                        targetEvents: [targetEvent],
                        deletionEvents: result.events,
                        fetchedAt: result.fetchedAt,
                    });
                }

                const deleted = await isDeletedTarget(targetEvent.pubkey, targetEvent.id);
                if (deleted) {
                    applySnapshotUpdate(targetEvent.id, {
                        status: "deleted",
                        event: null,
                        authorPubkey: targetEvent.pubkey,
                        relayHints,
                        errorCode: null,
                        updatedAt: Date.now(),
                    });
                }

                return deleted;
            } catch {
                return false;
            } finally {
                deletionTasksByTargetId.delete(targetEvent.id);
                pendingDeletionChecksByTargetId.delete(targetEvent.id);
            }
        })();

        pendingDeletionChecksByTargetId.set(targetEvent.id, taskPromise);
        if (options.background) {
            void taskPromise;
            return false;
        }

        return taskPromise;
    }

    function isCurrentLoadRequest(targetEventId: string, requestId: number): boolean {
        return loadRequestIdsByTargetId.get(targetEventId) === requestId;
    }

    async function ensureTarget(
        descriptor: RelatedTargetDescriptor,
        options: EnsureRelatedTargetOptions = {},
    ): Promise<PostHistoryRelatedTargetSnapshot | null> {
        registerDescriptor(descriptor);
        const existingBeforeMerge = snapshotsByTargetId[descriptor.targetEventId];
        const contextChanged = mergeDescriptorContext(descriptor);
        const mergedSnapshot = snapshotsByTargetId[descriptor.targetEventId]
            ?? createInitialSnapshot(descriptor);
        const preserveResolvedState = !!options.background && existingBeforeMerge?.status === "resolved";

        if (!options.force && existingBeforeMerge) {
            if (
                existingBeforeMerge.status === "resolved"
                || existingBeforeMerge.status === "deleted"
            ) {
                if (existingBeforeMerge.status === "resolved" && existingBeforeMerge.authorPubkey) {
                    ensureProfileForTarget(
                        descriptor.targetEventId,
                        existingBeforeMerge.authorPubkey,
                        snapshotsByTargetId[descriptor.targetEventId]?.relayHints
                            ?? existingBeforeMerge.relayHints,
                    );
                }
                return snapshotsByTargetId[descriptor.targetEventId] ?? existingBeforeMerge;
            }

            if (
                existingBeforeMerge.status === "loading"
                && pendingLoadsByTargetId.has(descriptor.targetEventId)
            ) {
                return await pendingLoadsByTargetId.get(descriptor.targetEventId)
                    ?? snapshotsByTargetId[descriptor.targetEventId]
                    ?? existingBeforeMerge;
            }

            if (!contextChanged) {
                if (existingBeforeMerge.status === "not-found" || existingBeforeMerge.status === "error") {
                    return snapshotsByTargetId[descriptor.targetEventId] ?? existingBeforeMerge;
                }
            }
        }

        if (!options.force && pendingLoadsByTargetId.has(descriptor.targetEventId)) {
            return await pendingLoadsByTargetId.get(descriptor.targetEventId)
                ?? snapshotsByTargetId[descriptor.targetEventId]
                ?? mergedSnapshot;
        }

        if (options.force) {
            loadTasksByTargetId.get(descriptor.targetEventId)?.cancel();
            loadTasksByTargetId.delete(descriptor.targetEventId);
            pendingLoadsByTargetId.delete(descriptor.targetEventId);
        }

        const requestId = ++nextLoadRequestId;
        loadRequestIdsByTargetId.set(descriptor.targetEventId, requestId);

        const taskPromise = (async (): Promise<PostHistoryRelatedTargetSnapshot | null> => {
            try {
                if (!preserveResolvedState) {
                    applySnapshotUpdate(descriptor.targetEventId, {
                        status: "loading",
                        errorCode: null,
                    });
                }

                const existingRecord = await postHistoryRepositoryImpl.getByEventId(
                    descriptor.targetEventId,
                );
                if (!isCurrentLoadRequest(descriptor.targetEventId, requestId)) {
                    return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                }

                if (existingRecord) {
                    const recordRelayHints = sanitizeRelayHints([
                        ...mergedSnapshot.relayHints,
                        ...existingRecord.relayHints,
                        ...existingRecord.acceptedRelays,
                        ...(existingRecord.fetchedRelays ?? []),
                    ]);
                    if (typeof existingRecord.deletedAt === "number") {
                        return applySnapshotUpdate(descriptor.targetEventId, {
                            status: "deleted",
                            event: null,
                            authorPubkey: existingRecord.pubkeyHex,
                            relayHints: recordRelayHints,
                            errorCode: null,
                            updatedAt: Date.now(),
                        });
                    }

                    const event = toEventFromPostHistoryRecord(existingRecord);
                    const snapshot = applySnapshotUpdate(descriptor.targetEventId, {
                        status: "resolved",
                        event,
                        authorPubkey: event.pubkey,
                        relayHints: recordRelayHints,
                        errorCode: null,
                        updatedAt: Date.now(),
                    });
                    ensureProfileForTarget(descriptor.targetEventId, event.pubkey, recordRelayHints);
                    void runDeletionCheck(event, recordRelayHints, { background: true });
                    return snapshot;
                }

                if (descriptor.authorHint) {
                    const deletedByAuthorHint = await runDeletionCheck(
                        createSyntheticTargetEvent(
                            descriptor.targetEventId,
                            descriptor.authorHint,
                        ),
                        mergedSnapshot.relayHints,
                    );
                    if (!isCurrentLoadRequest(descriptor.targetEventId, requestId)) {
                        return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                    }

                    if (deletedByAuthorHint) {
                        return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                    }
                }

                const rxNostr = getRxNostr();
                if (!rxNostr || !getShow()) {
                    if (!preserveResolvedState) {
                        return applySnapshotUpdate(descriptor.targetEventId, {
                            status: "error",
                            event: null,
                            authorPubkey: mergedSnapshot.authorPubkey,
                            relayHints: mergedSnapshot.relayHints,
                            errorCode: "nostr_not_ready",
                            updatedAt: Date.now(),
                        });
                    }

                    return snapshotsByTargetId[descriptor.targetEventId] ?? mergedSnapshot;
                }

                const fetchTask = contextFetchService.fetchEventById(rxNostr, {
                    eventId: descriptor.targetEventId,
                    relayHints: mergedSnapshot.relayHints,
                    relayConfig: getRelayConfig(),
                });
                loadTasksByTargetId.set(descriptor.targetEventId, fetchTask);
                const result = await fetchTask.promise;
                loadTasksByTargetId.delete(descriptor.targetEventId);

                if (!isCurrentLoadRequest(descriptor.targetEventId, requestId)) {
                    return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                }

                if (!result.event) {
                    if (descriptor.authorHint) {
                        const deletedAfterFetch = await runDeletionCheck(
                            createSyntheticTargetEvent(
                                descriptor.targetEventId,
                                descriptor.authorHint,
                            ),
                            mergedSnapshot.relayHints,
                        );
                        if (!isCurrentLoadRequest(descriptor.targetEventId, requestId)) {
                            return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                        }

                        if (deletedAfterFetch) {
                            return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                        }
                    }

                    if (preserveResolvedState) {
                        return snapshotsByTargetId[descriptor.targetEventId] ?? mergedSnapshot;
                    }

                    return applySnapshotUpdate(descriptor.targetEventId, {
                        status: "not-found",
                        event: null,
                        authorPubkey: mergedSnapshot.authorPubkey,
                        relayHints: mergedSnapshot.relayHints,
                        errorCode: null,
                        updatedAt: Date.now(),
                    });
                }

                const resolvedRelayHints = sanitizeRelayHints([
                    ...mergedSnapshot.relayHints,
                    ...(result.relayUrl ? [result.relayUrl] : []),
                ]);
                const deletedAfterResolve = await runDeletionCheck(
                    result.event,
                    resolvedRelayHints,
                );
                if (!isCurrentLoadRequest(descriptor.targetEventId, requestId)) {
                    return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                }

                if (deletedAfterResolve) {
                    return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                }

                const snapshot = applySnapshotUpdate(descriptor.targetEventId, {
                    status: "resolved",
                    event: result.event,
                    authorPubkey: result.event.pubkey,
                    relayHints: resolvedRelayHints,
                    errorCode: null,
                    updatedAt: Date.now(),
                });
                ensureProfileForTarget(
                    descriptor.targetEventId,
                    result.event.pubkey,
                    resolvedRelayHints,
                );
                return snapshot;
            } catch {
                if (!isCurrentLoadRequest(descriptor.targetEventId, requestId)) {
                    return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                }

                if (preserveResolvedState) {
                    return snapshotsByTargetId[descriptor.targetEventId] ?? mergedSnapshot;
                }

                return applySnapshotUpdate(descriptor.targetEventId, {
                    status: "error",
                    event: null,
                    authorPubkey: mergedSnapshot.authorPubkey,
                    relayHints: mergedSnapshot.relayHints,
                    errorCode: "fetch_failed",
                    updatedAt: Date.now(),
                });
            } finally {
                loadTasksByTargetId.delete(descriptor.targetEventId);
                pendingLoadsByTargetId.delete(descriptor.targetEventId);
            }
        })();

        pendingLoadsByTargetId.set(descriptor.targetEventId, taskPromise);
        return await taskPromise;
    }

    async function ensureTargets(
        descriptors: RelatedTargetDescriptor[],
        options: EnsureRelatedTargetOptions = {},
    ): Promise<Array<PostHistoryRelatedTargetSnapshot | null>> {
        return await Promise.all(
            descriptors.map((descriptor) => ensureTarget(descriptor, options)),
        );
    }

    async function retryTarget(
        descriptor: RelatedTargetDescriptor,
        options: Omit<EnsureRelatedTargetOptions, "force"> = {},
    ): Promise<PostHistoryRelatedTargetSnapshot | null> {
        return await ensureTarget(descriptor, {
            ...options,
            force: true,
        });
    }

    function getTargetSnapshot(targetEventId: string): PostHistoryRelatedTargetSnapshot | null {
        return snapshotsByTargetId[targetEventId] ?? null;
    }

    function getScopeRevision(scopeKey: string): number {
        return scopeRevisionByKey[scopeKey] ?? 0;
    }

    function invalidateScope(scopeKey: string): void {
        const targetIds = targetIdsByScopeKey.get(scopeKey);
        if (targetIds) {
            for (const targetEventId of targetIds) {
                const scopeKeys = scopeKeysByTargetId.get(targetEventId);
                if (!scopeKeys) {
                    continue;
                }

                scopeKeys.delete(scopeKey);
                if (scopeKeys.size > 0) {
                    continue;
                }

                scopeKeysByTargetId.delete(targetEventId);
                loadRequestIdsByTargetId.delete(targetEventId);
                loadTasksByTargetId.get(targetEventId)?.cancel();
                loadTasksByTargetId.delete(targetEventId);
                deletionTasksByTargetId.get(targetEventId)?.cancel();
                deletionTasksByTargetId.delete(targetEventId);
                pendingLoadsByTargetId.delete(targetEventId);
                pendingDeletionChecksByTargetId.delete(targetEventId);
            }
        }

        targetIdsByScopeKey.delete(scopeKey);
        scopeGenerationByKey = {
            ...scopeGenerationByKey,
            [scopeKey]: (scopeGenerationByKey[scopeKey] ?? 0) + 1,
        };
        bumpScopeRevision(scopeKey);
    }

    function reset(): void {
        loadTasksByTargetId.forEach((task) => task.cancel());
        deletionTasksByTargetId.forEach((task) => task.cancel());
        profileSubscriptionsByPubkey.forEach((unsubscribe) => unsubscribe());
        loadTasksByTargetId.clear();
        deletionTasksByTargetId.clear();
        pendingLoadsByTargetId.clear();
        pendingDeletionChecksByTargetId.clear();
        profileSubscriptionsByPubkey.clear();
        targetIdsByScopeKey.clear();
        scopeKeysByTargetId.clear();
        profileRefreshTasksByPubkey.clear();
        loadRequestIdsByTargetId.clear();
        snapshotsByTargetId = {};
        scopeRevisionByKey = {};
        scopeGenerationByKey = {};
    }

    return {
        ensureTarget,
        ensureTargets,
        retryTarget,
        getTargetSnapshot,
        getScopeRevision,
        invalidateScope,
        reset,
    };
}

export type PostHistoryRelatedTargetResolver = ReturnType<
    typeof createPostHistoryRelatedTargetResolver
>;
