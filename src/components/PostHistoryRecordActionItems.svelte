<script lang="ts">
    import { DropdownMenu } from "bits-ui";
    import { _ } from "svelte-i18n";

    type ActionOrder = "standard" | "raw-json-first";

    interface Props {
        order: ActionOrder;
        copyFailed: boolean;
        showBroadcast: boolean;
        broadcastSending: boolean;
        showDelete: boolean;
        showDeleteSeparator: boolean;
        deletionSending: boolean;
        onCopyPointerDown: (event: PointerEvent) => void;
        onCopyNevent: (event: Event) => void;
        externalClientLabel?: string;
        onOpenExternalClient?: (event: Event) => void;
        onShowRawJson: () => void;
        onBroadcastPointerDown: (event: PointerEvent) => void;
        onBroadcastPost: (event: Event) => void;
        onOpenDeleteConfirm: () => void;
    }

    let {
        order,
        copyFailed,
        showBroadcast,
        broadcastSending,
        showDelete,
        showDeleteSeparator,
        deletionSending,
        onCopyPointerDown,
        onCopyNevent,
        externalClientLabel = undefined,
        onOpenExternalClient = undefined,
        onShowRawJson,
        onBroadcastPointerDown,
        onBroadcastPost,
        onOpenDeleteConfirm,
    }: Props = $props();
</script>

{#snippet copyItem()}
    <DropdownMenu.Item
        class="menu-action-button"
        onpointerdown={onCopyPointerDown}
        onSelect={onCopyNevent}
    >
        <div class="copy-icon svg-icon" aria-hidden="true"></div>
        <span>
            {copyFailed
                ? $_("postHistory.copyFailed")
                : $_("postHistory.copyNevent")}
        </span>
    </DropdownMenu.Item>
{/snippet}

{#snippet rawJsonItem()}
    <DropdownMenu.Item
        class="menu-action-button"
        onSelect={() => onShowRawJson()}
    >
        <div class="raw-json-icon svg-icon" aria-hidden="true"></div>
        <span>{$_("postHistory.rawJson")}</span>
    </DropdownMenu.Item>
{/snippet}

{#if externalClientLabel && onOpenExternalClient}
    <DropdownMenu.Item
        class="menu-action-button"
        onSelect={onOpenExternalClient}
    >
        <div class="open-in-new-icon svg-icon" aria-hidden="true"></div>
        <span>{externalClientLabel}</span>
    </DropdownMenu.Item>
    <DropdownMenu.Separator class="post-history-menu-separator" />
{/if}

{#if order === "raw-json-first"}
    {@render rawJsonItem()}
    {@render copyItem()}
{:else}
    {@render copyItem()}
    {@render rawJsonItem()}
{/if}

{#if showBroadcast}
    <DropdownMenu.Item
        class="menu-action-button"
        disabled={broadcastSending}
        onpointerdown={onBroadcastPointerDown}
        onSelect={onBroadcastPost}
    >
        <div class="broadcast-icon svg-icon" aria-hidden="true"></div>
        <span>{$_("postHistory.broadcast")}</span>
    </DropdownMenu.Item>
{/if}

{#if showDelete}
    {#if showDeleteSeparator}
        <DropdownMenu.Separator class="post-history-menu-separator" />
    {/if}
    <DropdownMenu.Item
        class="menu-action-button menu-action-button-danger"
        disabled={deletionSending}
        onSelect={() => onOpenDeleteConfirm()}
    >
        <div class="trash-icon svg-icon" aria-hidden="true"></div>
        <span>
            {deletionSending
                ? $_("postHistory.deleteSending")
                : $_("postHistory.delete")}
        </span>
    </DropdownMenu.Item>
{/if}

<style>
    :global(.open-in-new-icon) {
        mask-image: url("/icons/arrow_top_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
</style>
