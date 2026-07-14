import { onDestroy } from "svelte";
import type { RxNostr } from "rx-nostr";
import {
    createPostHistoryRelatedTargetResolver,
    type PostHistoryRelatedTargetResolver,
    type PostHistoryRelatedTargetErrorCode,
    type PostHistoryRelatedTargetSnapshot,
    type PostHistoryRelatedTargetStatus,
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
    type PostHistoryQuoteTargetContext,
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
    let quoteIndex = $state<PostHistoryQuoteTargetIndex>(EMPTY_POST_HISTORY_QUOTE_TARGET_INDEX);

    function resetState(): void {
        quoteIndex = EMPTY_POST_HISTORY_QUOTE_TARGET_INDEX;
        if (ownsResolver) {
            resolver.reset();
        }
    }

    function getQuotePreviews(post: PostHistoryRecord): PostHistoryQuotePreviewState[] {
        resolverRevision;

        return (quoteIndex.byPostId[post.eventId] ?? []).map((reference) => {
            return toQuotePreviewState(
                reference.eventId,
                resolver.getTargetSnapshot(reference.eventId),
            );
        });
    }

    function retryQuotePreview(eventId: string): void {
        const context = quoteIndex.contextsByEventId[eventId];
        if (!context) {
            return;
        }

        void resolver.retryTarget(
            postHistoryQuoteTargetDiscoveryAdapter.toDescriptor(context, scopeKey),
        );
    }

    async function refreshQuotePreviews(posts: PostHistoryRecord[]): Promise<void> {
        const index = postHistoryQuoteTargetDiscoveryAdapter.buildIndex(posts);
        const contexts = Object.values(index.contextsByEventId);
        if (contexts.length === 0) {
            return;
        }

        await resolver.ensureTargets(
            contexts.map((context) =>
                postHistoryQuoteTargetDiscoveryAdapter.toDescriptor(context, scopeKey),
            ),
            {
                force: true,
            },
        );
    }

    $effect(() => {
        if (getShow()) {
            return;
        }

        quoteIndex = EMPTY_POST_HISTORY_QUOTE_TARGET_INDEX;
    });

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

        quoteIndex = postHistoryQuoteTargetDiscoveryAdapter.buildIndex(getPosts());
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

        void resolver.ensureTargets(
            contexts.map((context) =>
                postHistoryQuoteTargetDiscoveryAdapter.toDescriptor(context, scopeKey),
            ),
        );
    });

    onDestroy(() => {
        resolver.invalidateScope(scopeKey);
        resetState();
    });

    return {
        getQuotePreviews,
        retryQuotePreview,
        refreshQuotePreviews,
    };
}
