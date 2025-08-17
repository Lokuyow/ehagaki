<script lang="ts">
    import { _ } from "svelte-i18n";
    import { editorState, authState } from "../lib/stores";
    import Button from "./Button.svelte";

    export let onUploadImage: () => void;
    export let onSubmitPost: () => void;

    $: postStatus = $editorState.postStatus;
    $: hasStoredKey = $authState.isAuthenticated;
    $: isUploading = $editorState.isUploading;
    $: canPost = $editorState.canPost;

    function showSuccessMessage() {
        setTimeout(() => {
            editorState.update((state) => ({
                ...state,
                postStatus: {
                    ...state.postStatus,
                    success: false,
                    message: "",
                },
            }));
        }, 3000);
    }

    $: if (postStatus.success) {
        showSuccessMessage();
    }
</script>

<div class="header-container">
    <div class="post-actions">
        {#if postStatus.error}
            <div class="post-status error">
                {$_(postStatus.message)}
            </div>
        {/if}
        {#if postStatus.success}
            <div class="post-status success">
                {$_(postStatus.message)}
            </div>
        {/if}
        <div class="buttons-container">
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
        margin-bottom: 8px;
    }

    .post-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        padding: 0 16px;
    }

    .buttons-container {
        display: flex;
        gap: 6px;
        align-items: center;
        height: 64px;
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

    .post-status {
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.9rem;
    }

    .post-status.error {
        background-color: #ffebee;
        color: #c62828;
    }

    .post-status.success {
        background-color: #e8f5e9;
        color: #2e7d32;
    }

    :global(.image-button) {
        width: 54px;
        border: 1px solid var(--hagaki);
    }
</style>
