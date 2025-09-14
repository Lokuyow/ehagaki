// tags専用のSvelteランストア

// --- ハッシュタグデータストア ---
interface HashtagData {
    content: string;
    hashtags: string[];
    tags: [string, string][];
}

// Svelte 5のrunesを使用（常に$stateを使用）
const svelteHashtagDataStore = $state<HashtagData>({
    content: '',
    hashtags: [],
    tags: []
});

export const hashtagDataStore = svelteHashtagDataStore;

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

// Svelte 5のrunesを使用
const svelteImageImetaMap = $state<ImageImetaMap>({});
const svelteImageSizeMap = $state<ImageSizeMap>({});

// テスト環境判定（必要に応じて修正してください）
const isTestEnv = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test';

export const imageImetaMapStore = {
    get value() { return svelteImageImetaMap; },
    set: (value: ImageImetaMap) => { Object.assign(svelteImageImetaMap, value); },
    update: (updater: (value: ImageImetaMap) => ImageImetaMap) => {
        const newValue = updater(svelteImageImetaMap);
        Object.assign(svelteImageImetaMap, newValue);
    },
    subscribe: isTestEnv
        ? (callback: (value: ImageImetaMap) => void) => {
            // テスト環境では即座にコールバックを実行
            callback(svelteImageImetaMap);
            return () => { }; // cleanup function
        }
        : (callback: (value: ImageImetaMap) => void) => {
            $effect(() => {
                callback(svelteImageImetaMap);
            });
            return () => { }; // cleanup function
        }
};

export const imageSizeMapStore = {
    get value() { return svelteImageSizeMap; },
    set: (value: ImageSizeMap) => { Object.assign(svelteImageSizeMap, value); },
    update: (updater: (value: ImageSizeMap) => ImageSizeMap) => {
        const newValue = updater(svelteImageSizeMap);
        Object.assign(svelteImageSizeMap, newValue);
    },
    subscribe: isTestEnv
        ? (callback: (value: ImageSizeMap) => void) => {
            // テスト環境では即座にコールバックを実行
            callback(svelteImageSizeMap);
            return () => { }; // cleanup function
        }
        : (callback: (value: ImageSizeMap) => void) => {
            $effect(() => {
                callback(svelteImageSizeMap);
            });
            return () => { }; // cleanup function
        }
};
