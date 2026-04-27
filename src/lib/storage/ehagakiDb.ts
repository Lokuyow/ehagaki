import Dexie, { type Table } from "dexie";
import type { CustomEmojiItem } from "../customEmoji";

export const EHAGAKI_DB_NAME = "eHagakiDB";
export const EHAGAKI_DB_VERSION = 1;

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

export class EHagakiDB extends Dexie {
    meta!: Table<MetaRecord, string>;
    emojis!: Table<EmojisRecord, string>;

    constructor(databaseName = EHAGAKI_DB_NAME) {
        super(databaseName);

        this.version(EHAGAKI_DB_VERSION).stores({
            meta: "key, updatedAt",
            emojis: "pubkeyHex, fetchedAt, updatedAt",
        });
    }
}

export const ehagakiDb = new EHagakiDB();
