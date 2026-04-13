import { createRxNostr } from "rx-nostr";
import { verifier } from "@rx-nostr/crypto";
import { ProfileManager, ProfileUrlUtils } from "../profileManager";
import { RelayManager } from "../relayManager";
import { RelayProfileService } from "../relayProfileService";
import { STORAGE_KEYS } from "../constants";
import type { AccountManager } from "../accountManager";
import type { ProfileData } from "../types";

export interface NostrSessionBootstrap {
    rxNostr: ReturnType<typeof createRxNostr>;
    relayProfileService: RelayProfileService;
}

interface RelayListUpdatedStoreLike {
    value: number;
    set: (value: number) => void;
}

interface AccountProfileCacheStoreLike {
    setProfile: (pubkeyHex: string, profile: {
        name: string;
        displayName: string;
        picture: string;
    }) => void;
}

interface AccountListStoreLike {
    set: (value: ReturnType<AccountManager["getAccounts"]>) => void;
}

interface ProfileDataStoreLike {
    set: (value: any) => void;
}

interface BooleanStoreLike {
    set: (value: boolean) => void;
}

interface InitializeNostrSessionParams {
    pubkeyHex?: string;
    relayListUpdatedStore: RelayListUpdatedStoreLike;
    setRelayManager: (relayManager: RelayManager) => void;
}

interface SyncAccountStoresParams {
    accountManager: Pick<AccountManager, "getAccounts">;
    accountListStore: AccountListStoreLike;
    accountProfileCacheStore: AccountProfileCacheStoreLike;
    localStorage: Storage;
}

interface CompletePostAuthBootstrapParams extends SyncAccountStoresParams, InitializeNostrSessionParams {
    pubkeyHex: string;
    closeAuthDialogs: () => void;
    profileDataStore: ProfileDataStoreLike;
    profileLoadedStore: BooleanStoreLike;
    isLoadingProfileStore: BooleanStoreLike;
}

interface ApplyProfileToStoresParams {
    pubkeyHex: string;
    profile: ProfileData;
    profileDataStore: ProfileDataStoreLike;
    profileLoadedStore: BooleanStoreLike;
    accountProfileCacheStore: AccountProfileCacheStoreLike;
}

interface RefreshRelaysAndProfileForAccountParams {
    pubkeyHex: string;
    relayProfileService: Pick<RelayProfileService, 'refreshRelaysAndProfile'>;
    profileDataStore: ProfileDataStoreLike;
    profileLoadedStore: BooleanStoreLike;
    accountProfileCacheStore: AccountProfileCacheStoreLike;
}

export async function initializeNostrSession({
    pubkeyHex,
    relayListUpdatedStore,
    setRelayManager,
}: InitializeNostrSessionParams): Promise<NostrSessionBootstrap> {
    const rxNostr = createRxNostr({ verifier });
    const profileManager = new ProfileManager(rxNostr);
    const relayManager = new RelayManager(rxNostr, {
        relayListUpdatedStore: {
            value: relayListUpdatedStore.value,
            set: (value: number) => relayListUpdatedStore.set(value),
        },
    });
    const relayProfileService = new RelayProfileService(
        rxNostr,
        relayManager,
        profileManager,
    );

    setRelayManager(relayManager);
    await relayProfileService.initializeRelays(pubkeyHex);

    return {
        rxNostr,
        relayProfileService,
    };
}

export function syncAccountStores({
    accountManager,
    accountListStore,
    accountProfileCacheStore,
    localStorage,
}: SyncAccountStoresParams): void {
    const accounts = accountManager.getAccounts();
    accountListStore.set(accounts);

    for (const account of accounts) {
        try {
            const profileData = localStorage.getItem(
                STORAGE_KEYS.NOSTR_PROFILE + account.pubkeyHex,
            );
            if (!profileData) {
                continue;
            }

            const profile = JSON.parse(profileData);
            const picture =
                typeof profile.picture === "string"
                    ? ProfileUrlUtils.ensureProfileMarker(profile.picture)
                    : "";

            accountProfileCacheStore.setProfile(account.pubkeyHex, {
                name: profile.name || "",
                displayName: profile.displayName || "",
                picture,
            });
        } catch {
            // ignore cache entry parse failures
        }
    }
}

export function applyProfileToStores({
    pubkeyHex,
    profile,
    profileDataStore,
    profileLoadedStore,
    accountProfileCacheStore,
}: ApplyProfileToStoresParams): void {
    profileDataStore.set(profile);
    profileLoadedStore.set(true);
    accountProfileCacheStore.setProfile(pubkeyHex, {
        name: profile.name,
        displayName: profile.displayName,
        picture: profile.picture,
    });
}

export async function refreshRelaysAndProfileForAccount({
    pubkeyHex,
    relayProfileService,
    profileDataStore,
    profileLoadedStore,
    accountProfileCacheStore,
}: RefreshRelaysAndProfileForAccountParams): Promise<ProfileData | null> {
    const profile = await relayProfileService.refreshRelaysAndProfile(pubkeyHex);
    if (!profile) {
        return null;
    }

    applyProfileToStores({
        pubkeyHex,
        profile,
        profileDataStore,
        profileLoadedStore,
        accountProfileCacheStore,
    });

    return profile;
}

export async function completePostAuthBootstrap({
    pubkeyHex,
    closeAuthDialogs,
    relayListUpdatedStore,
    setRelayManager,
    profileDataStore,
    profileLoadedStore,
    isLoadingProfileStore,
    accountManager,
    accountListStore,
    accountProfileCacheStore,
    localStorage,
}: CompletePostAuthBootstrapParams): Promise<NostrSessionBootstrap> {
    isLoadingProfileStore.set(true);
    closeAuthDialogs();

    try {
        const session = await initializeNostrSession({
            pubkeyHex,
            relayListUpdatedStore,
            setRelayManager,
        });
        const profile = await session.relayProfileService.initializeForLogin(pubkeyHex);

        if (profile) {
            applyProfileToStores({
                pubkeyHex,
                profile,
                profileDataStore,
                profileLoadedStore,
                accountProfileCacheStore,
            });
        }

        return session;
    } finally {
        isLoadingProfileStore.set(false);
        syncAccountStores({
            accountManager,
            accountListStore,
            accountProfileCacheStore,
            localStorage,
        });
    }
}