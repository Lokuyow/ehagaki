import type { EHagakiDB } from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";

const POST_HISTORY_VISIBLE_RANGE_KEY_PREFIX = "postHistoryVisibleRange:";

export interface PostHistoryVisibleRange {
    pubkeyHex: string;
    kindsKey: string;
    visibleUntil: number | null;
    updatedAt: number;
}

export interface PostHistoryVisibleRangeRepository {
    get(pubkeyHex: string, kindsKey: string): Promise<PostHistoryVisibleRange | null>;
    save(range: Omit<PostHistoryVisibleRange, "updatedAt">): Promise<PostHistoryVisibleRange>;
    clear(pubkeyHex: string, kindsKey: string): Promise<void>;
    clearForPubkey(pubkeyHex: string | null | undefined): Promise<void>;
}

type PostHistoryVisibleRangeValue = Omit<PostHistoryVisibleRange, "updatedAt">;

function buildVisibleRangeKey(pubkeyHex: string, kindsKey: string): string {
    return `${POST_HISTORY_VISIBLE_RANGE_KEY_PREFIX}${pubkeyHex}:${kindsKey}`;
}

function isValidVisibleRangeValue(value: unknown): value is PostHistoryVisibleRangeValue {
    if (!value || typeof value !== "object") {
        return false;
    }

    const range = value as Partial<PostHistoryVisibleRangeValue>;
    return typeof range.pubkeyHex === "string"
        && typeof range.kindsKey === "string"
        && (typeof range.visibleUntil === "number" || range.visibleUntil === null);
}

export function buildPostHistoryVisibleKindsKey(kinds: number[]): string {
    const normalized = new Set<number>();

    for (const kind of kinds) {
        if (Number.isFinite(kind)) {
            normalized.add(Math.trunc(kind));
        }
    }

    return [...normalized].sort((left, right) => left - right).join(",");
}

export class DexiePostHistoryVisibleRangeRepository implements PostHistoryVisibleRangeRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async get(pubkeyHex: string, kindsKey: string): Promise<PostHistoryVisibleRange | null> {
        const record = await this.db.meta.get(buildVisibleRangeKey(pubkeyHex, kindsKey));
        if (!record || !isValidVisibleRangeValue(record.value)) {
            return null;
        }

        return {
            ...record.value,
            updatedAt: record.updatedAt,
        };
    }

    async save(range: Omit<PostHistoryVisibleRange, "updatedAt">): Promise<PostHistoryVisibleRange> {
        const updatedAt = this.now();
        const nextRange: PostHistoryVisibleRange = {
            ...range,
            updatedAt,
        };

        await this.db.meta.put({
            key: buildVisibleRangeKey(range.pubkeyHex, range.kindsKey),
            value: {
                pubkeyHex: range.pubkeyHex,
                kindsKey: range.kindsKey,
                visibleUntil: range.visibleUntil,
            },
            updatedAt,
        });

        return nextRange;
    }

    async clear(pubkeyHex: string, kindsKey: string): Promise<void> {
        await this.db.meta.delete(buildVisibleRangeKey(pubkeyHex, kindsKey));
    }

    async clearForPubkey(pubkeyHex: string | null | undefined): Promise<void> {
        if (!pubkeyHex) return;

        const keyPrefix = `${POST_HISTORY_VISIBLE_RANGE_KEY_PREFIX}${pubkeyHex}:`;
        const records = await this.db.meta
            .filter((record) => record.key.startsWith(keyPrefix))
            .primaryKeys();

        await this.db.meta.bulkDelete(records);
    }
}

export const postHistoryVisibleRangeRepository =
    new DexiePostHistoryVisibleRangeRepository();
