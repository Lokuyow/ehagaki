import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createRxNostr } from 'rx-nostr';
import { finalizeEvent, generateSecretKey, getPublicKey, matchFilter, verifyEvent, type Filter } from 'nostr-tools';
import { PostHistoryInboundInteractionsRealtimeService } from '../../lib/postHistoryInboundInteractionsRealtimeService';
import { NotificationRepository } from '../../lib/storage/notificationRepository';
import { EHagakiDB } from '../../lib/storage/ehagakiDb';

// Real rx-nostr serializes REQ/CLOSE and dispatches signed packets through this relay.
class WireSocket {
    static instances: WireSocket[] = [];
    static sent: unknown[][] = [];
    readyState = 0;
    subscriptions = new Map<string, Filter[]>();
    private listeners = new Map<string, Set<(event: any) => void>>();
    constructor(readonly url: string) {
        WireSocket.instances.push(this);
        queueMicrotask(() => { this.readyState = 1; this.emit('open', {}); });
    }
    addEventListener(type: string, listener: (event: any) => void) { const set = this.listeners.get(type) ?? new Set(); set.add(listener); this.listeners.set(type, set); }
    removeEventListener(type: string, listener: (event: any) => void) { this.listeners.get(type)?.delete(listener); }
    emit(type: string, event: any) { for (const fn of this.listeners.get(type) ?? []) fn(event); }
    receive(message: unknown[]) { this.emit('message', { data: JSON.stringify(message) }); }
    send(data: string) {
        const message = JSON.parse(data); WireSocket.sent.push(message);
        if (message[0] === 'REQ') {
            this.subscriptions.set(message[1], message.slice(2));
            this.receive(['EOSE', message[1]]);
        } else if (message[0] === 'CLOSE') this.subscriptions.delete(message[1]);
    }
    deliver(event: ReturnType<typeof finalizeEvent>) {
        for (const [id, filters] of this.subscriptions) if (filters.some(filter => matchFilter(filter, event))) this.receive(['EVENT', id, event]);
    }
    close() { this.readyState = 3; this.emit('close', { code: 1000, reason: '' }); }
    disconnect() { this.readyState = 3; this.emit('close', { code: 1006, reason: '' }); }
}
const relay = 'wss://wire.example/';
const owner = getPublicKey(generateSecretKey()), key = generateSecretKey();
const sign = (kind = 1, content = 'incoming', tags = [['p', owner]]) => finalizeEvent({ kind, content, tags, created_at: Math.floor(Date.now() / 1000) }, key);
let db: EHagakiDB, repository: NotificationRepository, rx: ReturnType<typeof createRxNostr>;
let leases: Array<{ stop(): void; waitForIdle(): Promise<void> }>;
beforeEach(() => {
    WireSocket.instances = []; WireSocket.sent = []; leases = [];
    db = new EHagakiDB(`notification-wire-${crypto.randomUUID()}`); repository = new NotificationRepository(db);
    rx = createRxNostr({ websocketCtor: WireSocket as never, verifier: async event => verifyEvent(event as never), skipVerify: false,
        skipFetchNip11: true, retry: { strategy: 'immediately', maxCount: 2 } });
});
afterEach(async () => { leases.forEach(lease => lease.stop()); rx.dispose(); await db.delete(); });
function subscribe(includeNotifications = true, isActive = () => true, generation = async () => 0) {
    const service = new PostHistoryInboundInteractionsRealtimeService({ notificationRepository: repository,
        postHistoryRepository: { getExistingEventIdsForPubkey: async () => [], getByEventId: async () => null }, getChildWriteGeneration: generation });
    const lease = service.subscribe(rx, { ownerPubkeyHex: owner, includeNotifications, isActive, relayConfig: { [relay]: { read: true, write: false } } });
    leases.push(lease); return lease;
}
it.each([true, false])('sends both filters in one live REQ and retains them after EOSE (notifications=%s)', async enabled => {
    subscribe(enabled);
    await vi.waitFor(() => expect(WireSocket.sent.filter(message => message[0] === 'REQ')).toHaveLength(1));
    const req = WireSocket.sent.find(message => message[0] === 'REQ')!;
    expect(req.slice(2)).toEqual([
        { kinds: enabled ? [1, 6, 7, 16, 42, 1111] : [1, 42, 1111, 7], '#p': [owner], since: expect.any(Number) },
        { kinds: [1111], '#P': [owner], since: expect.any(Number) },
    ]);
    expect(WireSocket.sent.filter(message => message[0] === 'CLOSE')).toHaveLength(0);
    const socket = WireSocket.instances[0];
    expect(socket.subscriptions.has(req[1] as string)).toBe(true);
    socket.deliver(sign(6)); socket.deliver(sign(1));
    if (enabled) await vi.waitFor(async () => expect(await repository.list(owner)).toHaveLength(2));
    else { await leases[0].waitForIdle(); expect(await repository.list(owner)).toEqual([]); }
});
it('recovers the same subscription after reconnect, deduplicates delivery and stops on unsubscribe', async () => {
    const lease = subscribe();
    await vi.waitFor(() => expect(WireSocket.instances[0]?.subscriptions.size).toBe(1));
    const event = sign(7);
    WireSocket.instances[0].deliver(event);
    await vi.waitFor(async () => expect(await repository.list(owner)).toHaveLength(1));
    await repository.markRead(owner, [event.id]);
    const id = [...WireSocket.instances[0].subscriptions.keys()][0];
    WireSocket.instances[0].disconnect();
    await vi.waitFor(() => expect(WireSocket.instances[1]?.subscriptions.has(id)).toBe(true));
    WireSocket.instances[1].deliver(event);
    WireSocket.instances[1].deliver(sign(1, 'after reconnect'));
    await vi.waitFor(async () => expect(await repository.list(owner)).toHaveLength(2));
    expect((await repository.list(owner)).find(item => item.eventId === event.id)?.unread).toBe(0);
    lease.stop();
    await vi.waitFor(() => expect(WireSocket.sent.some(message => message[0] === 'CLOSE' && message[1] === id)).toBe(true));
    expect(WireSocket.instances[1].subscriptions.size).toBe(0);
});
it('discards signed packets queued before account, relay or feature ownership changed', async () => {
    let active = true, release!: () => void;
    const gate = new Promise<number>(resolve => release = () => resolve(0));
    const generation = vi.fn(() => gate);
    const lease = subscribe(true, () => active, generation);
    await vi.waitFor(() => expect(WireSocket.instances[0]?.subscriptions.size).toBe(1));
    WireSocket.instances[0].deliver(sign());
    await vi.waitFor(() => expect(generation).toHaveBeenCalled());
    active = false; release(); await lease.waitForIdle();
    expect(await repository.list(owner)).toEqual([]);
});
