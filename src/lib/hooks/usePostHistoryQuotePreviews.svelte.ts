import { onDestroy, untrack } from "svelte";
import type { RxNostr } from "rx-nostr";
import {
    createPostHistoryRelatedTargetResolver,
    type PostHistoryRelatedTargetResolver,
    type PostHistoryRelatedTargetErrorCode,
    type PostHistoryRelatedTargetSnapshot,
    type PostHistoryRelatedTargetStatus,
    type RelatedTargetDescriptor,
} from "../postHistoryRelatedTargetResolver.svelte";
import {
    postHistoryContextFetchService,
    type PostHistoryContextFetchService,
} from "../postHistoryContextFetchService";
import {
    postHistoryDeletionFetchService,
    type PostHistoryDeletionFetchService,
} from "../postHistoryDeletionFetchService";
import {
    EMPTY_POST_HISTORY_QUOTE_TARGET_INDEX,
    postHistoryQuoteTargetDiscoveryAdapter,
    type PostHistoryQuoteTargetIndex,
} from "../postHistoryRelatedTargetDiscoveryAdapter";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "../storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "../storage/postHistoryRepository";
import type { PostHistoryRecord } from "../storage/ehagakiDb";
import type { NostrEvent, ProfileData, RelayConfig } from "../types";
import type { PostHistoryProfileSyncCoordinator } from "../postHistoryProfileSync";

let nextQuotePreviewResolverScopeId = 0;

export type PostHistoryQuotePreviewStatus =
    | "idle"
    | "loading"
    | "resolved"
    | "not-found"
    | "deleted"
    | "error";

export interface PostHistoryQuotePreviewIdleState {
    eventId: string;
    status: "idle";
}

export interface PostHistoryQuotePreviewLoadingState {
    eventId: string;
    status: "loading";
}

export interface PostHistoryQuotePreviewResolvedState {
    eventId: string;
    status: "resolved";
    event: NostrEvent;
    profile: ProfileData | null;
    relayHints: string[];
}

export interface PostHistoryQuotePreviewNotFoundState {
    eventId: string;
    status: "not-found";
}

export interface PostHistoryQuotePreviewDeletedState {
    eventId: string;
    status: "deleted";
}

export interface PostHistoryQuotePreviewErrorState {
    eventId: string;
    status: "error";
    errorCode: PostHistoryRelatedTargetErrorCode;
}

export type PostHistoryQuotePreviewState =
    | PostHistoryQuotePreviewIdleState
    | PostHistoryQuotePreviewLoadingState
    | PostHistoryQuotePreviewResolvedState
    | PostHistoryQuotePreviewNotFoundState
    | PostHistoryQuotePreviewDeletedState
    | PostHistoryQuotePreviewErrorState;

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
    profileSyncCoordinator?: PostHistoryProfileSyncCoordinator;
    relatedTargetResolver?: PostHistoryRelatedTargetResolver;
}

function toQuotePreviewStatus(
    status: PostHistoryRelatedTargetStatus | undefined,
): PostHistoryQuotePreviewStatus {
    switch (status) {
        case undefined:
            return "idle";
        case "resolved":
        case "not-found":
        case "deleted":
        case "error":
            return status;
        default:
            return "loading";
    }
}

function toQuotePreviewState(
    eventId: string,
    snapshot: PostHistoryRelatedTargetSnapshot | null | undefined,
): PostHistoryQuotePreviewState {
    const status = toQuotePreviewStatus(snapshot?.status);
    switch (status) {
        case "idle":
            return {
                eventId,
                status,
            };
        case "loading":
            return {
                eventId,
                status,
            };
        case "resolved":
            if (snapshot?.event) {
                return {
                    eventId,
                    status,
                    event: snapshot.event,
                    profile: snapshot.profile ?? null,
                    relayHints: snapshot.relayHints,
                };
            }

            return {
                eventId,
                status: "error",
                errorCode: snapshot?.errorCode ?? "fetch_failed",
            };
        case "not-found":
            return {
                eventId,
                status,
            };
        case "deleted":
            return {
                eventId,
                status,
            };
        case "error":
            return {
                eventId,
                status,
                errorCode: snapshot?.errorCode ?? null,
            };
    }
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
    profileSyncCoordinator = undefined,
    relatedTargetResolver = undefined,
}: UsePostHistoryQuotePreviewsParams) {
    const resolver = relatedTargetResolver
        ?? createPostHistoryRelatedTargetResolver({
            getShow,
            getRxNostr,
            getRelayConfig,
            postHistoryRepositoryImpl,
            contextFetchService,
            deletionRequestsRepositoryImpl,
            deletionFetchService,
            profileSyncCoordinator,
        });
    const ownsResolver = !relatedTargetResolver;
    const scopeKey = `post-history-quote-preview:${++nextQuotePreviewResolverScopeId}`;

    let resolverRevision = $state(0);
    let indexedPosts: PostHistoryRecord[] | null = null;
    let quoteIndex = EMPTY_POST_HISTORY_QUOTE_TARGET_INDEX;
    let loadGeneration = 0;

    function getCurrentQuoteIndex() {
        const posts = getPosts();
        if (posts !== indexedPosts) {
            indexedPosts = posts;
            quoteIndex = postHistoryQuoteTargetDiscoveryAdapter.buildIndex(posts);
        }
        return getShow() ? quoteIndex : EMPTY_POST_HISTORY_QUOTE_TARGET_INDEX;
    }

    function resetState(): void {
        if (ownsResolver) {
            resolver.reset();
        }
    }

    function getQuotePreviews(post: PostHistoryRecord): PostHistoryQuotePreviewState[] {
        resolverRevision;

        return (getCurrentQuoteIndex().byPostId[post.eventId] ?? []).map((reference) => {
            return toQuotePreviewState(
                reference.eventId,
                resolver.getTargetSnapshot(reference.eventId, reference),
            );
        });
    }

    function retryQuotePreview(eventId: string): void {
        if (!getShow()) return;
        void resolveQuoteTargets(getCurrentQuoteIndex(), true, eventId);
    }

    async function resolveQuoteTargets(index: PostHistoryQuoteTargetIndex, force = false, eventId?: string): Promise<void> {
        const generation = loadGeneration;
        const byTarget = new Map<string, RelatedTargetDescriptor[]>();
        for (const [sourceEventId, references] of Object.entries(index.byPostId)) {
            for (const reference of references) {
                if (eventId && reference.eventId !== eventId) continue;
                const context = index.contextsByEventId[reference.eventId];
                const descriptor = postHistoryQuoteTargetDiscoveryAdapter.toDescriptor({ ...context,
                    sourceEventId, authorHint: reference.authorHint }, scopeKey);
                byTarget.set(reference.eventId, [...(byTarget.get(reference.eventId) ?? []), descriptor]);
            }
        }
        await Promise.all([...byTarget.values()].map(async candidates => {
            for (let attempt = 0; attempt < candidates.length; attempt++) {
                if (!getShow() || generation !== loadGeneration) return;
                const descriptor = candidates[attempt];
                const snapshot = resolver.getTargetSnapshot(descriptor.targetEventId);
                const result = await resolver.ensureTarget(descriptor, { force: attempt === 0 ? force : snapshot?.status !== 'resolved' });
                if (result?.status === 'resolved' || result?.status === 'deleted') return;
                if (result?.status !== 'not-found' && result?.errorCode !== 'invalid_event') return;
            }
        }));
    }

    async function refreshQuotePreviews(posts: PostHistoryRecord[]): Promise<void> {
        if (!getShow()) return;
        await resolveQuoteTargets(postHistoryQuoteTargetDiscoveryAdapter.buildIndex(posts), true);
    }

    $effect(() => {
        if (!getShow()) {
            return;
        }

        resolverRevision = resolver.getScopeRevision(scopeKey);
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        getRxNostr();
        getRelayConfig();
        const index = getCurrentQuoteIndex();
        loadGeneration++;
        untrack(() => { void resolveQuoteTargets(index); });
        return () => { loadGeneration++; resolver.invalidateScope(scopeKey); };
    });

    onDestroy(() => {
        loadGeneration++;
        resolver.invalidateScope(scopeKey);
        resetState();
    });

    return {
        getQuotePreviews,
        retryQuotePreview,
        refreshQuotePreviews,
        suspend: () => { loadGeneration++; resolver.invalidateScope(scopeKey); },
    };
}
