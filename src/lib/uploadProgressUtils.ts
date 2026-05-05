import {
    imageCompressionProgressStore,
    setUploadProgress,
    videoCompressionProgressStore,
} from '../stores/uploadStore.svelte';
import type { UploadInfoCallbacks, UploadProgress } from './types';

export function createUploadProgress(
    total: number,
    overrides: Partial<UploadProgress> = {},
): UploadProgress {
    return {
        total,
        completed: 0,
        failed: 0,
        aborted: 0,
        inProgress: false,
        ...overrides,
    };
}

export function notifyUploadProgress(
    uploadCallbacks: UploadInfoCallbacks | undefined,
    progress: UploadProgress,
): void {
    uploadCallbacks?.onProgress?.(progress);
}

export function createManagedUploadCallbacks(
    uploadCallbacks?: UploadInfoCallbacks,
): UploadInfoCallbacks {
    return {
        onProgress: (progress: UploadProgress) => {
            setUploadProgress(progress);
            uploadCallbacks?.onProgress?.(progress);
        },
        onVideoCompressionProgress: (progress: number) => {
            videoCompressionProgressStore.set(progress);
            uploadCallbacks?.onVideoCompressionProgress?.(progress);
        },
        onImageCompressionProgress: (progress: number) => {
            imageCompressionProgressStore.set(progress);
            uploadCallbacks?.onImageCompressionProgress?.(progress);
        },
    };
}