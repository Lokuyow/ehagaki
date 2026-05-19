<script lang="ts">
    import PostHistoryThreadActionButton from "./PostHistoryThreadActionButton.svelte";

    interface RepliesActionState {
        status: "unloaded" | "loading" | "loaded" | "failed";
        visible: boolean;
        replies: unknown[];
        replyCount: number;
    }

    interface Props {
        state: RepliesActionState;
        ariaLabel: string;
        onClick: () => void;
    }

    let { state, ariaLabel, onClick }: Props = $props();
</script>

<PostHistoryThreadActionButton
    icon={state.visible ? "collapse-content" : "subdirectory-arrow-right"}
    className="post-preview-replies-action-button"
    {ariaLabel}
    title={ariaLabel}
    selected={state.visible}
    loading={state.status === "loading"}
    badgeCount={state.status === "loaded" ? state.replyCount : 0}
    {onClick}
/>
