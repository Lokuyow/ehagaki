/**
 * Track the post history scroll root's height for auto-loading. The first
 * measurement of a root only sets the height; later changes also bump
 * `resizeGeneration`, so observers can tell a resize from a new root.
 */
export function usePostHistoryAutoLoadRootHeight(options: {
    getRoot: () => HTMLElement | null;
}) {
    let height = $state<number | null>(null);
    let resizeGeneration = $state(0);
    let rootForHeight: HTMLElement | null = null;
    let observedHeight: number | null = null;
    let nextResizeGeneration = 0;

    $effect(() => {
        const root = options.getRoot();
        if (!root) {
            rootForHeight = null;
            observedHeight = null;
            height = null;
            return;
        }

        const syncHeight = () => {
            const nextHeight = Math.max(0, root.clientHeight);
            if (rootForHeight !== root) {
                rootForHeight = root;
                observedHeight = nextHeight;
                height = nextHeight;
                return;
            }

            if (observedHeight === nextHeight) {
                return;
            }

            observedHeight = nextHeight;
            height = nextHeight;
            nextResizeGeneration += 1;
            resizeGeneration = nextResizeGeneration;
        };

        syncHeight();
        if (typeof ResizeObserver === "undefined") {
            return;
        }

        const resizeObserver = new ResizeObserver(syncHeight);
        resizeObserver.observe(root);

        return () => {
            resizeObserver.disconnect();
            if (rootForHeight === root) {
                rootForHeight = null;
                observedHeight = null;
                height = null;
            }
        };
    });

    return {
        get height() {
            return height;
        },
        get resizeGeneration() {
            return resizeGeneration;
        },
    };
}
