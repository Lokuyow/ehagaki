import Dexie from "dexie";
import {
    createPostHistorySearchRecord,
    getPostHistorySearchIndexMetaKey,
    POST_HISTORY_SEARCH_INDEX_BATCH_SIZE,
    POST_HISTORY_SEARCH_INDEX_FORMAT_VERSION,
    POST_HISTORY_SEARCH_INDEX_LEASE_MS,
    type PostHistorySearchIndexState,
} from "../postHistorySearchIndex";
import {
    POST_HISTORY_TIMELINE_INDEX,
} from "./ehagakiDbConstants";
import {
    ehagakiDb,
    type EHagakiDB,
    type MetaRecord,
    type PostHistorySearchRecord,
} from "./ehagakiDb";

export type PostHistorySearchIndexProgress = {
    status: "building" | "ready";
    processedCount: number;
};

export type EnsurePostHistorySearchIndexOptions = {
    pubkeyHex: string;
    shouldContinue?: () => boolean;
    onProgress?: (progress: PostHistorySearchIndexProgress) => void;
};

export type EnsurePostHistorySearchIndexResult = "ready" | "cancelled";

type AdvanceResult = "continue" | "ready" | "waiting";

function isState(value: unknown): value is PostHistorySearchIndexState {
    if (!value || typeof value !== "object") return false;
    const state = value as Partial<PostHistorySearchIndexState>;
    return state.formatVersion === POST_HISTORY_SEARCH_INDEX_FORMAT_VERSION
        && (state.status === "clearing" || state.status === "building" || state.status === "ready")
        && typeof state.processedCount === "number";
}

function createOwnerId(): string {
    return globalThis.crypto?.randomUUID?.()
        ?? `post-history-search-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class DexiePostHistorySearchRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) {}

    async getForPubkey(pubkeyHex: string): Promise<PostHistorySearchRecord[]> {
        if (!pubkeyHex) return [];
        return await this.db.postHistorySearch
            .where("[pubkeyHex+postedAt+createdAt]")
            .between([pubkeyHex], [pubkeyHex, Dexie.maxKey])
            .reverse()
            .toArray();
    }

    async ensureReady(
        options: EnsurePostHistorySearchIndexOptions,
    ): Promise<EnsurePostHistorySearchIndexResult> {
        if (!options.pubkeyHex) return "cancelled";
        const ownerId = createOwnerId();

        try {
            while (options.shouldContinue?.() !== false) {
                const result = await this.advance(options.pubkeyHex, ownerId);
                const state = await this.getState(options.pubkeyHex);
                if (state) {
                    options.onProgress?.({
                        status: state.status === "ready" ? "ready" : "building",
                        processedCount: state.processedCount,
                    });
                }
                if (result === "ready") return "ready";
                await delay(result === "waiting" ? 250 : 0);
            }
        } finally {
            await this.releaseLease(options.pubkeyHex, ownerId);
        }

        return "cancelled";
    }

    private async releaseLease(pubkeyHex: string, ownerId: string): Promise<void> {
        const key = getPostHistorySearchIndexMetaKey(pubkeyHex);
        await this.db.transaction("rw", this.db.meta, async () => {
            const record = await this.db.meta.get(key);
            if (!record || !isState(record.value) || record.value.leaseOwner !== ownerId) return;
            await this.db.meta.put({
                ...record,
                value: {
                    ...record.value,
                    leaseExpiresAt: this.now(),
                },
                updatedAt: this.now(),
            });
        });
    }

    private async getState(pubkeyHex: string): Promise<PostHistorySearchIndexState | null> {
        const record = await this.db.meta.get(getPostHistorySearchIndexMetaKey(pubkeyHex));
        return record && isState(record.value) ? record.value : null;
    }

    private async advance(pubkeyHex: string, ownerId: string): Promise<AdvanceResult> {
        const key = getPostHistorySearchIndexMetaKey(pubkeyHex);
        return await this.db.transaction(
            "rw",
            this.db.meta,
            this.db.postHistory,
            this.db.postHistorySearch,
            async () => {
                const now = this.now();
                const existingMeta = await this.db.meta.get(key);
                const existing = existingMeta && isState(existingMeta.value)
                    ? existingMeta.value
                    : null;
                const sourceCount = await this.db.postHistory.where("pubkeyHex").equals(pubkeyHex).count();
                const indexCount = await this.db.postHistorySearch.where("pubkeyHex").equals(pubkeyHex).count();
                const liveForeignLease = !!existing?.leaseOwner
                    && existing.leaseOwner !== ownerId
                    && (existing.leaseExpiresAt ?? 0) > now;
                if (liveForeignLease) return "waiting";

                let state: PostHistorySearchIndexState = existing ?? {
                    formatVersion: POST_HISTORY_SEARCH_INDEX_FORMAT_VERSION,
                    status: "building",
                    processedCount: 0,
                };
                if (
                    !existing
                    || state.formatVersion !== POST_HISTORY_SEARCH_INDEX_FORMAT_VERSION
                    || (state.status === "ready" && sourceCount !== indexCount)
                ) {
                    state = {
                        formatVersion: POST_HISTORY_SEARCH_INDEX_FORMAT_VERSION,
                        status: indexCount > 0 ? "clearing" : "building",
                        processedCount: 0,
                    };
                }
                state = {
                    ...state,
                    leaseOwner: ownerId,
                    leaseExpiresAt: now + POST_HISTORY_SEARCH_INDEX_LEASE_MS,
                };

                if (state.status === "clearing") {
                    const eventIds = await this.db.postHistorySearch
                        .where("pubkeyHex")
                        .equals(pubkeyHex)
                        .limit(POST_HISTORY_SEARCH_INDEX_BATCH_SIZE)
                        .primaryKeys();
                    if (eventIds.length > 0) {
                        await this.db.postHistorySearch.bulkDelete(eventIds);
                    }
                    if (eventIds.length < POST_HISTORY_SEARCH_INDEX_BATCH_SIZE) {
                        state = { ...state, status: "building", processedCount: 0 };
                        delete state.cursor;
                    }
                    await this.putState(key, state, now);
                    return "continue";
                }

                if (state.status === "ready") return "ready";

                const upper = state.cursor
                    ? [pubkeyHex, state.cursor.postedAt, state.cursor.createdAt, state.cursor.eventId]
                    : [pubkeyHex, Dexie.maxKey];
                const records = await this.db.postHistory
                    .where(POST_HISTORY_TIMELINE_INDEX)
                    .between([pubkeyHex], upper, true, !state.cursor)
                    .reverse()
                    .limit(POST_HISTORY_SEARCH_INDEX_BATCH_SIZE)
                    .toArray();
                if (records.length === 0) {
                    state = { ...state, status: "ready", leaseExpiresAt: now };
                    delete state.cursor;
                    await this.putState(key, state, now);
                    return "ready";
                }

                await this.db.postHistorySearch.bulkPut(records.map(createPostHistorySearchRecord));
                const cursor = records[records.length - 1]!;
                state = {
                    ...state,
                    processedCount: state.processedCount + records.length,
                    cursor: {
                        eventId: cursor.eventId,
                        postedAt: cursor.postedAt,
                        createdAt: cursor.createdAt,
                    },
                };
                await this.putState(key, state, now);
                return "continue";
            },
        );
    }

    private async putState(
        key: string,
        state: PostHistorySearchIndexState,
        updatedAt: number,
    ): Promise<void> {
        const record: MetaRecord = { key, value: state, updatedAt };
        await this.db.meta.put(record);
    }
}

export const postHistorySearchRepository = new DexiePostHistorySearchRepository();
