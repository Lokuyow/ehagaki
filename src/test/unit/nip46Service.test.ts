import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    Nip46SignerAdapter,
    Nip46Service,
    NIP46_REQUESTED_PERMISSIONS,
    NIP46_REQUESTED_PERMS,
} from '../../lib/nip46Service';
import { MockStorage } from '../helpers';

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
    }) => {
        const query = new URLSearchParams();
        for (const relay of params.relays) {
            query.append('relay', relay);
        }
        query.set('secret', params.secret);
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
});

// --- Nip46Service テスト ---
describe('Nip46Service', () => {
    let service: Nip46Service;
    let mockStorage: MockStorage;

    function createDeferred<T>() {
        let resolve: ((value: T | PromiseLike<T>) => void) | undefined;
        let reject: ((reason?: unknown) => void) | undefined;
        const promise = new Promise<T>((resolvePromise, rejectPromise) => {
            resolve = resolvePromise;
            reject = rejectPromise;
        });

        return {
            promise,
            resolve: resolve!,
            reject: reject!,
        };
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

        const mockSigner = {
            sendRequest: vi.fn().mockResolvedValue('ack'),
            getPublicKey: vi.fn().mockResolvedValue(options.userPubkey ?? 'user-pubkey-hex'),
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
        relayResolution?: 'signer-negotiated' | 'signer-confirmed-unchanged' | 'client-initial-fallback';
        signerOverrides?: Record<string, unknown>;
    } = {}) {
        const { BunkerSigner } = await import('nostr-tools/nip46');
        const sessionData = {
            clientSecretKeyHex: options.clientSecretKeyHex ?? 'ab'.repeat(32),
            remoteSignerPubkey: options.remoteSignerPubkey ?? 'd'.repeat(64),
            relays: options.relays ?? ['wss://relay.test.com'],
            userPubkey: options.userPubkey ?? 'user-pub-reconnect',
            pingVerified: options.pingVerified ?? false,
            ...(options.relayResolution
                ? { relayResolution: options.relayResolution }
                : {}),
        };

        const mockSigner = {
            sendRequest: vi.fn(),
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

    async function createPendingFallbackNostrConnect(options: {
        initialRelays?: string[];
        remoteSignerPubkey?: string;
        sendRequestResult?: string;
        sendRequestError?: unknown;
        sendRequestPromise?: Promise<string>;
        userPubkey?: string;
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

        const mockSigner = {
            sendRequest,
            getPublicKey: vi.fn().mockResolvedValue(options.userPubkey ?? 'user-pubkey-hex'),
            bp: {
                pubkey: remoteSignerPubkey,
                relays: initialRelays,
                secret: sharedSecret,
            },
            close: vi.fn().mockResolvedValue(undefined),
        };
        (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

        const pending = await service.startNostrConnect(initialRelays);
        const handlers = await getPendingNostrConnectHandlers();

        return {
            pending,
            handlers,
            mockSigner,
            closeSubscription,
            initialRelays,
            remoteSignerPubkey,
        };
    }

    describe('connect', () => {
        it('有効なbunker URLで接続成功', async () => {
            const { mockBp, mockSigner } = await connectService({ secret: 'test-secret' });
            const pubkey = service.getUserPubkey();

            expect(pubkey).toBe('user-pubkey-hex');
            expect(service.isConnected()).toBe(true);
            expect(service.getUserPubkey()).toBe('user-pubkey-hex');
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
                sendRequest: vi.fn().mockResolvedValue('ack'),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
                bp: {
                    pubkey: mockBp.pubkey,
                    relays: ['wss://relay.example.com'],
                    secret: null,
                },
                close: vi.fn(),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            const pubkey = await service.connect(`bunker://${'a'.repeat(64)}`);

            expect(pubkey).toBe('user-pubkey-hex');
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

        it('relaysが空の場合エラー', async () => {
            const { parseBunkerInput } = await import('nostr-tools/nip46');

            (parseBunkerInput as any).mockResolvedValue({
                pubkey: 'a'.repeat(64),
                relays: [],
                secret: null,
            });

            await expect(service.connect(`bunker://${'a'.repeat(64)}`)).rejects.toThrow('No relays specified');
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
                sendRequest: vi.fn().mockResolvedValue(JSON.stringify(finalRelays)),
                getPublicKey: vi.fn().mockResolvedValue('interim-user-pubkey-hex'),
                bp: {
                    pubkey: remoteSignerPubkey,
                    relays: initialRelays,
                    secret: 'ab'.repeat(32),
                },
                close: vi.fn().mockResolvedValue(undefined),
            };
            const finalSigner = {
                sendRequest: vi.fn(),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
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
            expect(createNostrConnectURI).toHaveBeenCalledWith(
                expect.objectContaining({
                    relays: initialRelays,
                    perms: [...NIP46_REQUESTED_PERMISSIONS],
                }),
            );

            const handlers = await getPendingNostrConnectHandlers();
            await handlers.onevent({
                content: 'encrypted-content',
                pubkey: remoteSignerPubkey,
            });

            const pubkey = await pending.completion;

            expect(pubkey).toBe('user-pubkey-hex');
            expect(interimSigner.sendRequest).toHaveBeenCalledWith('switch_relays', []);
            expect(closeSubscription).toHaveBeenCalled();
            expect(interimSigner.close).toHaveBeenCalled();

            service.saveSession(mockStorage, pubkey);
            expect(Nip46Service.loadSession(mockStorage, pubkey)).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey,
                relays: finalRelays,
                userPubkey: 'user-pubkey-hex',
                pingVerified: false,
                relayResolution: 'signer-negotiated',
            });
        });

        it('switch_relays が null を返した場合は initial relay を signer-confirmed-unchanged として保存する', async () => {
            const {
                pending,
                handlers,
                initialRelays,
                remoteSignerPubkey,
            } = await createPendingFallbackNostrConnect({
                sendRequestResult: 'null',
            });

            await handlers.onevent({
                content: 'encrypted-content',
                pubkey: remoteSignerPubkey,
            });

            const pubkey = await pending.completion;

            expect(pubkey).toBe('user-pubkey-hex');
            service.saveSession(mockStorage, pubkey);
            expect(Nip46Service.loadSession(mockStorage, pubkey)).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey,
                relays: initialRelays,
                userPubkey: 'user-pubkey-hex',
                pingVerified: false,
                relayResolution: 'signer-confirmed-unchanged',
            });
        });

        it('switch_relays が unsupported method error を返した場合は initial relay fallback で接続成功する', async () => {
            const {
                pending,
                handlers,
                initialRelays,
                remoteSignerPubkey,
            } = await createPendingFallbackNostrConnect({
                sendRequestError: 'unsupported method: switch_relays',
            });

            await handlers.onevent({
                content: 'encrypted-content',
                pubkey: remoteSignerPubkey,
            });

            const pubkey = await pending.completion;

            expect(pubkey).toBe('user-pubkey-hex');
            service.saveSession(mockStorage, pubkey);
            expect(Nip46Service.loadSession(mockStorage, pubkey)).toEqual({
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey,
                relays: initialRelays,
                userPubkey: 'user-pubkey-hex',
                pingVerified: false,
                relayResolution: 'client-initial-fallback',
            });
        });

        it('switch_relays timeout では session を保存せず接続失敗として cleanup する', async () => {
            vi.useFakeTimers();

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

            await expect(pendingFlow.pending.completion).rejects.toThrow(
                'Timed out waiting for switch_relays response',
            );
            service.saveSession(mockStorage, 'user-pubkey-hex');
            expect(
                mockStorage.getItem('nostr-nip46-session-user-pubkey-hex'),
            ).toBeNull();
            expect(pendingFlow.closeSubscription).toHaveBeenCalled();
            expect(pendingFlow.mockSigner.close).toHaveBeenCalled();
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
                'user-pubkey-hex',
            );
        });

        it('relay 接続失敗時は ready / completion の両方が失敗し cleanup される', async () => {
            mockPool.ensureRelay.mockRejectedValue(new Error('connection timed out'));

            const pending = await service.startNostrConnect([
                'wss://relay.example.com',
            ]);

            await expect(pending.ready).rejects.toThrow('Relay connection failed');
            await expect(pending.completion).rejects.toThrow('Relay connection failed');
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
                await expect(pendingFlow.pending.completion).rejects.toThrow(
                    'Timed out waiting for switch_relays response',
                );
            } finally {
                process.off('unhandledRejection', onUnhandledRejection);
            }
        });

        it('client-initial fallback で保存した session は reconnect / rebuild / ping に initial relay を使える', async () => {
            const pendingFlow = await createPendingFallbackNostrConnect({
                initialRelays: ['wss://relay.initial.example.com'],
                sendRequestError: 'unsupported method: switch_relays',
                userPubkey: 'user-pubkey-hex',
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
                userPubkey: 'user-pubkey-hex',
                pingVerified: false,
                relayResolution: 'client-initial-fallback',
            });

            const restoredService = new Nip46Service();
            const { BunkerSigner } = await import('nostr-tools/nip46');
            const reconnectSigner = {
                sendRequest: vi.fn().mockResolvedValue('pong'),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
                bp: {
                    pubkey: pendingFlow.remoteSignerPubkey,
                    relays: ['wss://relay.initial.example.com'],
                    secret: null,
                },
                close: vi.fn().mockResolvedValue(undefined),
            };
            const rebuiltSigner = {
                sendRequest: vi.fn(),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
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
            service.saveSession(mockStorage, 'user-pubkey-hex');
            expect(
                mockStorage.getItem('nostr-nip46-session-user-pubkey-hex'),
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
            service.saveSession(mockStorage, 'user-pubkey-hex');
            expect(
                mockStorage.getItem('nostr-nip46-session-user-pubkey-hex'),
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
            expect(parsed.userPubkey).toBe('user-pubkey-hex');
            expect(typeof parsed.clientSecretKeyHex).toBe('string');
            expect(parsed.pingVerified).toBe(false);
        });

        it('saveSession: pubkeyHex指定時にprefixキーで保存', async () => {
            await connectService({
                remoteSignerPubkey: 'b'.repeat(64),
                relays: ['wss://relay1.example.com'],
            });
            service.saveSession(mockStorage, 'user-pubkey-hex');

            // per-userキーに保存される
            const saved = mockStorage.getItem('nostr-nip46-session-user-pubkey-hex');
            expect(saved).not.toBeNull();
            // legacyキーには保存されない
            expect(mockStorage.getItem('nostr-nip46-session')).toBeNull();
        });

        it('saveSession は last-used NIP-46 connection relay を上書きしない', async () => {
            mockStorage.setItem(
                'nostr-nip46-connect-relays',
                JSON.stringify(['wss://ui-relay.example.com/']),
            );
            await connectService({
                remoteSignerPubkey: 'b'.repeat(64),
                relays: ['wss://relay1.example.com'],
            });

            service.saveSession(mockStorage, 'user-pubkey-hex');

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

            expect(pubkey).toBe('user-pub-reconnect');
            expect(service.isConnected()).toBe(true);
            expect(BunkerSigner.fromBunker).toHaveBeenCalled();
            // pingはスキップされる（復元直後の未確認 session は手動確認または後続 recovery で検証する）
            expect(mockSigner.sendRequest).not.toHaveBeenCalled();
            service.saveSession(mockStorage, sessionData.userPubkey);
            expect(JSON.parse(mockStorage.getItem('nostr-nip46-session-user-pub-reconnect')!)).toEqual(sessionData);
        });

        it('relayResolution が無い既存 session でも安全に再接続できる', async () => {
            const { pubkey } = await reconnectService({
                relayResolution: undefined,
            });

            expect(pubkey).toBe('user-pub-reconnect');
            expect(service.isConnected()).toBe(true);
        });
    });

    describe('ensureConnection', () => {
        it('未確認sessionではpingせずpool + BunkerSignerを再構築する', async () => {
            const { mockBp, mockSigner, BunkerSigner } = await connectService();
            const mockRebuiltSigner = {
                sendRequest: vi.fn(),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
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
                    sendRequest: vi.fn().mockResolvedValue('pong'),
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
                    sendRequest: vi.fn().mockRejectedValue(new Error('offline')),
                },
            });
            service.bindSessionPersistence(mockStorage, sessionData.userPubkey);
            const mockRebuiltSigner = {
                sendRequest: vi.fn(),
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
            expect(JSON.parse(mockStorage.getItem('nostr-nip46-session-user-pub-reconnect')!)).toEqual({
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
    });

    describe('runManualConnectionCheck', () => {
        it('manual ping成功でpingVerifiedをtrue保存する', async () => {
            const { sessionData, mockSigner } = await reconnectService({
                pingVerified: false,
                signerOverrides: {
                    sendRequest: vi.fn().mockResolvedValue('pong'),
                },
            });
            service.bindSessionPersistence(mockStorage, sessionData.userPubkey);

            const result = await service.runManualConnectionCheck();

            expect(result).toEqual({ success: true });
            expect(mockSigner.sendRequest).toHaveBeenCalledWith('ping', []);
            expect(JSON.parse(mockStorage.getItem('nostr-nip46-session-user-pub-reconnect')!)).toEqual({
                ...sessionData,
                pingVerified: true,
            });
        });

        it('manual ping失敗でpingVerifiedをfalse保存する', async () => {
            const { sessionData, mockSigner } = await reconnectService({
                pingVerified: true,
                signerOverrides: {
                    sendRequest: vi.fn().mockRejectedValue(new Error('permission denied')),
                },
            });
            service.bindSessionPersistence(mockStorage, sessionData.userPubkey);

            const result = await service.runManualConnectionCheck();

            expect(result).toEqual({ success: false });
            expect(mockSigner.sendRequest).toHaveBeenCalledWith('ping', []);
            expect(JSON.parse(mockStorage.getItem('nostr-nip46-session-user-pub-reconnect')!)).toEqual({
                ...sessionData,
                pingVerified: false,
            });
        });
    });
});
