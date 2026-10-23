import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nip44, type Event, type EventTemplate } from 'nostr-tools';
import { finalizeEvent, getPublicKey } from 'nostr-tools/pure';
import { SimplePool } from 'nostr-tools/pool';
import { Nip46Service, NIP46_RETIRED_RUNTIME_TIMEOUT_MS } from '../../lib/nip46Service';
import {
    NIP46_BACKGROUND_RECOVERY_THRESHOLD_MS,
    registerNip46VisibilityHandler,
} from '../../lib/bootstrap/appInitializationBootstrap';

// Keep the installed BunkerSigner and its real request/subscription ownership.
// Only relay transport is replaced; responses use actual NIP-44 and signatures.
const clientKey = new Uint8Array(32).fill(1);
const remoteKey = new Uint8Array(32).fill(2);
const userKey = new Uint8Array(32).fill(3);
const userPubkey = getPublicKey(userKey);
const session = {
    clientSecretKeyHex: Array.from(clientKey, (byte) => byte.toString(16).padStart(2, '0')).join(''),
    remoteSignerPubkey: getPublicKey(remoteKey),
    relays: ['wss://relay.example.com'],
    userPubkey,
};

interface Transport {
    closed: boolean;
    destroyCount: number;
    subscriptions: { closed: boolean; deliver(event: Event): void }[];
}

interface Request {
    transport: Transport;
    id: string;
    clientPubkey: string;
    method: string;
    params: string[];
}

describe('NIP-46 recovery with in-flight signatures', () => {
    let service: Nip46Service;
    let transports: Transport[];
    let requests: Request[];
    let byPool: WeakMap<SimplePool, Transport>;
    let identityResponse: string;
    let holdNextIdentityResponse: boolean;

    function transportFor(pool: SimplePool): Transport {
        let transport = byPool.get(pool);
        if (!transport) {
            transport = { closed: false, destroyCount: 0, subscriptions: [] };
            byPool.set(pool, transport);
            transports.push(transport);
        }
        return transport;
    }

    function respond(request: Request, result?: string, error?: string): void {
        if (request.transport.closed) return;
        const conversationKey = nip44.v2.utils.getConversationKey(remoteKey, request.clientPubkey);
        const response = finalizeEvent({
            kind: 24133,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['p', request.clientPubkey]],
            content: nip44.v2.encrypt(JSON.stringify({ id: request.id, result, error }), conversationKey),
        }, remoteKey);
        for (const subscription of request.transport.subscriptions) {
            if (!subscription.closed) subscription.deliver(response);
        }
    }

    function signResponse(request: Request): void {
        const signed = finalizeEvent(JSON.parse(request.params[0]) as EventTemplate, userKey);
        respond(request, JSON.stringify(signed));
    }

    function signingRequests(): Request[] {
        return requests.filter((request) => request.method === 'sign_event');
    }

    function startSigning(kind = 1) {
        const signing = service.getSigner()!.signEvent({ kind, content: '', tags: [], created_at: 1 });
        // Allow cleanup to cancel the request even when an earlier assertion fails.
        void signing.catch(() => undefined);
        return signing;
    }

    async function resumeFromBackground(): Promise<boolean> {
        let listener: (() => void) | undefined;
        let now = 0;
        const document = {
            visibilityState: 'hidden',
            addEventListener: (_event: string, handler: () => void) => { listener = handler; },
            removeEventListener: () => { listener = undefined; },
        };
        const cleanup = registerNip46VisibilityHandler({
            document: document as never,
            authState: { value: { type: 'nip46' } },
            nip46Service: service,
            console: { error: vi.fn() },
            now: () => now,
        });
        listener!();
        now += NIP46_BACKGROUND_RECOVERY_THRESHOLD_MS;
        document.visibilityState = 'visible';
        listener!();
        cleanup();
        return await service.ensureConnection();
    }

    beforeEach(async () => {
        vi.useFakeTimers();
        transports = [];
        requests = [];
        identityResponse = userPubkey;
        holdNextIdentityResponse = false;
        byPool = new WeakMap();
        vi.spyOn(SimplePool.prototype, 'ensureRelay').mockImplementation(async function (this: SimplePool) {
            transportFor(this);
            return {} as Awaited<ReturnType<SimplePool['ensureRelay']>>;
        });
        vi.spyOn(SimplePool.prototype, 'subscribe').mockImplementation(function (this: SimplePool, _relays, _filter, params) {
            const subscription = {
                closed: false,
                deliver: (event: Event) => { params.onevent?.(event); },
            };
            transportFor(this).subscriptions.push(subscription);
            return { close: () => { subscription.closed = true; } };
        });
        vi.spyOn(SimplePool.prototype, 'publish').mockImplementation(function (this: SimplePool, _relays, event) {
            const conversationKey = nip44.v2.utils.getConversationKey(remoteKey, event.pubkey);
            const payload = JSON.parse(nip44.v2.decrypt(event.content, conversationKey));
            const request: Request = { ...payload, clientPubkey: event.pubkey, transport: transportFor(this) };
            requests.push(request);
            if (request.method === 'connect') respond(request, 'ack');
            if (request.method === 'get_public_key') {
                if (holdNextIdentityResponse) holdNextIdentityResponse = false;
                else respond(request, identityResponse);
            }
            return [Promise.resolve('')];
        });
        vi.spyOn(SimplePool.prototype, 'destroy').mockImplementation(function (this: SimplePool) {
            const transport = transportFor(this);
            transport.closed = true;
            transport.destroyCount += 1;
        });
        service = new Nip46Service();
        await service.reconnect(session);
    });

    afterEach(async () => {
        await service.disconnect();
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it.each([1, 27235, 24242])('kind %s: identity検証後も旧購読で署名応答を処理する', async (kind) => {
        const oldSigner = (await service.getSignerForSession(userPubkey))!;
        const signing = oldSigner.signEvent({ kind, content: '', tags: [], created_at: 1 });
        void signing.catch(() => undefined);
        expect(signingRequests()).toHaveLength(1);

        await expect(resumeFromBackground()).resolves.toBe(true);
        expect(service.getSigner()).not.toBe(oldSigner);
        expect(transports[0].closed).toBe(false);
        expect(transports[0].subscriptions[0].closed).toBe(false);

        const nextSigning = service.getSigner()!.signEvent({ kind, content: '', tags: [], created_at: 2 });
        signResponse(signingRequests()[1]);
        await expect(nextSigning).resolves.toMatchObject({ pubkey: userPubkey, kind, created_at: 2 });
        signResponse(signingRequests()[0]);
        await expect(signing).resolves.toMatchObject({ pubkey: userPubkey, kind, created_at: 1 });
        await vi.waitFor(() => expect(transports[0].destroyCount).toBe(1));
        expect(vi.getTimerCount()).toBe(0);
        expect(transports[1].closed).toBe(false);
        expect(signingRequests()).toHaveLength(2);
        expect(requests.some((request) => request.method === 'ping')).toBe(false);
    });

    it('署名前の公開鍵取得要求にも旧購読を残し、応答後に解放する', async () => {
        holdNextIdentityResponse = true;
        const publicKey = service.getSigner()!.getPublicKey();
        void publicKey.catch(() => undefined);
        const request = requests.at(-1)!;
        await expect(resumeFromBackground()).resolves.toBe(true);
        expect(transports[0].closed).toBe(false);

        respond(request, userPubkey);
        await expect(publicKey).resolves.toBe(userPubkey);
        await vi.waitFor(() => expect(transports[0].destroyCount).toBe(1));
        expect(vi.getTimerCount()).toBe(0);
    });

    it('複数要求の成功・拒否を処理し終わってから旧transportを一度だけ閉じる', async () => {
        const oldSigner = service.getSigner()!;
        const first = startSigning();
        const second = startSigning(24242);
        await expect(resumeFromBackground()).resolves.toBe(true);

        await expect(oldSigner.signEvent({ kind: 1, content: '' })).rejects.toThrow('connection was closed');
        expect(signingRequests()).toHaveLength(2);
        signResponse(signingRequests()[0]);
        await expect(first).resolves.toMatchObject({ pubkey: userPubkey });
        expect(transports[0].closed).toBe(false);

        const rejected = expect(second).rejects.toBe('permission denied');
        respond(signingRequests()[1], undefined, 'permission denied');
        await rejected;
        await vi.waitFor(() => expect(transports[0].destroyCount).toBe(1));
        await vi.advanceTimersByTimeAsync(NIP46_RETIRED_RUNTIME_TIMEOUT_MS);
        expect(transports[0].destroyCount).toBe(1);
        expect(transports[1].closed).toBe(false);
    });

    it('旧要求に応答がない場合は保持期限でrejectして解放し、新runtimeは維持する', async () => {
        const signing = startSigning();
        await resumeFromBackground();
        const rejected = expect(signing).rejects.toThrow('connection was closed');

        await vi.advanceTimersByTimeAsync(NIP46_RETIRED_RUNTIME_TIMEOUT_MS - 1);
        expect(transports[0].closed).toBe(false);
        await vi.advanceTimersByTimeAsync(1);
        await rejected;
        expect(transports[0].destroyCount).toBe(1);
        expect(transports[1].closed).toBe(false);

        signResponse(signingRequests()[0]);
        const nextSigning = startSigning();
        signResponse(signingRequests()[1]);
        await expect(nextSigning).resolves.toMatchObject({ pubkey: userPubkey });
    });

    it.each([1, 2])('%s回の復旧後のlogoutは全runtimeの待機要求とtimerを終了する', async (recoveryCount) => {
        const pending = [startSigning()];
        for (let index = 0; index < recoveryCount; index += 1) {
            await resumeFromBackground();
            pending.push(startSigning(27235));
        }
        const rejected = pending.map((signing) => expect(signing).rejects.toThrow('connection was closed'));

        await service.disconnect();
        await Promise.all(rejected);
        expect(service.getSigner()).toBeNull();
        const expectedCounts = Array.from({ length: recoveryCount + 1 }, () => 1);
        expect(transports.map((transport) => transport.destroyCount)).toEqual(expectedCounts);
        expect(vi.getTimerCount()).toBe(0);
        await vi.advanceTimersByTimeAsync(NIP46_RETIRED_RUNTIME_TIMEOUT_MS);
        expect(transports.map((transport) => transport.destroyCount)).toEqual(expectedCounts);
    });

    it('セッション切替で旧要求をrejectし、遅延応答・timerが新接続を壊さない', async () => {
        const signing = startSigning();
        await resumeFromBackground();
        const rejected = expect(signing).rejects.toThrow('connection was closed');
        await service.reconnect({ ...session, clientSecretKeyHex: '04'.repeat(32) });
        await rejected;

        signResponse(signingRequests()[0]);
        await vi.advanceTimersByTimeAsync(NIP46_RETIRED_RUNTIME_TIMEOUT_MS);
        expect(transports.map((transport) => transport.destroyCount)).toEqual([1, 1, 0]);
        const nextSigning = startSigning();
        signResponse(signingRequests()[1]);
        await expect(nextSigning).resolves.toMatchObject({ pubkey: userPubkey });
    });

    it('再構築失敗で旧runtimeを無効化するときも待機要求を明示的にrejectする', async () => {
        const signing = startSigning();
        const rejected = expect(signing).rejects.toThrow('connection was closed');
        identityResponse = getPublicKey(new Uint8Array(32).fill(4));
        await expect(resumeFromBackground()).resolves.toBe(false);
        await rejected;
        expect(service.getSigner()).toBeNull();
        expect(transports.map((transport) => transport.destroyCount)).toEqual([1, 1]);
        expect(signingRequests()).toHaveLength(1);
    });
});
