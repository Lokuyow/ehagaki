import type { RxNostr } from "rx-nostr";
import {
    POST_HISTORY_FETCH_KINDS,
    POST_HISTORY_RELAY_FETCH_LIMIT,
    postHistoryRelayFetchService,
    type PostHistoryRelayFetchResult,
    type PostHistoryRelayFetchTask,
} from "./postHistoryRelayFetchService";
import { postHistoryRepository, type PostHistoryRepository } from "./storage/postHistoryRepository";
import {
    postHistorySyncCoverageRepository,
    type PostHistorySyncCoverageRepository,
} from "./storage/postHistorySyncCoverageRepository";
import type {
    PostHistorySyncCoverageRecord,
    PostHistorySyncCoverageStatus,
} from "./storage/ehagakiDb";
import type { RelayConfig } from "./types";

export const POST_HISTORY_REPAIR_FALLBACK_DAYS = 30;

export interface PostHistoryRepairParams {
    pubkeyHex: string;
    relayConfig?: RelayConfig | null;
}

export interface PostHistoryRepairResult {
    status: "success" | "partial" | "cancelled";
    addedCount: number;
    updatedCount: number;
    unchangedCount: number;
    attemptedRangeCount: number;
    totalRangeCount: number;
    hadFailures: boolean;
}

export interface PostHistoryRepairTask {
    promise: Promise<PostHistoryRepairResult>;
    cancel: () => void;
}

interface PostHistoryRepairRange {
    kinds: number[];
    since?: number;
    until?: number;
    limit: number;
}

export interface PostHistoryRepairServiceDeps {
    postHistoryRelayFetchService?: Pick<typeof postHistoryRelayFetchService, "fetchLatest">;
    postHistoryRepository?: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    postHistorySyncCoverageRepository?: Pick<
        PostHistorySyncCoverageRepository,
        "listIncompleteAttempts" | "saveAttempt"
    >;
    now?: () => number;
}

const FAILURE_STATUSES = new Set<PostHistorySyncCoverageStatus>([
    "timeout",
    "error",
    "partial",
    "cancelled",
]);

function buildRangeKey(range: PostHistoryRepairRange): string {
    return [
        range.kinds.join(","),
        typeof range.since === "number" ? range.since : "",
        typeof range.until === "number" ? range.until : "",
        range.limit,
    ].join("|");
}

function toRepairRange(record: PostHistorySyncCoverageRecord): PostHistoryRepairRange {
    return {
        kinds: [...record.kinds],
        ...(typeof record.since === "number" ? { since: record.since } : {}),
        ...(typeof record.until === "number" ? { until: record.until } : {}),
        limit: record.limit,
    };
}

function createFallbackRanges(now: number): PostHistoryRepairRange[] {
    const ranges: PostHistoryRepairRange[] = [];
    const nowSeconds = Math.floor(now / 1000);
    const daySeconds = 24 * 60 * 60;

    for (let dayIndex = 0; dayIndex < POST_HISTORY_REPAIR_FALLBACK_DAYS; dayIndex += 1) {
        const until = nowSeconds - dayIndex * daySeconds;
        const since = Math.max(0, until - daySeconds + 1);
        ranges.push({
            kinds: [...POST_HISTORY_FETCH_KINDS],
            since,
            until,
            limit: POST_HISTORY_RELAY_FETCH_LIMIT,
        });
    }

    return ranges;
}

function dedupeRanges(records: PostHistorySyncCoverageRecord[]): PostHistoryRepairRange[] {
    const seen = new Set<string>();
    const ranges: PostHistoryRepairRange[] = [];

    for (const record of records) {
        if (!FAILURE_STATUSES.has(record.status)) {
            continue;
        }

        const range = toRepairRange(record);
        const key = buildRangeKey(range);
        if (seen.has(key)) {
            continue;
        }

        seen.add(key);
        ranges.push(range);
    }

    return ranges;
}

function isRepairFailure(savedAttemptStatus: PostHistorySyncCoverageStatus, result: PostHistoryRelayFetchResult): boolean {
    return result.status !== "success" || savedAttemptStatus === "partial";
}

export class PostHistoryRepairService {
    private postHistoryRelayFetchService: Pick<typeof postHistoryRelayFetchService, "fetchLatest">;
    private postHistoryRepository: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    private postHistorySyncCoverageRepository: Pick<
        PostHistorySyncCoverageRepository,
        "listIncompleteAttempts" | "saveAttempt"
    >;
    private now: () => number;

    constructor(deps: PostHistoryRepairServiceDeps = {}) {
        this.postHistoryRelayFetchService = deps.postHistoryRelayFetchService ?? postHistoryRelayFetchService;
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.postHistorySyncCoverageRepository =
            deps.postHistorySyncCoverageRepository ?? postHistorySyncCoverageRepository;
        this.now = deps.now ?? Date.now;
    }

    repairFromRelays(rxNostr: RxNostr, params: PostHistoryRepairParams): PostHistoryRepairTask {
        let cancelled = false;
        let currentFetchTask: PostHistoryRelayFetchTask | null = null;

        const promise = (async (): Promise<PostHistoryRepairResult> => {
            const incompleteAttempts = await this.postHistorySyncCoverageRepository.listIncompleteAttempts({
                pubkeyHex: params.pubkeyHex,
                limit: POST_HISTORY_REPAIR_FALLBACK_DAYS,
            });
            const ranges = incompleteAttempts.length > 0
                ? dedupeRanges(incompleteAttempts)
                : createFallbackRanges(this.now());
            let addedCount = 0;
            let updatedCount = 0;
            let unchangedCount = 0;
            let attemptedRangeCount = 0;
            let hadFailures = false;

            for (const range of ranges) {
                if (cancelled) {
                    return {
                        status: "cancelled",
                        addedCount,
                        updatedCount,
                        unchangedCount,
                        attemptedRangeCount,
                        totalRangeCount: ranges.length,
                        hadFailures,
                    };
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

                const coverageRecord = await this.postHistorySyncCoverageRepository.saveAttempt({
                    pubkeyHex: params.pubkeyHex,
                    requestKind: "repair",
                    kinds: range.kinds,
                    ...(typeof range.since === "number" ? { since: range.since } : {}),
                    ...(typeof range.until === "number" ? { until: range.until } : {}),
                    limit: range.limit,
                    result,
                });

                attemptedRangeCount += 1;

                if (cancelled || result.status === "cancelled") {
                    return {
                        status: "cancelled",
                        addedCount,
                        updatedCount,
                        unchangedCount,
                        attemptedRangeCount,
                        totalRangeCount: ranges.length,
                        hadFailures,
                    };
                }

                if (result.events.length > 0) {
                    const upsertSummary = await this.postHistoryRepository.upsertFetchedEvents({
                        events: result.events,
                        fetchedAt: result.fetchedAt,
                    });
                    addedCount += upsertSummary.insertedCount;
                    updatedCount += upsertSummary.updatedCount;
                    unchangedCount += upsertSummary.unchangedCount;
                }

                if (isRepairFailure(coverageRecord.status, result)) {
                    hadFailures = true;
                }
            }

            return {
                status: hadFailures ? "partial" : "success",
                addedCount,
                updatedCount,
                unchangedCount,
                attemptedRangeCount,
                totalRangeCount: ranges.length,
                hadFailures,
            };
        })();

        return {
            promise,
            cancel: () => {
                cancelled = true;
                currentFetchTask?.cancel();
            },
        };
    }
}

export const postHistoryRepairService = new PostHistoryRepairService();