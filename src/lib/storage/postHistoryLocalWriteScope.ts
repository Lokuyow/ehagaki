import type { EHagakiDB } from "./ehagakiDb";

const LOCAL_REVISION_PREFIX = "postHistoryLocalRevision:";

export interface PostHistoryLocalWriteScope {
    ownerPubkeyHex: string;
    expectedRevision: number;
    isActive: () => boolean;
}

export async function getPostHistoryLocalRevision(db: EHagakiDB, ownerPubkeyHex: string): Promise<number> {
    const value = (await db.meta.get(`${LOCAL_REVISION_PREFIX}${ownerPubkeyHex}`))?.value;
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
    await db.meta.put({ key: `${LOCAL_REVISION_PREFIX}${ownerPubkeyHex}`, value: revision + 1, updatedAt: now });
}

export class PostHistoryLocalWriteStaleError extends Error {
    constructor() { super("Post history operation is no longer active"); }
}
