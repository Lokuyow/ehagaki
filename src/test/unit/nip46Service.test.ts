import { describe, it, expect, vi, beforeEach } from 'vitest';
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

    beforeEach(() => {
        service = new Nip46Service();
        mockStorage = new MockStorage();
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
                connect: vi.fn().mockResolvedValue(undefined),
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
        });

        it('無効なbunker URLでエラー', async () => {
            const { parseBunkerInput } = await import('nostr-tools/nip46');
            (parseBunkerInput as any).mockResolvedValue(null);

            await expect(service.connect('invalid-url')).rejects.toThrow('Invalid bunker URL');
        });
    });

    describe('disconnect', () => {
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
                connect: vi.fn().mockResolvedValue(undefined),
                getPublicKey: vi.fn().mockResolvedValue('user-pubkey-hex'),
                bp: mockBp,
                close: vi.fn().mockResolvedValue(undefined),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            await service.connect(`bunker://${'a'.repeat(64)}`);
            expect(service.isConnected()).toBe(true);

            await service.disconnect();
            expect(mockSigner.close).toHaveBeenCalled();
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
                connect: vi.fn().mockResolvedValue(undefined),
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
        it('保存済みセッションから再接続', async () => {
            const { BunkerSigner } = await import('nostr-tools/nip46');
            const sessionData = {
                clientSecretKeyHex: 'ab'.repeat(32),
                remoteSignerPubkey: 'd'.repeat(64),
                relays: ['wss://relay.test.com'],
                userPubkey: 'user-pub-reconnect',
            };

            const mockSigner = {
                connect: vi.fn().mockResolvedValue(undefined),
                getPublicKey: vi.fn().mockResolvedValue('user-pub-reconnect'),
                bp: { pubkey: 'd'.repeat(64), relays: ['wss://relay.test.com'], secret: null },
                close: vi.fn(),
            };
            (BunkerSigner.fromBunker as any).mockReturnValue(mockSigner);

            const pubkey = await service.reconnect(sessionData);

            expect(pubkey).toBe('user-pub-reconnect');
            expect(service.isConnected()).toBe(true);
            expect(BunkerSigner.fromBunker).toHaveBeenCalled();
            expect(mockSigner.connect).toHaveBeenCalled();
        });
    });
});
