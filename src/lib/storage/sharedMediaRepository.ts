import type { SharedMediaData, SharedMediaMetadata } from "../types";
import {
    ehagakiDb,
    SHARED_MEDIA_RECORD_ID,
    type EHagakiDB,
    type SharedMediaFileRecord,
    type SharedMediaRecord,
} from "./ehagakiDb";

const SHARED_MEDIA_SCHEMA_VERSION = 1;

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
    if (images.length === 0) return null;

    return {
        images,
        metadata: record.metadata,
    };
}

export interface SharedMediaRepository {
    getLatest(): Promise<SharedMediaData | null>;
    putLatest(data: SharedMediaData): Promise<void>;
    deleteLatest(): Promise<void>;
    getAndClearLatest(): Promise<SharedMediaData | null>;
}

export class DexieSharedMediaRepository implements SharedMediaRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async getLatest(): Promise<SharedMediaData | null> {
        const record = await this.db.sharedMedia.get(SHARED_MEDIA_RECORD_ID);
        return record ? toSharedMediaData(record) : null;
    }

    async putLatest(data: SharedMediaData): Promise<void> {
        const timestamp = this.now();
        const images = await Promise.all(data.images.map(toFileRecord));
        const metadata = data.metadata?.map((item): SharedMediaMetadata => ({ ...item }));

        await this.db.sharedMedia.put({
            id: SHARED_MEDIA_RECORD_ID,
            images,
            metadata,
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
}

export const sharedMediaRepository = new DexieSharedMediaRepository();
