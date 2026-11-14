import type { PostHistoryRelayFetchResult } from "./postHistoryRelayFetchService";
import type { PostHistoryRecord } from "./storage/ehagakiDb";

export interface OlderBackfillSearchRange {
    since: number;
    until: number;
    windowSeconds: number;
}

export interface OlderBackfillLastRange extends OlderBackfillSearchRange {
    hitLimit: boolean;
}

export interface OlderBackfillSearchState {
    windowSeconds: number;
    nextUntil: number | null;
    consecutiveEmptyCount: number;
    lastRange: OlderBackfillLastRange | null;
    continuationSince: number | null;
    exhausted: boolean;
}

export interface OlderVisiblePostsMergeResult {
    posts: PostHistoryRecord[];
    didTrimForOlderAppend: boolean;
    didDeferOlderPosts: boolean;
}

export interface MergeOlderVisiblePostsParams {
    currentPosts: PostHistoryRecord[];
    olderPosts: PostHistoryRecord[];
    anchorEventId?: string | null;
    maxVisiblePosts: number;
    keepAbove: number;
}

export interface OlderBackfillUiResult {
    changed: boolean;
    didTrimForOlderAppend: boolean;
    didDeferOlderPosts: boolean;
    loadedPostsBeforeLength: number;
    loadedPostsAfterLength: number;
    maxVisiblePosts: number;
    autoRetryCount: number;
    autoRetryReason: string | null;
    attemptIndex: number;
    maxAttempts: number;
    clickStartVisibleCount: number;
    currentVisibleCount: number;
    totalVisibleAdded: number;
    targetVisibleAdded: number;
    shouldContinueForSmallBatch: boolean;
    exploredSeconds: number;
    maxExploreSeconds: number;
}

export function resolveFetchedAuthoredEventIds(
    events: Array<{ event?: { id?: string } }>,
): string[] {
    return events
        .map((item) => item.event?.id)
        .filter((eventId): eventId is string => !!eventId);
}

export function mergeOlderVisiblePosts({
    currentPosts,
    olderPosts,
    anchorEventId = null,
    maxVisiblePosts,
    keepAbove,
}: MergeOlderVisiblePostsParams): OlderVisiblePostsMergeResult {
    const mergedPosts = [...currentPosts, ...olderPosts];
    if (mergedPosts.length <= maxVisiblePosts) {
        return {
            posts: mergedPosts,
            didTrimForOlderAppend: false,
            didDeferOlderPosts: false,
        };
    }

    if (currentPosts.length < maxVisiblePosts) {
        const availableSlots = Math.max(0, maxVisiblePosts - currentPosts.length);
        const appendedOlderPosts = olderPosts.slice(0, availableSlots);

        return {
            posts: [...currentPosts, ...appendedOlderPosts],
            didTrimForOlderAppend: false,
            didDeferOlderPosts: appendedOlderPosts.length < olderPosts.length,
        };
    }

    const anchorIndex = typeof anchorEventId === "string"
        ? mergedPosts.findIndex((post) => post.eventId === anchorEventId)
        : -1;

    const buildTrimmedResult = (startIndex: number): OlderVisiblePostsMergeResult => {
        const trimmed = mergedPosts.slice(startIndex, startIndex + maxVisiblePosts);
        const includedOlderCount = Math.max(
            0,
            trimmed.length - Math.max(0, currentPosts.length - startIndex),
        );

        return {
            posts: trimmed,
            didTrimForOlderAppend: true,
            didDeferOlderPosts: includedOlderCount < olderPosts.length,
        };
    };

    if (anchorIndex < 0) {
        return buildTrimmedResult(mergedPosts.length - maxVisiblePosts);
    }

    const maxStartIndex = Math.max(0, mergedPosts.length - maxVisiblePosts);
    const startIndex = Math.min(
        maxStartIndex,
        Math.max(0, anchorIndex - keepAbove),
    );

    return buildTrimmedResult(startIndex);
}

export function resolveNewlyVisibleOlderPosts(
    currentPosts: Array<Pick<PostHistoryRecord, "eventId">>,
    nextPosts: PostHistoryRecord[],
): PostHistoryRecord[] {
    const currentPostIds = new Set(currentPosts.map((post) => post.eventId));

    return nextPosts.filter((post) => !currentPostIds.has(post.eventId));
}

export const POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS = 12 * 60 * 60;
// Keep expanded scans bounded so older-backfill stays a windowed author query instead of drifting back to a wide until-only search.
export const POST_HISTORY_OLDER_BACKFILL_MIN_CONTINUATION_SECONDS = 60 * 60;
export const POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE = [
    12 * 60 * 60,
    24 * 60 * 60,
    3 * 24 * 60 * 60,
    7 * 24 * 60 * 60,
    14 * 24 * 60 * 60,
    30 * 24 * 60 * 60,
] as const;
export const POST_HISTORY_OLDER_BACKFILL_MAX_ATTEMPTS_PER_CLICK = 6;
export const POST_HISTORY_OLDER_BACKFILL_MAX_AUTO_EXPLORE_SECONDS =
    30 * 24 * 60 * 60;

export interface ResolveOlderBackfillAutoRetryDecisionParams {
    status: PostHistoryRelayFetchResult["status"];
    changed: boolean;
    didCursorAdvanceOlder: boolean;
    hitLimit: boolean;
    continuedWithinWindow: boolean;
    attemptIndex: number;
    maxAttempts: number;
    totalVisibleAdded: number;
    targetVisibleAdded: number;
    exploredSeconds: number;
    maxExploreSeconds: number;
}

export interface ResolveOlderBackfillAutoRetryDecisionResult {
    shouldContinue: boolean;
    reason: string;
}

export function resolveOlderBackfillAutoRetryDecision({
    status,
    changed,
    didCursorAdvanceOlder,
    hitLimit,
    continuedWithinWindow,
    attemptIndex,
    maxAttempts,
    totalVisibleAdded,
    targetVisibleAdded,
    exploredSeconds,
    maxExploreSeconds,
}: ResolveOlderBackfillAutoRetryDecisionParams): ResolveOlderBackfillAutoRetryDecisionResult {
    if (status !== "success") {
        return {
            shouldContinue: false,
            reason: `status-${status}`,
        };
    }

    if (!didCursorAdvanceOlder) {
        return {
            shouldContinue: false,
            reason: "cursor-not-advanced",
        };
    }

    if (hitLimit && !continuedWithinWindow) {
        return {
            shouldContinue: false,
            reason: "hit-limit-continuation-unavailable",
        };
    }

    if (totalVisibleAdded >= targetVisibleAdded) {
        return {
            shouldContinue: false,
            reason: "target-visible-added-reached",
        };
    }

    if (exploredSeconds >= maxExploreSeconds) {
        return {
            shouldContinue: false,
            reason: "max-explore-seconds-reached",
        };
    }

    if (attemptIndex >= maxAttempts) {
        return {
            shouldContinue: false,
            reason: "max-attempts-reached",
        };
    }

    return {
        shouldContinue: true,
        reason: changed
            ? "small-batch-continue"
            : "empty-window-continue",
    };
}

interface ResolvePostHistoryOlderRelayFetchUntilParams {
    nextUntil: number | null;
    visibleOldestCreatedAt: number | null;
    pubkeyHex: string;
    getOldestCreatedAt: (pubkeyHex: string) => Promise<number | null>;
    getNowSeconds?: () => number;
}

export async function resolvePostHistoryOlderRelayFetchUntil({
    nextUntil,
    visibleOldestCreatedAt,
    pubkeyHex,
    getOldestCreatedAt,
    getNowSeconds = () => Math.floor(Date.now() / 1000),
}: ResolvePostHistoryOlderRelayFetchUntilParams): Promise<number | null> {
    if (typeof nextUntil === "number") {
        return nextUntil;
    }

    if (typeof visibleOldestCreatedAt === "number") {
        return visibleOldestCreatedAt;
    }

    const dbOldestCreatedAt = await getOldestCreatedAt(pubkeyHex);
    if (typeof dbOldestCreatedAt === "number") {
        return dbOldestCreatedAt;
    }

    const nowSeconds = getNowSeconds();
    return Number.isFinite(nowSeconds) ? nowSeconds : null;
}

export function resolveOlderBackfillLimitHitReasons(
    result: PostHistoryRelayFetchResult,
    limit: number,
): string[] {
    const reasons: string[] = [];

    if (result.hasMore) {
        reasons.push("hasMore");
    }

    if (result.rawCount >= limit) {
        reasons.push("rawCount");
    }

    if (result.perRelayCounts.some((item) => item.rawCount >= limit)) {
        reasons.push("perRelayRawCount");
    }

    return reasons;
}

export function resolveOldestCreatedAtFromFetchResult(
    result: PostHistoryRelayFetchResult,
): number | null {
    if (typeof result.oldestCreatedAt === "number") {
        return result.oldestCreatedAt;
    }

    return result.events.reduce<number | null>((oldest, item) => {
        const createdAt = item.event.created_at;
        if (!Number.isFinite(createdAt)) {
            return oldest;
        }

        return oldest === null || createdAt < oldest
            ? Math.trunc(createdAt)
            : oldest;
    }, null);
}
