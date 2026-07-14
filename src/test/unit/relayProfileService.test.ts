import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RelayProfileService } from '../../lib/relayProfileService';
import type { RelayManager } from '../../lib/relayManager';
import { profileMetadataCache } from '../../lib/profileMetadataCache.svelte';
import { createMockRxNostr } from '../helpers';

/**
 * RelayProfileService ユニットテスト
 *
 * RelayManager + profileMetadataCache の調整役としての連携ロジックを検証。
 * RelayManager はモックし、プロフィール取得は cache 呼び出しを検証する。
 */

function createMockRelayManager(): RelayManager {
    return {
        useRelaysFromLocalStorageIfExists: vi.fn().mockResolvedValue(false),
        setBootstrapRelays: vi.fn(),
        getFromLocalStorage: vi.fn().mockResolvedValue(null),
        fetchUserRelays: vi.fn().mockResolvedValue({
            success: true,
            relayConfig: ['wss://relay1.example.com/'],
            source: 'kind10002'
        }),
        getRelayListsForProfile: vi.fn().mockResolvedValue({
            writeRelays: ['wss://relay1.example.com/'],
            additionalRelays: ['wss://relay1.example.com/', 'wss://bootstrap.example.com/']
        }),
        saveToLocalStorage: vi.fn(),
    } as unknown as RelayManager;
}

describe('RelayProfileService', () => {
    let service: RelayProfileService;
    let mockRelayManager: RelayManager;
    let mockRxNostr: ReturnType<typeof createMockRxNostr>;
    let getProfileSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockRxNostr = createMockRxNostr();
        mockRelayManager = createMockRelayManager();
        getProfileSpy = vi.spyOn(profileMetadataCache, 'getProfile').mockResolvedValue({
            name: 'Test User',
            displayName: 'Test User',
            picture: 'https://example.com/pic.jpg',
            npub: 'npub1test',
            nprofile: 'nprofile1test'
        });
        service = new RelayProfileService(mockRxNostr as any, mockRelayManager);
    });

    describe('initializeRelays', () => {
        it('pubkeyHexが指定され、ローカルストレージにリレーがある場合はそれを使用する', async () => {
            vi.mocked(mockRelayManager.useRelaysFromLocalStorageIfExists).mockResolvedValue(true);

            await service.initializeRelays('pubkey123');

            expect(mockRelayManager.useRelaysFromLocalStorageIfExists).toHaveBeenCalledWith('pubkey123');
            expect(mockRelayManager.setBootstrapRelays).not.toHaveBeenCalled();
        });

        it('pubkeyHexが指定され、ローカルストレージにリレーがない場合はブートストラップリレーを設定する', async () => {
            vi.mocked(mockRelayManager.useRelaysFromLocalStorageIfExists).mockResolvedValue(false);

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
            vi.mocked(mockRelayManager.getFromLocalStorage).mockResolvedValue(cachedRelays);

            const result = await service.fetchRelays('pubkey123', false);

            expect(result.success).toBe(true);
            expect(result.source).toBe('localStorage');
            expect(result.relayConfig).toEqual(cachedRelays);
            expect(mockRelayManager.fetchUserRelays).not.toHaveBeenCalled();
        });

        it('forceRemote=falseでキャッシュがない場合はリモート取得する', async () => {
            vi.mocked(mockRelayManager.getFromLocalStorage).mockResolvedValue(null);

            const result = await service.fetchRelays('pubkey123', false);

            expect(mockRelayManager.fetchUserRelays).toHaveBeenCalledWith('pubkey123', { forceRemote: false });
            expect(result.success).toBe(true);
        });

        it('forceRemote=trueの場合はキャッシュを無視してリモート取得する', async () => {
            const cachedRelays = { 'wss://cached.relay.com/': { read: true, write: true } };
            vi.mocked(mockRelayManager.getFromLocalStorage).mockResolvedValue(cachedRelays);

            await service.fetchRelays('pubkey123', true);

            expect(mockRelayManager.getFromLocalStorage).not.toHaveBeenCalled();
            expect(mockRelayManager.fetchUserRelays).toHaveBeenCalledWith('pubkey123', { forceRemote: true });
        });

        it('デフォルトではforceRemote=falseとして動作する', async () => {
            vi.mocked(mockRelayManager.getFromLocalStorage).mockResolvedValue(null);

            await service.fetchRelays('pubkey123');

            expect(mockRelayManager.getFromLocalStorage).toHaveBeenCalledWith('pubkey123');
        });
    });

    describe('fetchProfile', () => {
        it('pubkeyHexが空の場合はnullを返す', async () => {
            const result = await service.fetchProfile('');
            expect(result).toBeNull();
            expect(getProfileSpy).not.toHaveBeenCalled();
        });

        it('forceRemote=falseの場合はバッチキャッシュ経由でプロフィールを取得する', async () => {
            const result = await service.fetchProfile('pubkey123', false);

            expect(mockRelayManager.getRelayListsForProfile).toHaveBeenCalledWith('pubkey123');
            expect(getProfileSpy).toHaveBeenCalledWith('pubkey123', {
                rxNostr: mockRxNostr,
                forceRefresh: false,
                allowBackgroundRefresh: false,
                writeRelays: ['wss://relay1.example.com/'],
                additionalRelays: ['wss://relay1.example.com/', 'wss://bootstrap.example.com/']
            });
            expect(result).toEqual({
                name: 'Test User',
                displayName: 'Test User',
                picture: 'https://example.com/pic.jpg',
                npub: 'npub1test',
                nprofile: 'nprofile1test'
            });
        });

        it('forceRemote=trueの場合は強制再取得でプロフィールを取得する', async () => {
            await service.fetchProfile('pubkey123', true);

            expect(getProfileSpy).toHaveBeenCalledWith('pubkey123', {
                rxNostr: mockRxNostr,
                forceRefresh: true,
                allowBackgroundRefresh: false,
                writeRelays: ['wss://relay1.example.com/'],
                additionalRelays: ['wss://relay1.example.com/', 'wss://bootstrap.example.com/']
            });
        });

        it('RelayManagerからリレーリストを取得してprofileMetadataCacheに渡す', async () => {
            vi.mocked(mockRelayManager.getRelayListsForProfile).mockResolvedValue({
                writeRelays: ['wss://write.relay.com/'],
                additionalRelays: ['wss://write.relay.com/', 'wss://read.relay.com/']
            });

            await service.fetchProfile('pubkey123');

            expect(getProfileSpy).toHaveBeenCalledWith('pubkey123', {
                rxNostr: mockRxNostr,
                forceRefresh: false,
                allowBackgroundRefresh: false,
                writeRelays: ['wss://write.relay.com/'],
                additionalRelays: ['wss://write.relay.com/', 'wss://read.relay.com/']
            });
        });

        it('source付き分類をcontextualとfallbackのままcacheへ渡す', async () => {
            vi.mocked(mockRelayManager.getRelayListsForProfile).mockResolvedValue({
                writeRelays: ['wss://write.relay.com/'],
                additionalRelays: ['wss://legacy-merged.example.com/'],
                contextualRelays: ['wss://context.example.com/'],
                fallbackRelays: ['wss://source-fallback.example.com/'],
            });

            await service.fetchProfile('pubkey123');

            expect(getProfileSpy).toHaveBeenCalledWith('pubkey123', {
                rxNostr: mockRxNostr,
                forceRefresh: false,
                allowBackgroundRefresh: false,
                writeRelays: ['wss://write.relay.com/'],
                additionalRelays: ['wss://context.example.com/'],
                fallbackRelays: ['wss://source-fallback.example.com/'],
            });
        });
    });

    describe('fetchProfileRealtime', () => {
        it('relay hint を既存のプロフィール取得リレーにマージしてSWR取得する', async () => {
            getProfileSpy.mockResolvedValue({
                name: 'Realtime User',
                displayName: 'Realtime User',
                picture: 'https://example.com/pic.jpg',
                npub: 'npub1realtime',
                nprofile: 'nprofile1realtime'
            });
            vi.mocked(mockRelayManager.getRelayListsForProfile).mockResolvedValue({
                writeRelays: ['wss://write.relay.com/'],
                additionalRelays: ['wss://bootstrap.example.com/']
            });

            const result = await service.fetchProfileRealtime('pubkey123', {
                additionalRelays: ['wss://hint-relay.example.com']
            });

            expect(getProfileSpy).toHaveBeenCalledWith('pubkey123', {
                rxNostr: mockRxNostr,
                forceRefresh: false,
                allowBackgroundRefresh: true,
                writeRelays: ['wss://write.relay.com/'],
                additionalRelays: ['wss://bootstrap.example.com/', 'wss://hint-relay.example.com/']
            });
            expect(result).toEqual({
                name: 'Realtime User',
                displayName: 'Realtime User',
                picture: 'https://example.com/pic.jpg',
                npub: 'npub1realtime',
                nprofile: 'nprofile1realtime'
            });
        });

        it('無効な external relay hint を除外して network-only 取得する', async () => {
            vi.mocked(mockRelayManager.getRelayListsForProfile).mockResolvedValue({
                writeRelays: ['wss://write.relay.com/'],
                additionalRelays: ['wss://bootstrap.example.com/']
            });

            await service.fetchProfileRealtime('pubkey123', {
                additionalRelays: [
                    'https://invalid.example.com',
                    'wss://hint-relay.example.com',
                    'wss://hint-relay.example.com/',
                ]
            });

            expect(getProfileSpy).toHaveBeenCalledWith('pubkey123', {
                rxNostr: mockRxNostr,
                forceRefresh: false,
                allowBackgroundRefresh: true,
                writeRelays: ['wss://write.relay.com/'],
                additionalRelays: ['wss://bootstrap.example.com/', 'wss://hint-relay.example.com/']
            });
        });

        it('共通プロフィールキャッシュの更新を購読する', () => {
            const callback = vi.fn();
            const unsubscribe = vi.fn();
            const subscribeSpy = vi.spyOn(profileMetadataCache, 'subscribe')
                .mockReturnValue(unsubscribe);

            const result = service.subscribeProfile('pubkey123', callback);

            expect(subscribeSpy).toHaveBeenCalledWith('pubkey123', callback);
            expect(result).toBe(unsubscribe);
            subscribeSpy.mockRestore();
        });
    });

    describe('initializeForLogin', () => {
        it('リレー取得後にプロフィールを取得する', async () => {
            const result = await service.initializeForLogin('pubkey123');

            // fetchRelays(pubkey, false) が呼ばれる
            expect(mockRelayManager.getFromLocalStorage).toHaveBeenCalledWith('pubkey123');
            // fetchProfile(pubkey, false) が呼ばれる
            expect(getProfileSpy).toHaveBeenCalled();
            expect(result).toEqual({
                name: 'Test User',
                displayName: 'Test User',
                picture: 'https://example.com/pic.jpg',
                npub: 'npub1test',
                nprofile: 'nprofile1test'
            });
        });

        it('リレーキャッシュがある場合はリモート取得をスキップする', async () => {
            vi.mocked(mockRelayManager.getFromLocalStorage).mockResolvedValue(
                ['wss://cached.relay.com/']
            );

            await service.initializeForLogin('pubkey123');

            expect(mockRelayManager.fetchUserRelays).not.toHaveBeenCalled();
        });

        it('リレーキャッシュがない場合はリモート取得する', async () => {
            vi.mocked(mockRelayManager.getFromLocalStorage).mockResolvedValue(null);

            await service.initializeForLogin('pubkey123');

            expect(mockRelayManager.fetchUserRelays).toHaveBeenCalledWith('pubkey123', { forceRemote: false });
        });
    });

    describe('refreshRelaysAndProfile', () => {
        it('リレーとプロフィールの両方を強制的にリモート取得する', async () => {
            await service.refreshRelaysAndProfile('pubkey123');

            // forceRemote=true でリレー取得
            expect(mockRelayManager.fetchUserRelays).toHaveBeenCalledWith('pubkey123', { forceRemote: true });
            // forceRemote=true でプロフィール取得
            expect(getProfileSpy).toHaveBeenCalledWith('pubkey123', expect.objectContaining({
                forceRefresh: true
            }));
        });

        it('プロフィール取得結果を返す', async () => {
            const expectedProfile = {
                name: 'Refreshed User',
                displayName: '',
                picture: 'https://example.com/new.jpg',
                npub: 'npub1refreshed',
                nprofile: 'nprofile1refreshed'
            };
            getProfileSpy.mockResolvedValue(expectedProfile);

            const result = await service.refreshRelaysAndProfile('pubkey123');
            expect(result).toEqual(expectedProfile);
        });
    });

    describe('ゲッターメソッド', () => {
        it('getRelayManager()がRelayManagerを返す', () => {
            expect(service.getRelayManager()).toBe(mockRelayManager);
        });
    });
});
