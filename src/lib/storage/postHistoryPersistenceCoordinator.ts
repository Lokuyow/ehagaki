import type { EHagakiDB } from "./ehagakiDb";
import { advancePostHistoryChildWriteGeneration } from "./postHistoryLocalWriteScope";
import { DexiePostHistoryRelayCoverageRepository } from "./postHistoryRelayCoverageRepository";

export function postHistoryEvidenceTables(db: EHagakiDB) {
    return [
        db.postHistoryExternalCoverage,
        db.postHistoryCitrineRanges,
        db.postHistoryLocalBrowsingRanges,
        db.postHistoryLocalResumeCursor,
        db.postHistoryJumpAnchors,
        db.postHistoryWriteGeneration,
        db.postHistoryChildWriteGeneration,
    ];
}

export function postHistoryContinuityTables(db: EHagakiDB) {
    return [
        db.postHistoryExternalCoverage,
        db.postHistoryCitrineRanges,
        db.postHistoryLocalBrowsingRanges,
        db.postHistoryLocalResumeCursor,
        db.postHistoryWriteGeneration,
    ];
}

/** Empties one owner's display history and the evidence cleared with it. */
export async function clearPostHistoryDisplayForPubkey(
    db: EHagakiDB,
    pubkeyHex: string,
    now: () => number,
): Promise<{ deletedPostHistoryCount: number; deletedPayloadCount: number }> {
    let deletedPostHistoryCount = 0;
    let deletedPayloadCount = 0;
    await db.transaction(
        "rw",
        [
            db.postHistory,
            db.postHistoryChildInteractions,
            db.sensitivePayloads,
            ...postHistoryEvidenceTables(db),
        ],
        async () => {
            await new DexiePostHistoryRelayCoverageRepository(db, now).clearForPubkey(pubkeyHex);
            // Snapshot parents are not rows in postHistory. Advance even when this
            // owner has no saved posts so in-flight child writes are still rejected.
            await advancePostHistoryChildWriteGeneration(db, now());
            deletedPayloadCount = await db.sensitivePayloads
                .where("pubkeyHex")
                .equals(pubkeyHex)
                .delete();
            const firstPostHistoryRecord = await db.postHistory.orderBy("pubkeyHex").first();
            if (!firstPostHistoryRecord) return;

            const lastPostHistoryRecord = await db.postHistory.orderBy("pubkeyHex").last();
            const canClearEntirePostHistory = firstPostHistoryRecord.pubkeyHex === pubkeyHex
                && lastPostHistoryRecord?.pubkeyHex === pubkeyHex;
            if (canClearEntirePostHistory) {
                await db.postHistoryChildInteractions.clear();
                await db.postHistory.clear();
                deletedPostHistoryCount = 1;
                return;
            }

            const parentEventIds = (await db.postHistory
                .where("pubkeyHex")
                .equals(pubkeyHex)
                .primaryKeys()).map(String);
            if (parentEventIds.length > 0) {
                await db.postHistoryChildInteractions
                    .where("parentEventId")
                    .anyOf(parentEventIds)
                    .delete();
            }
            deletedPostHistoryCount = await db.postHistory
                .where("pubkeyHex")
                .equals(pubkeyHex)
                .delete();
        },
    );
    return { deletedPostHistoryCount, deletedPayloadCount };
}
