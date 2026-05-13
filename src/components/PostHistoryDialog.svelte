<script lang="ts">
    import type { RxNostr } from "rx-nostr";
    import { tick } from "svelte";
    import { _ } from "svelte-i18n";
    import { Dialog, Popover } from "bits-ui";
    import Button from "./Button.svelte";
    import ConfirmDialog from "./ConfirmDialog.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import ImageFullscreen from "./ImageFullscreen.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PostHistoryMediaList from "./PostHistoryMediaList.svelte";
    import PostHistoryPreviewContent from "./PostHistoryPreviewContent.svelte";
    import { usePostHistoryChannelDisplay } from "../lib/hooks/usePostHistoryChannelDisplay.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import { usePostHistoryListing } from "../lib/hooks/usePostHistoryListing.svelte";
    import { usePostHistoryPreviewCollapse } from "../lib/hooks/usePostHistoryPreviewCollapse.svelte";
    import {
        preloadCustomEmojiImageWithMeta,
        type PreloadedCustomEmojiImageResult,
    } from "../lib/customEmoji";
    import {
        canRequestPostDeletion,
        postDeletionService,
    } from "../lib/postDeletionService";
    import {
        buildPreviewContent,
        formatPostedAt,
        type PostHistoryPreviewContent as PostHistoryPreviewContentData,
    } from "../lib/postHistoryDialogUtils";
    import { POST_HISTORY_PAGE_SIZE } from "../lib/postHistoryRelayFetchService";
    import { customEmojiImageMetaRepository } from "../lib/storage/customEmojiImageMetaRepository";
    import type {
        CustomEmojiImageMetaRecord,
        PostHistoryRecord,
    } from "../lib/storage/ehagakiDb";
    import type { FullscreenMediaItem, RelayConfig } from "../lib/types";
    import { tryCopyToClipboard } from "../lib/utils/clipboardUtils";
    import { toNevent } from "../lib/utils/nostrUtils";

    import { writeRelaysStore } from "../stores/relayStore.svelte";

    type EmojiImageMetaSnapshot = Pick<
        CustomEmojiImageMetaRecord,
        "url" | "width" | "height" | "aspectRatio"
    >;

    type PostHistoryUtilityPanel = "none" | "search" | "jump-date";

    interface Props {
        show: boolean;
        onClose: () => void;
        onReplyPost?: (post: PostHistoryRecord) => void;
        onQuotePost?: (post: PostHistoryRecord) => void;
        pubkeyHex?: string | null;
        rxNostr?: RxNostr;
        relayConfig?: RelayConfig | null;
    }

    let {
        show = $bindable(false),
        onClose,
        onReplyPost = undefined,
        onQuotePost = undefined,
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
    let localHistoryDeleteConfirmOpen = $state(false);
    let isDeletingLocalHistory = $state(false);
    let activeUtilityPanel = $state<PostHistoryUtilityPanel>("none");
    let jumpDateInput = $state("");
    let headingMenuOpen = $state(false);
    let postMenuOpenState = $state<Record<string, boolean>>({});
    let deleteRequestState = $state<
        Record<string, "sending" | "failed" | undefined>
    >({});
    let emojiLoadStateByUrl = $state<
        Record<string, "loading" | "ready" | "failed" | undefined>
    >({});
    let emojiImageMetaByUrl = $state<
        Record<string, EmojiImageMetaSnapshot | undefined>
    >({});
    let fullscreenMediaItems = $state<FullscreenMediaItem[]>([]);
    let fullscreenIndex = $state(-1);
    let showImageFullscreen = $state(false);
    let historyContainer = $state<HTMLDivElement | null>(null);
    const loadingEmojiUrls = new Set<string>();
    const previewCollapse = usePostHistoryPreviewCollapse({
        getShow: () => show,
        getPosts: () => history.posts,
        getContainer: () => historyContainer,
    });
    let previewContentByEventId = $derived.by(() => {
        const nextContent: Record<string, PostHistoryPreviewContentData> = {};

        for (const post of history.posts) {
            nextContent[post.eventId] = buildPreviewContent(post);
        }

        return nextContent;
    });
    let headingStatusMessageKey = $derived(
        history.currentViewRefetchStatusMessageKey ??
            history.syncStatusMessageKey,
    );
    let headingStatusMessageValues = $derived(
        history.currentViewRefetchStatusMessageKey
            ? history.currentViewRefetchStatusMessageValues
            : null,
    );
    let headingStatusError = $derived(
        history.syncStatus === "failed" ||
            history.currentViewRefetchStatusMessageKey ===
                "postHistory.repairPartialFailure",
    );
    let dialogEmojiUrls = $derived.by(() => {
        const urls = new Set<string>();

        for (const previewContent of Object.values(previewContentByEventId)) {
            for (const url of previewContent.emojiUrls) {
                urls.add(url);
            }
        }

        return [...urls];
    });

    function resetDialogState(): void {
        copyState = {};
        deleteConfirmOpen = false;
        deleteTargetPost = null;
        localHistoryDeleteConfirmOpen = false;
        isDeletingLocalHistory = false;
        activeUtilityPanel = "none";
        jumpDateInput = "";
        headingMenuOpen = false;
        deleteRequestState = {};
        emojiLoadStateByUrl = {};
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
        showImageFullscreen = false;
        loadingEmojiUrls.clear();
    }

    function handleClose() {
        history.cancelCurrentSync();
        history.cancelCurrentViewRefetch();
        channelDisplay.cancelCurrentChannelResolution();
        deleteConfirmOpen = false;
        deleteTargetPost = null;
        localHistoryDeleteConfirmOpen = false;
        headingMenuOpen = false;
        showImageFullscreen = false;
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
        show = false;
        onClose?.();
    }

    function isFullscreenViewerTarget(target: EventTarget | null): boolean {
        return (
            target instanceof Element &&
            target.closest(".ehagaki-pswp") !== null
        );
    }

    function handleDialogInteractOutside(event: PointerEvent): void {
        if (isFullscreenViewerTarget(event.target)) {
            event.preventDefault();
        }
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

    $effect(() => {
        if (!show) {
            return;
        }

        void hydratePostHistoryEmojiImageMeta(dialogEmojiUrls);
    });

    $effect(() => {
        if (!show) {
            return;
        }

        const pendingUrls = syncEmojiLoadState(dialogEmojiUrls);
        for (const url of pendingUrls) {
            void loadPostHistoryEmoji(url);
        }
    });

    $effect(() => {
        if (!show) {
            return;
        }

        emojiLoadStateByUrl;
        emojiImageMetaByUrl;
        void previewCollapse.remeasure();
    });

    function resetHistoryScrollPosition(): void {
        if (historyContainer) {
            historyContainer.scrollTop = 0;
        }
    }

    function resetHistoryScrollToBottomPosition(): void {
        if (historyContainer) {
            historyContainer.scrollTop = historyContainer.scrollHeight;
        }
    }

    function formatDateRangeValue(createdAt: number | null): string | null {
        if (typeof createdAt !== "number") {
            return null;
        }

        const date = new Date(createdAt * 1000);
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");
        return `${year}/${month}/${day}`;
    }

    function buildVisibleRangeLabel(): string | null {
        const from = formatDateRangeValue(history.visibleNewestCreatedAt);
        const to = formatDateRangeValue(history.visibleOldestCreatedAt);
        if (!from || !to) {
            return null;
        }

        return $_("postHistory.visibleRange", {
            values: { from, to },
        });
    }

    function buildVisibleCountLabel(): string | null {
        if (history.displayTotalCount <= 0 || history.visiblePostCount <= 0) {
            return null;
        }

        return $_(
            history.isSearchMode
                ? "postHistory.searchCountSummary"
                : "postHistory.visibleCountSummary",
            {
                values: {
                    visible: history.visiblePostCount,
                    total: history.displayTotalCount,
                },
            },
        );
    }

    function parseDateInputToCreatedAt(value: string): number | null {
        const [yearText, monthText, dayText] = value.split("-");
        const year = Number(yearText);
        const month = Number(monthText);
        const day = Number(dayText);

        if (
            !Number.isFinite(year) ||
            !Number.isFinite(month) ||
            !Number.isFinite(day)
        ) {
            return null;
        }

        const date = new Date(year, month - 1, day, 23, 59, 59, 999);
        const time = date.getTime();
        return Number.isFinite(time) ? Math.floor(time / 1000) : null;
    }

    function resetHistoryScrollSoon(): void {
        void tick().then(() => {
            if (!show) {
                return;
            }

            resetHistoryScrollPosition();
        });
    }

    function resetHistoryScrollToBottomSoon(): void {
        void tick().then(() => {
            if (!show) {
                return;
            }

            resetHistoryScrollToBottomPosition();
        });
    }

    function getLoadOlderLabel(): string {
        return $_(
            history.isSearchMode
                ? "postHistory.loadOlderSearchResults"
                : "postHistory.loadOlder",
        );
    }

    function getLoadNewerLabel(): string {
        return $_(
            history.isSearchMode
                ? "postHistory.loadNewerSearchResults"
                : "postHistory.loadNewer",
        );
    }

    async function handleLoadOlder(): Promise<void> {
        await history.loadOlder();
    }

    async function handleLoadNewer(): Promise<void> {
        const changed = await history.loadNewer();
        if (changed) {
            resetHistoryScrollSoon();
        }
    }

    async function handleReturnToLatest(): Promise<void> {
        const changed = await history.returnToLatest();
        if (changed) {
            resetHistoryScrollSoon();
        }
    }

    async function handleJumpToDateSubmit(): Promise<void> {
        const createdAt = parseDateInputToCreatedAt(jumpDateInput);
        if (createdAt === null) {
            return;
        }

        const changed = await history.jumpToCreatedAt(createdAt);
        if (changed) {
            activeUtilityPanel = "none";
            resetHistoryScrollSoon();
        }
    }

    function getPreviewContent(
        post: PostHistoryRecord,
    ): PostHistoryPreviewContentData {
        return (
            previewContentByEventId[post.eventId] ?? buildPreviewContent(post)
        );
    }

    function syncEmojiLoadState(urls: string[]): string[] {
        const nextState: Record<
            string,
            "loading" | "ready" | "failed" | undefined
        > = {};

        for (const url of urls) {
            if (loadingEmojiUrls.has(url)) {
                nextState[url] = "loading";
                continue;
            }

            const currentState = emojiLoadStateByUrl[url];
            if (currentState === "ready" || currentState === "failed") {
                nextState[url] = currentState;
            }
        }

        const pendingUrls = urls.filter((url) => !nextState[url]);
        for (const url of pendingUrls) {
            loadingEmojiUrls.add(url);
            nextState[url] = "loading";
        }

        if (!hasSameEmojiLoadState(emojiLoadStateByUrl, nextState)) {
            emojiLoadStateByUrl = nextState;
        }

        return pendingUrls;
    }

    function toEmojiImageMetaSnapshot(
        record: Pick<
            CustomEmojiImageMetaRecord,
            "url" | "width" | "height" | "aspectRatio"
        >,
    ): EmojiImageMetaSnapshot {
        return {
            url: record.url,
            width: record.width,
            height: record.height,
            aspectRatio: record.aspectRatio,
        };
    }

    function hasResolvedEmojiImageMeta(
        result: PreloadedCustomEmojiImageResult,
    ): result is PreloadedCustomEmojiImageResult & {
        width: number;
        height: number;
        aspectRatio: number;
    } {
        return (
            Number.isSafeInteger(result.width) &&
            Number.isSafeInteger(result.height) &&
            (result.width ?? 0) > 0 &&
            (result.height ?? 0) > 0 &&
            Number.isFinite(result.aspectRatio) &&
            (result.aspectRatio ?? 0) > 0
        );
    }

    function upsertEmojiImageMetaSnapshots(
        snapshots: Record<string, EmojiImageMetaSnapshot>,
    ): void {
        let changed = false;
        const nextState = { ...emojiImageMetaByUrl };

        for (const [url, snapshot] of Object.entries(snapshots)) {
            const current = nextState[url];
            if (
                current?.width === snapshot.width &&
                current?.height === snapshot.height &&
                current?.aspectRatio === snapshot.aspectRatio
            ) {
                continue;
            }

            nextState[url] = snapshot;
            changed = true;
        }

        if (changed) {
            emojiImageMetaByUrl = nextState;
        }
    }

    async function hydratePostHistoryEmojiImageMeta(
        urls: string[],
    ): Promise<void> {
        if (urls.length === 0) {
            return;
        }

        try {
            const records = await customEmojiImageMetaRepository.getMany(urls);
            const foundUrls = Object.keys(records);
            if (foundUrls.length === 0) {
                return;
            }

            upsertEmojiImageMetaSnapshots(
                Object.fromEntries(
                    foundUrls.map((url) => [
                        url,
                        toEmojiImageMetaSnapshot(records[url]),
                    ]),
                ) as Record<string, EmojiImageMetaSnapshot>,
            );
            void customEmojiImageMetaRepository.touchMany(foundUrls);
        } catch {
            // Metadata hydration is an optimization for layout stability.
        }
    }

    async function persistPostHistoryEmojiImageMeta(input: {
        url: string;
        width: number;
        height: number;
    }): Promise<void> {
        try {
            await customEmojiImageMetaRepository.upsert(input);
        } catch {
            // Metadata persistence should never break rendering.
        }
    }

    async function loadPostHistoryEmoji(url: string): Promise<void> {
        const result = await preloadCustomEmojiImageWithMeta(url);
        loadingEmojiUrls.delete(url);

        if (!dialogEmojiUrls.includes(url)) {
            return;
        }

        if (result.ready && hasResolvedEmojiImageMeta(result)) {
            upsertEmojiImageMetaSnapshots({
                [url]: toEmojiImageMetaSnapshot({
                    url,
                    width: result.width,
                    height: result.height,
                    aspectRatio: result.aspectRatio,
                }),
            });
            void persistPostHistoryEmojiImageMeta({
                url,
                width: result.width,
                height: result.height,
            });
        }

        const nextState = result.ready ? "ready" : "failed";
        if (emojiLoadStateByUrl[url] === nextState) {
            return;
        }

        emojiLoadStateByUrl = {
            ...emojiLoadStateByUrl,
            [url]: nextState,
        };
    }

    function hasSameEmojiLoadState(
        left: Record<string, "loading" | "ready" | "failed" | undefined>,
        right: Record<string, "loading" | "ready" | "failed" | undefined>,
    ): boolean {
        const leftKeys = Object.keys(left);
        const rightKeys = Object.keys(right);
        if (leftKeys.length !== rightKeys.length) {
            return false;
        }

        return leftKeys.every((key) => left[key] === right[key]);
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

        closeAllPostItemMenus();
        deleteTargetPost = post;
        deleteConfirmOpen = true;
    }

    function setPostMenuOpen(postEventId: string, open: boolean): void {
        postMenuOpenState = {
            ...postMenuOpenState,
            [postEventId]: open,
        };
    }

    function closeAllPostItemMenus(): void {
        if (Object.keys(postMenuOpenState).length > 0) {
            postMenuOpenState = {};
        }
    }

    function handleReplyPost(post: PostHistoryRecord): void {
        if (!onReplyPost) {
            return;
        }

        onReplyPost(post);
        handleClose();
    }

    function handleQuotePost(post: PostHistoryRecord): void {
        if (!onQuotePost) {
            return;
        }

        onQuotePost(post);
        handleClose();
    }

    function handleDeleteCancel(): void {
        deleteConfirmOpen = false;
        deleteTargetPost = null;
    }

    function showSearch(): void {
        activeUtilityPanel = "search";
        headingMenuOpen = false;
    }

    function hideSearch(): void {
        activeUtilityPanel = "none";
        history.resetSearchState();
    }

    function showJumpDate(): void {
        activeUtilityPanel = "jump-date";
        headingMenuOpen = false;
    }

    function openLocalHistoryDeleteConfirm(): void {
        localHistoryDeleteConfirmOpen = true;
        headingMenuOpen = false;
    }

    function handleRefetchAroundCurrentViewFromMenu(): void {
        headingMenuOpen = false;
        void history.refetchAroundCurrentView();
    }

    function handleJumpToOldestFromMenu(): void {
        headingMenuOpen = false;
        void history.jumpToOldest().then((changed) => {
            if (changed) {
                resetHistoryScrollToBottomSoon();
            }
        });
    }

    function handleReturnToLatestFromMenu(): void {
        headingMenuOpen = false;
        void handleReturnToLatest();
    }

    function handleLocalHistoryDeleteCancel(): void {
        localHistoryDeleteConfirmOpen = false;
    }

    function handleImageOpen(params: {
        index: number;
        mediaList: FullscreenMediaItem[];
    }): void {
        fullscreenMediaItems = params.mediaList;
        fullscreenIndex = params.index;
        showImageFullscreen = params.mediaList.length > 0 && params.index >= 0;
    }

    function handleFullscreenNavigate(index: number): void {
        fullscreenIndex = index;
    }

    function handleFullscreenClose(): void {
        showImageFullscreen = false;
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
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

    async function handleLocalHistoryDeleteConfirm(): Promise<void> {
        if (isDeletingLocalHistory) {
            return;
        }

        isDeletingLocalHistory = true;
        try {
            const deleted = await history.deleteLocalHistory();
            if (deleted) {
                localHistoryDeleteConfirmOpen = false;
                activeUtilityPanel = "none";
                resetHistoryScrollPosition();
            }
        } finally {
            isDeletingLocalHistory = false;
        }
    }
</script>

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    onInteractOutside={handleDialogInteractOutside}
    trapFocus={false}
    title={$_("postHistory.title")}
    description={$_("postHistory.description")}
    contentClass="post-history-dialog"
    footerVariant="close-button"
    showPagination={false}
    initialFocus="content"
>
    <div class="post-history-heading">
        <div class="post-history-heading-top">
            <div class="post-history-heading-main">
                <h3>{$_("postHistory.title")}</h3>
            </div>
            <div class="post-history-heading-actions">
                {#if headingStatusMessageKey}
                    <LoadingPlaceholder
                        text={headingStatusMessageValues
                            ? $_(headingStatusMessageKey, {
                                  values: headingStatusMessageValues,
                              })
                            : $_(headingStatusMessageKey)}
                        showLoader={history.showStatusLoader}
                        loaderSize={25}
                        state={history.showStatusLoader
                            ? "loading"
                            : "complete"}
                        customClass={`status-loading-placeholder${
                            headingStatusError ? " status-error" : ""
                        }`}
                    />
                {/if}
                <Popover.Root bind:open={headingMenuOpen}>
                    <Popover.Trigger
                        class="menu-trigger post-history-heading-menu-trigger"
                        aria-label={$_("postHistory.openMenu")}
                    >
                        <div class="more-icon svg-icon"></div>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content
                            side="bottom"
                            align="end"
                            sideOffset={8}
                            class="post-history-menu-content"
                            trapFocus={false}
                            onCloseAutoFocus={(event: Event) =>
                                event.preventDefault()}
                        >
                            <div class="post-history-menu-body">
                                <button
                                    type="button"
                                    class="menu-action-button"
                                    disabled={!history.canReturnToLatest}
                                    onclick={handleReturnToLatestFromMenu}
                                >
                                    <div
                                        class="return-to-latest-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                    <span
                                        >{$_(
                                            "postHistory.returnToLatest",
                                        )}</span
                                    >
                                </button>
                                <button
                                    type="button"
                                    class="menu-action-button"
                                    onclick={showSearch}
                                >
                                    <div
                                        class="search-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                    <span>{$_("postHistory.showSearch")}</span>
                                </button>
                                <button
                                    type="button"
                                    class="menu-action-button"
                                    onclick={showJumpDate}
                                >
                                    <div
                                        class="calendar-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                    <span>{$_("postHistory.jumpToDate")}</span>
                                </button>
                                <button
                                    type="button"
                                    class="menu-action-button"
                                    disabled={!history.canRefetchAroundCurrentView}
                                    onclick={handleRefetchAroundCurrentViewFromMenu}
                                >
                                    <div
                                        class="repair-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                    <span>
                                        {history.isRefetchingAroundCurrentView
                                            ? $_("postHistory.repairing")
                                            : $_("postHistory.repair")}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    class="menu-action-button"
                                    disabled={!history.canJumpToOldest}
                                    onclick={handleJumpToOldestFromMenu}
                                >
                                    <div
                                        class="jump-to-oldest-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                    <span>
                                        {$_("postHistory.jumpToOldest")}
                                    </span>
                                </button>
                                <div
                                    class="post-history-menu-separator"
                                    role="separator"
                                ></div>
                                <button
                                    type="button"
                                    class="menu-action-button menu-action-button-danger"
                                    onclick={openLocalHistoryDeleteConfirm}
                                >
                                    <div
                                        class="trash-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                    <span
                                        >{$_(
                                            "postHistory.deleteLocalHistory",
                                        )}</span
                                    >
                                </button>
                            </div>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            </div>
        </div>
        {#if history.posts.length > 0}
            <div class="post-history-heading-summary">
                <div class="post-history-summary-row">
                    {#if buildVisibleRangeLabel()}
                        <span
                            class="post-history-summary-line post-history-summary-range"
                        >
                            {buildVisibleRangeLabel()}
                        </span>
                    {/if}
                    {#if buildVisibleCountLabel()}
                        <span
                            class="post-history-summary-line post-history-summary-count"
                        >
                            {buildVisibleCountLabel()}
                        </span>
                    {/if}
                </div>
            </div>
        {/if}
    </div>

    {#if activeUtilityPanel === "search"}
        <div
            class="post-history-search-row"
            class:post-history-search-active={history.isSearchMode}
        >
            <input
                bind:value={history.state.searchInput}
                class="post-history-search-input"
                type="search"
                placeholder={$_("postHistory.searchPlaceholder")}
                aria-label={$_("postHistory.search")}
            />
            <Button
                type="button"
                class="post-history-search-close"
                contentLayout="icon"
                shape="circle"
                ariaLabel={$_("postHistory.hideSearch")}
                onClick={hideSearch}
            >
                <div class="xmark-icon svg-icon" aria-hidden="true"></div>
            </Button>
        </div>
    {/if}

    {#if activeUtilityPanel === "jump-date"}
        <div class="post-history-utility-panel">
            <label
                class="post-history-utility-label"
                for="post-history-jump-date"
            >
                {$_("postHistory.jumpToDateLabel")}
            </label>
            <div class="post-history-utility-controls">
                <input
                    id="post-history-jump-date"
                    bind:value={jumpDateInput}
                    class="post-history-date-input"
                    type="date"
                    aria-label={$_("postHistory.jumpToDateLabel")}
                />
                <Button
                    type="button"
                    className="post-history-utility-button"
                    onClick={() => void handleJumpToDateSubmit()}
                >
                    {$_("postHistory.jumpToDateSubmit")}
                </Button>
                <Button
                    type="button"
                    className="post-history-utility-button"
                    onClick={() => (activeUtilityPanel = "none")}
                >
                    {$_("common.cancel")}
                </Button>
            </div>
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
            {#if history.canLoadNewer}
                <div class="post-history-nav-row post-history-nav-row-top">
                    <Button
                        type="button"
                        className="post-history-nav-button"
                        onClick={() => void handleLoadNewer()}
                    >
                        {getLoadNewerLabel()}
                    </Button>
                </div>
            {/if}
            <ul class="post-history-list">
                {#each history.posts as post (post.eventId)}
                    <li
                        class="post-history-item"
                        class:post-history-item-deleted={!!post.deletedAt}
                    >
                        <div class="post-history-main">
                            <div class="post-preview">
                                {#if post.kind === 42 || post.deletedAt || hasDeletionFailed(post) || !(onReplyPost || onQuotePost || previewCollapse.shouldCollapsePost(post))}
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
                                                    >{channelDisplay.getChannelText(
                                                        post,
                                                        $_,
                                                    )}</span
                                                >
                                            </div>
                                        {/if}
                                        <div class="post-preview-header-right">
                                            {#if post.deletedAt || hasDeletionFailed(post)}
                                                <div class="post-meta-inline">
                                                    {#if post.deletedAt}
                                                        <span
                                                            class="deleted-badge"
                                                            >{$_(
                                                                "postHistory.deletedBadge",
                                                            )}</span
                                                        >
                                                    {/if}
                                                    {#if hasDeletionFailed(post)}
                                                        <span
                                                            class="delete-failed"
                                                            >{$_(
                                                                "postHistory.deleteFailed",
                                                            )}</span
                                                        >
                                                    {/if}
                                                </div>
                                            {/if}
                                            {#if !(onReplyPost || onQuotePost || previewCollapse.shouldCollapsePost(post))}
                                                <span
                                                    >{formatPostedAt(
                                                        post.postedAt,
                                                    )}</span
                                                >
                                                <Popover.Root
                                                    open={postMenuOpenState[
                                                        post.eventId
                                                    ] ?? false}
                                                    onOpenChange={(open) =>
                                                        setPostMenuOpen(
                                                            post.eventId,
                                                            open,
                                                        )}
                                                >
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
                                                            ) =>
                                                                event.preventDefault()}
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
                                                                            post
                                                                                .eventId
                                                                        ] ===
                                                                        "copied"
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
                                            {/if}
                                        </div>
                                    </div>
                                {/if}
                                <div class="post-preview-body">
                                    <div class="post-preview-content">
                                        <PostHistoryPreviewContent
                                            previewContent={getPreviewContent(
                                                post,
                                            )}
                                            {emojiLoadStateByUrl}
                                            {emojiImageMetaByUrl}
                                            previewCollapseAction={previewCollapse.previewRef}
                                            previewCollapseEventId={post.eventId}
                                            previewContentId={"post-preview-content-" +
                                                post.eventId}
                                            isCollapsed={!previewCollapse.isPostExpanded(
                                                post,
                                            ) &&
                                                previewCollapse.shouldCollapsePost(
                                                    post,
                                                )}
                                        />
                                    </div>
                                    {#if previewCollapse.shouldCollapsePost(post)}
                                        <div class="post-preview-toggle-row">
                                            <Button
                                                type="button"
                                                class="post-preview-action-button post-preview-toggle-button"
                                                aria-expanded={previewCollapse.isPostExpanded(
                                                    post,
                                                )}
                                                aria-controls={"post-preview-content-" +
                                                    post.eventId}
                                                onClick={() =>
                                                    previewCollapse.togglePostExpanded(
                                                        post.eventId,
                                                    )}
                                            >
                                                {previewCollapse.isPostExpanded(
                                                    post,
                                                )
                                                    ? $_("postHistory.collapse")
                                                    : $_("postHistory.expand")}
                                            </Button>
                                        </div>
                                    {/if}
                                    {#if post.media.length > 0}
                                        <div class="post-preview-media">
                                            <PostHistoryMediaList
                                                media={post.media}
                                                scrollRoot={historyContainer}
                                                onImageOpen={handleImageOpen}
                                            />
                                        </div>
                                    {/if}
                                </div>
                                {#if onReplyPost || onQuotePost || previewCollapse.shouldCollapsePost(post)}
                                    <div class="post-preview-footer">
                                        <div class="post-preview-footer-left">
                                            <span class="post-preview-date">
                                                {formatPostedAt(post.postedAt)}
                                            </span>
                                        </div>
                                        <div
                                            class="post-preview-footer-actions"
                                        >
                                            {#if onReplyPost}
                                                <Button
                                                    type="button"
                                                    class="post-preview-action-button"
                                                    ariaLabel={$_(
                                                        "replyQuote.reply_label",
                                                    )}
                                                    contentLayout="icon"
                                                    shape="circle"
                                                    onClick={() =>
                                                        handleReplyPost(post)}
                                                >
                                                    <div
                                                        class="reply-icon svg-icon"
                                                        aria-hidden="true"
                                                    ></div>
                                                </Button>
                                            {/if}
                                            {#if onQuotePost}
                                                <Button
                                                    type="button"
                                                    class="post-preview-action-button"
                                                    ariaLabel={$_(
                                                        "replyQuote.quote_label",
                                                    )}
                                                    contentLayout="icon"
                                                    shape="circle"
                                                    onClick={() =>
                                                        handleQuotePost(post)}
                                                >
                                                    <div
                                                        class="quote-icon svg-icon"
                                                        aria-hidden="true"
                                                    ></div>
                                                </Button>
                                            {/if}
                                        </div>
                                        <div class="post-preview-footer-right">
                                            <Popover.Root
                                                open={postMenuOpenState[
                                                    post.eventId
                                                ] ?? false}
                                                onOpenChange={(open) =>
                                                    setPostMenuOpen(
                                                        post.eventId,
                                                        open,
                                                    )}
                                            >
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
                                                        ) =>
                                                            event.preventDefault()}
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
                                                                        post
                                                                            .eventId
                                                                    ] ===
                                                                    "copied"
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
                                {/if}
                            </div>
                            {#if !(onReplyPost || previewCollapse.shouldCollapsePost(post)) && (post.deletedAt || hasDeletionFailed(post))}
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

            {#if history.canLoadOlder}
                <div class="post-history-nav-row post-history-nav-row-bottom">
                    <Button
                        type="button"
                        className="post-history-nav-button"
                        onClick={() => void handleLoadOlder()}
                    >
                        {getLoadOlderLabel()}
                    </Button>
                </div>
            {:else if history.showLocalExhaustedState}
                <div class="post-history-exhausted-state">
                    <div class="post-history-exhausted-actions">
                        {#if history.canFetchOlderFromRelays || history.isFetchingOlderFromRelays}
                            <Button
                                type="button"
                                className="post-history-nav-button"
                                disabled={history.isFetchingOlderFromRelays}
                                onClick={() =>
                                    void history.fetchOlderFromRelays()}
                            >
                                {#if history.isFetchingOlderFromRelays}
                                    <LoadingPlaceholder
                                        text={$_(
                                            "postHistory.fetchOlderFromRelaysLoading",
                                        )}
                                        showLoader={true}
                                        loaderSize={20}
                                        customClass="post-history-nav-loading-placeholder"
                                    />
                                {:else}
                                    {$_("postHistory.fetchOlderFromRelays")}
                                {/if}
                            </Button>
                        {:else}
                            <p class="post-history-exhausted-message">
                                {$_("postHistory.noMorePosts")}
                            </p>
                        {/if}
                    </div>
                </div>
            {/if}
        {/if}
    </div>

    {#if history.canReturnToLatest}
        <div class="post-history-latest-row">
            <Button
                type="button"
                className="post-history-latest-button"
                onClick={() => void handleReturnToLatest()}
            >
                {$_("postHistory.returnToLatest")}
            </Button>
        </div>
    {/if}

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
        </div>
    {/snippet}
</ConfirmDialog>

<ConfirmDialog
    bind:open={localHistoryDeleteConfirmOpen}
    title={$_("postHistory.deleteLocalHistoryTitle")}
    description={$_("postHistory.deleteLocalHistoryDescription")}
    confirmLabel={$_("postHistory.deleteLocalHistoryConfirm")}
    cancelLabel={$_("postHistory.deleteLocalHistoryCancel")}
    confirmVariant="danger"
    confirmDisabled={isDeletingLocalHistory}
    onConfirm={handleLocalHistoryDeleteConfirm}
    onCancel={handleLocalHistoryDeleteCancel}
    closeOnConfirm={false}
    contentClass="post-history-local-delete-confirm"
>
    {#snippet children()}
        <div class="delete-confirm-body">
            <p class="delete-confirm-description">
                {$_("postHistory.deleteLocalHistoryDescription")}
            </p>
        </div>
    {/snippet}
</ConfirmDialog>

<ImageFullscreen
    bind:show={showImageFullscreen}
    src={fullscreenMediaItems[fullscreenIndex]?.src ?? ""}
    alt={fullscreenMediaItems[fullscreenIndex]?.alt ?? ""}
    onClose={handleFullscreenClose}
    mediaList={fullscreenMediaItems}
    currentIndex={fullscreenIndex}
    onNavigate={handleFullscreenNavigate}
/>

<style>
    :global(.post-history-dialog.dialog) {
        top: 0;
        transform: translateX(-50%);
        height: 100svh;
        max-height: 100svh;

        --btn-post-preview-action-hover: var(--svg);
    }

    :global(.post-history-dialog .dialog-content) {
        position: relative;
        flex: 1 1 auto;
        min-height: 0;
        max-height: none;
        overflow: hidden;
        padding: 0;
    }

    .post-history-heading {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        padding: 0 10px 10px;
        border-bottom: 1px solid var(--border-hr);
    }

    .post-history-heading-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        min-width: 0;
    }

    .post-history-heading-main {
        min-width: 0;
        flex: 1 1 auto;
    }

    .post-history-heading-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
    }

    .post-history-heading-summary {
        display: flex;
        width: 100%;
        color: var(--text-muted);
        font-size: 0.82rem;
        line-height: 1.35;
    }

    .post-history-summary-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        flex-wrap: wrap;
    }

    .post-history-summary-line {
        overflow-wrap: anywhere;
    }

    .post-history-summary-range {
        min-width: 0;
        flex: 1 1 auto;
    }

    .post-history-summary-count {
        flex: 0 0 auto;
        white-space: nowrap;
    }

    :global(.post-history-heading-menu-trigger) {
        min-height: 36px;
        aspect-ratio: 1;
        padding: 0;
        background: transparent;
        border-radius: 50%;
    }

    :global(.post-history-heading-menu-trigger .more-icon) {
        mask-image: url("/icons/ellipsis-vertical-solid-full.svg");
        width: 22px;
        height: 22px;
        --svg: var(--text-muted);
    }

    @media (min-width: 601px) {
        :global(.post-history-heading-menu-trigger:hover .more-icon) {
            --svg: var(--btn-post-preview-action-hover);
        }
    }

    .post-history-heading h3 {
        min-width: 0;
        margin: 0;
    }

    :global(.post-history-repair-button) {
        white-space: nowrap;
        padding: 6px 10px;
        font-size: 0.82rem;
    }

    .post-history-search-row {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 8px;
        padding: 10px 16px 0;
        border-bottom: 1px solid var(--border-hr);
    }

    .post-history-search-active {
        border-bottom-color: color-mix(
            in srgb,
            var(--theme),
            var(--border-hr) 55%
        );
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

    :global(.post-history-search-close) {
        flex: 0 0 auto;
        min-height: 40px;
        aspect-ratio: 1;
        padding: 0;
        background: transparent;
    }

    :global(.post-history-search-close .svg-icon) {
        --svg: var(--text-muted);
    }

    .post-history-search-input::placeholder {
        color: var(--text-muted);
    }

    .post-history-utility-panel {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px 16px 0;
        border-bottom: 1px solid var(--border-hr);
    }

    .post-history-utility-label {
        color: var(--text-muted);
        font-size: 0.82rem;
    }

    .post-history-utility-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
    }

    .post-history-date-input {
        min-width: 0;
        padding: 10px 12px;
        border: 1px solid var(--border-soft);
        background: var(--background);
        color: var(--text);
        font: inherit;
    }

    :global(.post-history-utility-button) {
        min-height: 40px;
        white-space: nowrap;
    }

    .post-history-nav-row {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 12px 16px;
    }

    .post-history-nav-row-top {
        padding-bottom: 4px;
    }

    .post-history-nav-row-bottom {
        padding-top: 4px;
    }

    :global(.post-history-nav-button) {
        min-height: 40px;
        white-space: nowrap;
    }

    .post-history-exhausted-state {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        padding: 12px 16px 16px;
    }

    .post-history-exhausted-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
    }

    .post-history-latest-row {
        position: absolute;
        bottom: 16px;
        right: 16px;
        display: flex;
        justify-content: flex-end;
        width: auto;
        margin: 0;
        padding: 0;
        z-index: 1;

        :global(.post-history-latest-button) {
            min-height: 40px;
            background-color: color-mix(
                in srgb,
                var(--btn-bg) 60%,
                transparent
            );
        }
    }

    .post-history-container {
        flex: 1 1 auto;
        min-height: 0;
        width: 100%;
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

    :global(.status-loading-placeholder) {
        justify-content: flex-end;
        width: auto;
        column-gap: 0;
        color: var(--text-muted);
        font-size: 0.8rem;
        line-height: 1.3;
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

    :global(.status-error) {
        color: var(--danger);
    }

    :global(.status-loading-placeholder.status-error .square) {
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
        border-bottom: 1px solid var(--border-hr-light);
        padding: 10px;
    }

    .post-history-item:last-child {
        border-bottom: none;
    }

    .post-history-item-deleted .post-meta-inline > :not(.deleted-badge),
    .post-history-item-deleted .post-preview-body,
    .post-history-item-deleted .post-preview-footer {
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

    .post-preview-header-right {
        display: flex;
        align-items: center;
        gap: 2px;
        flex-shrink: 0;
        margin-left: auto;
    }

    .post-preview-header-right > span {
        white-space: nowrap;
    }

    :global(.post-history-menu-content) {
        background: var(--dialog-bg, #fff);
        color: var(--text, #000);
        border: 1px solid var(--border, #ccc);
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
        padding: 8px;
        min-width: 180px;
        z-index: 102;
        outline: none;

        .post-history-menu-body {
            display: flex;
            flex-direction: column;
            gap: 4px;
            align-items: stretch;

            .menu-action-button-danger,
            .menu-action-button-danger:hover:not(:disabled) {
                color: var(--danger);

                :global(.svg-icon) {
                    --svg: var(--danger);
                }
            }
        }
    }

    :global(.post-history-menu-content[data-state="open"]) {
        animation: popover-in 150ms ease-out;
    }

    :global(.post-history-menu-content[data-state="closed"]) {
        animation: popover-out 100ms ease-in;
    }

    .post-history-menu-separator {
        height: 1px;
        margin: 4px 0;
        background: var(--border-hr);
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
        background: color-mix(in srgb, var(--dialog-bg), var(--border) 12%);
    }

    .menu-action-button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }

    .menu-action-button .svg-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
    }

    .menu-action-button .calendar-icon {
        mask-image: url("/icons/calendar_month_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    .menu-action-button .return-to-latest-icon {
        mask-image: url("/icons/vertical_align_top_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    .menu-action-button .jump-to-oldest-icon {
        mask-image: url("/icons/vertical_align_bottom_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
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
        display: flex;
        flex-direction: column;
        min-width: 0;
        color: var(--text);
        font-size: 1rem;
        line-height: 1.5;
        gap: 4px;
    }

    @media (max-width: 600px) {
        .post-history-utility-controls,
        .post-history-exhausted-actions {
            align-items: stretch;
        }

        .post-history-date-input,
        :global(.post-history-utility-button),
        :global(.post-history-nav-button) {
            width: 100%;
        }

        .post-history-latest-row {
            justify-content: stretch;
        }

        :global(.post-history-latest-button) {
            width: 100%;
        }
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

    .post-preview-body {
        display: flex;
        flex-direction: column;
        padding-left: 1rem;
        gap: 8px;

        .post-preview-content {
            overflow-wrap: anywhere;
            white-space: pre-wrap;
            font-size: 1rem;
            line-height: 1.5;
            word-break: break-word;
        }

        .post-preview-media {
            display: block;
        }

        .post-preview-toggle-row {
            display: flex;

            :global(
                    .post-preview-toggle-button,
                    .post-preview-toggle-button:hover
                ) {
                color: var(--text-muted);
                font-size: 0.875rem;
                font-weight: normal;
                min-height: 24px;
                padding: 0;
                background: transparent;
            }

            :global(.post-preview-toggle-button:hover) {
                text-decoration: underline;
            }
        }
    }

    .post-preview-footer {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        height: 36px;
        padding-left: 1rem;
        color: var(--text-muted);
        font-size: 0.875rem;

        .post-preview-footer-left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            min-width: 80px;
        }

        .post-preview-footer-actions {
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex: 1 0 auto;
        }

        .post-preview-date {
            white-space: nowrap;
        }

        .post-preview-footer-right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            min-width: 80px;

            :global(.menu-trigger) {
                min-height: auto;
                aspect-ratio: 1;
                background: transparent;
                border-radius: 50%;

                .more-icon {
                    mask-image: url("/icons/ellipsis-vertical-solid-full.svg");
                    width: 22px;
                    height: 22px;
                    --svg: var(--btn-post-preview-action);
                }
            }

            @media (min-width: 601px) {
                :global(.menu-trigger:hover) :global(.more-icon) {
                    --svg: var(--btn-post-preview-action-hover);
                }
            }
        }

        :global(.post-preview-action-button) {
            min-height: auto;
            background: transparent;

            :global(.svg-icon) {
                width: 24px;
                height: 24px;
                --svg: var(--btn-post-preview-action);
            }
        }

        @media (min-width: 601px) {
            :global(.post-preview-action-button:hover:not(:disabled)) {
                background: color-mix(in srgb, var(--theme) 10%, transparent);

                :global(.svg-icon) {
                    --svg: var(--theme);
                }
            }
        }
    }

    .post-meta-inline {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 6px;
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
    }

    .delete-failed {
        color: var(--danger);
    }

    .delete-confirm-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        padding: 16px;
        text-align: left;
    }

    .delete-confirm-description,
    .delete-confirm-warning {
        line-height: 1.5;
        margin: 0;
    }

    .delete-confirm-warning {
        color: var(--text-muted);
        font-size: 0.94rem;
    }

    .copy-icon {
        mask-image: url("/icons/copy-solid-full.svg");
    }

    .search-icon {
        mask-image: url("/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .repair-icon {
        mask-image: url("/icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .reply-icon {
        mask-image: url("/icons/message-regular-full.svg");
    }

    .quote-icon {
        mask-image: url("/icons/quote-right-solid-full.svg");
    }

    .trash-icon {
        mask-image: url("/icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .xmark-icon {
        mask-image: url("/icons/xmark-solid-full.svg");
        width: 20px;
        height: 20px;
    }
</style>
