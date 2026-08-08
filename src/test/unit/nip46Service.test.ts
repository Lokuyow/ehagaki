import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    Nip46SignerAdapter,
    Nip46Service,
    NIP46_INITIAL_READINESS_ATTEMPT_TIMEOUT_MS,
    NIP46_INITIAL_RELAY_COLLECTION_WINDOW_MS,
    NIP46_INITIAL_READINESS_RETRY_INTERVAL_MS,
    NIP46_INITIAL_READINESS_RETRY_WINDOW_MS,
    NIP46_REQUESTED_PERMISSIONS,
    NIP46_REQUESTED_PERMS,
    normalizeSupportedNip46FinalRelay,
    sanitizeNip46NostrConnectRelays,
} from '../../lib/nip46Service';
import { DECOMMISSIONED_RELAYS } from '../../lib/relayLists';
import { createDeferred } from '../deferredTestUtils';
import { MockStorage } from '../helpers';
import { expectConsoleCallsNotToContain } from '../logAssertions';

const TEST_USER_PUBKEY = 'b'.repeat(64);
const TEST_RECONNECT_PUBKEY = 'c'.repeat(64);
const TEST_NEW_USER_PUBKEY = 'e'.repeat(64);

describe('NIP46_REQUESTED_PERMISSIONS', () => {
    it('NIP-42 AUTHイベントの署名許可を要求する', () => {
        expect(NIP46_REQUESTED_PERMISSIONS).toContain('sign_event:22242');
        expect(NIP46_REQUESTED_PERMS).toContain('sign_event:22242');
    });
});

describe('sanitizeNip46NostrConnectRelays', () => {
    it('サービス終了 relay を Nostr Connect 候補から除外する', () => {
        expect(sanitizeNip46NostrConnectRelays([
            DECOMMISSIONED_RELAYS[0],
            'wss://relay.example.com',
        ])).toEqual(['wss://relay.example.com']);
    });
});

vi.mock('nostr-tools', () => ({
    kinds: {
        NostrConnect: 24133,
    },
    nip44: {
        getConversationKey: vi.fn(() => new Uint8Array([1, 2, 3])),
        decrypt: vi.fn(),
    },
    utils: {
        normalizeURL: vi.fn((url: string) => url),
    },
}));

// nostr-tools/nip46 をモック
vi.mock('nostr-tools/nip46', () => ({
    BunkerSigner: {
        fromBunker: vi.fn(),
    },
    parseBunkerInput: vi.fn(),
    createNostrConnectURI: vi.fn((params: {
        clientPubkey: string;
        relays: string[];
        secret: string;
        name?: string;
    }) => {
        const query = new URLSearchParams();
        for (const relay of params.relays) {
            query.append('relay', relay);
        }
        query.set('secret', params.secret);
        if (params.name) {
            query.set('name', params.name);
        }
        return `nostrconnect://${params.clientPubkey}?${query.toString()}`;
    }),
    BUNKER_REGEX: /^bunker:\/\/[0-9a-f]{64}\??[?\/\w:.=&%-]*$/,
}));

// nostr-tools/pool をモック
const mockPool = {
    ensureRelay: vi.fn().mockResolvedValue({}),
    subscribe: vi.fn(),
    destroy: vi.fn(),
};
vi.mock('nostr-tools/pool', () => ({
    SimplePool: vi.fn(function () {
        return mockPool;
    }),
    useWebSocketImplementation: vi.fn(),
}));

// nostr-tools/utils をモック
vi.mock('nostr-tools/utils', () => ({
    bytesToHex: vi.fn((bytes: Uint8Array) => Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')),
    hexToBytes: vi.fn((hex: string) => new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))),
}));

// nostr-tools/pure をモック
vi.mock('nostr-tools/pure', () => ({
    generateSecretKey: vi.fn(() => new Uint8Array(32).fill(0xab)),
    getPublicKey: vi.fn(() => 'c'.repeat(64)),
}));

// --- Nip46SignerAdapter テスト ---
describe('Nip46SignerAdapter', () => {
    let mockBunkerSigner: any;
    let adapter: Nip46SignerAdapter;

    beforeEach(() => {
        mockBunkerSigner = {
            signEvent: vi.fn().mockResolvedValue({
                id: 'signed-event-id',
                sig: 'signature',
                kind: 1,
                tags: [],
                pubkey: 'user-pubkey',
                content: 'hello',
                created_at: 1000,
            }),
            getPublicKey: vi.fn().mockResolvedValue('user-pubkey'),
        };
        adapter = new Nip46SignerAdapter(mockBunkerSigner);
    });

    it('signEvent: EventParametersをEventTemplateに変換してBunkerSignerに委譲', async () => {
        const params = {
            kind: 1 as const,
            content: 'hello',
            tags: [['t', 'test']],
            created_at: 1000,
            pubkey: 'user-pubkey',
        };

        const result = await adapter.signEvent(params);

        expect(mockBunkerSigner.signEvent).toHaveBeenCalledWith({
            kind: 1,
            content: 'hello',
            tags: [['t', 'test']],
            created_at: 1000,
            pubkey: 'user-pubkey',
        });
        expect(result.id).toBe('signed-event-id');
    });

    it('signEvent: tagsとcreated_atが未指定の場合デフォルト値を使用', async () => {
        const params = {
            kind: 1 as const,
            content: 'hello',
        };

        await adapter.signEvent(params);

        const call = mockBunkerSigner.signEvent.mock.calls[0][0];
        expect(call.tags).toEqual([]);
        expect(typeof call.created_at).toBe('number');
    });

    it('getPublicKey: BunkerSignerに委譲', async () => {
        const pubkey = await adapter.getPublicKey();

        expect(pubkey).toBe('user-pubkey');
        expect(mockBunkerSigner.getPublicKey).toHaveBeenCalled();
    });

    it('signEvent失敗時は元のErrorをthrowするが、Errorの詳細やイベント内容をログへ渡さない', async () => {
        const eventSecret = 'event-content-secret';
        const errorSecret = 'signer-error-secret';
        const cause = new Error(`${errorSecret}: cause`);
        Object.defineProperty(cause, 'customPayload', {
            value: eventSecret,
            enumerable: true,
        });
        const error = new Error(errorSecret);
        error.stack = `stack:${errorSecret}`;
        error.cause = cause;
        Object.defineProperty(error, 'customPayload', {
            value: { nested: eventSecret },
            enumerable: true,
        });
        (error as { cycle?: unknown }).cycle = error;
        mockBunkerSigner.signEvent.mockRejectedValueOnce(error);
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        try {
            await expect(adapter.signEvent({
                kind: 1,
                content: eventSecret,
                tags: [['p', eventSecret]],
                pubkey: eventSecret,
            })).rejects.toBe(error);
            expectConsoleCallsNotToContain([errorSpy], [
                eventSecret,
                errorSecret,
                `stack:${errorSecret}`,
            ]);
        } finally {
            errorSpy.mockRestore();
        }
    });
});

describe('normalizeSupportedNip46FinalRelay', () => {
    it.each([
        ['wss://relay.example.com/', 'wss://relay.example.com/'],
        ['ws://127.0.0.1:4869/', 'ws://127.0.0.1:4869/'],
        ['ws://localhost:4869/', 'ws://localhost:4869/'],
        ['ws://subdomain.localhost:4869/', 'ws://subdomain.localhost:4869/'],
        ['ws://[::1]:4869/', 'ws://[::1]:4869/'],
    ])('supports %s as a final relay candidate', (relay, expected) => {
        expect(normalizeSupportedNip46FinalRelay(relay)).toBe(expected);
    });

    it('supports IPv4-mapped IPv6 loopback as a final relay candidate', () => {
        expect(
            normalizeSupportedNip46FinalRelay(
                'ws://[::ffff:127.0.0.1]:4869/',
            ),
        ).not.toBeNull();
    });

    it.each([
        'ws://127.0.0.256:4869/',
        'ws://192.168.1.10:4869/',
        'ws://10.0.0.2:4869/',
        'ws://relay.example.com/',
        'https://relay.example.com/',
        'ws://user:pass@127.0.0.1:4869/',
        'not a relay',
    ])('rejects %s as an unsupported final relay candidate', (relay) => {
        expect(normalizeSupportedNip46FinalRelay(relay)).toBeNull();
    });

    it('終了済み relay を final relay candidate として拒否する', () => {
        expect(normalizeSupportedNip46FinalRelay(DECOMMISSIONED_RELAYS[0])).toBeNull();
    });
});

// --- Nip46Service テスト ---
describe('Nip46Service', () => {
    let service: Nip46Service;
    let mockStorage: MockStorage;

    function getNostrConnectUriRelays(uri: string): string[] {
        return new URL(uri).searchParams.getAll('relay');
    }

    function getNostrConnectUriName(uri: string): string | null {
        return new URL(uri).searchParams.get('name');
    }

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    beforeEach(async () => {
        service = new Nip46Service();
        mockStorage = new MockStorage();
        mockPool.ensureRelay.mockReset().mockResolvedValue({});
        mockPool.subscribe.mockReset();
        mockPool.destroy.mockReset();

        const { nip44 } = await import('nostr-tools');
        vi.mocked(nip44.decrypt).mockReset();

        const { SimplePool } = await import('nostr-tools/pool');
        (SimplePool as any).mockReset().mockImplementation(function () {
            return mockPool;
        });

        const { BunkerSigner, parseBunkerInput, createNostrConnectURI } = await import('nostr-tools/nip46');
        (BunkerSigner.fromBunker as any).mockReset();
        (parseBunkerInput as any).mockReset();
        (createNostrConnectURI as any).mockClear();
    });

    async function getPendingNostrConnectHandlers() {
        await Promise.resolve();
        await Promise.resolve();
        return mockPool.subscribe.mock.calls[0][2];
    }

    async function connectService(options: {
        remoteSignerPubkey?: string;
        relays?: string[];
        secret?: string | null;
        userPubkey?: string;
        signerOverrides?: Record<string, unknown>;
    } = {}) {
        const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');
        const mockBp = {
            pubkey: options.remoteSignerPubkey ?? 'a'.repeat(64),
            relays: options.relays ?? ['wss://relay.example.com'],
            secret: options.secret ?? null,
        };
        (parseBunkerInput as any).mockResolvedValue(mockBp);

        const userPubkey = options.userPubkey ?? TEST_USER_PUBKEY;
        const mockSigner = {
            sendRequest: vi.fn().mockImplementation((method: string) =>
                Promise.resolve(method === 'get_public_key' ? userPubkey : 'ack'),
            ),
            getPublicKey: vi.fn().mockResolvedValue(userPubkey),
            bp: mockBp,
            close: vi.fn().mockResolvedValue(undefined),
            ...options.signerOverrides,
        };
        (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

        const pubkey = await service.connect(`bunker://${mockBp.pubkey}`);
        return { mockBp, mockSigner, pubkey, BunkerSigner };
    }

    async function reconnectService(options: {
        clientSecretKeyHex?: string;
        remoteSignerPubkey?: string;
        relays?: string[];
        userPubkey?: string;
        pingVerified?: boolean;
        relayResolution?: 'signer-negotiated' | 'signer-confirmed-unchanged' | 'client-initial-fallback' | 'client-initial-unconfirmed';
        signerOverrides?: Record<string, unknown>;
    } = {}) {
        const { BunkerSigner } = await import('nostr-tools/nip46');
        const sessionData = {
            clientSecretKeyHex: options.clientSecretKeyHex ?? 'ab'.repeat(32),
            remoteSignerPubkey: options.remoteSignerPubkey ?? 'd'.repeat(64),
            relays: options.relays ?? ['wss://relay.test.com'],
            userPubkey: options.userPubkey ?? TEST_RECONNECT_PUBKEY,
            pingVerified: options.pingVerified ?? false,
            ...(options.relayResolution
                ? { relayResolution: options.relayResolution }
                : {}),
        };

        const mockSigner = {
            sendRequest: vi.fn().mockImplementation((method: string) =>
                Promise.resolve(method === 'get_public_key' ? sessionData.userPubkey : 'ack'),
            ),
            getPublicKey: vi.fn().mockResolvedValue(sessionData.userPubkey),
            bp: {
                pubkey: sessionData.remoteSignerPubkey,
                relays: sessionData.relays,
                secret: null,
            },
            close: vi.fn().mockResolvedValue(undefined),
            ...options.signerOverrides,
        };
        (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

        const pubkey = await service.reconnect(sessionData);
        return { sessionData, mockSigner, pubkey, BunkerSigner };
    }

    function createMockNostrConnectSigner(options: {
        remoteSignerPubkey?: string;
        relays?: string[];
        sharedSecret?: string;
        sendRequestResult?: string;
        sendRequestError?: unknown;
        sendRequestPromise?: Promise<string>;
        getPublicKeyResult?: string;
        getPublicKeyError?: unknown;
        getPublicKeyPromise?: Promise<string>;
    } = {}) {
        const getPublicKey = options.getPublicKeyPromise
            ? vi.fn().mockReturnValue(options.getPublicKeyPromise)
            : options.getPublicKeyError !== undefined
                ? vi.fn().mockRejectedValue(options.getPublicKeyError)
                : vi.fn().mockResolvedValue(
                    options.getPublicKeyResult ?? TEST_USER_PUBKEY,
                );

        const sendRequest = vi.fn().mockImplementation((method: string) => {
            if (method === 'get_public_key') {
                return getPublicKey();
            }

            if (options.sendRequestPromise) {
                return options.sendRequestPromise;
            }
            if (options.sendRequestError !== undefined) {
                return Promise.reject(options.sendRequestError);
            }
            return Promise.resolve(
                options.sendRequestResult
                ?? JSON.stringify(options.relays ?? ['wss://relay.example.com']),
            );
        });

        return {
            sendRequest,
            getPublicKey,
            bp: {
                pubkey: options.remoteSignerPubkey ?? 'd'.repeat(64),
                relays: options.relays ?? ['wss://relay.example.com'],
                secret: options.sharedSecret ?? 'ab'.repeat(32),
            },
            close: vi.fn().mockResolvedValue(undefined),
        };
    }

    async function createPendingFallbackNostrConnect(options: {
        initialRelays?: string[];
        remoteSignerPubkey?: string;
        sendRequestResult?: string;
        sendRequestError?: unknown;
        sendRequestPromise?: Promise<string>;
        userPubkey?: string;
        interimGetPublicKeyResult?: string;
        interimGetPublicKeyError?: unknown;
        interimGetPublicKeyPromise?: Promise<string>;
        fallbackGetPublicKeyResult?: string;
        fallbackGetPublicKeyError?: unknown;
        fallbackGetPublicKeyPromise?: Promise<string>;
    } = {}) {
        const initialRelays = options.initialRelays ?? ['wss://relay.example.com'];
        const remoteSignerPubkey = options.remoteSignerPubkey ?? 'd'.repeat(64);
        const sharedSecret = 'ab'.repeat(32);
        const { nip44 } = await import('nostr-tools');
        const { BunkerSigner } = await import('nostr-tools/nip46');

        vi.mocked(nip44.decrypt).mockReturnValue(
            JSON.stringify({ result: sharedSecret }),
        );

        const closeSubscription = vi.fn();
        mockPool.subscribe.mockReturnValue({
            close: closeSubscription,
        });

        const sendRequest = options.sendRequestPromise
            ? vi.fn().mockReturnValue(options.sendRequestPromise)
            : options.sendRequestError !== undefined
                ? vi.fn().mockRejectedValue(options.sendRequestError)
                : vi.fn().mockResolvedValue(
                    options.sendRequestResult ?? JSON.stringify(initialRelays),
                );

        const fallbackGetPublicKey = options.fallbackGetPublicKeyPromise
            ? vi.fn().mockReturnValue(options.fallbackGetPublicKeyPromise)
            : options.fallbackGetPublicKeyError !== undefined
                ? vi.fn().mockRejectedValue(options.fallbackGetPublicKeyError)
                : vi.fn().mockResolvedValue(
                    options.fallbackGetPublicKeyResult
                    ?? options.userPubkey
                    ?? TEST_USER_PUBKEY,
                );

        const interimGetPublicKey = options.interimGetPublicKeyPromise
            ? vi.fn().mockReturnValue(options.interimGetPublicKeyPromise)
            : options.interimGetPublicKeyError !== undefined
                ? vi.fn().mockRejectedValue(options.interimGetPublicKeyError)
                : vi.fn().mockResolvedValue(
                    options.interimGetPublicKeyResult
                    ?? options.userPubkey
                    ?? TEST_USER_PUBKEY,
                );

        const interimSigner = createMockNostrConnectSigner({
            remoteSignerPubkey,
            relays: initialRelays,
            sharedSecret,
            sendRequestPromise: options.sendRequestPromise,
            sendRequestError: options.sendRequestError,
            sendRequestResult: options.sendRequestResult,
            getPublicKeyPromise: options.interimGetPublicKeyPromise,
            getPublicKeyError: options.interimGetPublicKeyError,
            getPublicKeyResult:
                options.interimGetPublicKeyResult
                ?? options.userPubkey
                ?? TEST_USER_PUBKEY,
        });
        const fallbackSigner = createMockNostrConnectSigner({
            remoteSignerPubkey,
            relays: initialRelays,
            sharedSecret,
            sendRequestResult: JSON.stringify(initialRelays),
            getPublicKeyPromise: options.fallbackGetPublicKeyPromise,
            getPublicKeyError: options.fallbackGetPublicKeyError,
            getPublicKeyResult:
                options.fallbackGetPublicKeyResult
                ?? options.userPubkey
                ?? TEST_USER_PUBKEY,
        });
        (BunkerSigner.fromBunker as any)
            .mockReturnValueOnce(interimSigner)
            .mockReturnValue(fallbackSigner);

        const pending = await service.startNostrConnect(initialRelays);
        const handlers = await getPendingNostrConnectHandlers();

        return {
            pending,
            handlers,
            interimSigner,
            fallbackSigner,
            closeSubscription,
            initialRelays,
            remoteSignerPubkey,
        };
    }

    async function createPendingNegotiatedFinalRelayNostrConnect(options: {
        initialRelays?: string[];
        finalRelayResponse?: unknown[];
        remoteSignerPubkey?: string;
        userPubkey?: string;
        finalSignerRelays?: string[];
        finalGetPublicKeyResult?: string;
        finalGetPublicKeyError?: unknown;
        finalGetPublicKeyPromise?: Promise<string>;
        finalSignerMocks?: ReturnType<typeof createMockNostrConnectSigner>[];
    } = {}) {
        const initialRelays = options.initialRelays ?? ['wss://relay.initial.example.com'];
        const finalRelayResponse = options.finalRelayResponse ?? [
            'wss://relay.final.example.com',
        ];
        const remoteSignerPubkey = options.remoteSignerPubkey ?? 'd'.repeat(64);
        const sharedSecret = 'ab'.repeat(32);
        const userPubkey = options.userPubkey ?? TEST_USER_PUBKEY;
        const { nip44 } = await import('nostr-tools');
        const { BunkerSigner } = await import('nostr-tools/nip46');

        vi.mocked(nip44.decrypt).mockReturnValue(
            JSON.stringify({ result: sharedSecret }),
        );

        const closeSubscription = vi.fn();
        mockPool.subscribe.mockReturnValue({
            close: closeSubscription,
        });

        const interimSigner = createMockNostrConnectSigner({
            remoteSignerPubkey,
            relays: initialRelays,
            sharedSecret,
            sendRequestResult: JSON.stringify(finalRelayResponse),
            getPublicKeyResult: userPubkey,
        });
        const finalSigner = createMockNostrConnectSigner({
            remoteSignerPubkey,
            relays: options.finalSignerRelays ?? ['wss://relay.final.example.com'],
            sharedSecret,
            getPublicKeyPromise: options.finalGetPublicKeyPromise,
            getPublicKeyError: options.finalGetPublicKeyError,
            getPublicKeyResult: options.finalGetPublicKeyResult ?? userPubkey,
        });
        const finalSigners = options.finalSignerMocks ?? [finalSigner];
        const fromBunkerMock = (BunkerSigner.fromBunker as any)
            .mockReturnValueOnce(interimSigner);
        for (const signer of finalSigners) {
            fromBunkerMock.mockReturnValueOnce(signer);
        }
        fromBunkerMock.mockReturnValue(finalSigners[finalSigners.length - 1]);

        const pending = await service.startNostrConnect(initialRelays);
        const handlers = await getPendingNostrConnectHandlers();

        return {
            pending,
            handlers,
            interimSigner,
            finalSigner,
            finalSigners,
            closeSubscription,
            initialRelays,
            remoteSignerPubkey,
            userPubkey,
        };
    }

    describe('connect', () => {
        it('有効なbunker URLで接続成功', async () => {
            const { mockBp, mockSigner } = await connectService({ secret: 'test-secret' });
            const pubkey = service.getUserPubkey();

            expect(pubkey).toBe(TEST_USER_PUBKEY);
            expect(service.isConnected()).toBe(true);
            expect(service.getUserPubkey()).toBe(TEST_USER_PUBKEY);
            expect(service.getSigner()).not.toBeNull();
            expect(mockSigner.sendRequest).toHaveBeenCalledWith(
                'connect',
                [mockBp.pubkey, 'test-secret', NIP46_REQUESTED_PERMS]
            );
        });

        it('無効なbunker URLでエラー', async () => {
            const { parseBunkerInput } = await import('nostr-tools/nip46');
            (parseBunkerInput as any).mockResolvedValue(null);

            await expect(service.connect('invalid-url')).rejects.toThrow('Invalid bunker URL');
        });

        it('connect()がタイムアウトした場合エラー', async () => {
            const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');

            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: ['wss://relay.example.com'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            const mockSigner = {
                sendRequest: vi.fn().mockImplementation(() => new Promise(() => { /* never resolves */ })),
                getPublicKey: vi.fn(),
                bp: mockBp,
                close: vi.fn(),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            await expect(service.connect(`bunker://${'a'.repeat(64)}`, 100)).rejects.toThrow('Bunker did not respond');
            expect(service.isConnected()).toBe(false);
        });

        it('リレー接続失敗時にRelay connection failedエラー', async () => {
            const { parseBunkerInput } = await import('nostr-tools/nip46');

            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: ['wss://unreachable.relay.example.com'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            mockPool.ensureRelay.mockRejectedValue(new Error('connection timed out'));

            await expect(service.connect(`bunker://${'a'.repeat(64)}`)).rejects.toThrow('Relay connection failed');
            expect(mockPool.destroy).toHaveBeenCalled();
        });

        it('loopback ws relay失敗時にローカル relay 向けヒントを含める', async () => {
            const { parseBunkerInput } = await import('nostr-tools/nip46');

            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: ['ws://127.0.0.1:4869/'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            mockPool.ensureRelay.mockRejectedValue(new Error('connection failed'));

            await expect(service.connect(`bunker://${'a'.repeat(64)}`)).rejects.toThrow(
                '127.0.0.1/localhost points to the browser device itself',
            );
        });

        it('iframe内でloopback ws relayが失敗した場合に埋め込み権限ヒントを含める', async () => {
            const { parseBunkerInput } = await import('nostr-tools/nip46');

            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: ['ws://127.0.0.1:4869/'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            const mockPolicy = {
                allowedFeatures: vi.fn(() => ['loopback-network']),
                allowsFeature: vi.fn(() => false),
            };
            const mockDocument = {
                permissionsPolicy: mockPolicy,
            };

            vi.stubGlobal('document', mockDocument as any);
            vi.stubGlobal('window', {
                self: {},
                top: {},
                document: mockDocument,
            } as any);

            mockPool.ensureRelay.mockRejectedValue(new Error('connection failed'));

            await expect(service.connect(`bunker://${'a'.repeat(64)}`)).rejects.toThrow(
                'allow="local-network-access; local-network; loopback-network"',
            );
        });

        it('一部のrelayが失敗しても到達可能relayで接続を継続する', async () => {
            const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');

            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: [
                    'wss://blocked.relay.example.com',
                    'wss://relay.example.com',
                ],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            mockPool.ensureRelay
                .mockRejectedValueOnce(new Error('connection failed'))
                .mockResolvedValueOnce({});

            const mockSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(method === 'get_public_key' ? TEST_USER_PUBKEY : 'ack'),
                ),
                getPublicKey: vi.fn().mockResolvedValue(TEST_USER_PUBKEY),
                bp: {
                    pubkey: mockBp.pubkey,
                    relays: ['wss://relay.example.com'],
                    secret: null,
                },
                close: vi.fn(),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            const pubkey = await service.connect(`bunker://${'a'.repeat(64)}`);

            expect(pubkey).toBe(TEST_USER_PUBKEY);
            expect(BunkerSigner.fromBunker).toHaveBeenCalledWith(
                expect.any(Uint8Array),
                {
                    pubkey: mockBp.pubkey,
                    relays: ['wss://relay.example.com'],
                    secret: null,
                },
                expect.objectContaining({
                    pool: mockPool,
                }),
            );
            expect(mockPool.destroy).not.toHaveBeenCalled();
        });

        it('対話的な初回接続ではget_public_key permission拒否時だけ検証済みsign_eventをfallbackに使う', async () => {
            const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');
            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: ['wss://relay.example.com'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);
            const candidate = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    method === 'connect'
                        ? Promise.resolve('ack')
                        : Promise.reject(new Error('permission denied')),
                ),
                signEvent: vi.fn().mockResolvedValue({ pubkey: TEST_USER_PUBKEY }),
                getPublicKey: vi.fn(),
                bp: mockBp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(candidate);

            await expect(service.connect(`bunker://${mockBp.pubkey}`)).resolves.toBe(
                TEST_USER_PUBKEY,
            );
            expect(candidate.sendRequest).toHaveBeenCalledWith('get_public_key', []);
            expect(candidate.signEvent).toHaveBeenCalledOnce();
            expect(service.getUserPubkey()).toBe(TEST_USER_PUBKEY);
        });

        it('get_public_keyとsign_eventが拒否された初回接続はremote signer pubkeyへfallbackしない', async () => {
            const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');
            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: ['wss://relay.example.com'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);
            const candidate = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    method === 'connect'
                        ? Promise.resolve('ack')
                        : Promise.reject(new Error('permission denied')),
                ),
                signEvent: vi.fn().mockRejectedValue(new Error('permission denied')),
                getPublicKey: vi.fn(),
                bp: mockBp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(candidate);

            await expect(service.connect(`bunker://${mockBp.pubkey}`)).rejects.toThrow(
                'permission denied',
            );
            expect(candidate.close).toHaveBeenCalledOnce();
            expect(service.getUserPubkey()).toBeNull();
            expect(service.getSigner()).toBeNull();
        });

        it('relaysが空の場合エラー', async () => {
            const { parseBunkerInput } = await import('nostr-tools/nip46');

            (parseBunkerInput as any).mockResolvedValue({
                pubkey: 'a'.repeat(64),
                relays: [],
                secret: null,
            });

            await expect(service.connect(`bunker://${'a'.repeat(64)}`)).rejects.toThrow('No relays specified');
        });

        it('終了済み relay だけの bunker input は接続試行せず直ちに失敗する', async () => {
            const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');
            (parseBunkerInput as any).mockResolvedValue({
                pubkey: 'a'.repeat(64),
                relays: [DECOMMISSIONED_RELAYS[0]],
                secret: null,
            });

            await expect(service.connect(`bunker://${'a'.repeat(64)}`)).rejects.toThrow(
                'Relay connection failed: no reachable relays',
            );
            expect(mockPool.ensureRelay).not.toHaveBeenCalled();
            expect(BunkerSigner.fromBunker).not.toHaveBeenCalled();
        });
    });

    describe('startNostrConnect', () => {
        it('ready は relay subscription 設定後に解決する', async () => {
            const relayConnection = createDeferred<{}>();
            mockPool.ensureRelay.mockReset().mockImplementation(() => relayConnection.promise);

            const pending = await service.startNostrConnect([
                'wss://relay.example.com',
            ]);
            let readyResolved = false;
            void pending.ready.then(() => {
                readyResolved = true;
            });

            await Promise.resolve();
            await Promise.resolve();

            expect(readyResolved).toBe(false);
            expect(mockPool.subscribe).not.toHaveBeenCalled();

            relayConnection.resolve({});

            await pending.ready;

            expect(readyResolved).toBe(true);
            expect(mockPool.subscribe).toHaveBeenCalledTimes(1);
        });

        it('最初の NIP-46 EVENT 受信で handshakeStarted が解決する', async () => {
            const sendRequestDeferred = createDeferred<string>();
            const pendingFlow = await createPendingFallbackNostrConnect({
                sendRequestPromise: sendRequestDeferred.promise,
            });
            let handshakeStartedResolved = false;
            void pendingFlow.pending.handshakeStarted.then(() => {
                handshakeStartedResolved = true;
            });

            const oneventPromise = pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await Promise.resolve();

            expect(handshakeStartedResolved).toBe(true);

            sendRequestDeferred.resolve(JSON.stringify(pendingFlow.initialRelays));
            await oneventPromise;

            await expect(pendingFlow.pending.handshakeStarted).resolves.toBeUndefined();
            await expect(pendingFlow.pending.completion).resolves.toBe(TEST_USER_PUBKEY);
        });

        it('handshakeのイベント本文・応答payload・pubkey・Error詳細をログへ渡さない', async () => {
            const frameSecret = 'handshake-frame-secret';
            const payloadSecret = 'handshake-payload-secret';
            const error = new Error(payloadSecret);
            error.stack = `stack:${payloadSecret}`;
            error.cause = { frameSecret };
            (error as { cycle?: unknown }).cycle = error;
            const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => { });
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            const pendingFlow = await createPendingFallbackNostrConnect();
            const { nip44 } = await import('nostr-tools');
            vi.mocked(nip44.decrypt).mockImplementation(() => {
                throw error;
            });

            try {
                await pendingFlow.handlers.onevent({
                    content: frameSecret,
                    pubkey: pendingFlow.remoteSignerPubkey,
                });
                await pendingFlow.pending.cancel();
                expectConsoleCallsNotToContain([debugSpy, warnSpy], [
                    frameSecret,
                    payloadSecret,
                    `stack:${payloadSecret}`,
                ]);
            } finally {
                debugSpy.mockRestore();
                warnSpy.mockRestore();
            }
        });

        it('最初の ready 後 1500ms の収集猶予時間内に ready になった initial relay だけを URI に含める', async () => {
            vi.useFakeTimers();

            mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                if (relay === 'wss://relay.fast.example.com') {
                    return new Promise((resolve) => {
                        setTimeout(() => resolve({}), 100);
                    });
                }

                if (relay === 'wss://relay.within-window.example.com') {
                    return new Promise((resolve) => {
                        setTimeout(() => resolve({}), 1200);
                    });
                }

                if (relay === 'wss://relay.failed.example.com') {
                    return Promise.reject(new Error('connection timed out'));
                }

                return new Promise((resolve) => {
                    setTimeout(() => resolve({}), 1700);
                });
            });

            const pending = await service.startNostrConnect([
                'wss://relay.fast.example.com',
                'wss://relay.within-window.example.com',
                'wss://relay.late.example.com',
                'wss://relay.failed.example.com',
            ]);
            let readyResolved = false;
            void pending.ready.then(() => {
                readyResolved = true;
            });

            await vi.advanceTimersByTimeAsync(100);
            expect(readyResolved).toBe(false);
            expect(mockPool.subscribe).not.toHaveBeenCalled();

            await vi.advanceTimersByTimeAsync(
                NIP46_INITIAL_RELAY_COLLECTION_WINDOW_MS - 1,
            );
            expect(readyResolved).toBe(false);
            expect(mockPool.subscribe).not.toHaveBeenCalled();

            await vi.advanceTimersByTimeAsync(1);
            await pending.ready;

            expect(mockPool.subscribe).toHaveBeenCalledWith(
                [
                    'wss://relay.fast.example.com',
                    'wss://relay.within-window.example.com',
                ],
                expect.any(Object),
                expect.any(Object),
            );
            expect(getNostrConnectUriRelays(pending.connectionUri)).toEqual([
                'wss://relay.fast.example.com',
                'wss://relay.within-window.example.com',
            ]);
            expect(getNostrConnectUriName(pending.connectionUri)).toBe('eHagaki');
        });

        it('全 candidate が収集猶予時間前に settle した場合は 1500ms を待たずに ready になる', async () => {
            vi.useFakeTimers();

            mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                if (relay === 'wss://relay.fast.example.com') {
                    return new Promise((resolve) => {
                        setTimeout(() => resolve({}), 100);
                    });
                }

                if (relay === 'wss://relay.second.example.com') {
                    return new Promise((resolve) => {
                        setTimeout(() => resolve({}), 300);
                    });
                }

                return new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('connection timed out')), 250);
                });
            });

            const pending = await service.startNostrConnect([
                'wss://relay.fast.example.com',
                'wss://relay.second.example.com',
                'wss://relay.failed.example.com',
            ]);
            let readyResolved = false;
            void pending.ready.then(() => {
                readyResolved = true;
            });

            await vi.advanceTimersByTimeAsync(100);
            expect(readyResolved).toBe(false);

            await vi.advanceTimersByTimeAsync(200);
            await pending.ready;

            expect(readyResolved).toBe(true);
            expect(mockPool.subscribe).toHaveBeenCalledWith(
                [
                    'wss://relay.fast.example.com',
                    'wss://relay.second.example.com',
                ],
                expect.any(Object),
                expect.any(Object),
            );
            expect(getNostrConnectUriRelays(pending.connectionUri)).toEqual([
                'wss://relay.fast.example.com',
                'wss://relay.second.example.com',
            ]);
        });

        it('複数 initial relay のうち 1 件だけ ready でも、全 candidate を待たずに猶予時間後に ready になる', async () => {
            vi.useFakeTimers();

            const slowRelayConnection = createDeferred<{}>();
            let slowRelaySettled = false;

            mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                if (relay === 'wss://relay.ready.example.com') {
                    return Promise.resolve({});
                }

                if (relay === 'wss://relay.failed.example.com') {
                    return Promise.reject(new Error('connection timed out'));
                }

                return slowRelayConnection.promise.finally(() => {
                    slowRelaySettled = true;
                });
            });

            const pending = await service.startNostrConnect([
                'wss://relay.slow.example.com',
                'wss://relay.ready.example.com',
                'wss://relay.failed.example.com',
            ]);
            let readyResolved = false;
            void pending.ready.then(() => {
                readyResolved = true;
            });

            await Promise.resolve();
            await Promise.resolve();

            expect(readyResolved).toBe(false);

            await vi.advanceTimersByTimeAsync(
                NIP46_INITIAL_RELAY_COLLECTION_WINDOW_MS - 1,
            );
            expect(readyResolved).toBe(false);

            await vi.advanceTimersByTimeAsync(1);

            await pending.ready;

            expect(slowRelaySettled).toBe(false);
            expect(mockPool.subscribe).toHaveBeenCalledWith(
                ['wss://relay.ready.example.com'],
                expect.any(Object),
                expect.any(Object),
            );
            expect(getNostrConnectUriRelays(pending.connectionUri)).toEqual([
                'wss://relay.ready.example.com',
            ]);
        });

        it('ready 前に cancel すると cleanup され、古い operation は ready に到達しない', async () => {
            const relayConnection = createDeferred<{}>();
            mockPool.ensureRelay.mockReset().mockImplementation(() => relayConnection.promise);

            const pending = await service.startNostrConnect([
                'wss://relay.example.com',
            ]);

            await pending.cancel();
            relayConnection.resolve({});

            await expect(pending.ready).rejects.toThrow(
                'Nostr Connect connection was cancelled',
            );
            await expect(pending.completion).rejects.toThrow(
                'Nostr Connect connection was cancelled',
            );
            expect(mockPool.subscribe).not.toHaveBeenCalled();
            expect(mockPool.destroy).toHaveBeenCalled();
            expect(service.getSigner()).toBeNull();
        });

        it('relay 再生成で古い遅延 ready が後から完了しても、新しい pending state を汚染しない', async () => {
            const firstRelayConnection = createDeferred<{}>();

            mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                if (relay === 'wss://relay.first.example.com') {
                    return firstRelayConnection.promise;
                }

                return Promise.resolve({});
            });

            const firstPending = await service.startNostrConnect([
                'wss://relay.first.example.com',
            ]);
            await firstPending.cancel();

            const secondPending = await service.startNostrConnect([
                'wss://relay.second.example.com',
            ]);
            await secondPending.ready;

            firstRelayConnection.resolve({});
            await Promise.resolve();
            await Promise.resolve();

            await expect(firstPending.ready).rejects.toThrow(
                'Nostr Connect connection was cancelled',
            );
            expect(mockPool.subscribe).toHaveBeenCalledTimes(1);
            expect(mockPool.subscribe).toHaveBeenCalledWith(
                ['wss://relay.second.example.com'],
                expect.any(Object),
                expect.any(Object),
            );
        });

        it('switch_relays が relay 一覧を返した場合は返された relay を signer-negotiated として保存する', async () => {
            const remoteSignerPubkey = 'd'.repeat(64);
            const initialRelays = ['wss://relay.initial.example.com'];
            const finalRelays = ['wss://relay.final.example.com'];
            const { nip44 } = await import('nostr-tools');
            const { BunkerSigner, createNostrConnectURI } = await import('nostr-tools/nip46');

            vi.mocked(nip44.decrypt).mockReturnValue(
                JSON.stringify({ result: 'ab'.repeat(32) }),
            );

            const closeSubscription = vi.fn();
            mockPool.subscribe.mockReturnValue({
                close: closeSubscription,
            });

            const interimSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(
                        method === 'get_public_key'
                            ? TEST_USER_PUBKEY
                            : JSON.stringify(finalRelays),
                    ),
                ),
                getPublicKey: vi.fn().mockResolvedValue(TEST_USER_PUBKEY),
                bp: {
                    pubkey: remoteSignerPubkey,
                    relays: initialRelays,
                    secret: 'ab'.repeat(32),
                },
                close: vi.fn().mockResolvedValue(undefined),
            };
            const finalSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(method === 'get_public_key' ? TEST_USER_PUBKEY : 'ack'),
                ),
                getPublicKey: vi.fn().mockResolvedValue(TEST_USER_PUBKEY),
                bp: {
                    pubkey: remoteSignerPubkey,
                    relays: finalRelays,
                    secret: 'ab'.repeat(32),
                },
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any)
                .mockReturnValueOnce(interimSigner)
                .mockReturnValueOnce(finalSigner);

            const pending = await service.startNostrConnect(initialRelays);
            await pending.ready;

            expect(pending.connectionUri).toContain('nostrconnect://');
            expect(getNostrConnectUriName(pending.connectionUri)).toBe('eHagaki');
            expect(createNostrConnectURI).toHaveBeenCalledWith(
                expect.objectContaining({
                    relays: initialRelays,
                    perms: [...NIP46_REQUESTED_PERMISSIONS],
                    name: 'eHagaki',
                }),
            );

            const handlers = await getPendingNostrConnectHandlers();
            await handlers.onevent({
                content: 'encrypted-content',
                pubkey: remoteSignerPubkey,
            });

            const pubkey = await pending.completion;

            expect(pubkey).toBe(TEST_USER_PUBKEY);
            expect(interimSigner.sendRequest).toHaveBeenNthCalledWith(
                1,
                'get_public_key',
                [],
            );
            expect(interimSigner.sendRequest).toHaveBeenNthCalledWith(
                2,
                'switch_relays',
                [],
            );
            expect(
                interimSigner.sendRequest.mock.invocationCallOrder[0],
            ).toBeLessThan(interimSigner.sendRequest.mock.invocationCallOrder[1]);
            expect(finalSigner.sendRequest).toHaveBeenCalledWith('get_public_key', []);
            expect((BunkerSigner.fromBunker as any).mock.calls[1][1]).toEqual({
                pubkey: remoteSignerPubkey,
                relays: ['wss://relay.final.example.com'],
                secret: 'ab'.repeat(32),
            });
            expect(closeSubscription).toHaveBeenCalled();
            expect(interimSigner.close).toHaveBeenCalled();

            service.saveSession(mockStorage, pubkey);
            expect(Nip46Service.loadSession(mockStorage, pubkey)).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey,
                relays: finalRelays,
                userPubkey: TEST_USER_PUBKEY,
                pingVerified: false,
                relayResolution: 'signer-negotiated',
            });
        });

        it('switch_relays が loopback ws と public wss を混在して返しても supported candidate のみで接続を継続する', async () => {
            mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                if (
                    relay === 'wss://relay.initial.example.com'
                    || relay === 'wss://relay.final.example.com'
                ) {
                    return Promise.resolve({});
                }

                return Promise.reject(new Error('connection refused'));
            });

            const pendingFlow = await createPendingNegotiatedFinalRelayNostrConnect({
                finalRelayResponse: [
                    'ws://127.0.0.1:4869/',
                    'wss://relay.final.example.com',
                    'ws://relay.example.com/',
                    'wss://relay.final.example.com',
                ],
                finalSignerRelays: ['wss://relay.final.example.com'],
            });

            await pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await expect(pendingFlow.pending.completion).resolves.toBe(
                TEST_USER_PUBKEY,
            );
            expect(
                mockPool.ensureRelay.mock.calls.filter(
                    ([relay]) => relay === 'wss://relay.final.example.com',
                ),
            ).toHaveLength(1);
            expect(
                mockPool.ensureRelay.mock.calls.filter(
                    ([relay]) => relay === 'ws://relay.example.com/',
                ),
            ).toHaveLength(0);

            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(Nip46Service.loadSession(mockStorage, TEST_USER_PUBKEY)).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: pendingFlow.remoteSignerPubkey,
                relays: ['wss://relay.final.example.com'],
                userPubkey: TEST_USER_PUBKEY,
                pingVerified: false,
                relayResolution: 'signer-negotiated',
            });
        });

        it('switch_relays が reachable な local loopback final relay を返した場合は signer-negotiated として保存する', async () => {
            mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                if (
                    relay === 'wss://relay.initial.example.com'
                    || relay === 'ws://127.0.0.1:4869/'
                ) {
                    return Promise.resolve({});
                }

                return Promise.reject(new Error('connection refused'));
            });

            const pendingFlow = await createPendingNegotiatedFinalRelayNostrConnect({
                finalRelayResponse: ['ws://127.0.0.1:4869/'],
                finalSignerRelays: ['ws://127.0.0.1:4869/'],
            });

            await pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await expect(pendingFlow.pending.completion).resolves.toBe(
                TEST_USER_PUBKEY,
            );
            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(Nip46Service.loadSession(mockStorage, TEST_USER_PUBKEY)).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: pendingFlow.remoteSignerPubkey,
                relays: ['ws://127.0.0.1:4869/'],
                userPubkey: TEST_USER_PUBKEY,
                pingVerified: false,
                relayResolution: 'signer-negotiated',
            });
        });

        it('local final relay が先に接続して検証失敗しても public final relay の検証成功でログイン成功する', async () => {
            mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                if (
                    relay === 'wss://relay.initial.example.com'
                    || relay === 'ws://127.0.0.1:4869/'
                    || relay === 'wss://relay.final.example.com'
                ) {
                    return Promise.resolve({});
                }

                return Promise.reject(new Error('connection refused'));
            });

            const localFinalSigner = createMockNostrConnectSigner({
                remoteSignerPubkey: 'd'.repeat(64),
                relays: ['ws://127.0.0.1:4869/'],
                getPublicKeyError: new Error(
                    "mute: no one was listening to your ephemeral event and it wasn't handled in any way, it was ignored",
                ),
            });
            const publicFinalSigner = createMockNostrConnectSigner({
                remoteSignerPubkey: 'd'.repeat(64),
                relays: ['wss://relay.final.example.com'],
                getPublicKeyResult: TEST_USER_PUBKEY,
            });

            const pendingFlow = await createPendingNegotiatedFinalRelayNostrConnect({
                finalRelayResponse: [
                    'ws://127.0.0.1:4869/',
                    'wss://relay.final.example.com',
                ],
                finalSignerMocks: [localFinalSigner, publicFinalSigner],
            });

            await pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await expect(pendingFlow.pending.completion).resolves.toBe(
                TEST_USER_PUBKEY,
            );
            expect(localFinalSigner.getPublicKey).toHaveBeenCalledTimes(1);
            expect(localFinalSigner.close).toHaveBeenCalledTimes(1);
            expect(publicFinalSigner.getPublicKey).toHaveBeenCalledTimes(1);
            expect((await import('nostr-tools/nip46')).BunkerSigner.fromBunker).toHaveBeenCalledWith(
                expect.any(Uint8Array),
                {
                    pubkey: pendingFlow.remoteSignerPubkey,
                    relays: ['wss://relay.final.example.com'],
                    secret: 'ab'.repeat(32),
                },
                expect.any(Object),
            );

            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(Nip46Service.loadSession(mockStorage, TEST_USER_PUBKEY)).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: pendingFlow.remoteSignerPubkey,
                relays: ['wss://relay.final.example.com'],
                userPubkey: TEST_USER_PUBKEY,
                pingVerified: false,
                relayResolution: 'signer-negotiated',
            });
        });

        it('local final relay の検証失敗だけでは未検証の public final relay を残して接続全体を失敗させない', async () => {
            mockPool.ensureRelay.mockReset().mockResolvedValue({});

            const localFinalSigner = createMockNostrConnectSigner({
                remoteSignerPubkey: 'd'.repeat(64),
                relays: ['ws://127.0.0.1:4869/'],
                getPublicKeyError: new Error('mute: ignored'),
            });
            const publicFinalSigner = createMockNostrConnectSigner({
                remoteSignerPubkey: 'd'.repeat(64),
                relays: ['wss://relay.public.example.com'],
                getPublicKeyResult: TEST_USER_PUBKEY,
            });

            const pendingFlow = await createPendingNegotiatedFinalRelayNostrConnect({
                finalRelayResponse: [
                    'ws://127.0.0.1:4869/',
                    'wss://relay.public.example.com',
                ],
                finalSignerMocks: [localFinalSigner, publicFinalSigner],
            });

            await pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await expect(pendingFlow.pending.completion).resolves.toBe(
                TEST_USER_PUBKEY,
            );
            expect(publicFinalSigner.getPublicKey).toHaveBeenCalledTimes(1);
            expect(service.isConnected()).toBe(true);
        });

        it('switch_relays が unsupported relay のみを返した場合は initial ready relay へ fallback せず失敗する', async () => {
            const pendingFlow = await createPendingNegotiatedFinalRelayNostrConnect({
                finalRelayResponse: [
                    'ws://192.168.1.10:4869/',
                    'ws://relay.example.com/',
                    'https://relay.example.com/',
                ],
            });

            await pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await expect(pendingFlow.pending.completion).rejects.toThrow(
                'Remote signer did not return any usable connection relay',
            );
            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(
                mockStorage.getItem(`nostr-nip46-session-${TEST_USER_PUBKEY}`),
            ).toBeNull();
            expect(service.isConnected()).toBe(false);
            expect(
                mockPool.ensureRelay.mock.calls.filter(
                    ([relay]) => relay === 'ws://192.168.1.10:4869/' || relay === 'ws://relay.example.com/',
                ),
            ).toHaveLength(0);
        });

        it('switch_relays の relay array に非 string 値が含まれる場合は malformed response として失敗する', async () => {
            const pendingFlow = await createPendingNegotiatedFinalRelayNostrConnect({
                finalRelayResponse: ['wss://relay.final.example.com', 42],
            });

            await pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await expect(pendingFlow.pending.completion).rejects.toThrow(
                'Remote signer returned an invalid final relay list',
            );
            expect(service.isConnected()).toBe(false);
        });

        it('loopback final relay のみが到達不能な場合は local relay 到達不能 error を返す', async () => {
            mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                if (relay === 'wss://relay.initial.example.com') {
                    return Promise.resolve({});
                }

                return Promise.reject(new Error('connection refused'));
            });

            const pendingFlow = await createPendingNegotiatedFinalRelayNostrConnect({
                finalRelayResponse: ['ws://127.0.0.1:4869/'],
                finalSignerRelays: ['ws://127.0.0.1:4869/'],
            });

            await pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await expect(pendingFlow.pending.completion).rejects.toThrow(
                'Could not connect to the local relay specified by the remote signer',
            );
            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(
                mockStorage.getItem(`nostr-nip46-session-${TEST_USER_PUBKEY}`),
            ).toBeNull();
            expect(service.isConnected()).toBe(false);
        });

        it.each([
            {
                title: 'timeout',
                finalGetPublicKeyPromise: new Promise<string>(() => {
                    // never resolves
                }),
            },
            {
                title: 'error',
                finalGetPublicKeyError: new Error('permission denied'),
            },
            {
                title: 'pubkey mismatch',
                finalGetPublicKeyResult: 'different-user-pubkey',
            },
        ])(
            'supported final relay 上の get_public_key 再確認が $title の場合は session を保存せず失敗する',
            async ({ finalGetPublicKeyPromise, finalGetPublicKeyError, finalGetPublicKeyResult }) => {
                vi.useFakeTimers();

                const pendingFlow = await createPendingNegotiatedFinalRelayNostrConnect({
                    finalRelayResponse: ['wss://relay.final.example.com'],
                    finalSignerRelays: ['wss://relay.final.example.com'],
                    finalGetPublicKeyPromise,
                    finalGetPublicKeyError,
                    finalGetPublicKeyResult,
                });

                const oneventPromise = pendingFlow.handlers.onevent({
                    content: 'encrypted-content',
                    pubkey: pendingFlow.remoteSignerPubkey,
                });

                if (finalGetPublicKeyPromise) {
                    await vi.advanceTimersByTimeAsync(5000);
                }
                await oneventPromise;

                await expect(pendingFlow.pending.completion).rejects.toThrow(
                    'Communication could not be verified on the relay selected by the remote signer',
                );
                service.saveSession(mockStorage, TEST_USER_PUBKEY);
                expect(
                    mockStorage.getItem(`nostr-nip46-session-${TEST_USER_PUBKEY}`),
                ).toBeNull();
                expect(service.isConnected()).toBe(false);
                expect(pendingFlow.finalSigner.close).toHaveBeenCalledTimes(1);
            },
        );

        it('すべての supported final relay で get_public_key 検証に失敗した場合のみ接続失敗になる', async () => {
            mockPool.ensureRelay.mockReset().mockResolvedValue({});

            const localFinalSigner = createMockNostrConnectSigner({
                remoteSignerPubkey: 'd'.repeat(64),
                relays: ['ws://127.0.0.1:4869/'],
                getPublicKeyError: new Error('mute: ignored'),
            });
            const publicFinalSigner = createMockNostrConnectSigner({
                remoteSignerPubkey: 'd'.repeat(64),
                relays: ['wss://relay.final.example.com'],
                getPublicKeyError: new Error('remote signer unavailable'),
            });

            const pendingFlow = await createPendingNegotiatedFinalRelayNostrConnect({
                finalRelayResponse: [
                    'ws://127.0.0.1:4869/',
                    'wss://relay.final.example.com',
                ],
                finalSignerMocks: [localFinalSigner, publicFinalSigner],
            });

            await pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await expect(pendingFlow.pending.completion).rejects.toThrow(
                'Communication could not be verified on the relay selected by the remote signer',
            );
            expect(localFinalSigner.getPublicKey).toHaveBeenCalledTimes(1);
            expect(publicFinalSigner.getPublicKey).toHaveBeenCalledTimes(1);
            expect(localFinalSigner.close).toHaveBeenCalledTimes(1);
            expect(publicFinalSigner.close).toHaveBeenCalledTimes(1);
            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(
                mockStorage.getItem(`nostr-nip46-session-${TEST_USER_PUBKEY}`),
            ).toBeNull();
            expect(service.isConnected()).toBe(false);
        });

        it('switch_relays relay array の分類と final relay 接続診断ログを出し、secret や private key を含めない', async () => {
            const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => { });
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            try {
                mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                    if (
                        relay === 'wss://relay.initial.example.com'
                        || relay === 'wss://relay.final.example.com'
                    ) {
                        return Promise.resolve({});
                    }

                    return Promise.reject(new Error('connection refused'));
                });

                const pendingFlow = await createPendingNegotiatedFinalRelayNostrConnect({
                    finalRelayResponse: [
                        'ws://127.0.0.1:4869/',
                        'wss://relay.final.example.com',
                        'ws://relay.example.com/',
                    ],
                    finalSignerRelays: ['wss://relay.final.example.com'],
                });

                await pendingFlow.handlers.onevent({
                    content: 'encrypted-content',
                    pubkey: pendingFlow.remoteSignerPubkey,
                });
                await pendingFlow.pending.completion;

                expect(debugSpy).toHaveBeenCalledWith(
                    '[NIP-46] switch_relays response classified',
                    {
                        method: 'switch_relays',
                        parsed: 3,
                        supported: 2,
                        unsupported: 1,
                    },
                );
                expect(warnSpy).toHaveBeenCalledWith(
                    '[NIP-46] negotiated final relay connection failed:',
                    expect.objectContaining({
                        reason: 'relay-unreachable',
                    }),
                );
                expectConsoleCallsNotToContain([debugSpy, warnSpy], [
                    'wss://relay.final.example.com',
                    'ws://relay.example.com',
                    'connection refused',
                    'ab'.repeat(32),
                ]);
            } finally {
                debugSpy.mockRestore();
                warnSpy.mockRestore();
            }
        });

        it('switch_relays が null を返した場合は接続済み initial relay subset を signer-confirmed-unchanged として保存する', async () => {
            mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                if (
                    relay === 'wss://relay.ready.example.com'
                    || relay === 'wss://relay.backup-ready.example.com'
                ) {
                    return Promise.resolve({});
                }

                return Promise.reject(new Error('connection timed out'));
            });

            const {
                pending,
                handlers,
                interimSigner,
                remoteSignerPubkey,
            } = await createPendingFallbackNostrConnect({
                initialRelays: [
                    'wss://relay.ready.example.com',
                    'wss://relay.backup-ready.example.com',
                    'wss://relay.dead.example.com',
                ],
                sendRequestResult: 'null',
            });

            await handlers.onevent({
                content: 'encrypted-content',
                pubkey: remoteSignerPubkey,
            });

            const pubkey = await pending.completion;

            expect(pubkey).toBe(TEST_USER_PUBKEY);
            expect(
                interimSigner.sendRequest.mock.invocationCallOrder[0],
            ).toBeLessThan(interimSigner.sendRequest.mock.invocationCallOrder[1]);
            service.saveSession(mockStorage, pubkey);
            expect(Nip46Service.loadSession(mockStorage, pubkey)).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey,
                relays: [
                    'wss://relay.ready.example.com',
                    'wss://relay.backup-ready.example.com',
                ],
                userPubkey: TEST_USER_PUBKEY,
                pingVerified: false,
                relayResolution: 'signer-confirmed-unchanged',
            });
        });

        it('switch_relays が unsupported method error を返した場合は接続済み initial relay subset で fallback 接続する', async () => {
            mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                if (
                    relay === 'wss://relay.ready.example.com'
                    || relay === 'wss://relay.backup-ready.example.com'
                ) {
                    return Promise.resolve({});
                }

                return Promise.reject(new Error('connection timed out'));
            });

            const {
                pending,
                handlers,
                interimSigner,
                remoteSignerPubkey,
            } = await createPendingFallbackNostrConnect({
                initialRelays: [
                    'wss://relay.ready.example.com',
                    'wss://relay.backup-ready.example.com',
                    'wss://relay.dead.example.com',
                ],
                sendRequestError: 'unsupported method: switch_relays',
            });

            await handlers.onevent({
                content: 'encrypted-content',
                pubkey: remoteSignerPubkey,
            });

            const pubkey = await pending.completion;
            const initialReadyRelays = [
                'wss://relay.ready.example.com',
                'wss://relay.backup-ready.example.com',
            ];

            expect(pubkey).toBe(TEST_USER_PUBKEY);
            expect(
                interimSigner.sendRequest.mock.invocationCallOrder[0],
            ).toBeLessThan(interimSigner.sendRequest.mock.invocationCallOrder[1]);
            expect(getNostrConnectUriRelays(pending.connectionUri)).toEqual(
                initialReadyRelays,
            );
            service.saveSession(mockStorage, pubkey);
            expect(Nip46Service.loadSession(mockStorage, pubkey)).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey,
                relays: initialReadyRelays,
                userPubkey: TEST_USER_PUBKEY,
                pingVerified: false,
                relayResolution: 'client-initial-fallback',
            });
        });

        it('connect response 受信後は get_public_key を retry 成功させてから switch_relays を送る', async () => {
            vi.useFakeTimers();

            const remoteSignerPubkey = 'd'.repeat(64);
            const initialRelays = ['wss://relay.ready.example.com'];
            const sharedSecret = 'ab'.repeat(32);
            const { nip44 } = await import('nostr-tools');
            const { BunkerSigner } = await import('nostr-tools/nip46');

            vi.mocked(nip44.decrypt).mockReturnValue(
                JSON.stringify({ result: sharedSecret }),
            );

            mockPool.subscribe.mockReturnValue({
                close: vi.fn(),
            });

            const firstSigner = createMockNostrConnectSigner({
                remoteSignerPubkey,
                relays: initialRelays,
                sharedSecret,
                sendRequestResult: 'null',
                getPublicKeyPromise: new Promise<string>(() => {
                    // never resolves
                }),
            });
            const secondSigner = createMockNostrConnectSigner({
                remoteSignerPubkey,
                relays: initialRelays,
                sharedSecret,
                sendRequestResult: 'null',
                getPublicKeyPromise: new Promise<string>(() => {
                    // never resolves
                }),
            });
            const thirdSigner = createMockNostrConnectSigner({
                remoteSignerPubkey,
                relays: initialRelays,
                sharedSecret,
                sendRequestResult: 'null',
                getPublicKeyResult: TEST_USER_PUBKEY,
            });
            (BunkerSigner.fromBunker as any)
                .mockReturnValueOnce(firstSigner)
                .mockReturnValueOnce(secondSigner)
                .mockReturnValueOnce(thirdSigner);

            const pending = await service.startNostrConnect(initialRelays);
            const handlers = await getPendingNostrConnectHandlers();
            const oneventPromise = handlers.onevent({
                content: 'encrypted-content',
                pubkey: remoteSignerPubkey,
            });

            await vi.advanceTimersByTimeAsync(
                NIP46_INITIAL_READINESS_ATTEMPT_TIMEOUT_MS,
            );
            expect(firstSigner.sendRequest).toHaveBeenCalledWith('get_public_key', []);

            await vi.advanceTimersByTimeAsync(
                NIP46_INITIAL_READINESS_RETRY_INTERVAL_MS,
            );
            await vi.advanceTimersByTimeAsync(
                NIP46_INITIAL_READINESS_ATTEMPT_TIMEOUT_MS,
            );
            expect(secondSigner.sendRequest).toHaveBeenCalledWith('get_public_key', []);

            await vi.advanceTimersByTimeAsync(
                NIP46_INITIAL_READINESS_RETRY_INTERVAL_MS,
            );
            await oneventPromise;

            await expect(pending.completion).resolves.toBe(TEST_USER_PUBKEY);
            expect(thirdSigner.sendRequest).toHaveBeenCalledWith('switch_relays', []);
            expect(
                thirdSigner.sendRequest.mock.invocationCallOrder[0],
            ).toBeLessThan(thirdSigner.sendRequest.mock.invocationCallOrder[1]);
            expect(firstSigner.close).toHaveBeenCalledTimes(1);
            expect(secondSigner.close).toHaveBeenCalledTimes(1);
        });

        it('initial get_public_key readiness retry window を超えても成功しない場合は session を保存せず接続失敗する', async () => {
            vi.useFakeTimers();

            const remoteSignerPubkey = 'd'.repeat(64);
            const initialRelays = ['wss://relay.ready.example.com'];
            const sharedSecret = 'ab'.repeat(32);
            const { nip44 } = await import('nostr-tools');
            const { BunkerSigner } = await import('nostr-tools/nip46');

            vi.mocked(nip44.decrypt).mockReturnValue(
                JSON.stringify({ result: sharedSecret }),
            );

            mockPool.subscribe.mockReturnValue({
                close: vi.fn(),
            });

            const attemptCount = Math.floor(
                (NIP46_INITIAL_READINESS_RETRY_WINDOW_MS
                    + NIP46_INITIAL_READINESS_RETRY_INTERVAL_MS)
                / (NIP46_INITIAL_READINESS_ATTEMPT_TIMEOUT_MS
                    + NIP46_INITIAL_READINESS_RETRY_INTERVAL_MS),
            );
            const readinessSigners = Array.from({ length: attemptCount }, () =>
                createMockNostrConnectSigner({
                    remoteSignerPubkey,
                    relays: initialRelays,
                    sharedSecret,
                    sendRequestResult: 'null',
                    getPublicKeyPromise: new Promise<string>(() => {
                        // never resolves
                    }),
                }),
            );
            const fromBunkerMock = (BunkerSigner.fromBunker as any).mockReset();
            for (const signer of readinessSigners) {
                fromBunkerMock.mockReturnValueOnce(signer);
            }
            fromBunkerMock.mockReturnValue(readinessSigners.at(-1));

            const pending = await service.startNostrConnect(initialRelays);
            const handlers = await getPendingNostrConnectHandlers();
            const oneventPromise = handlers.onevent({
                content: 'encrypted-content',
                pubkey: remoteSignerPubkey,
            });

            for (let index = 0; index < attemptCount; index += 1) {
                await vi.advanceTimersByTimeAsync(
                    NIP46_INITIAL_READINESS_ATTEMPT_TIMEOUT_MS,
                );
                if (index < attemptCount - 1) {
                    await vi.advanceTimersByTimeAsync(
                        NIP46_INITIAL_READINESS_RETRY_INTERVAL_MS,
                    );
                }
            }
            await oneventPromise;

            await expect(pending.completion).rejects.toThrow(
                'Timed out waiting for get_public_key response',
            );
            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(
                mockStorage.getItem(`nostr-nip46-session-${TEST_USER_PUBKEY}`),
            ).toBeNull();
            expect(service.isConnected()).toBe(false);
            readinessSigners.forEach((signer) => {
                expect(signer.sendRequest).toHaveBeenCalledWith('get_public_key', []);
                expect(signer.close).toHaveBeenCalled();
            });
        });

        it('initial get_public_key の明示 error は retry せず接続失敗する', async () => {
            const remoteSignerPubkey = 'd'.repeat(64);
            const initialRelays = ['wss://relay.ready.example.com'];
            const sharedSecret = 'ab'.repeat(32);
            const explicitError = new Error('permission denied');
            const { nip44 } = await import('nostr-tools');
            const { BunkerSigner } = await import('nostr-tools/nip46');

            vi.mocked(nip44.decrypt).mockReturnValue(
                JSON.stringify({ result: sharedSecret }),
            );

            mockPool.subscribe.mockReturnValue({
                close: vi.fn(),
            });

            const readinessSigner = createMockNostrConnectSigner({
                remoteSignerPubkey,
                relays: initialRelays,
                sharedSecret,
                sendRequestResult: 'null',
                getPublicKeyError: explicitError,
            });
            (BunkerSigner.fromBunker as any).mockReturnValue(readinessSigner);

            const pending = await service.startNostrConnect(initialRelays);
            const handlers = await getPendingNostrConnectHandlers();
            await handlers.onevent({
                content: 'encrypted-content',
                pubkey: remoteSignerPubkey,
            });

            await expect(pending.completion).rejects.toThrow('permission denied');
            expect(BunkerSigner.fromBunker).toHaveBeenCalledTimes(1);
            expect(readinessSigner.sendRequest).toHaveBeenCalledWith('get_public_key', []);
            expect(service.isConnected()).toBe(false);
        });

        it('cancel 時は readiness retry timer と temporary signer を cleanup する', async () => {
            vi.useFakeTimers();

            const remoteSignerPubkey = 'd'.repeat(64);
            const initialRelays = ['wss://relay.ready.example.com'];
            const sharedSecret = 'ab'.repeat(32);
            const { nip44 } = await import('nostr-tools');
            const { BunkerSigner } = await import('nostr-tools/nip46');

            vi.mocked(nip44.decrypt).mockReturnValue(
                JSON.stringify({ result: sharedSecret }),
            );

            mockPool.subscribe.mockReturnValue({
                close: vi.fn(),
            });

            const firstSigner = createMockNostrConnectSigner({
                remoteSignerPubkey,
                relays: initialRelays,
                sharedSecret,
                sendRequestResult: 'null',
                getPublicKeyPromise: new Promise<string>(() => {
                    // never resolves
                }),
            });
            const secondSigner = createMockNostrConnectSigner({
                remoteSignerPubkey,
                relays: initialRelays,
                sharedSecret,
                sendRequestResult: 'null',
                getPublicKeyResult: TEST_USER_PUBKEY,
            });
            (BunkerSigner.fromBunker as any)
                .mockReturnValueOnce(firstSigner)
                .mockReturnValue(secondSigner);

            const pending = await service.startNostrConnect(initialRelays);
            const handlers = await getPendingNostrConnectHandlers();
            const oneventPromise = handlers.onevent({
                content: 'encrypted-content',
                pubkey: remoteSignerPubkey,
            });

            await vi.advanceTimersByTimeAsync(
                NIP46_INITIAL_READINESS_ATTEMPT_TIMEOUT_MS,
            );
            await pending.cancel();
            await vi.advanceTimersByTimeAsync(
                NIP46_INITIAL_READINESS_RETRY_INTERVAL_MS * 2,
            );
            await oneventPromise;

            await expect(pending.completion).rejects.toThrow(
                'Nostr Connect connection was cancelled',
            );
            expect(BunkerSigner.fromBunker).toHaveBeenCalledTimes(1);
            expect(firstSigner.close).toHaveBeenCalledTimes(1);
            expect(secondSigner.getPublicKey).not.toHaveBeenCalled();
            expect(service.isConnected()).toBe(false);
        });

        it('cancel 後の遅延 get_public_key success は runtime session を上書きしない', async () => {
            const remoteSignerPubkey = 'd'.repeat(64);
            const initialRelays = ['wss://relay.ready.example.com'];
            const sharedSecret = 'ab'.repeat(32);
            const delayedPublicKey = createDeferred<string>();
            const { nip44 } = await import('nostr-tools');
            const { BunkerSigner } = await import('nostr-tools/nip46');

            vi.mocked(nip44.decrypt).mockReturnValue(
                JSON.stringify({ result: sharedSecret }),
            );

            mockPool.subscribe.mockReturnValue({
                close: vi.fn(),
            });

            const delayedSigner = createMockNostrConnectSigner({
                remoteSignerPubkey,
                relays: initialRelays,
                sharedSecret,
                sendRequestResult: 'null',
                getPublicKeyPromise: delayedPublicKey.promise,
            });
            (BunkerSigner.fromBunker as any).mockReturnValue(delayedSigner);

            const pending = await service.startNostrConnect(initialRelays);
            const handlers = await getPendingNostrConnectHandlers();
            const oneventPromise = handlers.onevent({
                content: 'encrypted-content',
                pubkey: remoteSignerPubkey,
            });

            await pending.cancel();
            delayedPublicKey.resolve(TEST_USER_PUBKEY);
            await oneventPromise;

            await expect(pending.completion).rejects.toThrow(
                'Nostr Connect connection was cancelled',
            );
            expect(delayedSigner.sendRequest).toHaveBeenCalledWith('get_public_key', []);
            expect(service.isConnected()).toBe(false);
            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(
                mockStorage.getItem(`nostr-nip46-session-${TEST_USER_PUBKEY}`),
            ).toBeNull();
        });

        it('switch_relays timeout 後に fallback signer の get_public_key 検証が成功した場合は client-initial-unconfirmed として接続成功する', async () => {
            vi.useFakeTimers();

            mockPool.ensureRelay.mockReset().mockImplementation((relay: string) => {
                if (
                    relay === 'wss://relay.ready.example.com'
                    || relay === 'wss://relay.backup-ready.example.com'
                ) {
                    return Promise.resolve({});
                }

                return Promise.reject(new Error('connection timed out'));
            });

            const pendingFlow = await createPendingFallbackNostrConnect({
                initialRelays: [
                    'wss://relay.ready.example.com',
                    'wss://relay.backup-ready.example.com',
                    'wss://relay.dead.example.com',
                ],
                sendRequestPromise: new Promise<string>(() => {
                    // never resolves
                }),
            });

            const oneventPromise = pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await vi.advanceTimersByTimeAsync(5000);
            await oneventPromise;

            await expect(pendingFlow.pending.completion).resolves.toBe(
                TEST_USER_PUBKEY,
            );
            expect(pendingFlow.closeSubscription).toHaveBeenCalled();
            expect(pendingFlow.interimSigner.close).toHaveBeenCalledTimes(1);
            expect(pendingFlow.fallbackSigner.getPublicKey).toHaveBeenCalledTimes(1);

            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(Nip46Service.loadSession(mockStorage, TEST_USER_PUBKEY)).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: pendingFlow.remoteSignerPubkey,
                relays: [
                    'wss://relay.ready.example.com',
                    'wss://relay.backup-ready.example.com',
                ],
                userPubkey: TEST_USER_PUBKEY,
                pingVerified: false,
                relayResolution: 'client-initial-unconfirmed',
            });
            expect(service.isConnected()).toBe(true);
        });

        it('switch_relays timeout 後に fallback signer の get_public_key も失敗した場合は session を保存せず接続失敗として cleanup する', async () => {
            vi.useFakeTimers();

            const pendingFlow = await createPendingFallbackNostrConnect({
                sendRequestPromise: new Promise<string>(() => {
                    // never resolves
                }),
                fallbackGetPublicKeyPromise: new Promise<string>(() => {
                    // never resolves
                }),
            });

            const oneventPromise = pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await vi.advanceTimersByTimeAsync(5000);
            await vi.advanceTimersByTimeAsync(5000);
            await oneventPromise;

            await expect(pendingFlow.pending.completion).rejects.toThrow(
                'Timed out waiting for get_public_key response',
            );
            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(
                mockStorage.getItem(`nostr-nip46-session-${TEST_USER_PUBKEY}`),
            ).toBeNull();
            expect(pendingFlow.closeSubscription).toHaveBeenCalled();
            expect(pendingFlow.interimSigner.close).toHaveBeenCalledTimes(1);
            expect(pendingFlow.fallbackSigner.close).toHaveBeenCalledTimes(1);
            expect(service.isConnected()).toBe(false);
        });

        it('ready 完了直後の signer response でも取りこぼさず接続完了する', async () => {
            const pendingFlow = await createPendingFallbackNostrConnect();

            await pendingFlow.pending.ready;
            await pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await expect(pendingFlow.pending.completion).resolves.toBe(
                TEST_USER_PUBKEY,
            );
        });

        it('全 relay 接続失敗時は ready / completion の両方が失敗し cleanup される', async () => {
            mockPool.ensureRelay.mockReset().mockRejectedValue(
                new Error('connection timed out'),
            );

            const pending = await service.startNostrConnect([
                'wss://relay.example.com',
                'wss://relay.backup.example.com',
            ]);

            await expect(pending.ready).rejects.toThrow('Relay connection failed');
            await expect(pending.completion).rejects.toThrow('Relay connection failed');
            expect(mockPool.subscribe).not.toHaveBeenCalled();
            expect(mockPool.destroy).toHaveBeenCalled();
            expect(service.getSigner()).toBeNull();
        });

        it('completion failure でも unhandled rejection を発生させない', async () => {
            vi.useFakeTimers();

            const onUnhandledRejection = vi.fn();
            process.on('unhandledRejection', onUnhandledRejection);

            try {
                const pendingFlow = await createPendingFallbackNostrConnect({
                    sendRequestPromise: new Promise<string>(() => {
                        // never resolves
                    }),
                });

                const oneventPromise = pendingFlow.handlers.onevent({
                    content: 'encrypted-content',
                    pubkey: pendingFlow.remoteSignerPubkey,
                });

                await vi.advanceTimersByTimeAsync(5000);
                await oneventPromise;
                await Promise.resolve();
                await Promise.resolve();

                expect(onUnhandledRejection).not.toHaveBeenCalled();
                await expect(pendingFlow.pending.completion).resolves.toBe(
                    TEST_USER_PUBKEY,
                );
            } finally {
                process.off('unhandledRejection', onUnhandledRejection);
            }
        });

        it('timeout した switch_relays の遅延 response は成功済み session.relays や runtime signer を上書きしない', async () => {
            vi.useFakeTimers();

            const delayedSwitchRelays = createDeferred<string>();
            const pendingFlow = await createPendingFallbackNostrConnect({
                sendRequestPromise: delayedSwitchRelays.promise,
            });

            const oneventPromise = pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            await vi.advanceTimersByTimeAsync(5000);
            await oneventPromise;
            await expect(pendingFlow.pending.completion).resolves.toBe(
                TEST_USER_PUBKEY,
            );

            expect(pendingFlow.interimSigner.close).toHaveBeenCalledTimes(1);
            expect(pendingFlow.fallbackSigner.sendRequest).not.toHaveBeenCalledWith(
                'switch_relays',
                [],
            );

            delayedSwitchRelays.resolve(JSON.stringify(['wss://relay.late.example.com']));
            await Promise.resolve();
            await Promise.resolve();

            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(Nip46Service.loadSession(mockStorage, TEST_USER_PUBKEY)).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: pendingFlow.remoteSignerPubkey,
                relays: pendingFlow.initialRelays,
                userPubkey: TEST_USER_PUBKEY,
                pingVerified: false,
                relayResolution: 'client-initial-unconfirmed',
            });

            pendingFlow.fallbackSigner.sendRequest.mockResolvedValue('pong');
            expect(await service.runManualConnectionCheck()).toEqual({
                success: true,
            });
            expect(pendingFlow.fallbackSigner.sendRequest).toHaveBeenCalledWith('ping', []);
        });

        it('client-initial fallback で保存した session は reconnect / rebuild / ping に initial relay を使える', async () => {
            const pendingFlow = await createPendingFallbackNostrConnect({
                initialRelays: ['wss://relay.initial.example.com'],
                sendRequestError: 'unsupported method: switch_relays',
                userPubkey: TEST_USER_PUBKEY,
            });

            await pendingFlow.handlers.onevent({
                content: 'encrypted-content',
                pubkey: pendingFlow.remoteSignerPubkey,
            });

            const pubkey = await pendingFlow.pending.completion;
            service.saveSession(mockStorage, pubkey);
            const savedSession = Nip46Service.loadSession(mockStorage, pubkey);

            expect(savedSession).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: pendingFlow.remoteSignerPubkey,
                relays: ['wss://relay.initial.example.com'],
                userPubkey: TEST_USER_PUBKEY,
                pingVerified: false,
                relayResolution: 'client-initial-fallback',
            });

            const restoredService = new Nip46Service();
            const { BunkerSigner } = await import('nostr-tools/nip46');
            const reconnectSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(
                        method === 'get_public_key'
                            ? TEST_USER_PUBKEY
                            : method === 'connect'
                                ? 'ack'
                                : 'pong',
                    ),
                ),
                getPublicKey: vi.fn().mockResolvedValue(TEST_USER_PUBKEY),
                bp: {
                    pubkey: pendingFlow.remoteSignerPubkey,
                    relays: ['wss://relay.initial.example.com'],
                    secret: null,
                },
                close: vi.fn().mockResolvedValue(undefined),
            };
            const rebuiltSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(method === 'get_public_key' ? TEST_USER_PUBKEY : 'ack'),
                ),
                getPublicKey: vi.fn().mockResolvedValue(TEST_USER_PUBKEY),
                bp: {
                    pubkey: pendingFlow.remoteSignerPubkey,
                    relays: ['wss://relay.initial.example.com'],
                    secret: null,
                },
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any)
                .mockReset()
                .mockReturnValueOnce(reconnectSigner)
                .mockReturnValueOnce(rebuiltSigner);

            await restoredService.reconnect(savedSession!);
            expect((BunkerSigner.fromBunker as any).mock.calls[0][1]).toEqual({
                pubkey: pendingFlow.remoteSignerPubkey,
                relays: ['wss://relay.initial.example.com'],
                secret: null,
            });

            restoredService.bindSessionPersistence(mockStorage, pubkey);
            expect(await restoredService.ensureConnection()).toBe(true);
            expect((BunkerSigner.fromBunker as any).mock.calls[1][1]).toEqual({
                pubkey: pendingFlow.remoteSignerPubkey,
                relays: ['wss://relay.initial.example.com'],
                secret: null,
            });

            rebuiltSigner.sendRequest.mockResolvedValue('pong');
            expect(await restoredService.runManualConnectionCheck()).toEqual({
                success: true,
            });
            expect(rebuiltSigner.sendRequest).toHaveBeenCalledWith('ping', []);
        });

        it('switch_relays publish failure では session を保存せず接続失敗する', async () => {
            const {
                pending,
                handlers,
            } = await createPendingFallbackNostrConnect({
                sendRequestError: new Error('publish failed'),
            });

            await handlers.onevent({
                content: 'encrypted-content',
                pubkey: 'd'.repeat(64),
            });

            await expect(pending.completion).rejects.toThrow('publish failed');
            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(
                mockStorage.getItem(`nostr-nip46-session-${TEST_USER_PUBKEY}`),
            ).toBeNull();
            expect(service.isConnected()).toBe(false);
        });

        it('connect response 自体が失敗した場合は session を保存せず接続失敗する', async () => {
            const pending = await service.startNostrConnect([
                'wss://relay.example.com',
            ]);

            const handlers = await getPendingNostrConnectHandlers();
            await handlers.onclose();

            await expect(pending.completion).rejects.toThrow(
                'Nostr Connect timed out before the remote signer connected',
            );
            service.saveSession(mockStorage, TEST_USER_PUBKEY);
            expect(
                mockStorage.getItem(`nostr-nip46-session-${TEST_USER_PUBKEY}`),
            ).toBeNull();
            expect(service.isConnected()).toBe(false);
        });

        it('bunker connect request と nostrconnect URI は同じ permission 定義を使う', async () => {
            const { mockBp, mockSigner } = await connectService({ secret: 'test-secret' });
            const { createNostrConnectURI } = await import('nostr-tools/nip46');

            await service.startNostrConnect(['wss://relay.example.com']);

            expect(mockSigner.sendRequest).toHaveBeenCalledWith(
                'connect',
                [mockBp.pubkey, 'test-secret', NIP46_REQUESTED_PERMS],
            );
            expect(createNostrConnectURI).toHaveBeenCalledWith(
                expect.objectContaining({
                    perms: [...NIP46_REQUESTED_PERMISSIONS],
                    name: 'eHagaki',
                }),
            );
        });
    });

    describe('初期状態', () => {
        it('getSigner: 未接続時はnullを返す', () => {
            expect(service.getSigner()).toBeNull();
        });

        it('getUserPubkey: 未接続時はnullを返す', () => {
            expect(service.getUserPubkey()).toBeNull();
        });

        it('isConnected: 未接続時はfalseを返す', () => {
            expect(service.isConnected()).toBe(false);
        });
    });

    describe('disconnect', () => {
        it('接続後にdisconnectを二重呼び出ししてもエラーにならない', async () => {
            await connectService();
            await service.disconnect();
            await service.disconnect(); // 二重呼び出し → エラーにならない
            expect(service.isConnected()).toBe(false);
        });

        it('接続済みの場合close()を呼び状態をクリア', async () => {
            const { mockSigner } = await connectService();
            expect(service.isConnected()).toBe(true);

            await service.disconnect();
            expect(mockSigner.close).toHaveBeenCalled();
            expect(mockPool.destroy).toHaveBeenCalled();
            expect(service.isConnected()).toBe(false);
            expect(service.getSigner()).toBeNull();
            expect(service.getUserPubkey()).toBeNull();
        });

        it('未接続の場合は何もしない', async () => {
            await service.disconnect(); // エラーにならない
            expect(service.isConnected()).toBe(false);
        });
    });

    describe('セッション管理', () => {
        it('saveSession: セッションデータをlocalStorageに保存', async () => {
            await connectService({
                remoteSignerPubkey: 'b'.repeat(64),
                relays: ['wss://relay1.example.com', 'wss://relay2.example.com'],
            });
            service.saveSession(mockStorage);

            const saved = mockStorage.getItem('nostr-nip46-session');
            expect(saved).not.toBeNull();

            const parsed = JSON.parse(saved!);
            expect(parsed.remoteSignerPubkey).toBe('b'.repeat(64));
            expect(parsed.relays).toEqual(['wss://relay1.example.com', 'wss://relay2.example.com']);
            expect(parsed.userPubkey).toBe(TEST_USER_PUBKEY);
            expect(typeof parsed.clientSecretKeyHex).toBe('string');
            expect(parsed.pingVerified).toBe(false);
        });

        it('saveSession: pubkeyHex指定時にprefixキーで保存', async () => {
            await connectService({
                remoteSignerPubkey: 'b'.repeat(64),
                relays: ['wss://relay1.example.com'],
            });
            service.saveSession(mockStorage, TEST_USER_PUBKEY);

            // per-userキーに保存される
            const saved = mockStorage.getItem(`nostr-nip46-session-${TEST_USER_PUBKEY}`);
            expect(saved).not.toBeNull();
            // legacyキーには保存されない
            expect(mockStorage.getItem('nostr-nip46-session')).toBeNull();
        });

        it('saveSession は last-used NIP-46 relay candidates を上書きしない', async () => {
            mockStorage.setItem(
                'nostr-nip46-connect-relays',
                JSON.stringify(['wss://ui-relay.example.com/']),
            );
            await connectService({
                remoteSignerPubkey: 'b'.repeat(64),
                relays: ['wss://relay1.example.com'],
            });

            service.saveSession(mockStorage, TEST_USER_PUBKEY);

            expect(mockStorage.getItem('nostr-nip46-connect-relays')).toBe(
                JSON.stringify(['wss://ui-relay.example.com/']),
            );
        });

        it('loadSession: 保存済みセッションを復元', () => {
            const sessionData = {
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: 'c'.repeat(64),
                relays: ['wss://relay.test.com'],
                userPubkey: 'user-pub',
                pingVerified: true,
                relayResolution: 'signer-negotiated',
            };
            mockStorage.setItem('nostr-nip46-session', JSON.stringify(sessionData));

            const loaded = Nip46Service.loadSession(mockStorage);
            expect(loaded).toEqual(sessionData);
        });

        it('loadSession: 保存済み relay の終了済み URL を除外する', () => {
            const sessionData = {
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: 'c'.repeat(64),
                relays: [DECOMMISSIONED_RELAYS[2], 'wss://relay.test.com'],
                userPubkey: 'user-pub',
                pingVerified: true,
            };
            mockStorage.setItem('nostr-nip46-session', JSON.stringify(sessionData));

            expect(Nip46Service.loadSession(mockStorage)).toEqual({
                ...sessionData,
                relays: ['wss://relay.test.com'],
            });
        });

        it('loadSession: pubkeyHex指定時にprefixキーから読み取る', () => {
            const sessionData = {
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: 'c'.repeat(64),
                relays: ['wss://relay.test.com'],
                userPubkey: 'user-pub',
                pingVerified: true,
            };
            mockStorage.setItem('nostr-nip46-session-user-pub', JSON.stringify(sessionData));

            const loaded = Nip46Service.loadSession(mockStorage, 'user-pub');
            expect(loaded).toEqual(sessionData);
            // legacyキーからは読まない
            expect(Nip46Service.loadSession(mockStorage)).toBeNull();
        });

        it('loadSession: legacyセッションはpingVerifiedをfalseで補完する', () => {
            const sessionData = {
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: 'c'.repeat(64),
                relays: ['wss://relay.test.com'],
                userPubkey: 'user-pub',
            };
            mockStorage.setItem('nostr-nip46-session', JSON.stringify(sessionData));

            expect(Nip46Service.loadSession(mockStorage)).toEqual({
                ...sessionData,
                pingVerified: false,
            });
        });

        it('clearSession: pubkeyHex指定時にprefixキーを削除', () => {
            mockStorage.setItem('nostr-nip46-session-mypub', 'data');
            mockStorage.setItem('nostr-nip46-session', 'legacy-data');
            Nip46Service.clearSession(mockStorage, 'mypub');
            expect(mockStorage.getItem('nostr-nip46-session-mypub')).toBeNull();
            // legacyキーは残る
            expect(mockStorage.getItem('nostr-nip46-session')).toBe('legacy-data');
        });

        it('loadSession: データがない場合null', () => {
            const loaded = Nip46Service.loadSession(mockStorage);
            expect(loaded).toBeNull();
        });

        it('loadSession: 不正なJSONの場合null', () => {
            mockStorage.setItem('nostr-nip46-session', 'not-json');
            const loaded = Nip46Service.loadSession(mockStorage);
            expect(loaded).toBeNull();
        });

        it('clearSession: セッションを削除', () => {
            mockStorage.setItem('nostr-nip46-session', 'data');
            Nip46Service.clearSession(mockStorage);
            expect(mockStorage.getItem('nostr-nip46-session')).toBeNull();
        });
    });

    describe('reconnect', () => {
        it('保存済みセッションから再接続（pingなし）', async () => {
            const { sessionData, mockSigner, pubkey, BunkerSigner } = await reconnectService();

            expect(pubkey).toBe(TEST_RECONNECT_PUBKEY);
            expect(service.isConnected()).toBe(true);
            expect(BunkerSigner.fromBunker).toHaveBeenCalled();
            expect(mockSigner.sendRequest).toHaveBeenCalledWith('connect', [
                sessionData.remoteSignerPubkey,
                '',
                NIP46_REQUESTED_PERMS,
            ]);
            expect(mockSigner.sendRequest).toHaveBeenCalledWith('get_public_key', []);
            expect(mockSigner.getPublicKey).not.toHaveBeenCalled();
            // pingはスキップされる（復元直後の未確認 session は手動確認または後続 recovery で検証する）
            expect(mockSigner.sendRequest).not.toHaveBeenCalledWith('ping', []);
            service.saveSession(mockStorage, sessionData.userPubkey);
            expect(JSON.parse(mockStorage.getItem(`nostr-nip46-session-${TEST_RECONNECT_PUBKEY}`)!)).toEqual(sessionData);
        });

        it('relayResolution が無い既存 session でも安全に再接続できる', async () => {
            const { pubkey } = await reconnectService({
                relayResolution: undefined,
            });

            expect(pubkey).toBe(TEST_RECONNECT_PUBKEY);
            expect(service.isConnected()).toBe(true);
        });

        it('live identity mismatchではcandidateだけをcleanupし、runtimeをcommitしない', async () => {
            const { BunkerSigner } = await import('nostr-tools/nip46');
            const session = {
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: 'd'.repeat(64),
                relays: ['wss://relay.test.com'],
                userPubkey: TEST_RECONNECT_PUBKEY,
                pingVerified: false,
            };
            const candidate = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(method === 'connect' ? 'ack' : TEST_USER_PUBKEY),
                ),
                getPublicKey: vi.fn(),
                bp: { pubkey: session.remoteSignerPubkey, relays: session.relays, secret: null },
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(candidate);

            await expect(service.reconnect(session)).rejects.toThrow(
                'Remote signer returned an unexpected user public key',
            );
            expect(candidate.sendRequest).toHaveBeenCalledWith('get_public_key', []);
            expect(candidate.getPublicKey).not.toHaveBeenCalled();
            expect(candidate.close).toHaveBeenCalledOnce();
            expect(service.getSigner()).toBeNull();
            expect(service.getUserPubkey()).toBeNull();
        });

        it('live identity timeout後のlate responseをruntimeへ反映しない', async () => {
            vi.useFakeTimers();
            const { BunkerSigner } = await import('nostr-tools/nip46');
            const identity = createDeferred<string>();
            const session = {
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: 'd'.repeat(64),
                relays: ['wss://relay.test.com'],
                userPubkey: TEST_RECONNECT_PUBKEY,
                pingVerified: false,
            };
            const candidate = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    method === 'connect' ? Promise.resolve('ack') : identity.promise,
                ),
                getPublicKey: vi.fn(),
                bp: { pubkey: session.remoteSignerPubkey, relays: session.relays, secret: null },
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(candidate);

            const reconnect = service.reconnect(session);
            const reconnectFailure = expect(reconnect).rejects.toThrow(
                'Timed out waiting for get_public_key response',
            );
            await vi.advanceTimersByTimeAsync(5000);
            await reconnectFailure;
            identity.resolve(TEST_RECONNECT_PUBKEY);
            await Promise.resolve();

            expect(candidate.close).toHaveBeenCalledOnce();
            expect(service.getSigner()).toBeNull();
            expect(service.getUserPubkey()).toBeNull();
        });

        it('auth challengeではURLを受け取らずcandidateをcleanupする', async () => {
            const { BunkerSigner } = await import('nostr-tools/nip46');
            const identity = createDeferred<string>();
            const session = {
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: 'd'.repeat(64),
                relays: ['wss://relay.test.com'],
                userPubkey: TEST_RECONNECT_PUBKEY,
                pingVerified: false,
            };
            const candidate = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    method === 'connect' ? Promise.resolve('ack') : identity.promise,
                ),
                getPublicKey: vi.fn(),
                bp: { pubkey: session.remoteSignerPubkey, relays: session.relays, secret: null },
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(candidate);

            const reconnect = service.reconnect(session);
            await vi.waitFor(() => {
                expect(candidate.sendRequest).toHaveBeenCalledWith('get_public_key', []);
            });
            const options = (BunkerSigner.fromBunker as any).mock.calls[0][2];
            options.onauth('https://secret.example/auth');

            await expect(reconnect).rejects.toThrow(
                'Remote signer requested authentication during automatic identity verification',
            );
            expect(candidate.close).toHaveBeenCalledOnce();
            expect(service.getSigner()).toBeNull();
        });
    });

    describe('ensureConnection', () => {
        it('未確認sessionではpingせずpool + BunkerSignerを再構築する', async () => {
            const { mockBp, mockSigner, BunkerSigner } = await connectService();
            const mockRebuiltSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(method === 'get_public_key' ? TEST_USER_PUBKEY : 'ack'),
                ),
                getPublicKey: vi.fn().mockResolvedValue(TEST_USER_PUBKEY),
                bp: mockBp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            const callCountAfterConnect = (BunkerSigner.fromBunker as any).mock.calls.length;
            (BunkerSigner.fromBunker as any).mockReturnValue(mockRebuiltSigner);

            const result = await service.ensureConnection();

            expect(result).toBe(true);
            expect(mockSigner.close).toHaveBeenCalled();
            expect(mockPool.destroy).toHaveBeenCalled();
            expect(mockSigner.sendRequest).not.toHaveBeenCalledWith('ping', []);
            expect((BunkerSigner.fromBunker as any).mock.calls.length - callCountAfterConnect).toBe(1);
        });

        it('ping確認済みsessionではpongならrebuildしない', async () => {
            const { mockSigner, BunkerSigner } = await reconnectService({
                pingVerified: true,
                signerOverrides: {
                    sendRequest: vi.fn().mockImplementation((method: string) =>
                        Promise.resolve(
                            method === 'get_public_key' ? TEST_RECONNECT_PUBKEY : 'pong',
                        ),
                    ),
                },
            });
            const callCountAfterReconnect = (BunkerSigner.fromBunker as any).mock.calls.length;

            const result = await service.ensureConnection();

            expect(result).toBe(true);
            expect(mockSigner.sendRequest).toHaveBeenCalledWith('ping', []);
            expect((BunkerSigner.fromBunker as any).mock.calls.length).toBe(callCountAfterReconnect);
        });

        it('ping確認済みsessionでauto pingが失敗したらfalseを永続化してからrebuildする', async () => {
            const { sessionData, mockSigner, BunkerSigner } = await reconnectService({
                pingVerified: true,
                signerOverrides: {
                    sendRequest: vi.fn().mockImplementation((method: string) =>
                        method === 'get_public_key'
                            ? Promise.resolve(TEST_RECONNECT_PUBKEY)
                            : method === 'connect'
                                ? Promise.resolve('ack')
                                : Promise.reject(new Error('offline')),
                    ),
                },
            });
            service.bindSessionPersistence(mockStorage, sessionData.userPubkey);
            const mockRebuiltSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(
                        method === 'get_public_key' ? sessionData.userPubkey : 'ack',
                    ),
                ),
                getPublicKey: vi.fn().mockResolvedValue(sessionData.userPubkey),
                bp: {
                    pubkey: sessionData.remoteSignerPubkey,
                    relays: sessionData.relays,
                    secret: null,
                },
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockRebuiltSigner);

            const result = await service.ensureConnection();

            expect(result).toBe(true);
            expect(mockSigner.sendRequest).toHaveBeenCalledWith('ping', []);
            expect(JSON.parse(mockStorage.getItem(`nostr-nip46-session-${TEST_RECONNECT_PUBKEY}`)!)).toEqual({
                ...sessionData,
                pingVerified: false,
            });
        });

        it('リレー再接続失敗時はfalseを返す', async () => {
            await connectService();
            mockPool.ensureRelay.mockRejectedValue(new Error('connection lost'));

            const result = await service.ensureConnection();
            expect(result).toBe(false);
        });

        it('未接続時はfalseを返す', async () => {
            const result = await service.ensureConnection();
            expect(result).toBe(false);
        });

        it('rebuildのidentity mismatchでは旧runtimeを無効化し、sessionとbindingを維持する', async () => {
            const { sessionData, mockSigner, BunkerSigner } = await reconnectService();
            service.bindSessionPersistence(mockStorage, sessionData.userPubkey);
            service.saveSession(mockStorage, sessionData.userPubkey);
            const candidate = {
                sendRequest: vi.fn().mockResolvedValue(TEST_USER_PUBKEY),
                getPublicKey: vi.fn(),
                bp: mockSigner.bp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(candidate);

            await expect(service.ensureConnection()).resolves.toBe(false);
            expect(candidate.close).toHaveBeenCalledOnce();
            expect(mockSigner.close).toHaveBeenCalledOnce();
            expect(service.getSigner()).toBeNull();
            expect(service.getUserPubkey()).toBeNull();
            expect((service as any).currentSession).toEqual(sessionData);
            expect(Nip46Service.loadSession(mockStorage, sessionData.userPubkey)).toEqual(sessionData);
        });

        it('rebuild persistence failureではcandidateをcommitせず旧runtimeを無効化する', async () => {
            const { sessionData, mockSigner, BunkerSigner } = await reconnectService();
            const failingStorage = {
                getItem: vi.fn(() => null),
                setItem: vi.fn(() => {
                    throw new Error('storage failed');
                }),
                removeItem: vi.fn(),
                clear: vi.fn(),
                key: vi.fn(() => null),
                length: 0,
            } as unknown as Storage;
            service.bindSessionPersistence(failingStorage, sessionData.userPubkey);
            const candidate = {
                sendRequest: vi.fn().mockResolvedValue(sessionData.userPubkey),
                getPublicKey: vi.fn(),
                bp: mockSigner.bp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(candidate);

            await expect(service.ensureConnection()).resolves.toBe(false);
            expect(failingStorage.setItem).toHaveBeenCalledOnce();
            expect(candidate.close).toHaveBeenCalledOnce();
            expect(mockSigner.close).toHaveBeenCalledOnce();
            expect(service.getSigner()).toBeNull();
            expect((service as any).currentSession).toEqual(sessionData);
        });

        it('bindingのみ変更されたrebuild candidateは保存もcommitもせず旧runtimeを無効化する', async () => {
            const { sessionData, mockSigner, BunkerSigner } = await reconnectService();
            const { SimplePool } = await import('nostr-tools/pool');
            const candidatePool = {
                ensureRelay: vi.fn().mockResolvedValue({}),
                subscribe: vi.fn(),
                destroy: vi.fn(),
            };
            (SimplePool as any).mockImplementationOnce(function () {
                return candidatePool;
            });
            const bindingA = new MockStorage();
            const bindingB = new MockStorage();
            service.bindSessionPersistence(bindingA, sessionData.userPubkey);
            const identity = createDeferred<string>();
            const candidate = {
                sendRequest: vi.fn().mockReturnValue(identity.promise),
                getPublicKey: vi.fn(),
                bp: mockSigner.bp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(candidate);

            const rebuild = service.ensureConnection();
            await vi.waitFor(() => {
                expect(candidate.sendRequest).toHaveBeenCalledWith('get_public_key', []);
            });
            service.bindSessionPersistence(bindingB, sessionData.userPubkey);
            identity.resolve(sessionData.userPubkey);

            await expect(rebuild).resolves.toBe(false);
            expect(bindingA.getItem(`nostr-nip46-session-${sessionData.userPubkey}`)).toBeNull();
            expect(bindingB.getItem(`nostr-nip46-session-${sessionData.userPubkey}`)).toBeNull();
            expect(candidate.close).toHaveBeenCalledOnce();
            expect(candidatePool.destroy).toHaveBeenCalledOnce();
            expect(mockSigner.close).toHaveBeenCalledOnce();
            expect((service as any).currentSession).toEqual(sessionData);
            expect((service as any).persistenceBinding.storage).toBe(bindingB);
        });
    });

    describe('getSignerForSession', () => {
        it('operationなしでは同一sessionのruntime signerを即時返す', async () => {
            const { pubkey } = await connectService();
            const ensureSpy = vi.spyOn(service, 'ensureConnection');

            const signer = await service.getSignerForSession(pubkey);

            expect(signer).toBe(service.getSigner());
            expect(ensureSpy).not.toHaveBeenCalled();
        });

        it('expectedPubkey不一致またはcurrentSessionなしでは再接続しない', async () => {
            await connectService();
            const ensureSpy = vi.spyOn(service, 'ensureConnection');

            expect(await service.getSignerForSession('different-pubkey')).toBeNull();
            await service.disconnect();
            expect(await service.getSignerForSession(TEST_USER_PUBKEY)).toBeNull();
            expect(ensureSpy).not.toHaveBeenCalled();
        });

        it('auto recovery失敗を待った要求は同じ呼び出し内で1回だけ再接続して新しいsignerを返す', async () => {
            const { mockBp, pubkey, BunkerSigner } = await connectService();
            const failedRecovery = createDeferred<unknown>();
            mockPool.ensureRelay
                .mockReturnValueOnce(failedRecovery.promise)
                .mockResolvedValue({});
            const rebuiltSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(method === 'get_public_key' ? pubkey : 'ack'),
                ),
                getPublicKey: vi.fn().mockResolvedValue(pubkey),
                bp: mockBp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(rebuiltSigner);
            const ensureSpy = vi.spyOn(service, 'ensureConnection');

            const visibilityRecovery = service.ensureConnection();
            const signerPromise = service.getSignerForSession(pubkey);
            failedRecovery.reject(new Error('android websocket not ready'));

            await expect(visibilityRecovery).resolves.toBe(false);
            await expect(signerPromise).resolves.toBe(service.getSigner());
            expect(service.getSigner()).not.toBeNull();
            expect(ensureSpy).toHaveBeenCalledTimes(2);
        });

        it('auto recovery失敗後の同時取得要求は限定再接続を共有する', async () => {
            const { mockBp, pubkey, BunkerSigner } = await connectService();
            const failedRecovery = createDeferred<unknown>();
            const limitedRecovery = createDeferred<unknown>();
            mockPool.ensureRelay
                .mockReturnValueOnce(failedRecovery.promise)
                .mockReturnValueOnce(limitedRecovery.promise);
            const rebuiltSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(method === 'get_public_key' ? pubkey : 'ack'),
                ),
                getPublicKey: vi.fn().mockResolvedValue(pubkey),
                bp: mockBp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            const callCountBeforeRecovery = (BunkerSigner.fromBunker as any).mock.calls.length;
            (BunkerSigner.fromBunker as any).mockReturnValue(rebuiltSigner);

            const visibilityRecovery = service.ensureConnection();
            const firstSigner = service.getSignerForSession(pubkey);
            const secondSigner = service.getSignerForSession(pubkey);
            failedRecovery.reject(new Error('background connection failed'));
            await expect(visibilityRecovery).resolves.toBe(false);
            limitedRecovery.resolve({});

            const [first, second] = await Promise.all([firstSigner, secondSigner]);
            expect(first).toBe(second);
            expect(first).toBe(service.getSigner());
            expect((BunkerSigner.fromBunker as any).mock.calls.length - callCountBeforeRecovery).toBe(1);
        });

        it('auto recovery後の限定再接続も失敗した場合はnullを返し、別操作は再試行できる', async () => {
            const { pubkey } = await connectService();
            mockPool.ensureRelay
                .mockRejectedValueOnce(new Error('auto failed'))
                .mockRejectedValueOnce(new Error('limited failed'))
                .mockResolvedValue({});

            const visibilityRecovery = service.ensureConnection();
            await expect(service.getSignerForSession(pubkey)).resolves.toBeNull();
            await expect(visibilityRecovery).resolves.toBe(false);
            await expect(service.getSignerForSession(pubkey)).resolves.not.toBeNull();
        });

        it('manual check失敗を待った要求は古いsignerを返さず同じ呼び出し内で再接続しない', async () => {
            const manualPing = createDeferred<string>();
            const { sessionData } = await reconnectService({
                pingVerified: true,
                signerOverrides: {
                    sendRequest: vi.fn().mockImplementation((method: string) =>
                        method === 'get_public_key'
                            ? Promise.resolve(TEST_RECONNECT_PUBKEY)
                            : method === 'connect'
                                ? Promise.resolve('ack')
                                : manualPing.promise,
                    ),
                },
            });
            const ensureSpy = vi.spyOn(service, 'ensureConnection');

            const manualCheck = service.runManualConnectionCheck();
            const signerPromise = service.getSignerForSession(sessionData.userPubkey);
            manualPing.resolve('not-pong');

            await expect(manualCheck).resolves.toEqual({ success: false });
            await expect(signerPromise).resolves.toBeNull();
            expect(ensureSpy).not.toHaveBeenCalled();
            await expect(
                service.getSignerForSession(sessionData.userPubkey),
            ).resolves.toBe(service.getSigner());
        });

        it('manual check失敗後の別操作でsignerがなければensureConnectionを1回試す', async () => {
            const { sessionData, BunkerSigner } = await reconnectService({
                signerOverrides: {
                    sendRequest: vi.fn().mockImplementation((method: string) =>
                        Promise.resolve(
                            method === 'get_public_key'
                                ? TEST_RECONNECT_PUBKEY
                                : 'not-pong',
                        ),
                    ),
                },
            });
            await expect(service.runManualConnectionCheck()).resolves.toEqual({
                success: false,
            });
            (service as any).signerAdapter = null;
            const rebuiltSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(
                        method === 'get_public_key' ? sessionData.userPubkey : 'ack',
                    ),
                ),
                getPublicKey: vi.fn().mockResolvedValue(sessionData.userPubkey),
                bp: {
                    pubkey: sessionData.remoteSignerPubkey,
                    relays: sessionData.relays,
                    secret: null,
                },
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(rebuiltSigner);
            const ensureSpy = vi.spyOn(service, 'ensureConnection');

            await expect(
                service.getSignerForSession(sessionData.userPubkey),
            ).resolves.not.toBeNull();
            expect(ensureSpy).toHaveBeenCalledOnce();
        });

        it('rebuild検証中は旧runtimeを保持しつつ、signer取得はcandidate完了を待つ', async () => {
            const liveIdentity = createDeferred<string>();
            const { mockBp, mockSigner, BunkerSigner, pubkey } = await connectService();
            const rebuiltSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    method === 'get_public_key'
                        ? liveIdentity.promise
                        : Promise.resolve('ack'),
                ),
                getPublicKey: vi.fn().mockResolvedValue(TEST_USER_PUBKEY),
                bp: mockBp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(rebuiltSigner);

            const recovery = service.ensureConnection();
            await vi.waitFor(() => {
                expect(rebuiltSigner.sendRequest).toHaveBeenCalledWith(
                    'get_public_key',
                    [],
                );
            });
            const signerPromise = service.getSignerForSession(pubkey);

            expect(mockSigner.close).not.toHaveBeenCalled();
            liveIdentity.resolve(pubkey);
            await expect(recovery).resolves.toBe(true);
            await expect(signerPromise).resolves.toBe(service.getSigner());
            expect(mockSigner.close).toHaveBeenCalledOnce();
        });

        it('rebuild待機中にlogoutした場合は候補をcommitせずsignerを返さない', async () => {
            const { mockBp, pubkey, BunkerSigner } = await connectService();
            const relayConnection = createDeferred<unknown>();
            mockPool.ensureRelay.mockReturnValueOnce(relayConnection.promise);
            const staleCandidate = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(method === 'get_public_key' ? pubkey : 'ack'),
                ),
                getPublicKey: vi.fn().mockResolvedValue(pubkey),
                bp: mockBp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(staleCandidate);

            const recovery = service.ensureConnection();
            const signerPromise = service.getSignerForSession(pubkey);
            await vi.waitFor(() => {
                expect(mockPool.ensureRelay).toHaveBeenCalledTimes(2);
            });
            await service.disconnect();
            relayConnection.resolve({});

            await expect(recovery).resolves.toBe(false);
            await expect(signerPromise).resolves.toBeNull();
            expect(service.getSigner()).toBeNull();
            expect(staleCandidate.close).toHaveBeenCalledOnce();
        });

        it('session切替中に完了した古いrebuild候補をcommitせず候補資源を閉じる', async () => {
            const { pubkey, BunkerSigner } = await connectService();
            const { SimplePool } = await import('nostr-tools/pool');
            const oldRelay = createDeferred<unknown>();
            const stalePool = {
                ensureRelay: vi.fn().mockReturnValue(oldRelay.promise),
                subscribe: vi.fn(),
                destroy: vi.fn(),
            };
            const currentPool = {
                ensureRelay: vi.fn().mockResolvedValue({}),
                subscribe: vi.fn(),
                destroy: vi.fn(),
            };
            (SimplePool as any)
                .mockImplementationOnce(function () {
                    return stalePool;
                })
                .mockImplementationOnce(function () {
                    return currentPool;
                });
            const currentSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(
                        method === 'get_public_key' ? TEST_NEW_USER_PUBKEY : 'ack',
                    ),
                ),
                getPublicKey: vi.fn().mockResolvedValue(TEST_NEW_USER_PUBKEY),
                bp: {
                    pubkey: 'e'.repeat(64),
                    relays: ['wss://new.example'],
                    secret: null,
                },
                close: vi.fn().mockResolvedValue(undefined),
            };
            const staleSigner = {
                sendRequest: vi.fn().mockImplementation((method: string) =>
                    Promise.resolve(method === 'get_public_key' ? pubkey : 'ack'),
                ),
                getPublicKey: vi.fn().mockResolvedValue(pubkey),
                bp: {
                    pubkey: 'a'.repeat(64),
                    relays: ['wss://relay.example.com'],
                    secret: null,
                },
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any)
                .mockReturnValueOnce(currentSigner)
                .mockReturnValueOnce(staleSigner);

            const staleRecovery = service.ensureConnection();
            await vi.waitFor(() => expect(stalePool.ensureRelay).toHaveBeenCalled());
            await service.reconnect({
                clientSecretKeyHex: 'cd'.repeat(32),
                remoteSignerPubkey: 'e'.repeat(64),
                relays: ['wss://new.example'],
                userPubkey: TEST_NEW_USER_PUBKEY,
                pingVerified: false,
            });
            oldRelay.resolve({});

            await expect(staleRecovery).resolves.toBe(false);
            expect(service.getUserPubkey()).toBe(TEST_NEW_USER_PUBKEY);
            expect(await service.getSignerForSession(TEST_NEW_USER_PUBKEY)).toBe(service.getSigner());
            expect(staleSigner.close).toHaveBeenCalledOnce();
            expect(stalePool.destroy).toHaveBeenCalledOnce();
            expect(currentSigner.close).not.toHaveBeenCalled();
            expect(currentPool.destroy).not.toHaveBeenCalled();
        });
    });

    describe('runManualConnectionCheck', () => {
        it('manual ping成功でpingVerifiedをtrue保存する', async () => {
            const { sessionData, mockSigner } = await reconnectService({
                pingVerified: false,
                signerOverrides: {
                    sendRequest: vi.fn().mockImplementation((method: string) =>
                        Promise.resolve(
                            method === 'get_public_key' ? TEST_RECONNECT_PUBKEY : 'pong',
                        ),
                    ),
                },
            });
            service.bindSessionPersistence(mockStorage, sessionData.userPubkey);

            const result = await service.runManualConnectionCheck();

            expect(result).toEqual({ success: true });
            expect(mockSigner.sendRequest).toHaveBeenCalledWith('ping', []);
            expect(JSON.parse(mockStorage.getItem(`nostr-nip46-session-${TEST_RECONNECT_PUBKEY}`)!)).toEqual({
                ...sessionData,
                pingVerified: true,
            });
        });

        it('manual ping失敗でpingVerifiedをfalse保存する', async () => {
            const { sessionData, mockSigner } = await reconnectService({
                pingVerified: true,
                signerOverrides: {
                    sendRequest: vi.fn().mockImplementation((method: string) =>
                        method === 'get_public_key'
                            ? Promise.resolve(TEST_RECONNECT_PUBKEY)
                            : method === 'connect'
                                ? Promise.resolve('ack')
                                : Promise.reject(new Error('permission denied')),
                    ),
                },
            });
            service.bindSessionPersistence(mockStorage, sessionData.userPubkey);

            const result = await service.runManualConnectionCheck();

            expect(result).toEqual({ success: false });
            expect(mockSigner.sendRequest).toHaveBeenCalledWith('ping', []);
            expect(JSON.parse(mockStorage.getItem(`nostr-nip46-session-${TEST_RECONNECT_PUBKEY}`)!)).toEqual({
                ...sessionData,
                pingVerified: false,
            });
        });
    });
});
