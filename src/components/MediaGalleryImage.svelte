<script lang="ts">
    import type { HTMLImgAttributes } from "svelte/elements";

    type Props = HTMLImgAttributes & {
        src: string;
        alt: string;
        fillWidth?: boolean;
    };

    const MAX_CROP_ZOOM = 1.5;

    let { src, alt, fillWidth = false, class: className, onload, ...imageAttributes }: Props = $props();
    let frame = $state({ width: 0, height: 0 });
    let loadedImage = $state<{ src: string; width: number; height: number }>();

    const zoom = $derived.by(() => {
        if (loadedImage?.src !== src || !loadedImage.width || !loadedImage.height || !frame.width || !frame.height) {
            return 1;
        }

        const fitWidth = frame.width / loadedImage.width;
        const fitHeight = frame.height / loadedImage.height;
        const containScale = Math.min(fitWidth, fitHeight);
        const requestedScale = loadedImage.width < loadedImage.height ? fitWidth : fitHeight;
        return Math.min(MAX_CROP_ZOOM, requestedScale / containScale);
    });

    const handleLoad: NonNullable<HTMLImgAttributes["onload"]> = (event) => {
        const image = event.currentTarget as HTMLImageElement;
        loadedImage = { src, width: image.naturalWidth, height: image.naturalHeight };
        if (typeof ResizeObserver === "undefined") {
            frame = { width: image.clientWidth, height: image.clientHeight };
        }
        onload?.(event);
    };

    function observeFrame(image: HTMLImageElement) {
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            frame = { width, height };
        });
        observer.observe(image);
        return () => observer.disconnect();
    }
</script>

<img
    {...imageAttributes}
    {src}
    {alt}
    class={[className, { "fill-width": fillWidth }]}
    {@attach observeFrame}
    onload={handleLoad}
    draggable="false"
    style:--media-gallery-image-zoom={zoom}
/>

<style>
    img {
        display: block;
        height: 100%;
        object-fit: contain;
        transform: scale(var(--media-gallery-image-zoom, 1));
    }

    .fill-width {
        width: 100%;
    }
</style>
