import { afterEach, describe, expect, it, vi } from 'vitest';
import { Observable } from 'rxjs';
import type { RxNostr } from 'rx-nostr';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';
import { PostManager } from '../../lib/postManager';
import { PostReactionService } from '../../lib/postReactionService';
import { NIP46_REQUESTED_PERMISSIONS } from '../../lib/nip46Service';
import { createDeferred } from '../deferredTestUtils';
import type { AuthState, NostrEvent } from '../../lib/types';

const author = 'wss://author.example/'; const recipient = 'wss://recipient.example/'; const hint = 'wss://hint.example/';
afterEach(() => vi.useRealTimers());
describe('Reaction reuses PostManager NIP-65 delivery', () => {
    it('requests kind 7 permission from NIP-46', () => { expect(NIP46_REQUESTED_PERMISSIONS).toContain('sign_event:7'); });
    it.each(['found', 'empty', 'not-found', 'timeout', 'reject', 'outsider'] as const)('routes and classifies %s', async route => {
        if (route === 'timeout') vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
        const key = generateSecretKey();
        const authStateStore = { value: { type: 'nip07', isAuthenticated: true, pubkey: getPublicKey(key) } as AuthState };
        let defaults = [author]; const writes = { value: [] as string[] };
        const sent: { event: NostrEvent; relays: string[] }[] = [];
        const rx = { getDefaultRelays: () => Object.fromEntries(defaults.map(url => [url, { url, write: true, read: true }])),
            send: (event: NostrEvent, options: { on?: { relays?: string[] } }) => new Observable(observer => {
                const relays = options.on?.relays ?? []; sent.push({ event, relays });
                queueMicrotask(() => {
                    for (const relay of relays) observer.next({ eventId: event.id, from: route === 'outsider' ? hint : relay,
                        ok: route !== 'reject', done: true, notice: '' });
                    observer.complete();
                });
            }),
        } as unknown as RxNostr;
        const lookup = vi.fn(async () => {
            if (route === 'not-found') throw new Error('not found');
            if (route === 'timeout') return new Promise<{ readRelays: string[] }>(() => {});
            return { readRelays: route === 'found' ? [recipient] : [] };
        });
        const manager = new PostManager(rx, { authStateStore, writeRelaysStore: writes, nip65ReadRelayLookupFn: lookup });
        const signStarted = createDeferred<void>(); const releaseSign = createDeferred<void>();
        const service = new PostReactionService({ authStateStore, getClientTag: () => null,
            getNip07Signer: () => ({ signEvent: async template => { signStarted.resolve(); await releaseSign.promise; return finalizeEvent(template, key); } }),
            saveCache: async () => undefined });
        const target = finalizeEvent({ kind: 16, content: '{}', created_at: 100, tags: [] }, generateSecretKey());
        const pending = service.react({ target, relayHints: [hint], value: { type: 'text', text: '+' }, publisher: manager, isCurrent: () => true });
        await signStarted.promise;
        defaults = ['wss://changed.example/']; writes.value.push('wss://new-store.example/'); releaseSign.resolve();
        if (route === 'timeout') { await vi.waitFor(() => expect(lookup).toHaveBeenCalledOnce()); await vi.advanceTimersByTimeAsync(4_000); }
        const first = await pending;
        const result = first.deliverySettled ? await first.deliverySettled : first;
        expect(new Set(sent.flatMap(entry => entry.relays))).toEqual(new Set(route === 'found' ? [author, recipient] : [author]));
        expect(lookup).toHaveBeenCalledWith(target.pubkey, expect.objectContaining({ discoveryRelays: [hint], resolveOnReadRoute: true }));
        expect(result.success).toBe(route !== 'reject' && route !== 'outsider');
        if (result.success) expect(result.fullyDelivered).toBe(route === 'found');
        expect(sent.every(entry => entry.event.kind === 7)).toBe(true);
        manager.cancelActiveNip65Operations();
    });
});
