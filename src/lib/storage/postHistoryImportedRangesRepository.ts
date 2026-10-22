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
        return this.db.transaction("r", this.db.postHistoryCitrineRanges, this.db.postHistoryWriteGeneration, async () => {
            const localRevision = await getPostHistoryLocalRevision(this.db, ownerPubkeyHex);
            const item = await this.db.postHistoryCitrineRanges.get(`${POST_HISTORY_IMPORTED_RANGES_PREFIX}${ownerPubkeyHex}:${kindsKey}`);
            const record = item?.value as Partial<PostHistoryImportedRanges> | undefined;
            const committedRanges = this.readCommittedRanges(record, ownerPubkeyHex, kindsKey);
            const ranges = record?.localRevision === localRevision ? committedRanges : [];
            return { schemaVersion: 1, source: "citrine-backup", ownerPubkeyHex, kindsKey, localRevision, ranges };
        });
    }

    /** Ranges stored for this owner, regardless of the current write generation. */
    readCommittedRanges(
        record: Partial<PostHistoryImportedRanges> | undefined,
        ownerPubkeyHex: string,
        kindsKey: string,
    ): PostHistoryCoverageRange[] {
        return record?.schemaVersion === 1 && record.source === "citrine-backup"
            && record.ownerPubkeyHex === ownerPubkeyHex && record.kindsKey === kindsKey
            && Array.isArray(record.ranges)
            ? mergePostHistoryCoverageRanges(record.ranges) : [];
    }

    async getCommittedRanges(ownerPubkeyHex: string, kindsKey: string): Promise<PostHistoryCoverageRange[]> {
        const item = await this.db.postHistoryCitrineRanges.get(`${POST_HISTORY_IMPORTED_RANGES_PREFIX}${ownerPubkeyHex}:${kindsKey}`);
        return this.readCommittedRanges(item?.value as Partial<PostHistoryImportedRanges> | undefined, ownerPubkeyHex, kindsKey);
    }

    /** Publish only after the whole import and all its event saves have succeeded. */
    async record(input: PostHistoryLocalWriteScope & { kindsKey: string; range: PostHistoryCoverageRange }): Promise<boolean> {
        return this.db.transaction("rw", this.db.postHistoryCitrineRanges, this.db.postHistoryWriteGeneration, async () => {
            await assertPostHistoryLocalWriteCurrent(this.db, input);
            const current = await this.get(input.ownerPubkeyHex, input.kindsKey);
            const ranges = mergePostHistoryCoverageRanges([...current.ranges, input.range]);
            if (JSON.stringify(ranges) === JSON.stringify(current.ranges)) return false;
            const localRevision = await getPostHistoryLocalRevision(this.db, input.ownerPubkeyHex);
            await this.db.postHistoryCitrineRanges.put({
                id: `${POST_HISTORY_IMPORTED_RANGES_PREFIX}${input.ownerPubkeyHex}:${input.kindsKey}`,
                ownerPubkeyHex: input.ownerPubkeyHex,
                value: {
                    schemaVersion: 1,
                    source: "citrine-backup",
                    ownerPubkeyHex: input.ownerPubkeyHex,
                    kindsKey: input.kindsKey,
                    localRevision,
                    ranges,
                },
                updatedAt: this.now(),
            });
            await assertPostHistoryLocalWriteCurrent(this.db, input);
            return true;
        });
    }
}

export const postHistoryImportedRangesRepository = new DexiePostHistoryImportedRangesRepository();
