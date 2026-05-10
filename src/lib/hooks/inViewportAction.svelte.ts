export interface InViewportActionParams {
    enabled?: boolean;
    once?: boolean;
    root?: Element | Document | null;
    rootMargin?: string;
    threshold?: number | number[];
    onEnterView?: () => void;
}

export function inViewportAction(
    node: Element,
    initialParams: InViewportActionParams,
) {
    let params = initialParams;
    let observer: IntersectionObserver | null = null;
    let hasTriggered = false;

    function disconnect(): void {
        observer?.disconnect();
        observer = null;
    }

    function setup(nextParams: InViewportActionParams): void {
        disconnect();
        params = nextParams;

        if (
            !params.enabled ||
            !params.onEnterView ||
            typeof IntersectionObserver === "undefined" ||
            (params.once !== false && hasTriggered)
        ) {
            return;
        }

        observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) {
                    return;
                }

                params.onEnterView?.();
                if (params.once !== false) {
                    hasTriggered = true;
                    disconnect();
                }
            },
            {
                root: params.root ?? null,
                rootMargin: params.rootMargin ?? "0px",
                threshold: params.threshold ?? 0,
            },
        );

        observer.observe(node);
    }

    setup(initialParams);

    return {
        update(nextParams: InViewportActionParams) {
            setup(nextParams);
        },
        destroy() {
            disconnect();
        },
    };
}