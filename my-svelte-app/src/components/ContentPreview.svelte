<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        ImagePreviewManager,
        type ContentPart,
    } from "../lib/imagePreviewUtils";
    import { formatTextWithHashtagsAndLinks } from "../lib/utils";

    export let content: string = "";

    const imagePreviewManager = new ImagePreviewManager();

    $: contentParts = imagePreviewManager.parseContentWithImages(content);
</script>

<div class="post-preview">
    <div class="preview-content">
        {#if content.trim()}
            {#each contentParts as part}
                {#if part.type === "image"}
                    <img src={part.value} alt="" class="preview-image" />
                {:else}
                    {@html formatTextWithHashtagsAndLinks(part.value).replace(
                        /\n/g,
                        "<br>",
                    )}
                {/if}
            {/each}
        {:else}
            <span class="preview-placeholder">{$_("preview")}</span>
        {/if}
    </div>
</div>

<style>
    .post-preview {
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: var(--preview-bg);
        width: 100%;
        max-width: 600px;
        min-width: 300px;
        max-height: 300px;
        min-height: 50px;
        overflow: auto;
    }

    .preview-content {
        font-size: 0.9rem;
        white-space: pre-wrap;
        word-break: break-word;
        color: #222;
    }

    .preview-placeholder {
        color: #bbb;
        font-style: italic;
        user-select: none;
        pointer-events: none;
    }

    .preview-image {
        max-width: 100%;
        max-height: 240px;
        display: block;
        margin: 8px 0;
        border-radius: 6px;
        box-shadow: 0 1px 4px #0001;
        background: #fff;
    }

    :global(.hashtag) {
        color: #1976d2;
        font-weight: 600;
        background: rgba(25, 118, 210, 0.1);
        padding: 2px 4px;
        border-radius: 4px;
    }

    :global(.preview-link) {
        color: #1da1f2;
        text-decoration: underline;
        word-break: break-all;
        transition: color 0.2s ease;
    }

    :global(.preview-link:hover) {
        color: #0d8bd9;
        text-decoration: none;
    }

    :global(.preview-link:visited) {
        color: #9c27b0;
    }
</style>
