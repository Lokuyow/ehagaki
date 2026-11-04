import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';
import { EHagakiDB } from '../../lib/storage/ehagakiDb';
import { NotificationRepository } from '../../lib/storage/notificationRepository';
import { isNotificationEvent, notificationType, NOTIFICATION_KINDS } from '../../lib/notification';
import { clearPostHistoryDisplayForPubkey } from '../../lib/storage/postHistoryPersistenceCoordinator';

const authorKey = generateSecretKey(), ownerKey = generateSecretKey();
const owner = getPublicKey(ownerKey), author = getPublicKey(authorKey);
const event = (kind = 1, tags = [['p', owner]], created_at = 100, content = 'notification') =>
    finalizeEvent({ kind, tags, created_at, content }, authorKey);
let db: EHagakiDB, repository: NotificationRepository;
beforeEach(() => { db = new EHagakiDB(`notification-${crypto.randomUUID()}`); repository = new NotificationRepository(db, () => 1234); });
afterEach(async () => { await db.delete(); });

describe('notification persistence', () => {
    it.each([...NOTIFICATION_KINDS])('keeps addressed kind %s even without a locally saved parent', async kind => {
        const incoming = event(kind);
        await repository.upsert(owner, [{ event: incoming }]);
        expect(await repository.list(owner)).toMatchObject([{ eventId: incoming.id, unread: 1, receivedAt: 1234 }]);
    });
    it('excludes self, uppercase-only, unrelated and unsupported events, and rejects invalid signatures', async () => {
        const self = finalizeEvent({ kind: 1, tags: [['p', owner]], created_at: 100, content: 'self' }, ownerKey);
        for (const incoming of [self, event(1111, [['P', owner]]), event(1, [['p', author]]), event(9735),
            { ...event(), content: 'changed after signing' }]) await repository.upsert(owner, [{ event: incoming }]);
        expect(await repository.list(owner)).toEqual([]);
    });
    it('persists quotes without fetching the quoted event', async () => {
        const quote = event(1, [['p', owner], ['q', 'f'.repeat(64)]]);
        expect(notificationType(quote)).toBe('quote');
        expect(isNotificationEvent(quote, owner)).toBe(true);
        await repository.upsert(owner, [{ event: quote }]);
        expect((await repository.list(owner))[0]?.eventId).toBe(quote.id);
    });
    it('deduplicates relays and preserves read state and first receipt on repeat delivery', async () => {
        const incoming = event();
        await repository.upsert(owner, [{ event: incoming, relayUrls: ['wss://one.example'] }]);
        await repository.markRead(owner, [incoming.id]);
        await repository.upsert(owner, [{ event: incoming, relayUrls: ['wss://two.example', 'javascript:bad'] }]);
        expect(await repository.hasUnread(owner)).toBe(false);
        expect(await new NotificationRepository(db).list(owner)).toMatchObject([{ receivedAt: 1234, unread: 0,
            relayUrls: ['wss://one.example/', 'wss://two.example/'] }]);
    });
    it('marks only the displayed IDs, isolates owners, and leaves notifications when history is cleared', async () => {
        const first = event(), next = event(1, [['p', owner], ['p', author]], 101);
        await repository.upsert(owner, [{ event: first }, { event: next }]);
        await repository.markRead(author, [first.id]);
        expect(await repository.hasUnread(owner)).toBe(true);
        await repository.markRead(owner, [first.id]);
        await clearPostHistoryDisplayForPubkey(db, owner, () => 2000);
        expect(await repository.list(owner)).toMatchObject([{ eventId: next.id, unread: 1 }, { eventId: first.id, unread: 0 }]);
        expect(await repository.list(author)).toEqual([]);
    });
    it('does not apply cancelled writes or read transitions', async () => {
        const incoming = event();
        await repository.upsert(owner, [{ event: incoming }], () => false);
        expect(await repository.list(owner)).toEqual([]);
        await repository.upsert(owner, [{ event: incoming }]);
        await repository.markRead(owner, [incoming.id], () => false);
        expect(await repository.hasUnread(owner)).toBe(true);
    });
    it('sorts and pages deterministically when timestamps are equal', async () => {
        const incoming = [event(1, [['p', owner]], 100, 'a'), event(1, [['p', owner]], 100, 'b')];
        await repository.upsert(owner, incoming.map(event => ({ event })));
        expect((await repository.list(owner, 1))[0]?.eventId).toBe(incoming.map(e => e.id).sort().reverse()[0]);
    });
});
