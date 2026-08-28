import { onDestroy, tick } from "svelte";

interface PreviewCollapseItem {
    eventId: string;
    content: string;
    forceCollapsible?: boolean;
}

interface UsePostHistoryPreviewCollapseParams<
    T extends PreviewCollapseItem,
> {
    getShow: () => boolean;
    getPosts: () => T[];
    getContainer: () => HTMLElement | null;
    maxLines?: number;
}

export function usePostHistoryPreviewCollapse<
    T extends PreviewCollapseItem,
>({
    getShow,
    getPosts,
    getContainer,
    maxLines = 5,
}: UsePostHistoryPreviewCollapseParams<T>) {
    let collapsiblePosts = $state<Record<string, boolean>>({});
    let expandedPosts = $state<Record<string, boolean>>({});
    let postPreviewElements: Record<string, HTMLElement | null> = {};
    let resizeObserver: ResizeObserver | null = null;
    let observedPostInputs = new Map<
        string,
        Pick<PreviewCollapseItem, "content" | "forceCollapsible">
    >();
    let dirtyPostEventIds = new Set<string>();
    let measureAllVisiblePreviews = false;
    let scheduledMeasurement: Promise<void> | null = null;

    function getLineHeight(element: HTMLElement): number {
        const style = getComputedStyle(element);
        const parsedLineHeight = parseFloat(style.lineHeight);
        if (!parsedLineHeight || Number.isNaN(parsedLineHeight)) {
            const parsedFontSize = parseFloat(style.fontSize);
            return parsedFontSize && !Number.isNaN(parsedFontSize)
                ? parsedFontSize * 1.5
                : 24;
        }
        return parsedLineHeight;
    }

    function previewRef(node: HTMLElement, eventId: string) {
        postPreviewElements[eventId] = node;
        void requestMeasurement(eventId);

        return {
            destroy() {
                if (postPreviewElements[eventId] === node) {
                    delete postPreviewElements[eventId];
                }
            },
        };
    }

    function replaceCollapsiblePosts(
        nextCollapsiblePosts: Record<string, boolean>,
    ): void {
        const currentEventIds = Object.keys(collapsiblePosts);
        const nextEventIds = Object.keys(nextCollapsiblePosts);
        if (
            currentEventIds.length === nextEventIds.length
            && currentEventIds.every(
                (eventId) =>
                    collapsiblePosts[eventId]
                    === nextCollapsiblePosts[eventId],
            )
        ) {
            return;
        }

        collapsiblePosts = nextCollapsiblePosts;
    }

    function measureRequestedPreviews(): void {
        if (!getShow()) {
            dirtyPostEventIds.clear();
            measureAllVisiblePreviews = false;
            replaceCollapsiblePosts({});
            return;
        }

        const posts = getPosts();
        const dirtyEventIds = dirtyPostEventIds;
        const measureAll = measureAllVisiblePreviews;
        dirtyPostEventIds = new Set();
        measureAllVisiblePreviews = false;
        const nextCollapsiblePosts: Record<string, boolean> = {};

        for (const post of posts) {
            if (post.forceCollapsible) {
                continue;
            }

            if (!measureAll && !dirtyEventIds.has(post.eventId)) {
                const existingResult = collapsiblePosts[post.eventId];
                if (existingResult !== undefined) {
                    nextCollapsiblePosts[post.eventId] = existingResult;
                }
                continue;
            }

            const previewEl = postPreviewElements[post.eventId];
            if (!previewEl) {
                continue;
            }

            const lineHeight = getLineHeight(previewEl);
            const maxHeight = lineHeight * maxLines;
            const useRenderedHeight = previewEl.scrollHeight > 0;
            nextCollapsiblePosts[post.eventId] = useRenderedHeight
                ? previewEl.scrollHeight > maxHeight + 0.5
                : post.content.split("\n").length > maxLines;
        }

        replaceCollapsiblePosts(nextCollapsiblePosts);
    }

    function scheduleMeasurement(): Promise<void> {
        if (scheduledMeasurement) {
            return scheduledMeasurement;
        }

        scheduledMeasurement = tick().then(() => {
            scheduledMeasurement = null;
            measureRequestedPreviews();
        });
        return scheduledMeasurement;
    }

    function requestMeasurement(eventId?: string): Promise<void> {
        if (eventId) {
            dirtyPostEventIds.add(eventId);
        } else {
            measureAllVisiblePreviews = true;
        }

        return scheduleMeasurement();
    }

    async function flushPendingMeasurements(): Promise<void> {
        const pendingMeasurement = scheduledMeasurement;
        if (!pendingMeasurement) {
            return;
        }

        await pendingMeasurement;
        await tick();
    }

    function setupResizeObserver(): void {
        const historyContainer = getContainer();
        if (typeof ResizeObserver === "undefined" || !historyContainer) {
            return;
        }

        if (resizeObserver) {
            return;
        }

        resizeObserver = new ResizeObserver(() => {
            void requestMeasurement();
        });
        resizeObserver.observe(historyContainer);
    }

    function disposeResizeObserver(): void {
        resizeObserver?.disconnect();
        resizeObserver = null;
    }

    function resetState(): void {
        replaceCollapsiblePosts({});
        expandedPosts = {};
        postPreviewElements = {};
        observedPostInputs.clear();
        dirtyPostEventIds.clear();
        measureAllVisiblePreviews = false;
        disposeResizeObserver();
    }

    function isPostExpanded(post: T): boolean {
        return expandedPosts[post.eventId] ?? false;
    }

    function togglePostExpanded(eventId: string): void {
        expandedPosts = {
            ...expandedPosts,
            [eventId]: !expandedPosts[eventId],
        };
    }

    function shouldCollapsePost(post: T): boolean {
        return post.forceCollapsible === true
            || (collapsiblePosts[post.eventId] ?? false);
    }

    $effect(() => {
        if (getShow()) {
            return;
        }

        resetState();
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        const posts = getPosts();
        const nextObservedPostInputs = new Map<
            string,
            Pick<PreviewCollapseItem, "content" | "forceCollapsible">
        >();
        for (const post of posts) {
            const nextInput = {
                content: post.content,
                forceCollapsible: post.forceCollapsible,
            };
            const previousInput = observedPostInputs.get(post.eventId);
            if (
                previousInput?.content !== nextInput.content
                || previousInput.forceCollapsible !== nextInput.forceCollapsible
            ) {
                dirtyPostEventIds.add(post.eventId);
            }
            nextObservedPostInputs.set(post.eventId, nextInput);
        }
        observedPostInputs = nextObservedPostInputs;

        void scheduleMeasurement();
    });

    $effect(() => {
        if (!getShow() || !getContainer()) {
            return;
        }

        setupResizeObserver();
        return () => {
            disposeResizeObserver();
        };
    });

    onDestroy(() => {
        disposeResizeObserver();
    });

    return {
        previewRef,
        flushPendingMeasurements,
        isPostExpanded,
        remeasure: () => requestMeasurement(),
        togglePostExpanded,
        shouldCollapsePost,
    };
}
