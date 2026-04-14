import type { FileUploadResponse } from './types';

export function buildUploadFailureMessage(
    failedResults: FileUploadResponse[],
    fallbackMessage: string,
): string {
    if (failedResults.length === 0) {
        return '';
    }

    if (failedResults.length === 1) {
        return failedResults[0].error || fallbackMessage;
    }

    return `${failedResults.length}個のファイルのアップロードに失敗しました`;
}