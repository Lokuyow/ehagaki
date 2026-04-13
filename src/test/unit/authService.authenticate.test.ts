import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AuthServiceDependencies, Nip46SessionData } from '../../lib/types';
import type { MockKeyManager } from '../helpers';

vi.mock('nip07-awaiter', () => ({
    waitNostr: vi.fn().mockResolvedValue(undefined),
    getNostr: vi.fn().mockReturnValue(undefined),
    isNostr: vi.fn().mockReturnValue(false),
}));

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
import { createMockAccountManager, createMockDependencies } from './authServiceTestUtils';

describe('AuthService.authenticateWithNsec', () => {
    let authService: AuthService;
    let mockDependencies: AuthServiceDependencies;
    let mockKeyManager: MockKeyManager;
    let mockConsole: Console;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockKeyManager = mockDependencies.keyManager as any;
        mockConsole = mockDependencies.console!;
        authService = new AuthService(mockDependencies);
    });

    it('有効な秘密鍵で認証に成功する', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'test-pubkey',
            npub: 'npub123',
            nprofile: 'nprofile123',
        });

        const result = await authService.authenticateWithNsec('valid-nsec');

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe('test-pubkey');
        expect(mockDependencies.setNsecAuth).toHaveBeenCalledWith('test-pubkey', 'npub123', 'nprofile123');
    });

    it('無効な秘密鍵で認証に失敗する', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(false);

        const result = await authService.authenticateWithNsec('invalid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('invalid_secret');
    });

    it('保存に失敗した場合にエラーを返す', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'test-pubkey',
            npub: 'npub123',
            nprofile: 'nprofile123',
        });
        mockKeyManager.saveToStorage.mockReturnValue({ success: false });

        const result = await authService.authenticateWithNsec('valid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('error_saving');
    });

    it('公開鍵の導出に失敗した場合にエラーを返す', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockReturnValue({ hex: '' });

        const result = await authService.authenticateWithNsec('valid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('derivation_failed');
    });

    it('例外が発生した場合にエラーを処理する', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockImplementation(() => {
            throw new Error('Derivation error');
        });

        const result = await authService.authenticateWithNsec('valid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('authentication_error');
        expect(mockConsole.error).toHaveBeenCalledWith('nsec認証処理中にエラー:', expect.any(Error));
    });

    it('短すぎるNsecが拒否される', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(false);

        const result = await authService.authenticateWithNsec('nsec123');

        expect(result.success).toBe(false);
        expect(result.error).toBe('invalid_secret');
    });

    it('様々なNsecフォーマットが正しく検証される', async () => {
        const testCases = [
            { nsec: 'nsec1' + 'a'.repeat(58), shouldBeValid: true },
            { nsec: 'nsec1' + 'b'.repeat(59), shouldBeValid: true },
            { nsec: 'nsec1abc', shouldBeValid: false },
            { nsec: '', shouldBeValid: false },
            { nsec: 'npub1' + 'a'.repeat(58), shouldBeValid: false },
        ];

        for (const testCase of testCases) {
            const freshDeps = createMockDependencies();
            const freshKeyManager = freshDeps.keyManager as any as MockKeyManager;
            freshKeyManager.isValidNsec.mockReturnValue(testCase.shouldBeValid);
            if (testCase.shouldBeValid) {
                freshKeyManager.saveToStorage.mockReturnValue({ success: true });
                freshKeyManager.derivePublicKey.mockReturnValue({
                    hex: 'abcdef',
                    npub: 'npub1test',
                    nprofile: 'nprofile1test',
                });
            }

            const freshService = new AuthService(freshDeps);
            const result = await freshService.authenticateWithNsec(testCase.nsec);
            expect(result.success).toBe(testCase.shouldBeValid);
        }
    });

    it('未認証→Nsec認証→認証済みの状態遷移', async () => {
        expect(mockKeyManager.loadFromStorage()).toBeNull();

        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: '1234567890abcdef',
            npub: 'npub1test',
            nprofile: 'nprofile1test',
        });

        const result = await authService.authenticateWithNsec(
            'nsec1test1234567890abcdefghijklmnopqrstuvwxyz1234567890ab',
        );

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe('1234567890abcdef');
    });
});

describe('AuthService.isNip07Available', () => {
    it('デフォルトwindowではfalseを返す', () => {
        const service = new AuthService(createMockDependencies());
        expect(service.isNip07Available()).toBe(false);
    });
});

describe('AuthService.authenticateWithNip07', () => {
    let authService: AuthService;
    let mockDependencies: AuthServiceDependencies;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        authService = new AuthService(mockDependencies);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('NIP-07拡張機能未検出でエラーを返す', async () => {
        const result = await authService.authenticateWithNip07();
        expect(result.success).toBe(false);
        expect(result.error).toBe('nip07_not_available');
    });

    it('認証成功でsetNip07Auth呼出', async () => {
        const nip07Deps = createMockDependencies();
        nip07Deps.window = {
            nostr: {
                getPublicKey: vi.fn().mockResolvedValue('abcdef1234567890'),
                signEvent: vi.fn(),
            },
        } as any;
        const service = new AuthService(nip07Deps);

        const result = await service.authenticateWithNip07();

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe('abcdef1234567890');
        expect(nip07Deps.setNip07Auth).toHaveBeenCalled();
    });

    it('認証成功でaccountManager.addAccount呼出', async () => {
        const nip07Deps = createMockDependencies();
        nip07Deps.window = {
            nostr: {
                getPublicKey: vi.fn().mockResolvedValue('abcdef1234567890'),
                signEvent: vi.fn(),
            },
        } as any;
        const service = new AuthService(nip07Deps);
        const mockAccountManager = createMockAccountManager();
        service.setAccountManager(mockAccountManager as any);

        const result = await service.authenticateWithNip07();

        expect(result.success).toBe(true);
        expect(mockAccountManager.addAccount).toHaveBeenCalledWith('abcdef1234567890', 'nip07');
    });

    it('authenticate失敗でエラーを返す', async () => {
        const nip07Deps = createMockDependencies();
        nip07Deps.window = {
            nostr: {
                getPublicKey: vi.fn().mockResolvedValue(''),
                signEvent: vi.fn(),
            },
        } as any;
        const service = new AuthService(nip07Deps);

        const result = await service.authenticateWithNip07();

        expect(result.success).toBe(false);
    });
});

describe('AuthService.authenticateWithNip46', () => {
    let mockDependencies: AuthServiceDependencies;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        vi.clearAllMocks();
    });

    it('Bunker URL接続成功でsetNip46Auth + session保存 + addAccount', async () => {
        const validPubkey = 'ab'.repeat(32);
        const { nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(nip46Service.connect).mockResolvedValue(validPubkey);
        vi.mocked(nip46Service.saveSession).mockImplementation(() => { });

        const service = new AuthService(mockDependencies);
        const mockAccountManager = createMockAccountManager();
        service.setAccountManager(mockAccountManager as any);

        const result = await service.authenticateWithNip46('bunker://' + validPubkey + '?relay=wss://relay');

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe(validPubkey);
        expect(mockDependencies.setNip46Auth).toHaveBeenCalled();
        expect(nip46Service.saveSession).toHaveBeenCalled();
        expect(mockAccountManager.addAccount).toHaveBeenCalledWith(validPubkey, 'nip46');
    });

    it('接続失敗でエラーを返す', async () => {
        const { nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(nip46Service.connect).mockRejectedValue(new Error('Connection timeout'));

        const service = new AuthService(mockDependencies);
        const result = await service.authenticateWithNip46('bunker://invalid');

        expect(result.success).toBe(false);
        expect(result.error).toBe('Connection timeout');
    });
});