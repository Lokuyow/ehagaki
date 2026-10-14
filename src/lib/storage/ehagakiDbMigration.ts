import { ensureCurrentEHagakiDbSchema } from "../swIndexedDbSchema";
import { EHAGAKI_DB_NAME, EHAGAKI_DB_NATIVE_VERSION } from "./ehagakiDbConstants";
import { isCopiedLegacyImportMarker } from "./legacyImportMarkers";

const DISPLAY_HISTORY_STORES = [
    "postHistory",
    "sensitivePayloads",
    "postHistoryChildInteractions",
] as const;

export function migrateEhagakiIndexedDb(
    db: IDBDatabase,
    transaction: IDBTransaction | null | undefined,
    oldVersion: number,
): void {
    const hadMeta = db.objectStoreNames.contains("meta");
    const wipeDisplayHistory = oldVersion !== 0 && hadMeta && !!transaction;
    // Drop the old history stores before creating indexes. Clearing every row
    // and indexing that data freezes the upgrade for a large profile.
    if (wipeDisplayHistory) {
        for (const name of DISPLAY_HISTORY_STORES) {
            if (db.objectStoreNames.contains(name)) {
                db.deleteObjectStore(name);
            }
        }
    }
    ensureCurrentEHagakiDbSchema(db, "sharedMedia", transaction);
    // Version 0 creates the final schema. Version 1 already has that schema and
    // only needs the later open(170) to bump the version. Neither path wipes
    // display history or copies markers.
    if (!wipeDisplayHistory) {
        return;
    }
    if (!transaction) {
        throw new Error("eHagaki database upgrade requires a version change transaction");
    }

    const meta = transaction.objectStore("meta");
    const request = meta.getAll();
    request.onsuccess = () => {
        const rows = Array.isArray(request.result) ? request.result : [];
        const legacy = transaction.objectStore("legacyImportState");
        const now = Date.now();
        for (const row of rows) {
            if (!row || typeof row !== "object") continue;
            const record = row as { key?: unknown; value?: unknown; updatedAt?: unknown };
            if (typeof record.key !== "string" || record.value !== true) continue;
            if (!isCopiedLegacyImportMarker(record.key)) continue;
            legacy.put({
                id: record.key,
                done: true,
                updatedAt: typeof record.updatedAt === "number" ? record.updatedAt : now,
            });
        }
        db.deleteObjectStore("meta");
    };
}

export function openEhagakiIndexedDb({
    indexedDb,
    version,
    databaseName = EHAGAKI_DB_NAME,
    onBlocked,
    onBlockedResolved,
}: {
    indexedDb: IDBFactory;
    version: number | null;
    databaseName?: string;
    onBlocked?: () => void;
    onBlockedResolved?: () => void;
}): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = version == null
            ? indexedDb.open(databaseName)
            : indexedDb.open(databaseName, version);
        let wasBlocked = false;
        request.onupgradeneeded = (event) => {
            migrateEhagakiIndexedDb(request.result, request.transaction, event.oldVersion);
        };
        request.onblocked = () => {
            wasBlocked = true;
            onBlocked?.();
        };
        request.onerror = () => {
            reject(request.error ?? new Error("IndexedDB open failed"));
        };
        request.onsuccess = () => {
            if (wasBlocked) onBlockedResolved?.();
            resolve(request.result);
        };
    });
}

export async function upgradeEhagakiDatabase(
    indexedDb: IDBFactory,
    hooks: {
        databaseName?: string;
        onBlocked?: () => void;
        onBlockedResolved?: () => void;
    } = {},
): Promise<void> {
    const db = await openEhagakiIndexedDb({
        indexedDb,
        version: EHAGAKI_DB_NATIVE_VERSION,
        ...hooks,
    });
    db.close();
}
