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

afterEach(() => vi.restoreAllMocks());

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

function deferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (error: Error) => void;
    const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
}

function backgroundBootstrap() {
    vi.spyOn(RelayProfileService.prototype, 'initializeRelays').mockResolvedValue();
    vi.spyOn(profileMetadataCache, 'getCachedProfile').mockResolvedValue(null);
    const relays = vi.spyOn(RelayProfileService.prototype, 'fetchRelays').mockResolvedValue({
        success: true, relayConfig: [], source: 'localStorage',
    });
    const profile = vi.spyOn(RelayProfileService.prototype, 'fetchProfile').mockResolvedValue(null);
    const abort = new AbortController();
    const params = {
        pubkeyHex: '05'.repeat(32),
        closeAuthDialogs: vi.fn(),
        relayListUpdatedStore: { value: 0, set: vi.fn() },
        setRelayManager: vi.fn(),
        onRelayConfigSaved: vi.fn(),
        profileDataStore: { set: vi.fn() },
        profileLoadedStore: { set: vi.fn() },
        isLoadingProfileStore: { set: vi.fn() },
        accountManager: { getAccounts: () => [] },
        accountListStore: { set: vi.fn() },
        accountProfileCacheStore: { setProfile: vi.fn() },
        profileLoadMode: 'background' as const,
        onProfileFetchStatusChange: vi.fn(),
        signal: abort.signal,
    };
    return { params, relays, profile, abort, start: () => completePostAuthBootstrap(params) };
}

describe('background post-auth bootstrap', () => {
    it('shows the authenticated identity before relays respond and returns before the profile responds', async () => {
        const setup = backgroundBootstrap();
        const relay = deferred<Awaited<ReturnType<RelayProfileService['fetchRelays']>>>();
        const profile = deferred<ReturnType<typeof createProfile>>();
        setup.relays.mockReturnValue(relay.promise);
        setup.profile.mockReturnValue(profile.promise);
        let ready = false;
        const pending = setup.start().then(session => { ready = true; return session; });
        expect(setup.params.closeAuthDialogs).toHaveBeenCalledOnce();
        expect(setup.params.profileLoadedStore.set).toHaveBeenCalledWith(true);
        expect(setup.params.profileDataStore.set.mock.calls[0][0].npub).toMatch(/^npub1/);
        expect(setup.params.isLoadingProfileStore.set).toHaveBeenCalledWith(false);
        expect(setup.params.onProfileFetchStatusChange).toHaveBeenLastCalledWith(true);
        await vi.waitFor(() => expect(setup.relays).toHaveBeenCalledOnce());
        expect(ready).toBe(false);
        expect(setup.profile).not.toHaveBeenCalled();
        relay.resolve({ success: true, relayConfig: [], source: 'kind10002' });
        const session = await pending;
        expect(ready).toBe(true);
        expect(setup.params.onProfileFetchStatusChange).toHaveBeenLastCalledWith(true);
        profile.resolve(createProfile());
        await vi.waitFor(() => expect(setup.params.profileDataStore.set).toHaveBeenLastCalledWith(createProfile()));
        await vi.waitFor(() => expect(setup.params.onProfileFetchStatusChange).toHaveBeenLastCalledWith(false));
        session.rxNostr.dispose();
    });

    it('does not wait for IndexedDB profile reads to initialize relays or become ready', async () => {
        const setup = backgroundBootstrap();
        const cache = deferred<ReturnType<typeof createProfile>>();
        vi.mocked(profileMetadataCache.getCachedProfile).mockReturnValue(cache.promise);
        const session = await setup.start();
        expect(setup.relays).toHaveBeenCalledOnce();
        cache.resolve(createProfile());
        await vi.waitFor(() => expect(setup.params.profileDataStore.set).toHaveBeenLastCalledWith(createProfile()));
        session.rxNostr.dispose();
    });

    it('a slow cached profile never overwrites a completed network profile', async () => {
        const setup = backgroundBootstrap();
        const cache = deferred<ReturnType<typeof createProfile>>();
        vi.mocked(profileMetadataCache.getCachedProfile).mockReturnValue(cache.promise);
        setup.profile.mockResolvedValue({ ...createProfile(), name: 'new' });
        const session = await setup.start();
        await vi.waitFor(() => expect(setup.params.profileDataStore.set).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'new' })));
        cache.resolve(createProfile());
        await cache.promise;
        expect(setup.params.profileDataStore.set).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'new' }));
        session.rxNostr.dispose();
    });

    it.each(['missing', 'failed'])('keeps the placeholder usable when the profile is %s', async failure => {
        const setup = backgroundBootstrap();
        if (failure === 'failed') setup.profile.mockRejectedValue(new Error('offline'));
        const session = await setup.start();
        await Promise.resolve();
        await vi.waitFor(() => expect(setup.params.onProfileFetchStatusChange).toHaveBeenLastCalledWith(false));
        expect(setup.params.profileDataStore.set).toHaveBeenCalledOnce();
        expect(setup.params.profileDataStore.set).toHaveBeenLastCalledWith(expect.objectContaining({ name: '', picture: '' }));
        expect(setup.params.isLoadingProfileStore.set).toHaveBeenLastCalledWith(false);
        session.rxNostr.dispose();
    });

    it('ignores old profile and cache completions after logout, switch, or disposal', async () => {
        const setup = backgroundBootstrap();
        const profile = deferred<ReturnType<typeof createProfile>>();
        setup.profile.mockReturnValue(profile.promise);
        const session = await setup.start();
        setup.abort.abort();
        setup.params.profileDataStore.set.mockClear();
        setup.params.onProfileFetchStatusChange.mockClear();
        profile.resolve(createProfile());
        await profile.promise;
        // Let the background chain finish, including its final status cleanup.
        await new Promise<void>(resolve => setTimeout(resolve, 0));
        expect(setup.params.profileDataStore.set).not.toHaveBeenCalled();
        expect(setup.params.onProfileFetchStatusChange).not.toHaveBeenCalled();
        session.rxNostr.dispose();
    });

    it('disposes a pending runtime and ignores late relay notifications after cancellation', async () => {
        const setup = backgroundBootstrap();
        const relay = deferred<Awaited<ReturnType<RelayProfileService['fetchRelays']>>>();
        setup.relays.mockReturnValue(relay.promise);
        const pending = setup.start();
        await vi.waitFor(() => expect(setup.relays).toHaveBeenCalledOnce());
        const runtime = (setup.relays.mock.instances[0] as RelayProfileService);
        const dispose = vi.spyOn((runtime as unknown as { rxNostr: { dispose(): void } }).rxNostr, 'dispose');
        setup.abort.abort();
        relay.resolve({ success: true, relayConfig: [], source: 'kind10002' });
        const session = await pending;
        expect(setup.profile).not.toHaveBeenCalled();
        expect(dispose).toHaveBeenCalled();
        session.rxNostr.dispose();
        expect(setup.params.accountListStore.set).not.toHaveBeenCalled();
    });
});
