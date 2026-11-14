import {
    POST_HISTORY_FETCH_KINDS,
    POST_HISTORY_REPAIR_FETCH_LIMIT,
} from "./postHistoryRelayFetchService";
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
