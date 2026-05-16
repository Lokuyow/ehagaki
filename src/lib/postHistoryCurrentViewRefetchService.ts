import type { RxNostr } from "rx-nostr";
import {
    POST_HISTORY_REPAIR_FETCH_LIMIT,
    POST_HISTORY_REPAIR_FETCH_TIMEOUT_MS,
    postHistoryRelayFetchService,
    type PostHistoryRelayFetchResult,
    type PostHistoryRelayFetchTask,
} from "./postHistoryRelayFetchService";
import { postHistoryRepository, type PostHistoryRepository } from "./storage/postHistoryRepository";
import type { RelayConfig } from "./types";

export const POST_HISTORY_CURRENT_VIEW_REFETCH_DELAY_MS = 500;
const POST_HISTORY_CURRENT_VIEW_REFETCH_MAX_RANGE_COUNT = 12;
const POST_HISTORY_CURRENT_VIEW_REFETCH_MIN_RANGE_SECONDS = 60 * 60;

export interface PostHistoryCurrentViewRefetchParams {
    pubkeyHex: string;
    relayConfig?: RelayConfig | null;
    preferredRanges: PostHistoryCurrentViewRefetchRange[];
    onProgress?: (
        progress: PostHistoryCurrentViewRefetchProgress,
    ) => void | Promise<void>;
}

export interface PostHistoryCurrentViewRefetchProgress {
    insertedCount: number;
    updatedCount: number;
    unchangedCount: number;
    processedRangeCount: number;
    attemptedRangeCount: number;
    addedCount: number;
    totalUpdatedCount: number;
    totalUnchangedCount: number;
}

export interface PostHistoryCurrentViewRefetchResult {
    status: "success" | "partial" | "cancelled";
    addedCount: number;
    updatedCount: number;
    unchangedCount: number;
    processedRangeCount: number;
    attemptedRangeCount: number;
    hadFailures: boolean;
    limitReached: boolean;
    hadFetchError: boolean;
    fetchFailed: boolean;
    hadTimeout: boolean;
    hadUnfinishedRanges: boolean;
    splitRetryCount: number;
    processedRanges: PostHistoryCurrentViewProcessedRangeSummary[];
}

export type PostHistoryCurrentViewProcessedRangeStatus =
    | "complete"
    | "partial"
    | "limit"
    | "timeout"
    | "error"
    | "cancelled";

export interface PostHistoryCurrentViewProcessedRangeSummary {
    source: "preferred";
    rangeUnit: "custom";
    since?: number;
    until?: number;
    requestedRelayUrls: string[];
    observedRelayUrls: string[];
    eventRelayUrls: string[];
    eoseRelayUrls: string[];
    closedRelayUrls: string[];
    errorRelayUrls: string[];
    downRelayUrls: string[];
    completedByRxNostr: boolean;
    completedByLocalTimeout: boolean;
    hasAnyRelayResponse: boolean;
    allRelaysFailed: boolean;
    status: PostHistoryCurrentViewProcessedRangeStatus;
    rawCount: number;
    uniqueCount: number;
    duplicateCount: number;
    insertedCount: number;
    updatedCount: number;
    unchangedCount: number;
}

export interface PostHistoryCurrentViewRefetchTask {
    promise: Promise<PostHistoryCurrentViewRefetchResult>;
    cancel: () => void;
}

export interface PostHistoryCurrentViewRefetchRange {
    kinds: number[];
    rangeUnit: "custom";
    since?: number;
    until?: number;
    limit: number;
}

interface QueuedCurrentViewRefetchRange extends PostHistoryCurrentViewRefetchRange {
    splitDepth: number;
}

export interface PostHistoryCurrentViewRefetchServiceDeps {
    postHistoryRelayFetchService?: Pick<typeof postHistoryRelayFetchService, "fetchLatest">;
    postHistoryRepository?: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    setTimeoutFn?: typeof setTimeout;
    clearTimeoutFn?: typeof clearTimeout;
    console?: Pick<Console, "debug">;
}

function resolveProcessedRangeStatus(
    result: PostHistoryRelayFetchResult,
    limit: number,
): PostHistoryCurrentViewProcessedRangeStatus {
    if (
        result.status === "timeout"
        || result.status === "error"
        || result.status === "cancelled"
    ) {
        return result.status;
    }

    if (result.hasMore) {
        return "partial";
    }

    if (result.perRelayCounts.some((item) => item.rawCount >= limit)) {
        return "partial";
    }

    return "complete";
}

function didCurrentViewRefetchFail(
    status: PostHistoryCurrentViewProcessedRangeStatus,
): boolean {
    return status === "partial";
}

function didResultHitLimit(
    result: PostHistoryRelayFetchResult,
    limit: number,
): boolean {
    return result.hasMore || result.perRelayCounts.some((item) => item.rawCount >= limit);
}

function canSplitCurrentViewRange(
    range: PostHistoryCurrentViewRefetchRange,
): range is PostHistoryCurrentViewRefetchRange & { since: number; until: number } {
    return typeof range.since === "number"
        && typeof range.until === "number"
        && range.until - range.since > POST_HISTORY_CURRENT_VIEW_REFETCH_MIN_RANGE_SECONDS;
}

function splitCurrentViewRange(
    range: QueuedCurrentViewRefetchRange,
): QueuedCurrentViewRefetchRange[] {
    if (!canSplitCurrentViewRange(range)) {
        return [];
    }

    const mid = Math.floor((range.since + range.until) / 2);
    if (mid < range.since || mid + 1 > range.until) {
        return [];
    }

    return [
        {
            ...range,
            until: mid,
            splitDepth: range.splitDepth + 1,
        },
        {
            ...range,
            since: mid + 1,
            splitDepth: range.splitDepth + 1,
        },
    ];
}

export class PostHistoryCurrentViewRefetchService {
    private postHistoryRelayFetchService: Pick<typeof postHistoryRelayFetchService, "fetchLatest">;
    private postHistoryRepository: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    private setTimeoutFn: typeof setTimeout;
    private clearTimeoutFn: typeof clearTimeout;
    private console: Pick<Console, "debug">;

    constructor(deps: PostHistoryCurrentViewRefetchServiceDeps = {}) {
        this.postHistoryRelayFetchService = deps.postHistoryRelayFetchService ?? postHistoryRelayFetchService;
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.setTimeoutFn = deps.setTimeoutFn ?? setTimeout;
        this.clearTimeoutFn = deps.clearTimeoutFn ?? clearTimeout;
        this.console = deps.console ?? (typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { debug: () => undefined });
    }

    private async waitBetweenFetches(
        registerDelayCancel: (cancel: (() => void) | null) => void,
    ): Promise<void> {
        if (POST_HISTORY_CURRENT_VIEW_REFETCH_DELAY_MS <= 0) {
            return;
        }

        await new Promise<void>((resolve) => {
            const timeoutId = this.setTimeoutFn(() => {
                registerDelayCancel(null);
                resolve();
            }, POST_HISTORY_CURRENT_VIEW_REFETCH_DELAY_MS);
            registerDelayCancel(() => {
                this.clearTimeoutFn(timeoutId);
                registerDelayCancel(null);
                resolve();
            });
        });
    }

    refetchAroundCurrentView(
        rxNostr: RxNostr,
        params: PostHistoryCurrentViewRefetchParams,
    ): PostHistoryCurrentViewRefetchTask {
        let cancelled = false;
        let currentFetchTask: PostHistoryRelayFetchTask | null = null;
        let currentDelayCancel: (() => void) | null = null;
        const preferredQueue: QueuedCurrentViewRefetchRange[] = params.preferredRanges.map((range) => ({
            kinds: [...range.kinds],
            rangeUnit: range.rangeUnit,
            ...(typeof range.since === "number" ? { since: range.since } : {}),
            ...(typeof range.until === "number" ? { until: range.until } : {}),
            limit: range.limit,
            splitDepth: 0,
        }));

        const promise = (async (): Promise<PostHistoryCurrentViewRefetchResult> => {
            let addedCount = 0;
            let updatedCount = 0;
            let unchangedCount = 0;
            let attemptedRangeCount = 0;
            let hadFailures = false;
            let limitReached = false;
            let hadFetchError = false;
            let hadTimeout = false;
            let hadUnfinishedRanges = false;
            let splitRetryCount = 0;
            let receivedEventCount = 0;
            let allAttemptedRangesClearlyFailed = true;
            const processedRanges: PostHistoryCurrentViewProcessedRangeSummary[] = [];

            while (preferredQueue.length > 0) {
                const range = preferredQueue.shift() as QueuedCurrentViewRefetchRange;
                if (cancelled) {
                    break;
                }

                if (attemptedRangeCount > 0) {
                    await this.waitBetweenFetches((cancelDelay) => {
                        currentDelayCancel = cancelDelay;
                    });
                }

                if (cancelled) {
                    break;
                }

                const fetchTask = this.postHistoryRelayFetchService.fetchLatest(rxNostr, {
                    pubkeyHex: params.pubkeyHex,
                    relayConfig: params.relayConfig,
                    reason: "repair-visible-range",
                    kinds: range.kinds,
                    limit: range.limit || POST_HISTORY_REPAIR_FETCH_LIMIT,
                    timeoutMs: POST_HISTORY_REPAIR_FETCH_TIMEOUT_MS,
                    ...(typeof range.since === "number" ? { since: range.since } : {}),
                    ...(typeof range.until === "number" ? { until: range.until } : {}),
                });
                currentFetchTask = fetchTask;

                const result = await fetchTask.promise;
                currentFetchTask = null;
                attemptedRangeCount += 1;
                receivedEventCount += result.events.length;
                hadFetchError = hadFetchError || result.status === "error";
                hadTimeout = hadTimeout || result.status === "timeout";
                const rangeClearlyFailed = result.events.length === 0
                    && !result.hasAnyRelayResponse
                    && (result.allRelaysFailed || result.status === "error");
                allAttemptedRangesClearlyFailed = allAttemptedRangesClearlyFailed && rangeClearlyFailed;

                let insertedCount = 0;
                let rangeUpdatedCount = 0;
                let rangeUnchangedCount = 0;

                if (result.events.length > 0) {
                    const upsertSummary = await this.postHistoryRepository.upsertFetchedEvents({
                        events: result.events,
                        fetchedAt: result.fetchedAt,
                    });
                    insertedCount = upsertSummary.insertedCount;
                    rangeUpdatedCount = upsertSummary.updatedCount;
                    rangeUnchangedCount = upsertSummary.unchangedCount;
                    addedCount += insertedCount;
                    updatedCount += rangeUpdatedCount;
                    unchangedCount += rangeUnchangedCount;

                    await params.onProgress?.({
                        insertedCount,
                        updatedCount: rangeUpdatedCount,
                        unchangedCount: rangeUnchangedCount,
                        processedRangeCount: processedRanges.length + 1,
                        attemptedRangeCount,
                        addedCount,
                        totalUpdatedCount: updatedCount,
                        totalUnchangedCount: unchangedCount,
                    });
                }

                const hitLimit = didResultHitLimit(result, range.limit);
                limitReached = limitReached || hitLimit;
                const splitRanges = hitLimit ? splitCurrentViewRange(range) : [];
                const canQueueSplit = splitRanges.length > 0
                    && processedRanges.length + 1 + preferredQueue.length + splitRanges.length
                        <= POST_HISTORY_CURRENT_VIEW_REFETCH_MAX_RANGE_COUNT;
                const processedStatus: PostHistoryCurrentViewProcessedRangeStatus = hitLimit
                    ? "limit"
                    : resolveProcessedRangeStatus(result, range.limit);
                processedRanges.push({
                    source: "preferred",
                    rangeUnit: range.rangeUnit,
                    ...(typeof range.since === "number" ? { since: range.since } : {}),
                    ...(typeof range.until === "number" ? { until: range.until } : {}),
                    requestedRelayUrls: [...result.requestedRelayUrls],
                    observedRelayUrls: [...result.observedRelayUrls],
                    eventRelayUrls: [...result.eventRelayUrls],
                    eoseRelayUrls: [...result.eoseRelayUrls],
                    closedRelayUrls: [...result.closedRelayUrls],
                    errorRelayUrls: [...result.errorRelayUrls],
                    downRelayUrls: [...result.downRelayUrls],
                    completedByRxNostr: result.completedByRxNostr,
                    completedByLocalTimeout: result.completedByLocalTimeout,
                    hasAnyRelayResponse: result.hasAnyRelayResponse,
                    allRelaysFailed: result.allRelaysFailed,
                    status: processedStatus,
                    rawCount: result.rawCount,
                    uniqueCount: result.uniqueCount,
                    duplicateCount: result.duplicateCount,
                    insertedCount,
                    updatedCount: rangeUpdatedCount,
                    unchangedCount: rangeUnchangedCount,
                });

                if (hitLimit && canQueueSplit) {
                    splitRetryCount += splitRanges.length;
                    preferredQueue.unshift(...splitRanges);
                } else if (hitLimit) {
                    hadUnfinishedRanges = true;
                }

                const didRangeFail = didCurrentViewRefetchFail(processedStatus)
                    || rangeClearlyFailed
                    || (hitLimit && !canQueueSplit);
                if (didRangeFail) {
                    hadFailures = true;
                }

                if (cancelled || result.status === "cancelled") {
                    cancelled = true;
                    break;
                }
            }

            const fetchFailed = !cancelled
                && attemptedRangeCount > 0
                && receivedEventCount === 0
                && allAttemptedRangesClearlyFailed;
            const finalHadFailures = hadFailures || hadUnfinishedRanges || fetchFailed;
            const status: PostHistoryCurrentViewRefetchResult["status"] = cancelled
                ? "cancelled"
                : finalHadFailures
                    ? "partial"
                    : "success";

            const summary: PostHistoryCurrentViewRefetchResult = {
                status,
                addedCount,
                updatedCount,
                unchangedCount,
                processedRangeCount: processedRanges.length,
                attemptedRangeCount,
                hadFailures: finalHadFailures,
                limitReached,
                hadFetchError,
                fetchFailed,
                hadTimeout,
                hadUnfinishedRanges,
                splitRetryCount,
                processedRanges,
            };

            this.console.debug("post_history_current_view_refetch_summary", {
                pubkeyHex: params.pubkeyHex,
                processedRangeCount: summary.processedRangeCount,
                addedCount: summary.addedCount,
                updatedCount: summary.updatedCount,
                hadFailures: summary.hadFailures,
                limitReached: summary.limitReached,
                hadFetchError: summary.hadFetchError,
                fetchFailed: summary.fetchFailed,
                hadTimeout: summary.hadTimeout,
                hadUnfinishedRanges: summary.hadUnfinishedRanges,
                splitRetryCount: summary.splitRetryCount,
                processedRanges: summary.processedRanges,
            });

            return summary;
        })();

        return {
            promise,
            cancel: () => {
                cancelled = true;
                currentDelayCancel?.();
                currentFetchTask?.cancel();
            },
        };
    }
}

export const postHistoryCurrentViewRefetchService = new PostHistoryCurrentViewRefetchService();
