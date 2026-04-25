export const BOOTSTRAP_RELAYS = [
    "wss://purplepag.es/",
    "wss://directory.yabu.me/",
    "wss://indexer.coracle.social/",
    "wss://user.kindpag.es/",
];

export const FALLBACK_RELAYS = [
    "wss://nos.lol/",
    "wss://relay.damus.io/",
    "wss://relay-jp.nostr.wirednet.jp/",
    "wss://yabu.me/",
    "wss://r.kojira.io/",
    "wss://nrelay-jp.c-stellar.net/",
];

// --- fileUploadManager用定数 ---
export const DEFAULT_API_URL = "https://nostr.build/api/v2/upload/files";
export const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
export const COMPRESSION_OPTIONS_MAP = {
    none: {
        skip: true
    },
    low: {
        maxWidthOrHeight: 2048,
        fileType: "image/webp" as const,
        initialQuality: 0.95,
        useWebWorker: true,
    },
    medium: {
        maxWidthOrHeight: 1024,
        fileType: "image/webp" as const,
        initialQuality: 0.80,
        useWebWorker: true,
    },
    high: {
        maxWidthOrHeight: 800,
        fileType: "image/webp" as const,
        initialQuality: 0.50,
        useWebWorker: true,
    }
} as const;

export const VIDEO_COMPRESSION_OPTIONS_MAP = {
    none: { skip: true },
    low: {
        crf: 20,
        preset: 'superfast',
        maxSize: 1280,
        audioBitrate: '128k',
        // Mediabunny用の品質ファクター（Quality(factor)に変換して使用）
        mediabunnyVideoQualityFactor: 2,   // QUALITY_HIGH
        mediabunnyAudioQualityFactor: 2,   // QUALITY_HIGH
    },
    medium: {
        crf: 26,
        preset: 'superfast',
        maxSize: 640,
        audioBitrate: '64k',
        audioSampleRate: 44100,
        // Mediabunny用の品質ファクター（Quality(factor)に変換して使用）
        mediabunnyVideoQualityFactor: 1,   // QUALITY_MEDIUM
        mediabunnyAudioQualityFactor: 1,   // QUALITY_MEDIUM
    },
    high: {
        crf: 28,
        preset: 'medium',
        maxSize: 320,
        audioBitrate: '32k',
        audioSampleRate: 16000,
        audioChannels: 1,
        // Mediabunny用の品質ファクター（Quality(factor)に変換して使用）
        mediabunnyVideoQualityFactor: 0.3, // QUALITY_VERY_LOW
        mediabunnyAudioQualityFactor: 0.3, // QUALITY_VERY_LOW
    },
} as const;

export const HASHTAG_REGEX = /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g;

export const ALLOWED_PROTOCOLS = ['http:', 'https:'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
export const ALLOWED_VIDEO_MIMETYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mpeg'];

// --- SvelteImageNode用定数 ---
export const LONG_PRESS_DELAY = 400; // ms
export const MOVE_CANCEL_THRESHOLD = 10; // px

// --- スクロール関連定数 ---
export const SCROLL_THRESHOLD = 100; // px, ドラッグ時の自動スクロール境界範囲
export const SCROLL_BASE_SPEED = 1;  // px/frame, 自動スクロールの基本速度
export const SCROLL_MAX_SPEED = 10;   // px/frame, 自動スクロールの最大速度

// --- SettingsDialog用定数 ---
export const DEFAULT_COMPRESSION_LEVEL = "medium";
export const DEFAULT_CLIENT_TAG_ENABLED = true;
export const DEFAULT_SHOW_MASCOT = true;
export const DEFAULT_SHOW_BALLOON_MESSAGE = true;
export const DEFAULT_QUOTE_NOTIFICATION_ENABLED = false;

export const STORAGE_KEYS = {
    LOCALE: "locale",
    UPLOAD_ENDPOINT: "uploadEndpoint",
    CLIENT_TAG_ENABLED: "clientTagEnabled",
    QUOTE_NOTIFICATION_ENABLED: "quoteNotificationEnabled",
    IMAGE_COMPRESSION_LEVEL: "imageCompressionLevel",
    VIDEO_COMPRESSION_LEVEL: "videoCompressionLevel",
    SHOW_MASCOT: "showMascot",
    SHOW_BALLOON_MESSAGE: "showBalloonMessage",
    SETTINGS_PREFERENCE_METADATA: "settingsPreferenceMetadata",
    FIRST_VISIT: "firstVisit",
    SHARED_MEDIA_PROCESSED: "sharedMediaProcessed",
    NOSTR_RELAYS: "nostr-relays-",
    DRAFTS: "nostr-drafts",
    HASHTAG_HISTORY: "hashtagHistory",
    MEDIA_FREE_PLACEMENT: "mediaFreePlacement",
    THEME_MODE: "themeMode",
    DARK_MODE: "darkMode",
    NOSTR_ACCOUNTS: "nostr-accounts",
    NOSTR_ACTIVE_ACCOUNT: "nostr-active-account",
    NOSTR_SECRET_KEY_PREFIX: "nostr-secret-key-",
    NOSTR_NIP46_SESSION_PREFIX: "nostr-nip46-session-",
    NOSTR_PARENT_CLIENT_SESSION_PREFIX: "nostr-parent-client-session-",
    NOSTR_NIP07_PUBKEY: "nostr-nip07-pubkey",
    NOSTR_SECRET_KEY_LEGACY: "nostr-secret-key",
    NOSTR_NIP46_SESSION_LEGACY: "nostr-nip46-session",
    NOSTR_PROFILE: "nostr-profile-",
} as const;

export const DEFAULT_MEDIA_FREE_PLACEMENT = false;
export const VALID_COMPRESSION_LEVELS = ["none", "low", "medium", "high"] as const;

// --- 下書き機能用定数 ---
export const MAX_DRAFTS = 20; // 下書きの最大保存数
export const DRAFT_PREVIEW_LENGTH = 50; // 下書きプレビューの最大文字数

export const SW_UPDATE_TIMEOUT = 1000;
export const RELAY_LIST_REFRESH_DELAY = 0;

export const uploadEndpoints = [
    { label: "share.yabu.me", url: "https://share.yabu.me/api/v2/media" },
    { label: "nostpic.com", url: "https://nostpic.com/api/v2/media" },
    { label: "nostrcheck.me", url: "https://nostrcheck.me/api/v2/media" },
    { label: "files.sovbit.host", url: "https://files.sovbit.host/api/v2/media" },
    { label: "nostr.build", url: "https://nostr.build/api/v2/nip96/upload" },
];

// デフォルトエンドポイント取得関数
export function getDefaultEndpoint(locale: string | null | undefined): string {
    return locale === "ja"
        ? "https://share.yabu.me/api/v2/media"
        : "https://nostrcheck.me/api/v2/media";
}

// 圧縮設定候補を返す関数(i18n対応)
export function getCompressionLevels($_: (key: string) => string | undefined) {
    return [
        { label: $_("settingsDialog.quality_lossless"), value: "none" },
        { label: $_("settingsDialog.quality_high"), value: "low" },
        { label: $_("settingsDialog.quality_medium"), value: "medium" },
        { label: $_("settingsDialog.quality_low"), value: "high" },
    ];
}

export const SELECTORS = {
    EDITOR: ".tiptap-editor",
} as const;

// --- ContentTracking Extension用定数 ---
export const CONTENT_TRACKING_CONFIG = {
    // URL検出用正規表現（画像URL検出およびリンク判定用）
    URL_REGEX: /https?:\/\/[^\s\u3000]+/gi,

    // デフォルト設定
    DEBOUNCE_DELAY: 300, // ms
    ENABLE_HASHTAGS: true,
    ENABLE_AUTO_LINK: true, // ContentTrackingで動的なURL判定・判定解除を処理
    ENABLE_IMAGE_CONVERSION: true,

    // CSS クラス名
    HASHTAG_CLASS: 'hashtag',

    // プラグインキー名
    PLUGIN_KEYS: {
        HASHTAG_DECORATION: 'hashtag-decoration',
        LINK_AND_IMAGE_CONVERSION: 'link-and-image-conversion',
        CONTENT_UPDATE_TRACKER: 'content-update-tracker'
    }
} as const;

// --- バルーンメッセージ用キー配列 ---
// 投稿成功時(successカテゴリ)
export const BALLOON_MESSAGE_SUCCESS_KEYS: readonly string[] = [
    "balloonMessage.success.post_success",
    "balloonMessage.success.sent",
    "balloonMessage.success.to_everyone",
];

// 投稿エラー時(errorカテゴリ)
export const BALLOON_MESSAGE_ERROR_KEY = "balloonMessage.error.post_error";
export const BALLOON_MESSAGE_REJECTED_KEY = "balloonMessage.error.post_rejected";
export const BALLOON_MESSAGE_TIMEOUT_KEY = "balloonMessage.error.post_timeout";
export const BALLOON_MESSAGE_NETWORK_ERROR_KEY = "balloonMessage.error.post_network_error";

// アプリの使い方Tips(tipsカテゴリ)
export const BALLOON_MESSAGE_TIPS_KEYS: readonly string[] = [
    "balloonMessage.tips.long_press_to_post",
];

// --- fileUploadManager.ts から移動した定数 ---
export const BLURHASH_CONFIG = {
    COMPONENT_X: 4,
    COMPONENT_Y: 4,
    CANVAS_SIZE: 100
} as const;

export const MIME_TYPE_SUPPORT_CACHE_TIMEOUT = 5 * 60 * 1000; // 5分

export const UPLOAD_POLLING_CONFIG = {
    MAX_WAIT_TIME: 15000,     // 15秒
    RETRY_INTERVAL: 1000,     // 1秒
    TIMEOUT_MESSAGE: "Upload processing timeout"
} as const;

// --- appUtils.ts から移動した定数 ---
// Nostr Key パターン
export const NSEC_PATTERN = /nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{10,}/;
export const NSEC_FULL_PATTERN = /^nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/;

// 共有ハンドラー設定
export const SHARE_HANDLER_CONFIG = {
    INDEXEDDB_NAME: "share-handler-db",
    INDEXEDDB_VERSION: 1,
    STORE_NAME: "flags",
    FLAG_KEY: "shared",
    REQUEST_TIMEOUT: 3000,
    SW_CONTROLLER_WAIT_TIMEOUT: 100
} as const;
