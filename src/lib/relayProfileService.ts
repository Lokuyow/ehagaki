import type { createRxNostr } from 'rx-nostr';
import { RelayManager } from './relayManager';
import type { RelayConfig, ProfileData } from './types';
import { RelayConfigUtils } from './relayConfigUtils';
import { profileMetadataCache } from './profileMetadataCache.svelte';
import {
    getNip65RelayDirectory,
    type Nip65RelayDirectory,
} from './nip65RelayDirectory';

export interface ProfileBatchTarget {
    pubkeyHex: string;
    additionalRelays?: string[];
}

type ProfileRelayLists = Awaited<ReturnType<RelayManager["getRelayListsForProfile"]>>;

/**
 * リレー取得とプロフィール取得を統合管理するサービスクラス
 * 
 * 責務: RelayManagerとprofileMetadataCacheの調整役として機能し、
 *      ログインフローや再取得フローを提供する
 * 
 * 処理フロー:
 * 1. リレー取得: BOOTSTRAP_RELAYS → kind 10002/3 → Store, IndexedDB に保存
 * 2. プロフィール取得: BOOTSTRAP_RELAYS + 保存済みリレー → kind 0 → Store, IndexedDB に保存
 */
export class RelayProfileService {
    private rxNostr: ReturnType<typeof createRxNostr>;
    private relayManager: RelayManager;
    private nip65RelayDirectory: Pick<Nip65RelayDirectory, "lookup">;

    constructor(
        rxNostr: ReturnType<typeof createRxNostr>,
        relayManager: RelayManager,
        nip65RelayDirectory: Pick<Nip65RelayDirectory, "lookup"> = getNip65RelayDirectory(rxNostr as never),
    ) {
        this.rxNostr = rxNostr;
        this.relayManager = relayManager;
        this.nip65RelayDirectory = nip65RelayDirectory;
    }

    private getBaseProfileRelayLists(pubkeyHex: string) {
        return this.relayManager.getRelayListsForProfile(pubkeyHex);
    }

    private mergeAuthorWriteRelays(relayLists: ProfileRelayLists, authorWriteRelays: string[]) {
        return {
            ...relayLists,
            writeRelays: RelayConfigUtils.sanitizeExternalRelayUrls([
                ...relayLists.writeRelays,
                ...authorWriteRelays,
            ]),
            contextualRelays: RelayConfigUtils.sanitizeExternalRelayUrls([
                ...(relayLists.contextualRelays ?? relayLists.additionalRelays),
                ...authorWriteRelays,
            ]),
        };
    }

    private profileOptions(
        relayLists: ProfileRelayLists,
        additionalRelays: string[],
        forceRefresh: boolean,
        allowBackgroundRefresh: boolean,
    ) {
        const contextualRelays = relayLists.contextualRelays ?? relayLists.additionalRelays;
        const sanitizedHints = RelayConfigUtils.sanitizeExternalRelayUrls(additionalRelays, {
            limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT,
        });
        return {
            rxNostr: this.rxNostr as never,
            forceRefresh,
            allowBackgroundRefresh,
            writeRelays: relayLists.writeRelays,
            additionalRelays: RelayConfigUtils.sanitizeExternalRelayUrls(
                sanitizedHints.length
                    ? RelayConfigUtils.mergeRelayConfigs(sanitizedHints, contextualRelays)
                    : contextualRelays,
            ),
            ...(relayLists.fallbackRelays?.length ? { fallbackRelays: relayLists.fallbackRelays } : {}),
        };
    }

    private async refreshWithDiscoveredAuthorRelays(
        pubkeyHex: string,
        baseRelayLists: ProfileRelayLists,
        additionalRelays: string[],
        forceRefresh: boolean,
        allowBackgroundRefresh: boolean,
        initialRequest: Promise<unknown>,
    ): Promise<void> {
        try {
            const [nip65] = await Promise.all([
                this.nip65RelayDirectory.lookup(pubkeyHex),
                initialRequest.catch(() => undefined),
            ]);
            // Only base Write relays are guaranteed to bypass the contextual-tier cap.
            const existingRoutes = new Set(RelayConfigUtils.sanitizeExternalRelayUrls(baseRelayLists.writeRelays));
            const newWriteRelays = RelayConfigUtils.sanitizeExternalRelayUrls(nip65.writeRelays)
                .filter((relay) => !existingRoutes.has(relay));
            if (newWriteRelays.length === 0) return;
            const merged = this.mergeAuthorWriteRelays(baseRelayLists, newWriteRelays);
            await profileMetadataCache.getProfile(pubkeyHex, this.profileOptions(
                merged,
                additionalRelays,
                true,
                allowBackgroundRefresh,
            ));
        } catch {
            // Existing-relay retrieval remains useful when NIP-65 discovery fails.
        }
    }

    /**
     * 初期化時のリレー設定
     * 保存済みリレー情報があれば使用、なければBOOTSTRAP_RELAYSを設定
     */
    async initializeRelays(pubkeyHex?: string): Promise<void> {
        if (this.relayManager.useHostRelayConfig?.()) {
            return;
        }
        if (pubkeyHex) {
            if (!await this.relayManager.useRelaysFromLocalStorageIfExists(pubkeyHex)) {
                this.relayManager.setBootstrapRelays();
            }
        } else {
            this.relayManager.setBootstrapRelays();
        }
    }

    /**
     * リレーリストを取得（キャッシュにない場合はリモート取得）
     * @param pubkeyHex 公開鍵
     * @param forceRemote 強制的にリモート取得するか
     * @returns リレー取得結果
     */
    async fetchRelays(pubkeyHex: string, forceRemote: boolean = false): Promise<{
        success: boolean;
        relayConfig: RelayConfig;
        source: 'localStorage' | 'kind10002' | 'kind3' | 'fallback' | 'host';
    }> {
        if (this.relayManager.hasHostRelayConfig?.()) {
            return this.relayManager.fetchUserRelays(pubkeyHex, { forceRemote });
        }
        if (!forceRemote) {
            const cachedRelays = await this.relayManager.getFromLocalStorage(pubkeyHex);
            if (cachedRelays) {
                console.log("キャッシュからリレーリストを復元:", cachedRelays);
                return {
                    success: true,
                    relayConfig: cachedRelays,
                    source: 'localStorage'
                };
            }
        }

        // リモートから取得（自動的にIndexedDBに保存される）
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

        if (!forceRemote) {
            const cachedProfile = await profileMetadataCache.getCachedProfile(pubkeyHex);
            if (cachedProfile) return cachedProfile;
        }

        const relayLists = await this.getBaseProfileRelayLists(pubkeyHex);
        const initialRequest = profileMetadataCache.getProfile(
            pubkeyHex,
            this.profileOptions(relayLists, [], forceRemote, false),
        );
        void this.refreshWithDiscoveredAuthorRelays(
            pubkeyHex, relayLists, [], forceRemote, false, initialRequest,
        );
        return initialRequest;
    }

    /**
     * リプライ/引用プレビュー用のstale-while-revalidate取得。
     * 保存済みプロフィールを即時返し、staleなら共通キャッシュで更新する。
     */
    async fetchProfileRealtime(
        pubkeyHex: string,
        options: {
            additionalRelays?: string[];
        } = {},
    ): Promise<ProfileData | null> {
        if (!pubkeyHex) return null;

        const cachedProfile = await profileMetadataCache.getCachedProfile(pubkeyHex);
        if (cachedProfile) {
            void this.getBaseProfileRelayLists(pubkeyHex).then((relayLists) => {
                const initialRequest = profileMetadataCache.getProfile(
                    pubkeyHex,
                    this.profileOptions(relayLists, options.additionalRelays ?? [], false, true),
                );
                return this.refreshWithDiscoveredAuthorRelays(
                    pubkeyHex,
                    relayLists,
                    options.additionalRelays ?? [],
                    false,
                    true,
                    initialRequest,
                );
            }).catch(() => undefined);
            return cachedProfile;
        }

        const relayLists = await this.getBaseProfileRelayLists(pubkeyHex);
        const initialRequest = profileMetadataCache.getProfile(
            pubkeyHex,
            this.profileOptions(relayLists, options.additionalRelays ?? [], false, true),
        );
        void this.refreshWithDiscoveredAuthorRelays(
            pubkeyHex, relayLists, options.additionalRelays ?? [], false, true, initialRequest,
        );
        return initialRequest;
    }

    /**
     * 通知一覧など、多数のプロフィールを共通cache/tier処理でまとめて取得する。
     */
    async fetchProfilesRealtime(
        targets: ProfileBatchTarget[],
    ): Promise<Record<string, ProfileData | null>> {
        const relayHintsByPubkey = new Map<string, string[]>();
        for (const target of targets) {
            if (!target.pubkeyHex) {
                continue;
            }
            relayHintsByPubkey.set(
                target.pubkeyHex,
                RelayConfigUtils.sanitizeExternalRelayUrls([
                    ...(relayHintsByPubkey.get(target.pubkeyHex) ?? []),
                    ...(target.additionalRelays ?? []),
                ], {
                    limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT,
                }),
            );
        }

        const pubkeys = Array.from(relayHintsByPubkey.keys());
        const cachedProfiles = await profileMetadataCache.getCachedProfiles(pubkeys);
        if (pubkeys.every((pubkey) => cachedProfiles[pubkey])) {
            void Promise.all(pubkeys.map(async (pubkey) => [
                pubkey,
                await this.getBaseProfileRelayLists(pubkey),
            ] as const)).then((relayListEntries) => {
                const relayOptionsByPubkey = Object.fromEntries(relayListEntries.map(([pubkey, relayLists]) => {
                    const contextualRelays = relayLists.contextualRelays ?? relayLists.additionalRelays;
                    return [pubkey, {
                        additionalRelays: RelayConfigUtils.mergeRelayConfigs(
                            relayHintsByPubkey.get(pubkey) ?? [],
                            contextualRelays,
                        ),
                        writeRelays: relayLists.writeRelays,
                        ...(relayLists.fallbackRelays?.length ? { fallbackRelays: relayLists.fallbackRelays } : {}),
                    }];
                }));
                const initialRequest = profileMetadataCache.getProfiles(pubkeys, {
                    rxNostr: this.rxNostr as never,
                    allowBackgroundRefresh: true,
                    relayOptionsByPubkey,
                });
                for (const [pubkey, relayLists] of relayListEntries) {
                    void this.refreshWithDiscoveredAuthorRelays(
                        pubkey,
                        relayLists,
                        relayHintsByPubkey.get(pubkey) ?? [],
                        false,
                        true,
                        initialRequest,
                    );
                }
            }).catch(() => undefined);
            return cachedProfiles;
        }

        const relayListEntries = await Promise.all(pubkeys.map(async (pubkey) => [
            pubkey,
            await this.getBaseProfileRelayLists(pubkey),
        ] as const));
        const relayOptionsByPubkey = Object.fromEntries(relayListEntries.map(([
            pubkey,
            relayLists,
        ]) => {
            const contextualRelays = relayLists.contextualRelays ?? relayLists.additionalRelays;
            return [pubkey, {
                additionalRelays: RelayConfigUtils.mergeRelayConfigs(
                    relayHintsByPubkey.get(pubkey) ?? [],
                    contextualRelays,
                ),
                writeRelays: relayLists.writeRelays,
                ...(relayLists.fallbackRelays?.length
                    ? { fallbackRelays: relayLists.fallbackRelays }
                    : {}),
            }];
        }));

        const initialRequest = profileMetadataCache.getProfiles(pubkeys, {
            rxNostr: this.rxNostr as never,
            allowBackgroundRefresh: true,
            relayOptionsByPubkey,
        });
        for (const [pubkey, relayLists] of relayListEntries) {
            void this.refreshWithDiscoveredAuthorRelays(
                pubkey,
                relayLists,
                relayHintsByPubkey.get(pubkey) ?? [],
                false,
                true,
                initialRequest,
            );
        }
        return initialRequest;
    }

    subscribeProfile(
        pubkeyHex: string,
        callback: (profile: ProfileData | null) => void,
    ): () => void {
        return profileMetadataCache.subscribe(pubkeyHex, callback);
    }

    subscribeProfiles(
        pubkeys: string[],
        callback: (pubkeyHex: string, profile: ProfileData | null) => void,
    ): () => void {
        return profileMetadataCache.subscribeProfiles(pubkeys, callback);
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
        if (!this.relayManager.hasHostRelayConfig?.()) {
            await this.fetchRelays(pubkeyHex, false);
        }

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
        if (!this.relayManager.hasHostRelayConfig?.()) {
            await this.fetchRelays(pubkeyHex, true);
        }

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

}
