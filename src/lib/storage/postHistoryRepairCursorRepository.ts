import type { EHagakiDB } from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";

const POST_HISTORY_REPAIR_CURSOR_KEY_PREFIX = "postHistoryRepairCursor:";

export interface PostHistoryRepairCursor {
    pubkeyHex: string;
    targetOldestCreatedAt: number;
    nextUntil: number | null;
    updatedAt: number;
}

export interface PostHistoryRepairCursorRepository {
    get(pubkeyHex: string): Promise<PostHistoryRepairCursor | null>;
    save(cursor: Omit<PostHistoryRepairCursor, "updatedAt">): Promise<PostHistoryRepairCursor>;
    clearForPubkey(pubkeyHex: string | null | undefined): Promise<void>;
}

function buildCursorKey(pubkeyHex: string): string {
    return `${POST_HISTORY_REPAIR_CURSOR_KEY_PREFIX}${pubkeyHex}`;
}

function isValidCursorValue(value: unknown): value is Omit<PostHistoryRepairCursor, "updatedAt"> {
    if (!value || typeof value !== "object") {
        return false;
    }

    const cursor = value as Partial<PostHistoryRepairCursor>;
    return typeof cursor.pubkeyHex === "string"
        && typeof cursor.targetOldestCreatedAt === "number"
        && (typeof cursor.nextUntil === "number" || cursor.nextUntil === null);
}

export class DexiePostHistoryRepairCursorRepository implements PostHistoryRepairCursorRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async get(pubkeyHex: string): Promise<PostHistoryRepairCursor | null> {
        const record = await this.db.meta.get(buildCursorKey(pubkeyHex));
        if (!record || !isValidCursorValue(record.value)) {
            return null;
        }

        return {
            ...record.value,
            updatedAt: record.updatedAt,
        };
    }

    async save(cursor: Omit<PostHistoryRepairCursor, "updatedAt">): Promise<PostHistoryRepairCursor> {
        const updatedAt = this.now();
        const nextCursor: PostHistoryRepairCursor = {
            ...cursor,
            updatedAt,
        };

        await this.db.meta.put({
            key: buildCursorKey(cursor.pubkeyHex),
            value: {
                pubkeyHex: cursor.pubkeyHex,
                targetOldestCreatedAt: cursor.targetOldestCreatedAt,
                nextUntil: cursor.nextUntil,
            },
            updatedAt,
        });

        return nextCursor;
    }

    async clearForPubkey(pubkeyHex: string | null | undefined): Promise<void> {
        if (!pubkeyHex) return;

        await this.db.meta.delete(buildCursorKey(pubkeyHex));
    }
}

export const postHistoryRepairCursorRepository = new DexiePostHistoryRepairCursorRepository();
