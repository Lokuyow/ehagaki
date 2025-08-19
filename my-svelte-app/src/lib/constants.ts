export const BOOTSTRAP_RELAYS = [
    "wss://purplepag.es/",
    "wss://directory.yabu.me/",
    "wss://indexer.coracle.social/",
    "wss://user.kindpag.es/",
];

export const FALLBACK_RELAYS = [
    "wss://relay.nostr.band/",
    "wss://nos.lol/",
    "wss://relay.damus.io/",
    "wss://relay-jp.nostr.wirednet.jp/",
    "wss://yabu.me/",
    "wss://r.kojira.io/",
    "wss://nrelay-jp.c-stellar.net/",
];

// --- fileUploadManager用定数 ---
export const DEFAULT_API_URL = "https://nostrcheck.me/api/v2/media";
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const COMPRESSION_OPTIONS = {
    maxWidthOrHeight: 1024,
    fileType: "image/webp" as const,
    initialQuality: 0.80,
    useWebWorker: true,
};

export const HASHTAG_REGEX = /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g;

export const ALLOWED_PROTOCOLS = ['http:', 'https:'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];