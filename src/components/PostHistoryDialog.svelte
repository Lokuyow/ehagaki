<script lang="ts">
    import type { RxNostr } from "rx-nostr";
    import { flushSync, tick } from "svelte";
    import { _, locale } from "svelte-i18n";
    import { Dialog, DropdownMenu } from "bits-ui";
    import Button from "./Button.svelte";
    import ConfirmDialog from "./ConfirmDialog.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import FloatingMessage from "./FloatingMessage.svelte";
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
        formatPostHistoryMonthLabel,
        type PostHistoryPreviewContent as PostHistoryPreviewContentData,
    } from "../lib/postHistoryDialogUtils";
    import {
        clearPostHistoryDialogScrollState,
        readPostHistoryDialogScrollState,
        writePostHistoryDialogScrollState,
        type PostHistoryDialogScrollMode,
        type PostHistoryDialogScrollState,
    } from "../lib/postHistoryDialogScrollState";
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
    import { calculateContextMenuPosition } from "../lib/utils/appUtils";

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
        getSessionScrollState: () =>
            readPostHistoryDialogScrollState({
                pubkeyHex,
                mode: "normal",
            }),
        onSessionScrollStateInvalidated: () =>
            clearAllSessionScrollAnchorsForCurrentPubkey(),
        pageSize: POST_HISTORY_PAGE_SIZE,
    });
    const channelDisplay = usePostHistoryChannelDisplay({
        getShow: () => show,
        getPosts: () => history.posts,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => relayConfig,
        getIsSearchMode: () => history.isSearchMode,
    });

    let copyState = $state<Record<string, "failed" | undefined>>({});
    let showCopyFloatingMessage = $state(false);
    let copyFloatingMessageX = $state(0);
    let copyFloatingMessageY = $state(0);
    let copyFloatingMessageTimeout: ReturnType<typeof setTimeout> | undefined;
    let currentMonthLabel = $state<string | null>(null);
    let lastCopyPointerPosition:
        | { eventId: string; x: number; y: number }
        | undefined;
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
    let searchInputElement = $state<HTMLInputElement | null>(null);
    let historyMonthLabelFrameId: number | null = null;
    let pendingSessionScrollRestore =
        $state<PostHistoryDialogScrollState | null>(null);
    let wasOpenForScrollRestore = false;
    let restoredSessionScrollKey: string | null = null;
    type HistoryScrollAnchor = {
        eventId: string;
        offsetTop: number;
    };
    const HISTORY_SCROLL_VISIBLE_EDGE_TOLERANCE_PX = 1;
    const HISTORY_MONTH_LABEL_OFFSET_PX = 12;
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
                "postHistory.repairPartialFailure" ||
            history.currentViewRefetchStatusMessageKey ===
                "postHistory.repairFetchFailed",
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
        hideCopyFloatingMessage();
        cancelCurrentMonthLabelFrame();
        currentMonthLabel = null;
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

    function getCurrentScrollMode(): PostHistoryDialogScrollMode {
        return history.isSearchMode ? "search" : "normal";
    }

    function getCurrentScrollSearchQuery(): string {
        return history.isSearchMode ? history.state.searchQuery : "";
    }

    function readCurrentSessionScrollState(): PostHistoryDialogScrollState | null {
        return readPostHistoryDialogScrollState({
            pubkeyHex,
            mode: getCurrentScrollMode(),
            searchQuery: getCurrentScrollSearchQuery(),
        });
    }

    function buildSessionScrollRestoreKey(
        state: PostHistoryDialogScrollState,
    ): string {
        return `${state.pubkeyHex}:${state.mode}:${state.searchQuery}:${state.anchor.eventId}:${state.savedAt}`;
    }

    function hasPostForScrollAnchor(
        state: PostHistoryDialogScrollState | null,
    ): state is PostHistoryDialogScrollState {
        return (
            !!state &&
            history.posts.some((post) => post.eventId === state.anchor.eventId)
        );
    }

    function saveCurrentSessionScrollAnchor(): void {
        const anchor = captureHistoryScrollAnchor();
        if (!anchor) {
            return;
        }

        writePostHistoryDialogScrollState({
            pubkeyHex,
            mode: getCurrentScrollMode(),
            searchQuery: getCurrentScrollSearchQuery(),
            anchor,
        });
    }

    function clearCurrentSessionScrollAnchor(): void {
        clearPostHistoryDialogScrollState({
            pubkeyHex,
            mode: getCurrentScrollMode(),
            searchQuery: getCurrentScrollSearchQuery(),
        });
        pendingSessionScrollRestore = null;
        restoredSessionScrollKey = null;
    }

    function clearAllSessionScrollAnchorsForCurrentPubkey(): void {
        clearPostHistoryDialogScrollState({ pubkeyHex });
        pendingSessionScrollRestore = null;
        restoredSessionScrollKey = null;
    }

    function handleClose() {
        saveCurrentSessionScrollAnchor();
        history.cancelCurrentSync();
        history.cancelCurrentViewRefetch();
        channelDisplay.cancelCurrentChannelResolution();
        deleteConfirmOpen = false;
        deleteTargetPost = null;
        localHistoryDeleteConfirmOpen = false;
        headingMenuOpen = false;
        hideCopyFloatingMessage();
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
            wasOpenForScrollRestore = false;
            pendingSessionScrollRestore = null;
            restoredSessionScrollKey = null;
            return;
        }

        if (wasOpenForScrollRestore) {
            return;
        }

        wasOpenForScrollRestore = true;
        pendingSessionScrollRestore = readCurrentSessionScrollState();
        restoredSessionScrollKey = null;
    });

    $effect(() => {
        if (!show || !hasPostForScrollAnchor(pendingSessionScrollRestore)) {
            return;
        }

        const scrollState = pendingSessionScrollRestore;
        const restoreKey = buildSessionScrollRestoreKey(scrollState);
        if (restoredSessionScrollKey === restoreKey) {
            return;
        }

        void tick().then(() => {
            if (!show || pendingSessionScrollRestore !== scrollState) {
                return;
            }

            restoreHistoryScrollAnchor(scrollState.anchor);
            restoredSessionScrollKey = restoreKey;
            pendingSessionScrollRestore = null;
        });
    });

    $effect(() => {
        if (!show) {
            currentMonthLabel = null;
            return;
        }

        historyContainer;
        history.posts;
        $locale;

        void tick().then(() => {
            if (!show) {
                return;
            }

            updateCurrentMonthLabel();
        });

        return () => {
            cancelCurrentMonthLabelFrame();
        };
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
            scheduleCurrentMonthLabelUpdate();
        }
    }

    function resetHistoryScrollToBottomPosition(): void {
        if (historyContainer) {
            historyContainer.scrollTop = historyContainer.scrollHeight;
            scheduleCurrentMonthLabelUpdate();
        }
    }

    function buildVisibleCountLabel(): string | null {
        if (history.displayTotalCount <= 0) {
            return null;
        }

        return $_(
            history.isSearchMode
                ? "postHistory.searchCountSummary"
                : "postHistory.visibleCountSummary",
            {
                values: {
                    total: history.displayTotalCount,
                },
            },
        );
    }

    function formatCurrentMonthLabel(
        postedAt: number,
        localeValue: string | null | undefined,
        now: number = Date.now(),
    ): string {
        return formatPostHistoryMonthLabel(postedAt, localeValue, now);
    }

    function findTopVisiblePostPostedAt(): number | null {
        if (!historyContainer) {
            return null;
        }

        const containerRect = historyContainer.getBoundingClientRect();
        const targetTop = containerRect.top + HISTORY_MONTH_LABEL_OFFSET_PX;
        const items = Array.from(
            historyContainer.querySelectorAll<HTMLElement>(
                "[data-post-history-event-id]",
            ),
        );
        let firstVisiblePostedAt: number | null = null;

        for (const item of items) {
            const postedAt = Number(item.dataset.postHistoryPostedAt);
            if (!Number.isFinite(postedAt)) {
                continue;
            }

            const itemRect = item.getBoundingClientRect();
            const isVisible =
                itemRect.bottom >
                    containerRect.top +
                        HISTORY_SCROLL_VISIBLE_EDGE_TOLERANCE_PX &&
                itemRect.top <
                    containerRect.bottom -
                        HISTORY_SCROLL_VISIBLE_EDGE_TOLERANCE_PX;

            if (!isVisible) {
                continue;
            }

            if (itemRect.top <= targetTop && itemRect.bottom > targetTop) {
                return postedAt;
            }

            if (firstVisiblePostedAt === null) {
                firstVisiblePostedAt = postedAt;
            }
        }

        return firstVisiblePostedAt;
    }

    function updateCurrentMonthLabel(): void {
        if (!show || history.posts.length === 0) {
            currentMonthLabel = null;
            return;
        }

        const postedAt = findTopVisiblePostPostedAt();
        currentMonthLabel =
            postedAt === null
                ? null
                : formatCurrentMonthLabel(postedAt, $locale);
    }

    function cancelCurrentMonthLabelFrame(): void {
        if (historyMonthLabelFrameId === null) {
            return;
        }

        cancelAnimationFrame(historyMonthLabelFrameId);
        historyMonthLabelFrameId = null;
    }

    function scheduleCurrentMonthLabelUpdate(): void {
        if (!show) {
            return;
        }

        cancelCurrentMonthLabelFrame();
        historyMonthLabelFrameId = requestAnimationFrame(() => {
            historyMonthLabelFrameId = null;
            updateCurrentMonthLabel();
        });
    }

    function handleHistoryScroll(): void {
        scheduleCurrentMonthLabelUpdate();
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

    function captureHistoryScrollAnchor(): HistoryScrollAnchor | null {
        if (!historyContainer) {
            return null;
        }

        const containerRect = historyContainer.getBoundingClientRect();
        const items = Array.from(
            historyContainer.querySelectorAll<HTMLElement>(
                "[data-post-history-event-id]",
            ),
        );

        for (const item of items) {
            const eventId = item.dataset.postHistoryEventId;
            if (!eventId) {
                continue;
            }

            const itemRect = item.getBoundingClientRect();
            if (
                itemRect.bottom >
                    containerRect.top +
                        HISTORY_SCROLL_VISIBLE_EDGE_TOLERANCE_PX &&
                itemRect.top <
                    containerRect.bottom -
                        HISTORY_SCROLL_VISIBLE_EDGE_TOLERANCE_PX
            ) {
                return {
                    eventId,
                    offsetTop: itemRect.top - containerRect.top,
                };
            }
        }

        return null;
    }

    function restoreHistoryScrollAnchor(
        anchor: HistoryScrollAnchor | null,
    ): void {
        if (!anchor || !show || !historyContainer) {
            return;
        }

        flushSync();

        const anchoredItem = Array.from(
            historyContainer.querySelectorAll<HTMLElement>(
                "[data-post-history-event-id]",
            ),
        ).find((item) => item.dataset.postHistoryEventId === anchor.eventId);
        if (!anchoredItem) {
            return;
        }

        const containerRect = historyContainer.getBoundingClientRect();
        const itemRect = anchoredItem.getBoundingClientRect();
        const nextOffsetTop = itemRect.top - containerRect.top;
        historyContainer.scrollTop += nextOffsetTop - anchor.offsetTop;
        scheduleCurrentMonthLabelUpdate();
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

    async function handleFetchOlderFromRelays(): Promise<void> {
        const scrollAnchor = captureHistoryScrollAnchor();
        const previousScrollTop = historyContainer?.scrollTop ?? null;
        const changed = await history.fetchOlderFromRelays();
        if (changed && previousScrollTop !== null) {
            restoreHistoryScrollAnchor(scrollAnchor);
            if (scrollAnchor === null && show && historyContainer) {
                historyContainer.scrollTop = previousScrollTop;
            }
        }
    }

    async function handleLoadNewer(): Promise<void> {
        const scrollAnchor = history.isSearchMode
            ? null
            : captureHistoryScrollAnchor();
        const changed = await history.loadNewer();
        if (changed) {
            if (history.isSearchMode) {
                resetHistoryScrollSoon();
            } else {
                restoreHistoryScrollAnchor(scrollAnchor);
            }
        }
    }

    async function handleReturnToLatest(): Promise<void> {
        clearAllSessionScrollAnchorsForCurrentPubkey();
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

        clearAllSessionScrollAnchorsForCurrentPubkey();
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

    function hasRenderablePreviewContent(
        previewContent: PostHistoryPreviewContentData,
    ): boolean {
        return previewContent.segments.some(
            (segment) =>
                segment.type === "emoji" ||
                (segment.type === "text" && segment.text.trim().length > 0),
        );
    }

    function hasRenderablePostPreviewContent(post: PostHistoryRecord): boolean {
        return hasRenderablePreviewContent(getPreviewContent(post));
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

    function hideCopyFloatingMessage(): void {
        if (copyFloatingMessageTimeout) {
            clearTimeout(copyFloatingMessageTimeout);
            copyFloatingMessageTimeout = undefined;
        }
        showCopyFloatingMessage = false;
        lastCopyPointerPosition = undefined;
    }

    function captureCopyPointerPosition(
        post: PostHistoryRecord,
        event: PointerEvent,
    ): void {
        lastCopyPointerPosition = {
            eventId: post.eventId,
            ...calculateContextMenuPosition(event.clientX, event.clientY),
        };
    }

    function getFloatingMessagePosition(
        post: PostHistoryRecord,
        event: Event,
    ): { x: number; y: number } {
        if (lastCopyPointerPosition?.eventId === post.eventId) {
            return {
                x: lastCopyPointerPosition.x,
                y: lastCopyPointerPosition.y,
            };
        }

        const target = event.currentTarget;
        const rect =
            target instanceof HTMLElement
                ? target.getBoundingClientRect()
                : null;

        return calculateContextMenuPosition(
            rect ? rect.left + rect.width / 2 : 0,
            rect ? rect.bottom + 8 : 0,
        );
    }

    function showCopySuccessMessage(x: number, y: number): void {
        if (copyFloatingMessageTimeout) {
            clearTimeout(copyFloatingMessageTimeout);
        }

        copyFloatingMessageX = x;
        copyFloatingMessageY = y;
        showCopyFloatingMessage = true;
        copyFloatingMessageTimeout = setTimeout(() => {
            showCopyFloatingMessage = false;
            copyFloatingMessageTimeout = undefined;
        }, 1800);
    }

    async function handleCopyNevent(post: PostHistoryRecord, event: Event) {
        const messagePosition = getFloatingMessagePosition(post, event);
        const nevent = buildNevent(post);
        const copied = nevent
            ? await tryCopyToClipboard(nevent, "nevent", navigator, window)
            : false;

        if (copied) {
            copyState = {
                ...copyState,
                [post.eventId]: undefined,
            };
            showCopySuccessMessage(messagePosition.x, messagePosition.y);
            return;
        }

        copyState = {
            ...copyState,
            [post.eventId]: "failed",
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

    async function focusSearchInputSoon(): Promise<void> {
        await tick();
        if (activeUtilityPanel !== "search") {
            return;
        }

        searchInputElement?.focus({ preventScroll: true });
    }

    function toggleSearch(): void {
        if (activeUtilityPanel === "search") {
            hideSearch();
            headingMenuOpen = false;
            return;
        }

        activeUtilityPanel = "search";
        headingMenuOpen = false;
        void focusSearchInputSoon();
    }

    function hideSearch(): void {
        clearCurrentSessionScrollAnchor();
        activeUtilityPanel = "none";
        history.resetSearchState();
    }

    function toggleJumpDate(): void {
        activeUtilityPanel =
            activeUtilityPanel === "jump-date" ? "none" : "jump-date";
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
        clearAllSessionScrollAnchorsForCurrentPubkey();
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
                clearAllSessionScrollAnchorsForCurrentPubkey();
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
        <div class="post-history-heading-main">
            {#if currentMonthLabel}
                <h3 class="post-history-current-month-heading">
                    <button
                        type="button"
                        class="post-history-current-month"
                        onclick={toggleJumpDate}
                    >
                        {currentMonthLabel}
                    </button>
                </h3>
            {/if}
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
                    loaderSize={30}
                    state={history.showStatusLoader ? "loading" : "complete"}
                    customClass={`status-loading-placeholder${
                        headingStatusError ? " status-error" : ""
                    }`}
                />
            {/if}
            {#if history.posts.length > 0 && buildVisibleCountLabel()}
                <div class="post-history-heading-summary">
                    <div class="post-history-summary-row">
                        <span
                            class="post-history-summary-line post-history-summary-count"
                        >
                            {buildVisibleCountLabel()}
                        </span>
                    </div>
                </div>
            {/if}
            <DropdownMenu.Root bind:open={headingMenuOpen}>
                <DropdownMenu.Trigger
                    class="menu-trigger post-history-heading-menu-trigger"
                    aria-label={$_("postHistory.openMenu")}
                >
                    <div class="more-icon svg-icon"></div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        side="bottom"
                        align="end"
                        sideOffset={8}
                        class="post-history-menu-content"
                        trapFocus={false}
                        preventScroll={false}
                        onCloseAutoFocus={(event: Event) =>
                            event.preventDefault()}
                    >
                        <div class="post-history-menu-body">
                            <DropdownMenu.Item
                                class="menu-action-button"
                                onSelect={toggleSearch}
                            >
                                <div
                                    class="search-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>{$_("postHistory.showSearch")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator
                                class="post-history-menu-separator"
                            />
                            <DropdownMenu.Item
                                class="menu-action-button"
                                disabled={!history.canReturnToLatest}
                                onSelect={handleReturnToLatestFromMenu}
                            >
                                <div
                                    class="return-to-latest-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>{$_("postHistory.returnToLatest")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                class="menu-action-button"
                                onSelect={toggleJumpDate}
                            >
                                <div
                                    class="calendar-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>{$_("postHistory.jumpToDate")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                class="menu-action-button"
                                disabled={!history.canJumpToOldest}
                                onSelect={handleJumpToOldestFromMenu}
                            >
                                <div
                                    class="jump-to-oldest-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>{$_("postHistory.jumpToOldest")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator
                                class="post-history-menu-separator"
                            />
                            <DropdownMenu.Item
                                class="menu-action-button"
                                disabled={!history.canRefetchAroundCurrentView}
                                onSelect={handleRefetchAroundCurrentViewFromMenu}
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
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                class="menu-action-button menu-action-button-danger"
                                onSelect={openLocalHistoryDeleteConfirm}
                            >
                                <div
                                    class="trash-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>
                                    {$_("postHistory.deleteLocalHistory")}
                                </span>
                            </DropdownMenu.Item>
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    </div>

    {#if activeUtilityPanel === "search"}
        <div
            class="post-history-search-row"
            class:post-history-search-active={history.isSearchMode}
        >
            <input
                bind:value={history.state.searchInput}
                bind:this={searchInputElement}
                class="post-history-search-input"
                type="search"
                placeholder={$_("postHistory.searchPlaceholder")}
                aria-label={$_("postHistory.search")}
            />
            <Button
                type="button"
                class="post-history-search-close"
                contentLayout="icon"
                shape="square"
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
                    variant="primary"
                    className="post-history-utility-button"
                    onClick={() => void handleJumpToDateSubmit()}
                >
                    {$_("postHistory.jumpToDateSubmit")}
                </Button>
                <Button
                    type="button"
                    variant="default"
                    className="post-history-utility-button"
                    onClick={() => (activeUtilityPanel = "none")}
                >
                    {$_("common.cancel")}
                </Button>
            </div>
        </div>
    {/if}

    <div
        class="post-history-container"
        bind:this={historyContainer}
        onscroll={handleHistoryScroll}
    >
        {#if history.posts.length === 0}
            <div class="empty-state">
                <div class="empty-message">
                    {history.isSearchMode
                        ? $_("postHistory.searchNoResults")
                        : $_("postHistory.empty")}
                </div>
            </div>
        {:else}
            {#if history.isSearchMode ? history.canLoadNewer : history.state.hasNewerLocal}
                <div class="post-history-nav-row post-history-nav-row-top">
                    <Button
                        type="button"
                        variant="default"
                        className="post-history-nav-button"
                        contentLayout="iconText"
                        disabled={!history.canLoadNewer}
                        onClick={() => void handleLoadNewer()}
                    >
                        <div
                            class="keyboard-arrow-up-icon svg-icon"
                            aria-hidden="true"
                        ></div>
                        {getLoadNewerLabel()}
                    </Button>
                </div>
            {/if}
            <ul class="post-history-list">
                {#each history.posts as post (post.eventId)}
                    <li
                        class="post-history-item"
                        data-post-history-event-id={post.eventId}
                        data-post-history-posted-at={post.postedAt}
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
                                                <DropdownMenu.Root
                                                    open={postMenuOpenState[
                                                        post.eventId
                                                    ] ?? false}
                                                    onOpenChange={(
                                                        open: boolean,
                                                    ) =>
                                                        setPostMenuOpen(
                                                            post.eventId,
                                                            open,
                                                        )}
                                                >
                                                    <DropdownMenu.Trigger
                                                        class="menu-trigger"
                                                        aria-label="アクションを表示"
                                                    >
                                                        <div
                                                            class="more-icon svg-icon"
                                                        ></div>
                                                    </DropdownMenu.Trigger>
                                                    <DropdownMenu.Portal>
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
                                                            <div
                                                                class="post-history-menu-body"
                                                            >
                                                                <DropdownMenu.Item
                                                                    class="menu-action-button"
                                                                    onpointerdown={(
                                                                        event,
                                                                    ) =>
                                                                        captureCopyPointerPosition(
                                                                            post,
                                                                            event,
                                                                        )}
                                                                    onSelect={(
                                                                        event,
                                                                    ) =>
                                                                        void handleCopyNevent(
                                                                            post,
                                                                            event,
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
                                                                        "failed"
                                                                            ? $_(
                                                                                  "postHistory.copyFailed",
                                                                              )
                                                                            : $_(
                                                                                  "postHistory.copyNevent",
                                                                              )}
                                                                    </span>
                                                                </DropdownMenu.Item>
                                                                {#if canDeletePost(post)}
                                                                    <DropdownMenu.Item
                                                                        class="menu-action-button menu-action-button-danger"
                                                                        disabled={isDeletionSending(
                                                                            post,
                                                                        )}
                                                                        onSelect={() =>
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
                                                                    </DropdownMenu.Item>
                                                                {/if}
                                                            </div>
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Portal>
                                                </DropdownMenu.Root>
                                            {/if}
                                        </div>
                                    </div>
                                {/if}
                                <div class="post-preview-body">
                                    {#if hasRenderablePostPreviewContent(post)}
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
                                    {/if}
                                    {#if hasRenderablePostPreviewContent(post) && previewCollapse.shouldCollapsePost(post)}
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
                                            <DropdownMenu.Root
                                                open={postMenuOpenState[
                                                    post.eventId
                                                ] ?? false}
                                                onOpenChange={(open: boolean) =>
                                                    setPostMenuOpen(
                                                        post.eventId,
                                                        open,
                                                    )}
                                            >
                                                <DropdownMenu.Trigger
                                                    class="menu-trigger"
                                                    aria-label="アクションを表示"
                                                >
                                                    <div
                                                        class="more-icon svg-icon"
                                                    ></div>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Portal>
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
                                                        <div
                                                            class="post-history-menu-body"
                                                        >
                                                            <DropdownMenu.Item
                                                                class="menu-action-button"
                                                                onpointerdown={(
                                                                    event,
                                                                ) =>
                                                                    captureCopyPointerPosition(
                                                                        post,
                                                                        event,
                                                                    )}
                                                                onSelect={(
                                                                    event,
                                                                ) =>
                                                                    void handleCopyNevent(
                                                                        post,
                                                                        event,
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
                                                                    "failed"
                                                                        ? $_(
                                                                              "postHistory.copyFailed",
                                                                          )
                                                                        : $_(
                                                                              "postHistory.copyNevent",
                                                                          )}
                                                                </span>
                                                            </DropdownMenu.Item>
                                                            {#if canDeletePost(post)}
                                                                <DropdownMenu.Item
                                                                    class="menu-action-button menu-action-button-danger"
                                                                    disabled={isDeletionSending(
                                                                        post,
                                                                    )}
                                                                    onSelect={() =>
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
                                                                </DropdownMenu.Item>
                                                            {/if}
                                                        </div>
                                                    </DropdownMenu.Content>
                                                </DropdownMenu.Portal>
                                            </DropdownMenu.Root>
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

            {#if history.isSearchMode ? history.canLoadOlder : history.state.hasOlderLocal}
                <div class="post-history-nav-row post-history-nav-row-bottom">
                    <Button
                        type="button"
                        variant="default"
                        className="post-history-nav-button"
                        contentLayout="iconText"
                        disabled={!history.canLoadOlder}
                        onClick={() => void handleLoadOlder()}
                    >
                        <div
                            class="keyboard-arrow-down-icon svg-icon"
                            aria-hidden="true"
                        ></div>
                        {getLoadOlderLabel()}
                    </Button>
                </div>
            {:else if history.showLocalExhaustedState}
                <div class="post-history-exhausted-state">
                    {#if history.canFetchOlderFromRelays || history.isFetchingFromRelays || history.isRefetchingAroundCurrentView}
                        <Button
                            type="button"
                            variant="primary"
                            className="post-history-nav-button"
                            contentLayout="iconText"
                            disabled={history.isFetchingFromRelays ||
                                history.isRefetchingAroundCurrentView}
                            onClick={() => void handleFetchOlderFromRelays()}
                        >
                            {#if history.isFetchingOlderFromRelays}
                                <LoadingPlaceholder
                                    text={$_(
                                        "postHistory.fetchOlderFromRelaysLoading",
                                    )}
                                    showLoader={true}
                                    loaderSize={28}
                                    customClass="post-history-nav-loading-placeholder"
                                />
                            {:else}
                                <div
                                    class="cloud-download-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                {$_("postHistory.fetchOlderFromRelays")}
                            {/if}
                        </Button>
                    {/if}
                </div>
            {/if}
        {/if}
    </div>

    {#if history.canReturnToLatest}
        <div class="post-history-latest-row">
            <Button
                type="button"
                variant="default"
                className="post-history-latest-button"
                contentLayout="icon"
                ariaLabel={$_("postHistory.returnToLatest")}
                onClick={() => void handleReturnToLatest()}
            >
                <div
                    class="vertical-align-top-icon svg-icon"
                    aria-hidden="true"
                ></div>
            </Button>
        </div>
    {/if}

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    className="modal-close"
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

<FloatingMessage
    show={showCopyFloatingMessage}
    x={copyFloatingMessageX}
    y={copyFloatingMessageY}
>
    <div>{$_("postHistory.copied")}</div>
</FloatingMessage>

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
        align-items: stretch;
        justify-content: space-between;
        width: 100%;
        padding: 0;
        border-bottom: 1px solid var(--border-hr);
    }

    .post-history-heading-main {
        flex: 1 1 auto;
        min-width: 0;
        align-self: stretch;
    }

    .post-history-current-month-heading {
        display: flex;
        align-items: center;
        height: 100%;
        margin: 0;
    }

    .post-history-current-month {
        color: var(--text-light);
        font-size: 1.75rem;
        line-height: 1.05;
        font-weight: 600;
        letter-spacing: -0.04em;
        overflow-wrap: anywhere;
        padding: 0 12px;
    }

    .post-history-heading-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        align-self: stretch;
        flex: 0 0 auto;
        min-width: 0;
        gap: 4px;

        :global(.post-history-heading-menu-trigger) {
            min-height: 50px;
            padding: 0;
        }

        :global(.post-history-heading-menu-trigger .more-icon) {
            mask-image: url("/icons/more_vert_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
            width: 26px;
            height: 26px;
            --svg: var(--text-muted);
        }

        @media (min-width: 601px) {
            :global(.post-history-heading-menu-trigger:hover .more-icon) {
                --svg: var(--btn-post-preview-action-hover);
            }
        }
    }

    .post-history-heading-summary {
        display: flex;
        align-items: center;
        color: var(--text-muted);
        font-size: 0.875rem;
    }

    .post-history-summary-row {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        min-width: 0;
    }

    .post-history-summary-line {
        overflow-wrap: anywhere;
    }

    .post-history-summary-count {
        flex: 0 0 auto;
        white-space: nowrap;
        text-align: right;
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
        border-bottom: 1px solid var(--border-hr);
    }

    :global(.post-history-search-close.square) {
        flex: 0 0 auto;
        min-height: 40px;
        aspect-ratio: 1;
        padding: 0;
        background: var(--btn-bg);

        :global(.svg-icon) {
            width: 28px;
            height: 28px;
        }
    }

    .post-history-search-input::placeholder {
        color: var(--text-muted);
    }

    .post-history-utility-panel {
        display: flex;
        flex-direction: column;
        padding: 6px 16px 6px;
        border-bottom: 1px solid var(--border-hr);
        gap: 2px;
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
        padding: 0 12px;
        height: 40px;
        border: 1px solid var(--border-hr);
        background: var(--background);
        color: var(--text);
        font: inherit;
    }

    :global(.post-history-utility-button) {
        height: auto;
        min-height: 40px;
        white-space: nowrap;
    }

    .post-history-nav-row {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 8px 16px;
    }

    .post-history-nav-row-top {
        padding-bottom: 0;
    }

    .post-history-nav-row-bottom {
        padding-top: 0;
    }

    :global(.post-history-nav-button:not(.primary)) {
        min-height: 50px;
        white-space: nowrap;
        gap: 4px;
    }

    .post-history-exhausted-state {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        padding: 0 16px 8px 16px;
    }

    .post-history-latest-row {
        position: absolute;
        bottom: 12px;
        right: 16px;
        display: flex;
        justify-content: flex-end;
        width: auto;
        margin: 0;
        padding: 0;
        z-index: 3;

        :global(.post-history-latest-button) {
            min-width: 50px;
            min-height: 40px;
            background-color: color-mix(
                in srgb,
                var(--btn-bg) 30%,
                transparent
            );
            backdrop-filter: blur(1px);
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
        height: auto;
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

        --post-history-menu-action-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            var(--border) 12%
        );
        --post-history-menu-action-hover-color: var(--text);
        --post-history-menu-action-danger-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            var(--danger) 12%
        );
    }

    :global(:root.light .post-history-menu-content) {
        --post-history-menu-action-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            black 6%
        );
        --post-history-menu-action-hover-color: color-mix(
            in srgb,
            var(--text),
            black 6%
        );
    }

    :global(:root.dark .post-history-menu-content) {
        --post-history-menu-action-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            white 10%
        );
        --post-history-menu-action-hover-color: color-mix(
            in srgb,
            var(--text),
            white 10%
        );
    }

    .post-history-menu-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
        align-items: stretch;
    }

    :global(.post-history-menu-content[data-state="open"]) {
        animation: popover-in 150ms ease-out;
    }

    :global(.post-history-menu-content[data-state="closed"]) {
        animation: popover-out 100ms ease-in;
    }

    :global(.post-history-menu-content .post-history-menu-separator) {
        height: 1px;
        margin: 4px 0;
        background: var(--border-hr);
    }

    :global(.post-history-menu-content .menu-action-button) {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        width: 100%;
        min-height: 40px;
        border: none;
        border-radius: 6px;
        background-color: transparent;
        color: inherit;
        text-align: left;
        padding: 10px 12px;
        font: inherit;
        cursor: pointer;
    }

    :global(.post-history-menu-content .menu-action-button-danger) {
        color: var(--danger);
        --svg: currentColor;
    }

    @media (min-width: 601px) {
        :global(
                .post-history-menu-content
                    .menu-action-button:hover:not([data-disabled])
            ),
        :global(
                .post-history-menu-content
                    .menu-action-button[data-highlighted]:not([data-disabled])
            ) {
            background-color: var(--post-history-menu-action-hover-bg);
            color: var(--post-history-menu-action-hover-color);
            --svg: currentColor;
        }

        :global(
                .post-history-menu-content
                    .menu-action-button-danger:hover:not([data-disabled])
            ),
        :global(
                .post-history-menu-content
                    .menu-action-button-danger[data-highlighted]:not(
                        [data-disabled]
                    )
            ) {
            background-color: var(--post-history-menu-action-danger-hover-bg);
            color: var(--danger);
            --svg: currentColor;
        }
    }

    :global(.post-history-menu-content .menu-action-button[data-disabled]) {
        opacity: 0.55;
        cursor: not-allowed;
    }

    :global(.post-history-menu-content .menu-action-button .svg-icon) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
    }

    :global(.post-history-menu-content .menu-action-button .calendar-icon) {
        mask-image: url("/icons/calendar_month_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(
            .post-history-menu-content
                .menu-action-button
                .return-to-latest-icon
        ) {
        mask-image: url("/icons/vertical_align_top_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(
            .post-history-menu-content .menu-action-button .jump-to-oldest-icon
        ) {
        mask-image: url("/icons/vertical_align_bottom_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(.post-history-nav-button .keyboard-arrow-up-icon) {
        mask-image: url("/icons/keyboard_arrow_up_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 28px;
        height: 28px;
    }

    :global(.post-history-nav-button .keyboard-arrow-down-icon) {
        mask-image: url("/icons/keyboard_arrow_down_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 28px;
        height: 28px;
    }

    :global(.post-history-nav-button .cloud-download-icon) {
        mask-image: url("/icons/cloud_download_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 28px;
        height: 28px;
    }

    :global(.post-history-latest-button .vertical-align-top-icon) {
        mask-image: url("/icons/vertical_align_top_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 28px;
        height: 28px;
        opacity: 0.8;
    }

    :global(.post-history-nav-loading-placeholder .loader-container .square) {
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

    @media (max-width: 500px) {
        .post-history-utility-panel {
            width: 100%;
        }

        .post-history-utility-controls {
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
        color: var(--btn-post-preview-action);

        .post-preview-footer-left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            min-width: 85px;

            .post-preview-date {
                font-size: 1rem;
                white-space: nowrap;
            }
        }

        .post-preview-footer-actions {
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex: 1 0 auto;
        }

        .post-preview-footer-right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            min-width: 85px;

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

    :global(.menu-trigger) {
        min-height: auto;
        aspect-ratio: 1;
        border-radius: 50%;
        --btn-bg: var(--dialog-bg);
        background-color: var(--btn-bg);

        .more-icon {
            mask-image: url("/icons/more_vert_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
            width: 22px;
            height: 22px;
            --svg: var(--btn-post-preview-action);
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
        gap: 0.5rem;
        margin: 10px 0 30px 0;
        margin-inline: auto;
        text-align: left;
    }

    .delete-confirm-description,
    .delete-confirm-warning {
        line-height: 1.5;
        margin: 0;
    }

    .delete-confirm-warning {
        color: var(--text-light);
        font-size: 0.875rem;
    }

    .copy-icon {
        mask-image: url("/icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .search-icon {
        mask-image: url("/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .repair-icon {
        mask-image: url("/icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .reply-icon.svg-icon {
        width: 22px;
        height: 22px;
        mask-image: url("/icons/chat_bubble_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .quote-icon.svg-icon {
        width: 28px;
        height: 28px;
        mask-image: url("/icons/format_quote_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }

    .trash-icon {
        mask-image: url("/icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .xmark-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 20px;
        height: 20px;
    }
</style>
