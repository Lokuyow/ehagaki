import Dexie, { type Table } from "dexie";
import type { CustomEmojiItem } from "../customEmoji";
import type { DraftChannelData, DraftReplyQuoteData, MediaGalleryItem } from "../types";

export const EHAGAKI_DB_NAME = "eHagakiDB";
export const EHAGAKI_DB_VERSION = 2;

export interface MetaRecord {
    key: string;
    value: unknown;
    updatedAt: number;
}

export interface EmojisRecord {
    pubkeyHex: string;
    items: CustomEmojiItem[];
    fetchedAt: number;
    updatedAt: number;
    schemaVersion: number;
}

export interface DraftRecord {
    id: string;
    pubkeyHex: string | null;
    scopeKey: string;
    content: string;
    preview: string;
    timestamp: number;
    updatedAt: number;
    galleryItems?: MediaGalleryItem[];
    channelData?: DraftChannelData;
    replyQuoteData?: DraftReplyQuoteData;
    schemaVersion: number;
}

export class EHagakiDB extends Dexie {
    meta!: Table<MetaRecord, string>;
    emojis!: Table<EmojisRecord, string>;
    drafts!: Table<DraftRecord, string>;

    constructor(databaseName = EHAGAKI_DB_NAME) {
        super(databaseName);

        this.version(1).stores({
            meta: "key, updatedAt",
            emojis: "pubkeyHex, fetchedAt, updatedAt",
        });

        this.version(EHAGAKI_DB_VERSION).stores({
            meta: "key, updatedAt",
            emojis: "pubkeyHex, fetchedAt, updatedAt",
            drafts: "id, scopeKey, pubkeyHex, updatedAt, timestamp, [scopeKey+updatedAt]",
        });
    }
}

export const ehagakiDb = new EHagakiDB();
