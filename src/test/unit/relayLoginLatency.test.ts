import { afterEach, describe, expect, it, vi } from 'vitest';
import { RelayManager } from '../../lib/relayManager';
import { FALLBACK_RELAYS } from '../../lib/relayLists';
import { createMockConsole, createMockRxNostr, MockStorage } from '../helpers';

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

function setup() {
    vi.useFakeTimers();
    const observers: Array<{ next(packet: unknown): void; complete(): void }> = [];
    const unsubscribe = [vi.fn(), vi.fn()];
    const runtime = createMockRxNostr();
    vi.mocked(runtime.use).mockImplementation(() => ({
        subscribe: (observer: typeof observers[number]) => {
            const index = observers.push(observer) - 1;
            return { unsubscribe: unsubscribe[index] };
        },
    }) as never);
    const manager = new RelayManager(runtime, { localStorage: new MockStorage(), console: createMockConsole() });
    vi.spyOn(manager.getStorage(), 'save').mockResolvedValue();
    vi.spyOn(manager.getStorage(), 'get').mockResolvedValue(null);
    const preferred = () => observers[0].next({ event: { kind: 10002, pubkey: 'owner', tags: [['r', 'wss://preferred.example']] } });
    const legacy = () => observers[1].next({ event: { kind: 3, pubkey: 'owner', content: JSON.stringify({ 'wss://legacy.example': { read: true, write: true } }) } });
    return { manager, runtime, observers, unsubscribe, preferred, legacy };
}

describe('login relay discovery latency', () => {
    it('starts both requests together and reaches fallback in one three-second deadline', async () => {
        const { manager, runtime, observers, unsubscribe } = setup();
        let settled = false;
        const pending = manager.fetchUserRelays('owner', { forceRemote: true }).then(result => { settled = true; return result; });
        expect(observers).toHaveLength(2);
        await vi.advanceTimersByTimeAsync(2999);
        expect(settled).toBe(false);
        await vi.advanceTimersByTimeAsync(1);
        await expect(pending).resolves.toMatchObject({ source: 'fallback', relayConfig: FALLBACK_RELAYS });
        expect(runtime.setDefaultRelays).toHaveBeenCalledOnce();
        unsubscribe.forEach(stop => expect(stop).toHaveBeenCalledOnce());
        expect(vi.getTimerCount()).toBe(0);
    });

    it('retains an early kind 3 result while waiting for the preferred kind 10002', async () => {
        const { manager, runtime, legacy, preferred } = setup();
        const pending = manager.fetchUserRelays('owner', { forceRemote: true });
        legacy();
        await vi.advanceTimersByTimeAsync(100);
        expect(runtime.setDefaultRelays).not.toHaveBeenCalled();
        preferred();
        await expect(pending).resolves.toMatchObject({ source: 'kind10002', relayConfig: { 'wss://preferred.example/': { read: true, write: true } } });
        expect(manager.getStorage().save).toHaveBeenCalledOnce();
        expect(vi.getTimerCount()).toBe(0);
    });

    it('uses the already received kind 3 result as soon as kind 10002 times out', async () => {
        const { manager, legacy } = setup();
        const pending = manager.fetchUserRelays('owner', { forceRemote: true });
        legacy();
        await vi.advanceTimersByTimeAsync(3000);
        await expect(pending).resolves.toMatchObject({ source: 'kind3' });
        expect(vi.getTimerCount()).toBe(0);
    });

    it('cancels the unused legacy subscription immediately on kind 10002 success', async () => {
        const { manager, preferred, unsubscribe } = setup();
        const pending = manager.fetchUserRelays('owner', { forceRemote: true });
        preferred();
        await pending;
        unsubscribe.forEach(stop => expect(stop).toHaveBeenCalledOnce());
        expect(vi.getTimerCount()).toBe(0);
    });

    it('cancels both subscriptions without saving fallback or applying late events', async () => {
        const { manager, runtime, preferred, legacy, unsubscribe } = setup();
        const abort = new AbortController();
        const pending = manager.fetchUserRelays('owner', { forceRemote: true, signal: abort.signal });
        const rejected = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
        abort.abort();
        await rejected;
        preferred();
        legacy();
        expect(runtime.setDefaultRelays).not.toHaveBeenCalled();
        expect(manager.getStorage().save).not.toHaveBeenCalled();
        unsubscribe.forEach(stop => expect(stop).toHaveBeenCalledOnce());
        expect(vi.getTimerCount()).toBe(0);
    });

    it('uses cached relay settings without starting discovery', async () => {
        const { manager, observers } = setup();
        vi.mocked(manager.getStorage().get).mockResolvedValue(['wss://saved.example']);
        await expect(manager.fetchUserRelays('owner')).resolves.toMatchObject({ source: 'localStorage' });
        expect(observers).toHaveLength(0);
    });
});
