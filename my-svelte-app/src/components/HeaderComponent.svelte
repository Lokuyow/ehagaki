<script lang="ts">
    import { _ } from "svelte-i18n";
    import { editorState } from "../lib/editor/store";
    import { authState } from "../lib/stores";
    import Button from "./Button.svelte";
    import BalloonMessage from "./BalloonMessage.svelte"; // 追加

    export let onUploadImage: () => void;
    export let onSubmitPost: () => void;
    export let onResetPostContent: () => void;

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

    $: if (postStatus.success && postStatus.completed) {
        showSuccessMessage();
    }

    // --- dev用: post success/error強制表示デバッグ ---
    if (import.meta.env.MODE === "development") {
        (window as any).showPostSuccessDebug = () => {
            editorState.update((state) => ({
                ...state,
                postStatus: {
                    ...state.postStatus,
                    success: true,
                    error: false,
                    message: "post_success",
                },
            }));
        };
        (window as any).showPostErrorDebug = () => {
            editorState.update((state) => ({
                ...state,
                postStatus: {
                    ...state.postStatus,
                    success: false,
                    error: true,
                    message: "post_error",
                },
            }));
        };
    }
</script>

<div class="header-container">
    <div class="header-left">
        <a
            href="https://lokuyow.github.io/ehagaki/"
            target="_blank"
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
        {#if postStatus.error || postStatus.success}
            <BalloonMessage
                type={postStatus.error ? "error" : "success"}
                message={$_(postStatus.message)}
            />
        {/if}
    </div>
    <div class="post-actions">
        <div class="buttons-container">
            <Button
                className="clear-button btn-angular"
                disabled={!canPost || postStatus.sending || isUploading}
                on:click={onResetPostContent}
                ariaLabel={$_("clear_editor")}
            >
                <div class="trash-icon svg-icon"></div>
            </Button>
            <Button
                className="image-button btn-angular"
                disabled={!hasStoredKey || postStatus.sending || isUploading}
                on:click={onUploadImage}
                ariaLabel={$_("upload_image")}
            >
                <div class="image-icon svg-icon"></div>
            </Button>
            <Button
                className="post-button btn-angular"
                disabled={!canPost || postStatus.sending || !hasStoredKey}
                on:click={onSubmitPost}
                ariaLabel={$_("post")}
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
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        width: auto;
    }

    .site-icon-link {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
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
        width: 100%;
        height: 100%;
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
