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
}