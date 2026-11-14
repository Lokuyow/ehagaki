<script lang="ts">
    import type { ComponentProps } from "svelte";
    import { DropdownMenu } from "bits-ui";
    import { _, locale } from "svelte-i18n";
    import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";
    import {
        formatPostedAt,
        formatPostedAtExact,
    } from "../lib/postHistoryDialogUtils";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import PostHistoryRecordActionItems from "./PostHistoryRecordActionItems.svelte";

    type ActionItemProps = Omit<
        ComponentProps<typeof PostHistoryRecordActionItems>,
        "order" | "showDeleteSeparator"
    >;

    interface Props {
        post: PostHistoryRecord;
        /** Channel name for kind 42 posts; unused for other kinds. */
        channelText: string | null;
        deletionFailed: boolean;
        /** Show the timestamp and the action menu here (no reply/quote footer). */
        showTimestampMenu: boolean;
        menuOpen: boolean;
        onMenuOpenChange: (open: boolean) => void;
        showSurroundingPostsAction: boolean;
        onShowSurroundingPosts: () => void;
        /** Called only while the menu content is rendered. */
        getActionItems: () => ActionItemProps;
    }

    let {
        post,
        channelText,
        deletionFailed,
        showTimestampMenu,
        menuOpen,
        onMenuOpenChange,
        showSurroundingPostsAction,
        onShowSurroundingPosts,
        getActionItems,
    }: Props = $props();

    const overlayTarget = getAppRuntimeEnvironment().overlayTarget;
</script>

<div class="post-preview-header">
    {#if post.kind === 42}
        <div
            class="post-history-channel-row"
        >
            <span
                class="channel-icon svg-icon"
                aria-hidden="true"
            ></span>
            <span class="channel-label"
                >{$_(
                    "postHistory.channel",
                )}</span
            >
            <span class="channel-name"
                >{channelText}</span
            >
        </div>
    {/if}
    <div class="post-preview-header-right">
        {#if post.deletedAt || deletionFailed}
            <div class="post-meta-inline">
                {#if post.deletedAt}
                    <span
                        class="deleted-badge"
                        >{$_(
                            "postHistory.deletedBadge",
                        )}</span
                    >
                {/if}
                {#if deletionFailed}
                    <span
                        class="delete-failed"
                        >{$_(
                            "postHistory.deleteFailed",
                        )}</span
                    >
                {/if}
            </div>
        {/if}
        {#if showTimestampMenu}
            <span
                >{formatPostedAt(
                    post.postedAt,
                )}</span
            >
            <DropdownMenu.Root
                open={menuOpen}
                onOpenChange={onMenuOpenChange}
            >
                <DropdownMenu.Trigger
                    class="menu-trigger post-history-menu-trigger"
                    aria-label={$_("common.showActions")}
                >
                    <div
                        class="more-icon svg-icon"
                    ></div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal to={overlayTarget}>
                    <DropdownMenu.Content
                        side="bottom"
                        align="start"
                        sideOffset={8}
                        class="post-history-menu-content"
                        trapFocus={false}
                        preventScroll={false}
                        onCloseAutoFocus={(
                            event: Event,
                        ) =>
                            event.preventDefault()}
                    >
                        {@const actionItems = getActionItems()}
                        <div
                            class="post-history-menu-body"
                        >
                            <div
                                class="post-history-menu-timestamp"
                            >
                                {formatPostedAtExact(
                                    post.postedAt,
                                    $locale,
                                )}
                            </div>
                            <DropdownMenu.Separator
                                class="post-history-menu-separator"
                            />
                            {#if showSurroundingPostsAction}
                                <DropdownMenu.Item
                                    class="menu-action-button"
                                    onSelect={onShowSurroundingPosts}
                                >
                                    <div
                                        class="calendar-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                    <span>
                                        {$_(
                                            "postHistory.showSurroundingPosts",
                                        )}
                                    </span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Separator
                                    class="post-history-menu-separator"
                                />
                            {/if}
                            <PostHistoryRecordActionItems
                                order="standard"
                                showDeleteSeparator={false}
                                {...actionItems}
                            />
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        {/if}
    </div>
</div>

<style>
    .post-preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.3;
    }

    .post-preview-header-right {
        display: flex;
        align-items: center;
        gap: 2px;
        flex-shrink: 0;
        margin-inline-start: auto;
    }

    .post-preview-header-right > span {
        white-space: nowrap;
    }

    .post-history-channel-row {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.3;
    }

    .channel-icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        mask-image: url("/icons/forum_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    .channel-label {
        flex-shrink: 0;
    }

    .channel-name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .post-meta-inline {
        margin-inline-start: auto;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .deleted-badge {
        padding: 2px 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--danger), transparent 82%);
        color: var(--danger);
        font-weight: 600;
    }

    .delete-failed {
        color: var(--danger);
    }

    :global(.post-history-item-deleted) .post-meta-inline > :not(.deleted-badge) {
        opacity: 0.65;
    }
</style>
