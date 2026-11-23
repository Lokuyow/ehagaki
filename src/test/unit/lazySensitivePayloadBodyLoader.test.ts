import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RxNostr } from 'rx-nostr';
import type { SensitiveBodyCacheStatus, SensitiveBodyLoader } from '../../lib/postContentPreview';
import type { NostrEvent } from '../../lib/types';

const reader = vi.hoisted(() => {
    const stopObserving = vi.fn();
    const realLoader = Object.assign(vi.fn(async () => 'body'), {
        observe: vi.fn((onChange: (status: SensitiveBodyCacheStatus) => void) => {
            onChange('available');
            return stopObserving;
        }),
        loadEmoji: vi.fn(async () => ({ ready: true, aspectRatio: 2 })),
    });
    return {
        imported: vi.fn(),
        stopObserving,
        realLoader,
        create: vi.fn((): SensitiveBodyLoader | undefined => realLoader),
    };
});
vi.mock('../../lib/sensitiveContentPayloadReader', () => {
    reader.imported();
    return { createSensitivePayloadBodyLoader: reader.create };
});

const { createLazySensitivePayloadBodyLoader } = await import('../../lib/lazySensitivePayloadBodyLoader');

const structure = (tags: string[][] = [['content-warning', ''], ['c', 'c'.repeat(64)]]): NostrEvent => ({
    id: 'a'.repeat(64), pubkey: 'b'.repeat(64), kind: 1, content: '', tags, created_at: 1, sig: 'd'.repeat(128),
});
const rxNostr = {} as RxNostr;

describe('createLazySensitivePayloadBodyLoader', () => {
    beforeEach(() => {
        reader.create.mockClear();
        reader.realLoader.mockClear();
        reader.realLoader.observe.mockClear();
        reader.realLoader.loadEmoji.mockClear();
        reader.stopObserving.mockClear();
    });

    it('returns no loader for events without a Sensitive payload reference, without importing the reader', () => {
        expect(createLazySensitivePayloadBodyLoader({ structure: null })).toBeUndefined();
        expect(createLazySensitivePayloadBodyLoader({ structure: structure([['content-warning', '']]) })).toBeUndefined();
        expect(reader.imported).not.toHaveBeenCalled();
        expect(reader.create).not.toHaveBeenCalled();
    });

    it('exposes the scope synchronously and delegates body, emoji and cache observation to the reader', async () => {
        const params = { structure: structure(), rxNostr, ownerPubkey: 'owner', relayHints: ['wss://relay.example/'] };
        const loader = createLazySensitivePayloadBodyLoader(params)!;
        expect(loader.scope).toEqual({ runtime: rxNostr, ownerPubkey: 'owner' });
        expect(reader.create).not.toHaveBeenCalled();

        const signal = new AbortController().signal;
        await expect(loader(signal)).resolves.toBe('body');
        expect(reader.realLoader).toHaveBeenCalledWith(signal);
        await expect(loader.loadEmoji!('https://emoji.example/a.png')).resolves.toEqual({ ready: true, aspectRatio: 2 });

        const onChange = vi.fn();
        const stop = loader.observe!(onChange);
        await vi.waitFor(() => expect(onChange).toHaveBeenCalledWith('available'));
        stop();
        expect(reader.stopObserving).toHaveBeenCalledTimes(1);
        // One reader loader per lazy loader, created with the caller's parameters.
        expect(reader.create).toHaveBeenCalledTimes(1);
        expect(reader.create).toHaveBeenCalledWith(params);
    });

    it('does not start observing after the subscription was released before the reader resolved', async () => {
        const loader = createLazySensitivePayloadBodyLoader({ structure: structure() })!;
        loader.observe!(vi.fn())();
        await loader();
        expect(reader.realLoader.observe).not.toHaveBeenCalled();
    });

    it('resolves a missing reader loader to no body', async () => {
        reader.create.mockReturnValueOnce(undefined);
        const loader = createLazySensitivePayloadBodyLoader({ structure: structure() })!;
        await expect(loader()).resolves.toBeNull();
    });
});
