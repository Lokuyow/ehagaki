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

export class RelayManager {
    private rxNostr: any;

    constructor(rxNostr: any) {
        this.rxNostr = rxNostr;
    }

    saveToLocalStorage(pubkeyHex: string, relays: any): void {
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

    getFromLocalStorage(pubkeyHex: string): any {
        try {
            const relays = localStorage.getItem(`nostr-relays-${pubkeyHex}`);
            return relays ? JSON.parse(relays) : null;
        } catch (e) {
            console.error("リレーリストの取得に失敗:", e);
            return null;
        }
    }

    setBootstrapRelays(): void {
        // setDefaultRelaysの代わりにTemporary RelaysでREQ購読
        this.rxNostr.use(
            createRxForwardReq(),
            {
                on: {
                    relays: BOOTSTRAP_RELAYS,
                },
            }
        ).subscribe(); // 購読開始（必要に応じてunsubscribe管理）
    }

    async fetchUserRelays(pubkeyHex: string): Promise<boolean> {
        const foundKind10002 = await this.tryFetchKind10002(pubkeyHex, BOOTSTRAP_RELAYS);
        if (foundKind10002) return true;
        const foundKind3 = await this.tryFetchKind3(pubkeyHex, BOOTSTRAP_RELAYS);
        if (foundKind3) return true;

        // どちらも取得できなかった場合、フォールバックリレーを設定
        this.rxNostr.setDefaultRelays(FALLBACK_RELAYS);
        console.log("フォールバックリレーを設定:", FALLBACK_RELAYS);
        this.saveToLocalStorage(pubkeyHex, FALLBACK_RELAYS);
        return false;
    }

    async tryFetchKind10002(pubkeyHex: string, relays: string[]): Promise<boolean> {
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
                    found = true;
                    try {
                        const relayConfigs: {
                            [url: string]: { read: boolean; write: boolean };
                        } = {};

                        packet.event.tags
                            .filter((tag: any) => tag.length >= 2 && tag[0] === "r")
                            .forEach((tag: any) => {
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

                        if (Object.keys(relayConfigs).length > 0) {
                            this.rxNostr.setDefaultRelays(relayConfigs);
                            console.log("Kind 10002からリレーを設定:", relayConfigs);
                            this.saveToLocalStorage(pubkeyHex, relayConfigs);
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

    async tryFetchKind3(pubkeyHex: string, relays: string[]): Promise<boolean> {
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
                            this.saveToLocalStorage(pubkeyHex, relayObj);
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
