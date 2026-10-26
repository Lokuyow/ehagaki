import { createRxNostr } from "rx-nostr";
import { verifier } from "@rx-nostr/crypto";
import { ProfileDataFactory, ProfileUrlUtils } from "../profileManager";
import { RelayManager } from "../relayManager";
import { RelayProfileService } from "../relayProfileService";
import type { AccountManager } from "../accountManager";
import type { ProfileData, RelayConfig } from "../types";
import { profilesRepository } from "../storage/profilesRepository";
import { profileMetadataCache } from "../profileMetadataCache.svelte";
import { createNip42Authenticator } from "../nostrAuthService";
import { createPostHistoryScanVerifier, registerPostHistoryScanVerifier, registerPostHistoryRelayEventSource } from "../postHistoryRawEventVerification";

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
    set: (value: ProfileData) => void;
}

interface BooleanStoreLike {
    set: (value: boolean) => void;
}

interface InitializeNostrSessionParams {
    pubkeyHex?: string;
    relayListUpdatedStore: RelayListUpdatedStoreLike;
    setRelayManager: (relayManager: RelayManager) => void;
    onRelayConfigSaved?: (pubkeyHex: string, relayConfig: RelayConfig | null) => void | Promise<void>;
    hostRelayConfig?: RelayConfig;
    isCurrent?: () => boolean;
    signal?: AbortSignal;
}

interface RunInitializeNostrSessionParams extends InitializeNostrSessionParams {
    onSession: (session: NostrSessionBootstrap) => void | Promise<void>;
}

interface SyncAccountStoresParams {
    accountManager: Pick<AccountManager, "getAccounts">;
    accountListStore: AccountListStoreLike;
    accountProfileCacheStore: AccountProfileCacheStoreLike;
    isCurrent?: () => boolean;
}

interface CompletePostAuthBootstrapParams extends SyncAccountStoresParams, InitializeNostrSessionParams {
    pubkeyHex: string;
    closeAuthDialogs: () => void;
    profileDataStore: ProfileDataStoreLike;
    profileLoadedStore: BooleanStoreLike;
    isLoadingProfileStore: BooleanStoreLike;
    isCurrent?: () => boolean;
    profileLoadMode?: 'blocking' | 'background';
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
    onRelayConfigSaved,
    hostRelayConfig,
    isCurrent = () => true,
    signal,
}: InitializeNostrSessionParams): Promise<NostrSessionBootstrap> {
    const scanVerifier = createPostHistoryScanVerifier(verifier);
    const rxNostr = createRxNostr({
        verifier: scanVerifier.verify,
        // The post-history relay source relies on this documented rx-nostr
        // boundary. Keep it explicit rather than depending on the default.
        skipVerify: false,
        ...(pubkeyHex ? { authenticator: createNip42Authenticator(pubkeyHex) } : {}),
    });
    registerPostHistoryRelayEventSource(rxNostr);
    registerPostHistoryScanVerifier(rxNostr, scanVerifier);
    const relayManager = new RelayManager(rxNostr, {
        relayListUpdatedStore: {
            value: relayListUpdatedStore.value,
            set: (value: number) => {
                if (isCurrent() && !signal?.aborted) relayListUpdatedStore.set(value);
            },
        },
        onRelayConfigSaved: onRelayConfigSaved
            ? (owner, config) => isCurrent() && !signal?.aborted ? onRelayConfigSaved(owner, config) : undefined
            : undefined,
        hostRelayConfig,
    });
    const relayProfileService = new RelayProfileService(
        rxNostr,
        relayManager,
    );

    const dispose = () => rxNostr.dispose();
    if (signal?.aborted) dispose();
    else signal?.addEventListener('abort', dispose, { once: true });
    try {
        if (isCurrent() && !signal?.aborted) {
            setRelayManager(relayManager);
            await relayProfileService.initializeRelays(pubkeyHex, signal);
        }
    } catch (error) {
        dispose();
        throw error;
    } finally {
        signal?.removeEventListener('abort', dispose);
    }

    return {
        rxNostr,
        relayProfileService,
    };
}

export async function runInitializeNostrSession({
    onSession,
    ...params
}: RunInitializeNostrSessionParams): Promise<void> {
    const session = await initializeNostrSession(params);
    await onSession(session);
}

export function syncAccountStores({
    accountManager,
    accountListStore,
    accountProfileCacheStore,
    isCurrent = () => true,
}: SyncAccountStoresParams): Promise<void> {
    if (!isCurrent()) return Promise.resolve();
    const accounts = accountManager.getAccounts();
    accountListStore.set(accounts);

    return Promise.all(accounts.map(async (account) => {
        const profile = await profilesRepository.get(account.pubkeyHex);
        if (!profile || !isCurrent()) {
            return;
        }

        const picture =
            typeof profile.picture === "string"
                ? ProfileUrlUtils.ensureProfileMarker(profile.picture)
                : "";

        accountProfileCacheStore.setProfile(account.pubkeyHex, {
            name: profile.name || "",
            displayName: profile.displayName || "",
            picture,
        });
    })).then(() => undefined);
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

function createDefaultProfileForAccount(pubkeyHex: string): ProfileData {
    return new ProfileDataFactory().createProfileData({}, pubkeyHex);
}

export async function refreshRelaysAndProfileForAccount({
    pubkeyHex,
    relayProfileService,
    profileDataStore,
    profileLoadedStore,
    accountProfileCacheStore,
}: RefreshRelaysAndProfileForAccountParams): Promise<ProfileData | null> {
    const fetchedProfile = await relayProfileService.refreshRelaysAndProfile(pubkeyHex);
    const profile = fetchedProfile ?? createDefaultProfileForAccount(pubkeyHex);

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
    onRelayConfigSaved,
    hostRelayConfig,
    isCurrent = () => true,
    profileLoadMode = 'blocking',
    signal,
}: CompletePostAuthBootstrapParams): Promise<NostrSessionBootstrap> {
    const current = () => isCurrent() && !signal?.aborted;
    const background = profileLoadMode === 'background';
    isLoadingProfileStore.set(!background);
    closeAuthDialogs();

    let profileResolved = false;
    const apply = (profile: ProfileData) => {
        if (current()) applyProfileToStores({ pubkeyHex, profile, profileDataStore, profileLoadedStore, accountProfileCacheStore });
    };
    if (background && current()) {
        apply(createDefaultProfileForAccount(pubkeyHex));
        // IndexedDB must not hold relay initialization or posting readiness open.
        void profileMetadataCache.getCachedProfile(pubkeyHex).then(profile => {
            if (profile && !profileResolved) apply(profile);
        }).catch(() => undefined);
    }

    let session: NostrSessionBootstrap | undefined;
    const cancelPendingSession = () => session?.rxNostr.dispose();
    try {
        session = await initializeNostrSession({
            pubkeyHex,
            relayListUpdatedStore,
            setRelayManager,
            onRelayConfigSaved,
            hostRelayConfig,
            isCurrent: current,
            signal,
        });
        if (signal?.aborted) cancelPendingSession();
        else signal?.addEventListener('abort', cancelPendingSession, { once: true });
        if (!current()) return session;
        if (background) {
            await session.relayProfileService.fetchRelays(pubkeyHex, false, signal);
            if (!current()) return session;
            void session.relayProfileService.fetchProfile(pubkeyHex, false, signal).then(profile => {
                if (profile) {
                    profileResolved = true;
                    apply(profile);
                }
            }).catch(() => undefined);
            return session;
        }
        const fetchedProfile = await session.relayProfileService.initializeForLogin(pubkeyHex, signal);
        if (!current()) return session;
        const profile = fetchedProfile ?? createDefaultProfileForAccount(pubkeyHex);

        applyProfileToStores({
            pubkeyHex,
            profile,
            profileDataStore,
            profileLoadedStore,
            accountProfileCacheStore,
        });

        return session;
    } catch (error) {
        session?.rxNostr.dispose();
        if (session && signal?.aborted) return session;
        throw error;
    } finally {
        signal?.removeEventListener('abort', cancelPendingSession);
        if (current()) {
            isLoadingProfileStore.set(false);
            const sync = syncAccountStores({ accountManager, accountListStore, accountProfileCacheStore, isCurrent: current });
            if (background) void sync.catch(() => undefined);
            else await sync;
        }
    }
}
