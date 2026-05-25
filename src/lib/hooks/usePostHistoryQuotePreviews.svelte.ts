import { onDestroy } from "svelte";
import type { RxNostr } from "rx-nostr";
import { ProfileManager } from "../profileManager";
import {
    postHistoryContextFetchService,
    type PostHistoryContextFetchService,
    type PostHistoryContextFetchTask,
} from "../postHistoryContextFetchService";
import {
    postHistoryDeletionFetchService,
    type PostHistoryDeletionFetchService,
    type PostHistoryDeletionFetchTask,
} from "../postHistoryDeletionFetchService";
import {
    parsePostHistoryQuoteReferences,
    type PostHistoryQuoteReference,
} from "../postHistoryQuoteUtils";
import { RelayConfigUtils } from "../relayConfigUtils";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "../storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "../storage/postHistoryRepository";
import {
    profilesRepository,
    type ProfilesRepository,
} from "../storage/profilesRepository";
import type { PostHistoryRecord } from "../storage/ehagakiDb";
import { toEventFromPostHistoryRecord } from "../postHistoryThreadGraphUtils";
import type { NostrEvent, ProfileData, RelayConfig } from "../types";

const POST_HISTORY_QUOTE_PREVIEW_RELAY_LIMIT = 8;

export type PostHistoryQuotePreviewStatus =
    | "loading"
    | "resolved"
    | "not-found"
    | "deleted"
    | "error";

export interface PostHistoryQuotePreviewState {
    eventId: string;
    status: PostHistoryQuotePreviewStatus;
    event: NostrEvent | null;
    profile: ProfileData | null;
}

interface QuoteLoadContext {
    eventId: string;
    authorHint: string | null;
    relayHints: string[];
}

interface QuoteIndex {
    byPostId: Record<string, PostHistoryQuoteReference[]>;
    contextsByEventId: Record<string, QuoteLoadContext>;
}

const EMPTY_QUOTE_INDEX: QuoteIndex = {
    byPostId: {},
    contextsByEventId: {},
};

interface InternalQuotePreviewEntry {
    eventId: string;
    status: PostHistoryQuotePreviewStatus;
    event: NostrEvent | null;
    authorPubkey: string | null;
    relayHints: string[];
}

interface UsePostHistoryQuotePreviewsParams {
    getShow: () => boolean;
    getPosts: () => PostHistoryRecord[];
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

function sanitizeRelayHints(relayHints: string[]): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relayHints, {
        limit: POST_HISTORY_QUOTE_PREVIEW_RELAY_LIMIT,
    });
}

function areStringArraysEqual(left: string[], right: string[]): boolean {
    if (left.length !== right.length) {
        return false;
    }

    return left.every((value, index) => value === right[index]);
}

function createSyntheticTargetEvent(
    eventId: string,
    pubkey: string,
): NostrEvent {
    return {
        id: eventId,
        pubkey,
        kind: 1,
        content: "",
        tags: [],
        created_at: 0,
        sig: "",
    };
}

function buildQuoteIndex(posts: PostHistoryRecord[]): QuoteIndex {
    const byPostId: Record<string, PostHistoryQuoteReference[]> = {};
    const contextsByEventId: Record<string, QuoteLoadContext> = {};

    for (const post of posts) {
        const references = parsePostHistoryQuoteReferences(post);
        if (references.length === 0) {
            continue;
        }

        byPostId[post.eventId] = references;
        for (const reference of references) {
            const existing = contextsByEventId[reference.eventId];
            contextsByEventId[reference.eventId] = {
                eventId: reference.eventId,
                authorHint: existing?.authorHint ?? reference.authorHint,
                relayHints: sanitizeRelayHints([
                    ...(existing?.relayHints ?? []),
                    ...(reference.relayHint ? [reference.relayHint] : []),
                    ...post.relayHints,
                    ...post.acceptedRelays,
                    ...(post.fetchedRelays ?? []),
                ]),
            };
        }
    }

    return {
        byPostId,
        contextsByEventId,
    };
}

export function usePostHistoryQuotePreviews({
    getShow,
    getPosts,
    getRxNostr,
    getRelayConfig,
    postHistoryRepositoryImpl = postHistoryRepository,
    contextFetchService = postHistoryContextFetchService,
    deletionRequestsRepositoryImpl = postHistoryDeletionRequestsRepository,
    deletionFetchService = postHistoryDeletionFetchService,
    profilesRepositoryImpl = profilesRepository,
}: UsePostHistoryQuotePreviewsParams) {
    let previewEntriesByEventId = $state<Record<string, InternalQuotePreviewEntry>>(
        {},
    );
    let profilesByPubkey = $state<
        Record<string, ProfileData | null | undefined>
    >({});
    let quoteIndex = $state<QuoteIndex>(EMPTY_QUOTE_INDEX);
    const pendingLoadsByEventId = new Map<string, Promise<void>>();
    const loadTasksByEventId = new Map<string, PostHistoryContextFetchTask>();
    const pendingDeletionChecksByEventId = new Map<string, Promise<boolean>>();
    const deletionTasksByEventId = new Map<string, PostHistoryDeletionFetchTask>();
    const profileTasksByPubkey = new Map<string, Promise<void>>();
    const attemptedProfilePubkeys = new Set<string>();
    let lifecycleId = 0;

    function isActive(activeLifecycleId: number): boolean {
        return lifecycleId === activeLifecycleId && getShow();
    }

    function updatePreviewEntry(
        eventId: string,
        updater: (
            current: InternalQuotePreviewEntry | undefined,
        ) => InternalQuotePreviewEntry,
    ): void {
        const current = previewEntriesByEventId[eventId];
        const next = updater(current);
        if (
            current
            && current.status === next.status
            && current.event === next.event
            && current.authorPubkey === next.authorPubkey
            && areStringArraysEqual(current.relayHints, next.relayHints)
        ) {
            return;
        }

        previewEntriesByEventId = {
            ...previewEntriesByEventId,
            [eventId]: next,
        };
    }

    function mergePreviewEntryContext(context: QuoteLoadContext): boolean {
        const current = previewEntriesByEventId[context.eventId];
        const nextRelayHints = sanitizeRelayHints([
            ...(current?.relayHints ?? []),
            ...context.relayHints,
        ]);
        const nextAuthorPubkey = current?.authorPubkey ?? context.authorHint;
        const changed = !current
            || current.authorPubkey !== nextAuthorPubkey
            || !areStringArraysEqual(current.relayHints, nextRelayHints);

        if (current) {
            updatePreviewEntry(context.eventId, () => ({
                ...current,
                authorPubkey: nextAuthorPubkey,
                relayHints: nextRelayHints,
            }));
            return changed;
        }

        updatePreviewEntry(context.eventId, () => ({
            eventId: context.eventId,
            status: "loading",
            event: null,
            authorPubkey: context.authorHint,
            relayHints: nextRelayHints,
        }));
        return true;
    }

    function setLoading(context: QuoteLoadContext): void {
        updatePreviewEntry(context.eventId, (current) => ({
            eventId: context.eventId,
            status: "loading",
            event: current?.event ?? null,
            authorPubkey: current?.authorPubkey ?? context.authorHint,
            relayHints: sanitizeRelayHints([
                ...(current?.relayHints ?? []),
                ...context.relayHints,
            ]),
        }));
    }

    function setResolved(input: {
        event: NostrEvent;
        relayHints: string[];
    }): void {
        updatePreviewEntry(input.event.id, () => ({
            eventId: input.event.id,
            status: "resolved",
            event: input.event,
            authorPubkey: input.event.pubkey,
            relayHints: sanitizeRelayHints(input.relayHints),
        }));
    }

    function setDeleted(input: {
        eventId: string;
        authorPubkey: string | null;
        relayHints: string[];
    }): void {
        updatePreviewEntry(input.eventId, () => ({
            eventId: input.eventId,
            status: "deleted",
            event: null,
            authorPubkey: input.authorPubkey,
            relayHints: sanitizeRelayHints(input.relayHints),
        }));
    }

    function setNotFound(input: {
        eventId: string;
        authorPubkey: string | null;
        relayHints: string[];
    }): void {
        updatePreviewEntry(input.eventId, () => ({
            eventId: input.eventId,
            status: "not-found",
            event: null,
            authorPubkey: input.authorPubkey,
            relayHints: sanitizeRelayHints(input.relayHints),
        }));
    }

    function setError(input: {
        eventId: string;
        authorPubkey: string | null;
        relayHints: string[];
    }): void {
        updatePreviewEntry(input.eventId, () => ({
            eventId: input.eventId,
            status: "error",
            event: null,
            authorPubkey: input.authorPubkey,
            relayHints: sanitizeRelayHints(input.relayHints),
        }));
    }

    function clearAllTasks(): void {
        loadTasksByEventId.forEach((task) => task.cancel());
        loadTasksByEventId.clear();
        deletionTasksByEventId.forEach((task) => task.cancel());
        deletionTasksByEventId.clear();
        pendingLoadsByEventId.clear();
        pendingDeletionChecksByEventId.clear();
        profileTasksByPubkey.clear();
    }

    function resetState(): void {
        lifecycleId += 1;
        clearAllTasks();
        attemptedProfilePubkeys.clear();
        previewEntriesByEventId = {};
        profilesByPubkey = {};
        quoteIndex = EMPTY_QUOTE_INDEX;
    }

    async function isDeletedTarget(
        authorPubkey: string,
        eventId: string,
    ): Promise<boolean> {
        const deletedTargets =
            await deletionRequestsRepositoryImpl.getDeletedTargets([
                {
                    targetAuthorPubkey: authorPubkey,
                    targetEventId: eventId,
                },
            ]);

        return deletedTargets.get(authorPubkey)?.has(eventId) ?? false;
    }

    async function ensureProfileForPubkey(
        pubkey: string,
        additionalRelays: string[],
        activeLifecycleId: number,
    ): Promise<void> {
        if (!pubkey) {
            return;
        }

        if (profilesByPubkey[pubkey] !== undefined || attemptedProfilePubkeys.has(pubkey)) {
            return;
        }

        if (profileTasksByPubkey.has(pubkey)) {
            await profileTasksByPubkey.get(pubkey);
            return;
        }

        const task = (async () => {
            try {
                const cachedProfile = await profilesRepositoryImpl.get(pubkey);
                if (cachedProfile && isActive(activeLifecycleId)) {
                    profilesByPubkey = {
                        ...profilesByPubkey,
                        [pubkey]: cachedProfile,
                    };
                }

                const rxNostr = getRxNostr();
                if (!rxNostr || !isActive(activeLifecycleId)) {
                    return;
                }

                attemptedProfilePubkeys.add(pubkey);
                const profileManager = new ProfileManager(rxNostr as never);
                const profile = await profileManager.fetchProfileData(pubkey, {
                    additionalRelays,
                    forceRemote: false,
                });
                if (!profile || !isActive(activeLifecycleId)) {
                    return;
                }

                profilesByPubkey = {
                    ...profilesByPubkey,
                    [pubkey]: profile,
                };
            } catch {
                attemptedProfilePubkeys.add(pubkey);
            }
        })().finally(() => {
            profileTasksByPubkey.delete(pubkey);
        });

        profileTasksByPubkey.set(pubkey, task);
        await task;
    }

    async function ensureDeletedStateForTarget(
        targetEvent: NostrEvent,
        relayHints: string[],
        activeLifecycleId: number,
    ): Promise<boolean> {
        if (!targetEvent.pubkey || !targetEvent.id) {
            return false;
        }

        if (await isDeletedTarget(targetEvent.pubkey, targetEvent.id)) {
            if (isActive(activeLifecycleId)) {
                setDeleted({
                    eventId: targetEvent.id,
                    authorPubkey: targetEvent.pubkey,
                    relayHints,
                });
            }
            return true;
        }

        if (pendingDeletionChecksByEventId.has(targetEvent.id)) {
            return pendingDeletionChecksByEventId.get(targetEvent.id) ?? false;
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
                deletionTasksByEventId.set(targetEvent.id, task);

                const result = await task.promise;
                deletionTasksByEventId.delete(targetEvent.id);
                if (result.events.length > 0) {
                    await deletionRequestsRepositoryImpl.upsertValidDeletionRequests(
                        {
                            targetEvents: [targetEvent],
                            deletionEvents: result.events,
                            fetchedAt: result.fetchedAt,
                        },
                    );
                }

                const deleted = await isDeletedTarget(
                    targetEvent.pubkey,
                    targetEvent.id,
                );
                if (deleted && isActive(activeLifecycleId)) {
                    setDeleted({
                        eventId: targetEvent.id,
                        authorPubkey: targetEvent.pubkey,
                        relayHints,
                    });
                }

                return deleted;
            } catch {
                return false;
            } finally {
                deletionTasksByEventId.delete(targetEvent.id);
                pendingDeletionChecksByEventId.delete(targetEvent.id);
            }
        })();

        pendingDeletionChecksByEventId.set(targetEvent.id, taskPromise);
        return taskPromise;
    }

    async function ensureQuotePreview(
        context: QuoteLoadContext,
        options: { force?: boolean } = {},
    ): Promise<void> {
        const existingBeforeMerge = previewEntriesByEventId[context.eventId];
        const hasPendingLoad = pendingLoadsByEventId.has(context.eventId);
        const contextChanged = mergePreviewEntryContext(context);
        if (!options.force && existingBeforeMerge) {
            if (
                existingBeforeMerge.status === "resolved"
                || existingBeforeMerge.status === "deleted"
            ) {
                return;
            }

            if (existingBeforeMerge.status === "loading" && hasPendingLoad) {
                await pendingLoadsByEventId.get(context.eventId);
                return;
            }

            if (!contextChanged && existingBeforeMerge.status === "not-found") {
                return;
            }
        }

        if (!options.force && pendingLoadsByEventId.has(context.eventId)) {
            await pendingLoadsByEventId.get(context.eventId);
            return;
        }

        if (options.force) {
            loadTasksByEventId.get(context.eventId)?.cancel();
            loadTasksByEventId.delete(context.eventId);
            pendingLoadsByEventId.delete(context.eventId);
        }

        const activeLifecycleId = lifecycleId;
        const taskPromise = (async () => {
            try {
                setLoading(context);

                const existingRecord = await postHistoryRepositoryImpl.getByEventId(
                    context.eventId,
                );
                if (!isActive(activeLifecycleId)) {
                    return;
                }

                if (existingRecord) {
                    const recordRelayHints = sanitizeRelayHints([
                        ...context.relayHints,
                        ...existingRecord.relayHints,
                        ...existingRecord.acceptedRelays,
                        ...(existingRecord.fetchedRelays ?? []),
                    ]);
                    if (typeof existingRecord.deletedAt === "number") {
                        setDeleted({
                            eventId: existingRecord.eventId,
                            authorPubkey: existingRecord.pubkeyHex,
                            relayHints: recordRelayHints,
                        });
                        return;
                    }

                    const event = toEventFromPostHistoryRecord(existingRecord);
                    setResolved({
                        event,
                        relayHints: recordRelayHints,
                    });
                    void ensureProfileForPubkey(
                        event.pubkey,
                        recordRelayHints,
                        activeLifecycleId,
                    );
                    void ensureDeletedStateForTarget(
                        event,
                        recordRelayHints,
                        activeLifecycleId,
                    );
                    return;
                }

                if (context.authorHint) {
                    const deletedByTombstone = await ensureDeletedStateForTarget(
                        createSyntheticTargetEvent(
                            context.eventId,
                            context.authorHint,
                        ),
                        context.relayHints,
                        activeLifecycleId,
                    );
                    if (!isActive(activeLifecycleId) || deletedByTombstone) {
                        return;
                    }
                }

                const rxNostr = getRxNostr();
                if (!rxNostr) {
                    setError({
                        eventId: context.eventId,
                        authorPubkey: context.authorHint,
                        relayHints: context.relayHints,
                    });
                    return;
                }

                const fetchTask = contextFetchService.fetchEventById(rxNostr, {
                    eventId: context.eventId,
                    relayHints: context.relayHints,
                    relayConfig: getRelayConfig(),
                });
                loadTasksByEventId.set(context.eventId, fetchTask);
                const result = await fetchTask.promise;
                loadTasksByEventId.delete(context.eventId);
                if (!isActive(activeLifecycleId)) {
                    return;
                }

                if (!result.event) {
                    if (context.authorHint) {
                        const deletedAfterFetch = await ensureDeletedStateForTarget(
                            createSyntheticTargetEvent(
                                context.eventId,
                                context.authorHint,
                            ),
                            context.relayHints,
                            activeLifecycleId,
                        );
                        if (!isActive(activeLifecycleId) || deletedAfterFetch) {
                            return;
                        }
                    }

                    setNotFound({
                        eventId: context.eventId,
                        authorPubkey: context.authorHint,
                        relayHints: context.relayHints,
                    });
                    return;
                }

                const resolvedRelayHints = sanitizeRelayHints([
                    ...context.relayHints,
                    ...(result.relayUrl ? [result.relayUrl] : []),
                ]);
                const deletedAfterResolve = await ensureDeletedStateForTarget(
                    result.event,
                    resolvedRelayHints,
                    activeLifecycleId,
                );
                if (!isActive(activeLifecycleId) || deletedAfterResolve) {
                    return;
                }

                setResolved({
                    event: result.event,
                    relayHints: resolvedRelayHints,
                });
                void ensureProfileForPubkey(
                    result.event.pubkey,
                    resolvedRelayHints,
                    activeLifecycleId,
                );
            } catch {
                if (!isActive(activeLifecycleId)) {
                    return;
                }

                setError({
                    eventId: context.eventId,
                    authorPubkey: context.authorHint,
                    relayHints: context.relayHints,
                });
            } finally {
                loadTasksByEventId.delete(context.eventId);
                pendingLoadsByEventId.delete(context.eventId);
            }
        })();

        pendingLoadsByEventId.set(context.eventId, taskPromise);
        await taskPromise;
    }

    function getQuotePreviews(post: PostHistoryRecord): PostHistoryQuotePreviewState[] {
        return (quoteIndex.byPostId[post.eventId] ?? []).map((reference) => {
            const entry = previewEntriesByEventId[reference.eventId];
            const authorPubkey = entry?.authorPubkey ?? reference.authorHint;

            return {
                eventId: reference.eventId,
                status: entry?.status ?? "loading",
                event: entry?.event ?? null,
                profile: authorPubkey ? (profilesByPubkey[authorPubkey] ?? null) : null,
            };
        });
    }

    function retryQuotePreview(eventId: string): void {
        const context = quoteIndex.contextsByEventId[eventId];
        if (!context) {
            return;
        }

        void ensureQuotePreview(context, { force: true });
    }

    $effect(() => {
        if (getShow()) {
            return;
        }

        resetState();
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        quoteIndex = buildQuoteIndex(getPosts());
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        getRxNostr();
        getRelayConfig();
        const contexts = Object.values(quoteIndex.contextsByEventId);
        if (contexts.length === 0) {
            return;
        }

        void Promise.all(
            contexts.map((context) => ensureQuotePreview(context)),
        );
    });

    onDestroy(() => {
        resetState();
    });

    return {
        getQuotePreviews,
        retryQuotePreview,
    };
}