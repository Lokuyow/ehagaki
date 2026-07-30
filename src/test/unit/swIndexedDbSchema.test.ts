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

        ensureCurrentEHagakiDbSchema(db, 'sharedMedia');

        expect(db.createObjectStore).toHaveBeenCalledTimes(17);
        expect(createdStores.get('meta')?.keyPath).toBe('key');
        expect(createdStores.get('emojiItems')?.createIndex).toHaveBeenCalledWith(
            '[pubkeyHex+identityKey]',
            ['pubkeyHex', 'identityKey'],
        );
        expect(createdStores.get('drafts')?.createIndex).toHaveBeenCalledWith(
            '[scopeKey+updatedAt]',
            ['scopeKey', 'updatedAt'],
        );
        expect(createdStores.get('sharedMedia')?.createIndex).toHaveBeenCalledWith(
            'schemaVersion',
            'schemaVersion',
        );
        expect(createdStores.get('hashtagHistory')?.createIndex).toHaveBeenCalledWith(
            'useCount',
            'useCount',
        );
        expect(createdStores.get('customEmojiUsage')?.createIndex).toHaveBeenCalledWith(
            '[pubkeyHex+shortcodeLower+src]',
            ['pubkeyHex', 'shortcodeLower', 'src'],
        );
        expect(createdStores.get('customEmojiImageMeta')?.createIndex).toHaveBeenCalledWith(
            'lastAccessedAt',
            'lastAccessedAt',
        );
        expect(createdStores.get('uploadDestinations')?.createIndex).toHaveBeenCalledWith(
            '[scopeKey+isDefault]',
            ['scopeKey', 'isDefault'],
        );
        expect(createdStores.get('postHistory')?.createIndex).toHaveBeenCalledWith(
            '[pubkeyHex+postedAt]',
            ['pubkeyHex', 'postedAt'],
        );
        expect(createdStores.get('postHistory')?.createIndex).toHaveBeenCalledWith(
            POST_HISTORY_TIMELINE_INDEX,
            POST_HISTORY_TIMELINE_KEY_PATH,
        );
        expect(createdStores.get('postHistoryChildInteractions')?.createIndex)
            .toHaveBeenCalledWith(
                '[parentEventId+createdAt]',
                ['parentEventId', 'createdAt'],
            );
        expect(createdStores.get('postHistoryDeletionRequests')?.createIndex)
            .toHaveBeenCalledWith(
                '[targetAuthorPubkey+targetEventId]',
                ['targetAuthorPubkey', 'targetEventId'],
            );
        expect(createdStores.get('postMediaCache')?.createIndex).toHaveBeenCalledWith(
            'schemaVersion',
            'schemaVersion',
        );
        expect(createdStores.get('channelMetadata')?.createIndex).toHaveBeenCalledWith(
            'metadataCreatedAt',
            'metadataCreatedAt',
        );
        expect(createdStores.get('channelImageCacheMeta')?.createIndex).toHaveBeenCalledWith(
            'lastAccessedAt',
            'lastAccessedAt',
        );
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
