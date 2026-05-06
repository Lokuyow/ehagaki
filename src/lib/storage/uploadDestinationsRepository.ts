import { STORAGE_KEYS } from "../constants";
import type { UploadDestination, UploadDestinationCapabilities } from "../types";
import { embedIndexedDbService } from "../embedIndexedDbService";
import { ehagakiDb, type EHagakiDB, type UploadDestinationRecord } from "./ehagakiDb";
import {
    UPLOAD_DESTINATION_GLOBAL_SCOPE,
    UPLOAD_DESTINATION_SCHEMA_VERSION,
    createLegacyUploadDestination,
    getScopeKey,
} from "../upload/uploadDestinationPresets";

const LEGACY_UPLOAD_DESTINATION_MIGRATION_KEY = "migrated.localStorage.uploadEndpoint.v1";

export interface UploadDestinationsRepository {
    getAll(pubkeyHex?: string | null): Promise<UploadDestination[]>;
    getDefault(pubkeyHex?: string | null): Promise<UploadDestination>;
    put(destination: UploadDestination): Promise<void>;
    delete(id: string): Promise<void>;
    setDefault(id: string, pubkeyHex?: string | null): Promise<void>;
}

export interface UploadDestinationsParentSync {
    getSnapshot(scopeKey: string): Promise<UploadDestinationRecord[] | null>;
    setSnapshot(scopeKey: string, records: UploadDestinationRecord[]): Promise<void>;
}

export const uploadDestinationsParentSync: UploadDestinationsParentSync = {
    async getSnapshot(scopeKey: string): Promise<UploadDestinationRecord[] | null> {
        return embedIndexedDbService.getUploadDestinationsSnapshot(scopeKey);
    },

    async setSnapshot(scopeKey: string, records: UploadDestinationRecord[]): Promise<void> {
        await embedIndexedDbService.setUploadDestinationsSnapshot(scopeKey, records);
    },
};

function toPlainRawValue(raw: unknown): unknown {
    if (raw === undefined) return undefined;

    try {
        return JSON.parse(JSON.stringify(raw));
    } catch {
        return undefined;
    }
}

function toPlainCapabilities(capabilities: UploadDestinationCapabilities): UploadDestinationCapabilities {
    const raw = toPlainRawValue(capabilities.raw);
    return {
        maxUploadSize: capabilities.maxUploadSize ?? null,
        supportedMimeTypes: [...capabilities.supportedMimeTypes],
        supportsDelete: Boolean(capabilities.supportsDelete),
        supportsList: Boolean(capabilities.supportsList),
        supportsMirror: Boolean(capabilities.supportsMirror),
        supportsMediaOptimization: Boolean(capabilities.supportsMediaOptimization),
        authRequired: Boolean(capabilities.authRequired),
        ...(capabilities.lastCheckedAt !== undefined ? { lastCheckedAt: capabilities.lastCheckedAt } : {}),
        source: capabilities.source,
        ...(raw !== undefined ? { raw } : {}),
    };
}

function toPlainDestination(destination: UploadDestination): UploadDestination {
    return {
        id: destination.id,
        pubkeyHex: destination.pubkeyHex ?? null,
        name: destination.name,
        protocol: destination.protocol,
        serverUrl: destination.serverUrl.trim(),
        ...(destination.resolvedUploadUrl ? { resolvedUploadUrl: destination.resolvedUploadUrl } : {}),
        ...(destination.presetId ? { presetId: destination.presetId } : {}),
        isDefault: Boolean(destination.isDefault),
        enabled: Boolean(destination.enabled),
        createdAt: destination.createdAt,
        updatedAt: destination.updatedAt,
        capabilities: toPlainCapabilities(destination.capabilities),
        auth: {
            type: destination.auth.type,
        },
        schemaVersion: 1,
    };
}

function toRecord(destination: UploadDestination): UploadDestinationRecord {
    const plainDestination = toPlainDestination(destination);
    return {
        ...plainDestination,
        scopeKey: getScopeKey(plainDestination.pubkeyHex),
        schemaVersion: UPLOAD_DESTINATION_SCHEMA_VERSION,
    };
}

function toDestination(record: UploadDestinationRecord): UploadDestination {
    const { scopeKey: _scopeKey, ...destination } = record;
    return destination;
}

function sortDestinations(a: UploadDestination, b: UploadDestination): number {
    if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
    if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
    return a.name.localeCompare(b.name);
}

function getPreferredBlossomBandDestination(
    destinations: UploadDestination[],
    currentDefault: UploadDestination,
): UploadDestination | null {
    if (
        currentDefault.protocol !== "nip96"
        || currentDefault.createdAt !== currentDefault.updatedAt
    ) {
        return null;
    }

    const blossomBandDestinations = destinations
        .filter((destination) =>
            destination.enabled
            && destination.presetId === "blossom-band"
            && destination.updatedAt > currentDefault.updatedAt,
        )
        .sort((a, b) => b.updatedAt - a.updatedAt);

    return blossomBandDestinations[0] ?? null;
}

export class DexieUploadDestinationsRepository implements UploadDestinationsRepository {
    private syncedParentScopes = new Set<string>();
    private parentMissingScopes = new Set<string>();

    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
        private getStorage: () => Pick<Storage, "getItem" | "setItem" | "removeItem"> = () => localStorage,
        private parentSync: UploadDestinationsParentSync | null = uploadDestinationsParentSync,
    ) { }

    async getAll(pubkeyHex: string | null = null): Promise<UploadDestination[]> {
        await this.loadParentSnapshot(pubkeyHex);
        await this.ensureLegacyUploadEndpointMigrated(pubkeyHex);
        const scopeKey = getScopeKey(pubkeyHex);
        const records = await this.db.uploadDestinations
            .where("scopeKey")
            .equals(scopeKey)
            .toArray();
        await this.persistParentSnapshotIfMissing(scopeKey, records);
        return records.map(toDestination).sort(sortDestinations);
    }

    async getDefault(pubkeyHex: string | null = null): Promise<UploadDestination> {
        const destinations = await this.getAll(pubkeyHex);
        const defaultDestination = destinations.find((destination) =>
            destination.enabled && destination.isDefault,
        );
        if (defaultDestination) {
            const preferredBlossomBand = getPreferredBlossomBandDestination(
                destinations,
                defaultDestination,
            );
            if (preferredBlossomBand) {
                await this.setDefault(preferredBlossomBand.id, pubkeyHex);
                return { ...preferredBlossomBand, isDefault: true };
            }

            return defaultDestination;
        }

        const firstEnabled = destinations.find((destination) => destination.enabled);
        if (firstEnabled) {
            await this.setDefault(firstEnabled.id, pubkeyHex);
            return { ...firstEnabled, isDefault: true };
        }

        const fallback = createLegacyUploadDestination({
            endpoint: this.getStorage().getItem(STORAGE_KEYS.UPLOAD_ENDPOINT) ?? "",
            locale: this.getStorage().getItem(STORAGE_KEYS.LOCALE),
            pubkeyHex,
            now: this.now(),
        });
        await this.put(fallback);
        return fallback;
    }

    async put(destination: UploadDestination): Promise<void> {
        const nextDestination: UploadDestination = {
            ...toPlainDestination(destination),
            updatedAt: destination.updatedAt || this.now(),
        };

        await this.db.transaction("rw", this.db.uploadDestinations, async () => {
            if (nextDestination.isDefault) {
                await this.clearDefault(nextDestination.pubkeyHex);
            }
            await this.db.uploadDestinations.put(toRecord(nextDestination));
        });
        await this.persistParentSnapshot(getScopeKey(nextDestination.pubkeyHex));
    }

    async delete(id: string): Promise<void> {
        const existing = await this.db.uploadDestinations.get(id);
        if (!existing) return;

        await this.db.uploadDestinations.delete(id);

        if (existing.isDefault) {
            const nextDefault = await this.db.uploadDestinations
                .where("scopeKey")
                .equals(existing.scopeKey)
                .filter((record) => record.enabled)
                .first();
            if (nextDefault) {
                await this.setDefault(nextDefault.id, existing.pubkeyHex);
            }
        }

        await this.persistParentSnapshot(existing.scopeKey);
    }

    async setDefault(id: string, pubkeyHex: string | null = null): Promise<void> {
        const scopeKey = getScopeKey(pubkeyHex);
        const timestamp = this.now();

        await this.db.transaction("rw", this.db.uploadDestinations, async () => {
            const records = await this.db.uploadDestinations
                .where("scopeKey")
                .equals(scopeKey)
                .toArray();

            await Promise.all(records.map((record) =>
                this.db.uploadDestinations.put({
                    ...record,
                    isDefault: record.id === id,
                    enabled: record.id === id ? true : record.enabled,
                    updatedAt: record.id === id ? timestamp : record.updatedAt,
                }),
            ));
        });
        await this.persistParentSnapshot(scopeKey);
    }

    private async clearDefault(pubkeyHex: string | null): Promise<void> {
        const scopeKey = getScopeKey(pubkeyHex);
        const records = await this.db.uploadDestinations
            .where("scopeKey")
            .equals(scopeKey)
            .toArray();
        await Promise.all(records
            .filter((record) => record.isDefault)
            .map((record) =>
                this.db.uploadDestinations.put({
                    ...record,
                    isDefault: false,
                }),
            ));
    }

    private async ensureLegacyUploadEndpointMigrated(pubkeyHex: string | null): Promise<void> {
        const scopeKey = getScopeKey(pubkeyHex);
        const migrationKey = `${LEGACY_UPLOAD_DESTINATION_MIGRATION_KEY}.${scopeKey}`;
        const migrated = await this.db.meta.get(migrationKey);
        if (migrated?.value === true) return;

        const existing = await this.db.uploadDestinations
            .where("scopeKey")
            .equals(scopeKey)
            .count();
        if (existing > 0) {
            await this.markMigrated(migrationKey);
            return;
        }

        const storage = this.getStorage();
        const destination = createLegacyUploadDestination({
            endpoint: storage.getItem(STORAGE_KEYS.UPLOAD_ENDPOINT) ?? "",
            locale: storage.getItem(STORAGE_KEYS.LOCALE),
            pubkeyHex: pubkeyHex === UPLOAD_DESTINATION_GLOBAL_SCOPE ? null : pubkeyHex,
            now: this.now(),
        });

        await this.db.transaction("rw", this.db.uploadDestinations, this.db.meta, async () => {
            await this.db.uploadDestinations.put(toRecord(destination));
            await this.db.meta.put({
                key: migrationKey,
                value: true,
                updatedAt: this.now(),
            });
        });
    }

    private async markMigrated(key: string): Promise<void> {
        await this.db.meta.put({
            key,
            value: true,
            updatedAt: this.now(),
        });
    }

    private async loadParentSnapshot(pubkeyHex: string | null): Promise<void> {
        if (!this.parentSync) return;

        const scopeKey = getScopeKey(pubkeyHex);
        if (this.syncedParentScopes.has(scopeKey)) return;

        this.syncedParentScopes.add(scopeKey);
        try {
            const snapshot = await this.parentSync.getSnapshot(scopeKey);
            if (snapshot === null) {
                this.parentMissingScopes.add(scopeKey);
                return;
            }

            const records = snapshot
                .filter((record) => record.scopeKey === scopeKey)
                .map((record) => toRecord(toDestination(record)));

            await this.db.transaction("rw", this.db.uploadDestinations, async () => {
                await this.db.uploadDestinations
                    .where("scopeKey")
                    .equals(scopeKey)
                    .delete();
                if (records.length > 0) {
                    await this.db.uploadDestinations.bulkPut(records);
                }
            });
        } catch {
            this.syncedParentScopes.delete(scopeKey);
        }
    }

    private async persistParentSnapshotIfMissing(
        scopeKey: string,
        records: UploadDestinationRecord[],
    ): Promise<void> {
        if (!this.parentMissingScopes.has(scopeKey)) return;

        await this.persistParentSnapshot(scopeKey, records);
        this.parentMissingScopes.delete(scopeKey);
    }

    private async persistParentSnapshot(
        scopeKey: string,
        records?: UploadDestinationRecord[],
    ): Promise<void> {
        if (!this.parentSync) return;

        try {
            const snapshot = records
                ?? await this.db.uploadDestinations
                    .where("scopeKey")
                    .equals(scopeKey)
                    .toArray();
            await this.parentSync.setSnapshot(scopeKey, snapshot.map((record) =>
                toRecord(toDestination(record)),
            ));
        } catch {
            // 親 IndexedDB 委譲は任意。local IndexedDB の保存成功を優先する。
        }
    }
}

export const uploadDestinationsRepository = new DexieUploadDestinationsRepository();
