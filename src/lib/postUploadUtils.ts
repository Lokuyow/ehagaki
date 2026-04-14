import type { Editor as TipTapEditor } from '@tiptap/core';

import {
    uploadFiles as uploadFilesHelper,
    type UploadFilesParams,
} from './uploadHelper';

type UploadableFiles = File[] | FileList | null | undefined;

type UploadFilesExecutor = (params: UploadFilesParams) => Promise<void>;

interface UploadStateTarget {
    isUploading: boolean;
    uploadErrorMessage: string;
}

interface CreatePostUploadHandlersParams {
    getCurrentEditor: () => TipTapEditor | null;
    getFileInput: () => HTMLInputElement | undefined;
    getImageOxMap: () => Record<string, string>;
    getImageXMap: () => Record<string, string>;
    getUploadFailedText: (key: string) => string;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    uploadFiles?: UploadFilesExecutor;
}

function hasFiles(files: UploadableFiles): files is File[] | FileList {
    return !!files && files.length > 0;
}

export function updateEditorUploadState(
    target: UploadStateTarget,
    isUploading: boolean,
    message?: string,
): void {
    target.isUploading = isUploading;
    target.uploadErrorMessage = message || '';
}

export function getFilesFromInputEvent(event: Event): FileList | undefined {
    const input = event.target as HTMLInputElement | null;
    return input?.files?.length ? input.files : undefined;
}

export function createPostUploadHandlers({
    getCurrentEditor,
    getFileInput,
    getImageOxMap,
    getImageXMap,
    getUploadFailedText,
    updateUploadState,
    uploadFiles = uploadFilesHelper,
}: CreatePostUploadHandlersParams) {
    const performUpload = async (files: UploadableFiles): Promise<void> => {
        if (!hasFiles(files)) {
            return;
        }

        await uploadFiles({
            files,
            currentEditor: getCurrentEditor(),
            fileInput: getFileInput(),
            updateUploadState,
            imageOxMap: getImageOxMap(),
            imageXMap: getImageXMap(),
            getUploadFailedText,
        });
    };

    const handleFileSelect = (event: Event): void => {
        const files = getFilesFromInputEvent(event);

        if (files) {
            void performUpload(files);
        }
    };

    return {
        performUpload,
        handleFileSelect,
    };
}