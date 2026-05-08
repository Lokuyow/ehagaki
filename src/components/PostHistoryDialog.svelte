<script lang="ts">
    import type { RxNostr } from "rx-nostr";
    import { _ } from "svelte-i18n";
    import { Dialog, Popover } from "bits-ui";
    import Button from "./Button.svelte";
    import ConfirmDialog from "./ConfirmDialog.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { usePostHistoryChannelDisplay } from "../lib/hooks/usePostHistoryChannelDisplay.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import { usePostHistoryListing } from "../lib/hooks/usePostHistoryListing.svelte";
    import { usePostHistoryPreviewCollapse } from "../lib/hooks/usePostHistoryPreviewCollapse.svelte";
    import {
        canRequestPostDeletion,
        postDeletionService,
    } from "../lib/postDeletionService";
    import {
        buildPreview,
        formatPostedAt,
    } from "../lib/postHistoryDialogUtils";
    import { POST_HISTORY_PAGE_SIZE } from "../lib/postHistoryRelayFetchService";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import type { RelayConfig } from "../lib/types";
    import { tryCopyToClipboard } from "../lib/utils/clipboardUtils";
    import { toNevent } from "../lib/utils/nostrUtils";

    import { writeRelaysStore } from "../stores/relayStore.svelte";

    interface Props {
        show: boolean;
        onClose: () => void;
        pubkeyHex?: string | null;
        rxNostr?: RxNostr;
        relayConfig?: RelayConfig | null;
    }

    let {
        show = $bindable(false),
        onClose,
        pubkeyHex = null,
        rxNostr = undefined,
        relayConfig = null,
    }: Props = $props();

    const history = usePostHistoryListing({
        getShow: () => show,
        getPubkeyHex: () => pubkeyHex,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => relayConfig,
        pageSize: POST_HISTORY_PAGE_SIZE,
    });
    const channelDisplay = usePostHistoryChannelDisplay({
        getShow: () => show,
        getPosts: () => history.posts,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => relayConfig,
        getIsSearchMode: () => history.isSearchMode,
    });

    let copyState = $state<Record<string, "copied" | "failed" | undefined>>({});
    let deleteConfirmOpen = $state(false);
    let deleteTargetPost = $state<PostHistoryRecord | null>(null);
    let deleteRequestState = $state<
        Record<string, "sending" | "failed" | undefined>
    >({});
    let historyContainer: HTMLDivElement | null = null;
    const previewCollapse = usePostHistoryPreviewCollapse({
        getShow: () => show,
        getPosts: () => history.posts,
        getContainer: () => historyContainer,
    });
    function resetDialogState(): void {
        copyState = {};
        deleteConfirmOpen = false;
        deleteTargetPost = null;
        deleteRequestState = {};
    }

    function handleClose() {
        history.cancelCurrentSync();
        channelDisplay.cancelCurrentChannelResolution();
        deleteConfirmOpen = false;
        deleteTargetPost = null;
        show = false;
        onClose?.();
    }

    useDialogHistory(() => show, handleClose, true);

    $effect(() => {
        if (show) {
            return;
        }

        resetDialogState();
    });

    $effect(() => {
        if (!show) {
            return;
        }

        return () => {
            channelDisplay.cancelCurrentChannelResolution();
        };
    });

    function resetHistoryScrollPosition(): void {
        if (!historyContainer) {
            return;
        }
        historyContainer.scrollTop = 0;
    }

    function handlePreviousPage(): void {
        if (history.goPreviousPage()) {
            resetHistoryScrollPosition();
        }
    }

    async function handleNextPage(): Promise<void> {
        if (await history.goToNextPage()) {
            resetHistoryScrollPosition();
        }
    }

    function buildNevent(post: PostHistoryRecord): string {
        return toNevent({
            eventId: post.eventId,
            authorPubkey: post.pubkeyHex,
            kind: post.kind,
            acceptedRelays: post.acceptedRelays,
            relayHints: post.relayHints,
            writeRelays: writeRelaysStore.value,
        });
    }

    async function handleCopyNevent(post: PostHistoryRecord) {
        const nevent = buildNevent(post);
        const copied = nevent
            ? await tryCopyToClipboard(nevent, "nevent", navigator, window)
            : false;

        copyState = {
            ...copyState,
            [post.eventId]: copied ? "copied" : "failed",
        };

        setTimeout(() => {
            copyState = {
                ...copyState,
                [post.eventId]: undefined,
            };
        }, 1800);
    }

    function isDeletionSending(post: PostHistoryRecord): boolean {
        return deleteRequestState[post.eventId] === "sending";
    }

    function hasDeletionFailed(post: PostHistoryRecord): boolean {
        return deleteRequestState[post.eventId] === "failed";
    }

    function canDeletePost(post: PostHistoryRecord): boolean {
        return canRequestPostDeletion(post, pubkeyHex);
    }

    function openDeleteConfirm(post: PostHistoryRecord): void {
        if (!canDeletePost(post)) {
            return;
        }

        deleteTargetPost = post;
        deleteConfirmOpen = true;
    }

    function handleDeleteCancel(): void {
        deleteConfirmOpen = false;
        deleteTargetPost = null;
    }

    async function handleDeleteConfirm(): Promise<void> {
        const targetPost = deleteTargetPost;
        if (!targetPost) {
            return;
        }

        deleteRequestState = {
            ...deleteRequestState,
            [targetPost.eventId]: "sending",
        };

        const result = await postDeletionService.requestDeletion({
            post: targetPost,
            rxNostr,
        });

        if (
            result.success &&
            typeof result.deletedAt === "number" &&
            result.deletionEventId
        ) {
            history.patchDeletedPost(
                targetPost.eventId,
                result.deletedAt,
                result.deletionEventId,
            );
            deleteRequestState = {
                ...deleteRequestState,
                [targetPost.eventId]: undefined,
            };
        } else {
            deleteRequestState = {
                ...deleteRequestState,
                [targetPost.eventId]: "failed",
            };
        }

        deleteTargetPost = null;
    }
</script>

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("postHistory.title")}
    description={$_("postHistory.description")}
    contentClass="post-history-dialog"
    footerVariant="close-button"
    showPagination={history.showPaging}
    paginationLabel={$_("postHistory.page", {
        values: { page: history.displayPage, total: history.totalPages },
    })}
    previousPageLabel={$_("postHistory.previousPage")}
    nextPageLabel={$_("postHistory.nextPage")}
    canGoPrevious={history.canGoPrevious}
    canGoNext={history.canGoNext}
    nextPageLoading={!history.isSearchMode &&
        history.syncStatus === "older-syncing"}
    onPreviousPage={handlePreviousPage}
    onNextPage={handleNextPage}
    initialFocus="content"
>
    <div class="post-history-heading">
        <h3>{$_("postHistory.title")}</h3>
        {#if history.syncStatusMessageKey}
            <div
                class="status-message"
                class:status-error={history.syncStatus === "failed"}
            >
                <LoadingPlaceholder
                    text={$_(history.syncStatusMessageKey)}
                    showLoader={history.showSyncLoader}
                    loaderSize={25}
                    state={history.showSyncLoader ? "loading" : "complete"}
                    customClass="status-loading-placeholder"
                />
            </div>
        {/if}
    </div>

    <div class="post-history-search-row">
        <input
            bind:value={history.state.searchInput}
            class="post-history-search-input"
            type="search"
            placeholder={$_("postHistory.searchPlaceholder")}
            aria-label={$_("postHistory.search")}
        />
    </div>

    {#if history.isSearchMode && history.state.searchTotalCount > 0}
        <div class="post-history-search-summary">
            <span>{$_("postHistory.searchResults")}</span>
            <span>{history.state.searchTotalCount}</span>
        </div>
    {/if}

    <div class="post-history-container" bind:this={historyContainer}>
        {#if history.posts.length === 0}
            <div class="empty-state">
                <div class="empty-message">
                    {history.isSearchMode
                        ? $_("postHistory.searchNoResults")
                        : $_("postHistory.empty")}
                </div>
            </div>
        {:else}
            <ul class="post-history-list">
                {#each history.posts as post (post.eventId)}
                    <li
                        class="post-history-item"
                        class:post-history-item-deleted={!!post.deletedAt}
                    >
                        <div class="post-history-main">
                            <div class="post-preview-header">
                                {#if post.kind === 42}
                                    <div class="post-history-channel-row">
                                        <span
                                            class="channel-icon svg-icon"
                                            aria-hidden="true"
                                        ></span>
                                        <span class="channel-label"
                                            >{$_("postHistory.channel")}</span
                                        >
                                        <span class="channel-name"
                                            >{channelDisplay.getChannelText(
                                                post,
                                                $_,
                                            )}</span
                                        >
                                    </div>
                                {/if}
                                <div class="post-preview-header-actions">
                                    <span>{formatPostedAt(post.postedAt)}</span>
                                    <Popover.Root>
                                        <Popover.Trigger
                                            class="menu-trigger"
                                            aria-label="アクションを表示"
                                        >
                                            <div
                                                class="more-icon svg-icon"
                                            ></div>
                                        </Popover.Trigger>
                                        <Popover.Portal>
                                            <Popover.Content
                                                side="bottom"
                                                sideOffset={8}
                                                class="post-history-menu-content"
                                                trapFocus={false}
                                                onCloseAutoFocus={(
                                                    event: Event,
                                                ) => event.preventDefault()}
                                            >
                                                <div
                                                    class="post-history-menu-body"
                                                >
                                                    <button
                                                        type="button"
                                                        class="menu-action-button"
                                                        onclick={() =>
                                                            void handleCopyNevent(
                                                                post,
                                                            )}
                                                    >
                                                        <div
                                                            class="copy-icon svg-icon"
                                                            aria-hidden="true"
                                                        ></div>
                                                        <span>
                                                            {copyState[
                                                                post.eventId
                                                            ] === "copied"
                                                                ? $_(
                                                                      "postHistory.copied",
                                                                  )
                                                                : copyState[
                                                                        post
                                                                            .eventId
                                                                    ] ===
                                                                    "failed"
                                                                  ? $_(
                                                                        "postHistory.copyFailed",
                                                                    )
                                                                  : $_(
                                                                        "postHistory.copyNevent",
                                                                    )}
                                                        </span>
                                                    </button>
                                                    {#if canDeletePost(post)}
                                                        <button
                                                            type="button"
                                                            class="menu-action-button menu-action-button-danger"
                                                            disabled={isDeletionSending(
                                                                post,
                                                            )}
                                                            onclick={() =>
                                                                openDeleteConfirm(
                                                                    post,
                                                                )}
                                                        >
                                                            <div
                                                                class="trash-icon svg-icon"
                                                                aria-hidden="true"
                                                            ></div>
                                                            <span>
                                                                {isDeletionSending(
                                                                    post,
                                                                )
                                                                    ? $_(
                                                                          "postHistory.deleteSending",
                                                                      )
                                                                    : $_(
                                                                          "postHistory.delete",
                                                                      )}
                                                            </span>
                                                        </button>
                                                    {/if}
                                                </div>
                                            </Popover.Content>
                                        </Popover.Portal>
                                    </Popover.Root>
                                </div>
                            </div>
                            <div class="post-preview">
                                <div
                                    class="post-preview-content"
                                    use:previewCollapse.previewRef={post.eventId}
                                    class:post-preview-content-collapsed={!previewCollapse.isPostExpanded(
                                        post,
                                    ) &&
                                        previewCollapse.shouldCollapsePost(
                                            post,
                                        )}
                                    id={"post-preview-content-" + post.eventId}
                                >
                                    {buildPreview(post.content)}
                                </div>
                                {#if previewCollapse.shouldCollapsePost(post)}
                                    <button
                                        type="button"
                                        class="post-preview-toggle-button"
                                        aria-expanded={previewCollapse.isPostExpanded(
                                            post,
                                        )}
                                        aria-controls={"post-preview-content-" +
                                            post.eventId}
                                        onclick={() =>
                                            previewCollapse.togglePostExpanded(
                                                post.eventId,
                                            )}
                                    >
                                        {previewCollapse.isPostExpanded(post)
                                            ? $_("postHistory.collapse")
                                            : $_("postHistory.expand")}
                                    </button>
                                {/if}
                            </div>
                            {#if post.deletedAt || hasDeletionFailed(post)}
                                <div class="post-meta">
                                    {#if post.deletedAt}
                                        <span class="deleted-badge"
                                            >{$_(
                                                "postHistory.deletedBadge",
                                            )}</span
                                        >
                                    {/if}
                                    {#if hasDeletionFailed(post)}
                                        <span class="delete-failed"
                                            >{$_(
                                                "postHistory.deleteFailed",
                                            )}</span
                                        >
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    className="modal-close"
                    variant="default"
                    shape="square"
                    ariaLabel={$_("global.close")}
                >
                    <div
                        class="xmark-icon svg-icon"
                        aria-label={$_("global.close")}
                    ></div>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<ConfirmDialog
    bind:open={deleteConfirmOpen}
    title={$_("postHistory.deleteRequestTitle")}
    description={$_("postHistory.deleteRequestDescription")}
    confirmLabel={deleteTargetPost && isDeletionSending(deleteTargetPost)
        ? $_("postHistory.deleteSending")
        : $_("postHistory.deleteConfirm")}
    cancelLabel={$_("postHistory.deleteCancel")}
    confirmVariant="danger"
    confirmDisabled={deleteTargetPost
        ? isDeletionSending(deleteTargetPost)
        : false}
    onConfirm={handleDeleteConfirm}
    onCancel={handleDeleteCancel}
    contentClass="post-history-delete-confirm"
>
    {#snippet children()}
        <div class="delete-confirm-body">
            <p class="delete-confirm-description">
                {$_("postHistory.deleteRequestDescription")}
            </p>
            <p class="delete-confirm-warning">
                {$_("postHistory.deleteRequestWarning")}
            </p>
            {#if deleteTargetPost}
                <div class="delete-confirm-preview">
                    {buildPreview(deleteTargetPost.content)}
                </div>
            {/if}
        </div>
    {/snippet}
</ConfirmDialog>

<style>
    :global(.post-history-dialog .dialog-content) {
        padding: 0;
    }

    .post-history-heading {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 50px;
        padding: 0 16px;
        border-bottom: 1px solid var(--border-hr);
    }

    .post-history-heading h3 {
        min-width: 0;
        margin: 0;
        font-size: 1.25rem;
    }

    .post-history-search-row {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 8px;
        border-bottom: 1px solid var(--border-hr);
    }

    .post-history-search-input {
        width: 100%;
        min-width: 0;
        padding: 10px 12px;
        border: 1px solid var(--border-soft);
        background: var(--background);
        color: var(--text);
        font: inherit;
    }

    .post-history-search-input::placeholder {
        color: var(--text-muted);
    }

    .post-history-search-summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 16px 0;
        color: var(--text-muted);
        font-size: 0.82rem;
    }

    .post-history-container {
        width: 100%;
        min-height: 100px;
        overflow-y: auto;
    }

    .empty-state {
        display: grid;
        gap: 8px;
        min-height: 100px;
        align-content: center;
    }

    .empty-message {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        color: var(--text-muted);
        font-size: 1rem;
    }

    .status-message {
        margin-left: auto;
        color: var(--text-muted);
        font-size: 0.8rem;
        line-height: 1.3;
        text-align: right;

        :global(.status-loading-placeholder) {
            justify-content: flex-end;
            width: auto;
            column-gap: 0;
        }
    }

    :global(.status-loading-placeholder .loader-container) {
        :global(.square) {
            background: currentColor;
        }
    }

    :global(.status-loading-placeholder .placeholder-text) {
        color: inherit;
        font-size: inherit;
    }

    .status-error {
        color: var(--danger);
    }

    .status-error :global(.status-loading-placeholder .square) {
        background-color: var(--danger);
    }

    .post-history-list {
        width: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .post-history-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--border-hr);
        padding: 8px;
    }

    .post-history-item:last-child {
        border-bottom: none;
    }

    .post-history-item-deleted .post-history-main > :not(.post-meta),
    .post-history-item-deleted .post-meta > :not(.deleted-badge) {
        opacity: 0.65;
    }

    .post-history-main {
        display: flex;
        flex-direction: column;
        flex: 1 1 0;
        min-width: 0;
        gap: 2px;
    }

    .post-preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.3;
    }

    .post-preview-header-actions {
        display: flex;
        align-items: center;
        gap: 2px;
        flex-shrink: 0;
        margin-left: auto;
    }

    .post-preview-header-actions > span {
        white-space: nowrap;
    }

    :global(.menu-trigger) {
        width: 30px;
        height: 30px;
        background: transparent;
        border: none;
        border-radius: 50%;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .more-icon {
        mask-image: url("/icons/ellipsis-vertical-solid-full.svg");
        width: 20px;
        height: 20px;
        background-color: currentColor;
    }

    :global(.post-history-menu-content) {
        background: var(--dialog, #fff);
        color: var(--text, #000);
        border: 1px solid var(--border, #ccc);
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
        padding: 8px;
        min-width: 180px;
        z-index: 102;
        outline: none;
    }

    :global(.post-history-menu-content[data-state="open"]) {
        animation: popover-in 150ms ease-out;
    }

    :global(.post-history-menu-content[data-state="closed"]) {
        animation: popover-out 100ms ease-in;
    }

    .post-history-menu-body {
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: stretch;
    }

    .menu-action-button {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        width: 100%;
        min-height: 40px;
        border: none;
        border-radius: 6px;
        background: transparent;
        color: inherit;
        text-align: left;
        padding: 10px 12px;
        font: inherit;
        cursor: pointer;
    }

    .menu-action-button:hover:not(:disabled) {
        background: color-mix(in srgb, var(--dialog), var(--border) 12%);
    }

    .menu-action-button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }

    .menu-action-button-danger {
        color: var(--danger);
    }

    .menu-action-button .svg-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        min-width: 18px;
        min-height: 18px;
    }

    @keyframes popover-in {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes popover-out {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-4px);
        }
    }

    .post-preview {
        grid-column: 1;
        grid-row: 2;
        min-width: 0;
        color: var(--text);
        font-size: 1rem;
        line-height: 1.5;
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
        mask-image: url("/icons/comments-solid-full.svg");
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

    .post-preview-content {
        padding-left: 1rem;
        overflow-wrap: anywhere;
        white-space: pre-wrap;
        line-height: 1.5;
        word-break: break-word;
    }

    .post-preview-content-collapsed {
        max-height: calc(5 * 1.5em);
        overflow: hidden;
    }

    .post-preview-toggle-button {
        margin: 8px 0 0 1rem;
        border: none;
        background: transparent;
        color: var(--text-muted);
        font: inherit;
        cursor: pointer;
        padding: 0;
        text-align: left;
    }

    .post-preview-toggle-button:hover {
        text-decoration: underline;
    }

    .post-meta {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 6px 10px;
        color: var(--text-muted);
        font-size: 0.82rem;
        line-height: 1.3;
    }

    .deleted-badge {
        padding: 2px 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--theme), transparent 82%);
        color: var(--theme);
        font-weight: 600;
        opacity: 1;
    }

    .delete-failed {
        color: var(--danger);
    }

    .delete-confirm-body {
        display: grid;
        gap: 12px;
        text-align: left;
    }

    .delete-confirm-description,
    .delete-confirm-warning {
        margin: 0;
        line-height: 1.5;
    }

    .delete-confirm-warning {
        color: var(--text-muted);
        font-size: 0.94rem;
    }

    .delete-confirm-preview {
        padding: 10px 12px;
        border: 1px solid var(--border-soft);
        background: var(--background);
        color: var(--text);
        line-height: 1.5;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
    }

    .copy-icon {
        mask-image: url("/icons/copy-solid-full.svg");
    }

    .trash-icon {
        mask-image: url("/icons/trash-can-solid-full.svg");
    }

    .xmark-icon {
        mask-image: url("/icons/xmark-solid-full.svg");
        width: 20px;
        height: 20px;
    }
</style>
