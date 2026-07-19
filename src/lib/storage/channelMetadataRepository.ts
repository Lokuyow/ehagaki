import { RelayConfigUtils } from "../relayConfigUtils";
import {
    CHANNEL_VERIFIED_SOURCE_RELAY_CACHE_LIMIT,
    CHANNEL_VERIFIED_WRITE_RELAY_CACHE_LIMIT,
} from "../channelContextConstants";
import {
    ehagakiDb,
    type ChannelMetadataRecord,
    type EHagakiDB,
} from "./ehagakiDb";

export const CHANNEL_METADATA_SCHEMA_VERSION = 2;
export const CHANNEL_METADATA_TTL_MS = 24 * 60 * 60 * 1000;
export const CHANNEL_METADATA_RETRY_INTERVAL_MS = 15 * 60 * 1000;

export type ChannelCacheQuality =
    | "legacy-seed"
    | "verified-root-only"
    | "verified-metadata";
export type ChannelResolutionAttemptStatus = "complete" | "incomplete" | "failed";

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
    resolutionQuality?: ChannelCacheQuality;
    verifiedRootAt?: number;
    verifiedMetadataAt?: number;
    lastResolutionAttemptAt?: number;
    lastResolutionAttemptStatus?: ChannelResolutionAttemptStatus;
    fetchedAt?: number;
    lastFetchFailedAt?: number;
}

interface VerifiedRootInput {
    channelEventId: string;
    quality: "verified-root-only" | "verified-metadata";
    metadataLookup: "complete" | "incomplete";
    verifiedSourceRelays?: string[];
    creatorPubkey: string;
    createEventCreatedAt: number;
}

export type UpsertResolvedChannelInput = VerifiedRootInput & (
    | {
        quality: "verified-root-only";
    }
    | {
        quality: "verified-metadata";
        name: string | null;
        about: string | null;
        picture: string | null;
        relays?: string[];
        metadataEventId?: string;
        metadataCreatedAt?: number;
    }
);

export interface ChannelMetadataRepository {
    get(channelEventId: string): Promise<ChannelMetadataCache | null>;
    getMany(channelEventIds: string[]): Promise<ChannelMetadataCache[]>;
    upsertResolvedChannel(input: UpsertResolvedChannelInput): Promise<ChannelMetadataCache>;
    shouldRefresh(record: ChannelMetadataCache | null | undefined, now?: number): boolean;
    markFetchFailed(channelEventId: string, now?: number): Promise<void>;
}

function getStoredQuality(record: ChannelMetadataRecord): ChannelCacheQuality | undefined {
    if (record.schemaVersion >= CHANNEL_METADATA_SCHEMA_VERSION) {
        return record.resolutionQuality;
    }
    return "legacy-seed";
}

function toCache(record: ChannelMetadataRecord): ChannelMetadataCache {
    const legacyFailureAt = record.lastResolutionAttemptAt === undefined
        ? record.lastFetchFailedAt
        : undefined;
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
        resolutionQuality: getStoredQuality(record),
        verifiedRootAt: record.verifiedRootAt,
        verifiedMetadataAt: record.verifiedMetadataAt,
        lastResolutionAttemptAt: record.lastResolutionAttemptAt ?? legacyFailureAt,
        lastResolutionAttemptStatus: record.lastResolutionAttemptStatus
            ?? (legacyFailureAt !== undefined ? "failed" : undefined),
        fetchedAt: record.fetchedAt,
        lastFetchFailedAt: record.lastFetchFailedAt,
    };
}

function sanitizeRelayUrls(relayUrls: string[] | undefined, limit: number): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relayUrls, { limit });
}

function mergeRelayUrls(limit: number, ...relayGroups: string[][]): string[] {
    return sanitizeRelayUrls(
        RelayConfigUtils.mergeRelayConfigs(...relayGroups),
        limit,
    );
}

function shouldApplyResolvedMetadata(
    existingRecord: ChannelMetadataRecord | undefined,
    input: Extract<UpsertResolvedChannelInput, { quality: "verified-metadata" }>,
): boolean {
    if (!existingRecord || getStoredQuality(existingRecord) !== "verified-metadata") {
        return true;
    }
    const existingCreatedAt = existingRecord.metadataCreatedAt;
    const inputCreatedAt = input.metadataCreatedAt;
    if (typeof inputCreatedAt !== "number") {
        return typeof existingCreatedAt !== "number";
    }
    if (typeof existingCreatedAt !== "number") return true;
    if (inputCreatedAt !== existingCreatedAt) return inputCreatedAt > existingCreatedAt;
    if (!input.metadataEventId) return !existingRecord.metadataEventId;
    if (!existingRecord.metadataEventId) return true;
    return input.metadataEventId.localeCompare(existingRecord.metadataEventId) <= 0;
}

function isSameResolvedMetadata(
    existingRecord: ChannelMetadataRecord | undefined,
    input: Extract<UpsertResolvedChannelInput, { quality: "verified-metadata" }>,
): boolean {
    if (!existingRecord || getStoredQuality(existingRecord) !== "verified-metadata") return false;
    if (input.metadataEventId || existingRecord.metadataEventId) {
        return input.metadataEventId === existingRecord.metadataEventId
            && input.metadataCreatedAt === existingRecord.metadataCreatedAt;
    }
    return true;
}

function toRecord(
    input: UpsertResolvedChannelInput,
    existingRecord: ChannelMetadataRecord | undefined,
    now: number,
): ChannelMetadataRecord {
    const existingQuality = existingRecord ? getStoredQuality(existingRecord) : undefined;
    const inputHasMetadata = input.quality === "verified-metadata";
    const applyResolvedMetadata = inputHasMetadata
        ? shouldApplyResolvedMetadata(existingRecord, input)
        : false;
    const sameResolvedMetadata = inputHasMetadata
        ? isSameResolvedMetadata(existingRecord, input)
        : false;
    const preservesVerifiedMetadata = existingQuality === "verified-metadata"
        && (!inputHasMetadata || (!applyResolvedMetadata && !sameResolvedMetadata));
    const nextQuality: ChannelCacheQuality = preservesVerifiedMetadata
        ? "verified-metadata"
        : inputHasMetadata
            ? "verified-metadata"
            : existingQuality === "legacy-seed"
                ? "legacy-seed"
                : "verified-root-only";
    const existingRelayHintsAreVerified = existingQuality === "verified-root-only"
        || existingQuality === "verified-metadata";
    const verifiedSourceRelays = sanitizeRelayUrls(
        input.verifiedSourceRelays,
        CHANNEL_VERIFIED_SOURCE_RELAY_CACHE_LIMIT,
    );
    const relayHints = nextQuality === "legacy-seed"
        ? mergeRelayUrls(
            CHANNEL_VERIFIED_SOURCE_RELAY_CACHE_LIMIT,
            existingRecord?.relayHints ?? [],
            verifiedSourceRelays,
        )
        : mergeRelayUrls(
            CHANNEL_VERIFIED_SOURCE_RELAY_CACHE_LIMIT,
            existingRelayHintsAreVerified ? existingRecord?.relayHints ?? [] : [],
            verifiedSourceRelays,
        );
    const metadataWasObserved = inputHasMetadata
        && (applyResolvedMetadata || sameResolvedMetadata);
    const attemptIncomplete = input.metadataLookup === "incomplete"
        || preservesVerifiedMetadata;

    return {
        channelEventId: input.channelEventId,
        name: applyResolvedMetadata && inputHasMetadata
            ? input.name
            : existingRecord?.name ?? null,
        about: applyResolvedMetadata && inputHasMetadata
            ? input.about
            : existingRecord?.about ?? null,
        picture: applyResolvedMetadata && inputHasMetadata
            ? input.picture
            : existingRecord?.picture ?? null,
        relays: applyResolvedMetadata && inputHasMetadata
            ? sanitizeRelayUrls(input.relays, CHANNEL_VERIFIED_WRITE_RELAY_CACHE_LIMIT)
            : existingRecord?.relays ?? [],
        relayHints,
        creatorPubkey: input.creatorPubkey,
        createEventCreatedAt: input.createEventCreatedAt,
        ...(applyResolvedMetadata && inputHasMetadata && input.metadataEventId
            ? { metadataEventId: input.metadataEventId }
            : existingRecord?.metadataEventId
                ? { metadataEventId: existingRecord.metadataEventId }
                : {}),
        ...(applyResolvedMetadata && inputHasMetadata && typeof input.metadataCreatedAt === "number"
            ? { metadataCreatedAt: input.metadataCreatedAt }
            : typeof existingRecord?.metadataCreatedAt === "number"
                ? { metadataCreatedAt: existingRecord.metadataCreatedAt }
                : {}),
        resolutionQuality: nextQuality,
        verifiedRootAt: now,
        ...(metadataWasObserved
            ? { verifiedMetadataAt: now }
            : typeof existingRecord?.verifiedMetadataAt === "number"
                ? { verifiedMetadataAt: existingRecord.verifiedMetadataAt }
                : {}),
        lastResolutionAttemptAt: now,
        lastResolutionAttemptStatus: attemptIncomplete ? "incomplete" : "complete",
        ...(typeof existingRecord?.fetchedAt === "number"
            ? { fetchedAt: existingRecord.fetchedAt }
            : {}),
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
        if (!channelEventId) return null;
        const record = await this.db.channelMetadata.get(channelEventId);
        return record ? toCache(record) : null;
    }

    async getMany(channelEventIds: string[]): Promise<ChannelMetadataCache[]> {
        const uniqueIds = Array.from(new Set(channelEventIds.filter(Boolean)));
        if (uniqueIds.length === 0) return [];
        const records = await this.db.channelMetadata.bulkGet(uniqueIds);
        return records.filter((record): record is ChannelMetadataRecord => !!record).map(toCache);
    }

    async upsertResolvedChannel(input: UpsertResolvedChannelInput): Promise<ChannelMetadataCache> {
        return this.db.transaction("rw", this.db.channelMetadata, async () => {
            const now = this.now();
            const existingRecord = await this.db.channelMetadata.get(input.channelEventId);
            const nextRecord = toRecord(input, existingRecord ?? undefined, now);
            await this.db.channelMetadata.put(nextRecord);
            return toCache(nextRecord);
        });
    }

    shouldRefresh(record: ChannelMetadataCache | null | undefined, now = this.now()): boolean {
        if (!record) return true;
        const attemptAt = record.lastResolutionAttemptAt;
        const attemptStatus = record.lastResolutionAttemptStatus;
        const withinRetryInterval = typeof attemptAt === "number"
            && now - attemptAt < CHANNEL_METADATA_RETRY_INTERVAL_MS;
        if (attemptStatus === "failed" || attemptStatus === "incomplete") {
            return !withinRetryInterval;
        }
        if (record.resolutionQuality !== "verified-metadata") {
            return !withinRetryInterval;
        }
        if (typeof record.verifiedMetadataAt !== "number") return true;
        return now - record.verifiedMetadataAt >= CHANNEL_METADATA_TTL_MS;
    }

    async markFetchFailed(channelEventId: string, now = this.now()): Promise<void> {
        if (!channelEventId) return;
        await this.db.transaction("rw", this.db.channelMetadata, async () => {
            const existingRecord = await this.db.channelMetadata.get(channelEventId);
            await this.db.channelMetadata.put({
                channelEventId,
                name: existingRecord?.name ?? null,
                about: existingRecord?.about ?? null,
                picture: existingRecord?.picture ?? null,
                relays: existingRecord?.relays ?? [],
                relayHints: existingRecord?.relayHints ?? [],
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
                ...(existingRecord && getStoredQuality(existingRecord)
                    ? { resolutionQuality: getStoredQuality(existingRecord) }
                    : {}),
                ...(typeof existingRecord?.verifiedRootAt === "number"
                    ? { verifiedRootAt: existingRecord.verifiedRootAt }
                    : {}),
                ...(typeof existingRecord?.verifiedMetadataAt === "number"
                    ? { verifiedMetadataAt: existingRecord.verifiedMetadataAt }
                    : {}),
                ...(typeof existingRecord?.fetchedAt === "number"
                    ? { fetchedAt: existingRecord.fetchedAt }
                    : {}),
                lastResolutionAttemptAt: now,
                lastResolutionAttemptStatus: "failed",
                updatedAt: now,
                schemaVersion: CHANNEL_METADATA_SCHEMA_VERSION,
            });
        });
    }
}

export const channelMetadataRepository = new DexieChannelMetadataRepository();
