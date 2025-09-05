<script lang="ts">
    import { _ } from "svelte-i18n";
    import { editorState } from "../lib/editor/store";
    import { authState } from "../lib/stores";
    import Button from "./Button.svelte";
    import BalloonMessage from "./BalloonMessage.svelte"; // 追加

    export let onUploadImage: () => void;
    export let onSubmitPost: () => void;
    export let onResetPostContent: () => void;
    export let balloonMessage: {
        type: "success" | "error" | "info";
        message: string;
    } | null = null;

    // --- infoバルーンデバッグ用 ---
    import { onDestroy } from "svelte";
    import { writable } from "svelte/store";
    const infoBalloonStore = writable<{ message: string } | null>(null);

    $: postStatus = $editorState.postStatus;
    $: hasStoredKey = $authState.isAuthenticated;
    $: isUploading = $editorState.isUploading;
    $: canPost = $editorState.canPost || $editorState.hasImage; // 修正

    function showSuccessMessage() {
        setTimeout(() => {
            editorState.update((state) => ({
                ...state,
                postStatus: {
                    ...state.postStatus,
                    success: false,
                    message: "",
                    completed: false,
                },
            }));
        }, 3000);
    }

    // 投稿完了時のバルーンメッセージ候補
    const postSuccessMessages = [
        "balloonMessage.post_success",
        "balloonMessage.sent",
        "balloonMessage.to_everyone",
    ];

    // 投稿成功時にランダムでメッセージを選択（1回だけ）
    let postSuccessBalloonMessage = "";
    let hasShownRandomSuccessBalloon = false;
    $: if (
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
    // 投稿がリセットされたらフラグもリセット
    $: if (!postStatus.success || !postStatus.completed) {
        hasShownRandomSuccessBalloon = false;
        postSuccessBalloonMessage = "";
    }

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
                message={$_("balloonMessage.post_error")}
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
                className="clear-button btn-angular"
                disabled={!canPost || postStatus.sending || isUploading}
                on:click={onResetPostContent}
                ariaLabel={$_("postComponent.clear_editor")}
            >
                <div class="trash-icon svg-icon"></div>
            </Button>
            <Button
                className="image-button btn-angular"
                disabled={!hasStoredKey || postStatus.sending || isUploading}
                on:click={onUploadImage}
                ariaLabel={$_("postComponent.upload_image")}
            >
                <div class="image-icon svg-icon"></div>
            </Button>
            <Button
                className="post-button btn-angular"
                disabled={!canPost || postStatus.sending || !hasStoredKey}
                on:click={onSubmitPost}
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
        height: 64px;
        margin-bottom: 8px;
        padding: 0 12px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
    }

    .header-left {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .site-icon-link {
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
            background-color: transparent;
        }
    }

    .site-icon {
        width: auto;
        height: 100%;
        object-fit: cover;
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

    :global(.post-button) {
        font-size: 1.1rem;
        font-weight: bold;
        border: 1px solid var(--hagaki);
        width: 54px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    :global(.image-button) {
        width: 54px;
        border: 1px solid var(--hagaki);
    }
    :global(.clear-button) {
        width: 54px;
        border: 1px solid var(--hagaki);
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
