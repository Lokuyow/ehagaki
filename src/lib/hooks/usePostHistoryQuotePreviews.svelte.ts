import { onDestroy } from "svelte";
import type { RxNostr } from "rx-nostr";
import {
    createPostHistoryRelatedTargetResolver,
    type PostHistoryRelatedTargetResolver,
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
import type { NostrEvent, ProfileData, RelayConfig } from "../types";

const POST_HISTORY_QUOTE_PREVIEW_RELAY_LIMIT = 8;
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

interface QuoteLoadContext {
    eventId: string;
    sourceEventId: string;
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

function sanitizeRelayHints(relayHints: string[]): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relayHints, {
        limit: POST_HISTORY_QUOTE_PREVIEW_RELAY_LIMIT,
    });
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
                sourceEventId: existing?.sourceEventId ?? post.eventId,
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
    let quoteIndex = $state<QuoteIndex>(EMPTY_QUOTE_INDEX);

    function toDescriptor(context: QuoteLoadContext): RelatedTargetDescriptor {
        return {
            sourceEventId: context.sourceEventId,
            targetEventId: context.eventId,
            relationKind: "quote",
            relayHints: context.relayHints,
            authorHint: context.authorHint,
            scopeKey,
        };
    }

    function resetState(): void {
        quoteIndex = EMPTY_QUOTE_INDEX;
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

        void resolver.retryTarget(toDescriptor(context));
    }

    $effect(() => {
        if (getShow()) {
            return;
        }

        quoteIndex = EMPTY_QUOTE_INDEX;
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

        void resolver.ensureTargets(contexts.map((context) => toDescriptor(context)));
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