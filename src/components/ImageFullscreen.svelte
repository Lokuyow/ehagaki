<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import PhotoSwipe from "photoswipe";
    import { _ } from "svelte-i18n";
    import type { FullscreenMediaItem } from "../lib/types";
    import {
        buildFullscreenViewerDataSource,
        createFullscreenVideoSlideElement,
        pauseFullscreenVideoContent,
    } from "../lib/utils/fullscreenViewerUtils";

    interface Props {
        src?: string;
        alt?: string;
        show?: boolean;
        onClose?: () => void;
        mediaList?: FullscreenMediaItem[];
        currentIndex?: number;
        onNavigate?: (index: number) => void;
    }

    type CloseMode = "history" | "internal" | null;

    const VIEWER_PADDING = { top: 24, bottom: 88, left: 24, right: 24 };

    let {
        src = "",
        alt = "",
        show = $bindable(false),
        onClose = () => {},
        mediaList = [],
        currentIndex = -1,
        onNavigate = undefined,
    }: Props = $props();

    let activePhotoSwipe: any = null;
    let historyPushed = false;
    let closeMode: CloseMode = null;
    let openRequestToken = 0;

    let resolvedMediaList = $derived.by<FullscreenMediaItem[]>(() => {
        if (mediaList.length > 0) {
            return mediaList;
        }

        if (!src) {
            return [];
        }

        return [{ src, alt, type: "image" }];
    });

    let normalizedIndex = $derived.by(() => {
        if (resolvedMediaList.length === 0) {
            return -1;
        }

        if (currentIndex >= 0 && currentIndex < resolvedMediaList.length) {
            return currentIndex;
        }

        return 0;
    });

    function finalizeClose(shouldGoBack: boolean) {
        const shouldPopHistory = shouldGoBack && historyPushed;

        historyPushed = false;
        activePhotoSwipe = null;

        if (show) {
            show = false;
        }

        onClose();

        if (shouldPopHistory) {
            history.back();
        }
    }

    function requestClose(shouldGoBack: boolean) {
        if (closeMode) {
            return;
        }

        closeMode = shouldGoBack ? "history" : "internal";

        if (activePhotoSwipe) {
            activePhotoSwipe.close();
            return;
        }

        const shouldPopHistory = closeMode === "history";
        closeMode = null;
        finalizeClose(shouldPopHistory);
    }

    function bindCustomContentEvents(instance: any) {
        instance.on("contentLoad", (event: any) => {
            if (event.content?.data?.type !== "video") {
                return;
            }

            event.preventDefault();
            event.content.element = createFullscreenVideoSlideElement(
                event.content.data,
            );
        });

        instance.on("contentAppend", (event: any) => {
            if (event.content?.data?.type !== "video") {
                return;
            }

            if (event.content.element && !event.content.element.parentNode) {
                event.preventDefault();
                event.content.slide.container.appendChild(
                    event.content.element,
                );
            }
        });

        instance.on("contentRemove", (event: any) => {
            if (event.content?.data?.type !== "video") {
                return;
            }

            pauseFullscreenVideoContent(event.content);

            if (event.content.element?.parentNode) {
                event.preventDefault();
                event.content.element.remove();
            }
        });

        instance.on("contentDeactivate", (event: any) => {
            if (event.content?.data?.type !== "video") {
                return;
            }

            pauseFullscreenVideoContent(event.content);
        });

        instance.on("contentDestroy", (event: any) => {
            if (event.content?.data?.type !== "video") {
                return;
            }

            pauseFullscreenVideoContent(event.content);
        });
    }

    async function openViewer(
        items: FullscreenMediaItem[],
        targetIndex: number,
        requestToken: number,
    ) {
        const dataSource = await buildFullscreenViewerDataSource(items);

        if (
            requestToken !== openRequestToken ||
            !show ||
            activePhotoSwipe ||
            targetIndex < 0
        ) {
            return;
        }

        const instance = new PhotoSwipe({
            dataSource,
            index: targetIndex,
            appendToEl: document.body,
            mainClass: "ehagaki-pswp",
            showHideAnimationType: "none",
            loop: false,
            wheelToZoom: true,
            closeTitle: $_("global.close") ?? "Close",
            arrowPrevTitle: $_("fullscreenViewer.previous") ?? "Previous media",
            arrowNextTitle: $_("fullscreenViewer.next") ?? "Next media",
            errorMsg:
                $_("fullscreenViewer.error") ?? "The media cannot be loaded",
            bgOpacity: 1,
            spacing: 0.08,
            padding: VIEWER_PADDING,
            escKey: true,
            arrowKeys: true,
            returnFocus: true,
        });

        bindCustomContentEvents(instance);

        instance.on("change", () => {
            const nextIndex = instance.currIndex ?? 0;
            if (nextIndex !== currentIndex) {
                onNavigate?.(nextIndex);
            }
        });

        instance.on("destroy", () => {
            const shouldGoBack = closeMode === "history";
            closeMode = null;
            finalizeClose(shouldGoBack);
        });

        activePhotoSwipe = instance;
        instance.init();
    }

    function handlePopState(event: PopStateEvent) {
        if (!show || !historyPushed) {
            return;
        }

        event.preventDefault();
        historyPushed = false;
        requestClose(false);
    }

    $effect(() => {
        if (
            show &&
            normalizedIndex >= 0 &&
            resolvedMediaList.length > 0 &&
            !historyPushed
        ) {
            history.pushState({ imageFullscreen: true }, "");
            historyPushed = true;
        }
    });

    $effect(() => {
        const items = resolvedMediaList;
        const targetIndex = normalizedIndex;
        const isVisible = show;

        const requestToken = ++openRequestToken;

        if (!isVisible || items.length === 0 || targetIndex < 0) {
            if (activePhotoSwipe) {
                requestClose(false);
            }
            return;
        }

        if (activePhotoSwipe) {
            if (activePhotoSwipe.currIndex !== targetIndex) {
                activePhotoSwipe.goTo(targetIndex);
            }
            return;
        }

        void openViewer(items, targetIndex, requestToken);
    });

    onMount(() => {
        window.addEventListener("popstate", handlePopState);

        if (
            show &&
            normalizedIndex >= 0 &&
            resolvedMediaList.length > 0 &&
            !activePhotoSwipe
        ) {
            const requestToken = ++openRequestToken;
            void openViewer(resolvedMediaList, normalizedIndex, requestToken);
        }

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    });

    onDestroy(() => {
        closeMode = null;
        historyPushed = false;
        activePhotoSwipe?.destroy?.();
        activePhotoSwipe = null;
    });
</script>

<div class="image-fullscreen-host" aria-hidden="true"></div>

<style>
    .image-fullscreen-host {
        display: none;
    }

    :global(.ehagaki-pswp) {
        --pswp-bg: #000;
    }

    :global(.ehagaki-pswp .pswp__bg) {
        background: #000;
    }

    :global(.ehagaki-pswp .pswp__button) {
        opacity: 0.9;
    }

    :global(.ehagaki-pswp .pswp__counter) {
        font-size: 0.95rem;
    }

    :global(.ehagaki-pswp-video-container) {
        position: relative;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        pointer-events: none;
    }

    :global(.ehagaki-pswp-video) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        display: block;
        object-fit: contain;
        background: #000;
        pointer-events: auto;
    }
</style>
