import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Nip07AuthService } from '../../lib/nip07AuthService';

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
            const service = new Nip07AuthService(
                createMockWindow({ getPublicKey: vi.fn(), signEvent: vi.fn() }),
                mockConsole
            );

            const result = await service.waitForExtension(100, 10);
            expect(result).toBe(true);
        });

        it('タイムアウト後にfalseを返す', async () => {
            const service = new Nip07AuthService(createMockWindow(), mockConsole);

            const result = await service.waitForExtension(50, 10);
            expect(result).toBe(false);
        });

        it('遅延後に利用可能になった場合はtrueを返す', async () => {
            const mockWindow = createMockWindow() as any;
            const service = new Nip07AuthService(mockWindow, mockConsole);

            // 50ms後にnostrを注入
            setTimeout(() => {
                mockWindow.nostr = {
                    getPublicKey: vi.fn(),
                    signEvent: vi.fn(),
                };
            }, 30);

            const result = await service.waitForExtension(200, 10);
            expect(result).toBe(true);
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

// --- Nip07Authenticator テスト（authServiceから） ---

describe('Nip07Authenticator', () => {
    let mockSetNip07Auth: ReturnType<typeof vi.fn>;
    let mockConsole: Console;

    beforeEach(() => {
        mockSetNip07Auth = vi.fn();
        mockConsole = createMockConsole();
    });

    it('NIP-07が利用不可の場合にエラーを返す', async () => {
        const { Nip07Authenticator } = await import('../../lib/authService');

        const authenticator = new Nip07Authenticator(
            mockSetNip07Auth,
            mockConsole,
            createMockWindow() as any
        );

        const result = await authenticator.authenticate(50);

        expect(result.success).toBe(false);
        expect(result.error).toBe('nip07_not_available');
        expect(mockSetNip07Auth).not.toHaveBeenCalled();
    });

    it('NIP-07が利用可能な場合に認証に成功する', async () => {
        const { Nip07Authenticator } = await import('../../lib/authService');
        const testPubkeyHex = 'b'.repeat(64);

        const authenticator = new Nip07Authenticator(
            mockSetNip07Auth,
            mockConsole,
            createMockWindow({
                getPublicKey: vi.fn().mockResolvedValue(testPubkeyHex),
                signEvent: vi.fn(),
            }) as any
        );

        const result = await authenticator.authenticate(50);

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe(testPubkeyHex);
        expect(mockSetNip07Auth).toHaveBeenCalledWith(
            testPubkeyHex,
            expect.stringMatching(/^npub1/),
            expect.stringMatching(/^nprofile1/)
        );
    });

    it('isAvailableが正しくチェックする', async () => {
        const { Nip07Authenticator } = await import('../../lib/authService');

        const noAuth = new Nip07Authenticator(
            mockSetNip07Auth,
            mockConsole,
            createMockWindow() as any
        );
        expect(noAuth.isAvailable()).toBe(false);

        const withAuth = new Nip07Authenticator(
            mockSetNip07Auth,
            mockConsole,
            createMockWindow({
                getPublicKey: vi.fn(),
                signEvent: vi.fn(),
            }) as any
        );
        expect(withAuth.isAvailable()).toBe(true);
    });
});
