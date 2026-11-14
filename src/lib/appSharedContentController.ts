import type { SharedMediaRepository } from "./storage/sharedMediaRepository";
import type { SharedMediaData, SharedMediaStoreState } from "./types";

interface SharedContentUploadResult {
    failedResults: unknown[];
    results: unknown[] | null;
}

/** The composer methods shared content is applied through. */
export interface SharedContentComposer {
    appendSharedTextContent(content: string): boolean;
    uploadFiles(files: File[]): Promise<SharedContentUploadResult | null>;
}

export interface AppSharedContentControllerDependencies {
    /** Reactive store; reads made while consuming are tracked by the caller's effect. */
    sharedMediaStore: SharedMediaStoreState;
    clearSharedMediaStore(): void;
    setSharedMediaError(message: string | null, durationMs?: number): void;
    acknowledgeSharedMedia(shareId: string): Promise<boolean>;
    sharedMediaRepository: Pick<
        SharedMediaRepository,
        "updateLatestForShare" | "deleteLatestForShare"
    >;
    composeSharedText(data: Pick<SharedMediaData, "title" | "text" | "url">): string;
    getComposer(): SharedContentComposer | null;
    logger: Pick<Console, "error">;
}

export interface AppSharedContentController {
    /**
     * Apply the share currently held in the store to the composer: text first,
     * then media upload. Does nothing while another share is being processed
     * or before the composer is mounted.
     */
    consumeSharedContent(): Promise<void>;
}

export function createAppSharedContentController(
    deps: AppSharedContentControllerDependencies,
): AppSharedContentController {
    const { sharedMediaStore, sharedMediaRepository } = deps;
    let isProcessingSharedContent = false;

    function clearSharedMediaStoreForShare(shareId: string): void {
        if (sharedMediaStore.shareId === shareId) {
            deps.clearSharedMediaStore();
        }
    }

    async function deleteSharedMediaForShare(shareId: string): Promise<void> {
        // Clear the mirror first. If that acknowledgement fails, retain the
        // authoritative IndexedDB record to prevent the stale mirror being used.
        if (!(await deps.acknowledgeSharedMedia(shareId))) {
            return;
        }
        await sharedMediaRepository.deleteLatestForShare(shareId);
    }

    async function consumeSharedContent(): Promise<void> {
        // Read the composer last: the caller's effect should depend on it only
        // once there is a share to apply.
        if (
            isProcessingSharedContent ||
            !sharedMediaStore.received ||
            !sharedMediaStore.shareId
        ) {
            return;
        }
        const composer = deps.getComposer();
        if (!composer) {
            return;
        }

        isProcessingSharedContent = true;
        const shareId = sharedMediaStore.shareId;
        const mediaFiles = [...sharedMediaStore.files];
        const metadata = sharedMediaStore.metadata;
        let bodyStatus = sharedMediaStore.bodyStatus;

        try {
            if (bodyStatus === "pending") {
                const content = deps.composeSharedText(sharedMediaStore);
                if (content && !composer.appendSharedTextContent(content)) {
                    throw new Error("Failed to apply shared text to the editor");
                }

                bodyStatus = "applied";
                const updateResult = await sharedMediaRepository.updateLatestForShare(
                    shareId,
                    {
                        images: mediaFiles,
                        metadata,
                        bodyStatus,
                        automaticRetryCount: sharedMediaStore.automaticRetryCount,
                    },
                );
                if (updateResult === "stale") {
                    clearSharedMediaStoreForShare(shareId);
                    return;
                }
            }

            if (mediaFiles.length === 0) {
                await deleteSharedMediaForShare(shareId);
                clearSharedMediaStoreForShare(shareId);
                return;
            }

            // The composer can be remounted while the text update was awaited.
            const uploadComposer = deps.getComposer();
            if (!uploadComposer) {
                throw new Error("Composer is not available for shared media");
            }
            const uploadResult = await uploadComposer.uploadFiles(mediaFiles);
            const uploadedAllFiles =
                uploadResult !== null &&
                uploadResult.failedResults.length === 0 &&
                uploadResult.results !== null;

            if (uploadedAllFiles) {
                await deleteSharedMediaForShare(shareId);
            } else if (sharedMediaStore.automaticRetryCount < 1) {
                await sharedMediaRepository.updateLatestForShare(shareId, {
                    images: mediaFiles,
                    metadata,
                    bodyStatus,
                    automaticRetryCount: sharedMediaStore.automaticRetryCount + 1,
                });
                deps.setSharedMediaError(
                    "共有メディアのアップロードに失敗しました。次回起動時に一度だけ再試行します。",
                    5000,
                );
            } else {
                await deleteSharedMediaForShare(shareId);
                deps.setSharedMediaError(
                    "共有メディアのアップロードに失敗しました。元のアプリからもう一度共有してください。",
                    5000,
                );
            }

            clearSharedMediaStoreForShare(shareId);
        } catch (error) {
            deps.logger.error("Failed to consume shared content:", error);
            deps.setSharedMediaError("共有コンテンツの取り込みに失敗しました", 5000);
            // Keep the persistent record unchanged so a later startup can recover it.
            clearSharedMediaStoreForShare(shareId);
        } finally {
            isProcessingSharedContent = false;

            // A newer share can arrive while the current one is awaiting upload.
            // Its effect run returns while this guard is true, so explicitly resume
            // consumption after the current share has released the guard.
            if (
                sharedMediaStore.received &&
                sharedMediaStore.shareId &&
                sharedMediaStore.shareId !== shareId
            ) {
                queueMicrotask(() => {
                    void consumeSharedContent();
                });
            }
        }
    }

    return { consumeSharedContent };
}
