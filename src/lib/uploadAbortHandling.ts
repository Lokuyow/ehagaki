import type { Editor as TipTapEditor } from '@tiptap/core';

import { removeAllGalleryPlaceholders } from './editor/placeholderManager';
import type {
    PlaceholderEntry,
    UploadHelperDependencies,
    UploadHelperResult,
} from './types';
import { isDefaultUploadAborted } from './uploadAbortUtils';
import { removeAllPlaceholders } from './utils/editorNodeActions';

type ImageSizeMapStore = UploadHelperDependencies['imageSizeMapStore'];

export interface GalleryCleanupContext {
    imageSizeMapStore: ImageSizeMapStore;
}

export interface UploadAbortContext {
    fileArray: File[];
    currentEditor: TipTapEditor | null;
    updateUploadState: (isUploading: boolean, errorMessage?: string) => void;
    devMode: boolean;
    galleryCleanup?: GalleryCleanupContext;
    notifyAbortProgress?: (fileCount: number) => void;
}

export interface AbortCheckpointParams {
    placeholderMap: PlaceholderEntry[];
    cleanupPlaceholders: boolean;
}

export function cleanupUploadPlaceholders(
    context: Pick<UploadAbortContext, 'currentEditor' | 'devMode' | 'galleryCleanup'>,
    placeholderMap: PlaceholderEntry[],
): void {
    if (context.galleryCleanup) {
        removeAllGalleryPlaceholders(
            placeholderMap,
            context.galleryCleanup.imageSizeMapStore,
        );
        return;
    }

    if (context.currentEditor) {
        removeAllPlaceholders(context.currentEditor, context.devMode);
    }
}

export function handleAbortedUpload(
    context: UploadAbortContext,
    { placeholderMap, cleanupPlaceholders }: AbortCheckpointParams,
): UploadHelperResult {
    context.updateUploadState(false);

    if (cleanupPlaceholders) {
        cleanupUploadPlaceholders(context, placeholderMap);
    }

    context.notifyAbortProgress?.(context.fileArray.length);

    return {
        placeholderMap: cleanupPlaceholders ? [] : placeholderMap,
        results: null,
        imageOxMap: {},
        imageXMap: {},
        failedResults: [],
        errorMessage: 'Upload aborted by user',
    };
}

export function createGalleryCleanupContext(
    galleryMode: boolean,
    imageSizeMapStore: ImageSizeMapStore,
): GalleryCleanupContext | undefined {
    return galleryMode ? { imageSizeMapStore } : undefined;
}

export function createAbortCheckpointChecker({
    isUploadAborted = isDefaultUploadAborted,
    ...context
}: UploadAbortContext & { isUploadAborted?: () => boolean }) {
    return ({
        placeholderMap,
        cleanupPlaceholders,
    }: AbortCheckpointParams): UploadHelperResult | null => {
        if (!isUploadAborted()) {
            return null;
        }

        return handleAbortedUpload(context, {
            placeholderMap,
            cleanupPlaceholders,
        });
    };
}