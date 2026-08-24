import { describe, expect, it, vi } from 'vitest';

import {
    applyProfileToStores,
    completePostAuthBootstrap,
    runInitializeNostrSession,
    refreshRelaysAndProfileForAccount,
} from '../../lib/bootstrap/authBootstrap';
import { RelayProfileService } from '../../lib/relayProfileService';

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

describe('runInitializeNostrSession', () => {
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
