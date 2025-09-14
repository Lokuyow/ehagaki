// tags専用のSvelteランストア

// テスト環境かどうかを判定
const isTestEnv = (
    typeof globalThis !== 'undefined' &&
    (globalThis as any).process?.env?.NODE_ENV === 'test'
) || (typeof window !== 'undefined' && typeof (window as any).vitest !== 'undefined');

// Svelte環境では$stateを使用、テスト環境では通常のオブジェクトを使用
export const hashtagDataStore = isTestEnv
    ? {
        content: '',
        hashtags: [] as string[],
        tags: [] as [string, string][]
    }
    : $state<{ content: string; hashtags: string[]; tags: [string, string][] }>({
        content: '',
        hashtags: [],
        tags: []
    });

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

let imageImetaMap = isTestEnv ? {} : $state<ImageImetaMap>({});
let imageSizeMap = isTestEnv ? {} : $state<ImageSizeMap>({});

export const imageImetaMapStore = {
    get value() { return imageImetaMap; },
    set: (value: ImageImetaMap) => { imageImetaMap = value; },
    update: (updater: (value: ImageImetaMap) => ImageImetaMap) => { imageImetaMap = updater(imageImetaMap); },
    subscribe: isTestEnv
        ? (callback: (value: ImageImetaMap) => void) => {
            // テスト環境では即座にコールバックを実行
            callback(imageImetaMap);
            return () => { }; // cleanup function
        }
        : (callback: (value: ImageImetaMap) => void) => {
            $effect(() => {
                callback(imageImetaMap);
            });
        }
};

export const imageSizeMapStore = {
    get value() { return imageSizeMap; },
    set: (value: ImageSizeMap) => { imageSizeMap = value; },
    update: (updater: (value: ImageSizeMap) => ImageSizeMap) => { imageSizeMap = updater(imageSizeMap); },
    subscribe: isTestEnv
        ? (callback: (value: ImageSizeMap) => void) => {
            // テスト環境では即座にコールバックを実行
            callback(imageSizeMap);
            return () => { }; // cleanup function
        }
        : (callback: (value: ImageSizeMap) => void) => {
            $effect(() => {
                callback(imageSizeMap);
            });
        }
};
