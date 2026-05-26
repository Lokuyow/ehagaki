import { onDestroy } from "svelte";
import type { RxNostr } from "rx-nostr";
import {
    createPostHistoryRelatedTargetResolver,
    type PostHistoryRelatedTargetResolver,
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
import {
    profilesRepository,
    type ProfilesRepository,
} from "../storage/profilesRepository";
import type { PostHistoryRecord } from "../storage/ehagakiDb";
import type { NostrEvent, ProfileData, RelayConfig } from "../types";

let nextQuotePreviewResolverScopeId = 0;

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
    relatedTargetResolver?: PostHistoryRelatedTargetResolver;
}

function toQuotePreviewStatus(
    status: PostHistoryRelatedTargetStatus | undefined,
): PostHistoryQuotePreviewStatus {
    switch (status) {
        case "resolved":
        case "not-found":
        case "deleted":
        case "error":
            return status;
        default:
            return "loading";
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
    profilesRepositoryImpl = profilesRepository,
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
            profilesRepositoryImpl,
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
            const snapshot = resolver.getTargetSnapshot(reference.eventId);

            return {
                eventId: reference.eventId,
                status: toQuotePreviewStatus(snapshot?.status),
                event: snapshot?.event ?? null,
                profile: snapshot?.profile ?? null,
            };
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
    };
}