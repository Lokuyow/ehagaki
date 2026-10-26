import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    applyProfileToStores,
    completePostAuthBootstrap,
    initializeNostrSession,
    runInitializeNostrSession,
    refreshRelaysAndProfileForAccount,
} from '../../lib/bootstrap/authBootstrap';
import { RelayProfileService } from '../../lib/relayProfileService';
import { profileMetadataCache } from '../../lib/profileMetadataCache.svelte';

function createProfile() {
    return {
        name: 'name',
        displayName: 'display',
        picture: 'https://example.com/avatar.png',
        npub: 'npub1test',
        nprofile: 'nprofile1test',
    };
}

describe('applyProfileToStores', () => {
    it('プロフィールストアとアカウントキャッシュを同時に更新する', () => {
        const profile = createProfile();
        const profileDataStore = { set: vi.fn() };
        const profileLoadedStore = { set: vi.fn() };
        const accountProfileCacheStore = { setProfile: vi.fn() };

        applyProfileToStores({
            pubkeyHex: 'pubkey-1',
            profile,
            profileDataStore,
            profileLoadedStore,
            accountProfileCacheStore,
        });

        expect(profileDataStore.set).toHaveBeenCalledWith(profile);
        expect(profileLoadedStore.set).toHaveBeenCalledWith(true);
        expect(accountProfileCacheStore.setProfile).toHaveBeenCalledWith('pubkey-1', {
            name: profile.name,
            displayName: profile.displayName,
            picture: profile.picture,
        });
    });
});

describe('refreshRelaysAndProfileForAccount', () => {
    it('再取得したプロフィールを共通 helper 経由で反映する', async () => {
        const profile = createProfile();
        const relayProfileService = {
            refreshRelaysAndProfile: vi.fn().mockResolvedValue(profile),
        };
        const profileDataStore = { set: vi.fn() };
        const profileLoadedStore = { set: vi.fn() };
        const accountProfileCacheStore = { setProfile: vi.fn() };

        const result = await refreshRelaysAndProfileForAccount({
            pubkeyHex: 'pubkey-1',
            relayProfileService,
            profileDataStore,
            profileLoadedStore,
            accountProfileCacheStore,
        });

        expect(result).toEqual(profile);
        expect(relayProfileService.refreshRelaysAndProfile).toHaveBeenCalledWith('pubkey-1');
        expect(profileDataStore.set).toHaveBeenCalledWith(profile);
        expect(profileLoadedStore.set).toHaveBeenCalledWith(true);
        expect(accountProfileCacheStore.setProfile).toHaveBeenCalledWith('pubkey-1', {
            name: profile.name,
            displayName: profile.displayName,
            picture: profile.picture,
        });
    });

    it('プロフィールがないアカウントには対象pubkeyのデフォルトプロフィールを反映する', async () => {
        const accountA = createProfile();
        const relayProfileService = {
            refreshRelaysAndProfile: vi.fn().mockResolvedValue(null),
        };
        const profileDataStore = { set: vi.fn() };
        const profileLoadedStore = { set: vi.fn() };
        const accountProfileCacheStore = { setProfile: vi.fn() };

        profileDataStore.set(accountA);

        const result = await refreshRelaysAndProfileForAccount({
            pubkeyHex: '02'.repeat(32),
            relayProfileService,
            profileDataStore,
            profileLoadedStore,
            accountProfileCacheStore,
        });

        expect(result).toMatchObject({
            name: '',
            displayName: '',
            picture: '',
        });
        expect(result?.npub).toMatch(/^npub1/);
        expect(result?.nprofile).toMatch(/^nprofile1/);
        expect(profileDataStore.set).toHaveBeenLastCalledWith(result);
        expect(profileLoadedStore.set).toHaveBeenLastCalledWith(true);
        expect(accountProfileCacheStore.setProfile).toHaveBeenLastCalledWith('02'.repeat(32), {
            name: '',
            displayName: '',
            picture: '',
        });
        expect(result?.picture).not.toBe(accountA.picture);
    });
});

describe('completePostAuthBootstrap', () => {
    it('認証後のプロフィール取得中に遷移した場合は古いプロフィールとアカウント同期を反映しない', async () => {
        const pubkeyHex = '04'.repeat(32);
        const staleProfile = createProfile();
        let current = true;
        let resolveProfile!: (profile: ReturnType<typeof createProfile>) => void;
        const profileDataStore = { set: vi.fn() };
        const accountProfileCacheStore = { setProfile: vi.fn() };
        const accountListStore = { set: vi.fn() };

        vi.spyOn(RelayProfileService.prototype, 'initializeRelays').mockResolvedValue(undefined);
        vi.spyOn(RelayProfileService.prototype, 'initializeForLogin').mockReturnValue(
            new Promise(resolve => { resolveProfile = resolve; }),
        );

        const bootstrap = completePostAuthBootstrap({
            pubkeyHex,
            closeAuthDialogs: vi.fn(),
            relayListUpdatedStore: { value: 0, set: vi.fn() },
            setRelayManager: vi.fn(),
            profileDataStore,
            profileLoadedStore: { set: vi.fn() },
            isLoadingProfileStore: { set: vi.fn() },
            accountManager: { getAccounts: () => [] },
            accountListStore,
            accountProfileCacheStore,
            isCurrent: () => current,
        });

        current = false;
        resolveProfile(staleProfile);
        await bootstrap;

        expect(profileDataStore.set).not.toHaveBeenCalled();
        expect(accountProfileCacheStore.setProfile).not.toHaveBeenCalled();
        expect(accountListStore.set).not.toHaveBeenCalled();
        vi.restoreAllMocks();
    });

    it('認証後にkind:0がない場合も前アカウントのプロフィールを残さない', async () => {
        const pubkeyHex = '03'.repeat(32);
        const accountA = createProfile();
        const currentProfile = { value: accountA };
        const profileDataStore = {
            set: vi.fn((profile) => {
                currentProfile.value = profile;
            }),
        };
        const profileLoadedStore = { set: vi.fn() };
        const accountProfileCacheStore = { setProfile: vi.fn() };

        vi.spyOn(RelayProfileService.prototype, 'initializeRelays').mockResolvedValue(undefined);
        vi.spyOn(RelayProfileService.prototype, 'initializeForLogin').mockResolvedValue(null);

        await completePostAuthBootstrap({
            pubkeyHex,
            closeAuthDialogs: vi.fn(),
            relayListUpdatedStore: { value: 0, set: vi.fn() },
            setRelayManager: vi.fn(),
            profileDataStore,
            profileLoadedStore,
            isLoadingProfileStore: { set: vi.fn() },
            accountManager: { getAccounts: () => [] },
            accountListStore: { set: vi.fn() },
            accountProfileCacheStore,
        });

        expect(currentProfile.value).toMatchObject({
            name: '',
            displayName: '',
            picture: '',
        });
        expect(currentProfile.value.npub).toMatch(/^npub1/);
        expect(currentProfile.value.nprofile).toMatch(/^nprofile1/);
        expect(currentProfile.value).not.toEqual(accountA);
        expect(profileLoadedStore.set).toHaveBeenCalledWith(true);
        expect(accountProfileCacheStore.setProfile).toHaveBeenCalledWith(pubkeyHex, {
            name: '',
            displayName: '',
            picture: '',
        });

        vi.restoreAllMocks();
    });
});

describe('親連携のbackgroundプロフィールbootstrap', () => {
    const sessions: Array<{ rxNostr: { dispose(): void } }> = [];
    afterEach(() => {
        for (const session of sessions.splice(0)) session.rxNostr.dispose();
        vi.restoreAllMocks();
    });

    function createBackgroundBootstrap() {
        const deps = {
            pubkeyHex: '05'.repeat(32),
            closeAuthDialogs: vi.fn(),
            relayListUpdatedStore: { value: 0, set: vi.fn() },
            setRelayManager: vi.fn(),
            profileDataStore: { set: vi.fn() },
            profileLoadedStore: { set: vi.fn() },
            isLoadingProfileStore: { set: vi.fn() },
            accountManager: { getAccounts: () => [] },
            accountListStore: { set: vi.fn() },
            accountProfileCacheStore: { setProfile: vi.fn() },
            isCurrent: () => true,
            profileLoadMode: 'background' as const,
        };
        vi.spyOn(profileMetadataCache, 'getCachedProfile').mockResolvedValue(null);
        vi.spyOn(RelayProfileService.prototype, 'initializeRelays').mockResolvedValue(undefined);
        const relays = vi.spyOn(RelayProfileService.prototype, 'fetchRelays').mockResolvedValue({
            success: false, relayConfig: {}, source: 'fallback',
        });
        const profile = vi.spyOn(RelayProfileService.prototype, 'fetchProfile').mockResolvedValue(null);
        return { deps, relays, profile };
    }

    it('認証表示を先に確定し、リレーを待って返るがプロフィール取得は待たない', async () => {
        const { deps, relays, profile } = createBackgroundBootstrap();
        let finishRelays!: (value: Awaited<ReturnType<RelayProfileService['fetchRelays']>>) => void;
        let finishProfile!: (value: ReturnType<typeof createProfile>) => void;
        relays.mockImplementation(() => new Promise(resolve => { finishRelays = resolve; }));
        profile.mockImplementation(() => new Promise(resolve => { finishProfile = resolve; }));
        const task = completePostAuthBootstrap(deps);
        expect(deps.profileDataStore.set).toHaveBeenCalledWith(expect.objectContaining({
            name: '', picture: '', npub: expect.stringMatching(/^npub1/),
        }));
        expect(deps.profileLoadedStore.set).toHaveBeenCalledWith(true);
        expect(deps.isLoadingProfileStore.set).toHaveBeenCalledWith(false);
        await vi.waitFor(() => expect(relays).toHaveBeenCalledTimes(1));
        expect(profile).not.toHaveBeenCalled();
        let ready = false;
        void task.then(() => { ready = true; });
        await Promise.resolve();
        expect(ready).toBe(false);
        finishRelays({ success: false, relayConfig: {}, source: 'fallback' });
        sessions.push(await task);
        expect(profile).toHaveBeenCalledTimes(1);
        expect(deps.profileDataStore.set).toHaveBeenCalledTimes(1);
        const fetched = createProfile();
        finishProfile(fetched);
        await vi.waitFor(() => expect(deps.profileDataStore.set).toHaveBeenLastCalledWith(fetched));
    });

    it.each(['missing', 'failure'] as const)('プロフィール%s時も保存済み表示とruntimeを維持する', async (result) => {
        const { deps, profile } = createBackgroundBootstrap();
        const cached = createProfile();
        vi.mocked(profileMetadataCache.getCachedProfile).mockResolvedValue(cached);
        if (result === 'failure') profile.mockRejectedValue(new Error('profile unavailable'));
        sessions.push(await completePostAuthBootstrap(deps));
        await Promise.resolve();
        expect(deps.profileDataStore.set).toHaveBeenLastCalledWith(cached);
        expect(deps.isLoadingProfileStore.set).not.toHaveBeenCalledWith(true);
    });

    it('後続プロフィール取得の完了で切替先の表示やloadingを上書きしない', async () => {
        const { deps, profile } = createBackgroundBootstrap();
        let current = true;
        deps.isCurrent = () => current;
        let finish!: (value: ReturnType<typeof createProfile>) => void;
        profile.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
        sessions.push(await completePostAuthBootstrap(deps));
        current = false;
        deps.profileDataStore.set.mockClear();
        deps.accountProfileCacheStore.setProfile.mockClear();
        deps.isLoadingProfileStore.set.mockClear();
        finish(createProfile());
        await Promise.resolve();
        await Promise.resolve();
        expect(deps.profileDataStore.set).not.toHaveBeenCalled();
        expect(deps.accountProfileCacheStore.setProfile).not.toHaveBeenCalled();
        expect(deps.isLoadingProfileStore.set).not.toHaveBeenCalled();
    });

    it('リレー準備中の無効化後はプロフィール取得とアカウント同期を開始しない', async () => {
        const { deps, relays, profile } = createBackgroundBootstrap();
        let current = true;
        deps.isCurrent = () => current;
        let finish!: (value: Awaited<ReturnType<RelayProfileService['fetchRelays']>>) => void;
        relays.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
        const task = completePostAuthBootstrap(deps);
        await vi.waitFor(() => expect(relays).toHaveBeenCalled());
        current = false;
        deps.isLoadingProfileStore.set.mockClear();
        finish({ success: false, relayConfig: {}, source: 'fallback' });
        sessions.push(await task);
        expect(profile).not.toHaveBeenCalled();
        expect(deps.accountListStore.set).not.toHaveBeenCalled();
        expect(deps.isLoadingProfileStore.set).not.toHaveBeenCalled();
    });

    it('リレー準備中のabortでは公開前のruntimeを破棄し、後続処理を開始しない', async () => {
        const { deps, relays, profile } = createBackgroundBootstrap();
        const abort = new AbortController();
        let finish!: (value: Awaited<ReturnType<RelayProfileService['fetchRelays']>>) => void;
        relays.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
        const task = completePostAuthBootstrap({ ...deps, signal: abort.signal });
        await vi.waitFor(() => expect(relays).toHaveBeenCalled());
        abort.abort();
        finish({ success: false, relayConfig: {}, source: 'fallback' });
        const session = await task;
        sessions.push(session);
        expect(profile).not.toHaveBeenCalled();
        expect(deps.accountListStore.set).not.toHaveBeenCalled();
        expect(() => session.rxNostr.use({} as never)).toThrow();
    });
});

describe('runInitializeNostrSession', () => {
    it('旧runtimeのリレー保存完了は同じアカウントの新しい画面状態も変更しない', async () => {
        let current = true;
        const set = vi.fn();
        const onRelayConfigSaved = vi.fn();
        vi.spyOn(RelayProfileService.prototype, 'initializeRelays').mockResolvedValue(undefined);
        const session = await initializeNostrSession({
            pubkeyHex: '06'.repeat(32),
            relayListUpdatedStore: { value: 0, set },
            setRelayManager: vi.fn(),
            onRelayConfigSaved,
            isCurrent: () => current,
        });
        try {
            const config = { 'wss://late-relay.example/': {
                url: 'wss://late-relay.example/', read: true, write: true,
            } };
            current = false;
            await session.relayProfileService.getRelayManager().saveToLocalStorage('06'.repeat(32), config);
            expect(onRelayConfigSaved).not.toHaveBeenCalled();
            expect(set).not.toHaveBeenCalled();
            current = true;
            await session.relayProfileService.getRelayManager().saveToLocalStorage('06'.repeat(32), config);
            expect(onRelayConfigSaved).toHaveBeenCalledTimes(1);
            expect(set).toHaveBeenCalledTimes(1);
        } finally {
            session.rxNostr.dispose();
            vi.restoreAllMocks();
        }
    });

    it('初期化した session を callback に渡す', async () => {
        const onSession = vi.fn().mockResolvedValue(undefined);

        await runInitializeNostrSession({
            relayListUpdatedStore: {
                value: 0,
                set: vi.fn(),
            },
            setRelayManager: vi.fn(),
            onRelayConfigSaved: vi.fn(),
            onSession,
        });

        expect(onSession).toHaveBeenCalledOnce();
        expect(onSession.mock.calls[0][0]).toEqual(expect.objectContaining({
            rxNostr: expect.any(Object),
            relayProfileService: expect.any(Object),
        }));
    });
});
