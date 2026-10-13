import Dexie from "dexie";
import type { EHagakiDB } from "./ehagakiDb";

export const POST_HISTORY_CHILD_WRITE_GENERATION_ID = "global";

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

function normalizeChildWriteGeneration(value: unknown): number {
    return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

/**
 * Reads the persistent generation. Inside a transaction that already includes this
 * table, the read joins that transaction. Otherwise it uses the native store so an
 * unrelated Dexie transaction cannot delay or deadlock the caller. An unopened
 * connection is left closed.
 */
export async function getPostHistoryChildWriteGeneration(db: EHagakiDB): Promise<number> {
    if (!db.isOpen()) return 0;
    const current = Dexie.currentTransaction;
    if (!current || current.db !== db || !current.storeNames.includes("postHistoryChildWriteGeneration")) {
        return readChildWriteGenerationOutsideDexieTransaction(db);
    }
    const value = (await db.postHistoryChildWriteGeneration.get(POST_HISTORY_CHILD_WRITE_GENERATION_ID))?.value;
    return normalizeChildWriteGeneration(value);
}

function readChildWriteGenerationOutsideDexieTransaction(db: EHagakiDB): Promise<number> {
    const backend = db.backendDB();
    if (!backend.objectStoreNames.contains("postHistoryChildWriteGeneration")) return Promise.resolve(0);
    return new Promise((resolve, reject) => {
        const request = backend
            .transaction("postHistoryChildWriteGeneration", "readonly")
            .objectStore("postHistoryChildWriteGeneration")
            .get(POST_HISTORY_CHILD_WRITE_GENERATION_ID);
        request.onsuccess = () => resolve(normalizeChildWriteGeneration(request.result?.value));
        request.onerror = () => reject(request.error ?? new Error("child write generation read failed"));
    });
}

/** Increments the stored generation. A failed transaction rolls this write back. */
export async function advancePostHistoryChildWriteGeneration(db: EHagakiDB, now: number): Promise<void> {
    const current = Dexie.currentTransaction;
    if (current?.db === db && current.storeNames.includes("postHistoryChildWriteGeneration")) {
        await putNextChildWriteGeneration(db, now);
        return;
    }
    await db.transaction("rw", db.postHistoryChildWriteGeneration, async () => {
        await putNextChildWriteGeneration(db, now);
    });
}

async function putNextChildWriteGeneration(db: EHagakiDB, now: number): Promise<void> {
    const generation = await getPostHistoryChildWriteGeneration(db);
    await db.postHistoryChildWriteGeneration.put({
        id: POST_HISTORY_CHILD_WRITE_GENERATION_ID,
        value: generation + 1,
        updatedAt: now,
    });
}

export class PostHistoryLocalWriteStaleError extends Error {
    constructor() { super("Post history operation is no longer active"); }
}
