<script lang="ts">
    import { Progress } from "bits-ui";
    import { _ } from "svelte-i18n";
    import {
        imageSizeInfoStore,
        videoCompressionProgressStore,
        imageCompressionProgressStore,
        abortAllUploads,
        authState,
    } from "../stores/appStore.svelte";
    import { currentEditorStore } from "../stores/editorStore.svelte";
    import type { UploadProgress } from "../lib/types";
    import {
        devLog,
        copyDevLogWithFallback,
        shouldShowDevLog,
    } from "../lib/debug";
    import { removeAllPlaceholders } from "../lib/utils/editorUtils";
    import Button from "./Button.svelte";

    let copied = $state(false);

    // 共有メディアエラー状態を追加
    let sharedMediaError = $state<string | null>(null);

    // URLパラメータから共有画像エラーをチェック
    $effect(() => {
        if (typeof window !== "undefined") {
            // 認証初期化完了まで待機（リアクティブ依存として追跡される）
            if (!authState.value.isInitialized) return;

            const urlParams = new URLSearchParams(window.location.search);
            const sharedError = urlParams.get("error");

            if (sharedError && urlParams.get("shared") === "true") {
                // より確実に共有画像が処理されているかチェック
                const checkImageProcessed = () => {
                    // 1. ローカルストレージのフラグをチェック
                    const isProcessed =
                        localStorage.getItem("sharedMediaProcessed") === "1";

                    // 2. URLが既にクリアされているかチェック（App.svelteで成功時にクリアされる）
                    const currentParams = new URLSearchParams(
                        window.location.search,
                    );
                    const hasErrorParam = currentParams.get("error");
                    const isUrlCleared = !hasErrorParam;

                    // 3. いずれかの条件が満たされていれば処理済みとみなす
                    return isProcessed || isUrlCleared;
                };

                if (checkImageProcessed()) {
                    console.log(
                        "Shared image was processed successfully, ignoring error parameter",
                    );
                    return;
                }

                // 認証初期化後、共有メディア処理の完了をポーリングで待機
                // （App.svelteのinit()内で認証初期化→共有メディア取得が順次実行されるため）
                let attempts = 0;
                const maxAttempts = 25; // 25 × 200ms = 5秒
                const pollInterval = 200;

                const poll = () => {
                    if (checkImageProcessed()) {
                        console.log(
                            "Shared image processing detected after polling, not showing error",
                        );
                        return;
                    }
                    attempts++;
                    if (attempts < maxAttempts) {
                        setTimeout(poll, pollInterval);
                        return;
                    }

                    // タイムアウト: 実際にメディアが処理されなかった場合のみエラーを表示
                    let errorMessage = "";
                    switch (sharedError) {
                        case "processing-error":
                            errorMessage =
                                "共有メディアの処理中にエラーが発生しました";
                            break;
                        case "no-image":
                            errorMessage = "共有メディアが見つかりませんでした";
                            break;
                        case "upload-failed":
                            errorMessage =
                                "メディアのアップロードに失敗しました";
                            break;
                        case "network-error":
                            errorMessage = "ネットワークエラーが発生しました";
                            break;
                        case "client-error":
                            errorMessage =
                                "メディア共有処理でエラーが発生しました";
                            break;
                        default:
                            return; // その他のエラーは表示しない
                    }

                    sharedMediaError = errorMessage;

                    // エラーメッセージ表示後、URLパラメータをクリア
                    setTimeout(() => {
                        const newUrl = new URL(window.location.href);
                        newUrl.searchParams.delete("error");
                        newUrl.searchParams.delete("shared");
                        window.history.replaceState({}, "", newUrl.toString());

                        // 5秒後にエラーメッセージをクリア
                        setTimeout(() => {
                            sharedMediaError = null;
                        }, 5000);
                    }, 1000);
                };

                setTimeout(poll, pollInterval);
            }
        }
    });

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

    interface Props {
        uploadProgress?: UploadProgress;
    }

    let {
        uploadProgress = $bindable({
            total: 0,
            completed: 0,
            failed: 0,
            aborted: 0,
            inProgress: false,
        }),
    }: Props = $props();

    // ストアから動画圧縮の進捗を取得
    let videoCompressionProgress = $derived(
        videoCompressionProgressStore.value,
    );

    // ストアから画像圧縮の進捗を取得
    let imageCompressionProgress = $derived(
        imageCompressionProgressStore.value,
    );

    // 圧縮の開始時刻と経過時間（動画・画像共通）
    let compressionStartTime = $state<number | null>(null);
    let compressionElapsedSeconds = $state(0);
    let compressionTimerInterval: number | null = null;

    // 動画・画像圧縮の進捗に応じてタイマーを管理（統合版）
    $effect(() => {
        const isCompressing =
            (videoCompressionProgress > 0 && videoCompressionProgress < 100) ||
            (imageCompressionProgress > 0 && imageCompressionProgress < 100);

        if (isCompressing) {
            // 圧縮開始
            if (!compressionStartTime) {
                compressionStartTime = Date.now();
                // 新しい圧縮が開始されたら過去のimage-size-infoをクリア
                reset({ imageSizeInfoOnly: true });
                compressionTimerInterval = window.setInterval(() => {
                    if (compressionStartTime) {
                        compressionElapsedSeconds = Math.floor(
                            (Date.now() - compressionStartTime) / 1000,
                        );
                    }
                }, 1000);
            }
        } else {
            // 圧縮完了または未開始
            if (compressionTimerInterval !== null) {
                clearInterval(compressionTimerInterval);
                compressionTimerInterval = null;
            }
            compressionStartTime = null;
            compressionElapsedSeconds = 0;
        }
    });

    // ストアから画像サイズ情報を取得
    let imageSizeInfo = $derived(imageSizeInfoStore.value.info);
    let imageSizeInfoVisible = $derived(imageSizeInfoStore.value.visible);

    // アップロード開始時にサイズ情報をクリア
    let previousUploadInProgress = $state(false);
    $effect(() => {
        // アップロードが開始された瞬間を検出（false -> true）
        if (uploadProgress.inProgress && !previousUploadInProgress) {
            // 新しいアップロードが開始されたら過去のimage-size-infoをクリア
            reset({ imageSizeInfoOnly: true });
        }
        previousUploadInProgress = uploadProgress.inProgress;
    });

    // 経過時間をフォーマット（秒 → 「Xs」または「Xm Ys」）
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

    function getProgressIndicatorStyle(value: number): string {
        return `transform: translateX(-${100 - clampProgressValue(value)}%);`;
    }

    function buildUploadProgressText(): string {
        let text = `${$_("footerInfoDisplay.uploading")}: ${uploadProgress.completed}/${uploadProgress.total}`;

        if (uploadProgress.failed > 0) {
            text += ` (${$_("footerInfoDisplay.failed")}: ${uploadProgress.failed})`;
        }

        if (uploadProgress.aborted > 0) {
            text += ` (${$_("footerInfoDisplay.aborted")}: ${uploadProgress.aborted})`;
        }

        return text;
    }

    // 統合された中止ハンドラー（動画・画像・アップロード全て）
    function handleAbortAll() {
        const isDev = import.meta.env.DEV;
        if (isDev) console.log("[FooterInfoDisplay] Abort button clicked!");

        // UIを即座にリセット
        videoCompressionProgressStore.set(0);
        imageCompressionProgressStore.set(0);
        if (compressionTimerInterval !== null) {
            clearInterval(compressionTimerInterval);
            compressionTimerInterval = null;
        }
        compressionStartTime = null;
        compressionElapsedSeconds = 0;

        // アップロード進捗もリセット
        uploadProgress = {
            total: 0,
            completed: 0,
            failed: 0,
            aborted: 0,
            inProgress: false,
        };

        // エディター内のプレースホルダーを削除
        const editor = currentEditorStore.value;
        if (editor) {
            removeAllPlaceholders(editor, isDev);
        }

        // バックグラウンドで統合中断処理を実行
        abortAllUploads();
    }

    // 後方互換性のため個別ハンドラーも残す（統合ハンドラーを呼び出すだけ）
    function handleAbortVideoCompression() {
        handleAbortAll();
    }

    function handleAbortImageCompression() {
        handleAbortAll();
    }

    // --- 追加: 拡張子取得用関数（大文字で返す/JPEGはJPGに統一） ---
    function getExtension(filename: string | undefined): string {
        if (!filename) return "";
        const match = filename.match(/\.([a-zA-Z0-9]+)$/);
        if (!match) return "";
        const ext = match[1].toUpperCase();
        return ext === "JPEG" ? "JPG" : ext;
    }

    // 動画圧縮レベルを取得する関数
    function getVideoCompressionLevel(): string {
        if (typeof window === "undefined") return "medium";
        const level = localStorage.getItem("videoCompressionLevel") || "medium";
        return level;
    }

    // 動画圧縮レベルの表示名を取得する関数
    function getVideoCompressionLevelLabel(level: string): string {
        switch (level) {
            case "none":
                return $_("settingsDialog.quality_lossless");
            case "low":
                return $_("footerInfoDisplay.videoQualityLevel.high");
            case "medium":
                return $_("footerInfoDisplay.videoQualityLevel.medium");
            case "high":
                return $_("footerInfoDisplay.videoQualityLevel.low");
            default:
                return $_("footerInfoDisplay.videoQualityLevel.medium");
        }
    }

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
                    aborted: 0,
                    inProgress: false,
                };
            }, 1000);
        }
    }

    // 進捗・画像サイズ情報をリセットするメソッドを追加
    export function reset(options?: { imageSizeInfoOnly?: boolean }) {
        if (options?.imageSizeInfoOnly) {
            imageSizeInfoStore.set({ info: null, visible: false });
            return;
        }

        uploadProgress = {
            total: 0,
            completed: 0,
            failed: 0,
            aborted: 0,
            inProgress: false,
        };
        videoCompressionProgressStore.set(0);
        imageCompressionProgressStore.set(0);
        if (compressionTimerInterval !== null) {
            clearInterval(compressionTimerInterval);
            compressionTimerInterval = null;
        }
        compressionStartTime = null;
        compressionElapsedSeconds = 0;
        imageSizeInfoStore.set({ info: null, visible: false });
        sharedMediaError = null; // 共有メディアエラーもクリア
    }

    // アップロード中やその他の情報表示中かどうか
    let showingInfo = $derived(
        sharedMediaError !== null ||
            (imageCompressionProgress > 0 && imageCompressionProgress < 100) ||
            (videoCompressionProgress > 0 && videoCompressionProgress < 100) ||
            uploadProgress.inProgress ||
            uploadProgress.total > 0 ||
            (imageSizeInfoVisible && imageSizeInfo !== null),
    );

    let imageCompressionProgressValue = $derived(
        clampProgressValue(imageCompressionProgress),
    );
    let imageCompressionText = $derived(
        `${$_("imageCompression.compressing")}: ${imageCompressionProgressValue}% (${formatElapsedTime(compressionElapsedSeconds)})`,
    );

    let videoCompressionLevelLabel = $derived(
        getVideoCompressionLevelLabel(getVideoCompressionLevel()),
    );
    let videoCompressionProgressValue = $derived(
        clampProgressValue(videoCompressionProgress),
    );
    let videoCompressionText = $derived(
        `${videoCompressionLevelLabel}${$_("videoQualityLabelSuffix")}: ${videoCompressionProgressValue}% (${formatElapsedTime(compressionElapsedSeconds)})`,
    );

    let uploadProgressValue = $derived(
        uploadProgress.total > 0
            ? clampProgressValue(
                  (uploadProgress.completed / uploadProgress.total) * 100,
              )
            : 0,
    );
    let uploadProgressText = $derived(buildUploadProgressText());
</script>

{#if shouldShowDevLog() && $devLog.length}
    <button
        type="button"
        class="floating-dev-console-log"
        onclick={handleDevLogCopy}
        ontouchend={handleDevLogCopy}
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
    {#if showingInfo}
        <!-- 情報表示エリア（アップロード中、圧縮中など） -->
        {#if sharedMediaError}
            <div class="shared-media-error">
                <div class="error-text">{sharedMediaError}</div>
            </div>
        {:else if imageCompressionProgress > 0 && imageCompressionProgress < 100}
            <div class="compression-container">
                <Button
                    variant="danger"
                    shape="circle"
                    className="abort-button"
                    ariaLabel="圧縮中止"
                    onClick={handleAbortImageCompression}
                >
                    <div class="stop-icon svg-icon"></div>
                </Button>
                <div class="upload-progress">
                    <div class="progress-text">
                        {imageCompressionText}
                    </div>
                    <Progress.Root
                        value={imageCompressionProgressValue}
                        max={100}
                        aria-label={$_("imageCompression.compressing")}
                        aria-valuetext={imageCompressionText}
                        class="footer-progress-root"
                    >
                        <div
                            class="footer-progress-indicator"
                            style={getProgressIndicatorStyle(
                                imageCompressionProgressValue,
                            )}
                        ></div>
                    </Progress.Root>
                </div>
            </div>
        {:else if videoCompressionProgress > 0 && videoCompressionProgress < 100}
            <div class="compression-container">
                <Button
                    variant="danger"
                    shape="circle"
                    className="abort-button"
                    ariaLabel="圧縮中止"
                    onClick={handleAbortVideoCompression}
                >
                    <div class="stop-icon svg-icon"></div>
                </Button>
                <div class="upload-progress">
                    <div class="progress-text">
                        {videoCompressionText}
                    </div>
                    <Progress.Root
                        value={videoCompressionProgressValue}
                        max={100}
                        aria-label={`${videoCompressionLevelLabel}${$_("videoQualityLabelSuffix")}`}
                        aria-valuetext={videoCompressionText}
                        class="footer-progress-root"
                    >
                        <div
                            class="footer-progress-indicator"
                            style={getProgressIndicatorStyle(
                                videoCompressionProgressValue,
                            )}
                        ></div>
                    </Progress.Root>
                </div>
            </div>
        {:else if uploadProgress.inProgress || uploadProgress.total > 0}
            {#if uploadProgress.inProgress}
                <!-- アップロード中: 中止ボタンを表示 -->
                <div class="compression-container">
                    <Button
                        variant="danger"
                        shape="circle"
                        className="abort-button"
                        ariaLabel="アップロード中止"
                        onClick={handleAbortImageCompression}
                    >
                        <div class="stop-icon svg-icon"></div>
                    </Button>
                    <div class="upload-progress">
                        <div class="progress-text">{uploadProgressText}</div>
                        <Progress.Root
                            value={uploadProgressValue}
                            max={100}
                            aria-label={$_("footerInfoDisplay.uploading")}
                            aria-valuetext={uploadProgressText}
                            class="footer-progress-root"
                        >
                            <div
                                class="footer-progress-indicator"
                                style={getProgressIndicatorStyle(
                                    uploadProgressValue,
                                )}
                            ></div>
                        </Progress.Root>
                    </div>
                </div>
            {:else}
                <!-- アップロード完了/結果表示: 中止ボタンなし -->
                <div class="upload-progress">
                    <div class="progress-text">{uploadProgressText}</div>
                    <Progress.Root
                        value={uploadProgressValue}
                        max={100}
                        aria-label={$_("footerInfoDisplay.uploading")}
                        aria-valuetext={uploadProgressText}
                        class="footer-progress-root"
                    >
                        <div
                            class="footer-progress-indicator"
                            style={getProgressIndicatorStyle(
                                uploadProgressValue,
                            )}
                        ></div>
                    </Progress.Root>
                </div>
            {/if}
        {:else if imageSizeInfoVisible && imageSizeInfo}
            <div class="image-size-info">
                <div class="size-label">
                    {$_("footerInfoDisplay.data_size")}:
                </div>
                <div class="size-details">
                    {#if imageSizeInfo.originalFilename && imageSizeInfo.compressedFilename}
                        {getExtension(imageSizeInfo.originalFilename)}
                        {imageSizeInfo.originalSize}<br />
                        → {getExtension(imageSizeInfo.compressedFilename)}
                        {#if imageSizeInfo.wasSkipped}
                            {$_("footerInfoDisplay.no_compression") ||
                                "圧縮なし"}
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
    {/if}
</div>

<style>
    .footer-center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .compression-container {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
    }

    .image-size-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        font-size: 0.9375rem;
        line-height: 1.1;
        white-space: normal;
        text-align: left;
        max-width: 100%;
        gap: 2px;
    }

    .size-label {
        color: var(--text-light);
        font-size: 0.8125rem;
        opacity: 0.8;
    }

    .size-details {
        font-size: 0.9375rem;
        font-weight: 500;
    }

    .upload-progress {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        width: 100%;
        padding-bottom: 4px;
    }

    .progress-text {
        font-size: 0.875rem;
        color: var(--text);
        text-align: center;
        white-space: normal;
        flex: 1;
    }

    :global(.compression-container .abort-button) {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        cursor: pointer;
        pointer-events: auto;
        position: relative;
        z-index: 10;

        :global(.stop-icon.svg-icon) {
            mask-image: url("/icons/stop-solid-full.svg");
            width: 22px;
            height: 22px;
            background-color: #f0f0f0;
        }
    }

    :global(.footer-progress-root) {
        width: 100%;
        height: 14px;
        background-color: white;
        overflow: hidden;
    }

    :global(.footer-progress-root:focus-visible) {
        outline: 2px solid var(--theme);
        outline-offset: 2px;
    }

    :global(.footer-progress-indicator) {
        width: 100%;
        height: 100%;
        background-color: var(--theme);
        transition: transform 0.3s ease;
    }

    /* 統合: dev-console-logをフッターの上に浮かせる＋dev-console-log本体 */
    .floating-dev-console-log {
        position: fixed;
        right: 0;
        bottom: 116px;
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
        &:hover {
            --btn-bg: #ffe0e0;
        }
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

    .shared-media-error {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        background: var(--balloon-error-bg, #fef2f2);
        border: 1px solid var(--balloon-error-border, #fecaca);
        border-radius: 6px;
        max-width: 100%;
    }

    .error-text {
        font-size: 0.9rem;
        color: var(--balloon-error-color, #dc2626);
        text-align: center;
    }
</style>
