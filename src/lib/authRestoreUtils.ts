import { nip19 } from 'nostr-tools';
import { Nip46Service as Nip46Storage } from './nip46Service';
import type { PublicKeyState } from './keyManager.svelte';
import type { Nip07AuthService } from './nip07AuthService';
import type { Nip46Service } from './nip46Service';
import type { PublicKeyData, StoredAccount } from './types';

const LEGACY_NIP07_STORAGE_KEY = 'nostr-nip07-pubkey';

export type RestoreResult = { hasAuth: boolean; pubkeyHex?: string };

type AccountAuthType = StoredAccount['type'];
type PublicKeyAuthType = 'nip07' | 'nip46';
type SetAuthFn = (pubkey: string, npub: string, nprofile: string) => void;
type AccountMigrationTarget = Pick<{ addAccount(pubkeyHex: string, type: AccountAuthType): void }, 'addAccount'>;

interface PublicKeyAuthDependencies {
    setNip07AuthFn: SetAuthFn;
    setNip46AuthFn: SetAuthFn;
}

interface NsecRestoreDependencies {
    publicKeyState: PublicKeyState;
    keyManager: {
        derivePublicKey(secretKey: string): PublicKeyData;
        saveToStorage(secretKey: string): unknown;
    };
    setNsecAuthFn: SetAuthFn;
    accountManager?: AccountMigrationTarget | null;
}

interface LegacyNsecDependencies extends NsecRestoreDependencies {
    keyManager: NsecRestoreDependencies['keyManager'] & {
        loadFromStorage(): string | null;
    };
}

export interface ManagedAuthRestoreDependencies extends NsecRestoreDependencies, PublicKeyAuthDependencies {
    localStorage: Storage;
    nip07Service: Pick<Nip07AuthService, 'waitForExtension'>;
    nip46Svc: Pick<Nip46Service, 'reconnect'>;
    console: Console;
    keyManager: NsecRestoreDependencies['keyManager'] & {
        loadFromStorage(pubkeyHex?: string): string | null;
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

export interface LegacyAuthCheckDependencies extends LegacyNsecDependencies, LegacyNip07Dependencies, LegacyNip46Dependencies { }

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
    } else {
        dependencies.setNip46AuthFn(pubkeyHex, npub, nprofile);
    }

    return { hasAuth: true, pubkeyHex };
}

export function restoreNsecFromStoredKey(
    secretKey: string,
    dependencies: NsecRestoreDependencies,
    options: { clearLegacyKeyOnFailure?: boolean; migrateLegacyAccount?: boolean } = {},
): RestoreResult {
    dependencies.publicKeyState.setNsec(secretKey);

    try {
        const derived = dependencies.keyManager.derivePublicKey(secretKey);
        if (!derived.hex) {
            if (options.clearLegacyKeyOnFailure) {
                dependencies.keyManager.saveToStorage('');
            }
            return { hasAuth: false };
        }

        dependencies.setNsecAuthFn(derived.hex, derived.npub, derived.nprofile);
        if (options.migrateLegacyAccount) {
            dependencies.accountManager?.addAccount(derived.hex, 'nsec');
        }
        return { hasAuth: true, pubkeyHex: derived.hex };
    } catch {
        if (options.clearLegacyKeyOnFailure) {
            dependencies.keyManager.saveToStorage('');
        }
        return { hasAuth: false };
    }
}

export async function restoreManagedNsecAccount(
    pubkeyHex: string,
    dependencies: ManagedAuthRestoreDependencies,
): Promise<RestoreResult> {
    const storedKey = dependencies.keyManager.loadFromStorage(pubkeyHex);
    if (!storedKey) return { hasAuth: false };

    return restoreNsecFromStoredKey(storedKey, dependencies);
}

export async function restoreManagedNip07Account(
    pubkeyHex: string,
    dependencies: ManagedAuthRestoreDependencies,
): Promise<RestoreResult> {
    const available = await dependencies.nip07Service.waitForExtension(1000);
    if (!available) return { hasAuth: false };

    try {
        return applyPublicKeyAuth('nip07', pubkeyHex, dependencies);
    } catch (error) {
        dependencies.console.error('NIP-07アカウント復元エラー:', error);
        return { hasAuth: false };
    }
}

export async function restoreManagedNip46Account(
    pubkeyHex: string,
    dependencies: ManagedAuthRestoreDependencies,
): Promise<RestoreResult> {
    const session = Nip46Storage.loadSession(dependencies.localStorage, pubkeyHex);
    if (!session) return { hasAuth: false };

    try {
        await dependencies.nip46Svc.reconnect(session);
        return applyPublicKeyAuth('nip46', pubkeyHex, dependencies);
    } catch (error) {
        dependencies.console.error('NIP-46アカウント復元エラー:', error);
        return { hasAuth: false };
    }
}

export async function checkLegacyNsecAuth(
    dependencies: LegacyNsecDependencies,
): Promise<RestoreResult> {
    const storedKey = dependencies.keyManager.loadFromStorage();
    if (!storedKey) return { hasAuth: false };

    return restoreNsecFromStoredKey(storedKey, dependencies, {
        clearLegacyKeyOnFailure: true,
        migrateLegacyAccount: true,
    });
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
        dependencies.console.error('NIP-07セッション復元エラー:', error);
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
        dependencies.console.error('NIP-46セッション復元エラー:', error);
        return { hasAuth: false };
    }
}

export async function runLegacyAuthChecks(
    dependencies: LegacyAuthCheckDependencies,
): Promise<RestoreResult> {
    const checks = [
        checkLegacyNsecAuth,
        checkLegacyNip07Auth,
        checkLegacyNip46Auth,
    ] as const;

    for (const check of checks) {
        const result = await check(dependencies as never);
        if (result.hasAuth) return result;
    }

    return { hasAuth: false };
}