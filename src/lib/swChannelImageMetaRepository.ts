import type {
    ChannelImageCacheMetaRecord,
    ChannelMetadataRecord,
} from "./storage/ehagakiDb";

export interface ChannelImageMetaRepository {
    getChannelMetadata(eventId: string): Promise<ChannelMetadataRecord | null>;
    get(url: string): Promise<ChannelImageCacheMetaRecord | null>;
    getAll(): Promise<ChannelImageCacheMetaRecord[]>;
    put(record: ChannelImageCacheMetaRecord): Promise<void>;
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
        private readonly ensureSchema: (db: IDBDatabase) => void,
    ) {}

    private open(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = this.indexedDb.open(this.dbName, this.dbVersion);
            request.onupgradeneeded = () => this.ensureSchema(request.result);
            request.onsuccess = () => resolve(request.result);
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

    async delete(url: string): Promise<void> {
        await this.write((store) => store.delete(url));
    }
}
