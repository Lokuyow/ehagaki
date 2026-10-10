import type { RxNostr } from "rx-nostr";
import { verifyRepostTarget } from "./postRepostUtils";
import { attestFullyVerifiedPostHistoryRawEvent } from "./postHistoryRawEventVerification";
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
import { toEventFromPostHistoryRecord } from "./postHistoryThreadGraphUtils";
import type { NostrEvent, ProfileData, RelayConfig } from "./types";
import {
    createPostHistoryProfileSyncCoordinator,
    type PostHistoryProfileSyncCoordinator,
} from "./postHistoryProfileSync";
import { areStringArraysEqual } from "./utils/arrayEqualityUtils";

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
    loadRepostTarget?: (descriptor: RelatedTargetDescriptor) => Promise<{ event: NostrEvent; relayHints: string[] } | null>;
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
    profileSyncCoordinator?: PostHistoryProfileSyncCoordinator;
}

interface EnsureRelatedTargetOptions {
    requireRelayHint?: boolean;
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
    profileSyncCoordinator = undefined,
    loadRepostTarget = undefined,
}: CreatePostHistoryRelatedTargetResolverParams) {
    const profileSync = profileSyncCoordinator
        ?? createPostHistoryProfileSyncCoordinator({ getShow, getRxNostr });
    const ownsProfileSync = !profileSyncCoordinator;
    let snapshotsByTargetId = $state.raw<Record<string, PostHistoryRelatedTargetSnapshot>>({});
    let scopeRevisionByKey = $state<Record<string, number>>({});
    let scopeGenerationByKey = $state<Record<string, number>>({});

    const targetIdsByScopeKey = new Map<string, Set<string>>();
    const scopeKeysByTargetId = new Map<string, Set<string>>();
    const pendingLoadsByTargetId = new Map<string, Promise<PostHistoryRelatedTargetSnapshot | null>>();
    const loadTasksByTargetId = new Map<string, PostHistoryContextFetchTask>();
    const pendingDeletionChecksByTarget = new Map<string, {
        promise: Promise<{ deleted: boolean; complete: boolean }>;
        requireComplete: boolean;
    }>();
    const deletionTasksByTarget = new Map<string, PostHistoryDeletionFetchTask>();
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

    function ensureProfileForTarget(
        pubkey: string,
        relayHints: string[],
    ): void {
        const knownProfile = profileSync.ensureProfile(pubkey, relayHints);
        mergeProfileForPubkey(pubkey, knownProfile);
    }

    profileSync.subscribe((pubkey, profile) => {
        if (getShow()) {
            mergeProfileForPubkey(pubkey, profile);
        }
    });

    async function runDeletionCheck(
        targetEvent: NostrEvent,
        relayHints: string[],
        options: { background?: boolean; requireComplete?: boolean } = {},
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

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            if (options.requireComplete) throw new Error("deletion_confirmation_incomplete");
            return false;
        }

        // An unverified author hint for the same ID must not satisfy a verified author's check.
        const deletionKey = `${targetEvent.pubkey}:${targetEvent.id}`;
        let pending = pendingDeletionChecksByTarget.get(deletionKey);
        if (pending && options.requireComplete) {
            pending.requireComplete = true;
            deletionTasksByTarget.get(deletionKey)?.requireComplete?.();
        }
        if (!pending) {
            // A foreground waiter can arrive before this deferred task starts,
            // or upgrade the same task after its preview request has started.
            const check = { requireComplete: options.requireComplete ?? false,
                promise: Promise.resolve({ deleted: false, complete: false }) };
            check.promise = Promise.resolve().then(async () => {
                try {
                    const task = deletionFetchService.fetchDeletionRequests(rxNostr, {
                        targets: [{ event: targetEvent, relayUrls: relayHints }],
                        relayHints,
                        relayConfig: getRelayConfig(),
                        requireComplete: check.requireComplete,
                    });
                    deletionTasksByTarget.set(deletionKey, task);

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

                    return { deleted, complete: result.status === "success" };
                } catch {
                    return { deleted: false, complete: false };
                } finally {
                    if (pendingDeletionChecksByTarget.get(deletionKey) === check) {
                        deletionTasksByTarget.delete(deletionKey);
                        pendingDeletionChecksByTarget.delete(deletionKey);
                    }
                }
            });
            pendingDeletionChecksByTarget.set(deletionKey, check);
            pending = check;
        }
        if (options.background) {
            void pending.promise;
            return false;
        }

        const result = await pending.promise;
        if (!result.deleted && options.requireComplete && !result.complete) {
            throw new Error("deletion_confirmation_incomplete");
        }
        return result.deleted;
    }

    function isCurrentLoadRequest(targetEventId: string, requestId: number): boolean {
        return loadRequestIdsByTargetId.get(targetEventId) === requestId;
    }

    async function resolveTarget(
        descriptor: RelatedTargetDescriptor,
        options: EnsureRelatedTargetOptions = {},
        repostPreparation?: { target: NostrEvent },
    ): Promise<PostHistoryRelatedTargetSnapshot | null> {
        registerDescriptor(descriptor);
        const existingBeforeMerge = snapshotsByTargetId[descriptor.targetEventId];
        const contextChanged = mergeDescriptorContext(descriptor);
        const mergedSnapshot = snapshotsByTargetId[descriptor.targetEventId]
            ?? createInitialSnapshot(descriptor);
        const canUsePreparedTarget = !!repostPreparation && mergedSnapshot.relayHints.length > 0;
        const preserveResolvedState = !!options.background && existingBeforeMerge?.status === "resolved";
        // A signed event of another kind can still be valid for a quote/thread.
        // Let the Repost projection reject it without poisoning the shared ID cache.
        if (descriptor.relationKind === "repost" && existingBeforeMerge?.status === "resolved") {
            const cached = attestFullyVerifiedPostHistoryRawEvent(existingBeforeMerge.event)?.event;
            if (cached?.id === descriptor.targetEventId && cached.kind !== 1) return existingBeforeMerge;
            if (cached?.id === descriptor.targetEventId) {
                const generation = scopeGenerationByKey[descriptor.scopeKey];
                const deleted = await isDeletedTarget(cached.pubkey, cached.id);
                if (!getShow() || generation !== scopeGenerationByKey[descriptor.scopeKey]
                    || !scopeKeysByTargetId.get(cached.id)?.has(descriptor.scopeKey)) return null;
                if (deleted) return applySnapshotUpdate(cached.id, { status: "deleted", event: null,
                    authorPubkey: cached.pubkey, errorCode: null, updatedAt: Date.now() });
            }
        }

        if (!options.force && existingBeforeMerge && (!options.requireRelayHint || existingBeforeMerge.relayHints.length > 0)) {
            if (
                existingBeforeMerge.status === "resolved"
                || existingBeforeMerge.status === "deleted"
            ) {
                if (descriptor.relationKind === "repost" && existingBeforeMerge.status === "resolved"
                    && !verifyRepostTarget(existingBeforeMerge.event, { eventId: descriptor.targetEventId, authorHint: null, relayHints: [] })) {
                    return await resolveTarget(descriptor, { ...options, force: true }, repostPreparation);
                }
                if (existingBeforeMerge.status === "resolved" && existingBeforeMerge.authorPubkey) {
                    ensureProfileForTarget(
                        existingBeforeMerge.authorPubkey,
                        snapshotsByTargetId[descriptor.targetEventId]?.relayHints
                            ?? existingBeforeMerge.relayHints,
                    );
                }
                return snapshotsByTargetId[descriptor.targetEventId] ?? existingBeforeMerge;
            }

            if (
                existingBeforeMerge.status === "loading"
                && !canUsePreparedTarget
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

        if (!options.force && !canUsePreparedTarget && pendingLoadsByTargetId.has(descriptor.targetEventId)) {
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

                const repostLocal = repostPreparation
                    ? { event: repostPreparation.target, relayHints: mergedSnapshot.relayHints }
                    : descriptor.relationKind === "repost" ? await loadRepostTarget?.(descriptor) : null;
                if (!isCurrentLoadRequest(descriptor.targetEventId, requestId)) return null;
                const localVerified = repostLocal && verifyRepostTarget(repostLocal.event, {
                    eventId: descriptor.targetEventId, authorHint: null, relayHints: descriptor.relayHints ?? [],
                });
                if (localVerified && (!options.requireRelayHint || repostLocal!.relayHints.length > 0)) {
                    const hints = sanitizeRelayHints([...repostLocal!.relayHints, ...mergedSnapshot.relayHints]);
                    const snapshot = applySnapshotUpdate(descriptor.targetEventId, { status: "resolved",
                        event: localVerified.event, authorPubkey: localVerified.event.pubkey, relayHints: hints,
                        errorCode: null, updatedAt: Date.now() });
                    ensureProfileForTarget(localVerified.event.pubkey, hints);
                    if (!repostPreparation) void runDeletionCheck(localVerified.event, hints, { background: true });
                    return snapshot;
                }
                const existingRecord = await postHistoryRepositoryImpl.getByEventId(
                    descriptor.targetEventId,
                );
                if (!isCurrentLoadRequest(descriptor.targetEventId, requestId)) {
                    return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                }

                if (existingRecord && (!options.requireRelayHint || [...existingRecord.relayHints, ...existingRecord.acceptedRelays, ...(existingRecord.fetchedRelays ?? [])].length > 0)
                    && (descriptor.relationKind !== "repost" || verifyRepostTarget(existingRecord.rawEvent, {
                    eventId: descriptor.targetEventId, authorHint: null, relayHints: [],
                }))) {
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

                    const storedEvent = descriptor.relationKind === "repost"
                        ? verifyRepostTarget(existingRecord.rawEvent)!.event
                        : toEventFromPostHistoryRecord(existingRecord);
                    const event = storedEvent;
                    const targetRelayHints = recordRelayHints;
                    const snapshot = applySnapshotUpdate(descriptor.targetEventId, {
                        status: "resolved",
                        event,
                        authorPubkey: event.pubkey,
                        relayHints: targetRelayHints,
                        errorCode: null,
                        updatedAt: Date.now(),
                    });
                    ensureProfileForTarget(event.pubkey, targetRelayHints);
                    if (!repostPreparation) void runDeletionCheck(event, targetRelayHints, { background: true });
                    return snapshotsByTargetId[descriptor.targetEventId] ?? snapshot;
                }

                if (descriptor.authorHint && descriptor.relationKind !== "repost") {
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
                    if (descriptor.authorHint && descriptor.relationKind !== "repost") {
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

                const pointerRelayHints = sanitizeRelayHints([
                    ...(result.relayUrl ? [result.relayUrl] : []),
                    ...mergedSnapshot.relayHints,
                ]);
                const resolvedEvent = result.event;
                if (descriptor.relationKind === "repost" && !verifyRepostTarget(resolvedEvent, {
                    eventId: descriptor.targetEventId, authorHint: null, relayHints: [],
                })) throw new Error("invalid_repost_target");
                const resolvedRelayHints = pointerRelayHints;
                const deletedAfterResolve = !repostPreparation && await runDeletionCheck(
                    resolvedEvent,
                    resolvedRelayHints,
                );
                if (!isCurrentLoadRequest(descriptor.targetEventId, requestId)) {
                    return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                }

                if (deletedAfterResolve) {
                    if (resolvedEvent.id !== descriptor.targetEventId) {
                        applySnapshotUpdate(descriptor.targetEventId, {
                            status: "deleted",
                            event: null,
                            authorPubkey: resolvedEvent.pubkey,
                            relayHints: resolvedRelayHints,
                            errorCode: null,
                            updatedAt: Date.now(),
                        });
                    }
                    return snapshotsByTargetId[descriptor.targetEventId] ?? null;
                }

                const snapshot = applySnapshotUpdate(descriptor.targetEventId, {
                    status: "resolved",
                    event: resolvedEvent,
                    authorPubkey: resolvedEvent.pubkey,
                    relayHints: resolvedRelayHints,
                    errorCode: null,
                    updatedAt: Date.now(),
                });
                ensureProfileForTarget(
                    resolvedEvent.pubkey,
                    resolvedRelayHints,
                );
                return snapshotsByTargetId[descriptor.targetEventId] ?? snapshot;
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

    async function ensureTarget(descriptor: RelatedTargetDescriptor, options: EnsureRelatedTargetOptions = {}) {
        return resolveTarget(descriptor, options);
    }

    /** One foreground boundary for provenance and deletion confirmation before signing. */
    async function prepareRepostTarget(descriptor: RelatedTargetDescriptor, target: NostrEvent) {
        const verified = verifyRepostTarget(target, { eventId: descriptor.targetEventId,
            authorHint: descriptor.authorHint ?? null, relayHints: descriptor.relayHints ?? [] });
        if (descriptor.relationKind !== "repost" || !verified || !getShow() || !getRxNostr()) return null;
        registerDescriptor(descriptor);
        const scopes = scopeKeysByTargetId.get(descriptor.targetEventId);
        const generation = scopeGenerationByKey[descriptor.scopeKey];
        const runtime = getRxNostr();
        const isCurrent = () => getShow() && getRxNostr() === runtime
            && scopes === scopeKeysByTargetId.get(descriptor.targetEventId)
            && scopes?.has(descriptor.scopeKey) && generation === scopeGenerationByKey[descriptor.scopeKey];
        const snapshot = await resolveTarget(descriptor, { requireRelayHint: true }, { target: verified.event });
        if (!isCurrent() || snapshot?.status !== "resolved" || !verifyRepostTarget(snapshot.event, {
            eventId: verified.event.id, authorHint: verified.event.pubkey, relayHints: [],
        })) return null;
        const deleted = await runDeletionCheck(verified.event, snapshot.relayHints, { requireComplete: true });
        if (!isCurrent()) return null;
        return deleted ? snapshotsByTargetId[descriptor.targetEventId] ?? null : snapshot;
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
                for (const [key, task] of deletionTasksByTarget) {
                    if (!key.endsWith(`:${targetEventId}`)) continue;
                    task.cancel();
                    deletionTasksByTarget.delete(key);
                    pendingDeletionChecksByTarget.delete(key);
                }
                pendingLoadsByTargetId.delete(targetEventId);
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
        deletionTasksByTarget.forEach((task) => task.cancel());
        loadTasksByTargetId.clear();
        deletionTasksByTarget.clear();
        pendingLoadsByTargetId.clear();
        pendingDeletionChecksByTarget.clear();
        targetIdsByScopeKey.clear();
        scopeKeysByTargetId.clear();
        if (ownsProfileSync) {
            profileSync.reset();
        }
        loadRequestIdsByTargetId.clear();
        snapshotsByTargetId = {};
        scopeRevisionByKey = {};
        scopeGenerationByKey = {};
    }

    return {
        ensureTarget,
        prepareRepostTarget,
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
