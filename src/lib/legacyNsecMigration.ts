import { STORAGE_KEYS } from './constants';
import type { PublicKeyData, StoredAccount } from './types';

type StoredKeyReadResult =
    | { status: 'found'; secretKey: string }
    | { status: 'missing' }
    | { status: 'error' };
type StoredKeyWriteResult = { status: 'saved' } | { status: 'error' };
type StoredKeyRemoveResult = { status: 'removed' } | { status: 'error' };

export type LegacyNsecMigrationResult =
    | { status: 'legacy-credential-missing' }
    | { status: 'legacy-credential-read-failed' }
    | { status: 'credential-invalid' }
    | { status: 'identity-derivation-failed' }
    | { status: 'destination-credential-read-failed' }
    | { status: 'destination-credential-conflict' }
    | { status: 'destination-credential-save-failed' }
    | { status: 'account-record-read-failed' }
    | { status: 'account-record-invalid' }
    | { status: 'account-record-save-failed' }
    | { status: 'active-pointer-read-failed' }
    | { status: 'active-pointer-save-failed' }
    | { status: 'legacy-credential-delete-failed' }
    | { status: 'migrated' }
    | { status: 'already-migrated' };

export type LegacyNsecMigrationSnapshot = {
    accountListExisted: boolean;
    accounts: StoredAccount[];
    activePubkey: string | null;
    activePointerIsValid: boolean;
};

export type LegacyNsecMigrationSnapshotResult =
    | { status: 'ready'; snapshot: LegacyNsecMigrationSnapshot }
    | {
        status: 'failed';
        reason: 'account-record-read-failed' | 'account-record-invalid' | 'active-pointer-read-failed';
    };

export interface LegacyNsecMigrationKeyManager {
    isValidNsec(secretKey: string): boolean;
    derivePublicKey(secretKey: string): PublicKeyData;
    readStoredKey(pubkeyHex?: string): StoredKeyReadResult;
    writeStoredKeyForMigration(pubkeyHex: string, secretKey: string): StoredKeyWriteResult;
    removeStoredKeyForMigration(pubkeyHex?: string): StoredKeyRemoveResult;
}

interface LegacyNsecMigrationDependencies {
    localStorage: Storage;
    keyManager: LegacyNsecMigrationKeyManager;
    snapshot: LegacyNsecMigrationSnapshot;
    now?: () => number;
}

type StrictAccountsResult =
    | { status: 'ok'; accounts: StoredAccount[]; accountListExisted: boolean }
    | { status: 'read-failed' }
    | { status: 'invalid' };

const ACCOUNT_TYPES: readonly StoredAccount['type'][] = [
    'nsec',
    'nip07',
    'nip46',
    'parentClient',
];

function isStoredAccount(value: unknown): value is StoredAccount {
    if (!value || typeof value !== 'object') return false;

    const candidate = value as Partial<StoredAccount>;
    return typeof candidate.pubkeyHex === 'string'
        && candidate.pubkeyHex.length > 0
        && typeof candidate.addedAt === 'number'
        && Number.isFinite(candidate.addedAt)
        && typeof candidate.type === 'string'
        && ACCOUNT_TYPES.includes(candidate.type as StoredAccount['type']);
}

function readAccountsStrict(localStorage: Storage): StrictAccountsResult {
    let raw: string | null;
    try {
        raw = localStorage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS);
    } catch {
        return { status: 'read-failed' };
    }

    if (raw === null) {
        return { status: 'ok', accounts: [], accountListExisted: false };
    }

    try {
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed) || !parsed.every(isStoredAccount)) {
            return { status: 'invalid' };
        }

        const pubkeys = new Set<string>();
        for (const account of parsed) {
            if (pubkeys.has(account.pubkeyHex)) {
                return { status: 'invalid' };
            }
            pubkeys.add(account.pubkeyHex);
        }

        return {
            status: 'ok',
            accounts: parsed.map((account) => ({ ...account })),
            accountListExisted: true,
        };
    } catch {
        return { status: 'invalid' };
    }
}

function readActivePubkey(localStorage: Storage):
    | { status: 'ok'; activePubkey: string | null }
    | { status: 'error' } {
    try {
        return {
            status: 'ok',
            activePubkey: localStorage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT),
        };
    } catch {
        return { status: 'error' };
    }
}

function writeAccountsWithReadback(
    localStorage: Storage,
    accounts: StoredAccount[],
    pubkeyHex: string,
): boolean {
    try {
        localStorage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, JSON.stringify(accounts));
    } catch {
        return false;
    }

    const readback = readAccountsStrict(localStorage);
    return readback.status === 'ok'
        && readback.accounts.some((account) => account.pubkeyHex === pubkeyHex && account.type === 'nsec');
}

function setActivePubkeyWithReadback(localStorage: Storage, pubkeyHex: string): boolean {
    try {
        localStorage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, pubkeyHex);
    } catch {
        return false;
    }

    const readback = readActivePubkey(localStorage);
    return readback.status === 'ok' && readback.activePubkey === pubkeyHex;
}

/**
 * Captures the migration policy inputs before any legacy single-account write.
 * Callers must not start legacy migration if this returns a failure.
 */
export function captureLegacyNsecMigrationSnapshot(
    localStorage: Storage,
): LegacyNsecMigrationSnapshotResult {
    const accountsResult = readAccountsStrict(localStorage);
    if (accountsResult.status === 'read-failed') {
        return { status: 'failed', reason: 'account-record-read-failed' };
    }
    if (accountsResult.status === 'invalid') {
        return { status: 'failed', reason: 'account-record-invalid' };
    }

    const activeResult = readActivePubkey(localStorage);
    if (activeResult.status === 'error') {
        return { status: 'failed', reason: 'active-pointer-read-failed' };
    }

    return {
        status: 'ready',
        snapshot: {
            accountListExisted: accountsResult.accountListExisted,
            accounts: accountsResult.accounts,
            activePubkey: activeResult.activePubkey,
            activePointerIsValid: activeResult.activePubkey !== null
                && accountsResult.accounts.some((account) => account.pubkeyHex === activeResult.activePubkey),
        },
    };
}

/**
 * Migrates only persistent legacy nsec data. It deliberately does not update
 * auth state, the in-memory key store, or any non-nsec runtime.
 */
export function migrateLegacyNsec({
    localStorage,
    keyManager,
    snapshot,
    now = Date.now,
}: LegacyNsecMigrationDependencies): LegacyNsecMigrationResult {
    const legacyResult = keyManager.readStoredKey();
    if (legacyResult.status === 'missing') {
        return { status: 'legacy-credential-missing' };
    }
    if (legacyResult.status === 'error') {
        return { status: 'legacy-credential-read-failed' };
    }

    const legacyCredential = legacyResult.secretKey;
    if (!keyManager.isValidNsec(legacyCredential)) {
        return { status: 'credential-invalid' };
    }

    let derived: PublicKeyData;
    try {
        derived = keyManager.derivePublicKey(legacyCredential);
    } catch {
        return { status: 'identity-derivation-failed' };
    }
    if (!derived.hex) {
        return { status: 'identity-derivation-failed' };
    }

    let changed = false;
    const destinationResult = keyManager.readStoredKey(derived.hex);
    if (destinationResult.status === 'error') {
        return { status: 'destination-credential-read-failed' };
    }
    if (destinationResult.status === 'found' && destinationResult.secretKey !== legacyCredential) {
        return { status: 'destination-credential-conflict' };
    }
    if (destinationResult.status === 'missing') {
        if (keyManager.writeStoredKeyForMigration(derived.hex, legacyCredential).status !== 'saved') {
            return { status: 'destination-credential-save-failed' };
        }
        changed = true;
    }

    const accountsResult = readAccountsStrict(localStorage);
    if (accountsResult.status === 'read-failed') {
        return { status: 'account-record-read-failed' };
    }
    if (accountsResult.status === 'invalid') {
        return { status: 'account-record-invalid' };
    }

    const existingAccount = accountsResult.accounts.find((account) => account.pubkeyHex === derived.hex);
    const nextAccounts = existingAccount
        ? accountsResult.accounts.map((account) => account.pubkeyHex === derived.hex
            ? { ...account, type: 'nsec' as const }
            : account)
        : [...accountsResult.accounts, { pubkeyHex: derived.hex, type: 'nsec' as const, addedAt: now() }];
    const needsAccountWrite = !existingAccount || existingAccount.type !== 'nsec';

    if (needsAccountWrite) {
        if (!writeAccountsWithReadback(localStorage, nextAccounts, derived.hex)) {
            return { status: 'account-record-save-failed' };
        }
        changed = true;
    } else if (!accountsResult.accounts.some((account) => account.pubkeyHex === derived.hex && account.type === 'nsec')) {
        return { status: 'account-record-save-failed' };
    }

    const activeResult = readActivePubkey(localStorage);
    if (activeResult.status === 'error') {
        return { status: 'active-pointer-read-failed' };
    }

    const shouldActivateDerived = !snapshot.accountListExisted || !snapshot.activePointerIsValid;
    if (shouldActivateDerived) {
        if (activeResult.activePubkey !== derived.hex) {
            if (!setActivePubkeyWithReadback(localStorage, derived.hex)) {
                return { status: 'active-pointer-save-failed' };
            }
            changed = true;
        }
    } else if (activeResult.activePubkey !== snapshot.activePubkey) {
        return { status: 'active-pointer-save-failed' };
    }

    if (keyManager.removeStoredKeyForMigration().status !== 'removed') {
        return { status: 'legacy-credential-delete-failed' };
    }

    return { status: changed ? 'migrated' : 'already-migrated' };
}
