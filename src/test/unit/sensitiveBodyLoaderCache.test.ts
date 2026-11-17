import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RxNostr } from 'rx-nostr';
import type { NostrEvent, RelayConfig } from '../../lib/types';

const create = vi.hoisted(() => vi.fn((params: { structure: NostrEvent | null | undefined }) =>
    params?.structure?.content === '' ? Object.assign(() => Promise.resolve('body'), { params }) : undefined));
vi.mock('../../lib/sensitiveContentPayloadReader', () => ({ createSensitivePayloadBodyLoader: create }));

const { createSensitiveBodyLoaderCache } = await import('../../lib/sensitiveBodyLoaderCache');

const event = (content = ''): NostrEvent => ({ id: crypto.randomUUID(), pubkey: 'a'.repeat(64), kind: 1, content,
    tags: [['content-warning', '']], created_at: 1, sig: 'b'.repeat(128) });
const rxNostr = {} as RxNostr;
const relayConfig = {} as RelayConfig;

describe('createSensitiveBodyLoaderCache', () => {
    beforeEach(() => create.mockClear());

    it('hands out one loader per event until its account, runtime, relay config or hints change', () => {
        const cache = createSensitiveBodyLoaderCache();
        const structure = event();
        const context = { ownerPubkey: 'owner', rxNostr, relayConfig };
        const loader = cache.get(structure, context, ['wss://one.example/']);
        expect(loader).toBeTypeOf('function');
        expect(cache.get(structure, { ...context }, ['wss://one.example/'])).toBe(loader);
        expect(create).toHaveBeenCalledTimes(1);

        expect(cache.get(structure, context, ['wss://two.example/'])).not.toBe(loader);
        expect(cache.get(structure, { ...context, ownerPubkey: 'other' }, ['wss://two.example/'])).not.toBe(loader);
        expect(cache.get(structure, { ...context, ownerPubkey: 'other', relayConfig: {} as RelayConfig }, ['wss://two.example/'])).not.toBe(loader);
        expect(create).toHaveBeenCalledTimes(4);
    });

    it('remembers events without a Sensitive payload and starts over after clear', () => {
        const cache = createSensitiveBodyLoaderCache();
        const plain = event('visible'), structure = event();
        expect(cache.get(plain, {})).toBeUndefined();
        expect(cache.get(plain, {})).toBeUndefined();
        expect(cache.get(null, {})).toBeUndefined();
        const loader = cache.get(structure, {});
        expect(create).toHaveBeenCalledTimes(2);
        cache.clear();
        expect(cache.get(structure, {})).not.toBe(loader);
        expect(create).toHaveBeenCalledTimes(3);
    });

    it('omits relay hints when none are given, as list callers did before sharing the cache', () => {
        createSensitiveBodyLoaderCache().get(event(), { ownerPubkey: 'owner' });
        expect(create.mock.calls[0]?.[0]).not.toHaveProperty('relayHints');
    });
});
