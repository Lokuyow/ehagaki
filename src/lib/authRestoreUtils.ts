import { nip19 } from 'nostr-tools';
import { buildManagedRestoreCandidates } from './authManagedRestoreUtils';
import { restoreManagedSessionAccount } from './authManagedSessionRestoreUtils';
import { Nip46Service as Nip46Storage } from './nip46Service';
import { ParentClientAuthService as ParentClientStorage } from './parentClientAuthService';
import type { PublicKeyState } from './keyManager.svelte';
import type { Nip07AuthService } from './nip07AuthService';
import type { Nip46Service } from './nip46Service';
import type { PublicKeyData, StoredAccount } from './types';
import type { ParentClientAuthService } from './parentClientAuthService';

const LEGACY_NIP07_STORAGE_KEY = 'nostr-nip07-pubkey';

export type RestoreResult = { hasAuth: boolean; pubkeyHex?: string };
export type ManagedRestoreFailureReason =
    | 'invalid-requested-pubkey'
    | 'local-nsec-auth-disabled'
    | 'account-record-mismatch'
    | 'credential-missing'
    | 'credential-read-failed'
    | 'credential-invalid'
    | 'identity-source-unavailable'
    | 'identity-read-failed'
    | 'identity-mismatch'
    | 'session-unavailable'
    | 'reconnect-failed'
    | 'persistence-failed'
    | 'runtime-commit-failed'
    | 'unsupported-account-type';
export type ManagedRestoreResult =
    | { hasAuth: true; pubkeyHex: string }
    | { hasAuth: false; reason: ManagedRestoreFailureReason };

export const MANAGED_NIP07_EXTENSION_DISCOVERY_TIMEOUT_MS = 1_000;
export const MANAGED_NIP07_IDENTITY_READ_TIMEOUT_MS = 3_000;

type AccountAuthType = StoredAccount['type'];
type PublicKeyAuthType = 'nip07' | 'nip46' | 'parentClient';
type SetAuthFn = (pubkey: string, npub: string, nprofile: string) => void;
type AccountMigrationTarget = Pick<{ addAccount(pubkeyHex: string, type: AccountAuthType): void }, 'addAccount'>;

interface PublicKeyAuthDependencies {
    setNip07AuthFn: SetAuthFn;
    setNip46AuthFn: SetAuthFn;
    setParentClientAuthFn: SetAuthFn;
}

interface NsecRestoreDependencies {
    publicKeyState: PublicKeyState;
    keyManager: {
        derivePublicKey(secretKey: string): PublicKeyData;
    };
    setNsecAuthFn: SetAuthFn;
}

interface LegacyNsecDependencies extends NsecRestoreDependencies {
    keyManager: NsecRestoreDependencies['keyManager'] & {
        loadFromStorage(): string | null;
    };
}

export interface ManagedAuthRestoreDependencies extends NsecRestoreDependencies, PublicKeyAuthDependencies {
    localStorage: Storage;
    nip07Service: Pick<Nip07AuthService, 'waitForExtension' | 'authenticate'>;
    nip46Svc: Pick<Nip46Service, 'reconnect' | 'bindSessionPersistence' | 'disconnect'>;
    parentClientSvc: Pick<ParentClientAuthService, 'reconnect' | 'getSessionData' | 'disconnect'>;
    isExpectedAccount(pubkeyHex: string, type: AccountAuthType): boolean;
    console: Console;
    keyManager: NsecRestoreDependencies['keyManager'] & {
        isValidNsec(secretKey: string): boolean;
        readStoredKey(pubkeyHex: string):
            | { status: 'found'; secretKey: string }
            | { status: 'missing' }
            | { status: 'error' };
        setCurrentSecretKey(secretKey: string | null): void;
    };
}

interface LegacyNip07Dependencies extends PublicKeyAuthDependencies {
    localStorage: Storage;
    nip07Service: Pick<Nip07AuthService, 'waitForExtension'>;
    accountManager?: AccountMigrationTarget | null;
    console: Console;
}

interface LegacyNip46Dependencies extends PublicKeyAuthDependencies {
    localStorage: Storage;
    nip46Svc: Pick<Nip46Service, 'reconnect' | 'saveSession'>;
    accountManager?: AccountMigrationTarget | null;
    console: Console;
}

interface ManagedAccountRestoreDependencies {
    accountManager: Pick<
        AccountMigrationTarget,
        never
    > & {
        getActiveAccountPubkey(): string | null;
        getAccountType(pubkeyHex: string): AccountAuthType | null;
        getAccounts(): Array<Pick<StoredAccount, 'pubkeyHex' | 'type'>>;
        setActiveAccount(pubkeyHex: string): void;
    };
    restoreAccount(pubkeyHex: string, type: AccountAuthType): Promise<RestoreResult>;
}

export interface LegacyAuthCheckDependencies extends LegacyNsecDependencies, LegacyNip07Dependencies, LegacyNip46Dependencies {
    localNsecAuthEnabled: boolean;
}

function createProfileRefs(pubkeyHex: string): { npub: string; nprofile: string } {
    return {
        npub: nip19.npubEncode(pubkeyHex),
        nprofile: nip19.nprofileEncode({ pubkey: pubkeyHex, relays: [] }),
    };
}

export function applyPublicKeyAuth(
    type: PublicKeyAuthType,
    pubkeyHex: string,
    dependencies: PublicKeyAuthDependencies,
): RestoreResult {
    const { npub, nprofile } = createProfileRefs(pubkeyHex);

    if (type === 'nip07') {
        dependencies.setNip07AuthFn(pubkeyHex, npub, nprofile);
    } else if (type === 'parentClient') {
        dependencies.setParentClientAuthFn(pubkeyHex, npub, nprofile);
    } else {
        dependencies.setNip46AuthFn(pubkeyHex, npub, nprofile);
    }

    return { hasAuth: true, pubkeyHex };
}

export function restoreNsecFromStoredKey(
    secretKey: string,
    dependencies: NsecRestoreDependencies,
): RestoreResult {
    dependencies.publicKeyState.setNsec(secretKey);

    try {
        const derived = dependencies.keyManager.derivePublicKey(secretKey);
        if (!derived.hex) {
            return { hasAuth: false };
        }

        dependencies.setNsecAuthFn(derived.hex, derived.npub, derived.nprofile);
        return { hasAuth: true, pubkeyHex: derived.hex };
    } catch {
        return { hasAuth: false };
    }
}

export async function restoreManagedNsecAccount(
    pubkeyHex: string,
    dependencies: ManagedAuthRestoreDependencies,
): Promise<ManagedRestoreResult> {
    const storedKeyResult = dependencies.keyManager.readStoredKey(pubkeyHex);
    if (storedKeyResult.status === 'missing') {
        return { hasAuth: false, reason: 'credential-missing' };
    }
    if (storedKeyResult.status === 'error') {
        return { hasAuth: false, reason: 'credential-read-failed' };
    }

    const { secretKey } = storedKeyResult;
    if (!dependencies.keyManager.isValidNsec(secretKey)) {
        return { hasAuth: false, reason: 'credential-invalid' };
    }

    let derived: PublicKeyData;
    try {
        derived = dependencies.keyManager.derivePublicKey(secretKey);
    } catch {
        return { hasAuth: false, reason: 'identity-read-failed' };
    }

    if (!derived.hex) {
        return { hasAuth: false, reason: 'identity-read-failed' };
    }
    if (derived.hex !== pubkeyHex) {
        return { hasAuth: false, reason: 'identity-mismatch' };
    }
    if (!dependencies.isExpectedAccount(pubkeyHex, 'nsec')) {
        return { hasAuth: false, reason: 'account-record-mismatch' };
    }

    try {
        dependencies.keyManager.setCurrentSecretKey(secretKey);
        dependencies.publicKeyState.setNsec(secretKey);
        dependencies.setNsecAuthFn(derived.hex, derived.npub, derived.nprofile);
        return { hasAuth: true, pubkeyHex };
    } catch {
        dependencies.keyManager.setCurrentSecretKey(null);
        dependencies.publicKeyState.clear();
        return { hasAuth: false, reason: 'runtime-commit-failed' };
    }
}

export async function restoreManagedNip07Account(
    pubkeyHex: string,
    dependencies: ManagedAuthRestoreDependencies,
): Promise<ManagedRestoreResult> {
    const available = await dependencies.nip07Service.waitForExtension(
        MANAGED_NIP07_EXTENSION_DISCOVERY_TIMEOUT_MS,
    );
    if (!available) {
        return { hasAuth: false, reason: 'identity-source-unavailable' };
    }

    const result = await dependencies.nip07Service.authenticate({
        timeoutMs: MANAGED_NIP07_IDENTITY_READ_TIMEOUT_MS,
    });
    if (!result.success || !result.pubkeyHex || !result.pubkeyData) {
        return { hasAuth: false, reason: 'identity-read-failed' };
    }
    if (result.pubkeyHex !== result.pubkeyData.hex) {
        return { hasAuth: false, reason: 'identity-read-failed' };
    }
    if (result.pubkeyHex !== pubkeyHex) {
        return { hasAuth: false, reason: 'identity-mismatch' };
    }
    if (!dependencies.isExpectedAccount(pubkeyHex, 'nip07')) {
        return { hasAuth: false, reason: 'account-record-mismatch' };
    }

    try {
        dependencies.setNip07AuthFn(
            result.pubkeyData.hex,
            result.pubkeyData.npub,
            result.pubkeyData.nprofile,
        );
        return { hasAuth: true, pubkeyHex };
    } catch {
        return { hasAuth: false, reason: 'runtime-commit-failed' };
    }
}

export async function restoreManagedNip46Account(
    pubkeyHex: string,
    dependencies: ManagedAuthRestoreDependencies,
): Promise<ManagedRestoreResult> {
    return restoreManagedSessionAccount({
        pubkeyHex,
        loadSession: (targetPubkeyHex) =>
            Nip46Storage.loadSession(dependencies.localStorage, targetPubkeyHex),
        validateStoredIdentity: (session, targetPubkeyHex) =>
            session.userPubkey === targetPubkeyHex,
        // NIP-46 reconnect returns the saved session user pubkey. This only
        // checks the service contract; it does not verify a live signer identity.
        reconnect: (session) => dependencies.nip46Svc.reconnect(session),
        isExpectedAccount: () => dependencies.isExpectedAccount(pubkeyHex, 'nip46'),
        finalize: (targetPubkeyHex) => {
            try {
                dependencies.nip46Svc.bindSessionPersistence(
                    dependencies.localStorage,
                    targetPubkeyHex,
                );
            } catch {
                return { hasAuth: false, reason: 'persistence-failed' };
            }

            try {
                applyPublicKeyAuth('nip46', targetPubkeyHex, dependencies);
                return { hasAuth: true, pubkeyHex: targetPubkeyHex };
            } catch {
                return { hasAuth: false, reason: 'runtime-commit-failed' };
            }
        },
        cleanupRuntime: () => dependencies.nip46Svc.disconnect(),
        onError: () => dependencies.console.error('NIP-46アカウント復元に失敗しました'),
    });
}

export async function restoreManagedParentClientAccount(
    pubkeyHex: string,
    dependencies: ManagedAuthRestoreDependencies,
): Promise<ManagedRestoreResult> {
    return restoreManagedSessionAccount({
        pubkeyHex,
        loadSession: (targetPubkeyHex) =>
            ParentClientStorage.loadSession(dependencies.localStorage, targetPubkeyHex),
        validateStoredIdentity: (session, targetPubkeyHex) =>
            session.pubkeyHex === targetPubkeyHex,
        reconnect: (session) => dependencies.parentClientSvc.reconnect(session),
        isExpectedAccount: () => dependencies.isExpectedAccount(pubkeyHex, 'parentClient'),
        finalize: (targetPubkeyHex) => {
            const activeSession = dependencies.parentClientSvc.getSessionData();
            if (!activeSession || activeSession.pubkeyHex !== targetPubkeyHex) {
                return { hasAuth: false, reason: 'identity-mismatch' };
            }

            try {
                ParentClientStorage.saveSession(dependencies.localStorage, activeSession);
            } catch {
                return { hasAuth: false, reason: 'persistence-failed' };
            }

            try {
                applyPublicKeyAuth('parentClient', targetPubkeyHex, dependencies);
                return { hasAuth: true, pubkeyHex: targetPubkeyHex };
            } catch {
                return { hasAuth: false, reason: 'runtime-commit-failed' };
            }
        },
        cleanupRuntime: () => dependencies.parentClientSvc.disconnect(false),
        onError: () => dependencies.console.error('親クライアント連携アカウント復元に失敗しました'),
    });
}

const managedRestoreStrategies: Record<
    AccountAuthType,
    (pubkeyHex: string, dependencies: ManagedAuthRestoreDependencies) => Promise<ManagedRestoreResult>
> = {
    nsec: restoreManagedNsecAccount,
    nip07: restoreManagedNip07Account,
    nip46: restoreManagedNip46Account,
    parentClient: restoreManagedParentClientAccount,
};

export function createManagedAuthRestoreDependencies(
    source: ManagedAuthRestoreDependencies,
): ManagedAuthRestoreDependencies {
    return source;
}

export async function restoreManagedAccount(
    pubkeyHex: string,
    type: AccountAuthType,
    dependencies: ManagedAuthRestoreDependencies,
): Promise<ManagedRestoreResult> {
    if (!/^[0-9a-fA-F]{64}$/.test(pubkeyHex)) {
        return { hasAuth: false, reason: 'invalid-requested-pubkey' };
    }

    const strategy = managedRestoreStrategies[type];
    return strategy
        ? strategy(pubkeyHex, dependencies)
        : { hasAuth: false, reason: 'unsupported-account-type' };
}

export async function checkLegacyNsecAuth(
    dependencies: LegacyNsecDependencies,
): Promise<RestoreResult> {
    const storedKey = dependencies.keyManager.loadFromStorage();
    if (!storedKey) return { hasAuth: false };

    return restoreNsecFromStoredKey(storedKey, dependencies);
}

export async function checkLegacyNip07Auth(
    dependencies: LegacyNip07Dependencies,
): Promise<RestoreResult> {
    const storedPubkey = dependencies.localStorage.getItem(LEGACY_NIP07_STORAGE_KEY);
    if (!storedPubkey) return { hasAuth: false };

    const available = await dependencies.nip07Service.waitForExtension(1000);
    if (!available) {
        dependencies.localStorage.removeItem(LEGACY_NIP07_STORAGE_KEY);
        return { hasAuth: false };
    }

    try {
        const result = applyPublicKeyAuth('nip07', storedPubkey, dependencies);
        dependencies.accountManager?.addAccount(storedPubkey, 'nip07');
        dependencies.localStorage.removeItem(LEGACY_NIP07_STORAGE_KEY);
        return result;
    } catch (error) {
        dependencies.console.error('NIP-07セッション復元エラー', {
            stage: 'legacy-restore',
            reason: 'unexpected',
        });
        dependencies.localStorage.removeItem(LEGACY_NIP07_STORAGE_KEY);
        return { hasAuth: false };
    }
}

export async function checkLegacyNip46Auth(
    dependencies: LegacyNip46Dependencies,
): Promise<RestoreResult> {
    const session = Nip46Storage.loadSession(dependencies.localStorage);
    if (!session) return { hasAuth: false };

    try {
        await dependencies.nip46Svc.reconnect(session);
        const pubkey = session.userPubkey;
        const result = applyPublicKeyAuth('nip46', pubkey, dependencies);
        dependencies.accountManager?.addAccount(pubkey, 'nip46');
        dependencies.nip46Svc.saveSession(dependencies.localStorage, pubkey);
        Nip46Storage.clearSession(dependencies.localStorage);
        return result;
    } catch (error) {
        dependencies.console.error('NIP-46セッション復元エラー', {
            stage: 'legacy-restore',
            reason: 'unexpected',
        });
        return { hasAuth: false };
    }
}

export async function runLegacyAuthChecks(
    dependencies: LegacyAuthCheckDependencies,
): Promise<RestoreResult> {
    const checks = [
        ...(dependencies.localNsecAuthEnabled ? [checkLegacyNsecAuth] : []),
        checkLegacyNip07Auth,
        checkLegacyNip46Auth,
    ];

    for (const check of checks) {
        const result = await check(dependencies as never);
        if (result.hasAuth) return result;
    }

    return { hasAuth: false };
}

export async function runManagedAuthRestore(
    dependencies: ManagedAccountRestoreDependencies,
): Promise<RestoreResult> {
    const activePubkey = dependencies.accountManager.getActiveAccountPubkey();

    const candidates = buildManagedRestoreCandidates({
        activePubkey,
        activeType: activePubkey
            ? dependencies.accountManager.getAccountType(activePubkey)
            : null,
        accounts: dependencies.accountManager.getAccounts(),
    });

    for (const candidate of candidates) {
        const result = await dependencies.restoreAccount(candidate.pubkeyHex, candidate.type);
        if (result.hasAuth) {
            if (candidate.activateOnSuccess) {
                dependencies.accountManager.setActiveAccount(candidate.pubkeyHex);
            }
            return result;
        }
    }

    return { hasAuth: false };
}
