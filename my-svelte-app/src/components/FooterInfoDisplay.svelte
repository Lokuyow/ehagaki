<script lang="ts">
    import { _ } from "svelte-i18n";
    import { imageSizeInfoStore } from "../lib/stores";
    import type { UploadProgress } from "../lib/types";

    export let uploadProgress: UploadProgress = {
        total: 0,
        completed: 0,
        failed: 0,
        inProgress: false,
    };

    // ストアから画像サイズ情報を取得
    $: imageSizeInfo = $imageSizeInfoStore.info;
    $: imageSizeInfoVisible = $imageSizeInfoStore.visible;

    /**
     * 進捗情報の更新
     * @param progress アップロード進捗情報
     */
    export function updateProgress(progress: UploadProgress): void {
        uploadProgress = progress;

        // 進捗が完了したら一定時間後に非表示
        if (!progress.inProgress && progress.total > 0) {
            setTimeout(() => {
                uploadProgress = {
                    total: 0,
                    completed: 0,
                    failed: 0,
                    inProgress: false,
                };
            }, 1000);
        }
    }

    // 進捗・画像サイズ情報をリセットするメソッドを追加
    export function reset() {
        uploadProgress = {
            total: 0,
            completed: 0,
            failed: 0,
            inProgress: false,
        };
        imageSizeInfoStore.set({ info: null, visible: false });
    }
</script>

<div class="footer-center">
    {#if uploadProgress.inProgress || uploadProgress.total > 0}
        <div class="upload-progress">
            <div class="progress-text">
                {$_("uploading")}: {uploadProgress.completed}/{uploadProgress.total}
                {#if uploadProgress.failed > 0}
                    ({$_("failed")}: {uploadProgress.failed})
                {/if}
            </div>
            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width: {uploadProgress.total > 0
                        ? Math.round(
                              (uploadProgress.completed /
                                  uploadProgress.total) *
                                  100,
                          )
                        : 0}%"
                ></div>
            </div>
        </div>
    {:else if imageSizeInfoVisible && imageSizeInfo && imageSizeInfo.wasCompressed}
        <div class="image-size-info">
            <div class="size-label">{$_("data_size")}:</div>
            <div class="size-details">
                {imageSizeInfo.originalSize} → {imageSizeInfo.compressedSize} ({imageSizeInfo.compressionRatio}%)
            </div>
        </div>
    {/if}
</div>

<style>
    .footer-center {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        min-width: 0;
        height: 100%;
        overflow-y: auto;
    }

    .image-size-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        font-size: 0.9rem;
        white-space: normal;
        word-wrap: break-word;
        text-align: left;
        max-width: 100%;
        line-height: 1;
        gap: 2px;
    }

    .size-label {
        color: var(--text-light);
        font-size: 0.8rem;
        opacity: 0.8;
    }

    .size-details {
        font-size: 0.9rem;
        font-weight: 500;
    }

    .upload-progress {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        width: 100%;
        padding: 0 8px;
    }

    .progress-text {
        font-size: 0.9rem;
        color: var(--text);
        text-align: center;
        white-space: normal;
        word-wrap: break-word;
        line-height: 1.2;
    }

    .progress-bar {
        width: 100%;
        height: 14px;
        background-color: #e0e0e0;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background-color: var(--theme);
        transition: width 0.3s ease;
    }
</style>
