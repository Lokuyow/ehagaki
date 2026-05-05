import { describe, expect, it } from 'vitest';

import { buildSharedMediaIndexedDbRecord } from '../../lib/swSharedMediaPersistence';

function attachArrayBuffer(file: File, contents: string): File {
    Object.defineProperty(file, 'arrayBuffer', {
        value: async () => new TextEncoder().encode(contents).buffer,
        configurable: true,
    });
    return file;
}

describe('swSharedMediaPersistence', () => {
    it('複数 File から IndexedDB record を組み立てる', async () => {
        const fileA = attachArrayBuffer(
            new File(['abc'], 'a.png', { type: 'image/png', lastModified: 111 }),
            'abc',
        );
        const fileB = attachArrayBuffer(
            new File(['defg'], 'b.jpg', { type: 'image/jpeg', lastModified: 222 }),
            'defg',
        );

        const result = await buildSharedMediaIndexedDbRecord({
            sharedData: {
                images: [fileA, fileB],
                metadata: [{ name: 'a.png' }, { name: 'b.jpg' }],
            },
            maxFileSize: 1024,
            recordId: 'latest',
            schemaVersion: 1,
            now: () => 123456,
        });

        expect(result).toMatchObject({
            id: 'latest',
            metadata: [{ name: 'a.png' }, { name: 'b.jpg' }],
            createdAt: 123456,
            updatedAt: 123456,
            schemaVersion: 1,
        });
        expect(result.images).toHaveLength(2);
        expect(result.images[0]).toMatchObject({
            name: 'a.png',
            type: 'image/png',
            size: 3,
            lastModified: 111,
        });
        expect(result.images[1]).toMatchObject({
            name: 'b.jpg',
            type: 'image/jpeg',
            size: 4,
            lastModified: 222,
        });
        expect(result.images[0].arrayBuffer.byteLength).toBe(3);
    });

    it('単一 image fallback を受け取れる', async () => {
        const file = attachArrayBuffer(
            new File(['abc'], 'single.png', { type: 'image/png' }),
            'abc',
        );

        const result = await buildSharedMediaIndexedDbRecord({
            sharedData: {
                image: file,
                metadata: [{ name: 'single.png' }],
            },
            maxFileSize: 1024,
            recordId: 'latest',
            schemaVersion: 1,
            now: () => 99,
        });

        expect(result.images).toHaveLength(1);
        expect(result.images[0].name).toBe('single.png');
    });

    it('上限を超える File はエラーにする', async () => {
        const file = attachArrayBuffer(
            new File(['abcdef'], 'large.png', { type: 'image/png' }),
            'abcdef',
        );

        await expect(
            buildSharedMediaIndexedDbRecord({
                sharedData: { images: [file] },
                maxFileSize: 3,
                recordId: 'latest',
                schemaVersion: 1,
            }),
        ).rejects.toThrow('File too large for IndexedDB persistence: large.png');
    });
});