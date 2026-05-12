import Dexie from "dexie";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { PostHistoryRelayFetchResult } from "../postHistoryRelayFetchService";
import type {
    EHagakiDB,
    PostHistorySyncCoverageRecord,
    PostHistorySyncCoverageRequestKind,
    PostHistorySyncCoverageStatus,
} from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";

export const POST_HISTORY_SYNC_COVERAGE_SCHEMA_VERSION = 1;

export type PostHistorySyncCoverageSaveInput = {
    pubkeyHex: string;
    requestKind: PostHistorySyncCoverageRequestKind;
    kinds: number[];
    since?: number;
    until?: number;
    limit: number;
    result: PostHistoryRelayFetchResult;
};

export type PostHistorySyncCoverageListOptions = {
    pubkeyHex: string;
    limit?: number;
};

export interface PostHistorySyncCoverageRepository {
    saveAttempt(input: PostHistorySyncCoverageSaveInput): Promise<PostHistorySyncCoverageRecord>;
    listIncompleteAttempts(options: PostHistorySyncCoverageListOptions): Promise<PostHistorySyncCoverageRecord[]>;
}

const INCOMPLETE_STATUS_PRIORITY: Record<Exclude<PostHistorySyncCoverageStatus, "complete">, number> = {
    timeout: 0,
    error: 1,
    partial: 2,
    cancelled: 3,
};

function normalizeKinds(kinds: number[]): number[] {
    const normalized = new Set<number>();

    for (const kind of kinds) {
        if (Number.isFinite(kind)) {
            normalized.add(Math.trunc(kind));
        }
    }

    return [...normalized].sort((left, right) => left - right);
}

function buildKindsKey(kinds: number[]): string {
    return normalizeKinds(kinds).join(",");
}

function buildRelayKey(relayUrls: string[]): string {
    return relayUrls.join("\n");
}

function resolveCoverageStatus(input: PostHistorySyncCoverageSaveInput): PostHistorySyncCoverageStatus {
    if (input.result.status === "timeout" || input.result.status === "error" || input.result.status === "cancelled") {
        return input.result.status;
    }

    if (input.result.hasMore || input.result.rawCount >= input.limit) {
        return "partial";
    }

    if (input.result.perRelayCounts.some((item) => item.rawCount >= input.limit)) {
        return "partial";
    }

    return "complete";
}

function defaultCreateId(input: PostHistorySyncCoverageSaveInput): string {
    return [
        input.pubkeyHex,
        input.requestKind,
        input.result.fetchedAt,
        Math.random().toString(36).slice(2, 10),
    ].join(":");
}

export class DexiePostHistorySyncCoverageRepository implements PostHistorySyncCoverageRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
        private createId: (input: PostHistorySyncCoverageSaveInput) => string = defaultCreateId,
    ) { }

    async saveAttempt(input: PostHistorySyncCoverageSaveInput): Promise<PostHistorySyncCoverageRecord> {
        const kinds = normalizeKinds(input.kinds);
        const requestedRelayUrls = RelayConfigUtils.sanitizeExternalRelayUrls(input.result.relayUrls);
        const observedRelayUrls = RelayConfigUtils.sanitizeExternalRelayUrls(input.result.observedRelayUrls);
        const updatedAt = this.now();
        const status = resolveCoverageStatus(input);

        const record: PostHistorySyncCoverageRecord = {
            id: this.createId(input),
            pubkeyHex: input.pubkeyHex,
            requestKind: input.requestKind,
            requestedRelayUrls,
            observedRelayUrls,
            relayKey: buildRelayKey(requestedRelayUrls),
            kinds,
            kindsKey: buildKindsKey(kinds),
            ...(typeof input.since === "number" ? { since: input.since } : {}),
            ...(typeof input.until === "number" ? { until: input.until } : {}),
            limit: input.limit,
            status,
            rawCount: input.result.rawCount,
            uniqueCount: input.result.uniqueCount,
            duplicateCount: input.result.duplicateCount,
            perRelayCounts: input.result.perRelayCounts.map((item) => ({
                relayUrl: item.relayUrl,
                rawCount: item.rawCount,
                uniqueCount: item.uniqueCount,
            })),
            ...(typeof input.result.oldestCreatedAt === "number"
                ? { oldestCreatedAt: input.result.oldestCreatedAt }
                : {}),
            ...(typeof input.result.newestCreatedAt === "number"
                ? { newestCreatedAt: input.result.newestCreatedAt }
                : {}),
            ...(input.result.nextUntil !== null ? { nextUntil: input.result.nextUntil } : {}),
            fetchedAt: input.result.fetchedAt,
            updatedAt,
            schemaVersion: POST_HISTORY_SYNC_COVERAGE_SCHEMA_VERSION,
        };

        await this.db.postHistorySyncCoverage.put(record);
        return record;
    }

    async listIncompleteAttempts(options: PostHistorySyncCoverageListOptions): Promise<PostHistorySyncCoverageRecord[]> {
        const records = await this.db.postHistorySyncCoverage
            .where("pubkeyHex")
            .equals(options.pubkeyHex)
            .toArray();

        return records
            .filter((record) => record.status !== "complete")
            .sort((left, right) => {
                const leftPriority = INCOMPLETE_STATUS_PRIORITY[left.status as Exclude<PostHistorySyncCoverageStatus, "complete">];
                const rightPriority = INCOMPLETE_STATUS_PRIORITY[right.status as Exclude<PostHistorySyncCoverageStatus, "complete">];
                if (leftPriority !== rightPriority) {
                    return leftPriority - rightPriority;
                }

                return right.fetchedAt - left.fetchedAt;
            })
            .slice(0, options.limit ?? Number.POSITIVE_INFINITY);
    }
}

export const postHistorySyncCoverageRepository = new DexiePostHistorySyncCoverageRepository();