import { flushSync, tick } from "svelte";
import { formatPostHistoryMonthLabel } from "../postHistoryDialogUtils";
import type {
    PostHistoryDialogScrollAnchor,
    PostHistoryDialogScrollMode,
    PostHistoryDialogScrollState,
} from "../postHistoryDialogScrollState";
import {
    clearPostHistoryDialogScrollState,
    readPostHistoryDialogScrollState,
    writePostHistoryDialogScrollState,
} from "../postHistoryDialogScrollState";
import type { PostHistoryRecord } from "../storage/ehagakiDb";

type ViewportPost = Pick<PostHistoryRecord, "eventId" | "postedAt">;

type ThreadScrollPositionAnchor = {
    scopeEventId: string;
    eventId: string;
    top: number;
};

interface UsePostHistoryDialogViewportParams {
    getShow: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getPosts: () => ViewportPost[];
    getLocale: () => string | null | undefined;
    getContainer: () => HTMLDivElement | null;
    getIsSearchMode: () => boolean;
    getSearchQuery: () => string;
}

const HISTORY_SCROLL_VISIBLE_EDGE_TOLERANCE_PX = 1;
const HISTORY_SCROLL_BOTTOM_TOLERANCE_PX = 2;
const HISTORY_MONTH_LABEL_OFFSET_PX = 12;

function buildSessionScrollRestoreKey(
    state: PostHistoryDialogScrollState,
): string {
    return `${state.pubkeyHex}:${state.mode}:${state.searchQuery}:${state.anchor.eventId}:${state.savedAt}`;
}

export function usePostHistoryDialogViewport({
    getShow,
    getPubkeyHex,
    getPosts,
    getLocale,
    getContainer,
    getIsSearchMode,
    getSearchQuery,
}: UsePostHistoryDialogViewportParams) {
    let currentMonthLabel = $state<string | null>(null);
    let isHistoryScrolledToTop = $state(true);
    let isHistoryScrolledToBottom = $state(true);
    let historyMonthLabelFrameId: number | null = null;
    let pendingSessionScrollRestore =
        $state<PostHistoryDialogScrollState | null>(null);
    let wasOpenForScrollRestore = false;
    let restoredSessionScrollKey: string | null = null;

    function getCurrentScrollMode(): PostHistoryDialogScrollMode {
        return getIsSearchMode() ? "search" : "normal";
    }

    function getCurrentScrollSearchQuery(): string {
        return getIsSearchMode() ? getSearchQuery() : "";
    }

    function readCurrentSessionScrollState(): PostHistoryDialogScrollState | null {
        return readPostHistoryDialogScrollState({
            pubkeyHex: getPubkeyHex(),
            mode: getCurrentScrollMode(),
            searchQuery: getCurrentScrollSearchQuery(),
        });
    }

    function hasPostForScrollAnchor(
        state: PostHistoryDialogScrollState | null,
    ): state is PostHistoryDialogScrollState {
        return (
            !!state
            && getPosts().some((post) => post.eventId === state.anchor.eventId)
        );
    }

    function saveCurrentSessionScrollAnchor(): void {
        const anchor = captureHistoryScrollAnchor();
        if (!anchor) {
            return;
        }

        writePostHistoryDialogScrollState({
            pubkeyHex: getPubkeyHex(),
            mode: getCurrentScrollMode(),
            searchQuery: getCurrentScrollSearchQuery(),
            anchor,
        });
    }

    function clearCurrentSessionScrollAnchor(): void {
        clearPostHistoryDialogScrollState({
            pubkeyHex: getPubkeyHex(),
            mode: getCurrentScrollMode(),
            searchQuery: getCurrentScrollSearchQuery(),
        });
        pendingSessionScrollRestore = null;
        restoredSessionScrollKey = null;
    }

    function clearAllSessionScrollAnchorsForCurrentPubkey(): void {
        clearPostHistoryDialogScrollState({
            pubkeyHex: getPubkeyHex(),
        });
        pendingSessionScrollRestore = null;
        restoredSessionScrollKey = null;
    }

    function resetHistoryScrollPosition(): void {
        const container = getContainer();
        if (!container) {
            return;
        }

        container.scrollTop = 0;
        updateHistoryScrolledToTop();
        updateHistoryScrolledToBottom();
        scheduleCurrentMonthLabelUpdate();
    }

    function resetHistoryScrollToBottomPosition(): void {
        const container = getContainer();
        if (!container) {
            return;
        }

        container.scrollTop = container.scrollHeight;
        updateHistoryScrolledToTop();
        updateHistoryScrolledToBottom();
        scheduleCurrentMonthLabelUpdate();
    }

    function updateHistoryScrolledToTop(): void {
        const container = getContainer();
        if (!container) {
            isHistoryScrolledToTop = true;
            return;
        }

        isHistoryScrolledToTop =
            container.scrollTop <= HISTORY_SCROLL_VISIBLE_EDGE_TOLERANCE_PX;
    }

    function updateHistoryScrolledToBottom(): void {
        const container = getContainer();
        if (!container) {
            isHistoryScrolledToBottom = true;
            return;
        }

        const remainingScroll =
            container.scrollHeight -
            container.clientHeight -
            container.scrollTop;
        isHistoryScrolledToBottom =
            remainingScroll <= HISTORY_SCROLL_BOTTOM_TOLERANCE_PX;
    }

    function findTopVisiblePostPostedAt(): number | null {
        const container = getContainer();
        if (!container) {
            return null;
        }

        const containerRect = container.getBoundingClientRect();
        const targetTop = containerRect.top + HISTORY_MONTH_LABEL_OFFSET_PX;
        const items = Array.from(
            container.querySelectorAll<HTMLElement>(
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
                        HISTORY_SCROLL_VISIBLE_EDGE_TOLERANCE_PX
                && itemRect.top <
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
        if (!getShow() || getPosts().length === 0) {
            currentMonthLabel = null;
            return;
        }

        const postedAt = findTopVisiblePostPostedAt();
        currentMonthLabel =
            postedAt === null
                ? null
                : formatPostHistoryMonthLabel(postedAt, getLocale());
    }

    function cancelCurrentMonthLabelFrame(): void {
        if (historyMonthLabelFrameId === null) {
            return;
        }

        cancelAnimationFrame(historyMonthLabelFrameId);
        historyMonthLabelFrameId = null;
    }

    function scheduleCurrentMonthLabelUpdate(): void {
        if (!getShow()) {
            return;
        }

        cancelCurrentMonthLabelFrame();
        historyMonthLabelFrameId = requestAnimationFrame(() => {
            historyMonthLabelFrameId = null;
            updateCurrentMonthLabel();
        });
    }

    function handleHistoryScroll(): void {
        updateHistoryScrolledToTop();
        updateHistoryScrolledToBottom();
        scheduleCurrentMonthLabelUpdate();
    }

    function resetHistoryScrollSoon(): void {
        void tick().then(() => {
            if (!getShow()) {
                return;
            }

            resetHistoryScrollPosition();
        });
    }

    function resetHistoryScrollToBottomSoon(): void {
        void tick().then(() => {
            if (!getShow()) {
                return;
            }

            resetHistoryScrollToBottomPosition();
        });
    }

    function captureHistoryScrollAnchor(): PostHistoryDialogScrollAnchor | null {
        const container = getContainer();
        if (!container) {
            return null;
        }

        const containerRect = container.getBoundingClientRect();
        const items = Array.from(
            container.querySelectorAll<HTMLElement>(
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
                        HISTORY_SCROLL_VISIBLE_EDGE_TOLERANCE_PX
                && itemRect.top <
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
        anchor: PostHistoryDialogScrollAnchor | null,
    ): boolean {
        const container = getContainer();
        if (!anchor || !getShow() || !container) {
            return false;
        }

        flushSync();

        const anchoredItem = Array.from(
            container.querySelectorAll<HTMLElement>(
                "[data-post-history-event-id]",
            ),
        ).find((item) => item.dataset.postHistoryEventId === anchor.eventId);
        if (!anchoredItem) {
            return false;
        }

        const containerRect = container.getBoundingClientRect();
        const itemRect = anchoredItem.getBoundingClientRect();
        const nextOffsetTop = itemRect.top - containerRect.top;
        container.scrollTop += nextOffsetTop - anchor.offsetTop;
        scheduleCurrentMonthLabelUpdate();
        return true;
    }

    function findThreadScrollAnchorElement(
        scopeEventId: string,
        eventId: string,
    ): HTMLElement | null {
        const container = getContainer();
        if (!container) {
            return null;
        }

        return (
            Array.from(
                container.querySelectorAll<HTMLElement>(
                    "[data-post-history-thread-anchor-event-id]",
                ),
            ).find(
                (item) =>
                    item.dataset.postHistoryThreadAnchorScopeId ===
                        scopeEventId
                    && item.dataset.postHistoryThreadAnchorEventId === eventId,
            ) ?? null
        );
    }

    function captureThreadScrollPositionAnchor(
        scopeEventId: string,
        eventId: string,
    ): ThreadScrollPositionAnchor | null {
        const anchoredItem = findThreadScrollAnchorElement(
            scopeEventId,
            eventId,
        );
        if (!anchoredItem) {
            return null;
        }

        return {
            scopeEventId,
            eventId,
            top: anchoredItem.getBoundingClientRect().top,
        };
    }

    function restoreThreadScrollPositionAnchor(
        anchor: ThreadScrollPositionAnchor | null,
    ): boolean {
        const container = getContainer();
        if (!anchor || !getShow() || !container) {
            return false;
        }

        flushSync();

        const anchoredItem = findThreadScrollAnchorElement(
            anchor.scopeEventId,
            anchor.eventId,
        );
        if (!anchoredItem) {
            return false;
        }

        const topDelta = anchoredItem.getBoundingClientRect().top - anchor.top;
        if (Math.abs(topDelta) < 0.5) {
            return true;
        }

        container.scrollTop += topDelta;
        scheduleCurrentMonthLabelUpdate();
        updateHistoryScrolledToTop();
        updateHistoryScrolledToBottom();
        return true;
    }

    async function preserveThreadParentToggleScroll(
        scopeEventId: string,
        eventId: string,
        action: () => void | Promise<void>,
    ): Promise<void> {
        const anchor = captureThreadScrollPositionAnchor(scopeEventId, eventId);
        const actionResult = action();

        await tick();
        restoreThreadScrollPositionAnchor(anchor);

        await actionResult;
        await tick();
        restoreThreadScrollPositionAnchor(anchor);
    }

    $effect(() => {
        if (!getShow()) {
            wasOpenForScrollRestore = false;
            pendingSessionScrollRestore = null;
            restoredSessionScrollKey = null;
            currentMonthLabel = null;
            cancelCurrentMonthLabelFrame();
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
        if (!getShow() || !hasPostForScrollAnchor(pendingSessionScrollRestore)) {
            return;
        }

        const scrollState = pendingSessionScrollRestore;
        const restoreKey = buildSessionScrollRestoreKey(scrollState);
        if (restoredSessionScrollKey === restoreKey) {
            return;
        }

        void tick().then(() => {
            if (!getShow() || pendingSessionScrollRestore !== scrollState) {
                return;
            }

            restoreHistoryScrollAnchor(scrollState.anchor);
            restoredSessionScrollKey = restoreKey;
            pendingSessionScrollRestore = null;
        });
    });

    $effect(() => {
        if (!getShow()) {
            currentMonthLabel = null;
            cancelCurrentMonthLabelFrame();
            return;
        }

        getContainer();
        getPosts();
        getLocale();

        void tick().then(() => {
            if (!getShow()) {
                return;
            }

            updateCurrentMonthLabel();
            updateHistoryScrolledToTop();
            updateHistoryScrolledToBottom();
        });

        return () => {
            cancelCurrentMonthLabelFrame();
        };
    });

    return {
        get currentMonthLabel() {
            return currentMonthLabel;
        },
        get isHistoryScrolledToTop() {
            return isHistoryScrolledToTop;
        },
        get isHistoryScrolledToBottom() {
            return isHistoryScrolledToBottom;
        },
        readCurrentSessionScrollState,
        saveCurrentSessionScrollAnchor,
        clearCurrentSessionScrollAnchor,
        clearAllSessionScrollAnchorsForCurrentPubkey,
        handleHistoryScroll,
        resetHistoryScrollSoon,
        resetHistoryScrollToBottomSoon,
        captureHistoryScrollAnchor,
        restoreHistoryScrollAnchor,
        preserveThreadParentToggleScroll,
    };
}