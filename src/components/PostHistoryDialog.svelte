<script lang="ts">
    import type { RxNostr } from "rx-nostr";
    import { _ } from "svelte-i18n";
    import { Dialog } from "bits-ui";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import {
        POST_HISTORY_INITIAL_FETCH_LIMIT,
        POST_HISTORY_PAGE_SIZE,
        postHistoryRelayFetchService,
        type PostHistoryRelayFetchTask,
    } from "../lib/postHistoryRelayFetchService";
    import { postHistoryRepository } from "../lib/storage/postHistoryRepository";
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

    const pageSize = POST_HISTORY_PAGE_SIZE;

    let posts = $state<PostHistoryRecord[]>([]);
    let copyState = $state<Record<string, "copied" | "failed" | undefined>>({});
    let currentPage = $state(1);
    let totalCount = $state(0);
    let syncStatus = $state<"idle" | "syncing" | "synced" | "failed">("idle");

    let totalPages = $derived(Math.max(1, Math.ceil(totalCount / pageSize)));
    let canGoPrevious = $derived(currentPage > 1);
    let canGoNext = $derived(currentPage < totalPages);
    let showPaging = $derived(totalCount > 0);
    let syncStatusMessageKey = $derived(
        syncStatus === "idle"
            ? null
            : syncStatus === "syncing"
              ? "postHistory.syncing"
              : syncStatus === "synced"
                ? "postHistory.synced"
                : "postHistory.syncFailed",
    );

    let loadRequestId = 0;
    let hasStartedInitialSync = false;
    let currentFetchTask: PostHistoryRelayFetchTask | null = null;

    function cancelCurrentSync(): void {
        currentFetchTask?.cancel();
        currentFetchTask = null;
    }

    function handleClose() {
        cancelCurrentSync();
        show = false;
        onClose?.();
    }

    useDialogHistory(() => show, handleClose, true);

    $effect(() => {
        if (!show) {
            return;
        }

        return () => {
            cancelCurrentSync();
        };
    });

    $effect(() => {
        if (!show || !pubkeyHex || !rxNostr || hasStartedInitialSync) {
            return;
        }

        hasStartedInitialSync = true;
        syncStatus = "syncing";
        void syncFromRelays();
    });

    $effect(() => {
        if (!show) {
            return;
        }

        void loadPage(currentPage);
    });

    async function loadPage(page: number): Promise<void> {
        if (!pubkeyHex) {
            posts = [];
            totalCount = 0;
            return;
        }

        const requestId = ++loadRequestId;
        const normalizedPage = Math.max(1, Math.trunc(page));
        const [count, loadedPosts] = await Promise.all([
            postHistoryRepository.countForPubkey(pubkeyHex),
            postHistoryRepository.getPage({
                pubkeyHex,
                page: normalizedPage,
                pageSize,
            }),
        ]);

        if (!show || requestId !== loadRequestId) {
            return;
        }

        const nextTotalPages = Math.max(1, Math.ceil(count / pageSize));
        const safePage =
            count === 0 ? 1 : Math.min(normalizedPage, nextTotalPages);
        if (safePage !== normalizedPage) {
            currentPage = safePage;
            return;
        }

        totalCount = count;
        posts = loadedPosts;
    }

    async function syncFromRelays(): Promise<void> {
        if (!pubkeyHex || !rxNostr) {
            return;
        }

        cancelCurrentSync();
        const task = postHistoryRelayFetchService.fetchLatest(rxNostr, {
            pubkeyHex,
            relayConfig,
            limit: POST_HISTORY_INITIAL_FETCH_LIMIT,
        });
        currentFetchTask = task;

        const result = await task.promise;
        if (currentFetchTask !== task) {
            return;
        }

        currentFetchTask = null;
        if (!show || result.status === "cancelled") {
            return;
        }

        if (result.events.length > 0) {
            await postHistoryRepository.upsertFetchedEvents({
                events: result.events,
                fetchedAt: result.fetchedAt,
            });
        }

        await loadPage(currentPage);
        syncStatus = result.status === "success" ? "synced" : "failed";
    }

    function handlePreviousPage(): void {
        if (!canGoPrevious) {
            return;
        }

        currentPage -= 1;
    }

    function handleNextPage(): void {
        if (!canGoNext) {
            return;
        }

        currentPage += 1;
    }

    function formatPostedAt(postedAt: number): string {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(postedAt));
    }

    function buildPreview(content: string): string {
        const normalized = content.replace(/\s+/g, " ").trim();
        return normalized || " ";
    }

    function getMediaText(post: PostHistoryRecord): string {
        if (post.media.length === 0) return `${$_("postHistory.media")}: 0`;

        const imageCount = post.media.filter((item) =>
            item.mimeType?.startsWith("image/"),
        ).length;
        const videoCount = post.media.filter((item) =>
            item.mimeType?.startsWith("video/"),
        ).length;
        const otherCount = post.media.length - imageCount - videoCount;
        const parts = [
            imageCount > 0 ? `image ${imageCount}` : "",
            videoCount > 0 ? `video ${videoCount}` : "",
            otherCount > 0 ? `media ${otherCount}` : "",
        ].filter(Boolean);

        return `${$_("postHistory.media")}: ${parts.join(", ")}`;
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
</script>

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("postHistory.title")}
    description={$_("postHistory.description")}
    contentClass="post-history-dialog"
    footerVariant="close-button"
    initialFocus="content"
>
    <div class="post-history-heading">
        <h3>{$_("postHistory.title")}</h3>
        {#if syncStatusMessageKey}
            <div
                class="status-message"
                class:status-error={syncStatus === "failed"}
            >
                <LoadingPlaceholder
                    text={$_(syncStatusMessageKey)}
                    showLoader={true}
                    state={syncStatus === "syncing" ? "loading" : "complete"}
                    customClass="status-loading-placeholder"
                />
            </div>
        {/if}
    </div>

    <div class="post-history-container">
        {#if posts.length === 0}
            <div class="empty-state">
                <div class="empty-message">{$_("postHistory.empty")}</div>
            </div>
        {:else}
            <ul class="post-history-list">
                {#each posts as post (post.eventId)}
                    <li class="post-history-item">
                        <div class="post-history-main">
                            <div class="post-preview-header">
                                <span>{formatPostedAt(post.postedAt)}</span>
                            </div>
                            <div class="post-preview">
                                {buildPreview(post.content)}
                            </div>
                            <div class="post-meta">
                                <span>{getMediaText(post)}</span>
                                {#if post.deletedAt}
                                    <span>{$_("postHistory.deleted")}</span>
                                {/if}
                            </div>
                        </div>
                        <div class="post-history-actions">
                            {#if copyState[post.eventId]}
                                <span
                                    class:copy-failed={copyState[
                                        post.eventId
                                    ] === "failed"}
                                >
                                    {copyState[post.eventId] === "copied"
                                        ? $_("postHistory.copied")
                                        : $_("postHistory.copyFailed")}
                                </span>
                            {/if}
                            <Button
                                className="copy-nevent-button"
                                variant="default"
                                shape="circle"
                                ariaLabel={$_("postHistory.copyNevent")}
                                onClick={() => void handleCopyNevent(post)}
                            >
                                <div class="copy-icon svg-icon"></div>
                            </Button>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}

        {#if showPaging}
            <div class="post-history-pagination">
                <Button
                    className="post-history-page-button"
                    variant="default"
                    shape="pill"
                    disabled={!canGoPrevious}
                    ariaLabel={$_("postHistory.previousPage")}
                    onClick={handlePreviousPage}
                >
                    <span class="btn-text"
                        >{$_("postHistory.previousPage")}</span
                    >
                </Button>

                <div class="post-history-page-indicator">
                    {$_("postHistory.page", {
                        values: { page: currentPage, total: totalPages },
                    })}
                </div>

                <Button
                    className="post-history-page-button"
                    variant="default"
                    shape="pill"
                    disabled={!canGoNext}
                    ariaLabel={$_("postHistory.nextPage")}
                    onClick={handleNextPage}
                >
                    <span class="btn-text">{$_("postHistory.nextPage")}</span>
                </Button>
            </div>
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

<style>
    :global(.post-history-dialog .dialog-content) {
        padding: 0;
    }

    .post-history-heading {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 18px 16px;
        border-bottom: 1px solid var(--border-hr);
    }

    .post-history-heading h3 {
        min-width: 0;
        margin: 0;
        font-size: 1.25rem;
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
        }
    }

    :global(.status-loading-placeholder .loader-container) {
        width: 20px;
        height: 20px;
        flex: 0 0 20px;

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
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: auto auto auto;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid var(--border-hr);
        padding: 12px;
    }

    .post-history-item:last-child {
        border-bottom: none;
    }

    .post-history-main {
        display: contents;
        min-width: 0;
    }

    .post-preview-header {
        display: flex;
        grid-column: 1 / -1;
        grid-row: 1;
        justify-content: flex-end;
        color: var(--text-muted);
        font-size: 0.78rem;
        line-height: 1.3;
    }

    .post-preview {
        grid-column: 1;
        grid-row: 2;
        min-width: 0;
        overflow-wrap: anywhere;
        white-space: pre-wrap;
        color: var(--text);
        font-size: 1rem;
        line-height: 1.5;
    }

    .post-meta {
        display: flex;
        grid-column: 1;
        grid-row: 3;
        flex-wrap: wrap;
        gap: 6px 10px;
        color: var(--text-muted);
        font-size: 0.82rem;
        line-height: 1.3;
    }

    .post-history-actions {
        display: flex;
        grid-column: 2;
        grid-row: 2 / 4;
        align-items: center;
        gap: 6px;
        color: var(--text-muted);
        font-size: 0.82rem;
        flex-shrink: 0;
    }

    .copy-failed {
        color: var(--danger);
    }

    .post-history-pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px;
        border-top: 1px solid var(--border-hr);
    }

    .post-history-page-indicator {
        color: var(--text-muted);
        font-size: 0.82rem;
        text-align: center;
        white-space: nowrap;
    }

    :global(.post-history-page-button) {
        min-width: 88px;
        min-height: 40px;
    }

    :global(.copy-nevent-button) {
        width: 44px;
        min-height: 44px;
        --btn-bg: var(--dialog);
    }

    .copy-icon {
        mask-image: url("/icons/copy-solid-full.svg");
    }

    .xmark-icon {
        mask-image: url("/icons/xmark-solid-full.svg");
        width: 20px;
        height: 20px;
    }
</style>
