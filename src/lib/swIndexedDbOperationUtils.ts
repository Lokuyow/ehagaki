export interface IndexedDbOpenRequest<TDb> {
    onupgradeneeded: ((event: { target: { result: TDb } }) => void) | null;
    onerror: (() => void) | null;
    onsuccess: ((event: { target: { result: TDb } }) => void) | null;
}

export interface IndexedDbOpenLike<TDb> {
    open: (dbName: string, dbVersion: number) => IndexedDbOpenRequest<TDb>;
}

export interface SharedMediaStoreOperationDbLike {
    objectStoreNames: {
        contains: (name: string) => boolean;
    };
    close: () => void;
    transaction: (storeNames: string[], mode: 'readwrite') => {
        objectStore: (name: string) => {
            put: (record: unknown) => { onsuccess: (() => void) | null };
            delete: (recordId: string) => { onsuccess: (() => void) | null };
        };
        onerror: (() => void) | null;
    };
}

export type IndexedDbOperation<TDb> = (
    db: TDb,
    resolve: () => void,
    reject: (error: Error) => void,
) => void;

export function executeServiceWorkerIndexedDbOperation<TDb>({
    indexedDb,
    dbName,
    dbVersion,
    onUpgradeNeeded,
    operation,
}: {
    indexedDb: IndexedDbOpenLike<TDb>;
    dbName: string;
    dbVersion: number;
    onUpgradeNeeded?: (db: TDb) => void;
    operation: IndexedDbOperation<TDb>;
}): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const request = indexedDb.open(dbName, dbVersion);

            request.onupgradeneeded = (event) => {
                onUpgradeNeeded?.(event.target.result);
            };

            request.onerror = () => reject(new Error('IndexedDB open failed'));

            request.onsuccess = (event) => {
                const db = event.target.result;
                try {
                    operation(db, resolve, reject);
                } catch (error) {
                    (db as { close?: () => void }).close?.();
                    reject(error instanceof Error ? error : new Error(String(error)));
                }
            };
        } catch (error) {
            reject(error instanceof Error ? error : new Error(String(error)));
        }
    });
}

export function createPutSharedMediaDbOperation({
    storeName,
    record,
}: {
    storeName: string;
    record: unknown;
}): IndexedDbOperation<SharedMediaStoreOperationDbLike> {
    return (db, resolve, reject) => {
        if (!db.objectStoreNames.contains(storeName)) {
            db.close();
            reject(new Error('Shared media store is not available'));
            return;
        }

        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        store.put(record).onsuccess = () => {
            db.close();
            resolve();
        };
        transaction.onerror = () => {
            db.close();
            reject(new Error('Failed to persist shared media'));
        };
    };
}

export function createClearSharedMediaDbOperation({
    storeName,
    recordId,
}: {
    storeName: string;
    recordId: string;
}): IndexedDbOperation<SharedMediaStoreOperationDbLike> {
    return (db, resolve) => {
        if (!db.objectStoreNames.contains(storeName)) {
            db.close();
            resolve();
            return;
        }

        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        store.delete(recordId).onsuccess = () => {
            db.close();
            resolve();
        };
        transaction.onerror = () => {
            db.close();
            resolve();
        };
    };
}