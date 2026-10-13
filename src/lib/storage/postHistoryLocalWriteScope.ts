import type { EHagakiDB } from "./ehagakiDb";

export const POST_HISTORY_CHILD_WRITE_GENERATION_ID = "global";

const childWriteGenerationByDatabase = new WeakMap<EHagakiDB, number>();

export interface PostHistoryLocalWriteScope {
    ownerPubkeyHex: string;
    expectedRevision: number;
    isActive: () => boolean;
}

export async function getPostHistoryLocalRevision(db: EHagakiDB, ownerPubkeyHex: string): Promise<number> {
    if (!db.isOpen()) return 0;
    const value = (await db.postHistoryWriteGeneration.get(ownerPubkeyHex))?.value;
    return typeof value === "number" && Number.isSafeInteger(value) ? value : 0;
}

export async function isPostHistoryLocalWriteCurrent(db: EHagakiDB, scope: PostHistoryLocalWriteScope): Promise<boolean> {
    return scope.isActive()
        && await getPostHistoryLocalRevision(db, scope.ownerPubkeyHex) === scope.expectedRevision
        && scope.isActive();
}

/** Check inside the transaction containing the corresponding writes. */
export async function assertPostHistoryLocalWriteCurrent(db: EHagakiDB, scope?: PostHistoryLocalWriteScope): Promise<void> {
    if (scope && !await isPostHistoryLocalWriteCurrent(db, scope)) throw new PostHistoryLocalWriteStaleError();
}

export async function advancePostHistoryLocalRevision(db: EHagakiDB, ownerPubkeyHex: string, now: number): Promise<void> {
    const revision = await getPostHistoryLocalRevision(db, ownerPubkeyHex);
    await db.postHistoryWriteGeneration.put({
        id: ownerPubkeyHex,
        value: revision + 1,
        updatedAt: now,
    });
}

export function getPostHistoryChildWriteGeneration(db: EHagakiDB): Promise<number> {
    return Promise.resolve(childWriteGenerationByDatabase.get(db) ?? 0);
}

export async function advancePostHistoryChildWriteGeneration(db: EHagakiDB, now: number): Promise<void> {
    const generation = childWriteGenerationByDatabase.get(db) ?? await readStoredChildWriteGeneration(db);
    const next = generation + 1;
    childWriteGenerationByDatabase.set(db, next);
    await db.postHistoryChildWriteGeneration.put({
        id: POST_HISTORY_CHILD_WRITE_GENERATION_ID,
        value: next,
        updatedAt: now,
    });
}

async function readStoredChildWriteGeneration(db: EHagakiDB): Promise<number> {
    if (!db.isOpen()) return 0;
    const value = (await db.postHistoryChildWriteGeneration.get(POST_HISTORY_CHILD_WRITE_GENERATION_ID))?.value;
    return typeof value === "number" && Number.isSafeInteger(value) ? value : 0;
}

export class PostHistoryLocalWriteStaleError extends Error {
    constructor() { super("Post history operation is no longer active"); }
}
