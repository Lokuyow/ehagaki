import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthServiceDependencies, StoredAccount } from '../../lib/types';
import type { MockKeyManager } from '../helpers';
import './authServiceModuleMocks';

import { AuthService } from '../../lib/authService';
import {
    MANAGED_NIP07_IDENTITY_READ_TIMEOUT_MS,
} from '../../lib/authRestoreUtils';
import {
    createMockAccountManager,
    createMockDependencies,
    createMockNip07Dependencies,
    createMockNip46Session,
    createMockParentClientSession,
} from './authServiceTestUtils';

const NSEC_PUBKEY = 'aa'.repeat(32);
const NIP07_PUBKEY = 'bb'.repeat(32);
const NIP46_PUBKEY = 'cc'.repeat(32);
const PARENT_PUBKEY = 'dd'.repeat(32);

function createManagedService(
    dependencies: AuthServiceDependencies,
    pubkeyHex: string,
    type: StoredAccount['type'],
    getAccountType: (pubkey: string) => StoredAccount['type'] | null =
        (pubkey) => pubkey === pubkeyHex ? type : null,
): AuthService {
    const service = new AuthService(dependencies);
    service.setAccountManager(createMockAccountManager({
        getAccountType: vi.fn(getAccountType),
    }) as any);
    return service;
}

describe('AuthService.restoreAccount', () => {
    let mockDependencies: AuthServiceDependencies;
    let mockKeyManager: MockKeyManager;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockKeyManager = mockDependencies.keyManager as MockKeyManager;
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('保存account recordがない場合は方式固有restoreを開始しない', async () => {
        const service = new AuthService(mockDependencies);

        await expect(service.restoreAccount(NSEC_PUBKEY, 'nsec')).resolves.toEqual({
            hasAuth: false,
            reason: 'account-record-mismatch',
        });
        expect(mockKeyManager.readStoredKey).not.toHaveBeenCalled();
    });

    it('nsec: 導出identity一致後だけsecret stateとauth stateを反映する', async () => {
        mockKeyManager.readStoredKey.mockReturnValue({ status: 'found', secretKey: 'stored-nsec' });
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: NSEC_PUBKEY,
            npub: 'npub1nsec',
            nprofile: 'nprofile1nsec',
        });
        const service = createManagedService(mockDependencies, NSEC_PUBKEY, 'nsec');

        const result = await service.restoreAccount(NSEC_PUBKEY, 'nsec');

        expect(result).toEqual({ hasAuth: true, pubkeyHex: NSEC_PUBKEY });
        expect(mockKeyManager.setCurrentSecretKey).toHaveBeenCalledWith('stored-nsec');
        expect(mockDependencies.setNsecAuth).toHaveBeenCalledWith(
            NSEC_PUBKEY,
            'npub1nsec',
            'nprofile1nsec',
        );
    });

    it('ローカルnsec認証が無効なruntimeではmanaged nsec restoreを開始しない', async () => {
        const service = createManagedService(
            { ...mockDependencies, localNsecAuthEnabled: false },
            NSEC_PUBKEY,
            'nsec',
        );

        await expect(service.restoreAccount(NSEC_PUBKEY, 'nsec')).resolves.toEqual({
            hasAuth: false,
            reason: 'local-nsec-auth-disabled',
        });
        expect(mockKeyManager.readStoredKey).not.toHaveBeenCalled();
        expect(mockDependencies.setNsecAuth).not.toHaveBeenCalled();
    });

    it('nsec: mismatchではsecret stateとauth stateを変更しない', async () => {
        mockKeyManager.readStoredKey.mockReturnValue({ status: 'found', secretKey: 'stored-nsec' });
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: NIP07_PUBKEY,
            npub: 'npub1other',
            nprofile: 'nprofile1other',
        });
        const service = createManagedService(mockDependencies, NSEC_PUBKEY, 'nsec');

        await expect(service.restoreAccount(NSEC_PUBKEY, 'nsec')).resolves.toEqual({
            hasAuth: false,
            reason: 'identity-mismatch',
        });
        expect(mockKeyManager.setCurrentSecretKey).not.toHaveBeenCalled();
        expect(mockDependencies.setNsecAuth).not.toHaveBeenCalled();
    });

    it.each([
        [{ status: 'missing' }, 'credential-missing'],
        [{ status: 'error' }, 'credential-read-failed'],
    ] as const)('nsec: storage結果 %o を失敗として返す', async (storedKeyResult, reason) => {
        mockKeyManager.readStoredKey.mockReturnValue(storedKeyResult);
        const service = createManagedService(mockDependencies, NSEC_PUBKEY, 'nsec');

        await expect(service.restoreAccount(NSEC_PUBKEY, 'nsec')).resolves.toEqual({
            hasAuth: false,
            reason,
        });
        expect(mockDependencies.setNsecAuth).not.toHaveBeenCalled();
    });

    it.each([
        ['invalid nsec', () => {
            mockKeyManager.readStoredKey.mockReturnValue({ status: 'found', secretKey: 'not-an-nsec' });
            mockKeyManager.isValidNsec.mockReturnValue(false);
        }, 'credential-invalid'],
        ['derive exception', () => {
            mockKeyManager.readStoredKey.mockReturnValue({ status: 'found', secretKey: 'stored-nsec' });
            mockKeyManager.isValidNsec.mockReturnValue(true);
            mockKeyManager.derivePublicKey.mockImplementation(() => {
                throw new Error('derive failed');
            });
        }, 'identity-read-failed'],
        ['empty derived pubkey', () => {
            mockKeyManager.readStoredKey.mockReturnValue({ status: 'found', secretKey: 'stored-nsec' });
            mockKeyManager.isValidNsec.mockReturnValue(true);
            mockKeyManager.derivePublicKey.mockReturnValue({ hex: '', npub: '', nprofile: '' });
        }, 'identity-read-failed'],
    ] as const)('nsec: %sではstateを反映しない', async (_caseName, prepare, reason) => {
        prepare();
        const service = createManagedService(mockDependencies, NSEC_PUBKEY, 'nsec');

        await expect(service.restoreAccount(NSEC_PUBKEY, 'nsec')).resolves.toEqual({
            hasAuth: false,
            reason,
        });
        expect(mockKeyManager.setCurrentSecretKey).not.toHaveBeenCalled();
        expect(mockDependencies.setNsecAuth).not.toHaveBeenCalled();
        expect(mockKeyManager.saveToStorage).not.toHaveBeenCalled();
    });

    it('nsec: late account record不一致ではstateを反映しない', async () => {
        mockKeyManager.readStoredKey.mockReturnValue({ status: 'found', secretKey: 'stored-nsec' });
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: NSEC_PUBKEY,
            npub: 'npub1nsec',
            nprofile: 'nprofile1nsec',
        });
        let checks = 0;
        const service = createManagedService(
            mockDependencies,
            NSEC_PUBKEY,
            'nsec',
            () => (++checks === 1 ? 'nsec' : null),
        );

        await expect(service.restoreAccount(NSEC_PUBKEY, 'nsec')).resolves.toEqual({
            hasAuth: false,
            reason: 'account-record-mismatch',
        });
        expect(mockKeyManager.setCurrentSecretKey).not.toHaveBeenCalled();
        expect(mockDependencies.setNsecAuth).not.toHaveBeenCalled();
    });

    it('NIP-07: extension返却identity一致後だけauth stateを反映する', async () => {
        const nip07Deps = createMockNip07Dependencies(NIP07_PUBKEY, mockDependencies);
        const service = createManagedService(nip07Deps, NIP07_PUBKEY, 'nip07');

        await expect(service.restoreAccount(NIP07_PUBKEY, 'nip07')).resolves.toEqual({
            hasAuth: true,
            pubkeyHex: NIP07_PUBKEY,
        });
        expect(nip07Deps.setNip07Auth).toHaveBeenCalled();
    });

    it('NIP-07: extension identity mismatchではauth stateを反映しない', async () => {
        const nip07Deps = createMockNip07Dependencies(NSEC_PUBKEY, mockDependencies);
        const service = createManagedService(nip07Deps, NIP07_PUBKEY, 'nip07');

        await expect(service.restoreAccount(NIP07_PUBKEY, 'nip07')).resolves.toMatchObject({
            hasAuth: false,
            reason: 'identity-mismatch',
        });
        expect(nip07Deps.setNip07Auth).not.toHaveBeenCalled();
    });

    it('NIP-07: pubkey dataの内部不一致はauth stateを反映しない', async () => {
        const nip07Deps = createMockNip07Dependencies(NIP07_PUBKEY, mockDependencies);
        const service = createManagedService(nip07Deps, NIP07_PUBKEY, 'nip07');
        const runtime = (service as unknown as {
            runtime: { nip07Service: { authenticate: ReturnType<typeof vi.fn> } };
        }).runtime;
        runtime.nip07Service.authenticate = vi.fn().mockResolvedValue({
            success: true,
            pubkeyHex: NIP07_PUBKEY,
            pubkeyData: { hex: NSEC_PUBKEY, npub: 'npub1other', nprofile: 'nprofile1other' },
        });

        await expect(service.restoreAccount(NIP07_PUBKEY, 'nip07')).resolves.toEqual({
            hasAuth: false,
            reason: 'identity-read-failed',
        });
        expect(nip07Deps.setNip07Auth).not.toHaveBeenCalled();
    });

    it('NIP-07: identity read timeoutはauth stateと他方式runtimeを変更しない', async () => {
        vi.useFakeTimers();
        let resolvePublicKey: ((value: string) => void) | undefined;
        const nip07Deps = createMockNip07Dependencies(NIP07_PUBKEY, mockDependencies);
        (nip07Deps.window as any).nostr.getPublicKey.mockImplementation(
            () => new Promise<string>((resolve) => { resolvePublicKey = resolve; }),
        );
        const service = createManagedService(nip07Deps, NIP07_PUBKEY, 'nip07');

        const restore = service.restoreAccount(NIP07_PUBKEY, 'nip07');
        await vi.advanceTimersByTimeAsync(MANAGED_NIP07_IDENTITY_READ_TIMEOUT_MS);

        await expect(restore).resolves.toEqual({
            hasAuth: false,
            reason: 'identity-read-failed',
        });
        expect(nip07Deps.setNip07Auth).not.toHaveBeenCalled();

        resolvePublicKey?.(NIP07_PUBKEY);
        await Promise.resolve();
        expect(nip07Deps.setNip07Auth).not.toHaveBeenCalled();
        const { nip46Service } = await import('../../lib/nip46Service');
        const { parentClientAuthService } = await import('../../lib/parentClientAuthService');
        expect(nip46Service.reconnect).not.toHaveBeenCalled();
        expect(parentClientAuthService.reconnect).not.toHaveBeenCalled();
    });

    it('NIP-46: 保存session identity mismatchではreconnectを開始しない', async () => {
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(
            createMockNip46Session(NIP07_PUBKEY),
        );
        const service = createManagedService(mockDependencies, NIP46_PUBKEY, 'nip46');

        await expect(service.restoreAccount(NIP46_PUBKEY, 'nip46')).resolves.toEqual({
            hasAuth: false,
            reason: 'identity-mismatch',
        });
        expect(nip46Service.reconnect).not.toHaveBeenCalled();
        expect(mockDependencies.setNip46Auth).not.toHaveBeenCalled();
    });

    it('NIP-46: reconnect失敗ではpartial runtimeをcleanupする', async () => {
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(createMockNip46Session(NIP46_PUBKEY));
        vi.mocked(nip46Service.reconnect).mockRejectedValue(new Error('reconnect failed'));
        const service = createManagedService(mockDependencies, NIP46_PUBKEY, 'nip46');

        await expect(service.restoreAccount(NIP46_PUBKEY, 'nip46')).resolves.toEqual({
            hasAuth: false,
            reason: 'reconnect-failed',
        });
        expect(nip46Service.disconnect).toHaveBeenCalledOnce();
        expect(mockDependencies.setNip46Auth).not.toHaveBeenCalled();
    });

    it('NIP-46: reconnect戻り値の契約不一致ではpartial runtimeをcleanupする', async () => {
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(createMockNip46Session(NIP46_PUBKEY));
        vi.mocked(nip46Service.reconnect).mockResolvedValue(NIP07_PUBKEY);
        const service = createManagedService(mockDependencies, NIP46_PUBKEY, 'nip46');

        await expect(service.restoreAccount(NIP46_PUBKEY, 'nip46')).resolves.toEqual({
            hasAuth: false,
            reason: 'identity-mismatch',
        });
        expect(nip46Service.disconnect).toHaveBeenCalledOnce();
        expect(nip46Service.bindSessionPersistence).not.toHaveBeenCalled();
        expect(mockDependencies.setNip46Auth).not.toHaveBeenCalled();
    });

    it('NIP-46: late account record不一致ではpartial runtimeをcleanupする', async () => {
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(createMockNip46Session(NIP46_PUBKEY));
        vi.mocked(nip46Service.reconnect).mockResolvedValue(NIP46_PUBKEY);
        let checks = 0;
        const service = createManagedService(
            mockDependencies,
            NIP46_PUBKEY,
            'nip46',
            () => (++checks === 1 ? 'nip46' : null),
        );

        await expect(service.restoreAccount(NIP46_PUBKEY, 'nip46')).resolves.toEqual({
            hasAuth: false,
            reason: 'account-record-mismatch',
        });
        expect(nip46Service.disconnect).toHaveBeenCalledOnce();
        expect(mockDependencies.setNip46Auth).not.toHaveBeenCalled();
    });

    it('NIP-46: 保存整合性とreconnect契約一致後だけbindとauth stateを反映する', async () => {
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        const session = createMockNip46Session(NIP46_PUBKEY, { pingVerified: true });
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(session);
        vi.mocked(nip46Service.reconnect).mockResolvedValue(NIP46_PUBKEY);
        const service = createManagedService(mockDependencies, NIP46_PUBKEY, 'nip46');

        await expect(service.restoreAccount(NIP46_PUBKEY, 'nip46')).resolves.toEqual({
            hasAuth: true,
            pubkeyHex: NIP46_PUBKEY,
        });
        expect(nip46Service.bindSessionPersistence).toHaveBeenCalledWith(
            mockDependencies.localStorage,
            NIP46_PUBKEY,
        );
        expect(mockDependencies.setNip46Auth).toHaveBeenCalled();
    });

    it('NIP-46: persistence失敗ではpartial runtimeをcleanupしauth stateを反映しない', async () => {
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(createMockNip46Session(NIP46_PUBKEY));
        vi.mocked(nip46Service.reconnect).mockResolvedValue(NIP46_PUBKEY);
        vi.mocked(nip46Service.bindSessionPersistence).mockImplementation(() => {
            throw new Error('persistence failed');
        });
        const service = createManagedService(mockDependencies, NIP46_PUBKEY, 'nip46');

        await expect(service.restoreAccount(NIP46_PUBKEY, 'nip46')).resolves.toEqual({
            hasAuth: false,
            reason: 'persistence-failed',
        });
        expect(nip46Service.disconnect).toHaveBeenCalledOnce();
        expect(mockDependencies.setNip46Auth).not.toHaveBeenCalled();
    });

    it('Parent client: 保存sessionまたは再認証identity mismatchでは通知なしでcleanupする', async () => {
        const { parentClientAuthService, ParentClientAuthService: ParentClientAuthServiceClass } = await import('../../lib/parentClientAuthService');
        const session = createMockParentClientSession(PARENT_PUBKEY);
        vi.mocked(ParentClientAuthServiceClass.loadSession).mockReturnValue(session);
        vi.mocked(parentClientAuthService.reconnect).mockResolvedValue(NIP07_PUBKEY);
        const service = createManagedService(mockDependencies, PARENT_PUBKEY, 'parentClient');

        await expect(service.restoreAccount(PARENT_PUBKEY, 'parentClient')).resolves.toEqual({
            hasAuth: false,
            reason: 'identity-mismatch',
        });
        expect(parentClientAuthService.disconnect).toHaveBeenCalledWith(false);
        expect(ParentClientAuthServiceClass.saveSession).not.toHaveBeenCalled();
        expect(mockDependencies.setParentClientAuth).not.toHaveBeenCalled();
    });

    it('Parent client: 再認証結果とactive session一致後だけ保存してauth stateを反映する', async () => {
        const { parentClientAuthService, ParentClientAuthService: ParentClientAuthServiceClass } = await import('../../lib/parentClientAuthService');
        const session = createMockParentClientSession(PARENT_PUBKEY);
        const refreshedSession = createMockParentClientSession(PARENT_PUBKEY, { connectedAt: 456 });
        vi.mocked(ParentClientAuthServiceClass.loadSession).mockReturnValue(session);
        vi.mocked(parentClientAuthService.reconnect).mockResolvedValue(PARENT_PUBKEY);
        vi.mocked(parentClientAuthService.getSessionData).mockReturnValue(refreshedSession);
        const service = createManagedService(mockDependencies, PARENT_PUBKEY, 'parentClient');

        await expect(service.restoreAccount(PARENT_PUBKEY, 'parentClient')).resolves.toEqual({
            hasAuth: true,
            pubkeyHex: PARENT_PUBKEY,
        });
        expect(ParentClientAuthServiceClass.saveSession).toHaveBeenCalledWith(
            mockDependencies.localStorage,
            refreshedSession,
        );
        expect(mockDependencies.setParentClientAuth).toHaveBeenCalled();
    });

    it('Parent client: reconnect後のactive session identity不一致は通知なしでcleanupする', async () => {
        const { parentClientAuthService, ParentClientAuthService: ParentClientAuthServiceClass } = await import('../../lib/parentClientAuthService');
        vi.mocked(ParentClientAuthServiceClass.loadSession).mockReturnValue(
            createMockParentClientSession(PARENT_PUBKEY),
        );
        vi.mocked(parentClientAuthService.reconnect).mockResolvedValue(PARENT_PUBKEY);
        vi.mocked(parentClientAuthService.getSessionData).mockReturnValue(
            createMockParentClientSession(NIP07_PUBKEY),
        );
        const service = createManagedService(mockDependencies, PARENT_PUBKEY, 'parentClient');

        await expect(service.restoreAccount(PARENT_PUBKEY, 'parentClient')).resolves.toEqual({
            hasAuth: false,
            reason: 'identity-mismatch',
        });
        expect(parentClientAuthService.disconnect).toHaveBeenCalledWith(false);
        expect(mockDependencies.setParentClientAuth).not.toHaveBeenCalled();
    });

    it('Parent client: late account type不一致は通知なしでcleanupする', async () => {
        const { parentClientAuthService, ParentClientAuthService: ParentClientAuthServiceClass } = await import('../../lib/parentClientAuthService');
        const session = createMockParentClientSession(PARENT_PUBKEY);
        vi.mocked(ParentClientAuthServiceClass.loadSession).mockReturnValue(session);
        vi.mocked(parentClientAuthService.reconnect).mockResolvedValue(PARENT_PUBKEY);
        vi.mocked(parentClientAuthService.getSessionData).mockReturnValue(session);
        let checks = 0;
        const service = createManagedService(
            mockDependencies,
            PARENT_PUBKEY,
            'parentClient',
            () => (++checks === 1 ? 'parentClient' : 'nip07'),
        );

        await expect(service.restoreAccount(PARENT_PUBKEY, 'parentClient')).resolves.toEqual({
            hasAuth: false,
            reason: 'account-record-mismatch',
        });
        expect(parentClientAuthService.disconnect).toHaveBeenCalledWith(false);
        expect(ParentClientAuthServiceClass.saveSession).not.toHaveBeenCalled();
        expect(mockDependencies.setParentClientAuth).not.toHaveBeenCalled();
    });

    it('不正な要求pubkeyはrestoreを開始しない', async () => {
        const service = createManagedService(mockDependencies, 'not-a-pubkey', 'nsec');

        await expect(service.restoreAccount('not-a-pubkey', 'nsec')).resolves.toEqual({
            hasAuth: false,
            reason: 'invalid-requested-pubkey',
        });
    });
});
