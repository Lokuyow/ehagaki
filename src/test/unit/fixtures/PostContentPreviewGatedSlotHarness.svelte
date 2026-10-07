<script lang="ts">
    import PostContentPreview from "../../../components/PostContentPreview.svelte";
    import { buildPostContentRenderModel } from "../../../lib/postContentPreview";

    const model = buildPostContentRenderModel({
        sourceContent: "parent body",
        tags: [["content-warning", "spoiler"]],
    });
</script>

<PostContentPreview {model} contentWarningEventId="parent-event">
    {#snippet afterContentAndMedia()}
        <article data-testid="quoted-card">quoted preview</article>
    {/snippet}
</PostContentPreview>
