import { describe, expect, it, vi } from 'vitest';

import {
    createObjectStoreIfMissing,
    ensureCurrentEHagakiDbSchema,
} from '../../lib/swIndexedDbSchema';
import {
    POST_HISTORY_TIMELINE_INDEX,
    POST_HISTORY_TIMELINE_KEY_PATH,
} from '../../lib/storage/ehagakiDbConstants';

function createMockDb(existingStores: string[] = []) {
    const createdStores = new Map<string, { keyPath: string; createIndex: ReturnType<typeof vi.fn> }>();

    return {
        createdStores,
        db: {
            objectStoreNames: {
                contains: (name: string) => existingStores.includes(name),
            },
            createObjectStore: vi.fn((name: string, options: { keyPath: string }) => {
                const store = {
                    keyPath: options.keyPath,
                    createIndex: vi.fn(),
                };
                createdStores.set(name, store);
                return store;
            }),
        },
    };
}

function getCreatedStore(
    createdStores: Map<string, { keyPath: string; createIndex: ReturnType<typeof vi.fn> }>,
    storeName: string,
) {
    const store = createdStores.get(storeName);
    expect(store, `Expected object store "${storeName}" to be created`).toBeDefined();

    return store!;
}

describe('swIndexedDbSchema', () => {
    it('createObjectStoreIfMissing は既存 store を再作成しない', () => {
        const { db } = createMockDb(['meta']);

        createObjectStoreIfMissing(db, 'meta', 'key', [
            { name: 'updatedAt', keyPath: 'updatedAt' },
        ]);

        expect(db.createObjectStore).not.toHaveBeenCalled();
    });

    it('ensureCurrentEHagakiDbSchema は必要な store と index を作成する', () => {
        const { db, createdStores } = createMockDb();
        const indexAssertions = [
            {
                storeName: 'emojiItems',
                indexName: '[pubkeyHex+identityKey]',
                keyPath: ['pubkeyHex', 'identityKey'],
            },
            {
                storeName: 'drafts',
                indexName: '[scopeKey+updatedAt]',
                keyPath: ['scopeKey', 'updatedAt'],
            },
            {
                storeName: 'sharedMedia',
                indexName: 'schemaVersion',
                keyPath: 'schemaVersion',
            },
            {
                storeName: 'hashtagHistory',
                indexName: 'useCount',
                keyPath: 'useCount',
            },
            {
                storeName: 'customEmojiUsage',
                indexName: '[pubkeyHex+shortcodeLower+src]',
                keyPath: ['pubkeyHex', 'shortcodeLower', 'src'],
            },
            {
                storeName: 'customEmojiImageMeta',
                indexName: 'lastAccessedAt',
                keyPath: 'lastAccessedAt',
            },
            {
                storeName: 'uploadDestinations',
                indexName: '[scopeKey+isDefault]',
                keyPath: ['scopeKey', 'isDefault'],
            },
            {
                storeName: 'postHistory',
                indexName: '[pubkeyHex+postedAt]',
                keyPath: ['pubkeyHex', 'postedAt'],
            },
            {
                storeName: 'postHistory',
                indexName: POST_HISTORY_TIMELINE_INDEX,
                keyPath: POST_HISTORY_TIMELINE_KEY_PATH,
            },
            {
                storeName: 'postHistoryChildInteractions',
                indexName: '[parentEventId+createdAt]',
                keyPath: ['parentEventId', 'createdAt'],
            },
            {
                storeName: 'postHistoryDeletionRequests',
                indexName: '[targetAuthorPubkey+targetEventId]',
                keyPath: ['targetAuthorPubkey', 'targetEventId'],
            },
            {
                storeName: 'postMediaCache',
                indexName: 'schemaVersion',
                keyPath: 'schemaVersion',
            },
            {
                storeName: 'channelMetadata',
                indexName: 'metadataCreatedAt',
                keyPath: 'metadataCreatedAt',
            },
            {
                storeName: 'channelImageCacheMeta',
                indexName: 'lastAccessedAt',
                keyPath: 'lastAccessedAt',
            },
        ];

        ensureCurrentEHagakiDbSchema(db, 'sharedMedia');

        expect(db.createObjectStore).toHaveBeenCalledTimes(17);
        expect(getCreatedStore(createdStores, 'meta').keyPath).toBe('key');

        indexAssertions.forEach(({ storeName, indexName, keyPath }) => {
            expect(getCreatedStore(createdStores, storeName).createIndex).toHaveBeenCalledWith(
                indexName,
                keyPath,
            );
        });
    });

    it('既存 postHistory store には upgrade transaction から timeline index だけを追加する', () => {
        const { db } = createMockDb(['postHistory']);
        const existingStore = {
            indexNames: {
                contains: vi.fn().mockReturnValue(false),
            },
            createIndex: vi.fn(),
        };
        const upgradeTransaction = {
            objectStore: vi.fn().mockReturnValue(existingStore),
        };

        ensureCurrentEHagakiDbSchema(db, 'sharedMedia', upgradeTransaction);

        expect(upgradeTransaction.objectStore).toHaveBeenCalledWith('postHistory');
        expect(existingStore.createIndex).toHaveBeenCalledWith(
            POST_HISTORY_TIMELINE_INDEX,
            POST_HISTORY_TIMELINE_KEY_PATH,
        );
    });

    it('既存 timeline index を再作成しない', () => {
        const { db } = createMockDb(['postHistory']);
        const existingStore = {
            indexNames: {
                contains: vi.fn().mockReturnValue(true),
            },
            createIndex: vi.fn(),
        };

        ensureCurrentEHagakiDbSchema(db, 'sharedMedia', {
            objectStore: vi.fn().mockReturnValue(existingStore),
        });

        expect(existingStore.createIndex).not.toHaveBeenCalled();
    });
});
