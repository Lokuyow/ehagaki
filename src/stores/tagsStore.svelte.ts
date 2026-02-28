// tags専用のSvelteランストア

// --- ハッシュタグデータストア ---
interface HashtagData {
    content: string;
    hashtags: string[];
    tags: string[][];
}

// ストアの宣言（$stateを直接使用）
let svelteHashtagDataStore = $state<HashtagData>({
    content: '',
    hashtags: [],
    tags: []
});

export const hashtagDataStore = svelteHashtagDataStore;

export function getHashtagDataSnapshot(): HashtagData {
    return $state.snapshot(svelteHashtagDataStore);
}

// --- imeta情報の一時保存ストア ---
export interface ImageImetaMap {
    [url: string]: {
        m: string; // MIME type (必須)
        blurhash?: string;
        dim?: string;
        alt?: string;
        ox?: string; // オリジナルファイルのSHA-256ハッシュを追加
        [key: string]: any;
    };
}

// 画像サイズ情報マップストア
export interface ImageSizeMap {
    [url: string]: {
        width: number;
        height: number;
        displayWidth: number;
        displayHeight: number;
    };
}

// 画像ストアの実装（$stateを直接使用）
let svelteImageImetaMap = $state<ImageImetaMap>({});
let svelteImageSizeMap = $state<ImageSizeMap>({});

export const imageImetaMapStore = {
    get value() { return svelteImageImetaMap; },
    set: (value: ImageImetaMap) => { Object.assign(svelteImageImetaMap, value); },
    update: (updater: (value: ImageImetaMap) => ImageImetaMap) => {
        const newValue = updater(svelteImageImetaMap);
        Object.assign(svelteImageImetaMap, newValue);
    }
};

export const imageSizeMapStore = {
    get value() { return svelteImageSizeMap; },
    set: (value: ImageSizeMap) => { Object.assign(svelteImageSizeMap, value); },
    update: (updater: (value: ImageSizeMap) => ImageSizeMap) => {
        const newValue = updater(svelteImageSizeMap);
        Object.assign(svelteImageSizeMap, newValue);
    }
};

// --- ハッシュタグピン留めストア ---
let svelteHashtagPinEnabled = $state<boolean>(false);

export const hashtagPinStore = {
    get value() { return svelteHashtagPinEnabled; },
    set: (value: boolean) => { svelteHashtagPinEnabled = value; },
    toggle: () => { svelteHashtagPinEnabled = !svelteHashtagPinEnabled; },
    reset: () => { svelteHashtagPinEnabled = false; }
};

// --- Content Warning (NIP-36) ストア ---
let svelteContentWarningEnabled = $state<boolean>(false);
let svelteContentWarningReason = $state<string>('');

export const contentWarningStore = {
    get value() { return svelteContentWarningEnabled; },
    set: (value: boolean) => { svelteContentWarningEnabled = value; },
    toggle: () => { svelteContentWarningEnabled = !svelteContentWarningEnabled; },
    reset: () => { svelteContentWarningEnabled = false; }
};

export const contentWarningReasonStore = {
    get value() { return svelteContentWarningReason; },
    set: (value: string) => { svelteContentWarningReason = value; },
    reset: () => { svelteContentWarningReason = ''; }
};
