import { MAX_DRAFTS, STORAGE_KEYS } from "../constants";
import type { Draft, DraftChannelData, DraftReplyQuoteData, MediaGalleryItem } from "../types";
import { ehagakiDb, type DraftRecord, type EHagakiDB } from "./ehagakiDb";

const DRAFT_SCHEMA_VERSION = 1;
const LEGACY_DRAFTS_MIGRATION_KEY = "migrated.localStorage.drafts.v1";
const UNSCOPED_DRAFT_SCOPE_KEY = "__ehagaki_unscoped__";

type DraftInput = {
    id: string;
    pubkeyHex: string | null;
    content: string;
    preview: string;
    timestamp: number;
    galleryItems?: MediaGalleryItem[];
    channelData?: DraftChannelData;
    replyQuoteData?: DraftReplyQuoteData;
};

export type DraftsRepositoryOptions = {
    pubkeyHex?: string | null;
};

export interface DraftsRepository {
    getAll(options?: DraftsRepositoryOptions): Promise<Draft[]>;
    put(draft: DraftInput): Promise<void>;
    delete(id: string): Promise<void>;
    deleteAll(options?: DraftsRepositoryOptions): Promise<void>;
    trimToMax(options?: DraftsRepositoryOptions, maxDrafts?: number): Promise<void>;
}

function toScopeKey(pubkeyHex: string | null | undefined): string {
    return pubkeyHex || UNSCOPED_DRAFT_SCOPE_KEY;
}

function readLegacyDraftsFromLocalStorage(storage: Pick<Storage, "getItem"> = localStorage): Draft[] {
    const draftsJson = storage.getItem(STORAGE_KEYS.DRAFTS);
    if (!draftsJson) return [];

    try {
        const drafts = JSON.parse(draftsJson) as Draft[];
        if (!Array.isArray(drafts)) return [];
        return drafts
            .filter((draft): draft is Draft => typeof draft?.id === "string")
            .sort((a, b) => b.timestamp - a.timestamp);
    } catch {
        return [];
    }
}

function toDraft(record: DraftRecord): Draft {
    return {
        id: record.id,
        content: record.content,
        preview: record.preview,
        timestamp: record.timestamp,
        galleryItems: record.galleryItems,
        channelData: record.channelData,
        replyQuoteData: record.replyQuoteData,
    };
}

function toRecord(draft: DraftInput, now: () => number): DraftRecord {
    const timestamp = draft.timestamp || now();

    return {
        id: draft.id,
        pubkeyHex: draft.pubkeyHex,
        scopeKey: toScopeKey(draft.pubkeyHex),
        content: draft.content,
        preview: draft.preview,
        timestamp,
        updatedAt: timestamp,
        galleryItems: draft.galleryItems && draft.galleryItems.length > 0 ? draft.galleryItems : undefined,
        channelData: draft.channelData || undefined,
        replyQuoteData: draft.replyQuoteData || undefined,
        schemaVersion: DRAFT_SCHEMA_VERSION,
    };
}

export class DexieDraftsRepository implements DraftsRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
        private getStorage: () => Pick<Storage, "getItem" | "removeItem"> = () => localStorage,
    ) { }

    async getAll(options: DraftsRepositoryOptions = {}): Promise<Draft[]> {
        await this.ensureLegacyDraftsMigrated();

        const scopeKeys = this.getVisibleScopeKeys(options.pubkeyHex);
        const records = await this.db.drafts
            .where("scopeKey")
            .anyOf(scopeKeys)
            .toArray();

        return records
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(toDraft);
    }

    async put(draft: DraftInput): Promise<void> {
        await this.ensureLegacyDraftsMigrated();
        await this.db.drafts.put(toRecord(draft, this.now));
    }

    async delete(id: string): Promise<void> {
        await this.ensureLegacyDraftsMigrated();
        await this.db.drafts.delete(id);
    }

    async deleteAll(options: DraftsRepositoryOptions = {}): Promise<void> {
        await this.ensureLegacyDraftsMigrated();
        await this.db.drafts
            .where("scopeKey")
            .anyOf(this.getVisibleScopeKeys(options.pubkeyHex))
            .delete();
    }

    async trimToMax(options: DraftsRepositoryOptions = {}, maxDrafts = MAX_DRAFTS): Promise<void> {
        const drafts = await this.getAll(options);
        const overflowDrafts = drafts.slice(maxDrafts);

        if (overflowDrafts.length === 0) return;

        await this.db.drafts.bulkDelete(overflowDrafts.map((draft) => draft.id));
    }

    private getVisibleScopeKeys(pubkeyHex: string | null | undefined): string[] {
        const scopeKeys = [UNSCOPED_DRAFT_SCOPE_KEY];
        if (pubkeyHex) {
            scopeKeys.push(toScopeKey(pubkeyHex));
        }
        return scopeKeys;
    }

    private async ensureLegacyDraftsMigrated(): Promise<void> {
        const migrated = await this.db.meta.get(LEGACY_DRAFTS_MIGRATION_KEY);
        if (migrated?.value === true) return;

        const storage = this.getStorage();
        const legacyDrafts = readLegacyDraftsFromLocalStorage(storage);
        if (legacyDrafts.length === 0 && storage.getItem(STORAGE_KEYS.DRAFTS) !== null) return;

        await this.db.transaction("rw", this.db.drafts, this.db.meta, async () => {
            if (legacyDrafts.length > 0) {
                await this.db.drafts.bulkPut(
                    legacyDrafts.map((draft) => toRecord({
                        ...draft,
                        pubkeyHex: null,
                    }, this.now)),
                );
            }

            await this.db.meta.put({
                key: LEGACY_DRAFTS_MIGRATION_KEY,
                value: true,
                updatedAt: this.now(),
            });
        });

        try {
            storage.removeItem(STORAGE_KEYS.DRAFTS);
        } catch {
            // Migration already succeeded; stale localStorage cleanup is best-effort.
        }
    }
}

export const draftsRepository = new DexieDraftsRepository();
