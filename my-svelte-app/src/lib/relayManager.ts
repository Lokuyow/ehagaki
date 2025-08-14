import { createRxForwardReq } from "rx-nostr";

export const BOOTSTRAP_RELAYS = [
    "wss://purplepag.es/",
    "wss://directory.yabu.me/",
    "wss://indexer.coracle.social/",
    "wss://user.kindpag.es/",
];

const FALLBACK_RELAYS = [
    "wss://relay.nostr.band/",
    "wss://nos.lol/",
    "wss://relay.damus.io/",
    "wss://relay-jp.nostr.wirednet.jp/",
    "wss://yabu.me/",
    "wss://r.kojira.io/",
    "wss://nrelay-jp.c-stellar.net/",
];

type RelayConfig = { [url: string]: { read: boolean; write: boolean } } | string[];

function saveToLocalStorage(pubkeyHex: string, relays: RelayConfig): void {
    try {
        localStorage.setItem(
            `nostr-relays-${pubkeyHex}`,
            JSON.stringify(relays),
        );
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

    async fetchUserRelays(pubkeyHex: string): Promise<boolean> {
        // 共通化関数でローカルストレージのリレーリストを利用
        if (this.useRelaysFromLocalStorageIfExists(pubkeyHex)) {
            return true;
        }

        if (await this.tryFetchKind10002(pubkeyHex, BOOTSTRAP_RELAYS)) return true;
        if (await this.tryFetchKind3(pubkeyHex, BOOTSTRAP_RELAYS)) return true;

        this.rxNostr.setDefaultRelays(FALLBACK_RELAYS);
        console.log("フォールバックリレーを設定:", FALLBACK_RELAYS);
        saveToLocalStorage(pubkeyHex, FALLBACK_RELAYS);
        return false;
    }

    private async tryFetchKind10002(pubkeyHex: string, relays: string[]): Promise<boolean> {
        return new Promise((resolve) => {
            const rxReq = createRxForwardReq();
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
                resolve(false);
            }, 3000);
        });
    }

    private async tryFetchKind3(pubkeyHex: string, relays: string[]): Promise<boolean> {
        return new Promise((resolve) => {
            const rxReq = createRxForwardReq();

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
                resolve(false);
            }, 3000);
        });
    }
}
