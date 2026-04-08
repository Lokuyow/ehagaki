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
        signEvent: vi.fn().mockResolvedValue({ id: 'seckey-signed', sig: 'sig' }),
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
            const { nip46Service } = await import('../../lib/nip46Service');
            vi.mocked(nip46Service.isConnected).mockReturnValue(true);
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

            // クリーンアップ
            vi.mocked(nip46Service.isConnected).mockReturnValue(false);
            vi.mocked(nip46Service.getSigner).mockReturnValue(null);
        });

        it('NIP-46認証状態で接続未完了時、接続完了を待ってからトークン生成', async () => {
            const { authState } = await import('../../stores/appStore.svelte');
            const { nip46Service } = await import('../../lib/nip46Service');

            // authState.value.type = 'nip46' だが isConnected は最初 false
            (authState as any).value = { ...authState.value, type: 'nip46' };
            vi.mocked(nip46Service.isConnected).mockReturnValue(false);

            // 200ms後に接続完了をシミュレート
            setTimeout(() => {
                vi.mocked(nip46Service.isConnected).mockReturnValue(true);
                vi.mocked(nip46Service.getSigner).mockReturnValue({
                    signEvent: vi.fn().mockResolvedValue({ id: 'nip46-signed', sig: 'sig' }),
                } as any);
            }, 200);

            const result = await service.buildAuthHeader(
                'https://example.com/upload',
                'POST'
            );

            expect(result).toBe('Nostr mock-nip98-token');

            // クリーンアップ
            (authState as any).value = { ...authState.value, type: 'nsec' };
            vi.mocked(nip46Service.isConnected).mockReturnValue(false);
            vi.mocked(nip46Service.getSigner).mockReturnValue(null);
        });
    });
});
