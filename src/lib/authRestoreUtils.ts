import { createPublicKeyFormats } from './utils/nostrUtils';
import { isHex64, isLowerHex64 } from './utils/nostrHexUtils';
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
export type AuthInitializationResult = RestoreResult & {
    /** The selected account failed to restore; do not automatically choose another identity. */
    activeSelectionPreserved?: true;
    /** Whether startup restore candidates were evaluated without an infrastructure failure. */
    restoreOutcome?: 'completed' | 'infrastructure-failure';
    /** NIP-07 identity already read while restoring a saved account. */
    nip07Identity?: PublicKeyData;
};
export type ManagedRestoreFailureReason =
    | 'invalid-requested-pubkey'
    | 'local-nsec-auth-disabled'
    | 'public-key-auth-disabled'
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
    | {
        hasAuth: false;
        reason: ManagedRestoreFailureReason;
        nip07Identity?: PublicKeyData;
    };

export const MANAGED_NIP07_EXTENSION_DISCOVERY_TIMEOUT_MS = 1_000;
export const MANAGED_NIP07_IDENTITY_READ_TIMEOUT_MS = 3_000;
export const ACTIVE_NIP07_STARTUP_IDENTITY_READ_TIMEOUT_MS = 10_000;
const MANAGED_RESTORE_INFRASTRUCTURE_FAILURES = new Set<ManagedRestoreFailureReason>([
    'credential-read-failed',
    'persistence-failed',
    'runtime-commit-failed',
]);

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
    nip07IdentityReadTimeoutMs?: number;
    nip46Svc: Pick<
        Nip46Service,
        'restoreSessionInBackground' | 'bindSessionPersistence' | 'disconnect'
    >;
    parentClientSvc: Pick<ParentClientAuthService, 'reconnect' | 'getSessionData' | 'disconnect'>;
    setPublicKeyAuthFn: SetAuthFn;
    setNosskeyAuthFn?: SetAuthFn;
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
    restoreSnapshot: {
        activePubkey: string | null;
        accounts: Array<Pick<StoredAccount, 'pubkeyHex' | 'type'>>;
    };
    infrastructureFailureDetected?: boolean;
    accountManager: {
        setActiveAccount(pubkeyHex: string): void;
    };
    restoreAccount(
        pubkeyHex: string,
        type: AccountAuthType,
        nip07Identity?: PublicKeyData,
    ): Promise<ManagedRestoreResult>;
}

export interface LegacyAuthCheckDependencies extends LegacyNsecDependencies, LegacyNip07Dependencies, LegacyNip46Dependencies {
    localNsecAuthEnabled: boolean;
}

export function applyPublicKeyAuth(
    type: PublicKeyAuthType,
    pubkeyHex: string,
    dependencies: PublicKeyAuthDependencies,
): RestoreResult {
    const { npub, nprofile } = createPublicKeyFormats(pubkeyHex);

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
    nip07Identity?: PublicKeyData,
): Promise<ManagedRestoreResult> {
    let result: Awaited<ReturnType<ManagedAuthRestoreDependencies['nip07Service']['authenticate']>>;
    if (nip07Identity) {
        result = {
            success: true,
            pubkeyHex: nip07Identity.hex,
            pubkeyData: nip07Identity,
        };
    } else {
        const available = await dependencies.nip07Service.waitForExtension(
            MANAGED_NIP07_EXTENSION_DISCOVERY_TIMEOUT_MS,
        );
        if (!available) {
            return { hasAuth: false, reason: 'identity-source-unavailable' };
        }

        result = await dependencies.nip07Service.authenticate({
            timeoutMs: dependencies.nip07IdentityReadTimeoutMs ?? MANAGED_NIP07_IDENTITY_READ_TIMEOUT_MS,
        });
    }
    if (!result.success || !result.pubkeyHex || !result.pubkeyData) {
        return { hasAuth: false, reason: 'identity-read-failed' };
    }
    if (result.pubkeyHex !== result.pubkeyData.hex) {
        return { hasAuth: false, reason: 'identity-read-failed' };
    }
    if (result.pubkeyHex !== pubkeyHex) {
        return {
            hasAuth: false,
            reason: 'identity-mismatch',
            nip07Identity: result.pubkeyData,
        };
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
        // The saved session is adopted without waiting for the remote signer.
        // The service verifies the live signer identity in the background and
        // withholds the signer until that check passes, so this only checks
        // the service contract.
        reconnect: (session) => dependencies.nip46Svc.restoreSessionInBackground(
            session,
            { storage: dependencies.localStorage, pubkeyHex },
        ),
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

async function restoreManagedPublicKeyAccount(
    pubkeyHex: string,
    dependencies: ManagedAuthRestoreDependencies,
): Promise<ManagedRestoreResult> {
    if (!isLowerHex64(pubkeyHex)) return { hasAuth: false, reason: 'invalid-requested-pubkey' };
    if (!dependencies.isExpectedAccount(pubkeyHex, 'npub')) {
        return { hasAuth: false, reason: 'account-record-mismatch' };
    }
    try {
        const { npub, nprofile } = createPublicKeyFormats(pubkeyHex);
        dependencies.publicKeyState.setNsec('');
        dependencies.setPublicKeyAuthFn(pubkeyHex, npub, nprofile);
        return { hasAuth: true, pubkeyHex };
    } catch {
        return { hasAuth: false, reason: 'runtime-commit-failed' };
    }
}

const managedRestoreStrategies: Record<
    AccountAuthType,
    (
        pubkeyHex: string,
        dependencies: ManagedAuthRestoreDependencies,
        nip07Identity?: PublicKeyData,
    ) => Promise<ManagedRestoreResult>
> = {
    npub: restoreManagedPublicKeyAccount,
    nosskey: async (pubkeyHex, deps) => {
        if (!deps.setNosskeyAuthFn) return { hasAuth: false, reason: 'unsupported-account-type' };
        if (!isLowerHex64(pubkeyHex)) return { hasAuth: false, reason: 'invalid-requested-pubkey' };
        if (!deps.isExpectedAccount(pubkeyHex, 'nosskey')) return { hasAuth: false, reason: 'account-record-mismatch' };
        try {
            const { npub, nprofile } = createPublicKeyFormats(pubkeyHex);
            deps.setNosskeyAuthFn(pubkeyHex, npub, nprofile);
            return { hasAuth: true, pubkeyHex };
        } catch {
            return { hasAuth: false, reason: 'runtime-commit-failed' };
        }
    },
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
    nip07Identity?: PublicKeyData,
): Promise<ManagedRestoreResult> {
    if (!isHex64(pubkeyHex)) {
        return { hasAuth: false, reason: 'invalid-requested-pubkey' };
    }

    const strategy = managedRestoreStrategies[type];
    return strategy
        ? strategy(pubkeyHex, dependencies, nip07Identity)
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
): Promise<AuthInitializationResult> {
    const candidates = buildManagedRestoreCandidates(dependencies.restoreSnapshot);
    let nip07Identity: PublicKeyData | undefined;
    let nip07ReadFailed = false;
    let infrastructureFailureDetected = dependencies.infrastructureFailureDetected ?? false;

    for (const candidate of candidates) {
        // The extension exposes one identity for all saved NIP-07 accounts.
        // A failed read can be retried by a later auth operation.
        if (candidate.type === 'nip07' && nip07ReadFailed) continue;
        const result = await dependencies.restoreAccount(
            candidate.pubkeyHex,
            candidate.type,
            nip07Identity,
        );
        if (result.hasAuth) {
            if (candidate.activateOnSuccess) {
                dependencies.accountManager.setActiveAccount(candidate.pubkeyHex);
            }
            return result;
        }
        nip07Identity = result.nip07Identity ?? nip07Identity;
        if (candidate.type === 'nip07'
            && (result.reason === 'identity-source-unavailable' || result.reason === 'identity-read-failed')) {
            nip07ReadFailed = true;
        }
        if (MANAGED_RESTORE_INFRASTRUCTURE_FAILURES.has(result.reason)) {
            infrastructureFailureDetected = true;
        }
    }

    return {
        hasAuth: false,
        restoreOutcome: infrastructureFailureDetected ? 'infrastructure-failure' : 'completed',
        ...(candidates.some(candidate => !candidate.activateOnSuccess)
            ? { activeSelectionPreserved: true as const } : {}),
        ...(nip07Identity ? { nip07Identity } : {}),
    };
}
