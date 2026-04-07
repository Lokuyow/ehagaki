import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Nip07AuthService } from '../../lib/nip07AuthService';

// nip07-awaiterをモック（AuthService経由で使われる場合のデフォルト値）
vi.mock('nip07-awaiter', () => ({
    waitNostr: vi.fn().mockResolvedValue(undefined),
    getNostr: vi.fn().mockReturnValue(undefined),
    isNostr: vi.fn().mockReturnValue(false),
}));

// --- Nip07AuthService テスト ---

function createMockWindow(nostr?: any): Window {
    return { nostr } as any;
}

function createMockConsole(): Console {
    return {
        log: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    } as unknown as Console;
}

describe('Nip07AuthService', () => {
    let mockConsole: Console;

    beforeEach(() => {
        mockConsole = createMockConsole();
    });

    describe('isAvailable', () => {
        it('window.nostrが存在しない場合はfalseを返す', () => {
            const service = new Nip07AuthService(createMockWindow(), mockConsole);
            expect(service.isAvailable()).toBe(false);
        });

        it('window.nostrがnullの場合はfalseを返す', () => {
            const service = new Nip07AuthService(createMockWindow(null), mockConsole);
            expect(service.isAvailable()).toBe(false);
        });

        it('window.nostrにgetPublicKeyがない場合はfalseを返す', () => {
            const service = new Nip07AuthService(
                createMockWindow({ signEvent: vi.fn() }),
                mockConsole
            );
            expect(service.isAvailable()).toBe(false);
        });

        it('window.nostrにsignEventがない場合はfalseを返す', () => {
            const service = new Nip07AuthService(
                createMockWindow({ getPublicKey: vi.fn() }),
                mockConsole
            );
            expect(service.isAvailable()).toBe(false);
        });

        it('window.nostrが完全な場合はtrueを返す', () => {
            const service = new Nip07AuthService(
                createMockWindow({
                    getPublicKey: vi.fn(),
                    signEvent: vi.fn(),
                }),
                mockConsole
            );
            expect(service.isAvailable()).toBe(true);
        });
    });

    describe('waitForExtension', () => {
        it('既に利用可能な場合は即座にtrueを返す', async () => {
            const mockWaitNostr = vi.fn();
            const service = new Nip07AuthService(
                createMockWindow({ getPublicKey: vi.fn(), signEvent: vi.fn() }),
                mockConsole,
                mockWaitNostr,
            );

            const result = await service.waitForExtension(100);
            expect(result).toBe(true);
            // 既に利用可能なのでwaitNostrは呼ばれない
            expect(mockWaitNostr).not.toHaveBeenCalled();
        });

        it('タイムアウト後にfalseを返す', async () => {
            const mockWaitNostr = vi.fn().mockResolvedValue(undefined);
            const service = new Nip07AuthService(createMockWindow(), mockConsole, mockWaitNostr);

            const result = await service.waitForExtension(50);
            expect(result).toBe(false);
            expect(mockWaitNostr).toHaveBeenCalledWith(50);
        });

        it('遅延後に利用可能になった場合はtrueを返す', async () => {
            const mockNostr = { getPublicKey: vi.fn(), signEvent: vi.fn() };
            const mockWaitNostr = vi.fn().mockResolvedValue(mockNostr);
            const service = new Nip07AuthService(createMockWindow(), mockConsole, mockWaitNostr);

            const result = await service.waitForExtension(200);
            expect(result).toBe(true);
            expect(mockWaitNostr).toHaveBeenCalledWith(200);
        });
    });

    describe('authenticate', () => {
        it('window.nostrが利用不可の場合にエラーを返す', async () => {
            const service = new Nip07AuthService(createMockWindow(), mockConsole);

            const result = await service.authenticate();

            expect(result.success).toBe(false);
            expect(result.error).toBe('nip07_not_available');
        });

        it('getPublicKeyが空文字を返す場合にエラーを返す', async () => {
            const service = new Nip07AuthService(
                createMockWindow({
                    getPublicKey: vi.fn().mockResolvedValue(''),
                    signEvent: vi.fn(),
                }),
                mockConsole
            );

            const result = await service.authenticate();

            expect(result.success).toBe(false);
            expect(result.error).toBe('nip07_no_pubkey');
        });

        it('正常に公開鍵を取得し認証に成功する', async () => {
            const testPubkeyHex = 'a'.repeat(64);
            const service = new Nip07AuthService(
                createMockWindow({
                    getPublicKey: vi.fn().mockResolvedValue(testPubkeyHex),
                    signEvent: vi.fn(),
                }),
                mockConsole
            );

            const result = await service.authenticate();

            expect(result.success).toBe(true);
            expect(result.pubkeyHex).toBe(testPubkeyHex);
            expect(result.pubkeyData).toBeDefined();
            expect(result.pubkeyData?.hex).toBe(testPubkeyHex);
            expect(result.pubkeyData?.npub).toMatch(/^npub1/);
            expect(result.pubkeyData?.nprofile).toMatch(/^nprofile1/);
        });

        it('getPublicKeyが例外を投げた場合にエラーを返す', async () => {
            const service = new Nip07AuthService(
                createMockWindow({
                    getPublicKey: vi.fn().mockRejectedValue(new Error('User denied')),
                    signEvent: vi.fn(),
                }),
                mockConsole
            );

            const result = await service.authenticate();

            expect(result.success).toBe(false);
            expect(result.error).toBe('nip07_auth_error');
            expect(mockConsole.error).toHaveBeenCalled();
        });

        it('getPublicKeyがundefinedを返す場合にエラーを返す', async () => {
            const service = new Nip07AuthService(
                createMockWindow({
                    getPublicKey: vi.fn().mockResolvedValue(undefined),
                    signEvent: vi.fn(),
                }),
                mockConsole
            );

            const result = await service.authenticate();

            expect(result.success).toBe(false);
            expect(result.error).toBe('nip07_no_pubkey');
        });
    });

    describe('signEvent', () => {
        it('window.nostrが利用不可の場合に例外を投げる', async () => {
            const service = new Nip07AuthService(createMockWindow(), mockConsole);

            await expect(service.signEvent({ kind: 1 })).rejects.toThrow(
                'NIP-07 extension is not available'
            );
        });

        it('正常にイベントに署名する', async () => {
            const signedEvent = { id: 'test-id', sig: 'test-sig' };
            const service = new Nip07AuthService(
                createMockWindow({
                    getPublicKey: vi.fn(),
                    signEvent: vi.fn().mockResolvedValue(signedEvent),
                }),
                mockConsole
            );

            const result = await service.signEvent({ kind: 1 });

            expect(result).toBe(signedEvent);
        });
    });
});

// --- AuthService NIP-07認証テスト ---

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
import { MockStorage, MockKeyManager } from '../helpers';

describe('AuthService NIP-07認証', () => {
    let mockSetNip07Auth: ReturnType<typeof vi.fn>;
    let mockConsole: Console;

    beforeEach(() => {
        mockSetNip07Auth = vi.fn();
        mockConsole = createMockConsole();
    });

    function createAuthServiceWithWindow(windowObj: any): AuthService {
        return new AuthService({
            keyManager: new MockKeyManager() as any,
            localStorage: new MockStorage(),
            window: windowObj,
            navigator: {} as Navigator,
            console: mockConsole,
            setNsecAuth: vi.fn(),
            setNip07Auth: mockSetNip07Auth,
            setNip46Auth: vi.fn(),
        });
    }

    it('NIP-07が利用不可の場合にエラーを返す', async () => {
        const authService = createAuthServiceWithWindow(createMockWindow() as any);
        const result = await authService.authenticateWithNip07();

        expect(result.success).toBe(false);
        expect(result.error).toBe('nip07_not_available');
        expect(mockSetNip07Auth).not.toHaveBeenCalled();
    });

    it('NIP-07が利用可能な場合に認証に成功する', async () => {
        const testPubkeyHex = 'b'.repeat(64);
        const authService = createAuthServiceWithWindow(createMockWindow({
            getPublicKey: vi.fn().mockResolvedValue(testPubkeyHex),
            signEvent: vi.fn(),
        }) as any);

        const result = await authService.authenticateWithNip07();

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe(testPubkeyHex);
        expect(mockSetNip07Auth).toHaveBeenCalledWith(
            testPubkeyHex,
            expect.stringMatching(/^npub1/),
            expect.stringMatching(/^nprofile1/)
        );
    });

    it('isNip07Availableが正しくチェックする', () => {
        const noAuth = createAuthServiceWithWindow(createMockWindow() as any);
        expect(noAuth.isNip07Available()).toBe(false);

        const withAuth = createAuthServiceWithWindow(createMockWindow({
            getPublicKey: vi.fn(),
            signEvent: vi.fn(),
        }) as any);
        expect(withAuth.isNip07Available()).toBe(true);
    });
});
