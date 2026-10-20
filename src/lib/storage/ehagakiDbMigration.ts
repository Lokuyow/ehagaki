import { ensureCurrentEHagakiDbSchema } from "../swIndexedDbSchema";
import {
    EHAGAKI_DB_NAME,
    EHAGAKI_DB_NATIVE_VERSION,
    NEXT_EHAGAKI_DB_NATIVE_VERSION,
} from "./ehagakiDbConstants";
import { isCopiedLegacyImportMarker } from "./legacyImportMarkers";

const DISPLAY_HISTORY_STORES = [
    "postHistory",
    "sensitivePayloads",
    "postHistoryChildInteractions",
] as const;

export interface LegacyImportMarker {
    id: string;
    done: true;
    updatedAt: number;
}

export function migrateEhagakiIndexedDb(
    db: IDBDatabase,
    transaction: IDBTransaction | null | undefined,
    oldVersion: number,
    legacyMarkers: readonly LegacyImportMarker[] = [],
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
    if (!wipeDisplayHistory || !transaction) {
        return;
    }

    // WebKit rejects schema changes that are not on the upgradeneeded call
    // stack. Markers are read before this open so meta can be removed here.
    db.deleteObjectStore("meta");
    const legacy = transaction.objectStore("legacyImportState");
    const now = Date.now();
    for (const marker of legacyMarkers) {
        legacy.put({
            id: marker.id,
            done: true,
            updatedAt: typeof marker.updatedAt === "number" ? marker.updatedAt : now,
        });
    }
}

export function openEhagakiIndexedDb({
    indexedDb,
    version,
    databaseName = EHAGAKI_DB_NAME,
    legacyMarkers = [],
    onBlocked,
    onBlockedResolved,
}: {
    indexedDb: IDBFactory;
    version: number | null;
    databaseName?: string;
    legacyMarkers?: readonly LegacyImportMarker[];
    onBlocked?: () => void;
    onBlockedResolved?: () => void;
}): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = version == null
            ? indexedDb.open(databaseName)
            : indexedDb.open(databaseName, version);
        let wasBlocked = false;
        request.onupgradeneeded = (event) => {
            migrateEhagakiIndexedDb(
                request.result,
                request.transaction,
                event.oldVersion,
                legacyMarkers,
            );
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
    const databaseName = hooks.databaseName ?? EHAGAKI_DB_NAME;
    const reported = await readReportedNativeVersion(indexedDb, databaseName);
    if (reported !== null && !needsNativeUpgrade(reported)) {
        return;
    }
    const snapshot = await readDatabaseSnapshot(indexedDb, databaseName, hooks);
    if (!needsNativeUpgrade(snapshot.version)) {
        return;
    }
    const db = await openEhagakiIndexedDb({
        indexedDb,
        version: EHAGAKI_DB_NATIVE_VERSION,
        databaseName,
        legacyMarkers: snapshot.markers,
        onBlocked: hooks.onBlocked,
        onBlockedResolved: hooks.onBlockedResolved,
    });
    db.close();
}

function needsNativeUpgrade(version: number): boolean {
    // Dexie keeps schema patches at 171, 172, … inside logical version 17.
    // Opening those databases again at exactly 170 raises VersionError.
    if (version >= NEXT_EHAGAKI_DB_NATIVE_VERSION) {
        throw new DOMException("The database is newer than this page.", "VersionError");
    }
    return version < EHAGAKI_DB_NATIVE_VERSION;
}

async function readReportedNativeVersion(
    indexedDb: IDBFactory,
    databaseName: string,
): Promise<number | null> {
    if (typeof indexedDb.databases !== "function") return null;
    try {
        const entries = await indexedDb.databases();
        const entry = entries.find((item) => item.name === databaseName);
        // Safari can omit an existing database or report version 0. A positive
        // version is the only databases() result this upgrade trusts.
        if (entry && typeof entry.version === "number" && entry.version > 0) {
            return entry.version;
        }
        return null;
    } catch {
        return null;
    }
}

async function readDatabaseSnapshot(
    indexedDb: IDBFactory,
    databaseName: string,
    hooks: {
        onBlocked?: () => void;
        onBlockedResolved?: () => void;
    },
): Promise<{ version: number; markers: LegacyImportMarker[] }> {
    const db = await openEhagakiIndexedDb({
        indexedDb,
        version: null,
        databaseName,
        onBlocked: hooks.onBlocked,
        onBlockedResolved: hooks.onBlockedResolved,
    });
    db.onversionchange = () => {
        db.close();
    };
    try {
        const version = db.version;
        const markers = version >= EHAGAKI_DB_NATIVE_VERSION
            ? []
            : await readLegacyImportMarkers(db);
        return { version, markers };
    } finally {
        db.close();
    }
}

async function readLegacyImportMarkers(db: IDBDatabase): Promise<LegacyImportMarker[]> {
    if (!db.objectStoreNames.contains("meta")) return [];
    const request = db.transaction("meta", "readonly").objectStore("meta").getAll();
    const rows = await new Promise<unknown[]>((resolve, reject) => {
        request.onsuccess = () => {
            resolve(Array.isArray(request.result) ? request.result : []);
        };
        request.onerror = () => {
            reject(request.error ?? new Error("Failed to read legacy import markers"));
        };
    });
    const now = Date.now();
    const markers: LegacyImportMarker[] = [];
    for (const row of rows) {
        if (!row || typeof row !== "object") continue;
        const record = row as { key?: unknown; value?: unknown; updatedAt?: unknown };
        if (typeof record.key !== "string" || record.value !== true) continue;
        if (!isCopiedLegacyImportMarker(record.key)) continue;
        markers.push({
            id: record.key,
            done: true,
            updatedAt: typeof record.updatedAt === "number" ? record.updatedAt : now,
        });
    }
    return markers;
}
