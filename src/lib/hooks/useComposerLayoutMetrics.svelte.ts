import { resolveComposerAvailableHeight, resolveComposerSiblingHeight } from "../utils/composerLayoutUtils";
import type { ReplyQuoteComposerState } from "../types";

interface UseComposerLayoutMetricsParams {
    setupViewportListener(): (() => void) | undefined;
    getComposerScrollRegionEl(): HTMLDivElement | null;
    getComposerScrollContentEl(): HTMLDivElement | null;
    getCustomEmojiPickerRegionEl(): HTMLDivElement | null;
    getCustomEmojiPickerOpen(): boolean;
    getReplyQuoteState(): ReplyQuoteComposerState;
    minHeight: number;
}

export function useComposerLayoutMetrics({
    setupViewportListener,
    getComposerScrollRegionEl,
    getComposerScrollContentEl,
    getCustomEmojiPickerRegionEl,
    getCustomEmojiPickerOpen,
    getReplyQuoteState,
    minHeight,
}: UseComposerLayoutMetricsParams) {
    let composerAvailableHeight = $state(minHeight);
    let customEmojiPickerHeight = $state(0);

    $effect(() => {
        const cleanup = setupViewportListener();
        return cleanup;
    });

    function syncComposerAvailableHeight(): void {
        const composerScrollRegionEl = getComposerScrollRegionEl();
        const composerScrollContentEl = getComposerScrollContentEl();
        if (!composerScrollRegionEl || !composerScrollContentEl) {
            composerAvailableHeight = minHeight;
            return;
        }

        const postBlock = composerScrollContentEl.querySelector(
            '[data-composer-block="post"]',
        );

        if (!(postBlock instanceof HTMLElement)) {
            composerAvailableHeight = minHeight;
            return;
        }

        const siblingHeight = resolveComposerSiblingHeight(
            composerScrollContentEl,
            postBlock,
        );
        const nextHeight = resolveComposerAvailableHeight({
            composerViewportHeight: composerScrollRegionEl.clientHeight,
            siblingHeight,
            minHeight,
        });

        if (composerAvailableHeight !== nextHeight) {
            composerAvailableHeight = nextHeight;
        }
    }

    $effect(() => {
        const replyQuoteState = getReplyQuoteState();
        replyQuoteState.reply;
        replyQuoteState.quotes.length;
        getComposerScrollRegionEl();
        getComposerScrollContentEl();

        if (typeof window === "undefined") {
            composerAvailableHeight = minHeight;
            return;
        }

        const rafId = window.requestAnimationFrame(() => {
            syncComposerAvailableHeight();
        });

        return () => {
            window.cancelAnimationFrame(rafId);
        };
    });

    $effect(() => {
        const replyQuoteState = getReplyQuoteState();
        replyQuoteState.reply;
        replyQuoteState.quotes.length;
        const composerScrollRegionEl = getComposerScrollRegionEl();
        const composerScrollContentEl = getComposerScrollContentEl();

        if (
            !composerScrollRegionEl
            || !composerScrollContentEl
            || typeof ResizeObserver === "undefined"
        ) {
            return;
        }

        syncComposerAvailableHeight();

        const resizeObserver = new ResizeObserver(() => {
            syncComposerAvailableHeight();
        });

        resizeObserver.observe(composerScrollRegionEl);
        resizeObserver.observe(composerScrollContentEl);

        for (const child of Array.from(composerScrollContentEl.children)) {
            resizeObserver.observe(child);
        }

        return () => {
            resizeObserver.disconnect();
        };
    });

    $effect(() => {
        const isCustomEmojiPickerOpen = getCustomEmojiPickerOpen();
        const customEmojiPickerRegionEl = getCustomEmojiPickerRegionEl();

        if (!isCustomEmojiPickerOpen) {
            customEmojiPickerHeight = 0;
            return;
        }

        if (!customEmojiPickerRegionEl || typeof ResizeObserver === "undefined") {
            customEmojiPickerHeight = 0;
            return;
        }

        const syncCustomEmojiPickerHeight = () => {
            customEmojiPickerHeight = Math.ceil(
                customEmojiPickerRegionEl?.getBoundingClientRect().height ?? 0,
            );
        };

        syncCustomEmojiPickerHeight();

        const resizeObserver = new ResizeObserver(() => {
            syncCustomEmojiPickerHeight();
        });

        resizeObserver.observe(customEmojiPickerRegionEl);

        return () => {
            resizeObserver.disconnect();
        };
    });

    return {
        get composerAvailableHeight() {
            return composerAvailableHeight;
        },
        get customEmojiPickerHeight() {
            return customEmojiPickerHeight;
        },
    };
}
