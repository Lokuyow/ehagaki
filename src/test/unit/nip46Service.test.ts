import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Nip46SignerAdapter, Nip46Service } from '../../lib/nip46Service';
import { MockStorage } from '../helpers';

// nostr-tools/nip46 をモック
vi.mock('nostr-tools/nip46', () => ({
    BunkerSigner: {
        fromBunker: vi.fn(),
    },
    parseBunkerInput: vi.fn(),
    BUNKER_REGEX: /^bunker:\/\/[0-9a-f]{64}\??[?\/\w:.=&%-]*$/,
}));

// nostr-tools/pool をモック
const mockPool = {
    ensureRelay: vi.fn().mockResolvedValue({}),
    destroy: vi.fn(),
};
vi.mock('nostr-tools/pool', () => ({
    SimplePool: vi.fn(() => mockPool),
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

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    beforeEach(() => {
        service = new Nip46Service();
        mockStorage = new MockStorage();
        mockPool.ensureRelay.mockReset().mockResolvedValue({});
        mockPool.destroy.mockReset();
    });

    describe('connect', () => {
        it('有効なbunker URLで接続成功', async () => {
            const { parseBunkerInput } = await import('nostr-tools/nip46');
            const { BunkerSigner } = await import('nostr-tools/nip46');

            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: ['wss://relay.example.com'],
                secret: 'test-secret',
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            const mockSigner = {
                sendRequest: vi.fn().mockResolvedValue('ack'),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
                bp: mockBp,
                close: vi.fn(),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            const pubkey = await service.connect(`bunker://${'a'.repeat(64)}`);

            expect(pubkey).toBe('user-pubkey-hex');
            expect(service.isConnected()).toBe(true);
            expect(service.getUserPubkey()).toBe('user-pubkey-hex');
            expect(service.getSigner()).not.toBeNull();
            expect(mockSigner.sendRequest).toHaveBeenCalledWith(
                'connect',
                [mockBp.pubkey, 'test-secret', 'sign_event:1,sign_event:27235']
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
            const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');
            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: ['wss://relay.example.com'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            const mockSigner = {
                sendRequest: vi.fn().mockResolvedValue('ack'),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
                bp: mockBp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            await service.connect(`bunker://${'a'.repeat(64)}`);
            await service.disconnect();
            await service.disconnect(); // 二重呼び出し → エラーにならない
            expect(service.isConnected()).toBe(false);
        });

        it('接続済みの場合close()を呼び状態をクリア', async () => {
            // 先に接続をセットアップ
            const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');
            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: ['wss://relay.example.com'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            const mockSigner = {
                sendRequest: vi.fn().mockResolvedValue('ack'),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
                bp: mockBp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            await service.connect(`bunker://${'a'.repeat(64)}`);
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
            // 接続をセットアップ
            const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');
            const mockBp = {
                pubkey: 'b'.repeat(64),
                relays: ['wss://relay1.example.com', 'wss://relay2.example.com'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            const mockSigner = {
                sendRequest: vi.fn().mockResolvedValue('ack'),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
                bp: mockBp,
                close: vi.fn(),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            await service.connect(`bunker://${'b'.repeat(64)}`);
            service.saveSession(mockStorage);

            const saved = mockStorage.getItem('nostr-nip46-session');
            expect(saved).not.toBeNull();

            const parsed = JSON.parse(saved!);
            expect(parsed.remoteSignerPubkey).toBe('b'.repeat(64));
            expect(parsed.relays).toEqual(['wss://relay1.example.com', 'wss://relay2.example.com']);
            expect(parsed.userPubkey).toBe('user-pubkey-hex');
            expect(typeof parsed.clientSecretKeyHex).toBe('string');
        });

        it('saveSession: pubkeyHex指定時にprefixキーで保存', async () => {
            const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');
            const mockBp = {
                pubkey: 'b'.repeat(64),
                relays: ['wss://relay1.example.com'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            const mockSigner = {
                sendRequest: vi.fn().mockResolvedValue('ack'),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
                bp: mockBp,
                close: vi.fn(),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            await service.connect(`bunker://${'b'.repeat(64)}`);
            service.saveSession(mockStorage, 'user-pubkey-hex');

            // per-userキーに保存される
            const saved = mockStorage.getItem('nostr-nip46-session-user-pubkey-hex');
            expect(saved).not.toBeNull();
            // legacyキーには保存されない
            expect(mockStorage.getItem('nostr-nip46-session')).toBeNull();
        });

        it('loadSession: 保存済みセッションを復元', () => {
            const sessionData = {
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: 'c'.repeat(64),
                relays: ['wss://relay.test.com'],
                userPubkey: 'user-pub',
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
            };
            mockStorage.setItem('nostr-nip46-session-user-pub', JSON.stringify(sessionData));

            const loaded = Nip46Service.loadSession(mockStorage, 'user-pub');
            expect(loaded).toEqual(sessionData);
            // legacyキーからは読まない
            expect(Nip46Service.loadSession(mockStorage)).toBeNull();
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
            const { BunkerSigner } = await import('nostr-tools/nip46');
            const sessionData = {
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: 'd'.repeat(64),
                relays: ['wss://relay.test.com'],
                userPubkey: 'user-pub-reconnect',
            };

            const mockSigner = {
                ping: vi.fn().mockResolvedValue(undefined),
                getPublicKey: vi.fn().mockResolvedValue('user-pub-reconnect'),
                bp: { pubkey: 'd'.repeat(64), relays: ['wss://relay.test.com'], secret: null },
                close: vi.fn(),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            const pubkey = await service.reconnect(sessionData);

            expect(pubkey).toBe('user-pub-reconnect');
            expect(service.isConnected()).toBe(true);
            expect(BunkerSigner.fromBunker).toHaveBeenCalled();
            // pingはスキップされる（Amber等のリモートサイナー対応）
            expect(mockSigner.ping).not.toHaveBeenCalled();
        });
    });

    describe('ensureConnection', () => {
        it('接続済みの場合、pool + BunkerSignerを完全再構築しtrueを返す', async () => {
            const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');
            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: ['wss://relay.example.com'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            const mockSigner = {
                sendRequest: vi.fn().mockResolvedValue('ack'),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
                bp: mockBp,
                close: vi.fn(),
            };
            const mockRebuiltSigner = {
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
                bp: mockBp,
                close: vi.fn(),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            await service.connect(`bunker://${'a'.repeat(64)}`);
            const callCountAfterConnect = (BunkerSigner.fromBunker as any).mock.calls.length;

            // ensureConnection時はrebuiltSignerを返す
            (BunkerSigner.fromBunker as any).mockReturnValue(mockRebuiltSigner);
            const result = await service.ensureConnection();

            expect(result).toBe(true);
            // 古いsignerとpoolが破棄される
            expect(mockSigner.close).toHaveBeenCalled();
            expect(mockPool.destroy).toHaveBeenCalled();
            // BunkerSignerが1回再作成される
            expect((BunkerSigner.fromBunker as any).mock.calls.length - callCountAfterConnect).toBe(1);
        });

        it('リレー再接続失敗時はfalseを返す', async () => {
            const { parseBunkerInput, BunkerSigner } = await import('nostr-tools/nip46');
            const mockBp = {
                pubkey: 'a'.repeat(64),
                relays: ['wss://relay.example.com'],
                secret: null,
            };
            (parseBunkerInput as any).mockResolvedValue(mockBp);

            const mockSigner = {
                sendRequest: vi.fn().mockResolvedValue('ack'),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
                bp: mockBp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            await service.connect(`bunker://${'a'.repeat(64)}`);

            // createConnectedPool内のensureRelayを失敗させる
            mockPool.ensureRelay.mockRejectedValue(new Error('connection lost'));

            const result = await service.ensureConnection();

            expect(result).toBe(false);
        });

        it('未接続時はfalseを返す', async () => {
            const result = await service.ensureConnection();
            expect(result).toBe(false);
        });
    });
});
