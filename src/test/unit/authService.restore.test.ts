import { describe, it, expect, vi, beforeEach } from 'vitest';
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
import { createMockDependencies } from './authServiceTestUtils';

describe('AuthService.restoreAccount', () => {
    let mockDependencies: AuthServiceDependencies;
    let mockKeyManager: MockKeyManager;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockKeyManager = mockDependencies.keyManager as any;
        vi.clearAllMocks();
    });

    it('restoreNsecAccount: 秘密鍵存在→公開鍵導出→認証復元', async () => {
        mockKeyManager.loadFromStorage.mockReturnValue('stored-nsec');
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'restored-pubkey',
            npub: 'npub1restored',
            nprofile: 'nprofile1restored',
        });

        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount('restored-pubkey', 'nsec');

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe('restored-pubkey');
        expect(mockDependencies.setNsecAuth).toHaveBeenCalledWith('restored-pubkey', 'npub1restored', 'nprofile1restored');
    });

    it('restoreNsecAccount: 秘密鍵なし→失敗', async () => {
        mockKeyManager.loadFromStorage.mockReturnValue(null);

        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount('some-pubkey', 'nsec');

        expect(result.hasAuth).toBe(false);
    });

    it('restoreNip07Account: 拡張機能待機→認証成功', async () => {
        const validPubkey = 'ef'.repeat(32);
        const nip07Deps = createMockDependencies();
        nip07Deps.window = {
            nostr: {
                getPublicKey: vi.fn().mockResolvedValue(validPubkey),
                signEvent: vi.fn(),
            },
        } as any;

        const service = new AuthService(nip07Deps);
        const result = await service.restoreAccount(validPubkey, 'nip07');

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe(validPubkey);
        expect(nip07Deps.setNip07Auth).toHaveBeenCalled();
    });

    it('restoreNip07Account: 拡張機能なし→失敗', async () => {
        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount('some-pubkey', 'nip07');

        expect(result.hasAuth).toBe(false);
    });

    it('restoreNip46Account: セッション復元→再接続成功', async () => {
        const validPubkey = 'ab'.repeat(32);
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        const session: Nip46SessionData = {
            clientSecretKeyHex: 'abc',
            remoteSignerPubkey: 'remote',
            relays: ['wss://relay'],
            userPubkey: validPubkey,
        };
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(session);
        vi.mocked(nip46Service.reconnect).mockResolvedValue(validPubkey);

        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount(validPubkey, 'nip46');

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe(validPubkey);
        expect(mockDependencies.setNip46Auth).toHaveBeenCalled();
    });

    it('restoreNip46Account: セッションなし→失敗', async () => {
        const validPubkey = 'cd'.repeat(32);
        const { Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(null);

        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount(validPubkey, 'nip46');

        expect(result.hasAuth).toBe(false);
    });

    it('restoreNip46Account: 再接続失敗→失敗', async () => {
        const validPubkey = 'cd'.repeat(32);
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        const session: Nip46SessionData = {
            clientSecretKeyHex: 'abc',
            remoteSignerPubkey: 'remote',
            relays: ['wss://relay'],
            userPubkey: validPubkey,
        };
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(session);
        vi.mocked(nip46Service.reconnect).mockRejectedValue(new Error('reconnect failed'));

        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount(validPubkey, 'nip46');

        expect(result.hasAuth).toBe(false);
    });

    it('不明なタイプ→失敗', async () => {
        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount('some-pubkey', 'unknown' as any);

        expect(result.hasAuth).toBe(false);
    });
});