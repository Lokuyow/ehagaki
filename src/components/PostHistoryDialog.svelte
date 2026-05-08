<script lang="ts">
    import type { RxNostr } from "rx-nostr";
    import { _ } from "svelte-i18n";
    import { Dialog } from "bits-ui";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import { ChannelContextService } from "../lib/channelContextService";
    import { RelayConfigUtils } from "../lib/relayConfigUtils";
    import {
        POST_HISTORY_INITIAL_FETCH_LIMIT,
        POST_HISTORY_PAGE_SIZE,
        POST_HISTORY_RELAY_FETCH_LIMIT,
        postHistoryRelayFetchService,
        type PostHistoryRelayFetchTask,
    } from "../lib/postHistoryRelayFetchService";
    import {
        channelMetadataRepository,
        type ChannelMetadataCache,
    } from "../lib/storage/channelMetadataRepository";
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
    const channelContextService = new ChannelContextService();

    type ChannelDisplayState = {
        status: "loading" | "resolved" | "failed";
        name: string | null;
    };

    let posts = $state<PostHistoryRecord[]>([]);
    let copyState = $state<Record<string, "copied" | "failed" | undefined>>({});
    let channelDisplayByEventId = $state<Record<string, ChannelDisplayState>>(
        {},
    );
    let currentPage = $state(1);
    let totalCount = $state(0);
    let syncStatus = $state<
        "idle" | "syncing" | "older-syncing" | "synced" | "failed" | "no-more"
    >("idle");
    let hasMoreRemote = $state(false);
    let nextUntil = $state<number | null>(null);

    let totalPages = $derived(Math.max(1, Math.ceil(totalCount / pageSize)));
    let canGoPrevious = $derived(currentPage > 1);
    let canGoNext = $derived(currentPage < totalPages || hasMoreRemote);
    let showPaging = $derived(totalCount > 0);
    let syncStatusMessageKey = $derived(
        syncStatus === "idle"
            ? null
            : syncStatus === "syncing" || syncStatus === "older-syncing"
              ? "postHistory.syncing"
              : syncStatus === "synced"
                ? "postHistory.synced"
                : syncStatus === "no-more"
                  ? "postHistory.noMorePosts"
                  : "postHistory.syncFailed",
    );
    let showSyncLoader = $derived(
        syncStatus === "syncing" || syncStatus === "older-syncing",
    );

    let loadRequestId = 0;
    let hasStartedInitialSync = false;
    let currentFetchTask: PostHistoryRelayFetchTask | null = null;
    let channelResolutionRequestId = 0;
    let currentChannelAbortController: AbortController | null = null;
    let currentChannelRequestIds: string[] = [];
    const pendingChannelEventIds = new Set<string>();

    function cancelCurrentSync(): void {
        currentFetchTask?.cancel();
        currentFetchTask = null;
    }

    function clearCurrentChannelResolution(): void {
        currentChannelRequestIds.forEach((channelEventId) => {
            pendingChannelEventIds.delete(channelEventId);
        });
        currentChannelRequestIds = [];
        currentChannelAbortController = null;
    }

    function cancelCurrentChannelResolution(): void {
        currentChannelAbortController?.abort();
        clearCurrentChannelResolution();
    }

    function handleClose() {
        cancelCurrentSync();
        cancelCurrentChannelResolution();
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
            cancelCurrentChannelResolution();
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

    $effect(() => {
        if (!show) {
            return;
        }

        cancelCurrentChannelResolution();

        const channelPosts = posts.filter((post) => post.kind === 42);
        if (channelPosts.length === 0) {
            return;
        }

        const channelEventIds = Array.from(
            new Set(
                channelPosts
                    .map((post) => post.channelEventId)
                    .filter(
                        (channelEventId): channelEventId is string =>
                            typeof channelEventId === "string",
                    ),
            ),
        );

        if (channelEventIds.length === 0) {
            return;
        }

        const requestId = ++channelResolutionRequestId;
        void (async () => {
            const cachedRecords = await channelMetadataRepository.getMany(
                channelEventIds,
            );

            if (!show || requestId !== channelResolutionRequestId) {
                return;
            }

            const cachedById = new Map(
                cachedRecords.map((record) => [record.channelEventId, record]),
            );

            channelDisplayByEventId = {
                ...channelDisplayByEventId,
                ...Object.fromEntries(
                    channelEventIds.map((channelEventId) => {
                        const cachedRecord =
                            cachedById.get(channelEventId) ?? null;
                        return [
                            channelEventId,
                            toChannelDisplayState(
                                cachedRecord,
                                !!rxNostr,
                            ) satisfies ChannelDisplayState,
                        ];
                    }),
                ),
            };

            if (!rxNostr) {
                return;
            }

            const refreshTargets = channelEventIds.filter((channelEventId) => {
                const cachedRecord = cachedById.get(channelEventId) ?? null;
                return channelMetadataRepository.shouldRefresh(cachedRecord)
                    && !pendingChannelEventIds.has(channelEventId);
            });

            if (refreshTargets.length === 0) {
                return;
            }

            const abortController = new AbortController();
            currentChannelAbortController = abortController;
            currentChannelRequestIds = [...refreshTargets];
            refreshTargets.forEach((channelEventId) => {
                pendingChannelEventIds.add(channelEventId);
            });

            const resolvedChannels = await Promise.all(
                refreshTargets.map(async (channelEventId) => {
                    const sourcePost = channelPosts.find(
                        (post) => post.channelEventId === channelEventId,
                    );
                    const cachedRecord = cachedById.get(channelEventId) ?? null;
                    const relayHints = buildChannelRelayHints(
                        sourcePost,
                        cachedRecord,
                    );

                    try {
                        const resolvedMetadata =
                            await channelContextService.resolveChannelMetadata(
                                {
                                    eventId: channelEventId,
                                    relayHints,
                                },
                                rxNostr,
                                relayConfig,
                                { signal: abortController.signal },
                            );

                        if (
                            abortController.signal.aborted
                            || currentChannelAbortController !== abortController
                        ) {
                            return null;
                        }

                        const savedRecord =
                            await channelMetadataRepository.upsertResolvedChannel({
                                channelEventId:
                                    resolvedMetadata.channelEventId,
                                name: resolvedMetadata.name,
                                about: resolvedMetadata.about,
                                picture: resolvedMetadata.picture,
                                relays: resolvedMetadata.channelRelays,
                                relayHints: resolvedMetadata.relayHints,
                                ...(resolvedMetadata.creatorPubkey
                                    ? {
                                        creatorPubkey:
                                            resolvedMetadata.creatorPubkey,
                                    }
                                    : {}),
                                ...(typeof resolvedMetadata.createEventCreatedAt ===
                                "number"
                                    ? {
                                        createEventCreatedAt:
                                            resolvedMetadata.createEventCreatedAt,
                                    }
                                    : {}),
                                ...(resolvedMetadata.metadataEventId
                                    ? {
                                        metadataEventId:
                                            resolvedMetadata.metadataEventId,
                                    }
                                    : {}),
                                ...(typeof resolvedMetadata.metadataCreatedAt ===
                                "number"
                                    ? {
                                        metadataCreatedAt:
                                            resolvedMetadata.metadataCreatedAt,
                                    }
                                    : {}),
                            });

                        return {
                            channelEventId,
                            status: savedRecord.name ? "resolved" : "failed",
                            name: savedRecord.name,
                        } satisfies {
                            channelEventId: string;
                        } & ChannelDisplayState;
                    } catch {
                        if (abortController.signal.aborted) {
                            return null;
                        }

                        await channelMetadataRepository.markFetchFailed(
                            channelEventId,
                            Date.now(),
                            relayHints,
                        );

                        return {
                            channelEventId,
                            status: cachedRecord?.name ? "resolved" : "failed",
                            name: cachedRecord?.name ?? null,
                        } satisfies {
                            channelEventId: string;
                        } & ChannelDisplayState;
                    }
                }),
            );

            if (
                !show
                || requestId !== channelResolutionRequestId
                || currentChannelAbortController !== abortController
                || abortController.signal.aborted
            ) {
                return;
            }

            clearCurrentChannelResolution();
            channelDisplayByEventId = {
                ...channelDisplayByEventId,
                ...Object.fromEntries(
                    resolvedChannels
                        .filter(
                            (
                                result,
                            ): result is {
                                channelEventId: string;
                                status: "resolved" | "failed";
                                name: string | null;
                            } => result !== null,
                        )
                        .map((result) => [
                            result.channelEventId,
                            {
                                status: result.status,
                                name: result.name,
                            } satisfies ChannelDisplayState,
                        ]),
                ),
            };
        })();
    });

    function toChannelDisplayState(
        cachedRecord: ChannelMetadataCache | null,
        canLoad: boolean,
    ): ChannelDisplayState {
        if (!cachedRecord) {
            return {
                status: canLoad ? "loading" : "failed",
                name: null,
            };
        }

        return {
            status: cachedRecord.name ? "resolved" : "failed",
            name: cachedRecord.name,
        };
    }

    function buildChannelRelayHints(
        sourcePost: PostHistoryRecord | undefined,
        cachedRecord: ChannelMetadataCache | null,
    ): string[] {
        return RelayConfigUtils.sanitizeExternalRelayUrls(
            [
                ...(sourcePost?.channelRelayHints ?? []),
                ...(cachedRecord?.relayHints ?? []),
                ...(cachedRecord?.relays ?? []),
                ...(sourcePost?.relayHints ?? []),
                ...(sourcePost?.fetchedRelays ?? []),
                ...(sourcePost?.acceptedRelays ?? []),
            ],
            { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
        );
    }

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
        let upsertSummary = {
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
        };
        if (currentFetchTask !== task) {
            return;
        }

        currentFetchTask = null;
        if (!show || result.status === "cancelled") {
            return;
        }

        if (result.events.length > 0) {
            upsertSummary = await postHistoryRepository.upsertFetchedEvents({
                events: result.events,
                fetchedAt: result.fetchedAt,
            });
        }

        if (result.status === "success") {
            hasMoreRemote = result.hasMore && result.nextUntil !== null;
            nextUntil = result.hasMore ? result.nextUntil : null;
        }

        await loadPage(currentPage);
        syncStatus =
            result.status === "success"
                ? upsertSummary.insertedCount + upsertSummary.updatedCount > 0
                    ? "synced"
                    : "idle"
                : "failed";
    }

    function handlePreviousPage(): void {
        if (!canGoPrevious) {
            return;
        }

        currentPage -= 1;
    }

    function handleNextPage(): void {
        void goToNextPage();
    }

    async function goToNextPage(): Promise<void> {
        if (!canGoNext) {
            return;
        }

        const targetPage = currentPage + 1;
        if (targetPage <= totalPages) {
            currentPage = targetPage;
            return;
        }

        const pageReady = await ensurePageAvailable(targetPage);
        if (pageReady) {
            currentPage = targetPage;
            return;
        }

        await loadPage(currentPage);
    }

    async function ensurePageAvailable(targetPage: number): Promise<boolean> {
        if (!pubkeyHex) {
            return false;
        }

        const requiredCount = (targetPage - 1) * pageSize + 1;
        let currentCount =
            await postHistoryRepository.countForPubkey(pubkeyHex);

        if (currentCount >= requiredCount) {
            return true;
        }

        if (!rxNostr || !hasMoreRemote || nextUntil === null) {
            syncStatus = "no-more";
            return false;
        }

        while (
            show &&
            currentCount < requiredCount &&
            hasMoreRemote &&
            nextUntil !== null
        ) {
            cancelCurrentSync();
            syncStatus = "older-syncing";
            let didMateriallyChange = false;

            const task = postHistoryRelayFetchService.fetchLatest(rxNostr, {
                pubkeyHex,
                relayConfig,
                limit: POST_HISTORY_RELAY_FETCH_LIMIT,
                until: nextUntil,
            });
            currentFetchTask = task;

            const result = await task.promise;
            if (currentFetchTask !== task) {
                return false;
            }

            currentFetchTask = null;
            if (!show || result.status === "cancelled") {
                return false;
            }

            if (result.status !== "success") {
                syncStatus = "failed";
                return false;
            }

            hasMoreRemote = result.hasMore && result.nextUntil !== null;
            nextUntil = result.hasMore ? result.nextUntil : null;

            if (result.events.length > 0) {
                const upsertSummary =
                    await postHistoryRepository.upsertFetchedEvents({
                        events: result.events,
                        fetchedAt: result.fetchedAt,
                    });
                didMateriallyChange =
                    upsertSummary.insertedCount + upsertSummary.updatedCount >
                    0;
            }

            currentCount =
                await postHistoryRepository.countForPubkey(pubkeyHex);

            if (currentCount >= requiredCount) {
                syncStatus = didMateriallyChange ? "synced" : "idle";
            }
        }

        if (currentCount >= requiredCount) {
            if (syncStatus === "older-syncing") {
                syncStatus = "idle";
            }
            return true;
        }

        syncStatus = "no-more";
        return false;
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

    function getChannelText(post: PostHistoryRecord): string | null {
        if (post.kind !== 42) {
            return null;
        }

        if (!post.channelEventId) {
            return $_("postHistory.channelUnknown");
        }

        const channelDisplay = channelDisplayByEventId[post.channelEventId];
        if (!channelDisplay || channelDisplay.status === "loading") {
            return $_("postHistory.channelLoading");
        }

        if (channelDisplay.status === "resolved" && channelDisplay.name) {
            return channelDisplay.name;
        }

        return $_("postHistory.channelUnknown");
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
    showPagination={showPaging}
    paginationLabel={$_("postHistory.page", {
        values: { page: currentPage, total: totalPages },
    })}
    previousPageLabel={$_("postHistory.previousPage")}
    nextPageLabel={$_("postHistory.nextPage")}
    {canGoPrevious}
    {canGoNext}
    nextPageLoading={syncStatus === "older-syncing"}
    onPreviousPage={handlePreviousPage}
    onNextPage={handleNextPage}
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
                    showLoader={showSyncLoader}
                    loaderSize={25}
                    state={showSyncLoader ? "loading" : "complete"}
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
                                {#if post.kind === 42}
                                    <div class="post-history-channel-row">
                                        <span
                                            class="channel-icon svg-icon"
                                            aria-hidden="true"
                                        ></span>
                                        <span class="channel-label"
                                            >{$_("postHistory.channel")}:</span
                                        >
                                        <span class="channel-name"
                                            >{getChannelText(post)}</span
                                        >
                                    </div>
                                {/if}
                                <div class="post-preview-content">
                                    {buildPreview(post.content)}
                                </div>
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
        min-height: 50px;
        padding: 0 16px;
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
        display: grid;
        gap: 4px;
        min-width: 0;
        color: var(--text);
        font-size: 1rem;
        line-height: 1.5;
    }

    .post-history-channel-row {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        color: var(--text-muted);
        font-size: 0.82rem;
        line-height: 1.3;
    }

    .channel-icon {
        width: 1em;
        height: 1em;
        flex-shrink: 0;
        mask-image: url("/icons/comments-solid-full.svg");
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
        overflow-wrap: anywhere;
        white-space: pre-wrap;
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
