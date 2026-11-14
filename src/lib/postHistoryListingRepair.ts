import {
    POST_HISTORY_FETCH_KINDS,
    POST_HISTORY_REPAIR_FETCH_LIMIT,
} from "./postHistoryRelayFetchService";
import type { PostHistoryCurrentViewRefetchResult } from "./postHistoryCurrentViewRefetchService";
import type { PostHistoryRelationRepairSummary } from "./postHistoryVisibleRangeRelationRepairCoordinator";
import type { PostHistoryRecord } from "./storage/ehagakiDb";

export type PostHistoryManualRepairPhase =
    | "visible-range-state"
    | "primary-fetch"
    | "primary-persist"
    | "visible-window-reload"
    | "relation-repair"
    | "badge-refresh";

export function createPostHistoryManualRepairPhaseTelemetry(params: {
    phase: PostHistoryManualRepairPhase;
    startedAt: number;
    finishedAt?: number;
    durationMs?: number;
    error?: unknown;
    errorClass?: string;
    counts?: Record<string, number | boolean>;
}): Record<string, string | number | boolean> {
    const error = params.error;
    const errorClass = params.errorClass ?? (error instanceof Error
        ? error.name
        : error === undefined
            ? undefined
            : typeof error);
    // Deliberately exclude event/auth payloads. This is phase timing and relay
    // summary telemetry for diagnosing manual repair only.
    return {
        phase: params.phase,
        durationMs: params.durationMs ?? Math.max(
            0,
            (params.finishedAt ?? Date.now()) - params.startedAt,
        ),
        ...(errorClass ? { errorClass } : {}),
        ...(params.counts ?? {}),
    };
}

export function reportPostHistoryManualRepairPhase(
    params: Parameters<typeof createPostHistoryManualRepairPhaseTelemetry>[0],
): void {
    const telemetry = createPostHistoryManualRepairPhaseTelemetry(params);
    if ("errorClass" in telemetry) {
        console.warn("post_history_manual_repair_phase", telemetry);
    } else {
        console.debug("post_history_manual_repair_phase", telemetry);
    }
}

const POST_HISTORY_REPAIR_PREFERRED_PADDING_SECONDS = 24 * 60 * 60;

export function buildPostHistoryRepairPreferredRanges(
    posts: Array<Pick<PostHistoryRecord, "createdAt">>,
) {
    const createdAtValues = posts
        .map((post) => post.createdAt)
        .filter((createdAt) => Number.isFinite(createdAt))
        .map((createdAt) => Math.trunc(createdAt));

    if (createdAtValues.length === 0) {
        return [];
    }

    const minCreatedAt = Math.min(...createdAtValues);
    const maxCreatedAt = Math.max(...createdAtValues);

    return [{
        kinds: [...POST_HISTORY_FETCH_KINDS],
        rangeUnit: "custom" as const,
        since: Math.max(
            0,
            minCreatedAt - POST_HISTORY_REPAIR_PREFERRED_PADDING_SECONDS,
        ),
        until: maxCreatedAt + POST_HISTORY_REPAIR_PREFERRED_PADDING_SECONDS,
        limit: POST_HISTORY_REPAIR_FETCH_LIMIT,
    }];
}

type ManualRepairPhaseTelemetryParams =
    Parameters<typeof createPostHistoryManualRepairPhaseTelemetry>[0];

export function summarizePostHistoryManualRepairFetchCounts(
    result: Pick<
        PostHistoryCurrentViewRefetchResult,
        "processedRangeCount" | "processedRanges"
    >,
): Record<string, number> {
    return {
        processedRangeCount: result.processedRangeCount,
        rawCount: result.processedRanges.reduce(
            (count, range) => count + (range.rawCount ?? 0),
            0,
        ),
        uniqueCount: result.processedRanges.reduce(
            (count, range) => count + (range.uniqueCount ?? 0),
            0,
        ),
        requestedRelayCount: result.processedRanges.reduce(
            (count, range) => count + (range.requestedRelayUrls?.length ?? 0),
            0,
        ),
        eoseRelayCount: result.processedRanges.reduce(
            (count, range) => count + (range.eoseRelayUrls?.length ?? 0),
            0,
        ),
    };
}

/**
 * Relation repair reports its own phase, plus badge refresh when that step
 * ran or failed.
 */
export function buildPostHistoryManualRepairRelationPhases(
    summary: PostHistoryRelationRepairSummary,
    startedAt: number,
): ManualRepairPhaseTelemetryParams[] {
    const phases: ManualRepairPhaseTelemetryParams[] = [{
        phase: "relation-repair",
        startedAt,
        durationMs: summary.relationRepairDurationMs
            ?? (summary.failurePhase === "relation-repair"
                ? summary.failureDurationMs
                : undefined),
        errorClass: summary.failurePhase === "relation-repair"
            ? summary.failureErrorClass
            : undefined,
        counts: {
            savedDirectReplyCount: summary.savedDirectReplyCount,
        },
    }];
    if (
        typeof summary.badgeRefreshDurationMs === "number"
        || summary.failurePhase === "badge-refresh"
    ) {
        phases.push({
            phase: "badge-refresh",
            startedAt,
            durationMs: summary.badgeRefreshDurationMs
                ?? summary.failureDurationMs,
            errorClass: summary.failurePhase === "badge-refresh"
                ? summary.failureErrorClass
                : undefined,
        });
    }

    return phases;
}

export function resolvePostHistoryManualRepairResultMessage(
    result: Pick<
        PostHistoryCurrentViewRefetchResult,
        "addedCount" | "updatedCount" | "processedRangeCount" | "fetchFailed"
    >,
    savedDirectReplyCount: number,
): { key: string; values: Record<string, number> | null } {
    if (result.addedCount > 0) {
        return {
            key: "postHistory.repairAdded",
            values: {
                count: result.addedCount,
                processedRangeCount: result.processedRangeCount,
                updatedCount: result.updatedCount,
            },
        };
    }
    if (savedDirectReplyCount > 0) {
        return {
            key: "postHistory.repairChildInteractionsAdded",
            values: { count: savedDirectReplyCount },
        };
    }
    if (result.fetchFailed) {
        return { key: "postHistory.repairFetchFailed", values: null };
    }

    return {
        key: "postHistory.repairNoChanges",
        values: {
            processedRangeCount: result.processedRangeCount,
            updatedCount: result.updatedCount,
        },
    };
}

interface ResolvePostHistoryManualRepairFailureParams {
    error: unknown;
    activePhaseStartedAt: number;
    primaryRefetchReloadCompleted: boolean;
}

/**
 * Attribute a thrown manual-repair error to a phase. Errors tagged by the
 * refetch service keep their own phase, start time, and error class.
 */
export function resolvePostHistoryManualRepairFailure({
    error,
    activePhaseStartedAt,
    primaryRefetchReloadCompleted,
}: ResolvePostHistoryManualRepairFailureParams): {
    phase: PostHistoryManualRepairPhase;
    startedAt: number;
    errorClass: string | undefined;
} {
    const taggedPhase = typeof error === "object" && error !== null
        ? (error as { phase?: unknown }).phase
        : undefined;
    const startedAt = typeof error === "object" && error !== null
        && typeof (error as { phaseStartedAt?: unknown }).phaseStartedAt === "number"
        ? (error as { phaseStartedAt: number }).phaseStartedAt
        : activePhaseStartedAt;
    const errorClass = typeof error === "object" && error !== null
        && typeof (error as { errorClass?: unknown }).errorClass === "string"
        ? (error as { errorClass: string }).errorClass
        : undefined;
    const phase = taggedPhase === "primary-fetch"
        || taggedPhase === "primary-persist"
        ? taggedPhase
        : primaryRefetchReloadCompleted
            ? "relation-repair"
            : "primary-fetch";

    return { phase, startedAt, errorClass };
}
