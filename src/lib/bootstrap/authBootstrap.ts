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
}

interface RunInitializeNostrSessionParams extends InitializeNostrSessionParams {
    onSession: (session: NostrSessionBootstrap) => void | Promise<void>;
}

interface SyncAccountStoresParams {
    accountManager: Pick<AccountManager, "getAccounts">;
    accountListStore: AccountListStoreLike;
    accountProfileCacheStore: AccountProfileCacheStoreLike;
}

interface CompletePostAuthBootstrapParams extends SyncAccountStoresParams, InitializeNostrSessionParams {
    pubkeyHex: string;
    closeAuthDialogs: () => void;
    profileDataStore: ProfileDataStoreLike;
    profileLoadedStore: BooleanStoreLike;
    isLoadingProfileStore: BooleanStoreLike;
    isCurrent?: () => boolean;
    profileLoadMode?: 'blocking' | 'background';
    signal?: AbortSignal;
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
                if (isCurrent()) relayListUpdatedStore.set(value);
            },
        },
        onRelayConfigSaved: onRelayConfigSaved
            ? (owner, config) => isCurrent() ? onRelayConfigSaved(owner, config) : undefined
            : undefined,
        hostRelayConfig,
    });
    const relayProfileService = new RelayProfileService(
        rxNostr,
        relayManager,
    );

    if (isCurrent()) setRelayManager(relayManager);
    await relayProfileService.initializeRelays(pubkeyHex);

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
}: SyncAccountStoresParams): Promise<void> {
    const accounts = accountManager.getAccounts();
    accountListStore.set(accounts);

    return Promise.all(accounts.map(async (account) => {
        const profile = await profilesRepository.get(account.pubkeyHex);
        if (!profile) {
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
    isCurrent: isCurrentAuth = () => true,
    profileLoadMode = 'blocking',
    signal,
}: CompletePostAuthBootstrapParams): Promise<NostrSessionBootstrap> {
    const backgroundProfile = profileLoadMode === 'background';
    const isCurrent = () => isCurrentAuth() && !signal?.aborted;
    let pendingSession: NostrSessionBootstrap | undefined;
    const abortPendingSession = () => pendingSession?.rxNostr.dispose();
    isLoadingProfileStore.set(!backgroundProfile);
    closeAuthDialogs();

    try {
        if (backgroundProfile && isCurrent()) {
            applyProfileToStores({
                pubkeyHex,
                profile: createDefaultProfileForAccount(pubkeyHex),
                profileDataStore,
                profileLoadedStore,
                accountProfileCacheStore,
            });
            const cachedProfile = await profileMetadataCache.getCachedProfile(pubkeyHex).catch(() => null);
            if (cachedProfile && isCurrent()) {
                applyProfileToStores({
                    pubkeyHex,
                    profile: cachedProfile,
                    profileDataStore,
                    profileLoadedStore,
                    accountProfileCacheStore,
                });
            }
        }
        const session = await initializeNostrSession({
            pubkeyHex,
            relayListUpdatedStore,
            setRelayManager,
            onRelayConfigSaved,
            hostRelayConfig,
            isCurrent,
        });
        if (backgroundProfile) {
            pendingSession = session;
            if (signal?.aborted) abortPendingSession();
            else signal?.addEventListener('abort', abortPendingSession, { once: true });
            if (!isCurrent()) return session;
            // Preserve relay selection and fallback before exposing a posting
            // runtime. Profile network I/O no longer holds this transition open.
            try {
                await session.relayProfileService.fetchRelays(pubkeyHex, false);
            } catch (error) {
                session.rxNostr.dispose();
                throw error;
            }
            if (!isCurrent()) return session;
            void session.relayProfileService.fetchProfile(pubkeyHex, false).then((profile) => {
                if (profile && isCurrent()) {
                    applyProfileToStores({
                        pubkeyHex,
                        profile,
                        profileDataStore,
                        profileLoadedStore,
                        accountProfileCacheStore,
                    });
                }
            }).catch(() => {
                // The current-account placeholder/cache remains usable.
            });
            return session;
        }
        const fetchedProfile = await session.relayProfileService.initializeForLogin(pubkeyHex);
        if (!isCurrent()) return session;
        const profile = fetchedProfile ?? createDefaultProfileForAccount(pubkeyHex);

        applyProfileToStores({
            pubkeyHex,
            profile,
            profileDataStore,
            profileLoadedStore,
            accountProfileCacheStore,
        });

        return session;
    } finally {
        signal?.removeEventListener('abort', abortPendingSession);
        if (!backgroundProfile || isCurrent()) isLoadingProfileStore.set(false);
        if (isCurrent()) {
            await syncAccountStores({ accountManager, accountListStore, accountProfileCacheStore });
        }
    }
}
