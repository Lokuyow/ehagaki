<script lang="ts">
    import { _ } from "svelte-i18n";
    import { imageSizeInfoStore } from "../lib/stores";
    import type { UploadProgress } from "../lib/types";
    import { isDev, devLog, copyDevLogWithFallback } from "../lib/debug";

    let copied = false;

    // --- ストア値をリアクティブに参照 ---
    // $: devLogValue = get(devLog);
    // $: isDevValue = get(isDev);
    // ↓ Svelteのストア自動購読を利用
    // $devLog, $isDev を直接使う

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

    // --- 追加: 拡張子取得用関数（大文字で返す/JPEGはJPGに統一） ---
    function getExtension(filename: string | undefined): string {
        if (!filename) return "";
        const match = filename.match(/\.([a-zA-Z0-9]+)$/);
        if (!match) return "";
        const ext = match[1].toUpperCase();
        return ext === "JPEG" ? "JPG" : ext;
    }
    // 画像サイズ情報から拡張子を取得
    $: originalExt = imageSizeInfo?.originalFilename
        ? getExtension(imageSizeInfo.originalFilename)
        : "";
    $: compressedExt = imageSizeInfo?.compressedFilename
        ? getExtension(imageSizeInfo.compressedFilename)
        : "";

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

{#if $isDev && $devLog.length}
    <button
        type="button"
        class="floating-dev-console-log"
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

<div class="footer-center">
    {#if uploadProgress.inProgress || uploadProgress.total > 0}
        <div class="upload-progress">
            <div class="progress-text">
                {$_("footerInfoDisplay.uploading")}: {uploadProgress.completed}/{uploadProgress.total}
                {#if uploadProgress.failed > 0}
                    ({$_("footerInfoDisplay.failed")}: {uploadProgress.failed})
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
            <div class="size-label">{$_("footerInfoDisplay.data_size")}:</div>
            <div class="size-details">
                {#if imageSizeInfo.originalFilename && imageSizeInfo.compressedFilename}
                    {getExtension(imageSizeInfo.originalFilename)}
                    {imageSizeInfo.originalSize}<br />
                    → {getExtension(imageSizeInfo.compressedFilename)}
                    {#if imageSizeInfo.wasSkipped}
                        {$_("footerInfoDisplay.no_compression") || "圧縮なし"}
                    {:else if imageSizeInfo.wasCompressed}
                        {imageSizeInfo.compressedSize}
                        ({imageSizeInfo.compressionRatio}%)
                    {:else}
                        {imageSizeInfo.compressedSize}
                        ({imageSizeInfo.compressionRatio}%)
                    {/if}
                {/if}
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

    /* 統合: dev-console-logをフッターの上に浮かせる＋dev-console-log本体 */
    .floating-dev-console-log {
        position: fixed;
        right: 0;
        bottom: 66px;
        z-index: 1000;
        min-width: 240px;
        width: 100%;
        max-height: 10vh;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
        border: 1px solid #fbb;
        border-radius: 8px;
        background: #fff0f0;
        overflow-y: auto;
        opacity: 0.6;
        pointer-events: auto;
        touch-action: manipulation;
        font-size: 0.6rem;
        color: #c00;
        white-space: pre-wrap;
        height: 100%;
        cursor: pointer;
        user-select: text;
        border: none;
        text-align: left;
        outline: none;
        box-shadow: none;
        appearance: none;
        border-radius: 0;
    }
    .floating-dev-console-log:active,
    .floating-dev-console-log:focus {
        background: #ffe0e0;
    }
    .floating-dev-console-log ul {
        margin: 0;
        padding: 0 0 0 0.4rem;
        list-style: disc inside;
        overflow-y: auto;
    }
    .floating-dev-console-log li {
        margin: 0;
        padding: 0;
        word-break: break-all;
    }
    .floating-dev-console-log:active {
        transform: scale(0.97);
    }
</style>
