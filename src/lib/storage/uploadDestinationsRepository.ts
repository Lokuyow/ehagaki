import { STORAGE_KEYS } from "../constants";
import type { NavigatorAdapter, UploadDestination, UploadDestinationCapabilities } from "../types";
import { embedIndexedDbService } from "../embedIndexedDbService";
import { ehagakiDb, type EHagakiDB, type UploadDestinationRecord } from "./ehagakiDb";
import {
    UPLOAD_DESTINATION_GLOBAL_SCOPE,
    UPLOAD_DESTINATION_SCHEMA_VERSION,
    createUploadDestinationFromPreset,
    createLegacyUploadDestination,
    findUploadPresetByEndpoint,
    getUploadDestinationDisplayName,
    getPreferredDefaultUploadPresetIds,
    getScopeKey,
    normalizeServerUrl,
} from "../upload/uploadDestinationPresets";
import { getEffectiveLocale } from "../utils/settingsStorage";

const LEGACY_UPLOAD_DESTINATION_MIGRATION_KEY = "migrated.localStorage.uploadEndpoint.v1";

export interface UploadDestinationsRepository {
    getAll(pubkeyHex?: string | null): Promise<UploadDestination[]>;
    getDefault(pubkeyHex?: string | null): Promise<UploadDestination>;
    put(destination: UploadDestination): Promise<void>;
    delete(id: string): Promise<void>;
    setDefault(id: string, pubkeyHex?: string | null): Promise<void>;
    move(id: string, direction: "up" | "down", pubkeyHex?: string | null): Promise<void>;
    replaceBlossomServers(pubkeyHex: string, servers: string[]): Promise<UploadDestination[]>;
    applyUploadEndpointPreference(params: {
        endpoint: string;
        mode: "forced" | "default";
        pubkeyHex?: string | null;
    }): Promise<UploadDestination | null>;
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
        name: getUploadDestinationDisplayName({
            serverUrl: destination.serverUrl,
            resolvedUploadUrl: destination.resolvedUploadUrl,
            fallbackName: destination.name,
        }),
        protocol: destination.protocol,
        serverUrl: destination.serverUrl.trim(),
        ...(destination.resolvedUploadUrl ? { resolvedUploadUrl: destination.resolvedUploadUrl } : {}),
        ...(destination.presetId ? { presetId: destination.presetId } : {}),
        isDefault: Boolean(destination.isDefault),
        enabled: Boolean(destination.enabled),
        ...(destination.sortIndex !== undefined ? { sortIndex: destination.sortIndex } : {}),
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

function normalizeLegacyShareYabuMeDestination(destination: UploadDestination): UploadDestination {
    if (destination.protocol !== "blossom") {
        return destination;
    }

    const preset = findUploadPresetByEndpoint(destination.serverUrl);
    if (!preset || preset.id !== "share-yabu-me") {
        return destination;
    }

    const normalizedPreset = createUploadDestinationFromPreset({
        preset,
        pubkeyHex: destination.pubkeyHex,
        isDefault: destination.isDefault,
        now: destination.updatedAt,
    });

    return {
        ...destination,
        name: getUploadDestinationDisplayName({
            serverUrl: normalizedPreset.serverUrl,
            resolvedUploadUrl: normalizedPreset.resolvedUploadUrl,
            fallbackName: destination.name,
        }),
        protocol: normalizedPreset.protocol,
        serverUrl: normalizedPreset.serverUrl,
        ...(normalizedPreset.resolvedUploadUrl ? { resolvedUploadUrl: normalizedPreset.resolvedUploadUrl } : {}),
        presetId: normalizedPreset.presetId,
        auth: normalizedPreset.auth,
        capabilities: destination.capabilities.source === "preset"
            ? normalizedPreset.capabilities
            : destination.capabilities,
    };
}

function toDestination(record: UploadDestinationRecord): UploadDestination {
    const { scopeKey: _scopeKey, ...destination } = record;
    return normalizeLegacyShareYabuMeDestination(destination);
}

function sortDestinations(a: UploadDestination, b: UploadDestination): number {
    if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
    const leftSort = a.sortIndex ?? a.createdAt;
    const rightSort = b.sortIndex ?? b.createdAt;
    if (leftSort !== rightSort) return leftSort - rightSort;
    if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
    return a.name.localeCompare(b.name);
}

function isDestinationForEndpoint(destination: UploadDestination, endpoint: string): boolean {
    return destination.resolvedUploadUrl === endpoint
        || destination.serverUrl === endpoint;
}

function getPreferredBlossomDestination(
    destinations: UploadDestination[],
    currentDefault: UploadDestination,
    locale: string | null | undefined,
): UploadDestination | null {
    if (
        currentDefault.protocol !== "nip96"
        || currentDefault.createdAt !== currentDefault.updatedAt
    ) {
        return null;
    }

    for (const presetId of getPreferredDefaultUploadPresetIds(locale)) {
        const matchingDestinations = destinations
            .filter((destination) =>
                destination.enabled
                && destination.presetId === presetId
                && destination.updatedAt > currentDefault.updatedAt,
            )
            .sort((a, b) => b.updatedAt - a.updatedAt);

        if (matchingDestinations[0]) {
            return matchingDestinations[0];
        }
    }

    return null;
}

export class DexieUploadDestinationsRepository implements UploadDestinationsRepository {
    private syncedParentScopes = new Set<string>();
    private parentMissingScopes = new Set<string>();

    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
        private getStorage: () => Pick<Storage, "getItem" | "setItem" | "removeItem"> = () => localStorage,
        private parentSync: UploadDestinationsParentSync | null = uploadDestinationsParentSync,
        private getNavigator: () => NavigatorAdapter = () =>
            (typeof navigator !== "undefined" ? navigator : { language: "en" }),
    ) { }

    async getAll(pubkeyHex: string | null = null): Promise<UploadDestination[]> {
        await this.loadParentSnapshot(pubkeyHex);
        await this.ensureUserScopeInitialized(pubkeyHex);
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
        const locale = this.getLocale();
        const defaultDestination = destinations.find((destination) =>
            destination.enabled && destination.isDefault,
        );
        if (defaultDestination) {
            const preferredBlossom = getPreferredBlossomDestination(
                destinations,
                defaultDestination,
                locale,
            );
            if (preferredBlossom) {
                await this.setDefault(preferredBlossom.id, pubkeyHex);
                return { ...preferredBlossom, isDefault: true };
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
            locale,
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

    async move(id: string, direction: "up" | "down", pubkeyHex: string | null = null): Promise<void> {
        const scopeKey = getScopeKey(pubkeyHex);
        const records = await this.db.uploadDestinations
            .where("scopeKey")
            .equals(scopeKey)
            .toArray();
        const sorted = records.map(toDestination).sort(sortDestinations);
        const index = sorted.findIndex((destination) => destination.id === id);
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (index < 0 || targetIndex < 0 || targetIndex >= sorted.length) return;

        const next = [...sorted];
        [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
        const timestamp = this.now();

        await this.db.transaction("rw", this.db.uploadDestinations, async () => {
            await Promise.all(next.map((destination, sortIndex) =>
                this.db.uploadDestinations.put(toRecord({
                    ...destination,
                    sortIndex,
                    updatedAt: destination.id === id ? timestamp : destination.updatedAt,
                })),
            ));
        });
        await this.persistParentSnapshot(scopeKey);
    }

    async replaceBlossomServers(pubkeyHex: string, servers: string[]): Promise<UploadDestination[]> {
        const scopeKey = getScopeKey(pubkeyHex);
        await this.loadParentSnapshot(pubkeyHex);
        await this.ensureUserScopeInitialized(pubkeyHex);

        const records = await this.db.uploadDestinations
            .where("scopeKey")
            .equals(scopeKey)
            .toArray();
        const existing = records.map(toDestination).sort(sortDestinations);
        const nonBlossom = existing.filter((destination) => destination.protocol !== "blossom");
        const existingBlossomByUrl = new Map(
            existing
                .filter((destination) => destination.protocol === "blossom")
                .map((destination) => [normalizeServerUrl(destination.serverUrl), destination]),
        );
        const defaultWasBlossom = existing.some((destination) =>
            destination.protocol === "blossom" && destination.isDefault,
        );
        const hasNonBlossomDefault = nonBlossom.some((destination) => destination.isDefault);
        const timestamp = this.now();
        const uniqueServers = [
            ...new Set(servers.map(normalizeServerUrl).filter((server): server is string => Boolean(server))),
        ];

        const blossomDestinations = uniqueServers.map((serverUrl, index) => {
            const existingDestination = existingBlossomByUrl.get(serverUrl);
            return {
                ...(existingDestination ?? this.createBud03BlossomDestination({
                    pubkeyHex,
                    serverUrl,
                    now: timestamp,
                    index,
                })),
                pubkeyHex,
                protocol: "blossom" as const,
                serverUrl,
                enabled: true,
                isDefault: hasNonBlossomDefault ? false : defaultWasBlossom ? index === 0 : false,
                sortIndex: index,
                updatedAt: timestamp,
            };
        });

        const nextDestinations: UploadDestination[] = [...blossomDestinations, ...nonBlossom.map((destination, index) => ({
            ...destination,
            sortIndex: blossomDestinations.length + index,
        }))];
        if (!nextDestinations.some((destination) => destination.isDefault)) {
            const firstEnabled = nextDestinations.find((destination) => destination.enabled);
            if (firstEnabled) firstEnabled.isDefault = true;
        }

        await this.db.transaction("rw", this.db.uploadDestinations, async () => {
            await this.db.uploadDestinations
                .where("scopeKey")
                .equals(scopeKey)
                .delete();
            if (nextDestinations.length > 0) {
                await this.db.uploadDestinations.bulkPut(nextDestinations.map(toRecord));
            }
        });
        await this.persistParentSnapshot(scopeKey);
        return nextDestinations.sort(sortDestinations);
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

    async applyUploadEndpointPreference({
        endpoint,
        mode,
        pubkeyHex = null,
    }: {
        endpoint: string;
        mode: "forced" | "default";
        pubkeyHex?: string | null;
    }): Promise<UploadDestination | null> {
        const scopeKey = getScopeKey(pubkeyHex);
        await this.loadParentSnapshot(pubkeyHex);

        const records = await this.db.uploadDestinations
            .where("scopeKey")
            .equals(scopeKey)
            .toArray();

        if (mode === "default" && records.some((record) => record.enabled)) {
            await this.persistParentSnapshotIfMissing(scopeKey, records);
            const normalizedRecords = records.map(toDestination);
            return normalizedRecords.find((record) => record.enabled && record.isDefault)
                ?? normalizedRecords.find((record) => record.enabled)
                ?? null;
        }

        const existing = records
            .map(toDestination)
            .find((destination) => isDestinationForEndpoint(destination, endpoint));

        if (existing) {
            await this.setDefault(existing.id, pubkeyHex);
            await this.markLegacyUploadEndpointMigrated(scopeKey);
            return { ...existing, isDefault: true, enabled: true };
        }

        const destination = createLegacyUploadDestination({
            endpoint,
            locale: this.getLocale(),
            pubkeyHex,
            now: this.now(),
        });

        await this.put(destination);
        await this.markLegacyUploadEndpointMigrated(scopeKey);
        return destination;
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
        const migrated = await this.db.meta.get(this.getLegacyUploadEndpointMigrationKey(scopeKey));
        if (migrated?.value === true) return;

        const existing = await this.db.uploadDestinations
            .where("scopeKey")
            .equals(scopeKey)
            .count();
        if (existing > 0) {
            await this.markLegacyUploadEndpointMigrated(scopeKey);
            return;
        }

        const storage = this.getStorage();
        const destination = createLegacyUploadDestination({
            endpoint: storage.getItem(STORAGE_KEYS.UPLOAD_ENDPOINT) ?? "",
            locale: this.getLocale(),
            pubkeyHex: pubkeyHex === UPLOAD_DESTINATION_GLOBAL_SCOPE ? null : pubkeyHex,
            now: this.now(),
        });

        await this.db.transaction("rw", this.db.uploadDestinations, this.db.meta, async () => {
            await this.db.uploadDestinations.put(toRecord(destination));
            await this.db.meta.put({
                key: this.getLegacyUploadEndpointMigrationKey(scopeKey),
                value: true,
                updatedAt: this.now(),
            });
        });
    }

    private async ensureUserScopeInitialized(pubkeyHex: string | null): Promise<void> {
        if (!pubkeyHex) return;

        const scopeKey = getScopeKey(pubkeyHex);
        const existing = await this.db.uploadDestinations
            .where("scopeKey")
            .equals(scopeKey)
            .count();
        if (existing > 0) {
            await this.markLegacyUploadEndpointMigrated(scopeKey);
            return;
        }

        await this.ensureLegacyUploadEndpointMigrated(null);
        const globalRecords = await this.db.uploadDestinations
            .where("scopeKey")
            .equals(UPLOAD_DESTINATION_GLOBAL_SCOPE)
            .toArray();
        if (globalRecords.length === 0) return;

        const timestamp = this.now();
        const scopedRecords = globalRecords
            .map(toDestination)
            .sort(sortDestinations)
            .map((destination, index) => toRecord({
                ...destination,
                id: this.createScopedDestinationId(pubkeyHex, destination.id),
                pubkeyHex,
                sortIndex: destination.sortIndex ?? index,
                updatedAt: timestamp,
            }));

        await this.db.transaction("rw", this.db.uploadDestinations, this.db.meta, async () => {
            await this.db.uploadDestinations.bulkPut(scopedRecords);
            await this.db.meta.put({
                key: this.getLegacyUploadEndpointMigrationKey(scopeKey),
                value: true,
                updatedAt: timestamp,
            });
        });
        await this.persistParentSnapshot(scopeKey, scopedRecords);
    }

    private createScopedDestinationId(pubkeyHex: string, id: string): string {
        return `${pubkeyHex.slice(0, 16)}-${id}`;
    }

    private createBud03BlossomDestination(params: {
        pubkeyHex: string;
        serverUrl: string;
        now: number;
        index: number;
    }): UploadDestination {
        const host = (() => {
            try {
                return new URL(params.serverUrl).host;
            } catch {
                return params.serverUrl;
            }
        })();

        return {
            id: this.createScopedDestinationId(params.pubkeyHex, `bud03-${params.index}-${host}`),
            pubkeyHex: params.pubkeyHex,
            name: host,
            protocol: "blossom",
            serverUrl: params.serverUrl,
            presetId: "custom",
            isDefault: false,
            enabled: true,
            sortIndex: params.index,
            createdAt: params.now,
            updatedAt: params.now,
            capabilities: {
                maxUploadSize: null,
                supportedMimeTypes: [],
                supportsDelete: false,
                supportsList: false,
                supportsMirror: false,
                supportsMediaOptimization: false,
                authRequired: true,
                source: "preset",
            },
            auth: {
                type: "blossom-bud11",
            },
            schemaVersion: 1,
        };
    }

    private getLegacyUploadEndpointMigrationKey(scopeKey: string): string {
        return `${LEGACY_UPLOAD_DESTINATION_MIGRATION_KEY}.${scopeKey}`;
    }

    private getLocale(): string {
        return getEffectiveLocale(this.getStorage(), this.getNavigator());
    }

    private async markLegacyUploadEndpointMigrated(scopeKey: string): Promise<void> {
        await this.db.meta.put({
            key: this.getLegacyUploadEndpointMigrationKey(scopeKey),
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
