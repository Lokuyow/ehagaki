import type { FileUploadResponse } from './types';

export function buildUploadFailureMessage(
    failedResults: FileUploadResponse[],
    fallbackMessage: string,
    translateErrorCode?: (errorCode: NonNullable<FileUploadResponse["errorCode"]>) => string | null | undefined,
): string {
    if (failedResults.length === 0) {
        return '';
    }

    if (failedResults.length === 1) {
        const errorCode = failedResults[0].errorCode;
        if (errorCode) {
            return translateErrorCode?.(errorCode) || failedResults[0].error || fallbackMessage;
        }
        return failedResults[0].error || fallbackMessage;
    }

    return `${failedResults.length}個のファイルのアップロードに失敗しました`;
}
