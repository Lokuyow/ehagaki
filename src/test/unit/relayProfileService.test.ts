import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RelayProfileService } from '../../lib/relayProfileService';
import type { RelayManager } from '../../lib/relayManager';
import type { ProfileManager } from '../../lib/profileManager';
import { createMockRxNostr } from '../helpers';

/**
 * RelayProfileService ユニットテスト
 *
 * RelayManager + ProfileManager の調整役としての連携ロジックを検証。
 * 各マネージャーはモックし、呼び出し順序・引数・分岐を検証する。
 */

function createMockRelayManager(): RelayManager {
    return {
        useRelaysFromLocalStorageIfExists: vi.fn().mockReturnValue(false),
        setBootstrapRelays: vi.fn(),
        getFromLocalStorage: vi.fn().mockReturnValue(null),
        fetchUserRelays: vi.fn().mockResolvedValue({
            success: true,
            relayConfig: ['wss://relay1.example.com/'],
            source: 'kind10002'
        }),
        getRelayListsForProfile: vi.fn().mockReturnValue({
            writeRelays: ['wss://relay1.example.com/'],
            additionalRelays: ['wss://relay1.example.com/', 'wss://bootstrap.example.com/']
        }),
        saveToLocalStorage: vi.fn(),
    } as unknown as RelayManager;
}

function createMockProfileManager(): ProfileManager {
    return {
        saveToLocalStorage: vi.fn(),
        fetchProfileData: vi.fn().mockResolvedValue({
            name: 'Test User',
            picture: 'https://example.com/pic.jpg',
            npub: 'npub1test',
            nprofile: 'nprofile1test'
        }),
        getFromLocalStorage: vi.fn().mockReturnValue(null),
    } as unknown as ProfileManager;
}

describe('RelayProfileService', () => {
    let service: RelayProfileService;
    let mockRelayManager: RelayManager;
    let mockProfileManager: ProfileManager;
    let mockRxNostr: ReturnType<typeof createMockRxNostr>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockRxNostr = createMockRxNostr();
        mockRelayManager = createMockRelayManager();
        mockProfileManager = createMockProfileManager();
        service = new RelayProfileService(mockRxNostr as any, mockRelayManager, mockProfileManager);
    });

    describe('initializeRelays', () => {
        it('pubkeyHexが指定され、ローカルストレージにリレーがある場合はそれを使用する', async () => {
            vi.mocked(mockRelayManager.useRelaysFromLocalStorageIfExists).mockReturnValue(true);

            await service.initializeRelays('pubkey123');

            expect(mockRelayManager.useRelaysFromLocalStorageIfExists).toHaveBeenCalledWith('pubkey123');
            expect(mockRelayManager.setBootstrapRelays).not.toHaveBeenCalled();
        });

        it('pubkeyHexが指定され、ローカルストレージにリレーがない場合はブートストラップリレーを設定する', async () => {
            vi.mocked(mockRelayManager.useRelaysFromLocalStorageIfExists).mockReturnValue(false);

            await service.initializeRelays('pubkey123');

            expect(mockRelayManager.useRelaysFromLocalStorageIfExists).toHaveBeenCalledWith('pubkey123');
            expect(mockRelayManager.setBootstrapRelays).toHaveBeenCalled();
        });

        it('pubkeyHexが未指定の場合はブートストラップリレーを設定する', async () => {
            await service.initializeRelays();

            expect(mockRelayManager.useRelaysFromLocalStorageIfExists).not.toHaveBeenCalled();
            expect(mockRelayManager.setBootstrapRelays).toHaveBeenCalled();
        });

        it('pubkeyHexが空文字の場合はブートストラップリレーを設定する', async () => {
            await service.initializeRelays('');

            expect(mockRelayManager.setBootstrapRelays).toHaveBeenCalled();
        });
    });

    describe('fetchRelays', () => {
        it('forceRemote=falseでキャッシュがある場合はローカルストレージから返す', async () => {
            const cachedRelays = { 'wss://cached.relay.com/': { read: true, write: true } };
            vi.mocked(mockRelayManager.getFromLocalStorage).mockReturnValue(cachedRelays);

            const result = await service.fetchRelays('pubkey123', false);

            expect(result.success).toBe(true);
            expect(result.source).toBe('localStorage');
            expect(result.relayConfig).toEqual(cachedRelays);
            expect(mockRelayManager.fetchUserRelays).not.toHaveBeenCalled();
        });

        it('forceRemote=falseでキャッシュがない場合はリモート取得する', async () => {
            vi.mocked(mockRelayManager.getFromLocalStorage).mockReturnValue(null);

            const result = await service.fetchRelays('pubkey123', false);

            expect(mockRelayManager.fetchUserRelays).toHaveBeenCalledWith('pubkey123', { forceRemote: false });
            expect(result.success).toBe(true);
        });

        it('forceRemote=trueの場合はキャッシュを無視してリモート取得する', async () => {
            const cachedRelays = { 'wss://cached.relay.com/': { read: true, write: true } };
            vi.mocked(mockRelayManager.getFromLocalStorage).mockReturnValue(cachedRelays);

            await service.fetchRelays('pubkey123', true);

            expect(mockRelayManager.getFromLocalStorage).not.toHaveBeenCalled();
            expect(mockRelayManager.fetchUserRelays).toHaveBeenCalledWith('pubkey123', { forceRemote: true });
        });

        it('デフォルトではforceRemote=falseとして動作する', async () => {
            vi.mocked(mockRelayManager.getFromLocalStorage).mockReturnValue(null);

            await service.fetchRelays('pubkey123');

            expect(mockRelayManager.getFromLocalStorage).toHaveBeenCalledWith('pubkey123');
        });
    });

    describe('fetchProfile', () => {
        it('pubkeyHexが空の場合はnullを返す', async () => {
            const result = await service.fetchProfile('');
            expect(result).toBeNull();
            expect(mockProfileManager.fetchProfileData).not.toHaveBeenCalled();
        });

        it('forceRemote=falseの場合はキャッシュ削除せずにプロフィールを取得する', async () => {
            const result = await service.fetchProfile('pubkey123', false);

            expect(mockProfileManager.saveToLocalStorage).not.toHaveBeenCalled();
            expect(mockRelayManager.getRelayListsForProfile).toHaveBeenCalledWith('pubkey123');
            expect(mockProfileManager.fetchProfileData).toHaveBeenCalledWith('pubkey123', {
                forceRemote: false,
                writeRelays: ['wss://relay1.example.com/'],
                additionalRelays: ['wss://relay1.example.com/', 'wss://bootstrap.example.com/']
            });
            expect(result).toEqual({
                name: 'Test User',
                picture: 'https://example.com/pic.jpg',
                npub: 'npub1test',
                nprofile: 'nprofile1test'
            });
        });

        it('forceRemote=trueの場合はキャッシュを削除してからプロフィールを取得する', async () => {
            await service.fetchProfile('pubkey123', true);

            expect(mockProfileManager.saveToLocalStorage).toHaveBeenCalledWith('pubkey123', null);
            expect(mockProfileManager.fetchProfileData).toHaveBeenCalledWith('pubkey123', {
                forceRemote: true,
                writeRelays: ['wss://relay1.example.com/'],
                additionalRelays: ['wss://relay1.example.com/', 'wss://bootstrap.example.com/']
            });
        });

        it('RelayManagerからリレーリストを取得してProfileManagerに渡す', async () => {
            vi.mocked(mockRelayManager.getRelayListsForProfile).mockReturnValue({
                writeRelays: ['wss://write.relay.com/'],
                additionalRelays: ['wss://write.relay.com/', 'wss://read.relay.com/']
            });

            await service.fetchProfile('pubkey123');

            expect(mockProfileManager.fetchProfileData).toHaveBeenCalledWith('pubkey123', {
                forceRemote: false,
                writeRelays: ['wss://write.relay.com/'],
                additionalRelays: ['wss://write.relay.com/', 'wss://read.relay.com/']
            });
        });
    });

    describe('initializeForLogin', () => {
        it('リレー取得後にプロフィールを取得する', async () => {
            const result = await service.initializeForLogin('pubkey123');

            // fetchRelays(pubkey, false) が呼ばれる
            expect(mockRelayManager.getFromLocalStorage).toHaveBeenCalledWith('pubkey123');
            // fetchProfile(pubkey, false) が呼ばれる
            expect(mockProfileManager.fetchProfileData).toHaveBeenCalled();
            expect(result).toEqual({
                name: 'Test User',
                picture: 'https://example.com/pic.jpg',
                npub: 'npub1test',
                nprofile: 'nprofile1test'
            });
        });

        it('リレーキャッシュがある場合はリモート取得をスキップする', async () => {
            vi.mocked(mockRelayManager.getFromLocalStorage).mockReturnValue(
                ['wss://cached.relay.com/']
            );

            await service.initializeForLogin('pubkey123');

            expect(mockRelayManager.fetchUserRelays).not.toHaveBeenCalled();
        });

        it('リレーキャッシュがない場合はリモート取得する', async () => {
            vi.mocked(mockRelayManager.getFromLocalStorage).mockReturnValue(null);

            await service.initializeForLogin('pubkey123');

            expect(mockRelayManager.fetchUserRelays).toHaveBeenCalledWith('pubkey123', { forceRemote: false });
        });
    });

    describe('refreshRelaysAndProfile', () => {
        it('リレーとプロフィールの両方を強制的にリモート取得する', async () => {
            await service.refreshRelaysAndProfile('pubkey123');

            // forceRemote=true でリレー取得
            expect(mockRelayManager.fetchUserRelays).toHaveBeenCalledWith('pubkey123', { forceRemote: true });
            // プロフィールキャッシュ削除
            expect(mockProfileManager.saveToLocalStorage).toHaveBeenCalledWith('pubkey123', null);
            // forceRemote=true でプロフィール取得
            expect(mockProfileManager.fetchProfileData).toHaveBeenCalledWith('pubkey123', expect.objectContaining({
                forceRemote: true
            }));
        });

        it('プロフィール取得結果を返す', async () => {
            const expectedProfile = {
                name: 'Refreshed User',
                picture: 'https://example.com/new.jpg',
                npub: 'npub1refreshed',
                nprofile: 'nprofile1refreshed'
            };
            vi.mocked(mockProfileManager.fetchProfileData).mockResolvedValue(expectedProfile);

            const result = await service.refreshRelaysAndProfile('pubkey123');
            expect(result).toEqual(expectedProfile);
        });
    });

    describe('ゲッターメソッド', () => {
        it('getRelayManager()がRelayManagerを返す', () => {
            expect(service.getRelayManager()).toBe(mockRelayManager);
        });

        it('getProfileManager()がProfileManagerを返す', () => {
            expect(service.getProfileManager()).toBe(mockProfileManager);
        });
    });
});
