import type {
    ChannelImageCacheMetaRecord,
    ChannelMetadataRecord,
} from "./storage/ehagakiDb";

export interface ChannelImageMetaRepository {
    getChannelMetadata(eventId: string): Promise<ChannelMetadataRecord | null>;
    get(url: string): Promise<ChannelImageCacheMetaRecord | null>;
    getAll(): Promise<ChannelImageCacheMetaRecord[]>;
    put(record: ChannelImageCacheMetaRecord): Promise<void>;
    touchLastAccessedAt(url: string, accessedAt: number): Promise<void>;
    markAttempt(url: string, attemptedAt: number): Promise<void>;
    markAttemptAndAccess(url: string, attemptedAt: number): Promise<void>;
    delete(url: string): Promise<void>;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
    });
}

export class ServiceWorkerChannelImageMetaRepository
implements ChannelImageMetaRepository {
    constructor(
        private readonly indexedDb: IDBFactory,
        private readonly dbName: string,
        private readonly dbVersion: number,
        private readonly ensureSchema: (
            db: IDBDatabase,
            transaction: IDBTransaction | null,
        ) => void,
        private readonly onBlocked: () => void = () => undefined,
        private readonly onBlockedResolved: () => void = () => undefined,
    ) {}

    private open(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = this.indexedDb.open(this.dbName, this.dbVersion);
            let wasBlocked = false;
            request.onupgradeneeded = () => this.ensureSchema(
                request.result,
                request.transaction,
            );
            request.onblocked = () => {
                wasBlocked = true;
                this.onBlocked();
            };
            request.onsuccess = () => {
                if (wasBlocked) {
                    this.onBlockedResolved();
                }
                resolve(request.result);
            };
            request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed"));
        });
    }

    private async read<T>(storeName: string, key: IDBValidKey): Promise<T | null> {
        const db = await this.open();
        try {
            const transaction = db.transaction(storeName, "readonly");
            const result = await requestResult<T | undefined>(
                transaction.objectStore(storeName).get(key),
            );
            return result ?? null;
        } finally {
            db.close();
        }
    }

    async getChannelMetadata(eventId: string): Promise<ChannelMetadataRecord | null> {
        return this.read<ChannelMetadataRecord>("channelMetadata", eventId);
    }

    async get(url: string): Promise<ChannelImageCacheMetaRecord | null> {
        return this.read<ChannelImageCacheMetaRecord>("channelImageCacheMeta", url);
    }

    async getAll(): Promise<ChannelImageCacheMetaRecord[]> {
        const db = await this.open();
        try {
            const transaction = db.transaction("channelImageCacheMeta", "readonly");
            return await requestResult<ChannelImageCacheMetaRecord[]>(
                transaction.objectStore("channelImageCacheMeta").getAll(),
            );
        } finally {
            db.close();
        }
    }

    private async write(operation: (store: IDBObjectStore) => IDBRequest): Promise<void> {
        const db = await this.open();
        try {
            const transaction = db.transaction("channelImageCacheMeta", "readwrite");
            await new Promise<void>((resolve, reject) => {
                const request = operation(transaction.objectStore("channelImageCacheMeta"));
                request.onerror = () => reject(
                    request.error ?? new Error("IndexedDB write request failed"),
                );
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(
                    transaction.error ?? new Error("IndexedDB write transaction failed"),
                );
                transaction.onabort = () => reject(
                    transaction.error ?? new Error("IndexedDB write transaction aborted"),
                );
            });
        } finally {
            db.close();
        }
    }

    async put(record: ChannelImageCacheMetaRecord): Promise<void> {
        await this.write((store) => store.put(record));
    }

    private async updateTimestamps(
        url: string,
        updates: Partial<Pick<
            ChannelImageCacheMetaRecord,
            "lastAccessedAt" | "lastAttemptAt"
        >>,
    ): Promise<void> {
        const db = await this.open();
        try {
            const transaction = db.transaction("channelImageCacheMeta", "readwrite");
            await new Promise<void>((resolve, reject) => {
                const store = transaction.objectStore("channelImageCacheMeta");
                const request = store.get(url);
                request.onsuccess = () => {
                    const current = request.result as ChannelImageCacheMetaRecord | undefined;
                    if (!current) return;
                    const lastAccessedAt = Math.max(
                        current.lastAccessedAt,
                        updates.lastAccessedAt ?? current.lastAccessedAt,
                    );
                    const lastAttemptAt = Math.max(
                        current.lastAttemptAt,
                        updates.lastAttemptAt ?? current.lastAttemptAt,
                    );
                    if (
                        lastAccessedAt === current.lastAccessedAt
                        && lastAttemptAt === current.lastAttemptAt
                    ) return;
                    store.put({ ...current, lastAccessedAt, lastAttemptAt });
                };
                request.onerror = () => reject(
                    request.error ?? new Error("IndexedDB timestamp read failed"),
                );
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(
                    transaction.error ?? new Error("IndexedDB timestamp transaction failed"),
                );
                transaction.onabort = () => reject(
                    transaction.error ?? new Error("IndexedDB timestamp transaction aborted"),
                );
            });
        } finally {
            db.close();
        }
    }

    async touchLastAccessedAt(url: string, accessedAt: number): Promise<void> {
        await this.updateTimestamps(url, { lastAccessedAt: accessedAt });
    }

    async markAttempt(url: string, attemptedAt: number): Promise<void> {
        await this.updateTimestamps(url, { lastAttemptAt: attemptedAt });
    }

    async markAttemptAndAccess(url: string, attemptedAt: number): Promise<void> {
        await this.updateTimestamps(url, {
            lastAttemptAt: attemptedAt,
            lastAccessedAt: attemptedAt,
        });
    }

    async delete(url: string): Promise<void> {
        await this.write((store) => store.delete(url));
    }
}
