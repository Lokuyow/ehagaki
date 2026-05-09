import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { afterEach, describe, expect, it } from 'vitest';
import { EHAGAKI_DB_NAME, EHagakiDB } from '../../lib/storage/ehagakiDb';
import { DexiePostMediaCacheRepository } from '../../lib/storage/postMediaCacheRepository';

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-post-media-cache-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe('DexiePostMediaCacheRepository', () => {
    it('normalizes url and preserves linked event ids on upsert', async () => {
        const db = createTestDb();
        const repository = new DexiePostMediaCacheRepository(db, () => 1000);

        await repository.upsert({
            cacheKey: 'https://example.com/media/image.webp',
            url: 'https://example.com/media/image.webp#view',
            size: 120,
            mimeType: 'image/webp',
            source: 'uploaded',
            eventIds: ['event-1'],
        });

        const record = await repository.getByUrl('https://example.com/media/image.webp#another');

        expect(record).toEqual({
            cacheKey: 'https://example.com/media/image.webp',
            url: 'https://example.com/media/image.webp#view',
            normalizedUrl: 'https://example.com/media/image.webp',
            size: 120,
            mimeType: 'image/webp',
            createdAt: 1000,
            lastAccessedAt: 1000,
            source: 'uploaded',
            eventIds: ['event-1'],
            updatedAt: 1000,
            schemaVersion: 1,
        });

        await repository.upsert({
            cacheKey: 'https://example.com/media/image.webp',
            url: 'https://example.com/media/image.webp',
            size: 120,
            mimeType: 'image/webp',
            source: 'uploaded',
            eventIds: ['event-2'],
        });

        await expect(
            repository.getByCacheKey('https://example.com/media/image.webp'),
        ).resolves.toMatchObject({
            eventIds: ['event-1', 'event-2'],
        });

        db.close();
    });

    it('links posted event ids by media url and updates access timestamps', async () => {
        const db = createTestDb();
        let now = 1000;
        const repository = new DexiePostMediaCacheRepository(db, () => now);

        await repository.upsert({
            cacheKey: 'https://example.com/a.jpg',
            url: 'https://example.com/a.jpg',
            size: 10,
            mimeType: 'image/jpeg',
            source: 'uploaded',
        });

        now = 2000;
        await repository.linkEventIdByUrls({
            eventId: 'event-1',
            urls: ['https://example.com/a.jpg#fragment'],
        });
        now = 3000;
        await repository.touch('https://example.com/a.jpg');

        await expect(repository.getByUrl('https://example.com/a.jpg')).resolves.toMatchObject({
            eventIds: ['event-1'],
            lastAccessedAt: 3000,
            updatedAt: 3000,
        });

        await repository.upsert({
            cacheKey: 'https://example.com/b.jpg',
            url: 'https://example.com/b.jpg',
            size: 20,
            mimeType: 'image/jpeg',
            source: 'network',
            lastAccessedAt: 1500,
        });

        await expect(repository.listByLastAccessed()).resolves.toMatchObject([
            { cacheKey: 'https://example.com/b.jpg', lastAccessedAt: 1500 },
            { cacheKey: 'https://example.com/a.jpg', lastAccessedAt: 3000 },
        ]);

        db.close();
    });
});