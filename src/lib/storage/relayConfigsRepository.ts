import { STORAGE_KEYS } from "../constants";
import { RelayConfigParser, RelayConfigUtils } from "../relayConfigUtils";
import type { RelayConfig } from "../types";
import { ehagakiDb, type EHagakiDB, type RelayConfigRecord } from "./ehagakiDb";

const RELAY_CONFIG_SCHEMA_VERSION = 1;

export interface RelayConfigCache {
    config: RelayConfig;
    writeRelays: string[];
    readRelays: string[];
    source?: string;
    fetchedAt?: number;
    updatedAtFromEvent?: number;
}

export interface RelayConfigsRepository {
    get(pubkeyHex: string): Promise<RelayConfigCache | null>;
    put(pubkeyHex: string, config: RelayConfig, options?: {
        source?: string;
        fetchedAt?: number;
        updatedAtFromEvent?: number;
    }): Promise<void>;
    delete(pubkeyHex: string): Promise<void>;
}

function toCache(record: RelayConfigRecord): RelayConfigCache | null {
    if (!RelayConfigParser.isValidRelayConfig(record.config)) return null;

    return {
        config: record.config,
        writeRelays: record.writeRelays,
        readRelays: record.readRelays,
        source: record.source,
        fetchedAt: record.fetchedAt,
        updatedAtFromEvent: record.updatedAtFromEvent,
    };
}

function toRecord(
    pubkeyHex: string,
    config: RelayConfig,
    now: () => number,
    options: {
        source?: string;
        fetchedAt?: number;
        updatedAtFromEvent?: number;
    } = {},
): RelayConfigRecord {
    const updatedAt = now();

    return {
        pubkeyHex,
        config,
        writeRelays: RelayConfigUtils.extractWriteRelays(config),
        readRelays: RelayConfigUtils.extractReadRelays(config),
        source: options.source,
        fetchedAt: options.fetchedAt || updatedAt,
        updatedAtFromEvent: options.updatedAtFromEvent,
        updatedAt,
        schemaVersion: RELAY_CONFIG_SCHEMA_VERSION,
    };
}

function readLegacyRelayConfig(
    pubkeyHex: string,
    storage: Pick<Storage, "getItem">,
): RelayConfig | null {
    const relayString = storage.getItem(STORAGE_KEYS.NOSTR_RELAYS + pubkeyHex);
    if (!relayString) return null;

    try {
        const parsed = JSON.parse(relayString);
        return RelayConfigParser.isValidRelayConfig(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export class DexieRelayConfigsRepository implements RelayConfigsRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
        private getStorage: () => Pick<Storage, "getItem" | "removeItem"> = () => localStorage,
    ) { }

    async get(pubkeyHex: string): Promise<RelayConfigCache | null> {
        if (!pubkeyHex) return null;

        try {
            const record = await this.db.relayConfigs.get(pubkeyHex);
            if (record) return toCache(record);
        } catch {
            const legacyConfig = readLegacyRelayConfig(pubkeyHex, this.getStorage());
            return legacyConfig ? toCache(toRecord(pubkeyHex, legacyConfig, this.now, {
                source: "localStorage",
            })) : null;
        }

        const legacyConfig = readLegacyRelayConfig(pubkeyHex, this.getStorage());
        if (!legacyConfig) return null;

        try {
            await this.put(pubkeyHex, legacyConfig, { source: "localStorage" });
        } catch {
            // Legacy data remains available as a compatibility fallback.
        }

        return toCache(toRecord(pubkeyHex, legacyConfig, this.now, {
            source: "localStorage",
        }));
    }

    async put(
        pubkeyHex: string,
        config: RelayConfig,
        options: {
            source?: string;
            fetchedAt?: number;
            updatedAtFromEvent?: number;
        } = {},
    ): Promise<void> {
        if (!pubkeyHex) return;
        if (!RelayConfigParser.isValidRelayConfig(config)) return;
        await this.db.relayConfigs.put(toRecord(pubkeyHex, config, this.now, options));
    }

    async delete(pubkeyHex: string): Promise<void> {
        if (!pubkeyHex) return;
        await this.db.relayConfigs.delete(pubkeyHex);
        try {
            this.getStorage().removeItem(STORAGE_KEYS.NOSTR_RELAYS + pubkeyHex);
        } catch {
            // IndexedDB deletion already succeeded.
        }
    }
}

export const relayConfigsRepository = new DexieRelayConfigsRepository();
