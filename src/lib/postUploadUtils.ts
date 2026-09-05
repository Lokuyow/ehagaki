import type { Editor as TipTapEditor } from '@tiptap/core';

import type { UploadHelperResult } from './types';

type UploadableFiles = File[] | FileList | null | undefined;

export interface UploadFilesParams {
    files: File[] | FileList;
    currentEditor: TipTapEditor | null;
    fileInput?: HTMLInputElement;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    setUploadErrorMessage: (message: string) => void;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    getUploadFailedText: (key: string) => string;
}

export type UploadFilesExecutor = (params: UploadFilesParams) => Promise<UploadHelperResult | null | void>;

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
    setUploadErrorMessage: (message: string) => void;
    uploadFiles: UploadFilesExecutor;
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
    if (message !== undefined) {
        target.uploadErrorMessage = message;
    }
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
    setUploadErrorMessage,
    uploadFiles,
}: CreatePostUploadHandlersParams) {
    const performUpload = async (files: UploadableFiles): Promise<UploadHelperResult | null> => {
        if (!hasFiles(files)) {
            return null;
        }

        return (await uploadFiles({
            files,
            currentEditor: getCurrentEditor(),
            fileInput: getFileInput(),
            updateUploadState,
            setUploadErrorMessage,
            imageOxMap: getImageOxMap(),
            imageXMap: getImageXMap(),
            getUploadFailedText,
        })) ?? null;
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
