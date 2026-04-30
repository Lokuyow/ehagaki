import Dexie, { type Table } from "dexie";
import type { CustomEmojiSourceType } from "../customEmoji";
import type { DraftChannelData, DraftReplyQuoteData, MediaGalleryItem } from "../types";

export const EHAGAKI_DB_NAME = "eHagakiDB";
export const EHAGAKI_DB_VERSION = 3;

export interface MetaRecord {
    key: string;
    value: unknown;
    updatedAt: number;
}

export interface EmojiItemRecord {
    id: string;
    pubkeyHex: string;
    identityKey: string;
    shortcode: string;
    shortcodeLower: string;
    src: string;
    setAddress: string | null;
    sortIndex: number;
    sourceType: CustomEmojiSourceType;
    sourceAddress: string | null;
    fetchedAt: number;
    updatedAt: number;
}

export interface EmojiCacheMetaRecord {
    pubkeyHex: string;
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
    pinned?: boolean;
    updatedAt: number;
    galleryItems?: MediaGalleryItem[];
    channelData?: DraftChannelData;
    replyQuoteData?: DraftReplyQuoteData;
    schemaVersion: number;
}

export class EHagakiDB extends Dexie {
    meta!: Table<MetaRecord, string>;
    emojiItems!: Table<EmojiItemRecord, string>;
    emojiCacheMeta!: Table<EmojiCacheMetaRecord, string>;
    drafts!: Table<DraftRecord, string>;

    constructor(databaseName = EHAGAKI_DB_NAME) {
        super(databaseName);

        this.version(1).stores({
            meta: "key, updatedAt",
            emojis: "pubkeyHex, fetchedAt, updatedAt",
        });

        this.version(EHAGAKI_DB_VERSION).stores({
            meta: "key, updatedAt",
            emojis: null,
            emojiItems: "id, pubkeyHex, identityKey, shortcodeLower, sortIndex, sourceType, sourceAddress, fetchedAt, updatedAt, [pubkeyHex+sortIndex], [pubkeyHex+identityKey]",
            emojiCacheMeta: "pubkeyHex, fetchedAt, updatedAt, schemaVersion",
            drafts: "id, scopeKey, pubkeyHex, updatedAt, timestamp, [scopeKey+updatedAt]",
        });
    }
}

export const ehagakiDb = new EHagakiDB();
