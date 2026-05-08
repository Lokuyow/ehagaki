import { RelayConfigUtils } from "../relayConfigUtils";
import {
    ehagakiDb,
    type ChannelMetadataRecord,
    type EHagakiDB,
} from "./ehagakiDb";

export const CHANNEL_METADATA_SCHEMA_VERSION = 1;
export const CHANNEL_METADATA_TTL_MS = 24 * 60 * 60 * 1000;
export const CHANNEL_METADATA_RETRY_INTERVAL_MS = 15 * 60 * 1000;

export interface ChannelMetadataCache {
    channelEventId: string;
    name: string | null;
    about: string | null;
    picture: string | null;
    relays: string[];
    relayHints: string[];
    creatorPubkey?: string;
    createEventCreatedAt?: number;
    metadataEventId?: string;
    metadataCreatedAt?: number;
    fetchedAt?: number;
    lastFetchFailedAt?: number;
}

export interface UpsertResolvedChannelInput {
    channelEventId: string;
    name: string | null;
    about: string | null;
    picture: string | null;
    relays?: string[];
    relayHints?: string[];
    creatorPubkey?: string;
    createEventCreatedAt?: number;
    metadataEventId?: string;
    metadataCreatedAt?: number;
    fetchedAt?: number;
}

export interface ChannelMetadataRepository {
    get(channelEventId: string): Promise<ChannelMetadataCache | null>;
    getMany(channelEventIds: string[]): Promise<ChannelMetadataCache[]>;
    upsertResolvedChannel(input: UpsertResolvedChannelInput): Promise<ChannelMetadataCache>;
    shouldRefresh(record: ChannelMetadataCache | null | undefined, now?: number): boolean;
    markFetchFailed(channelEventId: string, now?: number, relayHints?: string[]): Promise<void>;
}

function toCache(record: ChannelMetadataRecord): ChannelMetadataCache {
    return {
        channelEventId: record.channelEventId,
        name: record.name,
        about: record.about,
        picture: record.picture,
        relays: [...record.relays],
        relayHints: [...record.relayHints],
        creatorPubkey: record.creatorPubkey,
        createEventCreatedAt: record.createEventCreatedAt,
        metadataEventId: record.metadataEventId,
        metadataCreatedAt: record.metadataCreatedAt,
        fetchedAt: record.fetchedAt,
        lastFetchFailedAt: record.lastFetchFailedAt,
    };
}

function sanitizeRelayUrls(relayUrls: string[] | undefined): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relayUrls);
}

function shouldApplyResolvedMetadata(
    existingRecord: ChannelMetadataRecord | undefined,
    input: UpsertResolvedChannelInput,
): boolean {
    if (!existingRecord) {
        return true;
    }

    if (typeof input.metadataCreatedAt === "number") {
        return typeof existingRecord.metadataCreatedAt !== "number"
            || input.metadataCreatedAt > existingRecord.metadataCreatedAt;
    }

    return typeof existingRecord.metadataCreatedAt !== "number";
}

function toRecord(
    input: UpsertResolvedChannelInput,
    existingRecord: ChannelMetadataRecord | undefined,
    now: number,
): ChannelMetadataRecord {
    const sanitizedRelays = sanitizeRelayUrls(input.relays);
    const sanitizedRelayHints = sanitizeRelayUrls(input.relayHints);
    const applyResolvedMetadata = shouldApplyResolvedMetadata(existingRecord, input);

    return {
        channelEventId: input.channelEventId,
        name: applyResolvedMetadata
            ? input.name
            : existingRecord?.name ?? input.name,
        about: applyResolvedMetadata
            ? input.about
            : existingRecord?.about ?? input.about,
        picture: applyResolvedMetadata
            ? input.picture
            : existingRecord?.picture ?? input.picture,
        relays: applyResolvedMetadata
            ? sanitizedRelays
            : existingRecord?.relays ?? sanitizedRelays,
        relayHints: sanitizedRelayHints.length > 0
            ? sanitizedRelayHints
            : existingRecord?.relayHints ?? [],
        ...(input.creatorPubkey
            ? { creatorPubkey: input.creatorPubkey }
            : existingRecord?.creatorPubkey
                ? { creatorPubkey: existingRecord.creatorPubkey }
                : {}),
        ...(typeof input.createEventCreatedAt === "number"
            ? { createEventCreatedAt: input.createEventCreatedAt }
            : typeof existingRecord?.createEventCreatedAt === "number"
                ? { createEventCreatedAt: existingRecord.createEventCreatedAt }
                : {}),
        ...(applyResolvedMetadata && input.metadataEventId
            ? { metadataEventId: input.metadataEventId }
            : existingRecord?.metadataEventId
                ? { metadataEventId: existingRecord.metadataEventId }
                : {}),
        ...(applyResolvedMetadata && typeof input.metadataCreatedAt === "number"
            ? { metadataCreatedAt: input.metadataCreatedAt }
            : typeof existingRecord?.metadataCreatedAt === "number"
                ? { metadataCreatedAt: existingRecord.metadataCreatedAt }
                : {}),
        fetchedAt: input.fetchedAt ?? now,
        updatedAt: now,
        schemaVersion: CHANNEL_METADATA_SCHEMA_VERSION,
    };
}

export class DexieChannelMetadataRepository implements ChannelMetadataRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async get(channelEventId: string): Promise<ChannelMetadataCache | null> {
        if (!channelEventId) {
            return null;
        }

        const record = await this.db.channelMetadata.get(channelEventId);
        return record ? toCache(record) : null;
    }

    async getMany(channelEventIds: string[]): Promise<ChannelMetadataCache[]> {
        const uniqueIds = Array.from(new Set(channelEventIds.filter(Boolean)));
        if (uniqueIds.length === 0) {
            return [];
        }

        const records = await this.db.channelMetadata.bulkGet(uniqueIds);
        return records.filter((record): record is ChannelMetadataRecord => !!record).map(toCache);
    }

    async upsertResolvedChannel(input: UpsertResolvedChannelInput): Promise<ChannelMetadataCache> {
        const now = this.now();
        const existingRecord = await this.db.channelMetadata.get(input.channelEventId);
        const nextRecord = toRecord(input, existingRecord ?? undefined, now);

        if (existingRecord?.lastFetchFailedAt !== undefined) {
            delete nextRecord.lastFetchFailedAt;
        }

        await this.db.channelMetadata.put(nextRecord);
        return toCache(nextRecord);
    }

    shouldRefresh(record: ChannelMetadataCache | null | undefined, now = this.now()): boolean {
        if (!record) {
            return true;
        }

        if (
            typeof record.lastFetchFailedAt === "number"
            && now - record.lastFetchFailedAt < CHANNEL_METADATA_RETRY_INTERVAL_MS
        ) {
            return false;
        }

        if (typeof record.fetchedAt !== "number") {
            return true;
        }

        return now - record.fetchedAt >= CHANNEL_METADATA_TTL_MS;
    }

    async markFetchFailed(
        channelEventId: string,
        now = this.now(),
        relayHints: string[] = [],
    ): Promise<void> {
        if (!channelEventId) {
            return;
        }

        const existingRecord = await this.db.channelMetadata.get(channelEventId);
        await this.db.channelMetadata.put({
            channelEventId,
            name: existingRecord?.name ?? null,
            about: existingRecord?.about ?? null,
            picture: existingRecord?.picture ?? null,
            relays: existingRecord?.relays ?? [],
            relayHints: relayHints.length > 0
                ? sanitizeRelayUrls(relayHints)
                : existingRecord?.relayHints ?? [],
            ...(existingRecord?.creatorPubkey
                ? { creatorPubkey: existingRecord.creatorPubkey }
                : {}),
            ...(typeof existingRecord?.createEventCreatedAt === "number"
                ? { createEventCreatedAt: existingRecord.createEventCreatedAt }
                : {}),
            ...(existingRecord?.metadataEventId
                ? { metadataEventId: existingRecord.metadataEventId }
                : {}),
            ...(typeof existingRecord?.metadataCreatedAt === "number"
                ? { metadataCreatedAt: existingRecord.metadataCreatedAt }
                : {}),
            ...(typeof existingRecord?.fetchedAt === "number"
                ? { fetchedAt: existingRecord.fetchedAt }
                : {}),
            lastFetchFailedAt: now,
            updatedAt: now,
            schemaVersion: CHANNEL_METADATA_SCHEMA_VERSION,
        });
    }
}

export const channelMetadataRepository = new DexieChannelMetadataRepository();