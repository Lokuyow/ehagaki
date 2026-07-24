import { MAX_DRAFTS, STORAGE_KEYS } from "../constants";
import { compareDraftsByDisplayOrder } from "../draftSortUtils";
import type { Draft, DraftChannelData, DraftReplyQuoteData, MediaGalleryItem } from "../types";
import { ehagakiDb, type DraftRecord, type EHagakiDB } from "./ehagakiDb";

const DRAFT_SCHEMA_VERSION = 1;
const LOCAL_DRAFT_BACKEND_VERSION = 1;
const LEGACY_DRAFTS_MIGRATION_KEY = "migrated.localStorage.drafts.v1";
const UNSCOPED_DRAFT_SCOPE_KEY = "__ehagaki_unscoped__";

type DraftInput = {
    id: string;
    pubkeyHex: string | null;
    content: string;
    preview: string;
    timestamp: number;
    pinned?: boolean;
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
    replaceOldest(
        draft: DraftInput,
        options?: DraftsRepositoryOptions,
        maxDrafts?: number,
    ): Promise<Draft[]>;
    setPinned(id: string, pinned: boolean, options?: DraftsRepositoryOptions): Promise<void>;
    delete(id: string, options?: DraftsRepositoryOptions): Promise<void>;
    deleteAll(options?: DraftsRepositoryOptions): Promise<void>;
    trimToMax(options?: DraftsRepositoryOptions, maxDrafts?: number): Promise<void>;
}

interface LocalDraftStorageEnvelope {
    version: typeof LOCAL_DRAFT_BACKEND_VERSION;
    records: DraftRecord[];
    tombstones: Record<string, number>;
}

type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function toScopeKey(pubkeyHex: string | null | undefined): string {
    return pubkeyHex || UNSCOPED_DRAFT_SCOPE_KEY;
}

function getVisibleScopeKeys(pubkeyHex: string | null | undefined): string[] {
    const scopeKeys = [UNSCOPED_DRAFT_SCOPE_KEY];
    if (pubkeyHex) {
        scopeKeys.push(toScopeKey(pubkeyHex));
    }
    return scopeKeys;
}

function isRecordVisible(
    record: DraftRecord,
    options: DraftsRepositoryOptions = {},
): boolean {
    return getVisibleScopeKeys(options.pubkeyHex).includes(record.scopeKey);
}

function readLegacyDraftsFromLocalStorage(storage: Pick<Storage, "getItem"> = localStorage): Draft[] {
    const draftsJson = storage.getItem(STORAGE_KEYS.DRAFTS);
    if (!draftsJson) return [];

    try {
        const drafts = JSON.parse(draftsJson) as Draft[];
        if (!Array.isArray(drafts)) return [];
        return drafts
            .filter((draft): draft is Draft => typeof draft?.id === "string")
            .sort(compareDraftsByDisplayOrder);
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
        pinned: record.pinned || undefined,
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
        pinned: draft.pinned || undefined,
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

        const scopeKeys = getVisibleScopeKeys(options.pubkeyHex);
        const records = await this.db.drafts
            .where("scopeKey")
            .anyOf(scopeKeys)
            .toArray();

        return records
            .sort(compareDraftsByDisplayOrder)
            .map(toDraft);
    }

    async put(draft: DraftInput): Promise<void> {
        await this.ensureLegacyDraftsMigrated();
        await this.db.drafts.put(toRecord(draft, this.now));
    }

    async replaceOldest(
        draft: DraftInput,
        options: DraftsRepositoryOptions = {},
        maxDrafts = MAX_DRAFTS,
    ): Promise<Draft[]> {
        await this.ensureLegacyDraftsMigrated();

        return this.db.transaction("rw", this.db.drafts, async () => {
            const records = await this.db.drafts
                .where("scopeKey")
                .anyOf(getVisibleScopeKeys(options.pubkeyHex))
                .toArray();
            const sortedRecords = records.sort(compareDraftsByDisplayOrder);
            const remainingRecords = sortedRecords.slice(0, maxDrafts - 1);
            const oldestRecord = sortedRecords[maxDrafts - 1];
            const newRecord = toRecord(draft, this.now);

            if (oldestRecord) {
                await this.db.drafts.delete(oldestRecord.id);
            }
            await this.db.drafts.put(newRecord);

            return [newRecord, ...remainingRecords]
                .sort(compareDraftsByDisplayOrder)
                .map(toDraft);
        });
    }

    async setPinned(
        id: string,
        pinned: boolean,
        options: DraftsRepositoryOptions = {},
    ): Promise<void> {
        await this.ensureLegacyDraftsMigrated();
        const record = await this.db.drafts.get(id);
        if (!record || !isRecordVisible(record, options)) return;
        await this.db.drafts.update(id, {
            pinned: pinned || undefined,
            updatedAt: this.now(),
        });
    }

    async delete(id: string, options: DraftsRepositoryOptions = {}): Promise<void> {
        await this.ensureLegacyDraftsMigrated();
        const record = await this.db.drafts.get(id);
        if (!record || !isRecordVisible(record, options)) return;
        await this.db.drafts.delete(id);
    }

    async deleteAll(options: DraftsRepositoryOptions = {}): Promise<void> {
        await this.ensureLegacyDraftsMigrated();
        await this.db.drafts
            .where("scopeKey")
            .anyOf(getVisibleScopeKeys(options.pubkeyHex))
            .delete();
    }

    async trimToMax(options: DraftsRepositoryOptions = {}, maxDrafts = MAX_DRAFTS): Promise<void> {
        const drafts = await this.getAll(options);
        const overflowDrafts = drafts.slice(maxDrafts);

        if (overflowDrafts.length === 0) return;

        await this.db.drafts.bulkDelete(overflowDrafts.map((draft) => draft.id));
    }

    async initialize(): Promise<void> {
        await this.ensureLegacyDraftsMigrated();
    }

    async exportAllRecords(): Promise<DraftRecord[]> {
        await this.ensureLegacyDraftsMigrated();
        return this.db.drafts.toArray();
    }

    async recoverFallback(envelope: LocalDraftStorageEnvelope): Promise<void> {
        await this.ensureLegacyDraftsMigrated();

        await this.db.transaction("rw", this.db.drafts, async () => {
            for (const [id, deletedAt] of Object.entries(envelope.tombstones)) {
                const current = await this.db.drafts.get(id);
                if (current && current.updatedAt <= deletedAt) {
                    await this.db.drafts.delete(id);
                }
            }

            for (const record of envelope.records) {
                const current = await this.db.drafts.get(record.id);
                const deletedAt = envelope.tombstones[record.id];
                if (deletedAt !== undefined && deletedAt >= record.updatedAt) {
                    continue;
                }
                if (!current || current.updatedAt <= record.updatedAt) {
                    await this.db.drafts.put(record);
                }
            }
        });
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

export class LocalStorageDraftsRepository implements DraftsRepository {
    constructor(
        private getStorage: () => DraftStorage = () => localStorage,
        private now: () => number = Date.now,
    ) { }

    hasFallbackData(): boolean {
        return this.getStorage().getItem(STORAGE_KEYS.DRAFTS_FALLBACK) !== null;
    }

    readFallbackEnvelope(): LocalDraftStorageEnvelope {
        return this.readEnvelope();
    }

    clearFallbackData(): void {
        this.getStorage().removeItem(STORAGE_KEYS.DRAFTS_FALLBACK);
    }

    seed(records: DraftRecord[]): void {
        const current = this.readEnvelope();
        const recordsById = new Map(current.records.map((record) => [record.id, record]));

        for (const record of records) {
            const deletedAt = current.tombstones[record.id];
            if (deletedAt !== undefined && deletedAt >= record.updatedAt) {
                continue;
            }
            const existing = recordsById.get(record.id);
            if (!existing || existing.updatedAt <= record.updatedAt) {
                recordsById.set(record.id, record);
            }
        }

        this.persist({
            ...current,
            records: [...recordsById.values()],
        });
    }

    async getAll(options: DraftsRepositoryOptions = {}): Promise<Draft[]> {
        const envelope = this.readEnvelope();
        return envelope.records
            .filter((record) => {
                const deletedAt = envelope.tombstones[record.id];
                return deletedAt === undefined || deletedAt < record.updatedAt;
            })
            .filter((record) => isRecordVisible(record, options))
            .sort(compareDraftsByDisplayOrder)
            .map(toDraft);
    }

    async put(draft: DraftInput): Promise<void> {
        const envelope = this.readEnvelope();
        const record = toRecord(draft, this.now);
        const records = envelope.records.filter((item) => item.id !== record.id);
        records.push(record);
        delete envelope.tombstones[record.id];
        this.persist({ ...envelope, records });
    }

    async replaceOldest(
        draft: DraftInput,
        options: DraftsRepositoryOptions = {},
        maxDrafts = MAX_DRAFTS,
    ): Promise<Draft[]> {
        const envelope = this.readEnvelope();
        const visibleRecords = envelope.records
            .filter((record) => isRecordVisible(record, options))
            .sort(compareDraftsByDisplayOrder);
        const oldestRecord = visibleRecords[maxDrafts - 1];
        const newRecord = toRecord(draft, this.now);
        let records = envelope.records.filter((record) => record.id !== newRecord.id);

        if (oldestRecord) {
            records = records.filter((record) => record.id !== oldestRecord.id);
            envelope.tombstones[oldestRecord.id] = this.now();
        }

        records.push(newRecord);
        delete envelope.tombstones[newRecord.id];
        this.persist({ ...envelope, records });

        return records
            .filter((record) => isRecordVisible(record, options))
            .sort(compareDraftsByDisplayOrder)
            .map(toDraft);
    }

    async setPinned(
        id: string,
        pinned: boolean,
        options: DraftsRepositoryOptions = {},
    ): Promise<void> {
        const envelope = this.readEnvelope();
        const record = envelope.records.find((item) => item.id === id);
        if (!record || !isRecordVisible(record, options)) return;

        const updatedRecord: DraftRecord = {
            ...record,
            pinned: pinned || undefined,
            updatedAt: this.now(),
        };
        this.persist({
            ...envelope,
            records: envelope.records.map((item) => item.id === id ? updatedRecord : item),
        });
    }

    async delete(id: string, options: DraftsRepositoryOptions = {}): Promise<void> {
        const envelope = this.readEnvelope();
        const record = envelope.records.find((item) => item.id === id);
        if (!record || !isRecordVisible(record, options)) return;

        envelope.tombstones[id] = this.now();
        this.persist({
            ...envelope,
            records: envelope.records.filter((item) => item.id !== id),
        });
    }

    async deleteAll(options: DraftsRepositoryOptions = {}): Promise<void> {
        const envelope = this.readEnvelope();
        const deletedAt = this.now();
        const remainingRecords: DraftRecord[] = [];

        for (const record of envelope.records) {
            if (isRecordVisible(record, options)) {
                envelope.tombstones[record.id] = deletedAt;
            } else {
                remainingRecords.push(record);
            }
        }

        this.persist({ ...envelope, records: remainingRecords });
    }

    async trimToMax(
        options: DraftsRepositoryOptions = {},
        maxDrafts = MAX_DRAFTS,
    ): Promise<void> {
        const envelope = this.readEnvelope();
        const overflowRecords = envelope.records
            .filter((record) => isRecordVisible(record, options))
            .sort(compareDraftsByDisplayOrder)
            .slice(maxDrafts);

        if (overflowRecords.length === 0) return;

        const overflowIds = new Set(overflowRecords.map((record) => record.id));
        const deletedAt = this.now();
        for (const id of overflowIds) {
            envelope.tombstones[id] = deletedAt;
        }
        this.persist({
            ...envelope,
            records: envelope.records.filter((record) => !overflowIds.has(record.id)),
        });
    }

    private readEnvelope(): LocalDraftStorageEnvelope {
        const storage = this.getStorage();
        const stored = storage.getItem(STORAGE_KEYS.DRAFTS_FALLBACK);
        let envelope: LocalDraftStorageEnvelope = {
            version: LOCAL_DRAFT_BACKEND_VERSION,
            records: [],
            tombstones: {},
        };

        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Partial<LocalDraftStorageEnvelope>;
                if (
                    parsed.version === LOCAL_DRAFT_BACKEND_VERSION &&
                    Array.isArray(parsed.records) &&
                    parsed.tombstones &&
                    typeof parsed.tombstones === "object"
                ) {
                    envelope = {
                        version: LOCAL_DRAFT_BACKEND_VERSION,
                        records: parsed.records.filter(
                            (record): record is DraftRecord =>
                                typeof record?.id === "string" &&
                                typeof record.scopeKey === "string",
                        ),
                        tombstones: { ...parsed.tombstones },
                    };
                }
            } catch {
                // Invalid fallback data is treated as an empty backend.
            }
        }

        const legacyDrafts = readLegacyDraftsFromLocalStorage(storage);
        if (legacyDrafts.length === 0) return envelope;

        const recordsById = new Map(envelope.records.map((record) => [record.id, record]));
        for (const draft of legacyDrafts) {
            if (!recordsById.has(draft.id)) {
                recordsById.set(draft.id, toRecord({
                    ...draft,
                    pubkeyHex: null,
                }, this.now));
            }
        }

        return { ...envelope, records: [...recordsById.values()] };
    }

    private persist(envelope: LocalDraftStorageEnvelope): void {
        const storage = this.getStorage();
        storage.setItem(STORAGE_KEYS.DRAFTS_FALLBACK, JSON.stringify(envelope));
        try {
            storage.removeItem(STORAGE_KEYS.DRAFTS);
        } catch {
            // The fallback write succeeded; legacy cleanup is best-effort.
        }
    }
}

type ActiveDraftBackend = "indexeddb" | "local-storage";

export class ResilientDraftsRepository implements DraftsRepository {
    private activeBackend: ActiveDraftBackend | null = null;
    private indexedDbOperationSucceeded = false;

    constructor(
        private indexedDbRepository = new DexieDraftsRepository(),
        private localStorageRepository = new LocalStorageDraftsRepository(),
    ) { }

    async getAll(options: DraftsRepositoryOptions = {}): Promise<Draft[]> {
        await this.ensureBackendSelected();
        if (this.activeBackend === "local-storage") {
            return this.localStorageRepository.getAll(options);
        }

        try {
            const drafts = await this.indexedDbRepository.getAll(options);
            this.indexedDbOperationSucceeded = true;
            return drafts;
        } catch (error) {
            await this.switchToLocalStorage(error);
            return this.localStorageRepository.getAll(options);
        }
    }

    async put(draft: DraftInput): Promise<void> {
        return this.runMutation(
            () => this.indexedDbRepository.put(draft),
            () => this.localStorageRepository.put(draft),
        );
    }

    async replaceOldest(
        draft: DraftInput,
        options: DraftsRepositoryOptions = {},
        maxDrafts = MAX_DRAFTS,
    ): Promise<Draft[]> {
        return this.runMutation(
            () => this.indexedDbRepository.replaceOldest(draft, options, maxDrafts),
            () => this.localStorageRepository.replaceOldest(draft, options, maxDrafts),
        );
    }

    async setPinned(
        id: string,
        pinned: boolean,
        options: DraftsRepositoryOptions = {},
    ): Promise<void> {
        return this.runMutation(
            () => this.indexedDbRepository.setPinned(id, pinned, options),
            () => this.localStorageRepository.setPinned(id, pinned, options),
        );
    }

    async delete(id: string, options: DraftsRepositoryOptions = {}): Promise<void> {
        return this.runMutation(
            () => this.indexedDbRepository.delete(id, options),
            () => this.localStorageRepository.delete(id, options),
        );
    }

    async deleteAll(options: DraftsRepositoryOptions = {}): Promise<void> {
        return this.runMutation(
            () => this.indexedDbRepository.deleteAll(options),
            () => this.localStorageRepository.deleteAll(options),
        );
    }

    async trimToMax(
        options: DraftsRepositoryOptions = {},
        maxDrafts = MAX_DRAFTS,
    ): Promise<void> {
        return this.runMutation(
            () => this.indexedDbRepository.trimToMax(options, maxDrafts),
            () => this.localStorageRepository.trimToMax(options, maxDrafts),
        );
    }

    resetBackendSelectionForTesting(): void {
        this.activeBackend = null;
        this.indexedDbOperationSucceeded = false;
    }

    private async ensureBackendSelected(): Promise<void> {
        if (this.activeBackend) return;

        if (this.localStorageRepository.hasFallbackData()) {
            try {
                const envelope = this.localStorageRepository.readFallbackEnvelope();
                await this.indexedDbRepository.recoverFallback(envelope);
                this.localStorageRepository.clearFallbackData();
                this.activeBackend = "indexeddb";
                this.indexedDbOperationSucceeded = true;
                return;
            } catch {
                this.activeBackend = "local-storage";
                return;
            }
        }

        try {
            await this.indexedDbRepository.initialize();
            this.activeBackend = "indexeddb";
        } catch {
            this.activeBackend = "local-storage";
        }
    }

    private async runMutation<T>(
        runIndexedDb: () => Promise<T>,
        runLocalStorage: () => Promise<T>,
    ): Promise<T> {
        await this.ensureBackendSelected();
        if (this.activeBackend === "local-storage") {
            return runLocalStorage();
        }

        try {
            const result = await runIndexedDb();
            this.indexedDbOperationSucceeded = true;
            return result;
        } catch (error) {
            await this.switchToLocalStorage(error);
            return runLocalStorage();
        }
    }

    private async switchToLocalStorage(originalError: unknown): Promise<void> {
        try {
            const records = await this.indexedDbRepository.exportAllRecords();
            this.localStorageRepository.seed(records);
            this.activeBackend = "local-storage";
        } catch {
            if (this.indexedDbOperationSucceeded) {
                throw originalError;
            }
            this.activeBackend = "local-storage";
        }
    }
}

export const draftsRepository = new ResilientDraftsRepository(
    new DexieDraftsRepository(ehagakiDb),
    new LocalStorageDraftsRepository(),
);
