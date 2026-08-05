import { describe, expect, it, vi } from 'vitest';
import { nip19 } from 'nostr-tools';

vi.mock('../../lib/keyManager.svelte', async () => {
    const actual = await import('../../lib/keyManager.svelte');
    return {
        KeyManager: actual.KeyManager,
        KeyStorage: actual.KeyStorage,
        ExternalAuthChecker: actual.ExternalAuthChecker,
        PublicKeyState: actual.PublicKeyState,
        KeyValidator: actual.KeyValidator,
    };
});

import { KeyManager } from '../../lib/keyManager.svelte';
import {
    captureLegacyNsecMigrationSnapshot,
    migrateLegacyNsec,
} from '../../lib/legacyNsecMigration';
import { buildManagedRestoreCandidates } from '../../lib/authManagedRestoreUtils';
import { getNip46SessionStorageKey, getParentClientSessionStorageKey, getNsecStorageKey } from '../../lib/authStorageKeys';
import { STORAGE_KEYS } from '../../lib/constants';
import type { StoredAccount } from '../../lib/types';
import { MockStorage, createMockConsole } from '../helpers';

class FaultStorage extends MockStorage {
    readonly failingGetKeys = new Set<string>();
    readonly failingSetKeys = new Set<string>();
    readonly ignoredSetKeys = new Set<string>();
    readonly failingRemoveKeys = new Set<string>();
    readonly ignoredRemoveKeys = new Set<string>();
    mutateActiveAfterAccountsWrite: string | null = null;

    override getItem(key: string): string | null {
        if (this.failingGetKeys.has(key)) throw new Error('storage read failed');
        return super.getItem(key);
    }

    override setItem(key: string, value: string): void {
        if (this.failingSetKeys.has(key)) throw new Error('storage write failed');
        if (this.ignoredSetKeys.has(key)) return;
        super.setItem(key, value);
        if (key === STORAGE_KEYS.NOSTR_ACCOUNTS && this.mutateActiveAfterAccountsWrite !== null) {
            super.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, this.mutateActiveAfterAccountsWrite);
        }
    }

    override removeItem(key: string): void {
        if (this.failingRemoveKeys.has(key)) throw new Error('storage remove failed');
        if (this.ignoredRemoveKeys.has(key)) return;
        super.removeItem(key);
    }
}

function createCredential(seed: number): string {
    return nip19.nsecEncode(Uint8Array.from({ length: 32 }, () => seed));
}

function createKeyManager(storage: Storage): KeyManager {
    return new KeyManager({
        localStorage: storage,
        console: createMockConsole(),
        secretKeyStore: { value: null, set: () => undefined },
    });
}

function account(pubkeyHex: string, type: StoredAccount['type'], addedAt = 100): StoredAccount {
    return { pubkeyHex, type, addedAt };
}

function getSnapshot(storage: Storage) {
    const result = captureLegacyNsecMigrationSnapshot(storage);
    expect(result.status).toBe('ready');
    if (result.status !== 'ready') throw new Error('snapshot unavailable');
    return result.snapshot;
}

function migrate(storage: FaultStorage, keyManager = createKeyManager(storage)) {
    return migrateLegacyNsec({
        localStorage: storage,
        keyManager,
        snapshot: getSnapshot(storage),
        now: () => 500,
    });
}

describe('legacy nsec migration', () => {
    it('credential自身からidentityを導出し、profileまたはrelay suffixを参照しない', () => {
        const storage = new FaultStorage();
        const keyManager = createKeyManager(storage);
        const credential = createCredential(1);
        const derivedPubkey = keyManager.derivePublicKey(credential).hex;
        storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);
        storage.setItem(STORAGE_KEYS.NOSTR_PROFILE + 'f'.repeat(64), '{}');
        storage.setItem(STORAGE_KEYS.NOSTR_RELAYS + 'e'.repeat(64), '[]');

        expect(migrate(storage, keyManager)).toEqual({ status: 'migrated' });
        expect(storage.getItem(getNsecStorageKey(derivedPubkey)) === credential).toBe(true);
        expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT)).toBe(derivedPubkey);
        expect(JSON.parse(storage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS) ?? '[]')).toEqual([
            account(derivedPubkey, 'nsec', 500),
        ]);

        const secondSnapshot = getSnapshot(storage);
        expect(migrateLegacyNsec({ localStorage: storage, keyManager, snapshot: secondSnapshot, now: () => 500 }))
            .toEqual({ status: 'legacy-credential-missing' });
        expect(JSON.parse(storage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS) ?? '[]')).toHaveLength(1);
    });

    it('account listがない旧single-account状態ではderived nsecをactiveにする', () => {
        const storage = new FaultStorage();
        const keyManager = createKeyManager(storage);
        const credential = createCredential(2);
        const derivedPubkey = keyManager.derivePublicKey(credential).hex;
        storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);

        expect(migrate(storage, keyManager)).toEqual({ status: 'migrated' });
        expect(storage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT)).toBe(derivedPubkey);
    });

    it('正常な空account listではderived nsecを追加してactiveにする', () => {
        const storage = new FaultStorage();
        const keyManager = createKeyManager(storage);
        const credential = createCredential(3);
        const derivedPubkey = keyManager.derivePublicKey(credential).hex;
        storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);
        storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, '[]');

        expect(migrate(storage, keyManager)).toEqual({ status: 'migrated' });
        expect(storage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT)).toBe(derivedPubkey);
        expect(JSON.parse(storage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS) ?? '[]')).toEqual([
            account(derivedPubkey, 'nsec', 500),
        ]);
    });

    for (const type of ['nsec', 'nip07', 'nip46'] as const) {
        it(`有効な${type} active pointerを維持し、次回managed restoreの先頭候補に残す`, () => {
            const storage = new FaultStorage();
            const keyManager = createKeyManager(storage);
            const credential = createCredential(type === 'nsec' ? 4 : type === 'nip07' ? 5 : 6);
            const derivedPubkey = keyManager.derivePublicKey(credential).hex;
            const activePubkey = 'b'.repeat(64);
            storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);
            storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, JSON.stringify([account(activePubkey, type)]));
            storage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, activePubkey);

            expect(migrate(storage, keyManager)).toEqual({ status: 'migrated' });
            expect(storage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT)).toBe(activePubkey);

            const accounts = JSON.parse(storage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS) ?? '[]') as StoredAccount[];
            expect(accounts).toEqual([
                account(activePubkey, type),
                account(derivedPubkey, 'nsec', 500),
            ]);
            expect(buildManagedRestoreCandidates({
                activePubkey,
                activeType: type,
                accounts,
            })[0]).toMatchObject({ pubkeyHex: activePubkey, type });
        });
    }

    it('Parent client active pointerを維持し、sessionとmanaged candidate規則へ触れない', () => {
        const storage = new FaultStorage();
        const keyManager = createKeyManager(storage);
        const credential = createCredential(7);
        const derivedPubkey = keyManager.derivePublicKey(credential).hex;
        const activePubkey = 'c'.repeat(64);
        storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);
        storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, JSON.stringify([account(activePubkey, 'parentClient')]));
        storage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, activePubkey);
        storage.setItem(getParentClientSessionStorageKey(activePubkey), 'parent-session');

        expect(migrate(storage, keyManager)).toEqual({ status: 'migrated' });
        expect(storage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT)).toBe(activePubkey);
        expect(storage.getItem(getParentClientSessionStorageKey(activePubkey))).toBe('parent-session');
        expect(storage.getItem(getNsecStorageKey(derivedPubkey)) === credential).toBe(true);

        const accounts = JSON.parse(storage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS) ?? '[]') as StoredAccount[];
        expect(buildManagedRestoreCandidates({
            activePubkey,
            activeType: 'parentClient',
            accounts,
        }).some((candidate) => candidate.pubkeyHex === activePubkey)).toBe(false);
    });

    it('missingまたは不正なactive pointerだけをderived nsecへ置き換える', () => {
        for (const activePubkey of [null, 'd'.repeat(64)]) {
            const storage = new FaultStorage();
            const keyManager = createKeyManager(storage);
            const credential = createCredential(activePubkey === null ? 8 : 9);
            const derivedPubkey = keyManager.derivePublicKey(credential).hex;
            storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);
            storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, JSON.stringify([account('e'.repeat(64), 'nip07')]));
            if (activePubkey) storage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, activePubkey);

            expect(migrate(storage, keyManager)).toEqual({ status: 'migrated' });
            expect(storage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT)).toBe(derivedPubkey);
        }
    });

    it('derived nsecが既にactiveならpointerを書き換えない', () => {
        const storage = new FaultStorage();
        const keyManager = createKeyManager(storage);
        const credential = createCredential(10);
        const derivedPubkey = keyManager.derivePublicKey(credential).hex;
        storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);
        storage.setItem(getNsecStorageKey(derivedPubkey), credential);
        storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, JSON.stringify([account(derivedPubkey, 'nsec')]));
        storage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, derivedPubkey);
        const originalSetItem = storage.setItem.bind(storage);
        let activePointerWrites = 0;
        storage.setItem = (key, value) => {
            if (key === STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT) activePointerWrites += 1;
            originalSetItem(key, value);
        };

        expect(migrate(storage, keyManager)).toEqual({ status: 'already-migrated' });
        expect(activePointerWrites).toBe(0);
        expect(storage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT)).toBe(derivedPubkey);
    });

    it('destination credential conflictでは既存の永続データを変更しない', () => {
        const storage = new FaultStorage();
        const keyManager = createKeyManager(storage);
        const credential = createCredential(11);
        const derivedPubkey = keyManager.derivePublicKey(credential).hex;
        const conflictingCredential = createCredential(12);
        storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);
        storage.setItem(getNsecStorageKey(derivedPubkey), conflictingCredential);

        expect(migrate(storage, keyManager)).toEqual({ status: 'destination-credential-conflict' });
        expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY) === credential).toBe(true);
        expect(storage.getItem(getNsecStorageKey(derivedPubkey)) === conflictingCredential).toBe(true);
        expect(storage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS)).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT)).toBeNull();
    });

    it('同じpubkeyの別方式recordをnsecへ更新し、addedAtを維持する', () => {
        const storage = new FaultStorage();
        const keyManager = createKeyManager(storage);
        const credential = createCredential(15);
        const derivedPubkey = keyManager.derivePublicKey(credential).hex;
        storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);
        storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, JSON.stringify([
            account(derivedPubkey, 'nip07', 123),
        ]));
        storage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, derivedPubkey);

        expect(migrate(storage, keyManager)).toEqual({ status: 'migrated' });
        expect(JSON.parse(storage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS) ?? '[]')).toEqual([
            account(derivedPubkey, 'nsec', 123),
        ]);
        expect(storage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT)).toBe(derivedPubkey);
    });

    it('invalid credentialまたはidentity導出失敗ではlegacyを保持し永続状態を変更しない', () => {
        const invalidStorage = new FaultStorage();
        const invalidKeyManager = createKeyManager(invalidStorage);
        invalidStorage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, 'invalid-value');
        expect(migrate(invalidStorage, invalidKeyManager)).toEqual({ status: 'credential-invalid' });
        expect(invalidStorage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).toBe('invalid-value');
        expect(invalidStorage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS)).toBeNull();

        const derivationStorage = new FaultStorage();
        derivationStorage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, 'opaque-value');
        const derivationSnapshot = getSnapshot(derivationStorage);
        const failingKeyManager = {
            isValidNsec: () => true,
            derivePublicKey: () => {
                throw new Error('derivation failed');
            },
            readStoredKey: (pubkeyHex?: string) => {
                const value = derivationStorage.getItem(getNsecStorageKey(pubkeyHex));
                return value ? { status: 'found' as const, secretKey: value } : { status: 'missing' as const };
            },
            writeStoredKeyForMigration: () => ({ status: 'error' as const }),
            removeStoredKeyForMigration: () => ({ status: 'error' as const }),
        };
        expect(migrateLegacyNsec({
            localStorage: derivationStorage,
            keyManager: failingKeyManager,
            snapshot: derivationSnapshot,
        })).toEqual({ status: 'identity-derivation-failed' });
        expect(derivationStorage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).toBe('opaque-value');
        expect(derivationStorage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS)).toBeNull();
    });

    it('壊れたaccount listまたはactive pointer読出し失敗ではsnapshotが永続migrationを止める', () => {
        const invalidListStorage = new FaultStorage();
        invalidListStorage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, createCredential(13));
        invalidListStorage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, '{invalid');
        expect(captureLegacyNsecMigrationSnapshot(invalidListStorage))
            .toEqual({ status: 'failed', reason: 'account-record-invalid' });
        expect(invalidListStorage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).not.toBeNull();

        const pointerFailureStorage = new FaultStorage();
        pointerFailureStorage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, createCredential(14));
        pointerFailureStorage.failingGetKeys.add(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT);
        expect(captureLegacyNsecMigrationSnapshot(pointerFailureStorage))
            .toEqual({ status: 'failed', reason: 'active-pointer-read-failed' });
        pointerFailureStorage.failingGetKeys.delete(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT);
        expect(pointerFailureStorage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).not.toBeNull();
        expect(pointerFailureStorage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS)).toBeNull();
    });

    it('legacy、destination、account listの読出し失敗を個別に区別し、legacyを維持する', () => {
        const legacyReadFailure = new FaultStorage();
        const legacyReadKeyManager = createKeyManager(legacyReadFailure);
        legacyReadFailure.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, createCredential(14));
        const legacyReadSnapshot = getSnapshot(legacyReadFailure);
        legacyReadFailure.failingGetKeys.add(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY);
        expect(migrateLegacyNsec({
            localStorage: legacyReadFailure,
            keyManager: legacyReadKeyManager,
            snapshot: legacyReadSnapshot,
        })).toEqual({ status: 'legacy-credential-read-failed' });
        legacyReadFailure.failingGetKeys.delete(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY);
        expect(legacyReadFailure.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).not.toBeNull();

        const destinationReadFailure = new FaultStorage();
        const destinationReadKeyManager = createKeyManager(destinationReadFailure);
        const destinationCredential = createCredential(15);
        const destinationPubkey = destinationReadKeyManager.derivePublicKey(destinationCredential).hex;
        destinationReadFailure.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, destinationCredential);
        const destinationSnapshot = getSnapshot(destinationReadFailure);
        destinationReadFailure.failingGetKeys.add(getNsecStorageKey(destinationPubkey));
        expect(migrateLegacyNsec({
            localStorage: destinationReadFailure,
            keyManager: destinationReadKeyManager,
            snapshot: destinationSnapshot,
        })).toEqual({ status: 'destination-credential-read-failed' });
        destinationReadFailure.failingGetKeys.delete(getNsecStorageKey(destinationPubkey));
        expect(destinationReadFailure.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).not.toBeNull();

        const accountReadFailure = new FaultStorage();
        const accountReadKeyManager = createKeyManager(accountReadFailure);
        accountReadFailure.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, createCredential(16));
        const accountSnapshot = getSnapshot(accountReadFailure);
        accountReadFailure.failingGetKeys.add(STORAGE_KEYS.NOSTR_ACCOUNTS);
        expect(migrateLegacyNsec({
            localStorage: accountReadFailure,
            keyManager: accountReadKeyManager,
            snapshot: accountSnapshot,
        })).toEqual({ status: 'account-record-read-failed' });
        accountReadFailure.failingGetKeys.delete(STORAGE_KEYS.NOSTR_ACCOUNTS);
        expect(accountReadFailure.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).not.toBeNull();
    });

    it('destination、account record、active pointer、legacy removeの各失敗でlegacyを維持する', () => {
        const failures: Array<{
            setup(storage: FaultStorage, derivedPubkey: string): void;
            expected: string;
        }> = [
            {
                setup: (storage, derivedPubkey) => storage.failingSetKeys.add(getNsecStorageKey(derivedPubkey)),
                expected: 'destination-credential-save-failed',
            },
            {
                setup: (storage, derivedPubkey) => storage.ignoredSetKeys.add(getNsecStorageKey(derivedPubkey)),
                expected: 'destination-credential-save-failed',
            },
            {
                setup: (storage) => storage.failingSetKeys.add(STORAGE_KEYS.NOSTR_ACCOUNTS),
                expected: 'account-record-save-failed',
            },
            {
                setup: (storage) => storage.ignoredSetKeys.add(STORAGE_KEYS.NOSTR_ACCOUNTS),
                expected: 'account-record-save-failed',
            },
            {
                setup: (storage) => storage.failingSetKeys.add(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT),
                expected: 'active-pointer-save-failed',
            },
            {
                setup: (storage) => storage.ignoredSetKeys.add(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT),
                expected: 'active-pointer-save-failed',
            },
            {
                setup: (storage) => storage.failingRemoveKeys.add(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY),
                expected: 'legacy-credential-delete-failed',
            },
            {
                setup: (storage) => storage.ignoredRemoveKeys.add(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY),
                expected: 'legacy-credential-delete-failed',
            },
        ];

        failures.forEach(({ setup, expected }, index) => {
            const storage = new FaultStorage();
            const keyManager = createKeyManager(storage);
            const credential = createCredential(24 + index);
            const derivedPubkey = keyManager.derivePublicKey(credential).hex;
            storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);
            setup(storage, derivedPubkey);

            expect(migrate(storage, keyManager)).toEqual({ status: expected });
            expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY) === credential).toBe(true);
        });
    });

    it('維持すべきactive pointerが途中で変化した場合はlegacyを削除しない', () => {
        const storage = new FaultStorage();
        const keyManager = createKeyManager(storage);
        const credential = createCredential(18);
        const activePubkey = 'f'.repeat(64);
        storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);
        storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, JSON.stringify([account(activePubkey, 'nip46')]));
        storage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, activePubkey);
        storage.mutateActiveAfterAccountsWrite = 'a'.repeat(64);

        expect(migrate(storage, keyManager)).toEqual({ status: 'active-pointer-save-failed' });
        expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY) === credential).toBe(true);
    });

    it('NIP-46 sessionなどunrelated credentialを変更しない', () => {
        const storage = new FaultStorage();
        const keyManager = createKeyManager(storage);
        const credential = createCredential(19);
        const sessionPubkey = 'a'.repeat(64);
        storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, credential);
        storage.setItem(getNip46SessionStorageKey(sessionPubkey), 'session-value');

        expect(migrate(storage, keyManager)).toEqual({ status: 'migrated' });
        expect(storage.getItem(getNip46SessionStorageKey(sessionPubkey))).toBe('session-value');
    });
});
