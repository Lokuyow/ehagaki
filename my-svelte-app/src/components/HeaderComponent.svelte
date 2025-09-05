<script lang="ts">
    import { _ } from "svelte-i18n";
    import { editorState } from "../lib/editor/store";
    import { authState } from "../lib/stores";
    import Button from "./Button.svelte";

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
            <div
                class="kitten-balloon-wrapper {postStatus.error
                    ? 'error'
                    : 'success'}"
            >
                <div class="kitten-balloon">
                    {$_(postStatus.message)}
                </div>
            </div>
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

    .kitten-balloon-wrapper {
        position: absolute;
        left: 66px;
        display: flex;
        align-items: center;
        max-width: 150px;
        height: 100%;
        z-index: 2;
        pointer-events: none;
    }
    .kitten-balloon {
        position: relative;
        background: #fff;
        border: 2px solid #e0e0e0;
        border-radius: 16px;
        padding: 8px 10px;
        font-size: 1rem;
        color: #333;
        margin: auto 0 auto 8px;
        white-space: nowrap;
    }
    .kitten-balloon-wrapper.error .kitten-balloon {
        background: #ffebee;
        color: #c62828;
        border-color: #ffcdd2;
    }
    .kitten-balloon-wrapper.success .kitten-balloon {
        background: hsl(125, 39%, 92%);
        color: hsl(123, 46%, 28%);
        border-color: hsl(125, 39%, 80%);
    }
    .kitten-balloon::after {
        content: "";
        position: absolute;
        left: -16px;
        top: 12px;
        transform: rotate(-8deg);
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-right: 12px solid #fff;
        filter: drop-shadow(-1px 0 0 #e0e0e0);
        z-index: 1;
    }
    .kitten-balloon-wrapper.error .kitten-balloon::after {
        border-right: 12px solid #ffebee;
        filter: drop-shadow(-1px 0 0 #ffcdd2);
    }
    .kitten-balloon-wrapper.success .kitten-balloon::after {
        border-right: 12px solid hsl(125, 39%, 90%);
        filter: drop-shadow(-1px 0 0 hsl(125, 39%, 80%));
    }
</style>
