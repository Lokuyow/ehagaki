import type { SharedMediaData, SharedMediaMetadata } from "../types";
import {
    ehagakiDb,
    SHARED_MEDIA_RECORD_ID,
    type EHagakiDB,
    type SharedMediaFileRecord,
    type SharedMediaRecord,
} from "./ehagakiDb";

const SHARED_MEDIA_SCHEMA_VERSION = 1;

function createShareId(): string {
    return crypto.randomUUID();
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    if (typeof file.arrayBuffer === "function") {
        return file.arrayBuffer();
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
                resolve(reader.result);
            } else {
                reject(new Error("Failed to read shared media file"));
            }
        };
        reader.onerror = () => reject(reader.error ?? new Error("Failed to read shared media file"));
        reader.readAsArrayBuffer(file);
    });
}

async function toFileRecord(file: File): Promise<SharedMediaFileRecord> {
    return {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        arrayBuffer: await readFileAsArrayBuffer(file),
    };
}

function toFile(record: SharedMediaFileRecord): File {
    return new File(
        [record.arrayBuffer],
        record.name || "shared-media",
        {
            type: record.type || "application/octet-stream",
            lastModified: record.lastModified,
        },
    );
}

function toSharedMediaData(record: SharedMediaRecord): SharedMediaData | null {
    const images = record.images.map(toFile);
    const title = record.title ?? "";
    const text = record.text ?? "";
    const url = record.url ?? "";
    if (images.length === 0 && !title && !text && !url) return null;

    return {
        images,
        metadata: record.metadata,
        title,
        text,
        url,
        shareId: record.shareId,
        bodyStatus: record.bodyStatus ?? "not-applicable",
        automaticRetryCount: record.automaticRetryCount ?? 0,
    };
}

export interface SharedMediaRepository {
    getLatest(): Promise<SharedMediaData | null>;
    putLatest(data: SharedMediaData): Promise<void>;
    deleteLatest(): Promise<void>;
    getAndClearLatest(): Promise<SharedMediaData | null>;
    updateLatestForShare(
        shareId: string,
        update: Pick<SharedMediaData, "images" | "metadata" | "bodyStatus" | "automaticRetryCount">,
    ): Promise<"updated" | "stale">;
    deleteLatestForShare(shareId: string): Promise<"deleted" | "stale">;
}

export class DexieSharedMediaRepository implements SharedMediaRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async getLatest(): Promise<SharedMediaData | null> {
        return await this.db.transaction("rw", this.db.sharedMedia, async () => {
            const record = await this.db.sharedMedia.get(SHARED_MEDIA_RECORD_ID);
            if (!record) return null;

            if (!record.shareId) {
                record.shareId = createShareId();
                record.title ??= "";
                record.text ??= "";
                record.url ??= "";
                record.bodyStatus ??= "not-applicable";
                record.automaticRetryCount ??= 0;
                record.updatedAt = this.now();
                await this.db.sharedMedia.put(record);
            }

            return toSharedMediaData(record);
        });
    }

    async putLatest(data: SharedMediaData): Promise<void> {
        const timestamp = this.now();
        const images = await Promise.all(data.images.map(toFileRecord));
        const metadata = data.metadata?.map((item): SharedMediaMetadata => ({ ...item }));

        await this.db.sharedMedia.put({
            id: SHARED_MEDIA_RECORD_ID,
            images,
            metadata,
            title: data.title ?? "",
            text: data.text ?? "",
            url: data.url ?? "",
            shareId: data.shareId ?? createShareId(),
            bodyStatus: data.bodyStatus ?? "not-applicable",
            automaticRetryCount: data.automaticRetryCount ?? 0,
            createdAt: timestamp,
            updatedAt: timestamp,
            schemaVersion: SHARED_MEDIA_SCHEMA_VERSION,
        });
    }

    async deleteLatest(): Promise<void> {
        await this.db.sharedMedia.delete(SHARED_MEDIA_RECORD_ID);
    }

    async getAndClearLatest(): Promise<SharedMediaData | null> {
        const data = await this.getLatest();
        if (data) {
            await this.deleteLatest();
        }
        return data;
    }

    async updateLatestForShare(
        shareId: string,
        update: Pick<SharedMediaData, "images" | "metadata" | "bodyStatus" | "automaticRetryCount">,
    ): Promise<"updated" | "stale"> {
        return await this.db.transaction("rw", this.db.sharedMedia, async () => {
            const record = await this.db.sharedMedia.get(SHARED_MEDIA_RECORD_ID);
            if (!record || record.shareId !== shareId) return "stale";

            record.images = await Promise.all(update.images.map(toFileRecord));
            record.metadata = update.metadata?.map((item): SharedMediaMetadata => ({ ...item }));
            record.bodyStatus = update.bodyStatus;
            record.automaticRetryCount = update.automaticRetryCount;
            record.updatedAt = this.now();
            await this.db.sharedMedia.put(record);
            return "updated";
        });
    }

    async deleteLatestForShare(shareId: string): Promise<"deleted" | "stale"> {
        return await this.db.transaction("rw", this.db.sharedMedia, async () => {
            const record = await this.db.sharedMedia.get(SHARED_MEDIA_RECORD_ID);
            if (!record || record.shareId !== shareId) return "stale";
            await this.db.sharedMedia.delete(SHARED_MEDIA_RECORD_ID);
            return "deleted";
        });
    }
}

export const sharedMediaRepository = new DexieSharedMediaRepository();
