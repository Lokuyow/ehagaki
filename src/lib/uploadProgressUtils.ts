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
    isCurrent: () => boolean = () => true,
): UploadInfoCallbacks {
    return {
        onProgress: (progress: UploadProgress) => {
            if (!isCurrent()) return;
            setUploadProgress(progress);
            uploadCallbacks?.onProgress?.(progress);
        },
        onVideoCompressionProgress: (progress: number) => {
            if (!isCurrent()) return;
            videoCompressionProgressStore.set(progress);
            uploadCallbacks?.onVideoCompressionProgress?.(progress);
        },
        onImageCompressionProgress: (progress: number) => {
            if (!isCurrent()) return;
            imageCompressionProgressStore.set(progress);
            uploadCallbacks?.onImageCompressionProgress?.(progress);
        },
    };
}
