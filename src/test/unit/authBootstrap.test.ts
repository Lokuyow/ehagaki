import { describe, expect, it, vi } from 'vitest';

import {
    applyProfileToStores,
    refreshRelaysAndProfileForAccount,
} from '../../lib/bootstrap/authBootstrap';

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

    it('プロフィールが取得できない場合はストア更新を行わない', async () => {
        const relayProfileService = {
            refreshRelaysAndProfile: vi.fn().mockResolvedValue(null),
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

        expect(result).toBeNull();
        expect(profileDataStore.set).not.toHaveBeenCalled();
        expect(profileLoadedStore.set).not.toHaveBeenCalled();
        expect(accountProfileCacheStore.setProfile).not.toHaveBeenCalled();
    });
});