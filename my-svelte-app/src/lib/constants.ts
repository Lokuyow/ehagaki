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
export const COMPRESSION_OPTIONS_MAP = {
    none: {
        // 無圧縮: 変換せずそのまま
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
        initialQuality: 0.40,
        useWebWorker: true,
    }
};

export const HASHTAG_REGEX = /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g;

export const ALLOWED_PROTOCOLS = ['http:', 'https:'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

// --- SvelteImageNode用定数 ---
export const LONG_PRESS_DELAY = 400; // ms
export const MOVE_CANCEL_THRESHOLD = 10; // px

// --- スクロール関連定数 ---
export const SCROLL_THRESHOLD = 100; // px, ドラッグ時の自動スクロール境界範囲
export const SCROLL_BASE_SPEED = 1;  // px/frame, 自動スクロールの基本速度
export const SCROLL_MAX_SPEED = 10;   // px/frame, 自動スクロールの最大速度

// --- SettingsDialog用定数 ---
export const uploadEndpoints = [
    { label: "yabu.me", url: "https://yabu.me/api/v2/media" },
    { label: "nostpic.com", url: "https://nostpic.com/api/v2/media" },
    { label: "nostrcheck.me", url: "https://nostrcheck.me/api/v2/media" },
    {
        label: "nostr.build",
        url: "https://nostr.build/api/v2/nip96/upload",
    },
];

// デフォルトエンドポイント取得関数
export function getDefaultEndpoint(locale: string | null | undefined): string {
    return locale === "ja"
        ? "https://yabu.me/api/v2/media"
        : "https://nostrcheck.me/api/v2/media";
}

// 圧縮設定候補を返す関数（i18n対応）
export function getCompressionLevels($_: (key: string) => string | undefined) {
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