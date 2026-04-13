import { onMount } from "svelte";
import {
    imageSizeInfoStore,
    uploadProgressStore,
    sharedMediaErrorStore,
    videoCompressionProgressStore,
    imageCompressionProgressStore,
    abortAllUploads,
    resetUploadDisplayState,
} from "../../stores/uploadStore.svelte";
import { settingsStore } from "../../stores/settingsStore.svelte";
import { currentEditorStore } from "../../stores/editorStore.svelte";
import { removeAllPlaceholders } from "../utils/editorNodeActions";
import type { SizeDisplayInfo } from "../types";

type TranslateFn = (key: string, options?: any) => string;

export interface FooterProgressDisplayModel {
    text: string;
    value: number;
    ariaLabel: string;
    ariaValueText: string;
    showAbort: boolean;
    abortAriaLabel: string;
}

export interface FooterImageSizeDisplayModel {
    originalLine: string;
    resultLine: string;
}

interface UseFooterMiddleDisplayReturn {
    readonly sharedMediaError: string | null;
    readonly progressDisplay: FooterProgressDisplayModel | null;
    readonly imageSizeDisplay: FooterImageSizeDisplayModel | null;
    readonly showingInfo: boolean;
    handleAbortAll: () => void;
}

export function useFooterMiddleDisplay(
    getTranslate: () => TranslateFn | undefined,
): UseFooterMiddleDisplayReturn {
    let uploadProgress = $derived(uploadProgressStore.value);
    let sharedMediaError = $derived(sharedMediaErrorStore.value);
    let videoCompressionProgress = $derived(
        videoCompressionProgressStore.value,
    );
    let imageCompressionProgress = $derived(
        imageCompressionProgressStore.value,
    );
    let videoCompressionLevel = $derived(settingsStore.videoCompressionLevel);
    let imageSizeInfo = $derived(imageSizeInfoStore.value.info);
    let imageSizeInfoVisible = $derived(imageSizeInfoStore.value.visible);

    let compressionStartTime = $state<number | null>(null);
    let compressionElapsedSeconds = $state(0);
    let compressionTimerInterval: number | null = null;
    let previousUploadInProgress = $state(false);

    function translate(key: string): string {
        return getTranslate()?.(key) ?? key;
    }

    function resetCompressionTimer(): void {
        if (compressionTimerInterval !== null) {
            clearInterval(compressionTimerInterval);
            compressionTimerInterval = null;
        }
        compressionStartTime = null;
        compressionElapsedSeconds = 0;
    }

    function formatElapsedTime(seconds: number): string {
        if (seconds < 60) {
            return `${seconds}s`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    function clampProgressValue(value: number): number {
        return Math.min(100, Math.max(0, Math.round(value)));
    }

    function buildUploadProgressText(): string {
        let text = `${translate("footerInfoDisplay.uploading")}: ${uploadProgress.completed}/${uploadProgress.total}`;

        if (uploadProgress.failed > 0) {
            text += ` (${translate("footerInfoDisplay.failed")}: ${uploadProgress.failed})`;
        }

        if (uploadProgress.aborted > 0) {
            text += ` (${translate("footerInfoDisplay.aborted")}: ${uploadProgress.aborted})`;
        }

        return text;
    }

    function getVideoCompressionLevelLabel(level: string): string {
        switch (level) {
            case "none":
                return translate("settingsDialog.quality_lossless");
            case "low":
                return translate("footerInfoDisplay.videoQualityLevel.high");
            case "medium":
                return translate("footerInfoDisplay.videoQualityLevel.medium");
            case "high":
                return translate("footerInfoDisplay.videoQualityLevel.low");
            default:
                return translate("footerInfoDisplay.videoQualityLevel.medium");
        }
    }

    function getExtension(filename: string | undefined): string {
        if (!filename) return "";
        const match = filename.match(/\.([a-zA-Z0-9]+)$/);
        if (!match) return "";
        const ext = match[1].toUpperCase();
        return ext === "JPEG" ? "JPG" : ext;
    }

    function handleAbortAll() {
        const isDev = import.meta.env.DEV;
        if (isDev) console.log("[FooterInfoDisplay] Abort button clicked!");

        resetCompressionTimer();

        const editor = currentEditorStore.value;
        if (editor) {
            removeAllPlaceholders(editor, isDev);
        }

        abortAllUploads();
    }

    let isImageCompressionActive = $derived(
        imageCompressionProgress > 0 && imageCompressionProgress < 100,
    );
    let isVideoCompressionActive = $derived(
        videoCompressionProgress > 0 && videoCompressionProgress < 100,
    );
    let shouldShowUploadProgress = $derived(
        uploadProgress.inProgress || uploadProgress.total > 0,
    );

    $effect(() => {
        const isCompressing =
            isVideoCompressionActive || isImageCompressionActive;

        if (isCompressing) {
            if (!compressionStartTime) {
                compressionStartTime = Date.now();
                resetUploadDisplayState({ imageSizeInfoOnly: true });
                compressionTimerInterval = window.setInterval(() => {
                    if (compressionStartTime) {
                        compressionElapsedSeconds = Math.floor(
                            (Date.now() - compressionStartTime) / 1000,
                        );
                    }
                }, 1000);
            }
        } else {
            resetCompressionTimer();
        }
    });

    $effect(() => {
        if (uploadProgress.inProgress && !previousUploadInProgress) {
            resetUploadDisplayState({ imageSizeInfoOnly: true });
        }
        previousUploadInProgress = uploadProgress.inProgress;
    });

    onMount(() => {
        return () => {
            resetCompressionTimer();
        };
    });

    let progressDisplay = $derived.by<FooterProgressDisplayModel | null>(() => {
        if (isImageCompressionActive) {
            const ariaLabel = translate("imageCompression.compressing");
            const value = clampProgressValue(imageCompressionProgress);
            const text = `${ariaLabel}: ${value}% (${formatElapsedTime(compressionElapsedSeconds)})`;

            return {
                text,
                value,
                ariaLabel,
                ariaValueText: text,
                showAbort: true,
                abortAriaLabel: "圧縮中止",
            };
        }

        if (isVideoCompressionActive) {
            const videoCompressionLevelLabel = getVideoCompressionLevelLabel(
                videoCompressionLevel,
            );
            const ariaLabel = `${videoCompressionLevelLabel}${translate("videoQualityLabelSuffix")}`;
            const value = clampProgressValue(videoCompressionProgress);
            const text = `${ariaLabel}: ${value}% (${formatElapsedTime(compressionElapsedSeconds)})`;

            return {
                text,
                value,
                ariaLabel,
                ariaValueText: text,
                showAbort: true,
                abortAriaLabel: "圧縮中止",
            };
        }

        if (shouldShowUploadProgress) {
            const ariaLabel = translate("footerInfoDisplay.uploading");
            const value =
                uploadProgress.total > 0
                    ? clampProgressValue(
                        (uploadProgress.completed / uploadProgress.total) * 100,
                    )
                    : 0;
            const text = buildUploadProgressText();

            return {
                text,
                value,
                ariaLabel,
                ariaValueText: text,
                showAbort: uploadProgress.inProgress,
                abortAriaLabel: "アップロード中止",
            };
        }

        return null;
    });

    let imageSizeDisplay = $derived.by<FooterImageSizeDisplayModel | null>(() => {
        if (!imageSizeInfoVisible || !imageSizeInfo) {
            return null;
        }

        if (!imageSizeInfo.originalFilename || !imageSizeInfo.compressedFilename) {
            return null;
        }

        return {
            originalLine: `${getExtension(imageSizeInfo.originalFilename)} ${imageSizeInfo.originalSize}`,
            resultLine: imageSizeInfo.wasSkipped
                ? `→ ${getExtension(imageSizeInfo.compressedFilename)} ${translate("footerInfoDisplay.no_compression") || "圧縮なし"}`
                : `→ ${getExtension(imageSizeInfo.compressedFilename)} ${imageSizeInfo.compressedSize} (${imageSizeInfo.compressionRatio}%)`,
        };
    });

    let showingInfo = $derived(
        sharedMediaError !== null ||
        progressDisplay !== null ||
        imageSizeDisplay !== null,
    );

    return {
        get sharedMediaError() {
            return sharedMediaError;
        },
        get progressDisplay() {
            return progressDisplay;
        },
        get imageSizeDisplay() {
            return imageSizeDisplay;
        },
        get showingInfo() {
            return showingInfo;
        },
        handleAbortAll,
    };
}