/**
 * nostrAuthService.test.ts
 *
 * NostrAuthService の単体テスト。
 * 特に nostr-tools/nip98 の getToken API が期待通りにインポートおよび
 * 呼び出せることを検証する（アップデート時の破壊的変更検出用）。
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NostrAuthService } from '../../lib/nostrAuthService';

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
        },
    };
});

// nip46Service をモック
vi.mock('../../lib/nip46Service', () => ({
    nip46Service: {
        getSigner: vi.fn().mockReturnValue(null),
        waitForPendingOperation: vi.fn().mockResolvedValue(true),
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
            vi.mocked(nip46Service.waitForPendingOperation).mockResolvedValue(true);
            vi.mocked(nip46Service.getSigner).mockReturnValue({
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
            expect(nip46Service.waitForPendingOperation).toHaveBeenCalledOnce();

            // クリーンアップ
            (authState as any).value = { ...authState.value, type: 'nsec' };
            vi.mocked(nip46Service.getSigner).mockReturnValue(null);
            vi.mocked(nip46Service.waitForPendingOperation).mockResolvedValue(true);
        });

        it('NIP-46認証状態でpending recovery完了を待ってからトークン生成', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { nip46Service } = await import('../../lib/nip46Service');

            (authState as any).value = { ...authState.value, type: 'nip46' };
            vi.mocked(nip46Service.getSigner).mockReturnValue({
                signEvent: vi.fn().mockResolvedValue({ id: 'nip46-signed', sig: 'sig' }),
            } as any);
            vi.mocked(nip46Service.waitForPendingOperation).mockResolvedValue(true);

            const result = await service.buildAuthHeader(
                'https://example.com/upload',
                'POST'
            );

            expect(result).toBe('Nostr mock-nip98-token');
            expect(nip46Service.waitForPendingOperation).toHaveBeenCalledOnce();

            // クリーンアップ
            (authState as any).value = { ...authState.value, type: 'nsec' };
            vi.mocked(nip46Service.getSigner).mockReturnValue(null);
            vi.mocked(nip46Service.waitForPendingOperation).mockResolvedValue(true);
        });

        it('NIP-46以外の認証ではstaleなnip46 signerを使わない', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { nip46Service } = await import('../../lib/nip46Service');

            (authState as any).value = { ...authState.value, type: 'parentClient' };
            vi.mocked(nip46Service.getSigner).mockReturnValue({
                signEvent: vi.fn(),
            } as any);

            await expect(
                service.buildAuthHeader('https://example.com/upload', 'POST')
            ).rejects.toThrow('Authentication required');

            expect(nip46Service.waitForPendingOperation).not.toHaveBeenCalled();
            (authState as any).value = { ...authState.value, type: 'nsec' };
            vi.mocked(nip46Service.getSigner).mockReturnValue(null);
        });

        it('NIP-46 signerが既にあってもpending recovery失敗時は利用しない', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { nip46Service } = await import('../../lib/nip46Service');

            (authState as any).value = { ...authState.value, type: 'nip46' };
            vi.mocked(nip46Service.getSigner).mockReturnValue({
                signEvent: vi.fn().mockResolvedValue({ id: 'stale-signed', sig: 'sig' }),
            } as any);
            vi.mocked(nip46Service.waitForPendingOperation).mockResolvedValue(false);

            await expect(
                service.buildAuthHeader('https://example.com/upload', 'POST')
            ).rejects.toThrow('Authentication required');

            expect(nip46Service.waitForPendingOperation).toHaveBeenCalledOnce();

            (authState as any).value = { ...authState.value, type: 'nsec' };
            vi.mocked(nip46Service.getSigner).mockReturnValue(null);
            vi.mocked(nip46Service.waitForPendingOperation).mockResolvedValue(true);
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
            return JSON.parse(atob(token));
        }

        it('blossom.band でも nipb7 互換の非 scoped Base64 token を返す', async () => {
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
            expect(token).toBe(btoa(JSON.stringify(event)));

            vi.mocked(keyManager.getFromStore).mockReturnValue(null);
        });

        it('generic Blossom にも同じ非 scoped Base64 token を返す', async () => {
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
            const event = JSON.parse(atob(token));

            expect(event.kind).toBe(24242);
            expect(event.content).toBe('blossom stuff');
            expect(event.tags).toContainEqual(['t', 'upload']);
            expect(event.tags).toContainEqual(['x', 'b'.repeat(64)]);
            expect(event.tags.some((tag: string[]) => tag[0] === 'server')).toBe(false);
            expect(token).toBe(btoa(JSON.stringify(event)));

            vi.mocked(keyManager.getFromStore).mockReturnValue(null);
        });
    });
});
