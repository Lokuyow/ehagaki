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

export const STORAGE_KEYS = {
    LOCALE: "locale",
    UPLOAD_ENDPOINT: "uploadEndpoint",
    CLIENT_TAG_ENABLED: "clientTagEnabled",
    IMAGE_COMPRESSION_LEVEL: "imageCompressionLevel",
    VIDEO_COMPRESSION_LEVEL: "videoCompressionLevel",
    NOSTR_RELAYS: "nostr-relays-",
} as const;

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
        { label: $_("settingsDialog.compression_none") || "無圧縮", value: "none" },
        { label: $_("settingsDialog.compression_low") || "低圧縮", value: "low" },
        { label: $_("settingsDialog.compression_medium") || "中圧縮", value: "medium" },
        { label: $_("settingsDialog.compression_high") || "高圧縮", value: "high" },
    ];
}

// 動画圧縮設定候補を返す関数（i18n対応）
export function getVideoCompressionLevels($_: (key: string) => string | undefined) {
    return [
        { label: $_("settingsDialog.compression_none") || "無圧縮", value: "none" },
        { label: $_("settingsDialog.compression_low") || "低圧縮", value: "low" },
        { label: $_("settingsDialog.compression_medium") || "中圧縮", value: "medium" },
        { label: $_("settingsDialog.compression_high") || "高圧縮", value: "high" },
    ];
}

export const ZOOM_CONFIG = {
    MIN_SCALE: 1,
    MAX_SCALE: 100,
    DEFAULT_SCALE: 1,
    DOUBLE_CLICK_SCALE: 2.5,
    RESET_THRESHOLD: 1.3, // この値以上の拡大時はダブルタップで1倍に戻す
    ZOOM_DELTA: { IN: 1.1, OUT: 0.9 },
    THRESHOLD: 0.1,
    PINCH_MIN_DISTANCE: 10, // ピンチ操作の最小距離
    PINCH_SCALE_SENSITIVITY: 1.0, // ピンチスケール感度
} as const;

// 慣性アニメーション用の定数
export const MOMENTUM_CONFIG = {
    FRICTION: 0.92, // 減衰係数
    MIN_VELOCITY: 0.1, // 最小速度閾値
} as const;

export const TIMING = {
    EDITOR_FOCUS_DELAY: 100,
    TRANSITION_DURATION: "0.3s",
    TAP_TIMEOUT: 300, // タップ検出のタイムアウト
    ZOOM_TOGGLE_DELAY: 100, // ズーム切り替えの遅延
    TRANSITION_DELAY: 50, // トランジション再有効化の遅延
    PINCH_THROTTLE: 16, // ピンチ更新のスロットル間隔（約60FPS）
} as const;

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
// ページ表示時などのinfoカテゴリ
export const BALLOON_MESSAGE_INFO_KEYS: readonly string[] = [
    "balloonMessage.info.hello",
    "balloonMessage.info.hello2",
    "balloonMessage.info.welcome",
    "balloonMessage.info.waited",
    "balloonMessage.info.relax",
    "balloonMessage.info.good_weather",
    "balloonMessage.info.thwomp",
    "balloonMessage.info.sleep_on_floor",
    "balloonMessage.info.home_here",
    "balloonMessage.info.donai",
    "balloonMessage.info.kita_na",
    "balloonMessage.info.no_licking",
    "balloonMessage.info.not_thwomp",
    "balloonMessage.info.kitte_origin",
    "balloonMessage.info.normal_stamp",
    "balloonMessage.info.backside_curious",
    "balloonMessage.info.corner_weapon",
    "balloonMessage.info.square_peace",
    "balloonMessage.info.how_much_stamp",
    "balloonMessage.info.cancellation_done",
    "balloonMessage.info.want_to_roll",
    "balloonMessage.info.want_candy",
    "balloonMessage.info.tetris_gone",
    "balloonMessage.info.comfy_here",
    "balloonMessage.info.what_did_you_eat",
    "balloonMessage.info.go_to_bed_early",
    "balloonMessage.info.did_you_brush_teeth",
    "balloonMessage.info.kit-ten_ketten",
    "balloonMessage.info.such_is_life",
];

// 投稿成功時(successカテゴリ)
export const BALLOON_MESSAGE_SUCCESS_KEYS: readonly string[] = [
    "balloonMessage.success.post_success",
    "balloonMessage.success.sent",
    "balloonMessage.success.to_everyone",
];

// 投稿エラー時(errorカテゴリ)
export const BALLOON_MESSAGE_ERROR_KEY = "balloonMessage.error.post_error";

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