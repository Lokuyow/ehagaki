<script lang="ts">
    import PostHistoryActionMenu from "../../../components/PostHistoryActionMenu.svelte";
    import PostHistoryRecordActionItems from "../../../components/PostHistoryRecordActionItems.svelte";

    type ActionOrder = "standard" | "raw-json-first";

    interface Props {
        order?: ActionOrder;
        copyFailed?: boolean;
        showBroadcast?: boolean;
        broadcastSending?: boolean;
        showDelete?: boolean;
        showDeleteSeparator?: boolean;
        deletionSending?: boolean;
        onCopyPointerDown?: (event: PointerEvent) => void;
        onCopyNevent?: (event: Event) => void;
        onShowRawJson?: () => void;
        onBroadcastPointerDown?: (event: PointerEvent) => void;
        onBroadcastPost?: (event: Event) => void;
        onOpenDeleteConfirm?: () => void;
    }

    let {
        order = "standard",
        copyFailed = false,
        showBroadcast = true,
        broadcastSending = false,
        showDelete = true,
        showDeleteSeparator = true,
        deletionSending = false,
        onCopyPointerDown = () => undefined,
        onCopyNevent = () => undefined,
        onShowRawJson = () => undefined,
        onBroadcastPointerDown = () => undefined,
        onBroadcastPost = () => undefined,
        onOpenDeleteConfirm = () => undefined,
    }: Props = $props();

    let open = $state(true);
</script>

<PostHistoryActionMenu
    {open}
    onOpenChange={(nextOpen) => (open = nextOpen)}
    triggerAriaLabel="アクションを表示"
>
    {#snippet items()}
        <PostHistoryRecordActionItems
            {order}
            {copyFailed}
            {showBroadcast}
            {broadcastSending}
            {showDelete}
            {showDeleteSeparator}
            {deletionSending}
            {onCopyPointerDown}
            {onCopyNevent}
            {onShowRawJson}
            {onBroadcastPointerDown}
            {onBroadcastPost}
            {onOpenDeleteConfirm}
        />
    {/snippet}
</PostHistoryActionMenu>
