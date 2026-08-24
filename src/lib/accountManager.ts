import type { StoredAccount } from './types';
import { STORAGE_KEYS } from './constants';
import {
    getNip46SessionStorageKey,
    getNsecStorageKey,
    getParentClientSessionStorageKey,
} from './authStorageKeys';
import { profilesRepository } from './storage/profilesRepository';
import { relayConfigsRepository } from './storage/relayConfigsRepository';
import {
    captureLegacyNsecMigrationSnapshot,
    type LegacyNsecMigrationSnapshotResult,
} from './legacyNsecMigration';

export interface AccountManagerDeps {
    localStorage: Storage;
    console?: Console;
}

export class AccountManager {
    private localStorage: Storage;
    private console: Console;

    constructor(deps: AccountManagerDeps) {
        this.localStorage = deps.localStorage;
        this.console = deps.console || globalThis.console;
    }

    getAccounts(): StoredAccount[] {
        try {
            const data = this.localStorage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS);
            if (!data) return [];
            const accounts = JSON.parse(data) as StoredAccount[];
            return Array.isArray(accounts) ? accounts : [];
        } catch {
            return [];
        }
    }

    private saveAccounts(accounts: StoredAccount[]): void {
        this.localStorage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, JSON.stringify(accounts));
    }

    private saveActiveAccountPubkey(pubkeyHex: string): void {
        this.localStorage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, pubkeyHex);
    }

    private clearActiveAccountPubkey(): void {
        this.localStorage.removeItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT);
    }

    getActiveAccountPubkey(): string | null {
        return this.localStorage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT) || null;
    }

    /** Strict startup snapshot; unlike UI reads, storage failures are preserved. */
    getAuthRestoreSnapshot(): LegacyNsecMigrationSnapshotResult {
        return captureLegacyNsecMigrationSnapshot(this.localStorage);
    }

    setActiveAccount(pubkeyHex: string): void {
        const accounts = this.getAccounts();
        if (!accounts.some(a => a.pubkeyHex === pubkeyHex)) return;
        this.saveActiveAccountPubkey(pubkeyHex);
    }

    clearActiveAccount(): void {
        this.clearActiveAccountPubkey();
    }

    /**
     * Removes only local nsec credentials and nsec account records.
     * The configured Storage boundary decides the namespace; the Direct Web
     * Component passes its scoped facade, so host keys remain unreachable.
     */
    cleanupLocalNsecAuthData(): void {
        let remainingAccounts: unknown[] | null = null;
        const removedPubkeys = new Set<string>();

        try {
            const rawAccounts = this.localStorage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS);
            if (rawAccounts !== null) {
                const parsed = JSON.parse(rawAccounts) as unknown;
                if (Array.isArray(parsed)) {
                    remainingAccounts = parsed.filter((account) => {
                        if (
                            typeof account === 'object'
                            && account !== null
                            && (account as Partial<StoredAccount>).type === 'nsec'
                        ) {
                            const pubkeyHex = (account as Partial<StoredAccount>).pubkeyHex;
                            if (typeof pubkeyHex === 'string') {
                                removedPubkeys.add(pubkeyHex);
                            }
                            return false;
                        }
                        return true;
                    });

                    if (remainingAccounts.length !== parsed.length) {
                        this.localStorage.setItem(
                            STORAGE_KEYS.NOSTR_ACCOUNTS,
                            JSON.stringify(remainingAccounts),
                        );
                    }
                }
            }
        } catch {
            this.console.error('ローカルnsecアカウントデータ削除に失敗しました', {
                stage: 'account-records',
                reason: 'unexpected',
            });
            remainingAccounts = null;
            removedPubkeys.clear();
        }

        if (remainingAccounts && removedPubkeys.size > 0) {
            try {
                const activePubkey = this.getActiveAccountPubkey();
                const activeStillExists = remainingAccounts.some(
                    (account) => typeof account === 'object'
                        && account !== null
                        && (account as Partial<StoredAccount>).pubkeyHex === activePubkey,
                );
                if (activePubkey && removedPubkeys.has(activePubkey) && !activeStillExists) {
                    const nextActiveAccount = remainingAccounts.find((account) =>
                        typeof account === 'object'
                        && account !== null
                        && typeof (account as Partial<StoredAccount>).pubkeyHex === 'string'
                        && (account as Partial<StoredAccount>).pubkeyHex,
                    ) as Partial<StoredAccount> | undefined;
                    const nextActivePubkey = nextActiveAccount?.pubkeyHex;
                    if (nextActivePubkey) {
                        this.saveActiveAccountPubkey(nextActivePubkey);
                    } else {
                        this.clearActiveAccountPubkey();
                    }
                }
            } catch {
                this.console.error('ローカルnsecアカウントデータ削除に失敗しました', {
                    stage: 'active-account',
                    reason: 'unexpected',
                });
            }
        }

        const credentialKeys = new Set<string>([
            STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY,
            ...[...removedPubkeys].map((pubkeyHex) => getNsecStorageKey(pubkeyHex)),
        ]);
        try {
            for (let index = 0; index < this.localStorage.length; index += 1) {
                const key = this.localStorage.key(index);
                if (key?.startsWith(STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX)) {
                    credentialKeys.add(key);
                }
            }
        } catch {
            this.console.error('ローカルnsecアカウントデータ削除に失敗しました', {
                stage: 'credential-list',
                reason: 'unexpected',
            });
        }

        for (const key of credentialKeys) {
            try {
                this.localStorage.removeItem(key);
            } catch {
                this.console.error('ローカルnsecアカウントデータ削除に失敗しました', {
                    stage: 'credential-remove',
                    reason: 'unexpected',
                });
            }
        }
    }

    addAccount(pubkeyHex: string, type: StoredAccount['type']): void {
        const accounts = this.getAccounts();
        const existing = accounts.find(a => a.pubkeyHex === pubkeyHex);
        if (existing) {
            // 認証タイプが変わった場合は更新
            existing.type = type;
            this.saveAccounts(accounts);
        } else {
            accounts.push({ pubkeyHex, type, addedAt: Date.now() });
            this.saveAccounts(accounts);
        }
        this.saveActiveAccountPubkey(pubkeyHex);
    }

    /**
     * アカウントをリストから削除する。
     * 削除したのがアクティブアカウントだった場合、次のアカウントのpubkeyHexを返す（なければnull）。
     * アクティブでないアカウントを削除した場合はundefinedを返す。
     */
    removeAccount(pubkeyHex: string): string | null | undefined {
        const accounts = this.getAccounts();
        const index = accounts.findIndex(a => a.pubkeyHex === pubkeyHex);
        if (index === -1) return undefined;

        accounts.splice(index, 1);
        this.saveAccounts(accounts);

        const activePubkey = this.getActiveAccountPubkey();
        if (activePubkey === pubkeyHex) {
            // アクティブアカウントが削除された → 次のアカウントを選択
            if (accounts.length > 0) {
                const nextAccount = accounts[0];
                this.saveActiveAccountPubkey(nextAccount.pubkeyHex);
                return nextAccount.pubkeyHex;
            } else {
                this.clearActiveAccountPubkey();
                return null;
            }
        }

        return undefined; // 非アクティブアカウントの削除
    }

    hasAccount(pubkeyHex: string): boolean {
        return this.getAccounts().some(a => a.pubkeyHex === pubkeyHex);
    }

    getAccountType(pubkeyHex: string): StoredAccount['type'] | null {
        const account = this.getAccounts().find(a => a.pubkeyHex === pubkeyHex);
        return account?.type ?? null;
    }

    /**
     * 旧形式（シングルアカウント）からマルチアカウント形式へのNIP-07/NIP-46移行。
     * legacy nsec は自身からidentityを導出する専用migrationが扱う。
     */
    migrateFromSingleAccount(): void {
        if (this.localStorage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS) !== null) return;

        const accounts: StoredAccount[] = [];
        let activePubkey: string | null = null;

        // NIP-07認証のマイグレーション
        const nip07Pubkey = this.localStorage.getItem(STORAGE_KEYS.NOSTR_NIP07_PUBKEY);
        if (nip07Pubkey && !accounts.some(a => a.pubkeyHex === nip07Pubkey)) {
            accounts.push({ pubkeyHex: nip07Pubkey, type: 'nip07', addedAt: Date.now() });
            if (!activePubkey) activePubkey = nip07Pubkey;
        }
        if (nip07Pubkey) {
            this.localStorage.removeItem(STORAGE_KEYS.NOSTR_NIP07_PUBKEY);
        }

        // NIP-46認証のマイグレーション
        const legacyNip46 = this.localStorage.getItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_LEGACY);
        if (legacyNip46) {
            try {
                const session = JSON.parse(legacyNip46);
                if (session?.userPubkey) {
                    this.localStorage.setItem(getNip46SessionStorageKey(session.userPubkey), legacyNip46);
                    if (!accounts.some(a => a.pubkeyHex === session.userPubkey)) {
                        accounts.push({ pubkeyHex: session.userPubkey, type: 'nip46', addedAt: Date.now() });
                        if (!activePubkey) activePubkey = session.userPubkey;
                    }
                }
            } catch {
                this.console.error('NIP-46セッションのマイグレーション失敗');
            }
            this.localStorage.removeItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_LEGACY);
        }

        // legacy nsecしかない場合は、nsec専用migrationが安全な保存を完了するまで
        // nostr-accounts を作らない。
        if (accounts.length > 0) {
            this.saveAccounts(accounts);
            if (activePubkey) {
                this.saveActiveAccountPubkey(activePubkey);
            }
        }
    }

    /**
     * 旧nostr-loginライブラリが残したlocalStorageキーを削除する。
     * 既存のNostrLoginユーザーが新バージョンのアプリにアクセスした際の残留データをクリーンアップする。
     */
    cleanupNostrLoginData(): void {
        const nostrLoginKeys = [
            '__nostrlogin_nip46',
            '__nostrlogin_accounts',
            '__nostrlogin_recent',
            'nl-dark-mode',
        ];
        for (const key of nostrLoginKeys) {
            this.localStorage.removeItem(key);
        }
    }

    /**
     * 指定アカウントの per-user データ（認証情報、リレー、プロフィール）を全て削除する。
     */
    async cleanupAccountData(pubkeyHex: string): Promise<void> {
        const localStorageKeys = [
            { key: getNsecStorageKey(pubkeyHex), target: 'nsec' },
            { key: getNip46SessionStorageKey(pubkeyHex), target: 'nip46-session' },
            { key: getParentClientSessionStorageKey(pubkeyHex), target: 'parent-client-session' },
            { key: STORAGE_KEYS.NOSTR_RELAYS + pubkeyHex, target: 'relay-config' },
            { key: STORAGE_KEYS.NOSTR_PROFILE + pubkeyHex, target: 'profile' },
        ] as const;

        for (const { key, target } of localStorageKeys) {
            try {
                this.localStorage.removeItem(key);
            } catch {
                this.console.error('アカウントデータ削除に失敗しました', {
                    stage: 'local-storage',
                    target,
                    reason: 'unexpected',
                });
            }
        }

        const repositoryResults = await Promise.allSettled([
            Promise.resolve().then(() => profilesRepository.delete(pubkeyHex)),
            Promise.resolve().then(() => relayConfigsRepository.delete(pubkeyHex)),
        ]);

        const repositoryTargets = ['profile-repository', 'relay-config-repository'] as const;
        repositoryResults.forEach((result, index) => {
            if (result.status === 'rejected') {
                this.console.error('アカウントデータ削除に失敗しました', {
                    stage: 'indexeddb',
                    target: repositoryTargets[index],
                    reason: 'rejected',
                });
            }
        });
    }
}
