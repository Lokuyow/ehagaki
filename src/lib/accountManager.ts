import type { StoredAccount } from './types';
import { STORAGE_KEYS } from './constants';

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

    getActiveAccountPubkey(): string | null {
        return this.localStorage.getItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT) || null;
    }

    setActiveAccount(pubkeyHex: string): void {
        const accounts = this.getAccounts();
        if (!accounts.some(a => a.pubkeyHex === pubkeyHex)) return;
        this.localStorage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, pubkeyHex);
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
        this.localStorage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, pubkeyHex);
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
                this.localStorage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, nextAccount.pubkeyHex);
                return nextAccount.pubkeyHex;
            } else {
                this.localStorage.removeItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT);
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
     * 旧形式（シングルアカウント）からマルチアカウント形式へのマイグレーション。
     * nostr-accounts キーが存在しない場合のみ実行。
     */
    migrateFromSingleAccount(): void {
        if (this.localStorage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS) !== null) return;

        const accounts: StoredAccount[] = [];
        let activePubkey: string | null = null;

        // nsec認証のマイグレーション
        const legacyNsec = this.localStorage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY);
        if (legacyNsec) {
            // nsecからpubkeyHexを特定するため、既存のprofileデータを探す
            const nsecPubkey = this.findPubkeyForLegacyNsec();
            if (nsecPubkey) {
                this.localStorage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX + nsecPubkey, legacyNsec);
                accounts.push({ pubkeyHex: nsecPubkey, type: 'nsec', addedAt: Date.now() });
                activePubkey = nsecPubkey;
            }
            this.localStorage.removeItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY);
        }

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
                    this.localStorage.setItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX + session.userPubkey, legacyNip46);
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

        // アカウントリストを保存
        this.saveAccounts(accounts);
        if (activePubkey) {
            this.localStorage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, activePubkey);
        }
    }

    /**
     * レガシーnsecに対応するpubkeyHexを見つける。
     * localStorageの nostr-profile-{pubkey} キーを走査して特定。
     */
    private findPubkeyForLegacyNsec(): string | null {
        try {
            for (let i = 0; i < this.localStorage.length; i++) {
                const key = this.localStorage.key(i);
                if (key?.startsWith(STORAGE_KEYS.NOSTR_PROFILE)) {
                    return key.substring(STORAGE_KEYS.NOSTR_PROFILE.length);
                }
            }
            // profileがない場合、リレーキーから探す
            for (let i = 0; i < this.localStorage.length; i++) {
                const key = this.localStorage.key(i);
                if (key?.startsWith(STORAGE_KEYS.NOSTR_RELAYS)) {
                    return key.substring(STORAGE_KEYS.NOSTR_RELAYS.length);
                }
            }
        } catch {
            // localStorageアクセスエラー
        }
        return null;
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
    cleanupAccountData(pubkeyHex: string): void {
        try {
            this.localStorage.removeItem(STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX + pubkeyHex);
            this.localStorage.removeItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX + pubkeyHex);
            this.localStorage.removeItem(STORAGE_KEYS.NOSTR_PARENT_CLIENT_SESSION_PREFIX + pubkeyHex);
            this.localStorage.removeItem(STORAGE_KEYS.NOSTR_RELAYS + pubkeyHex);
            this.localStorage.removeItem(STORAGE_KEYS.NOSTR_PROFILE + pubkeyHex);
        } catch (error) {
            this.console.error('アカウントデータ削除エラー:', error);
        }
    }
}
