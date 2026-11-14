import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AuthServiceDependencies } from '../../lib/types';
import { MockStorage, type MockKeyManager } from '../helpers';
import './authServiceModuleMocks';

import { AuthService } from '../../lib/authService';
import { createMockAccountManager, createMockDependencies, createMockNip07Dependencies, createMockParentClientSession } from './authServiceTestUtils';
import { expectConsoleCallsNotToContain } from '../logAssertions';
import { AccountManager } from '../../lib/accountManager';
import { getNip46SessionStorageKey, getNsecStorageKey } from '../../lib/authStorageKeys';
import { STORAGE_KEYS } from '../../lib/constants';

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

    it('ローカルnsec認証が無効なruntimeでは検証・保存前に拒否する', async () => {
        const service = new AuthService({
            ...mockDependencies,
            localNsecAuthEnabled: false,
        });

        await expect(service.authenticateWithNsec('nsec1disabled')).resolves.toEqual({
            success: false,
            error: 'local-nsec-auth-disabled',
        });
        expect(mockKeyManager.isValidNsec).not.toHaveBeenCalled();
        expect(mockKeyManager.saveToStorage).not.toHaveBeenCalled();
        expect(mockDependencies.setNsecAuth).not.toHaveBeenCalled();
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
        mockKeyManager.writeStoredKeyForMigration.mockReturnValue({ status: 'error' } as never);

        const result = await authService.authenticateWithNsec('valid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('error_saving');
        expect(mockKeyManager.setCurrentSecretKey).not.toHaveBeenCalled();
        expect(mockDependencies.setNsecAuth).not.toHaveBeenCalled();
    });

    it('鍵の永続化・アカウント記録の後にランタイムの鍵と認証状態を確定する', async () => {
        const order: string[] = [];
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'test-pubkey',
            npub: 'npub123',
            nprofile: 'nprofile123',
        });
        mockKeyManager.writeStoredKeyForMigration.mockImplementation(() => {
            order.push('persist-key');
            return { status: 'saved' as const };
        });
        mockKeyManager.setCurrentSecretKey.mockImplementation(() => { order.push('runtime-key'); });
        vi.mocked(mockDependencies.setNsecAuth!).mockImplementation(() => { order.push('auth-state'); });
        const accountManager = createMockAccountManager({
            addAccount: vi.fn(() => { order.push('account-record'); }),
        });
        authService.setAccountManager(accountManager as any);

        await expect(authService.authenticateWithNsec('valid-nsec')).resolves.toEqual({
            success: true,
            pubkeyHex: 'test-pubkey',
        });

        expect(order).toEqual(['persist-key', 'account-record', 'runtime-key', 'auth-state']);
        expect(mockKeyManager.writeStoredKeyForMigration).toHaveBeenCalledWith('test-pubkey', 'valid-nsec');
    });

    it('アカウント記録に失敗した場合は新規保存した鍵を削除し、認証状態を変えない', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'test-pubkey',
            npub: 'npub123',
            nprofile: 'nprofile123',
        });
        authService.setAccountManager(createMockAccountManager({
            addAccount: vi.fn(() => { throw new Error('quota exceeded'); }),
        }) as any);

        await expect(authService.authenticateWithNsec('valid-nsec')).resolves.toEqual({
            success: false,
            error: 'error_saving',
        });

        expect(mockKeyManager.removeStoredKeyForMigration).toHaveBeenCalledWith('test-pubkey');
        expect(mockKeyManager.setCurrentSecretKey).not.toHaveBeenCalled();
        expect(mockDependencies.setNsecAuth).not.toHaveBeenCalled();
    });

    it('アカウント記録に失敗しても、既に保存済みだった鍵は削除しない', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'test-pubkey',
            npub: 'npub123',
            nprofile: 'nprofile123',
        });
        mockKeyManager.readStoredKey.mockReturnValue({ status: 'found', secretKey: 'valid-nsec' });
        authService.setAccountManager(createMockAccountManager({
            addAccount: vi.fn(() => { throw new Error('quota exceeded'); }),
        }) as any);

        await expect(authService.authenticateWithNsec('valid-nsec')).resolves.toEqual({
            success: false,
            error: 'error_saving',
        });

        expect(mockKeyManager.writeStoredKeyForMigration).not.toHaveBeenCalled();
        expect(mockKeyManager.removeStoredKeyForMigration).not.toHaveBeenCalled();
    });

    it('同一pubkeyのNIP-46アカウントをnsecへ置換すると旧sessionを削除する', async () => {
        const pubkeyHex = 'ab'.repeat(32);
        const storage = new MockStorage();
        const deps = createMockDependencies();
        deps.localStorage = storage;
        const keyManager = deps.keyManager as any as MockKeyManager;
        keyManager.isValidNsec.mockReturnValue(true);
        keyManager.derivePublicKey.mockReturnValue({ hex: pubkeyHex, npub: 'npub1', nprofile: 'nprofile1' });
        const accountManager = new AccountManager({ localStorage: storage, console: deps.console });
        accountManager.addAccount(pubkeyHex, 'nip46');
        storage.setItem(getNip46SessionStorageKey(pubkeyHex), 'session');
        const { Nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(Nip46Service.clearSession).mockImplementation((targetStorage, targetPubkey) => {
            targetStorage.removeItem(getNip46SessionStorageKey(targetPubkey));
        });
        const service = new AuthService(deps);
        service.setAccountManager(accountManager);

        await expect(service.authenticateWithNsec('valid-nsec')).resolves.toEqual({ success: true, pubkeyHex });

        expect(accountManager.getAccountType(pubkeyHex)).toBe('nsec');
        expect(storage.getItem(getNip46SessionStorageKey(pubkeyHex))).toBeNull();
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
        expect(mockConsole.error).toHaveBeenCalledWith(
            'nsec認証処理中にエラー',
            { stage: 'nsec-authentication', reason: 'unexpected' },
        );
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
    const NIP07_PUBKEY = '12'.repeat(32);
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
        const nip07Deps = createMockNip07Dependencies(NIP07_PUBKEY);
        const service = new AuthService(nip07Deps);

        const result = await service.authenticateWithNip07();

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe(NIP07_PUBKEY);
        expect(nip07Deps.setNip07Auth).toHaveBeenCalled();
    });

    it('認証成功でaccountManager.addAccount呼出', async () => {
        const nip07Deps = createMockNip07Dependencies(NIP07_PUBKEY);
        const service = new AuthService(nip07Deps);
        const mockAccountManager = createMockAccountManager();
        service.setAccountManager(mockAccountManager as any);

        const result = await service.authenticateWithNip07();

        expect(result.success).toBe(true);
        expect(mockAccountManager.addAccount).toHaveBeenCalledWith(NIP07_PUBKEY, 'nip07');
    });

    it('拡張が64桁hexでない公開鍵を返した場合はアカウントを作らない', async () => {
        const nip07Deps = createMockNip07Dependencies('abcdef1234567890');
        const service = new AuthService(nip07Deps);
        const mockAccountManager = createMockAccountManager();
        service.setAccountManager(mockAccountManager as any);

        await expect(service.authenticateWithNip07()).resolves.toEqual({
            success: false,
            error: 'nip07_invalid_pubkey',
        });
        expect(nip07Deps.setNip07Auth).not.toHaveBeenCalled();
        expect(mockAccountManager.addAccount).not.toHaveBeenCalled();
    });

    it('応答前に別のログインが始まっていた場合は何も確定しない', async () => {
        const nip07Deps = createMockNip07Dependencies(NIP07_PUBKEY);
        const service = new AuthService(nip07Deps);
        const mockAccountManager = createMockAccountManager();
        service.setAccountManager(mockAccountManager as any);

        await expect(service.authenticateWithNip07({ isCurrent: () => false })).resolves.toEqual({
            success: false,
            error: 'auth_superseded',
        });
        expect(nip07Deps.setNip07Auth).not.toHaveBeenCalled();
        expect(mockAccountManager.addAccount).not.toHaveBeenCalled();
    });

    it('アカウント記録に失敗した場合は認証状態を変えずエラーを返す', async () => {
        const nip07Deps = createMockNip07Dependencies(NIP07_PUBKEY);
        const service = new AuthService(nip07Deps);
        service.setAccountManager(createMockAccountManager({
            addAccount: vi.fn(() => { throw new Error('quota exceeded'); }),
        }) as any);

        await expect(service.authenticateWithNip07()).resolves.toEqual({
            success: false,
            error: 'nip07_auth_error',
        });
        expect(nip07Deps.setNip07Auth).not.toHaveBeenCalled();
    });

    it('同一pubkeyのnsecアカウントをNIP-07へ置換すると保存済みの秘密鍵を削除する', async () => {
        const storage = new MockStorage();
        const deps = createMockNip07Dependencies(NIP07_PUBKEY);
        deps.localStorage = storage;
        const accountManager = new AccountManager({ localStorage: storage, console: deps.console });
        accountManager.addAccount(NIP07_PUBKEY, 'nsec');
        storage.setItem(getNsecStorageKey(NIP07_PUBKEY), 'nsec1stored');
        storage.setItem(STORAGE_KEYS.NOSTR_PROFILE + NIP07_PUBKEY, 'profile');
        const service = new AuthService(deps);
        service.setAccountManager(accountManager);

        await expect(service.authenticateWithNip07()).resolves.toEqual({ success: true, pubkeyHex: NIP07_PUBKEY });

        expect(accountManager.getAccountType(NIP07_PUBKEY)).toBe('nip07');
        expect(storage.getItem(getNsecStorageKey(NIP07_PUBKEY))).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.NOSTR_PROFILE + NIP07_PUBKEY)).toBe('profile');
    });

    it('authenticate失敗でエラーを返す', async () => {
        const nip07Deps = createMockNip07Dependencies('');
        const service = new AuthService(nip07Deps);

        const result = await service.authenticateWithNip07();

        expect(result.success).toBe(false);
    });

    it('auto-loginで同一pubkeyのNIP-46アカウントをNIP-07へ置換し、方式固有sessionだけ削除する', async () => {
        const pubkeyHex = 'ab'.repeat(32);
        const storage = new MockStorage();
        const deps = createMockDependencies();
        deps.localStorage = storage;
        const accountManager = new AccountManager({ localStorage: storage, console: deps.console });
        accountManager.addAccount(pubkeyHex, 'nip46');
        storage.setItem(getNip46SessionStorageKey(pubkeyHex), 'session');
        storage.setItem(STORAGE_KEYS.NOSTR_PROFILE + pubkeyHex, 'profile');
        storage.setItem(STORAGE_KEYS.NOSTR_RELAYS + pubkeyHex, 'relays');
        const { nip46Service, Nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(Nip46Service.clearSession).mockImplementation((targetStorage, targetPubkey) => {
            targetStorage.removeItem(getNip46SessionStorageKey(targetPubkey));
        });

        const service = new AuthService(deps);
        service.setAccountManager(accountManager);
        const result = await service.authenticateWithNip07ForAutoLogin({
            hex: pubkeyHex,
            npub: 'npub1replacement',
            nprofile: 'nprofile1replacement',
        });

        expect(result).toEqual({ success: true, pubkeyHex });
        expect(accountManager.getAccountType(pubkeyHex)).toBe('nip07');
        expect(accountManager.getActiveAccountPubkey()).toBe(pubkeyHex);
        expect(nip46Service.disconnect).toHaveBeenCalledOnce();
        expect(storage.getItem(getNip46SessionStorageKey(pubkeyHex))).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.NOSTR_PROFILE + pubkeyHex)).toBe('profile');
        expect(storage.getItem(STORAGE_KEYS.NOSTR_RELAYS + pubkeyHex)).toBe('relays');
    });

    it('旧認証方式のcleanup失敗でもauto-login成功とNIP-07保存を維持する', async () => {
        const pubkeyHex = 'cd'.repeat(32);
        const storage = new MockStorage();
        const deps = createMockDependencies();
        deps.localStorage = storage;
        const accountManager = new AccountManager({ localStorage: storage, console: deps.console });
        accountManager.addAccount(pubkeyHex, 'nip46');
        const { nip46Service, Nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(nip46Service.disconnect).mockRejectedValueOnce(new Error('disconnect failed'));
        vi.mocked(Nip46Service.clearSession).mockImplementationOnce(() => {
            throw new Error('storage failed');
        });

        const service = new AuthService(deps);
        service.setAccountManager(accountManager);

        await expect(service.authenticateWithNip07ForAutoLogin({
            hex: pubkeyHex,
            npub: 'npub1replacement',
            nprofile: 'nprofile1replacement',
        })).resolves.toEqual({ success: true, pubkeyHex });
        expect(accountManager.getAccountType(pubkeyHex)).toBe('nip07');
        expect(accountManager.getActiveAccountPubkey()).toBe(pubkeyHex);
        expect(deps.console?.error).toHaveBeenCalledWith(
            '認証方式固有データの削除に失敗しました',
            expect.objectContaining({ stage: 'auth-replacement' }),
        );
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
        expect(nip46Service.saveSession).toHaveBeenCalledWith(
            mockDependencies.localStorage,
            validPubkey,
        );
        expect(mockAccountManager.addAccount).toHaveBeenCalledWith(validPubkey, 'nip46');
    });

    it('接続失敗でエラーを返す', async () => {
        const { nip46Service } = await import('../../lib/nip46Service');
        const sentinel = 'Connection timeout with bunker secret';
        const error = new Error(sentinel);
        error.stack = `stack:${sentinel}`;
        error.cause = { nested: sentinel };
        (error as { customPayload?: unknown }).customPayload = { sentinel };
        (error as { cycle?: unknown }).cycle = error;
        vi.mocked(nip46Service.connect).mockRejectedValue(error);

        const service = new AuthService(mockDependencies);
        const result = await service.authenticateWithNip46('bunker://invalid');

        expect(result.success).toBe(false);
        expect(result.error).toBe(sentinel);
        expectConsoleCallsNotToContain([mockDependencies.console!.error as never], [sentinel]);
    });

    it('nostrconnect 待機成功は pubkey を返し、認証状態はまだ確定しない', async () => {
        const validPubkey = 'cd'.repeat(32);
        const { nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(nip46Service.startNostrConnect).mockResolvedValue({
            connectionUri: 'nostrconnect://client-pubkey?relay=wss://relay',
            ready: Promise.resolve(),
            handshakeStarted: Promise.resolve(),
            completion: Promise.resolve(validPubkey),
            cancel: vi.fn().mockResolvedValue(undefined),
        } as any);
        vi.mocked(nip46Service.saveSession).mockImplementation(() => { });

        const service = new AuthService(mockDependencies);
        const mockAccountManager = createMockAccountManager();
        service.setAccountManager(mockAccountManager as any);

        const pending = await service.startNip46NostrConnect(['wss://relay']);
        const result = await pending.completion;

        expect(pending.connectionUri).toContain('nostrconnect://');
        expect(result).toEqual({ success: true, pubkeyHex: validPubkey });
        expect(nip46Service.startNostrConnect).toHaveBeenCalledWith(
            ['wss://relay'],
            undefined,
        );
        expect(mockDependencies.setNip46Auth).not.toHaveBeenCalled();
        expect(nip46Service.saveSession).not.toHaveBeenCalled();
        expect(mockAccountManager.addAccount).not.toHaveBeenCalled();
    });

    it('nostrconnect 認証確定は App 側の current operation 確認後に実行できる', async () => {
        const validPubkey = 'cd'.repeat(32);
        const { nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(nip46Service.saveSession).mockImplementation(() => { });

        const service = new AuthService(mockDependencies);
        const mockAccountManager = createMockAccountManager();
        service.setAccountManager(mockAccountManager as any);

        const result = await service.finalizeNip46Authentication(validPubkey);

        expect(result).toEqual({ success: true, pubkeyHex: validPubkey });
        expect(mockDependencies.setNip46Auth).toHaveBeenCalled();
        expect(nip46Service.saveSession).toHaveBeenCalledWith(
            mockDependencies.localStorage,
            validPubkey,
        );
        expect(mockAccountManager.addAccount).toHaveBeenCalledWith(validPubkey, 'nip46');
    });

    it('nostrconnect 待機失敗で error を返す', async () => {
        const { nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(nip46Service.startNostrConnect).mockResolvedValue({
            connectionUri: 'nostrconnect://client-pubkey?relay=wss://relay',
            ready: Promise.resolve(),
            handshakeStarted: Promise.resolve(),
            completion: Promise.reject(
                new Error('Remote signer did not return final relay list'),
            ),
            cancel: vi.fn().mockResolvedValue(undefined),
        } as any);

        const service = new AuthService(mockDependencies);

        const pending = await service.startNip46NostrConnect(['wss://relay']);
        const result = await pending.completion;

        expect(result).toEqual({
            success: false,
            error: 'Remote signer did not return final relay list',
        });
        expect(mockDependencies.setNip46Auth).not.toHaveBeenCalled();
    });

    it('nostrconnect pending ready / handshakeStarted をそのまま公開する', async () => {
        const ready = Promise.resolve();
        const handshakeStarted = Promise.resolve();
        const { nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(nip46Service.startNostrConnect).mockResolvedValue({
            connectionUri: 'nostrconnect://client-pubkey?relay=wss://relay',
            ready,
            handshakeStarted,
            completion: Promise.resolve('cd'.repeat(32)),
            cancel: vi.fn().mockResolvedValue(undefined),
        } as any);

        const service = new AuthService(mockDependencies);
        const pending = await service.startNip46NostrConnect(['wss://relay']);

        await expect(pending.ready).resolves.toBeUndefined();
        await expect(pending.handshakeStarted).resolves.toBeUndefined();
    });

    it('nostrconnect connectionUri は ready 後の最新値を参照する', async () => {
        let connectionUri = 'nostrconnect://client-pubkey?relay=wss%3A%2F%2Finitial';
        const ready = Promise.resolve();
        const { nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(nip46Service.startNostrConnect).mockResolvedValue({
            get connectionUri() {
                return connectionUri;
            },
            ready,
            handshakeStarted: Promise.resolve(),
            completion: Promise.resolve('cd'.repeat(32)),
            cancel: vi.fn().mockResolvedValue(undefined),
        } as any);

        const service = new AuthService(mockDependencies);
        const pending = await service.startNip46NostrConnect(['wss://relay']);

        connectionUri = 'nostrconnect://client-pubkey?relay=wss%3A%2F%2Fready';
        await pending.ready;

        expect(pending.connectionUri).toContain('relay=wss%3A%2F%2Fready');
    });
});

describe('AuthService.authenticateWithParentClient', () => {
    let mockDependencies: AuthServiceDependencies;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        vi.clearAllMocks();
    });

    it('親クライアント認証成功でsetParentClientAuth + session保存を行い、account追加はApp側へ委譲する', async () => {
        const validPubkey = '34'.repeat(32);
        const session = createMockParentClientSession(validPubkey);
        const { parentClientAuthService, ParentClientAuthService } = await import('../../lib/parentClientAuthService');
        vi.mocked(parentClientAuthService.connect).mockResolvedValue(validPubkey);
        vi.mocked(parentClientAuthService.getSessionData).mockReturnValue(session);

        const service = new AuthService(mockDependencies);
        const mockAccountManager = createMockAccountManager();
        service.setAccountManager(mockAccountManager as any);

        const result = await service.authenticateWithParentClient({
            silent: true,
            timeoutMs: 1200,
        });

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe(validPubkey);
        expect(parentClientAuthService.connect).toHaveBeenCalledWith({
            silent: true,
            timeoutMs: 1200,
        });
        expect(mockDependencies.setParentClientAuth).toHaveBeenCalled();
        expect(ParentClientAuthService.saveSession).toHaveBeenCalledWith(
            mockDependencies.localStorage,
            session,
        );
        expect(mockAccountManager.addAccount).not.toHaveBeenCalled();
    });

    it('親クライアント認証失敗でエラーを返す', async () => {
        const { parentClientAuthService } = await import('../../lib/parentClientAuthService');
        vi.mocked(parentClientAuthService.connect).mockRejectedValue(new Error('parent_client_timeout'));

        const service = new AuthService(mockDependencies);
        const result = await service.authenticateWithParentClient();

        expect(result.success).toBe(false);
        expect(result.error).toBe('parent_client_timeout');
    });

    it('silent 親クライアント認証失敗では console.error を出さない', async () => {
        const { parentClientAuthService } = await import('../../lib/parentClientAuthService');
        vi.mocked(parentClientAuthService.connect).mockRejectedValue(new Error('parent_client_not_logged_in'));

        const service = new AuthService(mockDependencies);
        const result = await service.authenticateWithParentClient({ silent: true });

        expect(result.success).toBe(false);
        expect(result.error).toBe('parent_client_not_logged_in');
        expect(mockDependencies.console!.error).not.toHaveBeenCalled();
    });
});
