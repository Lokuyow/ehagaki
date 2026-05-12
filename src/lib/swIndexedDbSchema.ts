export interface IndexedDbSchemaIndexDefinition {
    name: string;
    keyPath: string | string[];
}

export interface IndexedDbObjectStoreLike {
    createIndex: (name: string, keyPath: string | string[]) => void;
}

export interface IndexedDbLike {
    objectStoreNames: {
        contains: (name: string) => boolean;
    };
    createObjectStore: (
        name: string,
        options: { keyPath: string },
    ) => IndexedDbObjectStoreLike;
}

export function createObjectStoreIfMissing(
    db: IndexedDbLike,
    name: string,
    keyPath: string,
    indexes: IndexedDbSchemaIndexDefinition[] = [],
): void {
    if (db.objectStoreNames.contains(name)) {
        return;
    }

    const store = db.createObjectStore(name, { keyPath });
    indexes.forEach((index) => {
        store.createIndex(index.name, index.keyPath);
    });
}

export function ensureCurrentEHagakiDbSchema(
    db: IndexedDbLike,
    sharedMediaStoreName = 'sharedMedia',
): void {
    createObjectStoreIfMissing(db, 'meta', 'key', [
        { name: 'updatedAt', keyPath: 'updatedAt' },
    ]);
    createObjectStoreIfMissing(db, 'emojiItems', 'id', [
        { name: 'pubkeyHex', keyPath: 'pubkeyHex' },
        { name: 'identityKey', keyPath: 'identityKey' },
        { name: 'shortcodeLower', keyPath: 'shortcodeLower' },
        { name: 'sortIndex', keyPath: 'sortIndex' },
        { name: 'sourceType', keyPath: 'sourceType' },
        { name: 'sourceAddress', keyPath: 'sourceAddress' },
        { name: 'fetchedAt', keyPath: 'fetchedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: '[pubkeyHex+sortIndex]', keyPath: ['pubkeyHex', 'sortIndex'] },
        { name: '[pubkeyHex+identityKey]', keyPath: ['pubkeyHex', 'identityKey'] },
    ]);
    createObjectStoreIfMissing(db, 'emojiCacheMeta', 'pubkeyHex', [
        { name: 'fetchedAt', keyPath: 'fetchedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' },
    ]);
    createObjectStoreIfMissing(db, 'drafts', 'id', [
        { name: 'scopeKey', keyPath: 'scopeKey' },
        { name: 'pubkeyHex', keyPath: 'pubkeyHex' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: '[scopeKey+updatedAt]', keyPath: ['scopeKey', 'updatedAt'] },
    ]);
    createObjectStoreIfMissing(db, 'profiles', 'pubkeyHex', [
        { name: 'fetchedAt', keyPath: 'fetchedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'updatedAtFromEvent', keyPath: 'updatedAtFromEvent' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' },
    ]);
    createObjectStoreIfMissing(db, 'relayConfigs', 'pubkeyHex', [
        { name: 'fetchedAt', keyPath: 'fetchedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'updatedAtFromEvent', keyPath: 'updatedAtFromEvent' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' },
    ]);
    createObjectStoreIfMissing(db, sharedMediaStoreName, 'id', [
        { name: 'createdAt', keyPath: 'createdAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' },
    ]);
    createObjectStoreIfMissing(db, 'hashtagHistory', 'tagLower', [
        { name: 'useCount', keyPath: 'useCount' },
        { name: 'lastUsed', keyPath: 'lastUsed' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' },
    ]);
    createObjectStoreIfMissing(db, 'customEmojiUsage', 'id', [
        { name: 'pubkeyHex', keyPath: 'pubkeyHex' },
        { name: 'shortcodeLower', keyPath: 'shortcodeLower' },
        { name: 'src', keyPath: 'src' },
        { name: 'lastUsedAt', keyPath: 'lastUsedAt' },
        { name: 'count', keyPath: 'count' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' },
        { name: '[pubkeyHex+lastUsedAt]', keyPath: ['pubkeyHex', 'lastUsedAt'] },
        { name: '[pubkeyHex+shortcodeLower+src]', keyPath: ['pubkeyHex', 'shortcodeLower', 'src'] },
    ]);
    createObjectStoreIfMissing(db, 'customEmojiImageMeta', 'url', [
        { name: 'width', keyPath: 'width' },
        { name: 'height', keyPath: 'height' },
        { name: 'aspectRatio', keyPath: 'aspectRatio' },
        { name: 'fetchedAt', keyPath: 'fetchedAt' },
        { name: 'lastAccessedAt', keyPath: 'lastAccessedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' },
    ]);
    createObjectStoreIfMissing(db, 'uploadDestinations', 'id', [
        { name: 'scopeKey', keyPath: 'scopeKey' },
        { name: 'pubkeyHex', keyPath: 'pubkeyHex' },
        { name: 'protocol', keyPath: 'protocol' },
        { name: 'presetId', keyPath: 'presetId' },
        { name: 'isDefault', keyPath: 'isDefault' },
        { name: 'enabled', keyPath: 'enabled' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: '[scopeKey+isDefault]', keyPath: ['scopeKey', 'isDefault'] },
        { name: '[scopeKey+enabled]', keyPath: ['scopeKey', 'enabled'] },
    ]);
    createObjectStoreIfMissing(db, 'postHistory', 'id', [
        { name: 'eventId', keyPath: 'eventId' },
        { name: 'pubkeyHex', keyPath: 'pubkeyHex' },
        { name: 'kind', keyPath: 'kind' },
        { name: 'createdAt', keyPath: 'createdAt' },
        { name: 'postedAt', keyPath: 'postedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'deletedAt', keyPath: 'deletedAt' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' },
        { name: '[pubkeyHex+postedAt]', keyPath: ['pubkeyHex', 'postedAt'] },
    ]);
    createObjectStoreIfMissing(db, 'postHistorySyncCoverage', 'id', [
        { name: 'pubkeyHex', keyPath: 'pubkeyHex' },
        { name: 'requestKind', keyPath: 'requestKind' },
        { name: 'status', keyPath: 'status' },
        { name: 'since', keyPath: 'since' },
        { name: 'until', keyPath: 'until' },
        { name: 'fetchedAt', keyPath: 'fetchedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' },
        { name: '[pubkeyHex+fetchedAt]', keyPath: ['pubkeyHex', 'fetchedAt'] },
        { name: '[pubkeyHex+status]', keyPath: ['pubkeyHex', 'status'] },
        { name: '[pubkeyHex+requestKind+fetchedAt]', keyPath: ['pubkeyHex', 'requestKind', 'fetchedAt'] },
    ]);
    createObjectStoreIfMissing(db, 'postMediaCache', 'cacheKey', [
        { name: 'url', keyPath: 'url' },
        { name: 'normalizedUrl', keyPath: 'normalizedUrl' },
        { name: 'size', keyPath: 'size' },
        { name: 'createdAt', keyPath: 'createdAt' },
        { name: 'lastAccessedAt', keyPath: 'lastAccessedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'source', keyPath: 'source' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' },
    ]);
    createObjectStoreIfMissing(db, 'channelMetadata', 'channelEventId', [
        { name: 'fetchedAt', keyPath: 'fetchedAt' },
        { name: 'metadataCreatedAt', keyPath: 'metadataCreatedAt' },
        { name: 'creatorPubkey', keyPath: 'creatorPubkey' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' },
    ]);
}
