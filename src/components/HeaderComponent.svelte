<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        editorState,
        submitPost,
        updatePostStatus,
    } from "../stores/editorStore.svelte";
    import { authState } from "../stores/appStore.svelte";
    import Button from "./Button.svelte";
    import BalloonMessage from "./BalloonMessage.svelte";
    import { BalloonMessageManager } from "../lib/balloonMessageManager";
    import { type BalloonMessage as BalloonMessageType } from "../lib/types";

    interface Props {
        onUploadImage: () => void;
        onResetPostContent: () => void;
        balloonMessage?: BalloonMessageType | null;
    }

    let {
        onUploadImage,
        onResetPostContent,
        balloonMessage = null,
    }: Props = $props();

    // バルーンメッセージマネージャー
    let balloonManager: BalloonMessageManager | null = null;
    $effect(() => {
        if ($_ && !balloonManager) {
            balloonManager = new BalloonMessageManager($_);
        }
    });

    // --- authState購読用 ---
    let hasStoredKey = $state(false);
    $effect(() => {
        const unsubscribe = authState.subscribe((val) => {
            hasStoredKey = val && val.isAuthenticated;
        });
        return unsubscribe;
    });

    let postStatus = $derived(editorState.postStatus);
    let isUploading = $derived(editorState.isUploading);
    let canPost = $derived(editorState.canPost);

    // 投稿成功時のバルーンメッセージ管理
    let postSuccessBalloonMessage = $state<BalloonMessageType | null>(null);
    let hasProcessedSuccess = $state(false); // 成功処理済みフラグ

    function showSuccessMessage() {
        if (balloonManager && !hasProcessedSuccess) {
            postSuccessBalloonMessage = balloonManager.createMessage("success");
            hasProcessedSuccess = true;

            balloonManager.scheduleHide(() => {
                postSuccessBalloonMessage = null;
                hasProcessedSuccess = false;
                updatePostStatus({
                    ...editorState.postStatus,
                    success: false,
                    message: "",
                    completed: false,
                });
            }, 3000);
        }
    }

    // 投稿完了時の処理（一度だけ実行）
    $effect(() => {
        if (
            postStatus.success &&
            postStatus.completed &&
            !postSuccessBalloonMessage &&
            !hasProcessedSuccess
        ) {
            showSuccessMessage();
        }
    });

    // 投稿がリセットされたら状態もクリア
    $effect(() => {
        if (!postStatus.success || !postStatus.completed) {
            if (postSuccessBalloonMessage || hasProcessedSuccess) {
                postSuccessBalloonMessage = null;
                hasProcessedSuccess = false;
                if (balloonManager) {
                    balloonManager.cancelScheduledHide();
                }
            }
        }
    });

    // エラーメッセージ生成（リアクティブだが条件によってキャッシュ）
    let errorBalloonMessage = $derived(
        postStatus.error && balloonManager !== null
            ? (balloonManager as BalloonMessageManager).createMessage("error")
            : null,
    );

    // デバッグ機能とメッセージ選択を統合
    let debugInfoMessage = $state<BalloonMessageType | null>(null);

    // dev用: デバッグ機能
    // previewモードでも有効にする
    const isPreviewOrDev =
        import.meta.env.MODE === "development" ||
        (typeof window !== "undefined" &&
            (window.location.port === "4173" ||
                window.location.hostname === "localhost"));

    // Service Workerエラーチェック（本番環境でも有効）
    let serviceWorkerError = $state<BalloonMessageType | null>(null);

    // URLパラメータから共有エラーをチェック - より厳格な条件に変更
    $effect(() => {
        if (typeof window !== "undefined" && balloonManager) {
            const urlParams = new URLSearchParams(window.location.search);
            const sharedError = urlParams.get("error");

            if (sharedError && urlParams.get("shared") === "true") {
                // 画像アップロード関連のエラーはballoonには表示しない
                // FooterInfoDisplayで表示するためここではスキップ
                const skipBalloonErrors = [
                    "processing-error",
                    "no-image",
                    "upload-failed",
                    "network-error",
                    "client-error", // client-errorも画像関連エラーとして追加
                ];

                if (skipBalloonErrors.includes(sharedError)) {
                    // URLパラメータだけクリアして、balloonメッセージは表示しない
                    setTimeout(() => {
                        const newUrl = new URL(window.location.href);
                        newUrl.searchParams.delete("error");
                        newUrl.searchParams.delete("shared");
                        window.history.replaceState({}, "", newUrl.toString());
                    }, 1000);
                    return;
                }

                // その他の重要なエラーのみballoonで表示
                let errorMessage = "";
                switch (sharedError) {
                    case "messaging-error":
                        errorMessage =
                            "Service Workerとの通信でエラーが発生しました。ページを更新してもう一度お試しください。";
                        break;
                    case "window-error":
                        errorMessage = "新しいウィンドウの作成に失敗しました";
                        break;
                    default:
                        // その他の未知のエラーも表示しない
                        setTimeout(() => {
                            const newUrl = new URL(window.location.href);
                            newUrl.searchParams.delete("error");
                            newUrl.searchParams.delete("shared");
                            window.history.replaceState(
                                {},
                                "",
                                newUrl.toString(),
                            );
                        }, 1000);
                        return;
                }

                serviceWorkerError = { type: "error", message: errorMessage };

                // エラーメッセージ表示後、URLからエラーパラメータを削除
                setTimeout(() => {
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete("error");
                    newUrl.searchParams.delete("shared");
                    window.history.replaceState({}, "", newUrl.toString());

                    // エラーメッセージをクリア
                    setTimeout(() => {
                        serviceWorkerError = null;
                    }, 5000);
                }, 1000);
            }
        }
    });

    if (isPreviewOrDev) {
        (window as any).showInfoBalloonDebug = (msg: string) => {
            debugInfoMessage = { type: "info", message: msg };
        };
        (window as any).hideInfoBalloonDebug = () => {
            debugInfoMessage = null;
        };
    }

    // 最終的なメッセージ選択（Service Workerエラーを優先）
    let finalBalloonMessage = $derived(
        serviceWorkerError ||
            (isPreviewOrDev
                ? debugInfoMessage ||
                  balloonMessage ||
                  errorBalloonMessage ||
                  postSuccessBalloonMessage
                : balloonMessage ||
                  errorBalloonMessage ||
                  postSuccessBalloonMessage),
    );

    // クリーンアップ
    $effect(() => {
        return () => {
            if (balloonManager) {
                balloonManager.dispose();
            }
        };
    });
</script>

<div class="header-container">
    <div class="header-left">
        <a
            href="https://lokuyow.github.io/ehagaki/"
            rel="noopener noreferrer"
            class="site-icon-link"
            aria-label="ehagaki"
        >
            <img src="./ehagaki_icon.svg" alt="ehagaki icon" class="site-icon" />
        </a>
        {#if finalBalloonMessage}
            <BalloonMessage
                type={finalBalloonMessage.type}
                message={finalBalloonMessage.message}
            />
        {/if}
    </div>
    <div class="post-actions">
        <div class="buttons-container">
            <Button
                variant="default"
                shape="square"
                className="clear-button"
                disabled={!canPost || postStatus.sending || isUploading}
                onClick={onResetPostContent}
                ariaLabel={$_("postComponent.clear_editor")}
            >
                <div class="trash-icon svg-icon"></div>
            </Button>
            <Button
                variant="default"
                shape="square"
                className="image-button"
                disabled={!hasStoredKey || postStatus.sending || isUploading}
                onClick={onUploadImage}
                ariaLabel={$_("postComponent.upload_image")}
            >
                <div class="image-icon svg-icon"></div>
            </Button>
            <Button
                variant="default"
                shape="square"
                className="post-button"
                disabled={!canPost || postStatus.sending || !hasStoredKey}
                onClick={submitPost}
                ariaLabel={$_("postComponent.post")}
            >
                <div class="plane-icon svg-icon"></div>
            </Button>
        </div>
    </div>
</div>

<style>
    .header-container {
        max-width: 800px;
        width: 100%;
        height: 66px;
        margin-bottom: 8px;
        padding: 0 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .header-left {
        display: flex;
        align-items: center;
        height: 66px;
        width: 100%;
    }

    .site-icon-link {
        display: flex;
        height: 100%;

        &:hover {
            background-color: transparent;
        }
    }

    .site-icon {
        width: 60px;
        height: 60px;
        margin-top: auto;
    }

    .post-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: fit-content;
        height: 100%;
        margin-left: auto;
    }

    .buttons-container {
        display: flex;
        gap: 6px;
        align-items: center;
        height: 100%;
    }

    :global(
            .default.post-button,
            .default.image-button,
            .default.clear-button
        ) {
        border: 1px solid var(--hagaki);
        width: 58px;
    }

    .plane-icon {
        mask-image: url("/icons/paper-plane-solid-full.svg");
        width: 30px;
        height: 30px;
    }
    .image-icon {
        mask-image: url("/icons/image-solid-full.svg");
        width: 32px;
        height: 32px;
    }
    .trash-icon {
        mask-image: url("/icons/trash-solid-full.svg");
        width: 30px;
        height: 30px;
    }
</style>
