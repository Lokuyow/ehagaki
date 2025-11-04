import type { createRxNostr } from 'rx-nostr';
import { RelayManager } from './relayManager';
import { ProfileManager } from './profileManager';
import type { RelayConfig, ProfileData } from './types';

/**
 * リレー取得とプロフィール取得を統合管理するサービスクラス
 * 
 * 責務: RelayManagerとProfileManagerの調整役として機能し、
 *      ログインフローや再取得フローを提供する
 * 
 * 処理フロー:
 * 1. リレー取得: BOOTSTRAP_RELAYS → kind 10002/3 → Store, nostr-relays-{pubkeyHex} に保存
 * 2. プロフィール取得: BOOTSTRAP_RELAYS + nostr-relays-{pubkeyHex} → kind 0 → Store, nostr-profile-{pubkeyHex} に保存
 */
export class RelayProfileService {
    private relayManager: RelayManager;
    private profileManager: ProfileManager;

    constructor(
        rxNostr: ReturnType<typeof createRxNostr>,
        relayManager: RelayManager,
        profileManager: ProfileManager
    ) {
        this.relayManager = relayManager;
        this.profileManager = profileManager;
    }

    /**
     * 初期化時のリレー設定
     * ローカルストレージにリレー情報があれば使用、なければBOOTSTRAP_RELAYSを設定
     */
    async initializeRelays(pubkeyHex?: string): Promise<void> {
        if (pubkeyHex) {
            if (!this.relayManager.useRelaysFromLocalStorageIfExists(pubkeyHex)) {
                this.relayManager.setBootstrapRelays();
            }
        } else {
            this.relayManager.setBootstrapRelays();
        }
    }

    /**
     * リレーリストを取得（ローカルストレージにない場合はリモート取得）
     * @param pubkeyHex 公開鍵
     * @param forceRemote 強制的にリモート取得するか
     * @returns リレー取得結果
     */
    async fetchRelays(pubkeyHex: string, forceRemote: boolean = false): Promise<{
        success: boolean;
        relayConfig: RelayConfig;
        source: 'localStorage' | 'kind10002' | 'kind3' | 'fallback';
    }> {
        if (!forceRemote) {
            const cachedRelays = this.relayManager.getFromLocalStorage(pubkeyHex);
            if (cachedRelays) {
                console.log("キャッシュからリレーリストを復元:", cachedRelays);
                return {
                    success: true,
                    relayConfig: cachedRelays,
                    source: 'localStorage'
                };
            }
        }

        // リモートから取得（自動的にローカルストレージに保存される）
        const result = await this.relayManager.fetchUserRelays(pubkeyHex, { forceRemote });
        return result;
    }

    /**
     * プロフィールを取得
     * @param pubkeyHex 公開鍵
     * @param forceRemote 強制的にリモート取得するか
     * @returns プロフィールデータ
     */
    async fetchProfile(pubkeyHex: string, forceRemote: boolean = false): Promise<ProfileData | null> {
        if (!pubkeyHex) return null;

        // forceRemoteの場合はプロフィールキャッシュを削除
        if (forceRemote) {
            this.profileManager.saveToLocalStorage(pubkeyHex, null);
        }

        // RelayManagerからリレー情報を取得（ストレージアクセスはRelayManagerに委譲）
        const { writeRelays, additionalRelays } = this.relayManager.getRelayListsForProfile(pubkeyHex);

        // プロフィール取得（自動的にローカルストレージに保存される）
        const profile = await this.profileManager.fetchProfileData(pubkeyHex, {
            forceRemote,
            writeRelays,
            additionalRelays
        });

        return profile;
    }

    /**
     * ログイン時の初期化処理
     * 1. リレーリスト取得（キャッシュがない場合のみ）
     * 2. プロフィール取得
     * 
     * @param pubkeyHex 公開鍵
     * @returns プロフィールデータ
     */
    async initializeForLogin(pubkeyHex: string): Promise<ProfileData | null> {
        console.log(`ログイン初期化開始: ${pubkeyHex}`);

        // 1. リレーリスト取得（キャッシュがない場合のみリモート取得）
        await this.fetchRelays(pubkeyHex, false);

        // 2. プロフィール取得
        const profile = await this.fetchProfile(pubkeyHex, false);

        console.log(`ログイン初期化完了: ${pubkeyHex}`);
        return profile;
    }

    /**
     * リレーリストとプロフィールを強制的に再取得
     * （設定画面の「再取得」ボタン用）
     * 
     * @param pubkeyHex 公開鍵
     * @returns プロフィールデータ
     */
    async refreshRelaysAndProfile(pubkeyHex: string): Promise<ProfileData | null> {
        console.log(`リレー・プロフィール再取得開始: ${pubkeyHex}`);

        // 1. リレーリストを強制的にリモート取得
        await this.fetchRelays(pubkeyHex, true);

        // 2. プロフィールを強制的にリモート取得
        const profile = await this.fetchProfile(pubkeyHex, true);

        console.log(`リレー・プロフィール再取得完了: ${pubkeyHex}`);
        return profile;
    }

    /**
     * RelayManagerへの参照を取得（既存コードとの互換性のため）
     */
    getRelayManager(): RelayManager {
        return this.relayManager;
    }

    /**
     * ProfileManagerへの参照を取得（既存コードとの互換性のため）
     */
    getProfileManager(): ProfileManager {
        return this.profileManager;
    }
}
