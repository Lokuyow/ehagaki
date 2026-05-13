import type { RxNostr } from "rx-nostr";
import {
    postHistoryRelayFetchService,
    type PostHistoryRelayFetchResult,
    type PostHistoryRelayFetchTask,
} from "./postHistoryRelayFetchService";
import { postHistoryRepository, type PostHistoryRepository } from "./storage/postHistoryRepository";
import type { RelayConfig } from "./types";

export const POST_HISTORY_CURRENT_VIEW_REFETCH_DELAY_MS = 500;

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
    processedRanges: PostHistoryCurrentViewProcessedRangeSummary[];
}

export type PostHistoryCurrentViewProcessedRangeStatus =
    | "complete"
    | "partial"
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
    return status !== "complete" && status !== "cancelled";
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
        const preferredQueue = params.preferredRanges.map((range) => ({
            kinds: [...range.kinds],
            rangeUnit: range.rangeUnit,
            ...(typeof range.since === "number" ? { since: range.since } : {}),
            ...(typeof range.until === "number" ? { until: range.until } : {}),
            limit: range.limit,
        }));

        const promise = (async (): Promise<PostHistoryCurrentViewRefetchResult> => {
            let addedCount = 0;
            let updatedCount = 0;
            let unchangedCount = 0;
            let attemptedRangeCount = 0;
            let hadFailures = false;
            const processedRanges: PostHistoryCurrentViewProcessedRangeSummary[] = [];

            for (const range of preferredQueue) {
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
                    kinds: range.kinds,
                    limit: range.limit,
                    ...(typeof range.since === "number" ? { since: range.since } : {}),
                    ...(typeof range.until === "number" ? { until: range.until } : {}),
                });
                currentFetchTask = fetchTask;

                const result = await fetchTask.promise;
                currentFetchTask = null;
                attemptedRangeCount += 1;

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

                const processedStatus = resolveProcessedRangeStatus(result, range.limit);
                processedRanges.push({
                    source: "preferred",
                    rangeUnit: range.rangeUnit,
                    ...(typeof range.since === "number" ? { since: range.since } : {}),
                    ...(typeof range.until === "number" ? { until: range.until } : {}),
                    requestedRelayUrls: [...result.relayUrls],
                    observedRelayUrls: [...result.observedRelayUrls],
                    status: processedStatus,
                    rawCount: result.rawCount,
                    uniqueCount: result.uniqueCount,
                    duplicateCount: result.duplicateCount,
                    insertedCount,
                    updatedCount: rangeUpdatedCount,
                    unchangedCount: rangeUnchangedCount,
                });

                if (didCurrentViewRefetchFail(processedStatus)) {
                    hadFailures = true;
                }

                if (cancelled || result.status === "cancelled") {
                    cancelled = true;
                    break;
                }
            }

            const status: PostHistoryCurrentViewRefetchResult["status"] = cancelled
                ? "cancelled"
                : hadFailures
                    ? "partial"
                    : "success";

            const summary: PostHistoryCurrentViewRefetchResult = {
                status,
                addedCount,
                updatedCount,
                unchangedCount,
                processedRangeCount: processedRanges.length,
                attemptedRangeCount,
                hadFailures,
                processedRanges,
            };

            this.console.debug("post_history_current_view_refetch_summary", {
                pubkeyHex: params.pubkeyHex,
                processedRangeCount: summary.processedRangeCount,
                addedCount: summary.addedCount,
                updatedCount: summary.updatedCount,
                hadFailures: summary.hadFailures,
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