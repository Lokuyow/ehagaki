import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountManager } from '../../lib/accountManager';
import { STORAGE_KEYS } from '../../lib/constants';
import { MockStorage } from '../helpers';

describe('AccountManager', () => {
    let storage: MockStorage;
    let manager: AccountManager;
    const mockConsole = { error: vi.fn(), warn: vi.fn(), log: vi.fn(), info: vi.fn(), debug: vi.fn() } as unknown as Console;

    beforeEach(() => {
        storage = new MockStorage();
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
    });

    describe('migrateFromSingleAccount', () => {
        it('nostr-accountsが存在する場合はスキップ', () => {
            storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, '[]');
            storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, 'nsec1...');

            manager.migrateFromSingleAccount();

            // nsecがそのまま残る（マイグレーションされない）
            expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).toBe('nsec1...');
        });

        it('nsec認証をマイグレーション（profileキーからpubkey特定）', () => {
            const pubkey = 'abc123';
            storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, 'nsec1testkey');
            storage.setItem(STORAGE_KEYS.NOSTR_PROFILE + pubkey, JSON.stringify({ name: 'Test' }));

            manager.migrateFromSingleAccount();

            expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX + pubkey)).toBe('nsec1testkey');
            expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).toBeNull();

            const accounts = manager.getAccounts();
            expect(accounts).toHaveLength(1);
            expect(accounts[0].pubkeyHex).toBe(pubkey);
            expect(accounts[0].type).toBe('nsec');
            expect(manager.getActiveAccountPubkey()).toBe(pubkey);
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

        it('複数認証タイプの同時マイグレーション', () => {
            const nsecPub = 'nsecpub';
            const nip07Pub = 'nip07pub';
            storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, 'nsec1key');
            storage.setItem(STORAGE_KEYS.NOSTR_PROFILE + nsecPub, '{}');
            storage.setItem(STORAGE_KEYS.NOSTR_NIP07_PUBKEY, nip07Pub);

            manager.migrateFromSingleAccount();

            const accounts = manager.getAccounts();
            expect(accounts).toHaveLength(2);
            expect(accounts.find(a => a.pubkeyHex === nsecPub)?.type).toBe('nsec');
            expect(accounts.find(a => a.pubkeyHex === nip07Pub)?.type).toBe('nip07');
            // 最初に見つかったnsecがアクティブ
            expect(manager.getActiveAccountPubkey()).toBe(nsecPub);
        });
    });
});
