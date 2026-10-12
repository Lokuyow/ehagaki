<script lang="ts">
    import PostHistoryRepliesBadgeButton from "./PostHistoryRepliesBadgeButton.svelte";
    interface Props { count: number; expanded: boolean; ariaLabel: string; onToggle: () => void; }
    let { count, expanded, ariaLabel, onToggle }: Props = $props();
</script>

<PostHistoryRepliesBadgeButton
    className="post-preview-reactions-button"
    {count}
    ariaLabel={ariaLabel}
    selected={expanded}
    onClick={onToggle}
/>
