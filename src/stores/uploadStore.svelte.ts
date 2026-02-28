import type { SizeDisplayInfo, CompressionService } from '../lib/types';
import type { VideoCompressionService } from '../lib/videoCompression/videoCompressionService';

// --- 画像サイズ情報表示管理 ---
let imageSizeInfo = $state<{ info: SizeDisplayInfo | null; visible: boolean }>({
    info: null,
    visible: false
});

export const imageSizeInfoStore = {
    get value() { return imageSizeInfo; },
    set: (value: { info: SizeDisplayInfo | null; visible: boolean }) => { imageSizeInfo = value; }
};

export function showImageSizeInfo(info: SizeDisplayInfo | null, duration: number = 3000): void {
    if (info === null) {
        hideImageSizeInfo();
        return;
    }
    imageSizeInfoStore.set({ info, visible: true });
}

export function hideImageSizeInfo(): void {
    imageSizeInfoStore.set({ info: null, visible: false });
}

// --- グローバルアップロード中止フラグ ---
let globalUploadAbortFlag = $state(false);

export const uploadAbortFlagStore = {
    get value() { return globalUploadAbortFlag; },
    set: (value: boolean) => { globalUploadAbortFlag = value; },
    reset: () => { globalUploadAbortFlag = false; }
};

// --- 動画圧縮サービスインスタンス管理 ---
let videoCompressionServiceInstance: VideoCompressionService | null = null;

export function setVideoCompressionService(service: VideoCompressionService | null): void {
    videoCompressionServiceInstance = service;
}

export function getVideoCompressionService(): VideoCompressionService | null {
    return videoCompressionServiceInstance;
}

export function abortVideoCompression(): void {
    const isDev = import.meta.env.DEV;
    if (isDev) console.log('[uploadStore] abortVideoCompression called');

    uploadAbortFlagStore.set(true);

    if (videoCompressionServiceInstance) {
        videoCompressionServiceInstance.abort?.();
    }

    videoCompressionProgressStore.set(0);
}

// --- 画像圧縮サービスインスタンス管理 ---
let imageCompressionServiceInstance: CompressionService | null = null;

export function setImageCompressionService(service: CompressionService | null): void {
    imageCompressionServiceInstance = service;
}

export function getImageCompressionService(): CompressionService | null {
    return imageCompressionServiceInstance;
}

export function abortImageCompression(): void {
    const isDev = import.meta.env.DEV;
    if (isDev) console.log('[uploadStore] abortImageCompression called');

    uploadAbortFlagStore.set(true);

    if (imageCompressionServiceInstance) {
        imageCompressionServiceInstance.abort?.();
    }

    imageCompressionProgressStore.set(0);
}
export function abortAllUploads(): void {
    const isDev = import.meta.env.DEV;
    if (isDev) console.log('[uploadStore] abortAllUploads called');

    uploadAbortFlagStore.set(true);

    if (videoCompressionServiceInstance) {
        videoCompressionServiceInstance.abort?.();
    }
    if (imageCompressionServiceInstance) {
        imageCompressionServiceInstance.abort?.();
    }

    videoCompressionProgressStore.set(0);
    imageCompressionProgressStore.set(0);
}

// --- アップロード状態管理 ---
let isUploading = $state(false);

export const isUploadingStore = {
    get value() { return isUploading; },
    set: (value: boolean) => { isUploading = value; },
    subscribe: (callback: (value: boolean) => void) => {
        $effect(() => {
            callback(isUploading);
        });
    }
};

// --- 動画圧縮進捗管理 ---
let videoCompressionProgress = $state(0);

export const videoCompressionProgressStore = {
    get value() { return videoCompressionProgress; },
    set: (value: number) => { videoCompressionProgress = value; },
    subscribe: (callback: (value: number) => void) => {
        $effect(() => {
            callback(videoCompressionProgress);
        });
    }
};

// --- 画像圧縮進捗管理 ---
let imageCompressionProgress = $state(0);

export const imageCompressionProgressStore = {
    get value() { return imageCompressionProgress; },
    set: (value: number) => { imageCompressionProgress = value; },
    subscribe: (callback: (value: number) => void) => {
        $effect(() => {
            callback(imageCompressionProgress);
        });
    }
};

// --- メディア自由配置モード設定 ---
let mediaFreePlacementSetting = $state(false);

export const mediaFreePlacementStore = {
    get value() { return mediaFreePlacementSetting; },
    set: (value: boolean) => { mediaFreePlacementSetting = value; }
};
