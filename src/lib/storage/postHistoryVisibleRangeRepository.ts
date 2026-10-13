import type { EHagakiDB } from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";

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

    async get(_pubkeyHex: string, _kindsKey: string): Promise<PostHistoryVisibleRange | null> {
        return null;
    }

    async save(range: Omit<PostHistoryVisibleRange, "updatedAt">): Promise<PostHistoryVisibleRange> {
        return { ...range, updatedAt: this.now() };
    }

    async clear(_pubkeyHex: string, _kindsKey: string): Promise<void> {
        return;
    }

    async clearForPubkey(_pubkeyHex: string | null | undefined): Promise<void> {
        return;
    }
}

export const postHistoryVisibleRangeRepository =
    new DexiePostHistoryVisibleRangeRepository();
