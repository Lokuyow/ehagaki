export const BOOTSTRAP_RELAYS = [
    "wss://purplepag.es/",
    "wss://directory.yabu.me/",
    "wss://indexer.coracle.social/",
    "wss://user.kindpag.es/",
];

export const FALLBACK_RELAYS = [
    "wss://nos.lol/",
    "wss://relay.damus.io/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://yabu.me/",
    "wss://x.kojira.io/",
];

// サービス終了を確認した relay。追加時は正規化済みのルート URL をここで管理する。
export const DECOMMISSIONED_RELAYS = [
    "wss://relay.nostr.band/",
    "wss://nrelay.c-stellar.net/",
    "wss://nrelay-jp.c-stellar.net/",
] as const;
