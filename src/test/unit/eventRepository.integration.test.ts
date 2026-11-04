import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';
import { EHagakiDB } from '../../lib/storage/ehagakiDb';
import { EventRepository } from '../../lib/storage/eventRepository';
import { NotificationRepository } from '../../lib/storage/notificationRepository';
import { DexiePostHistoryRepository } from '../../lib/storage/postHistoryRepository';
import { DexiePostHistoryChildInteractionsRepository } from '../../lib/storage/postHistoryChildInteractionsRepository';
import { clearPostHistoryDisplayForPubkey } from '../../lib/storage/postHistoryPersistenceCoordinator';
import { DexieSensitivePayloadRepository } from '../../lib/storage/sensitivePayloadRepository';
import { ensureCurrentEHagakiDbSchema } from '../../lib/swIndexedDbSchema';
import { upgradeEhagakiDatabase } from '../../lib/storage/ehagakiDbMigration';
import { migrateEventStore } from '../../lib/storage/eventStoreMigration';
import { createPostHistoryRelatedTargetResolver } from '../../lib/postHistoryRelatedTargetResolver.svelte';
import type { NostrEvent } from '../../lib/types';
import type { RxNostr } from 'rx-nostr';

const key = generateSecretKey(), owner = getPublicKey(key), sender = generateSecretKey();
const sign = (content: string, tags: string[][] = [], kind = 1, author = key) => finalizeEvent({ kind, content, tags, created_at: 100 }, author);
const databases: EHagakiDB[] = [];
const createDb = () => { const db = new EHagakiDB(`shared-events-${crypto.randomUUID()}`); databases.push(db); return db; };
afterEach(async () => { for (const db of databases.splice(0)) await db.delete(); vi.restoreAllMocks(); });

describe('shared event storage', () => {
    it('shares opening and migration across concurrent startup readers', async () => {
        const db = createDb();
        const opening = vi.spyOn(indexedDB, 'open');
        await Promise.all(Array.from({ length: 20 }, () => db.events.count()));
        expect(opening.mock.calls.filter(([name]) => name === db.name).length).toBeLessThanOrEqual(3);
        expect(await db.eventStoreMigration.get('shared-events-v19')).toMatchObject({ done: true });
    });
    it('stores one wire event for history, notification and child projections, retaining separate read/ACK state', async () => {
        const db = createDb(), incoming = sign('reply', [['p', owner], ['e', 'a'.repeat(64), '', 'reply']], 1, sender);
        const history = new DexiePostHistoryRepository(db);
        await history.putPostedEvent({ event: incoming, acceptedRelays: ['wss://accepted.example/'] });
        const notifications = new NotificationRepository(db);
        await notifications.upsert(owner, [{ event: incoming, relayUrls: ['wss://received.example/'] }]);
        await notifications.markRead(owner, [incoming.id]);
        await new DexiePostHistoryChildInteractionsRepository(db).upsertChildInteractions({ parentEventId: 'a'.repeat(64), events: [{ event: incoming }] });
        expect(await db.events.count()).toBe(1);
        for (const row of [await db.postHistory.get(incoming.id), await db.postHistoryChildInteractions.get(incoming.id),
            await db.notifications.get(`${owner}:${incoming.id}`)]) {
            expect(row).toBeDefined();
            for (const field of ['rawEvent', 'event', 'content', 'tags']) expect(row).not.toHaveProperty(field);
        }
        expect(await history.getByEventId(incoming.id)).toMatchObject({ rawEvent: incoming, acceptedRelays: ['wss://accepted.example/'], fetchedRelays: ['wss://received.example/'] });
        expect(await history.getAll({ pubkeyHex: owner })).toEqual([]);
        expect(await notifications.list(owner)).toMatchObject([{ event: incoming, unread: 0 }]);
    });

    it('persists arbitrary related kinds across reopening without adding authored history entries', async () => {
        const db = createDb(), target = sign('long form target', [], 30023);
        await new EventRepository(db).save(target, ['wss://received.example/'], () => true);
        db.close();
        await db.open();
        expect(await new EventRepository(db).get(target.id)).toMatchObject({ rawEvent: target });
        expect(await new DexiePostHistoryRepository(db).countForPubkey(owner)).toBe(0);
        await new EventRepository(db).save({ ...target, content: 'tampered' }, [], () => true);
        expect((await db.events.get(target.id))?.rawEvent.content).toBe('long form target');
    });

    it('retains notification targets on history clear and collects unrelated events', async () => {
        const db = createDb(), target = sign('target'), unrelated = sign('unrelated');
        const history = new DexiePostHistoryRepository(db);
        await history.putPostedEvent({ event: target }); await history.putPostedEvent({ event: unrelated });
        const reaction = sign('+', [['p', owner], ['e', target.id]], 7, sender);
        await new NotificationRepository(db).upsert(owner, [{ event: reaction }]);
        await clearPostHistoryDisplayForPubkey(db, owner, Date.now);
        expect(await history.countForPubkey(owner)).toBe(0);
        expect(await db.events.get(target.id)).toBeDefined();
        expect(await db.events.get(unrelated.id)).toBeUndefined();
        expect(await new NotificationRepository(db).list(owner)).toHaveLength(1);
    });

    it('keeps a notification target’s CW body readable after its authored history is cleared', async () => {
        const db = createDb(), payload = sign('cached CW body', [['k', '1']], 36);
        const structure = sign('', [['content-warning'], ['c', payload.id]]);
        await new DexiePostHistoryRepository(db).putPostedEvent({ event: structure });
        const payloads = new DexieSensitivePayloadRepository(db);
        await payloads.putCandidate({ event: payload });
        await new NotificationRepository(db).upsert(owner, [{ event: sign('+', [['p', owner], ['e', structure.id]], 7, sender) }]);
        await clearPostHistoryDisplayForPubkey(db, owner, Date.now);
        expect(await db.sensitivePayloads.count()).toBe(0);
        expect(await payloads.getByIds([payload.id])).toMatchObject([{ rawEvent: payload }]);
    });

    it('rolls back event and notification together when invalidated during persistence', async () => {
        const db = createDb(), incoming = sign('late', [['p', owner]], 1, sender);
        await db.open(); let active = true;
        db.events.hook('creating', () => { active = false; });
        await expect(new NotificationRepository(db).upsert(owner, [{ event: incoming },
            { event: sign('another late item', [['p', owner]], 1, sender) }], () => active)).rejects.toBeDefined();
        expect(await db.events.count()).toBe(0); expect(await db.notifications.count()).toBe(0);
    });

    it.each(['disabled', 'account', 'relays', 'runtime'] as const)('does not cache a late related target after %s changes', async change => {
        const db = createDb(), target = sign('late target', [], 30023);
        let currentOwner = owner, shown = true, runtime = {} as RxNostr;
        let config = { 'wss://one.example/': { read: true, write: false } };
        let complete!: (value: { event: NostrEvent; relayUrl: string }) => void;
        const fetching = new Promise<{ event: NostrEvent; relayUrl: string }>(resolve => { complete = resolve; });
        const fetchEventById = vi.fn(() => ({ promise: fetching, cancel: vi.fn() }));
        const resolver = createPostHistoryRelatedTargetResolver({ getOwner: () => currentOwner, getShow: () => shown,
            getRxNostr: () => runtime, getRelayConfig: () => config, requireFullVerification: true,
            eventRepositoryImpl: new EventRepository(db), postHistoryRepositoryImpl: { getByEventId: async () => null },
            contextFetchService: { fetchEventById },
            deletionRequestsRepositoryImpl: { getDeletedTargets: async () => new Map(), upsertValidDeletionRequests: vi.fn() },
            deletionFetchService: { fetchDeletionRequests: () => ({ promise: Promise.resolve({ status: "success" as const, events: [], fetchedAt: 0, relayUrls: [] }), cancel: vi.fn() }) },
            profileSyncCoordinator: { ensureProfile: vi.fn(), subscribe: () => () => undefined, reset: vi.fn() } as never });
        const task = resolver.ensureTarget({ targetEventId: target.id, authorHint: target.pubkey, scopeKey: 'test', relationKind: 'notification' });
        await vi.waitFor(() => expect(fetchEventById).toHaveBeenCalledOnce());
        if (change === 'disabled') shown = false;
        if (change === 'account') currentOwner = getPublicKey(sender);
        if (change === 'runtime') runtime = {} as RxNostr;
        if (change === 'relays') config = { 'wss://one.example/': { read: false, write: false } };
        complete({ event: target, relayUrl: 'wss://one.example/' });
        await task;
        expect(await db.events.get(target.id)).toBeUndefined();
        resolver.reset();
    });

    it('migrates v18 snapshots atomically, preserves read/provenance state and resumes without duplicating events', async () => {
        const db = createDb(), target = sign('old target'), incoming = sign('old notification', [['p', owner], ['q', target.id]], 1, sender);
        const old = await new Promise<IDBDatabase>((resolve, reject) => {
            const opening = indexedDB.open(db.name, 180);
            opening.onupgradeneeded = () => {
                ensureCurrentEHagakiDbSchema(opening.result, 'sharedMedia', opening.transaction);
                opening.result.deleteObjectStore('events'); opening.result.deleteObjectStore('eventStoreMigration');
            };
            opening.onsuccess = () => resolve(opening.result); opening.onerror = () => reject(opening.error);
        });
        await new Promise<void>((resolve, reject) => {
            const tx = old.transaction(['postHistory', 'notifications'], 'readwrite');
            tx.objectStore('postHistory').put({ id: target.id, eventId: target.id, pubkeyHex: owner, kind: 1,
                content: target.content, tags: [], rawEvent: target, acceptedRelays: ['wss://accepted.example/'], relayHints: [],
                createdAt: 100, postedAt: 12345, media: [], updatedAt: 1, schemaVersion: 1 });
            tx.objectStore('notifications').put({ id: `${owner}:${incoming.id}`, ownerPubkeyHex: owner,
                eventId: incoming.id, event: incoming, relayUrls: ['wss://received.example/'], createdAt: 100, receivedAt: 456, unread: 0 });
            tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
        }); old.close();
        await Promise.all([upgradeEhagakiDatabase(indexedDB, { databaseName: db.name }), upgradeEhagakiDatabase(indexedDB, { databaseName: db.name })]);
        await db.open();
        expect(await db.events.count()).toBe(2);
        expect(await new DexiePostHistoryRepository(db).getByEventId(target.id)).toMatchObject({ rawEvent: target, postedAt: 12345, acceptedRelays: ['wss://accepted.example/'] });
        expect(await new NotificationRepository(db).list(owner)).toMatchObject([{ event: incoming, receivedAt: 456, unread: 0 }]);
        expect(await db.notifications.get(`${owner}:${incoming.id}`)).not.toHaveProperty('event');
        expect(await db.eventStoreMigration.get('shared-events-v19')).toMatchObject({ done: true });
    });

    it('rolls back a failed migration batch and resumes from the last committed checkpoint', async () => {
        const db = createDb(); await db.open();
        const incoming = Array.from({ length: 101 }, (_, index) => sign(`legacy ${index}`, [['p', owner]], 1, sender));
        await db.notifications.bulkPut(incoming.map(event => ({ id: `${owner}:${event.id}`, eventId: event.id,
            ownerPubkeyHex: owner, createdAt: 100, event, relayUrls: [], receivedAt: 456, unread: 0 })));
        await db.eventStoreMigration.put({ id: 'shared-events-v19', tableIndex: 4, lastKey: '', done: false });
        const originalPut = IDBObjectStore.prototype.put;
        const failure = vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, value, key) {
            if (this.name === 'eventStoreMigration' && value.done) throw new DOMException('simulated storage failure', 'QuotaExceededError');
            return key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
        });
        await expect(migrateEventStore(db.backendDB())).rejects.toMatchObject({ name: 'QuotaExceededError' });
        failure.mockRestore();
        expect(await db.events.count()).toBe(100);
        expect(await db.eventStoreMigration.get('shared-events-v19')).toMatchObject({ tableIndex: 4, done: false });
        await migrateEventStore(db.backendDB());
        expect(await db.events.count()).toBe(101);
        expect(await new NotificationRepository(db).list(owner, 150)).toHaveLength(101);
        expect(await new NotificationRepository(db).hasUnread(owner)).toBe(false);
        expect((await db.notifications.toArray()).every(row => !('event' in row))).toBe(true);
    });
});
