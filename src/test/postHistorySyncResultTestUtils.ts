import type { PostHistoryInboundInteractionsSyncResult } from "../lib/postHistoryInboundInteractionsSyncService";
import type { PostHistoryRelayFetchResult } from "../lib/postHistoryRelayFetchService";
import type { NostrEvent } from "../lib/types";

export type PostHistoryInboundInteractionsSyncResultFixture = PostHistoryInboundInteractionsSyncResult & {
    savedParentEventIds: string[];
};

export type PostHistoryAuthoredSyncResultFixture = {
    fetchResult: PostHistoryRelayFetchResult;
    upsertSummary: { insertedCount: number; updatedCount: number; unchangedCount: number };
    savedSelfPostEventIds: string[];
};

export function createAuthoredFetchResult(
    event: NostrEvent,
    overrides: Partial<PostHistoryRelayFetchResult> = {},
    defaults: Partial<PostHistoryRelayFetchResult> = {},
): PostHistoryRelayFetchResult {
    return {
        status: "success",
        events: [{ event, relayUrls: [] }],
        fetchedAt: 1_000,
        nextUntil: null,
        hasMore: false,
        relayUrls: [],
        observedRelayUrls: [],
        rawCount: 1,
        uniqueCount: 1,
        duplicateCount: 0,
        perRelayCounts: [],
        oldestCreatedAt: event.created_at,
        newestCreatedAt: event.created_at,
        requestedRelayUrls: [],
        eventRelayUrls: [],
        eoseRelayUrls: [],
        closedRelayUrls: [],
        errorRelayUrls: [],
        downRelayUrls: [],
        completedByRxNostr: true,
        completedByLocalTimeout: false,
        hasAnyRelayResponse: true,
        allRelaysFailed: false,
        ...defaults,
        ...overrides,
    };
}

export function createAuthoredSyncResult(
    event: NostrEvent,
    overrides: Partial<PostHistoryRelayFetchResult> = {},
    defaults: Partial<PostHistoryRelayFetchResult> = {},
): PostHistoryAuthoredSyncResultFixture {
    const fetchResult = createAuthoredFetchResult(event, overrides, defaults);

    return {
        fetchResult,
        upsertSummary: { insertedCount: 1, updatedCount: 0, unchangedCount: 0 },
        savedSelfPostEventIds: [event.id],
    };
}

export function createInboundSyncResult(
    overrides: Partial<PostHistoryInboundInteractionsSyncResultFixture> = {},
    defaults: Partial<PostHistoryInboundInteractionsSyncResultFixture> = {},
): PostHistoryInboundInteractionsSyncResultFixture {
    return {
        status: "success",
        fetchedAt: 1_000,
        since: 10,
        limit: 100,
        relayUrls: [],
        rawCount: 0,
        uniqueCount: 0,
        saturated: false,
        maybeIncomplete: false,
        newestSeenCreatedAt: null,
        changedParentEventIds: [],
        savedDirectReplyCount: 0,
        savedParentEventIds: [],
        classifications: {
            "direct-reply": 0,
            "direct-reply-candidate": 0,
            "mention-like": 0,
            reaction: 0,
            unsupported: 0,
        },
        ...defaults,
        ...overrides,
    };
}
