import { mergePostHistoryCoverageRanges, type PostHistoryCoverageRange } from "../postHistoryRelayCoverage";
import { ehagakiDb, type EHagakiDB } from "./ehagakiDb";
import { assertPostHistoryLocalWriteCurrent, getPostHistoryLocalRevision, type PostHistoryLocalWriteScope } from "./postHistoryLocalWriteScope";

export const POST_HISTORY_IMPORTED_RANGES_PREFIX = "postHistoryImportedRanges:";

/** A local backup restoration policy, never evidence of a relay query. */
export interface PostHistoryImportedRanges {
    schemaVersion: 1;
    source: "citrine-backup";
    ownerPubkeyHex: string;
    kindsKey: string;
    localRevision: number;
    ranges: PostHistoryCoverageRange[];
}

export class DexiePostHistoryImportedRangesRepository {
    constructor(private db: EHagakiDB = ehagakiDb, private now = Date.now) {}

    async get(ownerPubkeyHex: string, kindsKey: string): Promise<PostHistoryImportedRanges> {
        return this.db.transaction("r", this.db.meta, async () => {
            const localRevision = await getPostHistoryLocalRevision(this.db, ownerPubkeyHex);
            const record = (await this.db.meta.get(`${POST_HISTORY_IMPORTED_RANGES_PREFIX}${ownerPubkeyHex}:${kindsKey}`))?.value as Partial<PostHistoryImportedRanges> | undefined;
            const ranges = record?.schemaVersion === 1 && record.source === "citrine-backup"
                && record.ownerPubkeyHex === ownerPubkeyHex && record.kindsKey === kindsKey
                && record.localRevision === localRevision && Array.isArray(record.ranges)
                ? mergePostHistoryCoverageRanges(record.ranges) : [];
            return { schemaVersion: 1, source: "citrine-backup", ownerPubkeyHex, kindsKey, localRevision, ranges };
        });
    }

    /** Publish only after the whole import and all its event saves have succeeded. */
    async record(input: PostHistoryLocalWriteScope & { kindsKey: string; range: PostHistoryCoverageRange }): Promise<boolean> {
        return this.db.transaction("rw", this.db.meta, async () => {
            await assertPostHistoryLocalWriteCurrent(this.db, input);
            const current = await this.get(input.ownerPubkeyHex, input.kindsKey);
            const ranges = mergePostHistoryCoverageRanges([...current.ranges, input.range]);
            if (JSON.stringify(ranges) === JSON.stringify(current.ranges)) return false;
            await this.db.meta.put({
                key: `${POST_HISTORY_IMPORTED_RANGES_PREFIX}${input.ownerPubkeyHex}:${input.kindsKey}`,
                value: { ...current, ranges }, updatedAt: this.now(),
            });
            await assertPostHistoryLocalWriteCurrent(this.db, input);
            return true;
        });
    }
}

export const postHistoryImportedRangesRepository = new DexiePostHistoryImportedRangesRepository();
