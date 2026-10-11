import { afterEach, describe, expect, it, vi } from 'vitest';
import { finalizeEvent, generateSecretKey, getPublicKey, nip19, type EventTemplate } from 'nostr-tools';
import { buildReactionEvent, REACTION_TARGET_KINDS } from '../../lib/postReactionUtils';
import { PostReactionService } from '../../lib/postReactionService';
import { parseReactionReference } from '../../lib/reactionReference';
import { createPlainNostrEventSnapshot } from '../../lib/postHistoryEventUtils';
import { EHagakiDB } from '../../lib/storage/ehagakiDb';
import { DexiePostHistoryChildInteractionsRepository } from '../../lib/storage/postHistoryChildInteractionsRepository';
import { createDeferred } from '../deferredTestUtils';
import { MockKeyManager } from '../helpers';
import type { AuthState } from '../../lib/types';

const key = generateSecretKey();
const owner = getPublicKey(key);
const relay = 'wss://author.example/';
const target = (kind = 1) => createPlainNostrEventSnapshot(finalizeEvent({ kind, content: 'target',
    created_at: 100, tags: [['e', 'f'.repeat(64), '', 'root'], ['p', 'a'.repeat(64)], ['t', 'no-copy']] }, generateSecretKey()));
const auth = (type: AuthState['type'] = 'nip07'): AuthState => ({ type, isAuthenticated: true, pubkey: owner,
    npub: '', nprofile: '', isValid: true, isInitialized: true });
const dbs: EHagakiDB[] = [];
afterEach(async () => { await Promise.all(dbs.splice(0).map(db => db.delete())); });

describe('Reaction wire event', () => {
    it.each(REACTION_TARGET_KINDS)('uses main kind %s identity and sanitized hints on both e/p', kind => {
        const event = target(kind);
        const template = buildReactionEvent(event, owner, { type: 'text', text: '+' }, ['javascript:bad', relay], 200, ['client', 'eHagaki']);
        expect(template.tags).toEqual([['e', event.id, relay, event.pubkey], ['p', event.pubkey, relay], ['k', String(kind)], ['client', 'eHagaki']]);
        expect(parseReactionReference(template).reference).toMatchObject({ eventId: event.id, authorHint: event.pubkey, targetKindHint: kind });
    });
    it.each(['+', '-', 'A', 'あ', '👍🏽', '👨‍👩‍👧‍👦', 'e\u0301'])('preserves one grapheme %s without inferred emoji tags', text => {
        const event = target(); const result = buildReactionEvent(event, owner, { type: 'text', text }, [], 200);
        expect(result.content).toBe(text);
        expect(result.tags).toEqual([['e', event.id, '', event.pubkey], ['p', event.pubkey], ['k', '1']]);
    });
    it.each(['', ' ', '\n', 'AB', '👍👍', ':blob:'])('rejects invalid raw text %j', text => {
        expect(() => buildReactionEvent(target(), owner, { type: 'text', text }, [], 200)).toThrow('invalid_reaction_value');
    });
    it('constructs exactly one structured custom emoji tag with a valid set address', () => {
        const setAddress = `30030:${owner}:my-set`;
        const result = buildReactionEvent(target(), owner, { type: 'customEmoji', emoji: { shortcode: 'blob', src: 'https://emoji.example/blob.png', setAddress } }, [], 200);
        expect(result.content).toBe(':blob:');
        expect(result.tags.slice(3)).toEqual([['emoji', 'blob', 'https://emoji.example/blob.png', setAddress]]);
        const invalidSet = buildReactionEvent(target(), owner, { type: 'customEmoji', emoji: { shortcode: 'blob', src: 'https://emoji.example/blob.png', setAddress: '30030:invalid:bad' } }, [], 200);
        expect(invalidSet.tags[3]).toHaveLength(3);
    });
    it.each([{ shortcode: 'a b', src: 'https://emoji.example/x.png' }, { shortcode: '日本語', src: 'https://emoji.example/x.png' },
        { shortcode: 'a', src: 'javascript:bad' }])('rejects malformed custom emoji %j', emoji => {
        expect(() => buildReactionEvent(target(), owner, { type: 'customEmoji', emoji }, [], 200)).toThrow();
    });
    it('fully verifies targets and rejects unsupported kinds', () => {
        for (const event of [target(40), { ...target(), content: 'tampered' }, { ...target(), sig: '0'.repeat(128) }]) {
            expect(() => buildReactionEvent(event, owner, { type: 'text', text: '+' }, [], 200)).toThrow('invalid_reaction_target');
        }
    });
});

function fixture(type: AuthState['type'] = 'nip07', overrides: ConstructorParameters<typeof PostReactionService>[0] = {}) {
    const authStateStore = { value: auth(type) };
    const signEvent = vi.fn(async (template: EventTemplate) => finalizeEvent(template, key));
    const saveCache = vi.fn(async () => undefined);
    const publisher = { captureAuthorWriteRelays: vi.fn(() => [relay]), publishSignedEvent: vi.fn(async () => ({ success: true, acceptedRelays: [relay] })) };
    const service = new PostReactionService({ authStateStore, getNip07Signer: () => ({ signEvent }),
        getNip46Signer: async () => ({ signEvent }), getParentClientSigner: () => ({ signEvent }),
        keyManager: new MockKeyManager('fixture', null, true), seckeySignerFn: () => ({ signEvent }),
        getClientTag: () => null, saveCache, ...overrides });
    const event = target();
    const params = { target: event, relayHints: [relay], value: { type: 'text' as const, text: '+' }, publisher, isCurrent: () => true };
    return { service, params, signEvent, saveCache, publisher, authStateStore, event };
}

describe('Reaction signer and post-publish persistence boundary', () => {
    it('uses the installed local secret-key signer for kind 7', async () => {
        const f = fixture('nsec', { keyManager: new MockKeyManager(nip19.nsecEncode(key)), seckeySignerFn: undefined });
        expect(await f.service.react(f.params)).toMatchObject({ success: true, cacheSaved: true, event: { kind: 7, pubkey: owner } });
    });
    it('a detached local save does not block the next target or release its publishing lock', async () => {
        const saveWait = createDeferred<void>(); const signing = createDeferred<void>(); const f = fixture();
        f.saveCache.mockImplementationOnce(async () => { await saveWait.promise; });
        const first = f.service.react(f.params);
        await vi.waitFor(() => expect(f.saveCache).toHaveBeenCalledOnce());
        f.signEvent.mockImplementationOnce(async template => { await signing.promise; return finalizeEvent(template, key); });
        const second = f.service.react({ ...f.params, target: target(7) });
        expect(f.signEvent).toHaveBeenCalledTimes(2);
        saveWait.resolve(); expect((await first).cacheSaved).toBe(true);
        expect(await f.service.react(f.params)).toMatchObject({ success: false, error: 'reaction_busy' });
        signing.resolve(); expect((await second).success).toBe(true);
    });
    it.each(['nip07', 'nip46', 'parentClient', 'nsec'] as const)('uses %s and saves only child interactions', async type => {
        const db = new EHagakiDB(`reaction-${crypto.randomUUID()}`); dbs.push(db);
        const repo = new DexiePostHistoryChildInteractionsRepository(db);
        const f = fixture(type, { saveCache: input => repo.upsertChildInteractions(input) });
        const result = await f.service.react(f.params);
        expect(result).toMatchObject({ success: true, cacheSaved: true, targetEventId: f.event.id });
        expect(f.signEvent).toHaveBeenCalledOnce();
        expect((await repo.getReactionInteractions(f.event.id)).map(row => row.eventId)).toEqual([result.eventId]);
        expect(await db.postHistory.count()).toBe(0);
    });
    it.each(['content', 'tags', 'signature', 'hash'])('rejects signed result %s alteration before publish', async mutation => {
        const f = fixture();
        f.signEvent.mockImplementation(async template => {
            const event = finalizeEvent(mutation === 'content' ? { ...template, content: '-' }
                : mutation === 'tags' ? { ...template, tags: [] } : template, key);
            return mutation === 'signature' ? { ...event, sig: '0'.repeat(128) }
                : mutation === 'hash' ? { ...event, id: 'a'.repeat(64) } : event;
        });
        expect((await f.service.react(f.params)).success).toBe(false);
        expect(f.publisher.publishSignedEvent).not.toHaveBeenCalled();
        expect(f.saveCache).not.toHaveBeenCalled();
    });
    it('rejects duplicate submit and cancels a stale signer result before publish', async () => {
        const wait = createDeferred<void>(); const f = fixture(); let active = true;
        f.signEvent.mockImplementation(async template => { await wait.promise; return finalizeEvent(template, key); });
        const pending = f.service.react({ ...f.params, isCurrent: () => active });
        expect(await f.service.react(f.params)).toMatchObject({ success: false, error: 'reaction_busy' });
        active = false; wait.resolve();
        expect(await pending).toMatchObject({ success: false, error: 'reaction_stale' });
        expect(f.publisher.publishSignedEvent).not.toHaveBeenCalled();
    });
    it.each(['target', 'account', 'editor'])('saves immutable old identity after ACK and %s change', async change => {
        const entered = createDeferred<void>(); const release = createDeferred<void>();
        const db = new EHagakiDB(`reaction-stale-${crypto.randomUUID()}`); dbs.push(db);
        const repo = new DexiePostHistoryChildInteractionsRepository(db);
        const save = vi.fn(async (input: Parameters<typeof repo.upsertChildInteractions>[0]) => {
            entered.resolve(); await release.promise; return repo.upsertChildInteractions(input);
        });
        const f = fixture('nip07', { saveCache: save }); let active = true;
        const pending = f.service.react({ ...f.params, isCurrent: () => active });
        await entered.promise;
        active = false;
        if (change === 'account') f.authStateStore.value = { ...auth(), pubkey: target().pubkey };
        // A new target cannot redirect the input that has already crossed the ACK boundary.
        const next = target(16); f.params.target = next;
        release.resolve(); const result = await pending;
        expect(result).toMatchObject({ success: true, cacheSaved: true, targetEventId: f.event.id });
        const saved = await repo.getReactionInteractions(f.event.id);
        expect(saved.map(row => row.eventId)).toEqual([result.eventId]);
        expect(await repo.getReactionInteractions(next.id)).toEqual([]);
        expect(save.mock.calls[0][0].reactionTarget).toEqual({ eventId: f.event.id, targetAuthorPubkey: f.event.pubkey, targetKind: 1 });
    });
    it('retries a failed stale local save with the same event, never signing or publishing again', async () => {
        const f = fixture(); let active = true;
        f.saveCache.mockImplementationOnce(async () => { active = false; throw new Error('quota'); });
        const result = await f.service.react({ ...f.params, isCurrent: () => active });
        expect(result).toMatchObject({ success: true, cacheSaved: false });
        expect(f.service.getFailedSave(owner, f.event.id)).toBe(result);
        expect(await f.service.retrySave(result)).toBe(true);
        expect(f.saveCache.mock.calls[1]).toEqual(f.saveCache.mock.calls[0]);
        expect(f.signEvent).toHaveBeenCalledOnce(); expect(f.publisher.publishSignedEvent).toHaveBeenCalledOnce();
        expect(f.service.getFailedSave(owner)).toBeNull();
    });
});
