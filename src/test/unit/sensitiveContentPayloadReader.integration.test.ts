import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { finalizeEvent, generateSecretKey } from 'nostr-tools';
import { createSensitivePayloadBodyLoader } from '../../lib/sensitiveContentPayloadReader';
import { ehagakiDb } from '../../lib/storage/ehagakiDb';
import { EventRepository } from '../../lib/storage/eventRepository';
import { notificationRepository } from '../../lib/storage/notificationRepository';
import { clearPostHistoryDisplayForPubkey } from '../../lib/storage/postHistoryPersistenceCoordinator';
import { sensitivePayloadRepository } from '../../lib/storage/sensitivePayloadRepository';
import type { SensitiveBodyCacheStatus } from '../../lib/postContentPreview';

beforeEach(async () => { await ehagakiDb.open(); });
afterEach(async () => { await ehagakiDb.delete(); });

describe('sensitive body observation in shared event storage', () => {
    it('keeps a notification body available after history clear and observes its shared tombstone on reattachment', async () => {
        const key = generateSecretKey();
        const payload = finalizeEvent({ kind: 36, content: 'retained notification body', tags: [['k', '1']], created_at: 100 }, key);
        const structure = finalizeEvent({ kind: 1, content: '', tags: [['content-warning'], ['c', payload.id]], created_at: 100 }, key);
        const reaction = finalizeEvent({ kind: 7, content: '+', tags: [['p', structure.pubkey], ['e', structure.id]], created_at: 101 }, generateSecretKey());
        await new EventRepository(ehagakiDb).save(structure, [], () => true);
        await sensitivePayloadRepository.putCandidate({ event: payload });
        await notificationRepository.upsert(structure.pubkey, [{ event: reaction }]);
        const statuses: SensitiveBodyCacheStatus[] = [];
        let stop = createSensitivePayloadBodyLoader({ structure })!.observe!(status => statuses.push(status));
        try {
            await vi.waitFor(() => expect(statuses.at(-1)).toBe('available'));
            await clearPostHistoryDisplayForPubkey(ehagakiDb, structure.pubkey, Date.now);
            expect(await ehagakiDb.sensitivePayloads.count()).toBe(0);
            expect(await ehagakiDb.events.get(payload.id)).toBeDefined();
            stop();
            statuses.length = 0;
            const loader = createSensitivePayloadBodyLoader({ structure })!;
            stop = loader.observe!(status => statuses.push(status));
            await vi.waitFor(() => expect(statuses).toEqual(['available']));
            await expect(loader()).resolves.toBe('retained notification body');
            await ehagakiDb.events.update(payload.id, { deletedAt: 123_000, deletionEventId: 'd'.repeat(64) });
            await vi.waitFor(() => expect(statuses.at(-1)).toBe('deleted'));
            await expect(loader()).resolves.toBeNull();
        } finally { stop(); }
    });
});
