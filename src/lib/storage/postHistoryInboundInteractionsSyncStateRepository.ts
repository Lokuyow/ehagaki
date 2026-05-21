import type { EHagakiDB } from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";

const POST_HISTORY_INBOUND_INTERACTIONS_SYNC_STATE_KEY_PREFIX =
    "postHistoryInboundInteractionsSyncState:";

export const POST_HISTORY_INBOUND_INTERACTIONS_SYNC_STATE_SCHEMA_VERSION = 1;

export interface PostHistoryInboundInteractionsSyncState {
    ownerPubkeyHex: string;
    lastSyncedAt: number | null;
    lastSeenCreatedAt: number | null;
    lastDialogRefreshAt: number | null;
    saturated: boolean;
    maybeIncomplete: boolean;
    updatedAt: number;
    schemaVersion: number;
}

type PostHistoryInboundInteractionsSyncStateValue = Omit<
    PostHistoryInboundInteractionsSyncState,
    "updatedAt"
>;

export interface PostHistoryInboundInteractionsSyncStatePatch {
    lastSyncedAt?: number | null;
    lastSeenCreatedAt?: number | null;
    lastDialogRefreshAt?: number | null;
    saturated?: boolean;
    maybeIncomplete?: boolean;
}

export interface PostHistoryInboundInteractionsSyncStateRepository {
    get(ownerPubkeyHex: string): Promise<PostHistoryInboundInteractionsSyncState | null>;
    save(
        ownerPubkeyHex: string,
        patch: PostHistoryInboundInteractionsSyncStatePatch,
    ): Promise<PostHistoryInboundInteractionsSyncState>;
    clearForPubkey(ownerPubkeyHex: string | null | undefined): Promise<void>;
}

function buildStateKey(ownerPubkeyHex: string): string {
    return `${POST_HISTORY_INBOUND_INTERACTIONS_SYNC_STATE_KEY_PREFIX}${ownerPubkeyHex}`;
}

function isValidStateValue(value: unknown): value is PostHistoryInboundInteractionsSyncStateValue {
    if (!value || typeof value !== "object") {
        return false;
    }

    const state = value as Partial<PostHistoryInboundInteractionsSyncStateValue>;
    return typeof state.ownerPubkeyHex === "string"
        && (typeof state.lastSyncedAt === "number" || state.lastSyncedAt === null)
        && (typeof state.lastSeenCreatedAt === "number" || state.lastSeenCreatedAt === null)
        && (typeof state.lastDialogRefreshAt === "number" || state.lastDialogRefreshAt === null)
        && typeof state.saturated === "boolean"
        && typeof state.maybeIncomplete === "boolean"
        && typeof state.schemaVersion === "number";
}

function buildDefaultState(ownerPubkeyHex: string): PostHistoryInboundInteractionsSyncStateValue {
    return {
        ownerPubkeyHex,
        lastSyncedAt: null,
        lastSeenCreatedAt: null,
        lastDialogRefreshAt: null,
        saturated: false,
        maybeIncomplete: false,
        schemaVersion: POST_HISTORY_INBOUND_INTERACTIONS_SYNC_STATE_SCHEMA_VERSION,
    };
}

export class DexiePostHistoryInboundInteractionsSyncStateRepository
implements PostHistoryInboundInteractionsSyncStateRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async get(ownerPubkeyHex: string): Promise<PostHistoryInboundInteractionsSyncState | null> {
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
        patch: PostHistoryInboundInteractionsSyncStatePatch,
    ): Promise<PostHistoryInboundInteractionsSyncState> {
        const current = await this.get(ownerPubkeyHex);
        const updatedAt = this.now();
        const normalizedPatch = Object.fromEntries(
            Object.entries(patch).filter(([, value]) => value !== undefined),
        ) as PostHistoryInboundInteractionsSyncStatePatch;
        const currentValue: PostHistoryInboundInteractionsSyncStateValue | null = current
            ? {
                ownerPubkeyHex: current.ownerPubkeyHex,
                lastSyncedAt: current.lastSyncedAt,
                lastSeenCreatedAt: current.lastSeenCreatedAt,
                lastDialogRefreshAt: current.lastDialogRefreshAt,
                saturated: current.saturated,
                maybeIncomplete: current.maybeIncomplete,
                schemaVersion: current.schemaVersion,
            }
            : null;
        const nextValue: PostHistoryInboundInteractionsSyncStateValue = {
            ...(currentValue ?? buildDefaultState(ownerPubkeyHex)),
            ...normalizedPatch,
            ownerPubkeyHex,
            schemaVersion: POST_HISTORY_INBOUND_INTERACTIONS_SYNC_STATE_SCHEMA_VERSION,
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

    async clearForPubkey(ownerPubkeyHex: string | null | undefined): Promise<void> {
        if (!ownerPubkeyHex) {
            return;
        }

        await this.db.meta.delete(buildStateKey(ownerPubkeyHex));
    }
}

export const postHistoryInboundInteractionsSyncStateRepository =
    new DexiePostHistoryInboundInteractionsSyncStateRepository();
