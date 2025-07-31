<script lang="ts">
    import { _ } from "svelte-i18n";
    import { onDestroy } from "svelte";

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

    // サイズ情報の表示管理
    export function showSizeInfo(info: string, duration: number = 3000) {
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

    // 進捗情報の更新
    export function updateProgress(progress: {
        total: number;
        completed: number;
        failed: number;
        inProgress: boolean;
    }) {
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
            {@html imageSizeInfo}
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
        color: #2e7d32;
        font-size: 0.8rem;
        white-space: normal;
        word-wrap: break-word;
        text-align: left;
        max-width: 100%;
        line-height: 1.2;
        opacity: 0.9;
        user-select: none;
    }

    .upload-progress {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        max-width: 100%;
    }

    .progress-text {
        font-size: 0.9rem;
        color: #666;
        text-align: center;
        white-space: normal;
        word-wrap: break-word;
        line-height: 1.2;
    }

    .progress-bar {
        width: 120px;
        height: 10px;
        background-color: #e0e0e0;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background-color: #1da1f2;
        transition: width 0.3s ease;
    }
</style>
