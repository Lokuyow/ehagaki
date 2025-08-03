<script lang="ts">
    import { _ } from "svelte-i18n";
    import { onDestroy } from "svelte";
    import DOMPurify from "dompurify";

    export let imageSizeInfo: string = "";
    export let imageSizeInfoVisible: boolean = false;
    export let uploadProgress: {
        total: number;
        completed: number;
        failed: number;
        inProgress: boolean;
    } = {
        total: 0,
        completed: 0,
        failed: 0,
        inProgress: false,
    };

    // 自動タイムアウト管理
    let timeoutId: number | null = null;

    /**
     * サイズ情報の表示管理
     * @param info 表示する情報（HTML可）
     * @param duration 表示時間（ミリ秒）
     */
    export function showSizeInfo(info: string, duration: number = 3000): void {
        imageSizeInfo = info;
        imageSizeInfoVisible = true;

        // 既存のタイムアウトをクリア
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // 新しいタイムアウトを設定
        timeoutId = setTimeout(() => {
            imageSizeInfoVisible = false;
            timeoutId = null;
        }, duration);
    }

    /**
     * 進捗情報の更新
     * @param progress アップロード進捗情報
     */
    export function updateProgress(progress: {
        total: number;
        completed: number;
        failed: number;
        inProgress: boolean;
    }): void {
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

    // クリーンアップ
    onDestroy(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });
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
    {:else if imageSizeInfoVisible && imageSizeInfo}
        <div class="image-size-info">
            {@html DOMPurify.sanitize(imageSizeInfo)}
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
        align-items: center;
        justify-content: flex-start;
        color: var(--text);
        font-size: 0.9rem;
        white-space: normal;
        word-wrap: break-word;
        text-align: left;
        max-width: 100%;
        line-height: 1;
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
