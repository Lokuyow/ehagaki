import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { RxNostr } from 'rx-nostr';
import type { PostHistoryInboundInteractionsRealtimeSubscribeRequest } from '../../lib/postHistoryInboundInteractionsRealtimeService';
import Harness from './fixtures/NotificationRealtimeOwnershipHarness.svelte';
const mocks = vi.hoisted(() => ({ subscribe: vi.fn() }));
vi.mock('../../lib/postHistoryInboundInteractionsRealtimeService', () => ({
    postHistoryInboundInteractionsRealtimeService: { subscribe: mocks.subscribe },
}));
const owner = 'a'.repeat(64), runtime = { use() {} } as unknown as RxNostr;
const relays = { 'wss://before.example/': { read: true, write: false } };
let stops: Array<ReturnType<typeof vi.fn>>;
beforeEach(() => {
    stops = [];
    mocks.subscribe.mockReset().mockImplementation(() => {
        const stop = vi.fn(); stops.push(stop); return { stop, waitForIdle: async () => {} };
    });
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
});
afterEach(() => { cleanup(); Reflect.deleteProperty(document, 'visibilityState'); });
const request = (index: number) => mocks.subscribe.mock.calls[index][1] as PostHistoryInboundInteractionsRealtimeSubscribeRequest;
it.each(['account', 'runtime', 'relays', 'notifications', 'logout'] as const)('invalidates old packets when %s changes and retains the history subscription when appropriate', async change => {
    const props = { owner, runtime, relays, enabled: true, authenticated: true };
    const view = render(Harness, props);
    expect(mocks.subscribe).toHaveBeenCalledTimes(1);
    const old = request(0);
    expect(old.isActive!()).toBe(true);
    const next = { ...props, ...(change === 'account' ? { owner: 'b'.repeat(64) }
        : change === 'runtime' ? { runtime: { use() {} } as unknown as RxNostr }
        : change === 'relays' ? { relays: { 'wss://after.example/': { read: true, write: false } } }
        : change === 'notifications' ? { enabled: false } : { authenticated: false }) };
    await view.rerender(next);
    expect(old.isActive!()).toBe(false);
    expect(stops[0]).toHaveBeenCalledTimes(1);
    expect(mocks.subscribe).toHaveBeenCalledTimes(change === 'logout' ? 1 : 2);
    if (change !== 'logout') {
        expect(request(1).isActive!()).toBe(true);
        expect(request(1).includeNotifications).toBe(change !== 'notifications');
        expect(request(1).ownerPubkeyHex).toBe(next.owner);
    }
});
it('stops on hiding and shares one fresh subscription on return', async () => {
    render(Harness, { owner, runtime, relays });
    const old = request(0);
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange')); await tick();
    expect(old.isActive!()).toBe(false);
    expect(stops[0]).toHaveBeenCalledTimes(1);
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange')); await tick();
    expect(mocks.subscribe).toHaveBeenCalledTimes(2);
    expect(request(1).isActive!()).toBe(true);
});
