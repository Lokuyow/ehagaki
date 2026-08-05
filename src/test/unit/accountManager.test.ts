import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountManager } from '../../lib/accountManager';
import { STORAGE_KEYS } from '../../lib/constants';
import { createMockConsole, type MockConsole, MockStorage } from '../helpers';

describe('AccountManager', () => {
    let storage: MockStorage;
    let manager: AccountManager;
    let mockConsole: MockConsole;

    beforeEach(() => {
        storage = new MockStorage();
        mockConsole = createMockConsole();
        manager = new AccountManager({ localStorage: storage, console: mockConsole });
        vi.clearAllMocks();
    });

    describe('getAccounts', () => {
        it('空のリストを返す（データなし）', () => {
            expect(manager.getAccounts()).toEqual([]);
        });

        it('保存済みアカウントリストを返す', () => {
            const accounts = [
                { pubkeyHex: 'abc123', type: 'nsec' as const, addedAt: 1000 },
            ];
            storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, JSON.stringify(accounts));
            expect(manager.getAccounts()).toEqual(accounts);
        });

        it('不正なJSONの場合空配列を返す', () => {
            storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, '{invalid');
            expect(manager.getAccounts()).toEqual([]);
        });
    });

    describe('addAccount', () => {
        it('新しいアカウントを追加する', () => {
            manager.addAccount('pubkey1', 'nsec');
            const accounts = manager.getAccounts();
            expect(accounts).toHaveLength(1);
            expect(accounts[0].pubkeyHex).toBe('pubkey1');
            expect(accounts[0].type).toBe('nsec');
        });

        it('アクティブアカウントに設定する', () => {
            manager.addAccount('pubkey1', 'nsec');
            expect(manager.getActiveAccountPubkey()).toBe('pubkey1');
        });

        it('既存アカウントのタイプを更新する', () => {
            manager.addAccount('pubkey1', 'nsec');
            manager.addAccount('pubkey1', 'nip07');
            const accounts = manager.getAccounts();
            expect(accounts).toHaveLength(1);
            expect(accounts[0].type).toBe('nip07');
        });

        it('複数アカウントを追加できる', () => {
            manager.addAccount('pubkey1', 'nsec');
            manager.addAccount('pubkey2', 'nip07');
            expect(manager.getAccounts()).toHaveLength(2);
            // 最後に追加したアカウントがアクティブ
            expect(manager.getActiveAccountPubkey()).toBe('pubkey2');
        });
    });

    describe('removeAccount', () => {
        it('アクティブアカウントを削除 → 次のアカウントのpubkeyを返す', () => {
            manager.addAccount('pubkey1', 'nsec');
            manager.addAccount('pubkey2', 'nip07');
            manager.setActiveAccount('pubkey1');

            const result = manager.removeAccount('pubkey1');
            expect(result).toBe('pubkey2');
            expect(manager.getActiveAccountPubkey()).toBe('pubkey2');
        });

        it('アクティブアカウントを削除（最後の1つ）→ nullを返す', () => {
            manager.addAccount('pubkey1', 'nsec');
            const result = manager.removeAccount('pubkey1');
            expect(result).toBeNull();
            expect(manager.getActiveAccountPubkey()).toBeNull();
        });

        it('非アクティブアカウントを削除 → undefinedを返す', () => {
            manager.addAccount('pubkey1', 'nsec');
            manager.addAccount('pubkey2', 'nip07');
            // pubkey2がアクティブ
            const result = manager.removeAccount('pubkey1');
            expect(result).toBeUndefined();
            expect(manager.getActiveAccountPubkey()).toBe('pubkey2');
        });

        it('存在しないアカウントを削除 → undefinedを返す', () => {
            expect(manager.removeAccount('nonexistent')).toBeUndefined();
        });
    });

    describe('setActiveAccount', () => {
        it('登録済みアカウントをアクティブに設定', () => {
            manager.addAccount('pubkey1', 'nsec');
            manager.addAccount('pubkey2', 'nip07');
            manager.setActiveAccount('pubkey1');
            expect(manager.getActiveAccountPubkey()).toBe('pubkey1');
        });

        it('未登録のpubkeyでは何も起きない', () => {
            manager.addAccount('pubkey1', 'nsec');
            manager.setActiveAccount('unknown');
            expect(manager.getActiveAccountPubkey()).toBe('pubkey1');
        });

        it('active pointerをclearしても保存アカウントは削除しない', () => {
            manager.addAccount('pubkey1', 'nsec');
            manager.clearActiveAccount();

            expect(manager.getActiveAccountPubkey()).toBeNull();
            expect(manager.getAccounts()).toEqual([
                expect.objectContaining({ pubkeyHex: 'pubkey1', type: 'nsec' }),
            ]);
        });
    });

    describe('hasAccount', () => {
        it('存在するアカウントでtrue', () => {
            manager.addAccount('pubkey1', 'nsec');
            expect(manager.hasAccount('pubkey1')).toBe(true);
        });

        it('存在しないアカウントでfalse', () => {
            expect(manager.hasAccount('pubkey1')).toBe(false);
        });
    });

    describe('getAccountType', () => {
        it('登録済みアカウントのタイプを返す', () => {
            manager.addAccount('pubkey1', 'nip46');
            expect(manager.getAccountType('pubkey1')).toBe('nip46');
        });

        it('未登録アカウントでnullを返す', () => {
            expect(manager.getAccountType('unknown')).toBeNull();
        });
    });

    describe('cleanupAccountData', () => {
        it('指定アカウントの全データを削除する', () => {
            const pubkey = 'abc123';
            storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX + pubkey, 'nsec1...');
            storage.setItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX + pubkey, '{}');
            storage.setItem(STORAGE_KEYS.NOSTR_RELAYS + pubkey, '[]');
            storage.setItem(STORAGE_KEYS.NOSTR_PROFILE + pubkey, '{}');

            manager.cleanupAccountData(pubkey);

            expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX + pubkey)).toBeNull();
            expect(storage.getItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX + pubkey)).toBeNull();
            expect(storage.getItem(STORAGE_KEYS.NOSTR_RELAYS + pubkey)).toBeNull();
            expect(storage.getItem(STORAGE_KEYS.NOSTR_PROFILE + pubkey)).toBeNull();
        });

        it('localStorage.removeItemが例外を投げた場合にエラーログを出力する', () => {
            const throwingStorage = new MockStorage();
            throwingStorage.removeItem = vi.fn().mockImplementation(() => {
                throw new Error('Storage error');
            });
            const errorManager = new AccountManager({ localStorage: throwingStorage, console: mockConsole });

            errorManager.cleanupAccountData('abc123');

            expect(mockConsole.error).toHaveBeenCalledWith(
                'アカウントデータ削除エラー:',
                expect.any(Error)
            );
        });
    });

    describe('migrateFromSingleAccount', () => {
        it('nostr-accountsが存在する場合はスキップ', () => {
            storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, '[]');
            storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, 'legacy-value');

            manager.migrateFromSingleAccount();

            expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).toBe('legacy-value');
        });

        it('legacy nsecとprofileまたはrelay keyを変更せず専用migrationへ残す', () => {
            storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, 'legacy-value');
            storage.setItem(STORAGE_KEYS.NOSTR_PROFILE + 'profile-pubkey', JSON.stringify({ name: 'Test' }));
            storage.setItem(STORAGE_KEYS.NOSTR_RELAYS + 'relay-pubkey', JSON.stringify(['wss://relay.example']));

            manager.migrateFromSingleAccount();

            expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).toBe('legacy-value');
            expect(storage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS)).toBeNull();
            expect(manager.getActiveAccountPubkey()).toBeNull();
        });

        it('NIP-07認証をマイグレーション', () => {
            const pubkey = 'nip07pub';
            storage.setItem(STORAGE_KEYS.NOSTR_NIP07_PUBKEY, pubkey);

            manager.migrateFromSingleAccount();

            expect(storage.getItem(STORAGE_KEYS.NOSTR_NIP07_PUBKEY)).toBeNull();

            const accounts = manager.getAccounts();
            expect(accounts).toHaveLength(1);
            expect(accounts[0].pubkeyHex).toBe(pubkey);
            expect(accounts[0].type).toBe('nip07');
        });

        it('NIP-46認証をマイグレーション', () => {
            const pubkey = 'nip46pub';
            const session = JSON.stringify({ userPubkey: pubkey, relayUrl: 'wss://relay' });
            storage.setItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_LEGACY, session);

            manager.migrateFromSingleAccount();

            expect(storage.getItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_LEGACY)).toBeNull();
            expect(storage.getItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX + pubkey)).toBe(session);

            const accounts = manager.getAccounts();
            expect(accounts).toHaveLength(1);
            expect(accounts[0].pubkeyHex).toBe(pubkey);
            expect(accounts[0].type).toBe('nip46');
        });

        it('複数の非nsec認証タイプを同時にマイグレーション', () => {
            const nip07Pub = 'nip07pub';
            storage.setItem(STORAGE_KEYS.NOSTR_NIP07_PUBKEY, nip07Pub);
            const nip46Pub = 'nip46pub';
            const session = JSON.stringify({ userPubkey: nip46Pub, relayUrl: 'wss://relay' });
            storage.setItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_LEGACY, session);

            manager.migrateFromSingleAccount();

            const accounts = manager.getAccounts();
            expect(accounts).toHaveLength(2);
            expect(accounts.find(a => a.pubkeyHex === nip07Pub)?.type).toBe('nip07');
            expect(accounts.find(a => a.pubkeyHex === nip46Pub)?.type).toBe('nip46');
            expect(manager.getActiveAccountPubkey()).toBe(nip07Pub);
        });
    });

    describe('cleanupNostrLoginData', () => {
        const nostrLoginKeys = [
            '__nostrlogin_nip46',
            '__nostrlogin_accounts',
            '__nostrlogin_recent',
            'nl-dark-mode',
        ];

        it('NostrLoginの残留キーをすべて削除する', () => {
            for (const key of nostrLoginKeys) {
                storage.setItem(key, 'some-value');
            }
            manager.cleanupNostrLoginData();
            for (const key of nostrLoginKeys) {
                expect(storage.getItem(key)).toBeNull();
            }
        });

        it('NostrLoginキーが存在しない場合でもエラーにならない', () => {
            expect(() => manager.cleanupNostrLoginData()).not.toThrow();
        });

        it('NostrLogin以外のキーは削除しない', () => {
            storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, '[{"pubkeyHex":"abc","type":"nsec","addedAt":1}]');
            storage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, 'abc');
            storage.setItem('__nostrlogin_nip46', '{}');
            manager.cleanupNostrLoginData();
            expect(storage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS)).not.toBeNull();
            expect(storage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT)).not.toBeNull();
        });
    });
});
