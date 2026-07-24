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
        void measureCollapsiblePosts();

        return {
            destroy() {
                if (postPreviewElements[eventId] === node) {
                    delete postPreviewElements[eventId];
                }
            },
        };
    }

    async function measureCollapsiblePosts(): Promise<void> {
        await tick();

        if (!getShow()) {
            collapsiblePosts = {};
            return;
        }

        const nextCollapsiblePosts: Record<string, boolean> = {};

        for (const post of getPosts()) {
            if (post.forceCollapsible) {
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

        collapsiblePosts = nextCollapsiblePosts;
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
            void measureCollapsiblePosts();
        });
        resizeObserver.observe(historyContainer);
    }

    function disposeResizeObserver(): void {
        resizeObserver?.disconnect();
        resizeObserver = null;
    }

    function resetState(): void {
        collapsiblePosts = {};
        expandedPosts = {};
        postPreviewElements = {};
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

        getPosts();
        void measureCollapsiblePosts();
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
        isPostExpanded,
        remeasure: measureCollapsiblePosts,
        togglePostExpanded,
        shouldCollapsePost,
    };
}
