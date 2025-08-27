<script lang="ts">
    import { _ } from "svelte-i18n";
    import { imageSizeInfoStore } from "../lib/stores";
    import type { UploadProgress } from "../lib/types";
    import { isDev, devLog, copyDevLogWithFallback } from "../lib/debug";

    let copied = false;

    // スマホ対応: タップ時に明示的に選択→コピー（Clipboard API優先、失敗時はtextareaフォールバック）
    async function handleDevLogCopy(e?: Event) {
        try {
            e?.preventDefault();
        } catch {}

        try {
            // devLogの値を逆順でコピーするように変更
            const logs = [...$devLog].reverse();
            await copyDevLogWithFallback(logs);
            // コピーに成功（またはログが空で早期 return）した場合は UI を更新
            // 空ログの場合は copied を立てない
            if ((logs?.length ?? 0) > 0) {
                copied = true;
                setTimeout(() => (copied = false), 1500);
            }
        } catch (err) {
            console.warn("dev log copy failed:", err);
        }
    }

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
    {#if $isDev && $devLog.length}
        <button
            type="button"
            class="dev-console-log"
            on:click={handleDevLogCopy}
            on:touchend|preventDefault={handleDevLogCopy}
            title="タップで全コピー"
            aria-label="開発者ログをコピー"
        >
            <ul>
                {#each [...$devLog].reverse() as log, i}
                    <li>{log}</li>
                {/each}
            </ul>
        </button>
    {/if}
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
        height: 100%;
        .dev-console-log {
            font-size: 0.6rem;
            color: #c00;
            background: #fff0f0;
            overflow-y: auto;
            white-space: pre-wrap;
            height: 100%;
            width: 100%;
            cursor: pointer; /* 追加: コピー可能を示す */
            user-select: text;
            border: none;
            text-align: left;
            padding: 0;
            margin: 0;
            outline: none;
            box-shadow: none;
            appearance: none;
            border-radius: 0;
        }
        .dev-console-log:active,
        .dev-console-log:focus {
            background: #ffe0e0;
        }
        .dev-console-log ul {
            margin: 0;
            padding: 0 0 0 0.4rem;
            list-style: disc inside;
            overflow-y: auto;
        }
        .dev-console-log li {
            margin: 0;
            padding: 0;
            word-break: break-all;
        }
    }
    .dev-console-log li {
        margin: 0;
        padding: 0;
        word-break: break-all;
    }

    .image-size-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        font-size: 0.9rem;
        white-space: normal;
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
