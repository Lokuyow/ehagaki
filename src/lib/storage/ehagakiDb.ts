import Dexie, { type Table } from "dexie";
import type { CustomEmojiSourceType } from "../customEmoji";
import type { DraftChannelData, DraftReplyQuoteData, MediaGalleryItem, UploadDestination } from "../types";
import {
    EHAGAKI_DB_NAME,
    EHAGAKI_DB_VERSION,
} from "./ehagakiDbConstants";

export {
    EHAGAKI_DB_NAME,
    EHAGAKI_DB_VERSION,
};
export const SHARED_MEDIA_RECORD_ID = "latest";

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

export interface ProfileRecord {
    pubkeyHex: string;
    name: string;
    displayName: string;
    pictureUrl: string;
    npub: string;
    nprofile: string;
    profileRelays?: string[];
    fetchedAt: number;
    updatedAtFromEvent?: number;
    sourceEventId?: string;
    updatedAt: number;
    schemaVersion: number;
}

export interface RelayConfigRecord {
    pubkeyHex: string;
    config: unknown;
    writeRelays: string[];
    readRelays: string[];
    source?: string;
    fetchedAt: number;
    updatedAtFromEvent?: number;
    updatedAt: number;
    schemaVersion: number;
}

export interface SharedMediaFileRecord {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    arrayBuffer: ArrayBuffer;
}

export interface SharedMediaRecord {
    id: string;
    images: SharedMediaFileRecord[];
    metadata?: Array<{
        name?: string;
        type?: string;
        size?: number;
        timestamp?: string;
    }>;
    title?: string;
    text?: string;
    url?: string;
    shareId?: string;
    bodyStatus?: 'pending' | 'applied' | 'not-applicable';
    automaticRetryCount?: number;
    createdAt: number;
    updatedAt: number;
    schemaVersion: number;
}

export interface HashtagHistoryRecord {
    tagLower: string;
    tag: string;
    useCount: number;
    lastUsed: number;
    createdAt: number;
    updatedAt: number;
    schemaVersion: number;
}

export interface CustomEmojiUsageRecord {
    id: string;
    pubkeyHex: string;
    shortcode: string;
    shortcodeLower: string;
    src: string;
    setAddress: string | null;
    lastUsedAt: number;
    count: number;
    createdAt: number;
    updatedAt: number;
    schemaVersion: number;
}

export interface CustomEmojiImageMetaRecord {
    url: string;
    width: number;
    height: number;
    aspectRatio: number;
    fetchedAt: number;
    lastAccessedAt: number;
    updatedAt: number;
    schemaVersion: number;
}

export interface UploadDestinationRecord extends UploadDestination {
    scopeKey: string;
}

export interface PostHistoryMediaRecord {
    url: string;
    mimeType?: string;
    alt?: string;
    blurhash?: string;
    dim?: string;
    size?: number;
    uploadProtocol?: 'blossom' | 'nip96' | 'custom-http';
}

export interface PostHistoryRecord {
    id: string;
    eventId: string;
    pubkeyHex: string;
    kind: number;
    content: string;
    tags: string[][];
    createdAt: number;
    postedAt: number;
    relayHints: string[];
    acceptedRelays: string[];
    fetchedRelays?: string[];
    media: PostHistoryMediaRecord[];
    rawEvent: unknown;
    fetchedAt?: number;
    lastSeenAt?: number;
    channelEventId?: string;
    channelRelayHints?: string[];
    deletedAt?: number;
    deletionEventId?: string;
    updatedAt: number;
    schemaVersion: number;
}

export interface PostHistoryChildInteractionRecord {
    id: string;
    eventId: string;
    parentEventId: string;
    rootEventId?: string;
    authorPubkey: string;
    kind: number;
    content: string;
    tags: string[][];
    createdAt: number;
    relayUrls: string[];
    discoveredAs: string[];
    rawEvent: unknown;
    fetchedAt: number;
    updatedAt: number;
    schemaVersion: number;
}

export interface PostHistoryDeletionRequestRecord {
    id: string;
    targetAuthorPubkey: string;
    targetEventId: string;
    deletionEventId: string;
    deletionEventPubkey: string;
    deletedAt: number;
    reason: string | null;
    rawEvent: unknown;
    relayUrls: string[];
    fetchedAt: number;
    updatedAt: number;
    schemaVersion: number;
}

export interface PostMediaCacheEntryRecord {
    cacheKey: string;
    url: string;
    normalizedUrl: string;
    size: number;
    mimeType?: string;
    createdAt: number;
    lastAccessedAt: number;
    source: 'uploaded' | 'network';
    eventIds: string[];
    updatedAt: number;
    schemaVersion: number;
}

export interface ChannelMetadataRecord {
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
    updatedAt: number;
    schemaVersion: number;
}

export class EHagakiDB extends Dexie {
    meta!: Table<MetaRecord, string>;
    emojiItems!: Table<EmojiItemRecord, string>;
    emojiCacheMeta!: Table<EmojiCacheMetaRecord, string>;
    drafts!: Table<DraftRecord, string>;
    profiles!: Table<ProfileRecord, string>;
    relayConfigs!: Table<RelayConfigRecord, string>;
    sharedMedia!: Table<SharedMediaRecord, string>;
    hashtagHistory!: Table<HashtagHistoryRecord, string>;
    customEmojiUsage!: Table<CustomEmojiUsageRecord, string>;
    customEmojiImageMeta!: Table<CustomEmojiImageMetaRecord, string>;
    uploadDestinations!: Table<UploadDestinationRecord, string>;
    postHistory!: Table<PostHistoryRecord, string>;
    postHistoryChildInteractions!: Table<PostHistoryChildInteractionRecord, string>;
    postHistoryDeletionRequests!: Table<PostHistoryDeletionRequestRecord, string>;
    postMediaCache!: Table<PostMediaCacheEntryRecord, string>;
    channelMetadata!: Table<ChannelMetadataRecord, string>;

    constructor(databaseName = EHAGAKI_DB_NAME) {
        super(databaseName);

        this.version(EHAGAKI_DB_VERSION).stores({
            meta: "key, updatedAt",
            emojiItems: "id, pubkeyHex, identityKey, shortcodeLower, sortIndex, sourceType, sourceAddress, fetchedAt, updatedAt, [pubkeyHex+sortIndex], [pubkeyHex+identityKey]",
            emojiCacheMeta: "pubkeyHex, fetchedAt, updatedAt, schemaVersion",
            drafts: "id, scopeKey, pubkeyHex, updatedAt, timestamp, [scopeKey+updatedAt]",
            profiles: "pubkeyHex, fetchedAt, updatedAt, updatedAtFromEvent, schemaVersion",
            relayConfigs: "pubkeyHex, fetchedAt, updatedAt, updatedAtFromEvent, schemaVersion",
            sharedMedia: "id, createdAt, updatedAt, schemaVersion",
            hashtagHistory: "tagLower, useCount, lastUsed, updatedAt, schemaVersion",
            customEmojiUsage: "id, pubkeyHex, shortcodeLower, src, lastUsedAt, count, updatedAt, schemaVersion, [pubkeyHex+lastUsedAt], [pubkeyHex+shortcodeLower+src]",
            customEmojiImageMeta: "url, width, height, aspectRatio, fetchedAt, lastAccessedAt, updatedAt, schemaVersion",
            uploadDestinations: "id, scopeKey, pubkeyHex, protocol, presetId, isDefault, enabled, updatedAt, [scopeKey+isDefault], [scopeKey+enabled]",
            postHistory: "id, eventId, pubkeyHex, kind, createdAt, postedAt, updatedAt, deletedAt, fetchedAt, lastSeenAt, schemaVersion, [pubkeyHex+postedAt], [pubkeyHex+createdAt]",
            postHistoryChildInteractions: "id, eventId, parentEventId, rootEventId, authorPubkey, kind, createdAt, fetchedAt, updatedAt, schemaVersion, [parentEventId+createdAt]",
            postHistoryDeletionRequests: "id, targetEventId, targetAuthorPubkey, deletionEventId, fetchedAt, [targetAuthorPubkey+targetEventId]",
            postMediaCache: "cacheKey, url, normalizedUrl, size, createdAt, lastAccessedAt, updatedAt, source, schemaVersion",
            channelMetadata: "channelEventId, fetchedAt, metadataCreatedAt, creatorPubkey, updatedAt, schemaVersion",
        });
    }
}

export const ehagakiDb = new EHagakiDB();
