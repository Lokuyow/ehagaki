import { createRxForwardReq } from "rx-nostr";
import type { RxNostr } from "rx-nostr";
import { BOOTSTRAP_RELAYS, FALLBACK_RELAYS } from "./constants";
import type { RelayConfig, RelayManagerDeps, RelayFetchOptions, RelayFetchResult } from "./types";

// --- 純粋関数（依存性なし） ---
export class RelayConfigParser {
    static parseKind10002Tags(tags: any[]): RelayConfig {
        const relayConfigs: { [url: string]: { read: boolean; write: boolean } } = {};

        tags
            .filter((tag) => Array.isArray(tag) && tag.length >= 2 && tag[0] === "r")
            .forEach((tag) => {
                const url = tag[1];
                if (!url || typeof url !== 'string') return;

                let read = true;
                let write = true;

                if (tag.length > 2) {
                    if (tag.length === 3) {
                        if (tag[2] === "read") write = false;
                        else if (tag[2] === "write") read = false;
                    } else {
                        read = tag.includes("read");
                        write = tag.includes("write");
                    }
                }
                relayConfigs[url] = { read, write };
            });

        return relayConfigs;
    }

    static parseKind3Content(content: string): RelayConfig | null {
        try {
            const relayObj = JSON.parse(content);
            if (relayObj && typeof relayObj === "object" && !Array.isArray(relayObj)) {
                return relayObj;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    static isValidRelayConfig(config: any): config is RelayConfig {
        if (!config) return false;

        if (Array.isArray(config)) {
            return config.every(item => typeof item === 'string');
        }

        if (typeof config === 'object') {
            return Object.entries(config).every(([url, conf]) =>
                typeof url === 'string' &&
                conf &&
                typeof conf === 'object' &&
                'read' in conf &&
                'write' in conf &&
                typeof conf.read === 'boolean' &&
                typeof conf.write === 'boolean'
            );
        }

        return false;
    }
}

// --- ストレージ操作の分離 ---
export class RelayStorage {
    constructor(
        private localStorage: Storage,
        private console: Console,
        private relayListUpdatedStore?: RelayManagerDeps['relayListUpdatedStore']
    ) { }

    save(pubkeyHex: string, relays: RelayConfig | null): void {
        try {
            const key = `nostr-relays-${pubkeyHex}`;

            if (relays === null) {
                this.localStorage.removeItem(key);
                this.console.log(`リレーリストを削除: ${pubkeyHex}`);
                return;
            }

            if (!RelayConfigParser.isValidRelayConfig(relays)) {
                this.console.warn('無効なリレー設定のため保存をスキップ:', relays);
                return;
            }

            this.localStorage.setItem(key, JSON.stringify(relays));

            // リレーリスト更新を通知
            if (this.relayListUpdatedStore) {
                this.relayListUpdatedStore.set(this.relayListUpdatedStore.value + 1);
            }

            this.console.log("リレーリストをローカルストレージに保存:", pubkeyHex);
        } catch (e) {
            this.console.error("リレーリストの保存に失敗:", e);
        }
    }

    get(pubkeyHex: string): RelayConfig | null {
        try {
            const key = `nostr-relays-${pubkeyHex}`;
            const relays = this.localStorage.getItem(key);

            if (!relays) return null;

            const parsed = JSON.parse(relays);
            return RelayConfigParser.isValidRelayConfig(parsed) ? parsed : null;
        } catch (e) {
            this.console.error("リレーリストの取得に失敗:", e);
            return null;
        }
    }

    clear(pubkeyHex: string): void {
        this.save(pubkeyHex, null);
    }
}

// --- ネットワーク取得の分離 ---
export class RelayNetworkFetcher {
    constructor(
        private rxNostr: RxNostr,
        private console: Console,
        private setTimeoutFn: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any,
        private clearTimeoutFn: (timeoutId: any) => void
    ) { }

    async fetchKind10002(
        pubkeyHex: string,
        relays: string[],
        timeoutMs: number = 3000
    ): Promise<RelayFetchResult> {
        this.console.log(`Kind 10002取得試行: ${pubkeyHex}`);

        return new Promise((resolve) => {
            const rxReq = createRxForwardReq();
            let found = false;
            let timeoutId: any = null;
            let resolved = false;
            let subscription: any = undefined;

            const cleanup = () => {
                if (timeoutId != null) {
                    this.clearTimeoutFn(timeoutId);
                    timeoutId = null;
                }
                if (subscription && typeof subscription.unsubscribe === "function") {
                    subscription.unsubscribe();
                    subscription = undefined;
                }
            };

            const safeResolve = (result: RelayFetchResult) => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    resolve(result);
                }
            };

            try {
                subscription = this.rxNostr.use(rxReq, { on: { relays } }).subscribe({
                    next: (packet: any) => {
                        if (resolved) return;

                        if (packet.event?.kind === 10002 && packet.event.pubkey === pubkeyHex) {
                            try {
                                const relayConfigs = RelayConfigParser.parseKind10002Tags(packet.event.tags);
                                if (Object.keys(relayConfigs).length > 0) {
                                    found = true;
                                    this.console.log("Kind 10002からリレーを取得:", relayConfigs);
                                    safeResolve({
                                        success: true,
                                        relayConfig: relayConfigs,
                                        source: 'kind10002'
                                    });
                                }
                            } catch (e) {
                                this.console.error("Kind 10002のパースエラー:", e);
                            }
                        }
                    },
                    error: (error: any) => {
                        if (resolved) return;
                        this.console.error("Kind 10002取得エラー:", error);
                        safeResolve({ success: false, error: 'network_error' });
                    }
                });

                // リクエスト送信
                rxReq.emit({ authors: [pubkeyHex], kinds: [10002] });

                // タイムアウト設定
                timeoutId = this.setTimeoutFn(() => {
                    if (resolved) return;
                    if (!found) {
                        this.console.log("Kind 10002: タイムアウト");
                    }
                    safeResolve({ success: found, error: found ? undefined : 'timeout' });
                }, timeoutMs);

            } catch (error) {
                this.console.error("Kind 10002リクエスト作成エラー:", error);
                safeResolve({ success: false, error: 'request_error' });
            }
        });
    }

    async fetchKind3(
        pubkeyHex: string,
        relays: string[],
        timeoutMs: number = 3000
    ): Promise<RelayFetchResult> {
        this.console.log(`Kind 3取得試行: ${pubkeyHex}`);

        return new Promise((resolve) => {
            const rxReq = createRxForwardReq();
            let found = false;
            let timeoutId: any = null;
            let resolved = false;
            let subscription: any = undefined;

            const cleanup = () => {
                if (timeoutId != null) {
                    this.clearTimeoutFn(timeoutId);
                    timeoutId = null;
                }
                if (subscription && typeof subscription.unsubscribe === "function") {
                    subscription.unsubscribe();
                    subscription = undefined;
                }
            };

            const safeResolve = (result: RelayFetchResult) => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    resolve(result);
                }
            };

            try {
                subscription = this.rxNostr.use(rxReq, { on: { relays } }).subscribe({
                    next: (packet: any) => {
                        if (resolved) return;

                        if (packet.event?.kind === 3 && packet.event.pubkey === pubkeyHex) {
                            const relayObj = RelayConfigParser.parseKind3Content(packet.event.content);
                            if (relayObj) {
                                found = true;
                                this.console.log("Kind 3からリレーを取得:", relayObj);
                                safeResolve({
                                    success: true,
                                    relayConfig: relayObj,
                                    source: 'kind3'
                                });
                            }
                        }
                    },
                    error: (error: any) => {
                        if (resolved) return;
                        this.console.error("Kind 3取得エラー:", error);
                        safeResolve({ success: false, error: 'network_error' });
                    }
                });

                // リクエスト送信
                rxReq.emit({ authors: [pubkeyHex], kinds: [3] });

                // タイムアウト設定
                timeoutId = this.setTimeoutFn(() => {
                    if (resolved) return;
                    if (!found) {
                        this.console.log("Kind 3: タイムアウト");
                    }
                    safeResolve({ success: found, error: found ? undefined : 'timeout' });
                }, timeoutMs);

            } catch (error) {
                this.console.error("Kind 3リクエスト作成エラー:", error);
                safeResolve({ success: false, error: 'request_error' });
            }
        });
    }
}

// --- メインのRelayManager（依存性を組み合わせ） ---
export class RelayManager {
    private storage: RelayStorage;
    private networkFetcher: RelayNetworkFetcher;

    constructor(
        private rxNostr: RxNostr,
        deps: RelayManagerDeps = {}
    ) {
        // デフォルト依存性の設定
        const localStorage = deps.localStorage || (typeof window !== 'undefined' ? window.localStorage : {} as Storage);
        const console = deps.console || (typeof window !== 'undefined' ? window.console : {} as Console);
        const setTimeoutFn = deps.setTimeoutFn || ((fn, ms) => setTimeout(fn, ms));
        const clearTimeoutFn = deps.clearTimeoutFn || ((id) => clearTimeout(id));
        const relayListUpdatedStore = deps.relayListUpdatedStore ||
            (typeof window !== 'undefined' ? { value: 0, set: (v: number) => { } } : undefined);

        // 依存関係の構築
        this.storage = new RelayStorage(localStorage, console, relayListUpdatedStore);
        this.networkFetcher = new RelayNetworkFetcher(rxNostr, console, setTimeoutFn, clearTimeoutFn);
    }

    // 外部APIは変更なし（後方互換性のため）
    saveToLocalStorage(pubkeyHex: string, relays: RelayConfig): void {
        this.storage.save(pubkeyHex, relays);
    }

    getFromLocalStorage(pubkeyHex: string): RelayConfig | null {
        return this.storage.get(pubkeyHex);
    }

    setBootstrapRelays(): void {
        try {
            this.rxNostr.use(createRxForwardReq(), {
                on: {
                    relays: BOOTSTRAP_RELAYS,
                },
            }).subscribe();
        } catch (error) {
            console.error("Bootstrap relays設定エラー:", error);
        }
    }

    useRelaysFromLocalStorageIfExists(pubkeyHex: string): boolean {
        const savedRelays = this.storage.get(pubkeyHex);
        if (savedRelays) {
            try {
                this.rxNostr.setDefaultRelays(savedRelays);
                console.log("ローカルストレージのリレーリストを使用:", savedRelays);
                return true;
            } catch (error) {
                console.error("ローカルストレージのリレー設定エラー:", error);
                this.storage.clear(pubkeyHex); // 破損したデータを削除
                return false;
            }
        }
        return false;
    }

    async fetchUserRelays(
        pubkeyHex: string,
        opts: RelayFetchOptions = {}
    ): Promise<boolean> {
        const timeoutMs = opts.timeoutMs || 3000;

        console.log(`リレー取得開始: ${pubkeyHex}`);

        // forceRemoteがfalseまたは未指定ならローカルストレージ利用
        if (!opts.forceRemote && this.useRelaysFromLocalStorageIfExists(pubkeyHex)) {
            console.log("ローカルストレージからリレーを復元しました");
            return true;
        }

        console.log("リモートからリレー情報を取得中...");

        // Kind 10002を試行
        const kind10002Result = await this.networkFetcher.fetchKind10002(
            pubkeyHex,
            BOOTSTRAP_RELAYS,
            timeoutMs
        );

        if (kind10002Result.success && kind10002Result.relayConfig) {
            this.rxNostr.setDefaultRelays(kind10002Result.relayConfig);
            this.storage.save(pubkeyHex, kind10002Result.relayConfig);
            console.log("Kind 10002からリレー取得成功");
            return true;
        }

        // Kind 3を試行
        const kind3Result = await this.networkFetcher.fetchKind3(
            pubkeyHex,
            BOOTSTRAP_RELAYS,
            timeoutMs
        );

        if (kind3Result.success && kind3Result.relayConfig) {
            this.rxNostr.setDefaultRelays(kind3Result.relayConfig);
            this.storage.save(pubkeyHex, kind3Result.relayConfig);
            console.log("Kind 3からリレー取得成功");
            return true;
        }

        // フォールバックリレー使用
        console.log("リモート取得失敗、フォールバックリレーを使用");
        this.rxNostr.setDefaultRelays(FALLBACK_RELAYS);
        console.log("フォールバックリレーを設定:", FALLBACK_RELAYS);
        this.storage.save(pubkeyHex, FALLBACK_RELAYS);
        return false;
    }

    // テスト用の内部コンポーネントへのアクセス
    getStorage(): RelayStorage {
        return this.storage;
    }

    getNetworkFetcher(): RelayNetworkFetcher {
        return this.networkFetcher;
    }
}
