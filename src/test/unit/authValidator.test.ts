import { describe, it, expect, vi } from 'vitest';
import type { AuthServiceDependencies } from '../../lib/types';
import { MockStorage, MockKeyManager } from '../helpers';

vi.mock('../../lib/nip46Service', () => ({
    nip46Service: {
        connect: vi.fn(),
        reconnect: vi.fn(),
        disconnect: vi.fn().mockResolvedValue(undefined),
        isConnected: vi.fn().mockReturnValue(false),
        getSigner: vi.fn().mockReturnValue(null),
        getUserPubkey: vi.fn().mockReturnValue(null),
        saveSession: vi.fn(),
    },
    Nip46Service: {
        loadSession: vi.fn().mockReturnValue(null),
        clearSession: vi.fn(),
    },
    BUNKER_REGEX: /^bunker:\/\/[0-9a-f]{64}\??[?\/\w:.=&%-]*$/,
}));

import { AuthService } from '../../lib/authService';

/**
 * 認証バリデーション ユニットテスト
 * AuthService.authenticateWithNsec経由でバリデーションを検証
 */
describe('認証バリデーション ユニットテスト', () => {
    function createAuthService(keyManager: MockKeyManager): AuthService {
        return new AuthService({
            keyManager: keyManager as any,
            localStorage: new MockStorage(),
            window: { location: { pathname: '/' } } as Window,
            navigator: {} as Navigator,
            console: { log: vi.fn(), error: vi.fn(), warn: vi.fn() } as unknown as Console,
            setNsecAuth: vi.fn(),
            setNip07Auth: vi.fn(),
            setNip46Auth: vi.fn(),
        });
    }

    describe('Nsecバリデーション', () => {
        it('有効なNsecで認証が成功すること', async () => {
            const mockKeyManager = new MockKeyManager();
            mockKeyManager.isValidNsec.mockReturnValue(true);
            mockKeyManager.saveToStorage.mockReturnValue({ success: true });
            mockKeyManager.derivePublicKey.mockReturnValue({
                hex: '1234567890abcdef',
                npub: 'npub1test',
                nprofile: 'nprofile1test'
            });

            const authService = createAuthService(mockKeyManager);
            const result = await authService.authenticateWithNsec('nsec1test1234567890abcdefghijklmnopqrstuvwxyz1234567890ab');

            expect(result.success).toBe(true);
            expect(mockKeyManager.isValidNsec).toHaveBeenCalled();
        });

        it('無効なNsecが拒否されること', async () => {
            const mockKeyManager = new MockKeyManager();
            mockKeyManager.isValidNsec.mockReturnValue(false);

            const authService = createAuthService(mockKeyManager);
            const result = await authService.authenticateWithNsec('invalid-nsec');

            expect(result.success).toBe(false);
            expect(result.error).toBe('invalid_secret');
        });

        it('短すぎるNsecが拒否されること', async () => {
            const mockKeyManager = new MockKeyManager();
            mockKeyManager.isValidNsec.mockReturnValue(false);

            const authService = createAuthService(mockKeyManager);
            const result = await authService.authenticateWithNsec('nsec123');

            expect(result.success).toBe(false);
            expect(result.error).toBe('invalid_secret');
        });

        it('様々なNsecフォーマットが正しく検証されること', async () => {
            const testCases = [
                { nsec: 'nsec1' + 'a'.repeat(58), shouldBeValid: true },
                { nsec: 'nsec1' + 'b'.repeat(59), shouldBeValid: true },
                { nsec: 'nsec1abc', shouldBeValid: false },
                { nsec: '', shouldBeValid: false },
                { nsec: 'npub1' + 'a'.repeat(58), shouldBeValid: false },
            ];

            for (const testCase of testCases) {
                const mockKeyManager = new MockKeyManager();
                mockKeyManager.isValidNsec.mockReturnValue(testCase.shouldBeValid);
                if (testCase.shouldBeValid) {
                    mockKeyManager.saveToStorage.mockReturnValue({ success: true });
                    mockKeyManager.derivePublicKey.mockReturnValue({
                        hex: 'abcdef',
                        npub: 'npub1test',
                        nprofile: 'nprofile1test'
                    });
                }

                const authService = createAuthService(mockKeyManager);
                const result = await authService.authenticateWithNsec(testCase.nsec);
                expect(result.success).toBe(testCase.shouldBeValid);
            }
        });
    });

    describe('認証フロー遷移', () => {
        it('未認証→Nsec認証→認証済みの状態遷移', async () => {
            const mockKeyManager = new MockKeyManager();

            // 1. 未認証状態
            vi.mocked(mockKeyManager.loadFromStorage).mockReturnValue(null);
            expect(mockKeyManager.loadFromStorage()).toBeNull();

            // 2. Nsecを入力して認証
            const nsec = 'nsec1test1234567890abcdefghijklmnopqrstuvwxyz1234567890ab';
            mockKeyManager.isValidNsec.mockReturnValue(true);
            mockKeyManager.saveToStorage.mockReturnValue({ success: true });
            mockKeyManager.derivePublicKey.mockReturnValue({
                hex: '1234567890abcdef',
                npub: 'npub1test',
                nprofile: 'nprofile1test'
            });

            const authService = createAuthService(mockKeyManager);
            const result = await authService.authenticateWithNsec(nsec);

            expect(result.success).toBe(true);
            expect(result.pubkeyHex).toBe('1234567890abcdef');
        });
    });

    describe('エラーハンドリング', () => {
        it('公開鍵導出エラーが正しくハンドリングされること', async () => {
            const mockKeyManager = new MockKeyManager();
            mockKeyManager.isValidNsec.mockReturnValue(true);
            mockKeyManager.saveToStorage.mockReturnValue({ success: true });
            mockKeyManager.derivePublicKey.mockImplementation(() => {
                throw new Error('Derivation failed');
            });

            const authService = createAuthService(mockKeyManager);
            const result = await authService.authenticateWithNsec('nsec1test');

            expect(result.success).toBe(false);
            expect(result.error).toBe('authentication_error');
        });

        it('ストレージ保存失敗が検出できること', async () => {
            const mockKeyManager = new MockKeyManager();
            mockKeyManager.isValidNsec.mockReturnValue(true);
            mockKeyManager.derivePublicKey.mockReturnValue({
                hex: 'test-pubkey',
                npub: 'npub123',
                nprofile: 'nprofile123'
            });
            mockKeyManager.saveToStorage.mockReturnValue({ success: false });

            const authService = createAuthService(mockKeyManager);
            const result = await authService.authenticateWithNsec('nsec1test');

            expect(result.success).toBe(false);
            expect(result.error).toBe('error_saving');
        });
    });
});
