import { describe, expect, it, vi } from 'vitest';

import {
    createObjectStoreIfMissing,
    ensureCurrentEHagakiDbSchema,
} from '../../lib/swIndexedDbSchema';

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

        expect(db.createObjectStore).toHaveBeenCalledTimes(9);
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
        expect(createdStores.get('uploadDestinations')?.createIndex).toHaveBeenCalledWith(
            '[scopeKey+isDefault]',
            ['scopeKey', 'isDefault'],
        );
    });
});
