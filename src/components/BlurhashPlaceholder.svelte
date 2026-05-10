<script lang="ts">
    import { decode } from "blurhash";

    interface Props {
        blurhash?: string;
        className?: string;
    }

    const BLURHASH_RENDER_SIZE = 32;
    const blurhashDataUrlCache = new Map<
        string,
        Promise<string | null> | string | null
    >();

    let { blurhash = undefined, className = "" }: Props = $props();

    let previewDataUrl = $state<string | null>(null);

    const backgroundStyle = $derived.by(() =>
        previewDataUrl
            ? `--blurhash-placeholder-image: url("${previewDataUrl}");`
            : "",
    );

    async function resolveBlurhashDataUrl(
        hash: string,
    ): Promise<string | null> {
        const normalizedHash = hash.trim();
        if (!normalizedHash || typeof document === "undefined") {
            return null;
        }

        const cached = blurhashDataUrlCache.get(normalizedHash);
        if (cached instanceof Promise) {
            return cached;
        }

        if (typeof cached === "string" || cached === null) {
            return cached;
        }

        const pending = Promise.resolve()
            .then(() => {
                const canvas = document.createElement("canvas");
                canvas.width = BLURHASH_RENDER_SIZE;
                canvas.height = BLURHASH_RENDER_SIZE;
                const context = canvas.getContext("2d");
                if (!context) {
                    return null;
                }

                const imageData = context.createImageData(
                    BLURHASH_RENDER_SIZE,
                    BLURHASH_RENDER_SIZE,
                );
                imageData.data.set(
                    decode(
                        normalizedHash,
                        BLURHASH_RENDER_SIZE,
                        BLURHASH_RENDER_SIZE,
                    ),
                );
                context.putImageData(imageData, 0, 0);
                return canvas.toDataURL("image/png");
            })
            .catch(() => null)
            .then((dataUrl) => {
                blurhashDataUrlCache.set(normalizedHash, dataUrl);
                return dataUrl;
            });

        blurhashDataUrlCache.set(normalizedHash, pending);
        return pending;
    }

    $effect(() => {
        let isActive = true;
        const nextBlurhash = blurhash?.trim();

        previewDataUrl = null;

        if (!nextBlurhash) {
            return;
        }

        void resolveBlurhashDataUrl(nextBlurhash).then((dataUrl) => {
            if (!isActive) {
                return;
            }

            previewDataUrl = dataUrl;
        });

        return () => {
            isActive = false;
        };
    });
</script>

<div
    class={`blurhash-placeholder ${className}`.trim()}
    class:blurhash-placeholder-ready={Boolean(previewDataUrl)}
    style={backgroundStyle}
    aria-hidden="true"
></div>

<style>
    .blurhash-placeholder {
        position: absolute;
        inset: 0;
        z-index: 0;
        border-radius: inherit;
        overflow: hidden;
        background: radial-gradient(
                circle at top left,
                rgba(255, 255, 255, 0.2),
                transparent 48%
            ),
            linear-gradient(
                135deg,
                color-mix(in srgb, var(--background-color, #fff) 24%, #000 76%),
                color-mix(in srgb, var(--background-color, #fff) 8%, #000 92%)
            );
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .blurhash-placeholder-ready {
        background-image: var(--blurhash-placeholder-image);
        transform: scale(1.03);
    }

    .blurhash-placeholder::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.08),
            rgba(0, 0, 0, 0.28)
        );
    }

    :global(:root.dark) .blurhash-placeholder::after {
        background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.14),
            rgba(0, 0, 0, 0.38)
        );
    }
</style>
