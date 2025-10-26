import { describe, it, expect, vi } from 'vitest';
import { AuthValidator } from '../../lib/authService';

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

// keyManagerのモック
vi.mock("../../lib/keyManager", () => ({
    keyManager: {
        isValidNsec: vi.fn(),
        saveToStorage: vi.fn(),
        derivePublicKey: vi.fn(),
        loadFromStorage: vi.fn()
    },
    KeyManager: vi.fn(),
    PublicKeyState: vi.fn()
}));

/**
 * 認証サービス統合テスト
 * バリデーション、認証、初期化の統合フロー
 */
describe('認証サービス統合テスト', () => {
    describe('Nsecバリデーション統合', () => {
        it('有効なNsecが正しくバリデーションされること', async () => {
            const validNsec = 'nsec1test1234567890abcdefghijklmnopqrstuvwxyz1234567890ab';
            
            const { keyManager } = await import('../../lib/keyManager');
            (keyManager.isValidNsec as any).mockReturnValue(true);
            
            const isValid = AuthValidator.isValidSecretKey(validNsec, keyManager);
            
            expect(isValid).toBe(true);
            expect(keyManager.isValidNsec).toHaveBeenCalledWith(validNsec);
        });

        it('無効なNsecが拒否されること', async () => {
            const invalidNsec = 'invalid-nsec';
            
            const { keyManager } = await import('../../lib/keyManager');
            (keyManager.isValidNsec as any).mockReturnValue(false);
            
            const isValid = AuthValidator.isValidSecretKey(invalidNsec, keyManager);
            
            expect(isValid).toBe(false);
        });

        it('短すぎるNsecが拒否されること', async () => {
            const shortNsec = 'nsec123';
            
            const { keyManager } = await import('../../lib/keyManager');
            (keyManager.isValidNsec as any).mockReturnValue(false);
            
            const isValid = AuthValidator.isValidSecretKey(shortNsec, keyManager);
            
            expect(isValid).toBe(false);
        });

        it('様々なNsecフォーマットが正しく検証されること', async () => {
            const testCases = [
                { nsec: 'nsec1' + 'a'.repeat(58), shouldBeValid: true },
                { nsec: 'nsec1' + 'b'.repeat(59), shouldBeValid: true },
                { nsec: 'nsec1abc', shouldBeValid: false },
                { nsec: '', shouldBeValid: false },
                { nsec: 'npub1' + 'a'.repeat(58), shouldBeValid: false },
            ];

            const { keyManager } = await import('../../lib/keyManager');

            for (const testCase of testCases) {
                (keyManager.isValidNsec as any).mockReturnValue(testCase.shouldBeValid);
                const result = AuthValidator.isValidSecretKey(testCase.nsec, keyManager);
                expect(result).toBe(testCase.shouldBeValid);
            }
        });
    });

    describe('NostrLoginAuth統合', () => {
        it('pubkeyを持つログイン認証が検証されること', () => {
            const auth = {
                type: 'login' as const,
                pubkey: '1234567890abcdef',
                npub: 'npub1test'
            };

            const hasPubkey = AuthValidator.hasRequiredPubkey(auth);
            
            expect(hasPubkey).toBe(true);
        });

        it('pubkeyが無い場合は検証が失敗すること', () => {
            const auth = {
                type: 'login' as const,
                pubkey: '',
                npub: ''
            };

            const hasPubkey = AuthValidator.hasRequiredPubkey(auth);
            
            expect(hasPubkey).toBe(false);
        });

        it('ログアウト認証が正しく識別されること', () => {
            const logoutAuth = {
                type: 'logout' as const,
                pubkey: '',
                npub: ''
            };

            const isLogout = AuthValidator.isLogoutAuth(logoutAuth);
            
            expect(isLogout).toBe(true);
        });

        it('ログインタイプはログアウトとして識別されないこと', () => {
            const loginAuth = {
                type: 'login' as const,
                pubkey: '1234567890abcdef',
                npub: 'npub1test'
            };

            const isLogout = AuthValidator.isLogoutAuth(loginAuth);
            
            expect(isLogout).toBe(false);
        });
    });

    describe('認証バリデーション複合シナリオ', () => {
        it('有効なNsecとNostrLogin両方が使える状態が確認できること', async () => {
            const validNsec = 'nsec1test1234567890abcdefghijklmnopqrstuvwxyz1234567890ab';
            const nostrLoginAuth = {
                type: 'login' as const,
                pubkey: 'abcdef1234567890',
                npub: 'npub1test'
            };

            const { keyManager } = await import('../../lib/keyManager');
            (keyManager.isValidNsec as any).mockReturnValue(true);

            // Nsecバリデーション
            const nsecValid = AuthValidator.isValidSecretKey(validNsec, keyManager);
            expect(nsecValid).toBe(true);

            // NostrLoginバリデーション
            const nostrLoginValid = AuthValidator.hasRequiredPubkey(nostrLoginAuth);
            expect(nostrLoginValid).toBe(true);

            // 両方とも有効
            expect(nsecValid && nostrLoginValid).toBe(true);
        });

        it('無効なNsecとログアウト状態が検出されること', async () => {
            const invalidNsec = 'invalid';
            const logoutAuth = {
                type: 'logout' as const,
                pubkey: '',
                npub: ''
            };

            const { keyManager } = await import('../../lib/keyManager');
            (keyManager.isValidNsec as any).mockReturnValue(false);

            // Nsecバリデーション
            const nsecValid = AuthValidator.isValidSecretKey(invalidNsec, keyManager);
            expect(nsecValid).toBe(false);

            // ログアウト検出
            const isLogout = AuthValidator.isLogoutAuth(logoutAuth);
            expect(isLogout).toBe(true);

            // 両方とも無効/ログアウト状態
            expect(!nsecValid && isLogout).toBe(true);
        });
    });

    describe('認証フロー遷移統合', () => {
        it('未認証→Nsec認証→認証済みの状態遷移が表現できること', async () => {
            const { keyManager } = await import('../../lib/keyManager');

            // 1. 未認証状態
            (keyManager.loadFromStorage as any).mockReturnValue(null);
            const stored = keyManager.loadFromStorage();
            expect(stored).toBeNull();

            // 2. Nsecを入力して認証
            const nsec = 'nsec1test1234567890abcdefghijklmnopqrstuvwxyz1234567890ab';
            (keyManager.isValidNsec as any).mockReturnValue(true);
            const isValid = AuthValidator.isValidSecretKey(nsec, keyManager);
            expect(isValid).toBe(true);

            // 3. 保存
            (keyManager.saveToStorage as any).mockReturnValue({ success: true });
            const saveResult = keyManager.saveToStorage(nsec);
            expect(saveResult.success).toBe(true);

            // 4. 公開鍵導出
            (keyManager.derivePublicKey as any).mockReturnValue({
                hex: '1234567890abcdef',
                npub: 'npub1test',
                nprofile: 'nprofile1test'
            });
            const derived = keyManager.derivePublicKey(nsec);
            expect(derived.hex).toBe('1234567890abcdef');
        });

        it('認証済み→ログアウト→未認証の状態遷移が表現できること', async () => {
            const { keyManager } = await import('../../lib/keyManager');

            // 1. 認証済み状態
            const storedNsec = 'nsec1stored';
            (keyManager.loadFromStorage as any).mockReturnValue(storedNsec);
            const stored = keyManager.loadFromStorage();
            expect(stored).toBe(storedNsec);

            // 2. ログアウト（空文字列で保存）
            (keyManager.saveToStorage as any).mockReturnValue({ success: true });
            const logoutResult = keyManager.saveToStorage('');
            expect(logoutResult.success).toBe(true);

            // 3. 未認証状態に戻る
            (keyManager.loadFromStorage as any).mockReturnValue(null);
            const afterLogout = keyManager.loadFromStorage();
            expect(afterLogout).toBeNull();
        });
    });

    describe('エラーハンドリング統合', () => {
        it('公開鍵導出エラーが検出できること', async () => {
            const nsec = 'nsec1test1234567890abcdefghijklmnopqrstuvwxyz1234567890ab';
            const { keyManager } = await import('../../lib/keyManager');

            (keyManager.isValidNsec as any).mockReturnValue(true);
            (keyManager.derivePublicKey as any).mockImplementation(() => {
                throw new Error('Derivation failed');
            });

            expect(() => {
                keyManager.derivePublicKey(nsec);
            }).toThrow('Derivation failed');
        });

        it('ストレージ保存失敗が検出できること', async () => {
            const nsec = 'nsec1test1234567890abcdefghijklmnopqrstuvwxyz1234567890ab';
            const { keyManager } = await import('../../lib/keyManager');

            (keyManager.saveToStorage as any).mockReturnValue({ success: false });
            const result = keyManager.saveToStorage(nsec);
            
            expect(result.success).toBe(false);
        });
    });
});
