// tags専用のSvelteランストア
export const hashtagDataStore = $state<{ content: string; hashtags: string[]; tags: [string, string][] }>({
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

let imageImetaMap = $state<ImageImetaMap>({});
let imageSizeMap = $state<ImageSizeMap>({});

export const imageImetaMapStore = {
    get value() { return imageImetaMap; },
    set: (value: ImageImetaMap) => { imageImetaMap = value; },
    update: (updater: (value: ImageImetaMap) => ImageImetaMap) => { imageImetaMap = updater(imageImetaMap); },
    subscribe: (callback: (value: ImageImetaMap) => void) => {
        $effect(() => {
            callback(imageImetaMap);
        });
    }
};

export const imageSizeMapStore = {
    get value() { return imageSizeMap; },
    set: (value: ImageSizeMap) => { imageSizeMap = value; },
    update: (updater: (value: ImageSizeMap) => ImageSizeMap) => { imageSizeMap = updater(imageSizeMap); },
    subscribe: (callback: (value: ImageSizeMap) => void) => {
        $effect(() => {
            callback(imageSizeMap);
        });
    }
};
