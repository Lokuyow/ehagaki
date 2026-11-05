import { expect, it, vi } from 'vitest';
import { createRxNostr } from 'rx-nostr';
import { finalizeEvent, generateSecretKey, getPublicKey, matchFilter, verifyEvent, type Filter } from 'nostr-tools';
import { PostHistoryInboundInteractionsSyncService } from '../../lib/postHistoryInboundInteractionsSyncService';

const relay = 'wss://backfill.example/';

it('pages every #p notification using actual rx-nostr subIds when a sparse #P request overlaps on the same relay', async () => {
    const owner = getPublicKey(generateSecretKey()), key = generateSecretKey();
    const events = [300, 200, 100, 10].map((created_at, index) => finalizeEvent({ kind: index === 3 ? 1111 : 1,
        content: `backfill fixture ${index}`, tags: [['p', owner], ...(index === 3 ? [['P', owner]] : [])], created_at }, key));
    class WireSocket {
        readyState = 0;
        private listeners = new Map<string, Set<(event: any) => void>>();
        constructor() { queueMicrotask(() => { this.readyState = 1; this.emit('open', {}); }); }
        addEventListener(type: string, listener: (event: any) => void) {
            const set = this.listeners.get(type) ?? new Set(); set.add(listener); this.listeners.set(type, set);
        }
        removeEventListener(type: string, listener: (event: any) => void) { this.listeners.get(type)?.delete(listener); }
        emit(type: string, event: any) { for (const listener of this.listeners.get(type) ?? []) listener(event); }
        receive(message: unknown[]) { this.emit('message', { data: JSON.stringify(message) }); }
        send(data: string) {
            const message = JSON.parse(data);
            if (message[0] !== 'REQ') return;
            const [, subId, ...filters] = message as ['REQ', string, ...Filter[]];
            queueMicrotask(() => {
                const matches = new Map<string, typeof events[number]>();
                for (const filter of filters) for (const event of events.filter(event => matchFilter(filter, event)).slice(0, filter.limit)) {
                    matches.set(event.id, event);
                }
                for (const event of matches.values()) this.receive(['EVENT', subId, event]);
                this.receive(['EOSE', subId]);
            });
        }
        close() { this.readyState = 3; this.emit('close', { code: 1000, reason: '' }); }
    }
    const rx = createRxNostr({ websocketCtor: WireSocket as never, verifier: async event => verifyEvent(event as never),
        skipVerify: false, skipFetchNip11: true });
    const received = new Set<string>();
    const service = new PostHistoryInboundInteractionsSyncService({
        postHistoryRepository: { getExistingEventIdsForPubkey: async () => [], getByEventId: async () => null },
        postHistoryChildInteractionsRepository: { upsertChildInteractions: vi.fn() },
        syncStateRepository: { get: async () => null, save: vi.fn() }, getChildWriteGeneration: async () => 0,
        notificationRepository: { upsert: async (_owner, records) => { records.forEach(({ event }) => received.add(event.id)); } },
    });
    const boundaries: number[] = [];
    let until = 500;
    try {
        for (let page = 0; page < 5; page++) {
            const result = await service.syncRecent(rx, { ownerPubkeyHex: owner, includeNotifications: true,
                relayConfig: { [relay]: { read: true, write: false } }, reason: 'notification-older', since: 0, until, limit: 2 }).promise;
            expect(result.status).toBe('success');
            boundaries.push(result.oldestSeenCreatedAt!);
            if (!result.saturated) break;
            until = result.oldestSeenCreatedAt!;
        }
        expect(boundaries).toEqual([200, 100, 10, 10]);
        expect(received).toEqual(new Set(events.map(event => event.id)));
    } finally { rx.dispose(); }
});
