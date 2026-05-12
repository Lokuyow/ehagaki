import type { RxNostr } from "rx-nostr";
import {
    POST_HISTORY_FETCH_KINDS,
    POST_HISTORY_RELAY_FETCH_LIMIT,
    postHistoryRelayFetchService,
    type PostHistoryRelayFetchTask,
} from "./postHistoryRelayFetchService";
import { postHistoryRepository, type PostHistoryRepository } from "./storage/postHistoryRepository";
import {
    postHistoryRepairCursorRepository,
    type PostHistoryRepairCursor,
    type PostHistoryRepairCursorRepository,
} from "./storage/postHistoryRepairCursorRepository";
import {
    postHistorySyncCoverageRepository,
    type PostHistorySyncCoverageRepository,
} from "./storage/postHistorySyncCoverageRepository";
import type {
    PostHistoryRepairRangeUnit,
    PostHistorySyncCoverageRecord,
} from "./storage/ehagakiDb";
import type { RelayConfig } from "./types";

export const POST_HISTORY_REPAIR_MAX_RANGES_PER_RUN = 5;
export const POST_HISTORY_REPAIR_DELAY_MS = 500;

const SECONDS_PER_DAY = 24 * 60 * 60;

export interface PostHistoryRepairParams {
    pubkeyHex: string;
    relayConfig?: RelayConfig | null;
}

export interface PostHistoryRepairResult {
    status: "success" | "partial" | "cancelled";
    addedCount: number;
    updatedCount: number;
    unchangedCount: number;
    processedRangeCount: number;
    hasRemainingRanges: boolean;
    remainingRangeCount: number;
    nextCursorUntil: number | null;
    processedRanges: PostHistoryRepairProcessedRangeSummary[];
    attemptedRangeCount: number;
    totalRangeCount: number;
    hadFailures: boolean;
    hasRemainingWork: boolean;
}

export interface PostHistoryRepairProcessedRangeSummary {
    source: "coverage" | "fallback";
    rangeUnit: PostHistoryRepairRangeUnit;
    since?: number;
    until?: number;
    requestedRelayUrls: string[];
    observedRelayUrls: string[];
    status: PostHistorySyncCoverageRecord["status"];
    rawCount: number;
    uniqueCount: number;
    duplicateCount: number;
    insertedCount: number;
    updatedCount: number;
    unchangedCount: number;
}

export interface PostHistoryRepairTask {
    promise: Promise<PostHistoryRepairResult>;
    cancel: () => void;
}

interface PostHistoryRepairRange {
    kinds: number[];
    rangeUnit: PostHistoryRepairRangeUnit;
    since?: number;
    until?: number;
    limit: number;
}

type PostHistoryRepairWork =
    | {
        source: "coverage";
        record: PostHistorySyncCoverageRecord;
        range: PostHistoryRepairRange;
    }
    | {
        source: "fallback";
        cursor: PostHistoryRepairCursor;
        range: PostHistoryRepairRange;
    };

export interface PostHistoryRepairServiceDeps {
    postHistoryRelayFetchService?: Pick<typeof postHistoryRelayFetchService, "fetchLatest">;
    postHistoryRepository?: Pick<PostHistoryRepository, "upsertFetchedEvents" | "getOldestCreatedAt">;
    postHistoryRepairCursorRepository?: Pick<PostHistoryRepairCursorRepository, "get" | "save">;
    postHistorySyncCoverageRepository?: Pick<
        PostHistorySyncCoverageRepository,
        "listIncompleteAttempts" | "saveAttempt" | "enqueuePendingRanges" | "markResolved"
    >;
    now?: () => number;
    setTimeoutFn?: typeof setTimeout;
    clearTimeoutFn?: typeof clearTimeout;
    console?: Pick<Console, "debug">;
}

type PostHistoryRepairRemainingWorkSummary = {
    hasRemainingRanges: boolean;
    remainingRangeCount: number;
    nextCursorUntil: number | null;
};

function toUnixSeconds(timestampMs: number): number {
    return Math.max(0, Math.floor(timestampMs / 1000));
}

function inferRangeUnit(
    since: number | undefined,
    until: number | undefined,
): PostHistoryRepairRangeUnit {
    if (typeof since !== "number" || typeof until !== "number" || until < since) {
        return "custom";
    }

    const span = until - since + 1;
    if (span > 14 * SECONDS_PER_DAY) {
        return "month";
    }

    if (span > SECONDS_PER_DAY) {
        return "week";
    }

    return "day";
}

function toRepairRange(record: PostHistorySyncCoverageRecord): PostHistoryRepairRange {
    return {
        kinds: [...record.kinds],
        rangeUnit: record.rangeUnit ?? inferRangeUnit(record.since, record.until),
        ...(typeof record.since === "number" ? { since: record.since } : {}),
        ...(typeof record.until === "number" ? { until: record.until } : {}),
        limit: record.limit,
    };
}

function splitRangeIntoChunks(
    range: PostHistoryRepairRange,
    chunkDays: number,
    rangeUnit: PostHistoryRepairRangeUnit,
): PostHistoryRepairRange[] {
    if (typeof range.since !== "number" || typeof range.until !== "number" || range.until < range.since) {
        return [];
    }

    const ranges: PostHistoryRepairRange[] = [];
    const chunkSizeSeconds = chunkDays * SECONDS_PER_DAY;
    let currentSince = range.since;

    while (currentSince <= range.until) {
        const currentUntil = Math.min(range.until, currentSince + chunkSizeSeconds - 1);
        ranges.push({
            kinds: [...range.kinds],
            rangeUnit,
            since: currentSince,
            until: currentUntil,
            limit: range.limit,
        });
        currentSince = currentUntil + 1;
    }

    return ranges;
}

function splitRepairRange(range: PostHistoryRepairRange): PostHistoryRepairRange[] {
    const rangeUnit = range.rangeUnit === "custom"
        ? inferRangeUnit(range.since, range.until)
        : range.rangeUnit;

    if (rangeUnit === "month") {
        return splitRangeIntoChunks(range, 7, "week");
    }

    if (rangeUnit === "week") {
        return splitRangeIntoChunks(range, 1, "day");
    }

    return [];
}

function createFallbackMonthlyRange(
    nextUntil: number,
    targetOldestCreatedAt: number,
): PostHistoryRepairRange | null {
    if (nextUntil < targetOldestCreatedAt) {
        return null;
    }

    const nextDate = new Date(nextUntil * 1000);
    const monthStart = Math.floor(
        Date.UTC(nextDate.getUTCFullYear(), nextDate.getUTCMonth(), 1) / 1000,
    );
    const since = Math.max(targetOldestCreatedAt, monthStart);

    return {
        kinds: [...POST_HISTORY_FETCH_KINDS],
        rangeUnit: "month",
        since,
        until: nextUntil,
        limit: POST_HISTORY_RELAY_FETCH_LIMIT,
    };
}

function isHardFailureStatus(status: PostHistorySyncCoverageRecord["status"]): boolean {
    return status === "timeout" || status === "error";
}

function countFallbackMonthlyRanges(cursor: PostHistoryRepairCursor | null): number {
    if (!cursor || cursor.nextUntil === null) {
        return 0;
    }

    let count = 0;
    let nextUntil = cursor.nextUntil;

    while (nextUntil >= cursor.targetOldestCreatedAt) {
        count += 1;
        const nextDate = new Date(nextUntil * 1000);
        nextUntil = Math.floor(
            Date.UTC(nextDate.getUTCFullYear(), nextDate.getUTCMonth(), 1) / 1000,
        ) - 1;
    }

    return count;
}

export class PostHistoryRepairService {
    private postHistoryRelayFetchService: Pick<typeof postHistoryRelayFetchService, "fetchLatest">;
    private postHistoryRepository: Pick<PostHistoryRepository, "upsertFetchedEvents" | "getOldestCreatedAt">;
    private postHistoryRepairCursorRepository: Pick<PostHistoryRepairCursorRepository, "get" | "save">;
    private postHistorySyncCoverageRepository: Pick<
        PostHistorySyncCoverageRepository,
        "listIncompleteAttempts" | "saveAttempt" | "enqueuePendingRanges" | "markResolved"
    >;
    private now: () => number;
    private setTimeoutFn: typeof setTimeout;
    private clearTimeoutFn: typeof clearTimeout;
    private console: Pick<Console, "debug">;

    constructor(deps: PostHistoryRepairServiceDeps = {}) {
        this.postHistoryRelayFetchService = deps.postHistoryRelayFetchService ?? postHistoryRelayFetchService;
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.postHistoryRepairCursorRepository = deps.postHistoryRepairCursorRepository ?? postHistoryRepairCursorRepository;
        this.postHistorySyncCoverageRepository =
            deps.postHistorySyncCoverageRepository ?? postHistorySyncCoverageRepository;
        this.now = deps.now ?? Date.now;
        this.setTimeoutFn = deps.setTimeoutFn ?? setTimeout;
        this.clearTimeoutFn = deps.clearTimeoutFn ?? clearTimeout;
        this.console = deps.console ?? (typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { debug: () => undefined });
    }

    private async waitBetweenFetches(
        registerDelayCancel: (cancel: (() => void) | null) => void,
    ): Promise<void> {
        if (POST_HISTORY_REPAIR_DELAY_MS <= 0) {
            return;
        }

        await new Promise<void>((resolve) => {
            const timeoutId = this.setTimeoutFn(() => {
                registerDelayCancel(null);
                resolve();
            }, POST_HISTORY_REPAIR_DELAY_MS);
            registerDelayCancel(() => {
                this.clearTimeoutFn(timeoutId);
                registerDelayCancel(null);
                resolve();
            });
        });
    }

    private async ensureFallbackCursor(
        pubkeyHex: string,
        oldestCreatedAt: number,
    ): Promise<PostHistoryRepairCursor> {
        const current = await this.postHistoryRepairCursorRepository.get(pubkeyHex);
        const nextTargetOldestCreatedAt = current
            ? Math.min(current.targetOldestCreatedAt, oldestCreatedAt)
            : oldestCreatedAt;

        if (!current) {
            return this.postHistoryRepairCursorRepository.save({
                pubkeyHex,
                targetOldestCreatedAt: nextTargetOldestCreatedAt,
                nextUntil: toUnixSeconds(this.now()),
            });
        }

        if (current.nextUntil === null) {
            if (oldestCreatedAt >= current.targetOldestCreatedAt) {
                return current;
            }

            return this.postHistoryRepairCursorRepository.save({
                pubkeyHex,
                targetOldestCreatedAt: nextTargetOldestCreatedAt,
                nextUntil: Math.max(0, current.targetOldestCreatedAt - 1),
            });
        }

        if (nextTargetOldestCreatedAt !== current.targetOldestCreatedAt) {
            return this.postHistoryRepairCursorRepository.save({
                pubkeyHex,
                targetOldestCreatedAt: nextTargetOldestCreatedAt,
                nextUntil: current.nextUntil,
            });
        }

        if (current.nextUntil < current.targetOldestCreatedAt) {
            return this.postHistoryRepairCursorRepository.save({
                pubkeyHex,
                targetOldestCreatedAt: current.targetOldestCreatedAt,
                nextUntil: null,
            });
        }

        return current;
    }

    private async getNextFallbackWork(pubkeyHex: string): Promise<PostHistoryRepairWork | null> {
        const oldestCreatedAt = await this.postHistoryRepository.getOldestCreatedAt(pubkeyHex);
        if (oldestCreatedAt === null) {
            return null;
        }

        const cursor = await this.ensureFallbackCursor(pubkeyHex, oldestCreatedAt);
        if (cursor.nextUntil === null) {
            return null;
        }

        const range = createFallbackMonthlyRange(cursor.nextUntil, cursor.targetOldestCreatedAt);
        if (!range) {
            await this.postHistoryRepairCursorRepository.save({
                pubkeyHex,
                targetOldestCreatedAt: cursor.targetOldestCreatedAt,
                nextUntil: null,
            });
            return null;
        }

        return {
            source: "fallback",
            cursor,
            range,
        };
    }

    private async advanceFallbackCursor(
        cursor: PostHistoryRepairCursor,
        range: PostHistoryRepairRange,
    ): Promise<void> {
        const nextUntil = typeof range.since === "number"
            ? range.since - 1
            : null;
        await this.postHistoryRepairCursorRepository.save({
            pubkeyHex: cursor.pubkeyHex,
            targetOldestCreatedAt: cursor.targetOldestCreatedAt,
            nextUntil:
                typeof nextUntil === "number" && nextUntil >= cursor.targetOldestCreatedAt
                    ? nextUntil
                    : null,
        });
    }

    private async getNextWork(pubkeyHex: string): Promise<PostHistoryRepairWork | null> {
        while (true) {
            const incompleteAttempts = await this.postHistorySyncCoverageRepository.listIncompleteAttempts({
                pubkeyHex,
            });
            const candidate = incompleteAttempts[0];

            if (candidate) {
                if (candidate.status === "partial") {
                    const splitRanges = splitRepairRange(toRepairRange(candidate));
                    if (splitRanges.length > 0) {
                        await this.postHistorySyncCoverageRepository.enqueuePendingRanges(
                            splitRanges.map((range) => ({
                                pubkeyHex,
                                requestKind: "repair",
                                kinds: range.kinds,
                                rangeUnit: range.rangeUnit,
                                ...(typeof range.since === "number" ? { since: range.since } : {}),
                                ...(typeof range.until === "number" ? { until: range.until } : {}),
                                limit: range.limit,
                            })),
                        );
                        await this.postHistorySyncCoverageRepository.markResolved(candidate.id);
                        continue;
                    }
                }

                return {
                    source: "coverage",
                    record: candidate,
                    range: toRepairRange(candidate),
                };
            }

            return this.getNextFallbackWork(pubkeyHex);
        }
    }

    private async getRemainingWorkSummary(pubkeyHex: string): Promise<PostHistoryRepairRemainingWorkSummary> {
        const incompleteAttempts = await this.postHistorySyncCoverageRepository.listIncompleteAttempts({
            pubkeyHex,
        });
        const cursor = await this.postHistoryRepairCursorRepository.get(pubkeyHex);
        const remainingRangeCount = incompleteAttempts.length + countFallbackMonthlyRanges(cursor);

        return {
            hasRemainingRanges: remainingRangeCount > 0,
            remainingRangeCount,
            nextCursorUntil: cursor?.nextUntil ?? null,
        };
    }

    repairFromRelays(rxNostr: RxNostr, params: PostHistoryRepairParams): PostHistoryRepairTask {
        let cancelled = false;
        let currentFetchTask: PostHistoryRelayFetchTask | null = null;
        let currentDelayCancel: (() => void) | null = null;

        const promise = (async (): Promise<PostHistoryRepairResult> => {
            let addedCount = 0;
            let updatedCount = 0;
            let unchangedCount = 0;
            let attemptedRangeCount = 0;
            let hadFailures = false;
            const processedRanges: PostHistoryRepairProcessedRangeSummary[] = [];

            const finalizeResult = async (
                status: PostHistoryRepairResult["status"],
            ): Promise<PostHistoryRepairResult> => {
                const remainingWorkSummary = await this.getRemainingWorkSummary(params.pubkeyHex);
                const result: PostHistoryRepairResult = {
                    status,
                    addedCount,
                    updatedCount,
                    unchangedCount,
                    processedRangeCount: processedRanges.length,
                    hasRemainingRanges: remainingWorkSummary.hasRemainingRanges,
                    remainingRangeCount: remainingWorkSummary.remainingRangeCount,
                    nextCursorUntil: remainingWorkSummary.nextCursorUntil,
                    processedRanges,
                    attemptedRangeCount,
                    totalRangeCount: attemptedRangeCount + remainingWorkSummary.remainingRangeCount,
                    hadFailures,
                    hasRemainingWork: remainingWorkSummary.hasRemainingRanges,
                };

                this.console.debug("post_history_repair_summary", {
                    pubkeyHex: params.pubkeyHex,
                    requestedRelayUrls: [...new Set(processedRanges.flatMap((item) => item.requestedRelayUrls))],
                    observedRelayUrls: [...new Set(processedRanges.flatMap((item) => item.observedRelayUrls))],
                    processedRangeCount: result.processedRangeCount,
                    addedCount: result.addedCount,
                    updatedCount: result.updatedCount,
                    hasRemainingRanges: result.hasRemainingRanges,
                    remainingRangeCount: result.remainingRangeCount,
                    nextCursorUntil: result.nextCursorUntil,
                    processedRanges: result.processedRanges,
                });

                return result;
            };

            while (!cancelled && attemptedRangeCount < POST_HISTORY_REPAIR_MAX_RANGES_PER_RUN) {
                const work = await this.getNextWork(params.pubkeyHex);
                if (!work) {
                    break;
                }

                if (attemptedRangeCount > 0) {
                    await this.waitBetweenFetches((cancelDelay) => {
                        currentDelayCancel = cancelDelay;
                    });
                }

                if (cancelled) {
                    return finalizeResult("cancelled");
                }

                const fetchTask = this.postHistoryRelayFetchService.fetchLatest(rxNostr, {
                    pubkeyHex: params.pubkeyHex,
                    relayConfig: params.relayConfig,
                    kinds: work.range.kinds,
                    limit: work.range.limit,
                    ...(typeof work.range.since === "number" ? { since: work.range.since } : {}),
                    ...(typeof work.range.until === "number" ? { until: work.range.until } : {}),
                });
                currentFetchTask = fetchTask;

                const result = await fetchTask.promise;
                currentFetchTask = null;

                const coverageRecord = await this.postHistorySyncCoverageRepository.saveAttempt({
                    pubkeyHex: params.pubkeyHex,
                    requestKind: "repair",
                    kinds: work.range.kinds,
                    rangeUnit: work.range.rangeUnit,
                    ...(typeof work.range.since === "number" ? { since: work.range.since } : {}),
                    ...(typeof work.range.until === "number" ? { until: work.range.until } : {}),
                    limit: work.range.limit,
                    result,
                });

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
                }

                processedRanges.push({
                    source: work.source,
                    rangeUnit: work.range.rangeUnit,
                    ...(typeof work.range.since === "number" ? { since: work.range.since } : {}),
                    ...(typeof work.range.until === "number" ? { until: work.range.until } : {}),
                    requestedRelayUrls: coverageRecord.requestedRelayUrls,
                    observedRelayUrls: coverageRecord.observedRelayUrls,
                    status: coverageRecord.status,
                    rawCount: coverageRecord.rawCount,
                    uniqueCount: coverageRecord.uniqueCount,
                    duplicateCount: coverageRecord.duplicateCount,
                    insertedCount,
                    updatedCount: rangeUpdatedCount,
                    unchangedCount: rangeUnchangedCount,
                });

                if (work.source === "coverage") {
                    await this.postHistorySyncCoverageRepository.markResolved(work.record.id);
                } else {
                    await this.advanceFallbackCursor(work.cursor, work.range);
                }

                if (cancelled || result.status === "cancelled") {
                    return finalizeResult("cancelled");
                }

                if (coverageRecord.status === "partial") {
                    const splitRanges = splitRepairRange(work.range);
                    if (splitRanges.length > 0) {
                        await this.postHistorySyncCoverageRepository.enqueuePendingRanges(
                            splitRanges.map((range) => ({
                                pubkeyHex: params.pubkeyHex,
                                requestKind: "repair",
                                kinds: range.kinds,
                                rangeUnit: range.rangeUnit,
                                ...(typeof range.since === "number" ? { since: range.since } : {}),
                                ...(typeof range.until === "number" ? { until: range.until } : {}),
                                limit: range.limit,
                            })),
                        );
                        await this.postHistorySyncCoverageRepository.markResolved(coverageRecord.id);
                    }
                }

                if (isHardFailureStatus(coverageRecord.status)) {
                    hadFailures = true;
                }
            }

            return finalizeResult(hadFailures ? "partial" : "success");
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

export const postHistoryRepairService = new PostHistoryRepairService();