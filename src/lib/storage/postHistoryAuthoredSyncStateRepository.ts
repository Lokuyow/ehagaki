import type { EHagakiDB } from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";

const POST_HISTORY_AUTHORED_SYNC_STATE_KEY_PREFIX = "postHistoryAuthoredSyncState:";

export const POST_HISTORY_AUTHORED_SYNC_STATE_SCHEMA_VERSION = 1;

export interface PostHistoryAuthoredPendingCatchup {
    since: number;
    until: number;
    targetUpperBoundTimestamp: number;
    cursorUntil: number | null;
    boundaryMaybeIncomplete: boolean;
}

export interface PostHistoryAuthoredSyncState {
    ownerPubkeyHex: string;
    completedThroughTimestamp: number | null;
    latestObservedCreatedAt: number | null;
    lastPeriodicSyncAt: number | null;
    pendingCatchup: PostHistoryAuthoredPendingCatchup | null;
    saturated: boolean;
    maybeIncomplete: boolean;
    updatedAt: number;
    schemaVersion: number;
}

type PostHistoryAuthoredSyncStateValue = Omit<PostHistoryAuthoredSyncState, "updatedAt">;

export interface PostHistoryAuthoredSyncStatePatch {
    completedThroughTimestamp?: number | null;
    latestObservedCreatedAt?: number | null;
    lastPeriodicSyncAt?: number | null;
    pendingCatchup?: PostHistoryAuthoredPendingCatchup | null;
    saturated?: boolean;
    maybeIncomplete?: boolean;
}

export interface PostHistoryAuthoredSyncStateRepository {
    get(ownerPubkeyHex: string): Promise<PostHistoryAuthoredSyncState | null>;
    save(
        ownerPubkeyHex: string,
        patch: PostHistoryAuthoredSyncStatePatch,
    ): Promise<PostHistoryAuthoredSyncState>;
    saveLatestObservedCreatedAt(
        ownerPubkeyHex: string,
        createdAt: number | null | undefined,
    ): Promise<PostHistoryAuthoredSyncState | null>;
    clearForPubkey(ownerPubkeyHex: string | null | undefined): Promise<void>;
}

function buildStateKey(ownerPubkeyHex: string): string {
    return `${POST_HISTORY_AUTHORED_SYNC_STATE_KEY_PREFIX}${ownerPubkeyHex}`;
}

function isTimestampOrNull(value: unknown): value is number | null {
    return typeof value === "number" || value === null;
}

function isValidPendingCatchup(value: unknown): value is PostHistoryAuthoredPendingCatchup {
    if (!value || typeof value !== "object") {
        return false;
    }

    const pending = value as Partial<PostHistoryAuthoredPendingCatchup>;
    return typeof pending.since === "number"
        && typeof pending.until === "number"
        && typeof pending.targetUpperBoundTimestamp === "number"
        && isTimestampOrNull(pending.cursorUntil)
        && typeof pending.boundaryMaybeIncomplete === "boolean";
}

function isValidStateValue(value: unknown): value is PostHistoryAuthoredSyncStateValue {
    if (!value || typeof value !== "object") {
        return false;
    }

    const state = value as Partial<PostHistoryAuthoredSyncStateValue>;
    return typeof state.ownerPubkeyHex === "string"
        && isTimestampOrNull(state.completedThroughTimestamp)
        && isTimestampOrNull(state.latestObservedCreatedAt)
        && isTimestampOrNull(state.lastPeriodicSyncAt)
        && (state.pendingCatchup === null || isValidPendingCatchup(state.pendingCatchup))
        && typeof state.saturated === "boolean"
        && typeof state.maybeIncomplete === "boolean"
        && typeof state.schemaVersion === "number";
}

function buildDefaultState(ownerPubkeyHex: string): PostHistoryAuthoredSyncStateValue {
    return {
        ownerPubkeyHex,
        completedThroughTimestamp: null,
        latestObservedCreatedAt: null,
        lastPeriodicSyncAt: null,
        pendingCatchup: null,
        saturated: false,
        maybeIncomplete: false,
        schemaVersion: POST_HISTORY_AUTHORED_SYNC_STATE_SCHEMA_VERSION,
    };
}

export class DexiePostHistoryAuthoredSyncStateRepository
implements PostHistoryAuthoredSyncStateRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async get(ownerPubkeyHex: string): Promise<PostHistoryAuthoredSyncState | null> {
        if (!ownerPubkeyHex) {
            return null;
        }

        const record = await this.db.meta.get(buildStateKey(ownerPubkeyHex));
        if (!record || !isValidStateValue(record.value)) {
            return null;
        }

        return {
            ...record.value,
            updatedAt: record.updatedAt,
        };
    }

    async save(
        ownerPubkeyHex: string,
        patch: PostHistoryAuthoredSyncStatePatch,
    ): Promise<PostHistoryAuthoredSyncState> {
        const current = await this.get(ownerPubkeyHex);
        const updatedAt = this.now();
        const normalizedPatch = Object.fromEntries(
            Object.entries(patch).filter(([, value]) => value !== undefined),
        ) as PostHistoryAuthoredSyncStatePatch;
        const currentValue: PostHistoryAuthoredSyncStateValue | null = current
            ? {
                ownerPubkeyHex: current.ownerPubkeyHex,
                completedThroughTimestamp: current.completedThroughTimestamp,
                latestObservedCreatedAt: current.latestObservedCreatedAt,
                lastPeriodicSyncAt: current.lastPeriodicSyncAt,
                pendingCatchup: current.pendingCatchup,
                saturated: current.saturated,
                maybeIncomplete: current.maybeIncomplete,
                schemaVersion: current.schemaVersion,
            }
            : null;
        const nextValue: PostHistoryAuthoredSyncStateValue = {
            ...(currentValue ?? buildDefaultState(ownerPubkeyHex)),
            ...normalizedPatch,
            ownerPubkeyHex,
            schemaVersion: POST_HISTORY_AUTHORED_SYNC_STATE_SCHEMA_VERSION,
        };

        await this.db.meta.put({
            key: buildStateKey(ownerPubkeyHex),
            value: nextValue,
            updatedAt,
        });

        return {
            ...nextValue,
            updatedAt,
        };
    }

    async saveLatestObservedCreatedAt(
        ownerPubkeyHex: string,
        createdAt: number | null | undefined,
    ): Promise<PostHistoryAuthoredSyncState | null> {
        if (!ownerPubkeyHex || typeof createdAt !== "number") {
            return null;
        }

        const current = await this.get(ownerPubkeyHex);
        const currentCreatedAt = current?.latestObservedCreatedAt ?? null;
        if (typeof currentCreatedAt === "number" && currentCreatedAt >= createdAt) {
            return current;
        }

        return this.save(ownerPubkeyHex, {
            latestObservedCreatedAt: createdAt,
        });
    }

    async clearForPubkey(ownerPubkeyHex: string | null | undefined): Promise<void> {
        if (!ownerPubkeyHex) {
            return;
        }

        await this.db.meta.delete(buildStateKey(ownerPubkeyHex));
    }
}

export const postHistoryAuthoredSyncStateRepository =
    new DexiePostHistoryAuthoredSyncStateRepository();
