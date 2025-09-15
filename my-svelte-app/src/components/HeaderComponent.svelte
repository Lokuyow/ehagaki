<script lang="ts">
    // import { run } from "svelte/legacy"; // 削除

    import { _ } from "svelte-i18n";
    import {
        editorState,
        submitPost,
        updatePostStatus,
    } from "../stores/editorStore.svelte";
    import { authState } from "../stores/appStore.svelte";
    import Button from "./Button.svelte";
    import BalloonMessage from "./BalloonMessage.svelte"; // 追加
    import { BALLOON_MESSAGE_SUCCESS_KEYS, BALLOON_MESSAGE_ERROR_KEY } from "../lib/constants";

    // --- infoバルーンデバッグ用 ---
    import { onDestroy } from "svelte";
    import { writable } from "svelte/store";
    interface Props {
        onUploadImage: () => void;
        onResetPostContent: () => void;
        balloonMessage?: {
            type: "success" | "error" | "info";
            message: string;
        } | null;
    }

    let {
        onUploadImage,
        onResetPostContent,
        balloonMessage = null,
    }: Props = $props();
    const infoBalloonStore = writable<{ message: string } | null>(null);

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
    let canPost = $derived(editorState.canPost); // 修正: editorState.canPost のみ参照

    function showSuccessMessage() {
        setTimeout(() => {
            updatePostStatus({
                ...editorState.postStatus,
                success: false,
                message: "",
                completed: false,
            });
        }, 3000);
    }

    // 投稿完了時のバルーンメッセージ候補
    const postSuccessMessages = BALLOON_MESSAGE_SUCCESS_KEYS;

    // 投稿成功時にランダムでメッセージを選択（1回だけ）
    let postSuccessBalloonMessage = $state("");
    let hasShownRandomSuccessBalloon = $state(false);
    $effect(() => {
        if (
            postStatus.success &&
            postStatus.completed &&
            !hasShownRandomSuccessBalloon
        ) {
            // completedになったタイミングでランダムメッセージをセット
            const idx = Math.floor(Math.random() * postSuccessMessages.length);
            postSuccessBalloonMessage = postSuccessMessages[idx];
            hasShownRandomSuccessBalloon = true;
            showSuccessMessage();
        }
    });
    // 投稿がリセットされたらフラグもリセット
    $effect(() => {
        if (!postStatus.success || !postStatus.completed) {
            hasShownRandomSuccessBalloon = false;
            postSuccessBalloonMessage = "";
        }
    });

    // --- dev用: post success/error強制表示デバッグ ---
    if (import.meta.env.MODE === "development") {
        (window as any).showInfoBalloonDebug = (msg: string) => {
            infoBalloonStore.set({ message: msg });
        };
        (window as any).hideInfoBalloonDebug = () => {
            infoBalloonStore.set(null);
        };
    }

    onDestroy(() => {
        // infoBalloonTimeout削除
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
            <img
                src="./ehagaki_icon.svg"
                alt="ehagaki icon"
                class="site-icon"
            />
        </a>
        {#if $infoBalloonStore}
            <BalloonMessage type="info" message={$infoBalloonStore.message} />
        {:else if balloonMessage}
            <BalloonMessage
                type={balloonMessage.type}
                message={balloonMessage.message}
            />
        {:else if postStatus.error}
            <BalloonMessage
                type="error"
                message={$_(BALLOON_MESSAGE_ERROR_KEY)}
            />
        {:else if postStatus.success && postStatus.completed && postSuccessBalloonMessage}
            <BalloonMessage
                type="success"
                message={$_(postSuccessBalloonMessage)}
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
        gap: 8px;
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
        mask-image: url("/ehagaki/icons/paper-plane-solid-full.svg");
        width: 30px;
        height: 30px;
    }
    .image-icon {
        mask-image: url("/ehagaki/icons/image-solid-full.svg");
        width: 32px;
        height: 32px;
    }
    .trash-icon {
        mask-image: url("/icons/trash-solid-full.svg");
        width: 30px;
        height: 30px;
    }
</style>
