import { createRxForwardReq } from "rx-nostr";
import { BOOTSTRAP_RELAYS, FALLBACK_RELAYS } from "./constants";
import { relayListUpdatedStore } from "./appStores.svelte";

type RelayConfig = { [url: string]: { read: boolean; write: boolean } } | string[];

function saveToLocalStorage(pubkeyHex: string, relays: RelayConfig | null): void {
    try {
        if (relays === null) {
            localStorage.removeItem(`nostr-relays-${pubkeyHex}`);
            return;
        }
        localStorage.setItem(
            `nostr-relays-${pubkeyHex}`,
            JSON.stringify(relays),
        );
        // リレーリスト更新を通知
        relayListUpdatedStore.set(relayListUpdatedStore.value + 1);
        console.log("リレーリストをローカルストレージに保存:", pubkeyHex);
    } catch (e) {
        console.error("リレーリストの保存に失敗:", e);
    }
}

function getFromLocalStorage(pubkeyHex: string): RelayConfig | null {
    try {
        const relays = localStorage.getItem(`nostr-relays-${pubkeyHex}`);
        return relays ? JSON.parse(relays) : null;
    } catch (e) {
        console.error("リレーリストの取得に失敗:", e);
        return null;
    }
}

// 共通化: ローカルストレージのリレーリストがあればセットしてtrueを返す
function useRelaysFromLocalStorageIfExists(rxNostr: any, pubkeyHex: string): boolean {
    const savedRelays = getFromLocalStorage(pubkeyHex);
    if (savedRelays) {
        rxNostr.setDefaultRelays(savedRelays);
        console.log("ローカルストレージのリレーリストを使用:", savedRelays);
        return true;
    }
    return false;
}

function parseKind10002Tags(tags: any[]): RelayConfig {
    const relayConfigs: { [url: string]: { read: boolean; write: boolean } } = {};
    tags
        .filter((tag) => tag.length >= 2 && tag[0] === "r")
        .forEach((tag) => {
            const url = tag[1];
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

export class RelayManager {
    private rxNostr: any;

    constructor(rxNostr: any) {
        this.rxNostr = rxNostr;
    }

    saveToLocalStorage(pubkeyHex: string, relays: RelayConfig): void {
        saveToLocalStorage(pubkeyHex, relays);
    }

    getFromLocalStorage(pubkeyHex: string): RelayConfig | null {
        return getFromLocalStorage(pubkeyHex);
    }

    setBootstrapRelays(): void {
        this.rxNostr.use(
            createRxForwardReq(),
            {
                on: {
                    relays: BOOTSTRAP_RELAYS,
                },
            }
        ).subscribe();
    }

    // 共通化関数を利用
    useRelaysFromLocalStorageIfExists(pubkeyHex: string): boolean {
        return useRelaysFromLocalStorageIfExists(this.rxNostr, pubkeyHex);
    }

    async fetchUserRelays(pubkeyHex: string, opts?: { forceRemote?: boolean }): Promise<boolean> {
        console.log(`リレー取得開始: ${pubkeyHex}`);

        // forceRemoteがfalseまたは未指定ならローカルストレージ利用
        if (!opts?.forceRemote && this.useRelaysFromLocalStorageIfExists(pubkeyHex)) {
            console.log("ローカルストレージからリレーを復元しました");
            return true;
        }

        console.log("リモートからリレー情報を取得中...");

        if (await this.tryFetchKind10002(pubkeyHex, BOOTSTRAP_RELAYS)) {
            console.log("Kind 10002からリレー取得成功");
            return true;
        }
        if (await this.tryFetchKind3(pubkeyHex, BOOTSTRAP_RELAYS)) {
            console.log("Kind 3からリレー取得成功");
            return true;
        }

        console.log("リモート取得失敗、フォールバックリレーを使用");
        this.rxNostr.setDefaultRelays(FALLBACK_RELAYS);
        console.log("フォールバックリレーを設定:", FALLBACK_RELAYS);
        saveToLocalStorage(pubkeyHex, FALLBACK_RELAYS);
        return false;
    }

    private async tryFetchKind10002(pubkeyHex: string, relays: string[]): Promise<boolean> {
        console.log(`Kind 10002取得試行: ${pubkeyHex}`);
        return new Promise((resolve) => {
            const rxReq = createRxForwardReq();
            let found = false;

            const subscription = this.rxNostr.use(
                rxReq,
                { on: { relays } }
            ).subscribe((packet: any) => {
                if (
                    packet.event?.kind === 10002 &&
                    packet.event.pubkey === pubkeyHex
                ) {
                    try {
                        const relayConfigs = parseKind10002Tags(packet.event.tags);
                        if (Object.keys(relayConfigs).length > 0) {
                            found = true;
                            this.rxNostr.setDefaultRelays(relayConfigs);
                            console.log("Kind 10002からリレーを設定:", relayConfigs);
                            saveToLocalStorage(pubkeyHex, relayConfigs);
                            subscription.unsubscribe();
                            resolve(true);
                        }
                    } catch (e) {
                        console.error("Kind 10002のパースエラー:", e);
                    }
                }
            });

            rxReq.emit({ authors: [pubkeyHex], kinds: [10002] });

            setTimeout(() => {
                subscription.unsubscribe();
                if (!found) {
                    console.log("Kind 10002: タイムアウト");
                }
                resolve(found);
            }, 3000);
        });
    }

    private async tryFetchKind3(pubkeyHex: string, relays: string[]): Promise<boolean> {
        console.log(`Kind 3取得試行: ${pubkeyHex}`);
        return new Promise((resolve) => {
            const rxReq = createRxForwardReq();
            let found = false;

            const subscription = this.rxNostr.use(
                rxReq,
                { on: { relays } }
            ).subscribe((packet: any) => {
                if (packet.event?.kind === 3 && packet.event.pubkey === pubkeyHex) {
                    try {
                        const relayObj = JSON.parse(packet.event.content);
                        if (
                            relayObj &&
                            typeof relayObj === "object" &&
                            !Array.isArray(relayObj)
                        ) {
                            found = true;
                            this.rxNostr.setDefaultRelays(relayObj);
                            console.log("Kind 3からリレーを設定:", relayObj);
                            saveToLocalStorage(pubkeyHex, relayObj);
                            subscription.unsubscribe();
                            resolve(true);
                        }
                    } catch (e) {
                        console.error("Kind 3のパースエラー:", e);
                    }
                }
            });

            rxReq.emit({ authors: [pubkeyHex], kinds: [3] });

            setTimeout(() => {
                subscription.unsubscribe();
                if (!found) {
                    console.log("Kind 3: タイムアウト");
                }
                resolve(found);
            }, 3000);
        });
    }
}
