import type { ProfileData } from '../lib/types';

// --- プロフィール管理 ---
let profileData = $state<ProfileData>({ name: "", picture: "", npub: "", nprofile: "" });
let profileLoaded = $state(false);
let isLoadingProfile = $state(false);

export const profileDataStore = {
    get value() { return profileData; },
    set: (value: ProfileData) => { profileData = value; }
};

export const profileLoadedStore = {
    get value() { return profileLoaded; },
    set: (value: boolean) => { profileLoaded = value; }
};

export const isLoadingProfileStore = {
    get value() { return isLoadingProfile; },
    set: (value: boolean) => { isLoadingProfile = value; }
};
