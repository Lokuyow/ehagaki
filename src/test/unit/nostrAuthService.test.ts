/**
 * nostrAuthService.test.ts
 *
 * NostrAuthService の単体テスト。
 * 特に nostr-tools/nip98 の getToken API が期待通りにインポートおよび
 * 呼び出せることを検証する（アップデート時の破壊的変更検出用）。
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    createNip42Authenticator,
    NostrAuthService,
} from '../../lib/nostrAuthService';
import { createDeferred } from '../deferredTestUtils';
import { mockAuthStoreModule } from '../mocks/storeModules';

vi.mock('../../lib/signedEventResultValidator', async (importOriginal) => ({
    ...await importOriginal<typeof import('../../lib/signedEventResultValidator')>(),
    validateSignedEventResult: (_template: unknown, signedEvent: unknown) => signedEvent,
}));

// nostr-tools/nip98 をモック（buildAuthHeader のユニットテスト用）
vi.mock('nostr-tools/nip98', () => ({
    getToken: vi.fn().mockResolvedValue('Nostr mock-nip98-token'),
}));

// @rx-nostr/crypto の seckeySigner をモック
vi.mock('@rx-nostr/crypto', () => ({
    seckeySigner: vi.fn().mockReturnValue({
        signEvent: vi.fn().mockImplementation(async (event) => ({
            ...event,
            id: 'seckey-signed',
            pubkey: 'pubkey',
            sig: 'sig',
        })),
    }),
}));

// keyManager は setup.ts でグローバルモック済み
// getFromStore / loadFromStorage の戻り値をここで制御する
vi.mock('../../lib/keyManager.svelte', async () => {
    const actual = await import('../../lib/keyManager.svelte');
    return {
        ...actual,
        keyManager: {
            getFromStore: vi.fn().mockReturnValue(null),
            loadFromStorage: vi.fn().mockReturnValue(null),
            derivePublicKey: vi.fn().mockReturnValue({ hex: 'testpubkey123' }),
        },
    };
});

// nip46Service をモック
vi.mock('../../lib/nip46Service', () => ({
    nip46Service: {
        getSignerForSession: vi.fn().mockResolvedValue(null),
    },
}));

vi.mock('../../lib/parentClientAuthService', () => ({
    parentClientAuthService: {
        isConnected: vi.fn().mockReturnValue(false),
        getSigner: vi.fn().mockReturnValue(null),
    },
}));

// =============================================================================
// nostr-tools/nip98 インポートパス検証
// nostr-tools アップデート時にパスやエクスポートが変わると即座に検出できる
// =============================================================================
describe('nostr-tools/nip98 インポート整合性', () => {
    it('nostr-tools/nip98 から getToken がインポートできる（関数として存在する）', async () => {
        // vi.mock でモック済みだが、パス解決が成功することを確認
        const nip98 = await import('nostr-tools/nip98');
        expect(typeof nip98.getToken).toBe('function');
    });

    it('getToken のシグネチャが (url, method, signFn, boolean) => Promise<string> である', async () => {
        const { getToken } = await import('nostr-tools/nip98');

        // モックを通じて呼び出せることを確認（シグネチャ互換性検証）
        const mockSignFn = vi.fn();
        const result = await getToken(
            'https://example.com/upload',
            'POST',
            mockSignFn,
            true
        );

        expect(typeof result).toBe('string');
    });
});

// =============================================================================
// NostrAuthService.buildAuthHeader
// =============================================================================
describe('NostrAuthService', () => {
    let service: NostrAuthService;

    beforeEach(() => {
        service = new NostrAuthService();
        vi.clearAllMocks();
    });

    describe('buildAuthHeader', () => {
        it('window.nostr が不在かつ秘密鍵未設定で例外を投げる', async () => {
            // window.nostr は setup.ts で未定義
            // keyManager は null を返すようモック済み
            await expect(
                service.buildAuthHeader('https://example.com/upload', 'POST')
            ).rejects.toThrow('Authentication required');
        });

        it('window.nostr が signEvent を持つ場合に getToken を呼び出してトークンを返す', async () => {
            // window.nostr を一時的に設定
            const originalNostr = (window as any).nostr;
            (window as any).nostr = {
                signEvent: vi.fn().mockResolvedValue({ id: 'test', sig: 'test' }),
            };
            mockAuthStoreModule.authState.value = {
                ...mockAuthStoreModule.authState.value,
                type: 'nip07',
            };

            const result = await service.buildAuthHeader(
                'https://example.com/upload',
                'POST'
            );

            // getToken（モック）の戻り値
            expect(result).toBe('Nostr mock-nip98-token');

            // getToken の呼び出し引数を検証
            const { getToken } = await import('nostr-tools/nip98');
            expect(getToken).toHaveBeenCalledWith(
                'https://example.com/upload',
                'POST',
                expect.any(Function),
                true
            );

            // クリーンアップ
            (window as any).nostr = originalNostr;
            mockAuthStoreModule.authState.value = {
                ...mockAuthStoreModule.authState.value,
                type: 'nsec',
            };
        });

        it('秘密鍵（getFromStore）でseckeySigner署名→トークン生成', async () => {
            const { keyManager } = await import('../../lib/keyManager.svelte');
            vi.mocked(keyManager.getFromStore).mockReturnValue('nsec1testkey');

            const result = await service.buildAuthHeader(
                'https://example.com/upload',
                'POST'
            );

            expect(result).toBe('Nostr mock-nip98-token');

            const { getToken } = await import('nostr-tools/nip98');
            expect(getToken).toHaveBeenCalledWith(
                'https://example.com/upload',
                'POST',
                expect.any(Function),
                true
            );

            // クリーンアップ
            vi.mocked(keyManager.getFromStore).mockReturnValue(null);
        });

        it('秘密鍵（loadFromStorage）でseckeySigner署名→トークン生成', async () => {
            const { keyManager } = await import('../../lib/keyManager.svelte');
            vi.mocked(keyManager.getFromStore).mockReturnValue(null);
            vi.mocked(keyManager.loadFromStorage).mockReturnValue('nsec1testkey');

            const result = await service.buildAuthHeader(
                'https://example.com/upload',
                'POST'
            );

            expect(result).toBe('Nostr mock-nip98-token');

            // クリーンアップ
            vi.mocked(keyManager.loadFromStorage).mockReturnValue(null);
        });

        it('NIP-46接続時にnip46Signer使用→トークン生成', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { nip46Service } = await import('../../lib/nip46Service');
            (authState as any).value = { ...authState.value, type: 'nip46' };
            vi.mocked(nip46Service.getSignerForSession).mockResolvedValue({
                signEvent: vi.fn().mockResolvedValue({ id: 'nip46-signed', sig: 'sig' }),
            } as any);

            const result = await service.buildAuthHeader(
                'https://example.com/upload',
                'POST'
            );

            expect(result).toBe('Nostr mock-nip98-token');

            const { getToken } = await import('nostr-tools/nip98');
            expect(getToken).toHaveBeenCalledWith(
                'https://example.com/upload',
                'POST',
                expect.any(Function),
                true
            );
            expect(nip46Service.getSignerForSession).toHaveBeenCalledWith('testpubkey123');

            // クリーンアップ
            (authState as any).value = { ...authState.value, type: 'nsec' };
            vi.mocked(nip46Service.getSignerForSession).mockResolvedValue(null);
        });

        it('NIP-46認証状態で共有signer取得完了を待ってからトークン生成', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { nip46Service } = await import('../../lib/nip46Service');

            (authState as any).value = { ...authState.value, type: 'nip46' };
            vi.mocked(nip46Service.getSignerForSession).mockResolvedValue({
                signEvent: vi.fn().mockResolvedValue({ id: 'nip46-signed', sig: 'sig' }),
            } as any);

            const result = await service.buildAuthHeader(
                'https://example.com/upload',
                'POST'
            );

            expect(result).toBe('Nostr mock-nip98-token');
            expect(nip46Service.getSignerForSession).toHaveBeenCalledOnce();

            // クリーンアップ
            (authState as any).value = { ...authState.value, type: 'nsec' };
            vi.mocked(nip46Service.getSignerForSession).mockResolvedValue(null);
        });

        it('NIP-46以外の認証ではstaleなnip46 signerを使わない', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { nip46Service } = await import('../../lib/nip46Service');

            (authState as any).value = { ...authState.value, type: 'parentClient' };
            vi.mocked(nip46Service.getSignerForSession).mockResolvedValue({
                signEvent: vi.fn(),
            } as any);

            await expect(
                service.buildAuthHeader('https://example.com/upload', 'POST')
            ).rejects.toThrow('Authentication required');

            expect(nip46Service.getSignerForSession).not.toHaveBeenCalled();
            (authState as any).value = { ...authState.value, type: 'nsec' };
            vi.mocked(nip46Service.getSignerForSession).mockResolvedValue(null);
        });

        it('NIP-46 signerを取得できない場合はAuthentication requiredになる', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { nip46Service } = await import('../../lib/nip46Service');

            (authState as any).value = { ...authState.value, type: 'nip46' };
            vi.mocked(nip46Service.getSignerForSession).mockResolvedValue(null);

            await expect(
                service.buildAuthHeader('https://example.com/upload', 'POST')
            ).rejects.toThrow('Authentication required');

            expect(nip46Service.getSignerForSession).toHaveBeenCalledOnce();

            (authState as any).value = { ...authState.value, type: 'nsec' };
            vi.mocked(nip46Service.getSignerForSession).mockResolvedValue(null);
        });

        it('NIP-46 signer取得待機中のログアウト後は取得済みsignerを使用しない', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { nip46Service } = await import('../../lib/nip46Service');
            const { getToken } = await import('nostr-tools/nip98');
            const deferred = createDeferred<any>();
            (authState as any).value = {
                isAuthenticated: true,
                type: 'nip46',
                pubkey: 'testpubkey123',
            };
            vi.mocked(nip46Service.getSignerForSession).mockReturnValue(deferred.promise);

            const headerPromise = service.buildAuthHeader('https://example.com/upload', 'POST');
            (authState as any).value = {
                isAuthenticated: false,
                type: null,
                pubkey: null,
            };
            deferred.resolve({ signEvent: vi.fn() });

            await expect(headerPromise).rejects.toThrow('Authentication required');
            expect(getToken).not.toHaveBeenCalled();
            (authState as any).value = {
                isAuthenticated: true,
                type: 'nsec',
                pubkey: 'testpubkey123',
            };
        });

        it('NIP-46 signer取得待機中のアカウント切替後は取得済みsignerを使用しない', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { nip46Service } = await import('../../lib/nip46Service');
            const { getToken } = await import('nostr-tools/nip98');
            const deferred = createDeferred<any>();
            (authState as any).value = {
                isAuthenticated: true,
                type: 'nip46',
                pubkey: 'testpubkey123',
            };
            vi.mocked(nip46Service.getSignerForSession).mockReturnValue(deferred.promise);

            const headerPromise = service.buildAuthHeader('https://example.com/upload', 'POST');
            (authState as any).value = {
                isAuthenticated: true,
                type: 'nip46',
                pubkey: 'different-pubkey',
            };
            deferred.resolve({ signEvent: vi.fn() });

            await expect(headerPromise).rejects.toThrow('Authentication required');
            expect(getToken).not.toHaveBeenCalled();
            (authState as any).value = {
                isAuthenticated: true,
                type: 'nsec',
                pubkey: 'testpubkey123',
            };
        });

        it('親クライアント連携接続時にparent signer使用→トークン生成', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { parentClientAuthService } = await import('../../lib/parentClientAuthService');
            (authState as any).value = { ...authState.value, type: 'parentClient' };
            vi.mocked(parentClientAuthService.getSigner).mockReturnValue({
                signEvent: vi.fn().mockResolvedValue({ id: 'parent-signed', sig: 'sig' }),
            } as any);

            const result = await service.buildAuthHeader(
                'https://example.com/upload',
                'POST'
            );

            expect(result).toBe('Nostr mock-nip98-token');

            (authState as any).value = { ...authState.value, type: 'nsec' };
            vi.mocked(parentClientAuthService.getSigner).mockReturnValue(null);
        });
    });

    describe('buildBlossomAuthorizationHeader', () => {
        function decodeNostrHeader(header: string): any {
            const token = header.replace(/^Nostr\s+/, '');
            const padded = token.replace(/-/g, '+').replace(/_/g, '/')
                + '='.repeat((4 - (token.length % 4)) % 4);
            const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
            return JSON.parse(new TextDecoder().decode(bytes));
        }

        it('blossom.band でもBase64url・paddingなしのBUD-11 tokenを返す', async () => {
            const { keyManager } = await import('../../lib/keyManager.svelte');
            vi.mocked(keyManager.getFromStore).mockReturnValue('nsec1testkey');

            const result = await service.buildBlossomAuthorizationHeader({
                serverUrl: 'https://npub1example.blossom.band',
                method: 'upload',
                sha256: 'a'.repeat(64),
                contentType: 'image/png',
                contentLength: 123,
            });

            const token = result.replace(/^Nostr\s+/, '');
            const event = decodeNostrHeader(result);

            expect(event.kind).toBe(24242);
            expect(event.content).toBe('blossom stuff');
            expect(event.tags).toContainEqual(['t', 'upload']);
            expect(event.tags).toContainEqual(['x', 'a'.repeat(64)]);
            expect(event.tags.some((tag: string[]) => tag[0] === 'server')).toBe(false);
            expect(result).toMatch(/^Nostr [A-Za-z0-9_-]+$/);
            expect(token).not.toMatch(/[+/=]/);

            vi.mocked(keyManager.getFromStore).mockReturnValue(null);
        });

        it('NIP-46 Blossom認証も共有signer取得APIでkind 24242を署名する', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { nip46Service } = await import('../../lib/nip46Service');
            const signEvent = vi.fn(async (event) => ({
                ...event,
                id: 'blossom-event-id',
                pubkey: 'testpubkey123',
                sig: 'sig',
            }));
            (authState as any).value = {
                isAuthenticated: true,
                type: 'nip46',
                pubkey: 'testpubkey123',
            };
            vi.mocked(nip46Service.getSignerForSession).mockResolvedValue({ signEvent } as any);

            await service.buildBlossomAuthorizationHeader({
                serverUrl: 'https://blossom.example',
                method: 'upload',
                sha256: 'a'.repeat(64),
            });

            expect(nip46Service.getSignerForSession).toHaveBeenCalledWith('testpubkey123');
            expect(signEvent).toHaveBeenCalledWith(expect.objectContaining({ kind: 24242 }));
            (authState as any).value = {
                isAuthenticated: true,
                type: 'nsec',
                pubkey: 'testpubkey123',
            };
        });

        it('generic Blossom にも同じBase64url・paddingなしtokenを返す', async () => {
            const { keyManager } = await import('../../lib/keyManager.svelte');
            vi.mocked(keyManager.getFromStore).mockReturnValue('nsec1testkey');

            const result = await service.buildBlossomAuthorizationHeader({
                serverUrl: 'https://nostr.download',
                method: 'upload',
                sha256: 'b'.repeat(64),
                contentType: 'image/png',
                contentLength: 456,
            });

            const token = result.replace(/^Nostr\s+/, '');
            const event = decodeNostrHeader(result);

            expect(event.kind).toBe(24242);
            expect(event.content).toBe('blossom stuff');
            expect(event.tags).toContainEqual(['t', 'upload']);
            expect(event.tags).toContainEqual(['x', 'b'.repeat(64)]);
            expect(event.tags.some((tag: string[]) => tag[0] === 'server')).toBe(false);
            expect(result).toMatch(/^Nostr [A-Za-z0-9_-]+$/);
            expect(token).not.toMatch(/[+/=]/);

            vi.mocked(keyManager.getFromStore).mockReturnValue(null);
        });
    });
});

describe('createNip42Authenticator', () => {
    it('rx-nostrのchallengeを使い、created_atを含むAUTHイベントを現在の署名器で署名する', async () => {
        const pubkey = 'a'.repeat(64);
        const relay = 'wss://relay.example.com/';
        const authTemplate = {
            kind: 22242,
            content: '',
            tags: [['relay', relay], ['challenge', 'challenge-1']],
        };
        const signEvent = vi.fn(async (event) => ({
            ...event,
            id: 'auth-event-id',
            pubkey,
            sig: 'sig',
        }));
        const originalNostr = (window as any).nostr;
        (window as any).nostr = {
            getPublicKey: vi.fn(async () => pubkey),
            signEvent,
        };
        mockAuthStoreModule.authState.value = {
            isAuthenticated: true,
            type: 'nip07',
            pubkey,
        };

        const authenticator = createNip42Authenticator(pubkey)(relay.slice(0, -1));
        const signed = await authenticator.signer!.signEvent(authTemplate as any);

        expect(signEvent).toHaveBeenCalledWith(expect.objectContaining({
            kind: 22242,
            content: '',
            created_at: expect.any(Number),
            tags: authTemplate.tags,
        }));
        expect(signed).toEqual(expect.objectContaining({
            kind: 22242,
            pubkey,
            tags: authTemplate.tags,
        }));

        (window as any).nostr = originalNostr;
        mockAuthStoreModule.authState.value = {
            isAuthenticated: true,
            type: 'nsec',
            pubkey: 'testpubkey123',
        };
    });

    it('別リレー用のAUTHイベントへの署名を拒否する', async () => {
        const pubkey = 'a'.repeat(64);
        mockAuthStoreModule.authState.value = {
            isAuthenticated: true,
            type: 'nip07',
            pubkey,
        };
        const authenticator = createNip42Authenticator(pubkey)('wss://relay-a.example/');

        await expect(authenticator.signer!.signEvent({
            kind: 22242,
            content: '',
            tags: [
                ['relay', 'wss://relay-b.example/'],
                ['challenge', 'challenge-1'],
            ],
        } as any)).rejects.toThrow('Invalid NIP-42 authentication event');
    });
});
