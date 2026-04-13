import type { SizeDisplayInfo, CompressionService, UploadProgress, FileSizeInfo } from '../lib/types';
import type { VideoCompressionService } from '../lib/videoCompression/videoCompressionService';
import { mediaGalleryStore } from './mediaGalleryStore.svelte';
import { imageSizeMapStore } from './tagsStore.svelte';
import { generateSizeDisplayInfo } from '../lib/utils/fileSizeUtils';

// --- 画像サイズ情報表示管理 ---
let imageSizeInfo = $state<{ info: SizeDisplayInfo | null; visible: boolean }>({
    info: null,
    visible: false
});

export const imageSizeInfoStore = {
    get value() { return imageSizeInfo; },
    set: (value: { info: SizeDisplayInfo | null; visible: boolean }) => { imageSizeInfo = value; }
};

function showImageSizeInfo(info: SizeDisplayInfo | null): void {
    if (info === null) {
        hideImageSizeInfo();
        return;
    }
    imageSizeInfoStore.set({ info, visible: true });
}

export function setImageSizeInfoFromFileSize(sizeInfo: FileSizeInfo | null): void {
    showImageSizeInfo(generateSizeDisplayInfo(sizeInfo));
}

export function hideImageSizeInfo(): void {
    imageSizeInfoStore.set({ info: null, visible: false });
}

function createEmptyUploadProgress(): UploadProgress {
    return {
        total: 0,
        completed: 0,
        failed: 0,
        aborted: 0,
        inProgress: false,
    };
}

let uploadProgressResetTimer: ReturnType<typeof setTimeout> | null = null;

function clearUploadProgressResetTimer(): void {
    if (uploadProgressResetTimer !== null) {
        clearTimeout(uploadProgressResetTimer);
        uploadProgressResetTimer = null;
    }
}

let uploadProgressState = $state<UploadProgress>(createEmptyUploadProgress());

export const uploadProgressStore = {
    get value() { return uploadProgressState; },
    set: (value: UploadProgress) => { uploadProgressState = value; },
    reset: () => {
        clearUploadProgressResetTimer();
        uploadProgressState = createEmptyUploadProgress();
        isUploadingStore.set(false);
    }
};

export function setUploadProgress(progress: UploadProgress): void {
    clearUploadProgressResetTimer();
    uploadProgressStore.set(progress);
    isUploadingStore.set(progress.inProgress);

    if (!progress.inProgress && progress.total > 0) {
        uploadProgressResetTimer = setTimeout(() => {
            uploadProgressStore.reset();
        }, 1000);
    }
}

export function resetUploadProgress(): void {
    uploadProgressStore.reset();
}

let sharedMediaErrorMessage = $state<string | null>(null);
let sharedMediaErrorTimer: ReturnType<typeof setTimeout> | null = null;

function clearSharedMediaErrorTimer(): void {
    if (sharedMediaErrorTimer !== null) {
        clearTimeout(sharedMediaErrorTimer);
        sharedMediaErrorTimer = null;
    }
}

export const sharedMediaErrorStore = {
    get value() { return sharedMediaErrorMessage; },
    set: (value: string | null) => { sharedMediaErrorMessage = value; },
    clear: () => {
        clearSharedMediaErrorTimer();
        sharedMediaErrorMessage = null;
    }
};

export function setSharedMediaError(message: string | null, durationMs?: number): void {
    clearSharedMediaErrorTimer();
    sharedMediaErrorStore.set(message);

    if (message && durationMs && durationMs > 0) {
        sharedMediaErrorTimer = setTimeout(() => {
            sharedMediaErrorStore.clear();
        }, durationMs);
    }
}

export function clearSharedMediaError(): void {
    sharedMediaErrorStore.clear();
}

export function resetUploadDisplayState(options?: { imageSizeInfoOnly?: boolean }): void {
    if (options?.imageSizeInfoOnly) {
        hideImageSizeInfo();
        return;
    }

    resetUploadProgress();
    videoCompressionProgressStore.set(0);
    imageCompressionProgressStore.set(0);
    hideImageSizeInfo();
    clearSharedMediaError();
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
    resetUploadDisplayState();
    abortVideoCompression();
    abortImageCompression();

    // ギャラリーモードのプレースホルダーを即座に削除
    const removedIds = mediaGalleryStore.removePlaceholders();
    if (removedIds.length > 0) {
        if (isDev) console.log('[uploadStore] Removing gallery placeholders:', removedIds);
        imageSizeMapStore.update(map => {
            const newMap = { ...map };
            for (const id of removedIds) {
                delete newMap[id];
            }
            return newMap;
        });
    }
}

// --- アップロード状態管理 ---
let isUploading = $state(false);

export const isUploadingStore = {
    get value() { return isUploading; },
    set: (value: boolean) => { isUploading = value; }
};

// --- 動画圧縮進捗管理 ---
let videoCompressionProgress = $state(0);

export const videoCompressionProgressStore = {
    get value() { return videoCompressionProgress; },
    set: (value: number) => { videoCompressionProgress = value; }
};

// --- 画像圧縮進捗管理 ---
let imageCompressionProgress = $state(0);

export const imageCompressionProgressStore = {
    get value() { return imageCompressionProgress; },
    set: (value: number) => { imageCompressionProgress = value; }
};

// --- メディア自由配置モード設定 ---
let mediaFreePlacementSetting = $state(false);

export const mediaFreePlacementStore = {
    get value() { return mediaFreePlacementSetting; },
    set: (value: boolean) => { mediaFreePlacementSetting = value; }
};
